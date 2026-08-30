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

<!-- Container for Sprite and hotspots/details -->
<div id="game-area" style="position: relative; width: 980px; height: 680px; margin: 32px auto;">
  <!-- Sprite -->
  <p id="sprite" class="sprite"></p>

  <!-- Hotspot text elements (data-driven) -->
  {% for s in page.sections %}
    <div id="{{s.id}}" class="hotspot" style="top: {{s.hotspot.top}}px; left: {{s.hotspot.left}}px;">{{s.label}}</div>
  {% endfor %}

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
  top: 520px;
  left: 64px;
  background-position: 0px 0px;
  z-index: 5;
  transform: scale({{page.sprite.scale}});
  transform-origin: top left;
}
.hotspot {
  position: absolute;
  width: 180px;
  height: 52px;
  font-weight: bold;
  color: #0f172a;
  background: linear-gradient(180deg, #f8fafc, #dbeafe);
  padding: 8px 14px;
  border-radius: 999px;
  border: 2px solid rgba(30, 64, 175, 0.3);
  z-index: 4;
  font-size: 1.05rem;
  letter-spacing: 0.03em;
  box-shadow: 0 6px 14px rgba(15, 23, 42, 0.25);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease;
}
.hotspot:hover,
.hotspot.active {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(30, 64, 175, 0.38);
  background: linear-gradient(180deg, #bfdbfe, #93c5fd);
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
    this.positionX = 64;
    this.positionY = 520;
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
    this.positionX = 64;
    this.positionY = 520;
    this.spriteElement.style.left = `64px`;
    this.spriteElement.style.top = `520px`;
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
  const width = gameArea.clientWidth;
  const columns = width < 760 ? 2 : 4;
  const rowGap = 12;
  const startTop = 20;

  hotspots.forEach((h, idx) => {
    const hotspotEl = document.getElementById(h.id);
    const row = Math.floor(idx / columns);
    const col = idx % columns;
    const slotWidth = width / columns;
    const buttonWidth = hotspotEl.offsetWidth || 180;
    const left = Math.max(12, Math.round(col * slotWidth + (slotWidth - buttonWidth) / 2));
    const top = startTop + row * (hotspotEl.offsetHeight + rowGap);
    hotspotEl.style.left = `${left}px`;
    hotspotEl.style.top = `${top}px`;
  });

  const rows = Math.ceil(hotspots.length / columns);
  const detailTop = startTop + rows * (52 + rowGap) + 12;
  for (const h of hotspots) {
    const sectionEl = document.getElementById(h.section);
    sectionEl.style.top = `${detailTop}px`;
  }
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

## Mario Open House Navigation

Use arrow keys or WASD to move Mario. Hover a button, or move Mario close to it, to open the full course overview beneath the top row. Press R to reset Mario and hide all details.

---

This view combines the playful index3 movement with richer home-legacy class messaging for open house walkthroughs.
