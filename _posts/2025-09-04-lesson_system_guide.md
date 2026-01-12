---
layout: post
title: Interactive Lesson System - Developer Guide
description: Learn how to add custom interactive features to the lesson system using frontmatter configuration and JavaScript blocks
type: issues
comments: true
permalink: /lesson-system-guide
---

# Interactive Lesson System - Developer Guide

## How the System Works

The lesson system is built around a base layout (`lessonbase.html`) that provides a consistent structure for all lessons. Features are activated through frontmatter configuration in individual lesson files.

### Basic Architecture

Lesson File (.md) → Frontmatter Configuration → lessonbase.html → Rendered Page

The base layout checks for specific frontmatter variables and conditionally includes features based on those settings.

## File Structure

The lesson system uses these key files:
- **`_layouts/lessonbase.html`** - Main layout template
- **`assets/js/lessonbase.js`** - JavaScript functionality  
- **`_sass/minima/lessonbase.scss`** - Sass styling (compiled to CSS)

## Adding Your Own Interactive Blocks

### Step 1: Create Your Feature Block

Create your feature as a conditional block in `lessonbase.html`:

{% raw %}
```html
<!-- Your Feature Block -->
{% if page.enable_your_feature %}
<div class="your-feature-container">
    <h4>{{ page.your_feature_title | default: "Default Title" }}</h4>
    <!-- Your HTML content -->
    <div id="your-feature-content">
        {{ page.your_feature_data }}
    </div>
    <button id="your-feature-button">Action Button</button>
</div>
{% endif %}
```
{% endraw %}

### Step 2: Add JavaScript Support

In `assets/js/lessonbase.js`, add your feature using the IIFE pattern like existing features:

```javascript
// -------------------- YOUR FEATURE --------------------
(function () {
  const button = document.getElementById('your-feature-button');
  const content = document.getElementById('your-feature-content');
  if (!button || !content) return;

  const lessonKey = window.location.pathname.split("/").pop() || "lesson";
  
  button.addEventListener('click', () => {
    // Your feature logic here
    console.log('Feature activated for:', lessonKey);
    
    // Example: Save data to localStorage
    localStorage.setItem(`your-feature-${lessonKey}`, 'some data');
    
    // Example: Trigger badge unlock
    unlockBadge(lessonKey);
  });
})();
```

### Step 3: Add SCSS Styling

In `_sass/minima/lessonbase.scss`, style your feature using Sass:

```scss
// Your Feature Styles
.your-feature-container {
  margin: 1rem 0;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: $panel; // Use existing theme variables
}

#your-feature-content {
  background: $bg-2;
  padding: 0.5rem;
  color: $text;
}

.your-feature-button {
  @include btn-base; // Use existing button mixin
  background: $accent-700;
  
  &:hover {
    background: $accent-700-hover;
  }
}
```

## Frontmatter Configuration

To use your feature in a lesson, add the configuration to the frontmatter:

```yaml
---
layout: lessonbase
title: "Your Lesson Title"

# Enable your feature
enable_your_feature: true
your_feature_title: "Custom Title"
your_feature_data: "Your data here"
---
```

## Complete Working Example

### 1. HTML Block (in lessonbase.html)
{% raw %}
```html
{% if page.enable_calculator %}
<div class="calculator-widget">
    <h4>🧮 {{ page.calculator_title | default: "Calculator" }}</h4>
    <input type="number" id="calc-input1" placeholder="First number">
    <select id="calc-operation">
        <option value="add">+</option>
        <option value="subtract">-</option>
        <option value="multiply">×</option>
        <option value="divide">÷</option>
    </select>
    <input type="number" id="calc-input2" placeholder="Second number">
    <button id="calc-button">Calculate</button>
    <div id="calc-result"></div>
</div>
{% endif %}
```
{% endraw %}

### 2. JavaScript (in assets/js/lessonbase.js)
```javascript
// -------------------- CALCULATOR WIDGET --------------------
(function () {
  const button = document.getElementById('calc-button');
  const result = document.getElementById('calc-result');
  if (!button || !result) return;

  const lessonKey = window.location.pathname.split("/").pop() || "lesson";

  button.addEventListener('click', () => {
    const num1 = parseFloat(document.getElementById('calc-input1').value);
    const num2 = parseFloat(document.getElementById('calc-input2').value);
    const operation = document.getElementById('calc-operation').value;
    
    let answer;
    switch(operation) {
      case 'add': answer = num1 + num2; break;
      case 'subtract': answer = num1 - num2; break;
      case 'multiply': answer = num1 * num2; break;
      case 'divide': answer = num1 / num2; break;
    }
    
    result.innerHTML = `Result: ${answer}`;
    
    // Save calculation to localStorage
    localStorage.setItem(`calc-last-${lessonKey}`, answer);
    
    // Unlock badge after first calculation
    unlockBadge(lessonKey);
  });
})();
```

### 3. SCSS (in _sass/minima/lessonbase.scss)
```scss
// Calculator Widget
.calculator-widget {
  background: lighten($bg-1, 5%);
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 8px;
  border: 2px solid $accent;
  color: $text;

  input, select, button {
    margin: 0.25rem;
    padding: 0.5rem;
    border: 1px solid darken($surface, 10%);
    border-radius: 4px;
    background: $bg-2;
    color: $text;

    &:focus {
      outline: none;
      border-color: $accent;
    }
  }

  button {
    @include btn-base;
    background: $accent-700;

    &:hover {
      background: $accent-700-hover;
      transition: background 0.2s ease;
    }
  }
}

#calc-result {
  margin-top: 1rem;
  font-weight: bold;
  color: $green;
  padding: 0.5rem;
  background: $bg-3;
  border-radius: 4px;
  text-align: center;
}
```

### 4. Frontmatter Usage
```yaml
---
layout: lessonbase
title: "Math Lesson"

# Enable calculator
enable_calculator: true
calculator_title: "Practice Calculator"
---

# Math Concepts

Use the calculator below to practice:
```

## Available SCSS Variables and Mixins

The `lessonbase.scss` file provides many pre-defined variables and mixins you can use:

### Theme Variables
```scss
// Colors
$bg-0: #000;
$bg-1: #1F2020;
$bg-2: #1F1F1F;
$bg-3: #2A2D2D;
$panel: #2B2B2B;
$surface: #333;
$text: #F0F0F0;
$text-muted: #aaa;
$accent: #4CAFEF;
$accent-700: #007ACC;
$accent-700-hover: #005FA3;
$green: #4ADE80;
$warn: #FBBF24;

// Breakpoints
$bp-md: 768px;
```

### Useful Mixins
```scss
// Sticky positioning
@include sticky(1rem);

// Scrollable area
@include scroll-y;

// Button base styles
@include btn-base;

// Info boxes with colored left border
@include info-box($color);
```

## Existing Feature Patterns

### Simple Toggle Features
```yaml
enable_timer: true          # Shows/hides timer
enable_progress: true       # Shows/hides progress bar
enable_badges: true         # Shows/hides badge system
enable_blackboard: true     # Shows/hides drawing canvas
enable_flashcards: true     # Shows/hides flashcard system
```

### Features with Configuration
{% raw %}
```yaml
enable_sandbox: true
sandbox_code: |             # Multi-line YAML content
  console.log("Default code");
  // Students can edit this

enable_demo: true
demo_display_code: 'console.log("Hello World!");'
demo_width: 400
demo_height: 300
```
{% endraw %}

### List-based Features
```yaml
lesson_links:               # Array of objects
  - { text: "Lesson 1", url: "/lesson1" }
  - { text: "Lesson 2", url: "/lesson2" }

resources:                  # Another array example
  - { text: "MDN Docs", url: "https://developer.mozilla.org" }
  - { text: "Tutorial", url: "https://example.com" }

flashcards:                 # Flashcard data
  - { front: "Question 1", back: "Answer 1" }
  - { front: "Question 2", back: "Answer 2" }
```

## Built-in Functions Available

The `lessonbase.js` provides several utilities you can use in your features:

### Badge System
```javascript
unlockBadge(lessonKey);  // Triggers badge popup and saves to localStorage
```

### Lesson Identification
```javascript
const lessonKey = window.location.pathname.split("/").pop() || "lesson";
```

### Data Persistence Patterns
```javascript
// Save lesson-specific data
localStorage.setItem(`feature-${lessonKey}`, data);

// Load lesson-specific data  
const saved = localStorage.getItem(`feature-${lessonKey}`);

// Save global data
localStorage.setItem('feature-global', data);
```

## Best Practices

### 1. Use IIFE Pattern
Follow the existing pattern for JavaScript features:
```javascript
// -------------------- YOUR FEATURE --------------------
(function () {
  const element = document.getElementById('your-element');
  if (!element) return; // Exit early if element doesn't exist
  
  // Your code here
})();
```

### 2. Use Conditional Blocks in HTML
Always wrap your features in conditional statements:
{% raw %}
```html
{% if page.enable_feature %}
  <!-- Feature content -->
{% endif %}
```
{% endraw %}

### 3. Provide Default Values
Use the `default` filter for optional configuration:
{% raw %}
```html
<h4>{{ page.feature_title | default: "Default Title" }}</h4>
```
{% endraw %}

### 4. Namespace Your Features
Use consistent prefixes for IDs and classes:
```html
<div class="myfeature-container">
    <button id="myfeature-button">Click</button>
</div>
```

### 5. Use Lesson-Specific Storage
Make data persistent per lesson:
```javascript
const lessonKey = window.location.pathname.split("/").pop() || "lesson";
localStorage.setItem(`feature-${lessonKey}`, data);
```

### 6. Leverage SCSS Features
Take advantage of Sass features in your styling:
```scss
// Use variables for consistency
.my-feature {
  background: $panel;
  color: $text;
  
  // Nest selectors
  .my-feature-item {
    padding: 0.5rem;
    
    &:hover {
      background: lighten($panel, 5%);
    }
  }
  
  // Use mixins
  @include btn-base;
  
  // Responsive design
  @media (max-width: $bp-md) {
    padding: 0.5rem;
  }
}
```

## Quick Reference

| Pattern | Usage | File Location |
|---------|-------|---------------|
| Simple toggle | `enable_feature: true` | Frontmatter |
| Custom text | `feature_title: "My Title"` | Frontmatter |
| Multi-line content | `feature_content: \|` (followed by indented content) | Frontmatter |
| Arrays | Use `- { key: value }` format | Frontmatter |
| Default values | Use `default` filter in HTML | lessonbase.html |
| Styling | Use SCSS variables and mixins | _sass/minima/lessonbase.scss |
| JavaScript | Use IIFE pattern | assets/js/lessonbase.js |

## Development Workflow

1. **Plan Your Feature** - Decide what interactive element you want to add
2. **Update HTML** - Add conditional block in `_layouts/lessonbase.html`
3. **Add JavaScript** - Implement functionality in `assets/js/lessonbase.js`
4. **Style with SCSS** - Add styles in `_sass/minima/lessonbase.scss`
5. **Configure Frontmatter** - Define variables for your feature
6. **Test in Lesson** - Create a test lesson file to verify everything works
7. **Document Usage** - Add examples to help others use your feature

This system allows anyone to easily add new interactive features to lessons by following these patterns and leveraging the existing SCSS architecture.