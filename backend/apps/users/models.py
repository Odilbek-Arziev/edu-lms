from django.db import models
from django.contrib.auth.models import AbstractUser

from core.models import BaseModel
from users.managers.email import EmailVerificationCodeManager


class CustomUser(AbstractUser):
    STUDENT = 'student'
    TEACHER = 'teacher'
    ADMIN = 'admin'

    OAUTH = 'oauth'
    EMAIL = 'email'

    ROLE_CHOICES = [
        (STUDENT, 'Student'),
        (TEACHER, 'Teacher'),
        (ADMIN, 'Admin')
    ]

    REGISTRATION_TYPE_CHOICES = [
        (EMAIL, "Email/Password"),
        (OAUTH, "OAuth"),
    ]

    role = models.CharField(max_length=255, choices=ROLE_CHOICES)
    is_active = models.BooleanField(default=False)
    register_type = models.CharField(max_length=255, choices=REGISTRATION_TYPE_CHOICES, null=True)

    def is_student(self):
        return self.role == self.STUDENT

    def is_teacher(self):
        return self.role == self.TEACHER

    def is_admin(self):
        return self.role == self.ADMIN

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
