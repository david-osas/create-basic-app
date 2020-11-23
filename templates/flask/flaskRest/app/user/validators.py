from sqlalchemy import func
from app.extentions import db
from .exceptions import ValidationError
from .models import UserModel


def validate_email(email):
    user_count = UserModel.query.filter(
        func.lower(UserModel.email) == email).count()
    if user_count != 0:
        raise ValidationError("Email already exists.")
