from rest_framework.decorators import action
from rest_framework.response import Response

from core.views.viewsets import BaseModelViewSet

from app.models import Course
from app.models import Lesson

from app.serializers.course import CourseSerializer
from app.serializers.lesson import LessonSerializer
from apps.users.serializers.UserSerializer import UserSerializer


class CourseViewSet(BaseModelViewSet):
    serializer_class = CourseSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        params = self.request.query_params
        search = params.get('search')
        category = params.get('category')

        return Course.objects.list(search=search, category=category)

    @action(detail=True, methods=['GET'])
    def students(self, request, slug=None):
        course = self.get_object()
        students = course.students.all()
        serializer = UserSerializer(students, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['GET'])
    def lessons(self, request, slug=None):
        course = self.get_object()
        lessons = Lesson.objects.filter(module__course=course)
        serializer = LessonSerializer(lessons, many=True)
        return Response(serializer.data)
