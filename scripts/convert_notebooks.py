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
from dataclasses import dataclass, asdict
from typing import Any, Optional

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

# UI_RUNNER pattern for HTML cells
UI_RUNNER_PATTERN = r'^<!--\s*UI_RUNNER:\s*(.+)\s*-->$'

# GAME_RUNNER pattern for GameEngine cells (JavaScript only)
GAME_RUNNER_PATTERN = r'^//\s*GAME_RUNNER:\s*(.+)$'


########################################
### Section for Core Helper Functions ###
########################################

def ensure_directory_exists(path):
    os.makedirs(os.path.dirname(path), exist_ok=True)


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


def get_custom_cell_id(cell) -> str:
    """Get the precomputed custom cell ID from metadata."""
    return cell.get('metadata', {}).get('custom_cell', {}).get('id', '')


################################
### Section for Object Models ###
################################


@dataclass
class CodeRunner:
    challenge: str
    language: str
    runner_id: str
    code: str
    custom_cell_id: str

    @staticmethod
    def extract_challenge(cell_source: str, language: str) -> Optional[str]:
        if language not in CODE_RUNNER_PATTERNS:
            return None

        pattern = CODE_RUNNER_PATTERNS[language]
        for line in cell_source.split('\n'):
            match = re.match(pattern, line.strip(), re.IGNORECASE)
            if match:
                return match.group(1).strip()
        return None

    @staticmethod
    def clean_code(cell_source: str, language: str) -> str:
        lines = cell_source.split('\n')
        cleaned_lines = []

        pattern = CODE_RUNNER_PATTERNS.get(language)
        last_content_index = -1
        if language == 'java':
            for i in range(len(lines) - 1, -1, -1):
                if lines[i].strip():
                    last_content_index = i
                    break

        for i, line in enumerate(lines):
            if language == 'javascript' and i == 0 and line.strip().startswith('%%js'):
                continue
            if line.strip().startswith('%%'):
                continue
            if pattern and re.match(pattern, line.strip(), re.IGNORECASE):
                continue
            if language == 'java' and i == last_content_index:
                if re.match(r'^\w+\.main\s*\(\s*null\s*\)\s*;?\s*$', line.strip()):
                    continue
            cleaned_lines.append(line)

        result = '\n'.join(cleaned_lines).rstrip()
        while result.startswith('\n'):
            result = result[1:]
        return result

    @classmethod
    def from_cell(cls, cell, permalink: str, runner_index: int) -> Optional["CodeRunner"]:
        language = detect_cell_language(cell)
        challenge = cls.extract_challenge(cell.source, language)
        if not challenge:
            return None

        return cls(
            challenge=challenge,
            language=language,
            runner_id=generate_runner_id(permalink, runner_index),
            code=cls.clean_code(cell.source, language),
            custom_cell_id=get_custom_cell_id(cell),
        )

    def to_metadata(self) -> dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_metadata(cls, metadata: dict[str, Any]) -> "CodeRunner":
        return cls(
            challenge=metadata['challenge'],
            language=metadata['language'],
            runner_id=metadata['runner_id'],
            code=metadata['code'],
            custom_cell_id=metadata.get('custom_cell_id', ''),
        )

    def liquid_lines(self, code_fence_lines: list[str], code_runner_count: int) -> list[str]:
        return [
            '',
            '{% capture challenge' + str(code_runner_count) + ' %}',
            self.challenge,
            '{% endcapture %}',
            '',
            '{% capture code' + str(code_runner_count) + ' %}',
            self.code,
            '{% endcapture %}',
            '',
            '{% capture source' + str(code_runner_count) + ' %}',
            *code_fence_lines,
            '{% endcapture %}',
            '',
            '{% include code-runner.html',
            '   runner_id="' + self.runner_id + '"',
            '   language="' + self.language + '"',
            '   challenge=challenge' + str(code_runner_count),
            '   code=code' + str(code_runner_count),
            '   source=source' + str(code_runner_count),
            '%}',
            '',
        ]


@dataclass
class UiRunner:
    description: str
    runner_id: str
    html: str
    script: str
    custom_cell_id: str

    @staticmethod
    def extract_description(cell_source: str) -> Optional[str]:
        for line in cell_source.split('\n'):
            match = re.match(UI_RUNNER_PATTERN, line.strip(), re.IGNORECASE)
            if match:
                return match.group(1).strip()
        return None

    @staticmethod
    def clean_html_and_script(cell_source: str, runner_index: int) -> tuple[str, str]:
        lines = cell_source.split('\n')
        in_script = False
        html_lines = []
        script_lines = []

        for line in lines:
            if line.strip().startswith('%%html'):
                continue
            if re.match(UI_RUNNER_PATTERN, line.strip(), re.IGNORECASE):
                continue
            if '<script>' in line:
                in_script = True
                continue
            if '</script>' in line:
                in_script = False
                continue

            if in_script:
                script_lines.append(line)
            else:
                html_lines.append(line)

        html_str = '\n'.join(html_lines)
        script_str = '\n'.join(script_lines)

        unique_suffix = f"-ui{runner_index}"
        ids_found = re.findall(r'id="([^"]+)"', html_str)
        for old_id in ids_found:
            new_id = old_id + unique_suffix
            html_str = html_str.replace(f'id="{old_id}"', f'id="{new_id}"')
            script_str = script_str.replace(f"getElementById('{old_id}')", f"getElementById('{new_id}')")
            script_str = script_str.replace(f'getElementById("{old_id}")', f'getElementById("{new_id}")')

        return html_str, script_str

    @classmethod
    def from_cell(cls, cell, permalink: str, runner_index: int) -> Optional["UiRunner"]:
        description = cls.extract_description(cell.source)
        if not description:
            return None

        html_content, script_content = cls.clean_html_and_script(cell.source, runner_index)
        return cls(
            description=description,
            runner_id=generate_runner_id(permalink, runner_index),
            html=html_content,
            script=script_content,
            custom_cell_id=get_custom_cell_id(cell),
        )

    def to_metadata(self) -> dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_metadata(cls, metadata: dict[str, Any]) -> "UiRunner":
        return cls(
            description=metadata['description'],
            runner_id=metadata['runner_id'],
            html=metadata['html'],
            script=metadata['script'],
            custom_cell_id=metadata.get('custom_cell_id', ''),
        )

    def rendered_markup_lines(self) -> list[str]:
        return [
            '<div class="ui-runner">',
            self.html,
            '<script>',
            '(function() {',
            self.script,
            '})();',
            '</script>',
            '</div>',
            '',
        ]


@dataclass
class GameRunner:
    challenge: str
    runner_id: str
    code: str
    options: dict[str, Any]
    custom_cell_id: str

    @staticmethod
    def extract_challenge_and_options(cell_source: str) -> Optional[tuple[str, dict[str, Any]]]:
        for line in cell_source.split('\n'):
            match = re.match(GAME_RUNNER_PATTERN, line.strip(), re.IGNORECASE)
            if not match:
                continue

            content = match.group(1).strip()
            if '|' not in content:
                return (content, {})

            challenge, options_str = content.split('|', 1)
            options: dict[str, Any] = {}
            for option in options_str.strip().split(','):
                if ':' not in option:
                    continue
                key, value = option.split(':', 1)
                key = key.strip()
                value = value.strip().lower()
                if value == 'true':
                    options[key] = True
                elif value == 'false':
                    options[key] = False
                else:
                    options[key] = value

            return (challenge.strip(), options)

        return None

    @staticmethod
    def clean_code(cell_source: str) -> str:
        cleaned_lines = []
        for i, line in enumerate(cell_source.split('\n')):
            if i == 0 and line.strip().startswith('%%js'):
                continue
            if line.strip().startswith('%%'):
                continue
            if re.match(GAME_RUNNER_PATTERN, line.strip(), re.IGNORECASE):
                continue
            cleaned_lines.append(line)

        result = '\n'.join(cleaned_lines).rstrip()
        while result.startswith('\n'):
            result = result[1:]
        return result

    @classmethod
    def from_cell(cls, cell, permalink: str, runner_index: int) -> Optional["GameRunner"]:
        source = cell.get('source', '')
        if not source.strip().startswith('%%js'):
            return None

        result = cls.extract_challenge_and_options(source)
        if not result:
            return None

        challenge, options = result
        return cls(
            challenge=challenge,
            runner_id=generate_runner_id(permalink, runner_index),
            code=cls.clean_code(source),
            options=options,
            custom_cell_id=get_custom_cell_id(cell),
        )

    def to_metadata(self) -> dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_metadata(cls, metadata: dict[str, Any]) -> "GameRunner":
        return cls(
            challenge=metadata['challenge'],
            runner_id=metadata['runner_id'],
            code=metadata['code'],
            options=metadata.get('options', {}),
            custom_cell_id=metadata.get('custom_cell_id', ''),
        )

    def liquid_lines(self, code_runner_count: int) -> list[str]:
        lines = [
            '',
            '{% capture challenge' + str(code_runner_count) + ' %}',
            self.challenge,
            '{% endcapture %}',
            '',
            '{% capture code' + str(code_runner_count) + ' %}',
            self.code,
            '{% endcapture %}',
            '',
            '{% include game-runner.html',
            '   runner_id="' + self.runner_id + '"',
            '   challenge=challenge' + str(code_runner_count),
            '   code=code' + str(code_runner_count),
        ]

        if self.options.get('hide_edit'):
            lines.append('   hide_edit="true"')
        if self.options.get('width'):
            lines.append(f'   width="{self.options["width"]}"')
        if self.options.get('height'):
            lines.append(f'   height="{self.options["height"]}"')

        lines.extend(['%}', ''])
        return lines


@dataclass
class CodeFence:
    opening_fence: str
    body_lines: list[str]
    closing_fence: str

    @classmethod
    def from_markdown_lines(cls, lines) -> Optional["CodeFence"]:
        """Build a CodeFence from markdown lines that contain a fenced block."""
        if len(lines) < 2:
            return None
        if not lines[0].startswith('```') or not lines[-1].startswith('```'):
            return None
        return cls(opening_fence=lines[0], body_lines=lines[1:-1], closing_fence=lines[-1])

    def to_markdown_lines(self) -> list[str]:
        return [self.opening_fence, *self.body_lines, self.closing_fence]


@dataclass
class MermaidGraph:
    output_directory: str
    scale: str = "10"

    def convert_to_image(self, mermaid_code: str) -> Optional[str]:
        ensure_directory_exists(self.output_directory)
        mermaid_hash = sha256(mermaid_code.encode()).hexdigest()
        image_path = os.path.join(self.output_directory, f"{mermaid_hash}.png")

        if not os.path.exists(image_path):
            try:
                subprocess.run(
                    ["mmdc", "-i", "-", "-o", image_path, "-s", self.scale],
                    input=mermaid_code,
                    text=True,
                    check=True,
                )
            except subprocess.CalledProcessError as e:
                print(f"Error converting mermaid diagram: {e}")
                return None
        return image_path

    @staticmethod
    def extract_code(cell_source: str) -> str:
        return cell_source.replace("~~~mermaid", "").replace("~~~", "").strip()

    def process_cells(self, notebook) -> None:
        for cell in notebook.cells:
            if cell.cell_type == "markdown" and cell.source.startswith("~~~mermaid"):
                mermaid_code = self.extract_code(cell.source)
                image_path = self.convert_to_image(mermaid_code)
                if image_path:
                    cell.source = f"![Mermaid Diagram](../../../../{image_path})"
 
########################################
### Section for Helper Functions     ###
########################################

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


def fix_js_code_blocks(markdown):
    # This regex finds ```python blocks starting with %%js and replaces with ```javascript
    # but keeps the %%js line for developers to see
    pattern = re.compile(r"```python\n%%js\n", re.MULTILINE)
    markdown = pattern.sub("```javascript\n%%js\n", markdown)
    # Optionally, handle blocks with no newline after %%js
    pattern2 = re.compile(r"```python\r?\n%%js\r?\n", re.MULTILINE)
    markdown = pattern2.sub("```javascript\n%%js\n", markdown)
    return markdown


def classify_custom_cell_type(cell) -> Optional[str]:
    """Classify a notebook cell as code/ui/game custom type, or None."""
    if cell.cell_type == 'code':
        source = cell.get('source', '')
        if source.strip().startswith('%%js') and GameRunner.extract_challenge_and_options(source):
            return 'game_runner'

        language = detect_cell_language(cell)
        if CodeRunner.extract_challenge(source, language):
            return 'code_runner'

        if source.strip().startswith('%%html') and UiRunner.extract_description(source):
            return 'ui_runner'

    if cell.cell_type == 'raw' and UiRunner.extract_description(cell.get('source', '')):
        return 'ui_runner'

    return None


def generate_custom_cell_id(permalink: str, cell_index: int, custom_type: str) -> str:
    """Generate a stable cross-runner custom cell identifier."""
    clean_permalink = permalink.strip('/').replace('/', '-') if permalink else 'unknown-lesson'
    return f"{clean_permalink}-cell{cell_index}-{custom_type}"


def assign_custom_cell_ids(notebook, permalink):
    """Annotate each custom cell with a stable ID and type metadata."""
    for cell_index, cell in enumerate(notebook.cells):
        custom_type = classify_custom_cell_type(cell)
        if not custom_type:
            continue

        cell.setdefault('metadata', {})
        cell['metadata']['custom_cell'] = {
            'id': generate_custom_cell_id(permalink, cell_index, custom_type),
            'type': custom_type,
            'cell_index': cell_index,
        }
    return notebook


########################################
### Section for Orchestrators        ###
########################################


def process_custom_cells(notebook, permalink):
    """Main custom-cell orchestration pipeline for ID assignment and runner extraction."""
    notebook = assign_custom_cell_ids(notebook, permalink)
    notebook = process_code_runner_cells(notebook, permalink)
    notebook = process_ui_runner_cells(notebook, permalink)
    notebook = process_game_runner_cells(notebook, permalink)
    return notebook


def process_code_runner_cells(notebook, permalink):
    """Process notebook cells and add code-runner metadata"""
    runner_index = 0
    processed_cells = []
    
    for cell in notebook.cells:
        if cell.cell_type == 'code':
            runner = CodeRunner.from_cell(cell, permalink, runner_index)

            if runner:
                # Store metadata for later use
                cell['metadata']['code_runner'] = runner.to_metadata()
                runner_index += 1
                
                # Clear outputs for cells with code-runner (outputs are redundant)
                cell['outputs'] = []
                cell['execution_count'] = None
        
        processed_cells.append(cell)
    
    notebook.cells = processed_cells
    return notebook


def process_ui_runner_cells(notebook, permalink):
    """Process notebook cells and add ui-runner metadata"""
    runner_index = 0
    processed_cells = []
    
    for cell in notebook.cells:
        if cell.cell_type == 'raw' or (cell.cell_type == 'code' and cell.source.strip().startswith('%%html')):
            runner = UiRunner.from_cell(cell, permalink, runner_index)

            if runner:
                # Store metadata for later use
                cell['metadata']['ui_runner'] = runner.to_metadata()
                runner_index += 1
        
        processed_cells.append(cell)
    
    notebook.cells = processed_cells
    return notebook


def process_game_runner_cells(notebook, permalink):
    """Process notebook cells and add game-runner metadata"""
    runner_index = 0
    processed_cells = []
    
    for cell in notebook.cells:
        if cell.cell_type == 'code':
            runner = GameRunner.from_cell(cell, permalink, runner_index)

            if runner:
                # Store metadata for later use
                cell['metadata']['game_runner'] = runner.to_metadata()
                runner_index += 1

                # Clear outputs for cells with game-runner (outputs are redundant)
                cell['outputs'] = []
                cell['execution_count'] = None
        
        processed_cells.append(cell)
    
    notebook.cells = processed_cells
    return notebook


def _build_lesson_key(front_matter):
    permalink = front_matter.get('permalink', '')
    return permalink.strip('/').replace('/', '-') if permalink else 'unknown-lesson'


def _extract_ui_runner_cells_and_ids(notebook):
    """Collect UI runner cells and source IDs used for output detection"""
    ui_runner_cells = [c for c in notebook.cells if 'ui_runner' in c.get('metadata', {})]
    ui_runner_ids = []
    for ui_cell in ui_runner_cells:
        source = ui_cell.get('source', '')
        ids = re.findall(r'id="([^"]+)"', source)
        ui_runner_ids.append(ids)
    return ui_runner_cells, ui_runner_ids


def inject_code_runners(markdown, notebook, front_matter=None):
    """Inject code-runner includes after code blocks with metadata
    
    If front_matter contains 'challenge_submit: true', also injects:
    - challenge-submit-button.html after each code-runner
    - lesson-submit-button.html at the end of the document
    """
    if front_matter is None:
        front_matter = {}
    
    challenge_submit_enabled = front_matter.get('challenge_submit', False)
    lesson_key = _build_lesson_key(front_matter)

    ui_runner_cells, ui_runner_ids = _extract_ui_runner_cells_and_ids(notebook)
    code_cells = [cell for cell in notebook.cells if cell.cell_type == 'code']
    
    lines = markdown.split('\n')
    result = []
    in_code_block = False
    code_block_content = []
    code_cell_count = 0
    code_runner_count = 0
    ui_runner_count = 0
    in_ui_runner_output = False
    ui_runner_depth = 0
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Check if we're starting a UI_RUNNER output section
        if not in_ui_runner_output and ui_runner_count < len(ui_runner_cells):
            # Look for HTML that matches UI runner IDs
            if '<div' in line or '<script>' in line:
                # Check if this line contains any of the expected IDs for the next UI runner
                if ui_runner_count < len(ui_runner_ids):
                    expected_ids = ui_runner_ids[ui_runner_count]
                    if any(f'id="{id_name}"' in line for id_name in expected_ids):
                        in_ui_runner_output = True
                        ui_runner_depth = 0
                        
                        # Inject the processed UI runner
                        ui_cell = ui_runner_cells[ui_runner_count]
                        ui_runner = UiRunner.from_metadata(ui_cell['metadata']['ui_runner'])
                        result.extend(ui_runner.rendered_markup_lines())
                        
                        ui_runner_count += 1
        
        # If we're in UI runner output, track depth and skip until we're done
        if in_ui_runner_output:
            if '<div' in line or '<script>' in line:
                ui_runner_depth += 1
            if '</div>' in line or '</script>' in line:
                ui_runner_depth -= 1
                if ui_runner_depth <= 0:
                    in_ui_runner_output = False
            i += 1
            continue
        
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
                code_cell = code_cells[code_cell_count] if code_cell_count < len(code_cells) else None
                
                code_cell_count += 1
                
                # Add code-runner if metadata exists
                if code_cell and 'code_runner' in code_cell.get('metadata', {}):
                    code_runner = CodeRunner.from_metadata(code_cell['metadata']['code_runner'])
                    code_fence = CodeFence.from_markdown_lines(code_block_content)
                    code_fence_lines = code_fence.to_markdown_lines() if code_fence else code_block_content
                    result.extend(code_runner.liquid_lines(code_fence_lines, code_runner_count))
                    code_runner_count += 1
                # Add game-runner if metadata exists
                elif code_cell and 'game_runner' in code_cell.get('metadata', {}):
                    game_runner = GameRunner.from_metadata(code_cell['metadata']['game_runner'])
                    result.extend(game_runner.liquid_lines(code_runner_count))
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

        # Process custom cells (ID assignment + CODE/UI/GAME runner extraction)
        notebook = process_custom_cells(notebook, permalink)
        
        mermaid_graph = MermaidGraph(mermaid_output_directory)
        mermaid_graph.process_cells(notebook)
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
