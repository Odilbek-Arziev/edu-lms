from django.contrib import admin
from django.contrib.auth.models import Group

from .models import CustomUser, EmailVerificationCode

admin.site.unregister(Group)


@admin.register(CustomUser)
class UserAdmin(admin.ModelAdmin):
    fields = ('email', 'first_name', 'last_name', 'username')
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_active')


@admin.register(EmailVerificationCode)
class UserAdmin(admin.ModelAdmin):
    fields = ('email', 'code', 'is_used', 'code_type')
    list_display = ('email', 'code', 'expires_at', 'is_used', 'attempt_left', 'code_type')
