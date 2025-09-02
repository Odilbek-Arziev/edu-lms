from core.querysets.base_queryset import BaseQuerySet


class HomeworkCriterionQuerySet(BaseQuerySet):
    def by_homework(self, homework):
        if not homework:
            return self
        return self.filter(homework=homework)

    def list(self, homework):
        return (
            self.order_by("-created_at")
                .by_homework(homework)
        )
