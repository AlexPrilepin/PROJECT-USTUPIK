from datetime import datetime, timezone

from app.extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default="student")
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    courses_created = db.relationship("Course", back_populates="author", lazy="dynamic")
    enrollments = db.relationship("Enrollment", back_populates="user", cascade="all, delete-orphan", lazy="dynamic")
    submissions = db.relationship("Submission", back_populates="user", cascade="all, delete-orphan", lazy="dynamic")

    def __repr__(self):
        return f"<User {self.email}>"
