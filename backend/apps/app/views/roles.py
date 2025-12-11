from django.contrib.auth.models import Group
from core.views.viewsets import BaseModelViewSet
from app.serializers.roles import RoleSerializer


class RoleViewSet(BaseModelViewSet):
    queryset = Group.objects.all()
    serializer_class = RoleSerializer
