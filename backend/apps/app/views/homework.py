from app.models import Homework
from app.serializers.homework import HomeworkSerializer
from core.views.viewsets import BaseModelViewSet


class HomeworkViewSet(BaseModelViewSet):
    queryset = Homework.objects.all()
    serializer_class = HomeworkSerializer
