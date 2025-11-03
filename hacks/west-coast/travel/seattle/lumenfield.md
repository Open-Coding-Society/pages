---
layout: post
title: "Lumen Field"
description: 
permalink: /west-coast/travel/seattle/lumen/
date: 2025-10-21
---

<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Lumen Field - Seattle</title>
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
  
  .lumen-scene {
    background: linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    width: 100%;
    height: 500px;
    position: relative;
  }
  
  .stadium-lights {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  
  .light-tower {
    position: absolute;
    width: 30px;
    height: 120px;
    background: linear-gradient(135deg, #555, #333);
    border: 2px solid #222;
    border-radius: 4px;
  }
  
  .lt1 { top: 15%; left: 10%; }
  .lt2 { top: 15%; right: 10%; }
  .lt3 { bottom: 40%; left: 8%; }
  .lt4 { bottom: 40%; right: 8%; }
  
  .light-beam {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 60px;
    background: radial-gradient(ellipse at 50% 0%, rgba(255,255,150,.4), transparent 70%);
    animation: lightPulse 3s ease-in-out infinite;
  }
  
  @keyframes lightPulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
  
  .stadium-structure {
    position: absolute;
    bottom: 20%;
    left: 10%;
    right: 10%;
    height: 180px;
    background: linear-gradient(135deg, #2c5f7c, #1a3f56);
    border: 4px solid #0d2a3a;
    border-radius: 80px 80px 0 0;
    box-shadow: inset 0 -20px 40px rgba(0,0,0,.4);
  }
  
  .stadium-seats {
    position: absolute;
    inset: 20px;
    background: repeating-linear-gradient(
      180deg,
      #4a7c4e 0px,
      #4a7c4e 8px,
      #3a6b3f 8px,
      #3a6b3f 16px
    );
    border-radius: 60px 60px 0 0;
  }
  
  .football-field {
    position: absolute;
    bottom: 20%;
    left: 15%;
    right: 15%;
    height: 25%;
    background: linear-gradient(90deg, #2d5016 0%, #3a6b3f 50%, #2d5016 100%);
    border: 3px solid #fff;
  }
  
  .yard-line {
    position: absolute;
    width: 2px;
    height: 100%;
    background: rgba(255,255,255,.6);
    left: var(--x);
  }
  
  .midfield {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 48px;
    font-weight: 800;
    color: rgba(255,255,255,.3);
  }
  
  .football-player {
    position: absolute;
    bottom: 23%;
    width: 30px;
    height: 60px;
    animation: run 4s linear infinite;
  }
  
  .player-helmet {
    width: 26px;
    height: 20px;
    background: linear-gradient(135deg, #002244, #69be28);
    border-radius: 50% 50% 30% 30%;
    margin: 0 auto 2px;
    border: 2px solid #001122;
    position: relative;
  }
  
  .facemask {
    position: absolute;
    bottom: 2px;
    left: 50%;
    transform: translateX(-50%);
    width: 18px;
    height: 8px;
    border: 2px solid #ccc;
    border-radius: 0 0 8px 8px;
    border-top: none;
  }
  
  .jersey {
    width: 30px;
    height: 28px;
    background: linear-gradient(135deg, #002244, #003366);
    margin: 0 auto;
    border-radius: 6px;
    border: 2px solid #001122;
  }
  
  .player-legs {
    display: flex;
    justify-content: space-around;
    padding: 0 6px;
  }
  
  .player-leg {
    width: 10px;
    height: 20px;
    background: #e8e8e8;
    border-radius: 4px;
    border: 1px solid #ccc;
  }
  
  @keyframes run {
    0% { left: 15%; }
    100% { left: 85%; }
  }
  
  .football {
    position: absolute;
    bottom: 35%;
    left: 40%;
    width: 20px;
    height: 12px;
    background: linear-gradient(135deg, #8b4513, #654321);
    border-radius: 50%;
    border: 2px solid #5a3010;
    animation: spiral 4s ease-in-out infinite;
  }
  
  .laces {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 12px;
    height: 2px;
    background: #fff;
  }
  
  @keyframes spiral {
    0%, 100% { left: 40%; bottom: 35%; transform: rotate(0deg); }
    50% { left: 70%; bottom: 50%; transform: rotate(720deg); }
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
    border-left: 4px solid #002244;
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
    <div class="lumen-scene">
      <div class="label">🏈 Lumen Field</div>
      
      <div class="stadium-lights">
        <div class="light-tower lt1">
          <div class="light-beam"></div>
        </div>
        <div class="light-tower lt2">
          <div class="light-beam"></div>
        </div>
        <div class="light-tower lt3">
          <div class="light-beam"></div>
        </div>
        <div class="light-tower lt4">
          <div class="light-beam"></div>
        </div>
      </div>
      
      <div class="stadium-structure">
        <div class="stadium-seats"></div>
      </div>
      
      <div class="football-field">
        <div class="yard-line" style="--x: 20%"></div>
        <div class="yard-line" style="--x: 40%"></div>
        <div class="yard-line" style="--x: 60%"></div>
        <div class="yard-line" style="--x: 80%"></div>
        <div class="midfield">12</div>
      </div>
      
      <div class="football-player">
        <div class="player-helmet">
          <div class="facemask"></div>
        </div>
        <div class="jersey"></div>
        <div class="player-legs">
          <div class="player-leg"></div>
          <div class="player-leg"></div>
        </div>
      </div>
      
      <div class="football">
        <div class="laces"></div>
      </div>
    </div>
    
    <div class="content">
      <h1>Progress Bar Lesson: Lumen Field Theme</h1>

      <h2>What is a Progress Bar?</h2>
      <p>A progress bar shows how much of a task is complete. Think of Lumen Field—fans watching the game clock count down, or the "12th Man" flag raising before kickoff. It shows where you are and how much is left.</p>

      <h2>The 3 Parts of a Progress Bar</h2>

      <h3>The Track (The Field)</h3>
      <p>The full 100 yards—represents the total task.</p>
      <ul>
        <li>Background bar showing the complete distance</li>
      </ul>

      <h3>The Fill (Yards Gained)</h3>
      <p>Progress down the field—shows how far you've come.</p>
      <ul>
        <li>Colored bar that grows as you complete the task</li>
      </ul>

      <h3>The Label (Scoreboard)</h3>
      <p>Game stats and time remaining—tells you exactly where you are.</p>
      <ul>
        <li>Text showing percentage or "3 of 10 steps complete"</li>
      </ul>

      <h2>5 Design Tips</h2>

      <h3>1. Make it Visible</h3>
      <p>Like the giant scoreboard—easy to see from anywhere.</p>
      <ul>
        <li>Use clear colors with good contrast</li>
        <li>Make it big enough to notice</li>
      </ul>

      <h3>2. Show Real Progress</h3>
      <p>Like yard markers on the field—accurate and honest.</p>
      <ul>
        <li>Update smoothly as tasks complete</li>
        <li>Never fake progress or go backwards</li>
      </ul>

      <h3>3. Use Team Colors</h3>
      <p>Seahawks blue and green create excitement.</p>
      <ul>
        <li>Match your brand colors</li>
        <li>Use color to show status (green = good, red = error)</li>
      </ul>

      <h3>4. Add Context</h3>
      <p>Like the play clock—tell users what's happening.</p>
      <ul>
        <li>"Uploading files... 60%"</li>
        <li>"2 of 5 questions answered"</li>
      </ul>

      <h3>5. Keep it Simple</h3>
      <p>Don't overcomplicate like a confusing penalty call.</p>
      <ul>
        <li>One bar, clear message</li>
        <li>Avoid fancy animations that distract</li>
      </ul>

      <h2>Common Mistakes</h2>
      <ul>
        <li>No feedback—users don't know if anything is happening</li>
        <li>Jumping progress—going from 10% to 90% instantly feels fake</li>
        <li>Stuck at 99%—like being at the 1-yard line forever</li>
        <li>Too small—like trying to read the scoreboard from the parking lot</li>
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
        <li>Celebrate completion—like a touchdown celebration!</li>
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