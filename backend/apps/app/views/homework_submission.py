from app.models import HomeworkSubmission
from app.serializers.homework_submission import HomeworkSubmissionSerializer
from core.views.viewsets import BaseModelViewSet


class HomeworkSubmissionViewSet(BaseModelViewSet):
    serializer_class = HomeworkSubmissionSerializer

    def get_queryset(self):
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        student = self.request.query_params.get('student')
        return HomeworkSubmission.objects.list(date_from=date_from, date_to=date_to, student=student)
