from rest_framework import serializers
from exercise.models import UserProfile


# =========================
# User Profile
# =========================

class UserProfileSerializer(serializers.ModelSerializer):
    # Auto-calculated read-only fields
    age = serializers.ReadOnlyField()
    bmi = serializers.ReadOnlyField()
    due_date = serializers.ReadOnlyField()
    pregnancy_week = serializers.ReadOnlyField()
    trimester = serializers.ReadOnlyField()
    days_until_due = serializers.ReadOnlyField()
    
    # User info
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'username', 'email', 'role',
            # Personal Information
            'full_name', 'date_of_birth', 'phone_number', 'profile_picture',
            # Pregnancy Information
            'lmp_date', 'doctor_name', 'hospital',
            # Physical Metrics
            'height', 'weight', 'pre_pregnancy_weight', 'blood_type',
            # Medical History
            'medical_conditions', 'allergies', 'medications', 'previous_pregnancies',
            # Emergency Contact
            'emergency_contact_name', 'emergency_contact_relationship', 'emergency_contact_phone',
            # Auto-calculated
            'age', 'bmi', 'due_date', 'pregnancy_week', 'trimester', 'days_until_due',
            # Timestamps
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'username', 'email', 'role',
            'age', 'bmi', 'due_date', 'pregnancy_week', 'trimester', 'days_until_due',
            'created_at', 'updated_at'
        ]
