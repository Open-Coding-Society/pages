#!/bin/bash

# Function to check if a line exists in run commands
line_exists_in_rc() {
  grep -Fxq "$1" ~/.zshrc
}

# Function to add line to run commands
add_to_rc() {
  if ! line_exists_in_rc "$1"; then
    echo "$1" >> ~/.zshrc
  fi
}

# MacOS required tools
#
# MacOS commands
# 
# Upgrade Homebrew and install xz (decompression utility)
echo "=== Upgrade Packages ==="
yes | brew update
yes | brew upgrade
yes | brew install xz # decompression utility

# Install rbenv, Ruby 3.1.4, and configure it
echo "=== Install Ruby ==="
yes | brew install rbenv

# Test if Ruby 3.1.4 exists
if ! rbenv versions | grep -q 3.1.4; then   
    yes | rbenv install 3.1.4
fi
rbenv global 3.1.4

# Configure rbenv to initialize in the shell
add_to_rc "# rbenv initialize"
add_to_rc 'if which rbenv > /dev/null; then eval "$(rbenv init - zsh)"; fi'
#

# Install Python and Pip using Homebrew
echo "=== Install Python ==="
yes | brew install python

# Install Jupyter Notebook using Homebrew
echo "=== Install Jupyter Notebook ==="
yes | brew install jupyter

#### GitHub Pages Local Build
echo "=== GitHub pages build tools  ==="
export GEM_HOME="$HOME/gems"
export PATH="$HOME/gems/bin:$PATH"
add_to_rc "# Ruby Gem Path"
add_to_rc 'export GEM_HOME="$HOME/gems"'
add_to_rc 'export PATH="$HOME/gems/bin:$PATH"'

echo "=== Gem install starting, thinking... ==="
gem install jekyll bundler

echo "=== !!!Start a new Terminal!!! ==="
