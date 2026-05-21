#!/bin/bash

## Script provides functionality to verify all tool versions/installations and outputs to specified markdown file

file_name="verifyTools.md"

if [ -f "$file_name" ]; then
    rm $file_name
fi

## Create markdown file with specified $file_name
touch $file_name

## Header for markdown file so that code recognizes post as a blog
echo "---
layout: post 
title: Sprint 1 - Verify Tools
description: Verifying Tools and Software for Sprint 1
type: collab
courses: {'csa': {'week': 3}}
comments: True
categories: ['Collaboration']
---
" >> $file_name

## Establish printCommand() functionality
printCommand () {
    echo "\`\`\`"
    echo "Input: $1"
    echo "Output: $($1)"
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
    printCommand "java --version"
}

## 
createEnvVariables () {
    echo "Verifying creation of project environment variables"


    export project_dir=$HOME/nighthawk 
    export project=\$project_dir/pages # <your project_dir>
    export posts=\$project/_posts
    export notebooks=\$project/_notebooks
    export project_repo="https://github.com/open-coding-society/pages" # <your github directory>
    
    printCommand "echo \"Repos home dir: $project_dir\""
    printCommand "echo \"Project dir: $project\""
    printCommand "echo \"Posts dir: $posts\""
    printCommand "echo \"Notebooks dir: $notebooks\""
    printCommand "echo \"Repo: $project_repo\""
}

## Verify that your github configuration information is accurate
verifyGithubInfo () {
    echo "Verifying configuration of GitHub "

    printCommand "git config --global --list"

}

## Send all verifications to markdown file
verifyInstallations >> $file_name
createEnvVariables >> $file_name
verifyGithubInfo >> $file_name