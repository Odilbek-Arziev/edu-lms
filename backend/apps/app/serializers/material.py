from rest_framework import serializers

from app.models import Material
from app.serializers.lesson import LessonSerializer


class MaterialSerializer(serializers.ModelSerializer):
    lesson = LessonSerializer(read_only=True)

    class Meta:
        model = Material
        fields = [
            'id',
            'title',
            'description',
            'url',
            'slug',
            'lesson'
        ]
