from rest_framework import serializers

from app.models import Course, Category
from app.serializers.category import CategorySerializer


class CourseSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Course
        fields = [
            'id',
            'title',
            'description',
            'author',
            'duration',
            'level',
            'language',
            'price',
            'start_date',
            'end_date',
            'category'
        ]
