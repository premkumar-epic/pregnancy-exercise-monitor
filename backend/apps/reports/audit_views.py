"""
Audit Logs API View
View audit trail of admin actions
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from exercise.models import UserProfile
from apps.reports.models import AuditLog
from apps.reports.serializers import AuditLogSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def audit_logs(request):
    """
    Get audit logs (admin only)
    Query params:
    - action: filter by action type
    - user: filter by user ID
    - model: filter by model name
    - limit: number of records (default: 100, max: 500)
    """
    # Check if user is admin
    try:
        profile = UserProfile.objects.get(user=request.user)
        if profile.role != 'admin':
            return Response({'error': 'Admin access required'}, status=403)
    except UserProfile.DoesNotExist:
        return Response({'error': 'User profile not found'}, status=404)
    
    # Get logs
    logs = AuditLog.objects.select_related('user').all()
    
    # Apply filters
    action = request.query_params.get('action')
    user_id = request.query_params.get('user')
    model_name = request.query_params.get('model')
    
    if action:
        logs = logs.filter(action=action)
    if user_id:
        logs = logs.filter(user_id=user_id)
    if model_name:
        logs = logs.filter(model_name=model_name)
    
    # Limit results
    limit = min(int(request.query_params.get('limit', 100)), 500)
    logs = logs[:limit]
    
    serializer = AuditLogSerializer(logs, many=True)
    
    return Response({
        'count': len(serializer.data),
        'logs': serializer.data
    })
