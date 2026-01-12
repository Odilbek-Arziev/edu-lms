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

from app.serializers.course import CourseSerializer, CourseNestedSerializer
from app.serializers.enrollment import EnrollmentSerializer
from app.serializers.homework import HomeworkSerializer
from app.serializers.homework_submission import HomeworkSubmissionSerializer
from app.serializers.live_session import LiveSessionSerializer

from apps.users.serializers.user import UserSerializer


class CourseViewSet(BaseModelViewSet):
    serializer_class = CourseSerializer

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CourseNestedSerializer
        return CourseSerializer

    def get_queryset(self):
        params = self.request.query_params
        search = params.get('search')
        category = params.get('category')
        level = params.get('level')
        language = params.get('language')
        is_active = params.get('is_active')

        return Course.objects.list(
            search=search,
            category=category,
            level=level,
            language=language,
            is_active=is_active
        )

    @action(detail=True, methods=['GET'])
    def students(self, request, slug=None):
        course = self.get_object()
        students = course.students.all()
        serializer = UserSerializer(students, many=True)
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

    @action(detail=False, methods=['GET'])
    def levels(self, request):
        model = self.serializer_class.Meta.model
        return Response([{'value': choice[0], 'label': choice[1]} for choice in model._meta.get_field('level').choices])

    @action(detail=False, methods=['GET'])
    def languages(self, request):
        model = self.serializer_class.Meta.model
        return Response(
            [{'value': choice[0], 'label': choice[1]} for choice in model._meta.get_field('language').choices])
