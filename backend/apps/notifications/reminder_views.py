"""
Custom Reminder API Views
Endpoints for managing custom reminders and notification preferences
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from exercise.models import CustomReminder, EngagementNotification, NotificationPreferences
from apps.notifications.serializers import (
    CustomReminderSerializer,
    EngagementNotificationSerializer,
    NotificationPreferencesSerializer
)


# =========================
# Custom Reminders
# =========================

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def reminder_list_create(request):
    """
    GET: List all user reminders
    POST: Create new reminder
    """
    if request.method == 'GET':
        reminders = CustomReminder.objects.filter(user=request.user)
        serializer = CustomReminderSerializer(reminders, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = CustomReminderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def reminder_detail(request, reminder_id):
    """
    GET: Get reminder details
    PUT: Update reminder
    DELETE: Delete reminder
    """
    try:
        reminder = CustomReminder.objects.get(id=reminder_id, user=request.user)
    except CustomReminder.DoesNotExist:
        return Response(
            {'error': 'Reminder not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if request.method == 'GET':
        serializer = CustomReminderSerializer(reminder)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = CustomReminderSerializer(reminder, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        reminder.delete()
        return Response({'message': 'Reminder deleted'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reminder_toggle(request, reminder_id):
    """Toggle reminder active status"""
    try:
        reminder = CustomReminder.objects.get(id=reminder_id, user=request.user)
        reminder.is_active = not reminder.is_active
        reminder.save()
        return Response({
            'message': f'Reminder {"activated" if reminder.is_active else "deactivated"}',
            'is_active': reminder.is_active
        })
    except CustomReminder.DoesNotExist:
        return Response(
            {'error': 'Reminder not found'},
            status=status.HTTP_404_NOT_FOUND
        )


# =========================
# Notification Preferences
# =========================

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def notification_preferences(request):
    """
    GET: Get user notification preferences
    PUT: Update notification preferences
    """
    # Get or create preferences
    preferences, created = NotificationPreferences.objects.get_or_create(
        user=request.user
    )
    
    if request.method == 'GET':
        serializer = NotificationPreferencesSerializer(preferences)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = NotificationPreferencesSerializer(
            preferences,
            data=request.data,
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =========================
# Engagement Notifications (Admin)
# =========================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def engagement_notification_list(request):
    """List all engagement notification templates"""
    notifications = EngagementNotification.objects.filter(is_active=True)
    serializer = EngagementNotificationSerializer(notifications, many=True)
    return Response(serializer.data)
