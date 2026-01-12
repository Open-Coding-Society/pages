---
layout: opencs
microblog: True 
title: "San Diego"    
description: "City One of Food - San Diego"
permalink: /west-coast/food/SD/
parent: "San Diego"
team: "Syntax Terrors"
submodule: 1
categories: [CSP]
tags: [food, sandiego, create, crud]
author: "Syntax Terrors"
date: 2025-10-24
footer:
  home: /west-coast/food/
  next: /west-coast/food/LA/
---

# 🏙️ San Diego — CREATE (CRUD Submodule 1)

**Quest Chapter:** *The Food Route*  

<br>

**Focus:** C in CRUD — **CREATE**  

<br>

**Location:** San Diego, CA ☀️🌮

<br>

Welcome! This interactive page lets learners *actually* create dishes, ingredients, and join records via simulated API calls — right in the browser.

---

<style>
/* === Theme variables (dark-first) === */
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

/* Light mode overrides (toggleable) */
body.light {
  --bg-0: #f8fafc;
  --bg-1: rgba(255,255,255,0.96);
  --card-border: rgba(99,102,241,0.14);
  --muted: #6b7280;
  --text: #0b1220;
  --glass: rgba(0,0,0,0.02);
  --terminal-bg: #0b1220;
  --input-bg: #ffffff;
  --input-border: rgba(2,6,23,0.06);
  --code-bg: linear-gradient(180deg, #f8fafc, #eef2ff);
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

/* Card look (no harsh white) */
.sq-card {
  border-radius: 0.75rem;
  padding: 1rem;
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  border: 1px solid var(--card-border);
  box-shadow: 0 8px 32px rgba(2,6,23,0.45);
  margin-bottom: 1rem;
  backdrop-filter: blur(8px) saturate(1.05);
  transition: transform 0.16s ease, box-shadow 0.2s ease;
}
.sq-card:hover { transform: translateY(-4px); box-shadow: 0 18px 48px rgba(59,130,246,0.08); }

/* Terminal */
.sq-terminal {
  background: var(--terminal-bg);
  color: var(--text);
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Courier New", monospace;
  font-size: 0.9rem;
  min-height: 3rem;
  white-space: pre-wrap;
  overflow: auto;
  border: 1px solid rgba(255,255,255,0.02);
  box-shadow: inset 0 -1px 0 rgba(255,255,255,0.02);
}

/* Buttons */
.sq-btn {
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  color: var(--text);
  border: 1px solid rgba(255,255,255,0.04);
  padding: 0.55rem 0.9rem;
  border-radius: 0.45rem;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
}
.sq-btn:active { transform: translateY(1px) scale(0.998); }

.sq-run {
  background: linear-gradient(90deg, var(--accent-3), rgba(6,182,212,0.15));
  border: 1px solid rgba(6,182,212,0.18);
  color: white;
  box-shadow: 0 8px 20px rgba(6,182,212,0.12);
}

/* Toast */
.sq-toast {
  position: fixed;
  right: 1rem;
  top: 1rem;
  background: linear-gradient(135deg, rgba(139,92,246,0.92), rgba(59,130,246,0.92));
  color: white;
  padding: 0.6rem 1rem;
  border-radius: 0.5rem;
  font-weight: 700;
  display: none;
  z-index: 9999;
  box-shadow: 0 12px 36px rgba(11,12,35,0.5);
}

/* Labels / fields */
.sq-label { display:block; margin-bottom:0.45rem; font-weight:700; color: #e6ebff; }
.sq-field {
  padding:0.6rem;
  border-radius:0.5rem;
  border:1px solid var(--input-border);
  width:100%;
  background: var(--input-bg);
  color: var(--text);
  outline: none;
  box-shadow: inset 0 -1px 0 rgba(255,255,255,0.01);
  font-size: 0.95rem;
}
.sq-field::placeholder { color: var(--muted); }

/* Code editor area */
.code-editor {
  width:100%;
  min-height:120px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Courier New", monospace;
  padding:0.75rem;
  border-radius:0.6rem;
  border:1px dashed rgba(148,163,184,0.08);
  background: var(--code-bg);
  color: var(--text);
  resize: vertical;
  white-space: pre-wrap;
  overflow: auto;
  box-shadow: inset 0 -6px 24px rgba(2,6,23,0.55);
}

/* small helper */
.small { font-size:0.85rem; color: var(--muted); }

/* Progress tracker */
.progress-tracker {
  background: linear-gradient(135deg, rgba(139,92,246,0.06), rgba(59,130,246,0.04));
  border: 1px solid rgba(99,102,241,0.14);
  padding: 1rem;
  border-radius: 0.75rem;
  margin: 1rem 0;
  color: var(--text);
  box-shadow: 0 8px 30px rgba(2,6,23,0.45);
}
.progress-tracker h3 { color: #dbe4ff; margin: 0 0 0.6rem 0; }
.progress-tracker .task-item { margin: 0.35rem 0; color: var(--muted); }

/* Status text */
.task-complete { color: var(--success) !important; font-weight: 700; }

/* Unlock notification (center modal) */
.unlock-notification {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, rgba(139,92,246,0.98), rgba(59,130,246,0.98));
  color: white;
  padding: 20px 36px;
  border-radius: 14px;
  font-weight: 700;
  font-size: 16px;
  z-index: 10000;
  box-shadow: 0 30px 80px rgba(11,12,35,0.6);
  display: none;
  text-align: center;
}


/* Editor tool row */
.editor-actions { display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap; }

/* small responsive */
@media (max-width: 720px) {
  body { padding: 0.75rem; }
  .sq-card { padding: 0.8rem; }
  .next-city-btn { right: 12px; left: auto; bottom: 12px; font-size: 0.95rem; padding: 0.6rem 1rem; }
}

/* Tiny focus ring for accessibility */
.sq-field:focus, .code-editor:focus, .sq-btn:focus { box-shadow: 0 0 0 4px rgba(59,130,246,0.12); border-color: rgba(59,130,246,0.22); outline: none; }

/* small inline remove button styling */
.ingredients-remove-btn {
  background: transparent;
  color: var(--muted);
  border: none;
  cursor: pointer;
  font-weight: 700;
  margin-left: 8px;
}
.ingredients-remove-btn:hover { color: var(--accent-2); text-decoration: underline; }

/* Custom styles for collapsible details/summary */
summary {
    font-weight: 700;
    font-size: 1.1rem;
    cursor: pointer;
    padding: 0.5rem 0;
    color: #e6e9ff;
    list-style-position: inside;
    list-style-type: '▶ ';
}
details[open] > summary {
    list-style-type: '▼ ';
}

/* Itinerary Info Box */
.itinerary-info {
  background: linear-gradient(135deg, rgba(139,92,246,0.08), rgba(59,130,246,0.06));
  border: 2px solid rgba(78,204,163,0.2);
  padding: 1rem;
  border-radius: 0.75rem;
  margin: 1rem 0;
}

.itinerary-info h3 {
  color: #4ecca3;
  margin: 0 0 0.5rem 0;
}

.selected-foods {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.food-item {
  padding: 0.5rem;
  background: rgba(78,204,163,0.1);
  border-left: 3px solid #4ecca3;
  border-radius: 0.35rem;
}
</style>

<!-- Dark mode toggle -->
<div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-bottom:0.75rem;">
  <button id="themeToggleBtn" class="sq-btn" title="Toggle dark / light">🌙 Dark</button>
</div>

<!-- Itinerary Info Display -->
<div id="itineraryInfo" class="itinerary-info" style="display:none;">
  <h3>🍽️ Your Selected San Diego Foods</h3>
  <div class="selected-foods" id="selectedFoodsList"></div>
  <p class="small" style="margin-top: 0.75rem; opacity: 0.8;">These are the foods from your West Coast trip itinerary. Complete the tasks below to learn about them!</p>
</div>

<!-- Progress Tracker -->
<div class="progress-tracker">
  <h3>🎯 San Diego Progress Tracker</h3>
  <div id="progress-display">
    <div id="task-fishtacos" class="task-item">🌮 Fish Tacos (Baja-style) - <span class="status">Incomplete</span></div>
    <div id="task-burrito" class="task-item">🌯 California Burrito - <span class="status">Incomplete</span></div>
    <div id="task-fries" class="task-item">🍟 Carne Asada Fries - <span class="status">Incomplete</span></div>
    <div id="task-acai" class="task-item">🍇 Acai Bowls - <span class="status">Incomplete</span></div>
    <div id="task-bajabowl" class="task-item">🥗 Baja Bowl - <span class="status">Incomplete</span></div>
    <div id="task-seafood" class="task-item">🐟 Baja Seafood - <span class="status">Incomplete</span></div>
  </div>
  <div style="margin-top: 1rem; padding: 0.75rem; background: rgba(255,255,255,0.01); border-radius: 0.5rem;">
    <strong>Completion: <span id="completion-percentage">0%</span></strong>
    <div style="background: rgba(2,6,23,0.45); height: 8px; border-radius: 6px; margin-top: 0.5rem;">
      <div id="progress-bar" style="background: linear-gradient(90deg, var(--success), #059669); height: 100%; border-radius: 4px; width: 0%; transition: width 0.3s ease;"></div>
    </div>
  </div>
</div>

<div class="sq-toast" id="sqToast">Fish Tacos created — +15 XP</div>

<!-- Unlock Notification -->
<div id="unlockNotification" class="unlock-notification">
  🎉 Los Angeles Unlocked!<br>
  <small style="font-size: 13px; opacity: 0.95;">You can now continue to the next city!</small>
</div>

- **🧠 What Does CREATE Mean?**  
  - In databases, **CREATE** = inserting new records (e.g., dishes, ingredients, or join rows).  
  <br>
  - On the web, a client form sends a POST /api/dishes request.  
  <br>
  - The server creates:
    - a new **dish** record,  
    - any missing **ingredient** entries, and  
    - **dish_ingredients** join records — ideally inside a single transaction (all succeed or all fail).  
  <br>
  - Analogy: your database is like a **kitchen pantry**. Adding a dish = adding a **recipe card** and ensuring all the required ingredients already exist in the pantry.

# %% Interactive: Mock Backend & Utilities

<div class="sq-card">
  <div style="display:flex; gap:0.5rem; align-items:center;">
    <strong>Initialization:</strong>
    <button class="sq-btn sq-run" onclick="initMock()">Initialize / Reset Mock API</button>
    <span class="small" style="margin-left:0.5rem">Resets mock DB (localStorage) — use this to start fresh.</span>
  </div>

  <div style="margin-top:0.75rem">
    <div class="sq-terminal" id="terminal-init">Terminal: ready</div>
  </div>
</div>

<script>
/* Mock API + utilities for this page. Outputs go to terminal elements using logTo(id,...) */
(function () {
  // Task completion tracking
  window.taskProgress = {
    fishtacos: false,
    burrito: false,
    fries: false,
    acai: false,
    bajabowl: false,
    seafood: false
  };

  // Load and display itinerary foods
  function loadItineraryFoods() {
    try {
      const itineraryData = localStorage.getItem('westCoastItinerary');
      if (itineraryData) {
        const itinerary = JSON.parse(itineraryData);
        if (itinerary.cities && itinerary.cities['San Diego']) {
          const sdFoods = itinerary.cities['San Diego'].foods;
          if (sdFoods && sdFoods.length > 0) {
            displayItineraryFoods(sdFoods);
            window.userSelectedFoods = sdFoods;
            return sdFoods;
          }
        }
      }
    } catch (e) {
      console.error('Error loading itinerary:', e);
    }
    return null;
  }

  function displayItineraryFoods(foods) {
    const infoBox = document.getElementById('itineraryInfo');
    const foodsList = document.getElementById('selectedFoodsList');
    
    if (foods && foods.length > 0) {
      foodsList.innerHTML = foods.map(food => 
        `<div class="food-item">🍽️ ${food}</div>`
      ).join('');
      infoBox.style.display = 'block';
    } else {
      infoBox.style.display = 'none';
    }
  }

  // Load progress from localStorage
  function loadTaskProgress() {
    const saved = localStorage.getItem('sd_task_progress');
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
      localStorage.setItem('sd_task_progress', JSON.stringify(window.taskProgress));
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
    const tasks = ['fishtacos', 'burrito', 'fries', 'acai', 'bajabowl', 'seafood'];
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

  // Check if module is complete and unlock next city
  function checkModuleCompletion() {
    const allTasks = Object.values(window.taskProgress);
    const isComplete = allTasks.every(task => task === true);
    
    if (isComplete) {
      const notification = document.getElementById('unlockNotification');
      if (notification) {
        notification.style.display = 'block';
        setTimeout(() => notification.style.display = 'none', 4000);
      }
      unlockLosAngeles();
      console.log('🎉 San Diego module completed! Los Angeles should now be unlocked.');
    }
  }

  // Unlock Los Angeles
  function unlockLosAngeles() {
    try {
      const saved = localStorage.getItem('city_progress'); 
      let gameProgress = saved ? JSON.parse(saved) : { 
        unlockedCities: [0], 
        completedCities: [], 
        totalCitiesCompleted: 0 
      };
      
      if (!gameProgress.completedCities.includes(0)) {
        gameProgress.completedCities.push(0);
        gameProgress.totalCitiesCompleted++;
      }
      if (!gameProgress.unlockedCities.includes(1)) {
        gameProgress.unlockedCities.push(1);
      }
      
      localStorage.setItem('city_progress', JSON.stringify(gameProgress));
      console.log('✅ San Diego completed! LA unlocked. Progress:', gameProgress);
      
      // Try to notify parent window
      if (window.parent && window.parent.markCityCompleted) {
        window.parent.markCityCompleted(0);
      }
      
    } catch (e) {
      console.error('❌ SD Unlock failed:', e);
    }
  }

  // Helpers
  window.logTo = function (id, ...parts) {
    const el = document.getElementById(id);
    if (!el) return;
    const text = parts.map(p => typeof p === 'object' ? JSON.stringify(p, null, 2) : String(p)).join(' ');
    el.textContent += (el.textContent ? '\n' : '') + text;
    el.scrollTop = el.scrollHeight;
  };

  window.clearTerm = id => { const el = document.getElementById(id); if (el) el.textContent = ''; };

  class MockDB {
    constructor() { this.load(); }
    load() {
      const raw = localStorage.getItem('foodquest_sd_db_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        this.dishes = parsed.dishes || [];
        this.ingredients = parsed.ingredients || [];
        this.dishIngredients = parsed.dishIngredients || [];
      } else {
        this.dishes = [];
        this.ingredients = [];
        this.dishIngredients = [];
      }
    }
    save() {
      localStorage.setItem('foodquest_sd_db_v1', JSON.stringify({
        dishes: this.dishes, ingredients: this.ingredients, dishIngredients: this.dishIngredients
      }));
    }
    reset() { this.dishes=[]; this.ingredients=[]; this.dishIngredients=[]; this.save(); }
  }

  class MockAPI {
    constructor() { this.db = new MockDB(); }
    async postDish(payload) {
      if (!payload || !payload.name || !payload.category || !Array.isArray(payload.ingredients) || isNaN(payload.calories))
        return { status:400, body:{error:"Missing required fields"} };
      const dish = { id:Date.now().toString(36), ...payload, createdAt:new Date().toISOString() };
      this.db.dishes.push(dish);
      this.db.save();
      return { status:201, body:dish };
    }
    async postBulk(dishesArray) {
      if (!Array.isArray(dishesArray)) return { status:400, body:{error:"Expected array"} };
      const created = [];
      for (const d of dishesArray) {
        const res = await this.postDish(d);
        if (res.status !== 201) return { status:500, body:{error:"Bulk insert failed"} };
        created.push(res.body);
      }
      return { status:201, body:created };
    }
    async getDishes(query={}) {
      const city = (query.city||'sd').toLowerCase();
      let dishes = this.db.dishes.filter(d => (d.city||'sd').toLowerCase()===city);
      
      // Filter by user's selected foods if available
      if (window.userSelectedFoods && window.userSelectedFoods.length > 0) {
        dishes = dishes.filter(d => {
          return window.userSelectedFoods.some(selectedFood => 
            d.name.toLowerCase().includes(selectedFood.toLowerCase()) ||
            selectedFood.toLowerCase().includes(d.name.toLowerCase())
          );
        });
      }
      
      return dishes;
    }
    reset() { this.db.reset(); }
  }

  window.MockAPIInstance = new MockAPI();

  window.initMock = function() {
    window.MockAPIInstance.reset();
    window.logTo('terminal-init','[MockAPI] Reset DB. You can seed or create dishes now.');
    showToast("Mock DB reset");
  };

  window.showToast = function(text, ms=3000){
    const b=document.getElementById('sqToast');
    b.textContent=text;
    b.style.display='block';
    setTimeout(()=>b.style.display='none',ms);
  };

  if (!localStorage.getItem('foodquest_sd_db_v1')) {
    window.MockAPIInstance.db.save();
    window.logTo('terminal-init','[MockAPI] Initialized new DB. Try seeding!');
  } else {
    window.logTo('terminal-init','[MockAPI] DB loaded from localStorage.');
  }

  // Load itinerary foods on page load
  loadItineraryFoods();
  loadTaskProgress();
})();
</script>

---

<!-- Task 1: Fish Tacos (Baja-style) -->
<details open>
  <summary>🌮 Fish Tacos (Baja-style) CREATE</summary>
  <div class="sq-card">
    <div class="sq-label">Create a <strong>Fish Taco</strong> class with properties (id, fishType, toppings, sauce, price, spiceLevel) and method <code>calculateTotalPrice()</code> with 8% tax. Validate fishType is required.</div>
    <textarea id="code-fishtacos" class="code-editor">
// Fish Tacos (Baja-style) - CREATE operation
class FishTaco {
  constructor(id, fishType, toppings = [], sauce, price = 0, spiceLevel = 1) {
    if (!fishType) throw new Error("Fish type is required for authentic Baja tacos");
    this.id = id;
    this.fishType = fishType;
    this.toppings = Array.isArray(toppings) ? toppings : [];
    this.sauce = sauce || "chipotle crema";
    this.price = Number(price) || 12.99;
    this.spiceLevel = Math.max(1, Math.min(5, Number(spiceLevel) || 1));
  }

  calculateTotalPrice() {
    // Add 8% tax, round to 2 decimals
    return Math.round((this.price * 1.08) * 100) / 100;
  }

  addTopping(topping) {
    if (topping && !this.toppings.includes(topping)) {
      this.toppings.push(topping);
    }
  }
}

// CREATE example - Fresh Baja fish taco
const bajaTaco = new FishTaco("ft1", "mahi-mahi", 
  ["cabbage slaw", "pico de gallo", "lime"], 
  "baja sauce", 13.50, 2);

console.log("🌮 Created Fish Taco:", bajaTaco);
console.log("📊 Total with tax:", "$" + bajaTaco.calculateTotalPrice().toFixed(2));
console.log("🌶️ Spice level:", bajaTaco.spiceLevel + "/5");

// Mark task as complete
completeTask('fishtacos');
    </textarea>
    <div style="margin-top:0.5rem" class="editor-actions">
      <button class="sq-btn sq-run" onclick="runEditor('code-fishtacos','terminal-fishtacos')">🌮 Create Fish Tacos</button>
      <button class="sq-btn" onclick="copyEditor('code-fishtacos')">Copy Code</button>
    </div>
    <pre id="terminal-fishtacos" class="sq-terminal"></pre>
    
    <div class="sq-card quiz-block" style="background: rgba(99,102,241,0.06); margin-top:0.5rem;">
      <strong>🧩 Quick Quiz:</strong>
      <div class="quiz-question" data-answer="b">
        <p>1️⃣ Why validate fishType in the constructor?</p>
        <label><input type="radio" name="q1-fish" value="a"> It improves performance</label><br>
        <label><input type="radio" name="q1-fish" value="b"> It enforces data integrity</label><br>
        <label><input type="radio" name="q1-fish" value="c"> It adds toppings automatically</label>
      </div>
      <button class="sq-btn sq-run" onclick="submitQuiz(this)">Submit Answer</button>
      <div class="quiz-feedback small" style="margin-top:0.5rem;"></div>
    </div>
  </div>
</details>

<!-- Task 2: California Burrito -->
<details>
  <summary>🌯 California Burrito CREATE</summary>
  <div class="sq-card">
    <div class="sq-label">Implement <strong>CaliforniaBurrito</strong> class with properties (id, protein, hasFries, size, extras, price) and method <code>calculateCalories()</code>. Fries are what make it "California style"!</div>
    <textarea id="code-burrito" class="code-editor">
// California Burrito - CREATE with validation
class CaliforniaBurrito {
  constructor(id, protein, hasFries = true, size = "regular", extras = [], price = 0) {
    if (!protein) throw new Error("Protein is required for California burrito");
    this.id = id;
    this.protein = protein;
    this.hasFries = hasFries; // What makes it "California style"
    this.size = size; // small, regular, large
    this.extras = Array.isArray(extras) ? extras : [];
    this.price = Number(price) || 10.99;
    this.createdAt = new Date().toISOString();
  }

  calculateCalories() {
    let baseCalories = 650; // Base burrito
    if (this.hasFries) baseCalories += 200; // Fries add calories
    if (this.size === "large") baseCalories += 150;
    if (this.size === "small") baseCalories -= 100;
    baseCalories += this.extras.length * 50; // Each extra = 50 cal
    return baseCalories;
  }

  addExtra(extra) {
    if (extra && !this.extras.includes(extra)) {
      this.extras.push(extra);
      this.price += 1.50; // Each extra costs more
    }
  }
}

// CREATE a classic California burrito
const caliBurrito = new CaliforniaBurrito("cb1", "carne asada", true, "large", 
  ["guacamole", "sour cream"], 12.99);

console.log("🌯 Created California Burrito:", caliBurrito);
console.log("🔥 Calories:", caliBurrito.calculateCalories());
console.log("💰 Price with extras:", "$" + caliBurrito.price.toFixed(2));

// Mark task as complete
completeTask('burrito');
    </textarea>
    <div style="margin-top:0.5rem" class="editor-actions">
      <button class="sq-btn sq-run" onclick="runEditor('code-burrito','terminal-burrito')">🌯 Create Burrito</button>
      <button class="sq-btn" onclick="copyEditor('code-burrito')">Copy Code</button>
    </div>
    <pre id="terminal-burrito" class="sq-terminal"></pre>
    
    <div class="sq-card quiz-block" style="background: rgba(99,102,241,0.06); margin-top:0.5rem;">
      <strong>🧩 Quick Quiz:</strong>
      <div class="quiz-question" data-answer="a">
        <p>1️⃣ What makes a burrito "California style"?</p>
        <label><input type="radio" name="q2-cali" value="a"> Having french fries inside</label><br>
        <label><input type="radio" name="q2-cali" value="b"> Being made in California</label><br>
        <label><input type="radio" name="q2-cali" value="c"> Using avocado</label>
      </div>
      <button class="sq-btn sq-run" onclick="submitQuiz(this)">Submit Answer</button>
      <div class="quiz-feedback small" style="margin-top:0.5rem;"></div>
    </div>
  </div>
</details>

<!-- Task 3: Carne Asada Fries -->
<details>
  <summary>🍟 Carne Asada Fries CREATE</summary>
  <div class="sq-card">
    <div class="sq-label">Build a <strong>CarneAsadaFries</strong> class with properties (id, friesType, meatPortion, toppings, cheeseType, price) and method <code>isLoaded()</code> that checks if it has at least 3 toppings.</div>
    <textarea id="code-fries" class="code-editor">
// Carne Asada Fries - CREATE loaded fries
class CarneAsadaFries {
  constructor(id, friesType = "seasoned", meatPortion = "regular", toppings = [], cheeseType = "cheddar", price = 0) {
    this.id = id;
    this.friesType = friesType;
    this.meatPortion = meatPortion; // light, regular, extra
    this.toppings = Array.isArray(toppings) ? toppings : [];
    this.cheeseType = cheeseType;
    this.price = Number(price) || 14.99;
    this.isShareable = this.meatPortion === "extra";
  }

  isLoaded() {
    // "Loaded" fries have at least 3 toppings
    return this.toppings.length >= 3;
  }

  addTopping(topping) {
    if (topping && !this.toppings.includes(topping)) {
      this.toppings.push(topping);
      this.price += 0.75; // Each topping costs extra
    }
  }

  calculateWeight() {
    // Estimate weight in oz
    let weight = 12; // Base fries
    if (this.meatPortion === "extra") weight += 6;
    else if (this.meatPortion === "regular") weight += 4;
    weight += this.toppings.length * 1.5;
    return Math.round(weight * 10) / 10;
  }
}

// CREATE fully loaded carne asada fries
const loadedFries = new CarneAsadaFries("caf1", "crispy", "extra", 
  ["guacamole", "sour cream", "pico de gallo", "jalapeños"], 
  "mexican blend", 16.99);

console.log("🍟 Created Carne Asada Fries:", loadedFries);
console.log("🔥 Is loaded?", loadedFries.isLoaded());
console.log("⚖️ Estimated weight:", loadedFries.calculateWeight() + " oz");
console.log("💰 Final price:", "$" + loadedFries.price.toFixed(2));

// Mark task as complete
completeTask('fries');
    </textarea>
    <div style="margin-top:0.5rem" class="editor-actions">
      <button class="sq-btn sq-run" onclick="runEditor('code-fries','terminal-fries')">🍟 Create Loaded Fries</button>
      <button class="sq-btn" onclick="copyEditor('code-fries')">Copy Code</button>
    </div>
    <pre id="terminal-fries" class="sq-terminal"></pre>
    
    <div class="sq-card quiz-block" style="background: rgba(99,102,241,0.06); margin-top:0.5rem;">
      <strong>🧩 Quick Quiz:</strong>
      <div class="quiz-question" data-answer="c">
        <p>1️⃣ What makes fries "loaded" in this implementation?</p>
        <label><input type="radio" name="q3-loaded" value="a"> Extra meat portion</label><br>
        <label><input type="radio" name="q3-loaded" value="b"> Special cheese type</label><br>
        <label><input type="radio" name="q3-loaded" value="c"> At least 3 toppings</label>
      </div>
      <button class="sq-btn sq-run" onclick="submitQuiz(this)">Submit Answer</button>
      <div class="quiz-feedback small" style="margin-top:0.5rem;"></div>
    </div>
  </div>
</details>

<!-- Task 4: Acai Bowls -->
<details>
  <summary>🍇 Acai Bowls CREATE</summary>
  <div class="sq-card">
    <div class="sq-label">Create an <strong>AcaiBowl</strong> class with properties (id, size, baseIngredients, toppings, granola, price) and methods <code>calculateNutritionScore()</code> and <code>isHealthy()</code>.</div>
    <textarea id="code-acai" class="code-editor">
// Acai Bowl - CREATE healthy option
class AcaiBowl {
  constructor(id, size = "regular", baseIngredients = [], toppings = [], granola = true, price = 0) {
    this.id = id;
    this.size = size; // small, regular, large
    this.baseIngredients = Array.isArray(baseIngredients) ? baseIngredients : ["acai", "banana"];
    this.toppings = Array.isArray(toppings) ? toppings : [];
    this.granola = granola;
    this.price = Number(price) || 11.99;
    this.isVegan = this.checkVegan();
  }

  calculateNutritionScore() {
    let score = 0;
    // Base ingredients contribute to health score
    score += this.baseIngredients.length * 10;
    // Healthy toppings boost score
    const healthyToppings = ["blueberries", "strawberries", "coconut", "chia seeds", "hemp hearts"];
    this.toppings.forEach(topping => {
      if (healthyToppings.includes(topping.toLowerCase())) score += 15;
      else score += 5;
    });
    if (this.granola) score += 10;
    return score;
  }

  isHealthy() {
    return this.calculateNutritionScore() >= 50;
  }

  checkVegan() {
    const nonVegan = ["honey", "yogurt", "whey protein"];
    return !this.toppings.some(t => nonVegan.includes(t.toLowerCase()));
  }

  addTopping(topping) {
    if (topping && !this.toppings.includes(topping)) {
      this.toppings.push(topping);
      this.price += 1.25;
    }
  }
}

// CREATE a superfood acai bowl
const superBowl = new AcaiBowl("ab1", "large", 
  ["acai", "banana", "mango"], 
  ["blueberries", "chia seeds", "coconut", "hemp hearts"], 
  true, 14.99);

console.log("🍇 Created Acai Bowl:", superBowl);
console.log("💪 Nutrition score:", superBowl.calculateNutritionScore());
console.log("🥗 Is healthy?", superBowl.isHealthy());
console.log("🌱 Is vegan?", superBowl.isVegan);

// Mark task as complete
completeTask('acai');
    </textarea>
    <div style="margin-top:0.5rem" class="editor-actions">
      <button class="sq-btn sq-run" onclick="runEditor('code-acai','terminal-acai')">🍇 Create Acai Bowl</button>
      <button class="sq-btn" onclick="copyEditor('code-acai')">Copy Code</button>
    </div>
    <pre id="terminal-acai" class="sq-terminal"></pre>
    
    <div class="sq-card quiz-block" style="background: rgba(99,102,241,0.06); margin-top:0.5rem;">
      <strong>🧩 Quick Quiz:</strong>
      <div class="quiz-question" data-answer="b">
        <p>1️⃣ What determines if an acai bowl is "healthy" in this code?</p>
        <label><input type="radio" name="q4-healthy" value="a"> If it's vegan</label><br>
        <label><input type="radio" name="q4-healthy" value="b"> If nutrition score >= 50</label><br>
        <label><input type="radio" name="q4-healthy" value="c"> If it has granola</label>
      </div>
      <button class="sq-btn sq-run" onclick="submitQuiz(this)">Submit Answer</button>
      <div class="quiz-feedback small" style="margin-top:0.5rem;"></div>
    </div>
  </div>
</details>

<!-- Task 5: Baja Bowl -->
<details>
  <summary>🥗 Baja Bowl CREATE via API</summary>
  <div class="sq-card">
    <div class="sq-label">Use the form to CREATE a Baja Bowl via our mock API! Fill in the details and make a POST request to simulate database insertion.</div>
    <div style="display:grid; grid-template-columns: 1fr; gap:0.5rem;">
      <label class="sq-label">Bowl Name</label>
      <input id="bowl-name" class="sq-field" placeholder="Baja Bowl" value="Baja Bowl" />

      <label class="sq-label">Base Type</label>
      <select id="bowl-base" class="sq-field">
        <option value="cilantro-lime rice">Cilantro-Lime Rice</option>
        <option value="quinoa">Quinoa</option>
        <option value="lettuce">Lettuce Base</option>
      </select>

      <label class="sq-label">Protein</label>
      <select id="bowl-protein" class="sq-field">
        <option value="grilled fish">Grilled Fish</option>
        <option value="shrimp">Baja Shrimp</option>
        <option value="chicken">Lime Chicken</option>
      </select>

      <label class="sq-label">Calories</label>
      <input id="bowl-calories" type="number" class="sq-field" placeholder="425" value="425" />

      <label class="sq-label">Baja Bowl Ingredients</label>
      <div style="display:flex; gap:0.5rem;">
        <input id="bowl-ing-name" class="sq-field" placeholder="black beans" />
        <input id="bowl-ing-qty" class="sq-field" placeholder="0.5" />
        <input id="bowl-ing-unit" class="sq-field" placeholder="cup" />
        <button class="sq-btn" onclick="addBowlIngredient()">Add</button>
      </div>

      <div id="bowl-ingredients-list" class="small" style="margin-top:0.5rem">No ingredients yet</div>

      <div style="display:flex; gap:0.5rem; margin-top:0.75rem;">
        <button class="sq-btn sq-run" onclick="createBajaBowl()">🥗 CREATE Baja Bowl</button>
        <button class="sq-btn" onclick="clearBowlForm()">Clear Form</button>
        <button class="sq-btn" onclick="autofillBajaBowl()">Auto-fill Example</button>
      </div>

      <div id="terminal-bajabowl" class="sq-terminal" style="margin-top:0.5rem"></div>
    </div>
  </div>
</details>

<script>
(function(){
  window._bowlIngredientBuffer = [];
  
  window.autofillBajaBowl = function() {
    document.getElementById('bowl-name').value = "Signature Baja Bowl";
    document.getElementById('bowl-base').value = "cilantro-lime rice";
    document.getElementById('bowl-protein').value = "grilled fish";
    document.getElementById('bowl-calories').value = "450";
    
    window._bowlIngredientBuffer = [
      { name: "black beans", qty: "0.5", unit: "cup" },
      { name: "pico de gallo", qty: "2", unit: "tbsp" },
      { name: "avocado", qty: "0.25", unit: "whole" },
      { name: "lime crema", qty: "1", unit: "drizzle" }
    ];
    renderBowlIngredientList();
  };
  
  window.addBowlIngredient = function() {
    const name = document.getElementById('bowl-ing-name').value.trim();
    const qty = document.getElementById('bowl-ing-qty').value.trim();
    const unit = document.getElementById('bowl-ing-unit').value.trim();
    if (!name) { alert('Ingredient name required'); return; }
    window._bowlIngredientBuffer.push({ name, qty: qty || null, unit: unit || null });
    document.getElementById('bowl-ing-name').value = '';
    document.getElementById('bowl-ing-qty').value = '';
    document.getElementById('bowl-ing-unit').value = '';
    renderBowlIngredientList();
  };

  window.renderBowlIngredientList = function() {
    const el = document.getElementById('bowl-ingredients-list');
    if (!window._bowlIngredientBuffer.length) { el.textContent = 'No ingredients yet'; return; }
    el.innerHTML = window._bowlIngredientBuffer.map((ing,i) => {
      return `${i+1}. ${ing.name} — ${ing.qty||''} ${ing.unit||''} <button class="ingredients-remove-btn" onclick="removeBowlIngredient(${i})">remove</button>`;
    }).join('<br>');
  };

  window.removeBowlIngredient = function(i) { window._bowlIngredientBuffer.splice(i,1); renderBowlIngredientList(); };

  window.clearBowlForm = function() {
    document.getElementById('bowl-name').value = '';
    document.getElementById('bowl-calories').value = '';
    window._bowlIngredientBuffer = [];
    renderBowlIngredientList();
    clearTerm('terminal-bajabowl');
  };

  window.createBajaBowl = async function() {
    clearTerm('terminal-bajabowl');
    const name = document.getElementById('bowl-name').value.trim();
    const base = document.getElementById('bowl-base').value;
    const protein = document.getElementById('bowl-protein').value;
    const calories = parseInt(document.getElementById('bowl-calories').value);
    const ingredients = window._bowlIngredientBuffer.slice();

    if (!name || !ingredients.length) {
      logTo('terminal-bajabowl', '[Client] Validation failed: name and ingredients required');
      return;
    }

    const payload = { 
      name, 
      category: "Healthy Bowl", 
      calories, 
      base, 
      protein,
      ingredients, 
      city: 'sd' 
    };

    logTo('terminal-bajabowl', '[Client] POST /api/dishes (Baja Bowl)', payload);
    const res = await window.MockAPIInstance.postDish(payload);
    
    if (res.status === 201) {
      logTo('terminal-bajabowl', '[Server] 201 Created', res.body);
      showToast('🥗 Baja Bowl created — +15 XP');
      completeTask('bajabowl');
    } else {
      logTo('terminal-bajabowl', '[Server] Error', res);
    }
  };
})();
</script>

<!-- Task 6: Baja Seafood -->
<details>
  <summary>🐟 Baja Seafood CREATE Collection</summary>
  <div class="sq-card">
    <div class="sq-label">Create a collection of Baja seafood dishes and bulk insert them into the database using POST /api/dishes/bulk</div>
    <div style="display:flex; gap:0.5rem; margin-bottom:0.75rem;">
      <button class="sq-btn sq-run" onclick="createBajaSeafoodCollection()">🐟 CREATE Seafood Collection</button>
      <button class="sq-btn" onclick="clearTerm('terminal-seafood')">Clear Terminal</button>
    </div>
    <pre id="terminal-seafood" class="sq-terminal"></pre>
    
    <div class="sq-card quiz-block" style="background: rgba(99,102,241,0.06); margin-top:0.5rem;">
      <strong>🧩 Quick Quiz:</strong>
      <div class="quiz-question" data-answer="c">
        <p>1️⃣ What's the main benefit of bulk CREATE operations?</p>
        <label><input type="radio" name="q6-bulk" value="a"> They use less memory</label><br>
        <label><input type="radio" name="q6-bulk" value="b"> They're always faster</label><br>
        <label><input type="radio" name="q6-bulk" value="c"> They reduce network requests</label>
      </div>
      <button class="sq-btn sq-run" onclick="submitQuiz(this)">Submit Answer</button>
      <div class="quiz-feedback small" style="margin-top:0.5rem;"></div>
    </div>
  </div>
</details>

<script>
window.createBajaSeafoodCollection = async function() {
  clearTerm('terminal-seafood');
  
  const seafoodCollection = [
    {
      name: "Baja Fish & Chips",
      category: "Seafood",
      calories: 650,
      ingredients: [
        { name: "beer-battered fish", qty: "1", unit: "fillet" },
        { name: "seasoned fries", qty: "1", unit: "serving" },
        { name: "tartar sauce", qty: "2", unit: "tbsp" }
      ],
      city: 'sd'
    },
    {
      name: "Grilled Mahi-Mahi",
      category: "Seafood",
      calories: 320,
      ingredients: [
        { name: "mahi-mahi", qty: "6", unit: "oz" },
        { name: "lime", qty: "1", unit: "whole" },
        { name: "cilantro", qty: "2", unit: "tbsp" }
      ],
      city: 'sd'
    },
    {
      name: "Baja Shrimp Bowl",
      category: "Seafood",
      calories: 420,
      ingredients: [
        { name: "grilled shrimp", qty: "8", unit: "pieces" },
        { name: "cilantro rice", qty: "1", unit: "cup" },
        { name: "avocado", qty: "0.5", unit: "whole" }
      ],
      city: 'sd'
    }
  ];
  
  logTo('terminal-seafood', '[Client] Creating Baja seafood collection...');
  logTo('terminal-seafood', `[Client] Sending bulk POST with ${seafoodCollection.length} dishes`);
  
  const res = await MockAPIInstance.postBulk(seafoodCollection);
  
  if (res.status === 201) {
    logTo('terminal-seafood', '[Server] 201 Created - Bulk insert successful');
    logTo('terminal-seafood', JSON.stringify(res.body, null, 2));
    showToast('🐟 Seafood collection created — +25 XP');
    completeTask('seafood');
  } else {
    logTo('terminal-seafood', '[Server] Bulk insert failed', res);
  }
};
</script>

---

## 🎉 Module Complete — San Diego CREATE Mastery

Congratulations! You've mastered **CREATE operations** through San Diego's finest foods:
- 🌮 **Fish Tacos**: Class creation with validation
- 🌯 **California Burrito**: Complex object construction  
- 🍟 **Carne Asada Fries**: Method-based data validation
- 🍇 **Acai Bowls**: Health scoring algorithms
- 🥗 **Baja Bowl**: API form submission
- 🐟 **Baja Seafood**: Bulk creation operations

**Los Angeles — READ module unlocked!** 🌆 Continue to learn querying and data retrieval!

<script>
/* utilities used by editors */
function runEditor(editorId, termId) {
  clearTerm(termId);
  const code = document.getElementById(editorId).value;
  // capture console
  const term = document.getElementById(termId);
  const originalConsole = window.console;
  const fakeConsole = {
    log: (...args) => { logTo(termId, ...args); },
    error: (...args) => { logTo(termId, 'ERROR:', ...args); },
    warn: (...args) => { logTo(termId, 'WARN:', ...args); },
  };
  try {
    window.console = fakeConsole;
    // eslint-disable-next-line no-new-func
    const fn = new Function(code);
    const result = fn();
    if (result && typeof result.then === 'function') {
      result.then(r => window.console.log('[Promise resolved]', r)).catch(e => window.console.error(e));
    }
  } catch (err) {
    logTo(termId, 'Exception:', err && err.stack ? err.stack : String(err));
  } finally {
    window.console = originalConsole;
  }
}

function copyEditor(editorId) {
  const code = document.getElementById(editorId).value;
  navigator.clipboard?.writeText(code).then(()=> alert('Code copied to clipboard'), ()=> alert('Copy failed — try selecting and Ctrl+C'));
}

// small helper used above
function clearTerm(id) { const el = document.getElementById(id); if (el) el.textContent = ''; }

/* Theme toggle: default to dark; remembers preference in localStorage */
(function(){
  const btn = document.getElementById('themeToggleBtn');
  const preferred = localStorage.getItem('sd_theme') || 'dark';
  if (preferred === 'light') document.body.classList.add('light');
  updateThemeButton();

  btn.addEventListener('click', () => {
    document.body.classList.toggle('light');
    localStorage.setItem('sd_theme', document.body.classList.contains('light') ? 'light' : 'dark');
    updateThemeButton();
  });

  function updateThemeButton(){
    if (document.body.classList.contains('light')) {
      btn.textContent = '☀️ Light';
      btn.title = 'Switch to dark mode';
    } else {
      btn.textContent = '🌙 Dark';
      btn.title = 'Switch to light mode';
    }
  }
})();

function submitQuiz(btn) {
  const block = btn.closest('.quiz-block');
  const questions = block.querySelectorAll('.quiz-question');
  let correct = 0;
  const total = questions.length;

  questions.forEach(q => {
    const expected = q.dataset.answer.trim().toLowerCase();
    let userAnswer = '';

    const radios = q.querySelectorAll('input[type="radio"]');
    const text = q.querySelector('input[type="text"]');

    // Find the user's choice
    if (radios.length) {
      const selected = [...radios].find(r => r.checked);
      if (selected) userAnswer = selected.value.trim().toLowerCase();
    } else if (text) {
      userAnswer = text.value.trim().toLowerCase();
    }

    // Remove old highlights
    q.style.borderLeft = '';
    q.style.paddingLeft = '';

    // Compare answers
    if (userAnswer === expected) {
      correct++;
      q.style.borderLeft = '4px solid #10b981'; // green
      q.style.paddingLeft = '0.5rem';
    } else {
      q.style.borderLeft = '4px solid #ef4444'; // red
      q.style.paddingLeft = '0.5rem';
    }
  });

  // Show overall feedback
  const feedback = block.querySelector('.quiz-feedback');
  if (correct === total) {
    feedback.innerHTML = `✅ Perfect! ${correct}/${total} correct.`;
    feedback.style.color = '#10b981';
  } else {
    feedback.innerHTML = `❌ ${correct}/${total} correct — check the red ones and try again.`;
    feedback.style.color = '#ef4444';
  }
}

// Task completion tracking
window.taskProgress = {
  fishtacos: false,
  burrito: false,
  fries: false,
  acai: false,
  bajabowl: false,
  seafood: false
};

// Load progress from localStorage
function loadTaskProgress() {
  const saved = localStorage.getItem('sd_task_progress');
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
    localStorage.setItem('sd_task_progress', JSON.stringify(window.taskProgress));
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
  const tasks = ['fishtacos', 'burrito', 'fries', 'acai', 'bajabowl', 'seafood'];
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

// Check if module is complete and unlock next city
function checkModuleCompletion() {
  const allTasks = Object.values(window.taskProgress);
  const isComplete = allTasks.every(task => task === true);
  
  if (isComplete) {
    const notification = document.getElementById('unlockNotification');
    if (notification) {
      notification.style.display = 'block';
      setTimeout(() => notification.style.display = 'none', 4000);
    }
    unlockLosAngeles();
    console.log('🎉 San Diego module completed! Los Angeles should now be unlocked.');
  }
}

// Unlock Los Angeles
function unlockLosAngeles() {
  try {
    const saved = localStorage.getItem('city_progress'); 
    let gameProgress = saved ? JSON.parse(saved) : { 
      unlockedCities: [0], 
      completedCities: [], 
      totalCitiesCompleted: 0 
    };
    
    if (!gameProgress.completedCities.includes(0)) {
      gameProgress.completedCities.push(0);
      gameProgress.totalCitiesCompleted++;
    }
    if (!gameProgress.unlockedCities.includes(1)) {
      gameProgress.unlockedCities.push(1);
    }
    
    localStorage.setItem('city_progress', JSON.stringify(gameProgress));
    console.log('✅ San Diego completed! LA unlocked. Progress:', gameProgress);
    
    // Try to notify parent window
    if (window.parent && window.parent.markCityCompleted) {
      window.parent.markCityCompleted(0);
    }
    
  } catch (e) {
    console.error('❌ SD Unlock failed:', e);
  }
}

// Auto complete function for testing
function autoCompleteAllTasks() {
  document.getElementById('quickCompleteBtn').style.display = 'none';
  
  // Auto-fill the Baja Bowl form
  autofillBajaBowl();
  
  // Run tasks in sequence
  setTimeout(() => createBajaBowl(), 500);
  setTimeout(() => createBajaSeafoodCollection(), 1000);
  
  // Mark all other tasks as complete
  setTimeout(() => {
    completeTask('fishtacos');
    completeTask('burrito'); 
    completeTask('fries');
    completeTask('acai');
    
    showToast('🎉 All CREATE tasks completed! Los Angeles unlocked!', 4000);
  }, 1500);
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