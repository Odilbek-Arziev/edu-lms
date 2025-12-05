import logging

import requests
from django.conf import settings

logger = logging.getLogger(__name__)


def verify_recaptcha(token, remote_ip=None):
    url = "https://www.google.com/recaptcha/api/siteverify"
    data = {
        'secret': settings.RECAPTCHA_SECRET_KEY,
        'response': token
    }

    if remote_ip:
        data['remoteip'] = remote_ip

    response = requests.post(url, data)
    result = response.json()

    # logger.info(token)

    return result.get('success', False)
