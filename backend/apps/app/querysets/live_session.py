from core.querysets.base_queryset import BaseQuerySet
from django.db.models import Q


class LiveSessionQuerySet(BaseQuerySet):
    def search(self, term=None):
        if not term:
            return self
        return self.filter(title__icontains=term)

    def within_period(self, date_from=None, date_to=None):
        filters = {}

        if date_from:
            filters["scheduled_at__gte"] = date_from
        if date_to:
            filters["scheduled_at__lte"] = date_to

        return self.filter(**filters)

    def by_student(self, student):
        if not student:
            return self

        return self.filter(
            Q(student__first_name__icontains=student) |
            Q(student__last_name__icontains=student)
        )

    def for_course(self, course):
        if not course:
            return self
        return self.filter(course__title__icontains=course)

    def list(self, search=None, date_from=None, date_to=None, student=None, course=None):
        return (
            self.search(search)
                .within_period(date_from, date_to)
                .by_student(student)
                .for_course(course)
                .order_by("-created_at")
        )
