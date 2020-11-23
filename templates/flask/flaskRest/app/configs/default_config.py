class DefaultConfig():
    DEBUG = False
    TESTING = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = "random_key"
    JWT_ACCESS_TOKEN_EXPIRES = 172800