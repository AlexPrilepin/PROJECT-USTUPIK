from app.data.mock_data import get_course_by_slug, get_courses


def list_courses() -> list[dict]:
    return get_courses()


def get_course(slug: str) -> dict | None:
    return get_course_by_slug(slug)


def build_enrollment_response(slug: str) -> dict | None:
    course = get_course(slug)
    if course is None:
        return None
    return {"status": "active", "course": {"id": course["id"], "slug": course["slug"], "title": course["title"]}}
