from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from users.serializers.code import EmailVerificationCodeSerializer
from users.serializers.verify_code import VerifyCodeSerializer

from users.services.email import send_email_code


class CodeViewSet(viewsets.ViewSet):
    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def send_verification_code(self, request):
        serializer = EmailVerificationCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        verification_code = serializer.save()
        send_email_code(verification_code)
        return Response({"msg": "Код успешно отправлен"})

    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def verify_code(self, request):
        serializer = VerifyCodeSerializer(data=request.data)
        if serializer.is_valid():
            verification = serializer.validated_data['verification']
            verification.is_used = True
            verification.save()
            return Response({'msg': 'Код подтвержден'})
        return Response(serializer.errors)
