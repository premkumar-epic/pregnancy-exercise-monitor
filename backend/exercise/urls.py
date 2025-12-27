from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import PregnancyProfileView
from .weekly_report_view import weekly_report
from .admin_views import admin_analytics, user_list, user_growth_data, activity_trends, delete_user
from apps.reports.admin_views import change_user_role
from apps.reports.audit_views import audit_logs
from .health_views import (
    current_health_vitals, health_vitals_history, 
    check_exercise_safety, health_dashboard_summary
)
from .doctor_views import doctor_patient_list, doctor_patient_detail, create_doctor_user
from .notification_views import (
    get_notifications, mark_notification_read, mark_all_notifications_read,
    delete_notification, clear_all_notifications
)
from .reminder_views import (
    reminder_list_create, reminder_detail, reminder_toggle,
    notification_preferences, engagement_notification_list
)
from .nutrition_views import (
    nutrition_categories, nutrition_foods, nutrition_food_detail,
    nutrition_tips, nutrition_recommended, nutrition_avoid
)
from .profile_views import (
    user_profile, upload_profile_picture, delete_profile_picture
)
from . import extended_views

# CMS imports
from apps.exercises.cms_views import manage_exercises, manage_exercise_detail
from apps.nutrition.cms_views import create_nutrition_food, manage_nutrition_food
from apps.guidance.cms_views import create_guidance_article, manage_guidance_article, create_faq, manage_faq

# Email campaign imports
from apps.notifications.campaign_views import manage_campaigns, manage_campaign_detail, send_campaign

# Analytics imports
from apps.reports.analytics_views import retention_metrics, feature_adoption, engagement_metrics

# System health imports
from apps.reports.health_views import system_health


router = DefaultRouter()

router.register(r'exercises', views.ExerciseViewSet, basename='exercise')
router.register(r'sessions', views.ExerciseSessionViewSet, basename='session')
router.register(r'activity-uploads', views.ActivityUploadViewSet, basename='activity-upload')
router.register(r'activity-data', views.ActivityDataViewSet, basename='activity-data')
router.register(r'pregnancy-content', views.PregnancyContentViewSet, basename='pregnancy-content')

urlpatterns = [
    path('', include(router.urls)),
    path('pregnancy-profile/', PregnancyProfileView.as_view()),
    path('weekly-report/', weekly_report, name='weekly-report'),
    path('admin-analytics/', admin_analytics, name='admin-analytics'),
    path('user-list/', user_list, name='user-list'),
    path('user-growth/', user_growth_data, name='user-growth'),
    path('activity-trends/', activity_trends, name='activity-trends'),
    path('admin/users/<int:user_id>/delete/', delete_user, name='delete-user'),
    path('admin/users/<int:user_id>/change-role/', change_user_role, name='change-user-role'),
    path('admin/audit-logs/', audit_logs, name='audit-logs'),  # NEW: Audit logs endpoint
    
    # CMS Endpoints (Admin only)
    path('admin/cms/exercises/', manage_exercises, name='cms-exercises'),
    path('admin/cms/exercises/<int:exercise_id>/', manage_exercise_detail, name='cms-exercise-detail'),
    path('admin/cms/nutrition/foods/', create_nutrition_food, name='cms-create-food'),
    path('admin/cms/nutrition/foods/<int:food_id>/', manage_nutrition_food, name='cms-manage-food'),
    path('admin/cms/guidance/articles/', create_guidance_article, name='cms-create-article'),
    path('admin/cms/guidance/articles/<int:article_id>/', manage_guidance_article, name='cms-manage-article'),
    path('admin/cms/faqs/', create_faq, name='cms-create-faq'),
    path('admin/cms/faqs/<int:faq_id>/', manage_faq, name='cms-manage-faq'),
    
    # Email Campaign Endpoints (Admin only)
    path('admin/campaigns/', manage_campaigns, name='manage-campaigns'),
    path('admin/campaigns/<int:campaign_id>/', manage_campaign_detail, name='manage-campaign-detail'),
    path('admin/campaigns/<int:campaign_id>/send/', send_campaign, name='send-campaign'),
    
    # Advanced Analytics Endpoints (Admin only)
    path('admin/analytics/retention/', retention_metrics, name='retention-metrics'),
    path('admin/analytics/feature-adoption/', feature_adoption, name='feature-adoption'),
    path('admin/analytics/engagement/', engagement_metrics, name='engagement-metrics'),
    
    # System Health Monitoring (Admin only)
    path('admin/system-health/', system_health, name='system-health'),
    
    # Health Monitoring Endpoints
    path('current-health-vitals/', current_health_vitals, name='current-health-vitals'),
    path('health-vitals-history/', health_vitals_history, name='health-vitals-history'),
    path('check-exercise-safety/', check_exercise_safety, name='check-exercise-safety'),
    path('health-dashboard-summary/', health_dashboard_summary, name='health-dashboard-summary'),
    
    # Doctor/Physiotherapist Endpoints
    path('doctor/patients/', doctor_patient_list, name='doctor-patient-list'),
    path('doctor/patient/<int:patient_id>/', doctor_patient_detail, name='doctor-patient-detail'),
    path('doctor/create/', create_doctor_user, name='create-doctor-user'),
    
    # Notification Endpoints
    path('notifications/', get_notifications, name='get-notifications'),
    path('notifications/<int:notification_id>/read/', mark_notification_read, name='mark-notification-read'),
    path('notifications/mark-all-read/', mark_all_notifications_read, name='mark-all-notifications-read'),
    path('notifications/<int:notification_id>/delete/', delete_notification, name='delete-notification'),
    path('notifications/clear-all/', clear_all_notifications, name='clear-all-notifications'),
    
    # Custom Reminder Endpoints
    path('reminders/', reminder_list_create, name='reminder-list-create'),
    path('reminders/<int:reminder_id>/', reminder_detail, name='reminder-detail'),
    path('reminders/<int:reminder_id>/toggle/', reminder_toggle, name='reminder-toggle'),
    
    # Notification Preferences
    path('notification-preferences/', notification_preferences, name='notification-preferences'),
    
    # Engagement Notifications
    path('engagement-notifications/', engagement_notification_list, name='engagement-notification-list'),
    
    # Nutrition Guide
    path('nutrition/categories/', nutrition_categories, name='nutrition-categories'),
    path('nutrition/foods/', nutrition_foods, name='nutrition-foods'),
    path('nutrition/foods/<int:food_id>/', nutrition_food_detail, name='nutrition-food-detail'),
    path('nutrition/tips/', nutrition_tips, name='nutrition-tips'),
    path('nutrition/recommended/', nutrition_recommended, name='nutrition-recommended'),
    path('nutrition/avoid/', nutrition_avoid, name='nutrition-avoid'),
    
    # User Profile
    path('profile/', user_profile, name='user-profile'),
    path('profile/picture/', upload_profile_picture, name='upload-profile-picture'),
    path('profile/picture/delete/', delete_profile_picture, name='delete-profile-picture'),
    
    # Extended Features (Doctor, Guidance, FAQ)
    path('doctors/', extended_views.list_doctors, name='list-doctors'),
    path('guidance/', extended_views.get_guidance, name='get-guidance'),
    path('faqs/', extended_views.get_faqs, name='get-faqs'),
]
