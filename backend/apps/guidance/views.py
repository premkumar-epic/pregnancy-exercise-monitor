"""
API views for doctors, guidance, and FAQs
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from exercise.models import Doctor, GuidanceArticle, FAQ, UserProfile
from apps.doctors.serializers import DoctorSerializer
from apps.guidance.serializers import GuidanceArticleSerializer, FAQSerializer


# Doctor APIs
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_doctors(request):
    """Get list of available doctors"""
    doctors = Doctor.objects.filter(is_active=True)
    serializer = DoctorSerializer(doctors, many=True)
    return Response(serializer.data)


# Guidance APIs
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_guidance(request):
    """Get personalized guidance based on user's trimester"""
    try:
        profile = UserProfile.objects.get(user=request.user)
        trimester = profile.trimester
        week = profile.pregnancy_week
        
        # Get trimester-specific and general articles
        articles = GuidanceArticle.objects.filter(
            Q(trimester=trimester) | Q(trimester__isnull=True),
            is_published=True
        ).order_by('order')
        
        # Get week-specific content if available
        weekly_content = None
        if week:
            weekly_content = GuidanceArticle.objects.filter(
                week_number=week,
                is_published=True
            ).first()
        
        return Response({
            'articles': GuidanceArticleSerializer(articles, many=True).data,
            'weekly_content': GuidanceArticleSerializer(weekly_content).data if weekly_content else None,
            'current_trimester': trimester,
            'current_week': week
        })
    except UserProfile.DoesNotExist:
        # Return general content if no profile
        articles = GuidanceArticle.objects.filter(
            trimester__isnull=True,
            is_published=True
        ).order_by('order')
        return Response({
            'articles': GuidanceArticleSerializer(articles, many=True).data,
            'weekly_content': None,
            'current_trimester': None,
            'current_week': None
        })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_faqs(request):
    """Get all published FAQs, optionally filtered by category"""
    category = request.query_params.get('category', None)
    
    faqs = FAQ.objects.filter(is_published=True)
    if category:
        faqs = faqs.filter(category=category)
    
    faqs = faqs.order_by('order', 'category')
    serializer = FAQSerializer(faqs, many=True)
    
    # Group by category
    grouped = {}
    for faq in serializer.data:
        cat = faq['category']
        if cat not in grouped:
            grouped[cat] = []
        grouped[cat].append(faq)
    
    return Response({
        'faqs': serializer.data,
        'grouped': grouped
    })
