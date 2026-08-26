## OCS Development Environment Orchestrator

### Project Overview

New students entering OCS must configure a local software development environment before they can participate effectively in software projects.

OCS already provides walkthroughs, scripts, documentation, peer support, and teacher assistance. The problem is not a lack of resources. The problem is that the current process provides limited visibility into what is actually happening in each student's onboarding experience.

Students tend to skip instructions, continue after an error, become stuck without reporting the problem, or move ahead before prerequisite tools are working. Teachers often do not know that a student is stuck until significant time has passed.

The goal of this project is to transform onboarding and development-environment setup from a collection of instructions into a **gamified, orchestrated, observable, feedback-driven learning process**.

The existing OCS onboarding game provides an experimental foundation for this approach. The game was originally developed to explore capability-based interactions, but was not originally designed as a complete onboarding and development-environment system. This project proposes extending that existing capability into an orchestrated progression system.

```text
                    OCS ONBOARDING

┌─────────────────────────────────────────────┐
│                 IDENTITY FORGE              │
│                                             │
│  Establish yourself in OCS                  │
│  • OCS account                              │
│  • GitHub identity                          │
│  • Persona                                  │
│  • Interests / capabilities                 │
│  • Begin forming team relationships         │
│                                             │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│                 MISSION TOOLS               │
│                                             │
│  Make your computer development-ready       │
│                                             │
│  ✓ Homebrew                                 │
│  ✓ Python                                   │
│  ✓ Ruby                                     │
│  ✓ Git                                      │
│  → GitHub                                   │
│  ○ Repository                               │
│  ○ VS Code                                  │
│  ○ Project Runtime                          │
│                                             │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│                WAYFINDING WORLD             │
│                                             │
│  Learn to work inside the environment       │
│                                             │
│  • Markdown                                 │
│  • CSS                                      │
│  • HTML                                     │
│  • JavaScript                               │
│  • Git workflow                             │
│  • Project structure                        │
│  • Team workflow                            │
│  • Collaboration                            │
│                                             │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
                  TEAM PROJECT
---

### Problem Statement

New students entering OCS must perform task like sign up, setting up a local software development environment, and learning certain coding fundamentals before they can participate effectively in software game or project development. Although OCS and instruction provides walkthroughs, scripts, peer support, and documentation, the current process provides high student frustration and limited visibility into each student's actual progress.

Students frequently skip instructions, continue after errors, become stuck without reporting the problem, or move ahead before prerequisite tools are working. Teachers therefore have little reliable information about **where an individual student is in the onboarding process, what has been verified, and who needs intervention**.

The challenge is to design an OCS system that **orchestrates account activation, development-environment setup, GitHub pages onboarding as a sequence of small, verifiable missions**, while preserving meaningful work for the student.

It is proposed that the system should be gamified and task based to capitalize on students strengths.  Text based procedure simply do not work!

The system should:

- provide immediate feedback with verification and points:
- establish a clear progression in tasks and levels;
- verify successful steps before allowing progression;
- record evidence of student progress;
- support different development environments;
- identify students who are stalled or repeatedly failing via dashboards;
- be able to identify environment regression;
- give teachers timely visibility into individual student needs.

The system should support students working on environments including **macOS, Windows/WSL, and Linux**.

---

Research Question 1 — Identity Forge

How can a gamified onboarding environment help students establish their digital identity, understand their capabilities, and begin forming effective relationships with other OCS developers?

Identity Forge establishes the student's presence within OCS before technical environment setup begins.

Possible evidence includes:

OCS account creation;
GitHub identity;
Persona identity;
Avatar/Scene/Color Preferences
...

The objective is not simply to create an account. It is to begin establishing the student's identity as a participant in a software-development community.

## Research Question 2 - Mission Tools

> How can an orchestrated, feedback-driven onboarding system improve student progression through development-environment setup while giving teachers timely visibility into individual student needs?

Mission Tools focuses on transforming development-environment setup from a long procedural exercise into a sequence of short, verifiable missions.  The student performs an action, receives immediate feedback, and must demonstrate success before progressing.

Initially, evidence may be submitted by the student through generated reports or JSON files. Once Python is available, a lightweight local OCS agent can be installed to reduce manual uploads and provide direct environment evidence.

✓ Homebrew
✓ Python
✓ Ruby
✓ Git
→ GitHub
○ Repository
○ VS Code
○ Project Runtime

## Research Question 3 - Wayfinding World

> How can an interactive, task-based environment help students develop the ability to navigate a software project, use development tools, and collaborate with a team?

This task should be designed as a multiplayer experience.

Start a Task
      ↓
Explore Markdown
      ↓
Explore CSS
      ↓
Explore HTML
      ↓
Explore JavaScript
      ↓
Modify the project
      ↓
Locally make the project
      ↓
Commit the change
      ↓
Push the change
      ↓
Review Actions/Deployment of Change
      ↓
MultiUser
      ↓
Pull/Merge and check a teammate's work
      ↓
Resolve/Adapt to changes
      ↓
Close the Task