---
layout: post
title: "Pike Place Market"
description: 
permalink: /west-coast/travel/seattle/pikeplace/
date: 2025-10-21
---
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Pike Place Market - Seattle</title>
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
  .pike-scene {
    background: linear-gradient(180deg, #87CEEB 0%, #a8c8d8 60%, #c8d8e8 100%);
    width: 100%;
    height: 500px;
    position: relative;
  }
  .market-sign {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    width: 450px;
    height: 120px;
    background: linear-gradient(135deg, #c41e3a, #a01828);
    border: 8px solid #8b1520;
    border-radius: 8px;
    display: grid;
    place-items: center;
    box-shadow: 0 12px 30px rgba(0,0,0,.4);
  }
  .market-sign-text {
    color: #fff;
    font-weight: 800;
    font-size: 36px;
    letter-spacing: 4px;
    text-shadow: 3px 3px 6px rgba(0,0,0,.6);
  }
  .clock {
    position: absolute;
    top: 18%;
    left: 15%;
    width: 60px;
    height: 60px;
    background: #fff;
    border: 6px solid #333;
    border-radius: 50%;
    box-shadow: 0 6px 15px rgba(0,0,0,.3);
  }
  .clock-hand {
    position: absolute;
    background: #333;
    transform-origin: bottom;
    left: 50%;
    bottom: 50%;
  }
  .hour-hand {
    width: 4px;
    height: 18px;
    margin-left: -2px;
    animation: rotateHour 120s linear infinite;
  }
  .minute-hand {
    width: 3px;
    height: 24px;
    margin-left: -1.5px;
    animation: rotateMinute 10s linear infinite;
  }
  @keyframes rotateHour {
    to { transform: rotate(360deg); }
  }
  @keyframes rotateMinute {
    to { transform: rotate(360deg); }
  }
  .market-awning {
    position: absolute;
    bottom: 35%;
    left: 10%;
    right: 10%;
    height: 80px;
    background: repeating-linear-gradient(
      90deg,
      #ff6b35 0px,
      #ff6b35 40px,
      #fff 40px,
      #fff 80px
    );
    border: 4px solid #d94515;
    border-radius: 12px 12px 0 0;
    box-shadow: 0 8px 20px rgba(0,0,0,.3);
  }
  .market-stall {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 35%;
    background: linear-gradient(180deg, #8b6f47 0%, #6d5838 100%);
  }
  .crate {
    position: absolute;
    width: 60px;
    height: 50px;
    background: linear-gradient(135deg, #d2a679, #b88a5c);
    border: 3px solid #8b6f47;
    border-radius: 4px;
    bottom: 35%;
  }
  .crate.c1 { left: 20%; }
  .crate.c2 { left: 35%; bottom: 40%; }
  .crate.c3 { right: 25%; }
  .fish {
    position: absolute;
    width: 50px;
    height: 25px;
    background: linear-gradient(135deg, #a8d8ea, #79c7e3);
    border-radius: 50% 50% 50% 0;
    bottom: 45%;
    left: 30%;
    animation: throwFish 3s ease-in-out infinite;
    transform-origin: center;
    border: 2px solid #5aa8c0;
  }
  .fish-eye {
    position: absolute;
    width: 6px;
    height: 6px;
    background: #000;
    border-radius: 50%;
    top: 6px;
    left: 8px;
  }
  .fish-tail {
    position: absolute;
    width: 0;
    height: 0;
    border-left: 15px solid #79c7e3;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    right: -10px;
    top: 50%;
    transform: translateY(-50%);
  }
  @keyframes throwFish {
    0%, 100% { left: 30%; bottom: 45%; transform: rotate(0deg); }
    50% { left: 60%; bottom: 65%; transform: rotate(360deg); }
  }
  .vendor {
    position: absolute;
    bottom: 35%;
    width: 40px;
    height: 70px;
  }
  .vendor.v1 { left: 25%; }
  .vendor.v2 { right: 30%; }
  .vendor-head {
    width: 28px;
    height: 28px;
    background: radial-gradient(circle at 40% 30%, #ffd4a3, #e6b88a);
    border-radius: 50%;
    margin: 0 auto 4px;
    border: 2px solid #cc9966;
  }
  .vendor-body {
    width: 40px;
    height: 35px;
    background: linear-gradient(135deg, #ff6b35, #d94515);
    margin: 0 auto;
    border-radius: 8px;
    border: 2px solid #a83610;
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
    border-left: 4px solid #c41e3a;
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
<div class="pike-scene">
<div class="label">🐟 Pike Place Market</div>
      <div class="clock">
        <div class="clock-hand hour-hand"></div>
        <div class="clock-hand minute-hand"></div>
      </div>
      <div class="market-sign">
        <div class="market-sign-text">PUBLIC MARKET</div>
      </div>
      <div class="market-awning"></div>
      <div class="crate c1"></div>
      <div class="crate c2"></div>
      <div class="crate c3"></div>
      <div class="fish">
        <div class="fish-eye"></div>
        <div class="fish-tail"></div>
      </div>
      <div class="vendor v1">
        <div class="vendor-head"></div>
        <div class="vendor-body"></div>
      </div>
      <div class="vendor v2">
        <div class="vendor-head"></div>
        <div class="vendor-body"></div>
      </div>
      <div class="market-stall"></div>
    </div>
    
    <div class="content">
      <h1>Progress Bar Lesson: Pike Place Market Theme</h1>

      <h2>What is a Progress Bar?</h2>
      <p>A progress bar shows how much of a task is complete. Think of Pike Place Market—shoppers moving through vendor stalls from the fish market to the flower stands, checking items off their list. It shows where you are and how much is left.</p>

      <h2>The 3 Parts of a Progress Bar</h2>

      <h3>The Track (The Full Market)</h3>
      <p>From the famous Pike Place sign to the last vendor—represents the total task.</p>
      <ul>
        <li>Background bar showing the complete distance</li>
      </ul>

      <h3>The Fill (Stalls Visited)</h3>
      <p>Progress through the market—shows how far you've come.</p>
      <ul>
        <li>Colored bar that grows as you complete the task</li>
      </ul>

      <h3>The Label (Vendor Signs)</h3>
      <p>Clear signs at each stall—tells you exactly where you are.</p>
      <ul>
        <li>Text showing percentage or "3 of 10 items checked out"</li>
      </ul>

      <h2>5 Design Tips</h2>

      <h3>1. Make it Visible</h3>
      <p>Like the bright vendor signs—easy to see in the busy market.</p>
      <ul>
        <li>Use clear colors with good contrast</li>
        <li>Make it big enough to notice</li>
      </ul>

      <h3>2. Show Real Progress</h3>
      <p>Like crossing items off your shopping list—accurate and honest.</p>
      <ul>
        <li>Update smoothly as tasks complete</li>
        <li>Never fake progress or go backwards</li>
      </ul>

      <h3>3. Use Market Colors</h3>
      <p>Bright produce colors and fresh fish tones create energy.</p>
      <ul>
        <li>Match your brand colors</li>
        <li>Use color to show status (green = good, red = error)</li>
      </ul>

      <h3>4. Add Context</h3>
      <p>Like vendor shouts calling out specials—tell users what's happening.</p>
      <ul>
        <li>"Processing payment... 60%"</li>
        <li>"2 of 5 items added to cart"</li>
      </ul>

      <h3>5. Keep it Simple</h3>
      <p>Don't overcomplicate like a crowded Saturday morning.</p>
      <ul>
        <li>One bar, clear message</li>
        <li>Avoid fancy animations that distract</li>
      </ul>

      <h2>Common Mistakes</h2>
      <ul>
        <li>No feedback—users don't know if anything is happening</li>
        <li>Jumping progress—going from 10% to 90% instantly feels fake</li>
        <li>Stuck at 99%—like waiting in the checkout line forever</li>
        <li>Too small—like trying to read price signs from across the aisle</li>
        <li>No message—progress without context confuses users</li>
      </ul>

      <h2>Quick Example</h2>
      <div class="example-box">
        <p><strong>Good:</strong> "Adding to cart... [████████░░] 80% - Almost done!"</p>
        <p><strong>Bad:</strong> [░░░░░░░░░░] (no message, unclear progress)</p>
      </div>

      <h2>Quick Tips</h2>
      <ul>
        <li>Always show feedback when users wait</li>
        <li>Smooth animations feel more professional</li>
        <li>Add estimated time if possible: "About 30 seconds remaining"</li>
        <li>Use motion to show it's working, not frozen</li>
        <li>Celebrate completion—like finding the perfect bouquet!</li>
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