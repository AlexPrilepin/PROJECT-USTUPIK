import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MOCK_PATH = ROOT / "app" / "static" / "data" / "mock-content.json"


class MockContentTests(unittest.TestCase):
    def setUp(self):
        self.data = json.loads(MOCK_PATH.read_text(encoding="utf-8"))

    def test_has_single_test_course(self):
        self.assertIn("courses", self.data)
        self.assertEqual(len(self.data["courses"]), 1)
        self.assertEqual(self.data["courses"][0]["slug"], "flask-launchpad")

    def test_course_has_theory_and_practice(self):
        modules = self.data["courses"][0]["modules"]
        module_types = {module["type"] for module in modules}
        self.assertEqual(module_types, {"theory", "practice"})

    def test_practice_module_has_required_fields(self):
        practice = next(module for module in self.data["courses"][0]["modules"] if module["type"] == "practice")
        for field in ["taskTitle", "taskDescription", "inputHint", "successTips"]:
            self.assertIn(field, practice)
        self.assertGreaterEqual(len(practice["successTips"]), 3)

    def test_course_has_tags_for_filters(self):
        tags = self.data["courses"][0]["tags"]
        for tag in ["python", "flask", "backend", "sqlite"]:
            self.assertIn(tag, tags)


if __name__ == "__main__":
    unittest.main()
