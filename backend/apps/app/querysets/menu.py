from django.db.models import Q
from core.querysets.base_queryset import BaseQuerySet


class MenuQuerySet(BaseQuerySet):
    def active(self):
        return self.filter(status=True)

    def for_user(self, user):
        if user.is_superuser or user.groups.filter(name='manager').exists():
            return self
        return self.filter(groups__in=user.groups.all())

    def root_only(self):
        return self.filter(parent=None)

    def search(self, query):
        if not query:
            return self
        return self.filter(
            Q(title__icontains=query) | Q(url_path__icontains=query)
        )

    def by_role(self, role_id):
        if not role_id:
            return self
        return self.filter(groups__id=role_id)

    def list(self, user, search=None):
        qs = self.active().for_user(user)

        if search:
            return qs.search(search)
        else:
            return qs.root_only()
