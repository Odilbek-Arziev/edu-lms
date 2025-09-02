from app.serializers.homework_submission import HomeworkSubmissionSerializer
from core.views.viewsets import BaseModelViewSet
from app.models import HomeworkSubmission
from rest_framework.decorators import action
from rest_framework.response import Response


class HomeworkSubmissionViewSet(BaseModelViewSet):
    serializer_class = HomeworkSubmissionSerializer

    def get_queryset(self):
        params = self.request.query_params
        date_from = params.get('date_from')
        date_to = params.get('date_to')
        student = params.get('student')
        course = params.get('course')
        status = params.get('status')
        state = params.get('state')
        checked_from = params.get('checked_from')
        checked_to = params.get('checked_to')
        homework_from = params.get('homework_from')
        homework_to = params.get('homework_to')

        queryset = HomeworkSubmission.objects.list(
            date_from=date_from,
            date_to=date_to,
            student=student,
            course=course,
            status=status,
            state=state,
            checked_from=checked_from,
            checked_to=checked_to,
            homework_from=homework_from,
            homework_to=homework_to
        )

        return queryset

    @action(detail=True, methods=['GET'])
    def history(self, request, pk=None):
        submission = self.get_object()
        queryset = HomeworkSubmission.objects.history(student=submission.student, homework=submission.homework)
        serializer = HomeworkSubmissionSerializer(queryset, many=True)
        return Response(serializer.data)
