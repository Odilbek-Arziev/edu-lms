from rest_framework import serializers

from app.models import Homework
from app.serializers.lesson import LessonSerializer


class HomeworkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Homework
        fields = [
            'title',
            'description',
            'deadline',
            'lesson'
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['lesson'] = LessonSerializer(instance.lesson).data

        return representation
