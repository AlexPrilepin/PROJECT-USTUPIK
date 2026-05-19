from flask import Flask

from .config import Config
from .extensions import db, migrate
from .routes.api import api_bp
from .routes.auth import auth_bp
from .routes.courses import courses_bp
from .routes.pages import pages_bp
from .routes.profile import profile_bp


def create_app(config_class=Config) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)

    app.register_blueprint(pages_bp)
    app.register_blueprint(api_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(courses_bp)
    app.register_blueprint(profile_bp)

    return app
