---
layout: post
assignment: true
title: OCS Grid Grammar
categories: [SASS, Grids]
lesson_language: SASS
lesson_topic: Grids
lesson_part: interactive
lesson_type: lesson
permalink: /sass/grids/
author: Aryan M, Raymond L, Pranay K
---

## The Core Rule

Use HTML for content and OCS grid classes for layout. This example shows how OCS classes turn plain divs into a responsive, theme aware grid.

```html
<div class="ocs__card">
  <div class="ocs__grid ocs__grid--standard cols-2">
    <div class="ocs__grid-cell">Frontend</div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">Backend</div>
  </div>
</div>
```

### Grid Structure

Every grid is built from the same three layers.

| Class | Meaning | OCS usage |
| --- | --- | --- |
| `ocs__card` | Framed panel | Wrap a grid so it gets a surface and spacing |
| `ocs__grid` | Grid root | Always the outer element of a grid |
| `ocs__grid--*` | Grid variant | Pick exactly one per grid |
| `ocs__grid-cell` | Grid item | Every direct child of the grid |
| `ocs__grid-cell--*` | Cell modifier | Changes one cell without new CSS |
| `<h3>` | Cell heading | Use for a title inside a card cell |
| `<p>` | Cell text | Use for normal text inside a cell |

### OCS Grid Grammar

Use OCS classes to express layout without hardcoded CSS.

| Rule | Use |
| --- | --- |
| `ocs__grid--standard` | Fixed 3 columns, 2 on mobile |
| `cols-2`, `cols-4` | Change standard grid column count |
| `ocs__grid--card` | Auto fill cards at least 200px wide |
| `cols-3` | Fixed 3 column card grid |
| `ocs__grid--color` | Each cell shows its own color on hover |
| `ocs__grid--holographic` | Cells cycle the rainbow in a wave |
| `ocs__grid--calculator` | 4 column square keypad |
| `ocs__grid--gallery` | Auto fill square tiles |
| `ocs__grid-cell--header` | Spans the full row |
| `ocs__grid-cell--wide` | Spans 2 columns |
| `ocs__grid-cell--accent` | Accent tinted cell |
| `ocs__grid-cell--muted` | Subtle background cell |

---

## 1. LxD Cycle Process

**Empathize:** We noticed students build layouts by hand with inline styles (like `<div style="display:flex; width:33%">`) or made up classes like `my-row`. These layouts break on mobile, ignore the user's theme, and look different on every page.

**Define:**

* **POV:** CSP students need a reusable way to arrange content in rows and columns because hand written layout CSS breaks on small screens and clashes with the site theme.
* **Learning Goal:** Students will build responsive layouts using only the OCS grid grammar (`ocs__grid`, a variant, `ocs__grid-cell`, and modifiers) instead of custom CSS.

**Ideate:**

* **HMW Question:** How might we teach students to trust the OCS grid mixins and stop writing their own layout CSS?
* **Activity:** Refactoring a hand styled layout into clean OCS grid classes that automatically respond to screen size and theme.

**Prototype & Test:** We taught a trial run to our project team. They said the first homework used too many grid variants at once, so we cut it to two grids: one standard and one calculator (documented below).

---

## 2. Lesson Plan

**Learning Objective:** By the end of this lesson, you will be able to lay out content with OCS grid classes so it is responsive and theme aware without writing any CSS.

**Success Criteria:** You can take a hand styled layout, replace it with the correct grid root, variant, cells, and modifiers, and have it match our site's design system on desktop and mobile.

### Tech Talk (3 minutes)

We are using a shared SASS grid system. This means **you don't need to write CSS for your layout**. Mixins in `mixins/_grid.scss` already handle columns, gaps, breakpoints, hover, and theme colors. You just pick the class that describes *what kind* of grid you want.

* **The Rule:** Use OCS grid classes. Let the system handle the layout.
* ✅ **Do this:** `<div class="ocs__grid ocs__grid--standard">`
* ❌ **Don't do this:** `<div style="display:grid; grid-template-columns:1fr 1fr 1fr">` or `<div class="my-row">`

Why do we do this? It keeps every page consistent, works on phones automatically, and follows the user's color preferences.

### Code Examples

#### A. Simple: Standard Grid

```html
<!-- One root, one variant, and cells. Collapses to 2 columns on mobile. -->
<div class="ocs__grid ocs__grid--standard">
  <div class="ocs__grid-cell">JavaScript</div>
  <div class="ocs__grid-cell">Python</div>
  <div class="ocs__grid-cell">SASS</div>
</div>
```

#### B. Intermediate: Adding Modifiers

```html
<!-- Modifiers change single cells. cols-4 changes the column count. -->
<div class="ocs__grid ocs__grid--standard cols-4">
  <div class="ocs__grid-cell ocs__grid-cell--header">Web Stack</div>
  <div class="ocs__grid-cell">HTML</div>
  <div class="ocs__grid-cell">CSS</div>
  <div class="ocs__grid-cell ocs__grid-cell--muted">JS</div>
  <div class="ocs__grid-cell ocs__grid-cell--accent">SASS</div>
</div>
```

#### C. Complex: Full Card Composition

```html
<!-- Card, then grid, then cells with semantic content inside -->
<div class="ocs__card">
  <h3 class="ocs__section-title">Our Tools</h3>
  <div class="ocs__grid ocs__grid--card">
    <div class="ocs__grid-cell">
      <h3>GitHub</h3>
      <p class="ocs__card-description">Version control for projects.</p>
    </div>
    <div class="ocs__grid-cell">
      <h3>VSCode</h3>
      <p class="ocs__card-description">Where we write our code.</p>
    </div>
  </div>
</div>
```

---

## 3. Hacks & Practice Tasks

### Prepare your submission IPYNB

Complete this quick-start flow so you can begin in about 2 minutes.

1. Create a new notebook in your portfolio homework area: `_notebooks/homework`.
2. Add one markdown cell at the top with the frontmatter below.
3. Add code cells for Popcorn and Homework. Keep the `%%html` and `UI_RUNNER` comment in each code cell.
4. Run each cell and verify the rendered output before submitting.

```raw
---
layout: post
title: OCS Grid Grammar HW
categories: [SASS]
lesson_language: SASS
lesson_topic: Grids HW
lesson_part: interactive
lesson_type: lesson
permalink: /sass/grids-hw
author: githubID
---
```

### Submission Safety Rules (Read First)

> [!IMPORTANT]
> To avoid grading errors, follow these rules exactly:
>
> * Submit only your final grid HTML for each hack.
> * Do not add custom CSS, inline styles, or made up classes.
> * Keep `%%html` and the `UI_RUNNER` comment line in each submission cell.
> * Use only OCS grid grammar for this lesson: `ocs__card`, `ocs__grid`, `ocs__grid--*`, `cols-*`, `ocs__grid-cell`, and `ocs__grid-cell--*`.
> * Use exactly one variant class on each grid.

### Popcorn Hack (In-Class)

> [!TIP]
> 2-minute challenge: refactor and run, then paste only your corrected code in chat.

**Task:** Look at the bad code below. Replace the inline style and custom classes with OCS grid classes and run it with UI_RUNNER.

```html
%%html

<!-- UI_RUNNER: Grids Popcorn Base -->

<div style="display: flex;">
  <div class="box">HTML</div>
  <div class="box">CSS</div>
  <div class="box">JS</div>
</div>
```

**Expected direction:** one grid root, one standard variant, and three grid cells.

### Homework Hack

**Task:** Refactor the following code block. Remove all inline styles and custom classes and replace them with OCS grid grammar. The first grid should be a standard grid with a full row header and one accent cell. The second should be a calculator grid with an accent key. Run with UI_RUNNER, then submit the clean HTML in your notebook.

```html
%%html

<!-- UI_RUNNER: Grids Homework Base -->
<div class="my-row">
  <div class="title-box" style="width: 100%;">Team Tools</div>
  <div class="tool-card">GitHub</div>
  <div class="tool-card">VSCode</div>
  <div class="tool-card highlight">SASS</div>
</div>
<div style="display: grid; grid-template-columns: repeat(4, 1fr);">
  <div class="key">7</div>
  <div class="key">8</div>
  <div class="key">9</div>
  <div class="key orange">+</div>
</div>
```

---

## 4. Grading Plan (1 Point Total)

### Classroom Rubric

* **0.2 points: Popcorn completion**
  Student submitted a grid refactor attempt and kept the code runnable with `%%html`.
* **0.8 points: Homework completion**
  * **0.4 grid structure:** Both grids use `ocs__grid`, one variant, and `ocs__grid-cell` on every child.
  * **0.3 modifier use:** Converts the title box to `ocs__grid-cell--header` and the highlight to `ocs__grid-cell--accent`.
  * **0.1 calculator variant:** Converts the inline grid to `ocs__grid--calculator` with the `+` key as an accent cell.

### Quick Validation Checklist

* Present: `%%html` and `UI_RUNNER` comment line.
* Absent: inline style attributes and made up classes like `box`, `my-row`, `tool-card`, or `key`.
* Present: `ocs__grid`, a variant class, and `ocs__grid-cell` in every grid.
* Present: at least one `--header` and one `--accent` modifier.

---

## 5. Lesson Revisions & Feedback Evidence

* **Feedback Received:** During our peer practice run, a teammate said the original homework asked for four different grid variants, which took too long and caused confusion about which modifiers work where.
* **Revision Made:** We cut the homework to two grids (standard and calculator) and added a short grammar table at the top. This keeps the task under 10 minutes and focused on the core pattern.

---
