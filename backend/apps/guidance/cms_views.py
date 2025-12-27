"""
Content Management System - Guidance Management
Admin endpoints for managing guidance articles and FAQs
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from exercise.models import GuidanceArticle, FAQ, UserProfile
from apps.guidance.serializers import GuidanceArticleSerializer, FAQSerializer
from core.audit import log_action


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_guidance_article(request):
    """Create new guidance article (admin only)"""
    # Check if user is admin
    try:
        profile = UserProfile.objects.get(user=request.user)
        if profile.role != 'admin':
            return Response({'error': 'Admin access required'}, status=403)
    except UserProfile.DoesNotExist:
        return Response({'error': 'User profile not found'}, status=404)
    
    serializer = GuidanceArticleSerializer(data=request.data)
    if serializer.is_valid():
        article = serializer.save()
        
        # Log the creation
        log_action(
            user=request.user,
            action='create',
            model_name='GuidanceArticle',
            object_id=article.id,
            object_repr=article.title,
            request=request
        )
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def manage_guidance_article(request, article_id):
    """
    PUT: Update guidance article
    DELETE: Delete guidance article
    """
    # Check if user is admin
    try:
        profile = UserProfile.objects.get(user=request.user)
        if profile.role != 'admin':
            return Response({'error': 'Admin access required'}, status=403)
    except UserProfile.DoesNotExist:
        return Response({'error': 'User profile not found'}, status=404)
    
    # Get article
    try:
        article = GuidanceArticle.objects.get(id=article_id)
    except GuidanceArticle.DoesNotExist:
        return Response({'error': 'Article not found'}, status=404)
    
    if request.method == 'PUT':
        old_data = GuidanceArticleSerializer(article).data
        
        serializer = GuidanceArticleSerializer(article, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            
            # Log the update
            log_action(
                user=request.user,
                action='update',
                model_name='GuidanceArticle',
                object_id=article.id,
                object_repr=article.title,
                changes={'old': old_data, 'new': serializer.data},
                request=request
            )
            
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        article_title = article.title
        article_id = article.id
        
        # Log the deletion
        log_action(
            user=request.user,
            action='delete',
            model_name='GuidanceArticle',
            object_id=article_id,
            object_repr=article_title,
            request=request
        )
        
        article.delete()
        return Response({
            'message': f'Article "{article_title}" deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_faq(request):
    """Create new FAQ (admin only)"""
    # Check if user is admin
    try:
        profile = UserProfile.objects.get(user=request.user)
        if profile.role != 'admin':
            return Response({'error': 'Admin access required'}, status=403)
    except UserProfile.DoesNotExist:
        return Response({'error': 'User profile not found'}, status=404)
    
    serializer = FAQSerializer(data=request.data)
    if serializer.is_valid():
        faq = serializer.save()
        
        # Log the creation
        log_action(
            user=request.user,
            action='create',
            model_name='FAQ',
            object_id=faq.id,
            object_repr=faq.question[:50],
            request=request
        )
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def manage_faq(request, faq_id):
    """
    PUT: Update FAQ
    DELETE: Delete FAQ
    """
    # Check if user is admin
    try:
        profile = UserProfile.objects.get(user=request.user)
        if profile.role != 'admin':
            return Response({'error': 'Admin access required'}, status=403)
    except UserProfile.DoesNotExist:
        return Response({'error': 'User profile not found'}, status=404)
    
    # Get FAQ
    try:
        faq = FAQ.objects.get(id=faq_id)
    except FAQ.DoesNotExist:
        return Response({'error': 'FAQ not found'}, status=404)
    
    if request.method == 'PUT':
        old_data = FAQSerializer(faq).data
        
        serializer = FAQSerializer(faq, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            
            # Log the update
            log_action(
                user=request.user,
                action='update',
                model_name='FAQ',
                object_id=faq.id,
                object_repr=faq.question[:50],
                changes={'old': old_data, 'new': serializer.data},
                request=request
            )
            
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        faq_question = faq.question[:50]
        faq_id = faq.id
        
        # Log the deletion
        log_action(
            user=request.user,
            action='delete',
            model_name='FAQ',
            object_id=faq_id,
            object_repr=faq_question,
            request=request
        )
        
        faq.delete()
        return Response({
            'message': 'FAQ deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)
