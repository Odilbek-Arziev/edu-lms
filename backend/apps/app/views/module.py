from app.models import Module
from app.serializers.module import ModuleSerializer
from core.views.viewsets import BaseModelViewSet


class ModuleViewSet(BaseModelViewSet):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer
    lookup_field = 'slug'
