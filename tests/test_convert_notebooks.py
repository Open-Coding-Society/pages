import contextlib
import io
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

from scripts import convert_notebooks as converter
from scripts import split_multi_course_files as splitter


ROOT = Path(__file__).resolve().parent.parent


class NotebookConversionTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name).resolve()
        self.project = self.root / "_projects/lessons/demo"
        self.project.mkdir(parents=True)
        self.patch = patch.object(converter, "repository_root", self.root)
        self.patch.start()
        self.addCleanup(self.patch.stop)

    def notebook(self, relative, body="# Original lesson", courses=None):
        source = self.root / relative
        source.parent.mkdir(parents=True, exist_ok=True)
        header = "---\nlayout: post\ntitle: Fixture\npermalink: /fixture/\n"
        if courses:
            header += f"courses: {json.dumps(courses)}\n"
        header += "---\n"
        notebook = {
            "cells": [
                {"cell_type": "raw", "metadata": {}, "source": header},
                {"cell_type": "markdown", "metadata": {}, "source": body},
                {
                    "cell_type": "code", "execution_count": None, "metadata": {},
                    "outputs": [], "source": "// CODE_RUNNER: Fixture\npublic class Fixture { public static void main(String[] args) { System.out.println(1); } }\nFixture.main(null);",
                },
            ],
            "metadata": {"kernelspec": {"name": "java", "language": "java", "display_name": "Java"}},
            "nbformat": 4, "nbformat_minor": 4,
        }
        source.write_text(json.dumps(notebook), encoding="utf-8")
        return source

    def convert(self, sources, **kwargs):
        with contextlib.redirect_stdout(io.StringIO()):
            return converter.convert_notebooks(sources, jobs=1, **kwargs)

    def test_direct_project_output_matches_legacy_staging_without_source_changes(self):
        source = self.notebook("_projects/lessons/demo/notebooks/2026-01-01-topic.ipynb")
        original = source.read_bytes()
        staged = self.root / "_notebooks/projects/demo" / source.name
        staged.parent.mkdir(parents=True)
        shutil.copyfile(source, staged)
        self.assertEqual(converter.get_relative_output_path(source), converter.get_relative_output_path(staged))
        self.convert([staged])
        output = Path(converter.get_relative_output_path(source))
        baseline = output.read_bytes()
        self.convert([source])
        self.assertEqual(baseline, output.read_bytes())
        self.assertIn(b"include runners/code.html", baseline)
        self.assertEqual(original, source.read_bytes())

    def test_index_navigation_and_legacy_paths_preserve_published_names(self):
        examples = {
            "_projects/lessons/demo/index.ipynb": "_posts/projects/demo/2026-04-15-demo_IPYNB_2_.md",
            "_projects/lessons/demo/navigation/overview.ipynb": "_posts/projects/demo/2026-09-12-overview_IPYNB_2_.md",
            "_projects/demo/index.ipynb": "_posts/projects/demo/2026-04-15-demo_IPYNB_2_.md",
            "_projects/demo/notebooks/topic.ipynb": "_posts/projects/demo/topic_IPYNB_2_.md",
            "_projects/demo/notebooks/index.ipynb": "_posts/projects/demo/index_IPYNB_2_.md",
            "_projects/demo/navigation/overview.ipynb": "_posts/projects/demo/2026-09-12-overview_IPYNB_2_.md",
            "_notebooks/Foundation/2026-01-01-topic.ipynb": "_posts/Foundation/2026-01-01-topic_IPYNB_2_.md",
        }
        for source, output in examples.items():
            self.assertEqual(str(self.root / output), converter.get_relative_output_path(self.root / source))
        with patch.object(converter, "project_index_date", "2025-01-01"):
            self.assertTrue(converter.get_relative_output_path(self.project / "index.ipynb").endswith("2025-01-01-demo_IPYNB_2_.md"))

    def test_flat_project_batch_and_custom_dates_are_preserved_in_workers(self):
        index = self.notebook("_projects/flat/index.ipynb")
        navigation = self.notebook("_projects/flat/navigation/overview.ipynb")
        self.assertEqual([index, navigation], converter.project_notebooks(index.parent))
        with patch.object(converter, "project_index_date", "2025-01-02"), \
                patch.object(converter, "project_navigation_date", "2025-01-03"), \
                contextlib.redirect_stdout(io.StringIO()):
            self.assertEqual(2, converter.convert_notebooks([index, navigation], jobs=2))
        self.assertTrue((self.root / "_posts/projects/flat/2025-01-02-flat_IPYNB_2_.md").is_file())
        self.assertTrue((self.root / "_posts/projects/flat/2025-01-03-overview_IPYNB_2_.md").is_file())

    def test_unrecognized_and_escaping_sources_are_rejected(self):
        for relative in ["outside.ipynb", "_projects/lessons/demo/docs/topic.ipynb", "_projects/lessons/demo/notebooks/nested/topic.ipynb"]:
            with self.assertRaises(ValueError):
                converter.get_relative_output_path(self.root / relative)

    def test_incremental_batch_skips_unchanged_and_rebuilds_only_edited_source(self):
        first = self.notebook("_projects/lessons/demo/notebooks/first.ipynb")
        second = self.notebook("_projects/lessons/demo/notebooks/second.ipynb")
        self.assertEqual(2, self.convert([first, second]))
        outputs = [Path(converter.get_relative_output_path(source)) for source in [first, second]]
        mtimes = [output.stat().st_mtime_ns for output in outputs]
        with patch.object(converter, "convert_notebook_to_markdown_with_front_matter") as convert:
            self.assertEqual(0, self.convert([first, second]))
            convert.assert_not_called()
        notebook = json.loads(first.read_text())
        notebook["cells"][1]["source"] = "# Edited lesson"
        first.write_text(json.dumps(notebook))
        self.assertEqual(1, self.convert([first, second]))
        self.assertIn("Edited lesson", outputs[0].read_text())
        self.assertEqual(mtimes[1], outputs[1].stat().st_mtime_ns)

    def test_metadata_only_edit_or_force_does_not_rewrite_identical_output(self):
        source = self.notebook("_notebooks/topic.ipynb")
        self.convert([source])
        output = Path(converter.get_relative_output_path(source))
        mtime = output.stat().st_mtime_ns
        notebook = json.loads(source.read_text())
        notebook["metadata"]["authoring_note"] = "Not published"
        source.write_text(json.dumps(notebook))
        self.assertEqual(1, self.convert([source]))
        self.assertEqual(mtime, output.stat().st_mtime_ns)
        self.assertEqual(0, self.convert([source]))
        self.assertEqual(1, self.convert([source], force=True))
        self.assertEqual(mtime, output.stat().st_mtime_ns)

    def test_missing_output_modified_converter_and_corrupt_cache_invalidate(self):
        source = self.notebook("_notebooks/topic.ipynb")
        self.convert([source])
        output = Path(converter.get_relative_output_path(source))
        output.unlink()
        self.assertTrue(converter.needs_conversion(source))
        self.convert([source])
        implementation = self.root / "changed_converter.py"
        implementation.write_text("# converter changed")
        with patch.object(converter, "__file__", str(implementation)):
            self.assertTrue(converter.needs_conversion(source))
        converter.cache_path(output).write_text("{broken")
        with contextlib.redirect_stderr(io.StringIO()) as errors:
            self.assertTrue(converter.needs_conversion(source))
        self.assertIn("Invalid conversion cache", errors.getvalue())

    def test_failed_batch_raises_and_removes_stale_nested_output(self):
        good = self.notebook("_notebooks/nested/good.ipynb")
        bad = self.notebook("_notebooks/nested/bad.ipynb")
        self.convert([bad])
        output = Path(converter.get_relative_output_path(bad))
        bad.write_text("not a notebook")
        with contextlib.redirect_stderr(io.StringIO()), self.assertRaisesRegex(RuntimeError, "bad.ipynb"):
            self.convert([good, bad])
        self.assertFalse(output.exists())
        self.assertFalse(converter.cache_path(output).exists())
        self.assertTrue(Path(converter.get_relative_output_path(good)).exists())

    def test_batch_rejects_output_collision_and_invalid_worker_limit(self):
        source = self.notebook("_projects/lessons/demo/notebooks/topic.ipynb")
        staged = self.notebook("_notebooks/projects/demo/topic.ipynb")
        with self.assertRaisesRegex(ValueError, "share output"):
            self.convert([source, staged])
        with self.assertRaisesRegex(ValueError, "at least 1"):
            converter.convert_notebooks([source], jobs=0)

    def test_legacy_scan_and_splitter_ignore_old_project_staging(self):
        legacy = self.notebook("_notebooks/nested/topic.ipynb")
        staged = self.notebook("_notebooks/projects/demo/topic.ipynb", courses={"csa": {"week": 13}, "csp": {"week": 4}})
        with patch.object(converter, "convert_single_notebook", return_value=True) as convert:
            self.convert(None)
        convert.assert_called_once_with(str(legacy), force=False)
        previous = Path.cwd()
        try:
            os.chdir(self.root)
            with contextlib.redirect_stdout(io.StringIO()):
                splitter.find_and_split_multi_course_files()
        finally:
            os.chdir(previous)
        self.assertFalse(staged.with_name("topic_csa.ipynb").exists())

    def test_project_multi_course_post_still_splits_into_existing_routes(self):
        source = self.notebook("_projects/lessons/demo/notebooks/topic.ipynb", courses={"csa": {"week": 13}, "csp": {"week": 4}})
        self.convert([source])
        previous = Path.cwd()
        try:
            os.chdir(self.root)
            with contextlib.redirect_stdout(io.StringIO()):
                splitter.find_and_split_multi_course_files()
        finally:
            os.chdir(previous)
        output = Path(converter.get_relative_output_path(source))
        csa = output.with_name(output.stem + "_csa.md")
        self.assertIn("/fixture/csa/", csa.read_text())
        self.assertIn("week: 13", csa.read_text())
        self.assertFalse((self.root / "_notebooks/projects").exists())

    def prepare_make_fixture(self):
        scripts = self.root / "scripts"
        scripts.mkdir(exist_ok=True)
        shutil.copyfile(ROOT / "scripts/convert_notebooks.py", scripts / "convert_notebooks.py")
        shutil.copyfile(ROOT / "Makefile", self.root / "Makefile")
        template = self.root / "_projects/_template"
        template.mkdir()
        shutil.copyfile(ROOT / "_projects/_template/Makefile", template / "Makefile")
        (self.root / "_projects/.makeprojects").write_text("lessons/demo\n")
        (self.root / "venv").symlink_to(sys.prefix, target_is_directory=True)

    def run_command(self, *command):
        return subprocess.run(command, cwd=self.root, text=True, capture_output=True, timeout=90)

    def test_make_build_and_targeted_conversion_use_sources_and_incremental_batch(self):
        self.prepare_make_fixture()
        first = self.notebook("_projects/lessons/demo/notebooks/first.ipynb")
        second = self.notebook("_projects/lessons/demo/notebooks/second.ipynb")
        index = self.notebook("_projects/lessons/demo/index.ipynb")
        navigation = self.notebook("_projects/lessons/demo/navigation/overview.ipynb")
        generated = self.run_command("make", "generate-makefiles")
        self.assertEqual(0, generated.returncode, generated.stderr)
        build = self.run_command("make", "-C", str(self.project), "build", "CONVERT_JOBS=2")
        self.assertEqual(0, build.returncode, build.stdout + build.stderr)
        self.assertIn("4 converted", build.stdout)
        self.assertFalse((self.root / "_notebooks/projects").exists())
        for source in [first, second, index, navigation]:
            self.assertTrue(Path(converter.get_relative_output_path(source)).is_file())
        build = self.run_command("make", "-C", str(self.project), "build")
        self.assertEqual(0, build.returncode, build.stderr)
        self.assertIn("0 converted, 4 unchanged", build.stdout)
        notebook = json.loads(first.read_text())
        notebook["cells"][1]["source"] = "# Targeted update"
        first.write_text(json.dumps(notebook))
        targeted = self.run_command("make", "-C", str(self.project), "convert-single", "NOTEBOOK_FILE=notebooks/first.ipynb")
        self.assertEqual(0, targeted.returncode, targeted.stderr)
        self.assertIn("1 converted", targeted.stdout)

    def test_root_make_rule_converts_only_its_target_and_fails_on_bad_input(self):
        self.prepare_make_fixture()
        first = self.notebook("_notebooks/first.ipynb")
        second = self.notebook("_notebooks/second.ipynb")
        command = self.run_command("make", "_posts/first_IPYNB_2_.md")
        self.assertEqual(0, command.returncode, command.stdout + command.stderr)
        self.assertTrue(Path(converter.get_relative_output_path(first)).is_file())
        self.assertFalse(Path(converter.get_relative_output_path(second)).exists())
        second.write_text("not a notebook")
        command = self.run_command("make", "convert-single", "NOTEBOOK_FILE=_notebooks/second.ipynb")
        self.assertNotEqual(0, command.returncode)
        self.assertIn("second.ipynb", command.stderr)

    def test_generated_makefiles_refresh_but_tracked_overrides_are_preserved(self):
        self.prepare_make_fixture()
        (self.project / "Makefile").write_text("# obsolete template")
        command = self.run_command("make", "generate-makefiles")
        self.assertEqual(0, command.returncode, command.stderr)
        self.assertEqual((self.root / "_projects/_template/Makefile").read_bytes(), (self.project / "Makefile").read_bytes())
        subprocess.run(["git", "init", "-q"], cwd=self.root, check=True)
        (self.project / "Makefile").write_text("# intentional override")
        subprocess.run(["git", "add", "_projects/lessons/demo/Makefile"], cwd=self.root, check=True)
        command = self.run_command("make", "generate-makefiles")
        self.assertEqual(0, command.returncode, command.stderr)
        self.assertEqual("# intentional override", (self.project / "Makefile").read_text())


if __name__ == "__main__":
    unittest.main()
