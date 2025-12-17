from core.views.viewsets import BaseModelViewSet
from rest_framework import permissions

from users.models import CustomUser
from users.serializers.user import UserAdminSerializer


class UserViewSet(BaseModelViewSet):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = UserAdminSerializer
    queryset = CustomUser.objects.filter(is_superuser=False)
