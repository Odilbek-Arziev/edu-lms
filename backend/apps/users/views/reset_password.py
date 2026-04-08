from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiResponse

from users.serializers.reset_password import ResetPasswordSerializer
from users.services.reset_password import handle_reset_password


class ResetPasswordViewSet(viewsets.ViewSet):
    @extend_schema(
        summary="Password reset",
        request=ResetPasswordSerializer,
        responses={
            201: OpenApiResponse(description="Password reset successfully."),
            400: OpenApiResponse(description="Error resetting password")
        }
    )
    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def reset_password(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        token = serializer.validated_data["token"]
        password = serializer.validated_data["password"]

        response_data, status = handle_reset_password(request, token, password)

        return Response(response_data, status=status)
