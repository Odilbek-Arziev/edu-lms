from rest_framework import serializers

from app.models import HomeworkCriterion


class HomeworkCriterionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeworkCriterion
        fields = [
            'id',
            'text',
            'homework',
        ]
