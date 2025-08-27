from app.models import Lesson
from app.serializers.lesson import LessonSerializer
from core.views.viewsets import BaseModelViewSet


class LessonViewSet(BaseModelViewSet):
    serializer_class = LessonSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        params = self.request.query_params
        search = params.get('search')
        course = params.get('course')

        queryset = Lesson.objects.list(search=search)

        if course:
            queryset = queryset.filter(module__course__title__icontains=course)

        return queryset
