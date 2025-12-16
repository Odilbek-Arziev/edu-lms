from django.contrib.auth.models import Group
from core.views.viewsets import BaseModelViewSet
from app.serializers.roles import RoleSerializer


class RoleViewSet(BaseModelViewSet):
    serializer_class = RoleSerializer

    def get_queryset(self):
        qs = Group.objects.all()

        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(name__icontains=search)

        return qs
