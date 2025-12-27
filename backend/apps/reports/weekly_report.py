from django.db.models import Avg, Sum, Count
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from datetime import datetime

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def weekly_report(request):
    """
    Generate weekly report combining activity data and exercise sessions
    """
    start_date = request.query_params.get('start_date')
    end_date = request.query_params.get('end_date')
    
    if not start_date or not end_date:
        return Response({'error': 'start_date and end_date are required'}, status=400)
    
    # Fetch activity data
    from .models import ActivityData, ExerciseSession
    
    activities = ActivityData.objects.filter(
        user=request.user,
        date__range=[start_date, end_date]
    ).order_by('date')
    
    # Fetch exercise sessions - FIXED: use start_time instead of created_at
    sessions = ExerciseSession.objects.filter(
        user=request.user,
        start_time__date__range=[start_date, end_date]
    )
    
    # Calculate activity summary
    activity_summary = {
        'total_steps': activities.aggregate(Sum('steps'))['steps__sum'] or 0,
        'total_calories': activities.aggregate(Sum('calories'))['calories__sum'] or 0,
        'avg_heart_rate': activities.aggregate(Avg('avg_heart_rate'))['avg_heart_rate__avg'] or 0,
        'total_sleep_hours': sum((a.sleep_minutes or 0) / 60 for a in activities)
    }
    
    # Calculate exercise summary - FIXED: use rep_count instead of reps
    exercise_summary = {
        'total_sessions': sessions.count(),
        'total_reps': sessions.aggregate(Sum('rep_count'))['rep_count__sum'] or 0,
        'avg_posture_score': sessions.aggregate(Avg('avg_posture_score'))['avg_posture_score__avg'] or 0,
        'exercises': list(sessions.values('exercise_id').annotate(count=Count('id')))
    }
    
    # Serialize daily data
    daily_data = [{
        'date': str(a.date),
        'steps': a.steps,
        'calories': int(a.calories),
        'heart_rate': a.avg_heart_rate,
        'sleep_hours': (a.sleep_minutes or 0) / 60
    } for a in activities]
    
    # Generate recommendations
    recommendations = []
    
    if activity_summary['total_steps'] < 50000:
        recommendations.append('Try to increase your daily steps. Aim for 7,000-10,000 steps per day for optimal health.')
    
    if exercise_summary['total_sessions'] < 3:
        recommendations.append('Consider adding more exercise sessions. 3-4 sessions per week is ideal during pregnancy.')
    
    if activity_summary['avg_heart_rate'] > 100:
        recommendations.append('Your average heart rate is elevated. Ensure adequate rest and consult your doctor if concerned.')
    
    if activity_summary['total_sleep_hours'] < 49:
        recommendations.append('Prioritize sleep. Aim for 7-9 hours per night for optimal health during pregnancy.')
    
    if exercise_summary['avg_posture_score'] > 0 and exercise_summary['avg_posture_score'] < 70:
        recommendations.append('Focus on maintaining proper form during exercises. Review the reference videos for guidance.')
    
    if not recommendations:
        recommendations.append('Great job! You\'re maintaining a healthy activity level. Keep up the good work!')
    
    return Response({
        'week_start': start_date,
        'week_end': end_date,
        'activity_summary': activity_summary,
        'exercise_summary': exercise_summary,
        'daily_data': daily_data,
        'recommendations': recommendations
    })
