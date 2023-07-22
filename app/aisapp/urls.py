from rest_framework.routers import DefaultRouter
from aisapp.views.todo import UserViewSet

router = DefaultRouter()
router.register(r"users", UserViewSet, basename="user")
urlpatterns = router.urls
