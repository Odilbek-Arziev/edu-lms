from core.views.viewsets import BaseModelViewSet
from app.models import Menu
from app.serializers.menu import MenuSerializer


class MenuViewSet(BaseModelViewSet):
    serializer_class = MenuSerializer

    def get_queryset(self):
        user = self.request.user

        return Menu.objects.filter(
            status=True,
            parent_id=None,
            groups__in=user.groups.all()
        ).distinct()
