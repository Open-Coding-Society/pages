---
layout: post
title: "San Diego"
description: "Roadtrip through SD and learn UI while you're there!"
permalink: /west-coast/analytics/sandiego/
parent: "Analytics/Admin"
team: "Cool Collaborators"
submodule: 3
author: "Cool Collaborators"
date: 2025-10-21
microblog: true 
footer: 
    previous: /west-coast/analytics/losangeles/
    home: /west-coast/travel/
    next: /west-coast/analytics/sanfrancisco/
---
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>San Diego Roadtrip - Learn HTML Audio</title>
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #1e3a5f;
  color: #fff;
  overflow-x: hidden;
}

/* Intro Screen */
.intro {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #ff6b6b, #ffa500);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: opacity 0.5s ease;
}

.intro.hidden {
  opacity: 0;
  pointer-events: none;
}

.intro h1 {
  font-size: 3.5em;
  color: white;
  text-shadow: 0 4px 20px rgba(0,0,0,0.3);
  margin-bottom: 20px;
  animation: fadeInUp 1s ease;
}

.intro p {
  font-size: 1.5em;
  color: white;
  animation: fadeInUp 1.2s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Main Header */
.main-header {
  background: #2d4a6f;
  padding: 40px 20px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

.main-header h1 {
  color: white;
  font-size: 3em;
  margin-bottom: 10px;
}

.main-header p {
  color: white;
  font-size: 1.3em;
}

/* Location Section */
.location {
  min-height: 100vh;
  padding: 80px 40px;
  background: #1e3a5f;
}

.location:nth-child(odd) {
  background: #1e3a5f;
}

.location:nth-child(even) {
  background: #1e3a5f;
}

.location-header {
  text-align: center;
  margin-bottom: 60px;
}

.location-header h2 {
  font-size: 3.5em;
  color: white;
  margin-bottom: 15px;
}

.location-header p {
  font-size: 1.4em;
  color: white;
}

/* Scene Animations */
.scene-container {
  max-width: 900px;
  margin: 0 auto 80px;
  background: linear-gradient(135deg, #87CEEB, #4A90E2);
  border-radius: 20px;
  padding: 50px;
  box-shadow: 0 15px 50px rgba(0,0,0,0.4);
  min-height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* Balboa Park Scene */
.balboa-scene {
  width: 100%;
  height: 400px;
  position: relative;
}

.sun {
  width: 80px;
  height: 80px;
  background: #FFD700;
  border-radius: 50%;
  position: absolute;
  top: 20px;
  right: 60px;
  box-shadow: 0 0 40px rgba(255, 215, 0, 0.6);
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.botanical {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

.tower {
  width: 60px;
  height: 120px;
  background: #D4A373;
  border-radius: 8px 8px 0 0;
  position: relative;
}

.tower-top {
  width: 70px;
  height: 30px;
  background: #8B4513;
  position: absolute;
  top: -15px;
  left: -5px;
  border-radius: 50% 50% 0 0;
}

.dome-building {
  width: 140px;
  height: 140px;
  background: #D4A373;
  border-radius: 0 0 10px 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dome {
  width: 120px;
  height: 60px;
  background: linear-gradient(180deg, #87CEEB, #6CA8D4);
  border-radius: 60px 60px 0 0;
  position: absolute;
  top: -50px;
  overflow: hidden;
}

.arch {
  width: 60px;
  height: 80px;
  background: transparent;
  border: 8px solid #8B4513;
  border-radius: 30px 30px 0 0;
  position: absolute;
  bottom: 0;
}

.flower {
  position: absolute;
  width: 40px;
  height: 40px;
  bottom: 20px;
}

.f1 { left: 100px; }
.f2 { left: 200px; }
.f3 { right: 100px; }
.f4 { right: 200px; }

.petal {
  width: 15px;
  height: 15px;
  background: #FF69B4;
  border-radius: 50%;
  position: absolute;
  animation: petalSway 2s ease-in-out infinite;
}

.p1 { top: 0; left: 12px; }
.p2 { bottom: 0; left: 12px; }
.p3 { left: 0; top: 12px; }
.p4 { right: 0; top: 12px; }

.flower-center {
  width: 12px;
  height: 12px;
  background: #FFD700;
  border-radius: 50%;
  position: absolute;
  top: 14px;
  left: 14px;
}

@keyframes petalSway {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(5deg); }
}

.balboa-garden {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background: linear-gradient(180deg, #90EE90, #228B22);
  border-radius: 0 0 20px 20px;
}

/* La Jolla Scene */
.lajolla-scene {
  width: 100%;
  height: 400px;
  position: relative;
}

.beach-sun {
  width: 70px;
  height: 70px;
  background: #FFA500;
  border-radius: 50%;
  position: absolute;
  top: 30px;
  right: 80px;
  box-shadow: 0 0 40px rgba(255, 165, 0, 0.6);
  animation: pulse 3s ease-in-out infinite;
}

.ocean-water {
  position: absolute;
  bottom: 100px;
  left: 0;
  width: 100%;
  height: 180px;
  background: linear-gradient(180deg, #1E90FF, #00BFFF);
  overflow: hidden;
}

.wave-line {
  width: 200%;
  height: 20px;
  background: rgba(255,255,255,0.4);
  position: absolute;
  border-radius: 50%;
  animation: wave 4s linear infinite;
}

.w2 {
  animation-delay: -1.3s;
  top: 40px;
}

.w3 {
  animation-delay: -2.6s;
  top: 80px;
}

@keyframes wave {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0%); }
}

.seal {
  position: absolute;
  bottom: 110px;
  left: 150px;
  animation: sealBob 3s ease-in-out infinite;
}

.seal-body {
  width: 60px;
  height: 40px;
  background: #696969;
  border-radius: 50% 50% 30% 30%;
  position: relative;
}

.seal-head {
  width: 35px;
  height: 35px;
  background: #696969;
  border-radius: 50%;
  position: absolute;
  top: -20px;
  left: 10px;
}

.seal-nose {
  width: 8px;
  height: 8px;
  background: #000;
  border-radius: 50%;
  position: absolute;
  bottom: 5px;
  left: 13px;
}

@keyframes sealBob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.sand {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background: linear-gradient(180deg, #F4A460, #DEB887);
  border-radius: 0 0 20px 20px;
}

/* Petco Park Scene */
.petco-scene {
  width: 100%;
  height: 400px;
  position: relative;
}

.field {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 220px;
  background: linear-gradient(180deg, #32CD32, #228B22);
  border-radius: 0 0 20px 20px;
}

.infield {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  height: 150px;
  background: #D2691E;
  border-radius: 50%;
}

.base {
  width: 15px;
  height: 15px;
  background: white;
  position: absolute;
  transform: rotate(45deg);
}

.first { right: -10px; top: 60px; }
.second { top: -10px; left: 60px; }
.third { left: -10px; top: 60px; }
.home { bottom: -10px; left: 60px; }

.scoreboard {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #1e3a5f;
  padding: 15px 30px;
  border-radius: 10px;
  display: flex;
  gap: 40px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.4);
}

.team {
  text-align: center;
  color: white;
}

.team-name {
  font-size: 0.9em;
  font-weight: 600;
  margin-bottom: 5px;
}

.score {
  font-size: 2em;
  font-weight: bold;
  color: #FFD700;
}

.baseball {
  width: 25px;
  height: 25px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 100px;
  left: 200px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  animation: flyBall 2s ease-in-out infinite;
}

@keyframes flyBall {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(100px, -50px); }
}

/* Zoo Scene */
.zoo-scene {
  width: 100%;
  height: 400px;
  position: relative;
}

.zoo-sign {
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: #8B4513;
  padding: 15px 40px;
  border-radius: 15px;
  border: 5px solid #654321;
  box-shadow: 0 4px 15px rgba(0,0,0,0.4);
}

.zoo-sign-text {
  color: #FFD700;
  font-size: 1.5em;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.animal {
  position: absolute;
  bottom: 100px;
}

.panda {
  left: 100px;
}

.panda-body {
  width: 60px;
  height: 70px;
  background: white;
  border-radius: 40%;
  position: relative;
}

.panda-head {
  width: 50px;
  height: 50px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: -35px;
  left: 5px;
}

.panda-ear {
  width: 15px;
  height: 15px;
  background: #000;
  border-radius: 50%;
  position: absolute;
  top: 5px;
}

.panda-ear.left { left: 5px; }
.panda-ear.right { right: 5px; }

.panda-eye {
  width: 12px;
  height: 12px;
  background: #000;
  border-radius: 50%;
  position: absolute;
  top: 20px;
}

.panda-eye.left { left: 10px; }
.panda-eye.right { right: 10px; }

.lion {
  right: 100px;
  animation: lionRoar 4s ease-in-out infinite;
}

.lion-mane {
  width: 80px;
  height: 80px;
  background: #CD853F;
  border-radius: 50%;
  position: relative;
}

.lion-head {
  width: 50px;
  height: 50px;
  background: #DAA520;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.lion-eye {
  width: 8px;
  height: 8px;
  background: #000;
  border-radius: 50%;
  position: absolute;
  top: 15px;
}

.lion-eye.left { left: 12px; }
.lion-eye.right { right: 12px; }

@keyframes lionRoar {
  0%, 90%, 100% { transform: scale(1); }
  95% { transform: scale(1.1); }
}

.zoo-path {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background: linear-gradient(180deg, #90EE90, #228B22);
  border-radius: 0 0 20px 20px;
}

/* Lesson Content */
.lesson-content {
  max-width: 1000px;
  margin: 0 auto 80px;
  background: #2d4a6f;
  border-radius: 20px;
  padding: 60px;
  box-shadow: 0 15px 50px rgba(0,0,0,0.4);
}

.lesson-content h3 {
  color: white;
  font-size: 2.5em;
  margin-bottom: 25px;
}

.lesson-content h4 {
  color: white;
  font-size: 1.6em;
  margin: 35px 0 20px;
}

.lesson-content p {
  font-size: 1.15em;
  line-height: 1.9;
  margin-bottom: 20px;
  color: white;
}

.lesson-content pre {
  background: #0d1b2a;
  color: #f8f8f2;
  padding: 25px;
  border-radius: 12px;
  overflow-x: auto;
  margin: 25px 0;
  font-size: 1em;
}

.lesson-content code {
  font-family: 'Courier New', monospace;
}

.example-section {
  background: #4a6fa5;
  padding: 35px;
  border-radius: 15px;
  margin: 35px 0;
  border: 3px solid #5a7fb5;
}

.example-section h3 {
  color: white;
  font-size: 2em;
  margin-bottom: 20px;
}

.example-section audio {
  width: 100%;
  margin: 25px 0;
}

.source-text {
  font-size: 0.95em;
  color: white;
  font-style: italic;
}

/* Quiz Section */
.quiz-section {
  max-width: 1000px;
  margin: 0 auto 80px;
  background: #2d4a6f;
  border-radius: 20px;
  padding: 60px;
  box-shadow: 0 15px 50px rgba(0,0,0,0.4);
}

.quiz-section h3 {
  color: white;
  font-size: 2.8em;
  text-align: center;
  margin-bottom: 20px;
}

.subtitle {
  color: white;
  text-align: center;
  font-size: 1.3em;
  margin-bottom: 50px;
}

.question {
  background: #4a6fa5;
  padding: 35px;
  border-radius: 15px;
  margin-bottom: 30px;
  border: 2px solid #5a7fb5;
  transition: all 0.3s ease;
}

.question:hover {
  box-shadow: 0 5px 20px rgba(0,0,0,0.3);
}

.question.correct {
  background: #4caf50;
  border: 3px solid #66bb6a;
}

.question-number {
  color: white;
  font-weight: 700;
  font-size: 1.2em;
  margin-bottom: 18px;
  text-transform: uppercase;
}

.question-text {
  color: white;
  font-size: 1.15em;
  line-height: 1.7;
  margin-bottom: 25px;
}

.code-block {
  background: #0d1b2a;
  padding: 25px;
  border-radius: 12px;
  margin: 20px 0;
  font-family: 'Courier New', monospace;
  color: #f8f8f2;
  font-size: 1em;
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
  background: #2d4a6f;
  border: 3px solid #4a9eff;
  border-radius: 8px;
  padding: 12px 18px;
  color: white;
  font-size: 1em;
  width: 160px;
  text-align: center;
  outline: none;
  transition: all 0.3s ease;
  font-weight: 600;
  font-family: 'Courier New', monospace;
}

.fill-blank:focus {
  border-color: #7ec8ff;
  box-shadow: 0 0 0 4px rgba(74,158,255,0.15);
}

.fill-blank.correct {
  border-color: #4caf50;
  background: #66bb6a;
  color: white;
}

.feedback {
  margin-top: 18px;
  padding: 18px;
  border-radius: 12px;
  font-weight: 600;
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
}

.feedback.incorrect {
  background: linear-gradient(135deg, #ef5350, #e53935);
  color: white;
}

.check-button-container {
  text-align: center;
  margin-top: 40px;
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
  box-shadow: 0 8px 25px rgba(74,158,255,0.4);
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.check-answers-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(74,158,255,0.5);
}

.check-answers-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.completion-message {
  background: linear-gradient(135deg, #4caf50, #66bb6a);
  padding: 50px;
  border-radius: 20px;
  text-align: center;
  display: none;
  margin-top: 40px;
  box-shadow: 0 15px 40px rgba(76,175,80,0.4);
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

.completion-message h3 {
  color: white;
  font-size: 2.3em;
  margin-bottom: 25px;
}

.completion-message p {
  color: white;
  font-size: 1.25em;
  margin: 15px 0;
}

.audio-player {
  background: #4a6fa5;
  padding: 30px;
  border-radius: 15px;
  margin: 30px auto;
  max-width: 600px;
}

.audio-player p {
  color: white;
  font-weight: 600;
  margin-bottom: 15px;
  font-size: 1.1em;
}

.audio-player audio {
  width: 100%;
}

.divider {
  height: 80px;
  background: linear-gradient(180deg, transparent, rgba(255,255,255,0.1), transparent);
}

/* Personalization Notice */
.personalization-notice {
  max-width: 1000px;
  margin: 0 auto 40px;
  background: linear-gradient(135deg, #4a9eff, #1e3a5f);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 15px 50px rgba(0,0,0,0.4);
  text-align: center;
}

.personalization-notice h3 {
  color: white;
  font-size: 1.8em;
  margin-bottom: 15px;
}

.personalization-notice p {
  color: white;
  font-size: 1.1em;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .main-header h1 {
    font-size: 2.2em;
  }
  
  .location-header h2 {
    font-size: 2.5em;
  }
  
  .lesson-content,
  .quiz-section {
    padding: 35px 25px;
  }
  
  .scene-container {
    padding: 30px 20px;
    min-height: 350px;
  }
  
  .balboa-scene,
  .lajolla-scene,
  .petco-scene,
  .zoo-scene {
    height: 300px;
  }
}
</style>
</head>
<body>

<!-- Intro Screen -->
<div class="intro" id="intro">
  <h1>🌴 San Diego Roadtrip 🌊</h1>
  <p>Learn HTML Audio Through San Diego's Iconic Locations!</p>
</div>

<!-- Main Header -->
<div class="main-header">
  <h1>🎵 San Diego Audio Tour</h1>
  <p id="headerSubtitle">A Journey Through Four Iconic Locations</p>
</div>

<!-- Personalization Notice -->
<div class="personalization-notice" id="personalizationNotice" style="display: none;">
  <h3>✨ Your Personalized Experience</h3>
  <p id="personalizationText"></p>
</div>

<!-- Balboa Park -->
<div class="location" id="location-balboa">
  <div class="location-header">
    <h2>🏛️ Balboa Park</h2>
    <p>Learn about HTML audio with the majestic Spreckels Organ!</p>
  </div>
  
  <div class="scene-container">
    <div class="balboa-scene">
      <div class="sun"></div>
      <div class="botanical">
        <div class="tower left">
          <div class="tower-top"></div>
        </div>
        <div class="dome-building">
          <div class="dome"></div>
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
      <div class="balboa-garden"></div>
    </div>
  </div>
  
  <div class="lesson-content">
    <h3>Balboa Park Organ Audio Lesson</h3>
    <p>Learn how to add and control audio using HTML with sounds from Balboa Park's historic Spreckels Organ Pavilion.</p>
    
    <h4>1. What It Does</h4>
    <p>Use the &lt;audio&gt; tag to play clips (music, nature, narration) directly in the browser.</p>
    
    <h4>2. Basic Structure</h4>
    <p>Each audio player includes a heading, description, and the audio element:</p>
    <pre><code>&lt;audio controls&gt;
  &lt;source src="path/to/audio.mp3" type="audio/mpeg"&gt;
&lt;/audio&gt;</code></pre>
    
   <div class="example-section">
      <h3>🎵 Example Audio Player</h3>
      <p>This is a sample audio player showing the controls attribute in action:</p>
      <audio controls>
        <source src= "/hacks/west-coast/travel/sandiego/funny-organ-intro-outro-5008.mp3" type="audio/mpeg">
      </audio>
      <p class="source-text">Sample audio for demonstration</p>
    </div>
  </div>
  
  <div class="quiz-section">
    <h3>🎵 Build Your Audio Player</h3>
    <p class="subtitle">Fill in the blanks to create a working audio player!</p>
    
    <div class="question" id="balboa-q1">
      <div class="question-number">Question 1 - Audio Tag Opening</div>
      <div class="question-text">
        What attribute do you add to the &lt;audio&gt; tag to show playback controls?
        <div class="code-block">
&lt;<span class="code-tag">audio</span> <input type="text" class="fill-blank" id="balboa-a1" placeholder="Your answer">&gt;
&lt;/<span class="code-tag">audio</span>&gt;
        </div>
      </div>
      <div class="feedback" id="balboa-f1"></div>
    </div>
    
    <div class="question" id="balboa-q2">
      <div class="question-number">Question 2 - Source Tag</div>
      <div class="question-text">
        What tag do you use inside &lt;audio&gt; to specify the audio file?
        <div class="code-block">
&lt;<span class="code-tag">audio</span> <span class="code-attr">controls</span>&gt;
  &lt;<input type="text" class="fill-blank" id="balboa-a2" placeholder="Your answer"> <span class="code-attr">src</span>=<span class="code-value">"organ.mp3"</span>
     <span class="code-attr">type</span>=<span class="code-value">"audio/mpeg"</span>&gt;
&lt;/<span class="code-tag">audio</span>&gt;
        </div>
      </div>
      <div class="feedback" id="balboa-f2"></div>
    </div>
    
    <div class="question" id="balboa-q3">
      <div class="question-number">Question 3 - File Type</div>
      <div class="question-text">
        What type value should you use for .mp3 files?
        <div class="code-block">
&lt;<span class="code-tag">source</span> <span class="code-attr">src</span>=<span class="code-value">"balboa.mp3"</span>
   <span class="code-attr">type</span>=<span class="code-value">"audio/<input type="text" class="fill-blank" id="balboa-a3" placeholder="Your answer">"</span>&gt;
        </div>
      </div>
      <div class="feedback" id="balboa-f3"></div>
    </div>
    
    <div class="check-button-container">
      <button class="check-answers-btn" id="balboa-check">Build My Audio Player</button>
    </div>
    
   <div class="completion-message" id="balboa-complete">
      <h3>🏆 Audio Player Built Successfully!</h3>
      <div class="audio-player">
        <p>🎵 Your Working Audio Player:</p>
        <audio controls>
          <source src="/hacks/west-coast/travel/sandiego/funny-organ-intro-outro-5008.mp3" type="audio/mpeg">
        </audio>
      </div>
      <p>You've successfully created an audio player!</p>
      <p>Now you can add audio to any webpage! 🎯</p>
    </div>
  </div>
</div>

<div class="divider"></div>

<!-- La Jolla Beach -->
<div class="location" id="location-lajolla">
  <div class="location-header">
    <h2>🌊 La Jolla Beach</h2>
    <p>Learn HTML audio with the soothing sounds of the Pacific Ocean!</p>
  </div>
  
  <div class="scene-container">
    <div class="lajolla-scene">
      <div class="beach-sun"></div>
      <div class="ocean-water">
        <div class="wave-line"></div>
        <div class="wave-line w2"></div>
        <div class="wave-line w3"></div>
      </div>
      <div class="seal">
        <div class="seal-body">
          <div class="seal-head">
            <div class="seal-nose"></div>
          </div>
        </div>
      </div>
      <div class="sand"></div>
    </div>
  </div>
  
  <div class="lesson-content">
    <h3>La Jolla Beach Audio Lesson</h3>
    <p>Learn how to add and control audio using sounds from La Jolla's beautiful coastline.</p>
    
    <h4>1. What It Does</h4>
    <p>Use the &lt;audio&gt; tag to play clips (ocean waves, seagulls, beach ambience) directly in the browser.</p>
    
    <h4>2. Basic Structure</h4>
    <pre><code>&lt;audio controls&gt;
  &lt;source src="path/to/audio.mp3" type="audio/mpeg"&gt;
&lt;/audio&gt;</code></pre>
    
   <div class="example-section">
      <h3>🌊 Beach Sounds Example</h3>
      <p>Listen to the soothing sounds of waves crashing on the shores of La Jolla Beach:</p>
      <audio controls>
        <source src="/hacks/west-coast/travel/sandiego/gentle-ocean-waves-3-300839.mp3" type="audio/mpeg">
      </audio>
      <p class="source-text">Sample ocean waves audio</p>
    </div>
  </div>
  
  <div class="quiz-section">
    <h3>🌊 Build Your Audio Player</h3>
    <p class="subtitle">Fill in the blanks to create a working audio player with La Jolla Beach sounds!</p>
    
    <div class="question" id="lajolla-q1">
      <div class="question-number">Question 1 - Audio Tag Opening</div>
      <div class="question-text">
        What attribute do you add to the &lt;audio&gt; tag to show playback controls?
        <div class="code-block">
&lt;<span class="code-tag">audio</span> <input type="text" class="fill-blank" id="lajolla-a1" placeholder="Your answer">&gt;
&lt;/<span class="code-tag">audio</span>&gt;
        </div>
      </div>
      <div class="feedback" id="lajolla-f1"></div>
    </div>
    
    <div class="question" id="lajolla-q2">
      <div class="question-number">Question 2 - Source Tag</div>
      <div class="question-text">
        What tag do you use inside &lt;audio&gt; to specify the audio file?
        <div class="code-block">
&lt;<span class="code-tag">audio</span> <span class="code-attr">controls</span>&gt;
  &lt;<input type="text" class="fill-blank" id="lajolla-a2" placeholder="Your answer"> <span class="code-attr">src</span>=<span class="code-value">"waves.mp3"</span>
     <span class="code-attr">type</span>=<span class="code-value">"audio/mpeg"</span>&gt;
&lt;/<span class="code-tag">audio</span>&gt;
        </div>
      </div>
      <div class="feedback" id="lajolla-f2"></div>
    </div>
    
    <div class="question" id="lajolla-q3">
      <div class="question-number">Question 3 - File Type</div>
      <div class="question-text">
        What type value should you use for .mp3 files?
        <div class="code-block">
&lt;<span class="code-tag">source</span> <span class="code-attr">src</span>=<span class="code-value">"beach.mp3"</span>
   <span class="code-attr">type</span>=<span class="code-value">"audio/<input type="text" class="fill-blank" id="lajolla-a3" placeholder="Your answer">"</span>&gt;
        </div>
      </div>
      <div class="feedback" id="lajolla-f3"></div>
    </div>
    
    <div class="check-button-container">
      <button class="check-answers-btn" id="lajolla-check">Build My Audio Player</button>
    </div>
    
  <div class="completion-message" id="lajolla-complete">
      <h3>🏆 Audio Player Built Successfully!</h3>
      <div class="audio-player">
        <p>🌊 La Jolla Beach Ocean Waves</p>
        <audio controls>
          <source src= "/hacks/west-coast/travel/sandiego/gentle-ocean-waves-3-300839.mp3" type="audio/mpeg">
        </audio>
      </div>
      <p>You've successfully created an audio player using HTML!</p>
      <p>Now you can add audio to any webpage! 🎯</p>
    </div>
  </div>
</div>

<div class="divider"></div>

<!-- Petco Park -->
<div class="location" id="location-petco">
  <div class="location-header">
    <h2>⚾ Petco Park</h2>
    <p>Learn HTML audio with the exciting sounds of baseball!</p>
  </div>
  
  <div class="scene-container">
    <div class="petco-scene">
      <div class="sun"></div>
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
      <div class="field">
        <div class="infield">
          <div class="base first"></div>
          <div class="base second"></div>
          <div class="base third"></div>
          <div class="base home"></div>
        </div>
        <div class="baseball"></div>
      </div>
    </div>
  </div>
  
  <div class="lesson-content">
    <h3>Petco Park Audio Lesson</h3>
    <p>Learn how to add and control audio with sounds from San Diego's Petco Park.</p>
    
    <h4>1. What It Does</h4>
    <p>Use the &lt;audio&gt; tag to play clips (crowd cheers, announcers, game sounds) directly in the browser.</p>
    
    <h4>2. Basic Structure</h4>
    <pre><code>&lt;audio controls&gt;
  &lt;source src="path/to/audio.mp3" type="audio/mpeg"&gt;
&lt;/audio&gt;</code></pre>
    
   <div class="example-section">
      <h3>⚾ Petco Park Atmosphere</h3>
      <p>Listen to authentic game-day sounds from the Padres' home stadium:</p>
      <audio controls>
        <source src="/hacks/west-coast/travel/sandiego/applause-cheer-236786.mp3" type="audio/mpeg">
      </audio>
      <p class="source-text">Baseball crowd cheer sound effect</p>
    </div>
  </div>
  
  <div class="quiz-section">
    <h3>⚾ Build Your Audio Player</h3>
    <p class="subtitle">Fill in the blanks to create a working audio player with Petco Park sounds!</p>
    
    <div class="question" id="petco-q1">
      <div class="question-number">Question 1 - Audio Tag Opening</div>
      <div class="question-text">
        What attribute do you add to the &lt;audio&gt; tag to show playback controls?
        <div class="code-block">
&lt;<span class="code-tag">audio</span> <input type="text" class="fill-blank" id="petco-a1" placeholder="Your answer">&gt;
&lt;/<span class="code-tag">audio</span>&gt;
        </div>
      </div>
      <div class="feedback" id="petco-f1"></div>
    </div>
    
    <div class="question" id="petco-q2">
      <div class="question-number">Question 2 - Source Tag</div>
      <div class="question-text">
        What tag do you use inside &lt;audio&gt; to specify the audio file?
        <div class="code-block">
&lt;<span class="code-tag">audio</span> <span class="code-attr">controls</span>&gt;
  &lt;<input type="text" class="fill-blank" id="petco-a2" placeholder="Your answer"> <span class="code-attr">src</span>=<span class="code-value">"cheer.mp3"</span>
     <span class="code-attr">type</span>=<span class="code-value">"audio/mpeg"</span>&gt;
&lt;/<span class="code-tag">audio</span>&gt;
        </div>
      </div>
      <div class="feedback" id="petco-f2"></div>
    </div>
    
    <div class="question" id="petco-q3">
      <div class="question-number">Question 3 - File Type</div>
      <div class="question-text">
        What type value should you use for .mp3 files?
        <div class="code-block">
&lt;<span class="code-tag">source</span> <span class="code-attr">src</span>=<span class="code-value">"petco.mp3"</span>
   <span class="code-attr">type</span>=<span class="code-value">"audio/<input type="text" class="fill-blank" id="petco-a3" placeholder="Your answer">"</span>&gt;
        </div>
      </div>
      <div class="feedback" id="petco-f3"></div>
    </div>
    
    <div class="check-button-container">
      <button class="check-answers-btn" id="petco-check">Play Ball! 🏟️</button>
    </div>
    
   <div class="completion-message" id="petco-complete">
      <h3>⚾ Home Run!</h3>
      <div class="audio-player">
        <p>⚾ Petco Park Game Day Atmosphere</p>
        <audio controls>
          <source src="/hacks/west-coast/travel/sandiego/applause-cheer-236786.mp3" type="audio/mpeg">
        </audio>
      </div>
      <p>The Padres faithful are cheering you on! 🎊</p>
    </div>
  </div>
</div>

<div class="divider"></div>

<!-- San Diego Zoo -->
<div class="location" id="location-zoo">
  <div class="location-header">
    <h2>🦁 San Diego Zoo</h2>
    <p>Learn HTML audio with the wild sounds of the famous San Diego Zoo!</p>
  </div>
  
  <div class="scene-container">
    <div class="zoo-scene">
      <div class="sun"></div>
      <div class="zoo-sign">
        <div class="zoo-sign-text">SAN DIEGO ZOO</div>
      </div>
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
      <div class="animal lion">
        <div class="lion-mane">
          <div class="lion-head">
            <div class="lion-eye left"></div>
            <div class="lion-eye right"></div>
          </div>
        </div>
      </div>
      <div class="zoo-path"></div>
    </div>
  </div>
  
  <div class="lesson-content">
    <h3>San Diego Zoo Audio Lesson</h3>
    <p>Learn how to add and control audio using HTML with sounds from the world-famous San Diego Zoo.</p>
    
    <h4>1. What It Does</h4>
    <p>Use the &lt;audio&gt; tag to play clips (lion roars, bird calls, wildlife sounds) directly in the browser.</p>
    
    <h4>2. Basic Structure</h4>
    <pre><code>&lt;audio controls&gt;
  &lt;source src="path/to/audio.mp3" type="audio/mpeg"&gt;
&lt;/audio&gt;</code></pre>
    
   <div class="example-section">
      <h3>🦁 San Diego Zoo Lion Roar</h3>
      <p>Listen to the powerful roar of the king of the jungle:</p>
      <audio controls>
        <source src="/hacks/west-coast/travel/sandiego/tiger-roar-wildlife-sfx-376158.mp3" type="audio/mpeg">
      </audio>
      <p class="source-text">Lion roar and wildlife sounds</p>
    </div>
  </div>
  
  <div class="quiz-section">
    <h3>🦁 Build Your Audio Player</h3>
    <p class="subtitle">Fill in the blanks to create a working audio player with San Diego Zoo sounds!</p>
    
    <div class="question" id="zoo-q1">
      <div class="question-number">Question 1 - Audio Tag Opening</div>
      <div class="question-text">
        What attribute do you add to the &lt;audio&gt; tag to show playback controls?
        <div class="code-block">
&lt;<span class="code-tag">audio</span> <input type="text" class="fill-blank" id="zoo-a1" placeholder="Your answer">&gt;
&lt;/<span class="code-tag">audio</span>&gt;
        </div>
      </div>
      <div class="feedback" id="zoo-f1"></div>
    </div>
    
    <div class="question" id="zoo-q2">
      <div class="question-number">Question 2 - Source Tag</div>
      <div class="question-text">
        What tag do you use inside &lt;audio&gt; to specify the audio file?
        <div class="code-block">
&lt;<span class="code-tag">audio</span> <span class="code-attr">controls</span>&gt;
  &lt;<input type="text" class="fill-blank" id="zoo-a2" placeholder="Your answer"> <span class="code-attr">src</span>=<span class="code-value">"lion.mp3"</span>
     <span class="code-attr">type</span>=<span class="code-value">"audio/mpeg"</span>&gt;
&lt;/<span class="code-tag">audio</span>&gt;
        </div>
      </div>
      <div class="feedback" id="zoo-f2"></div>
    </div>
    
    <div class="question" id="zoo-q3">
      <div class="question-number">Question 3 - File Type</div>
      <div class="question-text">
        What type value should you use for .mp3 files?
        <div class="code-block">
&lt;<span class="code-tag">source</span> <span class="code-attr">src</span>=<span class="code-value">"zoo.mp3"</span>
   <span class="code-attr">type</span>=<span class="code-value">"audio/<input type="text" class="fill-blank" id="zoo-a3" placeholder="Your answer">"</span>&gt;
        </div>
      </div>
      <div class="feedback" id="zoo-f3"></div>
    </div>
    
    <div class="check-button-container">
      <button class="check-answers-btn" id="zoo-check">Hear the Roar! 🦁</button>
    </div>
    
   <div class="completion-message" id="zoo-complete">
      <h3>🦁 Wild Success!</h3>
      <div class="audio-player">
        <p>🦁 King of the Jungle - Lion Roar</p>
        <audio controls>
          <source src= "/hacks/west-coast/travel/sandiego/tiger-roar-wildlife-sfx-376158.mp3" type="audio/mpeg">
        </audio>
      </div>
      <p>The animals are roaring with pride! 🐾</p>
    </div>
  </div>
</div>

<script>
// PERSONALIZATION FEATURE - Load user's selected destinations from localStorage
(function() {
  const DESTINATION_MAP = {
    'Petco Park': 'location-petco',
    'San Diego Zoo': 'location-zoo',
    'Balboa Park': 'location-balboa',
    'La Jolla': 'location-lajolla'
  };

  function loadPersonalization() {
    try {
      const itineraryData = localStorage.getItem('westCoastItinerary');
      
      if (itineraryData) {
        const itinerary = JSON.parse(itineraryData);
        
        // Check if San Diego data exists in the itinerary
        if (itinerary.cities && itinerary.cities['San Diego']) {
          const sanDiegoDestinations = itinerary.cities['San Diego'].destinations;
          
          if (sanDiegoDestinations && sanDiegoDestinations.length > 0) {
            // Show personalization notice
            const notice = document.getElementById('personalizationNotice');
            const noticeText = document.getElementById('personalizationText');
            notice.style.display = 'block';
            noticeText.textContent = `Based on your itinerary, we're showing you: ${sanDiegoDestinations.join(' and ')}! These were your selected destinations from the trip planner.`;
            
            // Update header subtitle
            const headerSubtitle = document.getElementById('headerSubtitle');
            headerSubtitle.textContent = `Your Personalized Journey: ${sanDiegoDestinations.join(' & ')}`;
            
            // Hide all locations first
            Object.values(DESTINATION_MAP).forEach(locationId => {
              const locationElement = document.getElementById(locationId);
              if (locationElement) {
                locationElement.style.display = 'none';
              }
            });
            
            // Show only the selected destinations
            sanDiegoDestinations.forEach(destination => {
              const locationId = DESTINATION_MAP[destination];
              if (locationId) {
                const locationElement = document.getElementById(locationId);
                if (locationElement) {
                  locationElement.style.display = 'block';
                }
              }
            });
            
            return true; // Personalization applied
          }
        }
      }
    } catch (error) {
      console.log('No personalization data found or error loading:', error);
    }
    
    return false; // No personalization applied, show all locations
  }

  // Apply personalization on page load
  const personalized = loadPersonalization();
  
  if (!personalized) {
    // If no personalization, ensure all locations are visible
    Object.values(DESTINATION_MAP).forEach(locationId => {
      const locationElement = document.getElementById(locationId);
      if (locationElement) {
        locationElement.style.display = 'block';
      }
    });
  }
})();

// Hide intro after 3 seconds
setTimeout(function() {
  document.getElementById('intro').classList.add('hidden');
}, 3000);

// Quiz functionality for each location
function setupQuiz(location) {
  const checkBtn = document.getElementById(`${location}-check`);
  
  checkBtn.addEventListener('click', function() {
    const input1 = document.getElementById(`${location}-a1`);
    const input2 = document.getElementById(`${location}-a2`);
    const input3 = document.getElementById(`${location}-a3`);
    const feedback1 = document.getElementById(`${location}-f1`);
    const feedback2 = document.getElementById(`${location}-f2`);
    const feedback3 = document.getElementById(`${location}-f3`);
    const question1 = document.getElementById(`${location}-q1`);
    const question2 = document.getElementById(`${location}-q2`);
    const question3 = document.getElementById(`${location}-q3`);
    
    const answer1 = input1.value.trim().toLowerCase();
    const answer2 = input2.value.trim().toLowerCase();
    const answer3 = input3.value.trim().toLowerCase();
    
    let allCorrect = true;
    
    // Check answer 1 - controls
    if (answer1 === 'controls') {
      feedback1.textContent = '✓ Perfect! The controls attribute shows play, pause, and volume buttons!';
      feedback1.className = 'feedback correct show';
      input1.className = 'fill-blank correct';
      question1.className = 'question correct';
      input1.disabled = true;
    } else {
      feedback1.textContent = '✗ Not quite! You need to add the "controls" attribute to show playback controls.';
      feedback1.className = 'feedback incorrect show';
      allCorrect = false;
    }
    
    // Check answer 2 - source
    if (answer2 === 'source') {
      feedback2.textContent = '✓ Great job! The <source> tag specifies the audio file location!';
      feedback2.className = 'feedback correct show';
      input2.className = 'fill-blank correct';
      question2.className = 'question correct';
      input2.disabled = true;
    } else {
      feedback2.textContent = '✗ Try again! The tag that specifies the audio file is called "source".';
      feedback2.className = 'feedback incorrect show';
      allCorrect = false;
    }
    
    // Check answer 3 - mpeg
    if (answer3 === 'mpeg') {
      feedback3.textContent = '✓ Excellent! audio/mpeg is the correct MIME type for MP3 files!';
      feedback3.className = 'feedback correct show';
      input3.className = 'fill-blank correct';
      question3.className = 'question correct';
      input3.disabled = true;
    } else {
      feedback3.textContent = '✗ Not quite! For .mp3 files, use "mpeg" as the type (audio/mpeg).';
      feedback3.className = 'feedback incorrect show';
      allCorrect = false;
    }
    
    // Show completion if all correct
    if (allCorrect) {
      setTimeout(() => {
        const completion = document.getElementById(`${location}-complete`);
        completion.className = 'completion-message show';
        
        // Disable the button
        checkBtn.disabled = true;
        checkBtn.textContent = '✓ Complete!';
        checkBtn.style.background = 'linear-gradient(135deg, #4caf50, #66bb6a)';
        checkBtn.style.color = 'white';
        
        // Scroll to completion message
        completion.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  });
}

// Setup quizzes for all locations
setupQuiz('balboa');
setupQuiz('lajolla');
setupQuiz('petco');
setupQuiz('zoo');
</script>
 Share your experiences on the microblog!
 <!-- 🌍 Destination Finder Tool -->
<div style="padding: 15px; border-radius: 6px; margin-bottom: 20px; border: 1px solid #dee2e6;">
  <h3 style="margin-top: 0; color: #495057;">AI-Powered Destination Finder</h3>

  <label>Search a Place or Interest:</label>
  <textarea id="user-search-input" placeholder="e.g., beaches, hiking, Paris, ancient history..." style="min-height: 80px; width: 100%; padding: 8px; resize: vertical;"></textarea>
  
  <div style="display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap;">
    <button class="iridescent flex-1 text-white text-center py-2 rounded-lg font-semibold transition" style="background-color: #007bff;" onclick="generateDestination()">
      🔍 Search Destination
    </button>
    <button class="iridescent flex-1 text-white text-center py-2 rounded-lg font-semibold transition" style="background-color: #28a745;" onclick="saveDestination()">
      💾 Save Destination
    </button>
    <button class="iridescent flex-1 text-white text-center py-2 rounded-lg font-semibold transition" style="background-color: #17a2b8;" onclick="loadDestination()">
      📂 Load Saved
    </button>
  </div>

  <div id="ai-status" style="margin-top: 10px; padding: 8px; border-radius: 4px; display: none;"></div>

  <!-- Destination Info -->
  <div id="destination-info" style="margin-top: 15px; display: none; border-left: 4px solid #007bff; padding: 12px; border-radius: 4px;">
    <h4 id="dest-name" style="margin: 0; color: #007bff;"></h4>
    <p id="dest-country" style="font-weight: bold; margin: 5px 0;"></p>
    <p id="dest-description" style="color: #495057;"></p>
    <p><strong>🗓 Best Time to Visit:</strong> <span id="dest-best-time"></span></p>
    <p><strong>🌤️ Climate:</strong> <span id="dest-climate"></span></p>
    <p><strong>📍 Suggested Activities:</strong> <span id="dest-activities"></span></p>
  </div>
</div>

<script>
// 🌍 Status message helper
function showAIStatus(message, type) {
  const statusDiv = document.getElementById("ai-status");
  statusDiv.textContent = message;
  statusDiv.style.display = "block";

  switch (type) {
    case "loading":
      statusDiv.style.backgroundColor = "#cce5ff";
      statusDiv.style.color = "#004085";
      break;
    case "success":
      statusDiv.style.backgroundColor = "#d1ecf1";
      statusDiv.style.color = "#0c5460";
      break;
    case "error":
      statusDiv.style.backgroundColor = "#f8d7da";
      statusDiv.style.color = "#721c24";
      break;
  }

  if (type !== "loading") {
    setTimeout(() => (statusDiv.style.display = "none"), 5000);
  }
}

// 🌍 Example destinations (can be replaced with AI/Gemini API later)
const DESTINATIONS = [
  {
    keywords: ["beach", "tropical", "ocean"],
    name: "Maui",
    country: "Hawaii, USA",
    description: "A lush island paradise famous for golden beaches, waterfalls, and volcanic landscapes.",
    bestTime: "April to October",
    climate: "Cool mountain climate",
    activities: "Hiking, skiing, cable car rides, glacier tours"
  },
  {
    keywords: ["history", "ancient", "ruins"],
    name: "Athens",
    country: "Greece",
    description: "The birthplace of democracy and home to ancient landmarks like the Parthenon.",
    bestTime: "April to June, September to October",
    climate: "Mediterranean",
    activities: "Museum visits, walking tours, exploring Acropolis, Greek cuisine"
  },
  {
    keywords: ["art", "romantic", "europe"],
    name: "Florence",
    country: "Italy",
    description: "A Renaissance treasure known for its art, architecture, and cuisine.",
    bestTime: "May to September",
    climate: "Warm Mediterranean",
    activities: "Visiting the Uffizi Gallery, Duomo climb, wine tasting in Tuscany"
  },
  {
    keywords: ["wildlife", "adventure", "africa", "safari"],
    name: "Serengeti National Park",
    country: "Tanzania",
    description: "A vast ecosystem renowned for the Great Migration and diverse African wildlife.",
    bestTime: "June to October",
    climate: "Warm dry savanna",
    activities: "Safari drives, wildlife photography, balloon safaris"
  }
];

// 🌍 Generate Destination
function generateDestination() {
  const query = document.getElementById("user-search-input").value.trim().toLowerCase();
  if (!query) {
    showAIStatus("⚠️ Please enter a place or theme to search.", "error");
    return;
  }

  showAIStatus("🔍 Searching destinations...", "loading");

  // Find matching destination
  const found = DESTINATIONS.find(dest =>
    dest.keywords.some(k => query.includes(k))
  );

  if (found) {
    displayDestination(found);
    showAIStatus("✅ Destination found!", "success");
  } else {
    // Fallback destination
    displayDestination({
      name: "Kyoto",
      country: "Japan",
      description:
        "A serene city known for its traditional temples, cherry blossoms, and tea culture.",
      bestTime: "March to May, October to November",
      climate: "Mild temperate",
      activities: "Temple visits, tea ceremonies, exploring Arashiyama bamboo forest"
    });
    showAIStatus("🌸 No exact match found, but here's a great suggestion: Kyoto!", "success");
  }
}

// 🌍 Display destination info
function displayDestination(dest) {
  document.getElementById("destination-info").style.display = "block";
  document.getElementById("dest-name").textContent = dest.name;
  document.getElementById("dest-country").textContent = dest.country;
  document.getElementById("dest-description").textContent = dest.description;
  document.getElementById("dest-best-time").textContent = dest.bestTime;
  document.getElementById("dest-climate").textContent = dest.climate;
  document.getElementById("dest-activities").textContent = dest.activities;
}

// 🌍 Save to localStorage
function saveDestination() {
  const data = {
    input: document.getElementById("user-search-input").value.trim(),
    name: document.getElementById("dest-name").textContent,
    country: document.getElementById("dest-country").textContent,
    description: document.getElementById("dest-description").textContent,
    bestTime: document.getElementById("dest-best-time").textContent,
    climate: document.getElementById("dest-climate").textContent,
    activities: document.getElementById("dest-activities").textContent,
    timestamp: new Date().toISOString()
  };

  if (!data.name) {
    showAIStatus("⚠️ Please generate a destination before saving.", "error");
    return;
  }

  localStorage.setItem("destination-finder-saved", JSON.stringify(data));
  showAIStatus("✅ Destination saved successfully!", "success");
}

// 🌍 Load saved destination
function loadDestination() {
  const saved = localStorage.getItem("destination-finder-saved");
  if (!saved) {
    showAIStatus("⚠️ No saved destination found.", "error");
    return;
  }

  const data = JSON.parse(saved);
  displayDestination(data);
  document.getElementById("user-search-input").value = data.input;
  const saveDate = new Date(data.timestamp).toLocaleString();
  showAIStatus(`📂 Loaded saved destination (Saved: ${saveDate})`, "success");
}
</script>
Share your experiences on the microblog!
</body>
</html>