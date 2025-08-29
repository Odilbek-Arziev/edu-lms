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
    review = SubmissionReviewSerializer(many=True, read_only=True)

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
            "is_checked",
            "review"
        ]

    def create(self, validated_data):
        request = self.context['request']
        prev_submission = validated_data.get('previous_submission')

        if prev_submission:
            if not prev_submission.homework.can_submit(request.user):
                raise ValidationError('The limit of submission attempts has been exceeded.')

            validated_data['homework'] = prev_submission.homework
            validated_data['student'] = prev_submission.student

            prev_submission.is_active = False
            prev_submission.save()

        else:
            homework = self.initial_data.get('homework')
            if not homework:
                raise ValidationError('Homework must be given!')

            validated_data['homework_id'] = homework

        return super().create(validated_data)
