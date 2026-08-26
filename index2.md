---
layout: post 
title: Portfolio Home 2
hide: true
show_reading_time: false
permaklink: /home2
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

> This advanced example exercises generated controls, click and drag input, progress, accuracy, completion, and reset states without inline styles or repeated button markup.

<section class="ocs__dnd" id="dnd-demo">
    <h4 class="ocs__dnd-panel-title">PC Assembly Bench</h4>
    <div class="ocs__dnd-header">
        <label for="dnd-builder-name">
            Builder name
            <input class="ocs__dnd-input" id="dnd-builder-name" type="text" autocomplete="name" placeholder="Optional">
        </label>
        <button type="button" class="ocs__dnd-reset" data-dnd-reset>Reset build</button>
    </div>
    <p class="ocs__dnd-status" role="status" aria-live="polite">Choose a part, then choose its connection point.</p>
    <p class="ocs__dnd-progress">Installed: 0/5 | Attempts: 0 | Accuracy: 100%</p>
    <div class="ocs__dnd-layout">
        <div class="ocs__dnd-panel" data-dnd-parts>
            <h4 class="ocs__dnd-panel-title">Parts tray</h4>
        </div>
        <div class="ocs__dnd-panel" data-dnd-slots>
            <h4 class="ocs__dnd-panel-title">Connection points</h4>
        </div>
    </div>
</section>

<script>
(function() {
  const board = document.getElementById('dnd-demo');
  const status = board.querySelector('.ocs__dnd-status');
  const progress = board.querySelector('.ocs__dnd-progress');
  const builderName = board.querySelector('#dnd-builder-name');
  const partTray = board.querySelector('[data-dnd-parts]');
  const slotTray = board.querySelector('[data-dnd-slots]');
  const buildParts = [
    { id: 'cpu', name: 'CPU', slot: 'CPU socket' },
    { id: 'ram', name: 'RAM', slot: 'RAM slots' },
    { id: 'ssd', name: 'M.2 SSD', slot: 'M.2 slot' },
    { id: 'gpu', name: 'Graphics card', slot: 'PCIe slot' },
    { id: 'psu', name: 'Power supply', slot: 'PSU bay' }
  ];
  const partButtons = [];
  const slotButtons = [];
  let selectedPartId = null;
  let installedCount = 0;
  let attempts = 0;
  let correctAttempts = 0;

  function setStatus(message) {
    const name = builderName.value.trim();
    status.textContent = name === '' ? message : name + ': ' + message;
  }

  function updateProgress() {
    const accuracy = attempts === 0 ? 100 : Math.round((correctAttempts / attempts) * 100);
    progress.textContent = 'Installed: ' + installedCount + '/' + buildParts.length +
      ' | Attempts: ' + attempts + ' | Accuracy: ' + accuracy + '%';
  }

  function selectPart(partId) {
    const selectedButton = partButtons.find(function(button) {
      return button.dataset.part === partId;
    });
    if (selectedButton === undefined || selectedButton.disabled) {
      return;
    }

    selectedPartId = partId;
    partButtons.forEach(function(button) {
      const isSelected = button === selectedButton;
      button.classList.toggle('is-selected', isSelected);
      button.setAttribute('aria-pressed', String(isSelected));
    });
    setStatus(selectedButton.textContent + ' selected. Choose its connection point.');
  }

  function placePart(partId, slotButton) {
    const partButton = partButtons.find(function(button) {
      return button.dataset.part === partId;
    });
    if (partButton === undefined || partButton.disabled) {
      setStatus('Choose an available part from the tray first.');
      return;
    }

    attempts += 1;
    if (partId !== slotButton.dataset.slot) {
      setStatus('Incorrect. ' + partButton.textContent + ' does not belong in ' + slotButton.dataset.label + '.');
      updateProgress();
      return;
    }

    correctAttempts += 1;
    installedCount += 1;
    partButton.disabled = true;
    partButton.draggable = false;
    partButton.classList.remove('is-selected');
    partButton.setAttribute('aria-pressed', 'false');
    slotButton.disabled = true;
    slotButton.classList.add('is-filled');
    slotButton.textContent = '✓ ' + partButton.textContent + ' → ' + slotButton.dataset.label;
    slotButton.setAttribute('aria-label', partButton.textContent + ' installed in ' + slotButton.dataset.label);
    selectedPartId = null;
    updateProgress();

    if (installedCount === buildParts.length) {
      setStatus('PC assembly complete.');
    } else {
      setStatus('Installed ' + partButton.textContent + '. Choose another part.');
    }
  }

  buildParts.forEach(function(part) {
    const partButton = document.createElement('button');
    partButton.type = 'button';
    partButton.className = 'ocs__drag-btn';
    partButton.textContent = part.name;
    partButton.draggable = true;
    partButton.dataset.part = part.id;
    partButton.setAttribute('aria-label', 'Select ' + part.name);
    partButton.setAttribute('aria-pressed', 'false');
    partButton.addEventListener('click', function() {
      selectPart(part.id);
    });
    partButton.addEventListener('dragstart', function(event) {
      selectPart(part.id);
      event.dataTransfer.setData('text/plain', part.id);
      event.dataTransfer.effectAllowed = 'move';
    });
    partButton.addEventListener('dragend', function() {
      slotButtons.forEach(function(slotButton) {
        slotButton.classList.remove('is-over');
      });
    });
    partButtons.push(partButton);
    partTray.appendChild(partButton);

    const slotButton = document.createElement('button');
    slotButton.type = 'button';
    slotButton.className = 'ocs__drop-btn';
    slotButton.textContent = part.slot;
    slotButton.dataset.slot = part.id;
    slotButton.dataset.label = part.slot;
    slotButton.setAttribute('aria-label', 'Install selected part in ' + part.slot);
    slotButton.addEventListener('click', function() {
      placePart(selectedPartId, slotButton);
    });
    slotButton.addEventListener('dragover', function(event) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      slotButton.classList.add('is-over');
    });
    slotButton.addEventListener('dragleave', function() {
      slotButton.classList.remove('is-over');
    });
    slotButton.addEventListener('drop', function(event) {
      event.preventDefault();
      slotButton.classList.remove('is-over');
      const droppedPartId = event.dataTransfer.getData('text/plain');
      placePart(droppedPartId, slotButton);
    });
    slotButtons.push(slotButton);
    slotTray.appendChild(slotButton);
  });

  board.querySelector('[data-dnd-reset]').addEventListener('click', function() {
    selectedPartId = null;
    installedCount = 0;
    attempts = 0;
    correctAttempts = 0;
    partButtons.forEach(function(partButton) {
      partButton.disabled = false;
      partButton.draggable = true;
      partButton.classList.remove('is-selected');
      partButton.setAttribute('aria-pressed', 'false');
    });
    slotButtons.forEach(function(slotButton) {
      slotButton.disabled = false;
      slotButton.textContent = slotButton.dataset.label;
      slotButton.setAttribute('aria-label', 'Install selected part in ' + slotButton.dataset.label);
      slotButton.classList.remove('is-filled', 'is-over');
    });
    setStatus('Choose a part, then choose its connection point.');
    updateProgress();
  });
})();
</script>
