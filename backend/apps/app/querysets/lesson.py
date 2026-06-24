from core.querysets.base_queryset import BaseQuerySet


class LessonQuerySet(BaseQuerySet):
    def search(self, term=None):
        if not term:
            return self
        return self.filter(title__icontains=term)

    def for_course(self, course):
        if not course:
            return self
        return self.filter(module__course_id=course)

    def for_module(self, module):
        if not module:
            return self
        return self.filter(module_id=module)

    def list(self, search=None, course=None, module=None):
        return (
            self.search(search)
                .order_by("-created_at")
                .for_course(course)
                .for_module(module)
                .select_related('module__course')
        )
