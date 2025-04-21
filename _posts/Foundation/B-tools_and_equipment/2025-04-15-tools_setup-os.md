---
toc: True
layout: post
data: tools
title: Operating System and Tools Setup 
description: Significant setup is required for development tools to support the Operating System, JavaScript, Python, Java, Jupyter Notebooks, and more. This is the first step in the development process.
categories: ['DevOps']
author: Lily Wu
permalink: /tools/os
breadcrumb: True 
---

## Installation Hack

Welcome to your journey of setting up your Operating System and Tools! This setup process will guide you through working in a Linux terminal, managing folders, cloning a project, and adding packages. This is a fundamental skill for any developer or cyber security expert. While it may seem challenging at first, remember that every expert was once a beginner. Let's dive in and conquer this iconic struggle together!

## Visual Representation of the Workflow

The development journey begins with a lot of setup. After these initial steps, we are able to focus on the Software Development Life Cycle (SDLC). The early steps are only done at the beginning and when you update tool versions. The SDLC is the part of the process that is repeated as you work on code.

```text
+-------------------+       +-------------------+       +-------------------+       +-------------------+       +-------------------+
|                   |       |                   |       |                   |       |                   |       |                   |
|  Linux Terminal   | ----> |  Shell Commands   | ----> |   Clone Project   | ----> |  Package Manager  | ----> |       SDLC        |
|                   |       |                   |       |                   |       |                   |       |                   |
+-------------------+       +-------------------+       +-------------------+       +-------------------+       +-------------------+
        |                           |                           |                           |                            |
        v                           v                           v                           v                            v
  Open Terminal              Terminal/Folder Mgmt         Clone the project          Set up and configure       Establish a development
                             Files and Folders            repository from            the tools required              workflow 
                                Management                version control             (Ruby, Python)               (SDLC) phases
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
mkdir opencs 
cd opencs 
git clone https://github.com/open-coding-society/pages.git
```

### KASM Workspace using Ubuntu terminal

```bash
#  Most tools have been pre-installed. Run shell command to automatically finish tool setup.
cd
cd opencs/portfolio_2025/scripts
./activate.sh 
```

---

<br>


### Windows Subsystem for Linux using Ubuntu terminal


```bash
# Run shell command to automatically install all your tools.
cd
cd opencs/portfolio_2025/scripts
./activate_ubuntu.sh

```

---

<br>

### MacOS terminal

```bash
#  Run shell command to automatically install all your tools. 
cd
cd opencs/portfolio_2025/scripts
./activate_macos.sh
```

#### Custom MacOS steps to simplify python access

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
