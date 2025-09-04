from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string


def send_email_code(verification_code):
    subject = "Ваш код подтверждения"
    plain_message = f"Ваш код для регистрации: {verification_code.code}. Срок действия — 3 минуты."

    html_message = render_to_string(
        "verification_code.html",
        {"code": verification_code.code}
    )

    send_mail(
        subject,
        plain_message,
        settings.DEFAULT_FROM_EMAIL,
        [verification_code.email],
        html_message=html_message
    )
