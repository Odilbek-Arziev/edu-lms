from rest_framework.throttling import UserRateThrottle


class CaptchaThrottle(UserRateThrottle):
    rate = "10/min"
