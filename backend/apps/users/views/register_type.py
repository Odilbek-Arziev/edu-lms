from core.views.viewsets import BaseModelViewSet
from rest_framework import permissions

from users.models import RegisterType
from users.serializers.register_type import RegisterTypeSerializer


class RegisterTypeViewSet(BaseModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = RegisterTypeSerializer
    queryset = RegisterType.objects.all()
