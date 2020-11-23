from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sqlalchemy_repr import RepresentableBase
from flask_restful import Api
from flask_marshmallow import Marshmallow
from flask_jwt_extended import JWTManager

db = SQLAlchemy(model_class=RepresentableBase)
mirgrate = Migrate()
api = Api()
ma = Marshmallow()
jwt = JWTManager()
