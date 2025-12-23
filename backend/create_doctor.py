"""
Create doctor user for testing
Run this script after migrations
"""

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pregnancy.settings')
django.setup()

from django.contrib.auth.models import User
from exercise.models import UserProfile

def create_doctor_user():
    """Create a doctor/physiotherapist user for testing"""
    
    # Check if doctor already exists
    if User.objects.filter(username='doctor').exists():
        print('✓ Doctor user already exists')
        doctor = User.objects.get(username='doctor')
        print(f'  Username: doctor')
        print(f'  Email: {doctor.email}')
        return
    
    try:
        # Create doctor user
        doctor = User.objects.create_user(
            username='doctor',
            email='doctor@example.com',
            password='doctor123'
        )
        
        # Create doctor profile
        UserProfile.objects.create(
            user=doctor,
            role='doctor'
        )
        
        print('✓ Doctor user created successfully!')
        print(f'  Username: doctor')
        print(f'  Password: doctor123')
        print(f'  Email: doctor@example.com')
        print(f'  Role: Doctor/Physiotherapist')
        
    except Exception as e:
        print(f'✗ Error creating doctor user: {e}')

if __name__ == '__main__':
    create_doctor_user()
