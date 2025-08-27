from core.querysets.base_queryset import BaseQuerySet
from django.db.models import Q


class HomeworkSubmissionQuerySet(BaseQuerySet):
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
            filters["submitted_at__gte"] = date_from
        if date_to:
            filters["submitted_at__lte"] = date_to

        return self.filter(**filters)

    def list(self, date_from=None, date_to=None, student=None):
        return (
            self.by_student(student)
                .within_period(date_from, date_to)
                .order_by("-created_at")
        )
