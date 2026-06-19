from app.models import SubmissionReview
from core.views.viewsets import BaseModelViewSet

from app.serializers.submission_review import SubmissionReviewSerializer
from users.permissions.permissions import role_required


class SubmissionReviewViewSet(BaseModelViewSet):
    queryset = SubmissionReview.objects.all()
    serializer_class = SubmissionReviewSerializer
    permission_classes = [role_required('manager', 'teacher')]
