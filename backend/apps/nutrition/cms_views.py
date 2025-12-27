"""
Content Management System - Nutrition Management
Admin endpoints for managing nutrition foods and categories
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from exercise.models import NutritionFood, NutritionCategory, UserProfile
from apps.nutrition.serializers import NutritionFoodSerializer, NutritionCategorySerializer
from core.audit import log_action


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_nutrition_food(request):
    """Create new nutrition food (admin only)"""
    # Check if user is admin
    try:
        profile = UserProfile.objects.get(user=request.user)
        if profile.role != 'admin':
            return Response({'error': 'Admin access required'}, status=403)
    except UserProfile.DoesNotExist:
        return Response({'error': 'User profile not found'}, status=404)
    
    serializer = NutritionFoodSerializer(data=request.data)
    if serializer.is_valid():
        food = serializer.save()
        
        # Log the creation
        log_action(
            user=request.user,
            action='create',
            model_name='NutritionFood',
            object_id=food.id,
            object_repr=food.name,
            request=request
        )
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def manage_nutrition_food(request, food_id):
    """
    PUT: Update nutrition food
    DELETE: Delete nutrition food
    """
    # Check if user is admin
    try:
        profile = UserProfile.objects.get(user=request.user)
        if profile.role != 'admin':
            return Response({'error': 'Admin access required'}, status=403)
    except UserProfile.DoesNotExist:
        return Response({'error': 'User profile not found'}, status=404)
    
    # Get food
    try:
        food = NutritionFood.objects.get(id=food_id)
    except NutritionFood.DoesNotExist:
        return Response({'error': 'Food not found'}, status=404)
    
    if request.method == 'PUT':
        old_data = NutritionFoodSerializer(food).data
        
        serializer = NutritionFoodSerializer(food, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            
            # Log the update
            log_action(
                user=request.user,
                action='update',
                model_name='NutritionFood',
                object_id=food.id,
                object_repr=food.name,
                changes={'old': old_data, 'new': serializer.data},
                request=request
            )
            
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        food_name = food.name
        food_id = food.id
        
        # Log the deletion
        log_action(
            user=request.user,
            action='delete',
            model_name='NutritionFood',
            object_id=food_id,
            object_repr=food_name,
            request=request
        )
        
        food.delete()
        return Response({
            'message': f'Food "{food_name}" deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)
