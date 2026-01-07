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
        return self.filter(category=category)

    def for_language(self, language):
        if not language:
            return self
        return self.filter(language=language)

    def for_level(self, level):
        if not level:
            return self
        return self.filter(level=level)

    def list(self, search=None, category=None, language=None, level=None):
        return (
            self.active()
                .search(search)
                .for_category(category)
                .for_language(language)
                .for_level(level)
                .order_by("-is_active", "-created_at")
        )
