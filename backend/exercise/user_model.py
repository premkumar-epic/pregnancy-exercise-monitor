from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    """Extended User model with role-based access"""
    ROLE_CHOICES = [
        ('admin', 'Administrator'),
        ('patient', 'Patient'),
    ]
    
    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default='patient',
        help_text='User role for access control'
    )
    
    class Meta:
        db_table = 'auth_user'  # Use existing table
        
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
    
    @property
    def is_admin(self):
        return self.role == 'admin'
    
    @property
    is_patient(self):
        return self.role == 'patient'
