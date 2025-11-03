---
layout: post
title: "Mount Rainier National Park"
description: 
permalink: /west-coast/travel/seattle/mtrainier/
date: 2025-10-21
---

<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Mount Rainier National Park</title>
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
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,.5);
  }
  
  .rainier-scene {
    background: linear-gradient(180deg, #87CEEB 0%, #a4c8e1 40%, #d5e5f0 100%);
    width: 100%;
    height: 500px;
    position: relative;
  }
  
  .mountain-sky {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 65%;
  }
  
  .mountain-cloud {
    position: absolute;
    background: rgba(255,255,255,.75);
    border-radius: 100px;
    animation: driftCloud 35s linear infinite;
  }
  
  .mc1 {
    width: 120px;
    height: 50px;
    top: 15%;
    left: -150px;
  }
  
  .mc1:before {
    content: "";
    position: absolute;
    width: 60px;
    height: 60px;
    background: rgba(255,255,255,.75);
    border-radius: 50%;
    top: -25px;
    left: 30px;
  }
  
  .mc2 {
    width: 100px;
    height: 45px;
    top: 25%;
    left: -200px;
    animation-delay: 10s;
  }
  
  @keyframes driftCloud {
    to { transform: translateX(calc(100vw + 250px)); }
  }
  
  .mount-rainier {
    position: absolute;
    bottom: 35%;
    left: 50%;
    transform: translateX(-50%);
    width: 500px;
    height: 350px;
  }
  
  .mountain-peak {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 250px solid transparent;
    border-right: 250px solid transparent;
    border-bottom: 350px solid #8a9ba8;
    filter: drop-shadow(0 10px 30px rgba(0,0,0,.3));
  }
  
  .snow-cap {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 150px solid transparent;
    border-right: 150px solid transparent;
    border-bottom: 200px solid #fff;
    filter: drop-shadow(0 0 20px rgba(255,255,255,.8));
  }
  
  .glacier {
    position: absolute;
    width: 80px;
    height: 150px;
    background: linear-gradient(180deg, rgba(255,255,255,.9), rgba(200,220,240,.7));
    top: 140px;
    clip-path: polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%);
  }
  
  .g1 { left: 35%; }
  .g2 { right: 35%; }
  
  .forest-base {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 35%;
    background: linear-gradient(180deg, #2d5016 0%, #1e3a0f 100%);
  }
  
  .tree {
    position: absolute;
    bottom: 35%;
    width: 30px;
    height: 80px;
  }
  
  .tree-trunk {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 8px;
    height: 25px;
    background: #5a3a1f;
    border-radius: 2px;
  }
  
  .tree-foliage {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-bottom: 60px solid #2d5016;
  }
  
  .tree.t1 { left: 15%; }
  .tree.t2 { left: 25%; bottom: 32%; }
  .tree.t3 { left: 35%; }
  .tree.t4 { right: 30%; }
  .tree.t5 { right: 20%; bottom: 33%; }
  .tree.t6 { right: 10%; }
  
  .deer {
    position: absolute;
    bottom: 35%;
    left: 45%;
    width: 50px;
    height: 60px;
    animation: graze 6s ease-in-out infinite;
  }
  
  .deer-body {
    width: 40px;
    height: 30px;
    background: linear-gradient(135deg, #8b6f47, #6d5838);
    border-radius: 40%;
    position: absolute;
    bottom: 20px;
    border: 2px solid #5a3a1f;
  }
  
  .deer-head {
    width: 20px;
    height: 24px;
    background: #8b6f47;
    border-radius: 50% 50% 40% 40%;
    position: absolute;
    top: 0;
    left: 0;
    border: 2px solid #5a3a1f;
  }
  
  .antler {
    position: absolute;
    width: 3px;
    height: 15px;
    background: #5a3a1f;
    top: -2px;
  }
  
  .antler.left { left: 4px; transform: rotate(-20deg); }
  .antler.right { right: 4px; transform: rotate(20deg); }
  
  .antler:before {
    content: "";
    position: absolute;
    width: 3px;
    height: 8px;
    background: #5a3a1f;
    top: 4px;
    left: -3px;
    transform: rotate(-45deg);
  }
  
  .deer-leg {
    width: 6px;
    height: 20px;
    background: #6d5838;
    position: absolute;
    bottom: 0;
    border-radius: 2px;
    border: 1px solid #5a3a1f;
  }
  
  .dl1 { left: 8px; }
  .dl2 { left: 18px; }
  .dl3 { right: 10px; }
  .dl4 { right: 2px; }
  
  @keyframes graze {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(30px); }
  }
  
  .eagle {
    position: absolute;
    width: 40px;
    height: 18px;
    top: 20%;
    left: -60px;
    animation: soar 20s linear infinite;
  }
  
  .eagle:before,
  .eagle:after {
    content: "";
    position: absolute;
    width: 20px;
    height: 12px;
    background: transparent;
    border-top: 4px solid #5a3a1f;
    border-radius: 50%;
  }
  
  .eagle:before {
    left: 0;
    animation: eagleFlap 2s ease-in-out infinite;
  }
  
  .eagle:after {
    right: 0;
    animation: eagleFlap 2s ease-in-out infinite reverse;
  }
  
  @keyframes soar {
    to { left: 110%; top: 30%; }
  }
  
  @keyframes eagleFlap {
    0%, 100% { transform: rotateX(0deg); }
    50% { transform: rotateX(40deg); }
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
    background: black;
    color: #000;
  }
  
  .content h1 {
    font-size: 2.5em;
    color: #000;
    margin-bottom: 30px;
  }
  
  .content h2 {
    font-size: 2em;
    color: #000;
    margin-top: 50px;
    margin-bottom: 20px;
  }
  
  .content h3 {
    font-size: 1.5em;
    color: #000;
    margin-top: 30px;
    margin-bottom: 15px;
  
  .content p {
    line-height: 1.8;
    margin-bottom: 15px;
    font-size: 1.1em;
  }
  
  .content ul {
    margin: 20px 0 20px 30px;
  }
  
  .content li {
    margin-bottom: 10px;
    line-height: 1.6;
  }
  
  .example-box {
    background: #f0f8ff;
    border-left: 4px solid #2c5f7c;
    padding: 20px;
    margin: 30px 0;
    border-radius: 8px;
    color: #000;
  }
  
  .example-box strong {
    color: #000;
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
    <div class="rainier-scene">
      <div class="label">⛰️ Mount Rainier</div>
      
      <div class="mountain-sky">
        <div class="mountain-cloud mc1"></div>
        <div class="mountain-cloud mc2"></div>
      </div>
      
      <div class="mount-rainier">
        <div class="mountain-peak">
          <div class="snow-cap"></div>
          <div class="glacier g1"></div>
          <div class="glacier g2"></div>
        </div>
      </div>
      
      <div class="tree t1">
        <div class="tree-trunk"></div>
        <div class="tree-foliage"></div>
      </div>
      <div class="tree t2">
        <div class="tree-trunk"></div>
        <div class="tree-foliage"></div>
      </div>
      <div class="tree t3">
        <div class="tree-trunk"></div>
        <div class="tree-foliage"></div>
      </div>
      <div class="tree t4">
        <div class="tree-trunk"></div>
        <div class="tree-foliage"></div>
      </div>
      <div class="tree t5">
        <div class="tree-trunk"></div>
        <div class="tree-foliage"></div>
      </div>
      <div class="tree t6">
        <div class="tree-trunk"></div>
        <div class="tree-foliage"></div>
      </div>
      
      <div class="deer">
        <div class="deer-head">
          <div class="antler left"></div>
          <div class="antler right"></div>
        </div>
        <div class="deer-body"></div>
        <div class="deer-leg dl1"></div>
        <div class="deer-leg dl2"></div>
        <div class="deer-leg dl3"></div>
        <div class="deer-leg dl4"></div>
      </div>
      
      <div class="eagle"></div>
      
      <div class="forest-base"></div>
    </div>
    
    <div class="content">
      <h1>Progress Bar Lesson: Mount Rainier National Park Theme</h1>

      <h2>What is a Progress Bar?</h2>
      <p>A progress bar shows how much of a task is complete. Think of Mount Rainier National Park—hikers watching trail markers count up to the summit, or the elevation gain on your climb. It shows where you are and how much is left.</p>

      <h2>The 3 Parts of a Progress Bar</h2>

      <h3>The Track (The Trail)</h3>
      <p>The full trail from Paradise to the summit—represents the total task.</p>
      <ul>
        <li>Background bar showing the complete distance</li>
      </ul>

      <h3>The Fill (Miles Hiked)</h3>
      <p>Progress up the mountain—shows how far you've come.</p>
      <ul>
        <li>Colored bar that grows as you complete the task</li>
      </ul>

      <h3>The Label (Trail Marker)</h3>
      <p>Elevation signs and mile markers—tells you exactly where you are.</p>
      <ul>
        <li>Text showing percentage or "3 of 10 miles complete"</li>
      </ul>

      <h2>5 Design Tips</h2>

      <h3>1. Make it Visible</h3>
      <p>Like trail markers visible through the mist—easy to see from anywhere.</p>
      <ul>
        <li>Use clear colors with good contrast</li>
        <li>Make it big enough to notice</li>
      </ul>

      <h3>2. Show Real Progress</h3>
      <p>Like elevation markers on the trail—accurate and honest.</p>
      <ul>
        <li>Update smoothly as tasks complete</li>
        <li>Never fake progress or go backwards</li>
      </ul>

      <h3>3. Use Nature Colors</h3>
      <p>Mountain blues and forest greens create calm focus.</p>
      <ul>
        <li>Match your brand colors</li>
        <li>Use color to show status (green = good, red = error)</li>
      </ul>

      <h3>4. Add Context</h3>
      <p>Like a trail map—tell users what's happening.</p>
      <ul>
        <li>"Uploading photos... 60%"</li>
        <li>"2 of 5 forms completed"</li>
      </ul>

      <h3>5. Keep it Simple</h3>
      <p>Don't overcomplicate like confusing trail junctions.</p>
      <ul>
        <li>One bar, clear message</li>
        <li>Avoid fancy animations that distract</li>
      </ul>

      <h2>Common Mistakes</h2>
      <ul>
        <li>No feedback—users don't know if anything is happening</li>
        <li>Jumping progress—going from 10% to 90% instantly feels fake</li>
        <li>Stuck at 99%—like being 100 feet from the summit forever</li>
        <li>Too small—like trying to read a trail sign from a mile away</li>
        <li>No message—progress without context confuses users</li>
      </ul>

      <h2>Quick Example</h2>
      <div class="example-box">
        <p><strong>Good:</strong> "Processing images... [████████░░] 80% - 2 minutes left"</p>
        <p><strong>Bad:</strong> [░░░░░░░░░░] (no message, unclear progress)</p>
      </div>

      <h2>Quick Tips</h2>
      <ul>
        <li>Always show feedback when users wait</li>
        <li>Smooth animations feel more professional</li>
        <li>Add estimated time if possible: "About 2 minutes remaining"</li>
        <li>Use motion to show it's working, not frozen</li>
        <li>Celebrate completion—like reaching the summit!</li>
      </ul>
    </div>
  </div>
</body>
</html>

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