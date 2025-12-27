from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.exercises import views

router = DefaultRouter()
router.register(r'exercises', views.ExerciseViewSet, basename='exercise')
router.register(r'sessions', views.ExerciseSessionViewSet, basename='session')
router.register(r'activity-uploads', views.ActivityUploadViewSet, basename='activity-upload')
router.register(r'activity-data', views.ActivityDataViewSet, basename='activity-data')

urlpatterns = [
    path('', include(router.urls)),
    path('pregnancy-profile/', views.PregnancyProfileView.as_view()),
]
