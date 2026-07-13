from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from app.models import HomeworkSubmission, Homework
from .homework import HomeworkSerializer
from .submission_review import SubmissionReviewSerializer

from users.serializers.user import UserSerializer


class HomeworkSubmissionSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)
    homework = HomeworkSerializer(read_only=True)
    is_checked = serializers.BooleanField(read_only=True)
    is_approved = serializers.BooleanField(read_only=True)
    review = SubmissionReviewSerializer(read_only=True)
    previous_submission_detail = serializers.SerializerMethodField()

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
            'previous_submission_detail',
            'is_checked',
            'is_approved',
            'review',
            'submitted_at'
        ]

    def get_previous_submission_detail(self, obj):
        if not obj.previous_submission_id:
            return None
        if self.context.get('_depth', 0) >= 1:
            return None

        context = {**self.context, '_depth': self.context.get('_depth', 0) + 1}
        return HomeworkSubmissionSerializer(obj.previous_submission, context=context).data

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
