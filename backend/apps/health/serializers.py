from rest_framework import serializers
from exercise.models import HealthVitals, PregnancyProfile, PregnancyContent


# =========================
# Health Vitals
# =========================
class HealthVitalsSerializer(serializers.ModelSerializer):
    is_heart_rate_normal = serializers.ReadOnlyField()
    is_spo2_normal = serializers.ReadOnlyField()
    energy_level = serializers.ReadOnlyField()
    
    class Meta:
        model = HealthVitals
        fields = [
            'id', 'timestamp', 'heart_rate', 'spo2', 'stress_level',
            'fatigue_level', 'daily_active_minutes', 'is_simulated',
            'is_heart_rate_normal', 'is_spo2_normal', 'energy_level'
        ]
        read_only_fields = ['id', 'timestamp', 'is_simulated']


# =========================
# Pregnancy Profile
# =========================
class PregnancyProfileSerializer(serializers.ModelSerializer):
    current_week = serializers.ReadOnlyField()
    trimester = serializers.ReadOnlyField()
    due_date = serializers.ReadOnlyField()
    weeks_remaining = serializers.ReadOnlyField()

    class Meta:
        model = PregnancyProfile
        fields = ['id', 'lmp_date', 'current_week', 'trimester',
                 'due_date', 'weeks_remaining', 'created_at', 'updated_at']
        read_only_fields = ['current_week', 'trimester', 'due_date',
                           'weeks_remaining', 'created_at', 'updated_at']

# =========================
# Pregnancy Content
# =========================
class PregnancyContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PregnancyContent
        fields = '__all__'
