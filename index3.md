---
layout: post 
title: Gamified Navigation
permalink: /index3
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
      top: 40
      left: 40
    detail:
      id: section-csse
      top: 40
      left: 200
      title: CSSE Detail
      content: "Computer Science and Software Engineering: JavaScript, OOP, algorithmic thinking, game dev projects."
  - id: hotspot-csp
    label: CSP
    hotspot:
      top: 240
      left: 40
    detail:
      id: section-csp
      top: 240
      left: 200
      title: CSP Detail
      content: "Computer Science Principles: Python, algorithms, data, networks, impact of computing."
  - id: hotspot-csa
    label: CSA
    hotspot:
      top: 440
      left: 40
    detail:
      id: section-csa
      top: 440
      left: 200
      title: CSA Detail
      content: "AP Computer Science A: Java, data structures, recursion, team projects, AP prep."
---

<!-- Container for Sprite and hotspots/details -->
<div id="game-area" style="position: relative; width: 400px; height: 700px; margin: 60px auto;">
  <!-- Sprite -->
  <p id="sprite" class="sprite"></p>

  <!-- Hotspot text elements (data-driven) -->
  {% for s in page.sections %}
    <div id="{{s.id}}" class="hotspot" style="top: {{s.hotspot.top}}px; left: {{s.hotspot.left}}px;">{{s.label}}</div>
  {% endfor %}

  <!-- Detail sections (data-driven) -->
  {% for s in page.sections %}
    <div id="{{s.detail.id}}" class="detail-section" style="top: {{s.detail.top}}px; left: {{s.detail.left}}px;">
      <h3>{{s.detail.title}}</h3>
      <p>{{s.detail.content}}</p>
    </div>
  {% endfor %}
</div>

<style>
#game-area {
  position: relative;
  width: 400px;
  height: 700px;
  margin: 60px auto;
  background: #55595dff;
  border-radius: 16px;
  box-shadow: 0 4px 24px #b6c6e6;
}
.sprite {
  width: {{page.sprite.pixelWidth}}px;
  height: {{page.sprite.pixelHeight}}px;
  background-image: url('{{page.sprite.image}}');
  background-repeat: no-repeat;
  position: absolute;
  top: 20px;
  left: 20px;
  background-position: 0px 0px;
  z-index: 3;
  transform: scale({{page.sprite.scale}});
  transform-origin: top left;
}
.hotspot {
  position: absolute;
  width: 120px;
  height: 48px;
  font-weight: bold;
  color: #2563eb;
  background: #e0e7ff;
  padding: 8px 16px;
  border-radius: 8px;
  z-index: 2;
  font-size: 1.2em;
  box-shadow: 0 2px 8px #b6c6e6;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
.detail-section {
  position: absolute;
  display: none;
  border: 2px solid #2563eb;
  padding: 16px;
  background: #2758dfff;
  max-width: 160px;
  min-height: 48px;
  border-radius: 8px;
  z-index: 1;
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
    this.positionX = 40;
    this.positionY = 40;
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
    let collided = false;
    // Sprite is visually scaled down, so collision box must be scaled too
    for (const h of this.hotspots) {
      const el = document.getElementById(h.id);
      const hx = el.offsetLeft;
      const hy = el.offsetTop;
      const hw = el.offsetWidth;
      const hh = el.offsetHeight;
      const mx = this.positionX;
      const my = this.positionY;
      const mw = this.spriteElement.offsetWidth * this.scale;
      const mh = this.spriteElement.offsetHeight * this.scale;
      if (
        mx < hx + hw &&
        mx + mw > hx &&
        my < hy + hh &&
        my + mh > hy
      ) {
        document.getElementById(h.section).style.display = 'block';
        this.activeSection = h.section;
        collided = true;
      } else {
        document.getElementById(h.section).style.display = 'none';
      }
    }
    if (!collided) {
      this.activeSection = null;
    }
  }

  reset() {
    this.stopAnimate();
    this.positionX = 40;
    this.positionY = 40;
    this.spriteElement.style.left = `40px`;
    this.spriteElement.style.top = `40px`;
    for (const h of this.hotspots) {
      document.getElementById(h.section).style.display = 'none';
    }
    this.activeSection = null;
    this.startResting();
  }
}

const sprite = new Sprite(sprite_data, hotspots);

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

// On page load, sprite rests
window.addEventListener("DOMContentLoaded", () => {
  sprite.startResting();
});
</script>

## Mario Gamified Navigation Example

Use arrow keys to move Mario. When Mario collides with CSSE, CSP, or CSA, the corresponding detail will expand. When Mario leaves the hotspot, the detail collapses. Press 'R' to reset Mario and hide all details.

---

This example uses your original Mario animation logic, organized layout, and dynamic hotspot reveals. You can further design and expand from here!
