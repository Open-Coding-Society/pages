import unittest

import nbformat
from nbconvert import MarkdownExporter

from scripts.convert_notebooks import inject_code_runners, process_custom_cells

SNIPPET = "```java\nshow(3, \"a\");\n```"


def java_runner_cell(challenge, class_name):
    cell = nbformat.v4.new_code_cell(f"// CODE_RUNNER: {challenge}\npublic class {class_name} {{ }}\n{class_name}.main(null);")
    cell.metadata["vscode"] = {"languageId": "java"}
    return cell


def convert(cells):
    """Run the converter's cell pipeline, export and runner injection, as a notebook conversion does."""
    notebook = process_custom_cells(nbformat.v4.new_notebook(cells=cells), "/csa/loops/")
    markdown, _ = MarkdownExporter().from_notebook_node(notebook)
    return inject_code_runners(markdown, notebook, {"permalink": "/csa/loops/"})


class CodeRunnerPlacementTest(unittest.TestCase):
    def test_a_fence_in_a_markdown_cell_stays_a_snippet_and_takes_no_runner(self):
        markdown = convert([
            nbformat.v4.new_markdown_cell(f"Before\n\n{SNIPPET}"),
            java_runner_cell("First", "First"),
            nbformat.v4.new_markdown_cell(f"Between\n\n{SNIPPET}"),
            java_runner_cell("Second", "Second"),
        ])

        first = markdown.index("{% capture code0 %}\npublic class First")
        second = markdown.index("{% capture code1 %}\npublic class Second")
        self.assertLess(markdown.index("Before"), first)
        self.assertLess(first, markdown.index("Between"))
        self.assertLess(markdown.index("Between"), second)
        self.assertEqual(2, markdown.count(SNIPPET))

    def test_every_runner_keeps_its_own_code_as_its_source(self):
        markdown = convert([
            nbformat.v4.new_markdown_cell(SNIPPET),
            java_runner_cell("First", "First"),
        ])

        source = markdown[markdown.index("{% capture source0 %}"):]
        self.assertIn("public class First", source[:source.index("{% endcapture %}")])
        self.assertNotIn("CODE_RUNNER: First", markdown.replace(source, ""))


if __name__ == "__main__":
    unittest.main()
