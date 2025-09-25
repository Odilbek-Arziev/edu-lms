from django.utils.timezone import now
from rest_framework import serializers

from users.models import EmailVerificationCode


class VerifyCodeSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=4)

    def validate_code(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("Код должен быть числовым")
        return value

    def validate(self, attrs):
        email, code = attrs["email"], attrs["code"]

        verification = EmailVerificationCode.objects.filter(
            email=email, is_used=False
        ).first()

        if not verification:
            raise serializers.ValidationError({"non_field_errors": ["Код не найден или истек. Запросите новый код"]})

        if verification.expires_at < now():
            raise serializers.ValidationError({"non_field_errors": ["Срок действия кода истёк"]})

        if verification.code != code:
            verification.attempt_left -= 1
            verification.save(update_fields=["attempt_left"])

            raise serializers.ValidationError({
                "non_field_errors": [f"Неверный код, осталось попыток: {verification.attempt_left}"]
            })

        attrs["verification"] = verification
        return attrs
