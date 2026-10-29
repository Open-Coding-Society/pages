#!/bin/bash

## TESTING ONLY: undoes the Windows (WSL Ubuntu) tool setup from the Toolchain
## Trail game so the setup steps can be tried again from scratch.
##
## Run inside WSL Ubuntu from the blueprints_pages folder:
##   bash scripts/reset_windows_toolchain.sh            # lists what it will remove, then asks
##   bash scripts/reset_windows_toolchain.sh --dry-run  # only lists, changes nothing
##   bash scripts/reset_windows_toolchain.sh --yes      # skips the confirmation
##
## Removes what the trail's Windows steps add: the apt packages and /opt/gems
## from activate_ubuntu.sh, its ~/.bashrc lines, the global git name/email and
## credential helper, the cloned ~/opencs/portfolio (with its venv and .bundle),
## ~/toolchain-trail, and setup-report.md. python3 and git stay installed because
## Ubuntu itself depends on them. Windows-side apps (VS Code, Git Credential
## Manager) cannot be removed from WSL, so the steps for those are printed.

set -euo pipefail

PROJECT_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
BASHRC="$HOME/.bashrc"
GEM_HOME_DIR="/opt/gems"
PORTFOLIO_DIR="$HOME/opencs/portfolio"
TRAIL_DIR="$HOME/toolchain-trail"
SETUP_REPORT="$PROJECT_ROOT/setup-report.md"
# Packages installed by activate_ubuntu.sh, minus python3 (Ubuntu needs it).
APT_PACKAGES=(python3-pip python-is-python3 python3-venv ruby-full build-essential
    zlib1g-dev jupyter-notebook sqlite3 lsof)
# Exact lines activate_ubuntu.sh appends to ~/.bashrc.
BASHRC_LINES=('alias code="code --no-sandbox"'
    'export GEM_HOME="/opt/gems"'
    'export PATH="/opt/gems/bin:$PATH"')

DRY_RUN=false
ASSUME_YES=false

usage() {
    sed -n 's/^## \{0,1\}//p' "$0"
}

for arg in "$@"; do
    case "$arg" in
        --dry-run) DRY_RUN=true ;;
        --yes) ASSUME_YES=true ;;
        -h|--help) usage; exit 0 ;;
        *) echo "Unknown option: $arg" >&2; usage >&2; exit 2 ;;
    esac
done

if ! grep -qi microsoft /proc/version 2>/dev/null; then
    echo "This reset is for Windows WSL Ubuntu only. Open Ubuntu from Windows Terminal and run it there." >&2
    exit 2
fi

# Never delete the checkout this script is running from.
case "$PROJECT_ROOT/" in
    "$PORTFOLIO_DIR"/*|"$TRAIL_DIR"/*)
        echo "This script is running from inside $PROJECT_ROOT, which it would delete. Run it from another blueprints_pages checkout." >&2
        exit 2
        ;;
esac

log() {
    echo "=== $1 ==="
}

installed_packages() {
    local package
    for package in "${APT_PACKAGES[@]}"; do
        if dpkg-query -W -f='${Status}' "$package" 2>/dev/null | grep -q 'install ok installed'; then
            echo "$package"
        fi
    done
}

list_planned_changes() {
    local packages
    packages="$(installed_packages | tr '\n' ' ')"
    echo "This will remove (testing only):"
    echo "  apt packages:     ${packages:-none installed}"
    [ -d "$GEM_HOME_DIR" ] && echo "  gems folder:      $GEM_HOME_DIR"
    [ -d "$PORTFOLIO_DIR" ] && echo "  cloned repo:      $PORTFOLIO_DIR (any unpushed work there is lost)"
    [ -d "$TRAIL_DIR" ] && echo "  trail folder:     $TRAIL_DIR"
    [ -f "$SETUP_REPORT" ] && echo "  setup report:     $SETUP_REPORT"
    echo "  ~/.bashrc:        Toolchain Trail lines (backup saved first)"
    echo "  git --global:     user.name, user.email, credential.helper"
}

reset_bashrc() {
    [ -f "$BASHRC" ] || return 0
    local backup="$BASHRC.before-toolchain-reset.$(date +%Y%m%d%H%M%S)"
    cp "$BASHRC" "$backup"
    local filtered
    filtered="$(mktemp)"
    # Drop the exact added lines plus the 7-line virtualenv prompt block.
    # Lines go through the environment because awk -v rejects embedded newlines.
    TOOLCHAIN_LINES="$(printf '%s\n' "${BASHRC_LINES[@]}")" awk '
        BEGIN { count = split(ENVIRON["TOOLCHAIN_LINES"], list, "\n"); for (i = 1; i <= count; i++) if (list[i] != "") drop[list[i]] = 1 }
        skip > 0 { skip--; next }
        $0 == "# Show Python virtualenv in prompt" { skip = 6; next }
        !($0 in drop)
    ' "$BASHRC" > "$filtered"
    cat "$filtered" > "$BASHRC"
    rm -f "$filtered"
    echo "Saved the old ~/.bashrc as $backup"
}

reset_git_config() {
    local key
    for key in user.name user.email credential.helper; do
        git config --global --unset-all "$key" 2>/dev/null || true
    done
}

remove_packages() {
    local packages
    mapfile -t packages < <(installed_packages)
    if [ "${#packages[@]}" -gt 0 ]; then
        sudo apt-get purge -y "${packages[@]}"
        sudo apt-get autoremove -y
    fi
}

print_windows_steps() {
    cat <<'EOF'

Finish the reset on the Windows side (WSL cannot change Windows apps):
  1. Settings > Apps > Installed apps: uninstall "Microsoft Visual Studio Code"
     and "Git" (this removes Git Credential Manager).
  2. Delete the WSL VS Code server so it reinstalls: rm -rf ~/.vscode-server
  3. In the browser running the game, clear the site's localStorage key
     ocs-toolchain-agent-session so the agent pairs again.
  4. Close this terminal and open a new Ubuntu terminal before starting the trail.
To also redo "wsl --install", run in PowerShell: wsl --unregister Ubuntu-24.04
(this deletes the whole Ubuntu install, including this checkout).
EOF
}

list_planned_changes
if [ "$DRY_RUN" = true ]; then
    echo "Dry run: nothing was changed."
    exit 0
fi
if [ "$ASSUME_YES" != true ]; then
    read -r -p "Type RESET to continue: " answer
    if [ "$answer" != "RESET" ]; then
        echo "Cancelled; nothing was changed."
        exit 1
    fi
fi

log "Removing apt packages"
remove_packages
log "Removing $GEM_HOME_DIR"
sudo rm -rf "$GEM_HOME_DIR"
log "Removing trail folders and setup report"
rm -rf "$PORTFOLIO_DIR" "$TRAIL_DIR"
rmdir "$HOME/opencs" 2>/dev/null || true
rm -f "$SETUP_REPORT"
log "Cleaning ~/.bashrc"
reset_bashrc
log "Clearing global git identity and credential helper"
reset_git_config

echo "WSL reset complete."
print_windows_steps
