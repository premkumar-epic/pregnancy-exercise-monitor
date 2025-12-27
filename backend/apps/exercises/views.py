from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from exercise.models import (
    Exercise, ExerciseSession, ActivityUpload, ActivityData,
    PregnancyProfile, PregnancyContent
)
from apps.exercises.serializers import (
    ExerciseSerializer, ExerciseSessionSerializer,
    ActivityUploadSerializer, ActivityDataSerializer
)
from apps.health.serializers import PregnancyProfileSerializer, PregnancyContentSerializer

# ---------------- EXERCISES (Public) ----------------
class ExerciseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer
    permission_classes = [AllowAny]

# ---------------- SESSIONS ----------------
class ExerciseSessionViewSet(viewsets.ModelViewSet):
    queryset = ExerciseSession.objects.all()
    serializer_class = ExerciseSessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ExerciseSession.objects.filter(user=self.request.user)

# ---------------- ACTIVITY UPLOAD ----------------
class ActivityUploadViewSet(viewsets.ModelViewSet):
    queryset = ActivityUpload.objects.all()
    serializer_class = ActivityUploadSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ActivityUpload.objects.filter(user=self.request.user)

# ---------------- ACTIVITY DATA ----------------
class ActivityDataViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ActivityData.objects.all()
    serializer_class = ActivityDataSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ActivityData.objects.filter(user=self.request.user)

# ---------------- PREGNANCY PROFILE (SINGLETON APIView) ----------------
class PregnancyProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = PregnancyProfile.objects.filter(user=request.user).first()
        if not profile:
            return Response({}, status=status.HTTP_200_OK)
        return Response(PregnancyProfileSerializer(profile).data)

    def patch(self, request):
        profile = PregnancyProfile.objects.filter(user=request.user).first()
        if not profile:
            serializer = PregnancyProfileSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            profile = serializer.save(user=request.user)
        else:
            serializer = PregnancyProfileSerializer(
                profile, data=request.data, partial=True
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
        return Response(PregnancyProfileSerializer(profile).data)

    def post(self, request):
        # Same as PATCH for frontend compatibility
        return self.patch(request)

# ---------------- PREGNANCY CONTENT ----------------
class PregnancyContentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PregnancyContent.objects.all()
    serializer_class = PregnancyContentSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = PregnancyContent.objects.all()
        week = self.request.query_params.get('week')
        trimester = self.request.query_params.get('trimester')
        if week:
            qs = qs.filter(week_min__lte=week, week_max__gte=week)
        if trimester:
            qs = qs.filter(trimester=trimester)
        return qs
