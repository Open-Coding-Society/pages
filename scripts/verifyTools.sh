#\!/bin/bash

## Script provides functionality to verify all tool versions/installations and outputs to specified markdown file

file_name="verifyTools.md"

if [ -f "$file_name" ]; then
    rm "$file_name"
fi

## Create markdown file with specified $file_name
touch "$file_name"

## Header for markdown file so that code recognizes post as a blog
cat <<'FRONT_MATTER' >> "$file_name"
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

## verify all installations and versions of installations
verifyInstallations () {
    echo "----------------- Checking git version -----------------"
    printCommand "git --version"
    echo "----------------- Checking ruby version -----------------"
    printCommand "ruby -v"
    echo "----------------- Checking python version -----------------"
    printCommand "python --version"
    echo "----------------- Verifying Jupyter Kernels -----------------"
    printCommand "jupyter kernelspec list"
    echo "----------------- Verifying Java Version -----------------"
}

## Verify opencs/pages repository and local environment setup
verifyOpencsPages () {

    project_dir="$HOME/opencs"
    project="$project_dir/pages"
    posts="$project/_posts"
    notebooks="$project/_notebooks"
    config_file="$project/_config.yml"
    venv_dir="$project/venv"
    repo_name="$(basename "$project")"

    echo "----------------- Verifying opencs/pages repository setup -----------------"
    printCommand "echo \"opencs directory: $project_dir\""
    printCommand "echo \"opencs pages repo: $project\""
    printCommand "echo \"opencs posts: $posts\""
    printCommand "echo \"opencs notebooks: $notebooks\""

    echo ""
    echo "### 1) Check for git clone of pages"
    if [ -d "$project/.git" ]; then
        echo "PASS: Found git repository at $project"
        printCommand "git -C $project rev-parse --abbrev-ref HEAD"
        printCommand "git -C $project remote -v | head -n 2"
    else
        echo "FAIL: Missing git repository at $project"
    fi

    echo ""
    echo "### 2) Check _config.yml repo/baseurl consistency"
    if [ -f "$config_file" ]; then
        config_repo=$(grep -E '^github_repo:' "$config_file" | head -n 1 | cut -d ':' -f2- | tr -d '" ')
        config_baseurl=$(grep -E '^baseurl:' "$config_file" | head -n 1 | cut -d ':' -f2- | tr -d '" ')
        expected_baseurl="/$repo_name"

        echo "----------------- Verifying _config.yml -----------------"
        printCommand "echo \"github_repo from _config.yml: $config_repo\""
        printCommand "echo \"baseurl from _config.yml: $config_baseurl\""
        printCommand "echo \"repo directory name: $repo_name\""

        if [ "$config_repo" = "$repo_name" ]; then
            echo "PASS: github_repo matches repo directory name ($repo_name)"
        else
            echo "FAIL: github_repo ($config_repo) does not match repo directory name ($repo_name)"
        fi

        if [ "$config_baseurl" = "" ] || [ "$config_baseurl" = "$expected_baseurl" ]; then
            echo "PASS: baseurl is acceptable for repo '$repo_name' (blank for root domain or $expected_baseurl)"
        else
            echo "WARN: baseurl '$config_baseurl' is unusual for repo '$repo_name' (expected blank or $expected_baseurl)"
        fi
    else
        echo "FAIL: Missing _config.yml at $config_file"
    fi

    echo ""
    echo "### 3) Check venv setup according to procedures"
    if [ -d "$venv_dir" ] && [ -f "$venv_dir/bin/activate" ] && [ -x "$venv_dir/bin/python3" ]; then
        echo "PASS: venv exists with activate script and python executable"
        printCommand "$venv_dir/bin/python3 --version"
    else
        echo "FAIL: venv not fully set up at $venv_dir"
        echo "Hint: run scripts/venv.sh from the pages repo root"
    fi
}

## Verify that your github configuration information is accurate
verifyGithubInfo () {

    echo "----------------- Verifying GitHub configuration -----------------"
    printCommand "git config --global --list"

}

## Send all verifications to markdown file
verifyInstallations >> "$file_name"
verifyOpencsPages >> "$file_name"
verifyGithubInfo >> "$file_name"
