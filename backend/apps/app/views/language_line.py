from app.models import LanguageLine
from core.views.viewsets import BaseModelViewSet

from app.serializers.language_line import LanguageLineSerializer
from rest_framework.permissions import AllowAny


class LanguageLineViewSet(BaseModelViewSet):
    queryset = LanguageLine.objects.all()
    serializer_class = LanguageLineSerializer
    permission_classes = [AllowAny]
