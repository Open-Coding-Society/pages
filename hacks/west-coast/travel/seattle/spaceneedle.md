---
layout: post
title: "Space Needle"
description: 
permalink: /west-coast/travel/seattle/needle/
date: 2025-10-21
---
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Space Needle - Seattle</title>
<style>
* {
box-sizing: border-box;
margin: 0;
padding: 0;
  }
  body {
    font-family: system-ui, -apple-system, sans-serif;
    background: linear-gradient(135deg, #2c5f7c, #1a3f56);
    min-height: 100vh;
    padding: 20px;
    color: #000;
  }
  .container {
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,.5);
    color: #000;
  }
  .needle-scene {
    background: linear-gradient(180deg, #708090 0%, #a9b5c1 60%, #d3dce6 100%);
    width: 100%;
    height: 500px;
    position: relative;
  }
  .seattle-sky {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 70%;
  }
  .rain-drop {
    position: absolute;
    width: 2px;
    height: 20px;
    background: linear-gradient(180deg, transparent, rgba(255,255,255,.6));
    top: -30px;
    animation: rain 1.5s linear infinite;
  }
  @keyframes rain {
    to { top: 110%; }
  }
  .space-needle {
    position: absolute;
    bottom: 20%;
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
    height: 500px;
  }
  .needle-base {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 140px;
    height: 60px;
    background: linear-gradient(135deg, #a0a0a0, #808080);
    border-radius: 12px;
    border: 4px solid #606060;
    box-shadow: 0 8px 20px rgba(0,0,0,.4);
  }
  .needle-legs {
    position: absolute;
    bottom: 60px;
    left: 50%;
    transform: translateX(-50%);
    width: 220px;
    height: 100px;
  }
  .leg {
    position: absolute;
    width: 10px;
    background: linear-gradient(135deg, #b8b8b8, #808080);
    border: 3px solid #606060;
    bottom: 0;
    border-radius: 5px;
    box-shadow: 2px 2px 8px rgba(0,0,0,.3);
  }
  .leg.l1 { 
    left: 10px; 
    height: 100px;
    transform: rotate(-25deg); 
    transform-origin: bottom center; 
  }
  .leg.l2 { 
    left: 40%; 
    height: 90px;
    transform: rotate(-12deg); 
    transform-origin: bottom center; 
  }
  .leg.l3 { 
    right: 40%; 
    height: 90px;
    transform: rotate(12deg); 
    transform-origin: bottom center; 
  }
  .leg.l4 { 
    right: 10px; 
    height: 100px;
    transform: rotate(25deg); 
    transform-origin: bottom center; 
  }
  .needle-shaft {
    position: absolute;
    bottom: 160px;
    left: 50%;
    transform: translateX(-50%);
    width: 22px;
    height: 240px;
    background: linear-gradient(90deg, #d0d0d0 0%, #a0a0a0 50%, #d0d0d0 100%);
    border: 3px solid #707070;
    border-radius: 11px;
    box-shadow: inset 0 0 15px rgba(0,0,0,.25), 4px 0 12px rgba(0,0,0,.3);
  }
  .saucer-bottom {
    position: absolute;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 30px;
    background: linear-gradient(180deg, #888, #666);
    border-radius: 50%;
    border: 4px solid #555;
    box-shadow: 0 12px 30px rgba(0,0,0,.5);
  }
  .observation-deck {
    position: absolute;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    width: 180px;
    height: 70px;
    background: linear-gradient(180deg, #f8f8f8 0%, #e0e0e0 50%, #c8c8c8 100%);
    border-radius: 50%;
    border: 5px solid #a0a0a0;
    box-shadow: 0 15px 35px rgba(0,0,0,.5), inset 0 -10px 20px rgba(0,0,0,.1);
  }
  .observation-deck:before {
    content: "";
    position: absolute;
    top: -22px;
    left: 50%;
    transform: translateX(-50%);
    width: 160px;
    height: 22px;
    background: linear-gradient(180deg, #e8e8e8, #d0d0d0);
    border-radius: 50%;
    border: 4px solid #a0a0a0;
    box-shadow: 0 -5px 15px rgba(0,0,0,.2);
  }
  .observation-deck:after {
    content: "";
    position: absolute;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 140px;
    height: 12px;
    background: linear-gradient(180deg, #b8b8b8, #909090);
    border-radius: 50%;
  }
  .deck-windows {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 160px;
    height: 30px;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .deck-window {
    width: 10px;
    height: 22px;
    background: linear-gradient(180deg, rgba(135,206,235,.8), rgba(100,149,237,.6));
    border: 2px solid #707070;
    border-radius: 3px;
    box-shadow: inset 0 0 5px rgba(255,255,255,.5);
  }
  .roof-ring {
    position: absolute;
    top: 55px;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 30px;
    background: linear-gradient(180deg, #d0d0d0, #a8a8a8);
    border-radius: 50%;
    border: 4px solid #888;
    box-shadow: 0 8px 20px rgba(0,0,0,.4);
  }
  .needle-top {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 28px;
    height: 70px;
    background: linear-gradient(90deg, #f0f0f0 0%, #c0c0c0 50%, #f0f0f0 100%);
    border-radius: 14px;
    border: 3px solid #909090;
    box-shadow: 0 6px 15px rgba(0,0,0,.4);
  }
  .top-cap {
    position: absolute;
    top: 35px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 25px;
    background: radial-gradient(ellipse at 50% 30%, #e8e8e8, #b8b8b8);
    border-radius: 50%;
    border: 3px solid #888;
  }
  .antenna {
    position: absolute;
    top: -55px;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 60px;
    background: linear-gradient(180deg, #888, #606060);
    border-radius: 3px;
    box-shadow: 2px 2px 6px rgba(0,0,0,.4);
  }
  .antenna-light {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 12px;
    height: 12px;
    background: radial-gradient(circle, #ff3333, #cc0000);
    border-radius: 50%;
    box-shadow: 0 0 25px #ff0000, 0 0 50px rgba(255,0,0,.6);
    animation: blink 2s ease-in-out infinite;
  }
  @keyframes blink {
    0%, 40%, 60%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
    50% { opacity: 0.3; transform: translateX(-50%) scale(0.9); }
  }
  .city-building {
    position: absolute;
    bottom: 20%;
    background: linear-gradient(135deg, #7a8a99, #5a6a79);
    border: 2px solid #3a4a59;
    border-radius: 4px 4px 0 0;
  }
  .b1 { left: 15%; width: 60px; height: 100px; }
  .b2 { left: 25%; width: 50px; height: 130px; }
  .b3 { right: 20%; width: 70px; height: 90px; }
  .b4 { right: 10%; width: 55px; height: 110px; }
  .window-grid {
    position: absolute;
    inset: 10px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
  }
  .window {
    background: rgba(255,255,150,.8);
    border-radius: 2px;
  }
  .ground {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 20%;
    background: linear-gradient(180deg, #4a5a6a 0%, #3a4a5a 100%);
  }
  .label {
    position: absolute;
    top: 20px;
    left: 20px;
    background: rgba(255,255,255,.95);
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 700;
    font-size: 20px;
    color: #1a3f56;
    box-shadow: 0 8px 20px rgba(0,0,0,.3);
  }
  
  .content {
    padding: 60px 80px;
    background: white;
    color: #000 !important;
  }
  
  .content h1 {
    font-size: 2.5em;
    color: #000 !important;
    margin-bottom: 30px;
  }
  
  .content h2 {
    font-size: 2em;
    color: #000 !important;
    margin-top: 50px;
    margin-bottom: 20px;
  }
  
  .content h3 {
    font-size: 1.5em;
    color: #000 !important;
    margin-top: 30px;
    margin-bottom: 15px;
  }
  
  .content p {
    line-height: 1.8;
    margin-bottom: 15px;
    font-size: 1.1em;
    color: #000 !important;
  }
  
  .content ul {
    margin: 20px 0 20px 30px;
    color: #000 !important;
  }
  
  .content li {
    margin-bottom: 10px;
    line-height: 1.6;
    color: #000 !important;
  }
  
  .example-box {
    background: #f0f8ff;
    border-left: 4px solid #708090;
    padding: 20px;
    margin: 30px 0;
    border-radius: 8px;
    color: #000 !important;
  }
  
  .example-box strong {
    color: #000 !important;
  }
  
  @media (max-width: 768px) {
    .content {
      padding: 40px 30px;
    }
    
    .content h1 {
      font-size: 2em;
    }
    
    .content h2 {
      font-size: 1.6em;
    }
  }
</style>
</head>
<body>
<div class="container">
<div class="needle-scene">
<div class="label">🗼 Space Needle</div>
      <div class="seattle-sky">
        <div class="rain-drop" style="left: 15%; animation-delay: 0s;"></div>
        <div class="rain-drop" style="left: 25%; animation-delay: 0.3s;"></div>
        <div class="rain-drop" style="left: 35%; animation-delay: 0.6s;"></div>
        <div class="rain-drop" style="left: 45%; animation-delay: 0.2s;"></div>
        <div class="rain-drop" style="left: 55%; animation-delay: 0.8s;"></div>
        <div class="rain-drop" style="left: 65%; animation-delay: 0.4s;"></div>
        <div class="rain-drop" style="left: 75%; animation-delay: 0.1s;"></div>
        <div class="rain-drop" style="left: 85%; animation-delay: 0.7s;"></div>
      </div>
      <div class="city-building b1">
        <div class="window-grid">
          <div class="window"></div><div class="window"></div><div class="window"></div>
          <div class="window"></div><div class="window"></div><div class="window"></div>
          <div class="window"></div><div class="window"></div><div class="window"></div>
        </div>
      </div>
      <div class="city-building b2">
        <div class="window-grid">
          <div class="window"></div><div class="window"></div><div class="window"></div>
          <div class="window"></div><div class="window"></div><div class="window"></div>
          <div class="window"></div><div class="window"></div><div class="window"></div>
        </div>
      </div>
      <div class="city-building b3">
        <div class="window-grid">
          <div class="window"></div><div class="window"></div><div class="window"></div>
          <div class="window"></div><div class="window"></div><div class="window"></div>
        </div>
      </div>
      <div class="city-building b4">
        <div class="window-grid">
          <div class="window"></div><div class="window"></div><div class="window"></div>
          <div class="window"></div><div class="window"></div><div class="window"></div>
          <div class="window"></div><div class="window"></div><div class="window"></div>
        </div>
      </div>
      <div class="space-needle">
        <div class="needle-top">
          <div class="antenna">
            <div class="antenna-light"></div>
          </div>
          <div class="top-cap"></div>
        </div>
        <div class="roof-ring"></div>
        <div class="observation-deck">
          <div class="deck-windows">
            <div class="deck-window"></div>
            <div class="deck-window"></div>
            <div class="deck-window"></div>
            <div class="deck-window"></div>
            <div class="deck-window"></div>
            <div class="deck-window"></div>
            <div class="deck-window"></div>
            <div class="deck-window"></div>
            <div class="deck-window"></div>
            <div class="deck-window"></div>
          </div>
        </div>
        <div class="saucer-bottom"></div>
        <div class="needle-shaft"></div>
        <div class="needle-legs">
          <div class="leg l1"></div>
          <div class="leg l2"></div>
          <div class="leg l3"></div>
          <div class="leg l4"></div>
        </div>
        <div class="needle-base"></div>
      </div>
      <div class="ground"></div>
    </div>
    
    <div class="content">
      <h1>Progress Bar Lesson: Space Needle Theme</h1>

      <h2>What is a Progress Bar?</h2>
      <p>A progress bar shows how much of a task is complete. Think of the Space Needle—visitors riding the elevator up 520 feet to the observation deck, watching floor numbers light up as you ascend. It shows where you are and how much is left.</p>

      <h2>The 3 Parts of a Progress Bar</h2>

      <h3>The Track (The Full Tower)</h3>
      <p>From ground level to the top deck—represents the total task.</p>
      <ul>
        <li>Background bar showing the complete distance</li>
      </ul>

      <h3>The Fill (Floors Climbed)</h3>
      <p>Progress up the tower—shows how far you've come.</p>
      <ul>
        <li>Colored bar that grows as you complete the task</li>
      </ul>

      <h3>The Label (Floor Display)</h3>
      <p>Digital floor counter in the elevator—tells you exactly where you are.</p>
      <ul>
        <li>Text showing percentage or "Level 3 of 5"</li>
      </ul>

      <h2>5 Design Tips</h2>

      <h3>1. Make it Visible</h3>
      <p>Like the bright floor display in the elevator—easy to see in any light.</p>
      <ul>
        <li>Use clear colors with good contrast</li>
        <li>Make it big enough to notice</li>
      </ul>

      <h3>2. Show Real Progress</h3>
      <p>Like the smooth elevator ride—accurate and honest.</p>
      <ul>
        <li>Update smoothly as tasks complete</li>
        <li>Never fake progress or go backwards</li>
      </ul>

      <h3>3. Use Iconic Colors</h3>
      <p>Space Needle white and orange create recognizable style.</p>
      <ul>
        <li>Match your brand colors</li>
        <li>Use color to show status (green = good, red = error)</li>
      </ul>

      <h3>4. Add Context</h3>
      <p>Like the elevator operator's announcements—tell users what's happening.</p>
      <ul>
        <li>"Loading... 60%"</li>
        <li>"Step 3 of 5 complete"</li>
      </ul>

      <h3>5. Keep it Simple</h3>
      <p>Don't overcomplicate like confusing observation levels.</p>
      <ul>
        <li>One bar, clear message</li>
        <li>Avoid fancy animations that distract</li>
      </ul>

      <h2>Common Mistakes</h2>
      <ul>
        <li>No feedback—users don't know if anything is happening</li>
        <li>Jumping progress—going from 10% to 90% instantly feels fake</li>
        <li>Stuck at 99%—like an elevator frozen between floors</li>
        <li>Too small—like trying to read the floor display from outside</li>
        <li>No message—progress without context confuses users</li>
      </ul>

      <h2>Quick Example</h2>
      <div class="example-box">
        <p><strong>Good:</strong> "Uploading to cloud... [████████░░] 80% - Floor 4 of 5"</p>
        <p><strong>Bad:</strong> [░░░░░░░░░░] (no message, unclear progress)</p>
      </div>

      <h2>Quick Tips</h2>
      <ul>
        <li>Always show feedback when users wait</li>
        <li>Smooth animations feel more professional (like the elevator)</li>
        <li>Add estimated time if possible: "About 40 seconds to top"</li>
        <li>Use motion to show it's working, not frozen</li>
        <li>Celebrate completion—like reaching the stunning 360° view!</li>
      </ul>
    </div>
</div>
</body>

<!-- Quiz Section -->
<div class="quiz-section">
  <h1>🎯 Progress Bar Quiz</h1>
  <p class="subtitle">Test your knowledge of progress bar design principles!</p>
  
  <div class="question" id="q1">
    <div class="question-number">Question 1</div>
    <div class="question-text">
      When designing a progress bar, you should use 
      <input type="text" class="fill-blank" id="answer1" placeholder="Your answer..."> 
      animations to make the bar feel professional and show that the task is actively running.
    </div>
    <p class="hint">💡 Hint: The opposite of jerky or jumpy</p>
    <div class="feedback" id="feedback1"></div>
    <div class="progress-reward" id="reward1">
      <h3>✅ Correct! Watch the difference:</h3>
      <p><strong>Smooth Animation:</strong></p>
      <div class="progress-bar-demo">
        <div class="progress-fill" id="progress1" style="width: 0%">0%</div>
      </div>
      <p style="font-size: 0.95em; margin-top: 12px; color: #69be28;">Smooth progress feels natural and professional!</p>
    </div>
  </div>
  
  <div class="question" id="q2">
    <div class="question-number">Question 2</div>
    <div class="question-text">
      A common mistake is making the progress bar too 
      <input type="text" class="fill-blank" id="answer2" placeholder="Your answer..."> 
      which makes it hard for users to see and track their progress.
    </div>
    <p class="hint">💡 Hint: Not big enough</p>
    <div class="feedback" id="feedback2"></div>
    <div class="progress-reward" id="reward2">
      <h3>🌟 Excellent! Size matters:</h3>
      <p><strong>Processing files...</strong></p>
      <div class="progress-bar-demo">
        <div class="progress-fill" id="progress2" style="width: 0%">0%</div>
      </div>
      <p style="font-size: 0.95em; margin-top: 12px; color: #69be28;">A visible progress bar keeps users informed and engaged!</p>
    </div>
  </div>
  
  <div class="completion-message" id="completion">
    <h2>🏆 Quiz Complete!</h2>
    <p>You've mastered the key principles of progress bar design!</p>
    <p style="margin-top: 15px; font-size: 1.1em;">Ready to build better user experiences! 🎉</p>
  </div>
</div>

<style>
.quiz-section {
  padding: 60px 80px;
  background: linear-gradient(135deg, #002244, #003366);
  color: #fff;
}

.quiz-section h1 {
  font-size: 2.5em;
  color: #69be28 !important;
  margin-bottom: 15px;
  text-align: center;
}

.subtitle {
  color: #87CEEB;
  text-align: center;
  margin-bottom: 40px;
  font-size: 1.2em;
}

.question {
  background: rgba(255,255,255,.1);
  padding: 30px;
  border-radius: 15px;
  margin-bottom: 30px;
  border: 2px solid rgba(255,255,255,.2);
  transition: all 0.3s ease;
}

.question.correct {
  border-color: #69be28;
  background: rgba(105,190,40,.15);
  animation: successPulse 0.5s ease;
}

@keyframes successPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.question-number {
  color: #69be28;
  font-weight: 700;
  font-size: 1.3em;
  margin-bottom: 15px;
}

.question-text {
  color: #ffffff;
  font-size: 1.1em;
  line-height: 1.6;
  margin-bottom: 20px;
}

.fill-blank {
  display: inline-block;
  background: rgba(255,255,255,.2);
  border: 2px solid #69be28;
  border-radius: 8px;
  padding: 10px 18px;
  color: #ffffff;
  font-size: 1em;
  min-width: 180px;
  text-align: center;
  outline: none;
  transition: all 0.3s ease;
}

.fill-blank::placeholder {
  color: rgba(255,255,255,.5);
}

.fill-blank:focus {
  border-color: #87CEEB;
  background: rgba(255,255,255,.3);
  box-shadow: 0 0 0 3px rgba(135,206,235,.2);
}

.fill-blank.correct {
  border-color: #69be28;
  background: rgba(105,190,40,.3);
}

.feedback {
  margin-top: 15px;
  padding: 15px;
  border-radius: 8px;
  font-weight: 600;
  display: none;
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
  background: rgba(105,190,40,.3);
  color: #69be28;
  border: 2px solid #69be28;
}

.feedback.incorrect {
  background: rgba(239,68,68,.2);
  color: #ff6b6b;
  border: 2px solid #ff6b6b;
}

.progress-reward {
  margin-top: 20px;
  padding: 25px;
  background: rgba(105,190,40,.1);
  border: 2px solid #69be28;
  border-radius: 12px;
  display: none;
}

.progress-reward.show {
  display: block;
  animation: slideIn 0.5s ease;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.progress-reward h3 {
  color: #69be28;
  margin-bottom: 15px;
  font-size: 1.3em;
}

.progress-reward p {
  color: #ffffff;
  margin-bottom: 15px;
}

.progress-bar-demo {
  position: relative;
  width: 100%;
  height: 40px;
  background: rgba(255,255,255,.2);
  border-radius: 20px;
  overflow: hidden;
  margin: 20px 0;
  box-shadow: inset 0 2px 4px rgba(0,0,0,.2);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #69be28, #4a7c4e);
  border-radius: 20px;
  transition: width 2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1em;
  box-shadow: 0 2px 8px rgba(105,190,40,.4);
}

.completion-message {
  background: linear-gradient(135deg, #69be28, #4a7c4e);
  padding: 40px;
  border-radius: 15px;
  text-align: center;
  display: none;
  margin-top: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,.3);
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
  margin-bottom: 10px;
  font-size: 2em;
}

.completion-message p {
  color: #ffffff;
  font-size: 1.2em;
}

.hint {
  color: #87CEEB;
  font-size: 0.9em;
  font-style: italic;
  margin-top: 10px;
}

@media (max-width: 768px) {
  .quiz-section {
    padding: 40px 30px;
  }
  
  .quiz-section h1 {
    font-size: 2em;
  }
  
  .fill-blank {
    min-width: 150px;
    font-size: 0.9em;
  }
}
</style>

<script>
const answers = {
  q1: ['smooth', 'fluid', 'seamless'],
  q2: ['small', 'tiny', 'little']
};

let correctCount = 0;

function animateProgress(elementId, targetWidth) {
  const progressBar = document.getElementById(elementId);
  let width = 0;
  const interval = setInterval(() => {
    if (width >= targetWidth) {
      clearInterval(interval);
    } else {
      width += 2;
      progressBar.style.width = width + '%';
      progressBar.textContent = width + '%';
    }
  }, 30);
}

function checkAnswer(questionNum) {
  const input = document.getElementById(`answer${questionNum}`);
  const feedback = document.getElementById(`feedback${questionNum}`);
  const reward = document.getElementById(`reward${questionNum}`);
  const question = document.getElementById(`q${questionNum}`);
  
  const userAnswer = input.value.trim().toLowerCase();
  const correctAnswers = answers[`q${questionNum}`];
  
  if (correctAnswers.includes(userAnswer)) {
    feedback.textContent = questionNum === 1 ? '✓ Perfect! Smooth animations are key!' : '✓ Exactly! Visibility is crucial!';
    feedback.className = 'feedback correct show';
    input.className = 'fill-blank correct';
    question.className = 'question correct';
    reward.className = 'progress-reward show';
    input.disabled = true;
    
    setTimeout(() => {
      const targetWidth = questionNum === 1 ? 65 : 100;
      animateProgress(`progress${questionNum}`, targetWidth);
    }, 300);
    
    correctCount++;
    
    if (correctCount === 2) {
      setTimeout(() => {
        document.getElementById('completion').className = 'completion-message show';
      }, 2500);
    }
  } else if (userAnswer !== '') {
    feedback.textContent = '✗ Not quite! Check the lesson and try again!';
    feedback.className = 'feedback incorrect show';
    setTimeout(() => {
      feedback.className = 'feedback incorrect';
    }, 2000);
  }
}

document.getElementById('answer1').addEventListener('input', () => checkAnswer(1));
document.getElementById('answer2').addEventListener('input', () => checkAnswer(2));

document.getElementById('answer1').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') checkAnswer(1);
});
document.getElementById('answer2').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') checkAnswer(2);
});
</script>