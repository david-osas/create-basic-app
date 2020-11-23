from app.extentions import db


class CrudMixin(db.Model):
    __abstract__ = True
    created_at = db.Column(db.DateTime(), server_default=db.func.now())
    updated_at = db.Column(
        db.DateTime(), server_default=db.func.now(), onupdate=db.func.now())

    def save(self):
        if self.id is None:
            db.session.add(self)
        db.session.commit()
