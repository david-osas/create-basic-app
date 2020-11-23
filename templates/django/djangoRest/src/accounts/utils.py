from django.conf import settings
import datetime
import jwt

def generate_access_token(id):
    payload = {
        'id': id.hex,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, minutes=5),
        'iat': datetime.datetime.utcnow()
    }
    return(
        jwt.encode(
            payload,
            settings.SECRET_KEY, 
            algorithm='HS256').decode('utf-8')
    )

def generate_refresh_token(id):
    payload = {
        'id': id.hex,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),
        'iat': datetime.datetime.utcnow()
    }
    return(
        jwt.encode(
            payload, 
            settings.REFRESH_TOKEN_KEY, 
            algorithm='HS256').decode('utf-8')
    )