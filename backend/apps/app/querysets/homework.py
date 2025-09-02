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

    def by_course(self, course):
        if not course:
            return self
        return self.filter(lesson__module__course__title__icontains=course)

    def list(self, search=None, lesson=None, course=None):
        return (
            self.search(search)
                .for_lesson(lesson)
                .by_course(course)
                .order_by("-created_at")
        )
