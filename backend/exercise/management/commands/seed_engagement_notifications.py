"""
Management command to seed engagement notification templates
Run with: python manage.py seed_engagement_notifications
"""

from django.core.management.base import BaseCommand
from exercise.models import EngagementNotification


class Command(BaseCommand):
    help = 'Seed engagement notification templates'

    def handle(self, *args, **kwargs):
        notifications = [
            {
                'trigger_type': 'inactive_user',
                'title': 'We miss you! 💙',
                'message': "It's been 3 days since your last workout. A quick 5-minute session can make a big difference for you and your baby!",
                'action_url': '/exercises',
                'priority': 'medium',
                'send_email': True,
            },
            {
                'trigger_type': 'streak_milestone',
                'title': '🔥 7-Day Streak!',
                'message': 'Amazing! You\'ve exercised 7 days in a row. Keep the momentum going!',
                'action_url': '/dashboard',
                'priority': 'low',
                'send_email': False,
            },
            {
                'trigger_type': 'new_content',
                'title': '✨ New Exercise Available!',
                'message': 'We just added a new pregnancy-safe exercise. Try it today!',
                'action_url': '/exercises',
                'priority': 'medium',
                'send_email': False,
            },
            {
                'trigger_type': 'health_tip',
                'title': '💡 Daily Health Tip',
                'message': 'Stay hydrated! Aim for 8-10 glasses of water throughout the day.',
                'action_url': '/dashboard',
                'priority': 'low',
                'send_email': False,
            },
            {
                'trigger_type': 'pregnancy_week',
                'title': '🤰 Pregnancy Milestone!',
                'message': 'Congratulations on reaching a new week! Check out this week\'s tips and exercises.',
                'action_url': '/pregnancy',
                'priority': 'medium',
                'send_email': True,
            },
            {
                'trigger_type': 'achievement',
                'title': '🏆 Achievement Unlocked!',
                'message': 'You\'ve completed 100 reps! You\'re doing amazing!',
                'action_url': '/dashboard',
                'priority': 'low',
                'send_email': False,
            },
            {
                'trigger_type': 'welcome_back',
                'title': 'Welcome Back! 👋',
                'message': 'Great to see you again! Ready to continue your fitness journey?',
                'action_url': '/exercises',
                'priority': 'low',
                'send_email': False,
            },
            {
                'trigger_type': 'weekly_summary',
                'title': '📊 Your Weekly Summary is Ready!',
                'message': 'Check out your progress from this week. You\'re making great strides!',
                'action_url': '/reports',
                'priority': 'medium',
                'send_email': True,
            },
        ]

        created_count = 0
        updated_count = 0

        for notif_data in notifications:
            notification, created = EngagementNotification.objects.update_or_create(
                trigger_type=notif_data['trigger_type'],
                defaults=notif_data
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created: {notification.title}')
                )
            else:
                updated_count += 1
                self.stdout.write(
                    self.style.WARNING(f'Updated: {notification.title}')
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'\nSeeding complete! Created: {created_count}, Updated: {updated_count}'
            )
        )
