import glob
from nbconvert import MarkdownExporter
from nbconvert.utils.exceptions import ConversionException
import os
import nbformat
import yaml
import sys
import subprocess
from hashlib import sha256
import concurrent.futures, traceback, re

if __name__ == "__main__":
    from progress_bar import ProgressBar
else:
    from scripts.progress_bar import ProgressBar


notebook_directory = "_notebooks"
destination_directory = "_posts"
mermaid_output_directory = "assets/mermaid"


def error_cleanup(notebook_file):
    destination_file = os.path.basename(notebook_file).replace(".ipynb", "_IPYNB_2_.md")
    destination_path = os.path.join(destination_directory, destination_file)

    if os.path.exists(destination_path):
        os.remove(destination_path)


def extract_front_matter(notebook_file, cell):
    front_matter = {}
    source = cell.get("source", "")

    if source.startswith("---"):
        try:
            front_matter = yaml.safe_load(source.split("---", 2)[1])
        except yaml.YAMLError as e:
            print(f"Error parsing YAML front matter: {e}")
            error_cleanup(notebook_file)
            sys.exit(1)
    return front_matter


def get_relative_output_path(notebook_file):
    relative_path = os.path.relpath(notebook_file, notebook_directory)

    markdown_filename = relative_path.replace(".ipynb", "_IPYNB_2_.md")

    return os.path.join(destination_directory, markdown_filename)


def ensure_directory_exists(path):
    os.makedirs(os.path.dirname(path), exist_ok=True)


# Function to convert the notebook to Markdown with front matter
def convert_notebook_to_markdown_with_front_matter(notebook_file):
    with open(notebook_file, "r", encoding="utf-8") as file:
        notebook = nbformat.read(file, as_version=nbformat.NO_CONVERT)
        front_matter = extract_front_matter(notebook_file, notebook.cells[0])
        notebook.cells.pop(0)
        process_mermaid_cells(notebook)
        exporter = MarkdownExporter()
        markdown, _ = exporter.from_notebook_node(notebook)
        front_matter_content = (
            "---\n"
            + "\n".join(f"{key}: {value}" for key, value in front_matter.items())
            + "\n---\n\n"
        )
        markdown_with_front_matter = front_matter_content + markdown
        destination_path = get_relative_output_path(notebook_file)
        ensure_directory_exists(destination_path)
        with open(destination_path, "w", encoding="utf-8") as file:
            file.write(markdown_with_front_matter)


# Function to convert the Jupyter Notebook files to Markdown
def convert_single_notebook(notebook_file):
    try:
        convert_notebook_to_markdown_with_front_matter(notebook_file)
    except ConversionException as e:
        print(f"Conversion error for {notebook_file}: {str(e)}")
        error_cleanup(notebook_file)
        sys.exit(1)


def process_notebook(notebook_file):
    try:
        convert_single_notebook(notebook_file)
    except ConversionException as e:
        print(f"Conversion error for {notebook_file}: {str(e)}")
        error_cleanup(notebook_file)
    except Exception as e:
        print(f"Unexpected error for {notebook_file}: {traceback.format_exc()}")


def convert_notebooks():
    maxCores = os.cpu_count()  # get the number of cores available on the system

    notebook_files = glob.glob(f"{notebook_directory}/**/*.ipynb", recursive=True)

    # create progress bar
    convertBar = ProgressBar(
        userInfo="Notebook conversion progress:", total=(len(notebook_files))
    )

    with concurrent.futures.ProcessPoolExecutor(max_workers=maxCores) as executor:
        futures = {
            executor.submit(process_notebook, notebook_file): notebook_file
            for notebook_file in notebook_files
        }

        for future in concurrent.futures.as_completed(futures):
            notebook_file = futures[future]
            try:
                future.result()
            except Exception as e:
                print(
                    f"Error occurred during notebook processing: {notebook_file}\n{traceback.format_exc()}"
                )
            finally:
                rel_path = os.path.relpath(notebook_file, notebook_directory)
                convertBar.set_suffix(rel_path)
                convertBar.continue_progress()

    convertBar.end_progress()


# MERMAID STUFF =========
def ensure_directory_exists(path):
    os.makedirs(os.path.dirname(path), exist_ok=True)


def convert_mermaid_to_image(mermaid_code):
    ensure_directory_exists(mermaid_output_directory)
    mermaid_hash = sha256(mermaid_code.encode()).hexdigest()
    image_path = os.path.join(mermaid_output_directory, f"{mermaid_hash}.png")

    if not os.path.exists(image_path):
        try:
            process = subprocess.run(
                ["mmdc", "-i", "-", "-o", image_path, "-s", "10"],
                input=mermaid_code,
                text=True,
                check=True,
            )
        except subprocess.CalledProcessError as e:
            print(f"Error converting mermaid diagram: {e}")
            return None
    return image_path


def process_mermaid_cells(notebook):
    for cell in notebook.cells:
        if cell.cell_type == "markdown" and cell.source.startswith("~~~mermaid"):
            mermaid_code = (
                cell.source.replace("~~~mermaid", "").replace("~~~", "").strip()
            )
            image_path = convert_mermaid_to_image(mermaid_code)
            if image_path:
                cell.source = f"![Mermaid Diagram](../../../../{image_path})"


if __name__ == "__main__":
    convert_notebooks()
