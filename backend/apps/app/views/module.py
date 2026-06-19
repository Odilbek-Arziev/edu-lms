from app.models import Module
from app.serializers.module import ModuleSerializer
from core.views.viewsets import BaseModelViewSet
from users.permissions.permissions import role_required


class ModuleViewSet(BaseModelViewSet):
    serializer_class = ModuleSerializer
    permission_classes = [role_required('manager', 'teacher', 'student')]

    def get_queryset(self):
        course = self.request.query_params.get('course')
        return Module.objects.list(course=course)
