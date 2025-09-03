from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views.auth import AuthViewSet
from users.views.code import CodeViewSet

router = DefaultRouter()
router.register("auth", AuthViewSet, basename="auth")
router.register("code", CodeViewSet, basename="code")

urlpatterns = [
    path("", include(router.urls)),
]
