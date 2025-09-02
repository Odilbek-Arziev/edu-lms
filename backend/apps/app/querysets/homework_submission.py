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

    def within_submit_period(self, date_from=None, date_to=None):
        """
        :returns submissions of the period
        """
        filters = {}

        if date_from:
            filters["submitted_at__gte"] = date_from
        if date_to:
            filters["submitted_at__lte"] = date_to

        return self.filter(**filters)

    def within_check_period(self, checked_from=None, checked_to=None):
        """
        :returns submissions which was checked in this period
        """
        filters = {}

        if checked_from:
            filters["review__created_at__gte"] = checked_from
        if checked_to:
            filters["review__created_at__lte"] = checked_to

        return self.filter(**filters)

    def within_homework_period(self, homework_from=None, homework_to=None):
        """
        :returns submissions which was created for homework given in this period
        """
        filters = {}

        if homework_from:
            filters["homework__created_at__gte"] = homework_from
        if homework_to:
            filters["homework__created_at__lte"] = homework_to

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

    def by_state(self, state):
        if not state:
            return self

        latest_submissions = (
            self.order_by("student_id", "homework_id", "-created_at")
                .distinct("student_id", "homework_id")
        )

        if state == 'approved':
            return latest_submissions.filter(review__is_accepted=True)
        elif state == 'rejected':
            return latest_submissions.filter(review__is_accepted=False)

    def list(self, date_from=None, date_to=None, student=None, course=None, status=None, state=None, checked_from=None,
             checked_to=None, homework_from=None, homework_to=None):
        return (
            self.by_student(student)
                .for_course(course)
                .by_status(status)
                .by_state(state)
                .within_submit_period(date_from, date_to)
                .within_check_period(checked_from, checked_to)
                .within_homework_period(homework_from, homework_to)
                .order_by("student_id", "homework_id", "-created_at")
        )
