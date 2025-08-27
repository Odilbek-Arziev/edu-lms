from app.models import Module
from app.serializers.module import ModuleSerializer
from core.views.viewsets import BaseModelViewSet


class ModuleViewSet(BaseModelViewSet):
    serializer_class = ModuleSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        course = self.request.query_params.get('course')
        return Module.objects.list(course=course)
