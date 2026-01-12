import nbformat as nbf
from markdown import markdown
import sys
import os

def convert_md_to_ipynb(md_file):
    # Read the Markdown file
    with open(md_file, "r") as f:
        md_content = f.read()

    # Split the content into cells
    cells = []
    for part in md_content.split("\n\n"):
        # If the part starts with a code block, treat it as code
        if part.startswith("```"):
            code = part.strip("`").strip()
            cells.append(nbf.v4.new_code_cell(code))
        else:
            # Otherwise, treat it as Markdown
            cells.append(nbf.v4.new_markdown_cell(markdown(part)))

    # Create a new notebook
    nb = nbf.v4.new_notebook()
    nb['cells'] = cells

    # Generate output filename
    ipynb_file = os.path.splitext(md_file)[0] + ".ipynb"

    # Write the notebook to a file
    with open(ipynb_file, "w") as f:
        nbf.write(nb, f)

    print(f"Conversion complete! The notebook has been saved as {ipynb_file}")

def process_directory(directory):
    for filename in os.listdir(directory):
        if filename.endswith(".md"):
            md_file_path = os.path.join(directory, filename)
            convert_md_to_ipynb(md_file_path)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python md2ipynb.py <markdown_file.md> or <directory>")
    else:
        input_path = sys.argv[1]
        if os.path.isdir(input_path):
            print(f"Processing directory: {input_path}")
            process_directory(input_path)
        elif os.path.isfile(input_path) and input_path.endswith(".md"):
            convert_md_to_ipynb(input_path)
        else:
            print("Error: The provided path is not a Markdown file or a directory containing Markdown files.")