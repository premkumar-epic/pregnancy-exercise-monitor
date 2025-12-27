# Admin endpoints for Phase 3: User Management System

from django.db.models import Avg, Sum, Count
from django.utils import timezone
from datetime import timedelta
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from exercise.models import ExerciseSession, ActivityData, UserProfile


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_analytics(request):
    """System-wide analytics for administrators only"""
    # Check if user is admin
    try:
        profile = UserProfile.objects.get(user=request.user)
        if profile.role != 'admin':
            return Response({'error': 'Admin access required'}, status=403)
    except UserProfile.DoesNotExist:
        return Response({'error': 'User profile not found'}, status=404)
    
    # User statistics - FIXED: Only count patients
    total_patients = UserProfile.objects.filter(role='patient').count()
    active_users = User.objects.filter(
        last_login__gte=timezone.now() - timedelta(days=7)
    ).count()
    
    # Exercise statistics
    total_sessions = ExerciseSession.objects.count()
    total_reps = ExerciseSession.objects.aggregate(Sum('rep_count'))['rep_count__sum'] or 0
    avg_posture = ExerciseSession.objects.aggregate(Avg('avg_posture_score'))['avg_posture_score__avg'] or 0
    
    # Popular exercises
    popular_exercises = ExerciseSession.objects.values('exercise__name').annotate(
        count=Count('id')
    ).order_by('-count')[:5]
    
    # Activity statistics
    total_activities = ActivityData.objects.count()
    avg_steps = ActivityData.objects.aggregate(Avg('steps'))['steps__avg'] or 0
    
    return Response({
        'users': {
            'total': total_patients,  # Changed from total_users
            'active': active_users,
            'inactive': total_patients - active_users  # Changed from total_users
        },
        'exercises': {
            'total_sessions': total_sessions,
            'total_reps': total_reps,
            'avg_posture_score': round(avg_posture, 2),
            'popular': list(popular_exercises)
        },
        'activity': {
            'total_records': total_activities,
            'avg_daily_steps': round(avg_steps, 0)
        }
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_list(request):
    """List all users with their activity stats (admin only)"""
    # Check if user is admin
    try:
        profile = UserProfile.objects.get(user=request.user)
        if profile.role != 'admin':
            return Response({'error': 'Admin access required'}, status=403)
    except UserProfile.DoesNotExist:
        return Response({'error': 'User profile not found'}, status=404)
    
    users = User.objects.all().values(
        'id', 'username', 'email', 'date_joined', 'last_login'
    )
    
    # Add activity stats for each user
    user_data = []
    for user in users:
        sessions_count = ExerciseSession.objects.filter(user_id=user['id']).count()
        activities_count = ActivityData.objects.filter(user_id=user['id']).count()
        
        # Get user role
        try:
            user_profile = UserProfile.objects.get(user_id=user['id'])
            role = user_profile.role
        except UserProfile.DoesNotExist:
            role = 'patient'  # Default role
        
        user_data.append({
            **user,
            'role': role,
            'exercise_sessions': sessions_count,
            'activity_records': activities_count
        })
    
    return Response(user_data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_growth_data(request):
    """Get user registration growth over time (admin only)"""
    # Check if user is admin
    try:
        profile = UserProfile.objects.get(user=request.user)
        if profile.role != 'admin':
            return Response({'error': 'Admin access required'}, status=403)
    except UserProfile.DoesNotExist:
        return Response({'error': 'User profile not found'}, status=404)
    
    from django.db.models.functions import TruncDate
    
    # Get user registrations grouped by date (last 30 days)
    thirty_days_ago = timezone.now() - timedelta(days=30)
    
    growth_data = User.objects.filter(
        date_joined__gte=thirty_days_ago
    ).annotate(
        date=TruncDate('date_joined')
    ).values('date').annotate(
        count=Count('id')
    ).order_by('date')
    
    return Response(list(growth_data))


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def activity_trends(request):
    """Get activity trends over time (admin only)"""
    # Check if user is admin
    try:
        profile = UserProfile.objects.get(user=request.user)
        if profile.role != 'admin':
            return Response({'error': 'Admin access required'}, status=403)
    except UserProfile.DoesNotExist:
        return Response({'error': 'User profile not found'}, status=404)
    
    from django.db.models.functions import TruncDate
    
    # Get activity trends (last 30 days)
    thirty_days_ago = timezone.now() - timedelta(days=30)
    
    trends = ActivityData.objects.filter(
        date__gte=thirty_days_ago.date()
    ).values('date').annotate(
        avg_steps=Avg('steps'),
        avg_calories=Avg('calories'),
        total_activities=Count('id')
    ).order_by('date')
    
    return Response(list(trends))


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request, user_id):
    """Delete a user and all related data (admin only)"""
    # Check if user is admin
    try:
        profile = UserProfile.objects.get(user=request.user)
        if profile.role != 'admin':
            return Response({'error': 'Admin access required'}, status=403)
    except UserProfile.DoesNotExist:
        return Response({'error': 'User profile not found'}, status=404)
    
    # Prevent admin from deleting themselves
    if request.user.id == user_id:
        return Response({'error': 'Cannot delete your own account'}, status=400)
    
    # Get user to delete
    try:
        user_to_delete = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    
    # Store username for response
    username = user_to_delete.username
    
    # Log the deletion
    from core.audit import log_action
    log_action(
        user=request.user,
        action='delete',
        model_name='User',
        object_id=user_id,
        object_repr=username,
        request=request
    )
    
    # Delete user (cascade will delete related data)
    user_to_delete.delete()
    
    return Response({
        'message': f'User "{username}" and all related data deleted successfully',
        'deleted_user_id': user_id
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_user_role(request, user_id):
    """
    Change a user's role (admin only)
    """
    # Check if user is admin
    try:
        admin_profile = UserProfile.objects.get(user=request.user)
        if admin_profile.role != 'admin':
            return Response({'error': 'Admin access required'}, status=403)
    except UserProfile.DoesNotExist:
        return Response({'error': 'User profile not found'}, status=404)
    
    # Get target user
    try:
        user = User.objects.get(id=user_id)
        user_profile = UserProfile.objects.get(user=user)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    except UserProfile.DoesNotExist:
        return Response({'error': 'User profile not found'}, status=404)
    
    # Get new role from request
    new_role = request.data.get('role')
    if not new_role:
        return Response({'error': 'Role is required'}, status=400)
    
    if new_role not in ['patient', 'doctor', 'admin']:
        return Response({'error': 'Invalid role'}, status=400)
    
    # Store old role for audit
    old_role = user_profile.role
    
    # Update role
    user_profile.role = new_role
    user_profile.save()
    
    # Log the role change
    from core.audit import log_action
    log_action(
        user=request.user,
        action='update',
        model_name='UserProfile',
        object_id=user_profile.id,
        object_repr=f"{user.username}",
        changes={'old': {'role': old_role}, 'new': {'role': new_role}},
        request=request
    )
    
    return Response({
        'message': 'User role updated successfully',
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': new_role
        }
    })
