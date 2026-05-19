from flask import Blueprint, jsonify

from app.services.auth_service import build_demo_user
from app.services.course_service import list_courses


profile_bp = Blueprint("profile", __name__, url_prefix="/api/profile")


@profile_bp.get("")
def profile():
    return jsonify({"user": build_demo_user(), "courses_count": 1, "solved_count": 0})


@profile_bp.get("/courses")
def profile_courses():
    return jsonify({"courses": list_courses()})


@profile_bp.get("/submissions")
def profile_submissions():
    return jsonify({"submissions": []})
