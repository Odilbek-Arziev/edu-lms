from django.db.models import Q

from core.querysets.base_queryset import BaseQuerySet


class CourseQuerySet(BaseQuerySet):
    def search(self, term: str = None):
        if not term:
            return self
        return self.filter(Q(title__icontains=term))

    def active(self):
        return self.filter(is_active=True)

    def for_category(self, category):
        if not category:
            return self
        return self.filter(category__title__icontains=category)

    def list(self, search=None, category=None):
        return (
            self.active()
                .search(search)
                .for_category(category)
                .order_by("-is_active", "-created_at")
        )
