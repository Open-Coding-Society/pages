---
layout: post 
feedback: true
hide: true
permalink: /
---

<style>
/* Break out of Jekyll's content container */
.top-bar, .custom-header {
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}

.top-bar {
  background-color: #7B5EA7;
  color: white;
  padding: 8px 40px;
  font-size: 0.9em;
  display: flex;
  justify-content: space-between;
}

.custom-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 40px;
  background-color: white;
  border-bottom: 1px solid #eee;
}

.custom-header .logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5em;
  font-weight: bold;
  color: #7B5EA7;
}

.custom-header nav a {
  margin: 0 15px;
  text-decoration: none;
  color: #333;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.9em;
}

.custom-header nav a:hover {
  color: #7B5EA7;
}

.give-btn {
  background-color: #7B5EA7;
  color: white !important;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: bold;
}
/* Hide Jekyll's default header/nav */
header.site-header,
.site-header,
nav.navbar,
.navbar {
  display: none !important;
}
</style>

<style>
/* Top announcement bar */
.top-bar {
  background-color: #7B5EA7;
  color: white;
  text-align: center;
  padding: 8px 20px;
  font-size: 0.9em;
  display: flex;
  justify-content: space-between;
}

/* Main header */
.custom-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 40px;
  background-color: white;
  border-bottom: 1px solid #eee;
}

.custom-header .logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5em;
  font-weight: bold;
  color: #7B5EA7;
}

.custom-header nav a {
  margin: 0 15px;
  text-decoration: none;
  color: #333;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.9em;
}

.custom-header nav a:hover {
  color: #7B5EA7;
}

.give-btn {
  background-color: #7B5EA7;
  color: white !important;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: bold;
}
</style>

<!-- Top Bar -->
<div class="top-bar">
  <span>For inquiry about our programs and services Contact@SafePassageHeals</span>
  <span>Or Call Us 818-232-7476</span>
</div>

<!-- Main Header -->
<div class="custom-header">
  <div class="logo">
    <img src="{{site.baseurl}}/safepassageheals/Safe_Passage.png" alt="Logo" style="width: 80px;">
    Safe Passage Heals
  </div>
  <nav>
    <a href="{{site.baseurl}}/">Home</a>
    <a href="{{site.baseurl}}/whoweare">Who We Are</a>
    <a href="{{site.baseurl}}/sph/eventcalendar1">Events Calendar</a>
    <a href="{{site.baseurl}}/sph/blog">Blog</a>
    <a href="{{site.baseurl}}/login">Login</a>
  </nav>
</div>
<p id="mario" class="sprite"></p>
<canvas id="fog"></canvas>

<!-- Mobile Controls -->
<div id="controls">
  <button data-dir="up">▲</button>
  <div class="middle">
    <button data-dir="left">◀</button>
    <button data-dir="down">▼</button>
    <button data-dir="right">▶</button>
  </div>
</div>

<!-- ================= STYLES ================= -->

<style>
body {
  background-color: white;
}

/* Prevent touch behavior only on game elements */
#mario,
#controls,
#controls button {
  touch-action: none;
}


  .sprite {
    height: {{pixels}}px;
    width: {{pixels}}px;
    background-image: url('{{sprite_file}}');
    background-repeat: no-repeat;
    position: absolute;
    z-index: 1001;
  }

  #mario {
    background-position: 0 0;
  }

  #fog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 999;
  }

  .social-icon {
    filter: invert(1);
  }

  /* ================= MOBILE CONTROLS ================= */

  #controls {
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 2000;
    user-select: none;
  }

  #controls .middle {
    display: flex;
    justify-content: center;
  }

  #controls button {
    width: 60px;
    height: 60px;
    margin: 6px;
    font-size: 24px;
    border-radius: 12px;
    border: none;
    background: rgba(255, 255, 255, 0.15);
    color: black;
    backdrop-filter: blur(6px);
  }

  #controls button:active {
    background: rgba(171, 66, 252, 0.35);
  }
  #controls {
  display: none;
}

@media (max-width: 768px) {
  #controls {
    display: block;
  }
}

</style>

<!-- ================= GAME SCRIPT ================= -->

<script>
  //////////////////// METADATA ////////////////////

  var mario_metadata = {};
  {% for key in hash %}
  mario_metadata["{{key | first}}"] = {
    row: {{key.row}},
    col: {{key.col}},
    frames: {{key.frames}}
  };
  {% endfor %}

  //////////////////// FOG OF WAR ////////////////////

  const fogCanvas = document.getElementById("fog");
  const fogCtx = fogCanvas.getContext("2d");

  function resizeFog() {
    fogCanvas.width = window.innerWidth;
    fogCanvas.height = window.innerHeight;
    fogCtx.fillStyle = "rgba(0,0,0,0.6)";
    fogCtx.fillRect(0, 0, fogCanvas.width, fogCanvas.height);
  }

  window.addEventListener("resize", resizeFog);

  //////////////////// MARIO CLASS ////////////////////

  class Mario {
    constructor(meta) {
      this.meta = meta;
      this.el = document.getElementById("mario");
      this.pixels = {{pixels}};
      this.positionX = 0;
      this.positionY = 200;
      this.frame = 0;
      this.interval = 16;
      this.timer = null;
    }

    animate(state, dx, dy) {
      this.stop();
      const row = state.row * this.pixels;

      this.timer = setInterval(() => {
        const col = (this.frame + state.col) * this.pixels;
        this.el.style.backgroundPosition = `-${col}px -${row}px`;

        this.positionX += dx;
        this.positionY += dy;

        this.el.style.left = `${this.positionX}px`;
        this.el.style.top = `${this.positionY}px`;

        this.frame = (this.frame + 1) % state.frames;

        const rect = this.el.getBoundingClientRect();
        hole.cx = rect.left + rect.width / 2;
        hole.cy = rect.top + rect.height / 2;
      }, this.interval);
    }

    stop() {
      clearInterval(this.timer);
    }

    start(name, dx = 0, dy = 0) {
      this.animate(this.meta[name], dx, dy);
    }
  }

  const mario = new Mario(mario_metadata);

  //////////////////// FOG HOLE ////////////////////

  const hole = {
    cx: 0,
    cy: 0,
    radius: 0,
    targetRadius: 0,
    expanding: false,
    startTime: null,
    duration: 6000
  };

  function drawFogWithHole() {
    fogCtx.globalCompositeOperation = 'source-over';
    fogCtx.fillStyle = 'rgba(0,0,0,0.6)';
    fogCtx.fillRect(0, 0, fogCanvas.width, fogCanvas.height);

    const grad = fogCtx.createRadialGradient(
      hole.cx, hole.cy, hole.radius * 0.2,
      hole.cx, hole.cy, hole.radius
    );

    grad.addColorStop(0, 'rgba(0,0,0,1)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');

    fogCtx.globalCompositeOperation = 'destination-out';
    fogCtx.fillStyle = grad;
    fogCtx.fillRect(0, 0, fogCanvas.width, fogCanvas.height);
    fogCtx.globalCompositeOperation = 'source-over';
  }

  function animateFog(ts) {
    if (!hole.startTime) hole.startTime = ts;
    const p = Math.min(1, (ts - hole.startTime) / hole.duration);
    hole.radius = hole.targetRadius * p;
    drawFogWithHole();
    if (p < 1) requestAnimationFrame(animateFog);
    else fogCanvas.style.display = 'none';
  }

  //////////////////// INPUT (KEYBOARD + TOUCH) ////////////////////

  const keys = { left: false, right: false, up: false, down: false };

  function updateMovement() {
    const dx = (keys.right ? 5 : 0) + (keys.left ? -5 : 0);
    const dy = (keys.down ? 5 : 0) + (keys.up ? -5 : 0);

    if (!dx && !dy) {
      mario.stop();
      return;
    }

    mario.start(keys.left && !keys.right ? "WalkL" : "Walk", dx, dy);
  }

  window.addEventListener("keydown", e => {
    switch (e.key.toLowerCase()) {
      case "a":
      case "arrowleft": keys.left = true; break;
      case "d":
      case "arrowright": keys.right = true; break;
      case "w":
      case "arrowup": keys.up = true; break;
      case "s":
      case "arrowdown": keys.down = true; break;
    }
    updateMovement();
  });

  window.addEventListener("keyup", e => {
    switch (e.key.toLowerCase()) {
      case "a":
      case "arrowleft": keys.left = false; break;
      case "d":
      case "arrowright": keys.right = false; break;
      case "w":
      case "arrowup": keys.up = false; break;
      case "s":
      case "arrowdown": keys.down = false; break;
    }
    updateMovement();
  });

document.querySelectorAll("#controls button").forEach(btn => {
  const dir = btn.dataset.dir;

  btn.addEventListener("pointerdown", e => {
    e.preventDefault();
    keys[dir] = true;
    updateMovement();
  });

  btn.addEventListener("pointerup", () => {
    keys[dir] = false;
    updateMovement();
  });

  btn.addEventListener("pointercancel", () => {
    keys[dir] = false;
    updateMovement();
  });

  btn.addEventListener("pointerleave", () => {
    keys[dir] = false;
    updateMovement();
  });
});


  //////////////////// INIT ////////////////////

  document.addEventListener("DOMContentLoaded", () => {
    resizeFog();
    mario.el.style.transform = `scale(${0.2 * (window.devicePixelRatio || 1)})`;
    mario.start("Rest");

    const rect = mario.el.getBoundingClientRect();
    hole.cx = rect.left + rect.width / 2;
    hole.cy = rect.top + rect.height / 2;
    hole.targetRadius = Math.hypot(fogCanvas.width, fogCanvas.height);
    requestAnimationFrame(animateFog);
  });
</script>

<!-- ================= PAGE CONTENT ================= -->

<div style="width: 100%; margin-bottom: 20px;">
  <img src="{{site.baseurl}}/safepassageheals/sphbg.png" alt="Latest Events and News" style="width: 100%; max-width: 100%;">
</div>

<div style="display: flex; align-items: flex-start; justify-content: center; gap: 40px; flex-wrap: wrap;">

