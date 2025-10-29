echo Adding App Installations for Ubuntu
# Install VS Code
sudo snap install --classic code
# Install Git
sudo apt update
sudo apt install -y git

# Install Google Chrome
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome-stable_current_amd64.deb

echo "Creating desktop shortcuts"

# Get current username and Desktop path
USER_HOME=$(eval echo "~$USER")
DESKTOP_PATH="$USER_HOME/Desktop"

# Make sure the desktop exists
mkdir -p "$DESKTOP_PATH"

# VS Code
cat <<EOF > "$DESKTOP_PATH/Visual Studio Code.desktop"
[Desktop Entry]
Name=Visual Studio Code
Comment=Code Editing. Redefined.
Exec=code --no-sandbox --unity-launch %F
Icon=/snap/code/current/meta/gui/com.visualstudio.code.png
Terminal=false
Type=Application
Categories=Development;IDE;
EOF

# Google Chrome
cat <<EOF > "$DESKTOP_PATH/Google Chrome.desktop"
[Desktop Entry]
Name=Google Chrome
Comment=Access the Internet
Exec=/usr/bin/google-chrome-stable %U
Icon=/usr/share/icons/hicolor/128x128/apps/google-chrome.png
Terminal=false
Type=Application
Categories=Network;WebBrowser;
EOF

# Git (optional shortcut to open terminal)
cat <<EOF > "$DESKTOP_PATH/Git Bash.desktop"
[Desktop Entry]
Name=Git Terminal
Comment=Open terminal for Git
Exec=gnome-terminal
Icon=utilities-terminal
Terminal=false
Type=Application
Categories=Development;Utility;
EOF

# Make them executable
chmod +x "$DESKTOP_PATH"/*.desktop

# Mark as trusted (auto "Allow Launching")
for f in "$DESKTOP_PATH"/*.desktop; do
    gio set "$f" metadata::trusted true
done

# Refresh the desktop (optional)
nautilus -q && nautilus &

echo "App installations and desktop shortcuts created successfully!"
