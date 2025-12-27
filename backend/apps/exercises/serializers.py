from rest_framework import serializers
from exercise.models import Exercise, ExerciseSession, ActivityUpload, ActivityData
import csv
from io import StringIO


# =========================
# Exercise
# =========================
class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = '__all__'

# =========================
# Exercise Session
# =========================
class ExerciseSessionSerializer(serializers.ModelSerializer):
    exercise_id = serializers.IntegerField(write_only=True)
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = ExerciseSession
        fields = ['id', 'exercise_id', 'rep_count', 'avg_posture_score',
                 'posture_warnings', 'start_time', 'end_time', 'user']
        read_only_fields = ['id', 'start_time', 'user']

    def create(self, validated_data):
        exercise_id = validated_data.pop('exercise_id')
        validated_data['exercise'] = Exercise.objects.get(id=exercise_id)
        return super().create(validated_data)

# =========================
# Activity Data
# =========================
class ActivityDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityData
        fields = '__all__'

# =========================
# Activity Upload (CSV)
# =========================
class ActivityUploadSerializer(serializers.ModelSerializer):
    file = serializers.FileField(write_only=True)

    class Meta:
        model = ActivityUpload
        fields = ['id', 'file', 'file_name', 'status', 'summary_stats']
        read_only_fields = ['id', 'file_name', 'status', 'summary_stats']

    def create(self, validated_data):
        request = self.context['request']
        csv_file = validated_data.pop('file')
        upload = ActivityUpload.objects.create(
            user=request.user,
            file_name=csv_file.name,
            status='processing'
        )
        self.parse_csv(upload, csv_file)
        return upload

    def parse_csv(self, upload, csv_file):
        content = csv_file.read().decode('utf-8')
        reader = csv.DictReader(StringIO(content))
        daily_data = {}

        for row in reader:
            date = row.get('date') or row.get('timestamp')
            if not date: continue

            steps = int(row.get('steps', 0) or 0)
            heart_rate = float(row.get('heart_rate', 0) or 0)
            calories = float(row.get('calories', 0) or 0)
            sleep = int(row.get('sleep_minutes', 0) or 0)

            if date not in daily_data:
                daily_data[date] = {
                    'steps': 0, 'heart_rates': [], 'calories': 0, 'sleep': 0
                }

            daily_data[date]['steps'] += steps
            daily_data[date]['calories'] += calories
            daily_data[date]['sleep'] += sleep
            if heart_rate > 0:
                daily_data[date]['heart_rates'].append(heart_rate)

        for date, stats in daily_data.items():
            ActivityData.objects.create(
                user=upload.user, upload=upload, date=date,
                steps=stats['steps'],
                avg_heart_rate=sum(stats['heart_rates'])/len(stats['heart_rates']) if stats['heart_rates'] else None,
                calories=stats['calories'],
                sleep_minutes=stats['sleep']
            )

        upload.summary_stats = {
            'days_parsed': len(daily_data),
            'total_steps': sum(d['steps'] for d in daily_data.values())
        }
        upload.status = 'completed'
        upload.save()
