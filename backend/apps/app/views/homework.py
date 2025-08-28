from rest_framework.decorators import action
from rest_framework.response import Response

from core.views.viewsets import BaseModelViewSet
from app.models import Homework, HomeworkCriterion
from app.serializers.homework import HomeworkSerializer
from app.serializers.homework_criterion import HomeworkCriterionSerializer


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

    @action(detail=True, methods=['GET'])
    def criterion(self, request, pk=None):
        homework = self.get_object()
        criterion = HomeworkCriterion.objects.filter(homework=homework)
        serializer = HomeworkCriterionSerializer(criterion, many=True)
        return Response(serializer.data)
