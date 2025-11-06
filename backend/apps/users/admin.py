from django.contrib import admin
from django.contrib.auth.models import Group

from .models import CustomUser, EmailVerificationCode

admin.site.unregister(Group)


@admin.register(CustomUser)
class UserAdmin(admin.ModelAdmin):
    fields = ('email', 'first_name', 'last_name', 'username', 'is_active', 'register_type')
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_active', 'register_type')


@admin.register(EmailVerificationCode)
class UserAdmin(admin.ModelAdmin):
    fields = ('email', 'token', 'is_used', 'code_type')
    list_display = ('email', 'code', 'token', 'expires_at', 'is_used', 'attempt_left', 'code_type')
