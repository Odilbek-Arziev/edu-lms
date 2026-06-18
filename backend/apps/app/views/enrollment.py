from app.models import Enrollment
from app.serializers.enrollment import EnrollmentSerializer
from core.views.viewsets import BaseModelViewSet
from app.paginations.language_line import BasePagination
from django.db.models import Count, Q
from rest_framework.decorators import action
from rest_framework.response import Response


class EnrollmentViewSet(BaseModelViewSet):
    serializer_class = EnrollmentSerializer
    pagination_class = BasePagination

    def get_queryset(self):
        params = self.request.query_params

        return Enrollment.objects.list(
            date_from=params.get('date_from'),
            date_to=params.get('date_to'),
            status=params.get('status'),
            course=params.get('course'),
            search=params.get('search')
        )

    @action(detail=False, methods=['GET'])
    def stats(self, request):
        stats = Enrollment.objects.aggregate(
            total=Count('id'),
            active=Count('id', filter=Q(status='active')),
            completed=Count('id', filter=Q(status='completed')),
            dropped=Count('id', filter=Q(status='dropped')),
            suspended=Count('id', filter=Q(status='suspended'))
        )
        return Response(stats)
