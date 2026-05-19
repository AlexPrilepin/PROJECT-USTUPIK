from datetime import datetime, timezone

from app.extensions import db


class Enrollment(db.Model):
    __tablename__ = "enrollments"
    __table_args__ = (db.UniqueConstraint("user_id", "course_id", name="uq_enrollments_user_course"),)

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    course_id = db.Column(db.Integer, db.ForeignKey("courses.id"), nullable=False, index=True)
    status = db.Column(db.String(20), nullable=False, default="active")
    progress_percent = db.Column(db.Integer, nullable=False, default=0)
    enrolled_at = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    completed_at = db.Column(db.DateTime, nullable=True)

    user = db.relationship("User", back_populates="enrollments")
    course = db.relationship("Course", back_populates="enrollments")

    def __repr__(self):
        return f"<Enrollment user={self.user_id} course={self.course_id}>"
