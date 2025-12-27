from rest_framework import serializers
from apps.reports.models import AuditLog


class AuditLogSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    action_display = serializers.CharField(source='get_action_display', read_only=True)
    
    class Meta:
        model = AuditLog
        fields = [
            'id', 'username', 'action', 'action_display', 'model_name',
            'object_id', 'object_repr', 'changes', 'ip_address',
            'timestamp'
        ]
        read_only_fields = ['id', 'timestamp']
