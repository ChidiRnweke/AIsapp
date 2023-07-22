from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from datetime import timedelta
import calendar
from aisapp.models.calendar import (
    UserCalendarDay,
    DayPreset,
    SharedCalendarMonth,
    SharedCalendarDay,
)


@receiver(pre_save, sender=UserCalendarDay)
def set_day_preset_and_time_budget(
    sender: UserCalendarDay, instance: UserCalendarDay, **kwargs
):
    """
    Signal to set day preset and total time budget before saving a UserCalendarDay instance.
    """
    instance.day_of_week = instance.day_calendar.date.weekday()
    if not instance.day_preset:
        try:
            instance.day_preset = DayPreset.objects.get(
                day_of_week=instance.day_of_week, user=instance.user
            )
        except DayPreset.DoesNotExist:
            instance.day_preset = DayPreset(
                user=instance.user,
                total_time_budget=timedelta(hours=2),
                day_of_week=instance.day_of_week,
            )
            instance.day_preset.save()
    if not instance.total_time_budget:
        instance.total_time_budget = instance.day_preset.total_time_budget


@receiver(post_save, sender=SharedCalendarMonth)
def create_shared_calendar_days(
    sender: SharedCalendarMonth, instance: SharedCalendarMonth, created, **kwargs
):
    """
    Signal to create SharedCalendarDay instances for each day in the month after a SharedCalendarMonth is created.
    """
    if created:
        last_day = calendar.monthrange(instance.date.year, instance.date.month)[1]
        for day in range(1, last_day + 1):
            day_date = instance.date.replace(day=day)
            SharedCalendarDay.objects.create(date=day_date)
