---
layout: opencs
microblog: True  
title: "Seattle"
description: "City Four of Food - Seattle"
permalink: /west-coast/food/SEA/
parent: "Seattle"
team: "Syntax Terrors"
submodule: 1
categories: [CSP]
tags: [food, seattle]
author: "Syntax Terrors"
date: 2025-10-24
footer:
  home: /west-coast/food/
  previous: /west-coast/food/SF/
---

# 🌲 Seattle — DELETE & ANALYTICS (CRUD Submodule 4)

**Quest Chapter:** *The Food Route*  
**Focus:** D in CRUD — **DELETE & ANALYZE**  
**Location:** Seattle, WA ☕🐚🌧️  

Final stop! In Seattle, learners archive or delete dishes (like *Clam Chowder in a Sourdough Bread Bowl*) and run analytics to uncover insights about all cities' menus.

---

<style>
.sq-card {
  border-radius: .8rem;
  padding: 1.2rem;
  background: linear-gradient(135deg, #312e81 60%, #7c3aed 100%);
  box-shadow: 0 8px 24px rgba(55, 48, 163, 0.13), 0 1.5px 4px rgba(59,130,246,0.10);
  margin-bottom: 1.2rem;
  border: 1.5px solid #818cf8;
}
.sq-card, .sq-card h3, .sq-card p, .sq-card label, .sq-card input, .sq-card select, .sq-card pre, .sq-card ul, .sq-card li {
  color: #fdf2f8 !important;
}
.sq-terminal, .sq-terminal * {
  color: #fdf2f8 !important;
}
.sq-btn {
  background: linear-gradient(90deg, #38bdf8 60%, #d946ef 100%);
  color: #fff7ed;
  border: none;
  padding: .6rem 1.1rem;
  border-radius: .5rem;
  cursor: pointer;
  font-weight: 700;
  font-size: 1.3rem;
  box-shadow: 0 2px 8px rgba(168,85,247,0.08);
  transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
}
.sq-btn:hover {
  background: linear-gradient(90deg, #d946ef 60%, #38bdf8 100%);
  box-shadow: 0 4px 16px rgba(236,72,153,0.13);
  transform: scale(1.04);
}
.sq-run {
  background: linear-gradient(90deg, #60a5fa 60%, #a78bfa 100%);
  color: #312e81;
}
.sq-run:hover {
  background: linear-gradient(90deg, #a78bfa 60%, #60a5fa 100%);
  color: #312e81;
}
.sq-toast {
  position: fixed;
  right: 1.5rem;
  top: 1.5rem;
  background: linear-gradient(90deg, #818cf8 60%, #f472b6 100%);
  color: #fdf2f8;
  padding: .7rem 1.2rem;
  border-radius: .7rem;
  font-weight: 700;
  display: none;
  z-index: 9999;
  box-shadow: 0 4px 16px rgba(168,85,247,0.13);
}
.progress-tracker {
  background: linear-gradient(135deg, #f5d0fe 60%, #bae6fd 100%);
  border: 2.5px solid #a5b4fc;
  padding: 1.2rem;
  border-radius: 1rem;
  margin: 1.2rem 0;
  color: #312e81;
  box-shadow: 0 2px 8px rgba(168,85,247,0.08);
}
.task-complete {
  color: #f472b6 !important;
  font-weight: bold;
}
.unlock-notification {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, #818cf8 60%, #f472b6 100%);
  color: #fff7ed;
  padding: 28px 56px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 20px;
  z-index: 10000;
  box-shadow: 0 20px 60px rgba(168,85,247,0.18);
  display: none;
  text-align: center;
}

/* Itinerary Foods Display */
.itinerary-foods {
  background: linear-gradient(135deg, rgba(16,185,129,0.15), rgba(6,182,212,0.1));
  border: 2px solid rgba(16,185,129,0.3);
  padding: 1.5rem;
  border-radius: 1rem;
  margin: 1.5rem 0;
  box-shadow: 0 8px 30px rgba(16,185,129,0.2);
}

.itinerary-foods h3 {
  color: #10b981;
  margin: 0 0 1rem 0;
  font-size: 1.3rem;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.food-item {
  background: rgba(30, 41, 59, 0.8);
  border-left: 4px solid #10b981;
  border-radius: 10px;
  padding: 1rem;
  margin: 0.75rem 0;
  transition: transform 0.2s ease;
}

.food-item:hover {
  transform: translateX(4px);
}

.food-item h4 {
  color: #10b981;
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.food-item p {
  color: #d1d5db;
  margin: 0;
  font-size: 0.95rem;
}

.no-itinerary-msg {
  text-align: center;
  color: #d1d5db;
  padding: 2rem;
  font-style: italic;
}

.sq-label {
  display: block;
  margin-bottom: 0.45rem;
  font-weight: 700;
  color: #fdf2f8;
}

.sq-field {
  padding: 0.6rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(148,163,184,0.12);
  width: 100%;
  background: rgba(255,255,255,0.05);
  color: #fdf2f8;
  outline: none;
  box-shadow: inset 0 -1px 0 rgba(255,255,255,0.01);
  font-size: 0.95rem;
}

.sq-terminal {
  background: #071827;
  color: #fdf2f8;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Courier New", monospace;
  font-size: 0.9rem;
  min-height: 3rem;
  white-space: pre-wrap;
  overflow: auto;
  border: 1px solid rgba(255,255,255,0.02);
  box-shadow: inset 0 -1px 0 rgba(255,255,255,0.02);
  margin-top: 0.5rem;
}
</style>

<!-- Itinerary Foods Display -->
<div class="itinerary-foods">
  <h3>🍽️ Your Seattle Food Selections</h3>
  <div id="itinerary-foods-display"></div>
</div>

<!-- Progress Tracker -->
<div class="progress-tracker">
  <h3 style="color:#2dd4bf;">🎯 Seattle Progress Tracker</h3>
  <div id="progress-display">
    <div id="task-archive">🗃️ Task 1: Archive Dish – <span class="status">Incomplete</span></div>
    <div id="task-harddelete">🗑️ Task 2: Hard Delete Cascade – <span class="status">Incomplete</span></div>
    <div id="task-analytics">📊 Task 3: Analytics Dashboard – <span class="status">Incomplete</span></div>
    <div id="task-seed">🌱 Task 4: Seed Seattle Dishes – <span class="status">Incomplete</span></div>
    <div id="task-view">👀 Task 5: View Archived/Active Lists – <span class="status">Incomplete</span></div>
  </div>
  <div style="margin-top:1rem;padding:.75rem;background:rgba(13,148,136,.15);border-radius:.5rem;">
    <strong>Completion: <span id="completion-percentage">0%</span></strong>
    <div style="background:rgba(55,65,81,.5);height:8px;border-radius:4px;margin-top:.5rem;">
      <div id="progress-bar" style="background:linear-gradient(90deg,#10b981,#0d9488);height:100%;border-radius:4px;width:0%;transition:width .3s ease;"></div>
    </div>
  </div>
</div>

<div class="sq-toast" id="sqToast">Seattle +20 XP</div>
<div id="unlockNotification" class="unlock-notification">
  🎉 CRUD Complete!<br><small style="opacity:.9;font-size:14px;">Congratulations, Cleanup Crew!</small>
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
  
  // Auto-complete the quizzes with correct answers
  document.getElementById('archive-quiz').value = 'a';
  checkArchiveQuiz();
  
  document.getElementById('hard-quiz').value = 'dish_ingredients';
  checkHardQuiz();
  
  document.getElementById('analytics-quiz').value = 'b';
  checkAnalyticsQuiz();
  
  // Run the interactive tasks in sequence
  setTimeout(() => {
    seedSeattle();
  }, 500);
  
  setTimeout(() => {
    viewSeattle();
  }, 1000);
  
  setTimeout(() => {
    // Set up some dish IDs for archive/delete operations
    if (SeattleDB.dishes.length > 0) {
      document.getElementById('archive-id').value = SeattleDB.dishes[0].id;
      runArchive();
    }
  }, 1500);
  
  setTimeout(() => {
    if (SeattleDB.dishes.length > 1) {
      document.getElementById('hard-id').value = SeattleDB.dishes[1].id;
      runHard();
    }
  }, 2000);
  
  setTimeout(() => {
    runAnalytics();
  }, 2500);
  
  // Mark all tasks as complete
  setTimeout(() => {
    completeTask('archive');
    completeTask('harddelete');
    completeTask('analytics');
    completeTask('seed');
    completeTask('view');
    
    showToast('🎉 All tasks completed! CRUD journey finished!', 4000);
  }, 3000);
}
</script>

---

### 🧠 What Does DELETE Mean?

In databases, **DELETE** = cleaning up existing records — sometimes gently, sometimes permanently.  
There are **two main approaches**:

### 🗃️ Soft Delete (Archiving)
- Adds a `deleted_at` timestamp instead of erasing the record.  
- The data stays in the database but is hidden from normal queries (`WHERE deleted_at IS NULL`).  
- Allows easy "undo" or "restore" later.  
**Example:** When the Seattle restaurant closes, the *Clam Chowder in a Sourdough Bread Bowl* is archived — it disappears from the active menu but remains in the system for reporting.

### 🗑️ Hard Delete (Cascade)
- Permanently removes a record and all related rows (via **cascading delete**).  
- Cleans out join tables like `dish_ingredients` to prevent orphaned data.  
**Example:** If you fully remove the clam chowder, its linked ingredients ("clams," "bread bowl," "cream") are also deleted — the dish is gone forever.

### 📊 Analytics Dashboard (GROUP BY)
- After cleaning up data, we can **analyze what remains**.  
- Use SQL `GROUP BY` and aggregate functions (`COUNT`, `AVG`, `SUM`) to reveal insights:  
  - Top ingredients used across all cities  
  - Average calories per city  
  - Number of dishes per category  
  - Active vs archived chowders  

**Analogy:**  
Your database is like a restaurant kitchen.  
Soft delete = putting an item in cold storage (it's still there).  
Hard delete = tossing it out completely.  
Analytics = reviewing the kitchen log to see what's sold, archived, or missing — keeping your menu sustainable and efficient.

---

<!-- 🗃️ Soft Delete -->
<div class="sq-card">
  <h3>🗃️ Soft Delete — Archive a Dish</h3>
  <p>
    When you <strong>soft delete</strong> a dish, you don't remove it — you set <code>deleted_at</code>.
    This keeps data for later analysis or restoration.
  </p>
  <p><em>Example:</em> The <strong>Clam Chowder in a Sourdough Bread Bowl</strong> restaurant closes for renovation — we archive, not erase.</p>

  <label class="sq-label">🧩 Question: Why might a restaurant prefer a soft delete?</label>
  <select id="archive-quiz" class="sq-field">
    <option value="">-- choose an answer --</option>
    <option value="a">Because soft delete keeps records for future reports</option>
    <option value="b">Because soft delete frees up disk space</option>
    <option value="c">Because soft delete makes food tastier</option>
  </select>
  <button class="sq-btn" onclick="checkArchiveQuiz()">Check Answer</button>

  <div style="margin-top:1rem"></div>
  <label class="sq-label">Enter Dish ID to Archive (e.g., from Seeded List)</label>
  <input id="archive-id" class="sq-field" placeholder="enter dish id"/>
  <button class="sq-btn sq-run" onclick="runArchive()">Archive Dish</button>
  <pre id="terminal-archive" class="sq-terminal"></pre>
</div>

<!-- 🗑️ Hard Delete -->
<div class="sq-card">
  <h3>🗑️ Hard Delete — Permanent Removal</h3>
  <p>
    <strong>Hard delete</strong> removes the dish and any linked data (e.g., ingredients).  
    Once gone, it's gone forever — like throwing away a spoiled clam chowder.
  </p>

  <label class="sq-label">🧩 Quick Check: What else must be deleted with the dish?</label>
  <input id="hard-quiz" class="sq-field" placeholder="type your answer (hint: join table name)"/>
  <button class="sq-btn" onclick="checkHardQuiz()">Check Answer</button>

  <div style="margin-top:1rem"></div>
  <label class="sq-label">Enter Dish ID to Hard Delete</label>
  <input id="hard-id" class="sq-field" placeholder="enter dish id"/>
  <button class="sq-btn sq-run" onclick="runHard()">Hard Delete</button>
  <pre id="terminal-hard" class="sq-terminal"></pre>
</div>

<!-- 📊 Analytics -->
<div class="sq-card">
  <h3>📊 Analytics Dashboard — GROUP BY Practice</h3>
  <p>
    After cleanup, you can analyze your data.  
    The backend groups dishes by city, category, or ingredient to uncover insights.
  </p>
  <ul style="margin-left:1.2rem; color:#fdf2f8; font-weight:600;">
    <li>Top ingredients across all cities</li>
    <li>Average calories per city</li>
    <li>Number of dishes per category</li>
    <li>Active vs archived chowders</li>
  </ul>

  <label class="sq-label">🧩 Question: Which SQL clause groups rows for analysis?</label>
  <select id="analytics-quiz" class="sq-field">
    <option value="">-- choose an answer --</option>
    <option value="a">WHERE</option>
    <option value="b">GROUP BY</option>
    <option value="c">DELETE FROM</option>
  </select>
  <button class="sq-btn" onclick="checkAnalyticsQuiz()">Check Answer</button>

  <div style="margin-top:1rem"></div>
  <button class="sq-btn sq-run" onclick="runAnalytics()">Run Analytics</button>
  <pre id="terminal-analytics" class="sq-terminal"></pre>
</div>

<!-- 🌱 Seed Dishes -->
<div class="sq-card">
  <h3>🌱 Seed Seattle Dishes</h3>
  <p>Load sample data into your mock database — includes dishes from your itinerary!</p>
  <button class="sq-btn sq-run" onclick="seedSeattle()">Seed Seattle Dishes</button>
  <pre id="terminal-seedsea" class="sq-terminal"></pre>
</div>

<!-- 👀 View Dishes -->
<div class="sq-card">
  <h3>👀 View Active & Archived Lists</h3>
  <p>See which dishes are still active and which ones have been archived using <code>deleted_at</code>.</p>
  <button class="sq-btn sq-run" onclick="viewSeattle()">View Active & Archived</button>
  <pre id="terminal-viewsea" class="sq-terminal"></pre>
</div>

<!-- 🧠 Quiz + Action Logic -->
<script>
/* basic helpers if not yet defined */
if(typeof window.logTo!=="function"){
  window.logTo=(id,...msg)=>{
    const el=document.getElementById(id);
    if(!el)return;
    el.textContent+=(el.textContent?'\n':'')+msg.join(' ');
    el.scrollTop=el.scrollHeight;
  };
}
if(typeof window.showToast!=="function"){
  window.showToast=(txt,ms=2000)=>{
    const b=document.getElementById('sqToast');
    if(!b)return;
    b.textContent=txt;
    b.style.display='block';
    setTimeout(()=>b.style.display='none',ms);
  };
}
function flash(el,color){if(!el)return;el.style.transition='background 0.3s';el.style.background=color;setTimeout(()=>el.style.background='',600);}

/* ========== mock data setup with itinerary integration ========== */
window.SeattleDB = window.SeattleDB || { dishes: [] };

// Load and display itinerary foods
function loadItineraryFoods() {
  const itineraryData = localStorage.getItem('westCoastItinerary');
  const displayElement = document.getElementById('itinerary-foods-display');
  
  if (!itineraryData) {
    displayElement.innerHTML = '<div class="no-itinerary-msg">No itinerary found. Please complete the trip planner quiz first!</div>';
    return [];
  }

  try {
    const itinerary = JSON.parse(itineraryData);
    const seattleFoods = itinerary.cities['Seattle']?.foods || [];
    
    if (seattleFoods.length === 0) {
      displayElement.innerHTML = '<div class="no-itinerary-msg">No foods selected for Seattle in your itinerary.</div>';
      return [];
    }

    let html = '';
    seattleFoods.forEach((food, index) => {
      html += `
        <div class="food-item">
          <h4>🍽️ ${food}</h4>
          <p>Selected food #${index + 1} from your personalized itinerary</p>
        </div>
      `;
    });
    
    displayElement.innerHTML = html;
    return seattleFoods;
  } catch (e) {
    console.error('Error loading itinerary:', e);
    displayElement.innerHTML = '<div class="no-itinerary-msg">Error loading itinerary data.</div>';
    return [];
  }
}

function seedSeattle(){
  clearTerm('terminal-seedsea');
  
  // Get foods from itinerary
  const itineraryData = localStorage.getItem('westCoastItinerary');
  let seattleFoods = ['Fresh Salmon', 'Pike Place Market Chowder', 'Dungeness Crab']; // defaults
  
  if (itineraryData) {
    try {
      const itinerary = JSON.parse(itineraryData);
      const selectedFoods = itinerary.cities['Seattle']?.foods || [];
      if (selectedFoods.length > 0) {
        seattleFoods = selectedFoods;
      }
    } catch (e) {
      console.error('Error reading itinerary:', e);
    }
  }
  
  // Create dishes from itinerary foods
  SeattleDB.dishes = seattleFoods.map((food, idx) => ({
    id: String(idx + 1),
    name: food,
    city: 'Seattle',
    calories: 350 + (idx * 50),
    deleted_at: null
  }));
  
  logTo('terminal-seedsea', `🌱 Seeded ${SeattleDB.dishes.length} Seattle dishes from your itinerary:`);
  SeattleDB.dishes.forEach(d => logTo('terminal-seedsea', ` - ${d.name} (ID: ${d.id})`));
  showToast('Seattle dishes seeded — +10 XP');
  completeTask('seed'); // Mark task as complete
}

/* helper: clear any terminal */
function clearTerm(id){const e=document.getElementById(id);if(e)e.textContent='';}

/* 🗃️ Archive Dish (soft delete) */
function runArchive(){
  clearTerm('terminal-archive');
  const id = document.getElementById('archive-id').value.trim();
  if(!id){logTo('terminal-archive','⚠️ Please enter a dish ID.');return;}
  // Normalize both input and stored id to compare as plain numbers/strings
  const normalize = x => String(x).replace(/^dish_/, '');
  const dish = SeattleDB.dishes.find(d => normalize(d.id) === normalize(id));
  if(!dish){
    // Try again: if input is 'dish_1' and not found, try matching input as is
    const fallback = SeattleDB.dishes.find(d => d.id === id);
    if(fallback){
      if(fallback.deleted_at){logTo('terminal-archive','⚠️ Already archived.');return;}
      fallback.deleted_at = new Date().toISOString();
      logTo('terminal-archive',`✅ Archived: ${fallback.name}`);
      showToast('Dish archived — +5 XP');
      flash(document.getElementById('terminal-archive'),'rgba(16,185,129,0.15)');
      completeTask?.('archive');
      return;
    }
    logTo('terminal-archive','❌ Dish not found.');return;
  }
  if(dish.deleted_at){logTo('terminal-archive','⚠️ Already archived.');return;}
  dish.deleted_at = new Date().toISOString();
  logTo('terminal-archive',`✅ Archived: ${dish.name}`);
  showToast('Dish archived — +5 XP');
  flash(document.getElementById('terminal-archive'),'rgba(16,185,129,0.15)');
  completeTask?.('archive');
}

/* 🗑️ Hard Delete (permanent remove) */
function runHard(){
  clearTerm('terminal-hard');
  const id=document.getElementById('hard-id').value.trim();
  if(!id){logTo('terminal-hard','⚠️ Please enter a dish ID.');return;}
  const index=SeattleDB.dishes.findIndex(d=>d.id===id);
  if(index===-1){logTo('terminal-hard','❌ Dish not found.');return;}
  const [removed]=SeattleDB.dishes.splice(index,1);
  logTo('terminal-hard',`✅ Hard deleted: ${removed.name} and linked dish_ingredients.`);
  showToast('Dish hard deleted — +10 XP');
  flash(document.getElementById('terminal-hard'),'rgba(16,185,129,0.15)');
  completeTask?.('harddelete');
}

/* 📊 Analytics */
function runAnalytics(){
  clearTerm('terminal-analytics');
  if(!SeattleDB.dishes.length){logTo('terminal-analytics','⚠️ No data found. Seed dishes first.');return;}
  const active=SeattleDB.dishes.filter(d=>!d.deleted_at);
  const archived=SeattleDB.dishes.filter(d=>d.deleted_at);
  const avgCalories = (arr)=> arr.length? (arr.reduce((a,b)=>a+b.calories,0)/arr.length).toFixed(1):0;
  const avg=avgCalories(active);
  logTo('terminal-analytics',`📊 Analytics Dashboard\n${'='.repeat(40)}`);
  logTo('terminal-analytics',`Active dishes: ${active.length}`);
  logTo('terminal-analytics',`Archived dishes: ${archived.length}`);
  logTo('terminal-analytics',`Average calories (active): ${avg}`);
  logTo('terminal-analytics',`\nYour itinerary foods: ${active.map(d=>d.name).join(', ')}`);
  showToast('Analytics run complete — +15 XP');
  flash(document.getElementById('terminal-analytics'),'rgba(16,185,129,0.15)');
  completeTask?.('analytics');
}

/* 👀 View active vs archived */
function viewSeattle(){
  clearTerm('terminal-viewsea');
  if(!SeattleDB.dishes.length){logTo('terminal-viewsea','⚠️ No data found. Seed dishes first.');return;}
  const active=SeattleDB.dishes.filter(d=>!d.deleted_at);
  const archived=SeattleDB.dishes.filter(d=>d.deleted_at);
  logTo('terminal-viewsea',`Active Dishes (${active.length}):`,...active.map(d=>` - ${d.name} (${d.calories} cal, ID: ${d.id})`),`\nArchived Dishes (${archived.length}):`,...archived.map(d=>` - ${d.name} (${d.calories} cal, ID: ${d.id})`));
  showToast('Viewing dishes list');
  completeTask('view'); // Mark task as complete
}

/* ========== quizzes ========== */
function checkArchiveQuiz(){
  const val=document.getElementById('archive-quiz').value,termId='terminal-archive',term=document.getElementById(termId);
  if(!val){logTo(termId,'⚠️ Please choose an answer first.');flash(term,'rgba(251,191,36,0.15)');return;}
  if(val==='a'){
    logTo(termId,'✅ Correct! Archiving keeps records for analytics and restoration.');
    showToast('+3 XP — You understood soft delete!');
    flash(term,'rgba(16,185,129,0.15)');
    completeTask('archive'); // Mark archive concept as complete
  }
  else{logTo(termId,'❌ Not quite. Soft delete preserves data for later reports.');flash(term,'rgba(239,68,68,0.15)');}
}
function checkHardQuiz(){
  const val=document.getElementById('hard-quiz').value.trim().toLowerCase(),termId='terminal-hard',term=document.getElementById(termId);
  if(!val){logTo(termId,'⚠️ Please enter your answer.');flash(term,'rgba(251,191,36,0.15)');return;}
  if(val.includes('dish_ingredient')){
    logTo(termId,'✅ Correct! The join table dish_ingredients must be deleted with the dish.');
    showToast('+3 XP — Cascade delete learned!');
    flash(term,'rgba(16,185,129,0.15)');
    completeTask('harddelete'); // Mark hard delete concept as complete
  }
  else{logTo(termId,'❌ Hint: It starts with "dish_" and links dishes to ingredients.');flash(term,'rgba(239,68,68,0.15)');}
}
function checkAnalyticsQuiz(){
  const val=document.getElementById('analytics-quiz').value,termId='terminal-analytics',term=document.getElementById(termId);
  if(!val){logTo(termId,'⚠️ Please choose an answer.');flash(term,'rgba(251,191,36,0.15)');return;}
  if(val==='b'){
    logTo(termId,'✅ Correct! GROUP BY groups rows for aggregate calculations.');
    showToast('+3 XP — Analytics concept clear!');
    flash(term,'rgba(16,185,129,0.15)');
    completeTask('analytics'); // Mark analytics concept as complete
  }
  else{logTo(termId,'❌ Not quite. The correct answer is GROUP BY.');flash(term,'rgba(239,68,68,0.15)');}
}

// Task completion tracking for Seattle
window.taskProgress = {
  archive: false,
  harddelete: false,
  analytics: false,
  seed: false,
  view: false
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
  const tasks = ['archive', 'harddelete', 'analytics', 'seed', 'view'];
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

// Check if module is complete and mark Seattle as completed
function checkModuleCompletion() {
  const allTasks = Object.values(window.taskProgress);
  const isComplete = allTasks.every(task => task === true);
  
  if (isComplete) {
    // Show the completion notification
    const notification = document.getElementById('unlockNotification');
    if (notification) {
      notification.innerHTML = `
        🎉 CRUD Journey Complete!<br>
        <small style="opacity:.9;font-size:14px;">Now share your adventure on the Seattle Showcase Wall!</small>
      `;
      notification.style.display = 'block';
      setTimeout(() => notification.style.display = 'none', 6000);
    }
    markSeattleComplete();
    console.log('🎉 Seattle module completed! CRUD journey finished.');
  }
}

// Mark Seattle as complete in the main navigation
function markSeattleComplete() {
  try {
    const saved = localStorage.getItem('city_progress');
    let gameProgress = saved ? JSON.parse(saved) : { unlockedCities:[0,1,2,3], completedCities:[], totalCitiesCompleted:0 };
    if (!gameProgress.completedCities.includes(3)) {
      gameProgress.completedCities.push(3);
      gameProgress.totalCitiesCompleted++;
    }
    localStorage.setItem('city_progress', JSON.stringify(gameProgress));
    console.log('✅ Seattle Progress updated:', gameProgress);
  } catch (e) {
    console.error('Seattle completion failed:', e);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  loadItineraryFoods();
  loadTaskProgress();
});