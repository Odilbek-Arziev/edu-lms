import logging
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string

logger = logging.getLogger(__name__)


def send_to_mail(email, subject, plain_message, html_data=None, **kwargs):
    context = html_data or {}
    if 'message' not in context:
        context['message'] = plain_message

    html_message = render_to_string("email.html", context)

    logger.info(f"[EMAIL] Attempting to send email to {email}")
    logger.info(f"[EMAIL] From: {settings.DEFAULT_FROM_EMAIL}")
    logger.info(f"[EMAIL] Subject: {subject}")

    try:
        result = send_mail(
            subject,
            plain_message,
            settings.DEFAULT_FROM_EMAIL,
            [email],
            html_message=html_message,
            fail_silently=False,
        )
        logger.info(f"[EMAIL SUCCESS] Email sent to {email}, result: {result}")
        return True

    except Exception as e:
        logger.error(f"[EMAIL ERROR] Failed to send to {email}: {e}", exc_info=True)
        return False
