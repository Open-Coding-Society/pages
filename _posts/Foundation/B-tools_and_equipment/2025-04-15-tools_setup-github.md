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
---

### 🧪 Practice: Fork and Branch Workflow

Now let's practice the fork and branch workflow with an interactive GitHub simulator.

<div class="github-interface">
    <div class="github-header">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <div style="color: #888; font-size: 0.9em;">github.com</div>
                <div style="margin-top: 5px;"><strong>upstream-user / learning-merge-conflicts</strong></div>
            </div>
            <div id="fork-button-container">
                <div class="fork-button" onclick="forkRepo()">
                    <span style="margin-right: 5px;">⑂</span> Fork
                </div>
            </div>
        </div>
    </div>
    
    <div class="repo-info">
        <div>📄 Public repository</div>
        <div style="margin-top: 5px; color: #888;">A sample repository for learning merge conflicts</div>
    </div>
    
    <div id="fork-status"></div>
</div>

<div class="github-interface" style="margin-top: 30px;">
    <div class="github-header">
        <div style="color: #888; font-size: 0.9em;">github.com</div>
        <div style="margin-top: 5px;"><strong><span id="repo-owner">your-username</span> / learning-merge-conflicts</strong></div>
    </div>
    
    <div style="margin: 15px 0;">
        <div class="branch-selector" onclick="toggleBranchDropdown()">
            <span style="margin-right: 10px;">⎇</span>
            <span id="current-branch">main</span>
            <span style="margin-left: 10px;">▼</span>
        </div>
        
        <div class="branch-dropdown" id="branch-dropdown">
            <div style="padding: 10px; border-bottom: 1px solid #333;">
                <strong>Switch branches/tags</strong>
            </div>
            <div style="padding: 10px;">
                <input type="text" id="branch-input" class="create-branch-input" placeholder="Find or create a branch..." onkeyup="handleBranchInput(event)">
            </div>
            <div id="branch-list" style="max-height: 200px; overflow-y: auto;">
                <div class="branch-item" onclick="switchBranch('main')">
                    <span style="margin-right: 10px;">✓</span> main
                </div>
            </div>
            <div id="create-branch-option" style="display: none; padding: 10px; border-top: 1px solid #333;">
                <div style="color: #888; margin-bottom: 5px;">Create branch:</div>
                <button onclick="createBranch()" style="width: 100%;">Create branch: <span id="new-branch-name"></span></button>
            </div>
        </div>
    </div>
    
    <div id="branch-status"></div>
    
    <div class="file-tree" style="margin-top: 15px;">
        <div style="padding: 10px; border-bottom: 1px solid #333; color: #888;">
            <span id="branch-file-count">3 files</span>
        </div>
        <div class="file-item">📄 README.md</div>
        <div class="file-item">📄 app.js</div>
        <div class="file-item">📄 styles.css</div>
    </div>
</div>

---

## 🔀 Why Resolving Merge Conflicts Matters

Understanding merge conflicts is critical for effective collaboration:

- **Team Collaboration:** Multiple developers often work on the same files simultaneously, leading to conflicting changes that must be reconciled
- **Code Integrity:** Improper conflict resolution can introduce bugs, break functionality, or lose important changes
- **Version Control:** Understanding conflicts helps you better understand how Git tracks and merges changes across branches
- **Professional Development:** Merge conflict resolution is a fundamental skill for any developer working in collaborative environments
- **Workflow Efficiency:** Quick and accurate conflict resolution keeps the development process moving smoothly without blocking team progress

---

## 🎯 Practice: Merge Conflict Resolution

Ready to practice? Work through these interactive merge conflict scenarios:

<div class="slideshow">
    <div class="slide-counter" id="slide-counter">Scenario 1 of 5</div>
    
    <!-- Slide 1: Simple Text Conflict -->
    <div class="slide active" id="slide-1">
        <h3>Scenario 1: Simple Text Conflict in README.md</h3>
        <p style="margin: 15px 0;">Two developers changed the project description simultaneously.</p>
        
        <div class="conflict-editor">
            <textarea id="editor-1" spellcheck="false"># Project Title

<<<<<<< HEAD
This project is a web application for managing tasks and todos.
=======
This project is a task management system with collaboration features.
>>>>>>> feature-branch

## Features
- Task creation
- User management</textarea>
        </div>
        
        <div class="instruction-box">
            <strong>Instructions:</strong> Remove the conflict markers (<code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, <code>=======</code>, <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>) and keep the better description or combine both.
        </div>
        
        <button onclick="checkConflict(1)">Check Resolution</button>
        <button onclick="resetConflict(1)">Reset</button>
        <button onclick="toggleHint(1)">💡 Hint</button>
        <div class="hint" id="hint-1">
            <strong>Hint:</strong> Both descriptions have useful information. Consider combining them:<br>
            "This project is a web application for managing tasks and todos with collaboration features."<br><br>
            Make sure to delete all three conflict markers: <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</code>, <code>=======</code>, and <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature-branch</code>
        </div>
        <div class="success" id="success-1">✓ Conflict resolved correctly!</div>
        <div class="error" id="error-1">✗ Conflict markers still present. Remove all &lt;&lt;&lt;, ===, and &gt;&gt;&gt; markers.</div>
    </div>
    
    <!-- Slide 2: Code Conflict -->
    <div class="slide" id="slide-2">
        <h3>Scenario 2: Function Logic Conflict in app.js</h3>
        <p style="margin: 15px 0;">Two developers implemented the same function differently.</p>
        
        <div class="conflict-editor">
            <textarea id="editor-2" spellcheck="false">function calculateTotal(items) {
<<<<<<< HEAD
    let total = 0;
    for (let i = 0; i < items.length; i++) {
        total += items[i].price;
    }
    return total;
=======
    return items.reduce((sum, item) => sum + item.price, 0);
>>>>>>> feature-branch
}</textarea>
        </div>
        
        <div class="instruction-box">
            <strong>Instructions:</strong> Choose the better implementation or combine them.
        </div>
        
        <button onclick="checkConflict(2)">Check Resolution</button>
        <button onclick="resetConflict(2)">Reset</button>
        <button onclick="toggleHint(2)">💡 Hint</button>
        <div class="hint" id="hint-2">
            <strong>Hint:</strong> The reduce method is more concise and modern JavaScript.<br>
            Keep: <code>return items.reduce((sum, item) => sum + item.price, 0);</code>
        </div>
        <div class="success" id="success-2">✓ Conflict resolved correctly!</div>
        <div class="error" id="error-2">✗ Conflict markers still present.</div>
    </div>
    
    <!-- Slide 3: CSS Conflict -->
    <div class="slide" id="slide-3">
        <h3>Scenario 3: CSS Styling Conflict in styles.css</h3>
        <p style="margin: 15px 0;">Different styling approaches for the same element.</p>
        
        <div class="conflict-editor">
            <textarea id="editor-3" spellcheck="false">.button {
<<<<<<< HEAD
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
=======
    background: linear-gradient(to right, #0066cc, #0099ff);
    color: #ffffff;
    padding: 12px 24px;
    border: 1px solid #0066cc;
    border-radius: 4px;
>>>>>>> feature-branch
    cursor: pointer;
}</textarea>
        </div>
        
        <button onclick="checkConflict(3)">Check Resolution</button>
        <button onclick="resetConflict(3)">Reset</button>
        <button onclick="toggleHint(3)">💡 Hint</button>
        <div class="hint" id="hint-3">
            <strong>Hint:</strong> The feature-branch version has modern styling with gradient and border-radius.
        </div>
        <div class="success" id="success-3">✓ Conflict resolved correctly!</div>
        <div class="error" id="error-3">✗ Conflict markers still present.</div>
    </div>
    
    <!-- Slide 4: Multiple Conflicts -->
    <div class="slide" id="slide-4">
        <h3>Scenario 4: Multiple Conflicts in config.js</h3>
        <p style="margin: 15px 0;">Multiple sections have conflicts.</p>
        
        <div class="conflict-editor">
            <textarea id="editor-4" spellcheck="false">const config = {
<<<<<<< HEAD
    apiUrl: 'http://localhost:3000/api',
=======
    apiUrl: 'https://api.example.com',
>>>>>>> feature-branch
    timeout: 5000,
<<<<<<< HEAD
    retries: 3,
    logLevel: 'debug'
=======
    retries: 5,
    logLevel: 'info',
    cacheEnabled: true
>>>>>>> feature-branch
};</textarea>
        </div>
        
        <button onclick="checkConflict(4)">Check Resolution</button>
        <button onclick="resetConflict(4)">Reset</button>
        <button onclick="toggleHint(4)">💡 Hint</button>
        <div class="hint" id="hint-4">
            <strong>Hint:</strong> TWO conflicts! Use localhost for dev, keep retries: 3 and logLevel: 'debug', but add cacheEnabled: true
        </div>
        <div class="success" id="success-4">✓ All conflicts resolved!</div>
        <div class="error" id="error-4">✗ Conflict markers still present.</div>
    </div>
    
    <!-- Slide 5: Dependencies Conflict -->
    <div class="slide" id="slide-5">
        <h3>Scenario 5: Package Dependencies Conflict</h3>
        <p style="margin: 15px 0;">Both branches added different dependencies.</p>
        
        <div class="conflict-editor">
            <textarea id="editor-5" spellcheck="false">{
  "dependencies": {
    "express": "^4.18.0",
<<<<<<< HEAD
    "mongoose": "^6.0.0",
    "dotenv": "^16.0.0"
=======
    "axios": "^1.0.0",
    "lodash": "^4.17.21"
>>>>>>> feature-branch
  }
}</textarea>
        </div>
        
        <button onclick="checkConflict(5)">Check Resolution</button>
        <button onclick="resetConflict(5)">Reset</button>
        <button onclick="toggleHint(5)">💡 Hint</button>
        <div class="hint" id="hint-5">
            <strong>Hint:</strong> Keep ALL dependencies in alphabetical order: axios, dotenv, express, lodash, mongoose
        </div>
        <div class="success" id="success-5">✓ Conflict resolved!</div>
        <div class="error" id="error-5">✗ Conflict markers still present.</div>
    </div>
    
    <div class="nav-buttons">
        <button onclick="previousSlide()">← Previous</button>
        <button onclick="nextSlide()">Next →</button>
    </div>
</div>

---

## 🔗 Real-World Practice Repository

Ready to practice with a real GitHub repository? 

**[Click here to access the Merge Conflict Practice Repository →](https://github.com/YOUR-USERNAME/merge-conflict-practice)**

This repository contains intentional merge conflicts for you to resolve through pull requests, just like in real-world development.

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
