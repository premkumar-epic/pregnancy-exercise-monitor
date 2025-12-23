"""
Nutrition Guide API Views
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import NutritionCategory, NutritionFood, NutritionTip
from .serializers import NutritionCategorySerializer, NutritionFoodSerializer, NutritionTipSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def nutrition_categories(request):
    """Get all nutrition categories"""
    categories = NutritionCategory.objects.all()
    serializer = NutritionCategorySerializer(categories, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def nutrition_foods(request):
    """Get all nutrition foods with optional filtering"""
    foods = NutritionFood.objects.select_related('category').all()
    
    # Filter by category
    category_id = request.query_params.get('category')
    if category_id:
        foods = foods.filter(category_id=category_id)
    
    # Filter recommended/avoid
    is_recommended = request.query_params.get('recommended')
    if is_recommended == 'true':
        foods = foods.filter(is_recommended=True, is_avoid=False)
    elif is_recommended == 'false':
        foods = foods.filter(is_avoid=True)
    
    # Search by name
    search = request.query_params.get('search')
    if search:
        foods = foods.filter(name__icontains=search)
    
    # Filter by trimester (do this last, in Python, to avoid SQLite __contains issue)
    trimester = request.query_params.get('trimester')
    if trimester:
        trimester_int = int(trimester)
        foods = [f for f in foods if trimester_int in f.trimester_recommended]
        serializer = NutritionFoodSerializer(foods, many=True)
    else:
        serializer = NutritionFoodSerializer(foods, many=True)
    
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def nutrition_food_detail(request, food_id):
    """Get single food detail"""
    try:
        food = NutritionFood.objects.select_related('category').get(id=food_id)
        serializer = NutritionFoodSerializer(food)
        return Response(serializer.data)
    except NutritionFood.DoesNotExist:
        return Response({'error': 'Food not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def nutrition_tips(request):
    """Get nutrition tips, optionally filtered by trimester"""
    tips = NutritionTip.objects.filter(is_active=True)
    
    trimester = request.query_params.get('trimester')
    if trimester:
        # Get tips for specific trimester or all trimesters (0)
        tips = tips.filter(trimester__in=[int(trimester), 0])
    
    serializer = NutritionTipSerializer(tips, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def nutrition_recommended(request):
    """Get recommended foods for user's trimester"""
    # Get user's pregnancy profile to determine trimester
    try:
        from .models import PregnancyProfile
        profile = PregnancyProfile.objects.get(user=request.user)
        trimester = profile.trimester
    except PregnancyProfile.DoesNotExist:
        trimester = 1  # Default to first trimester
    
    # Get all recommended foods
    all_foods = NutritionFood.objects.filter(
        is_recommended=True,
        is_avoid=False
    ).select_related('category')
    
    # Filter by trimester in Python (SQLite doesn't support __contains for JSONField)
    foods = [f for f in all_foods if trimester in f.trimester_recommended][:10]
    
    serializer = NutritionFoodSerializer(foods, many=True)
    return Response({
        'trimester': trimester,
        'recommended_foods': serializer.data
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def nutrition_avoid(request):
    """Get foods to avoid during pregnancy"""
    foods = NutritionFood.objects.filter(is_avoid=True).select_related('category')
    serializer = NutritionFoodSerializer(foods, many=True)
    return Response(serializer.data)
