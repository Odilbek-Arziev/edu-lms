from rest_framework import serializers

from app.models import HomeworkSubmission


class HomeworkSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeworkSubmission
        fields = [
            'file',
            'comment_from_student',
            'student',
            'homework'
        ]
