from rest_framework import serializers

from app.models import HomeworkSubmission, Homework
from app.serializers.homework import HomeworkSerializer
from users.models import CustomUser
from users.serializers.UserSerializer import UserSerializer


class HomeworkSubmissionSerializer(serializers.ModelSerializer):
    student = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    homework = serializers.PrimaryKeyRelatedField(queryset=Homework.objects.all())

    class Meta:
        model = HomeworkSubmission
        fields = [
            'file',
            'comment_from_student',
            'student',
            'homework'
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['student'] = UserSerializer(instance.student).data
        representation['homework'] = HomeworkSerializer(instance.homework).data

        return representation
