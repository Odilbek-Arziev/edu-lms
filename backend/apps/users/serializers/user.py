from django.contrib.auth.models import Group
from rest_framework import serializers

from users.models import CustomUser
from users.serializers.register_type import RegisterTypeSerializer
from app.serializers.roles import RoleListSerializer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name']


class UserAdminSerializer(serializers.ModelSerializer):
    groups = RoleListSerializer(read_only=True, many=True)
    groups_ids = serializers.PrimaryKeyRelatedField(
        queryset=Group.objects.all(),
        many=True,
        write_only=True,
        source='groups'
    )
    register_type = RegisterTypeSerializer(read_only=True)

    class Meta:
        model = CustomUser
        fields = [
            'id',
            'first_name',
            'last_name',
            'email',
            'is_staff',
            'is_active',
            'register_type',
            'groups',
            'groups_ids',
            'phone_number',
            'telegram_link'
        ]
