from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiResponse

from users.serializers.register import RegisterSerializer
from users.serializers.auth import CustomTokenObtainPairSerializer, CustomTokenRefreshSerializer
from users.models import EmailVerificationCode
from users.services.email import send_email_code
from users.utils.throttles import CaptchaThrottle


class AuthViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    throttle_classes = [CaptchaThrottle]

    @extend_schema(
        summary="New user registration",
        request=RegisterSerializer,
        responses={
            201: OpenApiResponse(description="The user has been created and the code has been sent to your email."),
            400: OpenApiResponse(description="Validation error")
        }
    )
    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def register(self, request):
        serializer = RegisterSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        verification_code = EmailVerificationCode.objects.create_for_email(user.email.lower())
        send_email_code(verification_code)

        return Response({"msg": "created", "user": serializer.data})

    @extend_schema(
        summary="Authorization (obtaining a token)",
        request=CustomTokenObtainPairSerializer,
        responses={200: CustomTokenObtainPairSerializer}
    )
    @action(detail=False, methods=["post"])
    def login(self, request):
        serializer = CustomTokenObtainPairSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)

    @extend_schema(
        summary="JWT token update",
        request=CustomTokenRefreshSerializer,
        responses={200: CustomTokenRefreshSerializer}
    )
    @action(detail=False, methods=["post"])
    def refresh(self, request):
        serializer = CustomTokenRefreshSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)
