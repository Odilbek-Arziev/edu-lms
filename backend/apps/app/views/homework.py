from app.models import Homework
from app.serializers.homework import HomeworkSerializer
from core.views.viewsets import BaseModelViewSet


class HomeworkViewSet(BaseModelViewSet):
    serializer_class = HomeworkSerializer

    def get_queryset(self):
        search = self.request.query_params.get('search')
        lesson = self.request.query_params.get('lesson')
        return Homework.objects.list(search=search, lesson=lesson)
