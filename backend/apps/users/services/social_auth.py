import requests
from rest_framework_simplejwt.tokens import RefreshToken

from users.models import CustomUser


class SocialAuthService:
    def __init__(self, provider_config):
        self.configs = provider_config

    def exchange_code_for_token(self, provider, code):
        cfg = self.configs[provider]

        data = {
            "code": code,
            "client_id": cfg.get('client_id'),
            "client_secret": cfg.get('client_secret'),
            "redirect_uri": cfg.get('redirect_uri'),
            "grant_type": cfg.get('grant_type', 'authorization_code')
        }
        headers = {'Accept': 'application/json'}

        token_response = requests.post(url=cfg.get('token_url'), data=data, headers=headers)

        try:
            token_data = token_response.json()
        except Exception as e:
            raise ValueError(f'Invalid JSON response from {provider}: {e}')

        if not token_response.ok:
            raise ValueError(f"Token request failed: {token_data}")

        access_token = token_data.get('access_token')
        if not access_token:
            raise ValueError('No access_token returned')

        return access_token

    def fetch_user_info(self, provider, access_token):
        cfg = self.configs[provider]

        user_info_response = requests.get(cfg['user_info_url'], headers={'Authorization': f'Bearer {access_token}'})

        if not user_info_response.ok:
            raise ValueError(f"Failed to get user info: {user_info_response.text}")

        user_data = user_info_response.json()
        email = user_data.get('email')

        if not email and provider == 'github':
            emails_response = requests.get(cfg['emails_url'], headers={'Authorization': f'Bearer {access_token}'})

            if emails_response.ok:
                emails = emails_response.json()
                primary = next((e for e in emails if e.get('primary')), None)
                email = primary.get('email') if primary else emails[0].get('email')

        if provider == 'google':
            return {
                'email': email,
                'first_name': user_data.get('given_name', ''),
                'last_name': user_data.get('family_name', ''),
                'username': email
            }

        return {
            'email': email,
            'first_name': user_data.get('login') or user_data.get('name'),
            'last_name': "",
            'username': email
        }

    def get_or_create_user(self, user_info):
        email = user_info.get('email')
        if not email:
            raise ValueError('No email provided by OAuth provider')

        user, created = CustomUser.objects.get_or_create(
            email=email,
            defaults={
                'username': user_info.get('username', ''),
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
