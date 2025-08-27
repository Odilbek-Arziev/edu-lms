from app.models import Category
from app.serializers.category import CategorySerializer
from core.views.viewsets import BaseModelViewSet


class CategoryViewSet(BaseModelViewSet):
    serializer_class = CategorySerializer
    lookup_field = 'slug'

    def get_queryset(self):
        search = self.request.query_params.get("search")
        return Category.objects.list(search=search)
