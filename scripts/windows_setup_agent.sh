#!/bin/bash
#
# windows_setup_agent.sh
# ----------------------
# Windows entry point for the Toolchain Trail setup check. It runs inside the
# WSL Ubuntu terminal and uses the same checks as linux_setup_agent.sh; the
# report is labeled WINDOWS so the game's Windows panel accepts it.
#
#   bash scripts/windows_setup_agent.sh --check
#   bash scripts/windows_setup_agent.sh --check --report <upload-url>

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -z "${WSL_DISTRO_NAME:-}" ] && [ -z "${WSL_INTEROP:-}" ] && ! grep -qi microsoft /proc/version 2>/dev/null; then
    echo "Windows setup agent must run inside a WSL Ubuntu terminal. Open Ubuntu from Windows Terminal, cd ~/opencs/pages, and run this command again."
    exit 2
fi

exec bash "$SCRIPT_DIR/linux_setup_agent.sh" "$@"