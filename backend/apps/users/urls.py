from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views.auth import AuthViewSet
from users.views.code import CodeViewSet
from users.views.social_auth import SocialLoginViewSet
from users.views.magic_link import MagicLinkViewSet
from users.views.reset_password import ResetPasswordViewSet
from users.views.user import UserViewSet
from users.views.register_type import RegisterTypeViewSet

router = DefaultRouter()
router.register("register_types", RegisterTypeViewSet, basename="register_types")
router.register("auth", AuthViewSet, basename="auth")
router.register("code", CodeViewSet, basename="code")
router.register("magic_link", MagicLinkViewSet, basename="magic_link")
router.register("social", SocialLoginViewSet, basename="social")
router.register("password", ResetPasswordViewSet, basename="password")
router.register("", UserViewSet, basename="users")

urlpatterns = [
    path("", include(router.urls)),
]
