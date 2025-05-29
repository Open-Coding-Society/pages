<<comment
# Help
# Objective of this exercise is to test setup environment ...
#     plus, start a Web Server
# The hash # is a comment or action ...
#     # is a comment symbol in a .sh file 
# The dollar $ represent a terminal command ... 
#     $ is not part of command

# Start a terminal for commands
$ mdkir vscode
cd vscode
git clone https://github.com/open-coding-society/pages.git
cd ~/vscode/pages/scripts
./activate_ubuntu.sh

# Run the head command, leave this terminal open ...
#    the head command shows remaining instructions  ...
#    find this spot and continue on
head -34 ~/vscode/pages/scripts/activate_ubuntu.sh

# Start a new terminal ...
#    the "new" terminal is the command terminal ...
#    the "original" terminal shows commands ...
#    type commands in "new" terminal
cd ~/vscode/pages
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
bundle install
make

# End
# The build execution is complete ...
#     Ctl-Click on "link" in terminal ...
#     observe web site in the opened browser
comment

#### Setup CompSci / GitHub Pages Tool Requirements
GITHUB_LOCATION=${1:-$(pwd)}
#### Setup CompSci / GitHub Pages Tool Requirements
$GITHUB_LOCATION/setup_ubuntu.sh
#### Show instructions
head -36 $GITHUB_LOCATION/activate_ubuntu.sh