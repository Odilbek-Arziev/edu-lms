from core.querysets.base_queryset import BaseQuerySet


class SubmissionCriterionResultQuerySet(BaseQuerySet):
    def list(self):
        return self.order_by("-created_at")
