---
layout: opencs
title: Whack-a-Mole
comments: True
permalink: /whack_a_mole/
authors: Ahaan Vaidyanathan, Arnav Mittal, Xavier Thompson, Spencer Lyons, Nikhil Naryan, Sharuya Signh 
---
# Whack-a-Mole– OOP JavaScript Game

Click the moles or press number keys (1–9) to score.  
- Multiple mole types, power-ups, combo system  
- Score points, lose lives for misses or bombs  
- Increasing difficulty over time  
- Fully OOP Game  

<a href="{{site.baseurl}}/oriented/lessons">Lesson for Game</a>

Information:

- 🟢 **Green Mole (Normal):** +10 points. Lose **1 life** if missed.  
- 🟡 **Golden Mole:** +30 points. Lose **1 life** if missed.  
- 🔴 **Red Bomb:** -1 life if hit. Safe to ignore.  
- 🌸 **Pink Power-up (Double):** Double points for 5s.  
- 🔵 **Cyan Power-up (Life):** +1 life.  

<canvas id="gameCanvas" width="450" height="450"></canvas>
<script>
  // ======= Hole Class =======
  class Hole {
    constructor(x, y, size, index) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.index = index;
      this.entity = null; // Mole or PowerUp
    }
    draw(ctx) {
      // circular dirt hole with shading
      const cx = this.x + this.size / 2;
      const cy = this.y + this.size / 2;
      const r = this.size / 2.6;

      const grad = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r);
      grad.addColorStop(0, "#5a3b1a"); // inner dirt
      grad.addColorStop(1, "#2e1b0b"); // dark rim
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // subtle rim outline for definition
      ctx.strokeStyle = "rgba(0,0,0,0.35)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.02, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // ======= Base Entity =======
  class Entity {
    constructor(hole, duration=1000) {
      this.hole = hole;
      this.hole.entity = this;
      this.duration = duration;
      this.startTime = Date.now();
      this.hit = false;
    }
    draw(ctx) {}
    update(game) {
      if (Date.now() - this.startTime > this.duration) {
        // penalize only missed normal/golden moles
        if (this instanceof Mole && !this.hit) {
          if (this.type === "normal" || this.type === "golden") {
            game.lives--;
          }
        }
        this.hole.entity = null;
        return false;
      }
      return true;
    }
  }

  // ======= Mole Class =======
  class Mole extends Entity {
    constructor(hole, type="normal") {
      const durations = { normal:1000, golden:800, bomb:1000 };
      super(hole, durations[type]);
      this.type = type;
    }
    draw(ctx) {
      const { x, y, size } = this.hole;
      if (this.hit) return;

      const cx = x + size / 2;
      const cy = y + size / 2;
      const r = size / 3;

      ctx.beginPath();
      if (this.type === "normal") ctx.fillStyle = "#8b4513"; // brown mole
      else if (this.type === "golden") ctx.fillStyle = "gold";
      else if (this.type === "bomb") ctx.fillStyle = "black";

      // Main mole body (slight ellipse)
      ctx.ellipse(cx, cy, r * 0.8, r, 0, 0, Math.PI * 2);
      ctx.fill();

      if (this.type !== "bomb") {
        // Eyes (white + pupils)
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(cx - r * 0.3, cy - r * 0.2, r * 0.15, 0, Math.PI * 2);
        ctx.arc(cx + r * 0.3, cy - r * 0.2, r * 0.15, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(cx - r * 0.3, cy - r * 0.2, r * 0.07, 0, Math.PI * 2);
        ctx.arc(cx + r * 0.3, cy - r * 0.2, r * 0.07, 0, Math.PI * 2);
        ctx.fill();

        // Nose
        ctx.fillStyle = "pink";
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.15, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Bomb symbol — save/restore so HUD alignment isn't affected
        ctx.save();
        ctx.fillStyle = "red";
        ctx.font = `${r * 1.2}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("💣", cx, cy);
        ctx.restore();
      }
    }
    onHit(game){
      if(this.type==="normal") game.addScore(10);
      else if(this.type==="golden") game.addScore(30);
      else if(this.type==="bomb") game.lives--;
      this.hit = true;
      this.hole.entity = null;
    }
  }

  // ======= PowerUp Class =======
  class PowerUp extends Entity {
    constructor(hole, type) {
      super(hole, 1200);
      this.type = type; // "double" or "life"
    }
    draw(ctx){
      const { x, y, size } = this.hole;
      const cx = x + size/2;
      const cy = y + size/2;
      ctx.beginPath();
      ctx.fillStyle = this.type==="double" ? "pink" : "cyan";
      ctx.arc(cx, cy, size/4, 0, 2*Math.PI);
      ctx.fill();
    }
    onHit(game){
      if(this.type==="double") game.activateMultiplier(5000);
      else if(this.type==="life") game.lives++;
      this.hole.entity = null;
    }
  }

  // ======= Game Class =======
  class Game {
    constructor(canvasId){
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext("2d");
      this.canvas.tabIndex = 1;
      this.canvas.style.outline = "none";
      this.canvas.focus();

      this.gridSize = 3;
      this.holeSize = this.canvas.width / this.gridSize;
      this.holes = [];
      let idx = 1;
      for (let r = 0; r < this.gridSize; r++) {
        for (let c = 0; c < this.gridSize; c++) {
          this.holes.push(new Hole(c*this.holeSize, r*this.holeSize, this.holeSize, idx++));
        }
      }

      this.moles = [];
      this.score = 0;
      this.highScore = localStorage.getItem("whackAMoleHighScore") || 0;
      this.lives = 5;
      this.spawnInterval = 1500;
      this.lastSpawn = Date.now();
      this.state = "title";
      this.multiplier = 1;
      this.multiplierEnd = 0;

      this.keys = {};
      window.addEventListener("keydown", e => this.keys[e.key] = true);
      window.addEventListener("keyup",   e => this.keys[e.key] = false);
      this.canvas.addEventListener("click", e=>{
        if (this.state === "title" || this.state === "gameover") {
          this.start();
        } else {
          this.handleClick(e);
        }
      });

      requestAnimationFrame(() => this.update());
    }

    start(){
      this.score = 0; 
      this.lives = 5; 
      this.moles = []; 
      this.lastSpawn = Date.now();
      this.state = "playing"; 
      this.multiplier = 1; 
      this.multiplierEnd = 0;
      this.holes.forEach(h => h.entity = null);
    }

    spawnEntity(){
      const emptyHoles = this.holes.filter(h => !h.entity);
      if (emptyHoles.length === 0) return;
      const hole = emptyHoles[Math.floor(Math.random() * emptyHoles.length)];

      const r = Math.random();
      if (r < 0.7) this.moles.push(new Mole(hole, "normal"));
      else if (r < 0.85) this.moles.push(new Mole(hole, "golden"));
      else if (r < 0.95) this.moles.push(new Mole(hole, "bomb"));
      else {
        const type = Math.random() < 0.5 ? "double" : "life";
        this.moles.push(new PowerUp(hole, type));
      }
    }

    handleClick(e){
      const rect = this.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      this.holes.forEach(h=>{
        if (h.entity) {
          const {x,y,size} = h;
          const cx = x + size/2, cy = y + size/2;
          const r = size/3;
          if (Math.hypot(mx - cx, my - cy) <= r) {
            h.entity.onHit(this);
          }
        }
      });
    }

    checkKeys(){
      for (const key in this.keys) {
        if (this.keys[key] && !isNaN(key)) {
          const num = parseInt(key);
          const hole = this.holes.find(h => h.index === num);
          if (hole && hole.entity) hole.entity.onHit(this);
          this.keys[key] = false;
        }
      }
    }

    addScore(points){
      const finalPoints = Math.floor(points * this.multiplier);
      this.score += finalPoints;
      if (this.score > this.highScore) this.highScore = this.score;
    }

    activateMultiplier(ms){
      this.multiplier = 2;
      this.multiplierEnd = Date.now() + ms;
    }

    update(){
      // Each state draws its own background to avoid overwriting the grass
      if (this.state === "title") this.drawTitle();
      else if (this.state === "playing") this.updateGame();
      else if (this.state === "gameover") this.drawGameOver();

      requestAnimationFrame(() => this.update());
    }

    updateGame(){
      // Grassy background
      const grad = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
      grad.addColorStop(0, "#7ec850");   // lighter green top
      grad.addColorStop(1, "#4d8230");   // darker green bottom
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      if (Date.now() - this.lastSpawn > this.spawnInterval) {
        this.spawnEntity();
        this.lastSpawn = Date.now();
      }

      for (let i = this.moles.length - 1; i >= 0; i--) {
        if (!this.moles[i].update(this)) this.moles.splice(i, 1);
      }

      if (this.multiplier > 1 && Date.now() > this.multiplierEnd) this.multiplier = 1;

      this.checkKeys();

      // Board & entities
      this.holes.forEach(h => h.draw(this.ctx));
      this.moles.forEach(m => m.draw(this.ctx));

      // HUD (reset alignment so it isn't affected by mole/bomb drawing)
      this.ctx.textAlign = "left";
      this.ctx.textBaseline = "alphabetic";
      this.ctx.fillStyle = "black";
      this.ctx.font = "18px Arial";
      this.ctx.fillText("Score: " + this.score, 10, 20);
      this.ctx.fillText("High Score: " + this.highScore, 10, 45);
      this.ctx.fillText("Lives: " + this.lives, 10, 70);
      this.ctx.fillText("Multiplier: x" + this.multiplier, 10, 95);

      if (this.lives <= 0) {
        this.state = "gameover";
        localStorage.setItem("whackAMoleHighScore", this.highScore);
      }

      // Increase difficulty
      if (this.score > 0 && this.score % 100 === 0) {
        this.spawnInterval = Math.max(500, 1500 - Math.floor(this.score / 2));
      }
    }

    drawTitle(){
      const { ctx, canvas } = this;

      // Background gradient (sky -> sand)
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#87ceeb");
      gradient.addColorStop(1, "#f0e68c");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Title with shadow
      ctx.font = "bold 48px Arial";
      ctx.fillStyle = "white";
      ctx.shadowColor = "black";
      ctx.shadowBlur = 6;
      ctx.fillText("🐹 Whack-a-Mole+", canvas.width/2, 120);

      // Clear shadow for other text
      ctx.shadowBlur = 0;

      // Subtitle
      ctx.font = "22px Arial";
      ctx.fillStyle = "black";
      ctx.fillText("Click or press 1–9 to hit moles", canvas.width/2, 180);

      // Instructions
      ctx.font = "16px Arial";
      ctx.fillText("Golden = +30   |   Bomb = -1   |   Power-ups appear randomly", canvas.width/2, 220);

      // Start prompt with pulse effect
      ctx.font = "24px Arial";
      ctx.fillStyle = "darkblue";
      const alpha = 0.5 + 0.5 * Math.sin(Date.now() / 500); // pulse
      ctx.globalAlpha = alpha;
      ctx.fillText("Press ENTER or Click to Start", canvas.width/2, 300);
      ctx.globalAlpha = 1;

      // Reset alignment for other draws
      ctx.textAlign = "left"; 
      ctx.textBaseline = "alphabetic";

      if (this.keys["Enter"]) this.start();
    }

    drawGameOver(){
      // Simple dark background so text is clear
      const grad = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
      grad.addColorStop(0, "#2c3e50");
      grad.addColorStop(1, "#1b2735");
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.fillStyle = "red";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.font = "36px Arial";
      this.ctx.fillText("GAME OVER", this.canvas.width/2, 180);

      this.ctx.fillStyle = "white";
      this.ctx.font = "24px Arial";
      this.ctx.fillText("Final Score: " + this.score, this.canvas.width/2, 230);
      this.ctx.fillText("Press ENTER or Click to Restart", this.canvas.width/2, 280);

      // Reset alignment for safety
      this.ctx.textAlign = "left";
      this.ctx.textBaseline = "alphabetic";

      if (this.keys["Enter"]) this.start();
    }
  }

  new Game("gameCanvas");
</script>
