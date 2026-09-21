"""Run with: python -m unittest discover -s scripts/tests -p 'test_*.py'."""
import contextlib
import io
import unittest
from pathlib import Path

import nbformat

from scripts.convert_notebooks import CodeRunner

ROOT = Path(__file__).resolve().parents[2]
LESSONS = [
    ('2026-07-21-variables_python_instructor.ipynb', [
        'Nova\n007\n10\nTrue', '15 12',
        'Nova 45\nStored total: 45\nUpdated total: 50', '12 8']),
    ('2025-09-26-data_abstractions_remakers.ipynb', [
        '10\n20\n3\nN', '[10, 25, 15, 12]\n4',
        'Rounds: 3\nTotal: 45', '[6, 12, 12, 5]\n4']),
]


class LessonRunnerTests(unittest.TestCase):
    def test_all_python_examples_match_the_lesson(self):
        for name, expected in LESSONS:
            notebook = nbformat.read(ROOT / '_projects/lessons/python/notebooks' / name, as_version=4)
            cells = [c for c in notebook.cells if c.cell_type == 'code']
            self.assertEqual(len(cells), len(expected))
            for cell, output in zip(cells, expected):
                with self.subTest(lesson=name, source=cell.source):
                    buffer = io.StringIO()
                    with contextlib.redirect_stdout(buffer):
                        exec(cell.source, {})
                    self.assertEqual(buffer.getvalue().strip(), output)

    def test_matching_sources_survive_conversion_and_metadata_round_trip(self):
        cell = nbformat.v4.new_code_cell(
            '# CODE_RUNNER: Trace assignment\nscore = 8\nprint(score)',
            metadata={'code_variants': {'pseudocode': 'score ← 8\nDISPLAY(score)'}},
        )
        runner = CodeRunner.from_cell(cell, '/test', 0)
        restored = CodeRunner.from_metadata(runner.to_metadata())
        self.assertEqual(restored.variants, {
            'python': 'score = 8\nprint(score)',
            'pseudocode': 'score ← 8\nDISPLAY(score)',
        })
        liquid = '\n'.join(restored.liquid_lines(['```python', cell.source, '```'], 1))
        self.assertIn('python_code=variant_python1', liquid)
        self.assertIn('pseudocode_code=variant_pseudocode1', liquid)
        self.assertIn('score ← 8\nDISPLAY(score)', liquid)
        self.assertNotIn('java_code=', liquid)

    def test_existing_runners_keep_their_original_configuration(self):
        cell = nbformat.v4.new_code_cell('# CODE_RUNNER: Existing lesson | autostart:true\nprint(1)')
        runner = CodeRunner.from_cell(cell, '/legacy', 0)
        metadata = runner.to_metadata()
        metadata.pop('variants')  # Previously generated notebooks do not have this field.
        restored = CodeRunner.from_metadata(metadata)
        liquid = '\n'.join(restored.liquid_lines([], 1))
        self.assertEqual(restored.variants, {})
        self.assertNotIn('_code=variant_', liquid)
        self.assertIn('autostart="true"', liquid)

    def test_invalid_variant_is_reported_during_build(self):
        for variants in [{'ruby': 'puts 1'}, {'pseudocode': ''}, {'pseudocode': 123}]:
            cell = nbformat.v4.new_code_cell('# CODE_RUNNER: Invalid\nprint(1)', metadata={'code_variants': variants})
            with self.subTest(variants=variants), self.assertRaisesRegex(ValueError, 'Invalid CODE_RUNNER variant'):
                CodeRunner.from_cell(cell, '/invalid', 0)


if __name__ == '__main__':
    unittest.main()
