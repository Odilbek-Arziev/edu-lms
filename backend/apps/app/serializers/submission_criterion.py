from rest_framework import serializers

from app.models import (
    SubmissionCriterionResult,
    HomeworkSubmission,
    HomeworkCriterion
)
from app.serializers.homework_criterion import HomeworkCriterionSerializer
from app.serializers.homework_submission import HomeworkSubmissionSerializer


class SubmissionCriterionSerializer(serializers.ModelSerializer):
    submission = serializers.PrimaryKeyRelatedField(queryset=HomeworkSubmission.objects.all())
    criterion = serializers.PrimaryKeyRelatedField(queryset=HomeworkCriterion.objects.all())

    class Meta:
        model = SubmissionCriterionResult
        fields = [
            'is_met',
            'feedback',
            'submission',
            'criterion'
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['submission'] = HomeworkSubmissionSerializer(instance.submission).data
        representation['criterion'] = HomeworkCriterionSerializer(instance.criterion).data

        return representation
