from django.core.mail import send_mail
from django.conf import settings


def send_email_code(verification_code):
    subject = "Ваш код подтверждения"
    plain_message = f"Ваш код для регистрации: {verification_code.code}. Срок действия — 3 минуты."

    html_message = f"""
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #333333;">Код подтверждения</h2>
          <p>Для завершения регистрации используйте следующий код:</p>

          <p style="font-size: 28px; font-weight: bold; color: #2c3e50; text-align: center; margin: 20px 0;">
            {verification_code.code}
          </p>

          <p>Срок действия кода — <strong>3 минуты</strong>.</p>

          <hr style="margin: 30px 0;">

          <p style="font-size: 12px; color: #888888;">
            Если вы не запрашивали этот код, просто проигнорируйте это письмо.
          </p>
        </div>
      </body>
    </html>
    """

    send_mail(
        subject,
        plain_message,
        settings.DEFAULT_FROM_EMAIL,
        [verification_code.email],
        html_message=html_message
    )
