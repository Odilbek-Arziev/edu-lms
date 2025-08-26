from app.models import Enrollment
from app.serializers.enrollment import EnrollmentSerializer
from core.views.viewsets import BaseModelViewSet


class EnrollmentViewSet(BaseModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
