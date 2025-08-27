from app.models import Course
from app.serializers.course import CourseSerializer
from core.views.viewsets import BaseModelViewSet


class CourseViewSet(BaseModelViewSet):
    serializer_class = CourseSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        search = self.request.query_params.get('search')
        category = self.request.query_params.get('category')

        return Course.objects.list(search=search, category=category)
