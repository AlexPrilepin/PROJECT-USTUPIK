import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MOCK_FILE = ROOT / "app" / "static" / "data" / "mock-content.json"


class MockContentTests(unittest.TestCase):
    def test_mock_file_is_valid_json(self):
        data = json.loads(MOCK_FILE.read_text(encoding="utf-8"))
        self.assertIn("courses", data)
        self.assertGreaterEqual(len(data["courses"]), 1)

    def test_test_course_contains_theory_and_practice(self):
        data = json.loads(MOCK_FILE.read_text(encoding="utf-8"))
        course = data["courses"][0]
        module_types = {module["type"] for module in course["modules"]}
        self.assertIn("theory", module_types)
        self.assertIn("practice", module_types)

    def test_course_has_required_fields(self):
        data = json.loads(MOCK_FILE.read_text(encoding="utf-8"))
        course = data["courses"][0]
        for field in ["slug", "title", "shortDescription", "fullDescription", "modules"]:
            self.assertIn(field, course)


if __name__ == "__main__":
    unittest.main()
