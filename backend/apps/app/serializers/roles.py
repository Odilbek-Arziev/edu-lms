from django.contrib.auth.models import Group, Permission
from rest_framework import serializers

from app.serializers.permissions import PermissionSerializer


class RoleDetailSerializer(serializers.ModelSerializer):
    permissions = serializers.SerializerMethodField()
    role_permissions = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = ['id', 'name', 'permissions', 'role_permissions']

    def get_role_permissions(self, obj):
        return list(obj.permissions.values_list('id', flat=True))

    def get_permissions(self, obj):

        permissions = Permission.objects.select_related('content_type').order_by(
            'content_type__app_label', 'codename'
        )

        grouped = {}

        for perm in permissions:
            app_label = perm.content_type.app_label

            if app_label not in grouped:
                grouped[app_label] = []

            grouped[app_label].append(PermissionSerializer(perm).data)

        return grouped


class RoleListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']


class RolePermissionsUpdateSerializer(serializers.Serializer):
    permissions = serializers.ListField(
        child=serializers.IntegerField(),
        required=True,
        allow_empty=True
    )

    def validate_permissions(self, value):
        existing_perms = Permission.objects.filter(id__in=value)
        if len(existing_perms) != len(value):
            raise serializers.ValidationError("Некоторые permissions не существуют")
        return value
