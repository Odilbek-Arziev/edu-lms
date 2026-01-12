from rest_framework import serializers

from app.models import Course, Category
from app.serializers.category import CategorySerializer

from app.serializers.module import ModuleSerializer


class CourseSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        write_only=True,
        required=False,
        allow_null=True
    )
    category_detail = CategorySerializer(
        source='category',
        read_only=True
    )

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
            'category',
            'category_detail',
            'icon',
            'is_active'
        ]


class CourseNestedSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = [
            'id',
            'title',
            'description',
            'modules',
        ]
