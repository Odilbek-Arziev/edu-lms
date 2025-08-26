from app.models import Lesson
from app.serializers.lesson import LessonSerializer
from core.views.viewsets import BaseModelViewSet


class LessonViewSet(BaseModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    lookup_field = 'slug'
