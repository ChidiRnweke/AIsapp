from rest_framework import permissions


class IsOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to view or edit it.
    """

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class IsUserOrDenied(permissions.BasePermission):
    """
    Custom permission to only allow users to view or edit their own data.
    """

    def has_object_permission(self, request, view, obj):
        return obj == request.user
