from core.views.viewsets import BaseModelViewSet

from app.models import Icon
from app.serializers.icons import IconSerializer
from rest_framework.permissions import AllowAny

class IconViewSet(BaseModelViewSet):
    queryset = Icon.objects.all()
    serializer_class = IconSerializer
    pagination_class = None
    permission_classes = [AllowAny]
