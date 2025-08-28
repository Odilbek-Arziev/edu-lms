from rest_framework import serializers

from app.models import Module


class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = [
            'id',
            'title',
            'description',
            'is_active',
            'slug',
            'course',
        ]
