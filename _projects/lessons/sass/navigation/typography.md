---
layout: post
title: SASS Typpography Aesthetihawk
categories: [SASS]
permalink: /aesthetihawk-guide-typography
author: Aashray Reddy
menu: nav/aesthetihawk-guide.html
toc: false
---

## Typography

### How to Use

Our site uses **semantic HTML tags** to control text styling. Instead of applying custom classes, developers should use the appropriate tags like `<h1>`, `<h2>`, and `<p>`. These tags are automatically styled through our global styles to ensure visual consistency, accessibility, and responsive behavior.

**✅ Correct usage:**

```html
<!-- Don't use bold or italics classes. Use semantic meaning. -->
<p>You <strong>must</strong> commit your code daily.</p>
<p>It is <em>highly recommended</em> to leave comments.</p>
```

**3. Complex: Full Section Structure**
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
* **0.8 points:** Homework Hack is submitted and correctly uses semantic tags instead of classes (0.4 for correct heading hierarchy, 0.4 for converting the fake list into a real `<ol>`).

---

## 5. Lesson Revisions & Feedback Evidence
* **Feedback Received:** During my peer practice run, my teammate pointed out that my original Popcorn Hack asked them to write a whole HTML page from scratch, which took longer than 5 minutes and killed the lesson's momentum.
* **Revision Made:** I changed the Popcorn Hack to a simple 3-line refactor that they can do directly in the chat window. This keeps engagement high and takes under 2 minutes.
