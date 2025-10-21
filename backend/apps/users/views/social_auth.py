from config.settings import (
    GOOGLE_CLIENT_ID,
    GOOGLE_REDIRECT_URI,
    GOOGLE_CLIENT_SECRET,
    GITHUB_CLIENT_ID,
    GITHUB_REDIRECT_URI,
    GITHUB_CLIENT_SECRET
)

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.shortcuts import redirect
from urllib.parse import urlencode

from users.services.social_auth import SocialAuthService


class SocialLoginViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    provider_configs = {
        "google": {
            "auth_url": "https://accounts.google.com/o/oauth2/v2/auth",
            "token_url": "https://oauth2.googleapis.com/token",
            "user_info_url": "https://www.googleapis.com/oauth2/v2/userinfo",
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "redirect_uri": GOOGLE_REDIRECT_URI,
            "scope": "email profile",
            "grant_type": "authorization_code",
        },
        "github": {
            "auth_url": "https://github.com/login/oauth/authorize",
            "token_url": "https://github.com/login/oauth/access_token",
            "user_info_url": "https://api.github.com/user",
            "emails_url": "https://api.github.com/user/emails",
            "client_id": GITHUB_CLIENT_ID,
            "client_secret": GITHUB_CLIENT_SECRET,
            "redirect_uri": GITHUB_REDIRECT_URI,
            "scope": "read:user user:email",
        },
    }

    service = SocialAuthService(provider_configs)

    @action(detail=False, methods=['get'], url_path=r"(?P<provider>(google|github))")
    def social_auth(self, request, provider):
        cfg = self.provider_configs[provider]
        params = {
            'client_id': cfg['client_id'],
            'redirect_uri': cfg['redirect_uri'],
            'response_type': 'code',
            'scope': cfg['scope']
        }
        return redirect(f"{cfg['auth_url']}?{urlencode(params)}")

    @action(detail=False, methods=['get'], url_path=r"(?P<provider>(google|github))/callback")
    def social_callback(self, request, provider):
        code = request.query_params.get('code')
        if not code:
            return Response({'error': 'Code was not provided'})

        try:
            access_token = self.service.exchange_code_for_token(provider, code)
            user_info = self.service.fetch_user_info(provider, access_token)
            result = self.service.get_or_create_user(user_info)
            return Response(result)
        except Exception as e:
            return Response({'error': str(e)}, status=400)
