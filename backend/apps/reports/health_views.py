"""
System Health Monitoring
Monitor database status and API performance
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import connection
from django.utils import timezone
from django.contrib.auth.models import User
import time

from exercise.models import UserProfile, ExerciseSession, ActivityData, HealthVitals


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def system_health(request):
    """
    Get system health metrics
    - Database status and connection count
    - API response times
    - Data statistics
    """
    # Check if user is admin
    try:
        profile = UserProfile.objects.get(user=request.user)
        if profile.role != 'admin':
            return Response({'error': 'Admin access required'}, status=403)
    except UserProfile.DoesNotExist:
        return Response({'error': 'User profile not found'}, status=404)
    
    # Database health
    db_status = _check_database_health()
    
    # API performance
    api_performance = _measure_api_performance()
    
    # Data statistics
    data_stats = _get_data_statistics()
    
    return Response({
        'database': db_status,
        'api_performance': api_performance,
        'data_statistics': data_stats,
        'status': 'healthy' if db_status['status'] == 'connected' and api_performance['status'] != 'error' else 'warning',
        'timestamp': timezone.now()
    })


def _check_database_health():
    """Check database connection and table counts"""
    try:
        # Test database connection
        start_time = time.time()
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        connection_time = (time.time() - start_time) * 1000  # Convert to ms
        
        # Get table counts
        user_count = User.objects.count()
        session_count = ExerciseSession.objects.count()
        activity_count = ActivityData.objects.count()
        vitals_count = HealthVitals.objects.count()
        
        return {
            'status': 'connected',
            'connection_time_ms': round(connection_time, 2),
            'tables': {
                'users': user_count,
                'sessions': session_count,
                'activities': activity_count,
                'vitals': vitals_count
            }
        }
    except Exception as e:
        return {
            'status': 'error',
            'error': str(e)
        }


def _measure_api_performance():
    """Measure API query performance"""
    try:
        # Test simple query
        start_time = time.time()
        User.objects.count()
        simple_query_time = (time.time() - start_time) * 1000
        
        # Test complex query
        start_time = time.time()
        list(ExerciseSession.objects.select_related('user', 'exercise').all()[:10])
        complex_query_time = (time.time() - start_time) * 1000
        
        return {
            'simple_query_ms': round(simple_query_time, 2),
            'complex_query_ms': round(complex_query_time, 2),
            'status': 'fast' if complex_query_time < 100 else 'slow'
        }
    except Exception as e:
        return {
            'status': 'error',
            'error': str(e)
        }


def _get_data_statistics():
    """Get overall data statistics"""
    try:
        now = timezone.now()
        today = now.date()
        
        # Today's activity
        sessions_today = ExerciseSession.objects.filter(start_time__date=today).count()
        activities_today = ActivityData.objects.filter(date=today).count()
        
        # Total records
        total_sessions = ExerciseSession.objects.count()
        total_activities = ActivityData.objects.count()
        total_vitals = HealthVitals.objects.count()
        
        return {
            'today': {
                'sessions': sessions_today,
                'activities': activities_today
            },
            'total': {
                'sessions': total_sessions,
                'activities': total_activities,
                'vitals': total_vitals
            }
        }
    except Exception as e:
        return {
            'error': str(e)
        }
