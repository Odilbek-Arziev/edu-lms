from rest_framework import serializers

from app.models import Material, Lesson
from app.serializers.lesson import LessonSerializer


class MaterialSerializer(serializers.ModelSerializer):
    lesson = LessonSerializer(read_only=True)
    lesson_id = serializers.PrimaryKeyRelatedField(
        queryset=Lesson.objects.all(),
        source='lesson',
        write_only=True
    )

    class Meta:
        model = Material
        fields = [
            'id',
            'title',
            'description',
            'url',
            'file',
            'slug',
            'lesson',
            'lesson_id',
        ]
