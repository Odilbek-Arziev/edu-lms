from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string


def send_to_mail(email, subject, plain_message, html_data=None, **kwargs):
    html_message = render_to_string("email.html", html_data or {})

    send_mail(
        subject,
        plain_message,
        settings.DEFAULT_FROM_EMAIL,
        [email],
        html_message=html_message,
    )
