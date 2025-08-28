from rest_framework import serializers

from app.models import LiveSession, Course
from app.serializers.course import CourseSerializer
from users.serializers.UserSerializer import UserSerializer


class LiveSessionSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    student = UserSerializer(read_only=True)

    class Meta:
        model = LiveSession
        fields = [
            'id',
            'title',
            'scheduled_at',
            'duration_minutes',
            'link',
            'students',
            'course',
        ]
