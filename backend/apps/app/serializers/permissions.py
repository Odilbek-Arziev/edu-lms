from django.contrib.auth.models import Permission
from rest_framework import serializers


class PermissionSerializer(serializers.ModelSerializer):
    app = serializers.CharField(source='content_type.app_label')

    class Meta:
        model = Permission
        fields = ['id', 'codename', 'name', 'app']
