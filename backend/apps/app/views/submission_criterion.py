from app.models import SubmissionCriterionResult
from app.serializers.submission_criterion import SubmissionCriterionSerializer
from core.views.viewsets import BaseModelViewSet


class SubmissionCriterionViewSet(BaseModelViewSet):
    queryset = SubmissionCriterionResult.objects.list()
    serializer_class = SubmissionCriterionSerializer
