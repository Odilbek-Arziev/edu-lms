from core.views.viewsets import BaseModelViewSet
from app.models import Menu
from app.serializers.menu import MenuSerializer
from rest_framework import permissions
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes


class MenuViewSet(BaseModelViewSet):
    serializer_class = MenuSerializer
    permission_classes = [permissions.IsAdminUser]

    @extend_schema(
        parameters=[
            OpenApiParameter("search", OpenApiTypes.STR, description="Search by name"),
            OpenApiParameter("role", OpenApiTypes.STR, description="Filter by role"),
        ]
    )
    def get_queryset(self):
        if self.action in ['retrieve', 'update', 'partial_update', 'destroy']:
            return Menu.objects.all()

        return Menu.objects.list(
            user=self.request.user,
            search=self.request.query_params.get('search')
        ).by_role(
            self.request.query_params.get('role')
        ).order_by('order')
