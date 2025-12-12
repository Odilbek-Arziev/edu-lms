from rest_framework import serializers

from app.models import Icon


class IconSerializer(serializers.ModelSerializer):
    class Meta:
        model = Icon
        fields = [
            'id',
            'name'
        ]
