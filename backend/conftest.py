import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken


@pytest.fixture
def api_client():
    """Fixture for API client"""
    return APIClient()


@pytest.fixture
def create_user(db):
    """Fixture to create a test user"""
    def make_user(username='testuser', password='testpass123', **kwargs):
        return User.objects.create_user(
            username=username,
            password=password,
            **kwargs
        )
    return make_user


@pytest.fixture
def authenticated_client(api_client, create_user):
    """Fixture for authenticated API client"""
    user = create_user()
    refresh = RefreshToken.for_user(user)
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    api_client.user = user
    return api_client


@pytest.fixture
def admin_user(db):
    """Fixture to create an admin user"""
    return User.objects.create_superuser(
        username='admin',
        email='admin@test.com',
        password='admin123'
    )


@pytest.fixture
def admin_client(api_client, admin_user):
    """Fixture for authenticated admin client"""
    refresh = RefreshToken.for_user(admin_user)
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    api_client.user = admin_user
    return api_client
