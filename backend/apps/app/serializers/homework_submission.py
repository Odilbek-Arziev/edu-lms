from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from app.models import HomeworkSubmission, Homework
from .homework import HomeworkSerializer
from .submission_review import SubmissionReviewSerializer

from users.serializers.UserSerializer import UserSerializer


class HomeworkSubmissionSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)
    homework = HomeworkSerializer(read_only=True)
    is_checked = serializers.BooleanField(read_only=True)
    is_approved = serializers.BooleanField(read_only=True)
    review = SubmissionReviewSerializer(read_only=True)

    class Meta:
        model = HomeworkSubmission
        fields = [
            'id',
            'file',
            'comment_from_student',
            'student',
            'homework',
            'is_active',
            'previous_submission',
            'is_checked',
            'is_approved',
            'review'
        ]

    def create(self, validated_data):
        request = self.context['request']
        validated_data['student'] = request.user
        prev_submission = validated_data.get('previous_submission')

        if prev_submission:
            homework = prev_submission.homework

            if not homework.can_submit(request.user):
                raise ValidationError('The limit of submission attempts has been exceeded.')

            if getattr(prev_submission, "review", None):
                raise ValidationError('You cannot submit homework twice after review.')

            if HomeworkSubmission.objects.filter(
                    homework=homework,
                    student=request.user,
                    is_active=True
            ).exclude(id=prev_submission.id).exists():
                raise ValidationError('You already have an active submission for this homework.')

            validated_data['homework'] = homework
            prev_submission.is_active = False
            prev_submission.save()

        else:
            homework_id = self.initial_data.get('homework')
            if not homework_id:
                raise ValidationError('Homework must be given!')

            if HomeworkSubmission.objects.filter(
                    homework_id=homework_id,
                    student=request.user,
                    is_active=True
            ).exists():
                raise ValidationError('You already have an active submission for this homework.')

            validated_data['homework_id'] = homework_id

        return super().create(validated_data)
