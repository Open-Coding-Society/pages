---
layout: cs-portfolio-lesson
title: "SASS"
microblog: True
breadcrumb: True
description: "Submodule 4 of Frontend Development Mini-Quest"
permalink: /cs-portfolio-quest/frontend/submodule_4/
parent: "Frontend Development"
team: "Creators"
submodule: 4
categories: [CSP, Submodule, Frontend]
tags: [javascript, events, handling]
author: "Creators Team"
date: 2025-10-21
---

<style>
.demo-container {
  max-width: 760px;
  margin: 2rem auto;
  padding: 1.5rem;
  border: 1px solid #374151;
  border-radius: 8px;
  background: #1f2937;
  color: white;
}
.frq-container {
  max-width: 760px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #374151;
  border-radius: 8px;
  color: white;
}
.frq-container label {
  color: white;
  font-weight: bold;
}
.status-msg {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.95rem;
  font-weight: bold;
}
.status-success { color: #10b981; }
.status-error { color: #ef4444; }
textarea, input[type="text"] {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #4b5563;
  border-radius: 4px;
  font-family: inherit;
  background: #1f2937;
  color: white;
}
button {
  margin: 0.25rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: #374151;
  color: white;
  cursor: pointer;
}
button:hover { background: #1f2937; }
.submit-btn {
  background: #7c3aed;
  width: 100%;
  margin-top: 1rem;
}
.submit-btn:hover { background: #6d28d9; }
select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  margin: 0 0.5rem;
}
</style>

# SASS

## Introduction

Modern frontend development offers two powerful styling approaches: **Tailwind CSS** provides utility classes for rapid UI construction, while **Sass** (SCSS syntax) extends CSS with variables, mixins, and partials that compile into standard CSS. This lesson demonstrates how both tools integrate into a Jekyll project. You'll explore a small interactive Tailwind playground and complete a free-response question about choosing between utilities and abstractions.

## What Tailwind and Sass Do

- **Tailwind CSS**: A utility-first framework that applies styles via pre-defined classes like `p-4`, `bg-blue-500`, `rounded-lg`. Speeds up prototyping and keeps markup colocated with styles.
- **Sass (SCSS)**: A CSS preprocessor that adds variables (`$primary-color`), nesting, mixins, and file imports. Compiles to regular CSS at build time.
- **When to use**: Use Tailwind for rapid component styling and responsive layouts. Use Sass for design tokens, reusable mixins, and complex theme logic that spans multiple pages.

## Minimal Setup in Jekyll

### A) Tailwind Quick Demo via CDN

For experimentation, load Tailwind via CDN (not recommended for production):

```html
<script src="https://cdn.tailwindcss.com"></script>
```

### B) Production Tailwind Build

Install Tailwind and PostCSS:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

**tailwind.config.js**
```javascript
module.exports = {
  content: ['./_site/**/*.html', './**/*.md', './**/*.html'],
  theme: { extend: {} },
  plugins: [],
}
```

**postcss.config.js**
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
```

**assets/css/tailwind.css**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**package.json scripts**
```json
{
  "scripts": {
    "build:css": "tailwindcss -i ./assets/css/tailwind.css -o ./_site/assets/css/tw.css --minify"
  }
}
```

Link in your layout:
```html
<link rel="stylesheet" href="{{ '/assets/css/tw.css' | relative_url }}">
```

### C) Sass Structure in Jekyll

Create `_sass/` folder for partials. Jekyll compiles any `.scss` file in `assets/css/` that has YAML front matter.

**_sass/_variables.scss**
```scss
$primary: #2563eb;
$spacing: 1rem;
```

**_sass/_mixins.scss**
```scss
@mixin card-shadow {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

**assets/css/main.scss**
```scss
---
---
@use '../_sass/variables' as *;
@use '../_sass/mixins' as *;

body {
  font-family: system-ui, sans-serif;
  color: $primary;
}

.card {
  padding: $spacing;
  @include card-shadow;
}
```

Link in your layout:
```html
<link rel="stylesheet" href="{{ '/assets/css/main.css' | relative_url }}">
```

## Tiny Interactive Demo (Tailwind Playground)

<script src="https://cdn.tailwindcss.com"></script>

<div class="demo-container">
  <h3 style="margin-top:0;">Tailwind Utility Playground</h3>
  <p>Adjust the settings and click Apply to see Tailwind classes in action.</p>
  
  <div style="margin: 1rem 0;">
    <label>Padding:
      <select id="sel-padding">
        <option value="p-2">p-2</option>
        <option value="p-4" selected>p-4</option>
        <option value="p-6">p-6</option>
      </select>
    </label>
    <label>Radius:
      <select id="sel-radius">
        <option value="rounded">rounded</option>
        <option value="rounded-lg" selected>rounded-lg</option>
        <option value="rounded-xl">rounded-xl</option>
      </select>
    </label>
    <label>Tone:
      <select id="sel-tone">
        <option value="bg-gray-100 text-gray-800" selected>Gray</option>
        <option value="bg-blue-100 text-blue-800">Blue</option>
        <option value="bg-green-100 text-green-800">Green</option>
      </select>
    </label>
    <button id="btn-apply" style="margin-left:1rem;">Apply</button>
  </div>
  
  <div id="demo-card" class="p-4 rounded-lg bg-gray-800 text-gray-100" style="border:1px solid #4b5563;">
    <strong>Sample Card</strong>
    <p style="margin:0.5rem 0 0 0;">This card updates with your chosen Tailwind utilities.</p>
  </div>
</div>

## What to Use When

**Use Tailwind when**:
- Building UI components quickly with responsive design
- Prototyping layouts without writing custom CSS
- Keeping styles scoped to individual elements

**Use Sass when**:
- Managing design tokens (colors, spacing) across the entire site
- Creating reusable mixins for complex patterns (animations, shadows)
- Organizing styles into modular partials for maintainability

## Quick Knowledge Check

<details>
<summary>What's the main difference between Tailwind and Sass?</summary>
Tailwind provides pre-built utility classes you apply directly in HTML. Sass extends CSS with features like variables and mixins that compile to standard CSS.
</details>

<details>
<summary>Why use Sass variables instead of Tailwind's built-in colors?</summary>
Sass variables centralize theme values in one place and can be dynamically computed or reused in complex calculations that Tailwind's fixed palette doesn't support.
</details>

<details>
<summary>Can you use Tailwind and Sass together?</summary>
Yes. Use Tailwind for component utilities and Sass for global styles, theme variables, and custom mixins. Both outputs link separately in your Jekyll layout.
</details>

## Student Free Response (FRQ) — Tailwind + Sass

**Prompt**: Write 4–6 sentences explaining when to choose Tailwind utilities versus Sass abstractions in a Jekyll project. Describe how `tw.css` (Tailwind output) and `main.css` (Sass output) work together in the final site. Provide one example best suited for Tailwind utilities and one example best suited for a Sass mixin.

<div class="frq-container">
  <label for="name">Your Name:</label>
  <input type="text" id="name" placeholder="Enter your name">
  
  <label for="response" style="display:block;margin-top:1rem;">Your Response:</label>
  <textarea id="response" rows="8" placeholder="Write your response here..."></textarea>
  
  <button id="submitBtn" class="submit-btn">Submit</button>
  
  <div id="message" class="status-msg"></div>
</div>

## Summary

- **Tailwind CSS** accelerates UI development with utility classes; production requires a build step to purge unused styles.
- **Sass** organizes styles with variables, mixins, and partials; Jekyll compiles `.scss` files with front matter into `.css`.
- **Jekyll outputs**: `tw.css` (Tailwind) and `main.css` (Sass) link independently in your layout for complementary styling.
- **Best practice**: Use Tailwind for component-level styling and Sass for theme management and reusable abstractions.

## Interactive Demo JavaScript

**Tailwind Playground Script**
```javascript
(function() {
  const selPadding = document.getElementById('sel-padding');
  const selRadius = document.getElementById('sel-radius');
  const selTone = document.getElementById('sel-tone');
  const btnApply = document.getElementById('btn-apply');
  const demoCard = document.getElementById('demo-card');

  btnApply.addEventListener('click', () => {
    const padding = selPadding.value;
    const radius = selRadius.value;
    const tone = selTone.value;
    demoCard.className = `${padding} ${radius} ${tone}`;
    demoCard.style.border = '1px solid #4b5563';
  });
})();
```

**Form Submission Handler**
```javascript
import { javaURI } from '/assets/js/api/config.js';

document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("submitBtn");
  const nameInput = document.getElementById("name");
  const responseInput = document.getElementById("response");
  const messageDiv = document.getElementById("message");

  submitBtn.addEventListener("click", async () => {
    const name = nameInput.value.trim();
    const response = responseInput.value.trim();

    if (!name || !response) {
      messageDiv.textContent = "Please fill in both fields.";
      messageDiv.style.color = "red";
      return;
    }

    try {
      const res = await fetch(`${javaURI}/api/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, response })
      });

      if (res.ok) {
        const data = await res.json();
        messageDiv.textContent = `✅ Response saved! (ID: ${data.id})`;
        messageDiv.style.color = "green";
        responseInput.value = "";
      } else {
        messageDiv.textContent = "⚠️ Error submitting response.";
        messageDiv.style.color = "red";
      }
    } catch (err) {
      messageDiv.textContent = "❌ Could not connect to server.";
      messageDiv.style.color = "red";
    }
  });
});
```

<script>
(function() {
  const selPadding = document.getElementById('sel-padding');
  const selRadius = document.getElementById('sel-radius');
  const selTone = document.getElementById('sel-tone');
  const btnApply = document.getElementById('btn-apply');
  const demoCard = document.getElementById('demo-card');

  btnApply.addEventListener('click', () => {
    const padding = selPadding.value;
    const radius = selRadius.value;
    const tone = selTone.value;
    demoCard.className = `${padding} ${radius} ${tone}`;
    demoCard.style.border = '1px solid #4b5563';
  });
})();
</script>

<script type="module">
  import { javaURI } from '/assets/js/api/config.js';

  document.addEventListener("DOMContentLoaded", () => {
    const submitBtn = document.getElementById("submitBtn");
    const nameInput = document.getElementById("name");
    const responseInput = document.getElementById("response");
    const messageDiv = document.getElementById("message");

    submitBtn.addEventListener("click", async () => {
      const name = nameInput.value.trim();
      const response = responseInput.value.trim();

      if (!name || !response) {
        messageDiv.textContent = "Please fill in both fields.";
        messageDiv.style.color = "red";
        return;
      }

      try {
        const res = await fetch(`${javaURI}/api/responses`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, response })
        });

        if (res.ok) {
          const data = await res.json();
          messageDiv.textContent = `✅ Response saved! (ID: ${data.id})`;
          messageDiv.style.color = "green";
          responseInput.value = "";
        } else {
          messageDiv.textContent = "⚠️ Error submitting response.";
          messageDiv.style.color = "red";
        }
      } catch (err) {
        messageDiv.textContent = "❌ Could not connect to server.";
        messageDiv.style.color = "red";
      }
    });
  });
</script>

