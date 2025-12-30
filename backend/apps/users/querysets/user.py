from django.db.models import Q
from django.contrib.auth.models import UserManager

from core.querysets.base_queryset import BaseQuerySet


class UserQuerySet(BaseQuerySet):
    def search(self, term: str = None):
        if not term:
            return self
        return self.filter(
            Q(first_name__icontains=term) |
            Q(last_name__icontains=term) |
            Q(email__icontains=term) |
            Q(phone_number__icontains=term)
        )

    def for_role(self, roles):
        if not roles:
            return self
        if isinstance(roles, (list, tuple, set)):
            return self.filter(groups__pk__in=roles).distinct()
        return self.filter(groups__id=roles)

    def for_register_type(self, register_type):
        if not register_type:
            return self
        return self.filter(register_type=register_type)

    def for_status(self, status):
        if not status:
            return self
        return self.filter(is_active=True if status == 'active' else False)

    def for_users(self):
        return self.filter(is_superuser=False)

    def list(self, search=None, role=None, register_type=None, status=None):
        return (
            self.search(search)
                .for_role(role)
                .for_register_type(register_type)
                .for_status(status)
                .for_users()
                .order_by("-date_joined")
        )


class CustomUserManager(UserManager):
    def get_queryset(self):
        return UserQuerySet(self.model, using=self._db)

    def search(self, term: str = None):
        return self.get_queryset().search(term)

    def for_role(self, roles):
        return self.get_queryset().for_role(roles)

    def for_register_type(self, register_type):
        return self.get_queryset().for_register_type(register_type)

    def for_status(self, status):
        return self.get_queryset().for_status(status)

    def for_users(self):
        return self.get_queryset().for_users()

    def list(self, search=None, role=None, register_type=None, status=None):
        return self.get_queryset().list(search, role, register_type, status)
