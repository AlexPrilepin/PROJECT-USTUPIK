from datetime import datetime, timezone

from app.extensions import db


class Course(db.Model):
    __tablename__ = "courses"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(200), unique=True, nullable=False, index=True)
    short_description = db.Column(db.Text, nullable=False)
    full_description = db.Column(db.Text, nullable=False)
    difficulty = db.Column(db.String(32), nullable=False, default="beginner")
    cover_image = db.Column(db.String(255), nullable=True)
    is_published = db.Column(db.Boolean, nullable=False, default=False)
    author_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    author = db.relationship("User", back_populates="courses_created")
    modules = db.relationship("Module", back_populates="course", cascade="all, delete-orphan", order_by="Module.position")
    enrollments = db.relationship("Enrollment", back_populates="course", cascade="all, delete-orphan", lazy="dynamic")
    submissions = db.relationship("Submission", back_populates="course", cascade="all, delete-orphan", lazy="dynamic")

    def __repr__(self):
        return f"<Course {self.slug}>"
