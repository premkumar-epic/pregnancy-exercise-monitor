"""
User Registration View
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from exercise.models import UserProfile


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    Register a new user with patient role
    """
    try:
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        
        # Debug logging
        print(f"DEBUG - Registration attempt:")
        print(f"  Username: {username}")
        print(f"  Email received: '{email}' (type: {type(email)})")
        print(f"  Password: {'*' * len(password) if password else None}")
        
        # Validate required fields
        if not username or not password:
            return Response(
                {'error': 'Username and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Use username as email if email not provided or empty
        if not email or (isinstance(email, str) and email.strip() == ''):
            email = f"{username}@example.com"
            print(f"DEBUG - No email provided, using: {email}")
        else:
            email = email.strip()  # Remove any whitespace
            print(f"DEBUG - Using provided email: {email}")
        
        # Check if username already exists
        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Username already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        print(f"DEBUG - User created: {user.username} with email: {user.email}")
        
        # Create patient profile
        UserProfile.objects.create(
            user=user,
            role='patient'
        )
        
        # Send welcome notification and email
        from .notification_utils import notify_welcome
        notify_welcome(user)
        
        return Response({
            'message': 'User registered successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': 'patient'
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {'error': f'Registration failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
