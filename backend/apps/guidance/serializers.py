from rest_framework import serializers
from exercise.models import GuidanceArticle, FAQ


# =========================
# Guidance Article
# =========================
class GuidanceArticleSerializer(serializers.ModelSerializer):
    trimester_display = serializers.CharField(source='get_trimester_display', read_only=True)
    
    class Meta:
        model = GuidanceArticle
        fields = [
            'id', 'title', 'content', 'category', 'trimester', 'trimester_display',
            'week_number', 'icon', 'order', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


# =========================
# FAQ
# =========================
class FAQSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    
    class Meta:
        model = FAQ
        fields = ['id', 'question', 'answer', 'category', 'category_display', 'order']
