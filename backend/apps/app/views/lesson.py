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
from users.permissions.permissions import role_required


class LessonViewSet(BaseModelViewSet):
    serializer_class = LessonSerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [role_required('manager', 'teacher')()]

        return [role_required('manager')()]

    def get_queryset(self):
        params = self.request.query_params
        search = params.get('search')
        course = params.get('course')
        module = params.get('module')

        queryset = Lesson.objects.list(search=search, course=course, module=module)

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
