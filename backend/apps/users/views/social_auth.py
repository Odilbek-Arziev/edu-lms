import json
import urllib
from urllib.parse import urlencode
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from drf_spectacular.types import OpenApiTypes

from django.shortcuts import redirect
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from users.services.social_auth import SocialAuthService

from config.providers_config import provider_configs


class SocialLoginViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    service = SocialAuthService(provider_configs)
    frontend_url = 'http://localhost:3000'

    @extend_schema(
        summary="Redirect to Social Provider Auth",
        description="Redirects the user to the specified provider's (Google or GitHub) login page.",
        parameters=[
            OpenApiParameter(
                name="provider",
                location=OpenApiParameter.PATH,
                description="Social media provider name",
                required=True,
                type=OpenApiTypes.STR,
                enum=["google", "github"],
            ),
        ],
        responses={302: OpenApiResponse(description="Redirect to provider login page")}
    )
    @action(detail=False, methods=['get'], url_path=r'(?P<provider>(google|github))')
    def social_auth(self, request, provider):
        cfg = provider_configs[provider]

        params = {
            'client_id': cfg.get('client_id'),
            'redirect_uri': cfg.get('redirect_uri'),
            'response_type': 'code',
            'scope': cfg.get('scope')
        }

        return redirect(f"{cfg['auth_url']}?{urlencode(params)}")

    @extend_schema(
        summary="Social Auth Callback",
        description="Handles the callback from the provider, exchanges the code for a token, and redirects to the frontend.",
        parameters=[
            OpenApiParameter(
                name="provider",
                location=OpenApiParameter.PATH,
                description="Social media provider name",
                required=True,
                type=OpenApiTypes.STR,
                enum=["google", "github"],
            ),
            OpenApiParameter(
                name="code",
                location=OpenApiParameter.QUERY,
                description="Authorization code returned by the provider",
                required=True,
                type=OpenApiTypes.STR,
            ),
        ],
        responses={
            302: OpenApiResponse(description="Redirect to frontend with user data"),
            400: OpenApiResponse(description="Invalid code or authentication error")
        }
    )
    @action(detail=False, methods=['get'], url_path=r'(?P<provider>(google|github))/callback')
    def social_callback(self, request, provider):
        code = request.query_params.get('code')
        if not code:
            return Response({'error': 'No code found'}, status=400)

        try:
            access_token = self.service.exchange_code_for_token(provider, code)
            user_info = self.service.fetch_user_info(provider, access_token)
            result = self.service.get_or_create_user(user_info)

            return redirect(f"{self.frontend_url}/social-callback?data={urllib.parse.quote(json.dumps(result))}")
        except Exception as e:
            return Response({'error': str(e)}, status=400)
