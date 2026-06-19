from rest_framework.parsers import MultiPartParser, FormParser
from app.models import Material
from app.serializers.material import MaterialSerializer
from core.views.viewsets import BaseModelViewSet
from users.permissions.permissions import role_required


class MaterialViewSet(BaseModelViewSet):
    serializer_class = MaterialSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [role_required('manager', 'teacher', 'student')]

    def get_queryset(self):
        params = self.request.query_params
        search = params.get('search')
        lesson = params.get('lesson')
        return Material.objects.list(search=search, lesson=lesson)
