from rest_framework import serializers

from app.models import (
    SubmissionCriterionResult,
    HomeworkSubmission,
    HomeworkCriterion,
    SubmissionReview
)
from app.serializers.homework_criterion import HomeworkCriterionSerializer
from app.serializers.submission_review import SubmissionReviewSerializer


class SubmissionCriterionSerializer(serializers.ModelSerializer):
    criterion = HomeworkCriterionSerializer(read_only=True)
    review = SubmissionReviewSerializer(read_only=True)
    criterion_id = serializers.PrimaryKeyRelatedField(
        queryset=HomeworkCriterion.objects.all(),
        source='criterion',
        write_only=True
    )
    review_id = serializers.PrimaryKeyRelatedField(
        queryset=SubmissionReview.objects.all(),
        source='review',
        write_only=True
    )

    class Meta:
        model = SubmissionCriterionResult
        fields = [
            'id',
            'is_met',
            'feedback',
            'criterion',
            'review',
            'criterion_id',
            'review_id'
        ]
