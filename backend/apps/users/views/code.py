from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from users.serializers.code import EmailVerificationCodeSerializer
from users.serializers.verify_code import VerifyCodeSerializer
from users.services.email import send_email_code

from users.models import EmailVerificationCode, CustomUser


class CodeViewSet(viewsets.ViewSet):
    class CodeViewSet(viewsets.ViewSet):
        @action(detail=False, methods=["post"], permission_classes=[AllowAny])
        def send_verification_code(self, request):
            serializer = EmailVerificationCodeSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            email = serializer.validated_data['email']
            verification_code = EmailVerificationCode.objects.create_for_email(email)

            send_email_code(verification_code)
            return Response({"msg": "Code sent successfully"})

    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def verify_code(self, request):
        serializer = VerifyCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        code = serializer.validated_data["code"]

        verification = EmailVerificationCode.objects.filter(
            email=email,
            code=code,
            code_type="registration",
            is_used=False,
            expires_at__gte=timezone.now()
        ).first()

        if not verification:
            return Response({"error": "Incorrect code"}, 400)

        user = CustomUser.objects.filter(email=email).first()
        if user:
            user.is_active = True
            user.save()

        verification.is_used = True
        verification.save()

        return Response({"msg": "Email confirmed"})
