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

Usage:
    python3 scripts/mac_setup_agent.py --command "java -version" --exit-code 127 <<< "$output"
"""

import argparse
import re
import sys
from typing import Optional

RULES = [
    {
        "match": r"xcrun: error: invalid active developer path",
        "diagnosis": "Xcode Command Line Tools aren't installed.",
        "fix": "Run: xcode-select --install",
    },
    {
        "match": r"command not found: brew",
        "diagnosis": "Homebrew isn't installed (or not on PATH).",
        "fix": "Install it from https://brew.sh, then restart your terminal.",
    },
    {
        "match": r"Permission denied @.*(?:/usr/local|/opt/homebrew)",
        "diagnosis": "Homebrew hit a permissions error under its install directory.",
        "fix": "Run: sudo chown -R $(whoami) $(brew --prefix)/*",
    },
    {
        "match": r"command not found: java|Unable to locate a Java Runtime|No Java runtime present",
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
        "match": r"command not found: python3?\b",
        "diagnosis": "Python isn't installed (or not on PATH).",
        "fix": "Run: brew install python",
    },
    {
        "match": r"command not found: pip3?\b",
        "diagnosis": "pip isn't installed (or not on PATH).",
        "fix": "Run: python3 -m ensurepip --upgrade",
    },
    {
        "match": r"command not found: code\b",
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


def main():
    parser = argparse.ArgumentParser(description="Diagnose a failed macOS setup command.")
    parser.add_argument("--command", required=True, help="The command that was run")
    parser.add_argument("--exit-code", required=True, type=int, help="Its exit code")
    args = parser.parse_args()

    output = sys.stdin.read()
    result = diagnose(args.command, args.exit_code, output)

    if result:
        print(f"\U0001f4a1 {result}")
    else:
        print(f"⚠️  '{args.command}' failed (exit {args.exit_code}) - couldn't auto-diagnose this one.")


if __name__ == "__main__":
    main()
