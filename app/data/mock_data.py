import json
from functools import lru_cache
from pathlib import Path


MOCK_CONTENT_PATH = Path(__file__).resolve().parents[1] / "static" / "data" / "mock-content.json"


@lru_cache(maxsize=1)
def load_mock_content() -> dict:
    return json.loads(MOCK_CONTENT_PATH.read_text(encoding="utf-8"))


def get_courses() -> list[dict]:
    return load_mock_content()["courses"]


def get_course_by_slug(slug: str) -> dict | None:
    return next((course for course in get_courses() if course["slug"] == slug), None)
