---
layout: post
title: "Balboa Park"
description: 
permalink: /west-coast/travel/sd/balboapark/
date: 2025-10-21
---

<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Balboa Park — San Diego Roadtrip</title>
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
.intro{position:fixed;inset:0;display:grid;place-items:center;background:#009688;z-index:10}
.intro p{color:#fff;font-weight:800;margin-top:18px;text-shadow:0 2px 12px rgba(0,0,0,.35)}

/* ===== Main Content ===== */
.hidden{display:none}
body{background:#001f3f}
.container{width:min(1200px,95vw);height:min(700px,90vh);border-radius:20px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.5);position:relative;margin:40px auto}
.balboa-scene{background:linear-gradient(180deg,#87CEEB 0%,#FFE4B5 70%,#DEB887 100%);width:100%;height:100%;position:relative}
.sun{position:absolute;top:8%;right:12%;width:80px;height:80px;background:radial-gradient(circle at 35% 35%,#fff59d,#ffd54f);border-radius:50%;box-shadow:0 0 60px rgba(255,213,79,.5)}
.botanical{position:absolute;bottom:40%;left:50%;transform:translateX(-50%);width:400px;height:220px}
.dome-building{width:180px;height:140px;background:linear-gradient(135deg,#f5deb3,#daa520);border:4px solid #b8860b;border-radius:12px;position:absolute;bottom:0;left:50%;transform:translateX(-50%);box-shadow:0 10px 30px rgba(0,0,0,.25)}
.dome{width:120px;height:90px;background:linear-gradient(135deg,#4682b4,#5f9ea0);border:4px solid #36648b;border-radius:50% 50% 0 0;position:absolute;top:-80px;left:50%;transform:translateX(-50%);overflow:hidden}
.dome-panel{position:absolute;width:8px;height:100%;background:rgba(255,255,255,.2);left:var(--x)}
.arch{width:60px;height:90px;border:6px solid #b8860b;border-radius:50% 50% 0 0;position:absolute;bottom:0;left:50%;transform:translateX(-50%);background:rgba(139,69,19,.2)}
.tower{width:50px;height:180px;background:linear-gradient(135deg,#f5deb3,#daa520);border:4px solid #b8860b;border-radius:8px 8px 0 0;position:absolute;bottom:0}
.tower.left{left:-120px}
.tower.right{right:-120px}
.tower-top{width:70px;height:40px;background:linear-gradient(135deg,#cd853f,#8b4513);border:3px solid #654321;border-radius:50% 50% 0 0;position:absolute;top:-35px;left:50%;transform:translateX(-50%)}
.balboa-garden{position:absolute;bottom:0;left:0;right:0;height:40%;background:linear-gradient(180deg,#90EE90 0%,#3cb371 100%)}
.flower{position:absolute;bottom:40%;width:30px;height:30px;animation:bloom 3s ease-in-out infinite}
.flower-center{width:12px;height:12px;background:#ffd700;border-radius:50%;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:2}
.petal{width:14px;height:14px;border-radius:50%;position:absolute;top:50%;left:50%}
.p1{background:#ff69b4;transform:translate(-50%,-100%)}
.p2{background:#ff1493;transform:translate(0%,-50%)}
.p3{background:#ff69b4;transform:translate(-50%,0%)}
.p4{background:#ff1493;transform:translate(-100%,-50%)}
.flower.f1{left:15%;animation-delay:0s}
.flower.f2{left:35%;animation-delay:.5s}
.flower.f3{left:55%;animation-delay:1s}
.flower.f4{left:75%;animation-delay:1.5s}
.flower.f2 .petal{background:#9370db}
.flower.f2 .p2,.flower.f2 .p4{background:#8a2be2}
.flower.f3 .petal{background:#ffa500}
.flower.f3 .p2,.flower.f3 .p4{background:#ff8c00}
.flower.f4 .petal{background:#ff4500}
.flower.f4 .p2,.flower.f4 .p4{background:#ff6347}
@keyframes bloom{0%,100%{transform:scale(1)}50%{transform:scale(1.2)}}
.butterfly{position:absolute;width:24px;height:20px;top:35%;left:-40px;animation:flyButterfly 15s linear infinite}
.butterfly-wing{width:12px;height:16px;background:radial-gradient(circle at 30% 30%,#ff69b4,#ff1493);border-radius:50% 50% 50% 0;position:absolute;top:0}
.butterfly-wing.left{left:0;animation:wingLeft .3s ease-in-out infinite}
.butterfly-wing.right{right:0;transform:scaleX(-1);animation:wingRight .3s ease-in-out infinite}
.butterfly-body{width:3px;height:18px;background:#333;position:absolute;left:50%;transform:translateX(-50%);border-radius:3px}
@keyframes flyButterfly{to{left:110%;top:30%}}
@keyframes wingLeft{0%,100%{transform:rotateY(0deg)}50%{transform:rotateY(-25deg)}}
@keyframes wingRight{0%,100%{transform:scaleX(-1) rotateY(0deg)}50%{transform:scaleX(-1) rotateY(-25deg)}}
.label{position:absolute;top:20px;left:20px;background:rgba(255,255,255,.95);padding:12px 24px;border-radius:12px;font-weight:700;font-size:20px;color:#005f73;box-shadow:0 8px 20px rgba(0,0,0,.3)}

/* ===== Lesson Content ===== */
.lesson-content{background:#001f3f;color:#fff;padding:40px 20px;font-family:Arial,sans-serif;line-height:1.6}
.lesson-container{max-width:1200px;margin:0 auto;background:#001f3f;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,.5);padding:40px}
h1,h2,h3{color:#fff;margin:20px 0 10px 0}
h1{font-size:32px}
h2{font-size:24px}
h3{font-size:20px}
p{color:#fff;font-size:16px;margin:10px 0}
pre{background:#003366;padding:15px;border-radius:8px;overflow-x:auto;margin:15px 0}
code{color:#fff;font-size:14px;font-family:'Courier New',monospace}
.example-section{background:#003366;padding:25px;border-radius:12px;margin-top:30px;border-left:4px solid #0066cc}
.example-section h2{color:#fff}
.example-section p{color:#fff}
.example-section audio{width:100%;margin:20px 0}
.source-text{font-style:italic;color:#ccc;font-size:14px}
</style>
</head>
<body class="loading">
<!-- Truck intro -->
<div class="intro" id="intro">
<div class="loop-wrapper" role="img" aria-label="Driving through teal hills toward Balboa Park">
<div class="mountain"></div>
<div class="hill"></div>
<div class="tree"></div><div class="tree"></div><div class="tree"></div>
<div class="rock"></div>
<div class="truck"></div>
<div class="wheels"></div>
</div>
<p>Cruising to Balboa Park, San Diego…</p>
</div>

<!-- Scene -->
<main class="hidden" id="scene">
<div class="container">
<div class="balboa-scene">
<div class="label">🏛️ Balboa Park</div>
<div class="sun"></div>
<div class="botanical">
<div class="tower left">
<div class="tower-top"></div>
</div>
<div class="dome-building">
<div class="dome">
<div class="dome-panel" style="--x:20px"></div>
<div class="dome-panel" style="--x:40px"></div>
<div class="dome-panel" style="--x:60px"></div>
<div class="dome-panel" style="--x:80px"></div>
<div class="dome-panel" style="--x:100px"></div>
</div>
<div class="arch"></div>
</div>
<div class="tower right">
<div class="tower-top"></div>
</div>
</div>
<div class="flower f1">
<div class="petal p1"></div>
<div class="petal p2"></div>
<div class="petal p3"></div>
<div class="petal p4"></div>
<div class="flower-center"></div>
</div>
<div class="flower f2">
<div class="petal p1"></div>
<div class="petal p2"></div>
<div class="petal p3"></div>
<div class="petal p4"></div>
<div class="flower-center"></div>
</div>
<div class="flower f3">
<div class="petal p1"></div>
<div class="petal p2"></div>
<div class="petal p3"></div>
<div class="petal p4"></div>
<div class="flower-center"></div>
</div>
<div class="flower f4">
<div class="petal p1"></div>
<div class="petal p2"></div>
<div class="petal p3"></div>
<div class="petal p4"></div>
<div class="flower-center"></div>
</div>
<div class="butterfly">
<div class="butterfly-wing left"></div>
<div class="butterfly-body"></div>
<div class="butterfly-wing right"></div>
</div>
<div class="balboa-garden"></div>
</div>
</div>
</main>

<!-- Lesson Content -->
<div class="lesson-content hidden" id="lessonContent">
<div class="lesson-container">
<h1>Balboa Park Organ Audio Lesson</h1>
<h2>Adding Audio to a Webpage</h2>
<p>Learn how to add and control audio using HTML with sounds from Balboa Park's historic Spreckels Organ Pavilion</p>

<h3>1. What It Does</h3>
<p>Use the &lt;audio&gt; tag to play clips (music, nature, narration) directly in the browser.</p>

<h3>2. Prepare Files</h3>
<p>Save audio files like:</p>
<pre><code>/audio/balboa-organ.mp3
/audio/organ-performance.mp3
/audio/spreckels-pavilion.mp3
/audio/organ-concert.mp3</code></pre>

<h3>3. Basic Structure</h3>
<p>Each section should include a heading, a short description, and an audio player.</p>
<pre><code>&lt;audio controls&gt;
  &lt;source src="path/to/audio.mp3" type="audio/mpeg"&gt;
 
&lt;/audio&gt;</code></pre>

<div class="example-section">
<h2>Audio you will be working with: Balboa Park Organ Pavilion</h2>
<p>Listen to the majestic sounds of the Spreckels Organ — one of the world's largest outdoor pipe organs, filling Balboa Park with rich, powerful tones.</p>
<audio controls>
<source src= "/hacks/west-coast/travel/sandiego/funny-organ-intro-outro-5008.mp3" type="audio/mpeg">

</audio>
<p class="source-text">Source: Organ performance and classical music</p>
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
  <h1>🎵 Build Your Audio Player</h1>
  <p class="subtitle">Fill in the blanks to create a working audio player!</p>
  
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
        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg">
      </audio>
    </div>
    <p style="margin-top: 25px;">You've successfully created an audio player!</p>
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