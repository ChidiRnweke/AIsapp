from rest_framework import viewsets
from django.contrib.auth.models import User

from aisapp.models.calendar import DayPreset, SharedCalendarMonth, SharedCalendarDay
from aisapp.models.serializers import (
    DayPresetSerializer,
    SharedCalendarMonthSerializer,
    SharedCalendarDaySerializer,
)
from aisapp.permissions import IsOwner


class DayPresetViewSet(viewsets.ModelViewSet):
    queryset = DayPreset.objects.all()
    serializer_class = DayPresetSerializer
    permission_classes = [IsOwner]

    def get_queryset(self):
        user = self.request.user
        if user and user.is_authenticated:
            return self.queryset.filter(id=user.id)  # type: ignore
        return User.objects.none()


class SharedCalendarMonthViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SharedCalendarMonth.objects.all()
    serializer_class = SharedCalendarMonthSerializer


class SharedCalendarDayViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SharedCalendarDay.objects.all()
    serializer_class = SharedCalendarDaySerializer
