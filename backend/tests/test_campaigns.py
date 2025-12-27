import pytest
from django.urls import reverse
from rest_framework import status
from apps.notifications.models_email import EmailCampaign


@pytest.mark.django_db
class TestEmailCampaignAPI:
    """Test cases for email campaign endpoints"""
    
    def test_list_campaigns_unauthenticated(self, api_client):
        """Test that unauthenticated users cannot list campaigns"""
        url = '/api/admin/campaigns/'
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_list_campaigns_authenticated(self, admin_client):
        """Test listing campaigns as admin"""
        url = '/api/admin/campaigns/'
        response = admin_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)
    
    def test_create_campaign(self, admin_client):
        """Test creating a new campaign"""
        url = '/api/admin/campaigns/'
        data = {
            'title': 'Test Campaign',
            'subject': 'Test Subject',
            'message': 'Test message content',
            'segment': 'all'
        }
        response = admin_client.post(url, data)
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['title'] == 'Test Campaign'
        assert response.data['status'] == 'draft'
    
    def test_get_campaign_detail(self, admin_client):
        """Test getting campaign details"""
        # Create a campaign first
        campaign = EmailCampaign.objects.create(
            title='Test Campaign',
            subject='Test Subject',
            message='Test message',
            segment='all',
            created_by=admin_client.user
        )
        
        url = f'/api/admin/campaigns/{campaign.id}/'
        response = admin_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['title'] == 'Test Campaign'
    
    def test_update_campaign(self, admin_client):
        """Test updating a draft campaign"""
        campaign = EmailCampaign.objects.create(
            title='Original Title',
            subject='Original Subject',
            message='Original message',
            segment='all',
            status='draft',
            created_by=admin_client.user
        )
        
        url = f'/api/admin/campaigns/{campaign.id}/'
        data = {'title': 'Updated Title'}
        response = admin_client.put(url, data)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['title'] == 'Updated Title'
    
    def test_cannot_update_sent_campaign(self, admin_client):
        """Test that sent campaigns cannot be updated"""
        campaign = EmailCampaign.objects.create(
            title='Sent Campaign',
            subject='Subject',
            message='Message',
            segment='all',
            status='sent',
            created_by=admin_client.user
        )
        
        url = f'/api/admin/campaigns/{campaign.id}/'
        data = {'title': 'New Title'}
        response = admin_client.put(url, data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_delete_campaign(self, admin_client):
        """Test deleting a draft campaign"""
        campaign = EmailCampaign.objects.create(
            title='To Delete',
            subject='Subject',
            message='Message',
            segment='all',
            status='draft',
            created_by=admin_client.user
        )
        
        url = f'/api/admin/campaigns/{campaign.id}/'
        response = admin_client.delete(url)
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not EmailCampaign.objects.filter(id=campaign.id).exists()


@pytest.mark.django_db
class TestAnalyticsAPI:
    """Test cases for analytics endpoints"""
    
    def test_admin_analytics(self, admin_client):
        """Test admin analytics endpoint"""
        url = '/api/admin-analytics/'
        response = admin_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert 'total_users' in response.data
        assert 'active_users' in response.data
    
    def test_system_health(self, admin_client):
        """Test system health endpoint"""
        url = '/api/admin/system-health/'
        response = admin_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert 'database' in response.data
        assert 'cache' in response.data
    
    def test_retention_metrics(self, admin_client):
        """Test retention metrics endpoint"""
        url = '/api/admin/analytics/retention/'
        response = admin_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)
    
    def test_feature_adoption(self, admin_client):
        """Test feature adoption endpoint"""
        url = '/api/admin/analytics/feature-adoption/'
        response = admin_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)


@pytest.mark.django_db
class TestUserManagementAPI:
    """Test cases for user management endpoints"""
    
    def test_user_list(self, admin_client):
        """Test listing users"""
        url = '/api/user-list/'
        response = admin_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)
    
    def test_change_user_role(self, admin_client, create_user):
        """Test changing user role"""
        user = create_user(username='testuser')
        url = f'/api/admin/users/{user.id}/change-role/'
        data = {'role': 'doctor'}
        response = admin_client.post(url, data)
        assert response.status_code == status.HTTP_200_OK
    
    def test_delete_user(self, admin_client, create_user):
        """Test deleting a user"""
        user = create_user(username='todelete')
        url = f'/api/admin/users/{user.id}/delete/'
        response = admin_client.delete(url)
        assert response.status_code == status.HTTP_200_OK
