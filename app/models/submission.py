from datetime import datetime, timezone

from app.extensions import db


class Submission(db.Model):
    __tablename__ = "submissions"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    course_id = db.Column(db.Integer, db.ForeignKey("courses.id"), nullable=False, index=True)
    module_id = db.Column(db.Integer, db.ForeignKey("modules.id"), nullable=False, index=True)
    submitted_text = db.Column(db.Text, nullable=False)
    verdict = db.Column(db.String(32), nullable=False, default="pending")
    feedback = db.Column(db.Text, nullable=True)
    runtime_ms = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))

    user = db.relationship("User", back_populates="submissions")
    course = db.relationship("Course", back_populates="submissions")
    module = db.relationship("Module", back_populates="submissions")

    def __repr__(self):
        return f"<Submission {self.id} {self.verdict}>"
