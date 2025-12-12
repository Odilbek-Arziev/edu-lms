from core.views.viewsets import BaseModelViewSet

from app.models import Icon
from app.serializers.icons import IconSerializer


class IconViewSet(BaseModelViewSet):
    queryset = Icon.objects.all()
    serializer_class = IconSerializer
