#!/bin/bash
set -ex

# Ubuntu Configuration to Match Kasm

BASHRC="$HOME/.bashrc"
GEM_HOME="/opt/gems"

log() {
    echo "=== ✅ $1 ==="
}

add_to_bashrc() {
    local line="$1"
    grep -qxF "$line" "$BASHRC" || echo "$line" >> "$BASHRC"
}

# 0. Aliases and Virtualenv Prompt
add_to_bashrc 'alias code="code --no-sandbox"'
add_to_bashrc 'export GEM_HOME="/opt/gems"'
add_to_bashrc 'export PATH="/opt/gems/bin:$PATH"'
if ! grep -q 'VIRTUAL_ENV' "$BASHRC"; then
cat <<EOF >> "$BASHRC"
# Show Python virtualenv in prompt
if [[ -n "\$VIRTUAL_ENV" ]]; then
    venv="(\$(basename \$VIRTUAL_ENV)) "
else
    venv=""
fi
export PS1="\${venv}\u:\w\$ "
EOF
fi

# 1. APT Packages
sudo apt update
sudo apt install -y python3 python3-pip python-is-python3 python3-venv ruby-full build-essential \
    zlib1g-dev jupyter-notebook sqlite3 lsof

# 2. Ruby Gems
sudo mkdir -p "$GEM_HOME"
sudo chmod -R 777 "$GEM_HOME"
sudo gem install bundler jekyll benchmark openssl zlib racc bigdecimal drb unicode-display_width \
                 logger etc fileutils ipaddr mutex_m ostruct rss strscan stringio time

# 3. Python3 is Python
source $BASHRC
python --version
pip --version
ruby -v
bundle -v
gem --version

# Restart the terminal
echo "All tools are set up successfully!"
echo "Please start a new terminal or run 'source $BASHRC' to apply the changes."