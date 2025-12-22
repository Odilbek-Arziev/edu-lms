from rest_framework import serializers

from app.models import LanguageLine


class LanguageLineSerializer(serializers.ModelSerializer):
    class Meta:
        model = LanguageLine
        fields = '__all__'
