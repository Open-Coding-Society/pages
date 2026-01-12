---
toc: True
breadcrumb: True
layout: post
data: tools
title: GitHub Pages Setup 
description: A key to learning in this class is understanding how to make a GitHub Pages project.  This guide will setup and run the project.  At the end, you will have a student Website that can be used for blogging classroom learnings and progress.
categories: ['DevOps']
author: Lily Wu
permalink: /tools/old/github_pages
breadcrumbs: True 
---

## Installation Hack

New plan... Start with [VSCode Online](https://vscode.dev/).   The objective is to do some edits before tools install and get the actions working without the dependency of start with tools.

Everything below needs to be restructured and ensure it is not duplicated in future sections.

-------

Welcome to your journey of creating your own blogging website! This setup process will guide you through working in a Linux terminal, managing folders, cloning a project, adding packages, and embarking on the `Software Development Lifecycle (SDLC)`. This is a fundamental skill for any developer, and while it may seem challenging at first, remember that every expert was once a beginner. Let's dive in and conquer this iconic struggle together!

## Visual Representation of the Workflow

Development journey begins with a lot of setup. After these initial steps, we are able to focus on the SDLC. The early steps are only done at the beginning and when you update Tool versions. The SDLC is the part of the process that is repeated as you work on code.

```text
+-------------------+       +-------------------+       +-------------------+       +-------------------+       +-------------------+
|                   |       |                   |       |                   |       |                   |       |                   |
|  Linux Terminal   | ----> |  Shell Commands   | ----> |   Clone Project   | ----> |  Package Manager  | ----> |       SDLC        |
|                   |       |                   |       |                   |       |                   |       |                   |
+-------------------+       +-------------------+       +-------------------+       +-------------------+       +-------------------+
        |                           |                           |                           |                            |
        |                           |                           |                           |                            |
        v                           v                           v                           v                            v
  Open Terminal              Terminal/VSCode               Clone the project          Set up and configure       Establish a development
                             Files and Folders              repository from            the tools required              workflow 
                                Management                  version control             (Ruby, Python)               (SDLC) phases
```

### Shell Commands

Throughout this installation procedure, you will use various shell commands specific to your machine. Take note and describe the type of shell commands you are using through Terminal.

You are expected to identify your computer type, know its operating system, and manage folders and files effectively. Each computer type—Windows/WSL, MacOS, and Chromebook using KASM student workspace—provides an option for a Terminal. As you proceed, you will be running Linux shell commands in your Terminal.

- **Take note and describe the type of shell commands you are using through Terminal in this installation procedure.**
  - Linux: `ls`, `pwd`, `mkdir`, `cd`, `git`, `cat`
  - Windows: `wsl`
- Explore or research Linux shell commands such as pwd, mkdir, cd, etc.
- Use Google or Chat tools for questions like "What is Linux cd?"
- Learn how to open a Terminal and navigate to your project


### Version Control Commands

Version control is essential for managing changes to your code. Learn these commands to interact with your code repository from the terminal. The command line tools are valuable to learn, but using VSCode these tools can be done through the application's User Interface (UI).

- **git clone**: Make a working copy of a git repository from the cloud to your local machine.
- **git pull**: Update your local copy of the repository with changes from the cloud repository.
- **git commit**: Save changes to files in your local repository.
- **git push**: Send updates from your local repository to the remote repository.

### Package Manager Commands 

A package manager is essential for installing key developer tools and packages, such as Python, Java, and various frameworks for web development, databases, and data science.

Here are some commands and references to assist you during the Tools Setup procedures.

#### Ubuntu, for WSL and KASM workspace users (apt-get or apt)

- **Update package list:** `sudo apt update`
- **Upgrade installed packages:** `sudo apt upgrade`
- **Install a package:** `sudo apt install <package_name>`
- **Remove a package:** `sudo apt remove <package_name>`
- **Search for a package:** `apt search <package_name>`
- **List installed packages:** `apt list --installed`

#### MacOS users (brew)

- **List installed packages:** `brew list`
- **Search for a package:** `brew search <package_name>`
- **Update Homebrew:** `brew update`
- **Upgrade installed packages:** `brew upgrade`
- **Uninstall a package:** `brew uninstall <package_name>`

---


## Windows Setup

Windows Subsystem for Linux (WSL) provides a Linux terminal environment on a Windows computer. Linux is an open-source operating system with many distributions, such as Ubuntu Linux, which we will install and use. Once we install Ubuntu Linux, we will be able to run Linux/Unix commands. Ubuntu includes a package manager called `apt` that allows us to add developer packages and libraries to the machine.

To get started, download WSL and Ubuntu 24.04:

1. Type `wsl -l -o` to see a listing of WSL options for installation.

2. Open PowerShell as an administrator (Right-click -> Run as administrator) and type: `wsl --install -d Ubuntu-24.04`  

3. Be sure to watch for a prompt, asking for a username. Enter a username and password to create your account. Note, that the password will not be visible as you type, but it is still being registered.
  
    If no prompt opens, open PowerShell as an administrator and run: `wsl --install -d Ubuntu-24.04`

4. Open Command Prompt or PowerShell as a regular user (just click on Command Prompt or PowerShell), and type `wsl`. The terminal's prompt should change from `PS C:\Users\<username>` to `<username>@MSI:`. You are now ready to use Linux/Unix commands.

5. To set Ubuntu 24.04 as the default WSL distribution, run: `wsl --set-default Ubuntu-24.04`

### WSL (Reference, shows WSL commands)

As a WSL user, refer to these PowerShell commands for troubleshooting or configuration changes. These are used to correct or set up WSL, thus all WSL commands work at the PowerShell prompt `PS C:\Users\<username>`.

- **List all WSL commands:** `wsl -h` or `wsl -help`
- **List installable WSL distros:** `wsl -l -o`
- **List installed WSL distros:** `wsl -l` or `wsl --list`
- **List installed WSL distros with status and version:** `wsl -l -v` or `wsl -l --verbose`
- **Run the default WSL distro:** `wsl`
- **Run an alternate distro:** `wsl -d <distro_name>` or `wsl --distribution <distro_name>`
- **Shutdown a specific distro:** `wsl -t <distro_name>` or `wsl --terminate <distro_name>`
- **Shutdown all distros:** `wsl --shutdown`
- **Set a specific distro as default:** `wsl -s <distro_name>` or `wsl --set-default <distro_name>`

### WSL VSCode Install

VS Code provides a place to create and edit code. Follow the steps below to download VS Code onto your computer.

1. Install [VS Code](https://code.visualstudio.com/)

2. When the installer asks to Select Additional Tasks, check "Add to PATH".

3. Open VS Code. In the sidebar, click on "Extensions". Search for "Remote Development extension pack" and install it.

---

## MacOS Setup
VS Code provides a place to create and edit code. Homebrew is a package manager that simplifies the installation of developer tools.

### MacOS VSCode and Homebrew Install

MacOS terminal supports Linux/Unix commands by default. To enhance its capabilities, we need to install Homebrew.

1. **Install VS Code:**
   - Download and install [VS Code](https://code.visualstudio.com/docs/setup/mac).

2. **Install Homebrew:**
   - Open the Terminal and run the following command to install Homebrew:
     ```sh
     /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
     ```
   - Follow the on-screen instructions to complete the installation.

3. **Verify Homebrew Installation:**
   - Run `brew --version` in the Terminal to ensure Homebrew is installed correctly.

---

## Install Developer Tools

Obtain pages repository.

```bash
cd
mkdir open 
cd open 
git clone https://github.com/open-coding-society/pages.git
```

### KASM Workspace using Ubuntu terminal

```bash
#  Most tools have been pre-installed. Run shell command to automatically finish tool setup.
cd
cd open/pages
pagesenv
bundle installl
```

---

<br>


### Windows Subsystem for Linux using Ubuntu terminal


```bash
# Run shell command to automatically install all your tools.
cd
cd open/pages/scripts
./activate_ubuntu.sh

```

---

<br>


### MacOS terminal

```bash
#  Run shell command to automatically install all your tools. 
cd
cd open/pages/scripts
./activate_macos.sh
```

Custom MacOS steps to simplify python access

```bash
##### All Apple, resolves failure on make step
ln -sF /opt/homebrew/share/jupyter/nbconvert ~/Library/Jupyter

##### Only Apple Silicon M series, resolves Failure on python and pip
sudo ln -sF /opt/homebrew/bin/python3.12 /usr/local/bin/python
sudo ln -sF /opt/homebrew/bin/pip3.12 /usr/local/bin/pip

###### Only Apple Intel series, resolves failure on python and pip
sudo ln -sF /usr/local/bin/python3.12 /usr/local/bin/python
sudo ln -sF /usr/local/bin/pip3.12 /usr/local/bin/pip
```

---

<br>

## Version Checks 

From here the steps should behave the same for all.  

1. **Close existing terminal!!!**
2. Then start a new terminal.  Start and stop are required to make sure changes to you machine have taken effect.
3. Run each check below, if the check does not work, you will need to backup to resolve it now!!!

```bash
# Show the active Ruby version, it needs to be 3 or higher
ruby -v
# Bundler version, it is part of Ruby install
bundle -v

# Show active Python version, it needs to be 3.10 or better
python --version

# Show Jupyter packages, nbconvert needs to be in the list of installed
jupyter --version
```
---

## Git identification

**Setup personal GitHub variables:** Change `youremail@gmail.com` and `yourGHID` to match your credentials. This is required prior to syncing code to GitHub. These configurations ensure that your commits are associated with your GitHub account, which is important for tracking contributions and collaboration.

1. **Set your email address**: This email should be the same one associated with your GitHub account.
```bash
git config --global user.email youremail@gmail.com
```

2. **Set your GitHub user.name**: This should be your GitHub ID.
```bash
git config --global user.name yourGHID 
```

After running these commands, you can verify the configurations by running:
```bash
git config --global --list
```

This will display a list of your global Git configurations, including the email and username you just set. If there is any errors repeat the `git config` commands.

---

## Starting a Project 
The following commands are the same for all machine types, terminals, and projects. The previous installation steps were to ensure all machine types had compatible tools.

Follow the steps in order.

1. **Open a Linux-supported Terminal**

2. **Move to your home directory:**
```bash
cd
```

3. **Setup a directory for projects:**
```bash
mkdir -p open
cd open 
git clone https://github.com/open-coding-society/student_2025.git
```

4. **Prepare project prior to opening VS Code:**
```bash
# move to project directory
cd student_2025
# make virtual environment by script
scripts/venv.sh
# activate virtual environment, observe prompt change after running it
source venv/bin/activate
# install python packages for project 
pip install -r requirements.txt
# show Kernels, python3 needs must be in the list
jupyter kernelspec list
# install gems (Ruby packages), required for Jekyll requirements in GitHub Pages
bundle install
# open VSCode
code .
```

5. At this point or in near future, you may be asked to authenticate with GitHub. Follow the dialog and instructions. A keyring may also appear; be sure to authenticate. Using credentials similar to GitHub should be OK.

6. **WSL only!!!** Very important!!! Check that VSCode is opened in WSL, observe at the bottom left corner of the window. This is a requirement for success!!!

    ![wsl]({{ site.baseurl }}/images/notebooks/foundation/wsl.jpg)

---

<br>

## Software Development Life-Cycle

The development cycle involves iterative steps of running the server, making changes, testing, committing, and syncing changes to GitHub.

```text
+-------------------+       +-------------------+       +-------------------+       +-------------------+       +-------------------+
|                   |       |                   |       |                   |       |                   |       |                   |
|    Run Server     | ----> |   Make Changes    | ----> |     Test          | ----> |    Commit         | ----> |     Sync          |
|                   |       |                   |       |                   |       |                   |       |                   |
+-------------------+       +-------------------+       +-------------------+       +-------------------+       +-------------------+
        |                           |                           |                           |                           |
        |                           |                           |                           |                           |
        v                           v                           v                           v                           v
 Start Local Server           Edit Code Files            Verify Changes             Save Changes Locally        Push Changes to Remote
 ```

###  Open Project and Make

All students are building a GitHub Pages website.  These steps get your website running on your desktop (local or cloud).

1. Open a terminal 

2. Type `cd ~/open/portfolio/student_2025`

3. Activate virtual environment `source venv/bin/activate`

4. Open VSCode `code .`

5. Open a VSCode Terminal

6. Type `make` This runs a build to a local server. Repeat this command as often as you make changes.

7. Hover then Cmd or Ctl Click on the Server address **<http://127.0.0.1> ...** provided in the terminal output from the make command.

```bash
### Congratulations!!! An output similar to below means tool and equipment success ###
johnmortensen@Johns-MBP pages % make
Stopping server...
Stopping logging process...
Starting server...
Server PID: 48190
Terminal logging starting, watching server...
Server started in 3 seconds
Configuration file: /Users/johnmortensen/vscode/pages/_config.yml
To use retry middleware with Faraday v2.0+, install `faraday-retry` gem
            Source: /Users/johnmortensen/vscode/pages
       Destination: /Users/johnmortensen/vscode/pages/_site
 Incremental build: disabled. Enable with --incremental
      Generating... 
      Remote Theme: Using theme jekyll/minima
                    done in 2.493 seconds.
 Auto-regeneration: enabled for '/Users/johnmortensen/vscode/pages'
    Server address: http://127.0.0.1:4100/pages/
```

#### Make workflow (local build: make, make clean, make stop, make convert)

These commands are used to build and manage a localhost version of the website. The purpose of this is to verify and test code changes prior to pushing changes to GitHub Pages.

- `make`: Runs the local server.

- `make clean`: Stops the local server and cleans the files.

- `make stop`: Stops the local server. This means you will be unable to access your blog on <http://localhost> until you run `make` again.

- `make convert`: Converts Jupyter Notebook files. Run this if your `.ipynb` files are not updating on the server; it may assist in finding the error.

### VSCode Commit and Sync Workflow

All students will be writing and changing code.  These steps allow you to change the website, first locally and then on public location.

```text
+-------------------+       +-------------------+       +-------------------+       +-------------------+
|                   |       |                   |       |                   |       |                   |
|   VS Code Editor  | ----> |   Local Git Repo  | ----> |   Remote GitHub   | ----> |   GitHub Pages    |
|                   |       |                   |       |                   |       |                   |
+-------------------+       +-------------------+       +-------------------+       +-------------------+
        |                           |                           |                           |
        |                           |                           |                           |
        v                           v                           v                           v
    Save Files                Commit Changes               Sync Changes                Public Website
   Local Website
```

#### Detailed Steps

1. Save Files in VS Code:
- Edit your files.
- Save the changes (Cmd + S on Mac or Ctrl + S on Windows/Linux).
- Verify changes on desktop webserver.

2. Commit Changes in VS Code:
- Click on the "Source Control" icon in the left sidebar.
- Stage your changes by clicking the plus sign next to the files.
- Enter a commit message.
- Click the "Commit" button.

3. Sync Changes to GitHub:
- Click the "Sync Changes" button in the Source Control view.
- This pushes your local commits to the remote GitHub repository.

4. Update GitHub Pages:
- GitHub Pages automatically rebuilds your site with the latest changes.
- Visit your public website at https://<yourGitHubID>.github.io/student_2025 to see the updates.
