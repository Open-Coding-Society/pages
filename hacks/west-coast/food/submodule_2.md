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
.table-container {
  width: 90%;
  margin: 20px auto;
  border-collapse: collapse;
  font-family: "Poppins", sans-serif;
}

.table-container th {
  background-color: #ffb6c1;
  color: white;
  padding: 12px;
  font-size: 1.2rem;
}

.table-container td {
  background-color: #add8e6;
  color: #000;
  padding: 12px;
  font-size: 1.1rem;
}

.table-container tr:nth-child(even) td {
  background-color: #87cefa;
}

.table-container {
  border-radius: 12px;
  overflow: hidden;
}

.code-button {
  display: inline-block;
  background-color: #4b9cd3;
  color: white;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  margin: 20px auto;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.code-button:hover {
  background-color: #357ab7;
  transform: scale(1.05);
}

.code-snippet {
  display: none;
  background-color: #1e1e1e;
  color: #dcdcdc;
  font-family: "Courier New", monospace;
  padding: 15px;
  border-radius: 8px;
  margin-top: 10px;
  width: 90%;
  overflow-x: auto;
}

.code-section {
  text-align: center;
}

/* Itinerary Foods Display */
.itinerary-foods {
  background: linear-gradient(135deg, #ffb6c1, #ff69b4);
  border: 3px solid #ff1493;
  padding: 1.5rem;
  border-radius: 12px;
  margin: 1.5rem auto;
  width: 90%;
  box-shadow: 0 8px 30px rgba(255, 20, 147, 0.3);
}

.itinerary-foods h3 {
  color: white;
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.food-item {
  background: rgba(255, 255, 255, 0.95);
  border-left: 4px solid #ff1493;
  border-radius: 10px;
  padding: 1rem;
  margin: 0.75rem 0;
  transition: transform 0.2s ease;
}

.food-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(255, 20, 147, 0.2);
}

.food-item h4 {
  color: #ff1493;
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.food-item p {
  color: #555;
  margin: 0;
  font-size: 0.95rem;
}

.no-itinerary-msg {
  text-align: center;
  color: white;
  padding: 2rem;
  font-style: italic;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
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
  font-family: "Poppins", sans-serif;
}

.topic-dropdown summary {
  background-color: #ffb347;
  color: white;
  padding: 12px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 8px;
}

.topic-dropdown details[open] summary {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.topic-dropdown div {
  background-color: #fff3e0;
  padding: 12px;
  border-radius: 0 0 10px 10px;
  font-size: 1rem;
}

/* Quiz styling */
.quiz-container {
  background: #fffaf0;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  padding: 25px;
  width: 90%;
  max-width: 700px;
  margin: 30px auto;
}

.quiz-container h2 {
  text-align: center;
  color: #ff6f61;
  margin-bottom: 20px;
}

.quiz-question {
  margin-bottom: 20px;
}

.quiz-option {
  display: block;
  background-color: #e0f7fa;
  color: #333;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  margin: 8px 0;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  width: 100%;
  text-align: left;
}

.quiz-option:hover {
  background-color: #b2ebf2;
  transform: scale(1.02);
}

.quiz-option.correct {
  background-color: #c8e6c9;
}

.quiz-option.incorrect {
  background-color: #ffcdd2;
}

#quiz-result, #fill-result {
  margin-top: 20px;
  text-align: center;
  font-weight: 600;
  font-size: 1.2rem;
  color: #2e7d32;
}

/* XP Progress Bar */
.progress-container {
  width: 90%;
  max-width: 700px;
  margin: 30px auto;
}

.progress-bar {
  background-color: #eee;
  border-radius: 12px;
  overflow: hidden;
  height: 16px;
}

.progress-fill {
  background-color: #4caf50;
  height: 100%;
  width: 0%;
  transition: width 1s ease-in-out;
}

.progress-text {
  margin-top: 8px;
  font-weight: bold;
  text-align: right;
  font-family: "Poppins", sans-serif;
}

/* Fill-in-the-blanks styling */
.fill-container {
  width: 90%;
  max-width: 700px;
  margin: 30px auto;
  background: #f0f4f8;
  border-radius: 12px;
  padding: 20px;
  font-family: "Poppins", sans-serif;
}

.fill-container input {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  width: 200px;
  margin: 0 6px;
}

.fill-container button {
  background-color: #4b9cd3;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.fill-container button:hover {
  background-color: #357ab7;
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
// Quiz XP (5 questions, 40 XP)
// -----------------------------
let score = 0;
let totalQuestions = 5;
let answered = 0;
let laXP = parseInt(localStorage.getItem("laXP")) || 0;

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

  if (correct) button.classList.add('correct');
  else button.classList.add('incorrect');

  const options = parent.querySelectorAll('.quiz-option');
  options.forEach(opt=>opt.disabled=true);

  answered++;
  if (answered===totalQuestions) {
    let earned = scoreXP();
    laXP += earned;
    localStorage.setItem("laXP", laXP);
    updateProgressBar();
    document.getElementById("quiz-result").textContent = `Quiz complete! You earned ${earned} XP`;
  } else if (correct) {
    score++;
  }
}

function scoreXP() {
  return score===totalQuestions? 40: Math.floor((score/totalQuestions)*40);
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
    }
  } else {
    result.textContent = "❌ Try again! Hint: Use SELECT, FROM, WHERE with LIKE and calories filter.";
  }
}

// Initialize
updateProgressBar();
</script>
