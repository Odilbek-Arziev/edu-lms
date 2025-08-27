from app.models import Homework
from app.serializers.homework import HomeworkSerializer
from core.views.viewsets import BaseModelViewSet


class HomeworkViewSet(BaseModelViewSet):
    serializer_class = HomeworkSerializer

    def get_queryset(self):
        params = self.request.query_params
        search = params.get('search')
        lesson = params.get('lesson')
        course = params.get('course')

        queryset = Homework.objects.list(search=search, lesson=lesson)

        if course:
            queryset = queryset.filter(lesson__module__course__title__icontains=course)

        return queryset
