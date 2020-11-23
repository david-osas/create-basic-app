from django.core.management.utils import get_random_secret_key

def _gen_secret_key():
    secret_key = open('key.secret', 'x')
    secret_key.write(get_random_secret_key())
    secret_key.close()

def _gen_refresh_token():
    refresh_token_key = open('refresh_token.secret', 'x')
    refresh_token_key.write(get_random_secret_key())
    refresh_token_key.close()

def gen_keys():
    _gen_secret_key()
    _gen_refresh_token()

if __name__ == '__main__':
    gen_keys()