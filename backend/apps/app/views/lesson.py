from rest_framework.decorators import action
from rest_framework.response import Response

from app.models import (
    Lesson,
    Homework,
    Material
)
from core.views.viewsets import BaseModelViewSet
from app.serializers.lesson import LessonSerializer
from app.serializers.homework import HomeworkSerializer
from app.serializers.material import MaterialSerializer


class LessonViewSet(BaseModelViewSet):
    serializer_class = LessonSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        params = self.request.query_params
        search = params.get('search')
        course = params.get('course')

        queryset = Lesson.objects.list(search=search, course=course)

        return queryset

    @action(detail=True, methods=['GET'])
    def homeworks(self, request, slug=None):
        lesson = self.get_object()
        homeworks = Homework.objects.filter(lesson=lesson)
        serializer = HomeworkSerializer(homeworks, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['GET'])
    def materials(self, request, slug=None):
        lesson = self.get_object()
        materials = Material.objects.filter(lesson=lesson)
        serializer = MaterialSerializer(materials, many=True)
        return Response(serializer.data)
