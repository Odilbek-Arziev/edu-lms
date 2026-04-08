from django.core.cache import cache
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from drf_spectacular.types import OpenApiTypes

from users.models import EmailVerificationCode, CustomUser
from users.serializers.code import EmailVerificationCodeSerializer
from users.services.email import send_magic_link
from users.services.magic_link import handle_magic_link


class MagicLinkViewSet(viewsets.ViewSet):

    @extend_schema(
        summary="Sending magic link",
        request=EmailVerificationCodeSerializer,
        responses={
            201: OpenApiResponse(description="Auth via email is successful"),
            400: OpenApiResponse(description="Invalid url or incorrect email")
        }
    )
    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def send_magic_link(self, request):
        link_type = request.query_params.get('link_type', 'login')
        serializer = EmailVerificationCodeSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        key = f"magic_link_limit:{email}"
        if cache.get(key):
            return Response(
                {'detail': 'Too many requests. Please. try again after 1 min'},
                status=429
            )
        cache.set(key, True, timeout=60)

        EmailVerificationCode.objects.filter(email=email, is_used=False, code_type=link_type).delete()
        instance, token = EmailVerificationCode.objects.create_for_token(email, code_type=link_type)
        send_magic_link(token, email, link_type)
        return Response({"msg": "Code sent successfully"}, status=200)

    @extend_schema(
        summary="Magic Link Verification",
        description="Verifies the unique token provided in the link sent to the user's email.",
        parameters=[
            OpenApiParameter(
                name="token",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description="Unique token from the email",
                required=True
            ),
        ],
        request=None,
        responses={
            200: OpenApiResponse(description="Successful login / verification"),
            400: OpenApiResponse(description="Token is missing or invalid"),
            404: OpenApiResponse(description="Token not found or expired")
        }
    )
    @action(detail=False, methods=["get"], permission_classes=[AllowAny])
    def verify_magic_token(self, request):
        token = request.query_params.get("token")
        if not token:
            return Response({"detail": "Missing token"}, status=400)
        response_data, status_code = handle_magic_link(token)
        return Response(response_data, status=status_code)
