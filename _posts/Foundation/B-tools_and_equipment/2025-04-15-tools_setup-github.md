---
toc: True
layout: post
data: tools
title: GitHub 
description: This guide will assists as we work through the class together — this is not comprehensive as we will evolve on GitHub collaboration together!
categories: ['DevOps']
permalink: /tools/github
breadcrumb: True 
---

## 🧑‍💻 GitHub Workflow Guide

GitHub is more than just a place to store code — it's where real collaboration happens. In our class, you'll use GitHub to build **your portfolio**, launch **projects**, and collaborate on **lessons**. This guide walks you through the typical use cases.

---

## 🔑 Key GitHub Workflows

Following are some use cases that we expect students will follow during their coursework.

---

### 📘 Reference Repository

A **read-only** public repository used for:

- Cloning to your local machine
- Studying code and structure
- Testing or running locally without contributing back

> 💡 **Example:** The `pages` repository you clone to follow the instructor's lessons. You do **not** make changes or submit contributions to this repository.

---

### 👤 Owner / Collaborator

A repository where **you or your team have direct permissions** to update files and manage the project.

You can:

- Edit files directly
- Push and merge branches
- Use GitHub Actions to publish your site or project

> 💡 **Example:** Your **Portfolio** repository, created from a `student-template` repo. You will:

- Become the **Owner** of your copy
- Update content to reflect your work and progress
- Use GitHub Pages to publish your portfolio website

---

### 🍴 Fork → 🌿 Branch → 📬 Pull Request

Use this workflow when you want to **contribute** to someone else's public repository (like a shared class lesson or team project).

- **Fork**: Copy the repository to your own GitHub account
- **Branch**: Make a new branch to isolate your changes
- **Pull Request (PR)**: Submit your branch to the original repository for review and merging

> 💡 **Example:** You fork the `pages` repository, create a branch like `john-lesson1-contrib`, make updates to a markdown lesson file, and submit a pull request to have your lesson included in the main site.

---

### 🤝 Team Project

When collaborating in groups, you can either:

- **All be collaborators** in one shared repository, or
- Use a **fork-and-pull request model** where one student (the Scrum Master) owns the repository and others contribute via PRs.

#### 👑 Owner / Scrum Master

- Creates the team repository (from a template like `starter_flask`)
- Has **direct permissions** to merge pull requests and manage settings
- Uses GitHub Actions to deploy the app or site to the instructor and community

#### ✍️ Contributors

- Fork the project repository
- Work on the `main` or feature branches
- Submit pull requests to the owner's repository

> 💡 **Example:** Your team makes `starter_flask` from template. One student (Emma) is the **Scrum Master** and manages the main project repo. Other students create branches like `noah-authentication` or `jessica-homepage`, and open PRs to merge their features into the main branch.

---

## 📊 Summary Table

| Use Case       | Source Repo      | Your Role         | Workflow Type        | Contributions     | Publishing         |
|----------------|------------------|--------------------|----------------------|-------------------|--------------------|
| Portfolio      | `student`        | Owner              | Direct (own repo)    | Direct edits      | GitHub Pages       |
| Lesson         | `pages`          | Contributor        | Fork → PR            | Pull requests     | Instructor merges  |
| Project        | `starter_flask`  | Owner              | Clone → Push         | Personal project  | GitHub Pages/API   |
| Team Project   | `starter_flask`  | Scrum/Contributor  | Fork or Collab PR    | Team coordination | GitHub Actions     |
| Reference Code | `pages`          | Reader             | Clone only           | No changes        | Local only         |

---

## ✅ Best Practices

- **Commit messages** should be meaningful:  
  `Add login page and route handling`
- **Never work directly on `main`** unless you're the sole owner
- **Use branches** for features, fixes, or lessons
- **Pull before you push** to avoid merge conflicts
- **Use issues, Kanban boards, and PRs** to organize group work
- **Review PRs** and add feedback before merging
- **Small and Feature-Specific PRs**: Keep pull requests focused on a single feature or fix. This makes reviewing easier and allows for quick rollbacks if something breaks.
