---
layout: post
codemirror: true
title: Sprint 5 Transition Teaching Lesson
permalink: /sprintingsnails/transitions
author: Sophie Haas
---
Have you ever wanted to know how to add a transition screen to your game? Maybe when the game ends, you want to keep the player connected to the experience by flashing a massive:

<h2 style="text-align: center; margin: 20px 0;">
<strong style="color: #ff0000; text-shadow: 0 0 10px #ff0000; font-family: 'Arial Black', sans-serif;">G A M E &nbsp; O V E R</strong>
</h2>

...or build anticipation for the next challenge with a bold:

<h2 style="text-align: center; margin: 20px 0;">
<strong style="color: #ffd700; text-shadow: 0 0 10px #ffd700; font-family: 'Arial Black', sans-serif;">L E V E L &nbsp; 1</strong>
</h2>

Static games can feel "stiff." Transition screens act as the theater curtain for your code—they hide the background logic, signal a change in state, and provide crucial feedback to the player.

In this blog, we’re going to demonstrate how to use:

Dynamic DOM Injection: Building UI elements on the fly.

CSS Keyframe Animations: Adding movement and "pulse" to your screens.

Logic Triggers: Timing your transitions to match game events.
<div style="display: flex; justify-content: center; margin-bottom: 30px;">
    <a href="{{site.baseurl}}/gamify/timmycounter.html" style="text-decoration: none;">
        <div style="background: linear-gradient(45deg, #4a0b0b, #220505); color: white; padding: 15px 30px; border-radius: 8px; font-family: 'Bungee', cursive; border: 1px solid #ff0000; box-shadow: 0 4px 15px rgba(255, 0, 0, 0.3); text-transform: uppercase; letter-spacing: 1px;">
            View Kirby Maze Example
        </div>
    </a>
</div>

# Understanding UI Transitions & Overlays

A transition screen is a **UI Overlay** that sits on a higher "layer" than your game world. In game development, we call this the **HUD (Heads-Up Display)** or **UI Layer**.

---

### The Primary Jobs of a Transition Screen
* **State Signaling:** Letting the player know exactly what happened—whether they won, lost, or paused.
* **Input Blocking:** Creating a "logical wall" that prevents the player from moving or interacting with the game world while the screen is visible.
* **Scene Management:** Providing the "Escape Hatch"—buttons to restart the level or move to the next stage.

---

# How it Works in Your Code
Your implementation uses a **"CSS-in-JS"** approach. Since we are working in a Notebook environment, we can't easily jump between different HTML files, so we manipulate the **DOM** (the webpage structure) directly.

### The "Ghost" Element
In your constructor, you create the `lossOverlay`. Crucially, you set `display: none`. This makes it a **ghost element**—it exists in the code’s memory and the page’s structure, but the player cannot see or touch it yet.

> **Code Insight:**
> ```javascript
> lossOverlay.style.cssText = "display:none; position:fixed; width:100%; height:100%; z-index:20000;";
> ```

---

# The Trigger (The "Watcher")
To make the screen appear, you need a **"Watcher."** In your code, this is the `setInterval` timer that constantly evaluates the state of the game.

| Step | Component | Logic |
| :--- | :--- | :--- |
| **1** | **The Condition** | The Watcher checks: `window.timeLeft <= 0` |
| **2** | **The Action** | The Watcher flips the CSS from `display: none` to `display: flex`. |
| **3** | **The Result** | The screen "appears" instantly, covering the game. |

---

# Key Concepts in the "Kirby Maze"
The implementation uses three advanced techniques to make the transition feel professional:
<img width="195" height="91" alt="Image" src="https://github.com/user-attachments/assets/27c2a77d-882a-4bb2-9aba-7f1457d8a344" />
<img width="798" height="434" alt="Image" src="https://github.com/user-attachments/assets/8577b221-5000-4dc9-bb3e-a482530ec868" />
### 1. Z-Indexing
By setting `z-index: 20000`, we ensure the Game Over screen stays above Kirby, the walls, and the background. It is mathematically the "top-most" item on the page.

### 2. Input Gating
We use a `window.isPaused` variable as a "gatekeeper." Even if the player mashes the **WASD** keys during the Game Over screen, the code checks this variable and refuses to move the character.

### 3. Visual Polish
We injected a `<style>` tag with `@keyframes flash`. This allows the transition screen to have dynamic, moving parts (like flashing text) without needing a heavy video file or extra assets.

---

### Pro-Tip
Always ensure your transition screens have a clear **Call to Action** (like a "Restart" button). A transition screen without a way out is just a frozen game!

### Where to implement this in your code
In our example level, we implemented our transition code in our window.addEventListener.
```js
 window.addEventListener("load", () => {
  const lossOverlay = document.createElement("div");
            lossOverlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); display:none; justify-content:center; align-items:center; z-index:20000; flex-direction:column; text-align:center;";
            lossOverlay.innerHTML = `
                <h1 class="huge-game-over">GAME OVER</h1>
                <p class="flashing-text">CLICK BELOW TO RESTART SYSTEM</p>
                <button onclick="location.reload()" style="
                    padding:20px 40px; 
                    cursor:pointer; 
                    background:#ff0000; 
                    color:white; 
                    border:4px solid white; 
                    font-size:80px; 
                    font-family:'Arial Black'; 
                    border-radius:10px; 
                    box-shadow: 0 0 20px rgba(255,0,0,0.6);
                ">TRY AGAIN</button>
```