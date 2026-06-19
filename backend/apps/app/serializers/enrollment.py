from rest_framework import serializers

from app.models import Enrollment, Course
from app.serializers.course import CourseSerializer
from users.serializers.user import UserSerializer
from users.models import CustomUser


class EnrollmentSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    student = UserSerializer(read_only=True)

    course_id = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(),
        source='course',
        write_only=True
    )

    student_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(),
        source='student',
        write_only=True
    )

    class Meta:
        model = Enrollment
        fields = [
            'id',
            'enrolled_at',
            'status',
            'progress',
            'final_grade',
            'course',
            'student',
            'course_id',
            'student_id'
        ]
