from uuid import uuid4
from datetime import datetime, timedelta
from flask import request, make_response, jsonify, Blueprint
from flask_restful import Resource, Api
from marshmallow.exceptions import ValidationError as DataError
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, current_user
from pluggy import HookimplMarker
from sqlalchemy import func
from app.core.helpers import handleInternalError
from app.extentions import db
from .models import UserModel
from .schemas import UserSchema, UserInviteSchema, AcceptInviteSchema, UserFullProfileSchema
from .validators import validate_email
from .exceptions import ValidationError, AuthenticationError

impl = HookimplMarker('app')
user_schema = UserSchema()
user_full_profile = UserFullProfileSchema()
users_schema = UserSchema(many=True)
user_invite_schema = UserInviteSchema()
accept_invite_schema = AcceptInviteSchema()


class User(Resource):
    @jwt_required
    def get(self, user_id=None):
        try:
            if user_id:
                user = UserModel.get_user_by_ids([user_id])
                if (len(user) > 0):
                    return user_schema.dump(user[0]), 200
                else:
                    return {"error": "Cannot find the user"}, 422
            else:
                return user_full_profile.dump(current_user), 200
        except Exception as e:
            return handleInternalError(e)

    def post(self):
        print(request.form)
        return {'hello': 'world'}


class UserInvite(Resource):
    @jwt_required
    def post(self):
        try:
            if current_user.account_id is None:
                return {"error": "Cannot find an associated account"}, 422

            user_data = request.get_json()
            user = user_invite_schema.load(user_data)
            validate_email(user.email)
            user.account_id = current_user.account_id
            user.set_password_token = str(uuid4())
            user.set_password_token_expiry = datetime.now() + timedelta(2)
            user.save()
            return user_invite_schema.dump(user), 200
        except DataError as data_error:
            return {"error": data_error.normalized_messages()}, 422
        except ValidationError as data_error:
            return {"error": data_error.error_message}, 422
        except Exception as e:
            return handleInternalError(e)

    def put(self):
        try:
            request_data = request.get_json()
            accept_invite_data = accept_invite_schema.load(request_data)
            user = self.fetch_user_from_token(accept_invite_data['token'])
            user.set_password_token = None
            user.set_password_token_expiry = None
            user.password = accept_invite_data['password']
            user.activated_at = datetime.now()
            user.save()
            return user_schema.dump(user), 200
        except ValidationError as data_error:
            return {"error": data_error.error_message}, 422
        except DataError as data_error:
            return {"error": data_error.normalized_messages()}, 422
        except Exception as e:
            return handleInternalError(e)

    def fetch_user_from_token(self, token):
        user = UserModel.get_user_by_token(token)
        cur_date_time = datetime.now()
        if user is None or user.set_password_token_expiry < cur_date_time:
            raise ValidationError("Token is invalid or expired")
        return user


class UserLogin(Resource):
    def post(self):
        try:
            credentials = request.get_json()
            user = UserModel.query.filter(func.lower(
                UserModel.email) == credentials['email']).first()
            if user is None:
                raise AuthenticationError(
                    "No account is assciated with the given email.")
            if not user.check_password(credentials['password']):
                raise AuthenticationError(
                    "Invalid email, password combination")
            access_token = create_access_token(user)
            return {'token': access_token}, 200
        except AuthenticationError as auth_error:
            return {'error': auth_error.error_message}, 401


class UserRegistration(Resource):
    def post(self):
        try:
            user_data = request.get_json()
            user = user_schema.load(user_data)
            validate_email(user.email)
            user.save()
            return user_schema.dump(user), 200
        except DataError as data_error:
            return {'error': data_error.normalized_messages()}, 422
        except ValidationError as data_error:
            return {'error': data_error.error_message}, 422
        except Exception as e:
            return handleInternalError(e)


@impl
def app_load_blueprints(app):
    userBp = Blueprint("user", __name__, url_prefix="/user")
    userApi = Api(app=userBp)

    userApi.add_resource(UserRegistration, "/register")
    userApi.add_resource(UserLogin, "/login")
    userApi.add_resource(User, "/", "/<user_id>")
    userApi.add_resource(UserInvite, "/invite")

    app.register_blueprint(userBp)
