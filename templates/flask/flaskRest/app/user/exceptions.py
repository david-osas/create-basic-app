from app.core.exceptions import BaseException


class ValidationError(BaseException):
    def __init__(self, error_message):
        self.error_message = error_message
        super(BaseException, self).__init__(error_message)


class AuthenticationError(BaseException):
    def __init__(self, error_message):
        self.error_message = error_message
