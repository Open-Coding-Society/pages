## OCS Development Environment Orchestrator

### Project Overview

New students entering OCS must configure a local software development environment before they can participate effectively in software projects.

OCS already provides walkthroughs, scripts, documentation, peer support, and teacher assistance. The problem is not a lack of resources. The problem is that the current process provides limited visibility into what is actually happening on each student's computer.

Students may skip instructions, continue after an error, become stuck without reporting the problem, or move ahead before prerequisite tools are working. Teachers often do not know that a student is stuck until significant time has passed.

The goal of this project is to transform development-environment setup from a collection of instructions into an **orchestrated, observable, feedback-driven learning process**.

---

## Problem Statement

New students entering OCS must configure a local software development environment before they can participate effectively in software projects. Although OCS provides walkthroughs, scripts, peer support, and documentation, the current process provides limited visibility into each student's actual progress.

Students frequently skip instructions, continue after errors, become stuck without reporting the problem, or move ahead before prerequisite tools are working. Teachers therefore have little reliable information about **where an individual student is in the setup process, what has been verified, and who needs intervention**.

The challenge is to design an OCS system that **orchestrates development-environment onboarding as a sequence of small, verifiable missions**, while preserving meaningful work for the student.

The system should:

- provide immediate feedback;
- establish a clear progression;
- verify successful steps before allowing progression;
- record evidence of student progress;
- support different development environments;
- identify students who are stalled or repeatedly failing;
- identify environment regression;
- give teachers timely visibility into individual student needs.

The system should support students working on environments including **macOS, Windows/WSL, and Linux**.

---

# Research Question

> **How can an orchestrated, feedback-driven onboarding system improve student progression through development-environment setup while giving teachers timely visibility into individual student needs?**

### Supporting Questions

1. Does breaking environment setup into small, verified checkpoints reduce students continuing after an error?
2. Does immediate feedback increase the likelihood that students complete the next step independently?
3. Can machine-generated environment evidence provide teachers with useful visibility without requiring students to ask for help?
4. Can historical environment data identify stalling, repeated failure, and regression before the teacher observes the problem?
5. What tasks should remain the student's responsibility, and what tasks should be automated?
6. How can the system help students learn professional development practices rather than simply completing an installation procedure?

---

# Design Principle

The system should follow a simple progression loop:

```text
START
  ↓
ACTION
  ↓
CHECK
  ↓
FEEDBACK
  ↓
SUCCESS ─────────→ NEXT MISSION
  │
  └── ERROR ─────→ STOP → RECOVER