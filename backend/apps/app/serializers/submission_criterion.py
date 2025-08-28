from rest_framework import serializers

from app.models import (
    SubmissionCriterionResult,
    HomeworkSubmission,
    HomeworkCriterion
)
from app.serializers.homework_criterion import HomeworkCriterionSerializer
from app.serializers.submission_review import SubmissionReviewSerializer


class SubmissionCriterionSerializer(serializers.ModelSerializer):
    criterion = HomeworkCriterionSerializer(read_only=True)
    review = SubmissionReviewSerializer(read_only=True)

    class Meta:
        model = SubmissionCriterionResult
        fields = [
            'id',
            'is_met',
            'feedback',
            'criterion',
            'review'
        ]
