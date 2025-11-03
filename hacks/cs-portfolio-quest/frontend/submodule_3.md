---
layout: cs-portfolio-lesson
title: "CSS Styling Fundamentals"
description: "Submodule 3 of Frontend Development Mini-Quest"
permalink: /cs-portfolio-quest/frontend/submodule_3/
parent: "Frontend Development"
team: "Creators"
submodule: 3
microblog: True
breadcrumb: True
categories: [CSP, Submodule, Frontend]
tags: [css, styling, fundamentals]
author: "Creators Team"
date: 2025-10-21
---


<style>
/* ============ CSS Playground Styling ============ */
.css-playground {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
    align-items: flex-start;
    background: linear-gradient(135deg, #0b1a33, #102a4c, #0c2340);
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
    color: #fff;
    font-family: "Segoe UI", sans-serif;
    margin-top: 30px;
}


.editor-container, .preview-container {
    flex: 1 1 45%;
    background: #13284d;
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.4);
    min-width: 320px;
}


.editor-container h3,
.preview-container h3 {
    text-align: center;
    color: #a6c9ff;
    margin-bottom: 10px;
    font-weight: 600;
    letter-spacing: 0.5px;
}


#css-input {
    width: 100%;
    min-height: 300px; /* ensures more vertical space */
    font-family: "Consolas", "Courier New", monospace;
    font-size: 15px;
    background-color: #0e1f3d;
    color: #e8f0ff;
    border: 1px solid #355c9b;
    border-radius: 10px;
    padding: 15px;
    resize: vertical;
    line-height: 1.4;
    white-space: pre; /* keeps one-line CSS intact */
    overflow-x: auto; /* allows horizontal scroll instead of wrapping */
}


button {
    margin-top: 10px;
    margin-right: 10px;
    background-color: #1a4c8b;
    color: #fff;
    border: none;
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
}


button:hover {
    background-color: #2560b3;
    transform: translateY(-2px);
}


.preview-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    overflow: auto;
}


#css-preview {
    width: 100%;
    background: #0e1f3d;
    border-radius: 10px;
    padding: 30px;
    text-align: center;
    min-height: 250px;
    color: #e8f0ff;
    border: 1px solid #355c9b;
}


/* ===== Button Improvements ===== */
button {
    margin-top: 10px;
    margin-right: 10px;
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
    font-family: "Segoe UI", sans-serif;
}


/* Apply CSS button (primary) */
button.apply-btn {
    background-color: #1a73e8;
    color: #fff;
}


button.apply-btn:hover {
    background-color: #2c85f7;
    transform: translateY(-2px);
}


/* Reset CSS button (secondary/danger) */
button.reset-btn {
    background-color: #d9534f;
    color: #fff;
}


button.reset-btn:hover {
    background-color: #e46863;
    transform: translateY(-2px);
}


/* ===== Checkpoints ===== */
.checkpoint {
    background: linear-gradient(135deg, #0b1a33, #102a4c, #0c2340);
    border-radius: 15px;
    padding: 25px;
    color: #eaf0ff;
    margin: 25px 0;
    box-shadow: 0 4px 15px rgba(0,0,0,0.5);
}
.checkpoint h3 {
    color: #a6c9ff;
    text-align: center;
    margin-bottom: 15px;
}
.checkpoint textarea {
    width: 100%;
    background-color: #0e1f3d;
    color: #e8f0ff;
    border: 1px solid #355c9b;
    border-radius: 8px;
    font-family: "Consolas", monospace;
    padding: 10px;
    min-height: 100px;
}
.feedback {
    margin-top: 10px;
    font-weight: 500;
}
.feedback.correct {
    color: #28a745;
}
.feedback.incorrect {
    color: #dc3545;
}
</style>


# CSS Styling Fundamentals


## Learning Objectives
<p>By the end of this module, you will be able to:</p>
<ul>
  <li> - Understand basic CSS syntax and how to apply styles</li>
  <li> - Use different types of CSS selectors effectively</li>
  <li> - Implement basic layouts and styling techniques</li>
  <li> - Debug common CSS issues</li>
</ul>


## CSS Basics
CSS (Cascading Style Sheets) is a powerful language used to style webpages. It describes how HTML elements are displayed on the screen and can easily change properties of elements like colors, layouts, spacing, and more.


### CSS Implementation Methods
CSS can be implemented in three ways:
<ol>
    <li><strong>1. Inline CSS</strong>: Directly in HTML elements using the style attribute</li>
    <li><strong>2. Internal CSS</strong>: Using the <code>&lt;style&gt;</code> tag in HTML document</li>
    <li><strong>3. External CSS</strong>: Linking an external .css file</li>
</ol>

Examples:
```html
<!-- Inline CSS -->
<p style="color: blue;">This is inline styling</p>

<!-- Internal CSS (in head section) -->
<style>
    p { color: blue; }
</style>

<!-- External CSS -->
<link rel="stylesheet" href="styles.css">
```


### Basic Syntax
CSS follows a simple pattern:
```css
selector {
    property: value;
    another-property: value;
}
```

<div id="checkpoint1" class="checkpoint">
  <h3>Checkpoint 1: Change Paragraph Text Color</h3>
  <p>Write CSS that makes all &lt;p&gt; text red.</p>
  <textarea id="checkpoint1-input" placeholder="Your Code Here"></textarea><br>
  <button class="apply-btn" onclick="validateCheckpoint1()">Check Answer</button>
  <p id="checkpoint1-feedback" class="feedback"></p>
</div>


## CSS Selectors
CSS selectors are patterns used to select and style HTML elements. Here are the main types:


### Basic Selectors

1. **Universal Selector (*)**

    ```css
    * { margin: 0; }
    ```

2. **Element Selector**

    ```css
    p { color: blue; }
    ```

3. **Class Selector (.)**

    ```css
    .button { background: yellow; }
    ```

4. **ID Selector (#)**

    ```css
    #header { font-size: 24px; }
    ```


### Advanced Selectors

1. **Attribute Selectors**

    ```css
    input[type="text"] { border: 1px solid gray; }
    ```

2. **Pseudo-classes**

    ```css
    a:hover { color: red; }
    ```

3. **Combinators**

    ```css
    div > p { margin: 10px; }
    ```

<div id="checkpoint2" class="checkpoint">
  <h3>Checkpoint 2: Multiple Choice</h3>
  <p>Which CSS selector targets all elements on the page?</p>
  <div>
    <input type="radio" name="q2" value="a"> a) .all { }<br>
    <input type="radio" name="q2" value="b"> b) #all { }<br>
    <input type="radio" name="q2" value="c"> c) * { }<br>
    <input type="radio" name="q2" value="d"> d) body, html { }<br>
  </div>
  <button class="apply-btn" onclick="validateCheckpoint2()">Submit</button>
  <p id="checkpoint2-feedback" class="feedback"></p>
</div>


## CSS Box Model
<p>The CSS box model is fundamental to understanding layout in CSS. Every element in CSS has:</p>
<ul>
  <li> - <strong>Content</strong>: The actual content of the element</li>
  <li> - <strong>Padding</strong>: Clear space around the content</li>
  <li> - <strong>Border</strong>: A border around the padding</li>
  <li> - <strong>Margin</strong>: Clear space outside the border</li>
</ul>

<div style="background: linear-gradient(135deg, #0b1a33, #102a4c, #0c2340); padding: 30px; border-radius: 15px; color: #eaf0ff; font-family: 'Segoe UI', sans-serif; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.5); margin-top: 30px;">
  <h3 style="color:#a6c9ff; margin-bottom: 20px;">The CSS Box Model</h3>
  <div style="display: inline-block; position: relative; text-align: center;">
    <!-- Margin -->
    <div style="background-color: rgba(173, 216, 230, 0.15); padding: 20px; border-radius: 10px;">
      <div style="color:#a6c9ff; font-size:14px; margin-bottom:5px;">Margin</div>


      <!-- Border -->
      <div style="background-color: rgba(100, 149, 237, 0.25); padding: 15px; border-radius: 8px;">
        <div style="color:#a6c9ff; font-size:14px; margin-bottom:5px;">Border</div>


        <!-- Padding -->
        <div style="background-color: rgba(135, 206, 250, 0.35); padding: 12px; border-radius: 6px;">
          <div style="color:#a6c9ff; font-size:14px; margin-bottom:5px;">Padding</div>


          <!-- Content -->
          <div style="background-color: #1a3b6d; color:#ffffff; padding: 20px; border-radius: 4px; box-shadow: inset 0 0 10px rgba(0,0,0,0.4);">
            <strong>Content</strong><br>
            <span style="font-size: 13px; opacity: 0.8;">(text, images, etc.)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <p style="font-size: 14px; color: #a6c9ff; margin-top: 15px;">
    Each layer adds space or structure around the content box.
  </p>
</div>

<div style="background: linear-gradient(135deg, #0b1a33, #102a4c, #0c2340); padding: 25px; border-radius: 15px; color: #eaf0ff; font-family: 'Segoe UI', sans-serif; margin-top: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
  <h3 style="text-align:center; color:#a6c9ff; margin-bottom:15px;">🎨 CSS Property Cheat Sheet</h3>
  <table style="width:100%; border-collapse:collapse; text-align:left; font-size:15px;">
    <thead style="background:#12294a;">
      <tr>
        <th style="padding:10px; color:#a6c9ff;">Category</th>
        <th style="padding:10px; color:#a6c9ff;">Property</th>
        <th style="padding:10px; color:#a6c9ff;">Example</th>
        <th style="padding:10px; color:#a6c9ff;">Purpose</th>
      </tr>
    </thead>
    <tbody>
      <tr><td style="padding:8px;">Text & Font</td><td>`color`</td><td>`color: blue;`</td><td>Sets text color</td></tr>
      <tr><td></td><td>`font-size`</td><td>`font-size: 18px;`</td><td>Controls text size</td></tr>
      <tr><td></td><td>`font-family`</td><td>`font-family: Arial, sans-serif;`</td><td>Changes typeface</td></tr>
      <tr><td></td><td>`text-align`</td><td>`text-align: center;`</td><td>Aligns text</td></tr>
      <tr><td></td><td>`font-weight`</td><td>`font-weight: bold;`</td><td>Makes text bold</td></tr>


      <tr><td style="padding:8px;">Box & Layout</td><td>`margin`</td><td>`margin: 20px;`</td><td>Space outside an element</td></tr>
      <tr><td></td><td>`padding`</td><td>`padding: 10px;`</td><td>Space inside an element</td></tr>
      <tr><td></td><td>`border`</td><td>`border: 1px solid black;`</td><td>Adds border</td></tr>
      <tr><td></td><td>`box-shadow`</td><td>`box-shadow: 0 4px 8px gray;`</td><td>Adds shadow</td></tr>


      <tr><td style="padding:8px;">Backgrounds & Borders</td><td>`background-color`</td><td>`background-color: lightblue;`</td><td>Sets background color</td></tr>
      <tr><td></td><td>`border-radius`</td><td>`border-radius: 10px;`</td><td>Rounds corners</td></tr>


      <tr><td style="padding:8px;">Position & Display</td><td>`display`</td><td>`display: flex;`</td><td>Defines display type</td></tr>
      <tr><td></td><td>`position`</td><td>`position: absolute;`</td><td>Positions element</td></tr>
      <tr><td></td><td>`top`, `left`</td><td>`top: 10px;`</td><td>Offsets element position</td></tr>


      <tr><td style="padding:8px;">Animations & Effects</td><td>`transition`</td><td>`transition: all 0.3s ease;`</td><td>Animates property changes</td></tr>
      <tr><td></td><td>`transform`</td><td>`transform: rotate(10deg);`</td><td>Rotates or scales element</td></tr>
      <tr><td></td><td>`opacity`</td><td>`opacity: 0.8;`</td><td>Controls transparency</td></tr>
    </tbody>
  </table>
</div>

<div id="checkpoint3" class="checkpoint">
  <h3>Checkpoint 3: Create a Shadowed Box</h3>
  <p>Write CSS for a class called <code>.card</code> that creates a green shadow and 50px padding.</p>
  <textarea id="checkpoint3-input" placeholder="Your Code Here (Tip: Use the Cheat Sheet)"></textarea><br>
  <button class="apply-btn" onclick="validateCheckpoint3()">Check Answer</button>
  <p id="checkpoint3-feedback" class="feedback"></p>
</div>


## Grouping
If we want to add the same styling to multiple elements, we can use grouping. Similar to the example with p above, simply add multiple elements before the {} to do this. Example:

```css
h1, h2 {
    color: red;
}
```


## Comments
A very basic part of CSS, but it is always good practice to comment on code that may be unclear. To create a single line comment, use /**/ in the same line, and you can also spread that out through multiple lines to create a multi-line comment. Examples:

```css
.button {
    /* This is a single line comment */
    background-color: yellow;
}

#header {
    /* This is a
        multi-line comment */
    font-family: Papyrus;
}
```


## Other Resource(s)
You can find a lot more in-depth information here: <a href="https://www.geeksforgeeks.org/css/css-introduction/">Geeks for Geeks CSS Introduction</a>


## Best Practices
<ol>
  <li>1. Use meaningful class names</li>
  <li>2. Keep selectors simple</li>
  <li>3. Use comments for complex styles</li>
  <li>4. Organize properties consistently</li>
  <li>5. Consider mobile-first design</li>
</ol>


## Layout with Flexbox
Flexbox is a powerful layout model that makes it easy to create flexible, responsive layouts. Example:

```css
.container {
    display: flex;
    justify-content: center;
    align-items: center;
}
```


## Practice Challenges
<ol>
  <li>1. Create a centered card with padding and shadow</li>
  <li>2. Build a simple navigation bar using flexbox</li>
  <li>3. Create a responsive grid layout</li>
  <li>4. Style a form with custom inputs</li>
</ol>


## Interactive CSS Playground
Try out your CSS below:


<div class="css-playground">
    <div class="editor-container">
        <h3>CSS Editor</h3>
        <textarea id="css-input" rows="10" placeholder="Enter your CSS here...
Example:
.test-div {
    background-color: blue;
    padding: 20px;
    color: white;
}"></textarea>
        <button onclick="applyCSS()">Apply CSS</button>
        <button onclick="resetCSS()">Reset CSS</button>
    </div>
    <div class="preview-container">
        <h3>Preview</h3>
        <div id="css-preview">
            <div class="test-div">Test Content</div>
        </div>
    </div>
</div>

<script>
function applyCSS() {
    const styleElement = document.getElementById('dynamic-style');
    if (styleElement) {
        styleElement.remove();
    }
    const css = document.getElementById('css-input').value;
    const style = document.createElement('style');
    style.id = 'dynamic-style';
    style.textContent = css;
    document.head.appendChild(style);
}

function resetCSS() {
    document.getElementById('css-input').value = '';
    document.getElementById('dynamic-style')?.remove();
}

// ===== Enable Tab Key in Textarea =====
document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.getElementById('css-input');

    textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;

            // Insert four spaces (you could also use "\t" if preferred)
            const value = textarea.value;
            textarea.value = value.substring(0, start) + '    ' + value.substring(end);

            // Move cursor forward after inserted spaces
            textarea.selectionStart = textarea.selectionEnd = start + 4;
        }
    });
});

/* ====== Checkpoint Logic ====== */
function updateTracker(id, status) {
    const item = document.getElementById(`tracker${id}`);
    item.classList.remove('completed', 'failed');
    if (status === 'completed') item.classList.add('completed');
    if (status === 'failed') item.classList.add('failed');
    localStorage.setItem(`checkpoint${id}`, status);
}
function restoreProgress() {
    for (let i = 1; i <= 3; i++) {
        const status = localStorage.getItem(`checkpoint${i}`);
        if (status) updateTracker(i, status);
    }
}
function resetProgress() {
    for (let i = 1; i <= 3; i++) {
        localStorage.removeItem(`checkpoint${i}`);
        const item = document.getElementById(`tracker${i}`);
        item.classList.remove('completed', 'failed');
    }
    document.querySelectorAll('.feedback').forEach(f => f.textContent = '');
}

// Validation functions
function validateCheckpoint1() {
    const input = document.getElementById('checkpoint1-input').value.trim().toLowerCase();
    const feedback = document.getElementById('checkpoint1-feedback');
    if (input.includes('p') && input.includes('color:') && input.includes('red')) {
        feedback.textContent = '✅ Correct! Paragraph text set to red.';
        feedback.className = 'feedback correct';
        updateTracker(1, 'completed');
    } else {
        feedback.textContent = '❌ Try again — remember to target <p> and use color: red;';
        feedback.className = 'feedback incorrect';
        updateTracker(1, 'failed');
    }
}

function validateCheckpoint2() {
    const selected = document.querySelector('input[name="q2"]:checked');
    const feedback = document.getElementById('checkpoint2-feedback');
    if (!selected) {
        feedback.textContent = '⚠️ Please select an answer.';
        feedback.className = 'feedback incorrect';
        return;
    }
    if (selected.value === 'c') {
        feedback.textContent = '✅ Correct! The universal selector * targets all elements.';
        feedback.className = 'feedback correct';
        updateTracker(2, 'completed');
    } else {
        feedback.textContent = '❌ Incorrect. The correct answer is * { }.';
        feedback.className = 'feedback incorrect';
        updateTracker(2, 'failed');
    }
}

function validateCheckpoint3() {
    const input = document.getElementById('checkpoint3-input').value.trim().toLowerCase();
    const feedback = document.getElementById('checkpoint3-feedback');
    if (input.includes('.card') && input.includes('box-shadow') && input.includes('green') && input.includes('padding: 50px')) {
        feedback.textContent = '✅ Great! You added a box shadow and padding.';
        feedback.className = 'feedback correct';
        updateTracker(3, 'completed');
    } else {
        feedback.textContent = '❌ Check syntax — make sure your class is .card and includes box-shadow and padding.';
        feedback.className = 'feedback incorrect';
        updateTracker(3, 'failed');
    }
}

restoreProgress();
</script>


