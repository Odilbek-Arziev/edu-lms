from axes.handlers.proxy import AxesProxyHandler
from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from users.models import CustomUser
from users.utils.axes_helpers import prepare_axes_request
from users.services.email import send_security_alert

import logging

User = get_user_model()
axes_handler = AxesProxyHandler()
logger = logging.getLogger(__name__)


class CustomTokenObtainPairSerializer(serializers.Serializer):
    login = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        request = self.context['request']
        django_request = prepare_axes_request(request._request)

        login_field = attrs.get("login").lower()
        password = attrs.get("password")
        credentials = {"username": login_field}

        try:
            user = CustomUser.objects.get(Q(email=login_field) | Q(username=login_field))
        except CustomUser.DoesNotExist:
            axes_handler.user_login_failed(sender=User, credentials=credentials, request=django_request)
            raise serializers.ValidationError(f"User with {login_field} does not exists")

        if axes_handler.is_locked(request=django_request, credentials=credentials):
            raise serializers.ValidationError(
                "Your account has been temporarily locked due to repeated login failures."
            )

        if not user.check_password(password):
            axes_handler.user_login_failed(sender=User, credentials=credentials, request=django_request)
            attempts = axes_handler.get_failures(request=django_request, credentials=credentials)

            if attempts == 3:
                send_security_alert(user.email)

            raise serializers.ValidationError("Incorrect username/email or password")

        if not user.is_active:
            raise serializers.ValidationError("User is not active. Please verify your email.")

        axes_handler.user_logged_in(sender=User, request=django_request, user=user)

        refresh = RefreshToken.for_user(user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "role": getattr(user, "role", None),
            "email": user.email.lower(),
            "username": user.username,
        }


class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    pass
