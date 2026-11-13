"""
mac_setup_agent
---------------
Rule-based diagnosis for the macOS Toolchain Trail terminal setup helper.

Called from scripts/mac_setup_agent.zsh's precmd hook whenever a setup-relevant
command (brew, xcode-select, java, git, python3, pip3, code, ...) fails. Reads
that command's captured output on stdin, matches it against a small authored
table of known setup errors, and prints a one-line diagnosis + fix.

Remediation wording is kept consistent with scripts/verifyTools.sh so a
student sees the same guidance whether it comes from the batch verifier or
this live terminal helper.

It also has an on-demand --check mode, triggered from the website's
"Check my Mac setup" button in Toolchain Trail: it runs read-only setup checks
(scripts/mac_setup_checks.py) and prints a report the student pastes back.

Usage:
    python3 scripts/mac_setup_agent.py --command "java -version" --exit-code 127 <<< "$output"
    python3 scripts/mac_setup_agent.py --check
"""

import argparse
import platform
import re
import sys
from pathlib import Path
from typing import Optional

from mac_setup_checks import format_report, run_checks

PROJECT_ROOT = Path(__file__).resolve().parent.parent

RULES = [
    {
        # Setup scripts are committed without the execute bit, so ./scripts/x.sh fails.
        "match": r"permission denied: \S*scripts/\S+\.sh",
        "diagnosis": "That script isn't marked as executable.",
        "fix": "Run it with bash instead, e.g. bash scripts/activate_macos.sh",
    },
    {
        # activate_macos.sh adds Homebrew Ruby to ~/.zshrc but not to the running script's PATH.
        "match": r"don't have write permissions for the /Library/Ruby/Gems",
        "diagnosis": "gem is still using macOS's built-in Ruby, which you can't install into.",
        "fix": "Run: source ~/.zshrc (so Homebrew Ruby is used), then run bash scripts/activate_macos.sh again.",
    },
    {
        "match": r"xcrun: error: invalid active developer path",
        "diagnosis": "Xcode Command Line Tools aren't installed.",
        "fix": "Run: xcode-select --install",
    },
    {
        "match": r"command not found: brew|\bbrew: command not found|Homebrew isn't installed",
        "diagnosis": "Homebrew isn't installed (or not on PATH).",
        "fix": "Install it from https://brew.sh, then restart your terminal.",
    },
    {
        "match": r"Permission denied @.*(?:/usr/local|/opt/homebrew)",
        "diagnosis": "Homebrew hit a permissions error under its install directory.",
        "fix": "Run: sudo chown -R $(whoami) $(brew --prefix)/*",
    },
    {
        "match": r"command not found: java|\bjava: command not found|Unable to locate a Java Runtime|No Java runtime present",
        "diagnosis": "Java isn't installed (or not on PATH).",
        "fix": "Run: brew install openjdk",
    },
    {
        "match": r"error: class \S+ is public, should be declared in a file named",
        "diagnosis": "The .java filename doesn't match its public class name.",
        "fix": "Rename the file to match the class exactly (e.g. class Hello -> Hello.java).",
    },
    {
        "match": r"Error: Could not find or load main class",
        "diagnosis": "javac compiled fine, but `java` can't find the class to run.",
        "fix": "Run java from the same directory as the .class file, using the class name (no .class extension).",
    },
    {
        "match": r"git: command not found|command not found: git",
        "diagnosis": "git isn't installed (or not on PATH).",
        "fix": "Install git for your platform: https://git-scm.com/downloads",
    },
    {
        "match": r"Please tell me who you are",
        "diagnosis": "git doesn't know your name/email yet.",
        "fix": 'Run: git config --global user.name "Your Name" && git config --global user.email "you@example.com"',
    },
    {
        "match": r"command not found: python3?\b|\bpython3?: command not found",
        "diagnosis": "Python isn't installed (or not on PATH).",
        "fix": "Run: brew install python",
    },
    {
        "match": r"command not found: pip3?\b|\bpip3?: command not found",
        "diagnosis": "pip isn't installed (or not on PATH).",
        "fix": "Run: python3 -m ensurepip --upgrade",
    },
    {
        "match": r"command not found: code\b|\bcode: command not found",
        "diagnosis": "VS Code's `code` command isn't on PATH.",
        "fix": "In VS Code: Cmd+Shift+P -> Shell Command: Install 'code' command in PATH",
    },
]

_COMPILED_RULES = [(re.compile(r["match"], re.IGNORECASE), r) for r in RULES]


def diagnose(command: str, exit_code: int, output: str) -> Optional[str]:
    """Match captured command output against the known-error rule table.

    Returns a formatted "diagnosis -> fix" string, or None if nothing matched
    (the caller should show a generic fallback rather than claim confidence
    this function doesn't have).
    """
    for pattern, rule in _COMPILED_RULES:
        if pattern.search(output) or pattern.search(command):
            return f'{rule["diagnosis"]} -> {rule["fix"]}'
    return None


def run_setup_check(project: Path) -> int:
    """--check mode. Exit codes match linux_setup_agent.py: 0 all passed, 1 issues, 2 unsupported host."""
    if platform.system() != "Darwin":
        print("mac_setup_agent --check only runs on macOS. On Linux/WSL use: python3 scripts/linux_setup_agent.py")
        return 2
    results = run_checks(project)
    print("Copy everything from the first === line to the last === line into the website.\n")
    print(format_report(results))
    return 0 if all(result.passed for result in results) else 1


def main():
    parser = argparse.ArgumentParser(description="Diagnose a failed macOS setup command, or check the whole setup.")
    parser.add_argument("--check", action="store_true", help="Run read-only Mac setup checks and print a report for the website")
    parser.add_argument("--project", type=Path, default=PROJECT_ROOT, help="Pages checkout to check (default: the one containing this script)")
    parser.add_argument("--command", help="The command that was run")
    parser.add_argument("--exit-code", type=int, help="Its exit code")
    args = parser.parse_args()

    if args.check:
        sys.exit(run_setup_check(args.project))
    if args.command is None or args.exit_code is None:
        parser.error("--command and --exit-code are required unless --check is used")

    output = sys.stdin.read()
    result = diagnose(args.command, args.exit_code, output)

    if result:
        print(f"\U0001f4a1 {result}")
    else:
        print(f"⚠️  '{args.command}' failed (exit {args.exit_code}) - couldn't auto-diagnose this one.")


if __name__ == "__main__":
    main()
