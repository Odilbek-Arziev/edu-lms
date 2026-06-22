from rest_framework.parsers import MultiPartParser, FormParser
from app.models import Material
from app.serializers.material import MaterialSerializer
from core.views.viewsets import BaseModelViewSet
from users.permissions.permissions import role_required


class MaterialViewSet(BaseModelViewSet):
    serializer_class = MaterialSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.action in ('list', 'retrieve', 'create'):
            return [role_required('manager', 'teacher')()]

        return [role_required('manager')()]

    def get_queryset(self):
        params = self.request.query_params
        search = params.get('search')
        lesson = params.get('lesson')
        module = params.get('module')
        course = params.get('course')

        return Material.objects.list(search=search, lesson=lesson, module=module, course=course)
