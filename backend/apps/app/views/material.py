from rest_framework.parsers import MultiPartParser, FormParser
from app.models import Material
from app.serializers.material import MaterialSerializer
from core.views.viewsets import BaseModelViewSet


class MaterialViewSet(BaseModelViewSet):
    serializer_class = MaterialSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        params = self.request.query_params
        search = params.get('search')
        lesson = params.get('lesson')
        return Material.objects.list(search=search, lesson=lesson)