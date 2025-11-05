import hashlib

from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken

from users.models import EmailVerificationCode, CustomUser


def send_magic_link(token, email, link_type='login'):
    FRONTEND_URL = settings.FRONTEND_URL
    url = f"{FRONTEND_URL}/magic-login?token={token}"

    if link_type == 'login':
        subject = "Ваша ссылка для входа"
        plain_message = f"Ссылка для входа. Срок действия — 10 минут."

    else:
        subject = "Ваша ссылка для сброса пароля"
        plain_message = f"Перейдите по ссылке, чтобы сбросить пароль. Срок действия — 10 минут."

    html_message = render_to_string(
        "magic_link.html",
        {"url": url}
    )

    send_mail(
        subject,
        plain_message,
        settings.DEFAULT_FROM_EMAIL,
        [email],
        html_message=html_message
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
