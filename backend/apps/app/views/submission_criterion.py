from app.models import SubmissionCriterionResult
from app.serializers.submission_criterion import SubmissionCriterionSerializer
from core.views.viewsets import BaseModelViewSet
from users.permissions.permissions import role_required


class SubmissionCriterionViewSet(BaseModelViewSet):
    queryset = SubmissionCriterionResult.objects.list()
    serializer_class = SubmissionCriterionSerializer
    permission_classes = [role_required('manager', 'teacher')]
