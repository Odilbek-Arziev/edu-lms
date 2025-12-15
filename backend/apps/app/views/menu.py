from core.views.viewsets import BaseModelViewSet
from app.models import Menu
from app.serializers.menu import MenuSerializer


class MenuViewSet(BaseModelViewSet):
    serializer_class = MenuSerializer

    def get_queryset(self):
        user = self.request.user

        if self.action in ['retrieve', 'update', 'partial_update', 'destroy']:
            return Menu.objects.all()

        return Menu.objects.filter(
            status=True,
            parent=None,
            groups__in=user.groups.all()
        ).distinct()
