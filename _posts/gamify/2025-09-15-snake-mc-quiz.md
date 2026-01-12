---
layout: lessonbase
title: "End of Snake Lesson Quiz"
description: "Test your progress after completing the lesson with a short quiz."
type: issues
comments: true
author: "Anvay, Ruta, Vibha, Risha, Neil, Aadi"
permalink: /snake/lesson/quiz

sidebar_title: "🐍 Snake Lessons"
lesson_links:
  - { text: "Lesson 1: Game Debugging", url: "/agile/pair_trio" }
  - { text: "Lesson 2: Frontend", url: "/snake/lesson/frontend" }
  - { text: "Lesson 3: Programming Fundamentals", url: "/snake/lesson/fundamentals" }
  - { text: "Lesson 4: Hacks", url: "/snake/lesson/hacks" }
  - { text: "End of Lesson Quiz", url: "/snake/lesson/quiz" }
  - { text: "Future References", url: "/snake/lesson/future-references" }
enable_timer: true
enable_progress: true
progress_total: 6
enable_badges: true
lesson_key: "quiz"
lesson_badges:
- "quiz"
enable_quiz: true
---

<div class="post">
<header class="post-header">
<h1 class="post-title">Snake Game Programming Quiz</h1>
<p class="post-meta">Test your understanding of <strong>game development and debugging concepts</strong>.</p>
</header>

<article class="post-content">

<style>
body {
  background-color: #000000 !important;
  color: #ffffff;
}

.post {
  background-color: #000000;
}

.quiz-container {
  margin: 2rem 0;
  font-family: inherit;
}

.quiz-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #333333;
}

.quiz-header h2 {
  color: #ffffff;
  font-weight: 400;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.question {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #1a1a1a;
  border: 1px solid #333333;
  border-radius: 4px;
  border-left: 4px solid #2a7ae4;
}

.question-title {
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  line-height: 1.4;
}

.question label {
  display: block;
  margin: 0.75rem 0;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  border-radius: 3px;
  transition: background-color 0.2s ease;
  color: #cccccc;
  font-size: 0.95rem;
}

.question label:hover {
  background-color: #2a2a2a;
}

.question input[type="radio"] {
  margin-right: 0.75rem;
  accent-color: #2a7ae4;
}

.quiz-submit {
  text-align: center;
  margin: 2.5rem 0;
}

.quiz-button {
  background-color: #2a7ae4;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.quiz-button:hover {
  background-color: #1e5bb8;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(42, 122, 228, 0.3);
}

.quiz-button:active {
  transform: translateY(0);
}

#result {
  margin-top: 2rem;
  padding: 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  text-align: center;
  display: none;
  font-size: 1.1rem;
}

.result-perfect {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.result-good {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.result-needs-work {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

code {
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 0.9em;
  color: #ff6b6b;
  background-color: #2a2a2a;
  padding: 0.2em 0.4em;
  border-radius: 3px;
}

@media screen and (max-width: 600px) {
  .question {
    padding: 1rem;
  }
  
  .quiz-button {
    padding: 0.75rem 1.5rem;
    font-size: 0.95rem;
  }
}
</style>

<div class="quiz-container">
  <div class="quiz-header">
    <h2>Snake Game Programming Quiz</h2>
  </div>

  <form id="quizForm">
    
    <div class="question">
      <div class="question-title">1. What are the three main components that make up the Snake game structure?</div>
      <label><input type="radio" name="q1" value="a"> a) HTML, Python, and MySQL</label>
      <label><input type="radio" name="q1" value="b"> b) CSS styling, HTML container, and JavaScript logic</label>
      <label><input type="radio" name="q1" value="c"> c) Frontend, backend, and database</label>
      <label><input type="radio" name="q1" value="d"> d) Canvas, sprites, and animations</label>
    </div>

    <div class="question">
      <div class="question-title">2. In the Snake game's direction system, what do the numbers 0, 1, 2, 3 represent?</div>
      <label><input type="radio" name="q2" value="a"> a) Up, Right, Down, Left</label>
      <label><input type="radio" name="q2" value="b"> b) Left, Up, Right, Down</label>
      <label><input type="radio" name="q2" value="c"> c) Right, Down, Left, Up</label>
      <label><input type="radio" name="q2" value="d"> d) Down, Left, Up, Right</label>
    </div>

    <div class="question">
      <div class="question-title">3. What is the primary purpose of the <code>mainLoop()</code> function in the Snake game?</div>
      <label><input type="radio" name="q3" value="a"> a) To initialize game variables</label>
      <label><input type="radio" name="q3" value="b"> b) To handle user input only</label>
      <label><input type="radio" name="q3" value="c"> c) To continuously update game state, check collisions, and render graphics</label>
      <label><input type="radio" name="q3" value="d"> d) To generate random food positions</label>
    </div>

    <div class="question">
      <div class="question-title">4. Which debugging workflow step comes immediately after 'Set Breakpoints' in the pair programming process?</div>
      <label><input type="radio" name="q4" value="a"> a) Create GitHub Issue</label>
      <label><input type="radio" name="q4" value="b"> b) Live Share Debug Session</label>
      <label><input type="radio" name="q4" value="c"> c) Commit & Push</label>
      <label><input type="radio" name="q4" value="d"> d) Update Burndown</label>
    </div>

    <div class="question">
      <div class="question-title">5. In the Snake game collision detection, what happens when <code>checkBlock(snake[0].x, snake[0].y, food.x, food.y)</code> returns true?</div>
      <label><input type="radio" name="q5" value="a"> a) Game over occurs</label>
      <label><input type="radio" name="q5" value="b"> b) Snake changes direction</label>
      <label><input type="radio" name="q5" value="c"> c) Snake grows, score increases, and new food spawns</label>
      <label><input type="radio" name="q5" value="d"> d) Game speed increases</label>
    </div>

    <div class="quiz-submit">
      <button type="button" class="quiz-button" onclick="checkAnswers()">Submit Quiz</button>
    </div>
    
  </form>

  <div id="result"></div>
</div>

</article>
</div>

<script>
function checkAnswers() {
  const answers = { q1: "b", q2: "a", q3: "c", q4: "b", q5: "c" };
  let score = 0;
  
  // Calculate score
  for (let key in answers) {
    const radios = document.getElementsByName(key);
    let selected = null;
    
    for (let i = 0; i < radios.length; i++) {
      if (radios[i].checked) {
        selected = radios[i].value;
        break;
      }
    }
    
    if (selected === answers[key]) {
      score++;
    }
  }
  
  // Determine feedback
  let message = "";
  let resultClass = "";
  
  if (score === 5) {
    message = "🌟 Perfect! You mastered these concepts!";
    resultClass = "result-perfect";
  } else if (score >= 3) {
    message = "👍 Good job! Review a bit more to nail it.";
    resultClass = "result-good";
  } else {
    message = "📘 Keep practicing — try reviewing the lesson again.";
    resultClass = "result-needs-work";
  }
  
  // Display results
  const resultDiv = document.getElementById("result");
  resultDiv.className = resultClass;
  resultDiv.innerHTML = "Your Score: " + score + " / 5<br>" + message;
  resultDiv.style.display = "block";
  
  // Smooth scroll to result
  resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
</script>