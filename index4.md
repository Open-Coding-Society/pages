---
layout: post 
title: Portfolio Home 4
hide: true
show_reading_time: false
---

Hi! My name is [Your Full Name]

## Learning Grids

> SASS Grid Mixins examples and code — multiple grid layouts that adapt to the active theme, just like buttons do.

<div class="ocs__links">
    <a class="ocs__btn" href="{{site.baseurl}}/github/pages/about_sass_buttons/">
        Buttons Lesson
    </a>
    <a class="ocs__btn" href="https://github.com/Open-Coding-Society/pages/blob/main/_sass/open-coding/mixins/_grid.scss">
        Grid Mixins
    </a>
    <a class="ocs__btn" href="https://github.com/Open-Coding-Society/pages/blob/main/_sass/open-coding/elements/grids/_main.scss">
        Grid Classes
    </a>
</div>

---

## Standard Grid

> Fixed 3-column grid that collapses to 2 on mobile. Hover on desktop, tap on touch — both give the same visual feedback.

<div class="ocs__grid ocs__grid--standard" style="margin-bottom: 1.5rem;">
    <div class="ocs__grid-cell ocs__grid-cell--header">Learning Resources</div>
    <div class="ocs__grid-cell">
        <strong>JavaScript</strong><br>
        Variables, loops, functions, and DOM manipulation.
    </div>
    <div class="ocs__grid-cell">
        <strong>Python</strong><br>
        Data types, control flow, and algorithmic thinking.
    </div>
    <div class="ocs__grid-cell">
        <strong>Networking</strong><br>
        TCP/IP, HTTP, and the OSI model.
    </div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">
        <strong>SASS</strong><br>
        Mixins, variables, and theme-aware styling.
    </div>
    <div class="ocs__grid-cell">
        <strong>Git</strong><br>
        Commits, branches, pull requests.
    </div>
    <div class="ocs__grid-cell">
        <strong>APIs</strong><br>
        REST, fetch, and JSON data handling.
    </div>
</div>

**2-column** (`.cols-2`) and **4-column** (`.cols-4`) variants:

<div class="ocs__grid ocs__grid--standard cols-2" style="margin-bottom: 1rem;">
    <div class="ocs__grid-cell">Frontend</div>
    <div class="ocs__grid-cell">Backend</div>
</div>

<div class="ocs__grid ocs__grid--standard cols-4" style="margin-bottom: 1.5rem;">
    <div class="ocs__grid-cell">HTML</div>
    <div class="ocs__grid-cell">CSS</div>
    <div class="ocs__grid-cell">JS</div>
    <div class="ocs__grid-cell">SASS</div>
</div>

---

## Card Grid

> Auto-fill responsive grid — fits as many 200 px cards as possible per row. Cards lift on hover/tap.

<div class="ocs__grid ocs__grid--card" style="margin-bottom: 1.5rem;">
    <div class="ocs__grid-cell">
        <strong>OCS</strong><br>
        Open Coding Society home and resources.
    </div>
    <div class="ocs__grid-cell">
        <strong>GitHub</strong><br>
        Version control for all your projects.
    </div>
    <div class="ocs__grid-cell">
        <strong>VSCode</strong><br>
        Your browser-based development environment.
    </div>
    <div class="ocs__grid-cell">
        <strong>Code Runner</strong><br>
        Execute JavaScript and Python in the browser.
    </div>
    <div class="ocs__grid-cell">
        <strong>Game Runner</strong><br>
        Build and play interactive browser games.
    </div>
    <div class="ocs__grid-cell">
        <strong>Calculator</strong><br>
        The calculator that inspired these grid styles.
    </div>
</div>

---

## Color Grid

> Each box reveals its own unique color on hover or tap. The base state is fully themed; the color appears on interaction.

<div class="ocs__grid ocs__grid--color" style="margin-bottom: 1.5rem;">
    <div class="ocs__grid-cell">Red</div>
    <div class="ocs__grid-cell">Orange</div>
    <div class="ocs__grid-cell">Yellow</div>
    <div class="ocs__grid-cell">Chartreuse</div>
    <div class="ocs__grid-cell">Green</div>
    <div class="ocs__grid-cell">Teal</div>
    <div class="ocs__grid-cell">Blue</div>
    <div class="ocs__grid-cell">Violet</div>
    <div class="ocs__grid-cell">Magenta</div>
</div>

---

## Holographic Grid

> All cells are identical but continuously cycle through the rainbow with staggered timing, so the color wave flows across the grid.

<div class="ocs__grid ocs__grid--holographic" style="margin-bottom: 1.5rem;">
    <div class="ocs__grid-cell">✦</div>
    <div class="ocs__grid-cell">✦</div>
    <div class="ocs__grid-cell">✦</div>
    <div class="ocs__grid-cell">✦</div>
    <div class="ocs__grid-cell">✦</div>
    <div class="ocs__grid-cell">✦</div>
    <div class="ocs__grid-cell">✦</div>
    <div class="ocs__grid-cell">✦</div>
    <div class="ocs__grid-cell">✦</div>
</div>

---

## Calculator-Style Grid

> Equal square tiles in a 4-column keypad — same structure as the OCS calculator, fully theme-aware.

<div class="ocs__grid ocs__grid--calculator" style="margin-bottom: 1.5rem;">
    <div class="ocs__grid-cell ocs__grid-cell--muted">C</div>
    <div class="ocs__grid-cell ocs__grid-cell--muted">+/-</div>
    <div class="ocs__grid-cell ocs__grid-cell--muted">%</div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">÷</div>

    <div class="ocs__grid-cell">7</div>
    <div class="ocs__grid-cell">8</div>
    <div class="ocs__grid-cell">9</div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">×</div>

    <div class="ocs__grid-cell">4</div>
    <div class="ocs__grid-cell">5</div>
    <div class="ocs__grid-cell">6</div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">−</div>

    <div class="ocs__grid-cell">1</div>
    <div class="ocs__grid-cell">2</div>
    <div class="ocs__grid-cell">3</div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">+</div>

    <div class="ocs__grid-cell ocs__grid-cell--wide">0</div>
    <div class="ocs__grid-cell">.</div>
    <div class="ocs__grid-cell ocs__grid-cell--accent">=</div>
</div>

---

## Gallery Grid

> Auto-fill grid of square tiles for images, icons, or visual content.

<div class="ocs__grid ocs__grid--gallery" style="margin-bottom: 1.5rem;">
    <div class="ocs__grid-cell ocs__grid-cell--wide">
        <span style="font-size: 2rem;">🐍</span><br>Snake
    </div>
    <div class="ocs__grid-cell">
        <span style="font-size: 2rem;">🐟</span><br>Fish
    </div>
    <div class="ocs__grid-cell">
        <span style="font-size: 2rem;">🎮</span><br>Gamify
    </div>
    <div class="ocs__grid-cell">
        <span style="font-size: 2rem;">🧮</span><br>Calc
    </div>
    <div class="ocs__grid-cell">
        <span style="font-size: 2rem;">🌐</span><br>Network
    </div>
    <div class="ocs__grid-cell">
        <span style="font-size: 2rem;">💻</span><br>Code
    </div>
</div>

<br>
