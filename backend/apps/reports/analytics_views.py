"""
Advanced Analytics Endpoints
Provide deep insights into user retention, feature adoption, and engagement
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models import Count, Avg, Q
from datetime import timedelta

from exercise.models import UserProfile, ExerciseSession, ActivityData, HealthVitals, Notification


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def retention_metrics(request):
    """
    Calculate user retention metrics
    - Day 1, Day 7, Day 30 retention rates
    - Cohort analysis
    """
    # Check if user is admin
    try:
        profile = UserProfile.objects.get(user=request.user)
        if profile.role != 'admin':
            return Response({'error': 'Admin access required'}, status=403)
    except UserProfile.DoesNotExist:
        return Response({'error': 'User profile not found'}, status=404)
    
    now = timezone.now()
    
    # Get all users registered in last 30 days
    thirty_days_ago = now - timedelta(days=30)
    recent_users = User.objects.filter(
        date_joined__gte=thirty_days_ago,
        profile__role='patient'
    )
    
    # Day 1 Retention: Users who logged in within 24 hours of registration
    day_1_retained = recent_users.filter(
        last_login__gte=models.F('date_joined'),
        last_login__lte=models.F('date_joined') + timedelta(days=1)
    ).count()
    
    # Day 7 Retention: Users who logged in within 7 days
    seven_days_ago = now - timedelta(days=7)
    users_7_days_old = User.objects.filter(
        date_joined__lte=seven_days_ago,
        date_joined__gte=thirty_days_ago,
        profile__role='patient'
    )
    day_7_retained = users_7_days_old.filter(
        last_login__gte=models.F('date_joined') + timedelta(days=7)
    ).count()
    
    # Day 30 Retention
    users_30_days_old = User.objects.filter(
        date_joined__lte=thirty_days_ago,
        profile__role='patient'
    )
    day_30_retained = users_30_days_old.filter(
        last_login__gte=now - timedelta(days=30)
    ).count()
    
    # Active users (logged in last 7 days)
    active_users = User.objects.filter(
        last_login__gte=seven_days_ago,
        profile__role='patient'
    ).count()
    
    # Churned users (not logged in for 14+ days)
    fourteen_days_ago = now - timedelta(days=14)
    churned_users = User.objects.filter(
        last_login__lt=fourteen_days_ago,
        profile__role='patient'
    ).count()
    
    total_users = User.objects.filter(profile__role='patient').count()
    
    return Response({
        'retention': {
            'day_1_rate': round((day_1_retained / recent_users.count() * 100) if recent_users.count() > 0 else 0, 2),
            'day_7_rate': round((day_7_retained / users_7_days_old.count() * 100) if users_7_days_old.count() > 0 else 0, 2),
            'day_30_rate': round((day_30_retained / users_30_days_old.count() * 100) if users_30_days_old.count() > 0 else 0, 2),
        },
        'user_status': {
            'total_users': total_users,
            'active_users': active_users,
            'churned_users': churned_users,
            'active_rate': round((active_users / total_users * 100) if total_users > 0 else 0, 2),
        }
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def feature_adoption(request):
    """
    Track adoption rates of different features
    """
    # Check if user is admin
    try:
        profile = UserProfile.objects.get(user=request.user)
        if profile.role != 'admin':
            return Response({'error': 'Admin access required'}, status=403)
    except UserProfile.DoesNotExist:
        return Response({'error': 'User profile not found'}, status=404)
    
    total_users = User.objects.filter(profile__role='patient').count()
    
    if total_users == 0:
        return Response({'error': 'No users found'}, status=404)
    
    # Exercise feature adoption
    users_with_sessions = User.objects.filter(
        exercisesession__isnull=False
    ).distinct().count()
    
    # Activity tracking adoption
    users_with_activity = User.objects.filter(
        activitydata__isnull=False
    ).distinct().count()
    
    # Health monitoring adoption
    users_with_vitals = User.objects.filter(
        healthvitals__isnull=False
    ).distinct().count()
    
    # Notification engagement
    users_with_notifications = User.objects.filter(
        notification__isnull=False
    ).distinct().count()
    
    # Average sessions per user
    avg_sessions = ExerciseSession.objects.values('user').annotate(
        count=Count('id')
    ).aggregate(Avg('count'))['count__avg'] or 0
    
    # Most popular exercises
    popular_exercises = ExerciseSession.objects.values(
        'exercise__name'
    ).annotate(
        count=Count('id')
    ).order_by('-count')[:5]
    
    return Response({
        'feature_adoption': {
            'exercise_tracking': {
                'users': users_with_sessions,
                'adoption_rate': round((users_with_sessions / total_users * 100), 2),
                'avg_sessions_per_user': round(avg_sessions, 2)
            },
            'activity_tracking': {
                'users': users_with_activity,
                'adoption_rate': round((users_with_activity / total_users * 100), 2)
            },
            'health_monitoring': {
                'users': users_with_vitals,
                'adoption_rate': round((users_with_vitals / total_users * 100), 2)
            },
            'notifications': {
                'users': users_with_notifications,
                'adoption_rate': round((users_with_notifications / total_users * 100), 2)
            }
        },
        'popular_exercises': list(popular_exercises),
        'total_users': total_users
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def engagement_metrics(request):
    """
    Detailed engagement metrics
    """
    # Check if user is admin
    try:
        profile = UserProfile.objects.get(user=request.user)
        if profile.role != 'admin':
            return Response({'error': 'Admin access required'}, status=403)
    except UserProfile.DoesNotExist:
        return Response({'error': 'User profile not found'}, status=404)
    
    now = timezone.now()
    seven_days_ago = now - timedelta(days=7)
    thirty_days_ago = now - timedelta(days=30)
    
    # Daily active users (last 7 days)
    dau = User.objects.filter(
        last_login__gte=seven_days_ago,
        profile__role='patient'
    ).count()
    
    # Monthly active users
    mau = User.objects.filter(
        last_login__gte=thirty_days_ago,
        profile__role='patient'
    ).count()
    
    # Average session duration (in minutes)
    sessions_with_duration = ExerciseSession.objects.filter(
        end_time__isnull=False,
        start_time__gte=seven_days_ago
    )
    
    total_duration = sum([
        (s.end_time - s.start_time).total_seconds() / 60
        for s in sessions_with_duration
    ])
    avg_duration = total_duration / sessions_with_duration.count() if sessions_with_duration.count() > 0 else 0
    
    # Sessions per day (last 7 days)
    sessions_last_week = ExerciseSession.objects.filter(
        start_time__gte=seven_days_ago
    ).count()
    
    # Average posture score trend
    avg_posture_last_week = ExerciseSession.objects.filter(
        start_time__gte=seven_days_ago
    ).aggregate(Avg('avg_posture_score'))['avg_posture_score__avg'] or 0
    
    return Response({
        'engagement': {
            'daily_active_users': dau,
            'monthly_active_users': mau,
            'dau_mau_ratio': round((dau / mau * 100) if mau > 0 else 0, 2),
        },
        'session_metrics': {
            'total_sessions_last_7d': sessions_last_week,
            'avg_sessions_per_day': round(sessions_last_week / 7, 2),
            'avg_session_duration_minutes': round(avg_duration, 2),
            'avg_posture_score': round(avg_posture_last_week, 2)
        }
    })
