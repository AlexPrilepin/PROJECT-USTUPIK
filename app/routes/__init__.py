from .api import api_bp
from .auth import auth_bp
from .courses import courses_bp
from .pages import pages_bp
from .profile import profile_bp

__all__ = ["api_bp", "auth_bp", "courses_bp", "pages_bp", "profile_bp"]
