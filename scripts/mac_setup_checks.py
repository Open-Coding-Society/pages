"""
mac_setup_checks
----------------
Read-only macOS setup checks behind `mac_setup_agent.py --check`.

Each check runs one harmless version/config command (never installs or edits
anything) and records pass/fail plus a fix hint worded like the agent's
diagnosis rules. The report is printed between fixed markers so the website's
"Check my Mac setup" panel can find it inside whatever the student pastes
(see _projects/games/cs-pathway/model/macSetupReport.js, which parses it).
"""

import re
import subprocess
from dataclasses import dataclass
from pathlib import Path
from typing import Callable, List, Optional, Tuple

REPORT_START = "=== MAC SETUP CHECK v1 ==="
REPORT_END = "=== END MAC SETUP CHECK ==="
COMMAND_TIMEOUT_SECONDS = 15

# (exit code, combined stdout+stderr)
CommandResult = Tuple[int, str]
CommandRunner = Callable[[List[str]], CommandResult]


@dataclass(frozen=True)
class CheckResult:
    check_id: str
    label: str
    passed: bool
    fix: str


@dataclass(frozen=True)
class CommandCheck:
    check_id: str
    label: str
    command: List[str]
    passes: Callable[[int, str], bool]
    fix: str


def run_command(command: List[str]) -> CommandResult:
    """Run one check command; a missing tool or a hang is a failed check, not a crash."""
    try:
        completed = subprocess.run(
            command,
            capture_output=True,
            text=True,
            timeout=COMMAND_TIMEOUT_SECONDS,
        )
    except FileNotFoundError:
        return 127, f"command not found: {command[0]}"
    except subprocess.TimeoutExpired:
        return 124, f"timed out after {COMMAND_TIMEOUT_SECONDS}s"
    return completed.returncode, (completed.stdout or "") + (completed.stderr or "")


def _shows_version(pattern: str) -> Callable[[int, str], bool]:
    regex = re.compile(pattern, re.IGNORECASE | re.MULTILINE)
    return lambda code, output: code == 0 and bool(regex.search(output))


def _succeeds_with_output(code: int, output: str) -> bool:
    return code == 0 and bool(output.strip())


def _succeeds(code: int, _output: str) -> bool:
    return code == 0


COMMAND_CHECKS = [
    CommandCheck("xcode-clt", "Xcode Command Line Tools", ["xcode-select", "-p"],
                 _succeeds_with_output, "Run: xcode-select --install"),
    CommandCheck("homebrew", "Homebrew", ["brew", "--version"],
                 _shows_version(r"^Homebrew \d"), "Install it from https://brew.sh, then restart your terminal."),
    CommandCheck("git", "Git", ["git", "--version"],
                 _shows_version(r"git version \d"), "Run: brew install git"),
    CommandCheck("git-name", "Git user.name set", ["git", "config", "--global", "user.name"],
                 _succeeds_with_output, 'Run: git config --global user.name "Your Name"'),
    CommandCheck("git-email", "Git user.email set", ["git", "config", "--global", "user.email"],
                 _succeeds_with_output, 'Run: git config --global user.email "you@example.com"'),
    CommandCheck("python3", "Python 3", ["python3", "--version"],
                 _shows_version(r"Python 3\.\d+"), "Run: brew install python"),
    CommandCheck("pip", "pip", ["python3", "-m", "pip", "--version"],
                 _shows_version(r"^pip \d"), "Run: python3 -m ensurepip --upgrade"),
    CommandCheck("venv-module", "Python venv module", ["python3", "-c", "import venv"],
                 _succeeds, "Run: brew install python (Homebrew Python includes venv)"),
    CommandCheck("ruby", "Ruby", ["ruby", "-v"],
                 _shows_version(r"^ruby \d"), "Run: brew install ruby"),
    CommandCheck("bundler", "Bundler", ["bundle", "-v"],
                 # Bundler 2 prints "Bundler version 2.x"; Bundler 4+ prints only the number.
                 _shows_version(r"^(?:Bundler version )?\d+\.\d+"), "Run: gem install bundler"),
    CommandCheck("java", "Java", ["java", "-version"],
                 _shows_version(r'version "?\d'), "Run: brew install openjdk"),
    CommandCheck("vscode", "VS Code code command", ["code", "--version"],
                 _shows_version(r"^\d+\.\d+"),
                 "In VS Code: Cmd+Shift+P, then run Shell Command: Install 'code' command in PATH"),
]


def _project_checks(project: Path) -> List[CheckResult]:
    """Checks on the pages checkout this script lives in (no commands run)."""
    is_repo = (project / ".git").is_dir() and (project / "_config.yml").is_file()
    has_venv = (project / "venv" / "bin" / "python3").exists()
    return [
        CheckResult("pages-repo", "Pages repository cloned", is_repo,
                    "Clone your pages repository and run this command from inside it."),
        CheckResult("project-venv", "Project venv created", has_venv,
                    "From the project folder run: ./scripts/venv.sh"),
    ]


def run_checks(project: Path, runner: Optional[CommandRunner] = None) -> List[CheckResult]:
    runner = runner or run_command
    results = []
    for check in COMMAND_CHECKS:
        code, output = runner(check.command)
        results.append(CheckResult(check.check_id, check.label, check.passes(code, output), check.fix))
    return results + _project_checks(project)


def format_report(results: List[CheckResult]) -> str:
    """One line per check between markers; '|' separates fields, so fixes never contain it."""
    lines = [REPORT_START]
    for result in results:
        if result.passed:
            lines.append(f"PASS {result.check_id} | {result.label}")
        else:
            lines.append(f"FAIL {result.check_id} | {result.label} | {result.fix}")
    passed = sum(1 for result in results if result.passed)
    lines.append(f"SUMMARY {passed}/{len(results)} passed")
    lines.append(REPORT_END)
    return "\n".join(lines)
