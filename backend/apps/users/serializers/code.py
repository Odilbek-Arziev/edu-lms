from rest_framework import serializers
from users.models import EmailVerificationCode


class EmailVerificationCodeSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    token = serializers.CharField(required=False)

    class Meta:
        model = EmailVerificationCode
        fields = ['email', 'token']
