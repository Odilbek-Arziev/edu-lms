from rest_framework import serializers
from users.models import EmailVerificationCode


class EmailVerificationCodeSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()

    class Meta:
        model = EmailVerificationCode
        fields = ['email']
