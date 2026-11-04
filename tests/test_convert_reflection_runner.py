import unittest

import nbformat
from nbconvert import MarkdownExporter

from scripts.convert_notebooks import process_custom_cells


def convert(cells, permalink="/csa/loops/"):
    """Run the converter's cell pipeline and Markdown export, as a notebook conversion does."""
    notebook = process_custom_cells(nbformat.v4.new_notebook(cells=cells), permalink)
    markdown, _ = MarkdownExporter().from_notebook_node(notebook)
    return markdown


class ReflectionRunnerConversionTest(unittest.TestCase):
    def test_a_marker_becomes_a_reflection_runner_with_its_question_and_id(self):
        markdown = convert([
            nbformat.v4.new_markdown_cell("<!-- REFLECTION_RUNNER: Why use a loop here? | id: loops-why -->"),
        ])

        self.assertIn("{% capture reflection1 %}Why use a loop here?{% endcapture %}", markdown)
        self.assertIn('{% include runners/reflection.html runner_id="loops-why" question=reflection1 '
                      'reflection_number="1" %}', markdown)
        self.assertNotIn("REFLECTION_RUNNER", markdown)

    def test_without_an_id_each_runner_gets_a_stable_page_based_id_in_order(self):
        markdown = convert([
            nbformat.v4.new_markdown_cell("<!-- REFLECTION_RUNNER: First? -->"),
            nbformat.v4.new_code_cell("print('between')"),
            nbformat.v4.new_markdown_cell("<!-- reflection_runner: Second? -->"),
        ])

        first = markdown.index('runner_id="csa-loops-reflection-1"')
        code = markdown.index("print('between')")
        second = markdown.index('runner_id="csa-loops-reflection-2"')
        self.assertLess(first, code)
        self.assertLess(code, second)

    def test_text_after_the_marker_stays_in_the_lesson(self):
        markdown = convert([
            nbformat.v4.new_markdown_cell("<!-- REFLECTION_RUNNER: Why? | id: why -->\nThink about **edge cases**."),
        ])

        self.assertIn('runner_id="why"', markdown)
        self.assertIn("Think about **edge cases**.", markdown)

    def test_ids_are_kept_filename_safe(self):
        markdown = convert([nbformat.v4.new_markdown_cell("<!-- REFLECTION_RUNNER: Why? | id: my id/1 -->")])

        self.assertIn('runner_id="my-id-1"', markdown)

    def test_a_missing_question_or_duplicate_id_fails_the_conversion(self):
        with self.assertRaises(ValueError):
            convert([nbformat.v4.new_markdown_cell("<!-- REFLECTION_RUNNER:  | id: why -->")])
        with self.assertRaises(ValueError):
            convert([
                nbformat.v4.new_markdown_cell("<!-- REFLECTION_RUNNER: A? | id: same -->"),
                nbformat.v4.new_markdown_cell("<!-- REFLECTION_RUNNER: B? | id: same -->"),
            ])

    def test_notebooks_without_the_marker_convert_unchanged(self):
        cells = [
            nbformat.v4.new_markdown_cell("## Loops\nA note mentioning <!-- REFLECTION_RUNNER: x --> mid-cell."),
            nbformat.v4.new_code_cell("print('hi')"),
        ]
        expected, _ = MarkdownExporter().from_notebook_node(nbformat.v4.new_notebook(cells=cells))

        self.assertEqual(expected, convert(cells))


if __name__ == "__main__":
    unittest.main()
