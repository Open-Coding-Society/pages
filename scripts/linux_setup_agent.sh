#!/bin/bash
#
# linux_setup_agent.sh
# --------------------
# Toolchain Trail setup check for Linux, Kasm, and Windows (WSL). Written in
# Bash like the Mac agent, so it runs before Python is even installed.
#
#   bash scripts/linux_setup_agent.sh --check
#       Print the setup report (PASS/FAIL per tool) to paste into the game.
#   bash scripts/linux_setup_agent.sh --check --report <upload-url>
#       Also save it to setup-report.md and send it to the game (the game
#       shows this exact command to a signed-in student).
#
# Live help after each failed command (like mac_setup_agent.zsh) is in
# scripts/linux_setup_agent_live.sh:
#   source scripts/linux_setup_agent_live.sh
#
# The report format matches the old linux_setup_agent.py exactly, because
# model/systemSetupReport.js and the Spring backend both read it.

REPORT_VERSION=1
REPORT_FILE_NAME="setup-report.md"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

usage () {
    echo "Usage: bash scripts/linux_setup_agent.sh --check [--report <upload-url>] [--project <folder>]" >&2
    echo "Live help after failed commands: source scripts/linux_setup_agent_live.sh" >&2
}

is_wsl () {
    [ -n "${WSL_DISTRO_NAME:-}" ] || [ -n "${WSL_INTEROP:-}" ] && return 0
    grep -qi microsoft /proc/version 2>/dev/null
}

is_debian () {
    local ids=""
    if [ -r /etc/os-release ]; then
        ids="$(. /etc/os-release; echo "${ID:-} ${ID_LIKE:-}")"
    fi
    case " $ids " in
        *" debian "*|*" ubuntu "*|*" linuxmint "*|*" kali "*) return 0 ;;
    esac
    return 1
}

# Runs a command with a 10-second limit and keeps the first line of its output
# (stdout, or stderr if stdout is empty, since java -version prints to stderr).
PROBE_LINE=""
probe () {
    local out err_file rc
    err_file="$(mktemp)"
    if command -v timeout >/dev/null 2>&1; then
        out="$(timeout 10 "$@" 2>"$err_file")"; rc=$?
    else
        out="$("$@" 2>"$err_file")"; rc=$?
    fi
    [ -z "$out" ] && out="$(cat "$err_file")"
    rm -f "$err_file"
    PROBE_LINE="$(printf '%s\n' "$out" | head -n 1 | cut -c1-240)"
    return $rc
}

RESULT_LINES=()
PASSED=0
FAILED=0

record () {
    # record <id> <label> <passed 0|1> <fix>
    if [ "$3" = 1 ]; then
        RESULT_LINES+=("PASS $1 | $2")
        PASSED=$((PASSED + 1))
    else
        RESULT_LINES+=("FAIL $1 | $2 | $4")
        FAILED=$((FAILED + 1))
    fi
}

# check_tool <id> <label> <pattern> <fix> <command...>
check_tool () {
    local id="$1" label="$2" pattern="$3" fix="$4"
    shift 4
    local passed=0
    if command -v "$1" >/dev/null 2>&1 && probe "$@" \
        && printf '%s\n' "$PROBE_LINE" | grep -Eiq -- "$pattern"; then
        passed=1
    fi
    record "$id" "$label" "$passed" "$fix"
}

collect_setup_checks () {
    local project="$1" pkg
    if is_debian; then
        pkg="sudo apt update && sudo apt install"
    else
        pkg="your distribution package manager to install"
    fi
    check_tool git       "Git"                  'git version [0-9]'             "Run: $pkg git"                                   git --version
    check_tool git-name  "Git user.name set"    '[^[:space:]]'                  'Run: git config --global user.name "Your Name"'  git config --global user.name
    check_tool git-email "Git user.email set"   '^[^[:space:]@]+@[^[:space:]@]+$' 'Run: git config --global user.email "you@example.com"' git config --global user.email
    check_tool python3   "Python 3"             'Python 3\.[0-9]+'              "Run: $pkg python3"                               python3 --version
    check_tool pip       "pip"                  'pip [0-9]'                     "Run: $pkg python3-pip"                           python3 -m pip --version
    check_tool ruby      "Ruby"                 'ruby [0-9]'                    "Run: $pkg ruby-full"                             ruby --version
    check_tool rubygems  "RubyGems"             '^[0-9]+\.[0-9]+'               "Run: $pkg ruby-full"                             gem --version
    check_tool bundler   "Bundler"              '(Bundler version )?[0-9]+\.[0-9]+' "Run: gem install bundler"                     bundle --version
    check_tool java      "Java"                 'version "?[0-9]'               "Run: $pkg default-jdk"                           java -version
    check_tool vscode    "VS Code code command" '^[0-9]+\.[0-9]+'               "Install VS Code and its command-line launcher. In WSL, install VS Code on Windows with the WSL extension." code --version

    local repo_ok=0 venv_ok=0
    [ -d "$project/.git" ] && [ -f "$project/_config.yml" ] && repo_ok=1
    [ -e "$project/venv/bin/python3" ] && venv_ok=1
    record pages-repo   "Pages repository cloned" "$repo_ok" "Clone your pages repository and run this command from inside it."
    record project-venv "Project venv created"    "$venv_ok" "From the project folder run: ./scripts/venv.sh"
}

format_setup_report () {
    local system="$1" started_at="$2" duration="$3" line unit="seconds"
    [ "$duration" = 1 ] && unit="second"
    echo "=== $system SETUP CHECK v$REPORT_VERSION ==="
    echo "Started: $started_at"
    for line in "${RESULT_LINES[@]}"; do echo "$line"; done
    echo "Duration: $duration $unit"
    echo "Summary: $PASSED passed, 0 warned, $FAILED failed"
    if [ "$FAILED" -gt 0 ]; then echo "Overall: FAIL"; else echo "Overall: PASS"; fi
    echo "=== END $system SETUP CHECK ==="
}

write_report_file () {
    local report="$1" project="$2"
    local report_file="$project/$REPORT_FILE_NAME"
    {
        echo "# Setup report"
        echo ""
        echo "Created $(date '+%Y-%m-%d %H:%M:%S') by scripts/linux_setup_agent.sh"
        echo ""
        echo '```text'
        printf '%s\n' "$report"
        echo '```'
    } > "$report_file" 2>/dev/null || { echo "Could not write $report_file" >&2; return 1; }
    echo "Saved these results to $report_file"
}

upload_report () {
    local report="$1" upload_url="$2"
    if command -v curl >/dev/null 2>&1; then
        if printf '%s\n' "$report" | curl --fail --silent --show-error --max-time 20 --output /dev/null \
            -X POST -H "Content-Type: text/plain" --data-binary @- "$upload_url"; then
            echo "Sent these results to the game. Look at the setup panel in your browser."
            return 0
        fi
    elif command -v wget >/dev/null 2>&1; then
        local tmp; tmp="$(mktemp)"
        printf '%s\n' "$report" > "$tmp"
        if wget --quiet --timeout=20 --output-document=/dev/null \
            --header="Content-Type: text/plain" --post-file="$tmp" "$upload_url"; then
            rm -f "$tmp"
            echo "Sent these results to the game. Look at the setup panel in your browser."
            return 0
        fi
        rm -f "$tmp"
    else
        echo "Could not send the results: neither curl nor wget is installed. Paste the results into the game instead." >&2
        return 1
    fi
    echo "Could not send the results. If the code expired, copy the check command from the game again, or paste the results into the game." >&2
    return 1
}

main () {
    local check=0 upload_url="" project="$PROJECT_ROOT"
    while [ $# -gt 0 ]; do
        case "$1" in
            --check) check=1 ;;
            --report) shift; upload_url="${1:-}"; [ -n "$upload_url" ] || { usage; return 2; } ;;
            --project) shift; project="${1:-}" ;;
            --watch)
                echo "Live help is now a file you source into your shell:"
                echo "  source scripts/linux_setup_agent_live.sh"
                return 2 ;;
            -h|--help) usage; return 0 ;;
            *) echo "Unknown option: $1" >&2; usage; return 2 ;;
        esac
        shift
    done

    if [ -n "$upload_url" ] && [ "$check" != 1 ]; then
        echo "--report is only used with --check" >&2; return 2
    fi
    # Same rule as verifyToolsTerminal.sh: never send a report over plain HTTP to another host.
    if [ -n "$upload_url" ] && ! [[ "$upload_url" =~ ^(https://|http://localhost:|http://127\.0\.0\.1:)[^[:space:]]+$ ]]; then
        echo "'$upload_url' is not an upload URL; copy the full command from the game." >&2; return 2
    fi
    if [ "$check" != 1 ]; then usage; return 2; fi

    local host="Linux"
    [ -r /etc/os-release ] && host="$(. /etc/os-release; echo "${PRETTY_NAME:-Linux}")"
    echo "Linux setup helper — local, rule-based checks; no AI service. Results are only uploaded with --report."
    echo "Host: $host"

    if [ "$(uname -s)" != "Linux" ]; then
        echo "Linux system checks skipped. Open Ubuntu or WSL, cd to your pages folder, and run: bash scripts/linux_setup_agent.sh --check"
        return 2
    fi
    if [ ! -d "$project" ]; then
        echo "Project folder does not exist: $project. Run this from inside ~/opencs/pages, or pass --project /path/to/pages."
        return 2
    fi
    project="$(cd "$project" && pwd)"

    local system="LINUX"
    is_wsl && system="WINDOWS"
    local started_at; started_at="$(date '+%Y-%m-%d %H:%M:%S %Z')"
    local start=$SECONDS
    collect_setup_checks "$project"
    local report; report="$(format_setup_report "$system" "$started_at" "$((SECONDS - start))")"
    printf '%s\n' "$report"

    if [ -n "$upload_url" ]; then
        echo ""
        write_report_file "$report" "$project"
        upload_report "$report" "$upload_url"
    fi
    [ "$FAILED" -eq 0 ] && return 0 || return 1
}

main "$@"
exit $?