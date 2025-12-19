from rest_framework import serializers
from users.models import RegisterType


class RegisterTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegisterType
        fields = ['id', 'name']
