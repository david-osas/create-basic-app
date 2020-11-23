from rest_framework.authentication import BaseAuthentication
from django.middleware.csrf import CsrfViewMiddleware
from rest_framework import exceptions
from django.conf import settings
import jwt

from .models import User

class CsrfCheck(CsrfViewMiddleware):
    def _reject(self, request, reason):
        return reason

class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        authorization_header = request.headers.get('Authorization')

        if not authorization_header:
            return None
        try:
            access_token = authorization_header.split(' ')[1]
            payload = jwt.decode(
                access_token, 
                settings.SECRET_KEY, 
                algorithms=['HS256']
            )
        except jwt.exceptions.InvalidSignatureError:
            raise exceptions.AuthenticationFailed('Verification failed')
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Expired access.')
        except IndexError:
            raise exceptions.AuthenticationFailed('Token prefix not defined.')

        user = User.objects.filter(id=payload['id']).first()
        if user is None:
            raise exceptions.AuthenticationFailed('User not found.')
        if not user.is_active:
            raise exceptions.AuthenticationFailed('User is not active.')

        self.enforce_csrf(request)

        return (user, None)

    def enforce_csrf(self, request):
        csrf_check = CsrfCheck()
        csrf_check.process_request(request)
        reason = csrf_check.process_view(request, None, (), {})
        if reason:
            raise exceptions.PermissionDenied('CSRF Failed: %s' % reason)