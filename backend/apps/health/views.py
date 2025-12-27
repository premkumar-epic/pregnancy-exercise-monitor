"""
Health Vitals API Views
Endpoints for simulated wearable health data
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User

from exercise.models import HealthVitals, PregnancyProfile
from apps.health.serializers import HealthVitalsSerializer
from apps.health.simulator import HealthDataSimulator


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_health_vitals(request):
    """
    Get current health vitals for the authenticated user
    Generates new simulated data on each request
    """
    try:
        # Get user's pregnancy week for realistic simulation
        pregnancy_week = 20  # Default
        try:
            profile = PregnancyProfile.objects.get(user=request.user)
            pregnancy_week = profile.current_week
        except PregnancyProfile.DoesNotExist:
            pass
        
        # Check if user is currently exercising (from query param)
        is_exercising = request.query_params.get('exercising', 'false').lower() == 'true'
        
        # Generate vitals
        vitals_data = HealthDataSimulator.generate_vitals(
            pregnancy_week=pregnancy_week,
            is_exercising=is_exercising,
            time_of_day=HealthDataSimulator.get_current_time_of_day()
        )
        
        # Optionally save to database for history
        if request.query_params.get('save', 'false').lower() == 'true':
            HealthVitals.objects.create(
                user=request.user,
                **{k: v for k, v in vitals_data.items() if k not in ['pregnancy_week', 'trimester']}
            )
        
        return Response(vitals_data)
    
    except Exception as e:
        return Response(
            {'error': f'Failed to generate vitals: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def health_vitals_history(request):
    """
    Get health vitals history for the authenticated user
    Returns last 24 hours of data
    """
    try:
        # Get saved vitals from database
        vitals = HealthVitals.objects.filter(user=request.user)[:24]
        serializer = HealthVitalsSerializer(vitals, many=True)
        
        return Response({
            'count': len(serializer.data),
            'vitals': serializer.data
        })
    
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch history: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def check_exercise_safety(request):
    """
    Check exercise safety based on posture score and current health vitals
    Combines exercise metrics with health data for safety alerts
    """
    try:
        # Get current posture score from request
        posture_score = request.data.get('posture_score', 100)
        current_reps = request.data.get('current_reps', 0)
        
        # Get or generate current vitals
        pregnancy_week = 20
        try:
            profile = PregnancyProfile.objects.get(user=request.user)
            pregnancy_week = profile.current_week
        except PregnancyProfile.DoesNotExist:
            pass
        
        vitals = HealthDataSimulator.generate_vitals(
            pregnancy_week=pregnancy_week,
            is_exercising=True
        )
        
        # Import safety fusion engine
        from .safety_fusion import SafetyFusionEngine
        
        # Analyze safety
        safety_analysis = SafetyFusionEngine.analyze_safety(
            posture_score=posture_score,
            vitals=vitals,
            current_reps=current_reps
        )
        
        # Add current vitals to response
        safety_analysis['current_vitals'] = vitals
        
        return Response(safety_analysis)
    
    except Exception as e:
        return Response(
            {'error': f'Safety check failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def health_dashboard_summary(request):
    """
    Get comprehensive health summary for dashboard
    Includes current vitals, trends, and recommendations
    """
    try:
        # Get pregnancy info
        pregnancy_week = 20
        trimester = 2
        try:
            profile = PregnancyProfile.objects.get(user=request.user)
            pregnancy_week = profile.current_week
            trimester = profile.trimester
        except PregnancyProfile.DoesNotExist:
            pass
        
        # Generate current vitals
        current_vitals = HealthDataSimulator.generate_vitals(
            pregnancy_week=pregnancy_week,
            time_of_day=HealthDataSimulator.get_current_time_of_day()
        )
        
        # Get recent history for trends
        recent_vitals = HealthVitals.objects.filter(user=request.user)[:7]
        
        # Calculate trends
        if recent_vitals.exists():
            avg_hr = sum(v.heart_rate for v in recent_vitals) / len(recent_vitals)
            avg_spo2 = sum(v.spo2 for v in recent_vitals) / len(recent_vitals)
            avg_energy = sum(v.energy_level for v in recent_vitals) / len(recent_vitals)
        else:
            avg_hr = current_vitals['heart_rate']
            avg_spo2 = current_vitals['spo2']
            avg_energy = 100 - current_vitals['fatigue_level']
        
        return Response({
            'current_vitals': current_vitals,
            'trends': {
                'avg_heart_rate_7d': round(avg_hr, 1),
                'avg_spo2_7d': round(avg_spo2, 1),
                'avg_energy_7d': round(avg_energy, 1)
            },
            'pregnancy_context': {
                'week': pregnancy_week,
                'trimester': trimester
            },
            'recommendations': _get_health_recommendations(current_vitals, pregnancy_week)
        })
    
    except Exception as e:
        return Response(
            {'error': f'Failed to generate summary: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


def _get_health_recommendations(vitals: dict, pregnancy_week: int) -> list:
    """Generate health recommendations based on vitals"""
    recommendations = []
    
    if vitals['stress_level'] == 'high':
        recommendations.append({
            'type': 'stress',
            'message': 'Your stress level is elevated',
            'action': 'Try gentle breathing exercises or prenatal yoga'
        })
    
    if vitals['fatigue_level'] > 70:
        recommendations.append({
            'type': 'fatigue',
            'message': 'High fatigue detected',
            'action': 'Ensure adequate rest and stay hydrated'
        })
    
    if vitals['daily_active_minutes'] < 20:
        recommendations.append({
            'type': 'activity',
            'message': 'Low activity today',
            'action': 'Try a gentle 15-minute walk if feeling well'
        })
    
    if vitals['heart_rate'] > 100 and not vitals.get('is_exercising'):
        recommendations.append({
            'type': 'heart_rate',
            'message': 'Elevated resting heart rate',
            'action': 'Rest and monitor. Consult doctor if persistent'
        })
    
    # Positive feedback
    if (vitals['stress_level'] == 'low' and 
        vitals['fatigue_level'] < 50 and 
        vitals['spo2'] >= 97):
        recommendations.append({
            'type': 'positive',
            'message': 'Great job! All vitals look excellent',
            'action': 'Keep up the healthy routine'
        })
    
    return recommendations
