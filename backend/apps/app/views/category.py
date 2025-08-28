from rest_framework.decorators import action
from rest_framework.response import Response

from app.models import Category, Course
from app.serializers.category import CategorySerializer
from core.views.viewsets import BaseModelViewSet
from app.serializers.course import CourseSerializer


class CategoryViewSet(BaseModelViewSet):
    serializer_class = CategorySerializer
    lookup_field = 'slug'

    def get_queryset(self):
        search = self.request.query_params.get("search")
        return Category.objects.list(search=search)

    @action(detail=True, methods=['GET'])
    def courses(self, request, slug=None):
        category = self.get_object()
        courses = Course.objects.filter(category=category)
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)
