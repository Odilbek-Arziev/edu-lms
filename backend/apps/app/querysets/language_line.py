from django.db.models import Q
from core.querysets.base_queryset import BaseQuerySet


class LanguageLineQuerySet(BaseQuerySet):
    def search(self, query):
        if not query:
            return self

        return self.filter(
            Q(key__icontains=query) |
            Q(value__ru__icontains=query) |
            Q(value__en__icontains=query) |
            Q(value__uz__icontains=query)
        )

    def list(self, search=None):
        return self.search(search)
