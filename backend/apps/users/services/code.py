from users.models import CustomUser


def handle_user_verification(verification):
    user = CustomUser.objects.filter(email=verification.email).first()

    if verification.attempt_left == 0 and user and not user.is_active:
        user.delete()
        verification.delete()
        return {"error": "Превышено количество попыток, пользователь удалён"}, 400

    if verification.code_type == 'register' and user and not user.is_active:
        user.is_active = True
        user.save(update_fields=['is_active'])

    verification.delete()
    return {"msg": "Email confirmed", "success": True}, 200
