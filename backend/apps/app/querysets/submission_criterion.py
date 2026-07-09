from core.querysets.base_queryset import BaseQuerySet


class SubmissionCriterionResultQuerySet(BaseQuerySet):
    def by_review(self, review_id):
        if not review_id:
            return self
        return self.filter(review_id=review_id)

    def by_submission(self, submission_id):
        if not submission_id:
            return self
        return self.filter(review__submission_id=submission_id)

    def list(self, review=None, submission=None):
        return (
            self.by_review(review)
            .by_submission(submission)
            .order_by("-created_at")
        )
