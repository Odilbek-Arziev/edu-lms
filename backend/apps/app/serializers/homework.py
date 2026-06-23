from rest_framework import serializers

from app.models import Homework, Lesson, HomeworkCriterion
from app.serializers.lesson import LessonSerializer

from app.serializers.homework_criterion import HomeworkCriterionNestedSerializer


class HomeworkSerializer(serializers.ModelSerializer):
    lesson = LessonSerializer(read_only=True)
    lesson_id = serializers.PrimaryKeyRelatedField(
        queryset=Lesson.objects.all(),
        source='lesson',
        write_only=True
    )
    criteria = HomeworkCriterionNestedSerializer(many=True, required=False)

    class Meta:
        model = Homework
        fields = [
            'id',
            'title',
            'description',
            'deadline',
            'lesson',
            'max_attempts',
            'criteria',
            'lesson_id',
        ]

    def create(self, validated_data):
        criteria_data = validated_data.pop('criteria', [])
        homework = Homework.objects.create(**validated_data)

        HomeworkCriterion.objects.bulk_create([
            HomeworkCriterion(homework=homework, **c) for c in criteria_data
        ])

        return homework

    def update(self, instance, validated_data):
        criteria_data = validated_data.pop('criteria', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if criteria_data is not None:
            instance.criteria.all().delete()
            HomeworkCriterion.objects.bulk_create([
                HomeworkCriterion(homework=instance, **c) for c in criteria_data
            ])

        return instance
