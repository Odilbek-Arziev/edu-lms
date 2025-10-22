from urllib.parse import urlencode

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

    @action(detail=False, methods=['get'], url_path=r'(?P<provider>(google|github))/callback')
    def social_callback(self, request, provider):
        code = request.query_params.get('code')
        if not code:
            return Response({'error': 'No code found'}, status=400)

        try:
            access_token = self.service.exchange_code_for_token(provider, code)
            user_info = self.service.fetch_user_info(provider, access_token)
            result = self.service.get_or_create_user(user_info)

            return Response(result)
        except Exception as e:
            return Response({'error': str(e)}, status=400)
