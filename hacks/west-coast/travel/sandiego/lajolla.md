---
layout: post
title: "La Jolla Shores"
description: 
permalink: /west-coast/travel/sd/lajolla/
date: 2025-10-21
---
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>La Jolla Beach — San Diego Roadtrip</title>
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

.lajolla-scene {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #87CEEB 0%, #5fa3d0 50%, #4a90c4 100%);
  position: relative;
}

.beach-sun {
  position: absolute;
  top: 10%;
  right: 15%;
  width: 90px;
  height: 90px;
  background: radial-gradient(circle at 35% 35%, #fff8dc, #ffdb58);
  border-radius: 50%;
  box-shadow: 0 0 80px rgba(255,219,88,.6);
  animation: sunGlow 4s ease-in-out infinite;
}

@keyframes sunGlow {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.9; }
}

.ocean-water {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 55%;
  background: linear-gradient(180deg, #4682b4 0%, #1e90ff 50%, #0066cc 100%);
}

.wave-motion {
  position: absolute;
  width: 150%;
  height: 60px;
  background: transparent;
  top: -30px;
  left: -25%;
}

.wave-line {
  position: absolute;
  width: 100%;
  height: 30px;
  background: radial-gradient(ellipse at 50% 100%, rgba(255,255,255,.6), transparent 70%);
  animation: waveMove 8s ease-in-out infinite;
}

.wave-line.w2 {
  top: 20px;
  animation-delay: 1s;
  opacity: 0.5;
}

.wave-line.w3 {
  top: 40px;
  animation-delay: 2s;
  opacity: 0.3;
}

@keyframes waveMove {
  0%, 100% { transform: translateX(-5%); }
  50% { transform: translateX(5%); }
}

.sand {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30%;
  background: linear-gradient(180deg, #f4a460 0%, #daa520 100%);
}

.seal {
  position: absolute;
  bottom: 30%;
  left: 20%;
  width: 70px;
  height: 50px;
  animation: sealBob 3s ease-in-out infinite;
}

.seal-body {
  width: 60px;
  height: 45px;
  background: linear-gradient(135deg, #696969, #505050);
  border-radius: 50% 50% 50% 40%;
  position: relative;
  border: 2px solid #404040;
}

.seal-head {
  width: 35px;
  height: 35px;
  background: radial-gradient(circle at 40% 40%, #696969, #505050);
  border-radius: 50%;
  position: absolute;
  top: -5px;
  left: -20px;
  border: 2px solid #404040;
}

.seal-nose {
  width: 8px;
  height: 6px;
  background: #333;
  border-radius: 50%;
  position: absolute;
  left: 2px;
  top: 18px;
}

.seal-whisker {
  width: 12px;
  height: 1px;
  background: #fff;
  position: absolute;
  left: 10px;
}

.w1 { top: 16px; }
.w2 { top: 20px; }

.seal-flipper {
  width: 20px;
  height: 12px;
  background: #505050;
  border-radius: 50%;
  position: absolute;
  bottom: 5px;
  right: -8px;
  border: 2px solid #404040;
  transform: rotate(-20deg);
}

@keyframes sealBob {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(-5deg); }
}

.surfer {
  position: absolute;
  bottom: 40%;
  right: 25%;
  width: 50px;
  height: 70px;
  animation: surf 5s ease-in-out infinite;
}

.surfboard {
  width: 60px;
  height: 15px;
  background: linear-gradient(135deg, #ff6b6b, #ff4757);
  border-radius: 50%;
  position: absolute;
  bottom: 0;
  left: -5px;
  border: 2px solid #c23616;
  box-shadow: 0 4px 8px rgba(0,0,0,.3);
}

.surfer-body {
  width: 30px;
  height: 35px;
  background: linear-gradient(135deg, #4a90e2, #357abd);
  border-radius: 8px;
  position: absolute;
  bottom: 15px;
  left: 10px;
  border: 2px solid #2e5f8a;
}

.surfer-head {
  width: 24px;
  height: 24px;
  background: radial-gradient(circle at 40% 30%, #ffd4a3, #e6b88a);
  border-radius: 50%;
  position: absolute;
  top: -22px;
  left: 3px;
  border: 2px solid #cc9966;
}

.surfer-arm {
  width: 20px;
  height: 8px;
  background: #4a90e2;
  border-radius: 4px;
  position: absolute;
  top: 5px;
  border: 1px solid #2e5f8a;
}

.surfer-arm.left {
  left: -15px;
  transform: rotate(-45deg);
}

.surfer-arm.right {
  right: -15px;
  transform: rotate(45deg);
}

@keyframes surf {
  0%, 100% { transform: translateY(0) rotate(-5deg); }
  50% { transform: translateY(-15px) rotate(-8deg); }
}

.seagull {
  position: absolute;
  width: 35px;
  height: 15px;
  top: 20%;
  left: -60px;
  animation: seagullFly 18s linear infinite;
}

.seagull:before,
.seagull:after {
  content: "";
  position: absolute;
  width: 18px;
  height: 10px;
  background: transparent;
  border-top: 3px solid rgba(255,255,255,.95);
  border-radius: 50%;
}

.seagull:before {
  left: 0;
  animation: gullFlapL 0.6s ease-in-out infinite;
}

.seagull:after {
  right: 0;
  animation: gullFlapR 0.6s ease-in-out infinite;
}

@keyframes seagullFly {
  to { left: 110%; top: 25%; }
}

@keyframes gullFlapL {
  0%, 100% { transform: rotateX(0deg); }
  50% { transform: rotateX(35deg); }
}

@keyframes gullFlapR {
  0%, 100% { transform: rotateX(0deg); }
  50% { transform: rotateX(-35deg); }
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
<div class="loop-wrapper" role="img" aria-label="Driving through teal hills toward La Jolla Beach">
<div class="mountain"></div>
<div class="hill"></div>
<div class="tree"></div><div class="tree"></div><div class="tree"></div>
<div class="rock"></div>
<div class="truck"></div>
<div class="wheels"></div>
</div>
<p>Cruising to La Jolla Beach, San Diego…</p>
</div>

<!-- Scene -->
<main class="hidden" id="scene">
<div class="animation-wrapper">
  <div class="container">
    <div class="lajolla-scene">
      <div class="beach-sun"></div>
      <div class="ocean-water">
        <div class="wave-motion">
          <div class="wave-line"></div>
          <div class="wave-line w2"></div>
          <div class="wave-line w3"></div>
        </div>
      </div>
      <div class="seal">
        <div class="seal-body">
          <div class="seal-head">
            <div class="seal-nose"></div>
            <div class="seal-whisker w1"></div>
            <div class="seal-whisker w2"></div>
          </div>
          <div class="seal-flipper"></div>
        </div>
      </div>
      <div class="surfer">
        <div class="surfboard"></div>
        <div class="surfer-body">
          <div class="surfer-head"></div>
          <div class="surfer-arm left"></div>
          <div class="surfer-arm right"></div>
        </div>
      </div>
      <div class="seagull"></div>
      <div class="sand"></div>
    </div>
  </div>
</div>
</main>

<!-- Lesson Content -->
<div class="audio-lesson hidden" id="lessonContent">
<div class="audio-container">
  <h1>La Jolla Beach Audio Lesson</h1>
  <h2>Adding Audio to a Webpage</h2>
  <p>Learn how to add and control audio using sounds from La Jolla's beautiful coastline</p>

  <h3>1. What It Does</h3>
  <p>Use the &lt;audio&gt; tag to play clips (ocean waves, seagulls, narration) directly in the browser.</p>

  <h3>2. Prepare Files</h3>
  <p>Save audio files like:</p>
  <pre><code>/audio/ocean-waves.mp3
/audio/seagulls.mp3
/audio/beach-ambience.mp3
/audio/seal-sounds.mp3</code></pre>

  <h3>3. Basic Structure</h3>
  <p>Each section should include a heading, a short description, and an audio player.</p>
  <pre><code>&lt;audio controls&gt;
  &lt;source src="path/to/audio.mp3" type="audio/mpeg"&gt;
&lt;/audio&gt;</code></pre>

  <div class="example-section">
    <h2>Audio you will be working with: La Jolla Beach Sounds</h2>
    <p>
      Listen to the soothing sounds of waves crashing on the shores of La Jolla Beach, accompanied by the calls of seagulls overhead.
    </p>
    <audio controls>
      <source src= "/hacks/west-coast/travel/sandiego/gentle-ocean-waves-3-300839.mp3" type="audio/mpeg">
    </audio>
    <p class="source-text">Source: Ocean waves and beach ambience</p>
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
  <h1>🌊 Build Your Audio Player</h1>
  <p class="subtitle">Fill in the blanks to create a working audio player with La Jolla Beach sounds!</p>
  
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
        <source src="/hacks/west-coast/travel/sandiego/gentle-ocean-waves-3-300839.mp3" type="audio/mpeg">
      </audio>
      <p style="color: #1e3a5f; margin-top: 20px; font-size: 1.1em;">🌊 La Jolla Beach Ocean Waves</p>
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
  position: relative;
  z-index: 1;
}

.question {
  background: rgba(255,255,255,.97);
  padding: 35px;
  border-radius: 16px;
  margin-bottom: 25px;
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
  text-align: center;
  outline: none;
  transition: all 0.3s ease;
  font-weight: 600;
  font-family: 'Courier New', monospace;
}

.fill-blank::placeholder {
  color: #999;
}

.fill-blank:focus {
  border-color: #7ec8ff;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(74,158,255,.15);
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
  position: relative;
  z-index: 1;
}

.check-answers-btn {
  padding: 18px 50px;
  font-size: 1.2em;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #4a9eff, #1e3a5f);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(74,158,255,.4);
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.check-answers-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(74,158,255,.5);
  background: linear-gradient(135deg, #7ec8ff, #4a9eff);
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
    feedback1.className = 'feedback correct show';
    input1.className = 'fill-blank correct';
    question1.className = 'question correct';
    input1.disabled = true;
  } else {
    feedback1.textContent = '✗ Try again! Think about what shows play/pause buttons.';
    feedback1.className = 'feedback incorrect show';
    allCorrect = false;
  }
  
  // Check answer 2 - source
  if (answer2 === 'source') {
    feedback2.textContent = '✓ Perfect! The <source> tag specifies the audio file!';
    feedback2.className = 'feedback correct show';
    input2.className = 'fill-blank correct';
    question2.className = 'question correct';
    input2.disabled = true;
  } else {
    feedback2.textContent = '✗ Not quite! What tag links to the audio file?';
    feedback2.className = 'feedback incorrect show';
    allCorrect = false;
  }
  
  // Check answer 3 - mpeg
  if (answer3 === 'mpeg') {
    feedback3.textContent = '✓ Excellent! MP3 files use "mpeg" as their type!';
    feedback3.className = 'feedback correct show';
    input3.className = 'fill-blank correct';
    question3.className = 'question correct';
    input3.disabled = true;
  } else {
    feedback3.textContent = '✗ Try again! What format type is used for .mp3 files?';
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