from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView
from rest_framework_simplejwt.views import TokenRefreshView
from exercise.auth_serializers import CustomTokenObtainPairView
from exercise.registration_views import register_user

urlpatterns = [
    # Redirect root to admin
    path('', RedirectView.as_view(url='/admin/', permanent=False)),
    
    path('admin/', admin.site.urls),

    # JWT Auth
    path('api/auth/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/register/', register_user, name='register'),
    
    # Health Checks
    path('health/', include('core.health_urls')),
    path('ready/', include('core.health_urls')),
    path('alive/', include('core.health_urls')),

    # App APIs
    path('api/', include('exercise.urls')),

    # API Documentation
    path('api/schema/', include([
        path('', RedirectView.as_view(url='swagger-ui/', permanent=False)),
        path('download/', RedirectView.as_view(url='/api/schema/yaml/', permanent=False)),
        path('yaml/', include('drf_spectacular.urls')),
    ])),
    path('api/docs/', include([
        path('', include('drf_spectacular.urls')),
        path('swagger-ui/', include('drf_spectacular.urls')),
        path('redoc/', include('drf_spectacular.urls')),
    ])),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
