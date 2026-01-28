from rest_framework import serializers

from app.models import Module

from app.serializers.lesson import LessonSerializer


class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = [
            'id',
            'title',
            'description',
            'is_active',
            'slug',
            'lessons',
            'course'
        ]
