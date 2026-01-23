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

# Comment patterns for different languages
CODE_RUNNER_PATTERNS = {
    'javascript': r'^//\s*CODE_RUNNER:\s*(.+)$',
    'python': r'^#\s*CODE_RUNNER:\s*(.+)$',
    'java': r'^//\s*CODE_RUNNER:\s*(.+)$',
}


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


def fix_js_code_blocks(markdown):
    # This regex finds ```python blocks starting with %%js and replaces with ```javascript
    # but keeps the %%js line for developers to see
    pattern = re.compile(r"```python\n%%js\n", re.MULTILINE)
    markdown = pattern.sub("```javascript\n%%js\n", markdown)
    # Optionally, handle blocks with no newline after %%js
    pattern2 = re.compile(r"```python\r?\n%%js\r?\n", re.MULTILINE)
    markdown = pattern2.sub("```javascript\n%%js\n", markdown)
    return markdown


def extract_code_runner_metadata(cell_source, language):
    """Extract CODE_RUNNER challenge from cell comments"""
    if language not in CODE_RUNNER_PATTERNS:
        return None
    
    pattern = CODE_RUNNER_PATTERNS[language]
    lines = cell_source.split('\n')
    
    for line in lines:
        match = re.match(pattern, line.strip(), re.IGNORECASE)
        if match:
            return match.group(1).strip()
    
    return None


def clean_code_for_runner(cell_source, language):
    """Remove magic commands, CODE_RUNNER comments, and language-specific artifacts from code"""
    lines = cell_source.split('\n')
    cleaned_lines = []
    
    # Pattern for CODE_RUNNER comments
    if language in CODE_RUNNER_PATTERNS:
        pattern = CODE_RUNNER_PATTERNS[language]
    else:
        pattern = None
    
    # Find index of last non-whitespace line for Java .main(null) removal
    last_content_index = -1
    if language == 'java':
        for i in range(len(lines) - 1, -1, -1):
            if lines[i].strip():
                last_content_index = i
                break
    
    for i, line in enumerate(lines):
        # Skip %%js magic command (JavaScript first line)
        if language == 'javascript' and i == 0 and line.strip().startswith('%%js'):
            continue
        # Skip any other magic commands
        if line.strip().startswith('%%'):
            continue
        # Skip CODE_RUNNER comment lines
        if pattern and re.match(pattern, line.strip(), re.IGNORECASE):
            continue
        # Skip Java .main(null) call (last non-whitespace line)
        if language == 'java' and i == last_content_index:
            if re.match(r'^\w+\.main\s*\(\s*null\s*\)\s*;?\s*$', line.strip()):
                continue
        cleaned_lines.append(line)
    
    # Join lines and strip trailing whitespace
    result = '\n'.join(cleaned_lines).rstrip()
    
    # Remove leading empty lines
    while result.startswith('\n'):
        result = result[1:]
    
    return result


def generate_runner_id(permalink, index):
    """Generate runner_id from permalink"""
    # Convert /javascript/json/lesson to javascript-json-lesson-0
    clean_permalink = permalink.strip('/').replace('/', '-')
    return f"{clean_permalink}-{index}"


def detect_cell_language(cell):
    """Detect the programming language of a code cell"""
    source = cell.get('source', '')
    lines = source.split('\n')
    
    # JavaScript: first line is %%js magic command
    if lines and lines[0].strip().startswith('%%js'):
        return 'javascript'
    
    # Java: last non-whitespace line matches ClassName.main(null);
    # Find last non-empty line
    last_line = ''
    for line in reversed(lines):
        if line.strip():
            last_line = line.strip()
            break
    if re.match(r'^\w+\.main\s*\(\s*null\s*\)\s*;?\s*$', last_line):
        return 'java'
    
    # Default to python
    return 'python'


def process_code_runner_cells(notebook, permalink):
    """Process notebook cells and add code-runner metadata"""
    runner_index = 0
    processed_cells = []
    
    for cell in notebook.cells:
        if cell.cell_type == 'code':
            language = detect_cell_language(cell)
            challenge = extract_code_runner_metadata(cell.source, language)
            
            if challenge:
                # Store metadata for later use
                cell['metadata']['code_runner'] = {
                    'challenge': challenge,
                    'language': language,
                    'runner_id': generate_runner_id(permalink, runner_index),
                    'code': clean_code_for_runner(cell.source, language)
                }
                runner_index += 1
                
                # Clear outputs for cells with code-runner (outputs are redundant)
                cell['outputs'] = []
                cell['execution_count'] = None
        
        processed_cells.append(cell)
    
    notebook.cells = processed_cells
    return notebook


def inject_code_runners(markdown, notebook, front_matter=None):
    """Inject code-runner includes after code blocks with metadata
    
    If front_matter contains 'challenge_submit: true', also injects:
    - challenge-submit-button.html after each code-runner
    - lesson-submit-button.html at the end of the document
    """
    if front_matter is None:
        front_matter = {}
    
    challenge_submit_enabled = front_matter.get('challenge_submit', False)
    permalink = front_matter.get('permalink', '')
    # Generate lesson_key from permalink (e.g., "/csa/frqs/2019/3" -> "csa-frqs-2019-3")
    lesson_key = permalink.strip('/').replace('/', '-') if permalink else 'unknown-lesson'
    
    lines = markdown.split('\n')
    result = []
    in_code_block = False
    code_block_content = []
    cell_index = 0
    code_cell_count = 0
    code_runner_count = 0
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Detect code block start
        if line.startswith('```'):
            if not in_code_block:
                in_code_block = True
                code_block_content = [line]
            else:
                # End of code block
                in_code_block = False
                code_block_content.append(line)
                
                # Check if this corresponds to a code cell with runner metadata
                code_cell = None
                current_code_cell = 0
                for cell in notebook.cells:
                    if cell.cell_type == 'code':
                        if current_code_cell == code_cell_count:
                            code_cell = cell
                            break
                        current_code_cell += 1
                
                code_cell_count += 1
                
                # Add code-runner if metadata exists
                if code_cell and 'code_runner' in code_cell.get('metadata', {}):
                    runner_data = code_cell['metadata']['code_runner']
                    result.append('')
                    # Add liquid captures and code-runner include
                    result.append('{% capture challenge' + str(code_runner_count) + ' %}')
                    result.append(runner_data['challenge'])
                    result.append('{% endcapture %}')
                    result.append('')
                    result.append('{% capture code' + str(code_runner_count) + ' %}')
                    result.append(runner_data['code'])
                    result.append('{% endcapture %}')
                    result.append('')
                    result.append('{% capture source' + str(code_runner_count) + ' %}')
                    # Add the source code block content (already formatted markdown)
                    result.extend(code_block_content)
                    result.append('{% endcapture %}')
                    result.append('')
                    result.append('{% include code-runner.html')
                    result.append('   runner_id="' + runner_data['runner_id'] + '"')
                    result.append('   language="' + runner_data['language'] + '"')
                    result.append('   challenge=challenge' + str(code_runner_count))
                    result.append('   code=code' + str(code_runner_count))
                    result.append('   source=source' + str(code_runner_count))
                    result.append('%}')                
                    result.append('')
                    code_runner_count += 1
                else:
                    # Regular code block without code-runner
                    result.extend(code_block_content)                
                code_block_content = []
        elif in_code_block:
            code_block_content.append(line)
        else:
            result.append(line)
        
        i += 1
    
    # If challenge_submit is enabled, add lesson submit button at the end
    if challenge_submit_enabled:
        result.append('')
        result.append('{% include lesson-submit-button.html')
        result.append('   lesson_key="' + lesson_key + '"')
        result.append('%}')
        result.append('')
    
    return '\n'.join(result)


# Function to convert the notebook to Markdown with front matter
def convert_notebook_to_markdown_with_front_matter(notebook_file):
    with open(notebook_file, "r", encoding="utf-8") as file:
        notebook = nbformat.read(file, as_version=nbformat.NO_CONVERT)
        front_matter = extract_front_matter(notebook_file, notebook.cells[0])
        
        # Get permalink for runner_id generation
        permalink = front_matter.get('permalink', '')
        
        notebook.cells.pop(0)
        
        # Process code runner cells before conversion
        notebook = process_code_runner_cells(notebook, permalink)
        
        process_mermaid_cells(notebook)
        exporter = MarkdownExporter()
        markdown, _ = exporter.from_notebook_node(notebook)
        markdown = fix_js_code_blocks(markdown) # Fix JS code blocks
        
        # Inject code-runner includes (and submit buttons if challenge_submit is enabled)
        markdown = inject_code_runners(markdown, notebook, front_matter)
        
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
    # Check if a specific file was passed as an argument
    if len(sys.argv) > 1:
        notebook_file = sys.argv[1]
        if os.path.exists(notebook_file):
            print(f"Converting single notebook: {notebook_file}")
            convert_single_notebook(notebook_file)
        else:
            print(f"Error: File not found: {notebook_file}")
            sys.exit(1)
    else:
        convert_notebooks()
