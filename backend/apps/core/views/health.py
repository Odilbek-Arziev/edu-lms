from django.http import JsonResponse
from django.db import connection


def health(request):
    try:
        with connection.cursor() as c:
            c.execute("SELECT 1")
        return JsonResponse({"status": "ok"})
    except Exception as e:
        return JsonResponse({"status": "error", "detail": str(e)}, status=503)
