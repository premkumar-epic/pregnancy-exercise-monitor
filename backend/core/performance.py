"""
Performance optimization utilities and decorators
"""
from functools import wraps
from django.core.cache import cache
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_headers
import hashlib
import json


def cache_key_generator(*args, **kwargs):
    """Generate a unique cache key from arguments"""
    key_data = str(args) + str(sorted(kwargs.items()))
    return hashlib.md5(key_data.encode()).hexdigest()


def cached_query(timeout=300, key_prefix='query'):
    """
    Decorator to cache database query results
    
    Usage:
        @cached_query(timeout=600, key_prefix='users')
        def get_active_users():
            return User.objects.filter(is_active=True)
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Generate cache key
            cache_key = f"{key_prefix}:{cache_key_generator(*args, **kwargs)}"
            
            # Try to get from cache
            result = cache.get(cache_key)
            if result is not None:
                return result
            
            # Execute function and cache result
            result = func(*args, **kwargs)
            cache.set(cache_key, result, timeout)
            return result
        return wrapper
    return decorator


def invalidate_cache(key_prefix):
    """
    Invalidate all cache entries with given prefix
    
    Usage:
        invalidate_cache('users')
    """
    # Note: This is a simple implementation
    # For production, consider using cache versioning or tags
    cache.delete_pattern(f"{key_prefix}:*")


class CachedAPIView:
    """
    Mixin for caching API views
    
    Usage:
        class MyView(CachedAPIView, APIView):
            cache_timeout = 300
            cache_key_prefix = 'myview'
    """
    cache_timeout = 300
    cache_key_prefix = 'api'
    
    @method_decorator(cache_page(cache_timeout))
    @method_decorator(vary_on_headers('Authorization'))
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)


def cache_analytics(timeout=600):
    """
    Decorator specifically for analytics queries
    Uses longer timeout since analytics data changes less frequently
    """
    return cached_query(timeout=timeout, key_prefix='analytics')


# Database query optimization helpers
class QueryOptimizer:
    """Helper class for optimizing database queries"""
    
    @staticmethod
    def optimize_user_query(queryset):
        """Optimize user queries with select_related"""
        return queryset.select_related('profile').prefetch_related('groups')
    
    @staticmethod
    def optimize_exercise_query(queryset):
        """Optimize exercise queries"""
        return queryset.select_related('user').prefetch_related('activities')
    
    @staticmethod
    def optimize_campaign_query(queryset):
        """Optimize campaign queries"""
        return queryset.select_related('created_by').prefetch_related('logs')


# Example usage in views:
"""
from core.performance import cached_query, cache_analytics

@cache_analytics(timeout=900)
def get_user_statistics():
    return {
        'total_users': User.objects.count(),
        'active_users': User.objects.filter(is_active=True).count(),
    }

@cached_query(timeout=300, key_prefix='exercises')
def get_popular_exercises():
    return Exercise.objects.annotate(
        session_count=Count('sessions')
    ).order_by('-session_count')[:10]
"""
