from app.models import Category
from app.serializers.category import CategorySerializer
from core.views.viewsets import BaseModelViewSet


class CategoryViewSet(BaseModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'
