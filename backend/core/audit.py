"""
Audit Logging Utility
Helper functions for logging admin actions
"""
from apps.reports.models import AuditLog


def get_client_ip(request):
    """Extract client IP address from request"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def log_action(user, action, model_name, object_id=None, object_repr='', changes=None, request=None):
    """
    Log an admin action
    
    Args:
        user: User performing the action
        action: Action type ('create', 'update', 'delete', 'view', 'export')
        model_name: Name of the model being acted upon
        object_id: ID of the object (optional)
        object_repr: String representation of the object
        changes: Dict of changes (for updates) with 'old' and 'new' keys
        request: HTTP request object (for IP and user agent)
    """
    ip_address = None
    user_agent = ''
    
    if request:
        ip_address = get_client_ip(request)
        user_agent = request.META.get('HTTP_USER_AGENT', '')[:500]  # Limit length
    
    AuditLog.objects.create(
        user=user,
        action=action,
        model_name=model_name,
        object_id=object_id,
        object_repr=object_repr,
        changes=changes or {},
        ip_address=ip_address,
        user_agent=user_agent
    )


def log_user_action(user, action, request=None):
    """
    Log user-related actions (login, logout)
    
    Args:
        user: User performing the action
        action: 'login' or 'logout'
        request: HTTP request object
    """
    log_action(
        user=user,
        action=action,
        model_name='User',
        object_id=user.id if user else None,
        object_repr=user.username if user else '',
        request=request
    )
