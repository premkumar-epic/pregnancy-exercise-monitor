"""
Monitoring and health check utilities
"""
from django.core.cache import cache
from django.db import connection
from django.http import JsonResponse
import time


def check_database():
    """Check database connectivity"""
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        return {'status': 'healthy', 'latency_ms': 0}
    except Exception as e:
        return {'status': 'unhealthy', 'error': str(e)}


def check_cache():
    """Check cache connectivity"""
    try:
        test_key = 'health_check_test'
        test_value = 'test'
        
        start = time.time()
        cache.set(test_key, test_value, 10)
        result = cache.get(test_key)
        latency = (time.time() - start) * 1000
        
        if result == test_value:
            cache.delete(test_key)
            return {'status': 'healthy', 'latency_ms': round(latency, 2)}
        else:
            return {'status': 'unhealthy', 'error': 'Cache read/write mismatch'}
    except Exception as e:
        return {'status': 'unhealthy', 'error': str(e)}


def health_check_view(request):
    """
    Comprehensive health check endpoint
    Returns status of all critical services
    """
    health_status = {
        'status': 'healthy',
        'timestamp': time.time(),
        'checks': {
            'database': check_database(),
            'cache': check_cache(),
        }
    }
    
    # Overall status is unhealthy if any check fails
    if any(check['status'] == 'unhealthy' for check in health_status['checks'].values()):
        health_status['status'] = 'unhealthy'
        return JsonResponse(health_status, status=503)
    
    return JsonResponse(health_status, status=200)


def readiness_check_view(request):
    """
    Readiness check for load balancers
    Returns 200 if app is ready to serve traffic
    """
    try:
        # Quick database check
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        return JsonResponse({'status': 'ready'}, status=200)
    except Exception as e:
        return JsonResponse({'status': 'not ready', 'error': str(e)}, status=503)


def liveness_check_view(request):
    """
    Liveness check for container orchestration
    Returns 200 if app is alive (even if not ready)
    """
    return JsonResponse({'status': 'alive'}, status=200)
