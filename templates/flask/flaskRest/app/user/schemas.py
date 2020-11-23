from marshmallow import fields
from marshmallow.validate import Length, Regexp
from app.extentions import ma
from .models import UserModel


class UserSchema(ma.SQLAlchemySchema):
    class Meta:
        model = UserModel
        load_instance = True

    id = ma.auto_field()
    first_name = fields.String(validate=Length(min=3))
    last_name = fields.String()
    email = fields.String(validate=Regexp(
        "(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{2,}$)", error="Invalid email"))
    password = fields.String(validate=Length(min=8), load_only=True)
    is_active = fields.Boolean(dump_only=True)


class UserFullProfileSchema(UserSchema):
    connections = fields.List(fields.Nested(
        lambda: UserFullProfileSchema(exclude=("connections",))), dump_only=True)


class UserInviteSchema(ma.SQLAlchemySchema):
    class Meta:
        model = UserModel
        load_instance = True

    id = ma.auto_field()
    first_name = fields.String(validate=Length(min=3))
    last_name = fields.String(validate=Length(min=3))
    email = fields.String(validate=Regexp(
        "(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{2,}$)", error="Invalid email"))
    is_active = fields.Boolean(dump_only=True)


class AcceptInviteSchema(ma.SQLAlchemySchema):
    token = fields.String()
    password = fields.String(validate=Length(min=8), load_only=True)
    confirm_password = fields.String(validate=Length(min=8), load_only=True)
