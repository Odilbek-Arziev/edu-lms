from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/v1/', include([
        path('core/', include(('core.urls', 'core'), namespace='core')),
        path('app/', include(('app.urls', 'app'), namespace='app')),
        path('users/', include(('users.urls', 'user'), namespace='users')),

        path('schema/', include([
            path('', SpectacularAPIView.as_view(), name='schema'),
            path('swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
            path('redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
        ])),

        path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
        path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    ])),
]
