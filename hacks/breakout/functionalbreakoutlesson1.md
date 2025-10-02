---
layout: base_chatadpt
title: Functional Breakout Blocks Lesson 1
author: Nikhil, Rohan, Pranav, Aditya, Shriya, Samhita
permalink: functionalbreakoutlesson1
---

#### [Return to Main Functional Lesson Page]({{ site.baseurl }}/functionalbreakoutlesson)
## **Lesson 1: Paddle and Base Blocks**

### Lesson Objectives
- Draw and control a paddle using keyboard input
- Implement basic collision detection for paddle and ball
- Create and render bricks on the canvas
- Use functions to manage game state and rendering
- Develop interactive demos for paddle and ball movement
- Build a mini Breakout game using only functional code

**Goal:** Learn how to move the paddle (player) left and right and create basic bricks.

### Step 1: Make the paddle

We draw a rectangle at the bottom of the canvas.  

```js
let paddleHeight = 10;
let basePaddleWidth = 75;
let paddleWidth = basePaddleWidth;
let paddleX = (canvas.width - paddleWidth) / 2;

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}
```

### Step 2: Move the paddle

We listen for keyboard input and update the paddleX position.

```js
let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
}

function updatePaddle() {
  if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 7;
  else if (leftPressed && paddleX > 0) paddleX -= 7;
}
```

**Explore:**

* Make your own block that moves left/right with the arrow keys.
* Change its width/height and test how it feels.

#### [👉 Click this for full source code](https://github.com/code259/curators/tree/main/hacks/breakout)

---

<h2>Interactive Demos Progression</h2>
<h4>Until base functionality - does not include advanced features</h4>
<h4>Use the right and left arrows to move the breaker.<h4>

<h3>1. Paddle Movement</h3>

<!-- Toggle -->
<label style="display:block; text-align:center; margin:6px 0;">
  <input type="checkbox" id="toggle-paddle"> Show code
</label>

<!-- Canvas wrapper (shown by default) -->
<div id="wrap-paddle">
  <!-- Canvas 1: Paddle Movement -->

  <canvas id="paddleDemo" width="300" height="150" style="background:white; border:2px solid #333; display:block; margin:0 auto;"></canvas>

  <script>
  const pdCanvas = document.getElementById("paddleDemo");
  const pdCtx = pdCanvas.getContext("2d");
  let pdX = (pdCanvas.width - 75) / 2;
  let pdRight = false, pdLeft = false;

  document.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") pdRight = true;
    if (e.key === "ArrowLeft") pdLeft = true;
  });
  document.addEventListener("keyup", e => {
    if (e.key === "ArrowRight") pdRight = false;
    if (e.key === "ArrowLeft") pdLeft = false;
  });

  function drawPaddleDemo() {
    pdCtx.clearRect(0,0,pdCanvas.width,pdCanvas.height);
    pdCtx.fillStyle = "#0095DD";
    pdCtx.fillRect(pdX, pdCanvas.height-10, 75, 10);
    if (pdRight && pdX < pdCanvas.width-75) pdX += 5;
    if (pdLeft && pdX > 0) pdX -= 5;
    requestAnimationFrame(drawPaddleDemo);
  }
  drawPaddleDemo();
  </script>
</div>

<!-- Read-only code view (hidden by default) -->
<pre id="code-paddle" style="display:none; max-width:820px; margin:8px auto; overflow:auto;"><code>&lt;!-- Canvas 1: Paddle Movement --&gt;
&lt;h3&gt;1. Paddle Movement&lt;/h3&gt;
&lt;canvas id="paddleDemo" width="300" height="150" style="background:white; border:2px solid #333; display:block; margin:0 auto;"&gt;&lt;/canvas&gt;

&lt;script&gt;
const pdCanvas = document.getElementById("paddleDemo");
const pdCtx = pdCanvas.getContext("2d");
let pdX = (pdCanvas.width - 75) / 2;
let pdRight = false, pdLeft = false;

document.addEventListener("keydown", e =&gt; {
  if (e.key === "ArrowRight") pdRight = true;
  if (e.key === "ArrowLeft") pdLeft = true;
});
document.addEventListener("keyup", e =&gt; {
  if (e.key === "ArrowRight") pdRight = false;
  if (e.key === "ArrowLeft") pdLeft = false;
});

function drawPaddleDemo() {
  pdCtx.clearRect(0,0,pdCanvas.width,pdCanvas.height);
  pdCtx.fillStyle = "#0095DD";
  pdCtx.fillRect(pdX, pdCanvas.height-10, 75, 10);
  if (pdRight &amp;&amp; pdX &lt; pdCanvas.width-75) pdX += 5;
  if (pdLeft &amp;&amp; pdX &gt; 0) pdX -= 5;
  requestAnimationFrame(drawPaddleDemo);
}
drawPaddleDemo();
&lt;/script&gt;
</code></pre>

<!-- Tiny toggle wiring for Canvas 1 -->
<script>
(function(){
  const toggle = document.getElementById("toggle-paddle");
  const wrap = document.getElementById("wrap-paddle");
  const code = document.getElementById("code-paddle");

  // default: unchecked → canvas visible
  toggle.checked = false;

  toggle.addEventListener("change", () => {
    if (toggle.checked) {
      wrap.style.display = "none";
      code.style.display = "block";
    } else {
      code.style.display = "none";
      wrap.style.display = "block";
    }
  });
})();
</script>

<!-- ========================= Canvas 2 ========================= -->
<h3>2. Ball Bouncing</h3>
<label style="display:block; text-align:center; margin:6px 0;">
  <input type="checkbox" id="toggle-ball"> Show code
</label>

<div id="wrap-ball">
  <!-- Canvas 2: Ball Bouncing -->
  <canvas id="ballDemo" width="300" height="150" style="background:white; border:2px solid #333; display:block; margin:0 auto;"></canvas>

  <script>
  const bCanvas = document.getElementById("ballDemo");
  const bCtx = bCanvas.getContext("2d");
  let bx = bCanvas.width/2, by = bCanvas.height/2, bvx = 2, bvy = 2, br = 8;

  function drawBallDemo() {
    bCtx.clearRect(0,0,bCanvas.width,bCanvas.height);
    bCtx.beginPath();
    bCtx.arc(bx, by, br, 0, Math.PI*2);
    bCtx.fillStyle = "#DD0000";
    bCtx.fill();
    bCtx.closePath();
    bx += bvx; by += bvy;
    if (bx+br > bCanvas.width || bx-br < 0) bvx = -bvx;
    if (by+br > bCanvas.height || by-br < 0) bvy = -bvy;
    requestAnimationFrame(drawBallDemo);
  }
  drawBallDemo();
  </script>
</div>

<pre id="code-ball" style="display:none; max-width:820px; margin:8px auto; overflow:auto;"><code>&lt;!-- Canvas 2: Ball Bouncing --&gt;
&lt;h3&gt;2. Ball Bouncing&lt;/h3&gt;
&lt;canvas id="ballDemo" width="300" height="150" style="background:white; border:2px solid #333; display:block; margin:0 auto;"&gt;&lt;/canvas&gt;

&lt;script&gt;
const bCanvas = document.getElementById("ballDemo");
const bCtx = bCanvas.getContext("2d");
let bx = bCanvas.width/2, by = bCanvas.height/2, bvx = 2, bvy = 2, br = 8;

function drawBallDemo() {
  bCtx.clearRect(0,0,bCanvas.width,bCanvas.height);
  bCtx.beginPath();
  bCtx.arc(bx, by, br, 0, Math.PI*2);
  bCtx.fillStyle = "#DD0000";
  bCtx.fill();
  bCtx.closePath();
  bx += bvx; by += bvy;
  if (bx+br &gt; bCanvas.width || bx-br &lt; 0) bvx = -bvx;
  if (by+br &gt; bCanvas.height || by-br &lt; 0) bvy = -bvy;
  requestAnimationFrame(drawBallDemo);
}
drawBallDemo();
&lt;/script&gt;
</code></pre>

<script>
(function(){
  const toggle = document.getElementById("toggle-ball");
  const wrap = document.getElementById("wrap-ball");
  const code = document.getElementById("code-ball");
  toggle.checked = false;
  toggle.addEventListener("change", () => {
    if (toggle.checked) { wrap.style.display = "none"; code.style.display = "block"; }
    else { code.style.display = "none"; wrap.style.display = "block"; }
  });
})();
</script>

<!-- ========================= Canvas 3 ========================= -->
<h3>3. Paddle + Ball</h3>
<label style="display:block; text-align:center; margin:6px 0;">
  <input type="checkbox" id="toggle-combo"> Show code
</label>

<div id="wrap-combo">
  <!-- Canvas 3: Paddle + Ball -->
  <canvas id="comboDemo" width="300" height="150" style="background:white; border:2px solid #333; display:block; margin:0 auto;"></canvas>

  <script>
  const cCanvas = document.getElementById("comboDemo");
  const cCtx = cCanvas.getContext("2d");
  let cx = cCanvas.width/2, cy = cCanvas.height-30, cvx = 2, cvy = -2, cr = 8;
  let cpX = (cCanvas.width - 75)/2, cRight = false, cLeft = false;

  document.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") cRight = true;
    if (e.key === "ArrowLeft") cLeft = true;
  });
  document.addEventListener("keyup", e => {
    if (e.key === "ArrowRight") cRight = false;
    if (e.key === "ArrowLeft") cLeft = false;
  });

  function drawCombo() {
    cCtx.clearRect(0,0,cCanvas.width,cCanvas.height);
    // Ball
    cCtx.beginPath();
    cCtx.arc(cx, cy, cr, 0, Math.PI*2);
    cCtx.fillStyle = "#DD0000";
    cCtx.fill();
    cCtx.closePath();
    // Paddle
    cCtx.fillStyle = "#0095DD";
    cCtx.fillRect(cpX, cCanvas.height-10, 75, 10);
    // Update ball
    cx += cvx; cy += cvy;
    if (cx+cr > cCanvas.width || cx-cr < 0) cvx = -cvx;
    if (cy-cr < 0) cvy = -cvy;
    else if (cy+cr > cCanvas.height-10 && cx > cpX && cx < cpX+75) cvy = -cvy;
    else if (cy+cr > cCanvas.height) { cx = cCanvas.width/2; cy = cCanvas.height/2; }
    // Update paddle
    if (cRight && cpX < cCanvas.width-75) cpX += 5;
    if (cLeft && cpX > 0) cpX -= 5;
    requestAnimationFrame(drawCombo);
  }
  drawCombo();
  </script>
</div>

<pre id="code-combo" style="display:none; max-width:820px; margin:8px auto; overflow:auto;"><code>&lt;!-- Canvas 3: Paddle + Ball --&gt;
&lt;h3&gt;3. Paddle + Ball&lt;/h3&gt;
&lt;canvas id="comboDemo" width="300" height="150" style="background:white; border:2px solid #333; display:block; margin:0 auto;"&gt;&lt;/canvas&gt;

&lt;script&gt;
const cCanvas = document.getElementById("comboDemo");
const cCtx = cCanvas.getContext("2d");
let cx = cCanvas.width/2, cy = cCanvas.height-30, cvx = 2, cvy = -2, cr = 8;
let cpX = (cCanvas.width - 75)/2, cRight = false, cLeft = false;

document.addEventListener("keydown", e =&gt; {
  if (e.key === "ArrowRight") cRight = true;
  if (e.key === "ArrowLeft") cLeft = true;
});
document.addEventListener("keyup", e =&gt; {
  if (e.key === "ArrowRight") cRight = false;
  if (e.key === "ArrowLeft") cLeft = false;
});

function drawCombo() {
  cCtx.clearRect(0,0,cCanvas.width,cCanvas.height);
  // Ball
  cCtx.beginPath();
  cCtx.arc(cx, cy, cr, 0, Math.PI*2);
  cCtx.fillStyle = "#DD0000";
  cCtx.fill();
  cCtx.closePath();
  // Paddle
  cCtx.fillStyle = "#0095DD";
  cCtx.fillRect(cpX, cCanvas.height-10, 75, 10);
  // Update ball
  cx += cvx; cy += cvy;
  if (cx+cr &gt; cCanvas.width || cx-cr &lt; 0) cvx = -cvx;
  if (cy-cr &lt; 0) cvy = -cvy;
  else if (cy+cr &gt; cCanvas.height-10 &amp;&amp; cx &gt; cpX &amp;&amp; cx &lt; cpX+75) cvy = -cvy;
  else if (cy+cr &gt; cCanvas.height) { cx = cCanvas.width/2; cy = cCanvas.height/2; }
  // Update paddle
  if (cRight &amp;&amp; cpX &lt; cCanvas.width-75) cpX += 5;
  if (cLeft &amp;&amp; cpX &gt; 0) cpX -= 5;
  requestAnimationFrame(drawCombo);
}
drawCombo();
&lt;/script&gt;
</code></pre>

<script>
(function(){
  const toggle = document.getElementById("toggle-combo");
  const wrap = document.getElementById("wrap-combo");
  const code = document.getElementById("code-combo");
  toggle.checked = false;
  toggle.addEventListener("change", () => {
    if (toggle.checked) { wrap.style.display = "none"; code.style.display = "block"; }
    else { code.style.display = "none"; wrap.style.display = "block"; }
  });
})();
</script>

<!-- ========================= Canvas 4 ========================= -->
<h3>4. Mini Breakout (Ball + Paddle + Bricks)</h3>
<label style="display:block; text-align:center; margin:6px 0;">
  <input type="checkbox" id="toggle-breakout"> Show code
</label>

<div id="wrap-breakout">
  <!-- Canvas 4: Full Mini Breakout -->
  <canvas id="breakoutDemo" width="300" height="200" style="background:white; border:2px solid #333; display:block; margin:0 auto;"></canvas>

  <script>
  const brCanvas = document.getElementById("breakoutDemo");
  const brCtx = brCanvas.getContext("2d");
  // Ball
  let brX = brCanvas.width/2, brY = brCanvas.height-30, brVX = 2, brVY = -2, brR = 8;
  // Paddle
  let brPW = 75, brPH = 10, brPX = (brCanvas.width-brPW)/2, brRight = false, brLeft = false;
  // Bricks
  const rowCount=3, colCount=5, bw=50, bh=15, bp=10, bo=30, bt=30;
  let bricks = [];
  for(let c=0;c<colCount;c++){ bricks[c]=[]; for(let r=0;r<rowCount;r++){ bricks[c][r]={x:0,y:0,status:1}; } }

  document.addEventListener("keydown",e=>{ if(e.key==="ArrowRight")brRight=true; if(e.key==="ArrowLeft")brLeft=true; });
  document.addEventListener("keyup",e=>{ if(e.key==="ArrowRight")brRight=false; if(e.key==="ArrowLeft")brLeft=false; });

  function drawBricks() {
    for(let c=0;c<colCount;c++){ for(let r=0;r<rowCount;r++){
      if(bricks[c][r].status==1){
        let bx=(c*(bw+bp))+bo, by=(r*(bh+bp))+bt;
        bricks[c][r].x=bx; bricks[c][r].y=by;
        brCtx.fillStyle="#00AA00";
        brCtx.fillRect(bx,by,bw,bh);
      }
    }}
  }

  function drawBreakout() {
    brCtx.clearRect(0,0,brCanvas.width,brCanvas.height);
    // Ball
    brCtx.beginPath(); brCtx.arc(brX,brY,brR,0,Math.PI*2); brCtx.fillStyle="#DD0000"; brCtx.fill(); brCtx.closePath();
    // Paddle
    brCtx.fillStyle="#0095DD"; brCtx.fillRect(brPX, brCanvas.height-brPH, brPW, brPH);
    // Bricks
    drawBricks();
    // Collision
    for(let c=0;c<colCount;c++){ for(let r=0;r<rowCount;r++){
      let b=bricks[c][r];
      if(b.status==1 && brX> b.x && brX< b.x+bw && brY> b.y && brY< b.y+bh){
        brVY=-brVY; b.status=0;
      }
    }}
    // Ball move
    brX+=brVX; brY+=brVY;
    if(brX+brR>brCanvas.width||brX-brR<0) brVX=-brVX;
    if(brY-brR<0) brVY=-brVY;
    else if(brY+brR>brCanvas.height-brPH && brX>brPX && brX<brPX+brPW) brVY=-brVY;
    else if(brY+brR>brCanvas.height){ brX=brCanvas.width/2; brY=brCanvas.height-30; brVY=-2; }
    // Paddle move
    if(brRight && brPX<brCanvas.width-brPW) brPX+=5;
    if(brLeft && brPX>0) brPX-=5;
    requestAnimationFrame(drawBreakout);
  }
  drawBreakout();
  </script>
</div>

<pre id="code-breakout" style="display:none; max-width:820px; margin:8px auto; overflow:auto;"><code>&lt;!-- Canvas 4: Full Mini Breakout --&gt;
&lt;h3&gt;4. Mini Breakout (Ball + Paddle + Bricks)&lt;/h3&gt;
&lt;canvas id="breakoutDemo" width="300" height="200" style="background:white; border:2px solid #333; display:block; margin:0 auto;"&gt;&lt;/canvas&gt;

&lt;script&gt;
const brCanvas = document.getElementById("breakoutDemo");
const brCtx = brCanvas.getContext("2d");
// Ball
let brX = brCanvas.width/2, brY = brCanvas.height-30, brVX = 2, brVY = -2, brR = 8;
// Paddle
let brPW = 75, brPH = 10, brPX = (brCanvas.width-brPW)/2, brRight = false, brLeft = false;
// Bricks
const rowCount=3, colCount=5, bw=50, bh=15, bp=10, bo=30, bt=30;
let bricks = [];
for(let c=0;c&lt;colCount;c++){ bricks[c]=[]; for(let r=0;r&lt;rowCount;r++){ bricks[c][r]={x:0,y:0,status:1}; } }

document.addEventListener("keydown",e=&gt;{ if(e.key==="ArrowRight")brRight=true; if(e.key==="ArrowLeft")brLeft=true; });
document.addEventListener("keyup",e=&gt;{ if(e.key==="ArrowRight")brRight=false; if(e.key==="ArrowLeft")brLeft=false; });

function drawBricks() {
  for(let c=0;c&lt;colCount;c++){ for(let r=0;r&lt;rowCount;r++){
    if(bricks[c][r].status==1){
      let bx=(c*(bw+bp))+bo, by=(r*(bh+bp))+bt;
      bricks[c][r].x=bx; bricks[c][r].y=by;
      brCtx.fillStyle="#00AA00";
      brCtx.fillRect(bx,by,bw,bh);
    }
  }}
}

function drawBreakout() {
  brCtx.clearRect(0,0,brCanvas.width,brCanvas.height);
  // Ball
  brCtx.beginPath(); brCtx.arc(brX,brY,brR,0,Math.PI*2); brCtx.fillStyle="#DD0000"; brCtx.fill(); brCtx.closePath();
  // Paddle
  brCtx.fillStyle="#0095DD"; brCtx.fillRect(brPX, brCanvas.height-brPH, brPW, brPH);
  // Bricks
  drawBricks();
  // Collision
  for(let c=0;c&lt;colCount;c++){ for(let r=0;r&lt;rowCount;r++){
    let b=bricks[c][r];
    if(b.status==1 &amp;&amp; brX&gt; b.x &amp;&amp; brX&lt; b.x+bw &amp;&amp; brY&gt; b.y &amp;&amp; brY&lt; b.y+bh){
      brVY=-brVY; b.status=0;
    }
  }}
  // Ball move
  brX+=brVX; brY+=brVY;
  if(brX+brR&gt;brCanvas.width||brX-brR&lt;0) brVX=-brVX;
  if(brY-brR&lt;0) brVY=-brVY;
  else if(brY+brR&gt;brCanvas.height-brPH &amp;&amp; brX&gt;brPX &amp;&amp; brX&lt;brPX+brPW) brVY=-brVY;
  else if(brY+brR&gt;brCanvas.height){ brX=brCanvas.width/2; brY=brCanvas.height-30; brVY=-2; }
  // Paddle move
  if(brRight &amp;&amp; brPX&lt;brCanvas.width-brPW) brPX+=5;
  if(brLeft &amp;&amp; brPX&gt;0) brPX-=5;
  requestAnimationFrame(drawBreakout);
}
drawBreakout();
&lt;/script&gt;
</code></pre>

<script>
(function(){
  const toggle = document.getElementById("toggle-breakout");
  const wrap = document.getElementById("wrap-breakout");
  const code = document.getElementById("code-breakout");
  toggle.checked = false;
  toggle.addEventListener("change", () => {
    if (toggle.checked) { wrap.style.display = "none"; code.style.display = "block"; }
    else { code.style.display = "none"; wrap.style.display = "block"; }
  });
})();
</script>
