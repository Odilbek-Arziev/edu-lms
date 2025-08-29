from django.db.models import Q
from core.querysets.base_queryset import BaseQuerySet


class HomeworkSubmissionQuerySet(BaseQuerySet):
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

        return self.filter(homework__lesson__module__course__title__icontains=course)

    def within_period(self, date_from=None, date_to=None):
        filters = {}

        if date_from:
            filters["submitted_at__gte"] = date_from
        if date_to:
            filters["submitted_at__lte"] = date_to

        return self.filter(**filters)

    def history(self, student, homework):
        return self.filter(student=student, homework=homework).order_by('created_at')

    def by_status(self, status):
        if not status:
            return self

        latest_submissions = (
            self.order_by("student_id", "homework_id", "-created_at")
                .distinct("student_id", "homework_id")
        )

        if status == "checked":
            return latest_submissions.filter(review__isnull=False)
        elif status == "open":
            return latest_submissions.filter(review__isnull=True)

        return latest_submissions

    def list(self, date_from=None, date_to=None, student=None, course=None, status=None):
        return (
            self.by_student(student)
                .for_course(course)
                .by_status(status)
                .within_period(date_from, date_to)
                .order_by("student_id", "homework_id", "-created_at")
        )
