from rest_framework import permissions, status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie
from django.conf import settings

from .serializers import UserCreateSerializer
from .models import User
from .utils import generate_access_token, generate_refresh_token

class SignUp(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserCreateSerializer
    lookup_field = 'id'

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
@ensure_csrf_cookie
def signin(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if (username) is None or (password is None):
        return Response({'error': 'Username or password is required.'}, status=status.HTTP_400_BAD_REQUEST)
    user = User.objects.filter(username=username).first()
    if (user is None) or not user.check_password(password):
        return Response({'error': 'Username or password is wrong.'}, status=status.HTTP_404_NOT_FOUND)
    response = Response()

    access_token = generate_access_token(user.id)
    refresh_token = generate_refresh_token(user.id)

    response.set_cookie(
        value=refresh_token, 
        **settings.REFRESH_TOKEN_COOKIE
    )
    response.data = {
        'access_token': access_token
    }
    return response
