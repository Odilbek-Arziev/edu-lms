from rest_framework import serializers

from app.models import LiveSession


class LiveSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LiveSession
        fields = '__all__'
