from rest_framework import serializers
from django.contrib.auth.models import Group
from app.models import Menu, Icon


class MenuSerializer(serializers.ModelSerializer):
    icon = serializers.SlugRelatedField(
        slug_field='name',
        queryset=Icon.objects.all(),
        allow_null=True
    )

    parent = serializers.PrimaryKeyRelatedField(queryset=Menu.objects.all(), allow_null=True)
    groups = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all(), many=True)
    children = serializers.SerializerMethodField()

    class Meta:
        model = Menu
        fields = [
            'id',
            'title',
            'url_path',
            'status',
            'icon',
            'parent',
            'groups',
            'children'
        ]

    def get_children(self, obj):
        qs = Menu.objects.filter(parent=obj, status=True)
        return MenuSerializer(qs, many=True).data
