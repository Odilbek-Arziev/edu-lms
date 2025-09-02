from app.models import HomeworkCriterion
from app.serializers.homework_criterion import HomeworkCriterionSerializer
from core.views.viewsets import BaseModelViewSet


class HomeworkCriterionViewSet(BaseModelViewSet):
    serializer_class = HomeworkCriterionSerializer

    def get_queryset(self):
        homework = self.request.query_params.get('homework')
        queryset = HomeworkCriterion.objects.list(homework=homework)

        return queryset
