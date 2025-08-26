from rest_framework import serializers

from app.models import Homework


class HomeworkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Homework
        fields = [
            'title',
            'description',
            'deadline',
            'lesson'
        ]
