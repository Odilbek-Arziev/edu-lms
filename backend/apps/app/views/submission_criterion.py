from app.models import SubmissionCriterionResult
from app.serializers.submission_criterion import SubmissionCriterionSerializer
from core.views.viewsets import BaseModelViewSet
from users.permissions.permissions import role_required


class SubmissionCriterionViewSet(BaseModelViewSet):
    serializer_class = SubmissionCriterionSerializer
    permission_classes = [role_required('manager', 'teacher')]
    pagination_class = None

    def get_queryset(self):
        params = self.request.query_params
        return SubmissionCriterionResult.objects.list(
            review=params.get('review'),
            submission=params.get('submission'),
        )
