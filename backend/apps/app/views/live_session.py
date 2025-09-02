from rest_framework.decorators import action
from rest_framework.response import Response

from core.views.viewsets import BaseModelViewSet

from app.models import LiveSession
from app.serializers.live_session import LiveSessionSerializer

from apps.users.serializers.user import UserSerializer


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

    @action(detail=True, methods=['GET'])
    def students(self, request, pk=None):
        live_session = self.get_object()
        students = live_session.students.all()
        serializer = UserSerializer(students, many=True)
        return Response(serializer.data)
