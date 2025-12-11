from rest_framework import serializers
from django.contrib.auth.models import Group
from app.models import Menu, Icon


class MenuSerializer(serializers.ModelSerializer):
    icon_id = serializers.PrimaryKeyRelatedField(queryset=Icon.objects.all(),
                                                 allow_null=True)  # TODO: change to serializer
    parent_id = serializers.PrimaryKeyRelatedField(queryset=Menu.objects.all(), allow_null=True)
    groups = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all(), many=True)
    children = serializers.SerializerMethodField()

    class Meta:
        model = Menu
        fields = [
            'title',
            'url_path',
            'status',
            'icon_id',
            'parent_id',
            'groups',
            'children'
        ]

    def get_children(self, obj):
        qs = Menu.objects.filter(parent_id=obj, status=True)
        return MenuSerializer(qs, many=True).data
