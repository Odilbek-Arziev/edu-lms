from core.querysets.base_queryset import BaseQuerySet


class LessonQuerySet(BaseQuerySet):
    def search(self, term=None):
        if not term:
            return self
        return self.filter(title__icontains=term)

    def for_course(self, course):
        if not course:
            return course
        return self.filter(module__course__title__icontains=course)

    def list(self, search=None, course=None):
        return (
            self.search(search)
                .order_by("-created_at")
                .for_course(course)
        )
