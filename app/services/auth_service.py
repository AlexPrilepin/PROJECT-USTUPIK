from app.data.mock_data import load_mock_content


VALID_ROLES = {"student", "teacher"}


def normalize_role(role: str | None) -> str:
    if role in VALID_ROLES:
        return role
    return "student"


def build_demo_user(username: str | None = None, email: str | None = None, role: str | None = None) -> dict:
    user = load_mock_content()["user"].copy()
    user["username"] = username or user["username"]
    user["email"] = email or user["email"]
    user["role"] = normalize_role(role)
    return user
