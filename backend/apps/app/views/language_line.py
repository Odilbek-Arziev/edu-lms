from core.views.viewsets import BaseModelViewSet
from app.serializers.language_line import LanguageLineSerializer
from rest_framework.permissions import AllowAny

from app.models import LanguageLine
from app.paginations.language_line import LanguageLinePagination


class LanguageLineViewSet(BaseModelViewSet):
    queryset = LanguageLine.objects.all().order_by('id')
    serializer_class = LanguageLineSerializer
    permission_classes = [AllowAny]
    pagination_class = LanguageLinePagination
