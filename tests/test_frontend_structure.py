import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class FrontendStructureTests(unittest.TestCase):
    def test_core_files_exist(self):
        required_files = [
            ROOT / "README.md",
            ROOT / "run.py",
            ROOT / "app" / "__init__.py",
            ROOT / "app" / "templates" / "base.html",
            ROOT / "app" / "templates" / "login.html",
            ROOT / "app" / "templates" / "courses.html",
            ROOT / "app" / "templates" / "course_detail.html",
            ROOT / "app" / "templates" / "profile.html",
            ROOT / "app" / "templates" / "learn.html",
            ROOT / "app" / "static" / "css" / "style.css",
            ROOT / "app" / "static" / "js" / "app.js",
            ROOT / "app" / "static" / "data" / "mock-content.json",
        ]
        for file_path in required_files:
            self.assertTrue(file_path.exists(), f"Missing file: {file_path}")

    def test_templates_extend_base_or_have_expected_content(self):
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

    def test_css_has_visual_tokens(self):
        css = (ROOT / "app" / "static" / "css" / "style.css").read_text(encoding="utf-8")
        self.assertIn("--primary", css)
        self.assertIn(".glass-card", css)
        self.assertIn("@media", css)

    def test_app_js_has_storage_helpers(self):
        js = (ROOT / "app" / "static" / "js" / "app.js").read_text(encoding="utf-8")
        self.assertIn("APP_STORAGE_KEYS", js)
        self.assertIn("loadMockContent", js)
        self.assertIn("showToast", js)


if __name__ == "__main__":
    unittest.main()
