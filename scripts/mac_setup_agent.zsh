#!/usr/bin/env zsh
#
# mac_setup_agent.zsh
# --------------------
# Live terminal companion for the Toolchain Trail's macOS "tools setup"
# stations (Terminal Town Gate, Compiler Canyon Forge, and the same tool
# list scripts/verifyTools.sh checks). Watches setup-relevant commands as
# you type them and prints inline help the moment one fails.
#
# Opt-in only - add one line to ~/.zshrc to enable it:
#   source /absolute/path/to/pages/scripts/mac_setup_agent.zsh
#
# Everything here is local-only: no network calls, no browser/game
# integration. It only watches commands starting with one of
# MAC_AGENT_PREFIXES; anything else is ignored with zero overhead.
#
# Toggle without removing the source line:
#   mac_agent_pause    # stop capturing output for this shell session
#   mac_agent_resume   # start again

# Resolve this script's own directory so the Python matcher can be found
# regardless of where the repo is cloned.
MAC_AGENT_DIR="${0:A:h}"
MAC_AGENT_PY="$MAC_AGENT_DIR/mac_setup_agent.py"
MAC_AGENT_LOG="/tmp/toolchain-agent-$$.log"
: > "$MAC_AGENT_LOG"

# Resolve python3's absolute path ONCE, right now, rather than depending on
# live $PATH at precmd time. This matters specifically because a broken
# PATH is exactly the kind of thing a student debugging tools setup can hit
# - if we looked up "python3" bare on every failure, a broken PATH would
# take down the very tool meant to help diagnose it.
MAC_AGENT_PYTHON3="$(command -v python3 2>/dev/null)"
if [[ -z "$MAC_AGENT_PYTHON3" ]]; then
    echo "mac_setup_agent: python3 not found at setup time - error diagnosis disabled for this session (✓ success markers still work)."
fi

MAC_AGENT_PREFIXES=(brew xcode-select java javac python3 pip3 git code softwareupdate gem bundle)

_mac_agent_is_relevant() {
    local cmd="$1"
    local prefix
    for prefix in "${MAC_AGENT_PREFIXES[@]}"; do
        if [[ "$cmd" == "$prefix" || "$cmd" == "$prefix "* ]]; then
            return 0
        fi
    done
    return 1
}

mac_agent_pause() {
    exec >&"$MAC_AGENT_STDOUT_FD" 2>&"$MAC_AGENT_STDERR_FD"
    echo "mac_setup_agent: paused (run 'mac_agent_resume' to re-enable)"
}

mac_agent_resume() {
    exec {MAC_AGENT_STDOUT_FD}>&1 {MAC_AGENT_STDERR_FD}>&2
    exec > >(tee -a "$MAC_AGENT_LOG") 2>&1
    echo "mac_setup_agent: resumed"
}

# Save real fds once so pause/resume can restore them, then start capturing.
exec {MAC_AGENT_STDOUT_FD}>&1 {MAC_AGENT_STDERR_FD}>&2
exec > >(tee -a "$MAC_AGENT_LOG") 2>&1

mac_agent_preexec() {
    MAC_AGENT_LAST_CMD="$1"
    if _mac_agent_is_relevant "$MAC_AGENT_LAST_CMD"; then
        MAC_AGENT_LAST_RELEVANT=1
        : > "$MAC_AGENT_LOG"
    else
        MAC_AGENT_LAST_RELEVANT=0
    fi
}

mac_agent_precmd() {
    local exit_code=$?
    [[ "$MAC_AGENT_LAST_RELEVANT" == 1 ]] || return

    if [[ $exit_code -eq 0 ]]; then
        echo "✓ $MAC_AGENT_LAST_CMD"
    elif [[ -n "$MAC_AGENT_PYTHON3" ]]; then
        "$MAC_AGENT_PYTHON3" "$MAC_AGENT_PY" --command "$MAC_AGENT_LAST_CMD" --exit-code "$exit_code" < "$MAC_AGENT_LOG"
    fi

    MAC_AGENT_LAST_RELEVANT=0
    : > "$MAC_AGENT_LOG"
}

autoload -Uz add-zsh-hook
add-zsh-hook preexec mac_agent_preexec
add-zsh-hook precmd mac_agent_precmd
