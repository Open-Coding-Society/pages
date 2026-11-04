"""Behavior tests for picking the minimum notebooks omake must convert."""

import json
import tempfile
import unittest
from pathlib import Path

from scripts.omake.required_notebooks import find_required_notebooks


def write_notebook(path, front_matter):
    path.parent.mkdir(parents=True, exist_ok=True)
    notebook = {"cells": [{"cell_type": "raw", "metadata": {}, "source": f"---\n{front_matter}\n---"}]}
    path.write_text(json.dumps(notebook), encoding="utf-8")


class RequiredTestNotebooksTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.repo = Path(self.temp_dir.name)
        reference_page = self.repo / "_posts/projects/2026-04-15-java.md"
        reference_page.parent.mkdir(parents=True)
        reference_page.write_text("---\ntitle: Java Reference\nlesson_category: Java\n---\n", encoding="utf-8")

    def tearDown(self):
        self.temp_dir.cleanup()

    def test_picks_one_notebook_per_listed_category(self):
        write_notebook(self.repo / "_notebooks/projects/java/b.ipynb", "categories: [Java]")
        write_notebook(self.repo / "_notebooks/projects/java/a.ipynb", "categories: [Java, Algorithms]")
        self.assertEqual(find_required_notebooks(self.repo), ["_notebooks/projects/java/a.ipynb"])

    def test_ignores_notebooks_from_unlisted_categories(self):
        write_notebook(self.repo / "_notebooks/CSP/lesson.ipynb", "categories: [CSP]")
        self.assertEqual(find_required_notebooks(self.repo), [])

    def test_accepts_space_separated_category_string(self):
        write_notebook(self.repo / "_notebooks/x.ipynb", "categories: Java Basics")
        self.assertEqual(find_required_notebooks(self.repo), ["_notebooks/x.ipynb"])

    def test_finds_categories_in_project_notebooks(self):
        write_notebook(self.repo / "_projects/lessons/java/notebooks/a.ipynb", "categories: [Java]")
        self.assertEqual(find_required_notebooks(self.repo), ["_projects/lessons/java/notebooks/a.ipynb"])

    def test_skips_project_files_the_converter_does_not_publish(self):
        write_notebook(self.repo / "_projects/lessons/java/scratch/a.ipynb", "categories: [Java]")
        write_notebook(self.repo / "_projects/_template/notebooks/a.ipynb", "categories: [Java]")
        self.assertEqual(find_required_notebooks(self.repo), [])


if __name__ == "__main__":
    unittest.main()
