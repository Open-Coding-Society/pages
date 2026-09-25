---
layout: post
assignment: true
codemirror: true
title: OCS Semantic HTML & Typography Grammar
categories: [SASS, Typography]
lesson_language: SASS
lesson_topic: Typography
lesson_part: interactive
lesson_type: lesson
lesson_source: OCS
assignment_submission_type: code
assignment_creator_uids:
  - "tristan-chiu0"
  - "3rii0"
  - "AVG11235"
microblog: true
permalink: /sass/typography
author: Tristan Chiu, Mateo Durand Amador, Barbara Zhao
---

## 1. Reference Guide

### Semantic HTML
Use meaningful HTML elements to structure content clearly and accessibly.

| Element | Meaning | OCS usage |
|---------|---------|-----------|
| `<h1>` | Page-level heading | Use for the page's primary title. |
| `<h2>` | Major section heading | Use for main sections |
| `<h3>` | Subsection heading | Use inside an `<h2>` section or card |
| `<p>` | Paragraph | Use for normal body text |
| `<strong>` | Important content | Use when the meaning is important |
| `<em>` | Stressed content | Use when emphasis changes the meaning or tone |
| `<ul>` | Unordered list | Use when item order does not matter |
| `<ol>` | Ordered list | Use for steps, rankings, or sequences |
| `<li>` | List item | Must be inside `<ul>` or `<ol>` |

### OCS Typography Grammar
Use OCS classes to express roles without hardcoded visual styling.

| Rule | Use |
|------|-----|
| `ocs_description` | Introductory or supporting description text |
| `ocs_text` | Standard body text inside an OCS component |
| `ocs_lead` | Larger introductory paragraph |
| `ocs_section-title` | Section or card heading |
| `ocs_badge` | Small contextual label |
| `ocs_status` | State or status indicator |
| `ocs_card` | Framed content panel |
| `ocs_visual` | Supporting visual or fact panel |

---

## 2. LxD Cycle Process
**Empathize:** I noticed a lot of students try to manually style text using custom classes (like `<p class="big-bold">Main Heading</p>`) instead of letting the global SASS theme handle it through proper HTML structure. This breaks our site's visual consistency and messes up accessibility.

**Define:**
* **POV:** CSP students need a way to build web pages using semantic HTML because relying on manual CSS classes creates messy code and inaccessible design.
* **Learning Goal:** Students will understand how to use global SASS typography styling by applying the correct semantic HTML tags (`<h1>`, `<h2>`, `<p>`, `<strong>`, etc.) instead of custom classes.

**Ideate:**
* **HMW Question:** How might we teach students to trust global SASS styles and stop hardcoding text appearance?
* **Activity:** Refactoring a poorly written HTML snippet into clean, semantic HTML that automatically inherits our SASS theme.

**Prototype & Test:** I taught a trial run to my project team. They felt the original homework was too long, so I revised it to be a single, focused refactoring task (documented below).

---

## 3. College Board Requirements
This lesson aligns with the following objectives from the **AP Computer Science Principles (CSP)** course framework:

* **CRD-2.A:** Describe the purpose of a computing artifact.
  * *Connection:* Students learn that the purpose of semantic HTML elements (`<h1>`, `<p>`, `<ol>`) is to clearly define the structure and meaning of web content, rather than just its visual appearance.
* **CRD-2.B:** Explain how a program or code segment functions.
  * *Connection:* Through the refactoring hacks, students must analyze poorly structured code blocks and explain/demonstrate how applying correct semantic tags and SASS classes improves the function and readability of the webpage.
* **IOC-1.F:** Explain how bias exists in computing innovations (Accessibility).
  * *Connection:* The lesson explicitly addresses digital accessibility, teaching students that relying on custom visual CSS instead of semantic tags excludes users who rely on screen readers, demonstrating how structural code choices can create or eliminate barriers for disabled users.

---

## 4. Lesson Plan
**Learning Objective:** By the end of this lesson, you will be able to structure text using semantic HTML tags and OCS classes so it automatically inherits our global SASS typography styles without using custom styling.

**Success Criteria:** You can take an unformatted block of text, apply the correct headings, paragraphs, and list tags, pair them with the appropriate OCS classes, and have it match our site's design system perfectly.

### Tech Talk & Introduction (3 minutes)
We are using a global SASS typography system. This means **you don't need to write CSS for your text**. Instead of styling text to look a certain way, you just need to tell the browser *what* the text is. There's already a global system to take care of the styling.

**The Core Rule:** Use HTML for meaning and OCS classes for reusable layout or component roles. Let the system handle the look.

* **Do this:** `<h1 class="ocs_section-title">All About Cats</h1>`
* ☑ **Don't do this:** `<div class="title-text">All About Cats</div>` or `<p class="bold">Never pull a cat's tail</p>`

This example shows how an OCS class gives a paragraph a defined role without manual styling:

{% capture challenge_intro %}
Run this example to see how an OCS class gives a paragraph a defined role without manual styling.
{% endcapture %}
{% capture code_intro %}
// Clear the output
outputElement.innerHTML = "";

outputElement.innerHTML = [
  '<h2>Cat Care 101</h2>',
  '<p class="ocs_lead">Follow these basic rules to keep your feline friend happy.</p>',
  '<ol>',
  '  <li>Provide fresh water and food daily.</li>',
  '  <li>Give them plenty of cozy nap spots.</li>',
  '</ol>'
].join("");
{% endcapture %}
{% include runners/ui.html
runner_id="visual_intro"
challenge=challenge_intro
code=code_intro
height="250px"
%}

Why do we do this? It ensures our whole project looks consistent, makes our code cleaner, and is essential for screen readers and SEO.

### Code Examples

#### A. Simple: Basic Headings and OCS Lead

{% capture challenge_a %}
Review how semantic tags provide structure while OCS classes define the role.
{% endcapture %}
{% capture code_a %}
// Clear the output
outputElement.innerHTML = "";

// Inject semantic HTML
outputElement.innerHTML = [
  '<!-- We use semantic tags for structure and OCS classes for the role. -->',
  '<h2 class="ocs_section-title">Meet Whiskers</h2>',
  '<h3 class="ocs_lead">The Sleepiest Cat in the World</h3>',
  '<p class="ocs_text">Whiskers spends 18 hours a day napping in sunbeams.</p>'
].join("");
{% endcapture %}
{% include runners/ui.html
runner_id="visual_a"
challenge=challenge_a
code=code_a
height="250px"
%}

#### B. Intermediate: Adding Emphasis Inside a Component

{% capture challenge_b %}
Grouping text inside an OCS component while keeping semantic emphasis intact.
{% endcapture %}
{% capture code_b %}
// Clear the output
outputElement.innerHTML = "";

outputElement.innerHTML = [
  '<!-- Grouping text inside an OCS component while keeping semantic emphasis -->',
  '<div class="ocs_card">',
  '  <p class="ocs_text">Please <strong>do not</strong> rub the belly! It is a trap!!</p>',
  '  <p class="ocs_text">It is <em>highly recommended</em> to scratch behind the ears instead!!</p>',
  '</div>'
].join("");
{% endcapture %}
{% include runners/ui.html
runner_id="visual_b"
challenge=challenge_b
code=code_b
height="300px"
%}

#### C. Complex: Full Section Structure

{% capture challenge_c %}
Combining hierarchy, lists, and OCS formatting components.
{% endcapture %}
{% capture code_c %}
// Clear the output
outputElement.innerHTML = "";

outputElement.innerHTML = [
  '<!-- Full hierarchy combining tags and classes -->',
  '<div class="ocs_card">',
  '  <h2 class="ocs_section-title">Favorite Cat Toys</h2>',
  '  <p class="ocs_description">Approved toys for maximum zoomies include:</p>',
  '  <ul>',
  '    <li>Feather wands</li>',
  '    <li>Cardboard boxes (obviously)</li>',
  '    <li>Laser pointers</li>',
  '  </ul>',
  '</div>'
].join("");
{% endcapture %}
{% include runners/ui.html
runner_id="visual_c"
challenge=challenge_c
code=code_c
height="350px"
%}

---

## 5. Hacks & Practice Tasks

### Prepare your submission IPYNB
Complete this quick-start flow so you can begin in about 2 minutes.
1. Create a new notebook in your portfolio homework area: `_notebooks/homework`.
2. Add one markdown cell at the top with the frontmatter below.
3. Add code cells for Popcorn and Homework. Keep the `%%html` and `UI_RUNNER` comment in each code cell.
4. Run each cell and verify the rendered output before submitting.

```yaml
layout: post
title: OCS Semantic HTML & Typography Grammar HW
categories: [SASS]
lesson_language: SASS
lesson_topic: Typography HW
lesson_part: interactive
lesson_type: lesson
permalink: /sass/typography-hw
author: githubID
```

### Submission Safety Rules (Read First)
> [!IMPORTANT]
> To avoid grading errors, follow these rules exactly:
>
> * Submit only your final semantic HTML for each hack.
> * Do not add custom CSS, inline styles, or extra classes. Use ONLY the `ocs_` classes provided.
> * Keep `%%html` and the `UI_RUNNER` comment line in each submission cell.
> * Use only allowed semantic tags for this lesson: `h1`-`h4`, `p`, `ul`/`ol`/`li`, `strong`, `em`, `div`.

### Popcorn Hack (In-Class)
> [!TIP]
> 2-minute challenge: refactor and run right here, then paste only your corrected code in chat.

{% capture challenge_popcorn %}
Look at the bad code below. Replace non-semantic elements with semantic tags, remove the custom CSS, and apply at least one OCS class (like ocs_lead). Run it, then paste only your corrected HTML in chat.

Expected direction: one heading, one supporting heading/subheading, and one paragraph using OCS grammar.
{% endcapture %}
{% capture code_popcorn %}
// Clear the output
outputElement.innerHTML = "";

// Edit the HTML inside the array below to use semantic tags and OCS classes!
outputElement.innerHTML = [
  '<style>',
  '  .large-title { font-size: 32px; font-weight: bold; line-height: 1.6; font-family: "Helvetica", sans-serif; }',
  '  .sub-title { font-size: 24px; line-height: 1.6; font-weight: bold; font-family: "Helvetica", sans-serif; }',
  '  .normal { font-size: 16px; line-height: 1.6; font-family: "Helvetica", sans-serif; }',
  '</style>',
  '<div class="large-title">Why Cats Purr</div>',
  '<span class="sub-title">A Sign of Happiness</span>',
  '<div class="normal">Cats usually purr when they feel safe, cozy, and ready for a nap.</div>'
].join("");
{% endcapture %}
{% include runners/ui.html
runner_id="visual_popcorn"
challenge=challenge_popcorn
code=code_popcorn
height="400px"
%}

### Homework Hack
**Task:** Refactor the following code block. Remove all custom CSS and classes, replace them with the correct semantic HTML tags (`h2`-`h4`, `p`, `ol`/`li`, `strong`), and apply the correct OCS classes (like `ocs_card` and `ocs_section-title`) so it uses our Aesthetihawk SASS theme. Run with `UI_RUNNER`, then submit the clean HTML in your notebook.

```html
%%html
<!-- UI_RUNNER: Typography Homework Base -->
<style>
.title-font {
  font-size: 32px;
  font-weight: bold;
  line-height: 1.6;
  font-family: 'Helvetica', sans-serif;
}
.section-font {
  font-size: 24px;
  line-height: 1.6;
  font-weight: bold;
  font-family: 'Helvetica', sans-serif;
}
.body-text {
  font-size: 16px;
  line-height: 1.6;
  font-family: 'Helvetica', sans-serif;
}
.very-important {
  font-size: 16px;
  font-weight: bold;
  line-height: 1.6;
  font-family: 'Helvetica', sans-serif;
}
.list-item {
  font-size: 16px;
  line-height: 1.6;
  font-family: 'Helvetica', sans-serif;
}
</style>
<div class="title-font">How to Pat a Cat</div>
<div class="section-font">Have you ever wanted to...</div>
<div class="body-text">pat a cat? Well good for you we will give step by step instructions on how to pat a cat!</div>
<div class="body-text"><span class="very-important">How to pat a cat:</span></div>
<div class="list-item">1. put out your hand</div>
<div class="list-item">2. touch the cat</div>
<div class="list-item">3. move your hand back and forth</div>
<div class="section-font">Congrats! You pat a cat :D</div>
```

---

## 6. Grading Plan (1 Point Total)

### Classroom Rubric
* **0.2 points: Popcorn completion**
  * Student submitted a semantic refactor attempt and kept the code runnable with `%%html`.
* **0.8 points: Homework completion**
  * **0.4 heading and paragraph semantics:** Uses heading hierarchy correctly and keeps descriptive text in paragraphs.
  * **0.3 list semantics:** Converts fake numbered paragraph lines into one real ordered list (`<ol>` with three `<li>` items).
  * **0.1 emphasis semantics:** Converts purely visual emphasis to semantic emphasis (`<strong>` or `<em>`).

### Quick Validation Checklist
* Present: `%%html` and `UI_RUNNER` comment line.
* Absent: custom class attributes, inline style attributes, `<style>` block, and span-based fake emphasis.
* Present: at least one heading tag, paragraph tags, ordered list tags, and list item tags.
* Present: at least one `ocs_` class applied correctly.
* Present: semantic emphasis tag for the word that was previously marked as visually important.

---

## 7. Lesson Revisions & Feedback Evidence
* **Feedback Received:** During my peer practice run, my teammate pointed out that my original Popcorn Hack asked them to write a whole HTML page from scratch, which took longer than 5 minutes and killed the lesson's momentum.
* **Revision Made:** I changed the Popcorn Hack to a simple 3-line refactor that they can do directly in the chat window. This keeps engagement high and takes under 2 minutes.

---

## 8. References
"Typography." *web.dev*, 30 Sept. 2022, https://web.dev/learn/accessibility/typography.

"Page Regions." *Web Accessibility Initiative (WAI)*, World Wide Web Consortium (W3C), 24 Mar. 2026, https://www.w3.org/WAI/tutorials/page-structure/regions/.

"Headings and Paragraphs." *MDN Web Docs*, MDN contributors, 25 Aug. 2026, https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Headings_and_paragraphs.