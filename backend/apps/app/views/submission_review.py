from app.models import SubmissionReview
from core.views.viewsets import BaseModelViewSet

from app.serializers.submission_review import SubmissionReviewSerializer


class SubmissionReviewViewSet(BaseModelViewSet):
    queryset = SubmissionReview.objects.all()
    serializer_class = SubmissionReviewSerializer
