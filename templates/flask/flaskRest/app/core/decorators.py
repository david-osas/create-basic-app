from app.extentions import jwt
from app.user.models import UserModel


@jwt.user_loader_callback_loader
def user_loader_callback(identify):
    user = UserModel.query.filter(UserModel.id == identify).first()
    return user


@jwt.user_identity_loader
def user_identity_loader(user):
    return user.id
