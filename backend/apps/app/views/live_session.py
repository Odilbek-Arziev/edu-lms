from app.models import LiveSession
from app.serializers.live_session import LiveSessionSerializer
from core.views.viewsets import BaseModelViewSet


class LiveSessionViewSet(BaseModelViewSet):
    queryset = LiveSession.objects.all()
    serializer_class = LiveSessionSerializer
