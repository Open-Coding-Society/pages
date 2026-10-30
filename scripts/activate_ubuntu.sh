#!/bin/bash
set -ex

# Ubuntu Configuration to Match Kasm

BASHRC="$HOME/.bashrc"
# Run as the intended user; only APT needs elevated privileges.
if (( EUID == 0 )); then
    echo "Run this script as your normal user, without sudo." >&2
    exit 1
fi

export GEM_HOME="$HOME/.local/gems"
# Drop the legacy shared executable directory from the inherited PATH.
PATH=":$PATH:"
while [[ "$PATH" == *:/opt/gems/bin:* ]]; do
    PATH="${PATH//:\/opt\/gems\/bin:/:}"
done
PATH="${PATH#:}"
PATH="${PATH%:}"
export PATH="$GEM_HOME/bin:$PATH"

log() {
    echo "=== ✅ $1 ==="
}

add_to_bashrc() {
    local line="$1"
    grep -qxF "$line" "$BASHRC" || echo "$line" >> "$BASHRC"
}

# 0. Aliases and Virtualenv Prompt
add_to_bashrc 'alias code="code --no-sandbox"'
# Remove only entries written by previous versions of these scripts.
touch "$BASHRC"
sed -i '\|^export GEM_HOME="/opt/gems"$|d; \|^export PATH="/opt/gems/bin:\$PATH"$|d' "$BASHRC"
add_to_bashrc 'export GEM_HOME="$HOME/.local/gems"'
add_to_bashrc 'export PATH="$GEM_HOME/bin:$PATH"'
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
# A private top-level directory also protects gems created with a permissive umask.
mkdir -p "$GEM_HOME"
chmod 700 "$GEM_HOME"
gem install bundler jekyll benchmark openssl zlib racc bigdecimal drb unicode-display_width \
                 logger etc fileutils ipaddr mutex_m ostruct rss strscan stringio time

# 3. Python3 is Python
python --version
pip --version
ruby -v
bundle -v
gem --version

# Restart the terminal
echo "All tools are set up successfully!"
echo "Please start a new terminal or run 'source $BASHRC' to apply the changes."
