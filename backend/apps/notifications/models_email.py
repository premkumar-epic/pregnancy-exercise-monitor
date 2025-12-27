from django.db import models
from django.contrib.auth.models import User


class EmailCampaign(models.Model):
    """
    Email campaign management for targeted user communications
    """
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('scheduled', 'Scheduled'),
        ('sending', 'Sending'),
        ('sent', 'Sent'),
        ('failed', 'Failed'),
    ]
    
    SEGMENT_CHOICES = [
        ('all', 'All Users'),
        ('trimester_1', 'First Trimester'),
        ('trimester_2', 'Second Trimester'),
        ('trimester_3', 'Third Trimester'),
        ('inactive', 'Inactive Users (7+ days)'),
        ('active', 'Active Users'),
    ]
    
    title = models.CharField(max_length=200)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    segment = models.CharField(max_length=20, choices=SEGMENT_CHOICES, default='all')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_campaigns')
    created_at = models.DateTimeField(auto_now_add=True)
    scheduled_at = models.DateTimeField(null=True, blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    
    recipients_count = models.IntegerField(default=0)
    sent_count = models.IntegerField(default=0)
    failed_count = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.status}"


class EmailLog(models.Model):
    """
    Individual email send logs for tracking
    """
    campaign = models.ForeignKey(EmailCampaign, on_delete=models.CASCADE, related_name='logs')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE)
    sent_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=[
        ('sent', 'Sent'),
        ('failed', 'Failed'),
        ('bounced', 'Bounced'),
    ], default='sent')
    error_message = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-sent_at']
    
    def __str__(self):
        return f"{self.campaign.title} -> {self.recipient.username}"
