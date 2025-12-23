"""
Nutrition Guide Models
Models for pregnancy nutrition guidance system
"""

from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.core.validators import MinValueValidator


class NutritionCategory(models.Model):
    """Food categories (Fruits, Vegetables, Proteins, etc.)"""
    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=50)  # Emoji or icon name
    description = models.TextField()
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order', 'name']
        verbose_name_plural = 'Nutrition Categories'
    
    def __str__(self):
        return self.name


class NutritionFood(models.Model):
    """Individual food items with nutritional information"""
    
    TRIMESTER_CHOICES = [
        (1, 'First Trimester'),
        (2, 'Second Trimester'),
        (3, 'Third Trimester'),
    ]
    
    category = models.ForeignKey(NutritionCategory, on_delete=models.CASCADE, related_name='foods')
    name = models.CharField(max_length=200)
    image = models.ImageField(upload_to='nutrition/', null=True, blank=True)
    description = models.TextField()
    
    # Nutritional information (per 100g)
    calories = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0)])
    protein = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    carbs = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    fats = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    fiber = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    
    # Pregnancy-specific information
    benefits = models.TextField(help_text="Why this food is good for pregnancy")
    serving_size = models.CharField(max_length=100, default="100g")
    trimester_recommended = models.JSONField(default=list, help_text="List of recommended trimesters [1,2,3]")
    warnings = models.TextField(blank=True, help_text="Any precautions or warnings")
    
    # Nutrients this food is rich in
    rich_in = models.JSONField(default=list, help_text='["Iron", "Calcium", "Folic Acid"]')
    
    # Recommendation flags
    is_recommended = models.BooleanField(default=True)
    is_avoid = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['category', 'name']
        verbose_name_plural = 'Nutrition Foods'
    
    def __str__(self):
        return f"{self.name} ({self.category.name})"


class NutritionTip(models.Model):
    """Daily nutrition tips for pregnant women"""
    
    TRIMESTER_CHOICES = [
        (1, 'First Trimester'),
        (2, 'Second Trimester'),
        (3, 'Third Trimester'),
        (0, 'All Trimesters'),
    ]
    
    title = models.CharField(max_length=200)
    content = models.TextField()
    trimester = models.IntegerField(choices=TRIMESTER_CHOICES, default=0)
    icon = models.CharField(max_length=50, default='💡')
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order', 'trimester']
        verbose_name_plural = 'Nutrition Tips'
    
    def __str__(self):
        return self.title
