import hashlib
import secrets

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

    def create_for_token(self, email, code_type='login'):
        self.filter(email=email, is_used=False, expires_at__gt=timezone.now()).update(is_used=True)

        raw_token = secrets.token_urlsafe(48)
        token_hash = hashlib.sha3_256(raw_token.encode()).hexdigest()
        expires_at = timezone.now() + timedelta(minutes=10)

        last_code = self.filter(email=email).order_by('-created_at').first()
        if last_code and (timezone.now() - last_code.created_at).seconds < 30:
            raise ValueError("Подождите 30 секунд перед повторной отправкой.")

        instance = self.create(
            email=email,
            token=token_hash,
            expires_at=expires_at,
            code_type=code_type
        )

        return instance, raw_token
