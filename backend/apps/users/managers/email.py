from django.db import models
from django.utils import timezone
from datetime import timedelta
from random import randrange


class EmailVerificationCodeManager(models.Manager):
    def create_for_email(self, email, code_type="register"):
        self.filter(
            email=email,
            is_used=False,
            expires_at__gt=timezone.now()
        ).update(is_used=True)

        code = f"{randrange(0, 10000):04d}"
        expires_at = timezone.now() + timedelta(minutes=3)

        return self.create(
            email=email,
            code=code,
            expires_at=expires_at,
            code_type=code_type
        )
