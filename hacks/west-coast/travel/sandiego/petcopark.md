---
layout: post
title: "Petco Park"
description: 
permalink: /west-coast/travel/sd/petcopark/
date: 2025-10-21
---
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Petco Park — San Diego Roadtrip</title>
<style>
/* ===== Truck intro (3s) ===== */
body {
  background: #009688;
  font-family: 'Open Sans', sans-serif;
  margin: 0;
  padding: 0;
}
body.loading {
  overflow: hidden;
}
.loop-wrapper {
  margin: 0 auto;
  position: relative;
  display: block;
  width: 600px;
  height: 250px;
  overflow: hidden;
  border-bottom: 3px solid #fff;
  color: #fff;
}
.mountain {
  position: absolute;
  right: -900px;
  bottom: -20px;
  width: 2px;
  height: 2px;
  box-shadow: 
    0 0 0 50px #4DB6AC,
    60px 50px 0 70px #4DB6AC,
    90px 90px 0 50px #4DB6AC,
    250px 250px 0 50px #4DB6AC,
    290px 320px 0 50px #4DB6AC,
    320px 400px 0 50px #4DB6AC;
  transform: rotate(130deg);
  animation: mtn 20s linear infinite;
}
.hill {
  position: absolute;
  right: -900px;
  bottom: -50px;
  width: 400px;
  border-radius: 50%;
  height: 20px;
  box-shadow: 
    0 0 0 50px #4DB6AC,
    -20px 0 0 20px #4DB6AC,
    -90px 0 0 50px #4DB6AC,
    250px 0 0 50px #4DB6AC,
    290px 0 0 50px #4DB6AC,
    620px 0 0 50px #4DB6AC;
  animation: hill 4s 2s linear infinite;
}
.tree, .tree:nth-child(2), .tree:nth-child(3) {
  position: absolute;
  height: 100px; 
  width: 35px;
  bottom: 0;
  background: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/130015/tree.svg) no-repeat;
}
.rock {
  margin-top: -17%;
  height: 2%; 
  width: 2%;
  bottom: -2px;
  border-radius: 20px;
  position: absolute;
  background: #ddd;
}
.truck, .wheels {
  transition: all ease;
  width: 85px;
  margin-right: -60px;
  bottom: 0px;
  right: 50%;
  position: absolute;
  background: #eee;
}
.truck {
  background: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/130015/truck.svg) no-repeat;
  background-size: contain;
  height: 60px;
}
.truck:before {
  content: " ";
  position: absolute;
  width: 25px;
  box-shadow:
    -30px 28px 0 1.5px #fff,
    -35px 18px 0 1.5px #fff;
}
.wheels {
  background: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/130015/wheels.svg) no-repeat;
  height: 15px;
  margin-bottom: 0;
}
.tree { animation: tree 3s 0.000s linear infinite; }
.tree:nth-child(2) { animation: tree2 2s 0.150s linear infinite; }
.tree:nth-child(3) { animation: tree3 8s 0.050s linear infinite; }
.rock { animation: rock 4s -0.530s linear infinite; }
.truck { animation: truck 4s 0.080s ease infinite; }
.wheels { animation: truck 4s 0.001s ease infinite; }
.truck:before { animation: wind 1.5s 0.000s ease infinite; }
@keyframes tree {
  0% { transform: translate(1350px); }
  50% {}
  100% { transform: translate(-50px); }
}
@keyframes tree2 {
  0% { transform: translate(650px); }
  50% {}
  100% { transform: translate(-50px); }
}
@keyframes tree3 {
  0% { transform: translate(2750px); }
  50% {}
  100% { transform: translate(-50px); }
}
@keyframes rock {
  0% { right: -200px; }
  100% { right: 2000px; }
}
@keyframes truck {
  0% { }
  6% { transform: translateY(0px); }
  7% { transform: translateY(-6px); }
  9% { transform: translateY(0px); }
  10% { transform: translateY(-1px); }
  11% { transform: translateY(0px); }
  100% { }
}
@keyframes wind {
  0% { }
  50% { transform: translateY(3px) }
  100% { }
}
@keyframes mtn {
  100% {
    transform: translateX(-2000px) rotate(130deg);
  }
}
@keyframes hill {
  100% {
    transform: translateX(-2000px);
  }
}
.intro {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: #009688;
  z-index: 10;
}
.intro p {
  color: #fff;
  font-weight: 800;
  margin-top: 18px;
  text-shadow: 0 2px 12px rgba(0,0,0,.35);
}

/* ===== Main Content ===== */
.hidden {
  display: none;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: linear-gradient(135deg, #00a8cc, #005f73);
  min-height: 100vh;
}

.animation-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  min-height: 100vh;
}

.container {
  width: min(1200px, 95vw);
  height: min(700px, 90vh);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,.4);
}

.petco-scene {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #87CEEB 0%, #B8E6F5 45%, #2d5016 45%);
  position: relative;
}

.sun {
  position: absolute;
  top: 8%;
  right: 12%;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle at 35% 35%, #fff59d, #ffd54f);
  border-radius: 50%;
  box-shadow: 0 0 60px rgba(255,213,79,.5);
}

.cloud {
  position: absolute;
  background: rgba(255,255,255,.85);
  border-radius: 100px;
  animation: float 25s linear infinite;
}

.cloud.c1 {
  width: 100px;
  height: 40px;
  top: 12%;
  left: -150px;
}

.cloud.c1:before {
  content: "";
  position: absolute;
  width: 50px;
  height: 50px;
  background: rgba(255,255,255,.85);
  border-radius: 50%;
  top: -20px;
  left: 20px;
}

.cloud.c2 {
  width: 80px;
  height: 35px;
  top: 22%;
  left: -200px;
  animation-delay: 8s;
}

@keyframes float {
  to { transform: translateX(calc(100vw + 200px)); }
}

.western-building {
  position: absolute;
  bottom: 45%;
  left: 3%;
  width: 140px;
  height: 180px;
  background: linear-gradient(135deg, #8b7355 0%, #6d5a47 100%);
  border: 3px solid #5a4a3a;
  border-radius: 8px 8px 0 0;
  box-shadow: inset 0 -20px 30px rgba(0,0,0,.2);
}

.western-building:before {
  content: "WESTERN";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(90deg);
  font-size: 22px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 3px;
  text-shadow: 2px 2px 4px rgba(0,0,0,.5);
}

.metal-panels {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent 0px,
    rgba(0,0,0,.1) 1px,
    transparent 2px,
    transparent 20px
  );
}

.scoreboard {
  position: absolute;
  top: 8%;
  left: 50%;
  transform: translateX(-50%);
  width: 280px;
  height: 100px;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border: 4px solid #0f3460;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,.4);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 15px;
}

.team {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.team-name {
  color: #ffd700;
  font-weight: 800;
  font-size: 16px;
  letter-spacing: 1px;
}

.score {
  color: #00ff88;
  font-size: 32px;
  font-weight: 800;
  text-shadow: 0 0 10px #00ff88;
}

.field {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 55%;
  background: radial-gradient(ellipse at 50% 100%, #2d5016 0%, #1e3a0f 100%);
}

.infield {
  position: absolute;
  bottom: 8%;
  left: 50%;
  transform: translateX(-50%);
  width: 320px;
  height: 320px;
  background: #c4a574;
  border-radius: 50%;
  border: 4px solid #a67c52;
  box-shadow: inset 0 -10px 30px rgba(0,0,0,.2);
}

.pitchers-mound {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, #d4b896, #a67c52);
  border-radius: 50%;
  border: 2px solid #8b6f47;
}

.base {
  position: absolute;
  width: 20px;
  height: 20px;
  background: white;
  transform: rotate(45deg);
  box-shadow: 0 4px 8px rgba(0,0,0,.3);
}

.base.first { bottom: 30%; right: 20%; }
.base.second { top: 15%; left: 50%; transform: translateX(-50%) rotate(45deg); }
.base.third { bottom: 30%; left: 20%; }
.base.home { bottom: 5%; left: 50%; transform: translateX(-50%) rotate(45deg); }

.foul-line {
  position: absolute;
  height: 3px;
  background: white;
  bottom: 8%;
}

.foul-line.left {
  left: 20%;
  width: 35%;
  transform-origin: right;
  transform: rotate(-45deg);
}

.foul-line.right {
  right: 20%;
  width: 35%;
  transform-origin: left;
  transform: rotate(45deg);
}

.wall {
  position: absolute;
  bottom: 35%;
  left: 8%;
  right: 8%;
  height: 8px;
  background: #654321;
  border-radius: 50% 50% 0 0;
  box-shadow: 0 -4px 10px rgba(0,0,0,.3);
}

.wall:before {
  content: "PETCO PARK";
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  color: #ffd700;
  font-weight: 800;
  font-size: 18px;
  letter-spacing: 3px;
  text-shadow: 2px 2px 4px rgba(0,0,0,.5);
}

.player {
  position: absolute;
  bottom: 18%;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 80px;
  z-index: 10;
}

.player-head {
  width: 28px;
  height: 28px;
  background: radial-gradient(circle at 40% 30%, #ffd4a3, #e6b88a);
  border-radius: 50%;
  margin: 0 auto 4px;
  border: 2px solid #cc9966;
  position: relative;
}

.helmet {
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  height: 20px;
  background: linear-gradient(135deg, #8b4513, #654321);
  border-radius: 50% 50% 30% 30%;
  border: 2px solid #5a3310;
}

.player-body {
  width: 40px;
  height: 35px;
  background: linear-gradient(135deg, #1a4d2e, #0f3a1f);
  margin: 0 auto;
  border-radius: 8px;
  position: relative;
  border: 2px solid #0a2615;
}

.player-legs {
  display: flex;
  justify-content: space-around;
  padding: 0 8px;
}

.leg {
  width: 12px;
  height: 28px;
  background: #e8e8e8;
  border-radius: 6px;
  border: 2px solid #ccc;
}

.bat {
  position: absolute;
  width: 8px;
  height: 70px;
  background: linear-gradient(180deg, #8b4513, #654321);
  border-radius: 4px;
  top: 15px;
  right: -25px;
  transform-origin: top;
  animation: swing 2s ease-in-out infinite;
  box-shadow: 2px 2px 6px rgba(0,0,0,.4);
}

@keyframes swing {
  0%, 70%, 100% { transform: rotate(-30deg); }
  75% { transform: rotate(120deg); }
}

.baseball {
  position: absolute;
  width: 16px;
  height: 16px;
  background: radial-gradient(circle at 35% 35%, #fff, #e8e8e8);
  border-radius: 50%;
  bottom: 22%;
  left: 48%;
  animation: pitch 2s ease-in-out infinite;
  box-shadow: 0 4px 8px rgba(0,0,0,.3);
  z-index: 5;
}

.baseball:before,
.baseball:after {
  content: "";
  position: absolute;
  width: 12px;
  height: 2px;
  background: #ff0000;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-30deg);
}

.baseball:after {
  transform: translate(-50%, -50%) rotate(30deg);
}

@keyframes pitch {
  0% { bottom: 22%; left: 48%; opacity: 1; transform: scale(1); }
  30% { bottom: 19%; left: 49%; }
  70% { bottom: 19%; left: 50%; opacity: 1; }
  75% { bottom: 50%; left: 60%; transform: scale(1.5); }
  100% { bottom: 80%; left: 80%; opacity: 0; transform: scale(0.5); }
}

.stands {
  position: absolute;
  bottom: 55%;
  left: 8%;
  right: 8%;
  height: 90px;
  background: linear-gradient(180deg, #4a4a6a 0%, #2e2e48 100%);
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  box-shadow: inset 0 -10px 20px rgba(0,0,0,.3);
}

.crowd {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-end;
  padding: 10px;
  gap: 4px;
}

.fan {
  width: 12px;
  height: 18px;
  border-radius: 4px 4px 0 0;
  animation: cheer 1.5s ease-in-out infinite;
}

.fan:nth-child(odd) { background: #ff6b6b; }
.fan:nth-child(even) { background: #4ecdc4; }
.fan:nth-child(3n) { background: #ffd93d; }
.fan:nth-child(4n) { background: #95e1d3; }
.fan:nth-child(5n) { background: #ff9a76; animation-delay: 0.2s; }
.fan:nth-child(7n) { background: #a8e6cf; animation-delay: 0.4s; }
.fan:nth-child(11n) { background: #dda0dd; animation-delay: 0.6s; }

@keyframes cheer {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15) translateY(-3px); }
}

.audio-lesson {
  font-family: Arial, sans-serif;
  background: #2874a6;
  color: #fff;
  margin: 0;
  padding: 40px 20px;
  line-height: 1.6;
  font-size: 16px;
}

.audio-container {
  max-width: 800px;
  margin: 0 auto;
}

.audio-lesson h1, 
.audio-lesson h2, 
.audio-lesson h3 {
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  margin: 20px 0 10px 0;
}

.audio-lesson p {
  color: #fff;
  font-size: 16px;
  margin: 10px 0;
}

.audio-lesson pre {
  background: #1a1a1a;
  padding: 15px;
  border-radius: 5px;
  overflow-x: auto;
  color: #fff;
  font-size: 14px;
}

.audio-lesson code {
  color: #fff;
  font-size: 14px;
}

.example-section {
  margin: 40px 0;
  padding: 30px;
  background: #1a1a1a;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

.example-section h2 {
  color: #ffd700;
  font-size: 20px;
  margin-bottom: 10px;
}

.example-section p {
  color: #e0e0e0;
  font-size: 16px;
  margin-bottom: 20px;
}

audio {
  width: 100%;
  margin: 20px 0;
  border-radius: 8px;
}

.source-text {
  font-size: 14px;
  color: #b0b0b0;
  margin-top: 15px;
}
</style>
</head>
<body class="loading">
<!-- Truck intro -->
<div class="intro" id="intro">
<div class="loop-wrapper" role="img" aria-label="Driving through teal hills toward Petco Park">
<div class="mountain"></div>
<div class="hill"></div>
<div class="tree"></div><div class="tree"></div><div class="tree"></div>
<div class="rock"></div>
<div class="truck"></div>
<div class="wheels"></div>
</div>
<p>Heading to Petco Park, San Diego…</p>
</div>

<!-- Scene -->
<main class="hidden" id="scene">
<div class="animation-wrapper">
  <div class="container">
    <div class="petco-scene">
      <div class="sun"></div>
      <div class="cloud c1"></div>
      <div class="cloud c2"></div>
      
      <div class="scoreboard">
        <div class="team">
          <div class="team-name">PADRES</div>
          <div class="score">3</div>
        </div>
        <div class="team">
          <div class="team-name">AWAY</div>
          <div class="score">2</div>
        </div>
      </div>
      
      <div class="western-building">
        <div class="metal-panels"></div>
      </div>
      
      <div class="stands">
        <div class="crowd">
          <div class="fan"></div><div class="fan"></div><div class="fan"></div><div class="fan"></div>
          <div class="fan"></div><div class="fan"></div><div class="fan"></div><div class="fan"></div>
          <div class="fan"></div><div class="fan"></div><div class="fan"></div><div class="fan"></div>
          <div class="fan"></div><div class="fan"></div><div class="fan"></div><div class="fan"></div>
          <div class="fan"></div><div class="fan"></div><div class="fan"></div><div class="fan"></div>
          <div class="fan"></div><div class="fan"></div><div class="fan"></div><div class="fan"></div>
          <div class="fan"></div><div class="fan"></div><div class="fan"></div><div class="fan"></div>
          <div class="fan"></div><div class="fan"></div><div class="fan"></div><div class="fan"></div>
          <div class="fan"></div><div class="fan"></div><div class="fan"></div><div class="fan"></div>
          <div class="fan"></div><div class="fan"></div><div class="fan"></div><div class="fan"></div>
          <div class="fan"></div><div class="fan"></div><div class="fan"></div><div class="fan"></div>
          <div class="fan"></div><div class="fan"></div><div class="fan"></div><div class="fan"></div>
          <div class="fan"></div><div class="fan"></div><div class="fan"></div><div class="fan"></div>
          <div class="fan"></div><div class="fan"></div><div class="fan"></div><div class="fan"></div>
          <div class="fan"></div><div class="fan"></div><div class="fan"></div><div class="fan"></div>
          <div class="fan"></div><div class="fan"></div><div class="fan"></div><div class="fan"></div>
          <div class="fan"></div><div class="fan"></div><div class="fan"></div><div class="fan"></div>
          <div class="fan"></div><div class="fan"></div><div class="fan"></div><div class="fan"></div>
          <div class="fan"></div><div class="fan"></div><div class="fan"></div><div class="fan"></div>
          <div class="fan"></div><div class="fan"></div><div class="fan"></div><div class="fan"></div>
        </div>
      </div>
      
      <div class="field">
        <div class="wall"></div>
        
        <div class="infield">
          <div class="pitchers-mound"></div>
          <div class="base first"></div>
          <div class="base second"></div>
          <div class="base third"></div>
          <div class="base home"></div>
          <div class="foul-line left"></div>
          <div class="foul-line right"></div>
        </div>
        
        <div class="player">
          <div class="player-head">
            <div class="helmet"></div>
          </div>
          <div class="player-body">
            <div class="bat"></div>
          </div>
          <div class="player-legs">
            <div class="leg"></div>
            <div class="leg"></div>
          </div>
        </div>
        
        <div class="baseball"></div>
      </div>
    </div>
  </div>
</div>
</main>

<!-- Lesson Content -->
<div class="audio-lesson hidden" id="lessonContent">
<div class="audio-container">
  <h1>Petco Park Audio Lesson</h1>
  <h2>Adding Audio to a Webpage</h2>
  <p>Learn how to add and control audio with sounds from San Diego's Petco Park</p>

  <h3>1. What It Does</h3>
  <p>Use the &lt;audio&gt; tag to play clips (music, nature, narration) directly in the browser.</p>

  <h3>2. Prepare Files</h3>
  <p>Save audio files like:</p>
  <pre><code>/audio/petco-park.mp3
/audio/san-diego-zoo.mp3
/audio/balboa-park.mp3
/audio/la-jolla.mp3</code></pre>

  <h3>3. Basic Structure</h3>
  <p>Each section should include a heading, a short description, and an audio player.</p>
  <pre><code>&lt;audio controls&gt;
  &lt;source src="path/to/audio.mp3" type="audio/mpeg"&gt;
 
&lt;/audio&gt;</code></pre>

  <div class="example-section">
    <h2>Audio you will be working with: Petco Park Atmosphere</h2>
    <p>
      Listen to authentic game-day sounds from the Padres' home stadium — cheers, announcers, and that unmistakable Petco Park energy.
    </p>
    <audio controls>
      <source src="/hacks/west-coast/travel/sandiego/applause-cheer-236786.mp3" type="audio/mpeg">
     
    </audio>
    <p class="source-text">Source: Baseball crowd cheer sound effect</p>
  </div>
</div>
</div>

<script>
// Hide intro after 3 seconds
setTimeout(function(){
  document.getElementById('intro').classList.add('hidden');
  document.getElementById('scene').classList.remove('hidden');
  document.getElementById('lessonContent').classList.remove('hidden');
  document.body.classList.remove('loading');
},3000);
</script>
</body>
</html>

<!-- Quiz Section -->
<div class="quiz-section">
  <h1>⚾ Build Your Audio Player</h1>
  <p class="subtitle">Fill in the blanks to create a working audio player with Petco Park sounds!</p>
  
  <div class="question" id="q1">
    <div class="question-number">Question 1 - Audio Tag Opening</div>
    <div class="question-text">
      What attribute do you add to the &lt;audio&gt; tag to show playback controls?
      <div class="code-line">
        <span class="code-tag">&lt;audio</span> 
        <input type="text" class="fill-blank" id="answer1" placeholder="____">
        <span class="code-tag">&gt;</span>
      </div>
    </div>
    <div class="feedback" id="feedback1"></div>
  </div>
  
  <div class="question" id="q2">
    <div class="question-number">Question 2 - Source Tag</div>
    <div class="question-text">
      What tag do you use inside &lt;audio&gt; to specify the audio file?
      <div class="code-line">
        <span class="indent">&lt;</span>
        <input type="text" class="fill-blank" id="answer2" placeholder="____">
        <span class="code-tag"> src="audio.mp3" type="audio/mpeg"&gt;</span>
      </div>
    </div>
    <div class="feedback" id="feedback2"></div>
  </div>
  
  <div class="question" id="q3">
    <div class="question-number">Question 3 - File Type</div>
    <div class="question-text">
      What type value should you use for .mp3 files?
      <div class="code-line">
        <span class="indent code-tag">&lt;source src="audio.mp3" type="audio/</span>
        <input type="text" class="fill-blank" id="answer3" placeholder="____">
        <span class="code-tag">"&gt;</span>
      </div>
    </div>
    <div class="feedback" id="feedback3"></div>
  </div>
  
  <div class="check-button-container">
    <button class="check-answers-btn" id="checkBtn">Build My Audio Player</button>
  </div>
  
  <div class="completion-message" id="completion">
    <h2>🏆 Audio Player Built Successfully!</h2>
    <div class="audio-demo">
      <h3>Your Working Audio Player:</h3>
      <audio controls id="resultAudio">
        <source src="/hacks/west-coast/travel/sandiego/applause-cheer-236786.mp3" type="audio/mpeg">
      </audio>
      <p style="color: #1e3a5f; margin-top: 20px; font-size: 1.1em;">⚾ Petco Park Game Day Atmosphere</p>
    </div>
    <p style="margin-top: 25px;">You've successfully created an audio player using HTML!</p>
    <p style="margin-top: 10px; font-size: 1.1em;">Now you can add audio to any webpage! 🎯</p>
  </div>
</div>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.quiz-section {
  padding: 60px 80px;
  background: linear-gradient(135deg, #1e3a5f 0%, #0d1b2a 100%);
  color: #fff;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Petco Park Audio Quiz</title>
<style>
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #2c5f2d 0%, #1a3d1b 100%);
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

.quiz-section {
  padding: 50px 60px;
  background: linear-gradient(135deg, #2c5f2d 0%, #1a3d1b 100%);
  color: #fff;
  position: relative;
  overflow: hidden;
}

.quiz-section::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  animation: moveGrid 30s linear infinite;
}

@keyframes moveGrid {
  0% { transform: translate(0, 0) rotate(0deg); }
  100% { transform: translate(40px, 40px) rotate(360deg); }
}

.quiz-section h1 {
  font-size: 2.8em;
  background: linear-gradient(135deg, #4a9eff, #7ec8ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 15px;
  text-align: center;
  position: relative;
  z-index: 1;
}

.subtitle {
  color: #a8c5e6;
  text-align: center;
  margin-bottom: 50px;
  font-size: 1.3em;
  font-size: 2.2em;
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
  text-align: center;
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 20px rgba(0,0,0,.3);
}

.subtitle {
  color: #ffd700;
  text-align: center;
  margin-bottom: 35px;
  font-size: 1.1em;
  position: relative;
  z-index: 1;
}

.question {
  background: rgba(255,255,255,.97);
  padding: 35px;
  border-radius: 16px;
  margin-bottom: 25px;
  padding: 28px;
  border-radius: 16px;
  margin-bottom: 20px;
  border: none;
  box-shadow: 0 10px 40px rgba(0,0,0,.25);
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.question:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 50px rgba(0,0,0,.3);
}

.question.correct {
  background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
  border: 3px solid #4caf50;
}

.question-number {
  color: #1e3a5f;
  font-weight: 800;
  font-size: 1.1em;
  margin-bottom: 15px;
  color: #2c5f2d;
  font-weight: 800;
  font-size: 1em;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.question-text {
  color: #333;
  font-size: 1.15em;
  line-height: 1.7;
  margin-bottom: 20px;
  font-weight: 500;
}

.code-line {
  background: #2d3436;
  padding: 20px;
  border-radius: 10px;
  margin: 15px 0;
  font-family: 'Courier New', monospace;
  font-size: 1.1em;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.code-tag {
  color: #7ec8ff;
}

.indent {
  color: #7ec8ff;
  padding-left: 20px;
}

.fill-blank {
  display: inline-block;
  background: #fff;
  border: 3px solid #4a9eff;
  border-radius: 10px;
  padding: 12px 20px;
  color: #333;
  font-size: 1em;
  min-width: 140px;
  font-size: 1em;
  line-height: 1.6;
  margin-bottom: 0;
  font-weight: 500;
}

.code-block {
  background: #2d2d2d;
  padding: 15px;
  border-radius: 8px;
  margin: 15px 0;
  font-family: 'Courier New', monospace;
  color: #f8f8f2;
  font-size: 0.9em;
  overflow-x: auto;
}

.code-tag {
  color: #66d9ef;
}

.code-attr {
  color: #a6e22e;
}

.code-value {
  color: #e6db74;
}

.fill-blank {
  display: block;
  background: #faf8f5;
  border: 3px solid #2c5f2d;
  border-radius: 10px;
  padding: 10px 16px;
  color: #333;
  font-size: 0.95em;
  width: 100%;
  max-width: 200px;
  text-align: center;
  outline: none;
  transition: all 0.3s ease;
  font-weight: 600;
  font-family: 'Courier New', monospace;
  margin-top: 12px;
  box-sizing: border-box;
}

.fill-blank::placeholder {
  color: #999;
}

.fill-blank:focus {
  border-color: #7ec8ff;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(74,158,255,.15);
  border-color: #1a3d1b;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(44,95,45,.15);
  transform: scale(1.05);
}

.fill-blank.correct {
  border-color: #4caf50;
  background: #e8f5e9;
}

.feedback {
  margin-top: 20px;
  padding: 16px 20px;
  border-radius: 10px;
  font-weight: 700;
  display: none;
  font-size: 1.05em;
  margin-top: 15px;
  padding: 14px 18px;
  border-radius: 10px;
  font-weight: 700;
  display: none;
  font-size: 0.95em;
}

.feedback.show {
  display: block;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.feedback.correct {
  background: linear-gradient(135deg, #4caf50, #66bb6a);
  color: white;
  border: none;
  box-shadow: 0 4px 15px rgba(76,175,80,.4);
}

.feedback.incorrect {
  background: linear-gradient(135deg, #ef5350, #e53935);
  color: white;
  border: none;
  box-shadow: 0 4px 15px rgba(239,83,80,.4);
}

.check-button-container {
  text-align: center;
  margin-top: 35px;
  margin-top: 30px;
  position: relative;
  z-index: 1;
}

.check-answers-btn {
  padding: 18px 50px;
  font-size: 1.2em;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #4a9eff, #1e3a5f);
  padding: 16px 45px;
  font-size: 1.1em;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #1a3d1b;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(74,158,255,.4);
  box-shadow: 0 8px 25px rgba(255,215,0,.4);
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.check-answers-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(74,158,255,.5);
  background: linear-gradient(135deg, #7ec8ff, #4a9eff);
  box-shadow: 0 12px 35px rgba(255,215,0,.5);
  background: linear-gradient(135deg, #ffed4e, #ffd700);
}

.check-answers-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.completion-message {
  background: linear-gradient(135deg, #4caf50, #66bb6a);
  padding: 50px;
  border-radius: 18px;
  text-align: center;
  display: none;
  margin-top: 40px;
  padding: 40px;
  border-radius: 18px;
  text-align: center;
  display: none;
  margin-top: 35px;
  box-shadow: 0 20px 60px rgba(76,175,80,.4);
  position: relative;
  z-index: 1;
}

.completion-message.show {
  display: block;
  animation: bounceIn 0.6s ease;
}

@keyframes bounceIn {
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
}

.completion-message h2 {
  color: #ffffff;
  margin-bottom: 35px;
  font-size: 2.3em;
  margin-bottom: 30px;
  font-size: 2em;
  text-shadow: 0 2px 10px rgba(0,0,0,.2);
}

.completion-message p {
  color: #ffffff;
  font-size: 1.25em;
}

.audio-demo {
  background: rgba(255,255,255,0.95);
  padding: 45px 35px;
  border-radius: 15px;
  margin: 30px auto;
  max-width: 600px;
  box-shadow: 0 10px 40px rgba(0,0,0,.2);
}

.audio-demo h3 {
  color: #1e3a5f;
  font-size: 1.5em;
  margin-top: 0;
  margin-bottom: 25px;
}

.audio-demo audio {
  width: 100%;
  border-radius: 10px;
  font-size: 1.1em;
}

.audio-player {
  background: rgba(255,255,255,.1);
  padding: 20px;
  border-radius: 12px;
  margin: 20px auto;
  max-width: 500px;
}

.audio-player audio {
  width: 100%;
  margin-top: 10px;
}

.baseball-icon {
  font-size: 3em;
  margin: 20px 0;
}

@media (max-width: 768px) {
  .quiz-section {
    padding: 40px 20px;
  }
  
  .quiz-section h1 {
    font-size: 2.2em;
  }
  
  .code-line {
    font-size: 0.9em;
  }
  
  .fill-blank {
    min-width: 100px;
  }
}
</style>
    padding: 35px 20px;
  }
  
  .quiz-section h1 {
    font-size: 1.8em;
  }
  
  .subtitle {
    font-size: 1em;
  }
  
  .question {
    padding: 20px;
  }
}
</style>
</head>
<body>

<div class="quiz-section">
  <h1>⚾ Petco Park Audio Challenge</h1>
  <p class="subtitle">Fill in the blanks to create a working audio player with Petco Park game sounds!</p>
  
  <div class="question" id="q1">
    <div class="question-number">Question 1 - Audio Tag Opening</div>
    <div class="question-text">
      What attribute do you add to the &lt;audio&gt; tag to show playback controls?
      <div class="code-block">
&lt;<span class="code-tag">audio</span> <input type="text" class="fill-blank" id="answer1" placeholder="Your answer">&gt;
&lt;/<span class="code-tag">audio</span>&gt;
      </div>
    </div>
    <div class="feedback" id="feedback1"></div>
  </div>
  
  <div class="question" id="q2">
    <div class="question-number">Question 2 - Source Tag</div>
    <div class="question-text">
      What tag do you use inside &lt;audio&gt; to specify the audio file?
      <div class="code-block">
&lt;<span class="code-tag">audio</span> <span class="code-attr">controls</span>&gt;
  &lt;<input type="text" class="fill-blank" id="answer2" placeholder="Your answer"> <span class="code-attr">src</span>=<span class="code-value">"applause-cheer.mp3"</span>
     <span class="code-attr">type</span>=<span class="code-value">"audio/mpeg"</span>&gt;
&lt;/<span class="code-tag">audio</span>&gt;
      </div>
    </div>
    <div class="feedback" id="feedback2"></div>
  </div>
  
  <div class="question" id="q3">
    <div class="question-number">Question 3 - File Type</div>
    <div class="question-text">
      What type value should you use for .mp3 files?
      <div class="code-block">
&lt;<span class="code-tag">source</span> <span class="code-attr">src</span>=<span class="code-value">"petco-park.mp3"</span>
   <span class="code-attr">type</span>=<span class="code-value">"audio/<input type="text" class="fill-blank" id="answer3" placeholder="Your answer">"</span>&gt;
      </div>
    </div>
    <div class="feedback" id="feedback3"></div>
  </div>
  
  <div class="check-button-container">
    <button class="check-answers-btn" id="checkBtn">Play Ball! 🏟️</button>
  </div>
  
  <div class="completion-message" id="completion">
    <h2>⚾ Home Run!</h2>
    <div class="baseball-icon">🎉⚾🎊</div>
    <p style="margin-bottom: 20px;">You've successfully created an audio player for Petco Park!</p>
    <p style="font-size: 1.2em; font-weight: 600; margin-bottom: 25px;">Here's your working audio player:</p>
    <div class="audio-player">
      <p style="color: #fff; font-weight: 600; margin-bottom: 10px;">🏟️ Petco Park Game Day Atmosphere</p>
      <audio controls id="finalAudio">
        <source src="/hacks/west-coast/travel/sandiego/applause-cheer-236786.mp3" type="audio/mpeg">
      </audio>
    </div>
    <p style="margin-top: 25px;">The Padres faithful are cheering you on! 🎊</p>
  </div>
</div>

<script>
document.getElementById('checkBtn').addEventListener('click', function() {
  const input1 = document.getElementById('answer1');
  const input2 = document.getElementById('answer2');
  const input3 = document.getElementById('answer3');
  const feedback1 = document.getElementById('feedback1');
  const feedback2 = document.getElementById('feedback2');
  const feedback3 = document.getElementById('feedback3');
  const question1 = document.getElementById('q1');
  const question2 = document.getElementById('q2');
  const question3 = document.getElementById('q3');
  
  const answer1 = input1.value.trim().toLowerCase();
  const answer2 = input2.value.trim().toLowerCase();
  const answer3 = input3.value.trim().toLowerCase();
  
  let allCorrect = true;
  
  // Check answer 1 - controls
  if (answer1 === 'controls') {
    feedback1.textContent = '✓ Correct! "controls" shows the audio controls!';
  // Check answer 1 - controls attribute
  if (answer1 === 'controls') {
    feedback1.textContent = '⚾ Perfect! The controls attribute shows play, pause, and volume buttons!';
    feedback1.className = 'feedback correct show';
    input1.className = 'fill-blank correct';
    question1.className = 'question correct';
    input1.disabled = true;
  } else {
    feedback1.textContent = '✗ Try again! Think about what shows play/pause buttons.';
    feedback1.textContent = '✗ Not quite! You need to add the "controls" attribute to show playback controls.';
    feedback1.className = 'feedback incorrect show';
    allCorrect = false;
  }
  
  // Check answer 2 - source
  if (answer2 === 'source') {
    feedback2.textContent = '✓ Perfect! The <source> tag specifies the audio file!';
  // Check answer 2 - source tag
  if (answer2 === 'source') {
    feedback2.textContent = '⚾ Great job! The <source> tag specifies the audio file location!';
    feedback2.className = 'feedback correct show';
    input2.className = 'fill-blank correct';
    question2.className = 'question correct';
    input2.disabled = true;
  } else {
    feedback2.textContent = '✗ Not quite! What tag links to the audio file?';
    feedback2.textContent = '✗ Try again! The tag that specifies the audio file is called "source".';
    feedback2.className = 'feedback incorrect show';
    allCorrect = false;
  }
  
  // Check answer 3 - mpeg
  if (answer3 === 'mpeg') {
    feedback3.textContent = '✓ Excellent! MP3 files use "mpeg" as their type!';
  // Check answer 3 - mpeg type
  if (answer3 === 'mpeg') {
    feedback3.textContent = '⚾ Excellent! audio/mpeg is the correct MIME type for MP3 files!';
    feedback3.className = 'feedback correct show';
    input3.className = 'fill-blank correct';
    question3.className = 'question correct';
    input3.disabled = true;
  } else {
    feedback3.textContent = '✗ Try again! What format type is used for .mp3 files?';
    feedback3.textContent = '✗ Not quite! For .mp3 files, use "mpeg" as the type (audio/mpeg).';
    feedback3.className = 'feedback incorrect show';
    allCorrect = false;
  }
  
  // Show completion if all correct
  if (allCorrect) {
    setTimeout(() => {
      const completion = document.getElementById('completion');
      completion.className = 'completion-message show';
      
      // Disable the button
      this.disabled = true;
      this.textContent = '✓ Audio Player Built!';
      this.style.background = 'linear-gradient(135deg, #4caf50, #66bb6a)';
      
      // Scroll to result
      setTimeout(() => {
        completion.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }, 500);
  }
});
</script>
      this.textContent = '✓ Victory at Petco Park! ⚾';
      this.style.background = 'linear-gradient(135deg, #4caf50, #66bb6a)';
      this.style.color = 'white';
      
      // Scroll to completion message
      completion.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 500);
  }
});
</script>

</body>
</html>
