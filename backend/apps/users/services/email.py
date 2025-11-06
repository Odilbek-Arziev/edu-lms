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
