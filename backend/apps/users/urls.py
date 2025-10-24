from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views.auth import AuthViewSet
from users.views.code import CodeViewSet
from users.views.social_auth import SocialLoginViewSet
from users.views.magic_link import MagicLinkViewSet

router = DefaultRouter()
router.register("auth", AuthViewSet, basename="auth")
router.register("code", CodeViewSet, basename="code")
router.register("magic_link", MagicLinkViewSet, basename="magic_link")
router.register("social", SocialLoginViewSet, basename="social")

urlpatterns = [
    path("", include(router.urls)),
]
