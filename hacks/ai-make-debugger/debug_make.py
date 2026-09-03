#!/usr/bin/env python3
import argparse
import shlex
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DEFAULT_LOG_FILE = ROOT / "logs" / "build.log"


def run_command(command: str, cwd: Path, log_path: Path) -> Path:
    log_path.parent.mkdir(parents=True, exist_ok=True)
    print(f"Running: {command}")
    with open(log_path, "w") as f:
        process = subprocess.Popen(
            shlex.split(command),
            stdout=f,
            stderr=subprocess.STDOUT,
            text=True,
            cwd=cwd,
        )
        process.communicate()

    if process.returncode == 0:
        print(f"Command completed successfully: {command}")
    else:
        print(f"Command failed with exit code {process.returncode}: {command}")

    return log_path


def analyze_log_file(log_path: Path) -> str:
    sys.path.insert(0, str(ROOT))
    from backend.analyzer import analyze_log

    with open(log_path, "r") as f:
        log = f.read()

    return analyze_log(log)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Analyze a build log with the AI debugger."
    )
    parser.add_argument(
        "--cmd",
        help="Command to run and capture output from (e.g. 'make build' or 'npm test').",
    )
    parser.add_argument(
        "--log",
        help="Path to an existing log file to analyze.",
        default=str(DEFAULT_LOG_FILE),
    )
    parser.add_argument(
        "--cwd",
        help="Working directory for the command. Defaults to the current directory.",
        default=".",
    )

    args = parser.parse_args()
    log_path = Path(args.log)

    if args.cmd:
        run_command(args.cmd, cwd=Path(args.cwd).resolve(), log_path=log_path)
    elif not log_path.exists():
        print(
            "No log file found. Use --cmd to run a command or --log to specify a log file."
        )
        return 1

    print("\nSending log to AI analyzer...\n")
    try:
        result = analyze_log_file(log_path)
    except Exception as exc:
        print(f"Error analyzing log: {exc}")
        return 1

    print("=== AI DEBUG RESULT ===")
    print(result)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
