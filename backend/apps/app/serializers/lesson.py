from rest_framework import serializers
from app.models import Lesson


class LessonSerializer(serializers.ModelSerializer):
    course = serializers.PrimaryKeyRelatedField(source='module.course', read_only=True)

    class Meta:
        model = Lesson
        fields = [
            'id',
            'title',
            'short_description',
            'duration',
            'content',
            'is_preview',
            'slug',
            'module',
            'course'
        ]
