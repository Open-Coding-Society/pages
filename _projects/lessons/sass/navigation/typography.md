---
layout: post
title: OCS Semantic HTML & Typography Grammar 
categories: [SASS, Typography]
lesson_language: SASS
lesson_topic: Typography
lesson_part: interactive
lesson_type: lesson
permalink: /sass/typography
author: Tristan Chiu, Mateo Durand Amador, Barbara Zhao
---

## The Core Rule

Use HTML for meaning and OCS classes for reusable layout or component roles. This example shows how an OCS class gives a paragraph a defined role.

```html
<h1>OCS Typography Reference</h1>
<p class="ocs__lead">Use semantic HTML and OCS classes to structure your page.</p>

<ol>
  <li>Choose HTML elements for meaning.</li>
  <li>Use OCS classes for reusable visual roles.</li>
</ol>
```

### Semantic HTML

Use meaningful HTML elements to structure content clearly and accessibly.

| Element | Meaning | OCS usage |
| --- | --- | --- |
| `<h1>` | Page-level heading | Use for the page's primary title. The frontmatter title is the only h1 in Markdown or notebook content. |
| `<h2>` | Major section heading | Use for main sections |
| `<h3>` | Subsection heading | Use inside an `<h2>` section or card |
| `<p>` | Paragraph | Use for normal body text |
| `<strong>` | Important content | Use when the meaning is important, not just when text should look bold |
| `<em>` | Stressed content | Use when emphasis changes the meaning or tone |
| `<ul>` | Unordered list | Use when item order does not matter |
| `<ol>` | Ordered list | Use for steps, rankings, or sequences |
| `<li>` | List item | Must be inside `<ul>` or `<ol>` |

### OCS Typography Grammar

Use OCS classes to express roles without hardcoded visual styling.

| Rule | Use |
| --- | --- |
| `ocs__description` | Introductory or supporting description text |
| `ocs__text` | Standard body text inside an OCS component |
| `ocs__lead` | Larger introductory paragraph |
| `ocs__section-title` | Section or card heading |
| `ocs__badge` | Small contextual label |
| `ocs__status` | State or status indicator |
| `ocs__card` | Framed content panel |
| `ocs__visual` | Supporting visual or fact panel |

---

## 1. LxD Cycle Process

**Empathize:** I noticed a lot of students try to manually style text using custom classes (like `<p class="big-bold">Main Heading</p>`) instead of letting the global SASS theme handle it through proper HTML structure. This breaks our site's visual consistency and messes up accessibility.

**Define:**

* **POV:** CSP students need a way to build web pages using semantic HTML because relying on manual CSS classes creates messy code and inaccessible design.
* **Learning Goal:** Students will understand how to use global SASS typography styling by applying the correct semantic HTML tags (`<h1>`, `<h2>`, `<p>`, `<strong>`, etc.) instead of custom classes.

**Ideate:**

* **HMW Question:** How might we teach students to trust global SASS styles and stop hardcoding text appearance?
* **Activity:** Refactoring a poorly written HTML snippet into clean, semantic HTML that automatically inherits our SASS theme.

**Prototype & Test:** I taught a trial run to my project team. They felt the original homework was too long, so I revised it to be a single, focused refactoring task (documented below).

---

## 2. Lesson Plan

**Learning Objective:** By the end of this lesson, you will be able to structure text using semantic HTML tags so it automatically inherits our global SASS typography styles without using custom classes.

**Success Criteria:** You can take an unformatted block of text, apply the correct headings, paragraphs, and list tags, and have it match our site's design system perfectly.

### Tech Talk (3 minutes)

We are using a global SASS typography system. This means **you don't need to write CSS for your text**. Instead of styling text to look a certain way, you just need to tell the browser *what* the text is. There’s already a global system to take care of the styling.

* **The Rule:** Use semantic HTML tags. Let the system handle the look.
* ✅ **Do this:** `<h1>Main Heading</h1>` or `<strong>Important</strong>`
* ❌ **Don't do this:** `<div class="title-text">Main Heading</div>` or `<p class="bold">Important</p>`

Why do we do this? It ensures our whole project looks consistent, makes our code cleaner, and is essential for screen readers and SEO.

### Code Examples

#### A. Simple: Basic Headings and Paragraphs

```html
<!-- We use h1 for the single page title, h2 for major sections, and p for body text. -->
<h1>About Our Project</h1>
<h2>The Team</h2>
<p>We are a group of CSP students building a cool web app.</p>
```

#### B. Intermediate: Adding Emphasis

```html
<!-- Don't use bold or italics classes. Use semantic meaning. -->
<p>You <strong>must</strong> commit your code daily.</p>
<p>It is <em>highly recommended</em> to leave comments.</p>
```

#### C. Complex: Full Section Structure

```html
<!-- Grouping content properly using hierarchy -->
<h2>Setup Instructions</h2>
<h3>Prerequisites</h3>
<ul>
  <li>Python 3.9+</li>
  <li>VS Code</li>
</ul>
<h3>Installation Steps</h3>
<ol>
  <li>Clone the repo.</li>
  <li>Run the setup script.</li>
</ol>
```

---

## 3. Hacks & Practice Tasks

### Popcorn Hack (In-Class)

**Task:** Look at the bad code below. Drop the corrected, semantic version of this code in the chat within 2 minutes.

```html
<div class="huge-text">Welcome!</div>
<span class="sub-title">Read this</span>
<div class="normal">This is a sentence.</div>
```

### Homework Hack

**Task:** Refactor the following code block. Remove all the inline styles and custom classes, and replace them with the correct semantic HTML tags (`h1`-`h4`, `p`, `ul`/`ol`/`li`, `strong`, `em`) so it uses our Aesthetihawk SASS theme. Submit the clean HTML code to our issue tracker.

```html
<p class="title-font">Project Features</p>
<p class="section-font">User Accounts</p>
<p class="body-text">Users can make an account and log in. This is a <span class="very-important">crucial</span> feature.</p>
<p class="body-text">Steps to register:</p>
<p class="list-item">1. Click register</p>
<p class="list-item">2. Enter email</p>
<p class="list-item">3. Set password</p>
```

---

## 4. Grading Plan (1 Point Total)

* **0.2 points:** Participated in the Popcorn Hack with a reasonable attempt.
* **0.7 points:** Homework Hack is submitted and correctly uses semantic tags instead of classes (0.4 for correct heading hierarchy, 0.4 for converting the fake list into a real `<ol>`).

---

## 5. Lesson Revisions & Feedback Evidence

* **Feedback Received:** During my peer practice run, my teammate pointed out that my original Popcorn Hack asked them to write a whole HTML page from scratch, which took longer than 5 minutes and killed the lesson's momentum.
* **Revision Made:** I changed the Popcorn Hack to a simple 3-line refactor that they can do directly in the chat window. This keeps engagement high and takes under 2 minutes.

---
