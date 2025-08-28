from rest_framework import serializers

from app.models import Lesson


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = [
            'id',
            'title',
            'content',
            'is_preview',
            'slug',
            'module',
        ]
