---
title: Crash Course on Building a Flask Server
layout: post
description: Standards-aligned, interactive unit for K–12 students to build a Flask backend and full stack application.
categories: [Python Flask]
permalink: /python/flask/crash-course-build
---


## A. Unit Description

### CSP Trimester 2: Full Stack Development — Sprint 4

**Overview:**

This sprint moves beyond the prototype phase of your Moving West Coast Travel or Digital Famine project. You will transition from a front-end demo to a fully functional full-stack application, integrating a live backend using Python Flask.

The goal is to demonstrate your ability to design, develop, and deploy a web application that includes:

- Persistent data management
- User interaction and authentication
- Dynamic content and performance tracking

These components will fulfill your APCSP Create Performance Task requirements, including code, video, and written reflection.

**Subject and Grade:**  
Computer Science, Grades 10–12

**Delivery Model:**

- Teacher-led demonstrations of Flask server setup and coding
- Students follow along on their own devices, building each component step-by-step
- Peer collaboration and live troubleshooting occurs during demonstration
- Formative checkpoints and group discussions after each major milestone

---

## B. Standards-Based Evaluation & Improvements

### 1. Standard B: Content, Indicator B3

**Digital literacy and communication skills are incorporated and taught as an integral part of the curriculum.**

a. **Current Alignment:**  

- In-person, students practice digital literacy by using command-line tools, GitHub, and VS Code, but communication is mostly verbal or via in-class collaboration.
- *Example:* Students clone a repo and run Flask locally, but may not document their process or communicate progress online effectively.

b. **Improvement for E-Learning:**  

- Create a virtual group in Slack for 6 person team in Slack.  Also, create #announcement and #coding channels for daily communication between Instructor and Students.
- Ensure students participate in Slack by have the students emoji instructional material distribution and perform peer reviews in Slack and commenting on GitHub issues.  
- For a formal peer review, two students will use Microblog feature to capture review directly on Jupyter Notebook to assess meeting Instructor Checkpoint requirements.
- Create required personal portfolio blogging requirements to go with formative, knowledge acquistion phases.  This can be done in Jupyter Notebook that contains foundational learning code cells. 
- Use Pull Requests (PRs) for team integration checkpoint and final review.

c. **Supporting Tool:**  

- Slack, VSCode, GitHub code, GitHub Issues, Kanban Board, and Pull Requests for asynchronous communication and digital literacy practice.

---

### 2. Standard C: Instructional Design, Indicator C8

**The course design provides opportunities for learner-instructor interaction, including opportunities for regular feedback about learner progress.**

a. **Current Alignment:**  

- In-person, feedback is immediate and informal during coding sessions.
- *Example:* Teacher and Teacher Aide circulates and gives real-time help until table teams have ability to progress independently.

b. **Improvement for E-Learning:**  

- Use formative checkpoints in the Jupyter Notebook, with students submitting screenshots and/or code snippets for feedback.
- Schedule regular virtual check-ins or feedback sessions.  
- These sessions would best be done in synchronous 3-person groups where there is a community of Instructor and students with their peer reviewers.  
- Assessments could be done with Scrum master (representative of 3 to 6) and Instructor in Office Hours format (scheduled) if alignment of Students and Instructor is not virtually possibile.  

c. **Supporting Tool:**  

- Jupyter Notebooks with embedded formative tasks and feedback comments.

---

### 3. Standard D: Learner Assessment, Indicator D3

**Assessment practices provide frequent and varied opportunities for self-monitoring and reflection of learning.**

a. **Current Alignment:**  

- In-person, students reflect verbally or in journals, but not always consistently.
- *Example:* End-of-lesson reflections or group discussions/checkpoints where verbal communication assist instructor to see if standards are being achieved.

b. **Improvement for E-Learning:**  

- Add self-check lists, reflection prompts, and peer review tasks in a Jupyter Notebook and on GitHub.  Have milestones that meet expectations of progressive learning.
- Break down project into a Sprint and Four checkpoints.  Progressing toward Fronte End (FE) to Back End (BE) quest addition to Digital Famine or West Coast Travel.
  - Knowledge acquistion (formative).  Weeks 1 and 2, mostly journal and proof of understand of Demos and provided materials.  Individual: Code commits and Issue.
  - Ideation and Integration (formative).  Week 3, showing application of Full-Stack in former Front End (FE) prototype project.  This will show main idea of project and Full Stack (FE) to Back End (BE).  Team: Code commits, Individual PRs to Team Repo, and Issue(s).
  - Working prototype. Week 4, showing working prototype that meeting college board requirements for individual performance taks.  Team and Individual:  Individual Blog on Requirements, Team PR to Instructur Repo.

c. **Supporting Tool:**  

- Embedded Microblog Forms or Jupyter Notebook markdown cells for reflection and self-assessment.

---

### 4. Standard F: Course Technology, Indicator F3

**The course technology allows for customization and personalization.**

a. **Current Alignment:**  

- In-person, students can choose project topics but follow the same technical steps.
- *Example:* All students build the same basic Flask app, but build or adapt APIs to meet their prototype project from Trimester 1 (ie Digital Famine or West Coast Quest frontend).
- Additionally students are expected to build project according to requirements to meeting College Board performance task.

b. **Improvement for E-Learning:**  

- Allow students to personalize their Flask project (e.g., custom API themes, unique endpoints, or UI tweaks).
- Allow student to propose new ideas or modification from their Trimester 1 project. 
- Since teams have been regrouped in different classes in Trimester 2, projects will be a mash down, from 20+ person teams to 6 or 12 person teams.  This project will be a reduction of ideas to their personal favorite concepts.  These smaller projects will be delivered to Instructor repo. 

c. **Supporting Tool:**  

- GitHub branching and project templates, allowing students to fork and customize their own version.
- GitHub PRs (Team) and GitHub Pages blog (CB Requirements) for final submission.

---

### 5. Additional Standard (e.g., Standard E: Accessibility, Indicator E2)

**The course provides alternative means of access to course materials.**

a. **Current Alignment:**  

- In-person, teacher provides help as needed, but materials may not be accessible to all learners.

b. **Improvement for E-Learning:**  

- Ensure all instructions, code, and resources are available in accessible formats (e.g., alt text for images, captions for videos, readable markdown, ability to customize colors/contrast, and providing screen reader compatibility).

c. **Supporting Tool:**  

- Use of accessible Jupyter Notebooks and adherence to web accessibility guidelines.

---


## C. Next Steps & Major Deliverables

The following actionable steps and deliverables will guide your progress through the sprint and ensure alignment with APCSP Create Performance Task requirements:

### 1. Flask Login System

**Focus:** Authentication (cookies, sessions), user profiles, and personalized data.

**Tasks:**

- Implement user registration, login, and logout using Flask sessions.
- Store and retrieve user data (e.g., profile details, quest progress, and achievements).
- Integrate analytics or “quest prediction” tools into each user record to track engagement or outcomes.

**Deliverable:**
A functioning login system connected to your project’s database, enabling individualized experiences.

### 2. Quest Simplification & Experience Design

**Focus:** Refine your quest flow and enhance usability and motivation.

**Tasks:**

- Simplify or redesign your existing quest structure, reducing 20+ steps into 6–8 meaningful stages.
- Apply your best UI/UX ideas to improve clarity and engagement.
- Convert static lessons or activities into interactive challenges — such as code races, timed events, or live competitions.
- Record user performance and outcomes into your database for analytics or leaderboard features.

**Deliverable:**
An interactive, engaging, and data-driven quest experience that demonstrates thoughtful design and backend integration.

### 3. API / Database Design & Admin Interface

**Focus:** Data modeling, CRUD operations, and administrative management tools.

**Tasks:**

- Design a database schema for storing quests, user progress, and results.
- Build Flask routes and API endpoints for data access and updates.
- Create an Admin Dashboard (using Python/Jinja) to view and manage users, quests, and progress.
- Ensure data integrity and security across all operations.

**Deliverable:**
A fully operational backend with a simple yet functional admin UI for managing application data.

---

Other steps:

- Build out each lesson step in the notebook, with formative tasks and checkpoints.
- Use infographics and visual guides to scaffold learning.
- Integrate digital communication and reflection at each stage.
- Provide opportunities for personalization and self-assessment.
