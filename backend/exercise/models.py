from django.db import models
from django.contrib.auth.models import User
from datetime import timedelta, date
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator


class Exercise(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    difficulty = models.CharField(max_length=20, default='easy')
    target_joints = models.CharField(max_length=100, default='knee,hip')

    def __str__(self):
        return self.name


class ExerciseSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    rep_count = models.IntegerField(default=0)
    avg_posture_score = models.FloatField(default=0.0)
    posture_warnings = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.exercise.name}"



class ActivityUpload(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file_name = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='processing')
    summary_stats = models.JSONField(default=dict)

class ActivityData(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    steps = models.IntegerField(default=0)
    avg_heart_rate = models.FloatField(null=True, blank=True)
    calories = models.FloatField(default=0)
    active_minutes = models.IntegerField(default=0)
    sleep_minutes = models.IntegerField(default=0)

class PregnancyProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    lmp_date = models.DateField(null=True, blank=True)  # ✅ FIX
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)



    @property
    def current_week(self):
        today = timezone.now().date()
        weeks = (today - self.lmp_date).days // 7
        return min(max(weeks, 0), 40)

    @property
    def trimester(self):
        if self.current_week <= 13:
            return 1
        elif self.current_week <= 27:
            return 2
        return 3

    @property
    def due_date(self):
        return self.lmp_date + timedelta(days=280)

    @property
    def weeks_remaining(self):
        return max(0, 40 - self.current_week)

    def __str__(self):
        return f"{self.user.username} - Week {self.current_week}"


class PregnancyContent(models.Model):
    CONTENT_TYPES = [
        ('tip', 'Tip'),
        ('warning', 'Warning'),
        ('info', 'Information'),
    ]
    trimester = models.IntegerField()
    week_min = models.IntegerField()
    week_max = models.IntegerField()
    content_type = models.CharField(max_length=20, choices=CONTENT_TYPES)
    title = models.CharField(max_length=200)
    body = models.TextField()
    is_safe = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.trimester} - {self.title}"


class UserProfile(models.Model):
    """Extended user profile with role-based access and comprehensive health information"""
    ROLE_CHOICES = [
        ('admin', 'Administrator'),
        ('patient', 'Patient'),
        ('doctor', 'Doctor/Physiotherapist'),
    ]
    
    BLOOD_TYPE_CHOICES = [
        ('A+', 'A+'), ('A-', 'A-'),
        ('B+', 'B+'), ('B-', 'B-'),
        ('AB+', 'AB+'), ('AB-', 'AB-'),
        ('O+', 'O+'), ('O-', 'O-'),
    ]
    
    # Core fields
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default='patient',
        help_text='User role for access control'
    )
    
    # Personal Information
    full_name = models.CharField(max_length=200, blank=True, help_text='Full legal name')
    date_of_birth = models.DateField(null=True, blank=True, help_text='Date of birth')
    phone_number = models.CharField(max_length=20, blank=True, help_text='Contact phone number')
    profile_picture = models.ImageField(upload_to='profiles/', null=True, blank=True)
    
    # Pregnancy Information
    lmp_date = models.DateField(null=True, blank=True, help_text='Last Menstrual Period date')
    doctor_name = models.CharField(max_length=200, blank=True, help_text='Primary doctor/OB-GYN')
    hospital = models.CharField(max_length=200, blank=True, help_text='Hospital or clinic')
    
    # Physical Metrics
    height = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True,
        validators=[MinValueValidator(50), MaxValueValidator(250)],
        help_text='Height in centimeters'
    )
    weight = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True,
        validators=[MinValueValidator(20), MaxValueValidator(300)],
        help_text='Current weight in kilograms'
    )
    pre_pregnancy_weight = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True,
        validators=[MinValueValidator(20), MaxValueValidator(300)],
        help_text='Weight before pregnancy in kilograms'
    )
    blood_type = models.CharField(max_length=5, choices=BLOOD_TYPE_CHOICES, blank=True)
    
    # Medical History
    medical_conditions = models.TextField(blank=True, help_text='Pre-existing medical conditions')
    allergies = models.TextField(blank=True, help_text='Known allergies')
    medications = models.TextField(blank=True, help_text='Current medications')
    previous_pregnancies = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(20)],
        help_text='Number of previous pregnancies'
    )
    
    # Emergency Contact
    emergency_contact_name = models.CharField(max_length=200, blank=True)
    emergency_contact_relationship = models.CharField(max_length=100, blank=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_profile'
    
    def __str__(self):
        return f"{self.user.username} ({self.role})"
    
    # Auto-calculated properties
    @property
    def age(self):
        """Calculate age from date of birth"""
        if self.date_of_birth:
            today = date.today()
            return today.year - self.date_of_birth.year - (
                (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day)
            )
        return None
    
    @property
    def bmi(self):
        """Calculate BMI from height and weight"""
        if self.height and self.weight:
            height_m = float(self.height) / 100
            return round(float(self.weight) / (height_m ** 2), 1)
        return None
    
    @property
    def due_date(self):
        """Calculate due date from LMP (280 days / 40 weeks)"""
        if self.lmp_date:
            return self.lmp_date + timedelta(days=280)
        return None
    
    @property
    def pregnancy_week(self):
        """Calculate current pregnancy week from LMP"""
        if self.lmp_date:
            days_pregnant = (date.today() - self.lmp_date).days
            return days_pregnant // 7
        return None
    
    @property
    def trimester(self):
        """Calculate current trimester from pregnancy week"""
        week = self.pregnancy_week
        if week is not None:
            if week <= 13:
                return 1
            elif week <= 27:
                return 2
            else:
                return 3
        return None
    
    @property
    def days_until_due(self):
        """Calculate days until due date"""
        if self.due_date:
            return (self.due_date - date.today()).days
        return None
        return f"{self.user.username} ({self.get_role_display()})"
    
    @property
    def is_admin(self):
        return self.role == 'admin'
    
    @property
    def is_patient(self):
        return self.role == 'patient'
    
    @property
    def is_doctor(self):
        return self.role == 'doctor'


class HealthVitals(models.Model):
    """Simulated wearable health data for pregnant users"""
    STRESS_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='health_vitals')
    timestamp = models.DateTimeField(auto_now_add=True)
    
    # Vital Signs
    heart_rate = models.IntegerField(
        help_text="Heart rate in BPM (60-100 normal, higher in pregnancy)"
    )
    spo2 = models.IntegerField(
        help_text="Blood oxygen saturation percentage (95-100 normal)"
    )
    
    # Wellness Indicators
    stress_level = models.CharField(
        max_length=10,
        choices=STRESS_LEVELS,
        default='low',
        help_text="Perceived stress level"
    )
    fatigue_level = models.IntegerField(
        help_text="Fatigue level on 0-100 scale (higher = more fatigued)"
    )
    
    # Activity
    daily_active_minutes = models.IntegerField(
        default=0,
        help_text="Active minutes accumulated today"
    )
    
    # Metadata
    is_simulated = models.BooleanField(
        default=True,
        help_text="Indicates if data is simulated (not from real device)"
    )
    
    class Meta:
        db_table = 'health_vitals'
        ordering = ['-timestamp']
        verbose_name = 'Health Vital'
        verbose_name_plural = 'Health Vitals'
    
    def __str__(self):
        return f"{self.user.username} - {self.timestamp.strftime('%Y-%m-%d %H:%M')} - HR:{self.heart_rate}"
    
    @property
    def is_heart_rate_normal(self):
        """Check if heart rate is within pregnancy-safe range"""
        # Pregnancy-adjusted normal range: 70-110 BPM
        return 70 <= self.heart_rate <= 110
    
    @property
    def is_spo2_normal(self):
        """Check if SpO2 is within normal range"""
        return self.spo2 >= 95
    
    @property
    def energy_level(self):
        """Calculate energy level (inverse of fatigue)"""
        return 100 - self.fatigue_level
    
    def __str__(self):
        return f"{self.user.username} - {self.timestamp.strftime('%Y-%m-%d %H:%M')}"


class Notification(models.Model):
    """In-app notifications for users"""
    NOTIFICATION_TYPES = [
        ('exercise_reminder', 'Exercise Reminder'),
        ('exercise_complete', 'Exercise Completed'),
        ('health_alert', 'Health Alert'),
        ('milestone', 'Pregnancy Milestone'),
        ('achievement', 'Achievement'),
        ('doctor_alert', 'Doctor Alert'),
        ('system', 'System Notification'),
    ]
    
    PRIORITY_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES)
    priority = models.CharField(max_length=20, choices=PRIORITY_LEVELS, default='medium')
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    action_url = models.CharField(max_length=500, blank=True, null=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['user', 'is_read']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.title}"


# Import reminder models
from .reminder_models import CustomReminder, EngagementNotification, NotificationPreferences

# Import nutrition models
from .nutrition_models import NutritionCategory, NutritionFood, NutritionTip

# Import extended models (Doctor, Guidance, FAQ)
from .extended_models import Doctor, GuidanceArticle, FAQ
