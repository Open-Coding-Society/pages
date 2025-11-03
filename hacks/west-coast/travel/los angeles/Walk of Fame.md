---
layout: post
title: "Los Angeles"
description: "Roadtrip through LA and learn UI while you're there!"
permalink: /west-coast/analytics/losangeles/WOF
parent: "Analytics/Admin"
team: "Cool Collaborators"
submodule: 1
author: "Cool Collaborators"
date: 2025-10-21
---

<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Hollywood Walk of Fame — Roadtrip</title>
<style>
/* ===== Truck intro (8s) ===== */
body{background:#009688;font-family:'Open Sans',sans-serif;margin:0;padding:0}
.loop-wrapper{margin:0 auto;position:relative;display:block;width:600px;height:250px;overflow:hidden;border-bottom:3px solid #fff;color:#fff}
.mountain{position:absolute;right:-900px;bottom:-20px;width:2px;height:2px;box-shadow:0 0 0 50px #4DB6AC,60px 50px 0 70px #4DB6AC,90px 90px 0 50px #4DB6AC,250px 250px 0 50px #4DB6AC,290px 320px 0 50px #4DB6AC,320px 400px 0 50px #4DB6AC;transform:rotate(130deg);animation:mtn 20s linear infinite}
.hill{position:absolute;right:-900px;bottom:-50px;width:400px;border-radius:50%;height:20px;box-shadow:0 0 0 50px #4DB6AC,-20px 0 0 20px #4DB6AC,-90px 0 0 50px #4DB6AC,250px 0 0 50px #4DB6AC,290px 0 0 50px #4DB6AC,620px 0 0 50px #4DB6AC;animation:hill 4s 2s linear infinite}
.tree,.tree:nth-child(2),.tree:nth-child(3){position:absolute;height:100px;width:35px;bottom:0;background:url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/130015/tree.svg) no-repeat}
.rock{margin-top:-17%;height:2%;width:2%;bottom:-2px;border-radius:20px;position:absolute;background:#ddd}
.truck,.wheels{transition:all ease;width:85px;margin-right:-60px;bottom:0px;right:50%;position:absolute;background:#eee}
.truck{background:url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/130015/truck.svg) no-repeat;background-size:contain;height:60px}
.truck:before{content:" ";position:absolute;width:25px;box-shadow:-30px 28px 0 1.5px #fff,-35px 18px 0 1.5px #fff}
.wheels{background:url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/130015/wheels.svg) no-repeat;height:15px;margin-bottom:0}
.tree{animation:tree 3s 0s linear infinite}
.tree:nth-child(2){animation:tree2 2s .15s linear infinite}
.tree:nth-child(3){animation:tree3 8s .05s linear infinite}
.rock{animation:rock 4s -.53s linear infinite}
.truck{animation:truck 4s .08s ease infinite}
.wheels{animation:truck 4s .001s ease infinite}
.truck:before{animation:wind 1.5s 0s ease infinite}
@keyframes tree{0%{transform:translate(1350px)}100%{transform:translate(-50px)}}
@keyframes tree2{0%{transform:translate(650px)}100%{transform:translate(-50px)}}
@keyframes tree3{0%{transform:translate(2750px)}100%{transform:translate(-50px)}}
@keyframes rock{0%{right:-200px}100%{right:2000px}}
@keyframes truck{0%{}6%{transform:translateY(0)}7%{transform:translateY(-6px)}9%{transform:translateY(0)}10%{transform:translateY(-1px)}11%{transform:translateY(0)}100%{}}
@keyframes wind{0%{}50%{transform:translateY(3px)}100%{}}
@keyframes mtn{100%{transform:translateX(-2000px) rotate(130deg)}}
@keyframes hill{100%{transform:translateX(-2000px)}}
.intro{position:fixed;inset:0;display:grid;place-items:center;background:#009688;z-index:10}
.intro p{color:#fff;font-weight:800;margin-top:18px;text-shadow:0 2px 12px rgba(0,0,0,.35)}
/* ===== Scene: Walk of Fame ===== */
.hidden{display:none}
.scene{position:relative;min-height:100vh;background:linear-gradient(#87CEEB,#B0D4E3)}
.sidewalk{position:absolute;inset:auto 0 0 0;height:140px;background:linear-gradient(#d9c2a1,#af8f73);border-top:4px solid #8b7355}
.star{width:68px;height:68px;background:linear-gradient(135deg,#ffd700,#ffa500);clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);bottom:38px;left:-120px;filter:drop-shadow(0 0 10px rgba(255,215,0,.55));position:absolute;animation:stars 9s linear infinite}
.star.s2{animation-delay:2.2s}.star.s3{animation-delay:4.4s}.star.s4{animation-delay:6.6s}
@keyframes stars{to{transform:translateX(1300px)}}
.chinese-theatre{position:absolute;bottom:140px;left:8%;width:180px;height:200px}
.theatre-roof{position:absolute;top:0;left:50%;transform:translateX(-50%);width:180px;height:60px;background:linear-gradient(#c41e3a,#8b0000);clip-path:polygon(10% 100%,0% 30%,50% 0%,100% 30%,90% 100%)}
.theatre-body{position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:140px;height:140px;background:linear-gradient(#f4e4c1,#d4c4a1);border:3px solid #a89060}
.theatre-pillars{position:absolute;top:20px;left:10px;right:10px;bottom:0}
.pillar{position:absolute;width:18px;height:120px;background:#c9b896;border:2px solid #a89060;bottom:0}
.pillar:nth-child(1){left:0}.pillar:nth-child(2){left:40%}.pillar:nth-child(3){right:0}
.capitol-records{position:absolute;bottom:140px;right:12%;width:90px;height:220px}
.capitol-base{position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:90px;height:180px;background:linear-gradient(#f8f8f8,#d4d4d4);border-radius:45px 45px 0 0;border:3px solid #b8b8b8}
.capitol-ring{position:absolute;left:50%;transform:translateX(-50%);width:100%;height:12px;background:#2c5f8d;border-radius:50%}
.capitol-ring:nth-child(1){top:30px}.capitol-ring:nth-child(2){top:70px}.capitol-ring:nth-child(3){top:110px}.capitol-ring:nth-child(4){top:150px}
.capitol-top{position:absolute;top:0;left:50%;transform:translateX(-50%);width:40px;height:40px;background:radial-gradient(circle,#ff4444,#cc0000);border-radius:50%;border:3px solid #990000;animation:blink 2s ease-in-out infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
.dolby-theatre{position:absolute;bottom:140px;left:35%;width:160px;height:180px}
.dolby-body{position:absolute;bottom:0;width:100%;height:140px;background:linear-gradient(#2c3e50,#1a252f);border:3px solid #000}
.dolby-marquee{position:absolute;top:0;left:50%;transform:translateX(-50%);width:140px;height:50px;background:#ffd700;border:4px solid #ffaa00;display:grid;place-items:center;font-weight:800;font-size:11px;color:#000;letter-spacing:1px}
.dolby-marquee:before{content:"OSCARS"}
.marquee-lights{position:absolute;bottom:0;left:0;right:0;height:8px;background:repeating-linear-gradient(90deg,#fff 0 8px,#ffd700 8px 16px);animation:marquee-scroll .6s linear infinite}
@keyframes marquee-scroll{to{transform:translateX(-16px)}}
.caption{position:absolute;left:50%;transform:translateX(-50%);bottom:22px;color:#2b2b2b;font-weight:600;background:rgba(255,255,255,.75);padding:8px 14px;border-radius:10px}

/* ===== Lesson Content ===== */
.lesson-content {
    background: #2874a6;
    color: #fff;
    padding: 40px 20px;
    font-family: Arial, sans-serif;
    line-height: 1.6;
}

.container {
    max-width: 800px;
    margin: 0 auto;
}

h1, h2, h3 {
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    margin: 20px 0 10px 0;
}

p {
    color: #fff;
    font-size: 16px;
    margin: 10px 0;
}

pre {
    background: #1a1a1a;
    padding: 15px;
    border-radius: 5px;
    overflow-x: auto;
    color: #fff;
    font-size: 14px;
}

code {
    color: #fff;
    font-size: 14px;
}

.example-section {
    margin: 40px 0;
    padding: 30px;
    background: #1a1a1a;
    border-radius: 10px;
}

.demo-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    min-height: 500px;
    background: linear-gradient(to bottom, #87CEEB 0%, #b0d9f5 60%, #d4d4d4 100%);
    border-radius: 10px;
    position: relative;
    margin-top: 20px;
    overflow: hidden;
}

.button-container {
    margin-top: 30px;
    margin-bottom: 30px;
    z-index: 10;
}

button {
    background-color: #e74c3c;
    color: white;
    padding: 25px 50px;
    font-size: 24px;
    font-weight: bold;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    box-shadow: 0 6px 12px rgba(0,0,0,0.3);
    transition: all 0.3s ease;
    text-transform: uppercase;
}

button:hover {
    background-color: #c0392b;
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.4);
}

button:active {
    transform: translateY(0);
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}

#walkContainer {
    opacity: 0;
    transition: all 1s ease;
    z-index: 5;
    position: absolute;
    bottom: 0;
    width: 100%;
}

#walkContainer.show {
    opacity: 1;
}

.sidewalk-demo {
    position: relative;
    width: 100%;
    height: 200px;
    background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 0 30px;
    box-shadow: 0 -10px 30px rgba(0,0,0,0.3);
}

.star-tile {
    position: relative;
    width: 100px;
    height: 120px;
    background: linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%);
    border: 3px solid #8b7355;
    border-radius: 3px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 
        inset 0 1px 3px rgba(255,255,255,0.3),
        inset 0 -1px 3px rgba(0,0,0,0.3),
        0 5px 10px rgba(0,0,0,0.3);
    animation: tileAppear 0.8s ease backwards;
}

.star-tile:nth-child(1) { animation-delay: 0.2s; }
.star-tile:nth-child(2) { animation-delay: 0.4s; }
.star-tile:nth-child(3) { animation-delay: 0.6s; }
.star-tile:nth-child(4) { animation-delay: 0.8s; }

.star-shape {
    font-size: 40px;
    color: #c71585;
    text-shadow: 
        1px 1px 2px rgba(0,0,0,0.3),
        0 0 5px rgba(199,21,133,0.5);
    margin-bottom: 5px;
}

.star-name {
    font-size: 9px;
    font-weight: 900;
    color: #2a2a2a;
    text-align: center;
    font-family: 'Arial', sans-serif;
    letter-spacing: 1px;
    line-height: 1.2;
    padding: 0 5px;
}

.person {
    position: absolute;
    bottom: 200px;
    width: 30px;
    animation: walk 8s linear infinite;
}

.person1 {
    left: -50px;
    animation-delay: 0s;
}

.person2 {
    left: -50px;
    animation-delay: 3s;
}

.person3 {
    left: -50px;
    animation-delay: 6s;
}

.person-body {
    width: 20px;
    height: 35px;
    background: #ff6b6b;
    border-radius: 5px 5px 0 0;
    margin: 0 auto;
}

.person-head {
    width: 15px;
    height: 15px;
    background: #ffcba4;
    border-radius: 50%;
    margin: 0 auto 2px;
}

.person-legs {
    display: flex;
    justify-content: center;
    gap: 3px;
}

.leg {
    width: 6px;
    height: 20px;
    background: #4a4a4a;
    animation: legWalk 0.6s ease-in-out infinite;
}

.leg:nth-child(2) {
    animation-delay: 0.3s;
}

@keyframes walk {
    from {
        left: -50px;
    }
    to {
        left: 100%;
    }
}

@keyframes legWalk {
    0%, 100% {
        transform: rotate(0deg);
    }
    50% {
        transform: rotate(20deg);
    }
}

@keyframes tileAppear {
    from {
        opacity: 0;
        transform: translateY(50px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.buildings {
    position: absolute;
    bottom: 200px;
    width: 100%;
    height: 150px;
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    padding: 0 20px;
}

.building {
    background: linear-gradient(to bottom, #6a6a6a 0%, #4a4a4a 100%);
    border-radius: 5px 5px 0 0;
    position: relative;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.building1 {
    width: 60px;
    height: 100px;
}

.building2 {
    width: 50px;
    height: 120px;
}

.building3 {
    width: 70px;
    height: 90px;
}

.building4 {
    width: 55px;
    height: 110px;
}
</style>
</head>
<body>
<!-- Truck intro -->
<div class="intro" id="intro">
  <div class="loop-wrapper" role="img" aria-label="Driving along Sunset Boulevard to the Walk of Fame">
    <div class="mountain"></div>
    <div class="hill"></div>
    <div class="tree"></div><div class="tree"></div><div class="tree"></div>
    <div class="rock"></div>
    <div class="truck"></div>
    <div class="wheels"></div>
  </div>
  <p>Rolling into Hollywood Boulevard…</p>
</div>

<!-- Scene -->
<main class="scene hidden" id="scene">
  <div class="chinese-theatre">
    <div class="theatre-roof"></div>
    <div class="theatre-body"><div class="theatre-pillars">
      <div class="pillar"></div><div class="pillar"></div><div class="pillar"></div>
    </div></div>
  </div>
  <div class="capitol-records">
    <div class="capitol-top"></div>
    <div class="capitol-base">
      <div class="capitol-ring"></div><div class="capitol-ring"></div>
      <div class="capitol-ring"></div><div class="capitol-ring"></div>
    </div>
  </div>
  <div class="dolby-theatre">
    <div class="dolby-marquee"><div class="marquee-lights"></div></div>
    <div class="dolby-body"></div>
  </div>
  <div class="sidewalk"></div>
  <div class="star s1"></div><div class="star s2"></div><div class="star s3"></div><div class="star s4"></div>
  <div class="caption">⭐ Hollywood Walk of Fame — stars & landmarks</div>
</main>

<!-- Lesson Content -->
<div class="lesson-content hidden" id="lessonContent">
<div class="container">
<h1>Los Angeles</h1>
<h2>Hollywood Walk of Fame Button Lesson</h2>

<h3>Step 1: Set Up Your HTML File</h3>
<p>First, create a new file and save it as button.html. Every HTML file needs this basic structure:</p>
<pre><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;My Button&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;

&lt;/body&gt;
&lt;/html&gt;</code></pre>

<p>What this means:</p>
<p>&lt;!DOCTYPE html&gt; tells the browser this is an HTML file</p>
<p>&lt;html&gt; wraps everything</p>
<p>&lt;head&gt; contains information about the page</p>
<p>&lt;body&gt; is where your visible content goes</p>

<h3>Step 2: Create Your First Button</h3>
<p>Inside the &lt;body&gt; tags, add a button:</p>
<pre><code>&lt;body&gt;
    &lt;button&gt;Click Me!&lt;/button&gt;
&lt;/body&gt;</code></pre>

<h3>Step 3: Make the Button Do Something</h3>
<p>Add an onclick attribute to make something happen when clicked:</p>
<pre><code>&lt;button onclick="alert('Hello!')"&gt;Click Me!&lt;/button&gt;</code></pre>

<div class="example-section">
    <h3>Here's an example button!</h3>
    <div class="demo-container">
        <div class="button-container">
            <button onclick="generateWalk()">Click for Walk of Fame</button>
        </div>
        <div id="walkContainer">
            <div class="buildings">
                <div class="building building1"></div>
                <div class="building building2"></div>
                <div class="building building3"></div>
                <div class="building building4"></div>
            </div>
            <div class="person person1">
                <div class="person-head"></div>
                <div class="person-body"></div>
                <div class="person-legs">
                    <div class="leg"></div>
                    <div class="leg"></div>
                </div>
            </div>
            <div class="person person2">
                <div class="person-head"></div>
                <div class="person-body"></div>
                <div class="person-legs">
                    <div class="leg"></div>
                    <div class="leg"></div>
                </div>
            </div>
            <div class="person person3">
                <div class="person-head"></div>
                <div class="person-body"></div>
                <div class="person-legs">
                    <div class="leg"></div>
                    <div class="leg"></div>
                </div>
            </div>
            <div class="sidewalk-demo">
                <div class="star-tile">
                    <div class="star-shape">★</div>
                    <div class="star-name">MARILYN<br>MONROE</div>
                </div>
                <div class="star-tile">
                    <div class="star-shape">★</div>
                    <div class="star-name">CHARLIE<br>CHAPLIN</div>
                </div>
                <div class="star-tile">
                    <div class="star-shape">★</div>
                    <div class="star-name">ELVIS<br>PRESLEY</div>
                </div>
                <div class="star-tile">
                    <div class="star-shape">★</div>
                    <div class="star-name">MICHAEL<br>JACKSON</div>
                </div>
            </div>
        </div>
    </div>
</div>

<h2>Button Design Tips</h2>

<h3>What is a Button?</h3>
<p>A button triggers an action when clicked. Think of the Hollywood Walk of Fame stars—each one catches your attention and invites interaction. Good buttons work the same way.</p>

<h3>The 3 Button States</h3>
<p><strong>Default (Star on Sidewalk)</strong> - How it looks normally—waiting to be clicked.</p>
<p><strong>Hover (Star Shining)</strong> - When you move your mouse over it—shows it's interactive.</p>
<p><strong>Clicked (Camera Flash)</strong> - The moment you click—confirms the action.</p>

<h3>5 Design Tips</h3>

<p><strong>1. Make it Bold</strong></p>
<p>Like the gold stars on gray concrete—easy to see. Use size and contrast.</p>

<p><strong>2. Use Clear Labels</strong></p>
<p>Each star has a name—your button should be clear too. "Get Tickets" not "Click Here". "See Stars" not "Submit".</p>

<p><strong>3. Show it's Clickable</strong></p>
<p>Stars stand out from the sidewalk. Add rounded corners or shadows. Use hover effects.</p>

<p><strong>4. Create Contrast</strong></p>
<p>Gold against gray—maximum visibility. Button color should pop from the background.</p>

<p><strong>5. Size Matters</strong></p>
<p>Big enough to see and click easily. At least 44x44px on mobile.</p>

<h3>Button Types</h3>
<p><strong>Primary:</strong> Most important action (the famous stars)</p>
<p><strong>Secondary:</strong> Supporting actions (building entrances)</p>
<p><strong>Tertiary:</strong> Minor actions (street signs)</p>

<h3>Common Mistakes</h3>
<p>1. Vague labels like "Click" or "Submit"</p>
<p>2. No hover effect</p>
<p>3. Too many bold buttons</p>
<p>4. Too small to tap</p>
<p>5. Unclear what happens when clicked</p>

<h3>Quick Tips</h3>
<p>- Use action verbs: "Explore," "Find," "Visit"</p>
<p>- One primary button per section</p>
<p>- Make it look clickable</p>
<p>- Test on mobile</p>
</div>
</div>

<section class="quiz-section">
  <h2>🧠 Quick Quiz: Build Your Own Button!</h2>
  <p>Fill in the blanks to complete your HTML file. If you get both right, your button will appear!</p>

  <form id="button-quiz">
    <!-- Question 1 -->
    <label for="q1">
      1️⃣ Every HTML file starts with this declaration: <br>
      <code>&lt;!________ html&gt;</code>
    </label><br>
    <input type="text" id="q1" placeholder="Type your answer here"><br><br>

    <!-- Question 2 -->
    <label for="q2">
      2️⃣ Add the missing part to make your button show an alert when clicked: <br>
      <code>&lt;button ________="alert('Hello!')"&gt;Click Me!&lt;/button&gt;</code>
    </label><br>
    <input type="text" id="q2" placeholder="Type your answer here"><br><br>

    <button type="button" onclick="checkAnswers()">Check Answers</button>
  </form>

  <div id="quiz-result"></div>
  <div id="button-demo"></div>

  <script>
    function checkAnswers() {
      const a1 = document.getElementById("q1").value.trim().toLowerCase();
      const a2 = document.getElementById("q2").value.trim().toLowerCase();
      const result = document.getElementById("quiz-result");
      const demo = document.getElementById("button-demo");
      demo.innerHTML = "";
      let score = 0;

      if (a1 === "doctype") score++;
      if (a2 === "onclick") score++;

      result.textContent = "✅ You got " + score + "/2 correct!";

      if (score === 2) {
        demo.innerHTML = `
          <p>🎉 Great job! Here's your working button:</p>
          <button onclick="alert('Hello!')">Click Me!</button>
        `;
      }
    }
  </script>
</section>

<script>
setTimeout(()=>{
  document.getElementById('intro').classList.add('hidden');
  document.getElementById('scene').classList.remove('hidden');
  document.body.style.background='linear-gradient(#87CEEB,#B0D4E3)';
  
  // Show lesson content after another delay
  setTimeout(()=>{
    document.getElementById('lessonContent').classList.remove('hidden');
  }, 2000);
}, 8000);

function generateWalk() {
    var walkContainer = document.getElementById('walkContainer');
    walkContainer.classList.remove('show');
    setTimeout(function() {
        walkContainer.classList.add('show');
    }, 50);
}
</script>
</body>
</html>