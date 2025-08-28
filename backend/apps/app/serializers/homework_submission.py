from rest_framework import serializers

from app.models import HomeworkSubmission, Homework
from app.serializers.homework import HomeworkSerializer
from users.serializers.UserSerializer import UserSerializer


class HomeworkSubmissionSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)
    homework = HomeworkSerializer(read_only=True)

    class Meta:
        model = HomeworkSubmission
        fields = [
            'id',
            'file',
            'comment_from_student',
            'student',
            'homework',
            'is_active',
            'previous_submission'
        ]
