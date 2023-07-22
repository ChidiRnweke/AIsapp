from django.apps import AppConfig


class AisappConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "aisapp"

    def ready(self) -> None:
        import aisapp.signals  # noqa: F401
