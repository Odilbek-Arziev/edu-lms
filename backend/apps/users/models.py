from django.db import models
from django.contrib.auth.models import AbstractUser


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

    def get_name(self):
        return f"{self.first_name} {self.last_name}"
