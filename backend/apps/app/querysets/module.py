from core.querysets.base_queryset import BaseQuerySet


class ModuleQuerySet(BaseQuerySet):
    def for_course(self, course):
        if not course:
            return self
        return self.filter(course_id=course)

    def list(self, course=None):
        return (
            self.for_course(course)
                .order_by("-is_active", "-created_at")
        )
