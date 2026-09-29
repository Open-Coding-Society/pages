#!/bin/bash

## Checks project tools and setup, reporting results directly in the terminal.

pass_count=0
warn_count=0
fail_count=0
attention_checks=()
next_steps=()

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if PROJECT_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel 2>/dev/null)"; then
    :
elif [ -f "$SCRIPT_DIR/../_config.yml" ]; then
    PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
else
    PROJECT_ROOT="$(pwd)"
fi
repo_name="$(basename "$PROJECT_ROOT")"

detect_platform () {
    case "$OSTYPE" in
        darwin*) PLATFORM="macos" ;;
        linux*)
            if grep -qi microsoft /proc/version 2>/dev/null; then
                PLATFORM="wsl"
            else
                PLATFORM="linux"
            fi
            ;;
        msys*|cygwin*) PLATFORM="windows-git-bash" ;;
        *) PLATFORM="unknown" ;;
    esac
}
detect_platform

java_hint () {
    case "$PLATFORM" in
        macos) echo "Next step: install Java with 'brew install openjdk'." ;;
        linux|wsl) echo "Next step: run 'sudo apt update && sudo apt install default-jdk'." ;;
        *) echo "Next step: install a JDK for your platform." ;;
    esac
}

ruby_hint () {
    case "$PLATFORM" in
        macos) echo "Next step: install Ruby with 'brew install ruby'." ;;
        linux|wsl) echo "Next step: run 'sudo apt update && sudo apt install ruby-full build-essential zlib1g-dev'." ;;
        *) echo "Next step: install Ruby for your platform; Jekyll requires it." ;;
    esac
}

reportCheck () {
    local label="$1"
    local status="$2"
    local hint="$3"
    local next_step
    local hint_found=false

    case "$status" in
        PASS)
            pass_count=$((pass_count + 1))
            printf '[PASS] %s\n' "$label"
            ;;
        WARN)
            warn_count=$((warn_count + 1))
            attention_checks+=("[WARN] $label")
            ;;
        FAIL)
            fail_count=$((fail_count + 1))
            attention_checks+=("[FAIL] $label")
            ;;
    esac

    if [ "$status" != "PASS" ] && [ -n "$hint" ]; then
        for next_step in "${next_steps[@]}"; do
            if [ "$next_step" = "$hint" ]; then
                hint_found=true
                break
            fi
        done
        if [ "$hint_found" = false ]; then
            next_steps+=("$hint")
        fi
    fi
}

hasCommand () {
    command -v "$1" >/dev/null 2>&1
}

resolvePython () {
    if hasCommand python3; then
        echo "python3"
    elif hasCommand python; then
        echo "python"
    fi
}

resolvePip () {
    if hasCommand pip3; then
        echo "pip3"
    elif hasCommand pip; then
        echo "pip"
    fi
}

echo "Environment verification for $PROJECT_ROOT"
echo "Detected platform: $PLATFORM"
echo ""
echo "Tool installations"

if hasCommand git; then
    reportCheck "git installed" "PASS"
else
    reportCheck "git installed" "FAIL" "Next step: install Git for your platform from https://git-scm.com/downloads."
fi

if hasCommand ruby; then
    reportCheck "ruby installed" "PASS"
else
    reportCheck "ruby installed" "FAIL" "$(ruby_hint)"
fi

if hasCommand bundle; then
    reportCheck "bundler installed" "PASS"
else
    reportCheck "bundler installed" "FAIL" "Next step: install RubyGems, then run 'gem install bundler'."
fi

python_cmd="$(resolvePython)"
if [ -n "$python_cmd" ]; then
    reportCheck "python installed ($python_cmd)" "PASS"
else
    reportCheck "python installed" "FAIL" "Next step: install Python 3 for your platform. On Ubuntu/WSL, run 'sudo apt update && sudo apt install python3'."
fi

pip_cmd="$(resolvePip)"
if [ -n "$pip_cmd" ]; then
    reportCheck "pip installed ($pip_cmd)" "PASS"
else
    reportCheck "pip installed" "FAIL" "Next step: on Ubuntu/WSL, run 'sudo apt install python3-pip'; otherwise install pip for your Python 3 installation."
fi

if hasCommand jupyter; then
    reportCheck "jupyter available" "PASS"
else
    if [ -n "$python_cmd" ]; then
        jupyter_hint="Next step: only needed for _notebooks/; install it with '$python_cmd -m pip install notebook' if you plan to use notebooks."
    else
        jupyter_hint="Next step: only needed for _notebooks/; install Python and then run 'python3 -m pip install notebook'."
    fi
    reportCheck "jupyter available" "WARN" "$jupyter_hint"
fi

if hasCommand java; then
    reportCheck "java available" "PASS"
else
    reportCheck "java available" "WARN" "$(java_hint)"
fi

if [ -f "$PROJECT_ROOT/node_backend/package.json" ]; then
    if hasCommand node; then
        reportCheck "node available" "PASS"
    else
        reportCheck "node available" "WARN" "Next step: install Node.js from https://nodejs.org/ to work on node_backend/."
    fi
fi

echo ""
echo "Repository and project setup"
if [ -d "$PROJECT_ROOT/.git" ]; then
    reportCheck "git repository found at $PROJECT_ROOT" "PASS"
else
    reportCheck "git repository found at $PROJECT_ROOT" "FAIL" "Next step: run this script from inside a clone of the pages repository."
fi

config_file="$PROJECT_ROOT/_config.yml"
if [ -f "$config_file" ]; then
    config_repo=$(grep -E '^github_repo:' "$config_file" | head -n 1 | cut -d ':' -f2- | tr -d '" ')
    config_baseurl=$(grep -E '^baseurl:' "$config_file" | head -n 1 | cut -d ':' -f2- | tr -d '" ')
    expected_baseurl="/$repo_name"

    if [ "$config_repo" = "$repo_name" ]; then
        reportCheck "_config.yml github_repo matches repo directory name ($repo_name)" "PASS"
    else
        reportCheck "_config.yml github_repo matches repo directory name" "FAIL" "Next step: set github_repo to '$repo_name' in _config.yml, or rename the local clone to match."
    fi

    if [ -z "$config_baseurl" ] || [ "$config_baseurl" = "$expected_baseurl" ]; then
        reportCheck "_config.yml baseurl is consistent with repo name" "PASS"
    else
        reportCheck "_config.yml baseurl is consistent with repo name" "WARN" "Next step: check baseurl '$config_baseurl'; for repo '$repo_name', use blank or '$expected_baseurl'."
    fi
else
    reportCheck "_config.yml present" "FAIL" "Next step: restore _config.yml at $config_file from the repository."
fi

venv_dir="$PROJECT_ROOT/venv"
if [ -d "$venv_dir" ] && [ -f "$venv_dir/bin/activate" ] && [ -x "$venv_dir/bin/python3" ]; then
    reportCheck "venv set up at $venv_dir" "PASS"
else
    reportCheck "venv set up at $venv_dir" "FAIL" "Next step: run './scripts/venv.sh' from the repository root, then activate it with 'source venv/bin/activate'."
fi

if [ -f "$PROJECT_ROOT/Gemfile.lock" ]; then
    reportCheck "Gemfile.lock present (bundle install has run)" "PASS"
else
    reportCheck "Gemfile.lock present (bundle install has run)" "WARN" "Next step: run 'bundle install' from the repository root."
fi

if hasCommand bundle; then
    if (cd "$PROJECT_ROOT" && bundle exec jekyll --version >/dev/null 2>&1); then
        reportCheck "jekyll runs via bundle exec" "PASS"
    else
        reportCheck "jekyll runs via bundle exec" "FAIL" "Next step: run 'bundle install' from the repository root."
    fi
else
    reportCheck "jekyll runs via bundle exec" "FAIL" "Next step: install Bundler with 'gem install bundler', then run 'bundle install' from the repository root."
fi

echo ""
echo "Git identity"
git_name=$(git config --global user.name 2>/dev/null)
git_email=$(git config --global user.email 2>/dev/null)
if [ -n "$git_name" ]; then
    reportCheck "git global user.name set" "PASS"
else
    reportCheck "git global user.name set" "WARN" "Next step: run 'git config --global user.name \"Your Name\"'."
fi
if [ -n "$git_email" ]; then
    reportCheck "git global user.email set" "PASS"
else
    reportCheck "git global user.email set" "WARN" "Next step: run 'git config --global user.email \"you@example.com\"'."
fi

if [ "$fail_count" -gt 0 ]; then
    overall="FAIL"
    exit_code=1
elif [ "$warn_count" -gt 0 ]; then
    overall="WARN"
    exit_code=0
else
    overall="PASS"
    exit_code=0
fi

printf 'Summary: %s passed, %s warned, %s failed\n' "$pass_count" "$warn_count" "$fail_count"
echo "Overall: $overall"

if [ "${#attention_checks[@]}" -gt 0 ]; then
    echo ""
    echo "Warnings and failures"
    for check in "${attention_checks[@]}"; do
        printf '%s\n' "$check"
    done

    echo ""
    echo "Next steps"
    for next_step in "${next_steps[@]}"; do
        printf '  - %s\n' "${next_step#Next step: }"
    done
fi

exit "$exit_code"