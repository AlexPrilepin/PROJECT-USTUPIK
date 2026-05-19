from datetime import datetime, timezone

from app.extensions import db


class Module(db.Model):
    __tablename__ = "modules"

    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey("courses.id"), nullable=False, index=True)
    title = db.Column(db.String(200), nullable=False)
    module_type = db.Column(db.String(20), nullable=False)
    position = db.Column(db.Integer, nullable=False, default=1)
    theory_content = db.Column(db.Text, nullable=True)
    practice_prompt = db.Column(db.Text, nullable=True)
    practice_stub = db.Column(db.Text, nullable=True)
    checker_type = db.Column(db.String(40), nullable=False, default="text_rules")
    created_at = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))

    course = db.relationship("Course", back_populates="modules")
    submissions = db.relationship("Submission", back_populates="module", cascade="all, delete-orphan", lazy="dynamic")

    def __repr__(self):
        return f"<Module {self.title}>"
