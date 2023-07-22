import calendar
from django.contrib.auth.models import User
from django.db import models

from django_extensions.db.models import TimeStampedModel


class TimeUnit(TimeStampedModel):
    """
    Abstract model representing a generic time unit with a budget and spent duration.
    """

    total_time_budget = models.DurationField()
    total_time_spent = models.DurationField()

    class Meta:
        abstract = True


class DayPreset(TimeStampedModel):
    """
    Model representing a preset for a user's typical day with a total time budget.
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_time_budget = models.DurationField()
    day_of_week = models.PositiveSmallIntegerField(
        choices=list(zip(range(7), calendar.day_name))
    )


class SharedCalendarMonth(models.Model):
    """
    Model representing a shared calendar month across users.
    """

    date = models.DateField(unique=True)

    @property
    def year(self):
        return self.date.year

    @property
    def month_name(self):
        return calendar.month_name[self.date.month]

    def __str__(self):
        return self.date.strftime("%B %Y")


class UserCalendarMonth(models.Model):
    """
    Model representing a user-specific calendar month.
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    month = models.ForeignKey(SharedCalendarMonth, on_delete=models.CASCADE)

    class Meta:
        unique_together = (
            "user",
            "month",
        )

    def __str__(self):
        return f"{self.user.username} - {self.month}"


class SharedCalendarDay(models.Model):
    """
    Model representing a shared calendar day across users.
    """

    date = models.DateField(unique=True)

    def __str__(self):
        return self.date.strftime("%Y-%m-%d")


class UserCalendarDay(TimeUnit):
    """
    Model representing a user-specific calendar day with time unit details and day preset.
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    day_calendar = models.ForeignKey(SharedCalendarDay, on_delete=models.CASCADE)
    day_of_week = models.PositiveSmallIntegerField(editable=False)
    day_preset = models.ForeignKey(
        to=DayPreset,
        on_delete=models.PROTECT,
        related_name="calendar_days",
    )

    class Meta:
        unique_together = (
            "user",
            "day_calendar",
        )

    def __str__(self):
        return f"{self.user.username} - {self.day_calendar}"


class AspectTimePreset(TimeStampedModel):
    """
    Model representing a preset time ratio for a user and an aspect.
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    aspect = models.ForeignKey(
        Aspect, on_delete=models.CASCADE, related_name="ratio_preset"
    )
    preferred_time_spent = models.DurationField()
