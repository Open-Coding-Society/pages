# linux_setup_agent_live.sh
# -------------------------
# Live terminal companion for the Toolchain Trail on Linux, Kasm, and Windows
# (WSL). The Bash counterpart of mac_setup_agent.zsh: it watches setup
# commands as you type them, prints a ✓ when one works, and prints yellow
# help the moment one fails. Unlike the Mac version, the help is written in
# Bash too, so it works even before Python is installed.
#
# Turn it on for this terminal:
#   source scripts/linux_setup_agent_live.sh
# Or for every new terminal, add one line to ~/.bashrc:
#   source ~/opencs/pages/scripts/linux_setup_agent_live.sh
#
# Everything is local only: no network calls, no browser/game integration.
# Only commands starting with one of LINUX_AGENT_PREFIXES are watched.
#
#   linux_agent_pause    # stop watching in this terminal
#   linux_agent_resume   # start again

# Only for interactive Bash; do nothing when sourced anywhere else.
[ -n "${BASH_VERSION:-}" ] || return 0 2>/dev/null || exit 0
case $- in *i*) ;; *) return 0 ;; esac
[ "${LINUX_AGENT_LOADED:-}" = 1 ] && return 0
LINUX_AGENT_LOADED=1

LINUX_AGENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LINUX_AGENT_PROJECT="$(cd "$LINUX_AGENT_DIR/.." && pwd)"
LINUX_AGENT_LOG="/tmp/toolchain-agent-$$.log"
: > "$LINUX_AGENT_LOG"

LINUX_AGENT_DEBIAN=0
if [ -r /etc/os-release ]; then
    case " $(. /etc/os-release; echo "${ID:-} ${ID_LIKE:-}") " in
        *" debian "*|*" ubuntu "*|*" linuxmint "*|*" kali "*) LINUX_AGENT_DEBIAN=1 ;;
    esac
fi

# The setup scripts are watched too, so a failed Toolchain Trail step gets a fix tip.
LINUX_AGENT_PREFIXES=(apt sudo git code python3 python pip pip3 ruby gem bundle java javac make
    "source venv/bin/activate" "./scripts/" "bash scripts/" "cd ")

_linux_agent_is_relevant () {
    local cmd="$1" prefix
    for prefix in "${LINUX_AGENT_PREFIXES[@]}"; do
        case "$prefix" in
            *[/\ ]) [[ "$cmd" == "$prefix"* ]] && return 0 ;;
            *) [[ "$cmd" == "$prefix" || "$cmd" == "$prefix "* ]] && return 0 ;;
        esac
    done
    return 1
}

_linux_agent_say () { printf '\033[33m%s\033[0m\n' "$1"; }

# Prints evidence-matched advice for a failed command's output (read from stdin).
_linux_agent_diagnose () {
    local log lower folder found=0
    log="$(sed -E 's/\x1b\[[0-9;?]*[ -\/]*[@-~]//g')"
    lower="$(printf '%s' "$log" | tr '[:upper:]' '[:lower:]')"
    folder="$LINUX_AGENT_PROJECT"
    _tip () { _linux_agent_say "Change: $1"; found=1; }
    _has () { printf '%s' "$lower" | grep -Eq -- "$1"; }

    _has 'cd:.*(no such file or directory|not a directory)' && \
        _tip "That folder does not exist at the typed path. Go back to your project with: cd ~/opencs/pages, then check with pwd."
    _has 'externally-managed-environment' && \
        _tip "System Python rejected the install. From the project folder: python3 -m venv venv; source venv/bin/activate; python -m pip install -r requirements.txt. Do not use sudo pip or --break-system-packages."
    _has 'ensurepip is not available|no module named venv' && {
        if [ "$LINUX_AGENT_DEBIAN" = 1 ]; then _tip "Python venv support is missing. Run sudo apt update then sudo apt install python3-venv, and retry python3 -m venv venv."
        else _tip "Install venv support for your Python version using your distribution's documentation, then retry python3 -m venv venv."; fi; }
    _has 'activate' && _has 'no such file or directory' && \
        _tip "The venv was not found. Run cd ~/opencs/pages, then ls venv/bin/activate. If venv does not exist, run ./scripts/venv.sh first."
    _has 'no module named pip' && \
        _tip "This Python has no pip. Run source venv/bin/activate, then python -m ensurepip --upgrade and python -m pip --version."
    _has 'permission denied' && \
        _tip "Access was denied. Check ls -ld on the named path and make sure you own the project. Do not use blanket sudo or chmod 777."
    _has 'could not get lock|unable to acquire the dpkg' && \
        _tip "Another package update is running. Wait for it to finish, then retry. Do not delete lock files."
    _has 'temporary failure resolving|could not resolve host' && \
        _tip "The internet name lookup failed. Check your network connection, then retry the same command."

    local name
    name="$(printf '%s\n' "$log" | sed -nE 's/^(.*: )?([A-Za-z0-9._+-]+): command not found.*/\2/p; s/.*command not found: ([A-Za-z0-9._+-]+).*/\1/p' | head -n 1)"
    if [ -n "$name" ]; then
        local fix="Check command -v $name and your PATH." pkg=""
        case "$name" in
            python) fix="Use python3 before activating, or run source venv/bin/activate so python means the project's Python." ;;
            pip|pip3) fix="Run source venv/bin/activate, then use python -m pip instead. If venv is missing, run ./scripts/venv.sh first." ;;
            code) fix="$fix On Ubuntu install VS Code from its official .deb package; in WSL install VS Code on Windows with the WSL extension, then reopen the Ubuntu terminal." ;;
            python3) pkg="python3 python3-venv" ;;
            git) pkg="git" ;;
            ruby|gem) pkg="ruby-full" ;;
            bundle|bundler) pkg="ruby-bundler" ;;
            make|gcc) pkg="build-essential" ;;
            java|javac) pkg="default-jdk" ;;
            curl|wget|unzip) pkg="$name" ;;
        esac
        [ -n "$pkg" ] && [ "$LINUX_AGENT_DEBIAN" = 1 ] && fix="$fix If it is not installed, run sudo apt update && sudo apt install $pkg."
        _tip "$name is not available in this shell. $fix"
    elif _has 'command not found'; then
        _tip "A command is missing. Read its name in the error and run command -v with that name."
    fi

    _has 'could not find gem|bundler::gemnotfound' && \
        _tip "Bundler cannot find a required gem. From the project folder run bundle install, then bundle check."
    _has 'could not locate gemfile|not a git repository' && \
        _tip "This command needs the project folder. Run cd ~/opencs/pages, check with pwd, then retry."
    _has 'dpkg was interrupted' && \
        _tip "A previous package install was interrupted. Run sudo dpkg --configure -a, then retry."
    _has 'unable to locate package' && \
        _tip "APT cannot find that package. Run sudo apt update, then check the package name with apt search."
    _has 'please tell me who you are' && \
        _tip "Git needs your name and email. Run git config --global user.name \"Your Name\" and git config --global user.email \"you@example.com\" with your own details."

    [ "$found" = 1 ] || _linux_agent_say "Unresolved: no known fix matched. Check the error above and the command spelling, then ask for help with the exact command and error."
    unset -f _tip _has
}

# Save the real output once, then copy everything shown into the log too.
exec {LINUX_AGENT_STDOUT_FD}>&1 {LINUX_AGENT_STDERR_FD}>&2
exec > >(tee -a "$LINUX_AGENT_LOG") 2>&1
LINUX_AGENT_ACTIVE=1

linux_agent_pause () {
    exec >&"$LINUX_AGENT_STDOUT_FD" 2>&"$LINUX_AGENT_STDERR_FD"
    LINUX_AGENT_ACTIVE=0
    echo "linux_setup_agent: paused (run 'linux_agent_resume' to turn it back on)"
}

linux_agent_resume () {
    exec > >(tee -a "$LINUX_AGENT_LOG") 2>&1
    LINUX_AGENT_ACTIVE=1
    echo "linux_setup_agent: resumed"
}

# Like zsh's preexec: runs once, just before the first command after a prompt.
_linux_agent_preexec () {
    [ "${LINUX_AGENT_ARMED:-0}" = 1 ] || return 0
    [ -n "${COMP_LINE:-}" ] && return 0
    LINUX_AGENT_ARMED=0
    # Pressing Enter on an empty line runs no command; don't repeat the last result.
    if [ "$BASH_COMMAND" = "_linux_agent_save_status" ]; then
        LINUX_AGENT_LAST_RELEVANT=0
        return 0
    fi
    LINUX_AGENT_LAST_CMD="$(HISTTIMEFORMAT='' builtin history 1 | sed -E 's/^[[:space:]]*[0-9]+[[:space:]]+//')"
    if [ "$LINUX_AGENT_ACTIVE" = 1 ] && _linux_agent_is_relevant "$LINUX_AGENT_LAST_CMD"; then
        LINUX_AGENT_LAST_RELEVANT=1
        : > "$LINUX_AGENT_LOG"
    else
        LINUX_AGENT_LAST_RELEVANT=0
    fi
}

# Like zsh's precmd: runs after the command finishes, before the next prompt.
_linux_agent_save_status () { LINUX_AGENT_STATUS=$?; }
_linux_agent_precmd () {
    if [ "${LINUX_AGENT_LAST_RELEVANT:-0}" = 1 ]; then
        sleep 0.05  # let tee finish writing the command's last lines
        if [ "$LINUX_AGENT_STATUS" -eq 0 ]; then
            echo "✓ $LINUX_AGENT_LAST_CMD"
        else
            _linux_agent_say "Linux setup: command failed (exit $LINUX_AGENT_STATUS)"
            _linux_agent_say "Command: $LINUX_AGENT_LAST_CMD"
            _linux_agent_diagnose < "$LINUX_AGENT_LOG"
        fi
    fi
    LINUX_AGENT_LAST_RELEVANT=0
    : > "$LINUX_AGENT_LOG"
    LINUX_AGENT_ARMED=1
}

trap '_linux_agent_preexec' DEBUG
PROMPT_COMMAND="_linux_agent_save_status${PROMPT_COMMAND:+; $PROMPT_COMMAND}; _linux_agent_precmd"
LINUX_AGENT_ARMED=1
echo "linux_setup_agent: live setup help is on. Failed setup commands will show yellow tips."