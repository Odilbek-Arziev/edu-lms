from app.serializers.homework_submission import HomeworkSubmissionSerializer
from core.utils.string import str_to_bool
from core.views.viewsets import BaseModelViewSet
from app.models import HomeworkSubmission
from rest_framework.decorators import action
from rest_framework.response import Response
from users.permissions.permissions import role_required


class HomeworkSubmissionViewSet(BaseModelViewSet):
    serializer_class = HomeworkSubmissionSerializer
    permission_classes = [role_required('manager', 'teacher')]

    def get_queryset(self):
        params = self.request.query_params
        submitted_from = params.get('submitted_from')
        submitted_to = params.get('submitted_to')
        student = params.get('student')
        course = params.get('course')
        lesson = params.get('lesson')
        status = params.get('status')
        state = params.get('state')
        checked_from = params.get('checked_from')
        checked_to = params.get('checked_to')
        homework_from = params.get('homework_from')
        homework_to = params.get('homework_to')
        reworked = params.get('reworked')

        queryset = HomeworkSubmission.objects.list(
            submitted_from=submitted_from,
            submitted_to=submitted_to,
            student=student,
            course=course,
            status=status,
            state=state,
            checked_from=checked_from,
            checked_to=checked_to,
            homework_from=homework_from,
            homework_to=homework_to,
            lesson=lesson,
            reworked=str_to_bool(reworked)
        )

        return queryset

    @action(detail=True, methods=['GET'])
    def history(self, request, pk=None):
        submission = self.get_object()
        queryset = HomeworkSubmission.objects.history(student=submission.student, homework=submission.homework)
        serializer = HomeworkSubmissionSerializer(queryset, many=True)
        return Response(serializer.data)
