from django.conf import settings
from users.utils.email_helper import send_to_mail


def send_email_code(verification_code):
    send_to_mail(
        email=verification_code.email,
        subject="Код подтверждения",
        plain_message=f"Ваш код для регистрации: {verification_code.code}. Срок действия — 3 минуты.",
        html_data={
            "title": "Код подтверждения",
            "code": verification_code.code,
            "expiry_minutes": 3,
        }
    )


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


def send_security_alert(email, login_success=False):
    if not login_success:
        send_to_mail(
            email=email,
            subject="Подозрительная попытка входа в ваш аккаунт",
            plain_message="Если это были не вы, измените пароль, чтобы обезопасить аккаунт.",
            html_data={
                'title': '⚠️ Подозрительная попытка входа',
                'message': 'Мы зафиксировали несколько неудачных попыток входа в ваш аккаунт.',
                'footer': 'Если это были не вы, немедленно измените пароль.'
            }
        )
    else:
        send_to_mail(
            email=email,
            subject="Вход с нового устройства",
            plain_message="В ваш аккаунт вошли с нового устройства.",
            html_data={
                'title': '🔐 Вход с нового устройства',
                'message': 'В ваш аккаунт был выполнен вход с нового устройства или браузера.',
                'footer': 'Если это были не вы, немедленно измените пароль.'
            }
        )