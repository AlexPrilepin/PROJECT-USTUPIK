from flask import Blueprint, jsonify, request

from app.services.auth_service import build_demo_user
from app.services.course_service import get_course, list_courses
from app.services.submission_service import evaluate_demo_solution


api_bp = Blueprint("api", __name__, url_prefix="/api")


@api_bp.get("/health")
def health():
    return jsonify({"status": "ok"})


@api_bp.get("/courses")
def courses():
    return jsonify({"courses": list_courses()})


@api_bp.get("/courses/<slug>")
def course(slug: str):
    course_data = get_course(slug)
    if course_data is None:
        return jsonify({"message": "course not found"}), 404
    return jsonify({"course": course_data})


@api_bp.get("/me")
def me():
    return jsonify({"user": build_demo_user()})


@api_bp.post("/submissions")
def submit_solution():
    payload = request.get_json(silent=True) or {}
    result = evaluate_demo_solution(payload.get("submitted_text", ""))
    return jsonify({"submission": {"id": 1, **result}}), 201
