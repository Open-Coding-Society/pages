import json
import re
import unittest

import nbformat
from nbconvert import MarkdownExporter

from scripts.convert_notebooks import process_custom_cells

QUESTIONS = [{"q": "Pick one", "code": "if (a < b) { }", "choices": ["Yes", "No"], "answer": 1, "why": "Because."}]


def marker_cell(questions=QUESTIONS, marker="<!-- MCQ_RUNNER: MCQ 1.09 | id: loops-mcq -->", after=""):
    return nbformat.v4.new_markdown_cell(f"{marker}\n```json\n{json.dumps(questions)}\n```\n{after}")


def convert(cells, permalink="/csa/loops/"):
    """Run the converter's cell pipeline and Markdown export, as a notebook conversion does."""
    notebook = process_custom_cells(nbformat.v4.new_notebook(cells=cells), permalink)
    markdown, _ = MarkdownExporter().from_notebook_node(notebook)
    return markdown


class McqRunnerConversionTest(unittest.TestCase):
    def test_a_marker_becomes_an_mcq_runner_with_its_title_id_and_questions(self):
        markdown = convert([marker_cell()])

        self.assertIn("{% capture mcq_title1 %}MCQ 1.09{% endcapture %}", markdown)
        self.assertIn('{% include runners/mcq.html runner_id="loops-mcq" title=mcq_title1 questions=mcq_questions1 %}',
                      markdown)
        self.assertNotIn("MCQ_RUNNER", markdown)
        self.assertNotIn("```json", markdown)

    def test_questions_are_one_line_of_json_that_cannot_close_the_script_tag(self):
        markdown = convert([marker_cell([{**QUESTIONS[0], "q": "What does </script> do?"}])])

        embedded = re.search(r"{% raw %}(.*){% endraw %}", markdown).group(1)
        self.assertNotIn("<", embedded)
        self.assertEqual("What does </script> do?", json.loads(embedded)[0]["q"])

    def test_without_an_id_the_runner_gets_a_stable_page_based_id(self):
        markdown = convert([marker_cell(marker="<!-- MCQ_RUNNER: Check -->")])

        self.assertIn('runner_id="csa-loops-mcq-1"', markdown)

    def test_text_after_the_questions_stays_in_the_lesson(self):
        self.assertIn("Now the homework.", convert([marker_cell(after="Now the homework.")]))

    def test_malformed_questions_fail_the_conversion(self):
        bad_cells = {
            "no questions": marker_cell([]),
            "one choice": marker_cell([{"q": "Q", "choices": ["A"], "answer": 0}]),
            "five choices": marker_cell([{"q": "Q", "choices": list("ABCDE"), "answer": 0}]),
            "no question text": marker_cell([{"q": " ", "choices": ["A", "B"], "answer": 0}]),
            "answer out of range": marker_cell([{"q": "Q", "choices": ["A", "B"], "answer": 2}]),
            "answer as a letter": marker_cell([{"q": "Q", "choices": ["A", "B"], "answer": "A"}]),
            "no fence": nbformat.v4.new_markdown_cell("<!-- MCQ_RUNNER: MCQ -->\nQuestion?"),
            "bad JSON": nbformat.v4.new_markdown_cell("<!-- MCQ_RUNNER: MCQ -->\n```json\n[oops\n```"),
        }
        for name, cell in bad_cells.items():
            with self.subTest(name), self.assertRaises(ValueError):
                convert([cell])

    def test_a_duplicate_id_fails_the_conversion(self):
        with self.assertRaises(ValueError):
            convert([marker_cell(), marker_cell()])

    def test_notebooks_without_the_marker_convert_unchanged(self):
        cells = [nbformat.v4.new_markdown_cell("## Loops\nA note mentioning <!-- MCQ_RUNNER: x --> mid-cell.")]
        expected, _ = MarkdownExporter().from_notebook_node(nbformat.v4.new_notebook(cells=cells))

        self.assertEqual(expected, convert(cells))


if __name__ == "__main__":
    unittest.main()
