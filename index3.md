---
layout: post 
title: Gamified Navigation
sprite:
  image: /images/mario_animation.png
  pixelWidth: 256
  pixelHeight: 256
  scale: 0.25
  frames:
    Rest:   {row: 0,  col: 0,  frames: 15}
    RestL:  {row: 1,  col: 0,  frames: 15}
    Walk:   {row: 2,  col: 0,  frames: 8}
    Tada:   {row: 2,  col: 11, frames: 3}
    WalkL:  {row: 3,  col: 0,  frames: 8}
    TadaL:  {row: 3,  col: 11, frames: 3}
    Run1:   {row: 4,  col: 0,  frames: 15}
    Run1L:  {row: 5,  col: 0,  frames: 15}
    Run2:   {row: 6,  col: 0,  frames: 15}
    Run2L:  {row: 7,  col: 0,  frames: 15}
    Puff:   {row: 8,  col: 0,  frames: 15}
    PuffL:  {row: 9,  col: 0,  frames: 15}
    Cheer:  {row: 10, col: 0,  frames: 15}
    CheerL: {row: 11, col: 0,  frames: 15}
    Flip:   {row: 12, col: 0,  frames: 15}
    FlipL:  {row: 13, col: 0,  frames: 15}
sections:
  - id: hotspot-csse
    label: CSSE
    hotspot:
      top: 22
      left: 80
    detail:
      id: section-csse
      title: Computer Science and Software Engineering (CSSE) 1,2; Grades 9-12
      content: "CSSE 1,2 prepares students for the AP Computer Science pathway. The course emphasizes JavaScript, object-oriented programming and inheritance, algorithmic thinking, and collaborative game-development projects. Students build engineering habits through project checkpoints, tech talks, and iterative improvement cycles."
      bullets:
        - "Prerequisites: None"
        - "Meets UC/CSU G requirements"
        - "Articulated credit path to Mira Costa CC CS 111"
  - id: hotspot-csp
    label: CSP
    hotspot:
      top: 22
      left: 280
    detail:
      id: section-csp
      title: Computer Science Principles 1,2 and Data Structures 1; Grades 10-12
      content: "CSP is a college-level introduction to computing, integrating AP CSP themes across creative development, data, algorithms, networks, and societal impact. Students work individually and in teams to design systems, reason about correctness, and develop fluency in Python while extending prior JavaScript and Linux workflow experience."
      bullets:
        - "Rising 10th grade: prior CSSE"
        - "Rising 11th-12th grade: 3.5+ GPA and prior programming readiness"
        - "Includes Data Structures 1 as the CSP third-trimester capstone"
  - id: hotspot-csa
    label: CSA
    hotspot:
      top: 22
      left: 480
    detail:
      id: section-csa
      title: Computer Science A 1,2 and Data Structures 2; Grades 11-12
      content: "AP Computer Science A provides in-depth Java programming with emphasis on classes, arrays, ArrayLists, 2D arrays, inheritance, recursion, and algorithmic analysis. Students apply concepts through implementation-focused projects and AP preparation, then extend into Data Structures 2 as a capstone with stronger requirements, performance expectations, and stakeholder-facing outcomes."
      bullets:
        - "Typical entry: rising 11th or 12th grade"
        - "Builds from CSP and Data Structures 1 or teacher recommendation"
        - "Articulated credit path to Mira Costa CC CS 113"
  - id: hotspot-csh
    label: CSH
    hotspot:
      top: 22
      left: 680
    detail:
      id: section-csh
      title: Computer Science Honors (CSH) 1,2; Senior Capstone
      content: "CSH is a year-long, senior-only interdisciplinary honors capstone aligned to CTE and PLTW expectations. Teams research real-world problems, design and prototype solutions, document technical decisions, and present outcomes to external audiences. The class emphasizes production-quality collaboration, communication, and public demonstration of engineering maturity."
      bullets:
        - "Senior thesis style culminating experience"
        - "Interdisciplinary team roles across technical and applied domains"
        - "Requires strong programming, collaboration, and project workflow habits"
---

## Mario Open House Navigation

Use arrow keys or WASD to move Mario. Hover a button, or move Mario close to it, to open the full course overview beneath the top row. Press R to reset Mario and home.

<!-- Container for Sprite and hotspots/details -->
<div
  id="game-area"
  class="mario-open-house"
  style="--mario-sprite-image: url('{{page.sprite.image}}'); --mario-sprite-width: {{page.sprite.pixelWidth}}px; --mario-sprite-height: {{page.sprite.pixelHeight}}px; --mario-sprite-scale: {{page.sprite.scale}};"
>
  <!-- Sprite -->
  <p id="sprite" class="sprite"></p>

  <!-- Mario movement lane (visual + bounds anchor) -->
  <div id="mario-lane" class="mario-lane" aria-hidden="true"></div>

  <!-- Top button rail (data-driven) -->
  <div id="mario-nav-bar" class="mario-nav-bar" aria-label="Course navigation buttons">
    {% assign tones = "alert-green,alert-yellow,alert-red,alert-green" | split: "," %}
    {% for s in page.sections %}
      <button
        id="{{s.id}}"
        type="button"
        class="hotspot ocs__btn medium {{tones[forloop.index0]}} fill mario-nav-btn"
        data-index="{{forloop.index0}}"
      >
        {{s.label}}
      </button>
    {% endfor %}
  </div>

  <!-- Detail sections (data-driven) -->
  {% for s in page.sections %}
    <div id="{{s.detail.id}}" class="detail-section" aria-hidden="true">
      <h3>{{s.detail.title}}</h3>
      <p>{{s.detail.content}}</p>
      <ul>
        {% for bullet in s.detail.bullets %}
          <li>{{bullet}}</li>
        {% endfor %}
      </ul>
    </div>
  {% endfor %}
</div>

<script>
// Sprite data: animation frames, pixel size, scale
const sprite_data = {{ page.sprite | jsonify }};

// Hotspots data from frontmatter
const hotspots = [
  {% for s in page.sections %}
    {id: '{{s.id}}', section: '{{s.detail.id}}'},
  {% endfor %}
];

class Sprite {
  constructor(sprite_data, hotspots) {
    this.tID = null;
    this.positionX = 36;
    this.positionY = 28;
    this.currentSpeed = 0;
    this.spriteElement = document.getElementById("sprite");
    this.pixelsWidth = sprite_data.pixelWidth;
    this.pixelsHeight = sprite_data.pixelHeight;
    this.scale = sprite_data.scale;
    this.interval = 100;
    this.obj = sprite_data.frames;
    this.spriteElement.style.position = "absolute";
    this.moving = false;
    this.direction = {x: 0, y: 0};
    this.hotspots = hotspots;
    this.activeSection = null;
    this.currentAnim = 'Rest';
    this.bounds = {
      minX: 12,
      maxX: 880,
      minY: 12,
      maxY: 110,
    };
  }

  setBounds(bounds) {
    this.bounds = bounds;
    this.positionX = Math.max(bounds.minX, Math.min(bounds.maxX, this.positionX));
    this.positionY = Math.max(bounds.minY, Math.min(bounds.maxY, this.positionY));
    this.spriteElement.style.left = `${this.positionX}px`;
    this.spriteElement.style.top = `${this.positionY}px`;
    this.checkHotspots();
  }

  jumpTo(x, y) {
    this.positionX = Math.max(this.bounds.minX, Math.min(this.bounds.maxX, x));
    this.positionY = Math.max(this.bounds.minY, Math.min(this.bounds.maxY, y));
    this.spriteElement.style.left = `${this.positionX}px`;
    this.spriteElement.style.top = `${this.positionY}px`;
    this.stopAnimate();
    this.startResting();
    this.checkHotspots();
  }

  animate(animName, speed) {
    let frame = 0;
    const obj = this.obj[animName];
    const row = obj.row * this.pixelsHeight;
    this.currentAnim = animName;
    this.currentSpeed = speed;
    this.stopAnimate();
    this.tID = setInterval(() => {
      const col = (frame + obj.col) * this.pixelsWidth;
      this.spriteElement.style.backgroundPosition = `-${col}px -${row}px`;
      this.positionX += speed * this.direction.x;
      this.positionY += speed * this.direction.y;

      // Keep Mario in the top interaction lane near the button rail.
      this.positionX = Math.max(this.bounds.minX, Math.min(this.bounds.maxX, this.positionX));
      this.positionY = Math.max(this.bounds.minY, Math.min(this.bounds.maxY, this.positionY));

      this.spriteElement.style.left = `${this.positionX}px`;
      this.spriteElement.style.top = `${this.positionY}px`;
      frame = (frame + 1) % obj.frames;
      this.checkHotspots();
    }, this.interval);
  }

  startWalkingRight() {
    this.direction = {x: 1, y: 0};
    this.animate("Walk", 8);
  }
  startWalkingLeft() {
    this.direction = {x: -1, y: 0};
    this.animate("WalkL", 8);
  }
  startWalkingDown() {
    this.direction = {x: 0, y: 1};
    this.animate("Walk", 8);
  }
  startWalkingUp() {
    this.direction = {x: 0, y: -1};
    this.animate("Walk", 8);
  }
  startResting() {
    this.direction = {x: 0, y: 0};
    this.animate("Rest", 0);
  }
  stopAnimate() {
    clearInterval(this.tID);
    this.tID = null;
  }

  checkHotspots() {
    let activeHotspot = null;
    const spriteRect = this.spriteElement.getBoundingClientRect();
    for (const h of this.hotspots) {
      const el = document.getElementById(h.id);
      const sectionEl = document.getElementById(h.section);
      const buttonRect = el.getBoundingClientRect();
      const expandX = 42;
      const expandY = 20;
      if (
        spriteRect.left < buttonRect.right + expandX &&
        spriteRect.right > buttonRect.left - expandX &&
        spriteRect.top < buttonRect.bottom + expandY &&
        spriteRect.bottom > buttonRect.top - expandY
      ) {
        activeHotspot = h;
        sectionEl.style.display = 'block';
        sectionEl.setAttribute('aria-hidden', 'false');
        el.classList.add('active');
      } else {
        sectionEl.style.display = 'none';
        sectionEl.setAttribute('aria-hidden', 'true');
        el.classList.remove('active');
      }
    }
    this.activeSection = activeHotspot ? activeHotspot.section : null;
  }

  reset() {
    this.stopAnimate();
    this.positionX = this.bounds.minX + 20;
    this.positionY = this.bounds.minY + 10;
    this.spriteElement.style.left = `${this.positionX}px`;
    this.spriteElement.style.top = `${this.positionY}px`;
    for (const h of this.hotspots) {
      const sectionEl = document.getElementById(h.section);
      const hotspotEl = document.getElementById(h.id);
      sectionEl.style.display = 'none';
      sectionEl.setAttribute('aria-hidden', 'true');
      hotspotEl.classList.remove('active');
    }
    this.activeSection = null;
    this.startResting();
  }
}

const sprite = new Sprite(sprite_data, hotspots);

function layoutHotspots() {
  const gameArea = document.getElementById("game-area");
  const navBar = document.getElementById("mario-nav-bar");
  const lane = document.getElementById("mario-lane");
  const width = gameArea.clientWidth;
  const topPadding = 18;
  const sidePadding = 12;

  navBar.style.left = `${sidePadding}px`;
  navBar.style.right = `${sidePadding}px`;
  navBar.style.top = `${topPadding}px`;

  const navRect = navBar.getBoundingClientRect();
  const gameRect = gameArea.getBoundingClientRect();
  const navBottomInGame = navRect.bottom - gameRect.top;
  const detailTop = navBottomInGame + 16;
  for (const h of hotspots) {
    const sectionEl = document.getElementById(h.section);
    sectionEl.style.top = `${detailTop}px`;
  }

  lane.style.left = `${sidePadding - 2}px`;
  lane.style.right = `${sidePadding - 2}px`;
  lane.style.top = `${topPadding - 6}px`;
  lane.style.height = `${Math.max(72, navBottomInGame - topPadding + 14)}px`;

  const spriteWidth = sprite_data.pixelWidth * sprite_data.scale;
  const spriteHeight = sprite_data.pixelHeight * sprite_data.scale;
  const maxX = Math.max(sidePadding, width - spriteWidth - sidePadding);
  const maxY = Math.max(topPadding, detailTop - spriteHeight - 12);

  sprite.setBounds({
    minX: sidePadding,
    maxX,
    minY: topPadding,
    maxY,
  });
}

// Key press/release controls
window.addEventListener("keydown", (event) => {
  if (event.repeat) return;
  if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
    sprite.startWalkingRight();
  }
  if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
    sprite.startWalkingLeft();
  }
  if (event.key === "ArrowDown" || event.key === "s" || event.key === "S") {
    sprite.startWalkingDown();
  }
  if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
    sprite.startWalkingUp();
  }
  if (event.key === "r" || event.key === "R") {
    sprite.reset();
  }
});
window.addEventListener("keyup", (event) => {
  if (["ArrowRight","ArrowLeft","ArrowDown","ArrowUp","d","a","s","w","D","A","S","W"].includes(event.key)) {
    sprite.stopAnimate();
    sprite.startResting();
  }
});

// Pointer hover also reveals details (same behavior as Mario proximity).
for (const h of hotspots) {
  const hotspotEl = document.getElementById(h.id);
  const sectionEl = document.getElementById(h.section);
  hotspotEl.addEventListener("mouseenter", () => {
    for (const other of hotspots) {
      const otherHotspot = document.getElementById(other.id);
      const otherSection = document.getElementById(other.section);
      otherHotspot.classList.remove("active");
      otherSection.style.display = "none";
      otherSection.setAttribute("aria-hidden", "true");
    }
    hotspotEl.classList.add("active");
    sectionEl.style.display = "block";
    sectionEl.setAttribute("aria-hidden", "false");
  });
  hotspotEl.addEventListener("mouseleave", () => {
    hotspotEl.classList.remove("active");
    if (sprite.activeSection !== h.section) {
      sectionEl.style.display = "none";
      sectionEl.setAttribute("aria-hidden", "true");
    }
  });
}

const gameAreaEl = document.getElementById("game-area");
gameAreaEl.addEventListener("pointerdown", (event) => {
  if (event.target.closest(".hotspot")) {
    return;
  }
  const gameRect = gameAreaEl.getBoundingClientRect();
  const spriteWidth = sprite_data.pixelWidth * sprite_data.scale;
  const spriteHeight = sprite_data.pixelHeight * sprite_data.scale;
  const targetX = event.clientX - gameRect.left - spriteWidth / 2;
  const targetY = event.clientY - gameRect.top - spriteHeight / 2;
  sprite.jumpTo(targetX, targetY);
});

// On page load, sprite rests
window.addEventListener("DOMContentLoaded", () => {
  layoutHotspots();
  sprite.startResting();
});

window.addEventListener("resize", () => {
  layoutHotspots();
});
</script>
Tap inside the lane on mobile to move Mario directly to your touch point.
<!-- end -->

