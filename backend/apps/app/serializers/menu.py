from rest_framework import serializers
from django.contrib.auth.models import Group
from app.models import Menu, Icon
from app.serializers.roles import RoleListSerializer
from drf_spectacular.utils import extend_schema_field


class MenuSerializer(serializers.ModelSerializer):
    icon = serializers.SlugRelatedField(
        slug_field='name',
        queryset=Icon.objects.all(),
        allow_null=True
    )
    parent = serializers.PrimaryKeyRelatedField(
        queryset=Menu.objects.all(),
        required=False,
        allow_null=True
    )
    groups = RoleListSerializer(many=True, read_only=True)
    groups_ids = serializers.PrimaryKeyRelatedField(
        queryset=Group.objects.all(),
        many=True,
        write_only=True,
        source='groups'
    )
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
            'groups_ids',
            'children'
        ]

    @extend_schema_field(serializers.ListSerializer(child=serializers.DictField()))
    def get_children(self, obj):
        qs = Menu.objects.filter(parent=obj, status=True)
        return MenuSerializer(qs, many=True).data
