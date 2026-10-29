#!/usr/bin/env bash
# Run with bash; activate separately in your current terminal.
set -euo pipefail
project_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$project_root"
if ! command -v python3 >/dev/null 2>&1; then
    echo "Python 3 is missing. Install Python 3 for your operating system first." >&2
    exit 1
fi
if [ ! -e venv ]; then
    python3 -m venv venv || {
        echo "Could not create venv. On Debian/Ubuntu/Mint/Kali, check that python3-venv is installed." >&2
        exit 1
    }
fi
if [ ! -f venv/bin/activate ] || ! venv/bin/python -c 'import sys; assert sys.prefix != sys.base_prefix'; then
    echo "Existing venv is incomplete or unusable. Rename it and rerun this script." >&2
    exit 1
fi
venv/bin/python -m pip install -r requirements.txt
printf '\nPython setup complete. In your current terminal, from the project folder run:\nsource venv/bin/activate\n'
