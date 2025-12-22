from django.contrib.auth.models import Group
from rest_framework.decorators import action
from rest_framework.response import Response
from core.views.viewsets import BaseModelViewSet

from app.serializers.roles import *
from rest_framework import permissions


class RoleViewSet(BaseModelViewSet):
    serializer_class = RoleDetailSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        qs = Group.objects.prefetch_related('permissions__content_type')

        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(name__icontains=search)

        return qs

    def get_serializer_class(self):
        if self.action == 'list':
            return RoleListSerializer
        if self.action == 'retrieve':
            return RoleDetailSerializer
        if self.action == 'permissions':
            return RolePermissionsUpdateSerializer
        return RoleDetailSerializer

    @action(detail=True, methods=['patch'])
    def permissions(self, request, pk=None):
        role = self.get_object()
        serializer = RolePermissionsUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        permissions = serializer.validated_data['permissions']
        role.permissions.set(permissions)
        return Response(RoleDetailSerializer(role).data)
