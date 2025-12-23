"""
Custom Reminder and Engagement Notification Models
For scheduled notifications and user engagement
"""

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class CustomReminder(models.Model):
    """User-created custom reminders (medicine, appointments, etc.)"""
    REMINDER_TYPES = [
        ('medicine', 'Medicine'),
        ('appointment', 'Appointment'),
        ('exercise', 'Exercise'),
        ('water', 'Water Intake'),
        ('meal', 'Meal'),
        ('custom', 'Custom'),
    ]
    
    FREQUENCY_CHOICES = [
        ('once', 'Once'),
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='custom_reminders')
    reminder_type = models.CharField(max_length=20, choices=REMINDER_TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    scheduled_time = models.TimeField(help_text="Time to send reminder (HH:MM)")
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, default='daily')
    days_of_week = models.JSONField(
        default=list,
        help_text="For weekly: [0,1,2,3,4,5,6] where 0=Monday, 6=Sunday"
    )
    is_active = models.BooleanField(default=True)
    send_email = models.BooleanField(default=False, help_text="Send email notification")
    send_notification = models.BooleanField(default=True, help_text="Send in-app notification")
    last_sent = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['scheduled_time']
        indexes = [
            models.Index(fields=['user', 'is_active']),
            models.Index(fields=['scheduled_time']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.title} ({self.get_frequency_display()})"
    
    def should_send_today(self):
        """Check if reminder should be sent today"""
        if not self.is_active:
            return False
        
        today = timezone.now()
        
        # Check if already sent today
        if self.last_sent and self.last_sent.date() == today.date():
            return False
        
        # Check frequency
        if self.frequency == 'once':
            return self.last_sent is None
        elif self.frequency == 'daily':
            return True
        elif self.frequency == 'weekly':
            return today.weekday() in self.days_of_week
        elif self.frequency == 'monthly':
            # Send on the same day of month as created
            return today.day == self.created_at.day
        
        return False


class EngagementNotification(models.Model):
    """Pre-defined engagement notifications to increase app usage"""
    TRIGGER_TYPES = [
        ('inactive_user', 'Inactive User (3+ days)'),
        ('streak_milestone', 'Streak Milestone'),
        ('new_content', 'New Content Available'),
        ('health_tip', 'Daily Health Tip'),
        ('pregnancy_week', 'Pregnancy Week Milestone'),
        ('achievement', 'Achievement Unlocked'),
        ('welcome_back', 'Welcome Back'),
        ('weekly_summary', 'Weekly Summary Ready'),
    ]
    
    PRIORITY_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    
    trigger_type = models.CharField(max_length=50, choices=TRIGGER_TYPES, unique=True)
    title = models.CharField(max_length=200)
    message = models.TextField()
    action_url = models.CharField(max_length=500, blank=True)
    priority = models.CharField(max_length=20, choices=PRIORITY_LEVELS, default='low')
    is_active = models.BooleanField(default=True)
    send_email = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['trigger_type']
    
    def __str__(self):
        return f"{self.get_trigger_type_display()} - {self.title}"


class NotificationPreferences(models.Model):
    """User preferences for notifications"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='notification_preferences')
    
    # Engagement notifications
    enable_engagement = models.BooleanField(default=True, help_text="Receive engagement notifications")
    enable_email = models.BooleanField(default=True, help_text="Receive email notifications")
    enable_reminders = models.BooleanField(default=True, help_text="Receive custom reminders")
    
    # Quiet hours
    quiet_hours_enabled = models.BooleanField(default=False)
    quiet_hours_start = models.TimeField(null=True, blank=True, help_text="Start of quiet hours")
    quiet_hours_end = models.TimeField(null=True, blank=True, help_text="End of quiet hours")
    
    # Specific notification types
    enable_health_alerts = models.BooleanField(default=True)
    enable_exercise_reminders = models.BooleanField(default=True)
    enable_pregnancy_tips = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "Notification Preferences"
    
    def __str__(self):
        return f"{self.user.username} - Notification Preferences"
    
    def is_quiet_hours(self):
        """Check if current time is within quiet hours"""
        if not self.quiet_hours_enabled or not self.quiet_hours_start or not self.quiet_hours_end:
            return False
        
        now = timezone.now().time()
        start = self.quiet_hours_start
        end = self.quiet_hours_end
        
        if start < end:
            return start <= now <= end
        else:  # Quiet hours span midnight
            return now >= start or now <= end
