from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from users.serializers.register import RegisterSerializer
from users.serializers.token import CustomTokenObtainPairSerializer, CustomTokenRefreshSerializer
from users.models import EmailVerificationCode
from users.services.email import send_email_code


class AuthViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        verification_code = EmailVerificationCode.objects.create_for_email(user.email)
        send_email_code(verification_code)

        return Response({"msg": "registered, check your email", "user": serializer.data})

    @action(detail=False, methods=["post"])
    def login(self, request):
        serializer = CustomTokenObtainPairSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)

    @action(detail=False, methods=["post"])
    def refresh(self, request):
        serializer = CustomTokenRefreshSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)
