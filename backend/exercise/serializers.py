import csv
from io import StringIO
from rest_framework import serializers
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from .models import (
    Exercise, ExerciseSession, ActivityUpload, ActivityData,
    PregnancyProfile, PregnancyContent, HealthVitals, Notification,
    CustomReminder, EngagementNotification, NotificationPreferences,
    NutritionCategory, NutritionFood, NutritionTip, UserProfile,
    Doctor, GuidanceArticle, FAQ
)

# =========================
# Exercise
# =========================
class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = '__all__'

# =========================
# Exercise Session
# =========================
class ExerciseSessionSerializer(serializers.ModelSerializer):
    exercise_id = serializers.IntegerField(write_only=True)
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = ExerciseSession
        fields = ['id', 'exercise_id', 'rep_count', 'avg_posture_score',
                 'posture_warnings', 'start_time', 'end_time', 'user']
        read_only_fields = ['id', 'start_time', 'user']

    def create(self, validated_data):
        exercise_id = validated_data.pop('exercise_id')
        validated_data['exercise'] = Exercise.objects.get(id=exercise_id)
        return super().create(validated_data)

# =========================
# Activity Data
# =========================
class ActivityDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityData
        fields = '__all__'

# =========================
# Activity Upload (CSV)
# =========================
class ActivityUploadSerializer(serializers.ModelSerializer):
    file = serializers.FileField(write_only=True)

    class Meta:
        model = ActivityUpload
        fields = ['id', 'file', 'file_name', 'status', 'summary_stats']
        read_only_fields = ['id', 'file_name', 'status', 'summary_stats']

    def create(self, validated_data):
        request = self.context['request']
        csv_file = validated_data.pop('file')
        upload = ActivityUpload.objects.create(
            user=request.user,
            file_name=csv_file.name,
            status='processing'
        )
        self.parse_csv(upload, csv_file)
        return upload

    def parse_csv(self, upload, csv_file):
        content = csv_file.read().decode('utf-8')
        reader = csv.DictReader(StringIO(content))
        daily_data = {}

        for row in reader:
            date = row.get('date') or row.get('timestamp')
            if not date: continue

            steps = int(row.get('steps', 0) or 0)
            heart_rate = float(row.get('heart_rate', 0) or 0)
            calories = float(row.get('calories', 0) or 0)
            sleep = int(row.get('sleep_minutes', 0) or 0)

            if date not in daily_data:
                daily_data[date] = {
                    'steps': 0, 'heart_rates': [], 'calories': 0, 'sleep': 0
                }

            daily_data[date]['steps'] += steps
            daily_data[date]['calories'] += calories
            daily_data[date]['sleep'] += sleep
            if heart_rate > 0:
                daily_data[date]['heart_rates'].append(heart_rate)

        for date, stats in daily_data.items():
            ActivityData.objects.create(
                user=upload.user, upload=upload, date=date,
                steps=stats['steps'],
                avg_heart_rate=sum(stats['heart_rates'])/len(stats['heart_rates']) if stats['heart_rates'] else None,
                calories=stats['calories'],
                sleep_minutes=stats['sleep']
            )

        upload.summary_stats = {
            'days_parsed': len(daily_data),
            'total_steps': sum(d['steps'] for d in daily_data.values())
        }
        upload.status = 'completed'
        upload.save()

# =========================
# Pregnancy Profile (FIXED!)
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
# Notification
# =========================
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'id', 'notification_type', 'priority', 'title', 'message',
            'is_read', 'created_at', 'action_url'
        ]
        read_only_fields = ['id', 'created_at']


# =========================
# Custom Reminders
# =========================
class CustomReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomReminder
        fields = [
            'id', 'reminder_type', 'title', 'message', 'scheduled_time',
            'frequency', 'days_of_week', 'is_active', 'send_email',
            'send_notification', 'last_sent', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'last_sent', 'created_at', 'updated_at']


class EngagementNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EngagementNotification
        fields = [
            'id', 'trigger_type', 'title', 'message', 'action_url',
            'priority', 'is_active', 'send_email', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class NotificationPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationPreferences
        fields = [
            'id', 'enable_engagement', 'enable_email', 'enable_reminders',
            'quiet_hours_enabled', 'quiet_hours_start', 'quiet_hours_end',
            'enable_health_alerts', 'enable_exercise_reminders',
            'enable_pregnancy_tips', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


# =========================
# Nutrition Guide
# =========================

class NutritionCategorySerializer(serializers.ModelSerializer):
    food_count = serializers.SerializerMethodField()
    
    class Meta:
        model = NutritionCategory
        fields = ['id', 'name', 'icon', 'description', 'order', 'food_count']
    
    def get_food_count(self, obj):
        return obj.foods.filter(is_recommended=True).count()


class NutritionFoodSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_icon = serializers.CharField(source='category.icon', read_only=True)
    
    class Meta:
        model = NutritionFood
        fields = [
            'id', 'category', 'category_name', 'category_icon', 'name', 'image',
            'description', 'calories', 'protein', 'carbs', 'fats', 'fiber',
            'benefits', 'serving_size', 'trimester_recommended', 'warnings',
            'rich_in', 'is_recommended', 'is_avoid', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class NutritionTipSerializer(serializers.ModelSerializer):
    trimester_display = serializers.CharField(source='get_trimester_display', read_only=True)
    
    class Meta:
        model = NutritionTip
        fields = ['id', 'title', 'content', 'trimester', 'trimester_display', 'icon', 'order']


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


# =========================
# Extended Models (Doctor, Guidance, FAQ)
# =========================

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ['id', 'name', 'specialization', 'hospital', 'phone', 'email']


class GuidanceArticleSerializer(serializers.ModelSerializer):
    trimester_display = serializers.CharField(source='get_trimester_display', read_only=True)
    
    class Meta:
        model = GuidanceArticle
        fields = [
            'id', 'title', 'content', 'category', 'trimester', 'trimester_display',
            'week_number', 'icon', 'order', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class FAQSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    
    class Meta:
        model = FAQ
        fields = ['id', 'question', 'answer', 'category', 'category_display', 'order']
