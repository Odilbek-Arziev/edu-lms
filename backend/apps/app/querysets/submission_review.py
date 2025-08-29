from core.querysets.base_queryset import BaseQuerySet


class SubmissionReviewQueryset(BaseQuerySet):
    def list(self):
        return self.order_by('-received_at')
