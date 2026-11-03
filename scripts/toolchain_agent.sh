#!/usr/bin/env bash
# toolchain_agent.sh
# ------------------
# Starts the Toolchain Trail agent (toolchain_agent.py). It first checks for
# Python. If Python is missing, it prints the install command for this computer
# and stops, so a brand-new student never sees a confusing "command not found".
#
# Run it from inside your cloned pages repository (macOS, Linux, Kasm, WSL):
#   bash scripts/toolchain_agent.sh
# Any options are passed through to the agent, for example:
#   bash scripts/toolchain_agent.sh --server http://localhost:8585
#   bash scripts/toolchain_agent.sh --stop

# The oldest Python the agent runs on (it uses subprocess capture_output, added in 3.7).
MIN_PYTHON_MAJOR=3
MIN_PYTHON_MINOR=7

AGENT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/toolchain_agent.py"

# True when python3 runs and is new enough. On macOS without the developer
# tools, python3 is only a stub that fails, so it counts as missing.
python_is_ready() {
  python3 -c "import sys; sys.exit(sys.version_info < ($MIN_PYTHON_MAJOR, $MIN_PYTHON_MINOR))" >/dev/null 2>&1
}

if python_is_ready; then
  exec python3 "$AGENT" "$@"
fi

echo "The Toolchain Trail agent needs Python $MIN_PYTHON_MAJOR.$MIN_PYTHON_MINOR or newer, and this computer does not have it yet."
echo "Install it, then run this command again:"
if [ "$(uname -s)" = "Darwin" ]; then
  echo "    xcode-select --install"
  echo "Click Install in the window that opens, and wait for it to finish."
else
  echo "    sudo apt update && sudo apt install -y python3"
fi
exit 1
