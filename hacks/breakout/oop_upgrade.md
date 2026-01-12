---
layout: post 
title: OOP Breakout Blocks Advanced
author: Nikhil, Rohan, Pranav, Aditya, Shriya, Samhita
permalink: oopadv
---

<style>
  canvas {
    background: #000;
    display: block;
    margin: 0 auto;
    border: 1px solid #333;
  }
  
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  button:hover:not(:disabled) {
    background: #f0f0f0;
  }

  .back-button {
    margin-bottom: 5px !important;
  }

  .title {
    margin-top: 5px !important;
  }
</style>


<canvas id="gameCanvas" width="600" height="400"></canvas>

<div class="controls" style="text-align: center; margin: 20px 0;">
    <button id="startBtn" style="margin: 5px; padding: 10px 16px; font-size: 16px; font-weight: 600; border: 1px solid #222; background: #fff; cursor: pointer; border-radius: 8px; color: #111;">Start Game</button>
    <button id="pauseBtn" disabled style="margin: 5px; padding: 10px 16px; font-size: 16px; font-weight: 600; border: 1px solid #222; background: #fff; cursor: pointer; border-radius: 8px; color: #111;">Pause</button>
    <button id="resetBtn" style="margin: 5px; padding: 10px 16px; font-size: 16px; font-weight: 600; border: 1px solid #222; background: #a52c2cff; cursor: pointer; border-radius: 8px; color: #111;">Reset</button>
    <button id="nextLevelBtn" style="display:none;margin:10px auto 0;padding:10px 16px;font-family:system-ui,Arial;font-size:16px;font-weight:600;border:1px solid #222;background:#fff;cursor:pointer;border-radius:8px;color:#111 !important;">Next Level ▶</button>
</div>

<!-- Enhanced Features Legend -->
<div style="max-width:600px;margin:8px auto;font-family:system-ui,Arial;background:#1a1a1a;padding:15px;border-radius:8px;color:white;">
    <h4 style="margin-top:0;">New Features Guide:</h4>
    <div style="display:flex;flex-wrap:wrap;gap:15px;font-size:12px;">
        <div><span style="color:#0095DD;">■</span> Basic Brick (1 hit)</div>
        <div><span style="color:#ff6b35;">■</span> Strong Brick (2 hits)</div>
        <div><span style="color:#f7931e;">■</span> Moving Brick</div>
        <div><span style="color:gold;">⚡</span> Speed Power-up</div>
        <div><span style="color:#ff69b4;">●</span> Multi-Ball Power-up</div>
        <div><span style="color:lime;">▲</span> Wide Paddle Power-up</div>
    </div>
</div>

<!-- Hack Challenges Section -->
<div id="hack1" style="max-width:600px;margin:8px auto;font-family:system-ui,Arial;">
    <p class="back-button"><a href="{{site.baseurl}}/breakout" style="text-decoration:none;color:#007acc;font-weight:bold;">Click here to go back to main page</a></p>
    <h2 class="title">Enhanced OOP Breakout Game</h2>
    
    <!-- OOP Architecture Info -->
    <div style="background: black; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h3>Enhanced Object-Oriented Programming Architecture:</h3>
        <ul style="margin:8px 0 12px 20px;">
            <li><strong>GameObject Base Class:</strong> Enhanced with collision detection methods</li>
            <li><strong>Ball Class:</strong> Now supports multiple ball instances</li>
            <li><strong>Paddle Class:</strong> Enhanced with multiple power-up types</li>
            <li><strong>Brick Class (Base):</strong> Foundation class for all brick types</li>
            <li><strong>StrongBrick Class:</strong> Inherits from Brick, requires 2 hits</li>
            <li><strong>MovingBrick Class:</strong> Inherits from Brick, moves horizontally</li>
            <li><strong>PowerUp Class (Enhanced):</strong> Multiple power-up types with different effects</li>
            <li><strong>Game Class:</strong> Manages arrays of objects and inheritance</li>
        </ul>
        <p><strong>Controls:</strong> Use arrow keys or mouse to move paddle</p>
    </div>

    <!-- Original Hack #1 -->
    <div id="hack1-90" style="max-width:600px;margin:8px auto;font-family:system-ui,Arial;">
        <p><strong>Hack #1 (90%): Change Colors</strong></p>
        <p>Look in the JavaScript classes and change the <em>paddle</em> and <em>brick</em> colors.</p>
        
        <ul style="margin:8px 0 12px 20px;">
            <li>Pick a new color for the paddle and the different brick types.</li>
            <li>Change colors in the Ball, Paddle, BasicBrick, StrongBrick, and MovingBrick class constructors.</li>
            <li>Tip: Each brick type has its own color - experiment with different combinations!</li>
        </ul>
    </div>

    <!-- Original Hack #2 -->
    <div id="hack2-90" style="max-width:600px;margin:8px auto;font-family:system-ui,Arial;">
        <p><strong>Hack #2 (90%): Modify Brick Types</strong></p>
        <p>Look at the different brick classes and modify their properties.</p>
        <ul style="margin:8px 0 12px 20px;">
            <li>Change how many hits StrongBrick requires by modifying <code>this.hits</code> in the constructor.</li>
            <li>Change MovingBrick speed by modifying <code>this.speed</code>.</li>
            <li>Adjust the percentage of each brick type in the <code>createRandomBrick()</code> method.</li>
        </ul>
    </div>

    <!-- New Enhanced Hacks -->
    <div id="hack3-90" style="max-width:600px;margin:8px auto;font-family:system-ui,Arial;">
        <p><strong>Hack #3 (90%): Power-Up Modifications</strong></p>
        <ul style="margin:8px 0 12px 20px;">
            <li>Change power-up probabilities in the <code>getRandomPowerUpType()</code> method.</li>
            <li>Modify power-up durations by changing values in the <code>powerUpDurations</code> object.</li>
            <li>Adjust the multi-ball count in the <code>applyPowerUp()</code> method.</li>
        </ul>
    </div>

    <div id="hack3-100" style="max-width:600px;margin:8px auto;font-family:system-ui,Arial;">
        <p><strong>Hack #3 (100%): Create New Brick Types</strong></p>
        <ul style="margin:8px 0 12px 20px;">
            <li><strong>Challenge:</strong> Create an <code>ExplosiveBrick</code> class that destroys nearby bricks when hit.</li>
            <li><strong>Advanced:</strong> Make a <code>ShieldBrick</code> that becomes indestructible after being hit once.</li>
            <li><strong>Expert:</strong> Add your new brick type to the <code>createRandomBrick()</code> method.</li>
        </ul>
    </div>

    <!-- OOP-specific hacks -->
    <div id="oop-hacks" style="max-width:600px;margin:8px auto;font-family:system-ui,Arial;">
        <p><strong>Advanced OOP Challenges:</strong></p>
        <ul style="margin:8px 0 12px 20px;">
            <li><strong>Inheritance Practice:</strong> Override the <code>draw()</code> method in brick subclasses for unique visuals.</li>
            <li><strong>Polymorphism:</strong> Add a <code>getPoints()</code> method to each brick type with different values.</li>
            <li><strong>Encapsulation:</strong> Create private methods in brick classes using the # syntax.</li>
            <li><strong>Composition:</strong> Create a <code>BrickFactory</code> class to manage brick creation.</li>
            <li><strong>Array Management:</strong> Study how the game handles arrays of different object types.</li>
        </ul>
    </div>
</div>

<div id="information" style="max-width:600px;margin:8px auto;font-family:system-ui,Arial;">
    <h2>Enhanced OOP Breakout Game Lesson</h2>
    <p><strong>Learn Advanced Object-Oriented Programming</strong></p>
    <p>This enhanced version demonstrates <strong>inheritance</strong>, <strong>polymorphism</strong>, and <strong>array management</strong> with multiple object types.</p>
    <ul style="margin:8px 0 12px 20px;">
        <li>See how subclasses inherit and override parent class methods.</li>
        <li>Understand polymorphism with different brick types behaving differently.</li>
        <li>Learn to manage arrays containing different object types.</li>
        <li>Practice extending existing classes with new functionality.</li>
        <li>Explore how inheritance makes adding new features easier.</li>
    </ul>
    <p><a href="{{site.baseurl}}/oopadvlesson" style="text-decoration:none;color:#007acc;font-weight:bold;">Click here to read the full lesson</a></p>
</div>

<script>
  // Enhanced GameObject base class with collision detection
  class GameObject {
      constructor(x, y) {
          this.x = x;
          this.y = y;
      }
      
      draw(ctx) {
          // Base draw method - to be overridden
      }
      
      update() {
          // Base update method - to be overridden
      }
      
      // Enhanced collision detection method
      getBounds() {
          return {
              left: this.x,
              right: this.x + (this.width || this.radius * 2),
              top: this.y,
              bottom: this.y + (this.height || this.radius * 2)
          };
      }
  }

  // Ball class - enhanced to support multiple instances
  class Ball extends GameObject {
      constructor(x, y, radius = 8) {
          super(x, y);
          this.radius = radius;
          this.dx = 2;
          this.dy = -2;
          this.color = "#0095DD";
          this.active = true;
      }
      
      draw(ctx) {
          if (!this.active) return;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
          ctx.closePath();
      }
      
      update(canvasWidth, canvasHeight) {
          if (!this.active) return;
          
          // Wall collision
          if (this.x + this.dx > canvasWidth - this.radius || this.x + this.dx < this.radius) {
              this.dx = -this.dx;
          }
          if (this.y + this.dy < this.radius) {
              this.dy = -this.dy;
          }
          
          // Remove ball if it goes below canvas
          if (this.y > canvasHeight + 50) {
              this.active = false;
          }
          
          this.x += this.dx;
          this.y += this.dy;
      }
      
      reset(canvasWidth, canvasHeight) {
          this.x = canvasWidth / 2;
          this.y = canvasHeight - 30;
          this.active = true;
          const speed = Math.hypot(this.dx, this.dy);
          const angle = (Math.PI / 6) + Math.random() * (Math.PI / 3);
          const sign = Math.random() < 0.5 ? -1 : 1;
          this.dx = sign * speed * Math.cos(angle);
          this.dy = -Math.abs(speed * Math.sin(angle));
      }
      
      speedUp(multiplier = 1.12) {
          const currentSpeed = Math.hypot(this.dx, this.dy) * multiplier;
          const theta = Math.atan2(this.dy, this.dx);
          this.dx = currentSpeed * Math.cos(theta);
          this.dy = currentSpeed * Math.sin(theta);
      }
      
      collidesWith(obj) {
          return (
              this.active &&
              this.x > obj.x &&
              this.x < obj.x + obj.width &&
              this.y > obj.y &&
              this.y < obj.y + obj.height
          );
      }
      
      collidesWithPaddle(paddle) {
          return (
              this.active &&
              this.y + this.dy > paddle.canvasHeight - paddle.height &&
              this.x > paddle.x &&
              this.x < paddle.x + paddle.width
          );
      }
  }

  // Enhanced Paddle class with multiple power-up support
  class Paddle extends GameObject {
      constructor(x, y, canvasWidth, canvasHeight) {
          super(x, y);
          this.canvasWidth = canvasWidth;
          this.canvasHeight = canvasHeight;
          this.baseWidth = 75;
          this.width = this.baseWidth;
          this.height = 10;
          this.color = "#0095DD";
          this.speed = 7;
          this.leftPressed = false;
          this.rightPressed = false;
      }
      
      draw(ctx) {
          ctx.beginPath();
          ctx.rect(this.x, this.canvasHeight - this.height, this.width, this.height);
          ctx.fillStyle = this.color;
          ctx.fill();
          ctx.closePath();
      }
      
      update() {
          if (this.rightPressed && this.x < this.canvasWidth - this.width) {
              this.x += this.speed;
          } else if (this.leftPressed && this.x > 0) {
              this.x -= this.speed;
          }
      }
      
      setPosition(x) {
          if (x > 0 && x < this.canvasWidth) {
              this.x = x - this.width / 2;
          }
      }
      
      reset() {
          this.x = (this.canvasWidth - this.width) / 2;
          this.width = this.baseWidth;
      }
      
      applyPowerUp(type) {
          if (type === "wide") {
              this.width = this.baseWidth + 40;
          }
          // Speed and multi-ball are handled by the Game class
      }
      
      resetPowerUp() {
          this.width = this.baseWidth;
      }
  }

  // Base Brick class
  class Brick extends GameObject {
      constructor(x, y, width = 75, height = 20) {
          super(x, y);
          this.width = width;
          this.height = height;
          this.status = 1; // 1 = active, 0 = destroyed
          this.hasPowerUp = Math.random() < 0.3; // 30% chance
          this.color = "#0095DD";
      }
      
      draw(ctx) {
          if (this.status === 1) {
              ctx.beginPath();
              ctx.rect(this.x, this.y, this.width, this.height);
              
              if (this.hasPowerUp) {
                  ctx.shadowColor = "yellow";
                  ctx.shadowBlur = 5;
              } else {
                  ctx.shadowBlur = 0;
              }
              
              ctx.fillStyle = this.color;
              ctx.fill();
              ctx.closePath();
              ctx.shadowBlur = 0;
          }
      }
      
      hit() {
          this.status = 0;
          return true; // Brick is destroyed
      }
      
      isActive() {
          return this.status === 1;
      }
      
      getPoints() {
          return 1; // Base points for hitting this brick
      }
  }

  // StrongBrick - requires multiple hits
  class StrongBrick extends Brick {
      constructor(x, y, width = 75, height = 20) {
          super(x, y, width, height);
          this.maxHits = 2;
          this.hits = this.maxHits;
          this.color = "#ff6b35"; // Orange color
      }
      
      draw(ctx) {
          if (this.status === 1) {
              ctx.beginPath();
              ctx.rect(this.x, this.y, this.width, this.height);
              
              // Change color based on remaining hits
              const alpha = this.hits / this.maxHits;
              const r = 255;
              const g = Math.floor(107 * alpha);
              const b = Math.floor(53 * alpha);
              
              ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
              
              if (this.hasPowerUp) {
                  ctx.shadowColor = "yellow";
                  ctx.shadowBlur = 5;
              }
              
              ctx.fill();
              ctx.closePath();
              ctx.shadowBlur = 0;
              
              // Draw hit counter
              ctx.fillStyle = "white";
              ctx.font = "bold 12px Arial";
              ctx.textAlign = "center";
              ctx.fillText(this.hits.toString(), this.x + this.width/2, this.y + this.height/2 + 4);
          }
      }
      
      hit() {
          this.hits--;
          if (this.hits <= 0) {
              this.status = 0;
              return true; // Brick is destroyed
          }
          return false; // Brick still alive
      }
      
      getPoints() {
          return 2; // More points for stronger bricks
      }
  }

  // MovingBrick - moves horizontally
  class MovingBrick extends Brick {
      constructor(x, y, width = 75, height = 20) {
          super(x, y, width, height);
          this.speed = 1;
          this.direction = Math.random() > 0.5 ? 1 : -1;
          this.color = "#f7931e"; // Different orange
          this.originalX = x;
          this.moveRange = 50;
      }
      
      update(canvasWidth) {
          if (this.status === 1) {
              this.x += this.speed * this.direction;
              
              // Reverse direction if moving too far from original position
              if (Math.abs(this.x - this.originalX) > this.moveRange || 
                  this.x <= 0 || this.x >= canvasWidth - this.width) {
                  this.direction *= -1;
              }
          }
      }
      
      getPoints() {
          return 3; // Most points for moving bricks
      }
  }

  // Enhanced PowerUp class with multiple types
  class PowerUp extends GameObject {
      constructor(x, y, type = "wide") {
          super(x, y);
          this.size = 20;
          this.fallSpeed = 1.5;
          this.active = true;
          this.type = type;
          this.colors = {
              wide: { primary: "lime", secondary: "green", symbol: "▲" },
              speed: { primary: "gold", secondary: "orange", symbol: "⚡" },
              multiball: { primary: "#ff69b4", secondary: "#ff1493", symbol: "●" }
          };
      }
      
      draw(ctx) {
          if (this.active) {
              const colorConfig = this.colors[this.type];
              
              // Create gradient effect
              const gradient = ctx.createRadialGradient(
                  this.x, this.y, 2, this.x, this.y, this.size/2
              );
              gradient.addColorStop(0, colorConfig.primary);
              gradient.addColorStop(1, colorConfig.secondary);
              
              ctx.beginPath();
              ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
              ctx.fillStyle = gradient;
              ctx.fill();
              ctx.closePath();
              
              // Draw symbol
              ctx.fillStyle = "black";
              ctx.font = "bold 12px Arial";
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText(colorConfig.symbol, this.x, this.y);
          }
      }
      
      update(canvasHeight) {
          if (this.active) {
              this.y += this.fallSpeed;
              if (this.y > canvasHeight) {
                  this.active = false;
              }
          }
      }
      
      collidesWithPaddle(paddle) {
          return (
              this.active &&
              this.y + this.size / 2 >= paddle.canvasHeight - paddle.height &&
              this.x > paddle.x &&
              this.x < paddle.x + paddle.width
          );
      }
      
      collect() {
          this.active = false;
      }
  }

  // Enhanced Game class with multiple object types
  class Game {
      constructor(canvasId) {
          this.canvas = document.getElementById(canvasId);
          this.ctx = this.canvas.getContext("2d");
          this.width = this.canvas.width;
          this.height = this.canvas.height;
          
          // Game state
          this.score = 0;
          this.lives = 3;
          this.level = 1;
          this.paused = false;
          this.gameRunning = false;
          
          // Enhanced game objects - now arrays for multiple instances
          this.balls = [new Ball(this.width / 2, this.height - 30)];
          this.paddle = new Paddle((this.width - 75) / 2, this.height - 10, this.width, this.height);
          this.bricks = [];
          this.powerUps = [];
          
          // Enhanced power-up state
          this.activePowerUps = new Set();
          this.powerUpTimers = {};
          this.powerUpDurations = {
              wide: 5000,
              speed: 3000,
              multiball: 1000 // Short duration just for activation
          };
          
          // Brick configuration
          this.brickRows = 4;
          this.brickCols = 6;
          this.brickPadding = 10;
          this.brickOffsetTop = 30;
          this.brickOffsetLeft = 50;
          
          this.setupEventListeners();
          this.initBricks();
      }
      
      // Factory method for creating random brick types
      createRandomBrick(x, y) {
          const random = Math.random();
          if (random < 0.6) {
              return new Brick(x, y);
          } else if (random < 0.85) {
              return new StrongBrick(x, y);
          } else {
              return new MovingBrick(x, y);
          }
      }
      
      // Get random power-up type
      getRandomPowerUpType() {
          const types = ["wide", "speed", "multiball"];
          const probabilities = [0.4, 0.3, 0.3]; // Adjust these probabilities
          
          const random = Math.random();
          let cumulative = 0;
          
          for (let i = 0; i < types.length; i++) {
              cumulative += probabilities[i];
              if (random < cumulative) {
                  return types[i];
              }
          }
          return types[0];
      }
      
      setupEventListeners() {
          // Keyboard controls
          document.addEventListener("keydown", (e) => {
              if (e.key === "Right" || e.key === "ArrowRight") {
                  this.paddle.rightPressed = true;
              } else if (e.key === "Left" || e.key === "ArrowLeft") {
                  this.paddle.leftPressed = true;
              }
          });
          
          document.addEventListener("keyup", (e) => {
              if (e.key === "Right" || e.key === "ArrowRight") {
                  this.paddle.rightPressed = false;
              } else if (e.key === "Left" || e.key === "ArrowLeft") {
                  this.paddle.leftPressed = false;
              }
          });
          
          // Mouse controls
          this.canvas.addEventListener("mousemove", (e) => {
              const relativeX = e.clientX - this.canvas.offsetLeft;
              this.paddle.setPosition(relativeX);
          });
          
          // Button controls
          document.getElementById("startBtn").addEventListener("click", () => this.start());
          document.getElementById("pauseBtn").addEventListener("click", () => this.togglePause());
          document.getElementById("resetBtn").addEventListener("click", () => this.reset());
          document.getElementById("nextLevelBtn").addEventListener("click", () => this.nextLevel());
      }
      
      initBricks() {
          this.bricks = [];
          for (let c = 0; c < this.brickCols; c++) {
              for (let r = 0; r < this.brickRows; r++) {
                  const x = c * (75 + this.brickPadding) + this.brickOffsetLeft;
                  const y = r * (20 + this.brickPadding) + this.brickOffsetTop;
                  this.bricks.push(this.createRandomBrick(x, y));
              }
          }
      }
      
      start() {
          this.gameRunning = true;
          this.paused = false;
          document.getElementById("startBtn").disabled = true;
          document.getElementById("pauseBtn").disabled = false;
          this.gameLoop();
      }
      
      togglePause() {
          this.paused = !this.paused;
          document.getElementById("pauseBtn").textContent = this.paused ? "Resume" : "Pause";
          if (!this.paused) {
              this.gameLoop();
          }
      }
      
      reset() {
          this.score = 0;
          this.lives = 3;
          this.level = 1;
          this.brickRows = 4;
          this.paused = false;
          this.gameRunning = false;
          
          this.balls = [new Ball(this.width / 2, this.height - 30)];
          this.paddle.reset();
          this.powerUps = [];
          this.activePowerUps.clear();
          this.powerUpTimers = {};
          
          this.initBricks();
          
          document.getElementById("startBtn").disabled = false;
          document.getElementById("pauseBtn").disabled = true;
          document.getElementById("pauseBtn").textContent = "Pause";
          document.getElementById("nextLevelBtn").style.display = "none";
          
          this.draw();
      }
      
      nextLevel() {
          this.level++;
          for (let ball of this.balls) {
              ball.speedUp(1.12);
          }
          
          if (this.brickRows < 8) {
              this.brickRows++;
          }
          
          this.initBricks();
          for (let ball of this.balls) {
              ball.reset(this.width, this.height);
          }
          this.paddle.reset();
          this.powerUps = [];
          this.activePowerUps.clear();
          this.powerUpTimers = {};
          
          this.paused = false;
          document.getElementById("nextLevelBtn").style.display = "none";
          this.gameLoop();
      }
      
      collisionDetection() {
          for (let ball of this.balls) {
              if (!ball.active) continue;
              
              for (let brick of this.bricks) {
                  if (brick.isActive() && ball.collidesWith(brick)) {
                      ball.dy = -ball.dy;
                      const destroyed = brick.hit();
                      
                      if (destroyed) {
                          this.score += brick.getPoints();
                          
                          if (brick.hasPowerUp) {
                              const powerUpType = this.getRandomPowerUpType();
                              this.powerUps.push(new PowerUp(brick.x + brick.width / 2, brick.y, powerUpType));
                          }
                      }
                      break; // Only hit one brick per ball per frame
                  }
              }
          }
      }
      
      updatePowerUps() {
          for (let powerUp of this.powerUps) {
              powerUp.update(this.height);
              
              if (powerUp.collidesWithPaddle(this.paddle)) {
                  powerUp.collect();
                  this.applyPowerUp(powerUp.type);
              }
          }
          
          // Check power-up timers
          for (let type of this.activePowerUps) {
              const elapsed = Date.now() - this.powerUpTimers[type];
              if (elapsed > this.powerUpDurations[type]) {
                  this.activePowerUps.delete(type);
                  delete this.powerUpTimers[type];
                  this.removePowerUp(type);
              }
          }
          
          // Remove inactive power-ups
          this.powerUps = this.powerUps.filter(p => p.active);
      }
      
      applyPowerUp(type) {
          this.activePowerUps.add(type);
          this.powerUpTimers[type] = Date.now();
          
          if (type === "wide") {
              this.paddle.applyPowerUp(type);
          } else if (type === "speed") {
              for (let ball of this.balls) {
                  ball.speedUp(0.7); // Slow down for "speed" power-up
              }
          } else if (type === "multiball") {
              // Add 2 extra balls
              for (let i = 0; i < 2; i++) {
                  const newBall = new Ball(this.balls[0].x, this.balls[0].y);
                  const angle = (Math.PI / 4) * (i + 1);
                  const speed = Math.hypot(this.balls[0].dx, this.balls[0].dy);
                  newBall.dx = speed * Math.cos(angle) * (Math.random() > 0.5 ? 1 : -1);
                  newBall.dy = -speed * Math.sin(angle);
                  this.balls.push(newBall);
              }
          }
      }
      
      removePowerUp(type) {
          if (type === "wide") {
              this.paddle.resetPowerUp();
          } else if (type === "speed") {
              for (let ball of this.balls) {
                  ball.speedUp(1.43); // Restore normal speed
              }
          }
          // multiball doesn't need removal - balls naturally disappear when they fall off screen
      }
      
      checkWinCondition() {
          const activeBricks = this.bricks.filter(brick => brick.isActive()).length;
          if (activeBricks === 0) {
              this.paused = true;
              document.getElementById("nextLevelBtn").style.display = "block";
              return true;
          }
          return false;
      }
      
      checkBallCollision() {
          let activeBallCount = 0;
          
          for (let ball of this.balls) {
              if (!ball.active) continue;
              activeBallCount++;
              
              // Ball hits bottom
              if (ball.y + ball.dy > this.height - ball.radius) {
                  if (ball.collidesWithPaddle(this.paddle)) {
                      ball.dy = -ball.dy;
                  } else {
                      ball.active = false;
                      activeBallCount--;
                  }
              }
          }
          
          // If no balls are active, lose a life
          if (activeBallCount === 0) {
              this.lives--;
              if (this.lives === 0) {
                  this.gameOver();
              } else {
                  // Reset to single ball
                  this.balls = [new Ball(this.width / 2, this.height - 30)];
                  this.paddle.reset();
              }
          }
      }
      
      gameOver() {
          this.gameRunning = false;
          this.paused = true;
          alert(`GAME OVER! Final Score: ${this.score}`);
          this.reset();
      }
      
      drawUI() {
          // Score
          this.ctx.font = "16px Arial";
          this.ctx.fillStyle = "#0095DD";
          this.ctx.textAlign = "left";
          this.ctx.fillText("Score: " + this.score, 8, 20);
          
          // Lives  
          this.ctx.textAlign = "right";
          this.ctx.fillText("Lives: " + this.lives, this.width - 65, 20);
          
          // Level
          this.ctx.textAlign = "center";
          this.ctx.fillText("Level: " + this.level, this.width / 2, 20);
          
          // Active balls count
          const activeBalls = this.balls.filter(ball => ball.active).length;
          if (activeBalls > 1) {
              this.ctx.textAlign = "left";
              this.ctx.fillStyle = "#ff69b4";
              this.ctx.fillText("Balls: " + activeBalls, 8, 45);
          }
          
          // Power-up indicators
          let yOffset = 30;
          for (let type of this.activePowerUps) {
              const elapsed = Date.now() - this.powerUpTimers[type];
              const remaining = Math.max(0, this.powerUpDurations[type] - elapsed);
              
              if (type !== "multiball" && remaining > 0) {
                  const barHeight = 60;
                  const barWidth = 8;
                  const fillHeight = (remaining / this.powerUpDurations[type]) * barHeight;
                  
                  this.ctx.fillStyle = "gray";
                  this.ctx.fillRect(this.width - 20, yOffset, barWidth, barHeight);
                  
                  const color = type === "wide" ? "lime" : "gold";
                  this.ctx.fillStyle = color;
                  this.ctx.fillRect(
                      this.width - 20,
                      yOffset + (barHeight - fillHeight),
                      barWidth,
                      fillHeight
                  );
                  
                  this.ctx.strokeStyle = "black";
                  this.ctx.strokeRect(this.width - 20, yOffset, barWidth, barHeight);
                  
                  yOffset += barHeight + 5;
              }
          }
      }
      
      update() {
          if (this.paused || !this.gameRunning) return;
          
          // Update all balls
          for (let ball of this.balls) {
              ball.update(this.width, this.height);
          }
          
          this.paddle.update();
          
          // Update moving bricks
          for (let brick of this.bricks) {
              if (brick instanceof MovingBrick) {
                  brick.update(this.width);
              }
          }
          
          this.updatePowerUps();
          this.collisionDetection();
          this.checkBallCollision();
          
          if (this.checkWinCondition()) return;
      }
      
      draw() {
          // Clear canvas
          this.ctx.clearRect(0, 0, this.width, this.height);
          
          // Draw all game objects
          for (let brick of this.bricks) {
              brick.draw(this.ctx);
          }
          
          for (let ball of this.balls) {
              ball.draw(this.ctx);
          }
          
          this.paddle.draw(this.ctx);
          
          for (let powerUp of this.powerUps) {
              powerUp.draw(this.ctx);
          }
          
          this.drawUI();
      }
      
      gameLoop() {
          if (this.paused || !this.gameRunning) return;
          
          this.update();
          this.draw();
          
          requestAnimationFrame(() => this.gameLoop());
      }
  }

  // Initialize the game
  const game = new Game("gameCanvas");
  
  // Initial draw
  game.draw();
</script>