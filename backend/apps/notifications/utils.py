"""
Notification Utility Functions
Helper functions to create and send notifications
"""

from .models import Notification
from .email_utils import (
    send_welcome_email,
    send_exercise_completion_email,
    send_health_alert_email,
    send_weekly_summary_email
)


def create_notification(user, notification_type, title, message, priority='medium', action_url=None, send_email=False):
    """
    Create an in-app notification
    
    Args:
        user: User object
        notification_type: Type of notification
        title: Notification title
        message: Notification message
        priority: Priority level (low/medium/high/critical)
        action_url: Optional URL to navigate to
        send_email: Whether to also send email notification
    
    Returns:
        Notification object
    """
    notification = Notification.objects.create(
        user=user,
        notification_type=notification_type,
        title=title,
        message=message,
        priority=priority,
        action_url=action_url
    )
    
    return notification


def notify_welcome(user):
    """Send welcome notification and email"""
    create_notification(
        user=user,
        notification_type='system',
        title='Welcome to AI Pregnancy Care! 🤰',
        message='Start your fitness journey with AI-powered exercise tracking and health monitoring.',
        priority='medium',
        action_url='/dashboard'
    )
    
    # Send welcome email
    send_welcome_email(user)


def notify_exercise_complete(user, session):
    """Notify user of exercise completion"""
    create_notification(
        user=user,
        notification_type='exercise_complete',
        title=f'Exercise Completed! 🎉',
        message=f'Great job! You completed {session.reps} reps of {session.exercise.name} with {session.avg_posture_score}% posture.',
        priority='low',
        action_url='/reports'
    )
    
    # Send completion email
    send_exercise_completion_email(user, session)


def notify_health_alert(user, alert_level, vitals_info):
    """Notify user of health alert"""
    priority_map = {
        'safe': 'low',
        'caution': 'medium',
        'warning': 'high',
        'danger': 'critical'
    }
    
    create_notification(
        user=user,
        notification_type='health_alert',
        title=f'⚠️ Health Alert - {alert_level.title()}',
        message=f'Your health vitals need attention: {vitals_info}. Please rest and monitor your condition.',
        priority=priority_map.get(alert_level, 'medium'),
        action_url='/dashboard'
    )
    
    # Send email for warning/danger levels
    if alert_level in ['warning', 'danger']:
        send_health_alert_email(user, alert_level, vitals_info)


def notify_pregnancy_milestone(user, week):
    """Notify user of pregnancy week milestone"""
    create_notification(
        user=user,
        notification_type='milestone',
        title=f'Week {week} Milestone! 🎉',
        message=f'Congratulations! You\'ve reached week {week} of your pregnancy journey.',
        priority='medium',
        action_url='/pregnancy'
    )


def notify_achievement(user, achievement_title, achievement_message):
    """Notify user of achievement"""
    create_notification(
        user=user,
        notification_type='achievement',
        title=f'Achievement Unlocked! 🏆',
        message=f'{achievement_title}: {achievement_message}',
        priority='low',
        action_url='/dashboard'
    )


def notify_exercise_reminder(user):
    """Remind user to exercise"""
    create_notification(
        user=user,
        notification_type='exercise_reminder',
        title='Time to Exercise! 💪',
        message='You haven\'t exercised today. A quick 10-minute session can make a big difference!',
        priority='low',
        action_url='/exercises'
    )


def notify_weekly_summary(user, stats):
    """Send weekly summary notification and email"""
    create_notification(
        user=user,
        notification_type='system',
        title='Your Weekly Progress Summary 📊',
        message=f'This week: {stats.get("total_sessions", 0)} sessions, {stats.get("total_reps", 0)} reps, {stats.get("avg_posture", 0)}% avg posture.',
        priority='medium',
        action_url='/reports'
    )
    
    # Send weekly summary email
    send_weekly_summary_email(user, stats)
