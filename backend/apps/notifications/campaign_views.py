"""
Email Campaign Management
Admin endpoints for creating and managing email campaigns
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

from exercise.models import UserProfile, PregnancyProfile
from apps.notifications.models_email import EmailCampaign, EmailLog
from apps.notifications.serializers_email import EmailCampaignSerializer, EmailLogSerializer
from core.audit import log_action
from core.email import send_email


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def manage_campaigns(request):
    """
    GET: List all campaigns
    POST: Create new campaign
    """
    # Check if user is admin
    try:
        profile = UserProfile.objects.get(user=request.user)
        if profile.role != 'admin':
            return Response({'error': 'Admin access required'}, status=403)
    except UserProfile.DoesNotExist:
        return Response({'error': 'User profile not found'}, status=404)
    
    if request.method == 'GET':
        campaigns = EmailCampaign.objects.all()
        serializer = EmailCampaignSerializer(campaigns, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = EmailCampaignSerializer(data=request.data)
        if serializer.is_valid():
            campaign = serializer.save(created_by=request.user)
            
            # Calculate recipients count based on segment
            recipients_count = _get_segment_users(campaign.segment).count()
            campaign.recipients_count = recipients_count
            campaign.save()
            
            # Log the creation
            log_action(
                user=request.user,
                action='create',
                model_name='EmailCampaign',
                object_id=campaign.id,
                object_repr=campaign.title,
                request=request
            )
            
            return Response(EmailCampaignSerializer(campaign).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def manage_campaign_detail(request, campaign_id):
    """
    GET: Get campaign details
    PUT: Update campaign
    DELETE: Delete campaign
    """
    # Check if user is admin
    try:
        profile = UserProfile.objects.get(user=request.user)
        if profile.role != 'admin':
            return Response({'error': 'Admin access required'}, status=403)
    except UserProfile.DoesNotExist:
        return Response({'error': 'User profile not found'}, status=404)
    
    # Get campaign
    try:
        campaign = EmailCampaign.objects.get(id=campaign_id)
    except EmailCampaign.DoesNotExist:
        return Response({'error': 'Campaign not found'}, status=404)
    
    if request.method == 'GET':
        serializer = EmailCampaignSerializer(campaign)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        # Can only edit draft campaigns
        if campaign.status != 'draft':
            return Response({'error': 'Can only edit draft campaigns'}, status=400)
        
        serializer = EmailCampaignSerializer(campaign, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            
            # Recalculate recipients if segment changed
            if 'segment' in request.data:
                recipients_count = _get_segment_users(campaign.segment).count()
                campaign.recipients_count = recipients_count
                campaign.save()
            
            # Log the update
            log_action(
                user=request.user,
                action='update',
                model_name='EmailCampaign',
                object_id=campaign.id,
                object_repr=campaign.title,
                request=request
            )
            
            return Response(EmailCampaignSerializer(campaign).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        # Can only delete draft campaigns
        if campaign.status != 'draft':
            return Response({'error': 'Can only delete draft campaigns'}, status=400)
        
        campaign_title = campaign.title
        
        # Log the deletion
        log_action(
            user=request.user,
            action='delete',
            model_name='EmailCampaign',
            object_id=campaign_id,
            object_repr=campaign_title,
            request=request
        )
        
        campaign.delete()
        return Response({
            'message': f'Campaign "{campaign_title}" deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_campaign(request, campaign_id):
    """Send email campaign to target segment"""
    # Check if user is admin
    try:
        profile = UserProfile.objects.get(user=request.user)
        if profile.role != 'admin':
            return Response({'error': 'Admin access required'}, status=403)
    except UserProfile.DoesNotExist:
        return Response({'error': 'User profile not found'}, status=404)
    
    # Get campaign
    try:
        campaign = EmailCampaign.objects.get(id=campaign_id)
    except EmailCampaign.DoesNotExist:
        return Response({'error': 'Campaign not found'}, status=404)
    
    # Can only send draft campaigns
    if campaign.status != 'draft':
        return Response({'error': 'Campaign already sent or in progress'}, status=400)
    
    # Get recipients based on segment
    recipients = _get_segment_users(campaign.segment)
    
    if not recipients.exists():
        return Response({'error': 'No recipients found for this segment'}, status=400)
    
    # Update campaign status
    campaign.status = 'sending'
    campaign.save()
    
    # Send emails
    sent_count = 0
    failed_count = 0
    
    for user in recipients:
        try:
            send_email(
                to_email=user.email,
                subject=campaign.subject,
                message=campaign.message
            )
            
            # Log successful send
            EmailLog.objects.create(
                campaign=campaign,
                recipient=user,
                status='sent'
            )
            sent_count += 1
            
        except Exception as e:
            # Log failed send
            EmailLog.objects.create(
                campaign=campaign,
                recipient=user,
                status='failed',
                error_message=str(e)
            )
            failed_count += 1
    
    # Update campaign
    campaign.status = 'sent'
    campaign.sent_at = timezone.now()
    campaign.sent_count = sent_count
    campaign.failed_count = failed_count
    campaign.save()
    
    # Log the send action
    log_action(
        user=request.user,
        action='export',  # Using 'export' for send action
        model_name='EmailCampaign',
        object_id=campaign.id,
        object_repr=f"{campaign.title} (sent to {sent_count} users)",
        request=request
    )
    
    return Response({
        'message': 'Campaign sent successfully',
        'sent_count': sent_count,
        'failed_count': failed_count,
        'total_recipients': recipients.count()
    })


def _get_segment_users(segment):
    """Get users based on segment criteria"""
    if segment == 'all':
        return User.objects.filter(profile__role='patient')
    
    elif segment == 'trimester_1':
        profiles = PregnancyProfile.objects.filter(trimester=1)
        return User.objects.filter(id__in=profiles.values_list('user_id', flat=True))
    
    elif segment == 'trimester_2':
        profiles = PregnancyProfile.objects.filter(trimester=2)
        return User.objects.filter(id__in=profiles.values_list('user_id', flat=True))
    
    elif segment == 'trimester_3':
        profiles = PregnancyProfile.objects.filter(trimester=3)
        return User.objects.filter(id__in=profiles.values_list('user_id', flat=True))
    
    elif segment == 'inactive':
        seven_days_ago = timezone.now() - timedelta(days=7)
        return User.objects.filter(
            profile__role='patient',
            last_login__lt=seven_days_ago
        )
    
    elif segment == 'active':
        seven_days_ago = timezone.now() - timedelta(days=7)
        return User.objects.filter(
            profile__role='patient',
            last_login__gte=seven_days_ago
        )
    
    return User.objects.none()
