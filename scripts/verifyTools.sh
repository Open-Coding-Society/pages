#!/bin/bash

## Verifies that a student's development environment is properly configured
## to work on this Jekyll ("pages") project: required tools, repo/config
## setup, and that Jekyll actually runs. Writes a Jekyll-post-formatted
## report to verifyTools.md (gitignored) and prints a PASS/WARN/FAIL summary
## with a matching exit code (0 = pass or warn-only, 1 = at least one fail).

file_name="verifyTools.md"

pass_count=0
warn_count=0
fail_count=0

## ---------------------------------------------------------------------
## Locate the project root automatically (works regardless of clone
## location or repo name) instead of assuming a fixed path.
## ---------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if PROJECT_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel 2>/dev/null)"; then
    : # found via git
elif [ -f "$SCRIPT_DIR/../_config.yml" ]; then
    PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
else
    PROJECT_ROOT="$(pwd)"
fi
repo_name="$(basename "$PROJECT_ROOT")"

## ---------------------------------------------------------------------
## Detect platform so remediation hints and tool aliases (python vs
## python3) match what the student is actually running.
## ---------------------------------------------------------------------
detect_platform () {
    case "$OSTYPE" in
        darwin*)
            PLATFORM="macos"
            ;;
        linux*)
            if grep -qi microsoft /proc/version 2>/dev/null; then
                PLATFORM="wsl"
            else
                PLATFORM="linux"
            fi
            ;;
        msys*|cygwin*)
            PLATFORM="windows-git-bash"
            ;;
        *)
            PLATFORM="unknown"
            ;;
    esac
}
detect_platform

java_hint () {
    case "$PLATFORM" in
        macos) echo "Hint: install with 'brew install openjdk'" ;;
        linux|wsl) echo "Hint: install with 'sudo apt install default-jdk'" ;;
        *) echo "Hint: install a JDK for your platform" ;;
    esac
}

## Establish printCommand() functionality
printCommand () {
    cmd="$1"
    output=$(eval "$cmd" 2>&1)
    exit_code=$?

    echo "\`\`\`"
    echo "Input: $cmd"
    echo "Exit Code: $exit_code"
    echo "Output: $output"
    echo "\`\`\`"
}

## Record a check result (PASS/WARN/FAIL), tally counts, and print a
## remediation hint when the check didn't pass.
## Usage: reportCheck "<label>" "<PASS|WARN|FAIL>" "<remediation hint>"
reportCheck () {
    label="$1"
    status="$2"
    hint="$3"

    case "$status" in
        PASS) pass_count=$((pass_count + 1)) ;;
        WARN) warn_count=$((warn_count + 1)) ;;
        FAIL) fail_count=$((fail_count + 1)) ;;
    esac

    echo "[$status] $label"
    if [ "$status" != "PASS" ] && [ -n "$hint" ]; then
        echo "$hint"
    fi
}

## Return 0 (true) if the given command name resolves on PATH.
hasCommand () {
    command -v "$1" >/dev/null 2>&1
}

## Resolve the primary python interpreter for this platform: prefer
## python3, fall back to python.
resolvePython () {
    if hasCommand python3; then
        echo "python3"
    elif hasCommand python; then
        echo "python"
    else
        echo ""
    fi
}

## Resolve the primary pip for this platform.
resolvePip () {
    if hasCommand pip3; then
        echo "pip3"
    elif hasCommand pip; then
        echo "pip"
    else
        echo ""
    fi
}

## verify required and optional tool installations
verifyInstallations () {
    echo "----------------- Detected platform -----------------"
    printCommand "echo \"$PLATFORM\""

    echo ""
    echo "----------------- Checking git -----------------"
    if hasCommand git; then
        printCommand "git --version"
        reportCheck "git installed" "PASS"
    else
        reportCheck "git installed" "FAIL" "Hint: install git for your platform (https://git-scm.com/downloads)"
    fi

    echo ""
    echo "----------------- Checking ruby -----------------"
    if hasCommand ruby; then
        printCommand "ruby -v"
        reportCheck "ruby installed" "PASS"
    else
        reportCheck "ruby installed" "FAIL" "Hint: install Ruby (required to run Jekyll)"
    fi

    echo ""
    echo "----------------- Checking bundler -----------------"
    if hasCommand bundle; then
        printCommand "bundle --version"
        reportCheck "bundler installed" "PASS"
    else
        reportCheck "bundler installed" "FAIL" "Hint: run 'gem install bundler'"
    fi

    echo ""
    echo "----------------- Checking python -----------------"
    python_cmd="$(resolvePython)"
    if [ -n "$python_cmd" ]; then
        printCommand "$python_cmd --version"
        reportCheck "python installed ($python_cmd)" "PASS"
    else
        reportCheck "python installed" "FAIL" "Hint: install Python 3 for your platform"
    fi

    echo ""
    echo "----------------- Checking pip -----------------"
    pip_cmd="$(resolvePip)"
    if [ -n "$pip_cmd" ]; then
        printCommand "$pip_cmd --version"
        reportCheck "pip installed ($pip_cmd)" "PASS"
    else
        reportCheck "pip installed" "FAIL" "Hint: install pip for your Python installation"
    fi

    echo ""
    echo "----------------- Verifying Jupyter Kernels (optional) -----------------"
    if hasCommand jupyter; then
        printCommand "jupyter kernelspec list"
        reportCheck "jupyter available" "PASS"
    else
        reportCheck "jupyter available" "WARN" "Hint: only needed for _notebooks/; install with '$pip_cmd install notebook' if you plan to use them"
    fi

    echo ""
    echo "----------------- Verifying Java (optional) -----------------"
    if hasCommand java; then
        printCommand "java -version"
        reportCheck "java available" "PASS"
    else
        reportCheck "java available" "WARN" "$(java_hint)"
    fi

    if [ -f "$PROJECT_ROOT/node_backend/package.json" ]; then
        echo ""
        echo "----------------- Verifying Node.js (optional, node_backend present) -----------------"
        if hasCommand node; then
            printCommand "node --version"
            reportCheck "node available" "PASS"
        else
            reportCheck "node available" "WARN" "Hint: install Node.js to work on node_backend/"
        fi
    fi
}

## Verify this repository and local environment setup
verifyRepositorySetup () {

    posts="$PROJECT_ROOT/_posts"
    notebooks="$PROJECT_ROOT/_notebooks"
    config_file="$PROJECT_ROOT/_config.yml"
    venv_dir="$PROJECT_ROOT/venv"

    echo "----------------- Verifying repository setup -----------------"
    printCommand "echo \"project root: $PROJECT_ROOT\""
    printCommand "echo \"posts: $posts\""
    printCommand "echo \"notebooks: $notebooks\""

    echo ""
    echo "### 1) Check for git repository"
    if [ -d "$PROJECT_ROOT/.git" ]; then
        printCommand "git -C $PROJECT_ROOT rev-parse --abbrev-ref HEAD"
        printCommand "git -C $PROJECT_ROOT remote -v | head -n 2"
        reportCheck "git repository found at $PROJECT_ROOT" "PASS"
    else
        reportCheck "git repository found at $PROJECT_ROOT" "FAIL" "Hint: run this script from inside a clone of the pages repository"
    fi

    echo ""
    echo "### 2) Check _config.yml repo/baseurl consistency"
    if [ -f "$config_file" ]; then
        config_repo=$(grep -E '^github_repo:' "$config_file" | head -n 1 | cut -d ':' -f2- | tr -d '" ')
        config_baseurl=$(grep -E '^baseurl:' "$config_file" | head -n 1 | cut -d ':' -f2- | tr -d '" ')
        expected_baseurl="/$repo_name"

        printCommand "echo \"github_repo from _config.yml: $config_repo\""
        printCommand "echo \"baseurl from _config.yml: $config_baseurl\""
        printCommand "echo \"repo directory name: $repo_name\""

        if [ "$config_repo" = "$repo_name" ]; then
            reportCheck "_config.yml github_repo matches repo directory name" "PASS"
        else
            reportCheck "_config.yml github_repo matches repo directory name" "FAIL" "Hint: set github_repo to '$repo_name' in _config.yml, or rename your local clone to match"
        fi

        if [ "$config_baseurl" = "" ] || [ "$config_baseurl" = "$expected_baseurl" ]; then
            reportCheck "_config.yml baseurl is consistent with repo name" "PASS"
        else
            reportCheck "_config.yml baseurl is consistent with repo name" "WARN" "Hint: baseurl '$config_baseurl' is unusual for repo '$repo_name' (expected blank or $expected_baseurl)"
        fi
    else
        reportCheck "_config.yml present" "FAIL" "Hint: _config.yml is missing at $config_file"
    fi

    echo ""
    echo "### 3) Check venv setup"
    if [ -d "$venv_dir" ] && [ -f "$venv_dir/bin/activate" ] && [ -x "$venv_dir/bin/python3" ]; then
        printCommand "$venv_dir/bin/python3 --version"
        reportCheck "venv set up at $venv_dir" "PASS"
    else
        reportCheck "venv set up at $venv_dir" "FAIL" "Hint: run scripts/venv.sh from the repo root"
    fi

    echo ""
    echo "### 4) Check bundle install"
    if [ -f "$PROJECT_ROOT/Gemfile.lock" ]; then
        reportCheck "Gemfile.lock present (bundle install has run)" "PASS"
    else
        reportCheck "Gemfile.lock present (bundle install has run)" "WARN" "Hint: run 'bundle install' from the repo root"
    fi

    echo ""
    echo "### 5) Check that Jekyll actually runs"
    if hasCommand bundle; then
        printCommand "cd $PROJECT_ROOT && bundle exec jekyll --version"
        if (cd "$PROJECT_ROOT" && bundle exec jekyll --version) >/dev/null 2>&1; then
            reportCheck "jekyll runs via bundle exec" "PASS"
        else
            reportCheck "jekyll runs via bundle exec" "FAIL" "Hint: run 'bundle install' from the repo root, then re-check"
        fi
    else
        reportCheck "jekyll runs via bundle exec" "FAIL" "Hint: install bundler first ('gem install bundler')"
    fi
}

## Verify that your git identity is configured (needed for commits),
## without echoing the student's entire global gitconfig.
verifyGithubInfo () {

    echo "----------------- Verifying git identity -----------------"
    git_name=$(git config --global user.name 2>/dev/null)
    git_email=$(git config --global user.email 2>/dev/null)

    printCommand "git config --global user.name"
    printCommand "git config --global user.email"

    if [ -n "$git_name" ]; then
        reportCheck "git global user.name set" "PASS"
    else
        reportCheck "git global user.name set" "WARN" "Hint: run 'git config --global user.name \"Your Name\"'"
    fi

    if [ -n "$git_email" ]; then
        reportCheck "git global user.email set" "PASS"
    else
        reportCheck "git global user.email set" "WARN" "Hint: run 'git config --global user.email \"you@example.com\"'"
    fi
}

## ---------------------------------------------------------------------
## Create markdown report and run all verifications
## ---------------------------------------------------------------------
if [ -f "$file_name" ]; then
    rm "$file_name"
fi
touch "$file_name"

cat <<FRONT_MATTER >> "$file_name"
---
layout: post
title: Sprint 1 - Verify Tools
description: Verifying Tools and Software for Sprint 1
type: collab
courses: {'csa': {'week': 3}}
comments: True
categories: ['Collaboration']
---

FRONT_MATTER

{
    verifyInstallations
    echo ""
    verifyRepositorySetup
    echo ""
    verifyGithubInfo
} >> "$file_name"

## ---------------------------------------------------------------------
## Print summary to stdout and exit with the correct code.
## ---------------------------------------------------------------------
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

echo ""
echo "Summary: $pass_count passed, $warn_count warned, $fail_count failed"
echo "Overall: $overall"
echo "Full report written to $file_name"

exit $exit_code
