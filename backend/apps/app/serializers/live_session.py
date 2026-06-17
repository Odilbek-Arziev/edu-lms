from rest_framework import serializers

from app.models import LiveSession, Course
from app.serializers.course import CourseSerializer
from users.serializers.user import UserSerializer

from users.models import CustomUser


class LiveSessionSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    students = UserSerializer(read_only=True, many=True)

    course_id = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(),
        source='course',
        write_only=True,
    )
    student_ids = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(),
        source='students',
        many=True,
        write_only=True,
    )

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
            'course_id',
            'student_ids'
        ]
