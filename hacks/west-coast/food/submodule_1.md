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
---

# 🏙️ San Diego — CREATE (CRUD Submodule 1)

**Quest Chapter:** *The Food Route*  
**Focus:** C in CRUD — **CREATE**  
**Location:** San Diego, CA ☀️🌮

Welcome! This interactive page lets learners *actually* create dishes, ingredients, and join records via simulated API calls — right in the browser.

---

<style>
/* small local styles for notebook-like look (will blend with tailwind if present) */
.sq-card { border-radius: 0.6rem; padding: 1rem; background: white; box-shadow: 0 6px 18px rgba(2,6,23,0.06); margin-bottom: 1rem; }
.sq-terminal { background: #0b1020; color: #e6eef6; padding: 0.75rem; border-radius: 0.5rem; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Courier New", monospace; font-size: 0.9rem; min-height: 3rem; white-space: pre-wrap; overflow: auto; }
.sq-btn { background:#0ea5a4; color:white; border:none; padding:0.5rem 0.75rem; border-radius:0.375rem; cursor:pointer; }
.sq-run { background:#06b6d4; }
.sq-toast { position: fixed; right: 1rem; top: 1rem; background:#064e3b; color:#d1fae5; padding:0.6rem 1rem; border-radius:0.5rem; font-weight:600; display:none; z-index:9999; }
.sq-label { display:block; margin-bottom:0.3rem; font-weight:600; }
.sq-field { padding:0.5rem; border-radius:0.375rem; border:1px solid #e6e6e6; width:100%; }
.code-editor { width:100%; min-height:120px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", monospace; padding:0.5rem; border-radius:0.5rem; border:1px dashed #cbd5e1; background:#0f1724; color:#e6eef6; }
.small { font-size:0.85rem; color:#6b7280; }

/* Progress tracking styles */
.progress-tracker { 
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1)); 
  border: 2px solid rgba(139, 92, 246, 0.3); 
  padding: 1rem; 
  border-radius: 0.75rem; 
  margin: 1rem 0; 
  color: #e2e8f0; 
}
.task-complete { 
  color: #10b981 !important; 
  font-weight: bold; 
}
.unlock-notification {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 24px 48px;
  border-radius: 16px;
  font-weight: 600;
  font-size: 18px;
  z-index: 10000;
  box-shadow: 0 20px 60px rgba(16, 185, 129, 0.4);
  display: none;
  text-align: center;
}
</style>

<!-- Progress Tracker -->
<div class="progress-tracker">
  <h3 style="margin: 0 0 1rem 0; color: #c084fc;">🎯 San Diego Progress Tracker</h3>
  <div id="progress-display">
    <div id="task-fishtaco" class="task-item">📝 Task 1: Fish Taco Class - <span class="status">Incomplete</span></div>
    <div id="task-burritocart" class="task-item">🛒 Task 2: Burrito Cart - <span class="status">Incomplete</span></div>
    <div id="task-bajabowl" class="task-item">🥗 Task 3: Build Baja Bowl - <span class="status">Incomplete</span></div>
    <div id="task-seed" class="task-item">🌱 Task 4: Seed Pantry - <span class="status">Incomplete</span></div>
    <div id="task-view" class="task-item">👀 Task 5: View Pantry - <span class="status">Incomplete</span></div>
  </div>
  <div style="margin-top: 1rem; padding: 0.75rem; background: rgba(59, 130, 246, 0.1); border-radius: 0.5rem;">
    <strong>Completion: <span id="completion-percentage">0%</span></strong>
    <div style="background: rgba(55, 65, 81, 0.5); height: 8px; border-radius: 4px; margin-top: 0.5rem;">
      <div id="progress-bar" style="background: linear-gradient(90deg, #10b981, #059669); height: 100%; border-radius: 4px; width: 0%; transition: width 0.3s ease;"></div>
    </div>
  </div>
</div>

<div class="sq-toast" id="sqToast">Baja Bowl added — +50 XP</div>

<!-- Unlock Notification -->
<div id="unlockNotification" class="unlock-notification">
  🎉 Los Angeles Unlocked!<br>
  <small style="font-size: 14px; opacity: 0.9;">You can now continue to the next city!</small>
</div>

---

## 🧠 What Does CREATE Mean?

In databases, **CREATE** = inserting new records (dishes, ingredients, join rows).  
On the web, a client form sends a `POST /api/dishes` request. The server creates a dish, ingredient entries, and `dish_ingredients` join records — ideally inside a transaction (all succeed or all fail).

Analogy: your database is a kitchen pantry. Adding a dish is like adding a recipe card and ensuring all required ingredients exist in the pantry.

---

## How this interactive page works (quick)
- Each task has an editable code area (or an input form) and a **Run** button.
- Running code appends output to the terminal area under the task.
- The page includes a **mock backend** (`MockAPI`) that simulates `POST /api/dishes`, `POST /api/dishes/bulk`, and `GET /api/dishes?city=sd`. Data is stored in `localStorage` so progress persists across refreshes.
- On success when creating Baja Bowl, a **toast** shows `+50 XP`.

---

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
/* Mock API + utilities for this page. Outputs go to terminal elements using `logTo(id,...)` */
(function () {
  // Task completion tracking
  window.taskProgress = {
    fishtaco: false,
    burritocart: false,
    bajabowl: false,
    seed: false,
    view: false
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
    const tasks = ['fishtaco', 'burritocart', 'bajabowl', 'seed', 'view'];
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
      // Show unlock notification
      const notification = document.getElementById('unlockNotification');
      if (notification) {
        notification.style.display = 'block';
        setTimeout(() => {
          notification.style.display = 'none';
        }, 4000);
      }

      // ENHANCED: Multiple approaches to unlock the next city
      unlockNextCity();
      
      console.log('🎉 San Diego module completed! Los Angeles should now be unlocked.');
    }
  }

  // NEW: Dedicated function to handle unlocking with multiple fallback methods
  function unlockNextCity() {
    const cityIndex = 0; // San Diego is index 0
    
    // Method 1: Direct access to main navigation system
    if (typeof window.markCityCompleted === 'function') {
      window.markCityCompleted(cityIndex);
      console.log('✅ Method 1: Called window.markCityCompleted directly');
      return;
    }
    
    // Method 2: Try parent window (if in iframe or similar)
    try {
      if (window.parent && window.parent.markCityCompleted) {
        window.parent.markCityCompleted(cityIndex);
        console.log('✅ Method 2: Called parent.markCityCompleted');
        return;
      }
    } catch (e) {
      console.log('Method 2 failed:', e.message);
    }
    
    // Method 3: Try top window
    try {
      if (window.top && window.top.markCityCompleted) {
        window.top.markCityCompleted(cityIndex);
        console.log('✅ Method 3: Called top.markCityCompleted');
        return;
      }
    } catch (e) {
      console.log('Method 3 failed:', e.message);
    }
    
    // Method 4: Direct localStorage manipulation as fallback
    try {
      const saved = localStorage.getItem('mchopiee_city_progress');
      let gameProgress = {
        unlockedCities: [0],
        completedCities: [],
        totalCitiesCompleted: 0
      };
      
      if (saved) {
        gameProgress = JSON.parse(saved);
      }
      
      // Mark San Diego as completed and unlock Los Angeles
      if (!gameProgress.completedCities.includes(0)) {
        gameProgress.completedCities.push(0);
        gameProgress.totalCitiesCompleted++;
      }
      
      if (!gameProgress.unlockedCities.includes(1)) {
        gameProgress.unlockedCities.push(1); // Unlock Los Angeles (index 1)
      }
      
      // Save back to localStorage
      localStorage.setItem('mchopiee_city_progress', JSON.stringify(gameProgress));
      console.log('✅ Method 4: Direct localStorage update completed');
      console.log('Updated progress:', gameProgress);
      
    } catch (e) {
      console.error('Method 4 failed:', e);
    }
  }

  // helpers
  function t() { return Date.now().toString(36).slice(-6); }
  window.logTo = function (id, ...parts) {
    const el = document.getElementById(id);
    if (!el) return;
    const text = parts.map(p => {
      try { return typeof p === 'object' ? JSON.stringify(p, null, 2) : String(p); } catch(e) { return String(p); }
    }).join(' ');
    el.textContent += (el.textContent ? '\n' : '') + text;
    el.scrollTop = el.scrollHeight;
  };

  window.clearTerm = function (id) { const el = document.getElementById(id); if (el) el.textContent = ''; };

  // mock DB wrapper persisted to localStorage
  class MockDB {
    constructor() {
      this.load();
    }
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
    reset() {
      this.dishes = []; this.ingredients = []; this.dishIngredients = []; this.save();
    }
  }

  // API simulating atomic create with transaction-like rollback
  class MockAPI {
    constructor() {
      this.db = new MockDB();
    }

    _cloneState() {
      return {
        dishes: JSON.parse(JSON.stringify(this.db.dishes)),
        ingredients: JSON.parse(JSON.stringify(this.db.ingredients)),
        dishIngredients: JSON.parse(JSON.stringify(this.db.dishIngredients)),
      };
    }

    _restoreState(state) {
      this.db.dishes = state.dishes;
      this.db.ingredients = state.ingredients;
      this.db.dishIngredients = state.dishIngredients;
      this.db.save();
    }

    // findOrCreateIngredient by name (case-insensitive)
    findOrCreateIngredient(name) {
      const existing = this.db.ingredients.find(i => i.name.toLowerCase() === name.toLowerCase());
      if (existing) return existing;
      const newIng = { id: t(), name, createdAt: new Date().toISOString() };
      this.db.ingredients.push(newIng);
      return newIng;
    }

    // Simulates POST /api/dishes
    async postDish(payload) {
      // server-side validation
      if (!payload || !payload.name || !payload.category || !Array.isArray(payload.ingredients) || isNaN(payload.calories)) {
        return { status: 400, body: { error: "Missing required fields" } };
      }

      // transaction simulation
      const before = this._cloneState();
      try {
        const dish = { id: t(), name: payload.name, category: payload.category, calories: payload.calories, photo: payload.photo || null, city: payload.city || 'sd', createdAt: new Date().toISOString() };
        this.db.dishes.push(dish);

        // create ingredients if missing, add dishIngredients
        for (const ing of payload.ingredients) {
          if (!ing || !ing.name) throw new Error("Invalid ingredient");
          const ingRec = this.findOrCreateIngredient(ing.name);
          this.db.dishIngredients.push({ id: t(), dishId: dish.id, ingredientId: ingRec.id, qty: ing.qty || null, unit: ing.unit || null });
        }

        // save and return created resource
        this.db.save();
        return { status: 201, body: dish };
      } catch (err) {
        // rollback
        this._restoreState(before);
        return { status: 500, body: { error: err.message || "Transaction failed" } };
      }
    }

    // Bulk POST
    async postBulk(dishesArray) {
      if (!Array.isArray(dishesArray)) return { status: 400, body: { error: "Expected array" } };
      const created = [];
      for (const d of dishesArray) {
        const payload = Object.assign({ ingredients: [] }, d);
        const res = await this.postDish(payload);
        if (res.status !== 201) { return { status: 500, body: { error: "Bulk insert failed" } }; }
        created.push(res.body);
      }
      return { status: 201, body: created };
    }

    // GET /api/dishes?city=sd
    async getDishes(query = {}) {
      const city = (query.city || 'sd').toLowerCase();
      return this.db.dishes.filter(d => (d.city || 'sd').toLowerCase() === city);
    }

    // reset
    reset() { this.db.reset(); }
  }

  // singleton
  window.MockAPIInstance = new MockAPI();

  // expose initializer
  window.initMock = function() {
    window.MockAPIInstance.reset();
    window.logTo('terminal-init', '[MockAPI] Reset DB. You can seed or create dishes now.');
    showToast("Mock DB reset");
  };

  // toast helper
  window.showToast = function(text, ms = 3000) {
    const b = document.getElementById('sqToast');
    b.textContent = text;
    b.style.display = 'block';
    setTimeout(()=> b.style.display = 'none', ms);
  };

  // initialize on load
  if (!localStorage.getItem('foodquest_sd_db_v1')) {
    window.MockAPIInstance.db.save();
    window.logTo('terminal-init', '[MockAPI] Initialized new DB. Try seeding!');
  } else {
    window.logTo('terminal-init', '[MockAPI] DB loaded from localStorage.');
  }

  // Load task progress on page load
  loadTaskProgress();
})();
</script>

---

# %% Interactive Task: Fish Taco Class (Editable + Run)

<div class="sq-card">
  <div class="sq-label">Describe & implement the <strong>FishTaco</strong> class (id, fishType, toppings[], sauce, price, spiceLevel) and method <code>calculateTotalPrice()</code> (<em>8% tax</em>). Throw error if fishType missing.</div>

  <textarea id="code-fishtaco" class="code-editor">
// class FishTaco { ... } - edit or run the example
class FishTaco {
  constructor(id, fishType, toppings = [], sauce, price, spiceLevel) {
    if (!fishType) throw new Error("Fish type required");
    this.id = id;
    this.fishType = fishType;
    this.toppings = toppings;
    this.sauce = sauce;
    this.price = price;
    this.spiceLevel = spiceLevel;
  }

  calculateTotalPrice() {
    return this.price * 1.08; // 8% tax
  }
}

// sample usage:
const taco = new FishTaco("t1", "Mahi-Mahi", ["cabbage","lime","pico"], "chipotle", 5.99, "Medium");
console.log("Created:", taco);
console.log("Total price:", taco.calculateTotalPrice().toFixed(2));

// Mark task as complete when run successfully
completeTask('fishtaco');
  </textarea>

  <div style="margin-top:0.5rem">
    <button class="sq-btn sq-run" onclick="runEditor('code-fishtaco','terminal-fishtaco')">Run</button>
    <button class="sq-btn" onclick="copyEditor('code-fishtaco')">Copy</button>
  </div>

  <pre id="terminal-fishtaco" class="sq-terminal"></pre>
</div>

# %% Interactive Task: BurritoCart (Editable + Run)

<div class="sq-card">
  <div class="sq-label">Implement <strong>BurritoCart</strong> with methods <code>addBurrito()</code>, <code>removeBurrito()</code>, <code>getTotalPrice()</code>, <code>getBurritosByFilling()</code>.</div>

  <textarea id="code-burritocart" class="code-editor">
// BurritoCart implementation
class BurritoCart {
  constructor() {
    this.burritos = [];
  }
  addBurrito(burrito) { this.burritos.push(burrito); }
  removeBurrito(index) { this.burritos.splice(index,1); }
  getTotalPrice() { return this.burritos.reduce((s,b)=>s+(b.price||0),0); }
  getBurritosByFilling(filling) { return this.burritos.filter(b => b.filling === filling); }
}

// example
const cart = new BurritoCart();
cart.addBurrito({ name: "California Burrito", filling: "Carne Asada", price: 8.5 });
cart.addBurrito({ name: "Veggie Burrito", filling: "Beans", price: 7.0 });
console.log("Cart:", cart.burritos);
console.log("Total:", cart.getTotalPrice());
console.log("Carne Asada burritos:", cart.getBurritosByFilling("Carne Asada"));

// Mark task as complete when run successfully
completeTask('burritocart');
  </textarea>

  <div style="margin-top:0.5rem">
    <button class="sq-btn sq-run" onclick="runEditor('code-burritocart','terminal-burritocart')">Run</button>
    <button class="sq-btn" onclick="copyEditor('code-burritocart')">Copy</button>
  </div>

  <pre id="terminal-burritocart" class="sq-terminal"></pre>
</div>

# %% Interactive Task: Build the Baja Bowl (Form + Run)

<div class="sq-card">
  <div class="sq-label">Use the form to build a <strong>Baja Bowl</strong>. Required fields: <em>name, category, ingredients (name, qty, unit), calories</em>. Photo may be a URL or uploaded file (stored as data URL).</div>

  <div style="display:grid; grid-template-columns: 1fr; gap:0.5rem;">
    <label class="sq-label">Dish name</label>
    <input id="dish-name" class="sq-field" placeholder="Baja Bowl" value="Baja Bowl" />

    <label class="sq-label">Category</label>
    <input id="dish-category" class="sq-field" placeholder="Healthy" value="Healthy" />

    <label class="sq-label">Calories</label>
    <input id="dish-calories" type="number" class="sq-field" placeholder="600" value="600" />

    <label class="sq-label">Photo URL (optional)</label>
    <input id="dish-photo" class="sq-field" placeholder="https://..." />

    <label class="sq-label">Add Ingredients (name, qty, unit)</label>
    <div style="display:flex; gap:0.5rem;">
      <input id="ing-name" class="sq-field" placeholder="avocado" />
      <input id="ing-qty" class="sq-field" placeholder="1" />
      <input id="ing-unit" class="sq-field" placeholder="cup" />
      <button class="sq-btn" onclick="addIngredient()">Add</button>
    </div>

    <div id="ingredients-list" class="small" style="margin-top:0.5rem">No ingredients yet</div>

    <div style="display:flex; gap:0.5rem; margin-top:0.75rem;">
      <button class="sq-btn sq-run" onclick="runCreateForm()">Create Dish (POST)</button>
      <button class="sq-btn" onclick="clearForm()">Clear</button>
    </div>

    <div style="margin-top:0.5rem">
      <div id="terminal-create" class="sq-terminal"></div>
    </div>
  </div>
</div>

<script>
(function(){
  window._localIngredientBuffer = [];
  window.addIngredient = function() {
    const name = document.getElementById('ing-name').value.trim();
    const qty = document.getElementById('ing-qty').value.trim();
    const unit = document.getElementById('ing-unit').value.trim();
    if (!name) { alert('Ingredient name required'); return; }
    window._localIngredientBuffer.push({ name, qty: qty || null, unit: unit || null });
    document.getElementById('ing-name').value = '';
    document.getElementById('ing-qty').value = '';
    document.getElementById('ing-unit').value = '';
    renderIngredientList();
  };

  window.renderIngredientList = function() {
    const el = document.getElementById('ingredients-list');
    if (!window._localIngredientBuffer.length) { el.textContent = 'No ingredients yet'; return; }
    el.innerHTML = window._localIngredientBuffer.map((ing,i) => `${i+1}. ${ing.name} — ${ing.qty||''} ${ing.unit||''} <button onclick="removeIngredient(${i})" style="margin-left:0.5rem">remove</button>`).join('<br>');
  };

  window.removeIngredient = function(i) { window._localIngredientBuffer.splice(i,1); renderIngredientList(); };

  window.clearForm = function() {
    document.getElementById('dish-name').value = '';
    document.getElementById('dish-category').value = '';
    document.getElementById('dish-calories').value = '';
    document.getElementById('dish-photo').value = '';
    window._localIngredientBuffer = [];
    renderIngredientList();
    clearTerm('terminal-create');
  };

  window.runCreateForm = async function() {
    clearTerm('terminal-create');
    const name = document.getElementById('dish-name').value.trim();
    const category = document.getElementById('dish-category').value.trim();
    const calories = parseInt(document.getElementById('dish-calories').value);
    const photo = document.getElementById('dish-photo').value.trim() || null;
    const ingredients = window._localIngredientBuffer.slice();

    // client-side validation
    if (!name || !category || isNaN(calories) || !ingredients.length) {
      logTo('terminal-create', '[Client] Validation failed: name, category, calories, and at least 1 ingredient required');
      return;
    }

    const payload = { name, category, calories, photo, ingredients, city: 'sd' };

    logTo('terminal-create', '[Client] Sending POST /api/dishes', payload);

    // call mock API
    const res = await window.MockAPIInstance.postDish(payload);
    if (res.status === 201) {
      logTo('terminal-create', '[Server] 201 Created', res.body);
      showToast(res.body.name + ' added — +50 XP');
      completeTask('bajabowl'); // Mark task as complete
    } else {
      logTo('terminal-create', '[Server] Error', res);
    }
  };
})();
</script>

# %% Interactive: Simulated POST endpoint + Unit Test

<div class="sq-card">
  <div class="sq-label">Simulate a `POST /api/dishes` call programmatically (JS). There is also a simple unit test runner below to assert `201` and returned resource.</div>

  <textarea id="code-post" class="code-editor">
// Example programmatic POST using MockAPIInstance
(async function(){
  const payload = {
    name: "Carne Asada Fries",
    category: "Fusion",
    calories: 900,
    photo: null,
    ingredients: [
      { name: "fries", qty: "1", unit: "plate" },
      { name: "steak", qty: "150", unit: "g" },
      { name: "cheese", qty: "50", unit: "g" }
    ],
    city: "sd"
  };

  const res = await MockAPIInstance.postDish(payload);
  console.log("Status:", res.status);
  console.log("Body:", res.body);
})();
  </textarea>

  <div style="margin-top:0.5rem">
    <button class="sq-btn sq-run" onclick="runEditor('code-post','terminal-post')">Run</button>
    <button class="sq-btn" onclick="copyEditor('code-post')">Copy</button>
  </div>

  <pre id="terminal-post" class="sq-terminal"></pre>

  <div style="margin-top:0.75rem;">
    <button class="sq-btn sq-run" onclick="runUnitTest()">Run Unit Test: POST returns 201 & created resource</button>
    <div id="terminal-test" class="sq-terminal" style="margin-top:0.5rem"></div>
  </div>
</div>

<script>
window.runUnitTest = async function() {
  clearTerm('terminal-test');
  const payload = {
    name: "Acai Bowl",
    category: "Breakfast",
    calories: 450,
    ingredients: [{ name: "acai", qty: "1", unit: "bowl" }],
    city: "sd"
  };
  const res = await MockAPIInstance.postDish(payload);
  if (res.status === 201 && res.body && res.body.name === payload.name) {
    logTo('terminal-test', '✅ Unit Test Passed: POST returned 201 and resource created');
    logTo('terminal-test', JSON.stringify(res.body, null, 2));
  } else {
    logTo('terminal-test', '❌ Unit Test Failed', JSON.stringify(res, null, 2));
  }
};
</script>

# %% Interactive Task: Seed Pantry (Bulk POST)

<div class="sq-card">
  <div class="sq-label">Seed the San Diego pantry with at least three dishes (Fish Tacos, California Burrito, Baja Bowl)</div>

  <div style="display:flex; gap:0.5rem;">
    <button class="sq-btn sq-run" onclick="seedPantry()">Seed Pantry</button>
    <button class="sq-btn" onclick="clearTerm('terminal-seed')">Clear</button>
  </div>

  <pre id="terminal-seed" class="sq-terminal" style="margin-top:0.5rem"></pre>
</div>

<script>
window.seedPantry = async function() {
  clearTerm('terminal-seed');
  const seed = [
    { name: "Fish Tacos (Baja-style)", category: "Seafood", calories: 420, ingredients: [{name:"fish", qty:"2", unit:"tacos"}], city:'sd' },
    { name: "California Burrito", category: "Mexican Fusion", calories: 800, ingredients: [{name:"potatoes", qty:"1", unit:"cup"}], city:'sd' },
    { name: "Baja Bowl", category: "Healthy Bowl", calories: 390, ingredients: [{name:"rice", qty:"1", unit:"cup"}], city:'sd' },
  ];
  logTo('terminal-seed', '[Client] Sending bulk seed...');
  const res = await MockAPIInstance.postBulk(seed);
  if (res.status === 201) {
    logTo('terminal-seed', '✅ Seed success:', res.body);
    completeTask('seed'); // Mark task as complete
  } else {
    logTo('terminal-seed', '❌ Seed failed', res);
  }
};
</script>

# %% Interactive Task: View Pantry (GET /api/dishes?city=sd)

<div class="sq-card">
  <div class="sq-label">View the San Diego pantry (GET /api/dishes?city=sd)</div>

  <div style="display:flex; gap:0.5rem;">
    <button class="sq-btn sq-run" onclick="viewPantry()">View Pantry</button>
    <button class="sq-btn" onclick="clearTerm('terminal-pantry')">Clear</button>
  </div>

  <pre id="terminal-pantry" class="sq-terminal" style="margin-top:0.5rem"></pre>
</div>

<script>
window.viewPantry = async function() {
  clearTerm('terminal-pantry');
  const dishes = await MockAPIInstance.getDishes({ city: 'sd' });
  if (!dishes.length) {
    logTo('terminal-pantry','[Server] 200 OK — No dishes found for city=sd. Try seeding.');
    return;
  }
  logTo('terminal-pantry','[Server] 200 OK — Dishes for city=sd:');
  dishes.forEach(d => logTo('terminal-pantry', JSON.stringify(d, null, 2)));
  completeTask('view'); // Mark task as complete
};
</script>

---
---

## 🎉 Module Complete — San Diego

Congratulations! You've successfully completed **CRUD: CREATE** in San Diego. All tasks — Fish Tacos, California Burrito, Baja Bowl, and the interactive pantry — are done. ✅  

Your **Baja Bowl** creation earned you **+50 XP** and the **"First Insert"** badge! 🏆  

The next city awaits: **Los Angeles — READ module unlocked!** 🌆  
Click through to begin exploring **searching, filtering, and viewing dishes** in LA.

<!-- Back to Home Button moved to bottom -->
<div style="margin-top: 3rem; text-align: center; padding: 2rem 0; border-top: 2px solid rgba(139, 92, 246, 0.3);">
  <a href="{{ site.baseurl }}/west-coast/food/" style="background: linear-gradient(135deg, #8b5cf6, #3b82f6); border: 2px solid rgba(139, 92, 246, 0.4); padding: 16px 32px; border-radius: 25px; color: white; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-size: 14px; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4); text-decoration: none; display: inline-block; font-family: 'Nunito', sans-serif;">
    ← Back to Food Route Hub
  </a>
</div>

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
</script>
