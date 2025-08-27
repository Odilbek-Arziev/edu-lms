from app.models import HomeworkSubmission
from app.serializers.homework_submission import HomeworkSubmissionSerializer
from core.views.viewsets import BaseModelViewSet


class HomeworkSubmissionViewSet(BaseModelViewSet):
    serializer_class = HomeworkSubmissionSerializer

    def get_queryset(self):
        params = self.request.query_params
        date_from = params.get('date_from')
        date_to = params.get('date_to')
        student = params.get('student')
        course = params.get('course')

        queryset = HomeworkSubmission.objects.list(date_from=date_from, date_to=date_to, student=student)

        if course:
            queryset = queryset.filter(homework__lesson__module__course__title__icontains=course)

        return queryset
