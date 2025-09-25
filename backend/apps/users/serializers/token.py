from django.db.models import Q
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework import serializers

from rest_framework_simplejwt.tokens import RefreshToken
from users.models import CustomUser


class CustomTokenObtainPairSerializer(serializers.Serializer):
    login = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        login_field = attrs.get("login")
        password = attrs.get("password")

        try:
            user = CustomUser.objects.get(Q(email=login_field) | Q(username=login_field))
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("Incorrect username/email or password")

        if not user.check_password(password):
            raise serializers.ValidationError("Incorrect username/email or password")

        if not user.is_active:
            raise serializers.ValidationError("User is not active. Please verify your email.")

        refresh = RefreshToken.for_user(user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "role": user.role,
            "email": user.email,
            "username": user.username,
        }


class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    pass
