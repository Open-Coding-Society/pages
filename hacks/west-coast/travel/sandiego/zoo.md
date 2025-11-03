---
layout: post
title: "San Diego Zoo"
description: 
permalink: /west-coast/travel/sd/sdzoo/
date: 2025-10-21
---
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>San Diego Zoo — San Diego Roadtrip</title>
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

.zoo-scene {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #87CEEB 0%, #90EE90 60%, #8FBC8F 100%);
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
  width: 100px;
  height: 40px;
  top: 12%;
  left: -150px;
  animation: float 25s linear infinite;
}

.cloud:before {
  content: "";
  position: absolute;
  width: 50px;
  height: 50px;
  background: rgba(255,255,255,.85);
  border-radius: 50%;
  top: -20px;
  left: 20px;
}

@keyframes float {
  to { transform: translateX(calc(100vw + 200px)); }
}

.zoo-path {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 25%;
  background: linear-gradient(180deg, #d4a574 0%, #b8926a 100%);
  border-top: 4px solid #9b7b5a;
}

.zoo-trees {
  position: absolute;
  bottom: 25%;
  left: 0;
  right: 0;
  height: 35%;
  background: linear-gradient(180deg, #4a7c4e 0%, #3a6b3f 100%);
  clip-path: polygon(0 100%, 0 60%, 8% 45%, 15% 55%, 22% 40%, 30% 50%, 38% 35%, 46% 45%, 54% 30%, 62% 40%, 70% 35%, 78% 45%, 85% 38%, 92% 50%, 100% 40%, 100% 100%);
}

.zoo-sign {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #8b4513, #654321);
  padding: 16px 32px;
  border-radius: 12px;
  border: 4px solid #5a3a1f;
  box-shadow: 0 10px 24px rgba(0,0,0,.3);
}

.zoo-sign-text {
  color: #ffd700;
  font-weight: 800;
  font-size: 24px;
  letter-spacing: 2px;
  text-shadow: 2px 2px 4px rgba(0,0,0,.5);
}

.animal {
  position: absolute;
  bottom: 28%;
  filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.2));
}

/* Panda */
.panda {
  left: 12%;
  width: 60px;
  height: 70px;
  animation: waddle 4s ease-in-out infinite;
  z-index: 3;
}

.panda-body {
  width: 50px;
  height: 50px;
  background: #fff;
  border-radius: 50%;
  position: relative;
  margin: 0 auto;
  border: 4px solid #000;
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.1);
}

.panda-head {
  width: 40px;
  height: 40px;
  background: #fff;
  border-radius: 50%;
  position: absolute;
  top: -28px;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid #000;
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.1);
}

.panda-ear {
  width: 18px;
  height: 18px;
  background: #000;
  border-radius: 50%;
  position: absolute;
  top: 2px;
}

.panda-ear.left { left: -2px; }
.panda-ear.right { right: -2px; }

.panda-eye {
  width: 14px;
  height: 18px;
  background: #000;
  border-radius: 50%;
  position: absolute;
  top: 12px;
}

.panda-eye.left { left: 6px; }
.panda-eye.right { right: 6px; }

.panda-eye:before {
  content: "";
  width: 6px;
  height: 6px;
  background: #fff;
  border-radius: 50%;
  position: absolute;
  top: 4px;
  left: 4px;
}

@keyframes waddle {
  0%, 100% { transform: translateX(0) rotate(-3deg); }
  50% { transform: translateX(20px) rotate(3deg); }
}

/* Giraffe */
.giraffe {
  right: 15%;
  width: 70px;
  height: 150px;
  animation: nibble 3s ease-in-out infinite;
  z-index: 2;
}

.giraffe-body {
  width: 50px;
  height: 60px;
  background: linear-gradient(135deg, #f4a460, #d2691e);
  border-radius: 40% 40% 50% 50%;
  position: absolute;
  bottom: 30px;
  left: 10px;
  border: 3px solid #8b4513;
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.1);
}

.giraffe-spot {
  width: 12px;
  height: 12px;
  background: #8b4513;
  border-radius: 50%;
  position: absolute;
}

.spot1 { top: 10px; left: 8px; }
.spot2 { top: 20px; right: 12px; }
.spot3 { bottom: 15px; left: 15px; }

.giraffe-neck {
  width: 24px;
  height: 80px;
  background: linear-gradient(90deg, #f4a460, #d2691e);
  position: absolute;
  bottom: 75px;
  left: 32px;
  border-radius: 20px 20px 0 0;
  border: 2px solid #8b4513;
  transform-origin: bottom;
}

.giraffe-head {
  width: 32px;
  height: 36px;
  background: #f4a460;
  border-radius: 50% 50% 40% 40%;
  position: absolute;
  top: -30px;
  left: -4px;
  border: 2px solid #8b4513;
}

.giraffe-horn {
  width: 6px;
  height: 12px;
  background: #8b4513;
  border-radius: 50% 50% 0 0;
  position: absolute;
  top: -8px;
}

.giraffe-horn.left { left: 6px; }
.giraffe-horn.right { right: 6px; }

.giraffe-leg {
  width: 12px;
  height: 30px;
  background: #d2691e;
  position: absolute;
  bottom: 0;
  border-radius: 0 0 4px 4px;
  border: 2px solid #8b4513;
}

.giraffe-leg.fl { left: 12px; }
.giraffe-leg.fr { right: 18px; }

@keyframes nibble {
  0%, 100% { transform: none; }
  50% { transform: translateY(-8px); }
}

/* Lion */
.lion {
  left: 40%;
  width: 80px;
  height: 70px;
  animation: roar 5s ease-in-out infinite;
  z-index: 4;
}

.lion-body {
  width: 60px;
  height: 50px;
  background: linear-gradient(135deg, #daa520, #b8860b);
  border-radius: 40%;
  position: absolute;
  bottom: 0;
  left: 10px;
  border: 3px solid #8b6914;
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.1);
}

.lion-head {
  width: 45px;
  height: 45px;
  background: #daa520;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
  border: 3px solid #8b6914;
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.1);
  z-index: 2;
}

.lion-mane {
  position: absolute;
  width: 70px;
  height: 70px;
  top: -12px;
  left: -13px;
  z-index: 1;
}

.mane-piece {
  width: 18px;
  height: 18px;
  background: #cd853f;
  border-radius: 50%;
  position: absolute;
}

.m1 { top: 0; left: 50%; transform: translateX(-50%); }
.m2 { top: 8px; left: 8px; }
.m3 { top: 8px; right: 8px; }
.m4 { bottom: 8px; left: 0; }
.m5 { bottom: 8px; right: 0; }
.m6 { bottom: 0; left: 50%; transform: translateX(-50%); }

.lion-eye {
  width: 8px;
  height: 8px;
  background: #000;
  border-radius: 50%;
  position: absolute;
  top: 18px;
}

.lion-eye.left { left: 12px; }
.lion-eye.right { right: 12px; }

.lion-nose {
  width: 12px;
  height: 8px;
  background: #8b6914;
  border-radius: 50%;
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
}

@keyframes roar {
  0%, 90%, 100% { transform: scale(1); }
  95% { transform: scale(1.1); }
}

.zoo-bird {
  position: absolute;
  width: 30px;
  height: 12px;
  top: 15%;
  left: -50px;
  animation: flyBird 12s linear infinite;
}

.zoo-bird:before,
.zoo-bird:after {
  content: "";
  position: absolute;
  width: 15px;
  height: 8px;
  background: transparent;
  border-top: 3px solid #333;
  border-radius: 50%;
}

.zoo-bird:before {
  left: 0;
  animation: flapLeft 0.5s ease-in-out infinite;
}

.zoo-bird:after {
  right: 0;
  animation: flapRight 0.5s ease-in-out infinite;
}

@keyframes flyBird {
  to { left: 110%; }
}

@keyframes flapLeft {
  0%, 100% { transform: rotateX(0deg); }
  50% { transform: rotateX(30deg); }
}

@keyframes flapRight {
  0%, 100% { transform: rotateX(0deg); }
  50% { transform: rotateX(-30deg); }
}

/* Audio Lesson Styles */
.audio-lesson {
  font-family: Arial, sans-serif;
  background: #2d5016;
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
<div class="loop-wrapper" role="img" aria-label="Driving through teal hills toward San Diego Zoo">
<div class="mountain"></div>
<div class="hill"></div>
<div class="tree"></div><div class="tree"></div><div class="tree"></div>
<div class="rock"></div>
<div class="truck"></div>
<div class="wheels"></div>
</div>
<p>Heading to the San Diego Zoo…</p>
</div>

<!-- Scene -->
<main class="hidden" id="scene">
<div class="animation-wrapper">
  <div class="container">
    <div class="zoo-scene">
      <div class="sun"></div>
      <div class="cloud"></div>
      
      <div class="zoo-sign">
        <div class="zoo-sign-text">SAN DIEGO ZOO</div>
      </div>
      
      <div class="zoo-trees"></div>
      
      <div class="animal panda">
        <div class="panda-body">
          <div class="panda-head">
            <div class="panda-ear left"></div>
            <div class="panda-ear right"></div>
            <div class="panda-eye left"></div>
            <div class="panda-eye right"></div>
          </div>
        </div>
      </div>
      
      <div class="animal giraffe">
        <div class="giraffe-body">
          <div class="giraffe-spot spot1"></div>
          <div class="giraffe-spot spot2"></div>
          <div class="giraffe-spot spot3"></div>
        </div>
        <div class="giraffe-neck">
          <div class="giraffe-head">
            <div class="giraffe-horn left"></div>
            <div class="giraffe-horn right"></div>
          </div>
        </div>
        <div class="giraffe-leg fl"></div>
        <div class="giraffe-leg fr"></div>
      </div>
      
      <div class="animal lion">
        <div class="lion-mane">
          <div class="mane-piece m1"></div>
          <div class="mane-piece m2"></div>
          <div class="mane-piece m3"></div>
          <div class="mane-piece m4"></div>
          <div class="mane-piece m5"></div>
          <div class="mane-piece m6"></div>
        </div>
        <div class="lion-head">
          <div class="lion-eye left"></div>
          <div class="lion-eye right"></div>
          <div class="lion-nose"></div>
        </div>
        <div class="lion-body"></div>
      </div>
      
      <div class="zoo-bird"></div>
      <div class="zoo-path"></div>
    </div>
  </div>
</div>
</main>

<!-- Lesson Content -->
<div class="audio-lesson hidden" id="lessonContent">
<div class="audio-container">
  <h1>San Diego Zoo Audio Lesson</h1>
  <h2>Adding Audio to a Webpage</h2>
  <p>Learn how to add and control audio using HTML with sounds from the world-famous San Diego Zoo</p>
  
  <h3>1. What It Does</h3>
  <p>Use the &lt;audio&gt; tag to play clips (music, nature, narration) directly in the browser.</p>
  
  <h3>2. Prepare Files</h3>
  <p>Save audio files like:</p>
  <pre><code>/audio/lion-roar.mp3
/audio/zoo-ambience.mp3
/audio/wildlife-sounds.mp3
/audio/safari-park.mp3</code></pre>
  
  <h3>3. Basic Structure</h3>
  <p>Each section should include a heading, a short description, and an audio player.</p>
  <pre><code>&lt;audio controls&gt;
  &lt;source src="path/to/audio.mp3" type="audio/mpeg"&gt;
  
&lt;/audio&gt;</code></pre>
  
  <div class="example-section">
    <h2>Audio you will be working with: San Diego Zoo Lion Roar</h2>
    <p>
      Listen to the powerful roar of the king of the jungle — one of the most iconic sounds from the San Diego Zoo's African savanna exhibit.
    </p>
    <audio controls>
      <source src="/hacks/west-coast/travel/sandiego/tiger-roar-wildlife-sfx-376158.mp3" type="audio/mpeg">
    </audio>
    <p class="source-text">Source: Lion roar and wildlife sounds</p>
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
  <h1>🦁 Build Your Audio Player</h1>
  <p class="subtitle">Fill in the blanks to create a working audio player with San Diego Zoo sounds!</p>
  
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
        <source src="/hacks/west-coast/travel/sandiego/tiger-roar-wildlife-sfx-376158.mp3" type="audio/mpeg">
      </audio>
      <p style="color: #1e3a5f; margin-top: 20px; font-size: 1.1em;">🦁 San Diego Zoo Lion Roar</p>
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
<title>San Diego Zoo Audio Quiz</title>
<style>
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #2d5016 0%, #1a3d1b 100%);
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

.quiz-section {
  padding: 50px 60px;
  background: linear-gradient(135deg, #4a7c4e 0%, #3a6b3f 100%);
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
  color: #2d5016;
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
  border: 3px solid #4a7c4e;
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
  border-color: #2d5016;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(74,124,78,.15);
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

.animal-icon {
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
  <h1>🦁 San Diego Zoo Audio Challenge</h1>
  <p class="subtitle">Fill in the blanks to create a working audio player with wild animal sounds!</p>
  
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
  &lt;<input type="text" class="fill-blank" id="answer2" placeholder="Your answer"> <span class="code-attr">src</span>=<span class="code-value">"lion-roar.mp3"</span>
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
&lt;<span class="code-tag">source</span> <span class="code-attr">src</span>=<span class="code-value">"zoo-sounds.mp3"</span>
   <span class="code-attr">type</span>=<span class="code-value">"audio/<input type="text" class="fill-blank" id="answer3" placeholder="Your answer">"</span>&gt;
      </div>
    </div>
    <div class="feedback" id="feedback3"></div>
  </div>
  
  <div class="check-button-container">
    <button class="check-answers-btn" id="checkBtn">Hear the Roar! 🦁</button>
  </div>
  
  <div class="completion-message" id="completion">
    <h2>🦁 Wild Success!</h2>
    <div class="animal-icon">🎉🦁🐼🦒🎊</div>
    <p style="margin-bottom: 20px;">You've successfully created an audio player for the San Diego Zoo!</p>
    <p style="font-size: 1.2em; font-weight: 600; margin-bottom: 25px;">Here's your working audio player:</p>
    <div class="audio-player">
      <p style="color: #fff; font-weight: 600; margin-bottom: 10px;">🦁 King of the Jungle - Lion Roar</p>
      <audio controls id="finalAudio">
        <source src="/hacks/west-coast/travel/sandiego/tiger-roar-wildlife-sfx-376158.mp3" type="audio/mpeg">
      </audio>
    </div>
    <p style="margin-top: 25px;">The animals are roaring with pride! 🐾</p>
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
    feedback1.textContent = '🦁 Perfect! The controls attribute shows play, pause, and volume buttons!';
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
    feedback2.textContent = '🦒 Great job! The <source> tag specifies the audio file location!';
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
    feedback3.textContent = '🐼 Excellent! audio/mpeg is the correct MIME type for MP3 files!';
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
      this.textContent = '✓ Wild Adventure Complete! 🦁';
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
