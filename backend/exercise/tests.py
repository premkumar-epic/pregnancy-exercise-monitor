import pytest
from django.contrib.auth.models import User
from exercise.models import UserProfile


@pytest.mark.django_db
class TestUserModel:
    """Test cases for User model"""
    
    def test_create_user(self):
        """Test creating a new user"""
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        assert user.username == 'testuser'
        assert user.email == 'test@example.com'
        assert user.check_password('testpass123')
    
    def test_user_str(self):
        """Test user string representation"""
        user = User.objects.create_user(username='testuser')
        assert str(user) == 'testuser'


@pytest.mark.django_db
class TestUserProfile:
    """Test cases for UserProfile model"""
    
    def test_create_user_profile(self):
        """Test creating a user profile"""
        user = User.objects.create_user(username='testuser')
        profile = UserProfile.objects.create(
            user=user,
            role='patient',
            phone='1234567890'
        )
        assert profile.user == user
        assert profile.role == 'patient'
        assert profile.phone == '1234567890'
    
    def test_user_profile_defaults(self):
        """Test user profile default values"""
        user = User.objects.create_user(username='testuser')
        profile = UserProfile.objects.create(user=user)
        assert profile.role == 'patient'
        assert profile.phone == ''
