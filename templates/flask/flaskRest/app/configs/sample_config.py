from .default_config import DefaultConfig


class DevelopmentConfig(DefaultConfig):
    SQLALCHEMY_DATABASE_URI = "postgresql://postgres:password@localhost:5432/flask_boilerplate"
    JWT_SECRET_KEY = "EdZlPw-qQhK0Ng9jNYLo2qEgKDkgwJs0aT5DLq5wmzc"
    JWT_ACCESS_TOKEN_EXPIRES = 1728000
    SQLALCHEMY_ECHO = True
