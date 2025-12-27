"""
Database query optimization utilities
"""
from django.db import models, connection
from django.db.models import Prefetch, Count, Avg, Max, Min
from django.core.cache import cache
import logging

logger = logging.getLogger(__name__)


class QueryOptimizationMixin:
    """
    Mixin to add query optimization methods to models
    """
    
    @classmethod
    def optimized_list(cls):
        """
        Return optimized queryset for list views
        Override in model to customize
        """
        return cls.objects.all()
    
    @classmethod
    def optimized_detail(cls):
        """
        Return optimized queryset for detail views
        Override in model to customize
        """
        return cls.objects.all()


def log_queries(func):
    """
    Decorator to log database queries for debugging
    """
    def wrapper(*args, **kwargs):
        from django.conf import settings
        if settings.DEBUG:
            from django.db import reset_queries
            reset_queries()
            
        result = func(*args, **kwargs)
        
        if settings.DEBUG:
            queries = connection.queries
            logger.debug(f"{func.__name__} executed {len(queries)} queries")
            for query in queries:
                logger.debug(f"Query: {query['sql'][:200]}... ({query['time']}s)")
        
        return result
    return wrapper


# Common query optimizations for models

def optimize_user_queryset(queryset):
    """Optimize User queryset with related data"""
    return queryset.select_related(
        'profile'
    ).prefetch_related(
        'groups',
        'user_permissions'
    )


def optimize_exercise_session_queryset(queryset):
    """Optimize ExerciseSession queryset"""
    return queryset.select_related(
        'user',
        'user__profile'
    ).prefetch_related(
        Prefetch('activitydata_set', to_attr='activities')
    )


def optimize_campaign_queryset(queryset):
    """Optimize EmailCampaign queryset"""
    return queryset.select_related(
        'created_by'
    ).prefetch_related(
        'logs'
    ).annotate(
        total_logs=Count('logs'),
        sent_logs=Count('logs', filter=models.Q(logs__status='sent'))
    )


# Index suggestions for models
INDEX_SUGGESTIONS = {
    'User': [
        ('username',),
        ('email',),
        ('is_active', 'date_joined'),
    ],
    'UserProfile': [
        ('user',),
        ('role',),
        ('created_at',),
    ],
    'ExerciseSession': [
        ('user', 'created_at'),
        ('created_at',),
        ('duration',),
    ],
    'EmailCampaign': [
        ('status', 'created_at'),
        ('segment',),
        ('created_by',),
    ],
    'AuditLog': [
        ('user', 'timestamp'),
        ('action', 'timestamp'),
        ('timestamp',),
    ],
}


def analyze_query_performance():
    """
    Analyze and report on query performance
    Returns suggestions for optimization
    """
    from django.db import connection
    
    suggestions = []
    
    # Check for N+1 queries
    queries = connection.queries
    query_patterns = {}
    
    for query in queries:
        sql = query['sql']
        # Simple pattern matching for similar queries
        pattern = sql.split('WHERE')[0] if 'WHERE' in sql else sql
        query_patterns[pattern] = query_patterns.get(pattern, 0) + 1
    
    # Report repeated queries
    for pattern, count in query_patterns.items():
        if count > 5:
            suggestions.append({
                'type': 'N+1 Query',
                'pattern': pattern[:100],
                'count': count,
                'suggestion': 'Consider using select_related() or prefetch_related()'
            })
    
    return suggestions


# Cache warming utilities

def warm_analytics_cache():
    """
    Pre-populate cache with analytics data
    Run this after deployment or data updates
    """
    from django.contrib.auth.models import User
    from exercise.models import ExerciseSession
    
    # Cache user statistics
    cache.set('analytics:total_users', User.objects.count(), 3600)
    cache.set('analytics:active_users', User.objects.filter(is_active=True).count(), 3600)
    
    # Cache session statistics
    cache.set('analytics:total_sessions', ExerciseSession.objects.count(), 3600)
    cache.set('analytics:avg_duration', 
              ExerciseSession.objects.aggregate(Avg('duration'))['duration__avg'], 
              3600)
    
    logger.info("Analytics cache warmed successfully")


def clear_model_cache(model_name):
    """
    Clear all cache entries for a specific model
    """
    cache.delete_pattern(f"*{model_name}*")
    logger.info(f"Cache cleared for {model_name}")
