#!/usr/bin/env python3
import argparse
import subprocess
import sys
import time
from pathlib import Path

from analyzer import analyze_log

REPO_ROOT = Path(__file__).resolve().parent.parent
LOG_FILE = Path("/tmp/jekyll4500.log")
DEFAULT_CMD = "make"


def run_command(command: str) -> int:
    print(f"Running: {command}")
    result = subprocess.run(command, shell=True, cwd=REPO_ROOT)
    if result.returncode == 0:
        print("Command completed.")
    else:
        print(f"Command failed with exit code {result.returncode}.")
    return result.returncode


def wait_for_log(timeout: int = 30) -> bool:
    start = time.time()
    while time.time() - start < timeout:
        if LOG_FILE.exists() and LOG_FILE.stat().st_size > 0:
            return True
        time.sleep(0.5)
    return False


def load_log() -> str:
    if not LOG_FILE.exists():
        raise FileNotFoundError(f"Log file not found: {LOG_FILE}")
    return LOG_FILE.read_text(errors="replace")


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Run make, read /tmp/jekyll4500.log, and analyze it with AI."
    )
    parser.add_argument(
        "--cmd",
        default=DEFAULT_CMD,
        help="Command to run before analyzing the log. Defaults to 'make'.",
    )
    parser.add_argument(
        "--log",
        default=str(LOG_FILE),
        help="Log file to analyze. Defaults to /tmp/jekyll4500.log.",
    )
    args = parser.parse_args()

    return_code = run_command(args.cmd)

    if not wait_for_log(30):
        print(f"Warning: {args.log} was not created or is empty after running the command.")

    try:
        log = load_log()
    except Exception as exc:
        print(f"Unable to read log: {exc}")
        return 1

    print("\nAnalyzing log with AI...\n")
    try:
        result = analyze_log(log)
        print(result)
    except Exception as exc:
        print(f"AI analysis failed: {exc}")
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
