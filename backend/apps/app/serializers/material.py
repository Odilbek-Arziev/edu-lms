from rest_framework import serializers

from app.models import Material
from app.serializers.lesson import LessonSerializer


class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['lesson'] = LessonSerializer(instance.lesson).data

        return representation
