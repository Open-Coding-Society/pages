---
layout: post 
title: OOP Breakout Blocks
author: Nikhil, Rohan, Pranav, Aditya, Shriya, Samhita
permalink: oopbreakoutgame
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

  .title {
    margin-top: 5px !important;
  }

  .back-button {
    margin-bottom: 5px !important;
  }
</style>

<canvas id="gameCanvas" width="600" height="400"></canvas>

<div class="controls" style="text-align: center; margin: 20px 0;">
    <button id="startBtn" style="margin: 5px; padding: 10px 16px; font-size: 16px; font-weight: 600; border: 1px solid #222; background: #fff; cursor: pointer; border-radius: 8px; color: #111;">Start Game</button>
    <button id="pauseBtn" disabled style="margin: 5px; padding: 10px 16px; font-size: 16px; font-weight: 600; border: 1px solid #222; background: #fff; cursor: pointer; border-radius: 8px; color: #111;">Pause</button>
    <button id="resetBtn" style="margin: 5px; padding: 10px 16px; font-size: 16px; font-weight: 600; border: 1px solid #222; background: #a52c2cff; cursor: pointer; border-radius: 8px; color: #111;">Reset</button>
    <button id="nextLevelBtn" style="display:none;margin:10px auto 0;padding:10px 16px;font-family:system-ui,Arial;font-size:16px;font-weight:600;border:1px solid #222;background:#fff;cursor:pointer;border-radius:8px;color:#111 !important;">Next Level ▶</button>
</div>

<!-- Hack Challenges Section -->
<div id="hack1" style="max-width:600px;margin:8px auto;font-family:system-ui,Arial;">
    <p class="back-button"><a href="{{site.baseurl}}/hacks" style="text-decoration:none;color:#007acc;font-weight:bold;">Click here to go back to main page</a></p>
    <h2 class="title">OOP Breakout Game (w/ Advanced Features)</h2>
    
    <!-- OOP Architecture Info -->
    <div style="background: black; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h3>Object-Oriented Programming Architecture:</h3>
        <ul style="margin:8px 0 12px 20px;">
            <li><strong>GameObject Base Class:</strong> Shared properties (x, y, draw methods) - though minimal inheritance used</li>
            <li><strong>Ball Class:</strong> Handles movement, collision detection, and physics</li>
            <li><strong>Paddle Class:</strong> Manages size, position, and user input</li>
            <li><strong>Brick Class:</strong> Individual brick state and power-up properties</li>
            <li><strong>PowerUp Class:</strong> Falling mechanics and effect application</li>
            <li><strong>Game Class:</strong> Central controller for state management and game loop</li>
        </ul>
        <p><strong>Controls:</strong> Use arrow keys or mouse to move paddle</p>
    </div>

    <!-- Hack #1: 90% hack section -->
    <div id="hack1-90" style="max-width:600px;margin:8px auto;font-family:system-ui,Arial;">
        <p><strong>Hack #1 (90%): Change Colors</strong></p>
        <p>Look in the JavaScript classes and change the <em>paddle</em> and <em>brick</em> colors.</p>
        
        <ul style="margin:8px 0 12px 20px;">
            <li>Pick a new color for the paddle and the bricks.</li>
            <li>Change the <em>Colors</em> in the Ball, Paddle, and Brick class constructors (look for <code>this.color = "#0095DD"</code>).</li>
            <li>Tip: High-contrast colors look best on a black background.</li>
        </ul>
    </div>

    <!-- Hack #1: 100% hack section -->
    <div id="hack1-100" style="max-width:600px;margin:8px auto;font-family:system-ui,Arial;">
        <p><strong>Hack #1 (100%): Go Further with Colors</strong></p>
        <ul style="margin:8px 0 12px 20px;">
            <li>Try creating a color picker below the game to change the color of the ball or blocks on the fly.</li>
            <li>Extra challenge: Try using gradients in the Brick class draw method.</li>
            <li>Advanced: Add a method to each class to dynamically change colors during gameplay.</li>
        </ul>
    </div>

    <!-- Hack #2: 90% hack section -->
    <div id="hack2-90" style="max-width:600px;margin:8px auto;font-family:system-ui,Arial;">
        <p><strong>Hack #2 (90%): Change Ball Speed</strong></p>
        <p>Look in the Ball class constructor and change the <em>ball</em> speed.</p>
        <ul style="margin:8px 0 12px 20px;">
            <li>Pick a new speed for the ball by modifying <code>this.dx</code> and <code>this.dy</code> values.</li>
            <li>Change the <em>ball speed</em> in the Ball constructor to update the game difficulty.</li>
            <li>Tip: Don't make the speed too high! It will be too hard!</li>
            <li>Hint: In the Ball class constructor, <code>this.dx = 2</code> and <code>this.dy = -2</code> determine the initial speed.</li>
        </ul>
    </div>

    <!-- Hack #2: 100% hack section -->
    <div id="hack2-100" style="max-width:600px;margin:8px auto;font-family:system-ui,Arial;">
        <p><strong>Hack #2 (100%): Advanced Ball Speed</strong></p>
        <ul style="margin:8px 0 12px 20px;">
            <li>Make the ball speed up each time it hits a brick or the paddle by modifying the collision methods.</li>
            <li>Add a speed increment to the <code>collisionDetection()</code> method in the Game class.</li>
            <li>Also, try adding a "slow motion" mode by adding a new method to the Ball class that halves the speed.</li>
            <li>Challenge: Add a keyboard control (like spacebar) that toggles slow motion during gameplay.</li>
        </ul>
    </div>

    <!-- OOP-specific hacks -->
    <div id="oop-hacks" style="max-width:600px;margin:8px auto;font-family:system-ui,Arial;">
        <p><strong>OOP Bonus Hacks:</strong></p>
        <ul style="margin:8px 0 12px 20px;">
            <li><strong>Multiple Balls:</strong> Modify the Game class to handle an array of Ball objects instead of just one.</li>
            <li><strong>New PowerUp Types:</strong> Extend the PowerUp class to include different types (speed boost, multi-ball, etc.).</li>
            <li><strong>Custom Brick Types:</strong> Create subclasses of Brick with different behaviors (multi-hit bricks, moving bricks).</li>
            <li><strong>Particle Effects:</strong> Create a Particle class for visual effects when bricks are destroyed.</li>
            <li><strong>Better Inheritance:</strong> Add meaningful shared methods to GameObject class (collision detection, bounds checking).</li>
        </ul>
    </div>
</div>

<div id="information" style="max-width:600px;margin:8px auto;font-family:system-ui,Arial;">
    <h2>OOP Breakout Game Lesson</h2>
    <p><strong>Learn Object-Oriented Programming</strong></p>
    <p>Learn the basics of building a <strong>Breakout-style game</strong> using Object-Oriented Programming principles in JavaScript.</p>
    <p>In this refactored version, you'll understand how to organize code into <strong>classes</strong>, manage <strong>game state</strong>, and create <strong>reusable components</strong> for game development.</p>
    <ul style="margin:8px 0 12px 20px;">
        <li>Understand how classes encapsulate game object behavior.</li>
        <li>Learn the difference between encapsulation and true inheritance.</li>
        <li>Practice creating modular, maintainable game architecture.</li>
        <li>Explore how OOP makes adding new features easier.</li>
    </ul>
    <p><a href="{{site.baseurl}}/oopbreakoutlesson" style="text-decoration:none;color:#007acc;font-weight:bold;">Click here to read the full lesson</a></p>
</div>

<script>
  // Base GameObject class - provides common functionality
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
  }

  // Ball class - handles ball physics and movement
  class Ball extends GameObject {
      constructor(x, y, radius = 8) {
          super(x, y);
          this.radius = radius;
          this.dx = 2;
          this.dy = -2;
          this.color = "#0095DD";
      }
      
      draw(ctx) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
          ctx.closePath();
      }
      
      update(canvasWidth, canvasHeight) {
          // Wall collision
          if (this.x + this.dx > canvasWidth - this.radius || this.x + this.dx < this.radius) {
              this.dx = -this.dx;
          }
          if (this.y + this.dy < this.radius) {
              this.dy = -this.dy;
          }
          
          this.x += this.dx;
          this.y += this.dy;
      }
      
      reset(canvasWidth, canvasHeight) {
          this.x = canvasWidth / 2;
          this.y = canvasHeight - 30;
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
              this.x > obj.x &&
              this.x < obj.x + obj.width &&
              this.y > obj.y &&
              this.y < obj.y + obj.height
          );
      }
      
      collidesWithPaddle(paddle) {
          return (
              this.y + this.dy > paddle.canvasHeight - paddle.height &&
              this.x > paddle.x &&
              this.x < paddle.x + paddle.width
          );
      }
  }

  // Paddle class - handles paddle movement and controls
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
      }
      
      resetPowerUp() {
          this.width = this.baseWidth;
      }
  }

  // Brick class - individual brick with power-up capability
  class Brick extends GameObject {
      constructor(x, y, width = 75, height = 20) {
          super(x, y);
          this.width = width;
          this.height = height;
          this.status = 1; // 1 = active, 0 = destroyed
          this.hasPowerUp = Math.random() < 0.3; // 30% chance
          this.color = this.hasPowerUp ? "gold" : "#0095DD";
      }
      
      draw(ctx) {
          if (this.status === 1) {
              ctx.beginPath();
              ctx.rect(this.x, this.y, this.width, this.height);
              
              if (this.hasPowerUp) {
                  ctx.fillStyle = this.color;
                  ctx.shadowColor = "orange";
                  ctx.shadowBlur = 10;
              } else {
                  ctx.fillStyle = this.color;
                  ctx.shadowBlur = 0;
              }
              
              ctx.fill();
              ctx.closePath();
          }
      }
      
      destroy() {
          this.status = 0;
      }
      
      isActive() {
          return this.status === 1;
      }
  }

  // PowerUp class - falling power-ups with effects
  class PowerUp extends GameObject {
      constructor(x, y) {
          super(x, y);
          this.size = 20;
          this.fallSpeed = 1.5;
          this.active = true;
          this.type = "wide"; // could be expanded for different types
      }
      
      draw(ctx) {
          if (this.active) {
              // Create gradient effect
              const gradient = ctx.createRadialGradient(
                  this.x, this.y, 5, this.x, this.y, this.size
              );
              gradient.addColorStop(0, "yellow");
              gradient.addColorStop(1, "red");
              
              ctx.beginPath();
              ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
              ctx.fillStyle = gradient;
              ctx.fill();
              ctx.closePath();
              
              // Draw "P" text
              ctx.fillStyle = "black";
              ctx.font = "bold 14px Arial";
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText("P", this.x, this.y);
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

  // Main Game class - controls game state and orchestrates everything
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
          
          // Game objects
          this.ball = new Ball(this.width / 2, this.height - 30);
          this.paddle = new Paddle((this.width - 75) / 2, this.height - 10, this.width, this.height);
          this.bricks = [];
          this.powerUps = [];
          
          // Power-up state
          this.activePowerUp = null;
          this.powerUpTimer = 0;
          this.powerUpDuration = 5000; // 5 seconds
          
          // Brick configuration
          this.brickRows = 4;
          this.brickCols = 6;
          this.brickPadding = 10;
          this.brickOffsetTop = 30;
          this.brickOffsetLeft = 50;
          
          this.setupEventListeners();
          this.initBricks();
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
                  this.bricks.push(new Brick(x, y));
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
          
          this.ball.reset(this.width, this.height);
          this.paddle.reset();
          this.powerUps = [];
          this.activePowerUp = null;
          
          this.initBricks();
          
          document.getElementById("startBtn").disabled = false;
          document.getElementById("pauseBtn").disabled = true;
          document.getElementById("pauseBtn").textContent = "Pause";
          document.getElementById("nextLevelBtn").style.display = "none";
          
          this.draw();
      }
      
      nextLevel() {
          this.level++;
          this.ball.speedUp(1.12);
          
          if (this.brickRows < 8) {
              this.brickRows++;
          }
          
          this.initBricks();
          this.ball.reset(this.width, this.height);
          this.paddle.reset();
          this.powerUps = [];
          this.activePowerUp = null;
          
          this.paused = false;
          document.getElementById("nextLevelBtn").style.display = "none";
          this.gameLoop();
      }
      
      collisionDetection() {
          for (let brick of this.bricks) {
              if (brick.isActive() && this.ball.collidesWith(brick)) {
                  this.ball.dy = -this.ball.dy;
                  brick.destroy();
                  this.score++;
                  
                  if (brick.hasPowerUp) {
                      this.powerUps.push(new PowerUp(brick.x + brick.width / 2, brick.y));
                  }
              }
          }
      }
      
      updatePowerUps() {
          for (let powerUp of this.powerUps) {
              powerUp.update(this.height);
              
              if (powerUp.collidesWithPaddle(this.paddle)) {
                  powerUp.collect();
                  this.paddle.applyPowerUp(powerUp.type);
                  this.activePowerUp = powerUp.type;
                  this.powerUpTimer = Date.now();
              }
          }
          
          // Check power-up timer
          if (this.activePowerUp) {
              const elapsed = Date.now() - this.powerUpTimer;
              if (elapsed > this.powerUpDuration) {
                  this.activePowerUp = null;
                  this.paddle.resetPowerUp();
              }
          }
          
          // Remove inactive power-ups
          this.powerUps = this.powerUps.filter(p => p.active);
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
          // Ball hits bottom
          if (this.ball.y + this.ball.dy > this.height - this.ball.radius) {
              if (this.ball.collidesWithPaddle(this.paddle)) {
                  this.ball.dy = -this.ball.dy;
              } else {
                  this.lives--;
                  if (this.lives === 0) {
                      this.gameOver();
                  } else {
                      this.ball.reset(this.width, this.height);
                      this.paddle.reset();
                  }
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
          this.ctx.fillText("Lives: " + this.lives, this.width - 8, 20);
          
          // Level
          this.ctx.textAlign = "center";
          this.ctx.fillText("Level: " + this.level, this.width / 2, 20);
          
          // Power-up timer
          if (this.activePowerUp) {
              const elapsed = Date.now() - this.powerUpTimer;
              const remaining = Math.max(0, this.powerUpDuration - elapsed);
              const barHeight = 100;
              const barWidth = 10;
              const fillHeight = (remaining / this.powerUpDuration) * barHeight;
              
              this.ctx.fillStyle = "gray";
              this.ctx.fillRect(this.width - 20, 30, barWidth, barHeight);
              
              this.ctx.fillStyle = "lime";
              this.ctx.fillRect(
                  this.width - 20,
                  30 + (barHeight - fillHeight),
                  barWidth,
                  fillHeight
              );
              
              this.ctx.strokeStyle = "black";
              this.ctx.strokeRect(this.width - 20, 30, barWidth, barHeight);
          }
      }
      
      update() {
          if (this.paused || !this.gameRunning) return;
          
          this.ball.update(this.width, this.height);
          this.paddle.update();
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
          
          this.ball.draw(this.ctx);
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