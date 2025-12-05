from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from users.models import CustomUser
from users.utils.recaptcha import verify_recaptcha


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=CustomUser.objects.all())]
    )
    password = serializers.CharField(write_only=True, min_length=6)
    captcha = serializers.CharField(write_only=True)

    def validate(self, attrs):
        request = self.context['request']
        captcha_token = attrs.get('captcha')

        if not verify_recaptcha(captcha_token, request.META.get('REMOTE_ADDR')):
            raise serializers.ValidationError({'captcha': 'Проверка reCAPTCHA не пройдена'})

        return attrs

    def create(self, validated_data):
        return CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'].lower(),
            password=validated_data['password'],
            register_type='email'
        )

    class Meta:
        model = CustomUser
        fields = ['email', 'password', 'username', 'captcha']
