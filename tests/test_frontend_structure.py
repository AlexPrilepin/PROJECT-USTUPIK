import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class FrontendStructureTests(unittest.TestCase):
    def test_core_files_exist(self):
        required_files = [
            ROOT / "README.md",
            ROOT / "run.py",
            ROOT / ".github" / "workflows" / "dev-ci.yml",
            ROOT / "Dockerfile",
            ROOT / "docker-compose.yml",
            ROOT / "app" / "__init__.py",
            ROOT / "app" / "extensions.py",
            ROOT / "app" / "templates" / "base.html",
            ROOT / "app" / "templates" / "login.html",
            ROOT / "app" / "templates" / "courses.html",
            ROOT / "app" / "templates" / "course_detail.html",
            ROOT / "app" / "templates" / "profile.html",
            ROOT / "app" / "templates" / "learn.html",
            ROOT / "app" / "static" / "css" / "style.css",
            ROOT / "app" / "static" / "js" / "app.js",
            ROOT / "app" / "static" / "js" / "learn.js",
            ROOT / "app" / "static" / "data" / "mock-content.json",
            ROOT / "docs" / "architecture.md",
            ROOT / "docs" / "database.md",
            ROOT / "docs" / "api-contract.md",
            ROOT / "docs" / "backend-evening-task.md",
            ROOT / "docs" / "qa-prep-mts.md",
        ]
        for file_path in required_files:
            self.assertTrue(file_path.exists(), f"Missing file: {file_path}")

    def test_templates_have_expected_markers(self):
        templates = {
            "login.html": "auth-section",
            "courses.html": "coursesGrid",
            "course_detail.html": "courseDetailRoot",
            "profile.html": "profileCoursesGrid",
            "learn.html": "learnRoot",
        }
        for template_name, expected_marker in templates.items():
            content = (ROOT / "app" / "templates" / template_name).read_text(encoding="utf-8")
            self.assertIn('{% extends "base.html" %}', content)
            self.assertIn(expected_marker, content)

    def test_css_has_visual_system(self):
        css = (ROOT / "app" / "static" / "css" / "style.css").read_text(encoding="utf-8")
        for marker in ["--primary", ".glass-card", ".btn-gradient", "@media", "@keyframes"]:
            self.assertIn(marker, css)

    def test_js_has_frontend_helpers(self):
        js = (ROOT / "app" / "static" / "js" / "app.js").read_text(encoding="utf-8")
        for marker in ["APP_STORAGE_KEYS", "loadMockContent", "showToast", "enrollCourse"]:
            self.assertIn(marker, js)

    def test_models_are_real_sqlalchemy_models(self):
        user_model = (ROOT / "app" / "models" / "user.py").read_text(encoding="utf-8")
        submission_model = (ROOT / "app" / "models" / "submission.py").read_text(encoding="utf-8")
        self.assertIn("class User(db.Model)", user_model)
        self.assertIn("password_hash", user_model)
        self.assertIn("class Submission(db.Model)", submission_model)
        self.assertIn("verdict", submission_model)


if __name__ == "__main__":
    unittest.main()
