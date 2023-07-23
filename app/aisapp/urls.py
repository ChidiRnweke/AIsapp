from rest_framework.routers import DefaultRouter
from app.aisapp.views.user import UserViewSet

router = DefaultRouter()
router.register(r"users", UserViewSet, basename="user")
urlpatterns = router.urls
