from rest_framework import serializers

from app.models import LiveSession, Course
from app.serializers.course import CourseSerializer
from users.serializers.UserSerializer import UserSerializer
from users.models import CustomUser


class LiveSessionSerializer(serializers.ModelSerializer):
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all())
    student = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())

    class Meta:
        model = LiveSession
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['course'] = CourseSerializer(instance.course).data
        representation['student'] = UserSerializer(instance.student).data

        return representation
