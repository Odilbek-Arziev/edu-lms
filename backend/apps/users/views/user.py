from core.views.viewsets import BaseModelViewSet

from users.models import CustomUser
from users.serializers.user import UserAdminSerializer

from users.permissions.permissions import role_required


class UserViewSet(BaseModelViewSet):
    permission_classes = [role_required('manager', 'teacher')]

    serializer_class = UserAdminSerializer

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
