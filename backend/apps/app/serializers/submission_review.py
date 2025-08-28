from rest_framework import serializers

from app.models import SubmissionReview, HomeworkSubmission
from app.serializers.homework_submission import HomeworkSubmissionSerializer
from users.serializers.UserSerializer import UserSerializer


class SubmissionReviewSerializer(serializers.ModelSerializer):
    submission = HomeworkSubmissionSerializer(read_only=True)
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
