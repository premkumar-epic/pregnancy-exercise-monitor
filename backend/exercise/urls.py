from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import PregnancyProfileView
from .weekly_report_view import weekly_report
from .admin_views import admin_analytics, user_list, user_growth_data, activity_trends, delete_user
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
