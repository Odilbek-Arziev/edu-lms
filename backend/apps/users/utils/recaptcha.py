import logging

import requests
import certifi
from django.conf import settings

logger = logging.getLogger(__name__)


def verify_recaptcha(token, remote_ip=None):
    if settings.DEBUG:
        return True

    url = "https://www.google.com/recaptcha/api/siteverify"
    data = {
        'secret': settings.RECAPTCHA_SECRET_KEY,
        'response': token
    }

    if remote_ip:
        data['remoteip'] = remote_ip

    response = requests.post(url, data=data, verify=certifi.where(), timeout=10)
    result = response.json()

    return result.get('success', False)