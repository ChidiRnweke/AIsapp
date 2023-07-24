from django.contrib.auth import password_validation
from django.contrib.auth.models import User
from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField

from .calendar import (
    DayPreset,
    SharedCalendarDay,
    SharedCalendarMonth,
    UserCalendarDay,
    UserCalendarMonth,
)
from .todo import (
    Aspect,
    AspectTimePreset,
    History,
    Milestone,
    Resource,
    ResourceType,
    Task,
)

default_fields_calendar = ["created", "modified", "user"]
default_fields_todo = ["created", "modified", "title", "description", "user"]
user_fields = ["id", "username", "first_name", "last_name", "email"]


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = user_fields


class UserCredentialSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = user_fields + ["password"]

    def validate_password(self, value):
        password_validation.validate_password(value)
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()

        return user


class UserDetailSerializer(ModelSerializer):
    calendar_day = PrimaryKeyRelatedField(
        many=True, queryset=SharedCalendarDay.objects.all()
    )
    calendar_month = PrimaryKeyRelatedField(
        many=True, queryset=SharedCalendarMonth.objects.all()
    )
    tasks = PrimaryKeyRelatedField(many=True, queryset=Task.objects.all())
    milestones = PrimaryKeyRelatedField(many=True, queryset=Milestone.objects.all())
    aspects = PrimaryKeyRelatedField(many=True, queryset=Aspect.objects.all())

    class Meta:
        model = User
        fields = user_fields + [
            "calendar_day",
            "calendar_month",
            "tasks",
            "milestones",
            "aspects",
        ]


class AspectTimePresetSerializer(ModelSerializer):
    class Meta:
        model = AspectTimePreset
        fields = default_fields_calendar + ["aspect", "preferred_time_spent"]


class DayPresetSerializer(ModelSerializer):
    class Meta:
        model = DayPreset
        fields = default_fields_calendar + ["total_time_budget", "day_of_week"]


class SharedCalendarDaySerializer(ModelSerializer):
    class Meta:
        model = SharedCalendarDay
        fields = ["date"]


class SharedCalendarMonthSerializer(ModelSerializer):
    class Meta:
        model = SharedCalendarMonth
        fields = ["date"]


class UserCalendarDaySerializer(ModelSerializer):
    class Meta:
        model = UserCalendarDay
        fields = default_fields_calendar + [
            "date",
            "user_calendar_month",
            "total_time_budget",
            "total_time_spent",
        ]


class UserCalendarMonthSerializer(ModelSerializer):
    class Meta:
        model = UserCalendarMonth
        fields = default_fields_calendar + [
            "date",
            "total_time_budget",
            "total_time_spent",
        ]


class ResourceTypeSerializer(ModelSerializer):
    class Meta:
        model = ResourceType
        fields = default_fields_todo


class ResourceSerializer(ModelSerializer):
    resource_type = PrimaryKeyRelatedField(
        many=True, queryset=ResourceType.objects.all()
    )

    class Meta:
        model = Resource
        fields = default_fields_todo + ["resource_type"]


class TaskSerializer(ModelSerializer):
    class Meta:
        model = Task
        fields = default_fields_todo + [
            "time_estimate",
            "preferred_finish",
            "is_finished",
            "time_spent",
            "milestone",
            "resources",
        ]


class MilestoneSerializer(ModelSerializer):
    tasks = PrimaryKeyRelatedField(many=True, queryset=Task.objects.all())

    class Meta:
        model = Milestone
        fields = default_fields_todo + [
            "time_estimate",
            "preferred_finish",
            "is_finished",
            "time_spent",
            "tasks",
            "aspect",
        ]


class AspectSerializer(ModelSerializer):
    milestones = PrimaryKeyRelatedField(many=True, queryset=Milestone.objects.all())

    class Meta:
        model = Aspect
        fields = default_fields_todo + [
            "time_estimate",
            "preferred_finish",
            "is_finished",
            "time_spent",
            "milestones",
        ]


class HistorySerializer(ModelSerializer):
    class Meta:
        model = History
        fields = default_fields_todo + [
            "time_estimate",
            "preferred_finish",
            "is_finished",
            "time_spent",
        ]
