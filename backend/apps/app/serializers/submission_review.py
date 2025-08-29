from rest_framework import serializers

from app.models import SubmissionReview, HomeworkSubmission
from users.serializers.UserSerializer import UserSerializer


class SubmissionReviewSerializer(serializers.ModelSerializer):
    reviewer = UserSerializer(read_only=True)

    class Meta:
        model = SubmissionReview
        fields = [
            'id',
            'received_at',
            'is_accepted',
            'general_feedback',
            'submission',
            'reviewer'
        ]
