from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from users.models import EmailVerificationCode, CustomUser
from users.serializers.code import EmailVerificationCodeSerializer
from users.services.magic_link import send_magic_link, handle_magic_link


class MagicLinkViewSet(viewsets.ViewSet):
    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def send_magic_link(self, request):
        serializer = EmailVerificationCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        EmailVerificationCode.objects.filter(email=email, is_used=False, code_type='login').delete()
        instance, token = EmailVerificationCode.objects.create_for_token(email)
        send_magic_link(token, email)
        return Response({"msg": "Code sent successfully"})

    @action(detail=False, methods=["get"], permission_classes=[AllowAny])
    def verify_magic_token(self, request):
        email = request.query_params.get("email")
        token = request.query_params.get("token")
        if not email or not token:
            return Response({"detail": "Missing email or token"}, status=400)

        response_data, status_code = handle_magic_link(email, token)
        return Response(response_data, status=status_code)
