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

---

<style>
body {
  background-color: #121212;
  color: #e0e0e0;
  font-family: "Poppins", sans-serif;
}

/* Table styling */
.table-container {
  width: 90%;
  margin: 20px auto;
  border-collapse: collapse;
  border-radius: 12px;
  overflow: hidden;
}

.table-container th {
  background-color: #1f1f1f;
  color: #ffffff;
  padding: 12px;
  font-size: 1.1rem;
}

.table-container td {
  background-color: #2a2a2a;
  color: #e0e0e0;
  padding: 12px;
  font-size: 1rem;
}

.table-container tr:nth-child(even) td {
  background-color: #242424;
}

/* Dropdowns */
.topic-dropdown summary {
  background-color: #1f1f1f;
  color: #ffffff;
  padding: 12px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1.1rem;
}

.topic-dropdown div {
  background-color: #181818;
  padding: 12px;
  border-radius: 0 0 10px 10px;
  font-size: 1rem;
  color: #d0d0d0;
}

/* Quiz */
.quiz-container {
  background: #1c1c1c;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.6);
  padding: 25px;
  width: 90%;
  max-width: 700px;
  margin: 30px auto;
}

.quiz-container h2 {
  text-align: center;
  color: #ffffff;
  margin-bottom: 20px;
}

.quiz-option {
  display: block;
  background-color: #2a2a2a;
  color: #e0e0e0;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  margin: 8px 0;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: background-color 0.3s, transform 0.2s;
}

.quiz-option:hover {
  background-color: #3a3a3a;
  transform: scale(1.02);
}

.quiz-option.correct {
  background-color: #4caf50;
  color: #ffffff;
}

.quiz-option.incorrect {
  background-color: #d32f2f;
  color: #ffffff;
}

#quiz-result, #fill-result {
  margin-top: 20px;
  text-align: center;
  font-weight: 600;
  font-size: 1.2rem;
  color: #e0e0e0;
}

/* Fill-in-the-blanks */
.fill-container {
  width: 90%;
  max-width: 700px;
  margin: 30px auto;
  background: #1c1c1c;
  border-radius: 12px;
  padding: 20px;
}

.fill-container input {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #555;
  background: #2a2a2a;
  color: #e0e0e0;
  width: 200px;
  margin: 0 6px;
}

.fill-container button {
  background-color: #3a3a3a;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.fill-container button:hover {
  background-color: #555;
}

/* Links */
a {
  color: #cccccc;
}

a:hover {
  color: #ffffff;
  text-decoration: underline;
}

/* LA Food Tasks box styling */
.task-boxes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin: 20px auto;
  width: 90%;
}

.task-box {
  background-color: #1c1c1c;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.4);
  transition: background-color 0.3s;
}

.task-box:hover {
  background-color: #262626;
}

.task-box h4 {
  color: #ffffff;
  margin-bottom: 8px;
}

.task-box p, .task-box em {
  color: #cfcfcf;
  font-size: 0.95rem;
}
</style>

<!-- ============================= -->
<!-- Food Table -->
<!-- ============================= -->
<div class="table-container">
<table>
  <tr>
    <th>Food</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>🍖 Korean BBQ</td>
    <td>Sizzling short ribs, spicy pork belly, and endless banchan cooked right at your table.</td>
  </tr>
  <tr>
    <td>🌮 Street Tacos (al pastor)</td>
    <td>Authentic flavors from taco trucks with marinated pork, cilantro, onion, and pineapple.</td>
  </tr>
  <tr>
    <td>🍔 In-N-Out Burger</td>
    <td>California’s iconic fast-food favorite known for fresh ingredients and “Animal Style” fries.</td>
  </tr>
  <tr>
    <td>🥑 Avocado Toast</td>
    <td>The brunch classic topped with poached eggs, microgreens, and local sourdough.</td>
  </tr>
  <tr>
    <td>🍜 Ramen & Fusion Dishes</td>
    <td>Creative blends of global flavors found in Little Tokyo and beyond.</td>
  </tr>
  <tr>
    <td>🥤 Erewhon</td>
    <td>The trendy health market known for luxury smoothies and influencer culture.</td>
  </tr>
</table>
</div>
<!-- ============================= -->
<!-- 2️⃣ LA Coding Practice Boxes -->
<!-- ============================= -->
<div class="coding-practice-container">
  <h3>💻 LA SQL Practice</h3>
  <p>Type your SQL code for each food task and check your answer!</p>

  <div id="la-coding-tasks">
    <!-- Tasks will be generated here dynamically -->
  </div>
</div>

<script>
  // Define all LA tasks
  const laTasks = [
    {
      id: "koreanbbq",
      title: "Korean BBQ 🍖",
      hint: "Filter by category or dish name containing 'Korean BBQ'.",
      expected: "SELECT name, price FROM dishes WHERE name LIKE '%Korean BBQ%';"
    },
    {
      id: "streettacos",
      title: "Street Tacos 🌮",
      hint: "Retrieve top 5 street taco dishes sorted by rating.",
      expected: "SELECT name, price FROM dishes WHERE name LIKE '%Street Tacos%' ORDER BY rating DESC LIMIT 5;"
    },
    {
      id: "innout",
      title: "In-N-Out 🍔",
      hint: "Paginate 3 items per page. Retrieve page 2.",
      expected: "SELECT name, price FROM dishes WHERE name LIKE '%In-N-Out%' LIMIT 3 OFFSET 3;"
    },
    {
      id: "avocado",
      title: "Avocado Toast 🥑",
      hint: "Find dishes containing 'avocado'.",
      expected: "SELECT name, price FROM dishes WHERE name LIKE '%avocado%';"
    },
    {
      id: "ramen",
      title: "Ramen & Fusion 🍜",
      hint: "Find dishes with 'noodles' in ingredients and explain indexing.",
      expected: "SELECT name, price FROM dishes WHERE ingredients ILIKE '%noodles%';"
    },
    {
      id: "erewhon",
      title: "Erewhon 🥤",
      hint: "Retrieve smoothies under 400 calories and sort by calories ascending.",
      expected: "SELECT name, calories FROM dishes WHERE name LIKE '%Erewhon%' AND calories < 400 ORDER BY calories ASC;"
    }
  ];

  const container = document.getElementById('la-coding-tasks');

  laTasks.forEach(task => {
    const taskDiv = document.createElement('div');
    taskDiv.style.cssText = "background-color: #1f1f1f; padding: 16px; margin: 16px 0; border-radius: 10px;";

    taskDiv.innerHTML = `
      <h4 style="color:#ffab40; margin-bottom: 6px;">${task.title}</h4>
      <p style="color:#ccc; font-size:0.95rem;">Hint: ${task.hint}</p>
      <textarea id="${task.id}-input" placeholder="Type your SQL here..." rows="4" style="
        width: 100%;
        padding: 12px;
        border-radius: 8px;
        background-color: #2a2a2a;
        color: #e0e0e0;
        font-family: 'Courier New', monospace;
        font-size: 1rem;
        border: 1px solid #444;
        margin-bottom: 8px;
      "></textarea>
      <button id="${task.id}-check-btn" style="
        display: block;
        background-color: #4caf50;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        margin-bottom: 8px;
      ">Check Code ✅</button>
      <div id="${task.id}-result" style="color:#ffcc80; font-weight:600; text-align:center;"></div>
    `;
    container.appendChild(taskDiv);

    // Add click listener for this task
    document.getElementById(`${task.id}-check-btn`).addEventListener('click', () => {
      const userInput = document.getElementById(`${task.id}-input`).value.trim();
      const resultEl = document.getElementById(`${task.id}-result`);

      if(userInput.toUpperCase() === task.expected.toUpperCase()){
        resultEl.style.color = "#4caf50";
        resultEl.textContent = "✅ Correct! Great job!";
      } else {
        resultEl.style.color = "#f44336";
        resultEl.textContent = "❌ Not quite. Check your SELECT, FROM, and WHERE clauses!";
      }
    });
  });
</script>

<!-- ============================= -->
<!-- LA Food Tasks in Boxes -->
<!-- ============================= -->
<div class="task-boxes">
  <div class="task-box">
    <h4>Korean BBQ</h4>
    <p>Use a <code>SELECT</code> query with <code>WHERE</code> to list all Korean BBQ dishes and their prices.</p>
    <em>Hint: Filter by category or dish name containing "Korean BBQ".</em>
  </div>
  <div class="task-box">
    <h4>Street Tacos (al pastor)</h4>
    <p>Retrieve the top 5 street taco dishes sorted by rating.</p>
    <em>Hint: Use <code>ORDER BY rating DESC LIMIT 5</code>.</em>
  </div>
  <div class="task-box">
    <h4>In-N-Out Burger</h4>
    <p>Paginate the burger menu showing 3 items per page. Retrieve the results for page 2.</p>
    <em>Hint: Use <code>LIMIT</code> and <code>OFFSET</code>.</em>
  </div>
  <div class="task-box">
    <h4>Avocado Toast</h4>
    <p>Find all dishes containing "avocado" using <code>LIKE</code> or full-text search.</p>
    <em>Hint: Try <code>WHERE name LIKE '%avocado%'</code>.</em>
  </div>
  <div class="task-box">
    <h4>Ramen & Fusion Dishes</h4>
    <p>Find all dishes with "noodles" in ingredients and explain why an index on ingredients helps.</p>
    <em>Hint: Use <code>ILIKE '%noodles%'</code>.</em>
  </div>
  <div class="task-box">
    <h4>Erewhon 🥤</h4>
    <p>Retrieve all Erewhon smoothies under 400 calories sorted by calories ascending.</p>
    <em>Hint: Combine <code>WHERE calories &lt; 400</code> with <code>ORDER BY calories ASC</code>.</em>
  </div>
</div>

<!-- ============================= -->
<!-- SQL Concept Dropdowns -->
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
<!-- Quiz -->
<!-- ============================= -->
<div class="quiz-container">
  <h2>🧠 LA SQL Quiz</h2>

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
    <button class="quiz-option" onclick="checkAnswer(this,false)">WHERE row&lt;10</button>
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
<!-- Fill-in-the-blanks -->
<!-- ============================= -->
<div class="fill-container">
  <h3>📝 Fill in the blanks</h3>
  <p>Write the SQL to find dishes with 'halibut' and calories over 300:</p>
  <input type="text" id="blank1" placeholder="SELECT ...">
  <input type="text" id="blank2" placeholder="FROM ...">
  <input type="text" id="blank3" placeholder="WHERE ...">
  <button onclick="checkBlanks()">Submit</button>
  <div id="fill-result"></div>
</div>

<!-- ============================= -->
<!-- JS Logic -->
<!-- ============================= -->
<script>
let score = 0;
let totalQuestions = 5;
let answered = 0;

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
  options.forEach(opt=>opt.disabled=true);

  answered++;
  if (answered===totalQuestions) {
    const earned = score===totalQuestions? 40: Math.floor((score/totalQuestions)*40);
    document.getElementById("quiz-result").textContent = `Quiz complete! You earned ${earned} XP (not tracked).`;
  }
}

function checkBlanks() {
  const a = document.getElementById("blank1").value.trim().toUpperCase();
  const b = document.getElementById("blank2").value.trim().toUpperCase();
  const c = document.getElementById("blank3").value.trim().toUpperCase();
  const result = document.getElementById("fill-result");

  if(a==="SELECT NAME, PRICE" && b==="FROM DISHES" && c==="WHERE NAME LIKE '%HALIBUT%' AND CALORIES>300") {
    result.textContent = "✅ Correct!";
  } else {
    result.textContent = "❌ Try again! Hint: Use SELECT, FROM, WHERE with LIKE and calories filter.";
  }
}
</script>
