from rest_framework import serializers
from users.models import EmailVerificationCode

from users.models import CustomUser


class EmailVerificationCodeSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    token = serializers.CharField(required=False)

    class Meta:
        model = EmailVerificationCode
        fields = ['email', 'token']

    def validate(self, attrs):
        email = attrs.get("email")
        link_type = attrs.get('link_type')

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError(f"User with email {email} not exists")

        if user.register_type != 'email':
            action_type = 'Password reset' if link_type == 'reset_password' else 'Email login'

            raise serializers.ValidationError(f"{action_type} is not supported for OAuth users")

        return attrs
