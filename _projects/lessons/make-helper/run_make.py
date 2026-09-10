#!/usr/bin/env python3
"""A small helper wrapper for running make with friendly logging."""

from __future__ import annotations

import argparse
import datetime
import os
import pathlib
import re
import subprocess
import sys
from typing import Iterable

WORKSPACE_ROOT = pathlib.Path(__file__).resolve().parents[1].parent
LOG_DIR = WORKSPACE_ROOT / "logs"


def format_excerpt(text: str, max_lines: int = 6) -> str:
    lines = [line.rstrip() for line in text.splitlines() if line.strip()]
    return "\n".join(lines[:max_lines])


def detect_problem(stdout: str, stderr: str) -> tuple[str, str] | None:
    text = "\n".join([stderr.strip(), stdout.strip()]).strip()
    if not text:
        return None

    def find(pattern: str, flags=0):
        return re.search(pattern, text, flags)

    if "command not found" in text.lower():
        m = find(r"([\w\-\+\.]+): command not found", re.I)
        missing = m.group(1) if m else "required command"
        if missing in {"gcc", "g++", "cc", "c++"}:
            return ("gcc is not installed", "Install build-essential: sudo apt install build-essential")
        if missing in {"make"}:
            return ("make is not installed", "Install make with your package manager, e.g. sudo apt install make")
        if missing in {"python3"}:
            return ("python3 is not installed", "Install Python 3: sudo apt install python3")
        return (f"{missing} is not installed", f"Install {missing} or adjust your PATH environment variable")

    if "no rule to make target" in text.lower():
        return (
            "A Makefile target is missing or invalid",
            "Verify the target name and run make from the repository root",
        )

    if "cannot find -l" in text.lower():
        m = find(r"cannot find -l([\w\-]+)", re.I)
        libname = m.group(1) if m else "library"
        return (
            f"Linker cannot find library '{libname}'",
            f"Install the missing library or update linker settings",
        )

    m = find(r"No module named ['\"]([^'\"]+)['\"]", re.I)
    if m:
        module_name = m.group(1)
        friendly = module_name
        fix = f"Install the missing Python package: python3 -m pip install {module_name}"
        if module_name.lower() in {"yaml", "pyyaml"}:
            friendly = "PyYAML is not installed"
            fix = "Install PyYAML: python3 -m pip install pyyaml"
        return (
            f"Python module '{friendly}' is missing",
            fix,
        )

    if "permission denied" in text.lower():
        return (
            "Permission denied while running make",
            "Check your file permissions and whether you need sudo for this command",
        )

    if "gcc:" in text.lower() and "error" in text.lower():
        return (
            "gcc compilation failed",
            "Inspect the compiler output in the log and fix the first error reported",
        )

    if "recipe for target" in text.lower() and "failed" in text.lower():
        return (
            "A build step failed",
            "Review the failing command in the log file and correct the underlying issue",
        )

    return None


def save_log(command: list[str], returncode: int, stdout: str, stderr: str) -> pathlib.Path:
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    log_file = LOG_DIR / f"make_{timestamp}.txt"
    content = [
        f"COMMAND: {' '.join(command)}",
        f"EXIT CODE: {returncode}",
        "",
        "STDOUT:",
        stdout.rstrip(),
        "",
        "STDERR:",
        stderr.rstrip(),
    ]
    log_file.write_text("\n".join(content) + "\n", encoding="utf-8")
    return log_file


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Run make, capture output, and save a friendly build log.",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument(
        "make_args",
        nargs=argparse.REMAINDER,
        help="Arguments forwarded to make. Use -- before make options if needed.",
    )
    args = parser.parse_args()

    command = ["make"] + args.make_args

    try:
        completed = subprocess.run(
            command,
            cwd=WORKSPACE_ROOT,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=False,
        )
    except FileNotFoundError as exc:
        print("❌ make failed")
        print(f"Problem: {exc.filename} is not installed or not found in PATH")
        print("Fix: Install the missing tool or update your PATH environment variable")
        return 1

    log_file = save_log(command, completed.returncode, completed.stdout, completed.stderr)

    if completed.returncode == 0:
        print("✅ make succeeded")
        print(f"Log saved: {log_file}")
        return 0

    print("❌ make failed")
    problem = detect_problem(completed.stdout, completed.stderr)
    if problem:
        print(f"Problem: {problem[0]}")
        print(f"Fix: {problem[1]}")
    else:
        excerpt = format_excerpt(completed.stderr or completed.stdout)
        print("Problem: Unexpected build error")
        print("Fix: Review the log for details and correct the underlying issue")
        if excerpt:
            print("\nError excerpt:")
            print(excerpt)

    print(f"Log file: {log_file}")
    return completed.returncode or 1


if __name__ == "__main__":
    raise SystemExit(main())
