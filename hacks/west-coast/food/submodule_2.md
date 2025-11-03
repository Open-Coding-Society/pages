---
layout: opencs
microblog: true
title: "Los Angeles"
description: "City Two of Food - Los Angeles"
parent: "Los Angeles"
team: "Syntax Terrors"
submodule: 1
categories: [CSP]
tags: [food, losangeles]
author: "Syntax Terrors"
date: 2025-10-24
footer:
  previous: /west-coast/food/SD/
  home: /west-coast/food/
  next: /west-coast/food/SF/
permalink: /west-coast/food/LA/
---

# 🍊 **Los Angeles — Read & Query**
**Objective:** Learn how to retrieve, filter, and display data from your Food Route database — just like reading restaurant menus across the city!

---

## 🌆 **Scene Setup: The LA Menu Mission**
You’ve made it to **Los Angeles**, where food is an art form and information is everything.  
Your task? To *query* the database and uncover details about dishes, chefs, and ratings hidden across the city’s digital menu boards.

🧠 You’ll learn to:
- Use **SELECT** to read data.
- Filter with **WHERE**.
- Sort and limit results.
- Display menu results dynamically.

---

<style>
/* === Theme variables matching submodule 1 === */
:root{
  --bg-0: #060712;            /* page background deep */
  --bg-1: rgba(8,12,25,0.75); /* card background translucent */
  --card-border: rgba(99,102,241,0.18);
  --muted: #94a3b8;
  --text: #e6eef6;
  --accent-1: #8b5cf6;  /* purple */
  --accent-2: #3b82f6;  /* blue */
  --accent-3: #06b6d4;  /* teal/cyan */
  --success: #10b981;
  --danger: #fb7185;
  --glass: rgba(255,255,255,0.03);
  --terminal-bg: #071827;
  --input-border: rgba(148,163,184,0.12);
  --input-bg: rgba(255,255,255,0.02);
  --code-bg: linear-gradient(180deg, rgba(8,12,25,0.6), rgba(12,16,28,0.6));
}

/* Base page */
body {
  background: radial-gradient(1200px 500px at 10% 10%, rgba(59,130,246,0.06), transparent),
              radial-gradient(900px 400px at 90% 80%, rgba(139,92,246,0.05), transparent),
              var(--bg-0);
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  line-height: 1.5;
  padding: 1.25rem;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Headings */
h1, h2, h3, h4 { color: #e6e9ff; margin-top: 0.25rem; }
strong { color: #f8f9ff; }

.table-container {
  width: 90%;
  margin: 20px auto;
  border-collapse: collapse;
  font-family: Inter, ui-sans-serif, system-ui;
  background: var(--bg-1);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(2,6,23,0.45);
}

.table-container th {
  background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
  color: white;
  padding: 12px;
  font-size: 1.2rem;
  font-weight: 600;
}

.table-container td {
  background: var(--bg-1);
  color: var(--text);
  padding: 12px;
  font-size: 1.1rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.table-container tr:nth-child(even) td {
  background: rgba(255,255,255,0.02);
}

.code-button {
  background: linear-gradient(90deg, var(--accent-3), rgba(6,182,212,0.15));
  color: white;
  font-family: Inter, ui-sans-serif, system-ui;
  font-weight: 600;
  font-size: 1rem;
  border: 1px solid rgba(6,182,212,0.18);
  border-radius: 8px;
  padding: 10px 20px;
  margin: 20px auto;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(6,182,212,0.12);
}

.code-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(6,182,212,0.2);
}

.code-snippet {
  display: none;
  background: var(--terminal-bg);
  color: var(--text);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Courier New", monospace;
  padding: 15px;
  border-radius: 8px;
  margin-top: 10px;
  width: 90%;
  overflow-x: auto;
  border: 1px solid var(--card-border);
}

.code-section {
  text-align: center;
}

/* Itinerary Foods Display */
.itinerary-foods {
  background: linear-gradient(135deg, rgba(139,92,246,0.08), rgba(59,130,246,0.06));
  border: 2px solid var(--card-border);
  padding: 1.5rem;
  border-radius: 12px;
  margin: 1.5rem auto;
  width: 90%;
  box-shadow: 0 8px 30px rgba(2,6,23,0.45);
}

.itinerary-foods h3 {
  color: var(--accent-1);
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  text-align: center;
}

.food-item {
  background: rgba(255, 255, 255, 0.02);
  border-left: 4px solid var(--accent-1);
  border-radius: 10px;
  padding: 1rem;
  margin: 0.75rem 0;
  transition: transform 0.2s ease;
  color: var(--text);
}

.food-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(139,92,246,0.2);
  background: rgba(255, 255, 255, 0.04);
}

.food-item h4 {
  color: var(--accent-2);
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.food-item p {
  color: var(--muted);
  margin: 0;
  font-size: 0.95rem;
}

.no-itinerary-msg {
  text-align: center;
  color: var(--muted);
  padding: 2rem;
  font-style: italic;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
}

/* Dropdown explanations */
.topic-dropdown {
  width: 90%;
  max-width: 700px;
  margin: 20px auto;
  font-family: Inter, ui-sans-serif, system-ui;
}

.topic-dropdown summary {
  background: linear-gradient(135deg, var(--accent-2), var(--accent-3));
  color: white;
  padding: 12px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 8px;
  box-shadow: 0 4px 12px rgba(59,130,246,0.15);
}

.topic-dropdown details[open] summary {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.topic-dropdown div {
  background: var(--bg-1);
  color: var(--text);
  padding: 12px;
  border-radius: 0 0 10px 10px;
  font-size: 1rem;
  border: 1px solid var(--card-border);
  border-top: none;
}

/* Quiz styling */
.quiz-container {
  background: var(--bg-1);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(2,6,23,0.45);
  padding: 25px;
  width: 90%;
  max-width: 700px;
  margin: 30px auto;
}

.quiz-container h2 {
  text-align: center;
  color: var(--accent-1);
  margin-bottom: 20px;
}

.quiz-question {
  margin-bottom: 20px;
  color: var(--text);
}

.quiz-option {
  display: block;
  background: rgba(255,255,255,0.02);
  color: var(--text);
  border: 1px solid var(--input-border);
  border-radius: 8px;
  padding: 10px 16px;
  margin: 8px 0;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  text-align: left;
}

.quiz-option:hover {
  background: rgba(255,255,255,0.05);
  transform: scale(1.02);
  border-color: var(--accent-2);
}

.quiz-option.correct {
  background: rgba(16,185,129,0.2);
  border-color: var(--success);
}

.quiz-option.incorrect {
  background: rgba(251,113,133,0.2);
  border-color: var(--danger);
}

#quiz-result, #fill-result {
  margin-top: 20px;
  text-align: center;
  font-weight: 600;
  font-size: 1.2rem;
  color: var(--success);
}

/* XP Progress Bar */
.progress-container {
  width: 90%;
  max-width: 700px;
  margin: 30px auto;
  background: var(--bg-1);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 8px 30px rgba(2,6,23,0.45);
}

.progress-bar {
  background: rgba(2,6,23,0.45);
  border-radius: 12px;
  overflow: hidden;
  height: 16px;
}

.progress-fill {
  background: linear-gradient(90deg, var(--success), #059669);
  height: 100%;
  width: 0%;
  transition: width 1s ease-in-out;
}

.progress-text {
  margin-top: 8px;
  font-weight: bold;
  text-align: right;
  font-family: Inter, ui-sans-serif, system-ui;
  color: var(--text);
}

/* Fill-in-the-blanks styling */
.fill-container {
  width: 90%;
  max-width: 700px;
  margin: 30px auto;
  background: var(--bg-1);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 20px;
  font-family: Inter, ui-sans-serif, system-ui;
  box-shadow: 0 8px 30px rgba(2,6,23,0.45);
}

.fill-container h3 {
  color: var(--accent-2);
}

.fill-container input {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid var(--input-border);
  background: var(--input-bg);
  color: var(--text);
  width: 200px;
  margin: 0 6px;
}

.fill-container button {
  background: linear-gradient(90deg, var(--accent-3), rgba(6,182,212,0.15));
  color: white;
  border: 1px solid rgba(6,182,212,0.18);
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(6,182,212,0.12);
}

.fill-container button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(6,182,212,0.2);
}

/* Task completion styling */
.task-complete { 
  color: var(--success) !important; 
  font-weight: 700; 
}

/* Filter the table to show only itinerary foods */
.table-container tr.hidden-row {
  display: none;
}
</style>

<!-- Itinerary Foods Display -->
<div class="itinerary-foods">
  <h3>🍽️ Your Los Angeles Food Selections</h3>
  <div id="itinerary-foods-display"></div>
</div>

<div class="table-container">
<table id="food-table">
  <tr>
    <th>Food</th>
    <th>Description</th>
  </tr>
  <tr data-food="Korean BBQ">
    <td>🍖 Korean BBQ</td>
    <td>Sizzling short ribs, spicy pork belly, and endless banchan cooked right at your table.</td>
  </tr>
  <tr data-food="Street Tacos (al pastor)">
    <td>🌮 Street Tacos (al pastor)</td>
    <td>Authentic flavors from taco trucks with marinated pork, cilantro, onion, and pineapple.</td>
  </tr>
  <tr data-food="In-N-Out Burger">
    <td>🍔 In-N-Out Burger</td>
    <td>California's iconic fast-food favorite known for fresh ingredients and "Animal Style" fries.</td>
  </tr>
  <tr data-food="Avocado Toast">
    <td>🥑 Avocado Toast</td>
    <td>The brunch classic topped with poached eggs, microgreens, and local sourdough.</td>
  </tr>
  <tr data-food="Ramen & Fusion Dishes">
    <td>🍜 Ramen & Fusion Dishes</td>
    <td>Creative blends of global flavors found in Little Tokyo and beyond.</td>
  </tr>
  <tr data-food="Erewhon">
    <td>🥤 Erewhon</td>
    <td>The trendy health market known for luxury smoothies and influencer culture.</td>
  </tr>
</table>
</div>
<!-- ============================= -->
<!-- 2️⃣ LA Food Learning Tasks -->
<!-- ============================= -->
<div class="topic-dropdown">
  <details open>
    <summary>🍴 LA Food Tasks — Practice</summary>
    <div>
      <ol>
        <li>
          <strong>Korean BBQ:</strong> Use a <code>SELECT</code> query with <code>WHERE</code> to list all Korean BBQ dishes and their prices.
          <br>
          <em>Hint: Filter by category or dish name containing "Korean BBQ".</em>
        </li>

        <li>
          <strong>Street Tacos (al pastor):</strong> Retrieve the top 5 street taco dishes sorted by rating.
          <br>
          <em>Hint: Use <code>ORDER BY rating DESC LIMIT 5</code> to get the highest-rated tacos.</em>
        </li>

        <li>
          <strong>In-N-Out Burger:</strong> Paginate the burger menu showing 3 items per page. Retrieve the results for page 2.
          <br>
          <em>Hint: Use <code>LIMIT</code> and <code>OFFSET</code> to get the correct page.</em>
        </li>

        <li>
          <strong>Avocado Toast:</strong> Find all dishes containing "avocado" using <code>LIKE</code> or full-text search.
          <br>
          <em>Hint: Try <code>WHERE name LIKE '%avocado%'</code>.</em>
        </li>

        <li>
          <strong>Ramen & Fusion Dishes:</strong> Create a query to find all dishes with "noodles" in the ingredients column and explain why adding an index on ingredients would improve query speed.
          <br>
          <em>Hint: Use <code>ILIKE '%noodles%'</code> and think about indexing.</em>
        </li>

        <li>
          <strong>Erewhon 🥤:</strong> Retrieve all Erewhon smoothies under 400 calories and sort them by calories ascending.
          <br>
          <em>Hint: Combine <code>WHERE calories &lt; 400</code> with <code>ORDER BY calories ASC</code>.</em>
        </li>
      </ol>
    </div>
  </details>
</div>


---
<!-- ============================= -->
<!-- 🍊 LA Submodule Learning + Quiz -->
<!-- ============================= -->

<style>
/* Dropdown explanations */
.topic-dropdown {
  width: 90%;
  max-width: 700px;
  margin: 20px auto;
  font-family: Inter, ui-sans-serif, system-ui;
}

.topic-dropdown summary {
  background: linear-gradient(135deg, var(--accent-2), var(--accent-3));
  color: white;
  padding: 12px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 8px;
  box-shadow: 0 4px 12px rgba(59,130,246,0.15);
}

.topic-dropdown details[open] summary {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.topic-dropdown div {
  background: var(--bg-1);
  color: var(--text);
  padding: 12px;
  border-radius: 0 0 10px 10px;
  font-size: 1rem;
  border: 1px solid var(--card-border);
  border-top: none;
}

/* Quiz styling */
.quiz-container {
  background: var(--bg-1);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(2,6,23,0.45);
  padding: 25px;
  width: 90%;
  max-width: 700px;
  margin: 30px auto;
}

.quiz-container h2 {
  text-align: center;
  color: var(--accent-1);
  margin-bottom: 20px;
}

.quiz-question {
  margin-bottom: 20px;
  color: var(--text);
}

.quiz-option {
  display: block;
  background: rgba(255,255,255,0.02);
  color: var(--text);
  border: 1px solid var(--input-border);
  border-radius: 8px;
  padding: 10px 16px;
  margin: 8px 0;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  text-align: left;
}

.quiz-option:hover {
  background: rgba(255,255,255,0.05);
  transform: scale(1.02);
  border-color: var(--accent-2);
}

.quiz-option.correct {
  background: rgba(16,185,129,0.2);
  border-color: var(--success);
}

.quiz-option.incorrect {
  background: rgba(251,113,133,0.2);
  border-color: var(--danger);
}

#quiz-result, #fill-result {
  margin-top: 20px;
  text-align: center;
  font-weight: 600;
  font-size: 1.2rem;
  color: var(--success);
}

/* XP Progress Bar */
.progress-container {
  width: 90%;
  max-width: 700px;
  margin: 30px auto;
  background: var(--bg-1);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 8px 30px rgba(2,6,23,0.45);
}

.progress-bar {
  background: rgba(2,6,23,0.45);
  border-radius: 12px;
  overflow: hidden;
  height: 16px;
}

.progress-fill {
  background: linear-gradient(90deg, var(--success), #059669);
  height: 100%;
  width: 0%;
  transition: width 1s ease-in-out;
}

.progress-text {
  margin-top: 8px;
  font-weight: bold;
  text-align: right;
  font-family: Inter, ui-sans-serif, system-ui;
  color: var(--text);
}

/* Fill-in-the-blanks styling */
.fill-container {
  width: 90%;
  max-width: 700px;
  margin: 30px auto;
  background: var(--bg-1);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 20px;
  font-family: Inter, ui-sans-serif, system-ui;
  box-shadow: 0 8px 30px rgba(2,6,23,0.45);
}

.fill-container h3 {
  color: var(--accent-2);
}

.fill-container input {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid var(--input-border);
  background: var(--input-bg);
  color: var(--text);
  width: 200px;
  margin: 0 6px;
}

.fill-container button {
  background: linear-gradient(90deg, var(--accent-3), rgba(6,182,212,0.15));
  color: white;
  border: 1px solid rgba(6,182,212,0.18);
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(6,182,212,0.12);
}

.fill-container button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(6,182,212,0.2);
}

/* Task completion styling */
.task-complete { 
  color: var(--success) !important; 
  font-weight: 700; 
}
</style>

<!-- ============================= -->
<!-- 1️⃣ Dropdown Explanations -->
<!-- ============================= -->
<div class="topic-dropdown">
  <details>
    <summary>SELECT</summary>
    <div>Retrieves data from a table. Example: <code>SELECT name, price FROM dishes;</code></div>
  </details>
  <details>
    <summary>WHERE</summary>
    <div>Filters rows based on a condition. Example: <code>SELECT * FROM dishes WHERE city='la';</code></div>
  </details>
  <details>
    <summary>Pagination (page & per)</summary>
    <div>Returns a subset of results. Example: <code>/api/dishes?city=la&page=1&per=10</code></div>
  </details>
  <details>
    <summary>Full-text / LIKE Search</summary>
    <div>Search for partial matches. Example: <code>WHERE ingredient ILIKE '%avocado%'</code></div>
  </details>
  <details>
    <summary>Indices</summary>
    <div>Speeds up queries on a column. Example: <code>CREATE INDEX idx_ingredient_name ON ingredient(name);</code></div>
  </details>
</div>

<!-- ============================= -->
<!-- 2️⃣ Quiz: 5 Questions, 40 XP -->
<!-- ============================= -->
<div class="quiz-container">
  <h2>🧠 LA SQL Quiz (40 XP)</h2>

  <div class="quiz-question">
    <p>1️⃣ Which SQL command retrieves rows from a table?</p>
    <button class="quiz-option" onclick="checkAnswer(this,true)">SELECT</button>
    <button class="quiz-option" onclick="checkAnswer(this,false)">INSERT</button>
    <button class="quiz-option" onclick="checkAnswer(this,false)">UPDATE</button>
    <button class="quiz-option" onclick="checkAnswer(this,false)">DELETE</button>
  </div>

  <div class="quiz-question">
    <p>2️⃣ Which clause filters rows based on a condition?</p>
    <button class="quiz-option" onclick="checkAnswer(this,false)">GROUP BY</button>
    <button class="quiz-option" onclick="checkAnswer(this,true)">WHERE</button>
    <button class="quiz-option" onclick="checkAnswer(this,false)">ORDER BY</button>
  </div>

  <div class="quiz-question">
    <p>3️⃣ Which query would show only 10 results per page?</p>
    <button class="quiz-option" onclick="checkAnswer(this,true)">LIMIT 10 OFFSET 0</button>
    <button class="quiz-option" onclick="checkAnswer(this,false)">SELECT TOP 10</button>
    <button class="quiz-option" onclick="checkAnswer(this,false)">WHERE row<10</button>
  </div>

  <div class="quiz-question">
    <p>4️⃣ Which keyword allows partial text matching?</p>
    <button class="quiz-option" onclick="checkAnswer(this,false)">FULLTEXT</button>
    <button class="quiz-option" onclick="checkAnswer(this,true)">LIKE</button>
    <button class="quiz-option" onclick="checkAnswer(this,false)">MATCH</button>
  </div>

  <div class="quiz-question">
    <p>5️⃣ Which SQL command creates an index for faster queries?</p>
    <button class="quiz-option" onclick="checkAnswer(this,true)">CREATE INDEX</button>
    <button class="quiz-option" onclick="checkAnswer(this,false)">CREATE TABLE</button>
    <button class="quiz-option" onclick="checkAnswer(this,false)">ALTER TABLE</button>
  </div>

  <div id="quiz-result"></div>
</div>

<!-- ============================= -->
<!-- 3️⃣ Fill-in-the-blanks: 50 XP -->
<!-- ============================= -->
<div class="fill-container">
  <h3>📝 Fill in the blanks (50 XP)</h3>
  <p>Write the SQL to find dishes with 'halibut' and calories over 300:</p>
  <input type="text" id="blank1" placeholder="SELECT ...">
  <input type="text" id="blank2" placeholder="FROM ...">
  <input type="text" id="blank3" placeholder="WHERE ...">
  <button onclick="checkBlanks()">Submit</button>
  <div id="fill-result"></div>
</div>

<!-- ============================= -->
<!-- 4️⃣ LA XP Progress Bar -->
<!-- ============================= -->
<div class="progress-container">
  <div class="progress-bar">
    <div id="progress-fill" class="progress-fill"></div>
  </div>
  <div class="progress-text">XP: <span id="total-xp">0</span> / 90</div>
</div>

<!-- ============================= -->
<!-- ⚙️ JS Logic -->
<!-- ============================= -->
<script>
// -----------------------------
// Quiz XP (5 questions, 8 XP each = 40 XP max)
// -----------------------------
let score = 0;
let totalQuestions = 5;
let answered = 0;
let laXP = parseInt(localStorage.getItem("laXP")) || 0;
let quizCompleted = false;

function updateProgressBar() {
  const progressFill = document.getElementById("progress-fill");
  const progressText = document.getElementById("total-xp");
  const percent = Math.min((laXP / 90)*100, 100);
  progressFill.style.width = percent + "%";
  progressText.textContent = laXP;
}

function checkAnswer(button, correct) {
  const parent = button.parentElement;
  if (parent.classList.contains('answered')) return;
  parent.classList.add('answered');

  if (correct) {
    button.classList.add('correct');
    score++;
  } else {
    button.classList.add('incorrect');
  }

  const options = parent.querySelectorAll('.quiz-option');
  options.forEach(opt => opt.disabled = true);

  answered++;
  
  if (answered === totalQuestions) {
    finishQuiz();
  }
}

function finishQuiz() {
  const earnedXP = score * 8; // 8 XP per correct answer
  const resultElement = document.getElementById("quiz-result");
  
  if (score === totalQuestions) {
    // Perfect score - full 40 XP
    if (!quizCompleted) {
      laXP += 40;
      localStorage.setItem("laXP", laXP);
      updateProgressBar();
      quizCompleted = true;
      
      // Mark Korean BBQ task as complete when quiz is perfected
      if (typeof completeLATask === 'function') {
        completeLATask('koreanbbq');
      }
      
      // Check if we've reached 90 XP and unlock next city
      checkXPCompletion();
    }
    resultElement.innerHTML = `
      <div style="color: #4caf50; font-size: 1.3rem;">
        🎉 Perfect Score! You earned 40 XP!
      </div>
    `;
  } else {
    // Partial score - show what they earned and retry option
    resultElement.innerHTML = `
      <div style="color: #ff9800; font-size: 1.1rem;">
        📊 Score: ${score}/${totalQuestions} (${earnedXP} XP earned)<br>
        <span style="font-size: 0.9rem;">Get all 5 correct for the full 40 XP!</span><br>
        <button onclick="retakeQuiz()" style="
          background: linear-gradient(135deg, #4caf50, #45a049);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 10px;
          transition: transform 0.2s ease;
        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
          🔄 Retake Quiz
        </button>
      </div>
    `;
  }
}

function retakeQuiz() {
  // Reset quiz state
  score = 0;
  answered = 0;
  
  // Reset all question containers
  const questions = document.querySelectorAll('.quiz-question');
  questions.forEach(question => {
    question.classList.remove('answered');
    const options = question.querySelectorAll('.quiz-option');
    options.forEach(option => {
      option.disabled = false;
      option.classList.remove('correct', 'incorrect');
    });
  });
  
  // Clear result
  document.getElementById("quiz-result").innerHTML = '';
  
  // Show encouragement message
  const resultElement = document.getElementById("quiz-result");
  resultElement.innerHTML = `
    <div style="color: #2196f3; font-size: 1rem;">
      🔄 Quiz reset! Try again for the full 40 XP!
    </div>
  `;
  
  setTimeout(() => {
    resultElement.innerHTML = '';
  }, 2000);
}

// -----------------------------
// Fill-in-the-blanks XP (50 XP)
// -----------------------------
function checkBlanks() {
  const a = document.getElementById("blank1").value.trim().toUpperCase();
  const b = document.getElementById("blank2").value.trim().toUpperCase();
  const c = document.getElementById("blank3").value.trim().toUpperCase();
  const result = document.getElementById("fill-result");

  if(a==="SELECT NAME, PRICE" && b==="FROM DISHES" && c==="WHERE NAME LIKE '%HALIBUT%' AND CALORIES>300") {
    result.textContent = "✅ Correct! +50 XP";
    if(!window.fillXPAdded) {
      laXP += 50;
      window.fillXPAdded = true;
      localStorage.setItem("laXP", laXP);
      updateProgressBar();
      
      // Mark fill-in-the-blanks task as complete
      completeLATask('streettacos');
      
      // Check if we've reached 90 XP and unlock next city
      checkXPCompletion();
    }
  } else {
    result.textContent = "❌ Try again! Hint: Use SELECT, FROM, WHERE with LIKE and calories filter.";
  }
}

// Add this to the <script> section at the bottom of submodule_2.md

// Task completion tracking for LA
window.laTaskProgress = {
  koreanbbq: false,
  streettacos: false,
  innout: false,
  avocado: false,
  ramen: false,
  erewhon: false
};

// Load progress from localStorage
function loadLATaskProgress() {
  const saved = localStorage.getItem('la_task_progress');
  if (saved) {
    try {
      window.laTaskProgress = { ...window.laTaskProgress, ...JSON.parse(saved) };
    } catch (e) {
      console.error('Error loading LA task progress:', e);
    }
  }
  updateLAProgressDisplay();
}

// Save progress to localStorage
function saveLATaskProgress() {
  try {
    localStorage.setItem('la_task_progress', JSON.stringify(window.laTaskProgress));
  } catch (e) {
    console.error('Error saving LA task progress:', e);
  }
}

// Mark LA task as complete
window.completeLATask = function(taskName) {
  if (!window.laTaskProgress[taskName]) {
    window.laTaskProgress[taskName] = true;
    saveLATaskProgress();
    updateLAProgressDisplay();
    checkLAModuleCompletion();
  }
};

// Update progress display
function updateLAProgressDisplay() {
  const tasks = ['koreanbbq', 'streettacos', 'innout', 'avocado', 'ramen', 'erewhon'];
  let completedCount = 0;

  tasks.forEach(task => {
    const element = document.getElementById(`task-${task}`);
    if (element) {
      const statusSpan = element.querySelector('.status');
      if (window.laTaskProgress[task]) {
        statusSpan.textContent = 'Complete ✅';
        statusSpan.className = 'status task-complete';
        completedCount++;
      } else {
        statusSpan.textContent = 'Incomplete';
        statusSpan.className = 'status';
      }
    }
  });

  // Update progress bar if it exists
  const percentage = Math.round((completedCount / tasks.length) * 100);
  const percentageElement = document.getElementById('la-completion-percentage');
  const progressBar = document.getElementById('la-progress-bar');
  
  if (percentageElement) percentageElement.textContent = `${percentage}%`;
  if (progressBar) progressBar.style.width = `${percentage}%`;
}

// Check if LA module is complete and unlock next city
function checkLAModuleCompletion() {
  const allTasks = Object.values(window.laTaskProgress);
  const isComplete = allTasks.every(task => task === true);
  
  if (isComplete) {
    const notification = document.getElementById('laUnlockNotification');
    if (notification) {
      notification.style.display = 'block';
      setTimeout(() => notification.style.display = 'none', 4000);
    }
    unlockSanFrancisco();
    console.log('🎉 Los Angeles module completed! San Francisco should now be unlocked.');
  }
}

// Add this new function to check XP completion:
function checkXPCompletion() {
  if (laXP >= 90) {
    // Show unlock notification
    const notification = document.getElementById('laUnlockNotification');
    if (notification) {
      notification.style.display = 'block';
      setTimeout(() => notification.style.display = 'none', 4000);
    }
    
    // Unlock San Francisco (city index 2)
    unlockSanFrancisco();
    console.log('🎉 Los Angeles XP completed (90/90)! San Francisco should now be unlocked.');
  }
}

// Unlock San Francisco (city index 2)
function unlockSanFrancisco() {
  try {
    const saved = localStorage.getItem('city_progress'); 
    let gameProgress = saved ? JSON.parse(saved) : { unlockedCities:[0,1], completedCities:[], totalCitiesCompleted:0 };
    if (!gameProgress.completedCities.includes(1)) {
      gameProgress.completedCities.push(1);
      gameProgress.totalCitiesCompleted++;
    }
    if (!gameProgress.unlockedCities.includes(2)) {
      gameProgress.unlockedCities.push(2);
    }
    localStorage.setItem('city_progress', JSON.stringify(gameProgress));
    console.log('✅ LA Progress updated:', gameProgress);
  } catch (e) {
    console.error('LA Unlock failed:', e);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  loadLATaskProgress();
});

// Initialize
updateProgressBar();
</script>

<!-- Unlock Notification -->
<div id="laUnlockNotification" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(135deg, rgba(255,105,180,0.98), rgba(255,69,180,0.98)); color: white; padding: 20px 36px; border-radius: 14px; font-weight: 700; font-size: 16px; z-index: 10000; box-shadow: 0 30px 80px rgba(255,20,147,0.6); display: none; text-align: center;">
  🎉 San Francisco Unlocked!<br>
  <small style="font-size: 13px; opacity: 0.95;">You can now continue to the next city!</small>
</div>

<!-- Progress Tracker -->
<div class="progress-container" style="background: linear-gradient(135deg, rgba(255,179,71,0.08), rgba(255,105,180,0.06)); border: 1px solid rgba(255,179,71,0.14); padding: 1rem; border-radius: 0.75rem; margin: 1rem 0; color: #333; box-shadow: 0 8px 30px rgba(255,20,147,0.15);">
  <h3 style="color: #ff6f61; margin: 0 0 0.6rem 0;">🎯 Los Angeles Progress Tracker</h3>
  <div id="la-progress-display">
    <div id="task-koreanbbq" class="task-item" style="margin: 0.35rem 0; color: #666;">Task 1: Korean BBQ Quiz - <span class="status">Incomplete</span></div>
    <div id="task-streettacos" class="task-item" style="margin: 0.35rem 0; color: #666;">Task 2: Street Tacos Filter - <span class="status">Incomplete</span></div>
    <div id="task-innout" class="task-item" style="margin: 0.35rem 0; color: #666;">Task 3: In-N-Out Pagination - <span class="status">Incomplete</span></div>
    <div id="task-avocado" class="task-item" style="margin: 0.35rem 0; color: #666;">Task 4: Avocado Search - <span class="status">Incomplete</span></div>
    <div id="task-ramen" class="task-item" style="margin: 0.35rem 0; color: #666;">Task 5: Ramen Indexing - <span class="status">Incomplete</span></div>
    <div id="task-erewhon" class="task-item" style="margin: 0.35rem 0; color: #666;">Task 6: Erewhon Calories - <span class="status">Incomplete</span></div>
  </div>
  <div style="margin-top: 1rem; padding: 0.75rem; background: rgba(255,255,255,0.1); border-radius: 0.5rem;">
    <strong>Completion: <span id="la-completion-percentage">0%</span></strong>
    <div style="background: rgba(255,255,255,0.2); height: 8px; border-radius: 6px; margin-top: 0.5rem;">
      <div id="la-progress-bar" style="background: linear-gradient(90deg, #ff6f61, #ff1493); height: 100%; border-radius: 4px; width: 0%; transition: width 0.3s ease;"></div>
    </div>
  </div>
</div>

<!-- Quick Complete Button for Testing - Bottom Right Corner -->
<button id="quickCompleteBtn" onclick="autoCompleteAllTasks()" style="
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(139,92,246,0.9);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 9999;
  transition: all 0.2s ease;
" onmouseover="this.style.background='rgba(139,92,246,1)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='rgba(139,92,246,0.9)'; this.style.transform='translateY(0)'">
  Complete All Tasks
</button>

<script>
function autoCompleteAllTasks() {
  // Hide the button after clicking
  document.getElementById('quickCompleteBtn').style.display = 'none';
  
  // Auto-complete the quiz with perfect answers
  const questions = document.querySelectorAll('.quiz-question');
  questions.forEach((question, index) => {
    // Get the correct answer buttons based on the quiz structure
    if (index === 0) question.querySelector('button[onclick="checkAnswer(this,true)"]').click(); // SELECT
    if (index === 1) question.querySelector('button[onclick="checkAnswer(this,true)"]').click(); // WHERE
    if (index === 2) question.querySelector('button[onclick="checkAnswer(this,true)"]').click(); // LIMIT 10 OFFSET 0
    if (index === 3) question.querySelector('button[onclick="checkAnswer(this,true)"]').click(); // LIKE
    if (index === 4) question.querySelector('button[onclick="checkAnswer(this,true)"]').click(); // CREATE INDEX
  });
  
  // Auto-fill the fill-in-the-blanks
  setTimeout(() => {
    document.getElementById('blank1').value = 'SELECT NAME, PRICE';
    document.getElementById('blank2').value = 'FROM DISHES';
    document.getElementById('blank3').value = "WHERE NAME LIKE '%HALIBUT%' AND CALORIES>300";
    checkBlanks();
  }, 1000);
  
  // Mark all tasks as complete
  setTimeout(() => {
    completeLATask('koreanbbq');
    completeLATask('streettacos');
    completeLATask('innout');
    completeLATask('avocado');
    completeLATask('ramen');
    completeLATask('erewhon');
    
    showToast('🎉 All tasks completed! San Francisco unlocked!', 4000);
  }, 2000);
}

// Add showToast function if it doesn't exist
if (typeof showToast === 'undefined') {
  window.showToast = function(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #10b981, #059669);
      color: white; padding: 12px 20px; border-radius: 8px; font-weight: 600; z-index: 10000;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
  };
}
</script>
