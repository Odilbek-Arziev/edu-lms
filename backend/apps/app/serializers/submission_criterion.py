from rest_framework import serializers

from app.models import SubmissionCriterionResult


class SubmissionCriterionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubmissionCriterionResult
        fields = [
            'is_met',
            'feedback',
            'submission',
            'criterion'
        ]
