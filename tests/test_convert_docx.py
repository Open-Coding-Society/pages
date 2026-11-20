import contextlib
import io
from pathlib import Path
import subprocess
import tempfile
from types import SimpleNamespace
import unittest
from unittest.mock import patch

from docx import Document
from docx.enum.style import WD_STYLE_TYPE

from scripts import convert_docx


ROOT = Path(__file__).resolve().parent.parent


class DocxDiagnosticsTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.source = self.root / "_docx"
        self.source.mkdir()
        self.converter = convert_docx.DocxConverter(
            docx_dir=self.source,
            posts_dir=self.root / "_posts",
            images_dir=self.root / "images",
        )

    def document(self, name):
        path = self.source / name
        document = Document()
        document.styles.add_style("Unmapped Example", WD_STYLE_TYPE.PARAGRAPH)
        document.add_paragraph("Keep this lesson text.", style="Unmapped Example")
        document.save(path)
        return path

    def test_summary_and_verbose_diagnostics_preserve_converted_content(self):
        source = self.document("lesson.docx")
        summary = io.StringIO()
        with contextlib.redirect_stdout(summary):
            result = self.converter.convert_docx_to_markdown(source)
        self.assertIsNotNone(result)
        before = result["markdown_path"].read_text()
        self.assertIn("Keep this lesson text.", before)
        self.assertIn("lesson.docx", summary.getvalue())
        self.assertIn("1 warnings; details: make convert-docx DOCX_FLAGS=--force", summary.getvalue())
        self.assertNotIn("Unrecognised paragraph style", summary.getvalue())

        self.converter.verbose = True
        details = io.StringIO()
        with contextlib.redirect_stdout(details):
            result = self.converter.convert_docx_to_markdown(source)
        self.assertIn("Unrecognised paragraph style: Unmapped Example", details.getvalue())
        after = result["markdown_path"].read_text()
        # Only the existing conversion timestamp may differ between runs.
        before = "\n".join(line for line in before.splitlines() if not line.startswith("<!-- Conversion date:"))
        after = "\n".join(line for line in after.splitlines() if not line.startswith("<!-- Conversion date:"))
        self.assertEqual(before, after)

    def test_summary_never_hides_errors_or_other_message_types(self):
        messages = [
            SimpleNamespace(type="warning", message="Unknown style"),
            SimpleNamespace(type="error", message="Unsupported document element"),
            SimpleNamespace(type="info", message="Additional diagnostic"),
        ]
        with patch("builtins.print") as output:
            self.converter.report_conversion_messages(Path("lesson.docx"), messages)
        output.assert_called_once()
        text = output.call_args.args[0]
        self.assertIn("error: Unsupported document element", text)
        self.assertIn("info: Additional diagnostic", text)
        self.assertNotIn("Unknown style", text)

    def test_parallel_conversion_reports_each_documents_warning_and_skips_unchanged_files(self):
        self.document("first.docx")
        self.document("second.docx")
        with contextlib.redirect_stdout(io.StringIO()) as output:
            results = self.converter.convert_all_docx()
        self.assertEqual(2, len(results))
        self.assertIn("Converting 2 files in parallel", output.getvalue())
        for name in ("first.docx", "second.docx"):
            self.assertIn(f"DOCX conversion messages for {name}:\n    1 warnings;", output.getvalue())
        with contextlib.redirect_stdout(io.StringIO()) as output:
            results = self.converter.convert_all_docx()
        self.assertTrue(all(result.get("skipped") for result in results))
        self.assertEqual("", output.getvalue())

    def test_force_cli_reconverts_up_to_date_documents_with_verbose_details(self):
        self.document("lesson.docx")
        command = [
            str(ROOT / "venv/bin/python3"), str(ROOT / "scripts/convert_docx.py"),
        ]
        subprocess.run(command, cwd=self.root, capture_output=True, text=True, check=True)
        skipped = subprocess.run(command, cwd=self.root, capture_output=True, text=True, check=True)
        self.assertEqual("", skipped.stdout)
        forced = subprocess.run(
            command + ["--force", "--verbose"],
            cwd=self.root, capture_output=True, text=True, check=True,
        )
        self.assertIn("Unrecognised paragraph style: Unmapped Example", forced.stdout)
        self.assertIn("Converted: 1 documents", forced.stdout)

    def test_make_enables_details_only_for_explicit_conversion_goals(self):
        extra_makefile = ".DEFAULT_GOAL := check-docx-logging\ncheck-docx-logging: convert-docx\n"
        for goals, verbose in (([], False), (["convert"], True), (["convert-docx"], True)):
            with self.subTest(goals=goals):
                result = subprocess.run(
                    ["make", "--no-print-directory", "-s", "-f", "Makefile", "-f", "-",
                     "PYTHON=echo", "DOCX_FLAGS=--force", *goals],
                    cwd=ROOT, input=extra_makefile, capture_output=True, text=True, check=True,
                )
                docx_command = next(
                    line for line in result.stdout.splitlines()
                    if line.startswith("scripts/convert_docx.py")
                )
                self.assertEqual(verbose, "--verbose" in docx_command)
                self.assertIn("--force", docx_command)


if __name__ == "__main__":
    unittest.main()
