# Introduction

Open Coding Society `Pages` is a project designed to support students in their Computer Science and Software Engineering education. It offers a wide range of resources including tech talks, code examples, and educational blogs.

This GitHub Pages repository can be customized by the blogger to support computer science learning as the student works through the pathways of using Javascript, Python/Flask, Java/Spring. It is intended to support course work for Computer Science and Software Engineering (CSSE), AP Computer Science Principles (APCSP or CSP), and AP Computer Science 'A' (APCSA, or CSA).

"Open Coding Society's instructional model is grounded in **Connectivism**, recognizing that learning happens through diverse networks of people, platforms, and AI. OCS is refining `pages` using **Merrill's structure**, deepening learning through **Fink**, ensuring access via **UDL**, and supporting our classroom through **Agile and Design Thinking ceremonies**, with a touch of **Gagné** to focus each classroom day. OCS wants to create projects that support learning for today's digital, open, and connected world."

## Student Requirements

HS students will have the opportunity to create their personal GitHub Pages repository as they progress through their coursework.
In general, students and instructors are expected to use GitHub Pages to build lessons, complete classroom hacks/challenges and perform exploratory work.
Exchange of information from this repository to you personal GitHub Pages can be done in many ways...

1. sharing a file, ie: `wget "raw-link.ipynb"`
2. creating a template from this repository
3. creating a fork to be shared by you and team members
4. etc.

---

## History

This project is in its 4th revision (aka 4.0).

The project was initially based on a project called Fastpages. But this project has diverged from those roots into an independent entity, in fact most things (like the build system), are completely different.  The decision to separate from Fastpages was influenced by it's deprecation by the authors.  It is believed by our community that the authors of Fastpages turned toward the support of Quatro.  After that change of direction Fastpages did not align with the Instructors's goals. Thus, Open Coding Society 'Pages' has more of a raw development and classroom blogging purpose. But, we are grateful to Fastpages for their inspiration.  But, we are grateful to Fastpages for their inspiration.

### License

The Apache license has its roots in Fastpages.  Thus, it carries that license forward.  However, most of the code is likely unrecognizable from those original roots.

### Key Features

- **Code Examples**: Provides practical coding examples in JavaScript, including a platformer game, and frontend code for user databases using Python and Java backends.
- **Educational Blogs**: Offers instructional content on various topics such as developer tools setup, deployment on AWS, SQL databases, machine learning, and data structures. It utilizes Jupyter Notebooks for interactive lessons and coding challenges, often referred to as `hacks`.
- **Tools and Integrations**: Features GitHub actions for blog publishing, Utterances for blog commenting, local development support via Makefile and scripts, and styling with the Minima Theme and SASS. It also includes an Agile Toolkit to assist in Student Teaching, Assignment Tracking, Live Reviews, and more.

### Contributions

- **Notable Contributions**: Highlights significant contributions to the project, including theme development, search and tagging functionality, GitHub API integration, and the incorporation of GitHub Projects into GitHub pages. Contributors such as Tirth Thakker, Mirza Beg, and Toby Ledder have played crucial roles in these developments.

- **Blog Contributions**:  Often students contribute articles and blogs to this project.  Their names are typically listed in the front matter of their contributing post.

---

## GitHub Pages setup

The absolutes in setup up...

**Activate GitHub Pages Actions**: This step involves enabling GitHub Pages Actions for your project. By doing so, your project will be automatically deployed using GitHub Pages Actions, ensuring that your project is always up to date with the latest changes you push to your repository.

- On the GitHub website for the repository go to the menu: Settings -> Pages ->Build
- Under the Deployment location on the page, select "GitHub Actions".

**Update `_config.yml`**: You need to modify the `_config.yml` file to reflect your repository's name. This configuration is crucial because it ensures that your project's styling is correctly applied, making your deployed site look as intended rather than unstyled or broken.

```text
github_repo: "pages" 
baseurl: "/pages"
```

**Set Repository Name in Makefile**: Adjust the `REPO_NAME` variable in your Makefile to match your GitHub repository's name. This action facilitates the automatic updating of posts and notebooks on your local development server, improving the development process.

```make
# Configuration, override port with usage: make PORT=4200
PORT ?= 4500
REPO_NAME ?= pages
LOG_FILE = /tmp/jekyll$(PORT).log
```

### Tool requirements

All `GitHub Pages` websites are managed on GitHub infrastructure and use GitHub version control.  Each time we change files in GitHub it initiates a GitHub Action, a continuous integration and development toolset, that rebuilds and publishes the site with Jekyll.  

- GitHub uses `Jekyll` to transform your markdown and HTML content into static websites and blogs. [Jekyll](https://jekyllrb.com/).
- A Linux shell is required to work with this project integration with GitHub Pages, GitHub and VSCode.  Ubuntu is the preferred shell, though MacOS shell is supported as well.  There will be some key setup scripts that follow in the README.
- Visual Studio Code is the Pages author's preferred code editor and extensible development environment.  VSCode has a rich ecosystem of developer extensions that ease working with GitHub Pages, GitHub, and many programming languages.  Setting up VSCode and extensions will be elaborated upon in this document.
- An anatomy section in this README will describe GitHub Pages and conventions that are used to organize content and files.  This includes file names, key coding files, metadata tagging of blogs, styling tooling for blogs, etc.

### Development Environment Setup

Comprehensive start. A topic-by-topic guide to getting this project running is published [here](https://pages.opencodingsociety.com/tools/).

Quick start.  A quick start below is a reminder, but is dependent on your knowledge.  Only follow this instruction if you need a refresher.  Always default to the comprehensive start if any problem occurs.

#### Clone Repo

Run these commands to obtain the project, then locate into the project directory with the terminal, install an extensive set of tools, and make.

```bash
git clone <this-repo> # git clone https://github.com/open-coding-society/pages.git 
cd <repo-dir>/scripts # cd pages 
```

#### Windows WSL and/or Ubuntu Users

- Execute the script: `./activate_ubuntu.sh`

#### macOS Users

- Execute the script: `./activate_macos.sh`

#### Kasm Cloud Desktop Users

- Execute the script: `./activate_github.sh`

## Run Server on localhost

To preview the project you will need to "make" the project.

### Bundle install

The very first time you clone run project you will need to run this Ruby command as the final part of your setup.

```bash
bundle install
```

### Jupyter Kernels

To run many of the IPYNB files you will need to install Jupyter kernels for the languages you want to use. Here are the most common and recommended kernels:

#### Recommended Kernels

- **Python3** (ipykernel): For Python code cells and most data science workflows.
- **Java** (IJava or jbang-ijava): For Java code cells and Java notebooks.
- **JavaScript** (tslab): For JavaScript code cells and JavaScript notebooks.

#### Installing tslab

First, Install tslab
```
npm install -g tslab
```

Second, confirm it's installed
```
tslab install --version
```

Finally, register it to your Jupyter environment
```
tslab install
```

#### Installing IJava or JBang

**macOS (Homebrew):**

```bash
# For Java kernel (IJava)
brew install coursier
cs install --channel=https://github.com/SpencerPark/IJava/releases/latest/download/channel.json ijava
# Or for jbang-ijava
brew install jbang
jbang app install ijava
```

**Ubuntu/Linux (apt):**

```bash
# For Java kernel (IJava)
sudo apt install coursier
cs install --channel=https://github.com/SpencerPark/IJava/releases/latest/download/channel.json ijava

# Or for jbang-ijava
sudo apt install jbang
# or sudo snap install jbang --classic
jbang app install ijava
```

#### List your installed kernels

```shell
(venv) username@machine path % jupyter kernelspec list
Available kernels:
  python3        /Users/username/Library/Jupyter/kernels/python3
  java           /Users/username/Library/Jupyter/kernels/java
  jbang-ijava    /Users/username/Library/Jupyter/kernels/jbang-ijava
  jslab          /Users/username/Library/Jupyter/kernels/jslab
  tslab          /Users/username/Library/Jupyter/kernels/tslab
```

Recommended Kernels

### Start the Server  

This requires running terminal commands `make`, `make stop`, `make clean`, or `make convert` to manage the running server.  Logging of details will appear in the terminal.   A `Makefile` has been created in the project to support commands and start processes.

Start the server, this is the best choice for initial and iterative development.  Note. after the initial `make`, you should see files automatically refresh in the terminal on VSCode save.

  ```bash
  make
  ```

### Load web application into the Browser

Start the preview server in the terminal,
The terminal output from `make` shows the server address. "Cmd" or "Ctl" click the http location to open the preview server in a browser. Here is an example Server address message, click on the Server address to load:...

  ```text
  http://0.0.0.0:4500/pages/
  ```

### Regeneration of web application

Save on ".ipynb" or ".md" file activiates "regeneration". An example terminal message is below.  Refresh the browser to see updates after the message displays.

  ```text
  Regenerating: 1 file(s) changed at 2023-07-31 06:54:32
      _notebooks/2024-01-04-cockpit-setup.ipynb
  ```

### Other "make" commands

Terminal messages are generated from background processes.  At any time, click return or enter in a terminal window to obtain a prompt.  Once you have the prompt you can use the terminal as needed for other tasks.  Always return to the root of project `cd ~/open/pages` for all "make" actions.

#### Stop the preview server

Stopping the server ends the web server applications running process.  However, it leaves constructed files in the project in a ready state for the next time you run `make`.

  ```bash
  make stop
  ```

### Clean the local web application environment

This command will top the server and "clean" all previously constructed files (ie .ipynb -> .md). This is the best choice when renaming files has created duplicates that are visible when previewing work.

  ```bash
  make clean
  ```

### Observe build errors

Test Jupyter Notebook conversions (ie .ipynb -> .md), this is the best choice to see if an IPYNB conversion error is occurring.

  ```bash
  make convert
  ```

---

## Development Support

### File Names in "_posts", "_notebooks"

There are two primary directories for creating blogs.  The "_posts" directory is for authoring in markdown only.  The "_notebooks" allows for markdown, pythons, javascript and more.

To name a file, use the following structure (If dates are in the future, review your config.yml setting if you want them to be viewed).  Review these naming conventions.

- For markdown files in _posts:
  - year-month-day-fileName.md
    - GOOD EXAMPLE: 2021-08-02-First-Day.md
    - BAD EXAMPLE: 2021-8-2-first-day.md
    - BAD EXAMPLE: first-day.md
    - BAD EXAMPLE: 2069-12-31-First-Day.md

- For Jupyter notebooks in _notebooks:
  - year-month-day-fileName.ipynb
    - GOOD EXAMPLE: 2021-08-02-First-Day.ipynb
    - BAD EXAMPLE: 2021-8-2-first-day.ipynb
    - BAD EXAMPLE: first-day.ipynb
    - BAD EXAMPLE: 2069-12-31-First-Day.ipynb

### Tags

Tags are used to organize pages by their tag the way to add tags is to add the following to your front matter such as the example seen here `categories: [Tools]` Each item in the same category will be lumped together to be seen easily on the search page.

### Search

All pages can be searched for using the built-in search bar. This search bar will search for any word in the title of a page or in the page itself. This allows for easily finding pages and information that you are looking for. However, sometimes this may not be desirable so to hide a page from the search you need to add `search_exclude: true` to the front matter of the page. This will hide the page from appearing when the viewer uses search.

### Navigation Bar

To add pages to the top navigation bar use _config.yml to order and determine which menus you want and how to order them.  Review the_config.yml in this project for an example.

### Blog Page

There is a blog page that has options for images and a description of the page. This page can help the viewer understand what the page is about and what they can expect to find on the page. The way to add images to a page is to have the following front matter `image: /images/file.jpg` and then the name of the image that you want to use. The image must be in the `images` folder. Furthermore, if you would like the file to not show up on the blog page `hide: true` can be added to the front matter.

### SASS support

Pages supports a variety of different themes that are each overlaid on top of minima. To use each theme, go to the "_sass/minima/custom-styles.scss" file and simply comment or uncomment the theme you want to use.

To learn about the minima themes search for "GitHub Pages minima" and review the README.

To find a new theme search for "GitHub Pages Themes".

### Includes

- Pages uses liquid syntax to import many common page elements that are present throughout the repository. These common elements are imported from the _includes directory. If you want to add one of these common elements, use liquid syntax to import the desired element to your file. Here’s an example of the liquid syntax used to import: `{%- include post_list.html -%}` Note that the liquid syntax is surrounded by curly braces and percent signs. This can be used anywhere in the repository.

### Layouts

- To use or create a custom page layout, make an HTML page inside the _layouts directory, and when you want to use that layout in a file, use the following front matter `layout: [your layout here]`.  All layouts will be written in liquid to define the structure of the page.

### Metadata

Metadata, also known as "front matter", is a set of key-value pairs that can provide additional information to GitHub Pages about .md and .ipynb files. This can and probably will be used in other file types (ie doc, pdf) if we add them to the system.

In the front matter, you can also define things like a title and description for the page.  Additional front matter is defined to place content on the "Computer Science Lab Notebook" page.  The `courses:` key will place data on a specific page with the nested `week:` placing data on a specific row on the page.  The `type:` key in "front matter" will place the blog under the plans, hacks(ToDo), and tangibles columns.

- In our files, the front matter is defined at the top of the page or the first markdown cell.

  - First, open one of the .md or .ipynb files already included in either your _posts|_notebooks folder.

  - In the .md file, you should notice something similar to this at the top of the page. To see this in your .ipynb files you will need to double-click the markdown cell at the top of the file.

  ```yaml
  ---
  toc: true
  comments: true
  layout: post
  title: Jupyter Python Sample
  description: Example Blog!!!  This shows code and notes from hacks.
  type: ccc
  courses: { csa: {week: 5} }
  ---
  ```

- The front matter will always have '---' at the top and bottom to distinguish it and each key-value pair will be separated by a ':'.

- Here we can modify things like the title and description.

- The type value will tell us which column this is going to appear under the time box supported pages.  The "ccc" stands for Code, Code, Code.

- The courses will tell us which menu item it will be under, in this case, the `csa` menu, and the `week` tells it what row (week) it will appear under that menu.

## 🌐 Open Coding Society: Instructional Framework

A flexible, inclusive, and modern teaching model grounded in **Connectivism**, with structured learning through **Merrill**, **Fink**, **UDL**, **Agile**, and select **Gagné** elements. This framework prepares learners to thrive in collaborative, networked, AI-augmented environments.

---

### 🌐 Guiding Philosophy: Connectivism

> “Learning is a process of connecting specialized nodes or information sources.” – George Siemens

OCS is grounded in a **Connectivist philosophy**, recognizing that:

- **Knowledge is distributed** across people, platforms, and digital tools
- Students learn by **building and navigating networks** — with peers, mentors, experts, and AI
- **Internet and AI** are not just resources but **learning partners**
- **Decision-making** (what to learn, when to seek help, what tools to use) is a critical skill
- **Diverse collaboration** and **community contribution** are essential for relevant, authentic learning

#### 🌐 Connectivist Practices in OCS education

- Promote **open collaboration** via GitHub, blogs, scrum-team projects and cross-class projects
- Encourage learners to **curate, remix, and build upon** knowledge from global networks
- Teach students to **evaluate digital sources**, verify code, and contribute to public knowledge
- Incorporate **AI tools** for coding, writing, design, reflection, and peer modeling

✅ **Connectivism provides the underlying philosophy** that unifies Merrill’s structure, Fink’s depth, UDL’s accessibility, and Agile’s team-based iteration — all in a digital, networked world.

---

### 🧱 Instructional Core: Merrill’s First Principles of Instruction

> “Make instruction Effective, Efficient, Engaging.”

- **Problem (Anchor):** Begin with a real-world task or problem that students must solve, `pages` is considered launch point project.
- **Activation:** Connect to prior knowledge or personal experience, GitHub OCS contains projects from many years of instruction.
- **Demonstration:** Show examples or models — how it’s done, `pages` has blogs and OCS has many projects to build upon.
- **Application:** Provide practice — guided then independent, OCS learning uses sprints to practice and iterate.
- **Integration:** Encourage students to reflect, share, or transfer skills to new contexts, students are encouraged to add to OCS.

---

### 🌱 Learning Depth: Fink’s Significant Learning

> Emphasize holistic, transformative learning.  These words and associated actions help learners become assets to the Connectivist landscape. 

- **Foundational Knowledge** – Core facts, tools, syntax, concepts
- **Application** – Use of knowledge in projects, analysis, creation
- **Integration** – Connect coding with design, ethics, community
- **Human Dimension** – Team roles, collaboration, self-discovery
- **Caring** – Projects that matter to learners
- **Metacognition** – Learning how to learn, reflect, self-evaluate
- **Intersection** – True learning happens when all areas overlap

---

### ♿️ Access & Inclusion: Universal Design for Learning (UDL)

> Proactively reduce barriers and support diverse learners. OCS maintains social and coding platforms that support UDL thinking (GitHub, YouTube, LinkedIn, X)

- **Multiple Means of Engagement** – Interests, choices, autonomy
- **Multiple Means of Representation** – Videos, code, diagrams, demos
- **Multiple Means of Action & Expression** – Presentations, repos, recordings, blogs

UDL is not a method but a **design lens** to make learning **accessible and meaningful** for all.

---

### 🧭 Structure & Ceremonies: Agile + Design Thinking + Gagné (selective)

> Use classroom **ceremonies** for rhythm, reflection, and real-world alignment.

#### 🎯 Gagné Elements (selective use)

- **Gain Attention** – Start with prompts, demos, tech news, or student input
- **Set Objectives** – Clarify sprint, lesson, or project goals
- **Reflection** – Use reflections and live reviews at the end of lessons/sprints

#### 🧠 Agile & Design Thinking Ceremonies

- **Empathy** – Interviews, personas, build "Point of View" and “How Might We…” prompts
- **Ideation** – Brainstorms, sticky notes, sketches, synthesize
- **Planning** – User stories, task boards (Kanban, GitHub Issues)
- **Sprints** – Iterative cycles with visible progress
- **Standups/PinUps** – Feedback-oriented checkpoints
- **Burndown Charts** – Track group/team/individual progress
- **In-Sprint Checkpoints** – Product Owner reviews, Demo products or features, receive feedback, plan iterations
- **Close-Sprint Assessment** - Rubric close out, learning and competency demonstrations
- **Retrospectives** – Reflect on process and teamwork, next steps

---

## 🔁 Summary of Learning Philosophies

| Layer | Model | Role |
|-------|-------|------|
| **Philosophy** | Connectivism | Foundation – learning is networked, shared, tech-augmented |
| **Core Instruction** | Merrill | Scaffolded, problem-first instruction |
| **Depth & Growth** | Fink | Human, affective, reflective development |
| **Access & Design** | UDL | Inclusive and flexible access to all learners |
| **Workflow & Rhythm** | Agile + Design Thinking + Gagné | Iteration, planning, feedback, reflection ceremonies |
