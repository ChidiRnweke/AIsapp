from rest_framework import viewsets
from django.contrib.auth.models import User
from aisapp.models.serializers import UserCredentialSerializer
from aisapp.permissions import IsUserOrDenied


class UserViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing user instances.
    """

    queryset = User.objects.all()
    serializer_class = UserCredentialSerializer
    permission_classes = [IsUserOrDenied]

    def get_queryset(self):
        user = self.request.user
        if user and user.is_authenticated:
            return self.queryset.filter(id=user.id)  # type: ignore
        return User.objects.none()
