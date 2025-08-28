from rest_framework import serializers

from app.models import Homework
from app.serializers.lesson import LessonSerializer
from app.serializers.homework_criterion import HomeworkCriterionSerializer


class HomeworkSerializer(serializers.ModelSerializer):
    lesson = LessonSerializer(read_only=True)
    criteria = HomeworkCriterionSerializer(many=True, read_only=True)

    class Meta:
        model = Homework
        fields = [
            'id',
            'title',
            'description',
            'deadline',
            'lesson',
            'max_attempts',
            'criteria'
        ]
