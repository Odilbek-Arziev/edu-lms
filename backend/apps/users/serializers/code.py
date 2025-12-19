from rest_framework import serializers
from users.models import EmailVerificationCode

from users.models import CustomUser
from users.utils.recaptcha import verify_recaptcha


class EmailVerificationCodeSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    token = serializers.CharField(required=False)
    captcha = serializers.CharField(write_only=True)

    def validate(self, attrs):
        request = self.context['request']
        email = attrs.get("email")
        link_type = attrs.get('link_type')
        captcha_token = attrs.get('captcha')

        if not verify_recaptcha(captcha_token, request.META.get('REMOTE_ADDR')):
            raise serializers.ValidationError({'captcha': 'Проверка reCAPTCHA не пройдена'})

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError(f"User with email {email} not exists")

        if user.register_type.name != 'email':
            action_type = 'Password reset' if link_type == 'reset_password' else 'Email login'

            raise serializers.ValidationError(f"{action_type} is not supported for OAuth users")

        return attrs

    class Meta:
        model = EmailVerificationCode
        fields = ['email', 'token', 'captcha']
