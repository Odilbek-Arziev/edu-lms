from datetime import timedelta
import calendar
from django.utils import timezone


def integers_only(text) -> str:
    """
    Removes all symbols except integers
    ex: +998(91) 333 33 33 -> 998913333333
    """
    return ''.join(x for x in text if x.isdigit())


def trial_period():
    return timezone.now() + timedelta(days=14)


def increment_month(date, months):
    next_month = date.replace(day=1) + timedelta(32 * months)
    day = min(date.day, calendar.monthrange(next_month.year, next_month.month)[1])
    return next_month.replace(day=day)
