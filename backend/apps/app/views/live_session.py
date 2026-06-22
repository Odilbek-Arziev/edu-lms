from rest_framework.decorators import action
from rest_framework.response import Response

from core.views.viewsets import BaseModelViewSet

from app.models import LiveSession
from app.serializers.live_session import LiveSessionSerializer

from apps.users.serializers.user import UserSerializer
from users.permissions.permissions import role_required


class LiveSessionViewSet(BaseModelViewSet):
    serializer_class = LiveSessionSerializer
    permission_classes = [role_required('manager', 'teacher', 'student')]

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [role_required('manager', 'teacher')()]

        return [role_required('manager')()]

    def get_queryset(self):
        params = self.request.query_params
        user = self.request.user

        search = params.get('search')
        date_from = params.get('date_from')
        date_to = params.get('date_to')
        student = params.get('student')
        teacher = params.get('teacher')
        course = params.get('course')

        user_roles = user.groups.values_list('name', flat=True)

        if not user.is_superuser and 'manager' not in user_roles:
            if 'teacher' in user_roles:
                teacher = user.id
            elif 'student' in user_roles:
                student = user.id

        return LiveSession.objects.list(
            search=search,
            date_from=date_from,
            date_to=date_to,
            student=student,
            teacher=teacher,
            course=course
        )

    @action(detail=True, methods=['GET'])
    def students(self, request, pk=None):
        live_session = self.get_object()
        students = live_session.students.all()
        serializer = UserSerializer(students, many=True)
        return Response(serializer.data)
