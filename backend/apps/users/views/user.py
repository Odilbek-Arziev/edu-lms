from core.views.viewsets import BaseModelViewSet
from rest_framework import permissions

from users.models import CustomUser
from users.serializers.user import UserAdminSerializer


class UserViewSet(BaseModelViewSet):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = UserAdminSerializer
    queryset = CustomUser.objects.filter()

    def get_queryset(self):
        params = self.request.query_params
        search = params.get('search')
        role = params.get('role')
        register_type = params.get('register_type')
        status = params.get('status')

        return CustomUser.objects.list(
            search=search,
            role=role,
            register_type=register_type,
            status=status
        )
