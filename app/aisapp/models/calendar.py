from django.db import models
from django_extensions.db.models import TimeStampedModel, TitleDescriptionModel
from aisapp.models.todo import Aspect
import calendar


class DayPreset(TimeStampedModel):
    total_time_budget = models.DurationField()
    day_of_week = models.PositiveSmallIntegerField(
        choices=list(zip(range(7), calendar.day_name))
    )


class TimeUnit(TimeStampedModel, TitleDescriptionModel):
    total_time_budget = models.DurationField()
    total_time_spent = models.DurationField()

    class Meta:
        abstract = True


class CalendarMonth(TimeUnit):
    date = models.DateField()

    @property
    def year(self):
        return self.date.year

    @property
    def month_name(self):
        return calendar.month_name[self.date.month]

    def save(self, **kwargs):
        super().save(**kwargs)
        for day in range(1, calendar.monthrange(self.year, self.date.month)[1] + 1):
            day_date = self.date.replace(day=day)
            try:
                day_preset = DayPreset.objects.get(day_of_week=day_date.weekday())
            except DayPreset.DoesNotExist:
                day_preset = None

            CalendarDay.objects.get_or_create(
                date=day_date,
                calendar_month=self,
                defaults={"day_preset": day_preset},
            )


class CalendarDay(TimeUnit):
    date = models.DateField()
    calendar_month = models.ForeignKey(
        to=CalendarMonth,
        on_delete=models.SET_NULL,
        null=True,
        related_name="calendar_days",
    )
    day_preset = models.ForeignKey(
        to=DayPreset, on_delete=models.SET_NULL, null=True, related_name="calendar_days"
    )

    @property
    def day_of_week(self):
        return self.date.weekday()

    def save(self, **kwargs):
        if not self.total_time_budget and self.day_preset:
            self.total_time_budget = self.day_preset.total_time_budget
        return super().save(**kwargs)


class RatioPresets(TimeStampedModel):
    aspect = models.ForeignKey(
        Aspect, on_delete=models.CASCADE, related_name="ratio_preset"
    )
    preferred_time_spent = models.DurationField()
