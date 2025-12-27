"""
Email Utility Functions
Send emails for various events in the application
"""

from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags


def send_welcome_email(user):
    """Send welcome email to newly registered users"""
    subject = 'Welcome to AI Pregnancy Care! 🤰'
    
    html_message = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="margin: 0;">🤰 AI Pregnancy Care</h1>
                </div>
                <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
                    <h2>Welcome, {user.username}! 👋</h2>
                    <p>Thank you for joining AI Pregnancy Care! We're excited to support you on your pregnancy fitness journey.</p>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3>What you can do:</h3>
                        <ul>
                            <li>✅ Track 10 pregnancy-safe exercises</li>
                            <li>✅ Monitor your health vitals</li>
                            <li>✅ Get AI-powered form feedback</li>
                            <li>✅ View weekly progress reports</li>
                            <li>✅ Track pregnancy milestones</li>
                        </ul>
                    </div>
                    
                    <p style="text-align: center;">
                        <a href="http://localhost:5173/login" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
                            Get Started
                        </a>
                    </p>
                    
                    <p>If you have any questions, feel free to reach out!</p>
                    <p>Best regards,<br>The AI Pregnancy Care Team</p>
                </div>
                <div style="text-align: center; color: #666; font-size: 12px; margin-top: 30px;">
                    <p>© 2025 AI Pregnancy Care. All rights reserved.</p>
                    <p>This is an automated email. Please do not reply.</p>
                </div>
            </div>
        </body>
    </html>
    """
    
    plain_message = strip_tags(html_message)
    
    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Failed to send welcome email: {e}")
        return False


def send_exercise_completion_email(user, session):
    """Send email after exercise session completion"""
    subject = f'Exercise Completed - {session.exercise.name} 🎉'
    
    html_message = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="margin: 0;">🤰 AI Pregnancy Care</h1>
                </div>
                <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
                    <h2>Great Job! 🎉</h2>
                    <p>Hi {user.username},</p>
                    <p>You just completed a <strong>{session.exercise.name}</strong> session!</p>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
                            <span>Reps Completed:</span>
                            <strong>{session.reps}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
                            <span>Average Posture:</span>
                            <strong>{session.avg_posture_score}%</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 10px 0;">
                            <span>Duration:</span>
                            <strong>{session.duration} seconds</strong>
                        </div>
                    </div>
                    
                    <p>Keep up the excellent work! Consistency is key to a healthy pregnancy.</p>
                    
                    <p style="text-align: center;">
                        <a href="http://localhost:5173/dashboard" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
                            View Dashboard
                        </a>
                    </p>
                </div>
                <div style="text-align: center; color: #666; font-size: 12px; margin-top: 30px;">
                    <p>© 2025 AI Pregnancy Care. All rights reserved.</p>
                </div>
            </div>
        </body>
    </html>
    """
    
    plain_message = strip_tags(html_message)
    
    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Failed to send exercise completion email: {e}")
        return False


def send_health_alert_email(user, alert_level, vitals_info):
    """Send critical health alert email"""
    subject = '⚠️ Health Alert - Please Review'
    
    html_message = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="margin: 0;">🤰 AI Pregnancy Care</h1>
                </div>
                <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
                    <h2>⚠️ Health Alert</h2>
                    <p>Hi {user.username},</p>
                    <p>We detected some concerning health vitals during your recent activity:</p>
                    
                    <div style="background: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444; margin: 20px 0;">
                        <h3>Alert Level: {alert_level.upper()}</h3>
                        <p><strong>Details:</strong> {vitals_info}</p>
                    </div>
                    
                    <p><strong>Recommendations:</strong></p>
                    <ul>
                        <li>Take a rest</li>
                        <li>Stay hydrated</li>
                        <li>Monitor your symptoms</li>
                        <li>Consult your doctor if symptoms persist</li>
                    </ul>
                    
                    <p style="text-align: center;">
                        <a href="http://localhost:5173/dashboard" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
                            View Health Dashboard
                        </a>
                    </p>
                    
                    <p><em>This is an automated alert. Always consult your healthcare provider for medical advice.</em></p>
                </div>
                <div style="text-align: center; color: #666; font-size: 12px; margin-top: 30px;">
                    <p>© 2025 AI Pregnancy Care. All rights reserved.</p>
                </div>
            </div>
        </body>
    </html>
    """
    
    plain_message = strip_tags(html_message)
    
    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Failed to send health alert email: {e}")
        return False


def send_weekly_summary_email(user, stats):
    """Send weekly progress summary email"""
    subject = 'Your Weekly Progress Summary 📊'
    
    html_message = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="margin: 0;">🤰 AI Pregnancy Care</h1>
                </div>
                <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
                    <h2>Your Weekly Progress 📊</h2>
                    <p>Hi {user.username},</p>
                    <p>Here's your activity summary for the past week:</p>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
                            <span>Total Sessions:</span>
                            <strong>{stats.get('total_sessions', 0)}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
                            <span>Total Reps:</span>
                            <strong>{stats.get('total_reps', 0)}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
                            <span>Average Posture:</span>
                            <strong>{stats.get('avg_posture', 0)}%</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 10px 0;">
                            <span>Active Days:</span>
                            <strong>{stats.get('active_days', 0)}/7</strong>
                        </div>
                    </div>
                    
                    <p>Keep up the great work! 🌟</p>
                    
                    <p style="text-align: center;">
                        <a href="http://localhost:5173/reports" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
                            View Full Report
                        </a>
                    </p>
                </div>
                <div style="text-align: center; color: #666; font-size: 12px; margin-top: 30px;">
                    <p>© 2025 AI Pregnancy Care. All rights reserved.</p>
                </div>
            </div>
        </body>
    </html>
    """
    
    plain_message = strip_tags(html_message)
    
    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Failed to send weekly summary email: {e}")
        return False


def send_email(to_email, subject, message):
    """
    Generic email sending function for campaigns and custom emails
    
    Args:
        to_email: Recipient email address
        subject: Email subject
        message: Email message (can be HTML or plain text)
    """
    try:
        send_mail(
            subject=subject,
            message=strip_tags(message),  # Plain text version
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[to_email],
            html_message=message,  # HTML version
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")
        raise e  # Re-raise for campaign error tracking

