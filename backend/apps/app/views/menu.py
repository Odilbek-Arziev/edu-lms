from core.views.viewsets import BaseModelViewSet
from app.models import Menu
from app.serializers.menu import MenuSerializer


class MenuViewSet(BaseModelViewSet):
    serializer_class = MenuSerializer

    def get_queryset(self):
        if self.action in ['retrieve', 'update', 'partial_update', 'destroy']:
            return Menu.objects.all()

        return Menu.objects.list(
            user=self.request.user,
            search=self.request.query_params.get('search')
        ).by_role(
            self.request.query_params.get('role')
        )
