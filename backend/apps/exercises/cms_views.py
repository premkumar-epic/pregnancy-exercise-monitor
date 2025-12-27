"""
Content Management System - Exercise Management
Admin endpoints for creating, updating, and deleting exercises
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from exercise.models import Exercise, UserProfile
from apps.exercises.serializers import ExerciseSerializer
from core.audit import log_action


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def manage_exercises(request):
    """
    GET: List all exercises (admin only)
    POST: Create new exercise (admin only)
    """
    # Check if user is admin
    try:
        profile = UserProfile.objects.get(user=request.user)
        if profile.role != 'admin':
            return Response({'error': 'Admin access required'}, status=403)
    except UserProfile.DoesNotExist:
        return Response({'error': 'User profile not found'}, status=404)
    
    if request.method == 'GET':
        exercises = Exercise.objects.all()
        serializer = ExerciseSerializer(exercises, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = ExerciseSerializer(data=request.data)
        if serializer.is_valid():
            exercise = serializer.save()
            
            # Log the creation
            log_action(
                user=request.user,
                action='create',
                model_name='Exercise',
                object_id=exercise.id,
                object_repr=exercise.name,
                request=request
            )
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def manage_exercise_detail(request, exercise_id):
    """
    GET: Get exercise details
    PUT: Update exercise
    DELETE: Delete exercise
    """
    # Check if user is admin
    try:
        profile = UserProfile.objects.get(user=request.user)
        if profile.role != 'admin':
            return Response({'error': 'Admin access required'}, status=403)
    except UserProfile.DoesNotExist:
        return Response({'error': 'User profile not found'}, status=404)
    
    # Get exercise
    try:
        exercise = Exercise.objects.get(id=exercise_id)
    except Exercise.DoesNotExist:
        return Response({'error': 'Exercise not found'}, status=404)
    
    if request.method == 'GET':
        serializer = ExerciseSerializer(exercise)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        # Store old data for audit log
        old_data = ExerciseSerializer(exercise).data
        
        serializer = ExerciseSerializer(exercise, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            
            # Log the update
            log_action(
                user=request.user,
                action='update',
                model_name='Exercise',
                object_id=exercise.id,
                object_repr=exercise.name,
                changes={'old': old_data, 'new': serializer.data},
                request=request
            )
            
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        exercise_name = exercise.name
        exercise_id = exercise.id
        
        # Log the deletion
        log_action(
            user=request.user,
            action='delete',
            model_name='Exercise',
            object_id=exercise_id,
            object_repr=exercise_name,
            request=request
        )
        
        exercise.delete()
        return Response({
            'message': f'Exercise "{exercise_name}" deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)
