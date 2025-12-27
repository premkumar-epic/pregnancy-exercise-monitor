import pytest
from django.urls import reverse
from rest_framework import status


@pytest.mark.django_db
class TestAuthenticationAPI:
    """Test cases for authentication endpoints"""
    
    def test_login_success(self, api_client, create_user):
        """Test successful login"""
        user = create_user(username='testuser', password='testpass123')
        url = reverse('token_obtain_pair')
        data = {
            'username': 'testuser',
            'password': 'testpass123'
        }
        response = api_client.post(url, data)
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data
    
    def test_login_invalid_credentials(self, api_client):
        """Test login with invalid credentials"""
        url = reverse('token_obtain_pair')
        data = {
            'username': 'wronguser',
            'password': 'wrongpass'
        }
        response = api_client.post(url, data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_refresh_token(self, api_client, create_user):
        """Test token refresh"""
        user = create_user()
        # First get tokens
        url = reverse('token_obtain_pair')
        data = {'username': user.username, 'password': 'testpass123'}
        response = api_client.post(url, data)
        refresh_token = response.data['refresh']
        
        # Then refresh
        url = reverse('token_refresh')
        data = {'refresh': refresh_token}
        response = api_client.post(url, data)
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data


@pytest.mark.django_db
class TestProtectedEndpoints:
    """Test cases for protected API endpoints"""
    
    def test_unauthenticated_access_denied(self, api_client):
        """Test that unauthenticated requests are denied"""
        url = '/api/admin-analytics/'
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_authenticated_access_allowed(self, authenticated_client):
        """Test that authenticated requests are allowed"""
        url = '/api/admin-analytics/'
        response = authenticated_client.get(url)
        # Should return 200 or 403 (if not admin), but not 401
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_403_FORBIDDEN]
