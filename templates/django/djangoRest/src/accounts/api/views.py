from rest_framework import permissions, exceptions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_protect
from django.conf import settings
import jwt

from ..models import User
from ..utils import generate_access_token

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
@csrf_protect
def refresh_access_token(request):
    refresh_token = request.COOKIES.get('refresh_token')

    if refresh_token is None:
        raise exceptions.AuthenticationFailed(
            'Authorization credentials not provided.'
        )
    try:
        payload = jwt.decode(
            refresh_token, 
            settings.REFRESH_TOKEN_KEY, 
            algorithms=['HS256']
        )
    except jwt.ExpiredSignatureError:
        raise exceptions.AuthenticationFailed(
                'Expired access.'
            )

    user = User.objects.filter(id=payload['id']).first()
    if user is None:
        raise exceptions.AuthenticationFailed('User not found.')
    if not user.is_active:
            raise exceptions.AuthenticationFailed('User is not active.')

    access_token = generate_access_token(user.id)

    return Response({'access_token': access_token})