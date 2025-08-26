from app.models import HomeworkCriterion
from app.serializers.homework_criterion import HomeworkCriterionSerializer
from core.views.viewsets import BaseModelViewSet


class HomeworkCriterionViewSet(BaseModelViewSet):
    queryset = HomeworkCriterion.objects.all()
    serializer_class = HomeworkCriterionSerializer
