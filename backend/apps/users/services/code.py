from django.utils.timezone import now
from users.models import CustomUser


def handle_user_verification(verification, code_input):
    user = CustomUser.objects.filter(email=verification.email).first()

    if verification.code != code_input:
        verification.attempt_left = max(verification.attempt_left - 1, 0)
        verification.save(update_fields=["attempt_left"])

        if verification.attempt_left == 0:
            if user and not user.is_active:
                user.delete()
            verification.delete()
            return {"non_field_errors": ["Превышено количество попыток, пользователь удалён"]}, 400
        return {"non_field_errors": [f"Неверный код, осталось попыток: {verification.attempt_left}"]}, 400

    if verification.expires_at < now():
        if user and not user.is_active:
            user.delete()
        verification.delete()
        return {"non_field_errors": ["Срок действия кода истёк."]}, 400

    if verification.code_type == 'register' and user and not user.is_active:
        user.is_active = True
        user.save(update_fields=['is_active'])

    verification.delete()
    return {"msg": "Email confirmed", "success": True}, 200
