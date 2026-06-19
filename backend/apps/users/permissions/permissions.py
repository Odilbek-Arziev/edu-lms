from rest_framework.permissions import BasePermission


class HasRole(BasePermission):
    allowed_roles: list = []

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        if request.user.is_superuser:
            return True

        user_roles = request.user.groups.values_list("name", flat=True)
        return any(r in self.allowed_roles for r in user_roles)


def role_required(*roles):
    return type("RoleRequired", (HasRole,), {"allowed_roles": list(roles)})
