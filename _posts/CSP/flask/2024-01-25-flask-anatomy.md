---
layout: post
title: Anatomy of Python Flask
description: A discussion of key elements in a Python Flask backend project.  This includes preparing a project for deployment.
categories: [Python Flask]
permalink: /flask-anatomy
menu: nav/flask.html
toc: True
---

## Getting Started with Anatomy

In order to get started you need to learn the parts of the system, you get started you will need to  ...

- Review the README.md to add additional support this lesson.  
- Developing a home page.
- Learn lifecyle of code, run local server test, and then sync to deploy to GitHub Pages.
- Learn the tools you have setup.


## Files and Directories in this Project
> These are some of the key files and directories in this project. Understanding these files will speed up your development.  

- `README.md`: This file contains instructions for setting up the necessary tools and cloning the project. A README file is a standard component of all properly set up GitHub projects.

- `requirements.txt`: This file lists the dependencies required to turn this Python project into a Flask/Python project. It may also include other backend dependencies, such as dependencies for working with a database.

- `main.py`: This Python source file is used to run the project. Running this file starts a Flask web server locally on localhost. During development, this is the file you use to run, test, and debug the project.

- `Dockerfile` and `docker-compose.yml`: These files are used to run and test the project in a Docker container. They allow you to simulate the project's deployment on a server, such as an AWS EC2 instance. Running these files helps ensure that your tools and dependencies work correctly on different machines.

- `instances`: This directory is the standard location for storing data files that you want to remain on the server. For example, SQLite database files can be stored in this directory.  Files stored in this location will persist after web application restart, everyting outside of instances will be recreated at restart.

- `static`: This directory is the standard location for files that you want to be cached by the web server. It is typically used for image files (JPEG, PNG, etc.) or JavaScript files that remain constant during the execution of the web server.

- `api`: This directory contains code that receives and responds to requests from external servers. It serves as the interface between the external world and the logic and code in the rest of the project.

- `model`: This directory contains files that implement the backend functionality for many of the files in the api directory. For example, there may be files in the model directory that directly interact with the database.

- `templates`: This directory contains files and subdirectories used to support the home and error pages of the website.

- `.gitignore`: This file specifies elements to be excluded from version control. Files are excluded when they are derived and not considered part of the project's original source. In the VSCode Explorer, you may notice some files appearing dimmed, indicating that they are intentionally excluded from version control based on the rules defined in .gitignore.

Please note that there are many other key files and directories in a Flask Python backend server, but we will highlight them as the development progresses.


### Dockerfile and docker-compose.yml
> Make sure your docker files are created using these examples.  These files are the best way to determine if your web application is ready for deployment.

Examining and understanding these files will help you understand a great deal about the requirement of your project.

- Dockerfile 
    - a python environment is used as or deployment container, check the version
    - python3-pip is installed, as pip is the package manager
    - requirement.txt is used to update project dependencies in the container
    - gunicorn is used to run a production version of python/flask, in this configuration 3 workers or 3 instances of the server are run.  This balances load.
    - main:app means the main.py is the primary file and app contains server configuration
    
- docker-compose.yml
    - image name the docker container
    - port declares address for web application on web server
    - volumes declares that the instance directory contains persistant data
    - restart tells web applciation to come back up if something like power outage or reboot takes down web server



```java
FROM docker.io/python:3.11

WORKDIR /

# --- [Install python and pip] ---
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y python3 python3-pip git
COPY . /

RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

ENV GUNICORN_CMD_ARGS="--workers=3 --bind=0.0.0.0:8080"

EXPOSE 8080

CMD [ "gunicorn", "main:app" ]
```


```java
version: '3'
services:
        web:
                image: flask_port_v1 # Change the image name to something unique to your project, aka my_unique_name_v1
                build: .
                ports:
                        - "8---:8080" # Edit the number on the left to match the port you selected
                volumes:
                        - ./volumes:/volumes
                        - ./instance:/instance
                restart: unless-stopped
```

### Time to Review the README

Open the README of the Flask project and read through it. The README is your starting point for understanding and developing the project. It provides essential information and instructions. Note that some familiarity with tools like Python, GitHub, and code editors (e.g., VSCode) is assumed.

If you have support need on this Project, be sure to add Utterance to the bottom of this or other articles in the Flask Intro series. Here is the [Issues Link](https://github.com/open-coding-society/flask_2025/issues) for searching, reviewing, and tracking progress on yours and others comments.

#### Standards and Practices for a Good README

A well-crafted README typically includes the following sections:

1. **Project Title**: Clearly state the name of the project.
2. **Description**: Provide a brief overview of what the project does and its purpose.
3. **Installation Instructions**: Step-by-step guide on how to set up the project locally.
4. **Usage**: Examples and instructions on how to use the project.
5. **History**: A brief summary of recent developments in the project. This high-level summary is helpful for understanding the project's evolution as it is often hard to determine from individual commits.

By following these standards and practices, you ensure that your README is informative and helpful to anyone who wants to understand or contribute to your project.
