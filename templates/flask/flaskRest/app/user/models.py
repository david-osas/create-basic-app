from werkzeug.security import generate_password_hash, check_password_hash
from app.extentions import db
from app.core.crudMixin import CrudMixin


class UserModel(CrudMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String)
    email = db.Column(db.String, unique=True, nullable=False)
    _password = db.Column('password', db.String(120))
    set_password_token = db.Column(db.String, unique=True)
    set_password_token_expiry = db.Column(db.DateTime)

    @property
    def password(self):
        return self._password

    @password.setter
    def password(self, password):
        self._password = generate_password_hash(password)

    def check_password(self, password):
        if self.password is None:
            return False
        return check_password_hash(self.password, password)

    @staticmethod
    def get_user_by_token(token):
        return UserModel.query.filter(UserModel.set_password_token == token).first() if token is not None else None

    @staticmethod
    def get_user_by_emails(emails):
        return UserModel.query.filter(UserModel.email.in_(emails)).all()

    @staticmethod
    def get_user_by_ids(ids):
        return UserModel.query.filter(UserModel.id.in_(ids)).all()

