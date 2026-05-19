import os
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[1]


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / 'instance' / 'app.db'}")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JSON_AS_ASCII = False
