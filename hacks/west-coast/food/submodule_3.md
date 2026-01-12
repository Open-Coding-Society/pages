---
layout: opencs
microblog: True
title: "San Francisco"
description: "City Three of Food - San Francisco"
permalink: /west-coast/food/SF/
parent: "San Francisco"
team: "Syntax Terrors"
submodule: 3
categories: [CSP]
tags: [food, sanfrancisco, update, crud]
author: "Syntax Terrors"
date: 2025-10-24
footer:
  previous: /west-coast/food/LA/
  home: /west-coast/food/
  next: /west-coast/food/SEA/
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

/* Card look */
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

.sq-run {
  background: linear-gradient(90deg, var(--accent-3), rgba(6,182,212,0.15));
  border: 1px solid rgba(6,182,212,0.18);
  color: white;
  box-shadow: 0 8px 20px rgba(6,182,212,0.12);
}

.sq-run:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(6,182,212,0.2);
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
.sq-label { 
  display:block; 
  margin-bottom:0.45rem; 
  font-weight:700; 
  color: #e6ebff; 
}

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

.progress-tracker h3 { 
  color: var(--accent-1); 
  margin: 0 0 0.6rem 0; 
}

.task-item { 
  margin: 0.35rem 0; 
  color: var(--muted); 
  padding: 0.5rem;
  background: rgba(255,255,255,0.02);
  border-radius: 6px;
  border-left: 3px solid var(--accent-3);
}

/* Status text */
.task-complete { 
  color: var(--success) !important; 
  font-weight: 700; 
}

/* Unlock notification */
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

.ingredients-remove-btn {
  background: transparent;
  color: var(--muted);
  border: none;
  cursor: pointer;
  font-weight: 700;
  margin-left: 8px;
}

.ingredients-remove-btn:hover { 
  color: var(--accent-2); 
  text-decoration: underline; 
}
</style>

# 🌉 San Francisco — UPDATE (CRUD Submodule 3)

**Quest Chapter:** *The Food Route*  
**Focus:** U in CRUD — **UPDATE**  
**Location:** San Francisco, CA 🌉🍜

Welcome! This interactive page teaches UPDATE operations through San Francisco's iconic food scene. Master data modification, validation, and best practices.

<div id="sqToast" class="sq-toast"></div>

<!-- Progress Tracker -->
<div class="progress-tracker">
  <h3>🎯 San Francisco Progress Tracker</h3>
  <div id="progress-display">
    <div id="task-dimsum" class="task-item">🥟 Dim Sum Menu - <span class="status">Incomplete</span></div>
    <div id="task-chowmein" class="task-item">🍜 Chow Mein Order - <span class="status">Incomplete</span></div>
    <div id="task-sourdough" class="task-item">🍞 Sourdough Bread - <span class="status">Incomplete</span></div>
    <div id="task-dungeness" class="task-item">🦀 Dungeness Crab - <span class="status">Incomplete</span></div>
    <div id="task-ghirardelli" class="task-item">🍫 Ghirardelli Chocolate - <span class="status">Incomplete</span></div>
    <div id="task-cioppino" class="task-item">🍲 Cioppino Stew - <span class="status">Incomplete</span></div>
  </div>
  <div style="margin-top: 1rem; padding: 0.75rem; background: rgba(255,255,255,0.01); border-radius: 0.5rem;">
    <strong>Completion: <span id="completion-percentage">0%</span></strong>
    <div style="background: rgba(2,6,23,0.45); height: 8px; border-radius: 6px; margin-top: 0.5rem;">
      <div id="progress-bar" style="background: linear-gradient(90deg, var(--success), #059669); height: 100%; border-radius: 4px; width: 0%; transition: width 0.3s ease;"></div>
    </div>
  </div>
</div>

<!-- Unlock Notification -->
<div id="unlockNotification" class="unlock-notification">
  🎉 Seattle Unlocked!<br>
  <small style="font-size: 13px; opacity: 0.95;">You can now continue to the next city!</small>
</div>

- **🧠 What Does UPDATE Mean?**  
  - In databases, **UPDATE** = modifying existing records without creating new ones.  
  <br>
  - On the web, a client sends PUT/PATCH requests to modify data.  
  <br>
  - The server processes:
    - **Validation** of the update data,  
    - **Identification** of the record to modify, and  
    - **Atomic updates** to maintain data integrity.  
  <br>
  - Analogy: your database is like a **recipe book**. Updating = **editing** existing recipes with new ingredients or instructions.

---

<!-- Task 1: Dim Sum Menu -->
<details open>
  <summary>🥟 Dim Sum Menu UPDATE Class</summary>
  <div class="sq-card">
    <div class="sq-label">Learn <strong>UPDATE</strong> methods by completing the DimSumMenu class. This class manages menu items and their properties.</div>
    
    <pre class="sq-terminal" style="background: #181e2a; color: #e6eef6; margin-bottom: 1rem;">
class DimSumMenu {
  constructor(id, name, options = []) {
    this.id = id;
    this.name = name;
    this.options = options;
  }
  updatePrice(itemId, newPrice) {
    const item = this.options.find(o => o.id === itemId);
    if (item) item.price = newPrice;
  }
  updateDescription(itemId, newDesc) {
    const item = this.options.find(o => o.id === itemId);
    if (item) item.description = newDesc;
  }</pre>

    <form id="dimsum-fill-blank" onsubmit="return checkDimSumAnswers()" style="display:grid; gap:0.75rem;">
      <label class="sq-label">1. What method updates the price of a menu item?</label>
      <input class="sq-field" type="text" id="blank-updatePrice" placeholder="Method name...">

      <label class="sq-label">2. What array holds all the menu options?</label>
      <input class="sq-field" type="text" id="blank-options" placeholder="Property name...">

      <label class="sq-label">3. What keyword is used to define a class in JavaScript?</label>
      <input class="sq-field" type="text" id="blank-class" placeholder="Keyword...">

      <button class="sq-btn sq-run" type="submit">🥟 Check Dim Sum Answers</button>
      <div id="dimsum-feedback" class="small" style="margin-top:0.5rem"></div>
    </form>
  </div>
</details>

<!-- Task 2: Chow Mein Order -->
<details>
  <summary>🍜 Chow Mein Order UPDATE Methods</summary>
  <div class="sq-card">
    <div class="sq-label">Master <strong>UPDATE</strong> operations by understanding the ChowMeinOrder class and its modification methods.</div>
    
    <pre class="sq-terminal" style="background: #181e2a; color: #e6eef6; margin-bottom: 1rem;">
class ChowMeinOrder {
  constructor(id, protein, noodleType) {
    this.id = id;
    this.protein = protein;
    this.noodleType = noodleType;
    this.spiceLevel = "Medium";
    this.extras = [];
  }
  updateProtein(newProtein) {
    this.protein = newProtein;
  }
  updateNoodleType(newType) {
    this.noodleType = newType;
  }</pre>

    <form id="chowmein-fill-blank" onsubmit="return checkChowmeinAnswers()" style="display:grid; gap:0.75rem;">
      <label class="sq-label">1. What property stores the type of noodle?</label>
      <input class="sq-field" type="text" id="blank-noodleType" placeholder="Property name...">

      <label class="sq-label">2. What method changes the protein?</label>
      <input class="sq-field" type="text" id="blank-updateProtein" placeholder="Method name...">

      <label class="sq-label">3. What property stores extra toppings?</label>
      <input class="sq-field" type="text" id="blank-extras" placeholder="Property name...">

      <button class="sq-btn sq-run" type="submit">🍜 Check Chow Mein Answers</button>
      <div id="chowmein-feedback" class="small" style="margin-top:0.5rem"></div>
    </form>
  </div>
</details>

<!-- Task 3: Sourdough Bread -->
<details>
  <summary>🍞 Sourdough Bread UPDATE Form</summary>
  <div class="sq-card">
    <div class="sq-label">Practice <strong>UPDATE</strong> operations by modifying a sourdough bread recipe through a form interface.</div>

    <div style="display:grid; grid-template-columns: 1fr; gap:0.5rem;">
      <label class="sq-label">Dish ID to update</label>
      <input id="dish-id" class="sq-field" placeholder="d123" value="sourdough-001" />

      <label class="sq-label">Updated name</label>
      <input id="dish-name" class="sq-field" placeholder="Sourdough" value="SF Artisan Sourdough" />

      <label class="sq-label">Updated category</label>
      <input id="dish-category" class="sq-field" placeholder="Bread" value="Artisan Bread" />

      <label class="sq-label">Updated calories</label>
      <input id="dish-calories" type="number" class="sq-field" placeholder="180" value="180" />

      <label class="sq-label">Updated photo URL (optional)</label>
      <input id="dish-photo" class="sq-field" placeholder="https://..." />

      <label class="sq-label">Update Ingredients (name, qty, unit)</label>
      <div style="display:flex; gap:0.5rem;">
        <input id="ing-name" class="sq-field" placeholder="flour" />
        <input id="ing-qty" class="sq-field" placeholder="3" />
        <input id="ing-unit" class="sq-field" placeholder="cups" />
        <button class="sq-btn" onclick="addIngredient()">Add</button>
      </div>

      <div id="ingredients-list" class="small" style="margin-top:0.5rem">No ingredients yet</div>

      <div style="display:flex; gap:0.5rem; margin-top:0.75rem;">
        <button class="sq-btn sq-run" onclick="runUpdateForm()">🍞 Update Sourdough (PUT)</button>
        <button class="sq-btn" onclick="clearForm()">Clear</button>
        <button class="sq-btn" onclick="autofillSourdough()">Auto-fill</button>
      </div>

      <div id="terminal-update" class="sq-terminal" style="margin-top:0.5rem"></div>
    </div>
  </div>
</details>

<!-- Task 4: Dungeness Crab -->
<details>
  <summary>🦀 Dungeness Crab UPDATE Validation</summary>
  <div class="sq-card">
    <div class="sq-label">Learn <strong>UPDATE validation</strong> concepts using Dungeness Crab as an example. Understand error handling and data integrity.</div>
    
    <pre class="sq-terminal" style="background: #131722; color: #e6eef6; margin-bottom: 1rem;">
When updating a Dungeness Crab dish in our database, proper validation is crucial.
For example, when updating the recipe we must validate:
1. Required fields: name="Dungeness Crab", ingredients list present
2. Data types: calories=600 (must be a number)
3. Record exists: dish ID must exist before updating
This prevents data corruption and ensures accurate crab recipes.</pre>

    <form id="dungeness-quiz" onsubmit="return checkDungeness()" style="display:grid; gap:0.5rem;">
      <label class="sq-label">1. What HTTP status code should be returned if validation fails?</label>
      <input class="sq-field" id="dungeness-type" placeholder="e.g., 400" />

      <label class="sq-label">2. What property must be present to identify the record to update?</label>
      <input class="sq-field" id="dungeness-region" placeholder="e.g., id" />

      <button class="sq-btn sq-run" type="submit">🦀 Check Crab Validation</button>
      <div id="dungeness-feedback" class="small" style="margin-top:0.5rem"></div>
    </form>
  </div>
</details>

<!-- Task 5: Ghirardelli Chocolate -->
<details>
  <summary>🍫 Ghirardelli Chocolate UPDATE Response</summary>
  <div class="sq-card">
    <div class="sq-label">Master <strong>UPDATE response handling</strong> by understanding what happens after updating Ghirardelli chocolate recipes.</div>
    
    <pre class="sq-terminal" style="background: #131722; color: #e6eef6; margin-bottom: 1rem;">
After updating Ghirardelli Chocolate's ingredients or recipe,
the API returns important response data:
- 200 OK status (update successful)
- Updated chocolate recipe in response body
- Last modified timestamp for recipe versioning
This helps track changes to our chocolate recipes.</pre>

    <form id="ghirardelli-quiz" onsubmit="return checkGhirardelli()" style="display:grid; gap:0.5rem;">
      <label class="sq-label">1. What property in the response shows when the record was last modified?</label>
      <input class="sq-field" id="ghir-prod" placeholder="e.g., updatedAt" />

      <label class="sq-label">2. Which HTTP status code indicates a successful update?</label>
      <input class="sq-field" id="ghir-square" placeholder="e.g., 200" />

      <button class="sq-btn sq-run" type="submit">🍫 Check Chocolate Response</button>
      <div id="ghir-feedback" class="small" style="margin-top:0.5rem"></div>
    </form>
  </div>
</details>

<!-- Task 6: Cioppino Stew -->
<details>
  <summary>🍲 Cioppino Stew UPDATE Best Practices</summary>
  <div class="sq-card">
    <div class="sq-label">Learn <strong>UPDATE best practices</strong> through Cioppino stew management. Understand transactions and concurrent updates.</div>
    
    <pre class="sq-terminal" style="background: #131722; color: #e6eef6; margin-bottom: 1rem;">
When updating a complex Cioppino recipe with many ingredients:
- Use transactions (update recipe and ingredients together)
- Check for concurrent recipe edits
- Validate all seafood ingredients exist
- Show clear errors if an ingredient is missing
This keeps our Cioppino recipe data accurate and complete.</pre>

    <form id="cioppino-quiz" onsubmit="return checkCioppino()" style="display:grid; gap:0.5rem;">
      <label class="sq-label">1. What ensures multiple updates happen together or not at all?</label>
      <input class="sq-field" id="cioppino-cuisine" placeholder="e.g., transaction" />

      <label class="sq-label">2. What should you check before updating related records?</label>
      <input class="sq-field" id="cioppino-ing" placeholder="e.g., existence" />

      <button class="sq-btn sq-run" type="submit">🍲 Check Cioppino Practices</button>
      <div id="cioppino-feedback" class="small" style="margin-top:0.5rem"></div>
    </form>

    <div style="margin-top:0.75rem;">
      <button class="sq-btn sq-run" onclick="runUnitTest()">🧪 Run Update Unit Test</button>
      <div id="terminal-test" class="sq-terminal" style="margin-top:0.5rem"></div>
    </div>
  </div>
</details>

---

## 🎉 Module Complete — San Francisco UPDATE Mastery

Congratulations! You've mastered **UPDATE operations** through San Francisco's culinary scene:
- 🥟 **Dim Sum**: Class-based update methods
- 🍜 **Chow Mein**: Object property modification  
- 🍞 **Sourdough**: Form-based PUT requests
- 🦀 **Dungeness Crab**: Validation and error handling
- 🍫 **Ghirardelli**: Response handling and timestamps
- 🍲 **Cioppino**: Best practices and transactions

**Seattle — DELETE module unlocked!** 🌲 Continue to learn data removal operations!

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

<script type="text/javascript">
// Task completion tracking
window.taskProgress = {
  dimsum: false,
  chowmein: false,
  sourdough: false,
  dungeness: false,
  ghirardelli: false,
  cioppino: false
};

// Mock API and utility functions
(function () {
  function t() { return Date.now().toString(36).slice(-6); }

  // Mock DB wrapper
  class MockDB {
    constructor() {
      this.load();
    }
    load() {
      const raw = localStorage.getItem('foodquest_sf_db_v1');
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
      localStorage.setItem('foodquest_sf_db_v1', JSON.stringify({
        dishes: this.dishes, ingredients: this.ingredients, dishIngredients: this.dishIngredients
      }));
    }
    reset() {
      this.dishes = []; this.ingredients = []; this.dishIngredients = []; this.save();
    }
  }

  // Mock API
  class MockAPI {
    constructor() {
      this.db = new MockDB();
    }

    findOrCreateIngredient(name) {
      const existing = this.db.ingredients.find(i => i.name.toLowerCase() === name.toLowerCase());
      if (existing) return existing;
      const newIng = { id: t(), name, createdAt: new Date().toISOString() };
      this.db.ingredients.push(newIng);
      return newIng;
    }

    async postDish(payload) {
      if (!payload || !payload.name || !payload.category || !Array.isArray(payload.ingredients) || isNaN(payload.calories))
        return { status:400, body:{error:"Missing required fields"} };
      const dish = { id:t(), ...payload, createdAt:new Date().toISOString() };
      this.db.dishes.push(dish);
      this.db.save();
      return { status:201, body:dish };
    }

    async putDish(id, payload) {
      if (!payload || !payload.name || !payload.category || !Array.isArray(payload.ingredients) || isNaN(payload.calories)) {
        return { status: 400, body: { error: "Missing required fields" } };
      }

      const dishIndex = this.db.dishes.findIndex(d => d.id === id);
      if (dishIndex === -1) {
        return { status: 404, body: { error: "Dish not found" } };
      }

      try {
        const dish = { ...this.db.dishes[dishIndex], ...payload, updatedAt: new Date().toISOString() };
        this.db.dishes[dishIndex] = dish;

        this.db.dishIngredients = this.db.dishIngredients.filter(di => di.dishId !== id);

        for (const ing of payload.ingredients) {
          if (!ing || !ing.name) throw new Error("Invalid ingredient");
          const ingRec = this.findOrCreateIngredient(ing.name);
          this.db.dishIngredients.push({ id: t(), dishId: dish.id, ingredientId: ingRec.id, qty: ing.qty || null, unit: ing.unit || null });
        }

        this.db.save();
        return { status: 200, body: dish };
      } catch (err) {
        return { status: 500, body: { error: err.message || "Transaction failed" } };
      }
    }

    reset() { this.db.reset(); }
  }

  window.MockAPIInstance = new MockAPI();

  // Utility functions
  window.logTo = function (id, ...parts) {
    const el = document.getElementById(id);
    if (!el) return;
    const text = parts.map(p => typeof p === 'object' ? JSON.stringify(p, null, 2) : String(p)).join(' ');
    el.textContent += (el.textContent ? '\n' : '') + text;
    el.scrollTop = el.scrollHeight;
  };

  window.clearTerm = function (id) { 
    const el = document.getElementById(id); 
    if (el) el.textContent = ''; 
  };

  window.showToast = function(text, ms = 3000) {
    const b = document.getElementById('sqToast');
    if (b) {
      b.textContent = text;
      b.style.display = 'block';
      setTimeout(()=> b.style.display = 'none', ms);
    }
  };

  // Initialize
  if (!localStorage.getItem('foodquest_sf_db_v1')) {
    window.MockAPIInstance.db.save();
  }
})();

// Progress management
function loadTaskProgress() {
  const saved = localStorage.getItem('sf_task_progress');
  if (saved) {
    try {
      window.taskProgress = { ...window.taskProgress, ...JSON.parse(saved) };
    } catch (e) {
      console.error('Error loading task progress:', e);
    }
  }
  updateProgressDisplay();
}

function saveTaskProgress() {
  try {
    localStorage.setItem('sf_task_progress', JSON.stringify(window.taskProgress));
  } catch (e) {
    console.error('Error saving task progress:', e);
  }
}

window.completeTask = function(taskName) {
  if (!window.taskProgress[taskName]) {
    window.taskProgress[taskName] = true;
    saveTaskProgress();
    updateProgressDisplay();
    checkModuleCompletion();
  }
};

function updateProgressDisplay() {
  const tasks = ['dimsum', 'chowmein', 'sourdough', 'dungeness', 'ghirardelli', 'cioppino'];
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

  const percentage = Math.round((completedCount / tasks.length) * 100);
  const percentageElement = document.getElementById('completion-percentage');
  const progressBar = document.getElementById('progress-bar');
  
  if (percentageElement) percentageElement.textContent = `${percentage}%`;
  if (progressBar) progressBar.style.width = `${percentage}%`;
}

function checkModuleCompletion() {
  const allTasks = Object.values(window.taskProgress);
  const isComplete = allTasks.every(task => task === true);
  
  if (isComplete) {
    const notification = document.getElementById('unlockNotification');
    if (notification) {
      notification.style.display = 'block';
      setTimeout(() => notification.style.display = 'none', 4000);
    }
    unlockSeattle();
  }
}

function unlockSeattle() {
  try {
    const saved = localStorage.getItem('city_progress');
    let gameProgress = saved ? JSON.parse(saved) : { 
      unlockedCities: [0, 1, 2], 
      completedCities: [], 
      totalCitiesCompleted: 0 
    };
    
    if (!gameProgress.completedCities.includes(2)) {
      gameProgress.completedCities.push(2);
      gameProgress.totalCitiesCompleted++;
    }
    
    if (!gameProgress.unlockedCities.includes(3)) {
      gameProgress.unlockedCities.push(3);
    }
    
    localStorage.setItem('city_progress', JSON.stringify(gameProgress));
    console.log('✅ SF completed! Seattle unlocked.');
    
    if (window.parent && window.parent.markCityCompleted) {
      window.parent.markCityCompleted(2);
    }
    
    return true;
  } catch (e) {
    console.error('❌ SF Unlock failed:', e);
    return false;
  }
}

// Quiz functions
function checkDimSumAnswers() {
  const answers = {
    'blank-updatePrice': 'updatePrice',
    'blank-options': 'options', 
    'blank-class': 'class'
  };
  let correct = 0;
  Object.keys(answers).forEach(id => {
    if (document.getElementById(id).value.toLowerCase() === answers[id].toLowerCase()) correct++;
  });
  const feedback = document.getElementById('dimsum-feedback');
  if (correct === 3) {
    feedback.textContent = '✅ All correct! Dim Sum mastered.';
    feedback.style.color = 'var(--success)';
    completeTask('dimsum');
    showToast('🥟 Dim Sum completed!');
  } else {
    feedback.textContent = `${correct}/3 correct. Try again!`;
    feedback.style.color = 'var(--danger)';
  }
  return false;
}

function checkChowmeinAnswers() {
  const answers = {
    'blank-noodleType': 'noodleType',
    'blank-updateProtein': 'updateProtein',
    'blank-extras': 'extras'
  };
  let correct = 0;
  Object.keys(answers).forEach(id => {
    if (document.getElementById(id).value.toLowerCase() === answers[id].toLowerCase()) correct++;
  });
  const feedback = document.getElementById('chowmein-feedback');
  if (correct === 3) {
    feedback.textContent = '✅ All correct! Chow Mein mastered.';
    feedback.style.color = 'var(--success)';
    completeTask('chowmein');
    showToast('🍜 Chow Mein completed!');
  } else {
    feedback.textContent = `${correct}/3 correct. Try again!`;
    feedback.style.color = 'var(--danger)';
  }
  return false;
}

function checkDungeness() {
  const status = document.getElementById('dungeness-type').value.toLowerCase();
  const id = document.getElementById('dungeness-region').value.toLowerCase();
  let correct = 0;
  if (status.includes('400')) correct++;
  if (id.includes('id')) correct++;
  const feedback = document.getElementById('dungeness-feedback');
  if (correct === 2) {
    feedback.textContent = '✅ Validation concepts mastered!';
    feedback.style.color = 'var(--success)';
    completeTask('dungeness');
    showToast('🦀 Dungeness Crab completed!');
  } else {
    feedback.textContent = `${correct}/2 correct. Try again!`;
    feedback.style.color = 'var(--danger)';
  }
  return false;
}

function checkGhirardelli() {
  const timestamp = document.getElementById('ghir-prod').value.toLowerCase();
  const status = document.getElementById('ghir-square').value;
  let correct = 0;
  if (timestamp.includes('updated')) correct++;
  if (status === '200') correct++;
  const feedback = document.getElementById('ghir-feedback');
  if (correct === 2) {
    feedback.textContent = '✅ Response handling mastered!';
    feedback.style.color = 'var(--success)';
    completeTask('ghirardelli');
    showToast('🍫 Ghirardelli completed!');
  } else {
    feedback.textContent = `${correct}/2 correct. Try again!`;
    feedback.style.color = 'var(--danger)';
  }
  return false;
}

function checkCioppino() {
  const transaction = document.getElementById('cioppino-cuisine').value.toLowerCase();
  const existence = document.getElementById('cioppino-ing').value.toLowerCase();
  let correct = 0;
  if (transaction.includes('transaction')) correct++;
  if (existence.includes('exist')) correct++;
  const feedback = document.getElementById('cioppino-feedback');
  if (correct === 2) {
    feedback.textContent = '✅ Best practices mastered!';
    feedback.style.color = 'var(--success)';
    completeTask('cioppino');
    showToast('🍲 Cioppino completed!');
  } else {
    feedback.textContent = `${correct}/2 correct. Try again!`;
    feedback.style.color = 'var(--danger)';
  }
  return false;
}

// Ingredient management
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
  if (!window._localIngredientBuffer.length) { 
    el.textContent = 'No ingredients yet'; 
    return; 
  }
  el.innerHTML = window._localIngredientBuffer.map((ing,i) => 
    `${i+1}. ${ing.name} — ${ing.qty||''} ${ing.unit||''} <button class="ingredients-remove-btn" onclick="removeIngredient(${i})">remove</button>`
  ).join('<br>');
};

window.removeIngredient = function(i) { 
  window._localIngredientBuffer.splice(i,1); 
  renderIngredientList(); 
};

window.clearForm = function() {
  document.getElementById('dish-id').value = '';
  document.getElementById('dish-name').value = '';
  document.getElementById('dish-category').value = '';
  document.getElementById('dish-calories').value = '';
  document.getElementById('dish-photo').value = '';
  window._localIngredientBuffer = [];
  renderIngredientList();
  clearTerm('terminal-update');
};

window.autofillSourdough = function() {
  document.getElementById('dish-id').value = 'sourdough-001';
  document.getElementById('dish-name').value = 'SF Artisan Sourdough';
  document.getElementById('dish-category').value = 'Artisan Bread';
  document.getElementById('dish-calories').value = '180';
  document.getElementById('dish-photo').value = 'https://example.com/sourdough.jpg';
  
  window._localIngredientBuffer = [
    { name: 'flour', qty: '3', unit: 'cups' },
    { name: 'water', qty: '1.5', unit: 'cups' },
    { name: 'sourdough starter', qty: '1', unit: 'cup' },
    { name: 'salt', qty: '1', unit: 'tsp' }
  ];
  renderIngredientList();
};

window.runUpdateForm = async function() {
  clearTerm('terminal-update');
  const id = document.getElementById('dish-id').value.trim();
  const name = document.getElementById('dish-name').value.trim();
  const category = document.getElementById('dish-category').value.trim();
  const calories = parseInt(document.getElementById('dish-calories').value);
  const photo = document.getElementById('dish-photo').value.trim() || null;
  const ingredients = window._localIngredientBuffer.slice();

  if (!id || !name || !category || isNaN(calories) || !ingredients.length) {
    logTo('terminal-update', '[Client] Validation failed: all fields required');
    return;
  }

  const payload = { name, category, calories, photo, ingredients, city: 'sf' };
  logTo('terminal-update', '[Client] Sending PUT /api/dishes/' + id, payload);

  const res = await window.MockAPIInstance.putDish(id, payload);
  if (res.status === 200) {
    logTo('terminal-update', '[Server] 200 OK', res.body);
    showToast('🍞 Sourdough updated — +50 XP');
    completeTask('sourdough');
  } else {
    logTo('terminal-update', '[Server] Error', res);
  }
};

window.runUnitTest = async function() {
  clearTerm('terminal-test');
  const createRes = await window.MockAPIInstance.postDish({
    name: "Test Dish",
    category: "Test",
    calories: 100,
    ingredients: [{ name: "test", qty: "1", unit: "unit" }],
    city: "sf"
  });
  
  if (createRes.status !== 201) {
    logTo('terminal-test', '❌ Setup Failed');
    return;
  }
  
  const id = createRes.body.id;
  const updateRes = await window.MockAPIInstance.putDish(id, {
    name: "Updated Test Dish",
    category: "Test",
    calories: 200,
    ingredients: [{ name: "test", qty: "2", unit: "units" }],
    city: "sf"
  });
  
  if (updateRes.status === 200) {
    logTo('terminal-test', '✅ Unit Test Passed: PUT returned 200');
    showToast('Unit test passed!');
  } else {
    logTo('terminal-test', '❌ Unit Test Failed');
  }
};

// Auto complete all tasks
function autoCompleteAllTasks() {
  document.getElementById('quickCompleteBtn').style.display = 'none';
  
  // Fill all answers
  document.getElementById('blank-updatePrice').value = 'updatePrice';
  document.getElementById('blank-options').value = 'options';
  document.getElementById('blank-class').value = 'class';
  checkDimSumAnswers();
  
  setTimeout(() => {
    document.getElementById('blank-noodleType').value = 'noodleType';
    document.getElementById('blank-updateProtein').value = 'updateProtein';
    document.getElementById('blank-extras').value = 'extras';
    checkChowmeinAnswers();
  }, 200);
  
  setTimeout(() => {
    autofillSourdough();
    runUpdateForm();
  }, 400);
  
  setTimeout(() => {
    document.getElementById('dungeness-type').value = '400';
    document.getElementById('dungeness-region').value = 'id';
    checkDungeness();
  }, 600);
  
  setTimeout(() => {
    document.getElementById('ghir-prod').value = 'updatedAt';
    document.getElementById('ghir-square').value = '200';
    checkGhirardelli();
  }, 800);
  
  setTimeout(() => {
    document.getElementById('cioppino-cuisine').value = 'transaction';
    document.getElementById('cioppino-ing').value = 'existence';
    checkCioppino();
  }, 1000);
  
  showToast('🎉 All UPDATE tasks completed! Seattle unlocked!', 4000);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
  loadTaskProgress();
});
</script>