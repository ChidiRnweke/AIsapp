from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework.routers import DefaultRouter

from aisapp.views.user import UserViewSet
from aisapp.views.tokens import CookieTokenObtainPairView, CookieTokenRefreshView


router = DefaultRouter()
router.register(r"users", UserViewSet, basename="user")


urlpatterns = [
    path(
        "",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path("", include(router.urls)),
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
    path("token/", CookieTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", CookieTokenRefreshView.as_view(), name="token_refresh"),
]
