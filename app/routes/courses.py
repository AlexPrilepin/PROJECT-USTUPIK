from flask import Blueprint, jsonify

from app.services.course_service import build_enrollment_response


courses_bp = Blueprint("courses", __name__, url_prefix="/api/courses")


@courses_bp.post("/<slug>/enroll")
def enroll(slug: str):
    result = build_enrollment_response(slug)
    if result is None:
        return jsonify({"message": "course not found"}), 404
    return jsonify(result), 201
