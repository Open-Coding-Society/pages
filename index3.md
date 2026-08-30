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

Use arrow keys or WASD to move Mario. Hover a button, or move Mario close to it, to open the full course overview beneath the top row. Press R to reset Mario and hide all details.

<!-- Container for Sprite and hotspots/details -->
<div id="game-area" style="position: relative; width: 980px; height: 680px; margin: 32px auto;">
  <!-- Sprite -->
  <p id="sprite" class="sprite"></p>

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

<style>
#game-area {
  position: relative;
  width: min(980px, 96vw);
  height: 680px;
  margin: 32px auto;
  background: linear-gradient(145deg, #0f172a, #13213f 46%, #1f3b73 100%);
  border-radius: 20px;
  box-shadow: 0 10px 36px rgba(10, 25, 51, 0.45);
  overflow: hidden;
}
.sprite {
  width: {{page.sprite.pixelWidth}}px;
  height: {{page.sprite.pixelHeight}}px;
  background-image: url('{{page.sprite.image}}');
  background-repeat: no-repeat;
  position: absolute;
  top: 28px;
  left: 36px;
  background-position: 0px 0px;
  z-index: 5;
  transform: scale({{page.sprite.scale}});
  transform-origin: top left;
}
.hotspot {
  position: relative;
  width: 180px;
  min-height: 48px;
  z-index: 4;
  transition: transform 120ms ease, filter 120ms ease;
}

.mario-nav-bar {
  position: absolute;
  top: 18px;
  left: 12px;
  right: 12px;
  display: grid;
  grid-template-columns: repeat(4, minmax(140px, 1fr));
  gap: 12px;
  align-items: center;
  justify-items: center;
  z-index: 4;
}

.mario-nav-btn {
  width: min(180px, 95%);
}
.hotspot:hover,
.hotspot.active {
  transform: translateY(-2px) scale(1.01);
  filter: brightness(1.1);
}
.detail-section {
  position: absolute;
  display: none;
  top: 96px;
  left: 40px;
  right: 40px;
  border: 2px solid rgba(147, 197, 253, 0.6);
  padding: 20px 22px;
  background: rgba(15, 23, 42, 0.88);
  color: #dbeafe;
  min-height: 270px;
  border-radius: 14px;
  z-index: 3;
  backdrop-filter: blur(3px);
}
.detail-section h3 {
  margin-top: 0;
  margin-bottom: 12px;
  color: #eff6ff;
}
.detail-section p {
  margin-bottom: 10px;
  line-height: 1.45;
}
.detail-section ul {
  margin: 0;
  padding-left: 20px;
}

@media (max-width: 900px) {
  #game-area {
    height: 760px;
  }

  .mario-nav-bar {
    grid-template-columns: repeat(2, minmax(130px, 1fr));
  }

  .hotspot {
    width: 42vw;
    max-width: 170px;
    min-width: 130px;
    font-size: 0.95rem;
  }
  .detail-section {
    top: 164px;
    min-height: 340px;
    left: 16px;
    right: 16px;
  }
}
</style>

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
    // Sprite is visually scaled down, so collision box must be scaled too.
    for (const h of this.hotspots) {
      const el = document.getElementById(h.id);
      const sectionEl = document.getElementById(h.section);
      const hx = el.offsetLeft;
      const hy = el.offsetTop;
      const hw = el.offsetWidth;
      const hh = el.offsetHeight;
      const mx = this.positionX;
      const my = this.positionY;
      const mw = this.spriteElement.offsetWidth * this.scale;
      const mh = this.spriteElement.offsetHeight * this.scale;
      const expandX = 42;
      const expandY = 20;
      if (
        mx < hx + hw + expandX &&
        mx + mw > hx - expandX &&
        my < hy + hh + expandY &&
        my + mh > hy - expandY
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
  const width = gameArea.clientWidth;
  const columns = width < 760 ? 2 : 4;
  const rowGap = 12;
  const topPadding = 18;
  const sidePadding = 12;

  navBar.style.gridTemplateColumns = `repeat(${columns}, minmax(130px, 1fr))`;
  navBar.style.left = `${sidePadding}px`;
  navBar.style.right = `${sidePadding}px`;
  navBar.style.top = `${topPadding}px`;

  const sampleButton = document.getElementById(hotspots[0].id);
  const buttonHeight = sampleButton ? sampleButton.offsetHeight : 52;

  const rows = Math.ceil(hotspots.length / columns);
  const detailTop = topPadding + rows * (buttonHeight + rowGap) + 22;
  for (const h of hotspots) {
    const sectionEl = document.getElementById(h.section);
    sectionEl.style.top = `${detailTop}px`;
  }

  const spriteWidth = sprite_data.pixelWidth * sprite_data.scale;
  const spriteHeight = sprite_data.pixelHeight * sprite_data.scale;
  const maxX = Math.max(sidePadding, width - spriteWidth - sidePadding);
  const maxY = Math.max(topPadding, detailTop - spriteHeight - 10);

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

// On page load, sprite rests
window.addEventListener("DOMContentLoaded", () => {
  layoutHotspots();
  sprite.startResting();
});

window.addEventListener("resize", () => {
  layoutHotspots();
});
</script>

