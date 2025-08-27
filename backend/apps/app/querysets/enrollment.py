from core.querysets.base_queryset import BaseQuerySet
from django.db.models import Q


class EnrollmentQuerySet(BaseQuerySet):
    def by_student(self, student):
        if not student:
            return self

        return self.filter(
            Q(student__first_name__icontains=student) |
            Q(student__last_name__icontains=student)
        )

    def within_period(self, date_from=None, date_to=None):
        filters = {}

        if date_from:
            filters["enrolled_at__gte"] = date_from
        if date_to:
            filters["enrolled_at__lte"] = date_to

        return self.filter(**filters)

    def for_status(self, status):
        if not status:
            return self
        return self.filter(status=status)

    def for_course(self, course):
        if not course:
            return self
        return self.filter(course__title__icontains=course)

    def list(self, date_from=None, date_to=None, status=None, course=None, student=None):
        return (
            self.by_student(student)
                .for_status(status)
                .for_course(course)
                .within_period(date_from, date_to)
                .order_by("-created_at")
        )
