from rest_framework import permissions

class IsAuthenticatedForWriteOnly(permissions.BasePermission):
    """
    Custom permission to only require authentication for write operations
    """
    def has_permission(self, request, view):
        # Allow GET, HEAD, OPTIONS requests
        if request.method in permissions.SAFE_METHODS:
            return True
        # Require authentication for POST, PUT, DELETE
        return request.user and request.user.is_authenticated 