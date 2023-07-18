from django.db import models
from django_extensions.db.models import TimeStampedModel, TitleDescriptionModel
from rest_framework.serializers import ModelSerializer
from aisapp.models.todo import Aspect
import calendar


class TimeUnit(TimeStampedModel, TitleDescriptionModel):
    total_time_budget = models.DurationField()
    total_time_spent = models.DurationField()

    class Meta:
        abstract = True


class DayPreset(TimeStampedModel):
    total_time_budget = models.DurationField()
    day_of_week = models.PositiveSmallIntegerField(
        choices=list(zip(range(7), calendar.day_name))
    )


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
                CalendarDay.objects.get_or_create(
                    date=day_date, calendar_month=self, day_preset=day_preset
                )
            except DayPreset.DoesNotExist:
                print(f"DayPreset does not exist for day {day_date.weekday()}")


class CalendarDay(TimeUnit):
    date = models.DateField()
    calendar_month = models.ForeignKey(
        to=CalendarMonth,
        on_delete=models.SET_NULL,
        null=True,
        related_name="calendar_days",
    )
    day_preset = models.ForeignKey(
        to=DayPreset, on_delete=models.DO_NOTHING, related_name="calendar_days"
    )

    @property
    def day_of_week(self):
        return self.date.weekday()

    def save(self, **kwargs):
        if not self.total_time_budget:
            self.total_time_budget = self.day_preset.total_time_budget
        return super().save(**kwargs)


class RatioPreset(TimeStampedModel):
    aspect = models.ForeignKey(
        Aspect, on_delete=models.CASCADE, related_name="ratio_preset"
    )
    preferred_time_spent = models.DurationField()


class RatioPresetSerializer(ModelSerializer):
    class Meta:
        model = RatioPreset
        fields = ["aspect", "preferred_time_spent"]


class DayPresetSerializer(ModelSerializer):
    class Meta:
        model = DayPreset
        fields = ["total_time_budget", "day_of_week"]


class CalendarDaySerializer(ModelSerializer):
    class Meta:
        model = CalendarDay
        fields = ["date", "calendar_month"]


class CalendarMonthSerializer(ModelSerializer):
    class Meta:
        model = CalendarMonth
        fields = ["date"]
