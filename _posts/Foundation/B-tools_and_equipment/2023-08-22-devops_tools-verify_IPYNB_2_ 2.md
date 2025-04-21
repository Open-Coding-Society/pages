---
layout: post
title: Tools Verify using Shell
description: Linux and the shell is used in this example to setup and verify the installation of the tools.  Additionally, a few programming exercises are included.
categories: ['DevOps']
toc: True
comments: True
---

## Computers and Terminals

A brief overview of Terminal and Linux is a step on your way to becoming a Linux expert. When a computer boots up, **a kernel (MacOS, Windows, Linux) is started**. This kernel is the core of the operating system and manages hardware resources. Above the kernel, various applications run, including the **shell** and **terminal**, which allow users to interact with the system using a basic set of commands provided by the kernel.

Typically, casual users interact with the system through a Desktop User Interface (UI) that is started by the computer's boot-up processes. However, to interact directly with the shell, users can run a "terminal" application through the Desktop UI. Additionally, **VS Code provides the ability to activate a "terminal"** within its editing environment, making it convenient for developers to execute commands without leaving the code editor.

In this next phase, we will use a Jupyter notebook to perform Linux commands through a terminal. The Jupyter notebook is an application that runs above the kernel, providing an interactive environment for writing and executing code, including shell commands. This setup allows us to seamlessly integrate code execution, data analysis, and documentation in one place, enhancing our productivity and learning experience.

## Setup a Personal GitHub Pages Project

You will be making a personal copy of the course repository. Be sure to have a GitHub account!!!

- Use the **Green "Use this Template"** button on the [portfolio_2025](https://github.com/nighthawkcoders/portfolio_2025) repository page to set up your personal GitHub Pages repository.
- Create a new repository.
- Fill in the dialog and select the **Repository Name** to be under your GitHub ID ownership.

    ![create repo]({{ site.baseurl }}/images/notebooks/foundation/create_repo.jpg)

- After this is complete, use the **Green "Code"** button on the newly created repository page to capture your "Project Repo" name.

In the next few code cells, we will run a bash (shell) script to pull a GitHub project. 

## Shell Script and Variables

We will ultimately run a bash (shell) script to pull a GitHub project. This next script simply sets up the necessary **environment variables** to tell the script the location of repository from GitHub and where to copy the output.

For now, focus on each line that begins with `export`. These are **shell variables**. Each line has a **name** (after the keyword `export`) and a **value** (after the equal sign).

Here is a full description:

- **Creates a temporary file** `/tmp/variables.sh` to store environment variables.
- **Sets the `project_dir` variable** to your home directory with a subdirectory named `nighthawk`. You can change `nighthawk` to a different name to test your git clone.
- **Sets the `project` variable** to a subdirectory within `project_dir` named `portfolio_2025`. You can change `portfolio_2025` to the name of your project.
- **Sets the `project_repo` variable** to the URL of the GitHub repository. Change this to the project you created from the `portfolio_2025` template.

**By running this script, you will prepare your environment for cloning** and working on your GitHub project. This is an essential step in setting up your development environment and ensuring that all dependencies are correctly configured.


```python
%%script bash

# Dependency Variables, set to match your project directories

cat <<EOF > /tmp/variables.sh
export project_dir=$HOME/nighthawk  # change nighthawk to different name to test your git clone
export project=\$project_dir/portfolio_2025  # change portfolio_2025 to name of project from git clone
export project_repo="https://github.com/nighthawkcoders/portfolio_2025.git"  # change to project you created from portfolio_2025 template 
EOF
```

## Describing the Outputs of the Variables

The next script will extract the saved variables and display their values. Here is a description of the commands:

- The `source` command loads the variables that we saved in the `/tmp/variables.sh` file in the previous code cell.
- The `echo` commands display the contents of the named variables:
  - **project_dir**: The directory where your project is located.
  - **project**: The specific project directory within `project_dir`.
  - **project_repo**: The URL of the GitHub repository.

By running this script, you can verify that the environment variables are correctly set in your development environment. If they don't match up, go back to the previous code cell and make the necessary corrections.


```python
%%script bash

# Extract saved variables
source /tmp/variables.sh

# Output shown title and value variables
echo "Project dir: $project_dir"
echo "Project: $project"
echo "Repo: $project_repo"
```

## Project Setup and Analysis with Bash Scripts
The bash scripts that follow automate what was done in the Tools Installation procedures with regards to cloning a GitHub project. Doing this in a script fashion adds the following benefits:

- After completing these steps, we will have notes on how to set up and verify a project.
- By reviewing these commands, you will start to learn the basics of Linux.
- By setting up these code cells, you will be learning how to develop automated scripts using Shell programming.
- You will learn that pretty much anything we type on a computer can be automated through the use of variables and a coding language.

### Pull Code

> Pull code from GitHub to your machine. This is a **bash script**, a sequence of commands, that will create a project directory and add the "project" from GitHub to the vscode directory. There is conditional logic to make sure that the clone only happens if it does not (!) exist. Here are some key elements in this code:

- `cd` command (change directory), remember this from the terminal session.
- `if` statements (conditional statements, called selection statements by College Board), code inside only happens if the condition is met.

Run the script two times and you will see that the output changes.  In the second run, the files exist and it impact the flow of the code.


```python
%%script bash

# Extract saved variables
source /tmp/variables.sh

echo "Using conditional statement to create a project directory and project"

cd ~    # start in home directory

# Conditional block to make a project directory
if [ ! -d $project_dir ]
then 
    echo "Directory $project_dir does not exist... making directory $project_dir"
    mkdir -p $project_dir
fi
echo "Directory $project_dir exists." 

# Conditional block to git clone a project from project_repo
if [ ! -d $project ]
then
    echo "Directory $project does not exist... cloning $project_repo"
    cd $project_dir
    git clone $project_repo
    cd ~
fi
echo "Directory $project exists."
```

### Look at Files in GitHub Project

> All computers contain files and directories. The clone brought more files from the cloud to your machine. Review the bash shell script, observe the commands that show and interact with files and directories. These were used during setup.

- `ls` lists computer files in Unix and Unix-like operating systems.
- `cd` offers a way to navigate and change the working directory.
- `pwd` prints the working directory.
- `echo` is used to display a line of text/string that is passed as an argument.


```python
%%script bash

# Extract saved variables
source /tmp/variables.sh

echo "Navigate to project, then navigate to area wwhere files were cloned"
cd $project
pwd

echo ""
echo "list top level or root of files with project pulled from github"
ls

```

### Look at File List with Hidden and Long Attributes

> Most Linux commands have options to enhance behavior. The enhanced listing below shows permission bits, owner of the file, size, and date.

Some useful `ls` flags:
- `-a`: List all files including hidden files.
- `-l`: List in long format.
- `-h`: Human-readable file sizes.
- `-t`: Sort by modification time.
- `-R`: Reverse the order of the sort.

[ls reference](https://www.rapidtables.com/code/linux/ls.html)


```python
%%script bash

# Extract saved variables
source /tmp/variables.sh

echo "Navigate to project, then navigate to area wwhere files were cloned"
cd $project
pwd

echo ""
echo "list all files in long format"
ls -al   # all files -a (hidden) in -l long listing
```


```python
%%script bash

# Extract saved variables
source /tmp/variables.sh

echo "Look for posts"
export posts=$project/_posts  # _posts inside project
cd $posts  # this should exist per fastpages
pwd  # present working directory
ls -lR  # list posts recursively
```


```python
%%script bash

# Extract saved variables
source /tmp/variables.sh

echo "Look for notebooks"
export notebooks=$project/_notebooks  # _notebooks is inside project
cd $notebooks   # this should exist per fastpages
pwd  # present working directory
ls -lR  # list notebooks recursively
```


```python
%%script bash

# Extract saved variables
source /tmp/variables.sh

echo "Look for images, print working directory, list files"
cd $project/images  # this should exist per fastpages
pwd
ls -lR
```

### Look inside a Markdown File
> "cat" reads data from the file and gives its content as output


```python
%%script bash

# Extract saved variables
source /tmp/variables.sh

echo "Navigate to project, then navigate to area wwhere files were cloned"

cd $project
echo "show the contents of README.md"
echo ""

cat README.md  # show contents of file, in this case markdown
echo ""
echo "end of README.md"

```

## Env, Git, and GitHub

> Env(ironment) is used to capture things like the path to the Code or Home directory. Git and GitHub are not only used to exchange code between individuals but are also often used to exchange code through servers, in our case for website deployment. All tools we use have behind-the-scenes relationships with the system they run on (MacOS, Windows, Linux) or a relationship with servers to which they are connected (e.g., GitHub). There is an "env" command in bash. There are environment files and setting files (e.g., `.git/config`) for Git. They both use a key/value concept.

- `env` shows settings for your shell.
- `git clone` sets up a directory of files.
- `cd $project` allows the user to move inside that directory of files.
- `.git` is a hidden directory that is used by Git to establish a relationship between the machine and the Git server on GitHub.


```python
%%script bash

# This command has no dependencies

echo "Show the shell environment variables, key on left of equal value on right"
echo ""

env
```


```python
%%script bash

# Extract saved variables
source /tmp/variables.sh

cd $project

echo ""
echo "show the secrets of .git config file"
cd .git
ls -l config

echo ""
echo "look at config file"
cat config
```

## Advanced Shell project

> This example was requested by a student (Jun Lim, CSA). The request was to make a Jupyter file using bash; I adapted the request to markdown. This type of thought will have great extrapolation to coding and possibilities of using Lists, Arrays, or APIs to build user interfaces. JavaScript is a language where building HTML is very common.

> To get more interesting output from the terminal, this will require using something like mdless (https://github.com/ttscoff/mdless). This enables seeing markdown in rendered format.
- On Desktop [Install PKG from MacPorts](https://www.macports.org/install.php)
- In Terminal on MacOS
    - [Install ncurses](https://ports.macports.org/port/ncurses/)
    - ```gem install mdless```
    
> Output of the example is much nicer in "Jupyter"

This is starting the process of documentation.


```python
%%script bash

# This example has an error in VSCode; it runs best on Jupyter
cd /tmp

file="sample.md"
if [ -f "$file" ]; then
    rm $file
fi

# Create a markdown file using tee and here document (<<EOF)
tee -a $file >/dev/null <<EOF
# Show Generated Markdown
This introductory paragraph and this line and the title above are generated using tee with the standard input (<<) redirection operator.
- This bulleted element is still part of the tee body.
EOF

# Append additional lines to the markdown file using echo and redirection (>>)
echo "- This bulleted element and lines below are generated using echo with standard output (>>) redirection operator." >> $file
echo "- The list definition, as is, is using space to separate lines. Thus the use of commas and hyphens in output." >> $file

# Define an array of actions and their descriptions
actions=("ls,list-directory" "cd,change-directory" "pwd,present-working-directory" "if-then-fi,test-condition" "env,bash-environment-variables" "cat,view-file-contents" "tee,write-to-output" "echo,display-content-of-string" "echo_text_>\$file,write-content-to-file" "echo_text_>>\$file,append-content-to-file")

# Loop through the actions array and append each action to the markdown file
for action in ${actions[@]}; do
  action=${action//-/ }  # Convert dash to space
  action=${action//,/: } # Convert comma to colon
  action=${action//_text_/ \"sample text\" } # Convert _text_ to "sample text", note escape character \ to avoid "" having meaning
  echo "    - ${action//-/ }" >> $file  # Append action to file
done

echo ""
echo "File listing and status"
ls -l $file # List file details
wc $file   # Show word count
mdless $file  # Render markdown from terminal (requires mdless installation)

rm $file  # Clean up temporary file
```

## Display Shell commands help using `man`

> The previous example used a markdown file to store a list of actions and their descriptions. This example uses the `man` command to generate a markdown file with descriptions of the commands. The markdown file is then displayed using `mdless`.

In coding, we should try to get data from the content creators instead of creating it on our own. This approach has several benefits:
- **Accuracy**: Descriptions from `man` pages are authoritative and accurate, as they come directly from the documentation provided by the command's developers.
- **Consistency**: Automatically generating descriptions ensures consistency in formatting and terminology.
- **Efficiency**: It saves time and effort, especially when dealing with a large number of commands.
- **Up-to-date Information**: `man` pages are regularly updated with the latest information, ensuring that the descriptions are current.


```python
%%script bash

# This example has an error in VSCode; it runs best on Jupyter
cd /tmp

file="sample.md"
if [ -f "$file" ]; then
    rm $file
fi

# Set locale to C to avoid locale-related errors
export LC_ALL=C

# Create a markdown file using tee and here document (<<EOF)
tee -a $file >/dev/null <<EOF
# Show Generated Markdown
This introductory paragraph and this line and the title above are generated using tee with the standard input (<<) redirection operator.
- This bulleted element is still part of the tee body.
EOF

# Append additional lines to the markdown file using echo and redirection (>>)
echo "- This bulleted element and lines below are generated using echo with standard output (>>) redirection operator." >> $file
echo "- The list definition, as is, is using space to separate lines. Thus the use of commas and hyphens in output." >> $file

# Define an array of commands
commands=("ls" "cat" "tail" "pwd" "env" "grep" "awk" "sed" "curl" "wget")

# Loop through the commands array and append each command description to the markdown file
for cmd in ${commands[@]}; do
  description=$(man $cmd | col -b | awk '/^NAME/{getline; print}')
  echo "    - $description" >> $file
done

echo ""
echo "File listing and status"
ls -l $file # List file details
wc $file   # Show word count
mdless $file  # Render markdown from terminal (requires mdless installation)

rm $file  # Clean up temporary file
```
