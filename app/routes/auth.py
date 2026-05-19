from flask import Blueprint, jsonify, request

from app.services.auth_service import build_demo_user


auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.post("/login")
def login():
    payload = request.get_json(silent=True) or {}
    return jsonify({"user": build_demo_user(email=payload.get("email"), role=payload.get("role")), "message": "demo login"})


@auth_bp.post("/register")
def register():
    payload = request.get_json(silent=True) or {}
    return jsonify({"user": build_demo_user(payload.get("username"), payload.get("email"), payload.get("role")), "message": "demo register"}), 201


@auth_bp.post("/logout")
def logout():
    return jsonify({"message": "demo logout"})
