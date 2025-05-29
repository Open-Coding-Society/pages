<<comment
# Help
# Objective of this exercise is to test cloud environment ...
#     plus, start a Web Server
# The hash # is a comment or action ...
#     # is a comment symbol in a .sh file 
# The dollar $ represent a terminal command ... 
#     $ is not part of command

# Start a terminal for commands
git clone https://github.com/nighthawkcoders/portfolio_2025.git
$ ./student/activate.sh

# Run the cat command, leave this terminal open ...
#    the cat command shows remaining instructions  ...
#    find this spot and continue on
$ cat ./student/activate.sh

# Start a new terminal ...
#    the "new" terminal is the command terminal ...
#    the "original" terminal shows commands ...
#    type commands in "new" terminal
$ cd student
$ bundle install
$ bundle exec jekyll serve

# End
# The build execution is complete ...
#     Ctl-Click on "link" in terminal ...
#     observe web site in the opened browser

comment
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

alias code="code --no-sandbox"
add_to_rc 'alias code="code --no-sandbox"'

#### GitHub Pages Local Build support
echo "=== GitHub pages build tools  ==="
export GEM_HOME="$HOME/gems"
export PATH="$HOME/gems/bin:$PATH"
add_to_rc "# Ruby Gem Path"
add_to_rc 'export GEM_HOME="$HOME/gems"'
add_to_rc 'export PATH="$HOME/gems/bin:$PATH"'
echo "=== Gem install starting, thinking... ==="
gem install jekyll bundler

# Set JAVA_HOME
export JAVA_HOME="/usr/lib/jvm/java-17-openjdk-amd64"
export PATH="$PATH:$JAVA_HOME/bin"
add_to_rc 'export JAVA_HOME="/usr/lib/jvm/java-17-openjdk-amd64"'
add_to_rc 'export PATH="$PATH:$JAVA_HOME/bin"'

# Clone the IJava repository into /tmp
cd /tmp
git clone https://github.com/frankfliu/IJava.git
cd IJava
# Install the Jupyter Java kernel
./gradlew installKernel
# Clean up by removing the IJava directory and downloaded files
cd /tmp
rm -rf IJava

# Java VSCode extensions
code --install-extension vscjava.vscode-java-pack --pre-release
code --install-extension redhat.java --pre-release
code --install-extension vscjava.vscode-java-debug --pre-release
code --install-extension vscjava.vscode-java-test --pre-release

# GitHub VSCode extensiions
code --install-extension github.vscode-github-actions
code --install-extension eamodio.gitlens

# Python VSCode Extensions
code --install-extension ms-python.python
code --install-extension ms-python.vscode-pylance
code --install-extension ms-python.python-pack --pre-release

# Jupyter VSCode Extension
code --install-extension ms-toolsai.jupyter