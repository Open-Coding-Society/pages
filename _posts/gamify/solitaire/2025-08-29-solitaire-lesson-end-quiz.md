---
layout: lessonbase
title: End of Lesson Quiz
description: Test your progress after completing the lesson with a short quiz
type: issues
comments: true
permalink: /solitaire/lesson/quiz

sidebar_title: "🎮 Solitaire Lessons"
lesson_links:
  - { text: "Lesson 1: Frontend", url: "/solitaire/lesson/frontend" }
  - { text: "Lesson 2: OOP", url: "/solitaire/lesson/oop" }
  - { text: "Lesson 3: Problem Solving", url: "/solitaire/lesson/problem-solving" }
  - { text: "Lesson 4: LXD", url: "/solitaire/lesson/lxd" }
  - { text: "End of Lesson Quiz", url: "/solitaire/lesson/quiz" }
  - { text: "Future References", url: "/solitaire/lesson/future-references" }

enable_timer: true
enable_progress: true
enable_badges: true
---


<div class="post">
<header class="post-header">
<h1 class="post-title">🎯 End of Lesson Quiz</h1>
<p class="post-meta">Test your understanding of <strong>frontend OOP concepts</strong> in the context of Solitaire.</p>
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
    <h2>Frontend OOP Quiz</h2>
  </div>

  <form id="quizForm">
    
    <div class="question">
      <div class="question-title">1. What is the primary role of HTML in frontend development?</div>
      <label><input type="radio" name="q1" value="a"> a) Styling elements</label>
      <label><input type="radio" name="q1" value="b"> b) Defining structure and semantics</label>
      <label><input type="radio" name="q1" value="c"> c) Handling user interactions</label>
      <label><input type="radio" name="q1" value="d"> d) Making code object-oriented</label>
    </div>

    <div class="question">
      <div class="question-title">2. Which OOP principle ensures each Card object keeps its data safe and consistent?</div>
      <label><input type="radio" name="q2" value="a"> a) Inheritance</label>
      <label><input type="radio" name="q2" value="b"> b) Abstraction</label>
      <label><input type="radio" name="q2" value="c"> c) Encapsulation</label>
      <label><input type="radio" name="q2" value="d"> d) Polymorphism</label>
    </div>

    <div class="question">
      <div class="question-title">3. In Solitaire, different piles (Foundation, Tableau) overriding <code>canAccept()</code> demonstrates which concept?</div>
      <label><input type="radio" name="q3" value="a"> a) Encapsulation</label>
      <label><input type="radio" name="q3" value="b"> b) Polymorphism</label>
      <label><input type="radio" name="q3" value="c"> c) Abstraction</label>
      <label><input type="radio" name="q3" value="d"> d) Responsive Design</label>
    </div>

    <div class="question">
      <div class="question-title">4. Which problem-solving strategy means breaking a big challenge (like building Solitaire) into smaller tasks?</div>
      <label><input type="radio" name="q4" value="a"> a) Decomposition</label>
      <label><input type="radio" name="q4" value="b"> b) Pattern Recognition</label>
      <label><input type="radio" name="q4" value="c"> c) Debugging</label>
      <label><input type="radio" name="q4" value="d"> d) Algorithmic Thinking</label>
    </div>

    <div class="question">
      <div class="question-title">5. Why is visual feedback (like glowing drop zones) important in frontend development?</div>
      <label><input type="radio" name="q5" value="a"> a) It looks cooler</label>
      <label><input type="radio" name="q5" value="b"> b) It confirms user actions immediately</label>
      <label><input type="radio" name="q5" value="c"> c) It makes JavaScript faster</label>
      <label><input type="radio" name="q5" value="d"> d) It reduces code duplication</label>
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
  const answers = { q1: "b", q2: "c", q3: "b", q4: "a", q5: "b" };
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