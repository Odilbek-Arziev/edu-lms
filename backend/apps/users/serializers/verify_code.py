from rest_framework import serializers
from users.models import EmailVerificationCode
from django.utils.timezone import now


class VerifyCodeSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=4)

    def validate(self, data):
        try:
            verification = EmailVerificationCode.objects.get(
                email=data['email'],
                code=data['code'],
                is_used=False
            )
        except EmailVerificationCode.DoesNotExist:
            raise serializers.ValidationError('Incorrect code')

        if (now() - verification.created_at).seconds > 180:
            raise serializers.ValidationError('The code has expired')

        data['verification'] = verification
        return data
