from rest_framework import serializers
from users.models import EmailVerificationCode
from django.utils import timezone
from datetime import timedelta
from random import randrange


class EmailVerificationCodeSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()

    class Meta:
        model = EmailVerificationCode
        fields = ['email']

    def create(self, validated_data):
        email = validated_data['email']

        EmailVerificationCode.objects.filter(
            email=email,
            is_used=False,
            expires_at__gt=timezone.now()
        ).update(is_used=True)

        code = f"{randrange(0, 10000):04d}"
        expires_at = timezone.now() + timedelta(minutes=3)

        return EmailVerificationCode.objects.create(
            email=email,
            code=code,
            expires_at=expires_at,
            code_type="registration"
        )
