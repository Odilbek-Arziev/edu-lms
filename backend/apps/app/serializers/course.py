from rest_framework import serializers

from app.models import Course, Category
from app.serializers.category import CategorySerializer


class CourseSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())

    class Meta:
        model = Course
        fields = [
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

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['category'] = CategorySerializer(instance.category).data

        return representation
