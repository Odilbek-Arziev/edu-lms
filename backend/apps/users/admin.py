from django.contrib import admin
from django.contrib.auth.models import Group

from .models import CustomUser

admin.site.unregister(Group)


@admin.register(CustomUser)
class UserAdmin(admin.ModelAdmin):
    fields = ('email', 'first_name', 'last_name', 'username')
    list_display = ('username', 'email', 'first_name', 'last_name')
