from app.models import Material
from app.serializers.material import MaterialSerializer
from core.views.viewsets import BaseModelViewSet


class MaterialViewSet(BaseModelViewSet):
    serializer_class = MaterialSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        search = self.request.query_params.get('search')
        lesson = self.request.query_params.get('lesson')
        return Material.objects.list(search=search, lesson=lesson)
