import hashlib

from django.conf import settings
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken

from users.models import EmailVerificationCode, CustomUser

from users.utils.email_helper import send_to_mail


def send_magic_link(token, email, link_type='login'):
    FRONTEND_URL = settings.FRONTEND_URL
    url = f"{FRONTEND_URL}/magic-login?token={token}"

    if link_type == 'login':
        subject = "Ваша ссылка для входа"
        plain_message = "Ссылка для входа. Срок действия — 10 минут."

    else:
        subject = "Ваша ссылка для сброса пароля"
        plain_message = f"Перейдите по ссылке, чтобы сбросить пароль. Срок действия — 10 минут."

    send_to_mail(
        email=email,
        subject=subject,
        plain_message=plain_message,
        html_data={
            "title": subject,
            "url": url,
            "expiry_minutes": 10,
        }
    )


def handle_magic_link(raw_token):
    token_hash = hashlib.sha3_256(raw_token.encode()).hexdigest()
    obj = EmailVerificationCode.objects.filter(
        token=token_hash,
        is_used=False,
        expires_at__gt=timezone.now()
    ).first()

    if not obj:
        return {"detail": "Неверная или просроченная ссылка"}, 400

    if obj.code_type == 'reset_password':
        return {
                   "status": "ok",
                   "link_type": "reset_password",
                   "token": raw_token
               }, 200

    user = CustomUser.objects.get(email=obj.email)
    refresh = RefreshToken.for_user(user)

    obj.is_used = True
    obj.save(update_fields=['is_used'])

    return {
               "status": "ok",
               "link_type": "login",
               "access": str(refresh.access_token),
               "refresh": str(refresh)
           }, 200
