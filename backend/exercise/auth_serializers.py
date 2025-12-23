# Custom JWT serializer to include user role in token response

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from exercise.models import UserProfile


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Add custom claims
        try:
            profile = UserProfile.objects.get(user=user)
            token['role'] = profile.role
        except UserProfile.DoesNotExist:
            token['role'] = 'patient'  # Default role
        
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Add user info to response
        try:
            profile = UserProfile.objects.get(user=self.user)
            role = profile.role
        except UserProfile.DoesNotExist:
            role = 'patient'
        
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'role': role
        }
        
        return data


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
