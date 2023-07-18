from django.db import models
from django.forms import ValidationError
from django_extensions.db.models import TimeStampedModel, TitleDescriptionModel
from django.db.models import QuerySet


class ResourceType(TitleDescriptionModel, TimeStampedModel):
    type_name = models.TextField()


class Resource(TitleDescriptionModel, TimeStampedModel):
    name = models.TextField()
    resource_type = models.ForeignKey(
        ResourceType, models.SET_NULL, related_name="resources", null=True, blank=True
    )


class Todo(TimeStampedModel, TitleDescriptionModel):
    time_estimate = models.PositiveIntegerField(null=True, blank=True)
    preferred_finish = models.DateField(null=True, blank=True)
    is_finished = models.BooleanField(default=False)
    time_spent = models.PositiveIntegerField(default=0)

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
        return milestones.aggregate(time_spent=models.Sum())


class Milestone(Todo):
    aspect = models.ForeignKey(Aspect, models.CASCADE, related_name="milestones")

    @property
    def time_spent(self):
        tasks: QuerySet[Task] = self.tasks.all()  # type: ignore
        return tasks.aggregate(time_spent=models.Sum())


class Task(Todo):
    resources = models.ManyToManyField(Resource)
    task_dependencies = models.ManyToManyField(
        "self", symmetrical=False, null=True, blank=True
    )
    milestone = models.ForeignKey(
        Milestone, on_delete=models.CASCADE, related_name="tasks"
    )


class History(models.Model):
    """Stores the history of tasks, milestone and aspect."""

    preferred_finish = models.DateField(null=True, blank=True)
    time_spent = models.PositiveIntegerField(default=0)
    time_estimate = models.PositiveIntegerField(null=True, blank=True)
    finished = models.BooleanField(default=False)

    def save(self, *args, **kwargs) -> None:
        # The history of an object is immutable. You can only save it if it does not exist.
        if self.pk:
            raise ValidationError(
                f"you may not edit an existing {self._meta.model_name}"
            )
        super(History, self).save(*args, **kwargs)
