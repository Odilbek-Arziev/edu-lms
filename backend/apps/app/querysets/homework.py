from core.querysets.base_queryset import BaseQuerySet


class HomeworkQuerySet(BaseQuerySet):
    def search(self, term=None):
        if not term:
            return self
        return self.filter(title__icontains=term)

    def for_lesson(self, lesson):
        if not lesson:
            return self
        return self.filter(lesson__title__icontains=lesson)

    def list(self, search=None, lesson=None):
        return (
            self.search(search)
                .for_lesson(lesson)
                .order_by("-created_at")
        )
