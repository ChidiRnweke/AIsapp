from django.db import models
from django.forms import ValidationError
from django_extensions.db.models import TimeStampedModel, TitleDescriptionModel


class Resource(TitleDescriptionModel, TimeStampedModel):
    pass


class Task(TimeStampedModel, TitleDescriptionModel):
    time_spent = models.PositiveIntegerField(default=0)
    time_estimate = models.PositiveIntegerField(null=True, blank=True)
    resource = models.ManyToManyField(Resource)
    preferred_finish = models.DateField(null=True, blank=True)
    task_dependencies = models.ManyToManyField(
        "self", symmetrical=False, null=True, blank=True
    )
    finished = models.BooleanField(default=False)


class History(models.Model):
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
