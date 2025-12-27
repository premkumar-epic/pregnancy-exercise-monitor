"""
User Profile API Views
Comprehensive profile management with auto-calculated pregnancy data
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from exercise.models import UserProfile
from apps.users.serializers import UserProfileSerializer


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """
    GET: Retrieve user profile with auto-calculated fields
    PUT: Update user profile
    """
    try:
        profile = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        # Create profile if it doesn't exist
        profile = UserProfile.objects.create(user=request.user)
    
    if request.method == 'GET':
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_profile_picture(request):
    """Upload or update profile picture"""
    try:
        profile = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        profile = UserProfile.objects.create(user=request.user)
    
    if 'profile_picture' not in request.FILES:
        return Response(
            {'error': 'No image file provided'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Delete old picture if exists
    if profile.profile_picture:
        profile.profile_picture.delete()
    
    profile.profile_picture = request.FILES['profile_picture']
    profile.save()
    
    serializer = UserProfileSerializer(profile)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_profile_picture(request):
    """Remove profile picture"""
    try:
        profile = UserProfile.objects.get(user=request.user)
        if profile.profile_picture:
            profile.profile_picture.delete()
            profile.save()
            return Response({'message': 'Profile picture deleted successfully'})
        return Response(
            {'error': 'No profile picture to delete'},
            status=status.HTTP_404_NOT_FOUND
        )
    except UserProfile.DoesNotExist:
        return Response(
            {'error': 'Profile not found'},
            status=status.HTTP_404_NOT_FOUND
        )
