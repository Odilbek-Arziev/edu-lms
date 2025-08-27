from app.models import Enrollment
from app.serializers.enrollment import EnrollmentSerializer
from core.views.viewsets import BaseModelViewSet


class EnrollmentViewSet(BaseModelViewSet):
    serializer_class = EnrollmentSerializer

    def get_queryset(self):
        params = self.request.query_params

        return Enrollment.objects.list(
            date_from=params.get('date_from'),
            date_to=params.get('date_to'),
            status=params.get('status'),
            course=params.get('course'),
            student=params.get('student')
        )
