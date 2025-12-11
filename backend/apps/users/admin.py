from django.contrib import admin
from .models import *

@admin.register(CustomUser)
class UserAdmin(admin.ModelAdmin):
    fields = (
        'email', 'first_name', 'last_name',
        'username', 'is_active', 'register_type',
        'groups',
    )
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_active', 'register_type')


@admin.register(EmailVerificationCode)
class UserAdmin(admin.ModelAdmin):
    fields = ('email', 'token', 'is_used', 'code_type')
    list_display = ('email', 'code', 'token', 'expires_at', 'is_used', 'attempt_left', 'code_type')


@admin.register(TrustedDevice)
class UserAdmin(admin.ModelAdmin):
    fields = ('user', 'ip_address', 'user_agent')
    list_display = ('user', 'ip_address', 'user_agent')
