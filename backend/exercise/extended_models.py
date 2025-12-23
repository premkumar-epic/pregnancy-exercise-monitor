from django.db import models

class Doctor(models.Model):
    """Healthcare providers available for selection"""
    name = models.CharField(max_length=200, help_text="Doctor's full name")
    specialization = models.CharField(max_length=100, default="Obstetrics & Gynecology")
    hospital = models.CharField(max_length=200, help_text="Primary hospital/clinic")
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'doctors'
        ordering = ['name']
    
    def __str__(self):
        return f"Dr. {self.name} - {self.specialization}"


class GuidanceArticle(models.Model):
    """Educational content for pregnancy guidance"""
    CATEGORY_CHOICES = [
        ('trimester', 'Trimester Guide'),
        ('health', 'Health & Wellness'),
        ('nutrition', 'Nutrition'),
        ('exercise', 'Exercise'),
        ('preparation', 'Birth Preparation'),
    ]
    
    title = models.CharField(max_length=200)
    content = models.TextField(help_text="Article content in markdown format")
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    trimester = models.IntegerField(
        null=True, blank=True,
        choices=[(1, 'First'), (2, 'Second'), (3, 'Third')],
        help_text="Specific trimester (leave blank for all)"
    )
    week_number = models.IntegerField(
        null=True, blank=True,
        help_text="Specific week number (leave blank for general content)"
    )
    icon = models.CharField(max_length=10, default='📚')
    order = models.IntegerField(default=0, help_text="Display order")
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'guidance_articles'
        ordering = ['order', 'trimester', 'week_number']
    
    def __str__(self):
        return f"{self.title} (T{self.trimester or 'All'})"


class FAQ(models.Model):
    """Frequently Asked Questions"""
    CATEGORY_CHOICES = [
        ('general', 'General'),
        ('health', 'Health'),
        ('nutrition', 'Nutrition'),
        ('exercise', 'Exercise'),
        ('symptoms', 'Symptoms'),
    ]
    
    question = models.CharField(max_length=300)
    answer = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='general')
    order = models.IntegerField(default=0)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'faqs'
        ordering = ['order', 'category']
        verbose_name = 'FAQ'
        verbose_name_plural = 'FAQs'
    
    def __str__(self):
        return self.question
