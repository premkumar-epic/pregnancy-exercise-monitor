from rest_framework import serializers
from apps.notifications.models_email import EmailCampaign, EmailLog


class EmailCampaignSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    segment_display = serializers.CharField(source='get_segment_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = EmailCampaign
        fields = [
            'id', 'title', 'subject', 'message', 'segment', 'segment_display',
            'status', 'status_display', 'created_by', 'created_by_username',
            'created_at', 'scheduled_at', 'sent_at', 'recipients_count',
            'sent_count', 'failed_count'
        ]
        read_only_fields = ['id', 'created_at', 'sent_at', 'recipients_count', 'sent_count', 'failed_count']


class EmailLogSerializer(serializers.ModelSerializer):
    recipient_username = serializers.CharField(source='recipient.username', read_only=True)
    campaign_title = serializers.CharField(source='campaign.title', read_only=True)
    
    class Meta:
        model = EmailLog
        fields = [
            'id', 'campaign', 'campaign_title', 'recipient', 'recipient_username',
            'sent_at', 'status', 'error_message'
        ]
        read_only_fields = ['id', 'sent_at']
