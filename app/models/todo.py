from app import db

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, unique=False)
    done = db.Column(db.Boolean, unique=False, default=False)
    order = db.Column(db.Integer, unique=False)


    def to_dict(self):
        return dict(
            title = self.title,
            done = self.done,
            id = self.id,
            order = self.order
        )

    def __repr__(self):
        return '<Todo %r>' % (self.id)