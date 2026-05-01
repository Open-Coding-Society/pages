#!/usr/bin/env python3
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SCRIPT = ROOT / "ai-make-debugger" / "debug_make.py"
VENV_PYTHON = ROOT / "venv" / "bin" / "python3"

if not SCRIPT.exists():
    print(f"Error: missing {SCRIPT}")
    sys.exit(1)

python_exec = str(VENV_PYTHON) if VENV_PYTHON.exists() else sys.executable
args = [python_exec, str(SCRIPT)] + sys.argv[1:]
result = subprocess.run(args)
sys.exit(result.returncode)
