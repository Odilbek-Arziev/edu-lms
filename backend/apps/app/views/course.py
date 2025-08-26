from app.models import Course
from app.serializers.course import CourseSerializer
from core.views.viewsets import BaseModelViewSet


class CourseViewSet(BaseModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    lookup_field = 'slug'
