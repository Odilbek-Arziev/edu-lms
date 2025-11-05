import hashlib

from django.contrib.sessions.models import Session
from django.utils import timezone
from users.models import EmailVerificationCode, CustomUser


def handle_reset_password(raw_token, password):
    token_hash = hashlib.sha3_256(raw_token.encode()).hexdigest()
    obj = EmailVerificationCode.objects.filter(
        token=token_hash,
        is_used=False,
        expires_at__gt=timezone.now()
    ).first()

    if not obj:
        return {"detail": "Неверная или просроченная ссылка"}, 400

    try:
        user = CustomUser.objects.get(email=obj.email)
    except CustomUser.DoesNotExist:
        return {"detail": "Пользователь не найден"}, 404

    user.set_password(password)
    user.save()

    Session.objects.filter(expire_date__gte=timezone.now(), session_data__contains=user.id).delete()

    obj.is_used = True
    obj.save(update_fields=['is_used'])

    return {"status": "ok"}, 200
