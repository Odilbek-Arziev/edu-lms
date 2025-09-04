from django.db import models
from django.contrib.auth.models import AbstractUser

from core.models import BaseModel


class CustomUser(AbstractUser):
    STUDENT = 'student'
    TEACHER = 'teacher'
    ADMIN = 'admin'

    ROLE_CHOICES = [
        (STUDENT, 'Student'),
        (TEACHER, 'Teacher'),
        (ADMIN, 'Admin')
    ]

    role = models.CharField(max_length=255, choices=ROLE_CHOICES)

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

    CODE_CHOICES = [
        (REGISTER, 'Register'),
        (LOGIN, 'Login'),
    ]

    email = models.CharField(max_length=255)
    code = models.CharField(max_length=4)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    attempt_left = models.PositiveSmallIntegerField(default=3)
    code_type = models.CharField(max_length=255, choices=CODE_CHOICES, default='register')

    def __str__(self):
        return f"{self.email} - {self.code} - {'used' if self.is_used else 'not used'}"
