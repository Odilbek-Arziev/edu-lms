from django.db import models
from django.contrib.auth.models import AbstractUser
from core.models import BaseModel

from users.managers.email import EmailVerificationCodeManager
from users.querysets.user import UserQuerySet


class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=16, null=True, blank=True)
    telegram_link = models.CharField(max_length=255, null=True, blank=True)
    register_type = models.ForeignKey('users.RegisterType', on_delete=models.SET_NULL, null=True, blank=True)
    objects = UserQuerySet.as_manager()

    def __str__(self):
        return self.username


class EmailVerificationCode(BaseModel):
    REGISTER = 'register'
    LOGIN = 'login'
    RESET_PASSWORD = 'reset_password'

    CODE_CHOICES = [
        (REGISTER, 'Register'),
        (LOGIN, 'Login'),
        (RESET_PASSWORD, 'Reset password'),
    ]

    email = models.CharField(max_length=255)
    code = models.CharField(max_length=4, null=True)
    token = models.CharField(max_length=128, unique=True, null=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    attempt_left = models.PositiveSmallIntegerField(default=3)
    code_type = models.CharField(max_length=255, choices=CODE_CHOICES, default='register')
    objects = EmailVerificationCodeManager()

    def __str__(self):
        return f"{self.email} - {self.code} - {'used' if self.is_used else 'not used'}"


class TrustedDevice(BaseModel):
    user = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE, related_name='trusted_devices')
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()

    class Meta:
        unique_together = ('user', 'ip_address', 'user_agent')


class RegisterType(BaseModel):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
