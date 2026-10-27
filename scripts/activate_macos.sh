#!/bin/bash
set -ex

BASHRC="$HOME/.zshrc"

# Everything below needs Homebrew; stop with a clear next step if it's missing.
if ! command -v brew >/dev/null 2>&1; then
    set +x
    echo "Homebrew isn't installed. Install it from https://brew.sh, open a new Terminal, then run this script again."
    exit 1
fi

log() {
    echo "=== ✅ $1 ==="
}

add_to_bashrc() {
    local line="$1"
    grep -qxF "$line" "$BASHRC" || echo "$line" >> "$BASHRC"
}

# 0. Aliases and Virtualenv Prompt
add_to_bashrc 'alias code="code --no-sandbox"'

# 1. Brew Packages (Python & Ruby)
brew update
brew install python ruby

# 2. Ruby Gems
# Add Homebrew Ruby to PATH (before system Ruby)
RUBY_PATH=$(brew --prefix ruby)/bin
add_to_bashrc "export PATH=\"$RUBY_PATH:\$PATH\""
# Also use it in this script, so gem installs into Homebrew Ruby instead of
# macOS's built-in Ruby (which fails with a /Library/Ruby/Gems permission error).
export PATH="$RUBY_PATH:$PATH"

# Set GEM_HOME to user-accessible location
GEM_HOME="$HOME/.local/gems"
mkdir -p "$GEM_HOME"
add_to_bashrc "export GEM_HOME=\"$GEM_HOME\""
add_to_bashrc "export PATH=\"$GEM_HOME/bin:\$PATH\""
export GEM_HOME
export PATH="$GEM_HOME/bin:$PATH"

# Install gems (no sudo needed now)
gem install bundler jekyll benchmark openssl zlib racc bigdecimal drb unicode-display_width \
            logger etc fileutils ipaddr mutex_m ostruct rss strscan stringio time

# 3. Python3 is Python
mkdir -p "$HOME/.local/bin"
ln -sf "$(which python3)" "$HOME/.local/bin/python"
ln -sf "$(which pip3)" "$HOME/.local/bin/pip"
add_to_bashrc 'export PATH="$HOME/.local/bin:$PATH"'
export PATH="$HOME/.local/bin:$PATH"

# 4. Check the tools. The exports above already apply here; sourcing ~/.zshrc
# from bash can fail on zsh-only syntax and stop this script (set -e).
python --version
pip --version
ruby -v
bundle -v
gem --version

# Restart the terminal
echo "All tools are set up successfully!"
echo "Please start a new terminal or run 'source $BASHRC' to apply the changes."