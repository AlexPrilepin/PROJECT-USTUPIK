from flask import Flask
from .config import Config
from .routes.pages import pages_bp


def create_app(config_class=Config) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_class)
    app.register_blueprint(pages_bp)
    return app
