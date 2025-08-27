from app.models import LiveSession
from app.serializers.live_session import LiveSessionSerializer
from core.views.viewsets import BaseModelViewSet


class LiveSessionViewSet(BaseModelViewSet):
    serializer_class = LiveSessionSerializer

    def get_queryset(self):
        params = self.request.query_params

        search = params.get('search')
        date_from = params.get('date_from')
        date_to = params.get('date_to')
        student = params.get('student')
        course = params.get('course')

        return LiveSession.objects.list(
            search=search,
            date_from=date_from,
            date_to=date_to,
            student=student,
            course=course
        )
