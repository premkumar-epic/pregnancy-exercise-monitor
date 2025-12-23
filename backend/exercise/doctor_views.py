"""
Doctor/Physiotherapist Views
Read-only patient monitoring endpoints for medical professionals
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.db.models import Avg, Count, Max

from .models import UserProfile, ExerciseSession, HealthVitals, ActivityData, PregnancyProfile
from .serializers import HealthVitalsSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def doctor_patient_list(request):
    """
    List all patients with summary statistics (doctor/physio only)
    """
    try:
        # Check if user is doctor
        try:
            profile = UserProfile.objects.get(user=request.user)
            if profile.role != 'doctor':
                return Response(
                    {'error': 'Doctor/Physiotherapist access required'},
                    status=status.HTTP_403_FORBIDDEN
                )
        except UserProfile.DoesNotExist:
            return Response(
                {'error': 'User profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Get all patients
        patients = User.objects.filter(profile__role='patient')
        
        patient_data = []
        for patient in patients:
            # Get exercise statistics
            sessions = ExerciseSession.objects.filter(user=patient)
            total_sessions = sessions.count()
            avg_posture = sessions.aggregate(Avg('avg_posture_score'))['avg_posture_score__avg'] or 0
            total_reps = sum(s.rep_count for s in sessions)
            
            # Get latest health vitals
            latest_vitals = HealthVitals.objects.filter(user=patient).first()
            
            # Get pregnancy info
            pregnancy_week = None
            trimester = None
            try:
                pregnancy_profile = PregnancyProfile.objects.get(user=patient)
                pregnancy_week = pregnancy_profile.current_week
                trimester = pregnancy_profile.trimester
            except PregnancyProfile.DoesNotExist:
                pass
            
            # Get activity data count
            activity_count = ActivityData.objects.filter(user=patient).count()
            
            # Get last activity date
            last_session = sessions.order_by('-end_time').first()
            last_active = last_session.end_time if last_session else patient.last_login
            
            patient_data.append({
                'id': patient.id,
                'username': patient.username,
                'email': patient.email,
                'date_joined': patient.date_joined,
                'last_active': last_active,
                'pregnancy_week': pregnancy_week,
                'trimester': trimester,
                'statistics': {
                    'total_sessions': total_sessions,
                    'total_reps': total_reps,
                    'avg_posture_score': round(avg_posture, 1),
                    'activity_uploads': activity_count
                },
                'latest_vitals': {
                    'heart_rate': latest_vitals.heart_rate if latest_vitals else None,
                    'spo2': latest_vitals.spo2 if latest_vitals else None,
                    'stress_level': latest_vitals.stress_level if latest_vitals else None,
                    'energy_level': latest_vitals.energy_level if latest_vitals else None,
                    'timestamp': latest_vitals.timestamp if latest_vitals else None
                } if latest_vitals else None
            })
        
        return Response({
            'count': len(patient_data),
            'patients': patient_data
        })
    
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch patient list: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def doctor_patient_detail(request, patient_id):
    """
    Get detailed information about a specific patient (doctor/physio only)
    """
    try:
        # Check if user is doctor
        try:
            profile = UserProfile.objects.get(user=request.user)
            if profile.role != 'doctor':
                return Response(
                    {'error': 'Doctor/Physiotherapist access required'},
                    status=status.HTTP_403_FORBIDDEN
                )
        except UserProfile.DoesNotExist:
            return Response(
                {'error': 'User profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Get patient
        try:
            patient = User.objects.get(id=patient_id, profile__role='patient')
        except User.DoesNotExist:
            return Response(
                {'error': 'Patient not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Patient basic info
        patient_info = {
            'id': patient.id,
            'username': patient.username,
            'email': patient.email,
            'date_joined': patient.date_joined,
            'last_login': patient.last_login
        }
        
        # Pregnancy profile
        pregnancy_info = None
        try:
            pregnancy_profile = PregnancyProfile.objects.get(user=patient)
            pregnancy_info = {
                'lmp_date': pregnancy_profile.lmp_date,
                'current_week': pregnancy_profile.current_week,
                'trimester': pregnancy_profile.trimester,
                'due_date': pregnancy_profile.due_date,
                'weeks_remaining': pregnancy_profile.weeks_remaining
            }
        except PregnancyProfile.DoesNotExist:
            pass
        
        # Recent exercise sessions (last 10)
        sessions = ExerciseSession.objects.filter(user=patient).order_by('-end_time')[:10]
        session_data = [{
            'id': s.id,
            'exercise_name': s.exercise.name,
            'rep_count': s.rep_count,
            'avg_posture_score': s.avg_posture_score,
            'posture_warnings': s.posture_warnings,
            'start_time': s.start_time,
            'end_time': s.end_time,
            'duration_minutes': (s.end_time - s.start_time).total_seconds() / 60 if s.end_time else None
        } for s in sessions]
        
        # Health vitals history (last 20)
        vitals = HealthVitals.objects.filter(user=patient)[:20]
        vitals_serializer = HealthVitalsSerializer(vitals, many=True)
        
        # Activity data summary
        activities = ActivityData.objects.filter(user=patient).order_by('-date')[:7]
        activity_data = [{
            'date': a.date,
            'steps': a.steps,
            'avg_heart_rate': a.avg_heart_rate,
            'calories': a.calories,
            'sleep_minutes': a.sleep_minutes
        } for a in activities]
        
        # Calculate trends
        all_sessions = ExerciseSession.objects.filter(user=patient)
        posture_trend = []
        if all_sessions.exists():
            # Group by date and calculate average
            from django.db.models.functions import TruncDate
            daily_posture = all_sessions.annotate(
                date=TruncDate('end_time')
            ).values('date').annotate(
                avg_score=Avg('avg_posture_score')
            ).order_by('-date')[:14]
            
            posture_trend = [{
                'date': item['date'],
                'avg_posture_score': round(item['avg_score'], 1)
            } for item in daily_posture]
        
        return Response({
            'patient_info': patient_info,
            'pregnancy_info': pregnancy_info,
            'recent_sessions': session_data,
            'health_vitals': vitals_serializer.data,
            'recent_activity': activity_data,
            'trends': {
                'posture_over_time': posture_trend
            },
            'summary': {
                'total_sessions': all_sessions.count(),
                'total_reps': sum(s.rep_count for s in all_sessions),
                'avg_posture_score': round(all_sessions.aggregate(Avg('avg_posture_score'))['avg_posture_score__avg'] or 0, 1),
                'total_activity_days': ActivityData.objects.filter(user=patient).count()
            }
        })
    
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch patient details: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_doctor_user(request):
    """
    Create a doctor/physiotherapist user (admin only)
    """
    try:
        # Check if user is admin
        try:
            profile = UserProfile.objects.get(user=request.user)
            if profile.role != 'admin':
                return Response(
                    {'error': 'Admin access required'},
                    status=status.HTTP_403_FORBIDDEN
                )
        except UserProfile.DoesNotExist:
            return Response(
                {'error': 'User profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not all([username, email, password]):
            return Response(
                {'error': 'Username, email, and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        
        # Create doctor profile
        UserProfile.objects.create(
            user=user,
            role='doctor'
        )
        
        return Response({
            'message': 'Doctor user created successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': 'doctor'
            }
        }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response(
            {'error': f'Failed to create doctor user: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
