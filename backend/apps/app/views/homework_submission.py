from app.models import HomeworkSubmission
from app.serializers.homework_submission import HomeworkSubmissionSerializer
from core.views.viewsets import BaseModelViewSet


class HomeworkSubmissionViewSet(BaseModelViewSet):
    queryset = HomeworkSubmission.objects.all()
    serializer_class = HomeworkSubmissionSerializer
