from rest_framework import serializers
from exercise.models import NutritionCategory, NutritionFood, NutritionTip


# =========================
# Nutrition Guide
# =========================

class NutritionCategorySerializer(serializers.ModelSerializer):
    food_count = serializers.SerializerMethodField()
    
    class Meta:
        model = NutritionCategory
        fields = ['id', 'name', 'icon', 'description', 'order', 'food_count']
    
    def get_food_count(self, obj):
        return obj.foods.filter(is_recommended=True).count()


class NutritionFoodSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_icon = serializers.CharField(source='category.icon', read_only=True)
    
    class Meta:
        model = NutritionFood
        fields = [
            'id', 'category', 'category_name', 'category_icon', 'name', 'image',
            'description', 'calories', 'protein', 'carbs', 'fats', 'fiber',
            'benefits', 'serving_size', 'trimester_recommended', 'warnings',
            'rich_in', 'is_recommended', 'is_avoid', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class NutritionTipSerializer(serializers.ModelSerializer):
    trimester_display = serializers.CharField(source='get_trimester_display', read_only=True)
    
    class Meta:
        model = NutritionTip
        fields = ['id', 'title', 'content', 'trimester', 'trimester_display', 'icon', 'order']
