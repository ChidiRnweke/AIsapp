from django.db import models
from django.forms import ValidationError
from django_extensions.db.models import TimeStampedModel, TitleDescriptionModel
from django.db.models import QuerySet
from rest_framework.serializers import ModelSerializer
from datetime import timedelta


class ResourceType(TitleDescriptionModel, TimeStampedModel):
    ...


class Resource(TitleDescriptionModel, TimeStampedModel):
    resource_type = models.ForeignKey(
        ResourceType, models.SET_NULL, related_name="resources", null=True, blank=True
    )


class Todo(TimeStampedModel, TitleDescriptionModel):
    time_estimate = models.DurationField(null=True, blank=True)
    preferred_finish = models.DateField(null=True, blank=True)
    is_finished = models.BooleanField(default=False)
    time_spent = models.DurationField(default=timedelta(hours=0))

    def save(self, *args, **kwargs):
        history = History(
            self.preferred_finish, self.time_spent, self.time_estimate, self.is_finished
        )
        history.save()
        return super().save(*args, **kwargs)

    class Meta:
        abstract = True


class Aspect(Todo):
    @property
    def time_spent(self):
        milestones: QuerySet[Milestone] = self.milestones.all()  # type: ignore
        time = milestones.aggregate(total_time_spent=models.Sum("time_spent"))[
            "total_time_spent"
        ]
        return time if time else timedelta(hours=0)


class Milestone(Todo):
    aspect = models.ForeignKey(Aspect, models.CASCADE, related_name="milestones")

    @property
    def time_spent(self):
        tasks: QuerySet[Task] = self.tasks.all()  # type: ignore
        time = tasks.aggregate(total_time_spent=models.Sum("time_spent"))[
            "total_time_spent"
        ]
        return time if time else timedelta(hours=0)


class Task(Todo):
    resources = models.ManyToManyField(Resource)
    task_dependencies = models.ManyToManyField("self", symmetrical=False, blank=True)
    milestone = models.ForeignKey(
        Milestone, on_delete=models.CASCADE, related_name="tasks"
    )


class History(models.Model):
    """Stores the history of tasks, milestone and aspect."""

    preferred_finish = models.DateField(null=True, blank=True)
    time_spent = models.DurationField(default=timedelta(hours=0))
    time_estimate = models.DurationField(null=True, blank=True)
    finished = models.BooleanField(default=False)

    def save(self, *args, **kwargs) -> None:
        # The history of an object is immutable. You can only save it if it does not exist.
        if self.pk:
            raise ValidationError(
                f"you may not edit an existing {self._meta.model_name}"
            )
        super(History, self).save(*args, **kwargs)


__default_fields = ["created", "modified", "title", "description"]


class ResourceTypeSerializer(ModelSerializer):
    class Meta:
        model = ResourceType
        fields = __default_fields


class ResourceSerializer(ModelSerializer):
    class Meta:
        model = Resource
        fields = __default_fields + ["resource_type"]


class TaskSerializer(ModelSerializer):
    class Meta:
        model = Task
        fields = __default_fields + [
            "time_estimate",
            "preferred_finish",
            "is_finished",
            "time_spent",
            "milestone",
        ]


class MilestoneSerializer(ModelSerializer):
    class Meta:
        model = Milestone
        fields = __default_fields + [
            "time_estimate",
            "preferred_finish",
            "is_finished",
            "time_spent",
            "aspect",
        ]


class AspectSerializer(ModelSerializer):
    class Meta:
        model = Aspect
        fields = __default_fields + [
            "time_estimate",
            "preferred_finish",
            "is_finished",
            "time_spent",
        ]
