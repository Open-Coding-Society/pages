#!/bin/bash

# Function to check if a line exists in run commands
line_exists_in_rc() {
  grep -Fxq "$1" ~/.bashrc
}

# Function to add line to run commands
add_to_rc() {
  if ! line_exists_in_rc "$1"; then
    echo "$1" >> ~/.bashrc
  fi
}

# Ugrade and install packages for Ubuntu
echo "=== Upgrade Packages ==="
sudo apt update
sudo apt upgrade -y

# Install Ruby and necessary development tools
echo "=== Install Ruby ==="
sudo apt install -y ruby-full build-essential zlib1g-dev

# Install Python 3 and pip
echo "=== Install Python ==="
sudo apt-get install -y python3 python3-pip python-is-python3 python3-venv

# Install Jupyter Notebook
echo "=== Install Jupyter Notebook ==="
sudo apt-get install -y jupyter-notebook

#### GitHub Pages Local Build support
echo "=== GitHub pages build tools  ==="
export GEM_HOME="$HOME/gems"
export PATH="$HOME/gems/bin:$PATH"
add_to_rc "# Ruby Gem Path"
add_to_rc 'export GEM_HOME="$HOME/gems"'
add_to_rc 'export PATH="$HOME/gems/bin:$PATH"'

echo "=== Gem install starting, thinking... ==="
gem install jekyll bundler

echo "=== !!!Start a new Terminal!!! ==="
