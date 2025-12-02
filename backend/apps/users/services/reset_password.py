import hashlib

from django.contrib.sessions.models import Session
from django.utils import timezone

from users.models import EmailVerificationCode, CustomUser
from users.services.email import send_password_alert


def handle_reset_password(request, raw_token, password):
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

    send_password_alert(
        email=user.email,
        timestamp=timezone.now().strftime("%Y-%m-%d %H:%M:%S"),
        user_agent=request.META.get("HTTP_USER_AGENT"),
        ip=request.META.get("REMOTE_ADDR")
    )

    Session.objects.filter(expire_date__gte=timezone.now(), session_data__contains=user.id).delete()

    obj.is_used = True
    obj.save(update_fields=['is_used'])

    return {"status": "ok"}, 200
