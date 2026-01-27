---
layout: post
courses: { csse: {week: 8}, csp: {week: 17}, csa: {week: 21 } }
codemirror: true
title: UI Runner Examples
description: An introduction showing how to create JavaScript games.  Game Builder will start the design process. lessons using the UI Runner help understatn the parts of  for game development, canvas graphics, DOM manipulation, and interactive visualizations.
permalink: /code/ui
---

## Begin Game Development with Game Builder

A [GameBuilder]({{site.baseurl}}/rpg/gamebuilder) begins our jouney into game building.  Build a layout with some key game pieces (Background, Player, NPC, and Obstacles).

## Define UI Runner in a Lesson

UI Runner requires defining **challenge** and **code** variables, then passing them to the include with a unique **runner_id**. The code has access to `outputElement` for DOM manipulation.

```liquid
{% raw %}{% capture challenge1 %}
Create a red square on the canvas. Use the GameEngine to render it!
{% endcapture %}

{% capture code1 %}
// Clear the output
outputElement.innerHTML = '';

// Create canvas
const canvas = document.createElement('canvas');
canvas.width = 400;
canvas.height = 400;
outputElement.appendChild(canvas);

// Draw red square
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'red';
ctx.fillRect(100, 100, 200, 200);
{% endcapture %}

{% include ui-runner.html 
   runner_id="visual1"
   challenge=challenge1
   code=code1
   height="300px"
%}{% endraw %}
```

### Parameters

- **runner_id** (required): Unique ID for each runner on the page (e.g., "visual1", "visual2")
- **challenge**: Variable containing the challenge/instruction text
- **code**: Variable containing the starter JavaScript code
- **height** (optional): Editor height (defaults to "300px")

### UI Runner Architecture

#### HTML Component

- File: `_includes/ui-runner.html`
- Reusable component for visual JavaScript output
- Uses CodeMirror for syntax highlighting (JavaScript mode only)
- Provides `outputElement` variable for DOM manipulation

#### SCSS Styling

- Main file: `_sass/open-coding/forms/ui-runner.scss`
- Uses the same mixin architecture as code-runner:
  - `@mixin control-panel` - Top/bottom toolbars with buttons
  - `@mixin sub-container` - Groups editor/output sections
  - `@mixin info-panel` - Challenge box styling
  - `@mixin emphasized-icon-button` - Run button with accent color
  - `@mixin icon-button` - Stop/Reset/Copy/Clear buttons

#### Output Element

The `outputElement` variable is a div container where your visual output appears:
- Min height: 400px
- Max height: 600px  
- Scrollable if content exceeds max height
- Supports canvas, SVG, and any DOM elements
- Automatically cleared when Stop or Reset is clicked

#### Color Variables

Uses the same color system as code-runner:
- `--pref-bg-color` - Background color
- `--pref-text-color` - Text color
- `--pref-accent-color` - Accent/emphasis color
- `--ui-border` - Border color
- `--panel` - Panel background

---

## Canvas Lesson: Draw a Square

{% capture challenge1 %}
Create a red square on the canvas. The square should be 200x200 pixels and centered in a 400x400 canvas.
{% endcapture %}

{% capture code1 %}
// Clear the output
outputElement.innerHTML = '';

// Create canvas
const canvas = document.createElement('canvas');
canvas.width = 400;
canvas.height = 400;
outputElement.appendChild(canvas);

// Draw red square
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'red';
ctx.fillRect(100, 100, 200, 200);
{% endcapture %}

{% include ui-runner.html
   runner_id="visual1"
   challenge=challenge1
   code=code1
%}

---

## GameEngine Lesson: Simple Level

{% capture challenge2 %}
Use the GameEngine to create a simple game level. The player (blue square) should be able to move around the screen. Try clicking the canvas and using arrow keys!
{% endcapture %}

{% capture code2 %}
// Clear the output
outputElement.innerHTML = '';

// Create canvas
const canvas = document.createElement('canvas');
canvas.width = 400;
canvas.height = 400;
canvas.style.border = '2px solid #3b82f6';
outputElement.appendChild(canvas);

// Add control hints
const hint = document.createElement('div');
hint.style.padding = '12px';
hint.style.color = '#9ca3af';
hint.style.fontSize = '14px';
hint.innerHTML = '🎮 <strong>Controls:</strong> Arrow Keys or WASD to move';
outputElement.appendChild(hint);

// Simple player movement system
const ctx = canvas.getContext('2d');
let playerX = 200;
let playerY = 200;
const playerSize = 30;

// Draw function
function draw() {
    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw player
    ctx.fillStyle = 'blue';
    ctx.fillRect(playerX - playerSize/2, playerY - playerSize/2, playerSize, playerSize);
}

// Keyboard controls
const keys = {};
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

// Game loop
function update() {
    const speed = 3;
    if (keys['ArrowUp'] || keys['w']) playerY -= speed;
    if (keys['ArrowDown'] || keys['s']) playerY += speed;
    if (keys['ArrowLeft'] || keys['a']) playerX -= speed;
    if (keys['ArrowRight'] || keys['d']) playerX += speed;
    
    // Keep player in bounds
    playerX = Math.max(playerSize/2, Math.min(canvas.width - playerSize/2, playerX));
    playerY = Math.max(playerSize/2, Math.min(canvas.height - playerSize/2, playerY));
    
    draw();
    requestAnimationFrame(update);
}

// Start the game
draw();
update();
{% endcapture %}

{% include ui-runner.html
   runner_id="visual2"
   challenge=challenge2
   code=code2
   height="400px"
%}

---

## DOM Lesson: Interactive Elements

{% capture challenge3 %}
Create an interactive button that changes color when clicked. Use DOM manipulation to create and style the button.
{% endcapture %}

{% capture code3 %}
// Clear the output
outputElement.innerHTML = '';

// Create a button
const button = document.createElement('button');
button.textContent = 'Click Me!';
button.style.padding = '20px 40px';
button.style.fontSize = '18px';
button.style.border = 'none';
button.style.borderRadius = '8px';
button.style.cursor = 'pointer';
button.style.backgroundColor = '#3b82f6';
button.style.color = 'white';

// Add click event
let isBlue = true;
button.addEventListener('click', () => {
    if (isBlue) {
        button.style.backgroundColor = '#ef4444';
        button.textContent = 'Red!';
    } else {
        button.style.backgroundColor = '#3b82f6';
        button.textContent = 'Blue!';
    }
    isBlue = !isBlue;
});

// Add to output
outputElement.appendChild(button);
{% endcapture %}

{% include ui-runner.html
   runner_id="visual3"
   challenge=challenge3
   code=code3
   height="250px"
%}

---

## Best Practices

### Code Structure

Always start your code by clearing the output element:
```javascript
outputElement.innerHTML = '';
```

### Canvas Setup

For canvas-based lessons:
```javascript
const canvas = document.createElement('canvas');
canvas.width = 400;
canvas.height = 400;
outputElement.appendChild(canvas);
const ctx = canvas.getContext('2d');
```

### Animation Cleanup

For animations using `requestAnimationFrame`, store the animation ID and clean it up when needed:
```javascript
let animationId;

function animate() {
    // Your animation code
    animationId = requestAnimationFrame(animate);
}

animate();

// The Stop button will clear the output, stopping the animation
```

### Memory Management

The UI Runner automatically cleans up when:
- The Stop button is clicked (clears output and resets code)
- The Reset button is clicked (resets to original code)
- New code is run (clears previous output)

This prevents memory leaks from accumulating event listeners or animation loops.

---

## Teaching Tips

### Progressive Complexity

Start with simple DOM manipulation, then move to canvas drawing, and finally to game mechanics:
1. **DOM Basics**: Create elements, style them, add event listeners
2. **Canvas Drawing**: Draw shapes, use colors, understand coordinates
3. **Animation**: Use requestAnimationFrame, update positions
4. **Game Logic**: Handle input, implement physics, manage state

### GameEngine Integration

When using the GameEngine framework:
- Import necessary classes at the top of your code
- Create a canvas element for the game
- Initialize the game engine with the canvas
- Provide clear instructions about controls (arrow keys, mouse clicks, etc.)

### Debugging Hints

Students can use `console.log()` to debug - output appears in the browser console (F12 Developer Tools).
