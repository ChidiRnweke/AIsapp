from django.db import models, transaction
from django.forms import ValidationError
from django_extensions.db.models import TimeStampedModel, TitleDescriptionModel
from django.db.models import QuerySet
from datetime import timedelta


class ResourceType(TitleDescriptionModel, TimeStampedModel):
    """
    Represents a type or category for resources.
    """

    user = models.ForeignKey("auth.User", on_delete=models.CASCADE)


class Resource(TitleDescriptionModel, TimeStampedModel):
    """
    Represents a resource that can be associated with tasks.
    """

    user = models.ForeignKey("auth.User", on_delete=models.CASCADE)
    resource_types = models.ManyToManyField(
        ResourceType, related_name="resources", blank=True
    )


class Todo(TimeStampedModel, TitleDescriptionModel):
    """
    Abstract model representing a unit of work to be done.
    """

    time_estimate = models.DurationField(null=True, blank=True)
    preferred_finish = models.DateField(null=True, blank=True)
    is_finished = models.BooleanField(default=False)
    time_spent = models.DurationField(default=timedelta(hours=0))
    user = models.ForeignKey("auth.User", on_delete=models.CASCADE)

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        if self.has_changed():
            self.create_history()
        super().save(*args, **kwargs)

    def has_changed(self) -> bool:
        """
        Determine if relevant fields have changed that warrant creating a new history record.
        """
        # If the object is not yet in the database, then it's considered changed.
        if not self.pk:
            return True

        # Fetch the current database values for this instance.
        db_instance = Todo.objects.get(pk=self.pk)

        # Check the fields for changes and return True if any have changed.
        fields_to_check = [
            "time_estimate",
            "preferred_finish",
            "is_finished",
            "time_spent",
        ]
        for field in fields_to_check:
            if getattr(self, field) != getattr(db_instance, field):
                return True
        return False

    def create_history(self):
        """
        Create a history record based on current state.
        """
        # Overridden in child classes
        pass


class Aspect(Todo):
    """
    Represents a main unit of work, aggregating milestones.
    """

    @property
    def time_spent(self):
        milestones: QuerySet = self.milestones.all()  # type: ignore
        time = milestones.aggregate(total_time_spent=models.Sum("time_spent"))[
            "total_time_spent"
        ]
        return time if time else timedelta(hours=0)

    @transaction.atomic
    def create_history(self):
        history = History(
            preferred_finish=self.preferred_finish,
            time_spent=self.time_spent,
            time_estimate=self.time_estimate,
            is_finished=self.is_finished,
            user=self.user,
        )
        AspectHistory.objects.create(aspect=self, history=history)


class Milestone(Todo):
    """
    Represents a sub-unit of work under an aspect.
    """

    aspect = models.ForeignKey(
        Aspect, on_delete=models.CASCADE, related_name="milestones"
    )

    @property
    def time_spent(self):
        tasks: QuerySet = self.tasks.all()  # type: ignore
        time = tasks.aggregate(total_time_spent=models.Sum("time_spent"))[
            "total_time_spent"
        ]
        return time if time else timedelta(hours=0)

    @transaction.atomic
    def create_history(self):
        history = History(
            preferred_finish=self.preferred_finish,
            time_spent=self.time_spent,
            time_estimate=self.time_estimate,
            is_finished=self.is_finished,
            user=self.user,
        )
        MilestoneHistory.objects.create(milestone=self, history=history)


class Task(Todo):
    """
    Represents an atomic unit of work.
    """

    resources = models.ManyToManyField(Resource)
    prerequisites = models.ManyToManyField("self", symmetrical=False, blank=True)
    milestone = models.ForeignKey(
        Milestone, on_delete=models.CASCADE, related_name="tasks"
    )

    @transaction.atomic
    def create_history(self):
        history = History(
            preferred_finish=self.preferred_finish,
            time_spent=self.time_spent,
            time_estimate=self.time_estimate,
            is_finished=self.is_finished,
            user=self.user,
        )
        TaskHistory.objects.create(task=self, history=history)


class History(models.Model):
    """
    Base model for histories of work units.
    """

    preferred_finish = models.DateField(null=True, blank=True)
    time_spent = models.DurationField(default=timedelta(hours=0))
    time_estimate = models.DurationField(null=True, blank=True)
    is_finished = models.BooleanField(default=False)
    user = models.ForeignKey("auth.User", on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        if self.pk:
            raise ValidationError(
                f"you may not edit an existing {self._meta.model_name}"
            )
        super().save(*args, **kwargs)


class AspectHistory(TimeStampedModel):
    """
    Stores the history of an aspect.
    """

    aspect = models.ForeignKey(
        Aspect, on_delete=models.CASCADE, related_name="histories"
    )
    history = models.ForeignKey(History, on_delete=models.CASCADE)


class MilestoneHistory(TimeStampedModel):
    """
    Stores the history of a milestone.
    """

    milestone = models.ForeignKey(
        Milestone, on_delete=models.CASCADE, related_name="histories"
    )
    history = models.ForeignKey(History, on_delete=models.CASCADE)


class TaskHistory(TimeStampedModel):
    """
    Stores the history of a task.
    """

    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="histories")
    history = models.ForeignKey(History, on_delete=models.CASCADE)


class AspectTimePreset(TimeStampedModel):
    """
    Model representing a preset time ratio for a user and an aspect.
    """

    user = models.ForeignKey("auth.User", on_delete=models.CASCADE)
    aspect = models.ForeignKey(
        Aspect, on_delete=models.CASCADE, related_name="ratio_preset"
    )
    preferred_time_spent = models.DurationField()
