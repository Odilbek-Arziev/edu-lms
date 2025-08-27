from app.models import Lesson
from app.serializers.lesson import LessonSerializer
from core.views.viewsets import BaseModelViewSet


class LessonViewSet(BaseModelViewSet):
    serializer_class = LessonSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        search = self.request.query_params.get('search')
        return Lesson.objects.list(search=search)
