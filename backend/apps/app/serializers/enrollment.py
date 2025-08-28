from rest_framework import serializers

from app.models import Enrollment, Course
from app.serializers.course import CourseSerializer
from users.serializers.UserSerializer import UserSerializer


class EnrollmentSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    student = UserSerializer(read_only=True)

    class Meta:
        model = Enrollment
        fields = [
            'id',
            'enrolled_at',
            'status',
            'progress',
            'final_grade',
            'course',
            'student'
        ]
