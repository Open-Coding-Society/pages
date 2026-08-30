---
layout: post 
title: Portfolio Home 2
hide: true
show_reading_time: false
---

Hi! My name is [Your Full Name]

## Learning Buttons

> SASS Mixins examples and code, explore these topics by clicking standard OCS SASS buttons.

<div class="ocs__links">
    <a class="ocs__btn" href="{{site.baseurl}}/github/pages/about_sass_buttons/">
        Buttons Lesson
    </a>
    <a class="ocs__btn" href="https://github.com/Open-Coding-Society/pages/blob/main/_sass/open-coding/mixins/_buttons.scss">
        Button Mixins
    </a>
    <a class="ocs__btn" href="https://github.com/Open-Coding-Society/pages/blob/main/_sass/open-coding/mixins/_container.scss">
        Container Mixins
    </a>
</div>

## Development Environment

> Coding starts with tools, explore these tools clicking SASS buttons with SVG.

<div class="ocs__links ocs__links--wide">
    <a class="ocs__btn ocs__btn--icon alert-green" href="https://opencodingsociety.com">
        <span class="ocs__btn-icon" aria-hidden="true">
            <img src="{{ '/favicon.ico' | relative_url }}" alt="">
        </span>
        <span>OCS</span>
    </a>
    <a class="ocs__btn ocs__btn--icon alert-yellow" href="https://github.com/Open-Coding-Society/portfolio">
        <span class="ocs__btn-icon" aria-hidden="true">
            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
        </span>
        <span>GitHub</span>
    </a>
    <a class="ocs__btn ocs__btn--icon alert-red" href="https://vscode.dev/">
        <span class="ocs__btn-icon" aria-hidden="true">
            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.34 0L5.66 5.39l-2.4-1.8L1.19 4.82v6.36l2.07 1.23 2.4-1.8L11.34 16 15 14.23V1.77L11.34 0zm.59 11.57l-3.86-3.54 3.86-3.54v7.08z"/>
            </svg>
        </span>
        <span>VSCode.dev</span>
    </a>
</div>

<br>

## Code Runner Lessons

> Foundations in Tech are essential, click my iridescent buttons to see some of my lesson creations.

<div class="ocs__links">
    <a class="ocs__btn iridescent" href="{{site.baseurl}}/code/javascript">
        JS Basics
    </a>
    <a class="ocs__btn alert-green iridescent" href="{{site.baseurl}}/game/essentials/variables">
        JS Variables
    </a>
    <a class="ocs__btn alert-yellow iridescent" href="{{site.baseurl}}/gamerunner">
        Gamerunner
    </a>
    <a class="ocs__btn alert-red iridescent" href="{{site.baseurl}}/network/stack">
        Networking
    </a>
</div>

<br>

### Class Progress

> Here is my game progress through coding, click multicolor and size buttons to see these in the browser

<div class="ocs__links">
    <a href="{{site.baseurl}}/snake" class="ocs__btn pill alert-green fill">
        Snake
    </a>
    <a href="{{site.baseurl}}/gamify/parallax" class="ocs__btn small alert-yellow fill">
        Fish
    </a>
    <a href="{{site.baseurl}}/gamify" class="ocs__btn alert-red fill">
        Gamify
    </a>
    <a href="{{site.baseurl}}/cs-pathway" class="ocs__btn large">
        CS Pathway
    </a>
</div>

<br>

### Drag and Drop Buttons

> Use `ocs__drag-btn` for draggable choices and `ocs__drop-btn` for their destinations. Drag a part onto a slot, or select both buttons with a mouse or keyboard. The complete class contract is documented in `_sass/open-coding/elements/buttons/button-grammar.md`.

<section class="ocs__dnd" id="dnd-demo">
    <div class="ocs__dnd-header">
        <h4 class="ocs__dnd-panel-title">Mini Assembly Bench</h4>
        <button type="button" class="ocs__dnd-reset" data-dnd-reset>Reset</button>
    </div>
    <p class="ocs__dnd-status" role="status" aria-live="polite">Drag a part to its slot.</p>
    <div class="ocs__dnd-layout">
        <div class="ocs__dnd-panel">
            <h4 class="ocs__dnd-panel-title">Parts tray</h4>
            <button type="button" class="ocs__drag-btn" draggable="true" data-part="CPU" aria-pressed="false">CPU</button>
            <button type="button" class="ocs__drag-btn" draggable="true" data-part="RAM" aria-pressed="false">RAM</button>
            <button type="button" class="ocs__drag-btn" draggable="true" data-part="GPU" aria-pressed="false">Graphics card</button>
        </div>
        <div class="ocs__dnd-panel">
            <h4 class="ocs__dnd-panel-title">Connection points</h4>
            <button type="button" class="ocs__drop-btn" data-slot="CPU" data-label="CPU socket">CPU socket</button>
            <button type="button" class="ocs__drop-btn" data-slot="RAM" data-label="RAM slots">RAM slots</button>
            <button type="button" class="ocs__drop-btn" data-slot="GPU" data-label="PCIe slot">PCIe slot</button>
        </div>
    </div>
</section>

<script>
(function() {
  const board = document.getElementById('dnd-demo');
  const status = board.querySelector('.ocs__dnd-status');
  const parts = Array.from(board.querySelectorAll('.ocs__drag-btn'));
  const slots = Array.from(board.querySelectorAll('.ocs__drop-btn'));
  let selected = null;

  function select(part) {
    selected = part;
    parts.forEach(function(other) {
      const isSelected = other === part;
      other.classList.toggle('is-selected', isSelected);
      other.setAttribute('aria-pressed', String(isSelected));
    });
    status.textContent = part.textContent + ' selected. Choose its slot.';
  }

  function place(part, slot) {
    if (part === null || part === undefined || part.disabled || slot.disabled) {
      status.textContent = 'Choose an available part first.';
      return;
    }
    if (part.dataset.part !== slot.dataset.slot) {
      status.textContent = 'Incorrect. ' + part.textContent + ' does not belong in ' + slot.textContent + '.';
      return;
    }
    part.disabled = true;
    part.draggable = false;
    part.classList.remove('is-selected');
    part.setAttribute('aria-pressed', 'false');
    slot.disabled = true;
    slot.classList.add('is-filled');
    slot.textContent = '✓ ' + part.textContent + ' → ' + slot.dataset.label;
    selected = null;
    status.textContent = 'Installed ' + part.textContent + '.';
  }

  parts.forEach(function(part) {
    part.addEventListener('click', function() { select(part); });
    part.addEventListener('dragstart', function(event) {
      select(part);
      event.dataTransfer.setData('text/plain', part.dataset.part);
      event.dataTransfer.effectAllowed = 'move';
    });
  });

  slots.forEach(function(slot) {
    slot.addEventListener('click', function() { place(selected, slot); });
    slot.addEventListener('dragover', function(event) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      slot.classList.add('is-over');
    });
    slot.addEventListener('dragleave', function() { slot.classList.remove('is-over'); });
    slot.addEventListener('drop', function(event) {
      event.preventDefault();
      slot.classList.remove('is-over');
      const partId = event.dataTransfer.getData('text/plain');
      const draggedPart = parts.find(function(part) {
        return part.dataset.part === partId;
      });
      place(draggedPart, slot);
    });
  });

  board.querySelector('[data-dnd-reset]').addEventListener('click', function() {
    selected = null;
    parts.forEach(function(part) {
      part.disabled = false;
      part.draggable = true;
      part.classList.remove('is-selected');
      part.setAttribute('aria-pressed', 'false');
    });
    slots.forEach(function(slot) {
      slot.disabled = false;
      slot.textContent = slot.dataset.label;
      slot.classList.remove('is-filled', 'is-over');
    });
    status.textContent = 'Drag a part to its slot.';
  });
})();
</script>

#### Size Classes

> The same classes at three scales. Put `ocs__dnd--small`, `--medium`, or `--large` on the board to resize everything inside it, or the same suffix on a single `ocs__drag-btn` / `ocs__drop-btn`.

<div class="ocs__dnd-layout">
    <div class="ocs__dnd ocs__dnd--small">
        <p class="ocs__dnd-progress">ocs__dnd--small</p>
        <button type="button" class="ocs__drag-btn" draggable="true">CPU</button>
        <button type="button" class="ocs__drop-btn is-filled" disabled>✓ CPU socket</button>
    </div>
    <div class="ocs__dnd ocs__dnd--medium">
        <p class="ocs__dnd-progress">ocs__dnd--medium</p>
        <button type="button" class="ocs__drag-btn is-selected" draggable="true">CPU</button>
        <button type="button" class="ocs__drop-btn is-over">CPU socket</button>
    </div>
    <div class="ocs__dnd ocs__dnd--large">
        <p class="ocs__dnd-progress">ocs__dnd--large</p>
        <button type="button" class="ocs__drag-btn" draggable="true">CPU</button>
        <button type="button" class="ocs__drop-btn">CPU socket</button>
    </div>
</div>
