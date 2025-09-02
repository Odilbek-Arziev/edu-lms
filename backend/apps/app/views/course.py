from rest_framework.decorators import action
from rest_framework.response import Response

from core.views.viewsets import BaseModelViewSet

from app.models import (
    Course,
    Homework,
    HomeworkSubmission,
    Lesson,
    Enrollment,
    LiveSession,
    Module
)

from app.serializers.course import CourseSerializer
from app.serializers.lesson import LessonSerializer
from app.serializers.enrollment import EnrollmentSerializer
from app.serializers.homework import HomeworkSerializer
from app.serializers.homework_submission import HomeworkSubmissionSerializer
from app.serializers.live_session import LiveSessionSerializer
from app.serializers.module import ModuleSerializer

from apps.users.serializers.user import UserSerializer


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

    @action(detail=True, methods=['GET'])
    def enrollments(self, request, slug=None):
        course = self.get_object()
        enrollments = Enrollment.objects.filter(course=course)
        serializer = EnrollmentSerializer(enrollments, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['GET'])
    def homeworks(self, request, slug=None):
        course = self.get_object()
        homeworks = Homework.objects.filter(lesson__module__course=course)
        serializer = HomeworkSerializer(homeworks, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['GET'])
    def homework_submissions(self, request, slug=None):
        course = self.get_object()
        homework_submissions = HomeworkSubmission.objects.filter(homework__lesson__module__course=course)
        serializer = HomeworkSubmissionSerializer(homework_submissions, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['GET'])
    def live_sessions(self, request, slug=None):
        course = self.get_object()
        live_sessions = LiveSession.objects.filter(course=course)
        serializer = LiveSessionSerializer(live_sessions, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['GET'])
    def modules(self, request, slug=None):
        course = self.get_object()
        modules = Module.objects.filter(course=course)
        serializer = ModuleSerializer(modules, many=True)
        return Response(serializer.data)
