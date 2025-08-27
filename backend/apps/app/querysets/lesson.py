from core.querysets.base_queryset import BaseQuerySet


class LessonQuerySet(BaseQuerySet):
    def search(self, term=None):
        if not term:
            return self
        return self.filter(title__icontains=term)

    def list(self, search=None):
        return (
            self.search(search)
                .order_by("-created_at")
        )
