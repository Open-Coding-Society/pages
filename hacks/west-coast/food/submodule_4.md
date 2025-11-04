---
layout: opencs
microblog: True  
title: "Seattle"
description: "City Four of Food - Seattle"
permalink: /west-coast/food/SEA/
parent: "Seattle"
team: "Syntax Terrors"
submodule: 4
categories: [CSP]
tags: [food, seattle, delete, crud]
author: "Syntax Terrors"
date: 2025-10-24
footer:
  home: /west-coast/food/
  previous: /west-coast/food/SF/
---

<style>
/* === Theme variables matching other submodules === */
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
}

/* Base page styling */
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
h1, h2, h3, h4 { 
  color: #e6e9ff; 
  margin-top: 0.25rem; 
}
strong { 
  color: #f8f9ff; 
}

.sq-card {
  border-radius: .8rem;
  padding: 1.2rem;
  background: var(--bg-1);
  box-shadow: 0 8px 32px rgba(2,6,23,0.45);
  margin-bottom: 1.2rem;
  border: 1px solid var(--card-border);
}

.sq-card, .sq-card h3, .sq-card p, .sq-card label, .sq-card input, .sq-card select, .sq-card pre, .sq-card ul, .sq-card li {
  color: var(--text) !important;
}

.sq-card h3 {
  color: var(--accent-1) !important;
  margin-bottom: 0.75rem;
}

.sq-btn {
  background: linear-gradient(90deg, var(--accent-3), rgba(6,182,212,0.15));
  color: white;
  border: 1px solid rgba(6,182,212,0.18);
  border-radius: 8px;
  padding: .6rem 1.1rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(6,182,212,0.12);
  transition: all 0.3s ease;
  font-family: Inter, ui-sans-serif, system-ui;
}

.sq-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(6,182,212,0.2);
}

.sq-toast {
  position: fixed;
  right: 1.5rem;
  top: 1.5rem;
  background: linear-gradient(135deg, var(--success), #059669);
  color: white;
  padding: .7rem 1.2rem;
  border-radius: .7rem;
  font-weight: 600;
  display: none;
  z-index: 9999;
  box-shadow: 0 8px 20px rgba(16,185,129,0.3);
}

.progress-tracker {
  background: var(--bg-1);
  border: 1px solid var(--card-border);
  padding: 1.2rem;
  border-radius: 1rem;
  margin: 1.2rem 0;
  color: var(--text);
  box-shadow: 0 8px 32px rgba(2,6,23,0.45);
}

.progress-tracker h3 {
  color: var(--accent-2) !important;
  margin: 0 0 1rem 0;
}

.task-complete {
  color: var(--success) !important;
  font-weight: 700;
}

.unlock-notification {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
  color: white;
  padding: 28px 56px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 20px;
  z-index: 10000;
  box-shadow: 0 20px 60px rgba(139,92,246,0.4);
  display: none;
  text-align: center;
}

.sq-field {
  padding: 0.6rem;
  border-radius: 0.5rem;
  border: 1px solid var(--input-border);
  width: 100%;
  background: var(--input-bg);
  color: var(--text);
  outline: none;
  box-shadow: inset 0 -1px 0 rgba(255,255,255,0.01);
  font-size: 0.95rem;
  font-family: Inter, ui-sans-serif, system-ui;
}

.sq-field:focus {
  border-color: var(--accent-2);
  box-shadow: 0 0 0 2px rgba(59,130,246,0.1);
}

.sq-field option {
  background: var(--terminal-bg);
  color: var(--text);
}

.sq-label {
  display: block;
  margin-bottom: 0.45rem;
  font-weight: 600;
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui;
}

.code-editor {
  background: var(--terminal-bg);
  color: var(--text);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Courier New", monospace;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--card-border);
  width: 100%;
  min-height: 200px;
  resize: vertical;
  font-size: 0.9rem;
}

.sq-terminal {
  background: var(--terminal-bg);
  color: var(--text);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Courier New", monospace;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--card-border);
  min-height: 100px;
  white-space: pre-wrap;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  overflow-x: auto;
}

/* Task items styling */
.task-item {
  margin: 0.5rem 0;
  padding: 0.5rem;
  background: rgba(255,255,255,0.02);
  border-radius: 6px;
  border-left: 3px solid var(--accent-3);
}

/* Collapsible styling */
details {
  border: 1px solid var(--card-border);
  border-radius: 8px;
  margin-bottom: 1rem;
  background: var(--bg-1);
  box-shadow: 0 4px 12px rgba(2,6,23,0.3);
}

details summary {
  background: linear-gradient(135deg, var(--accent-2), var(--accent-1));
  color: white;
  padding: 1rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  font-size: 1.1rem;
  list-style: none;
  transition: all 0.3s ease;
}

details summary::-webkit-details-marker {
  display: none;
}

details summary::before {
  content: "▶";
  margin-right: 0.5rem;
  transition: transform 0.3s ease;
}

details[open] summary::before {
  transform: rotate(90deg);
}

details[open] summary {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

details .sq-card {
  margin: 0;
  border-top: none;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.quiz-block {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(99,102,241,0.2);
}

.quiz-question {
  margin: 0.5rem 0;
}

.quiz-question input[type="radio"] {
  margin-right: 0.5rem;
}

.quiz-feedback {
  margin-top: 0.5rem;
  font-weight: 600;
}
</style>

# 🌲 Seattle — DELETE & ANALYTICS (CRUD Submodule 4)

**Quest Chapter:** *The Food Route*  
**Focus:** D in CRUD — **DELETE & ANALYZE**  
**Location:** Seattle, WA ☕🐚🌧️  

Final stop! In Seattle, learners practice DELETE operations and ANALYTICS queries through six food-focused activities.

---

<!-- Progress Tracker -->
<div class="progress-tracker">
  <h3>🎯 Seattle Progress Tracker</h3>
  <div id="progress-display">
    <div id="task-salmon" class="task-item">🐟 Fresh Salmon - <span class="status">Incomplete</span></div>
    <div id="task-chowder" class="task-item">🥣 Pike Place Market Chowder - <span class="status">Incomplete</span></div>
    <div id="task-crab" class="task-item">🦀 Dungeness Crab - <span class="status">Incomplete</span></div>
    <div id="task-coffee" class="task-item">☕ Coffee Culture - <span class="status">Incomplete</span></div>
    <div id="task-oysters" class="task-item">🦪 Oysters & Shellfish - <span class="status">Incomplete</span></div>
    <div id="task-sourdough" class="task-item">🥖 Sourdough Bowl - <span class="status">Incomplete</span></div>
  </div>
  <div style="margin-top: 1rem; padding: 0.75rem; background: rgba(255,255,255,0.01); border-radius: 0.5rem;">
    <strong>Completion: <span id="completion-percentage">0%</span></strong>
    <div style="background: rgba(2,6,23,0.45); height: 8px; border-radius: 6px; margin-top: 0.5rem;">
      <div id="progress-bar" style="background: linear-gradient(90deg, var(--success), #059669); height: 100%; border-radius: 4px; width: 0%; transition: width 0.3s ease;"></div>
    </div>
  </div>
</div>

<div class="sq-toast" id="sqToast">Seattle +15 XP</div>

<!-- Unlock Notification -->
<div id="unlockNotification" class="unlock-notification">
  🎉 CRUD Complete!<br>
  <small style="font-size: 13px; opacity: 0.95;">Congratulations, Database Master!</small>
</div>

- **🧠 What Does DELETE Mean?**  
  - In databases, **DELETE** = permanently removing records from tables.  
  <br>
  - On the web, a client sends DELETE requests to remove data.  
  <br>
  - The server processes:
    - **Identification** of records to delete,  
    - **Cascading deletes** for related data, and  
    - **Validation** to ensure safe removal.  
  <br>
  - Analogy: your database is like a **restaurant inventory**. Deleting = **removing** expired ingredients from storage.

---

<!-- Fresh Salmon -->
<details open>
  <summary>🐟 Fresh Salmon DELETE Operation</summary>
  <div class="sq-card">
    <div class="sq-label">Learn basic <strong>DELETE</strong> operations by removing expired salmon from the database.</div>
    
    <p>You need to remove expired salmon from the database. What SQL command removes records permanently?</p>
    
    <pre class="sq-terminal" style="background: #181e2a; color: #e6eef6; margin-bottom: 1rem;">
-- Example: Delete expired salmon
DELETE FROM fresh_salmon 
WHERE expiry_date < CURRENT_DATE 
  AND quality_grade < 'B'
  AND location = 'seattle';

-- This removes all salmon that is:
-- 1. Past expiry date
-- 2. Below B grade quality  
-- 3. Located in Seattle
    </pre>
    
    <label class="sq-label">Which SQL command deletes records from a table?</label>
    <select id="salmon-query" class="sq-field">
      <option value="">-- Choose your answer --</option>
      <option value="a">SELECT FROM salmon</option>
      <option value="b">DELETE FROM salmon</option>
      <option value="c">UPDATE salmon SET</option>
      <option value="d">INSERT INTO salmon</option>
    </select>
    <button class="sq-btn" onclick="checkSalmon()">🐟 Check Answer</button>
    
    <div class="quiz-block" style="background: rgba(99,102,241,0.06); margin-top:0.5rem;">
      <strong>🧩 Quick Quiz:</strong>
      <div class="quiz-question" data-answer="b">
        <p>1️⃣ What happens if you run DELETE FROM salmon without a WHERE clause?</p>
        <label><input type="radio" name="q1-salmon" value="a"> Only deletes expired salmon</label><br>
        <label><input type="radio" name="q1-salmon" value="b"> Deletes ALL salmon records</label><br>
        <label><input type="radio" name="q1-salmon" value="c"> Does nothing</label>
      </div>
      <button class="sq-btn" onclick="submitSalmonQuiz(this)">Submit Answer</button>
      <div class="quiz-feedback small" style="margin-top:0.5rem;"></div>
    </div>
  </div>
</details>

<!-- Pike Place Market Chowder -->
<details>
  <summary>🥣 Pike Place Market Chowder ANALYTICS</summary>
  <div class="sq-card">
    <div class="sq-label">Master <strong>DELETE analytics</strong> by understanding how to analyze chowder sales before removing old data.</div>
    
    <p>Review this SQL query that analyzes chowder sales data before deletion:</p>
    
    <pre class="sq-terminal" style="background: #181e2a; color: #e6eef6; margin-bottom: 1rem;">
-- Analyze chowder sales before deletion
SELECT 
    chowder_type,
    COUNT(*) as total_orders,
    AVG(price) as avg_price,
    SUM(quantity) as total_sold
FROM chowder_orders 
WHERE order_date >= '2024-01-01'
GROUP BY chowder_type
ORDER BY total_orders DESC;

-- Then delete old orders
DELETE FROM chowder_orders 
WHERE order_date < '2023-01-01';
    </pre>
    
    <label class="sq-label">What does the COUNT(*) function return in this analytics query?</label>
    <select id="chowder-function" class="sq-field">
      <option value="">-- Choose your answer --</option>
      <option value="a">The total price of all orders</option>
      <option value="b">The number of rows for each chowder type</option>
      <option value="c">The average quantity sold</option>
      <option value="d">The earliest order date</option>
    </select>
    <button class="sq-btn" onclick="checkChowder()">🥣 Check Answer</button>
    
    <div class="quiz-block" style="background: rgba(99,102,241,0.06); margin-top:0.5rem;">
      <strong>🧩 Quick Quiz:</strong>
      <div class="quiz-question" data-answer="a">
        <p>1️⃣ Why analyze data before deletion?</p>
        <label><input type="radio" name="q2-chowder" value="a"> To backup important information</label><br>
        <label><input type="radio" name="q2-chowder" value="b"> To make deletion faster</label><br>
        <label><input type="radio" name="q2-chowder" value="c"> To change the data structure</label>
      </div>
      <button class="sq-btn" onclick="submitChowderQuiz(this)">Submit Answer</button>
      <div class="quiz-feedback small" style="margin-top:0.5rem;"></div>
    </div>
  </div>
</details>

<!-- Dungeness Crab -->
<details>
  <summary>🦀 Dungeness Crab CASCADE DELETE</summary>
  <div class="sq-card">
    <div class="sq-label">Learn <strong>CASCADE DELETE</strong> operations where deleting crab dishes also removes related ingredient records.</div>
    
    <p>When deleting a crab dish, related ingredient records must also be removed. What is this called?</p>
    
    <pre class="sq-terminal" style="background: #181e2a; color: #e6eef6; margin-bottom: 1rem;">
-- Cascade Delete Example
-- When we delete a crab dish, related records are automatically removed

DELETE FROM crab_dishes WHERE dish_id = 'crab-001';

-- This automatically triggers:
-- DELETE FROM dish_ingredients WHERE dish_id = 'crab-001';
-- DELETE FROM nutritional_info WHERE dish_id = 'crab-001';
-- DELETE FROM customer_reviews WHERE dish_id = 'crab-001';

-- All related data is cleaned up automatically!
    </pre>
    
    <label class="sq-label">When deleting a parent record also removes child records, this is called:</label>
    <select id="crab-cascade" class="sq-field">
      <option value="">-- Choose your answer --</option>
      <option value="a">Soft Delete</option>
      <option value="b">Cascade Delete</option>
      <option value="c">Archive Delete</option>
      <option value="d">Backup Delete</option>
    </select>
    <button class="sq-btn" onclick="checkCrab()">🦀 Check Answer</button>
    
    <div class="quiz-block" style="background: rgba(99,102,241,0.06); margin-top:0.5rem;">
      <strong>🧩 Quick Quiz:</strong>
      <div class="quiz-question" data-answer="c">
        <p>1️⃣ What's the main benefit of CASCADE DELETE?</p>
        <label><input type="radio" name="q3-crab" value="a"> Faster database queries</label><br>
        <label><input type="radio" name="q3-crab" value="b"> Better security</label><br>
        <label><input type="radio" name="q3-crab" value="c"> Maintains data integrity automatically</label>
      </div>
      <button class="sq-btn" onclick="submitCrabQuiz(this)">Submit Answer</button>
      <div class="quiz-feedback small" style="margin-top:0.5rem;"></div>
    </div>
  </div>
</details>

<!-- Coffee Culture -->
<details>
  <summary>☕ Coffee Culture DELETE with Conditions</summary>
  <div class="sq-card">
    <div class="sq-label">Practice <strong>conditional DELETE</strong> operations by removing old coffee inventory with multiple criteria.</div>
    
    <p>Examine this DELETE operation that removes old coffee inventory:</p>
    
    <pre class="sq-terminal" style="background: #181e2a; color: #e6eef6; margin-bottom: 1rem;">
-- Delete old coffee inventory with multiple conditions
DELETE FROM coffee_inventory 
WHERE roast_date < DATE_SUB(NOW(), INTERVAL 30 DAY)
  AND coffee_type IN ('espresso', 'americano', 'latte')
  AND quantity_remaining < 10
  AND location = 'seattle';

-- This removes coffee that is:
-- 1. Older than 30 days
-- 2. One of the specified types
-- 3. Has less than 10 units remaining
-- 4. Located in Seattle
    </pre>
    
    <label class="sq-label">This DELETE query removes coffee records that are:</label>
    <select id="coffee-group" class="sq-field">
      <option value="">-- Choose your answer --</option>
      <option value="a">More than 30 days old AND have less than 10 remaining</option>
      <option value="b">Exactly 30 days old OR any coffee type</option>
      <option value="c">Any age but only espresso type</option>
      <option value="d">Less than 30 days old with high quantity</option>
    </select>
    <button class="sq-btn" onclick="checkCoffee()">☕ Check Answer</button>
    
    <div class="quiz-block" style="background: rgba(99,102,241,0.06); margin-top:0.5rem;">
      <strong>🧩 Quick Quiz:</strong>
      <div class="quiz-question" data-answer="b">
        <p>1️⃣ What's the difference between AND and OR in DELETE conditions?</p>
        <label><input type="radio" name="q4-coffee" value="a"> No difference</label><br>
        <label><input type="radio" name="q4-coffee" value="b"> AND requires all conditions true, OR requires any condition true</label><br>
        <label><input type="radio" name="q4-coffee" value="c"> OR is faster than AND</label>
      </div>
      <button class="sq-btn" onclick="submitCoffeeQuiz(this)">Submit Answer</button>
      <div class="quiz-feedback small" style="margin-top:0.5rem;"></div>
    </div>
  </div>
</details>

<!-- Oysters & Shellfish -->
<details>
  <summary>🦪 Oysters & Shellfish SOFT DELETE</summary>
  <div class="sq-card">
    <div class="sq-label">Master <strong>SOFT DELETE</strong> operations where records are marked as deleted instead of being permanently removed.</div>
    
    <p>Instead of permanently deleting shellfish records, mark them as inactive. What field typically indicates soft deletion?</p>
    
    <pre class="sq-terminal" style="background: #181e2a; color: #e6eef6; margin-bottom: 1rem;">
-- Soft Delete Example - Mark as deleted instead of removing
UPDATE oysters_shellfish 
SET deleted_at = NOW(),
    is_active = false,
    deleted_by = 'admin'
WHERE oyster_type = 'expired_batch'
  AND harvest_date < '2024-01-01';

-- To "restore" soft deleted records:
UPDATE oysters_shellfish 
SET deleted_at = NULL,
    is_active = true,
    deleted_by = NULL
WHERE oyster_id = 'oy-001';

-- To query only active records:
SELECT * FROM oysters_shellfish WHERE deleted_at IS NULL;
    </pre>
    
    <label class="sq-label">In soft delete, which field marks a record as deleted?</label>
    <select id="oysters-soft" class="sq-field">
      <option value="">-- Choose your answer --</option>
      <option value="a">is_active</option>
      <option value="b">deleted_at</option>
      <option value="c">status</option>
      <option value="d">archived</option>
    </select>
    <button class="sq-btn" onclick="checkOysters()">🦪 Check Answer</button>
    
    <div class="quiz-block" style="background: rgba(99,102,241,0.06); margin-top:0.5rem;">
      <strong>🧩 Quick Quiz:</strong>
      <div class="quiz-question" data-answer="a">
        <p>1️⃣ What's the main advantage of soft delete over hard delete?</p>
        <label><input type="radio" name="q5-oyster" value="a"> Data can be recovered later</label><br>
        <label><input type="radio" name="q5-oyster" value="b"> Uses less storage space</label><br>
        <label><input type="radio" name="q5-oyster" value="c"> Faster query performance</label>
      </div>
      <button class="sq-btn" onclick="submitOysterQuiz(this)">Submit Answer</button>
      <div class="quiz-feedback small" style="margin-top:0.5rem;"></div>
    </div>
  </div>
</details>

<!-- Sourdough Bowl -->
<details>
  <summary>🥖 Sourdough Bowl ANALYTICS with Subquery</summary>
  <div class="sq-card">
    <div class="sq-label">Learn advanced <strong>analytics with subqueries</strong> to analyze sourdough bowl sales before cleanup operations.</div>
    
    <p>Study this complex analytics query for sourdough bowl sales:</p>
    
    <pre class="sq-terminal" style="background: #181e2a; color: #e6eef6; margin-bottom: 1rem;">
-- Complex analytics with subquery before deletion
SELECT 
    location_name,
    AVG(bowl_price) as avg_price,
    COUNT(*) as total_sales
FROM sourdough_sales s
JOIN locations l ON s.location_id = l.id
WHERE s.bowl_price > (
    SELECT AVG(bowl_price) * 0.8 
    FROM sourdough_sales
)
GROUP BY location_name
HAVING COUNT(*) >= 5;

-- After analysis, clean up old low-performing data
DELETE FROM sourdough_sales 
WHERE bowl_price < (SELECT AVG(bowl_price) * 0.5 FROM sourdough_sales)
  AND sale_date < DATE_SUB(NOW(), INTERVAL 90 DAY);
    </pre>
    
    <label class="sq-label">What does the subquery (SELECT AVG(bowl_price) * 0.8 FROM sourdough_sales) calculate?</label>
    <select id="sourdough-avg" class="sq-field">
      <option value="">-- Choose your answer --</option>
      <option value="a">The highest bowl price across all locations</option>
      <option value="b">80% of the average bowl price (a threshold)</option>
      <option value="c">The total number of bowls sold</option>
      <option value="d">The most expensive location's average</option>
    </select>
    <button class="sq-btn" onclick="checkSourdough()">🥖 Check Answer</button>
    
    <div class="quiz-block" style="background: rgba(99,102,241,0.06); margin-top:0.5rem;">
      <strong>🧩 Quick Quiz:</strong>
      <div class="quiz-question" data-answer="c">
        <p>1️⃣ What does HAVING COUNT(*) >= 5 do in this query?</p>
        <label><input type="radio" name="q6-sourdough" value="a"> Limits results to 5 records</label><br>
        <label><input type="radio" name="q6-sourdough" value="b"> Orders by count of 5</label><br>
        <label><input type="radio" name="q6-sourdough" value="c"> Only shows locations with 5 or more sales</label>
      </div>
      <button class="sq-btn" onclick="submitSourdoughQuiz(this)">Submit Answer</button>
      <div class="quiz-feedback small" style="margin-top:0.5rem;"></div>
    </div>
  </div>
</details>

---

## 🎉 Module Complete — Seattle DELETE Mastery

Congratulations! You've mastered **DELETE operations** through Seattle's culinary scene:
- 🐟 **Fresh Salmon**: Basic DELETE operations
- 🥣 **Pike Place Chowder**: Analytics before deletion
- 🦀 **Dungeness Crab**: CASCADE DELETE operations
- ☕ **Coffee Culture**: Conditional DELETE with multiple criteria
- 🦪 **Oysters & Shellfish**: SOFT DELETE operations
- 🥖 **Sourdough Bowl**: Advanced analytics with subqueries

**🎉 CRUD Food Route Complete!** You now understand all four fundamental database operations!

<script>
// Task completion tracking
window.taskProgress = {
  salmon: false,
  chowder: false,
  crab: false,
  coffee: false,
  oysters: false,
  sourdough: false
};

// Helper functions
if(typeof window.showToast!=="function"){
  window.showToast=(txt,ms=2000)=>{
    const b=document.getElementById('sqToast');
    if(!b)return;
    b.textContent=txt;
    b.style.display='block';
    setTimeout(()=>b.style.display='none',ms);
  };
}

// Auto complete function
function autoCompleteAllTasks() {
  document.getElementById('quickCompleteBtn').style.display = 'none';
  
  // Fill in all correct answers
  document.getElementById('salmon-query').value = 'b';
  checkSalmon();
  
  setTimeout(() => {
    document.getElementById('chowder-function').value = 'b';
    checkChowder();
  }, 200);
  
  setTimeout(() => {
    document.getElementById('crab-cascade').value = 'b';
    checkCrab();
  }, 400);
  
  setTimeout(() => {
    document.getElementById('coffee-group').value = 'a';
    checkCoffee();
  }, 600);
  
  setTimeout(() => {
    document.getElementById('oysters-soft').value = 'b';
    checkOysters();
  }, 800);
  
  setTimeout(() => {
    document.getElementById('sourdough-avg').value = 'b';
    checkSourdough();
  }, 1000);
  
  showToast('🎉 All tasks completed! CRUD journey finished!', 4000);
}

// Task check functions
function checkSalmon() {
  const answer = document.getElementById('salmon-query').value;
  if (answer === 'b') {
    showToast('🐟 Correct! DELETE FROM removes records. +15 XP', 3000);
    completeTask('salmon');
  } else if (answer) {
    showToast('❌ Try again! DELETE FROM removes records.', 3000);
  } else {
    showToast('⚠️ Please select an answer first.', 2000);
  }
}

function checkChowder() {
  const answer = document.getElementById('chowder-function').value;
  if (answer === 'b') {
    showToast('🥣 Correct! COUNT(*) counts rows per group. +15 XP', 3000);
    completeTask('chowder');
  } else if (answer) {
    showToast('❌ Try again! COUNT(*) counts the number of records.', 3000);
  } else {
    showToast('⚠️ Please select an answer first.', 2000);
  }
}

function checkCrab() {
  const answer = document.getElementById('crab-cascade').value;
  if (answer === 'b') {
    showToast('🦀 Correct! Cascade Delete removes related records. +15 XP', 3000);
    completeTask('crab');
  } else if (answer) {
    showToast('❌ Try again! When parent deletion triggers child deletion.', 3000);
  } else {
    showToast('⚠️ Please select an answer first.', 2000);
  }
}

function checkCoffee() {
  const answer = document.getElementById('coffee-group').value;
  if (answer === 'a') {
    showToast('☕ Correct! DELETE uses AND to combine conditions. +15 XP', 3000);
    completeTask('coffee');
  } else if (answer) {
    showToast('❌ Try again! Look at the AND conditions carefully.', 3000);
  } else {
    showToast('⚠️ Please select an answer first.', 2000);
  }
}

function checkOysters() {
  const answer = document.getElementById('oysters-soft').value;
  if (answer === 'b') {
    showToast('🦪 Correct! deleted_at marks soft deletion. +15 XP', 3000);
    completeTask('oysters');
  } else if (answer) {
    showToast('❌ Try again! Usually a timestamp field.', 3000);
  } else {
    showToast('⚠️ Please select an answer first.', 2000);
  }
}

function checkSourdough() {
  const answer = document.getElementById('sourdough-avg').value;
  if (answer === 'b') {
    showToast('🥖 Correct! It calculates 80% of average price as a threshold. +15 XP', 3000);
    completeTask('sourdough');
  } else if (answer) {
    showToast('❌ Try again! Look at what AVG(bowl_price) * 0.8 means.', 3000);
  } else {
    showToast('⚠️ Please select an answer first.', 2000);
  }
}

// Quiz functions for each dropdown
window.submitSalmonQuiz = function(button) {
  const quizContainer = button.closest('.quiz-block');
  const question = quizContainer.querySelector('.quiz-question');
  const selectedInput = question.querySelector('input[type="radio"]:checked');
  const feedback = quizContainer.querySelector('.quiz-feedback');
  
  if (!selectedInput) {
    feedback.textContent = '⚠️ Please select an answer first.';
    feedback.style.color = '#fb7185';
    return;
  }
  
  const correctAnswer = question.getAttribute('data-answer');
  const userAnswer = selectedInput.value;
  
  if (userAnswer === correctAnswer) {
    feedback.textContent = '✅ Correct! Always use WHERE clause to avoid deleting everything.';
    feedback.style.color = '#10b981';
  } else {
    feedback.textContent = '❌ Try again! Think about what happens without WHERE conditions.';
    feedback.style.color = '#fb7185';
  }
};

window.submitChowderQuiz = function(button) {
  const quizContainer = button.closest('.quiz-block');
  const question = quizContainer.querySelector('.quiz-question');
  const selectedInput = question.querySelector('input[type="radio"]:checked');
  const feedback = quizContainer.querySelector('.quiz-feedback');
  
  if (!selectedInput) {
    feedback.textContent = '⚠️ Please select an answer first.';
    feedback.style.color = '#fb7185';
    return;
  }
  
  const correctAnswer = question.getAttribute('data-answer');
  const userAnswer = selectedInput.value;
  
  if (userAnswer === correctAnswer) {
    feedback.textContent = '✅ Correct! Analyzing first helps preserve important insights.';
    feedback.style.color = '#10b981';
  } else {
    feedback.textContent = '❌ Try again! Why would you want to analyze before deleting?';
    feedback.style.color = '#fb7185';
  }
};

window.submitCrabQuiz = function(button) {
  const quizContainer = button.closest('.quiz-block');
  const question = quizContainer.querySelector('.quiz-question');
  const selectedInput = question.querySelector('input[type="radio"]:checked');
  const feedback = quizContainer.querySelector('.quiz-feedback');
  
  if (!selectedInput) {
    feedback.textContent = '⚠️ Please select an answer first.';
    feedback.style.color = '#fb7185';
    return;
  }
  
  const correctAnswer = question.getAttribute('data-answer');
  const userAnswer = selectedInput.value;
  
  if (userAnswer === correctAnswer) {
    feedback.textContent = '✅ Correct! CASCADE DELETE ensures no orphaned records remain.';
    feedback.style.color = '#10b981';
  } else {
    feedback.textContent = '❌ Try again! What happens when related data stays consistent?';
    feedback.style.color = '#fb7185';
  }
};

window.submitCoffeeQuiz = function(button) {
  const quizContainer = button.closest('.quiz-block');
  const question = quizContainer.querySelector('.quiz-question');
  const selectedInput = question.querySelector('input[type="radio"]:checked');
  const feedback = quizContainer.querySelector('.quiz-feedback');
  
  if (!selectedInput) {
    feedback.textContent = '⚠️ Please select an answer first.';
    feedback.style.color = '#fb7185';
    return;
  }
  
  const correctAnswer = question.getAttribute('data-answer');
  const userAnswer = selectedInput.value;
  
  if (userAnswer === correctAnswer) {
    feedback.textContent = '✅ Correct! AND requires all conditions, OR requires any condition.';
    feedback.style.color = '#10b981';
  } else {
    feedback.textContent = '❌ Try again! Think about how AND vs OR affects condition matching.';
    feedback.style.color = '#fb7185';
  }
};

window.submitOysterQuiz = function(button) {
  const quizContainer = button.closest('.quiz-block');
  const question = quizContainer.querySelector('.quiz-question');
  const selectedInput = question.querySelector('input[type="radio"]:checked');
  const feedback = quizContainer.querySelector('.quiz-feedback');
  
  if (!selectedInput) {
    feedback.textContent = '⚠️ Please select an answer first.';
    feedback.style.color = '#fb7185';
    return;
  }
  
  const correctAnswer = question.getAttribute('data-answer');
  const userAnswer = selectedInput.value;
  
  if (userAnswer === correctAnswer) {
    feedback.textContent = '✅ Correct! Soft delete allows data recovery and audit trails.';
    feedback.style.color = '#10b981';
  } else {
    feedback.textContent = '❌ Try again! What can you do with soft deleted data?';
    feedback.style.color = '#fb7185';
  }
};

window.submitSourdoughQuiz = function(button) {
  const quizContainer = button.closest('.quiz-block');
  const question = quizContainer.querySelector('.quiz-question');
  const selectedInput = question.querySelector('input[type="radio"]:checked');
  const feedback = quizContainer.querySelector('.quiz-feedback');
  
  if (!selectedInput) {
    feedback.textContent = '⚠️ Please select an answer first.';
    feedback.style.color = '#fb7185';
    return;
  }
  
  const correctAnswer = question.getAttribute('data-answer');
  const userAnswer = selectedInput.value;
  
  if (userAnswer === correctAnswer) {
    feedback.textContent = '✅ Correct! HAVING filters groups after GROUP BY is applied.';
    feedback.style.color = '#10b981';
  } else {
    feedback.textContent = '❌ Try again! HAVING works with grouped data, not individual rows.';
    feedback.style.color = '#fb7185';
  }
};

// Load progress from localStorage
function loadTaskProgress() {
  const saved = localStorage.getItem('sea_task_progress');
  if (saved) {
    try {
      window.taskProgress = { ...window.taskProgress, ...JSON.parse(saved) };
    } catch (e) {
      console.error('Error loading task progress:', e);
    }
  }
  updateProgressDisplay();
}

// Save progress to localStorage
function saveTaskProgress() {
  try {
    localStorage.setItem('sea_task_progress', JSON.stringify(window.taskProgress));
  } catch (e) {
    console.error('Error saving task progress:', e);
  }
}

// Mark task as complete
window.completeTask = function(taskName) {
  if (!window.taskProgress[taskName]) {
    window.taskProgress[taskName] = true;
    saveTaskProgress();
    updateProgressDisplay();
    checkModuleCompletion();
  }
};

// Update progress display
function updateProgressDisplay() {
  const tasks = ['salmon', 'chowder', 'crab', 'coffee', 'oysters', 'sourdough'];
  let completedCount = 0;

  tasks.forEach(task => {
    const element = document.getElementById(`task-${task}`);
    if (element) {
      const statusSpan = element.querySelector('.status');
      if (window.taskProgress[task]) {
        statusSpan.textContent = 'Complete ✅';
        statusSpan.className = 'status task-complete';
        completedCount++;
      } else {
        statusSpan.textContent = 'Incomplete';
        statusSpan.className = 'status';
      }
    }
  });

  // Update progress bar
  const percentage = Math.round((completedCount / tasks.length) * 100);
  const percentageElement = document.getElementById('completion-percentage');
  const progressBar = document.getElementById('progress-bar');
  
  if (percentageElement) percentageElement.textContent = `${percentage}%`;
  if (progressBar) progressBar.style.width = `${percentage}%`;
}

// Check if module is complete
function checkModuleCompletion() {
  const allTasks = Object.values(window.taskProgress);
  const isComplete = allTasks.every(task => task === true);
  
  if (isComplete) {
    // Show completion notification
    const notification = document.getElementById('unlockNotification');
    if (notification) {
      notification.style.display = 'block';
      setTimeout(() => notification.style.display = 'none', 5000);
    }
    
    // Mark Seattle as complete in main navigation
    markSeattleComplete();
    console.log('🎉 Seattle module completed! CRUD journey finished.');
  }
}

// Mark Seattle as complete in the main navigation
function markSeattleComplete() {
  try {
    const saved = localStorage.getItem('city_progress');
    let gameProgress = saved ? JSON.parse(saved) : { 
      unlockedCities: [0, 1, 2, 3], 
      completedCities: [], 
      totalCitiesCompleted: 0 
    };
    
    if (!gameProgress.completedCities.includes(3)) {
      gameProgress.completedCities.push(3);
      gameProgress.totalCitiesCompleted++;
    }
    
    localStorage.setItem('city_progress', JSON.stringify(gameProgress));
    console.log('✅ Seattle marked as complete:', gameProgress);
    
    // Try to notify parent window
    if (window.parent && window.parent.markCityCompleted) {
      window.parent.markCityCompleted(3);
    }
    
  } catch (e) {
    console.error('❌ Seattle completion failed:', e);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  loadTaskProgress();
});
</script>

<!-- Quick Complete Button -->
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

---

### 🎉 Congratulations!

You've completed the full **CRUD Food Route**:
- **San Diego**: CREATE operations
- **Los Angeles**: READ & Query operations  
- **San Francisco**: UPDATE operations
- **Seattle**: DELETE & Analytics operations

You now understand all four fundamental database operations through delicious food-themed examples! 🍽️✨