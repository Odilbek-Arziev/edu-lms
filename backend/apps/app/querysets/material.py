from core.querysets.base_queryset import BaseQuerySet


class MaterialQuerySet(BaseQuerySet):
    def search(self, term=None):
        if not term:
            return self
        return self.filter(title__icontains=term)

    def for_lesson(self, lesson):
        if not lesson:
            return self
        return self.filter(lesson_id=lesson)

    def for_module(self, module):
        if not module:
            return self
        return self.filter(lesson__module_id=module)

    def for_course(self, course):
        if not course:
            return self
        return self.filter(lesson__module__course_id=course)

    def list(self, search=None, lesson=None, course=None, module=None):
        return (
            self.search(search)
                .for_lesson(lesson)
                .for_course(course)
                .for_module(module)
                .order_by("-created_at")
        )
