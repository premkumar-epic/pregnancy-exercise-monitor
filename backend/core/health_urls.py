"""
Health check URLs
"""
from django.urls import path
from core.health import health_check_view, readiness_check_view, liveness_check_view

urlpatterns = [
    path('', health_check_view, name='health_check'),
    path('ready/', readiness_check_view, name='readiness_check'),
    path('alive/', liveness_check_view, name='liveness_check'),
]
