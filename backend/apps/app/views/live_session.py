from app.models import LiveSession
from app.serializers.live_session import LiveSessionSerializer
from core.views.viewsets import BaseModelViewSet


class LiveSessionViewSet(BaseModelViewSet):
    serializer_class = LiveSessionSerializer

    def get_queryset(self):
        search = self.request.query_params.get('search')
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        student = self.request.query_params.get('student')
        course = self.request.query_params.get('course')

        return LiveSession.objects.list(
            search=search,
            date_from=date_from,
            date_to=date_to,
            student=student,
            course=course
        )
