import requests
import logging
from users.models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken

logger = logging.getLogger("oauth2")


class SocialAuthService:
    def __init__(self, provider_config):
        self.configs = provider_config

    def exchange_code_for_token(self, provider, code):
        cfg = self.configs[provider]

        data = {
            "code": code,
            "client_id": cfg['client_id'],
            "client_secret": cfg['client_secret'],
            "redirect_uri": cfg['redirect_uri'],
            "grant_type": "authorization_code"
        }

        headers = {'Accept': 'application/json'}
        resp = requests.post(cfg['token_url'], data=data, headers=headers)

        try:
            token_data = resp.json()
        except Exception as e:
            logger.error(f"[{provider.upper()}] Invalid JSON response: {resp.text}")
            raise ValueError(f"Invalid JSON response from {provider}: {e}")

        if resp.status_code != 200:
            raise ValueError(f"Token request failed: {token_data}")

        access_token = token_data.get('access_token')
        if not access_token:
            raise ValueError(f"No access_token in response: {token_data}")

        return access_token

    def fetch_user_info(self, provider, access_token):
        cfg = self.configs[provider]
        user_info_url = cfg['user_info_url']

        resp = requests.get(user_info_url, headers={'Authorization': f'Bearer {access_token}'})

        if not resp.ok:
            logger.error(f"[{provider.upper()}] Failed to get user info: {resp.text}")
            raise ValueError(f"Failed to get user info: {resp.text}")

        data = resp.json()
        email = data.get('email')

        if provider == 'github' and not email:
            email_resp = requests.get(
                cfg['emails_url'],
                headers={'Authorization': f'Bearer {access_token}'}
            )

            if email_resp.ok:
                emails = email_resp.json()
                primary = next((e for e in emails if e.get('primary')), None)
                email = primary.get('email') if primary else emails[0].get('email')

        if provider == 'google':
            return {
                'email': email,
                'first_name': data.get('given_name', ''),
                'last_name': data.get('family_name', ''),
            }

        return {
            'email': email,
            'first_name': data.get('name') or data.get('login'),
            'last_name': '',
        }

    def get_or_create_user(self, user_info):
        email = user_info.get('email')
        if not email:
            raise ValueError('No email provided by OAuth provider')

        user, created = CustomUser.objects.get_or_create(
            email=email,
            defaults={
                'first_name': user_info.get('first_name', ''),
                'last_name': user_info.get('last_name', ''),
                'is_active': True
            }
        )
        refresh = RefreshToken.for_user(user)

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'new_user': created
        }
