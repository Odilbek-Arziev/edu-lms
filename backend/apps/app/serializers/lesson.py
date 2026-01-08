from rest_framework import serializers

from app.models import Lesson

from app.serializers.module import ModuleSerializer


class LessonSerializer(serializers.ModelSerializer):
    module = ModuleSerializer(read_only=True)

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
