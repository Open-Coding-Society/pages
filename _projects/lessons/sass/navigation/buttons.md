---
layout: post
title: SASS Buttons Grammar
description: Explore the Open Coding Society button grammar through living examples.
categories: [SASS, Buttons]
lesson_language: SASS
lesson_topic: Buttons Grammar
lesson_source: OCS
lesson_type: lesson
microblog: true
permalink: /sass/buttons-grammar
author: Rashi, Aashni, and Kelervia
---
# 🎓 School Portal UI: SASS Buttons & Grammar

Welcome to the Open Coding Society (OCS) guide on building interactive interface components! In this lesson, we will build an interactive **School Student Portal** button bar. You will learn the core grammar of semantic button design and how to use OCS SASS classes to build clean, responsive user interfaces without writing inline styles or custom CSS.

---

## 1. Quick Reference Table

Use this reference table to choose the correct semantic tag and OCS SASS utility class for each button type on your school page:

| UI Role | Semantic Tag | OCS SASS Utility Classes | Purpose / Example |
| :--- | :--- | :--- | :--- |
| **Primary Action** | `<button>` | `ocs__btn fill` | Main action on a page (e.g., "Submit Assignment") |
| **Secondary Action** | `<button>` | `ocs__btn outline` | Alternative option (e.g., "Save Draft") |
| **Page Link** | `<a>` | `ocs__btn outline` | Navigating to another page (e.g., "View Grades ↗") |
| **Success / Green** | `<button>` / `<a>` | `ocs__btn alert-green fill` | Affirmative or success actions (e.g., "Turn In Homework") |
| **Caution / Yellow** | `<button>` / `<a>` | `ocs__btn alert-yellow outline` | Pending or warning states (e.g., "Request Extension") |
| **Danger / Red** | `<button>` / `<a>` | `ocs__btn alert-red fill` | Destructive actions (e.g., "Drop Class") |
| **Small Variant** | `<button>` / `<a>` | `ocs__btn small` | Compact buttons inside tables or card headers |

---

## 2. Tech Talk: The Rules of SASS Button Grammar

Building clean interfaces requires following two main rules: **Semantic HTML Tags** and **OCS Utility Classes**.

### Rule 1: Use Semantic Tags (`<button>` vs `<a>`)
* **`<button>` (In-Page Actions):** Use `<button>` when clicking triggers a JavaScript action, submits form data, opens a modal, or changes page state without loading a new URL.
* **`<a>` (Navigation Links):** Use `<a>` (with an `href="/..."` attribute) when clicking moves the student to a new page, website, or document.
* **Never use non-semantic elements:** Tags like `<div>`, `<span>`, or `<p>` carry zero accessibility support and should never be styled into fake buttons.

### Rule 2: OCS Utility Classes Over Custom CSS
* **Base Class:** Every button must start with the base class `ocs__btn`. This applies padding, border-radius, font styling, and smooth hover transitions.
* **Style Modifiers:** Add `fill` for solid backgrounds or `outline` for bordered buttons.
* **State Modifiers:** Add `alert-green`, `alert-yellow`, or `alert-red` for contextual colors.
* **Size Modifiers:** Add `small` for compact layouts.
* **No Inline Styles:** Attributes like `style="background: blue; ..."` are strictly forbidden. Global SASS stylesheets handle all visual theme variables.

---

## 3. Code Examples & Live Previews

### Example A: Portal Navigation & Primary Submission

Use `<button>` for submitted actions and `<a>` for external or internal navigation links.

```html
%%html
<!-- UI_RUNNER: SASS Buttons Example A -->
<div class="flex gap-2">
  <button class="ocs__btn fill">Submit Homework</button>
  <a href="/portal/grades" class="ocs__btn outline">View Gradebook ↗</a>
</div>
```

### Example B: Homework State Indicators
Combine state modifiers (alert-*) with fill and outline classes to signal status.


```html
%%html
<!-- UI_RUNNER: SASS Buttons Example B -->
<div class="flex gap-2">
  <button class="ocs__btn alert-green fill">Turn In Essay</button>
  <button class="ocs__btn alert-yellow outline">Extension Requested</button>
  <button class="ocs__btn alert-red fill">Unenroll Course</button>
</div>
```

Example C: Student Dashboard Compact Action Bar
In crowded interfaces like grade tables or student card views, use the small utility modifier.

```html
%%html
<!-- UI_RUNNER: SASS Buttons Example C -->
<div class="flex gap-2 align-center">
  <button class="ocs__btn alert-green fill small">Approve Pass</button>
  <button class="ocs__btn alert-yellow outline small">Flag Attendance</button>
  <a href="/portal/messages" class="ocs__btn alert-red outline small">Contact Parent ↗</a>
</div>
```

### 4. Hacks & Practice Tasks
Prepare Your Submission IPYNB
Complete this quick setup in your local environment:

Create a new notebook in your portfolio area: _notebooks/homework.

Add one markdown cell at the top with the frontmatter below.

Add code cells for Popcorn and Homework hacks. Keep the %%html and UI_RUNNER comment intact in each cell.

Execute each cell to verify the rendered output before submitting.

#### Submission Safety Rules (Read First)
[!IMPORTANT]
To avoid grading errors, follow these rules exactly:

Submit only your final refactored HTML for each hack.

Do not add custom CSS, inline styles, or extra non-OCS classes.

Keep the %%html cell magic tag and the UI_RUNNER comment line intact in each submission cell.

Use only allowed semantic tags and OCS classes for this lesson: <button>, <a>, ocs__btn, fill, outline, small, alert-green, alert-yellow, alert-red.

Your submission cell must start with this exact header line format:


### Popcorn Hack (In-Class)
Purpose: Practice replacing non-semantic, inline-styled elements with proper semantic <button> tags and OCS SASS utility classes to instantly inherit hover states and theme styling.

[!TIP] 2-Minute Challenge: Look at the bad code below. Refactor the two fake school portal button elements into real <button> tags using OCS SASS button classes (ocs__btn, fill, alert-green, alert-red). Remove all inline style="..." attributes!

```html
%%html
<!-- UI_RUNNER: SASS Buttons Popcorn Base --> 
<div class="flex gap-2">
  <!-- 1. Refactor to a green success action button -->
  <div class="fake-btn" style="background: green; color: white;">
    Save Homework Draft
  </div>

  <!-- 2. Refactor to a red danger action button -->
  <span class="fake-btn" style="border: 1px solid red; color: red;">
    Drop Class Section
  </span>
</div>
```

### Homework Hack

**Purpose:** Practice refactoring a realistic school portal action bar by converting hardcoded, non-semantic tags into clean, standardized OCS SASS buttons.

> **[!IMPORTANT] Submission Safety Rules:**
> * Keep `%%html` and the `<!-- UI_RUNNER: ... -->` line intact at the top of your notebook cell.
> * Remove **all** inline `style="..."` attributes and custom non-OCS classes.
> * Use **only** semantic tags (`<button>`, `<a>`) paired with OCS SASS classes (`ocs__btn`, `fill`, `outline`, `small`, `alert-green`, `alert-yellow`, `alert-red`).

> **Quick Cheat Sheet for Beginners:**
> 1. **Choose the Tag:** Use `<button>` for in-page actions (Submit, Request Hold, Delete) and `<a>` for navigation links (`href="..."`).
> 2. **Delete Hand-Coded CSS:** Wipe out all `style="..."` attributes completely.
> 3. **Apply SASS Grammar Classes:**
>    * Base class (Required): `ocs__btn`
>    * Primary action (Blue solid): `fill`
>    * Small green navigation link: `alert-green outline small`
>    * Caution/Warning button: `alert-yellow outline`
>    * Destructive action (Red solid): `alert-red fill small`

**Starter Code to Copy:**

```html
%%html
<!-- UI_RUNNER: SASS Buttons Homework Base --> 
<div class="flex gap-2">
  <!-- 1. Primary Action: Convert to a primary filled SASS button -->
  <span class="my-custom-btn" style="background: blue; color: white;">
    Submit Assignment
  </span>

  <!-- 2. Green Navigation: Convert to a small green navigation link -->
  <div class="fake-link" style="color: green;" onclick="location.href='/portal/schedule'">
    View Bell Schedule ↗
  </div>

  <!-- 3. Caution Action: Convert to an outlined yellow warning button -->
  <span class="warn-pill" style="border: 1px solid orange; color: orange;">
    Request Extension
  </span>

  <!-- 4. Danger Action: Convert to a small red filled danger button -->
  <p class="red-box" style="background: red; color: white;">
    Cancel Submission
  </p>
</div>