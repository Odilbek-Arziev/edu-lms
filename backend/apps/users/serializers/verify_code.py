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
        verification = EmailVerificationCode.objects.filter(email=attrs["email"], is_used=False).first()

        if not verification:
            raise serializers.ValidationError({"non_field_errors": ["Код не найден или истек"]})

        attrs["verification"] = verification
        return attrs
