from rest_framework import serializers
from exercise.models import Doctor


# =========================
# Doctor
# =========================
class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ['id', 'name', 'specialization', 'hospital', 'phone', 'email']
