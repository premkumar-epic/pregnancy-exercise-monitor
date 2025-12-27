from rest_framework import serializers
from exercise.models import (
    Notification, CustomReminder, EngagementNotification, NotificationPreferences
)


# =========================
# Notification
# =========================
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'id', 'notification_type', 'priority', 'title', 'message',
            'is_read', 'created_at', 'action_url'
        ]
        read_only_fields = ['id', 'created_at']


# =========================
# Custom Reminders
# =========================
class CustomReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomReminder
        fields = [
            'id', 'reminder_type', 'title', 'message', 'scheduled_time',
            'frequency', 'days_of_week', 'is_active', 'send_email',
            'send_notification', 'last_sent', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'last_sent', 'created_at', 'updated_at']


class EngagementNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EngagementNotification
        fields = [
            'id', 'trigger_type', 'title', 'message', 'action_url',
            'priority', 'is_active', 'send_email', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class NotificationPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationPreferences
        fields = [
            'id', 'enable_engagement', 'enable_email', 'enable_reminders',
            'quiet_hours_enabled', 'quiet_hours_start', 'quiet_hours_end',
            'enable_health_alerts', 'enable_exercise_reminders',
            'enable_pregnancy_tips', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
