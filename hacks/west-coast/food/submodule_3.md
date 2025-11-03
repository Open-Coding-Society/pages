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
.sq-card:hover { 
  transform: translateY(-4px); 
  box-shadow: 0 18px 48px rgba(59,130,246,0.08); 
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
.sq-btn:active { 
  transform: translateY(1px) scale(0.998); 
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

.sq-field::placeholder { 
  color: var(--muted); 
}

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
.small { 
  font-size:0.85rem; 
  color: var(--muted); 
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

.progress-tracker .task-item { 
  margin: 0.35rem 0; 
  color: var(--muted); 
}

/* Status text */
.task-complete { 
  color: var(--success) !important; 
  font-weight: 700; 
}

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

/* Back / Next buttons area */
a.back-home {
  background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
  border: 1px solid rgba(139,92,246,0.32);
  padding: 12px 28px;
  border-radius: 22px;
  color: white;
  font-weight: 700;
  text-decoration: none;
  display: inline-block;
  box-shadow: 0 8px 30px rgba(139,92,246,0.12);
}

.next-city-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: linear-gradient(135deg, var(--accent-3), rgba(6,182,212,0.9));
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 0.6rem;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  box-shadow: 0 14px 40px rgba(6,182,212,0.12);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  z-index: 10000;
}

.next-city-btn:hover { 
  transform: translateY(-3px); 
}

/* Editor tool row */
.editor-actions { 
  display:flex; 
  gap:0.5rem; 
  align-items:center; 
  flex-wrap:wrap; 
}

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

/* Itinerary Foods Display */
.itinerary-foods {
  background: linear-gradient(135deg, rgba(139,92,246,0.08), rgba(59,130,246,0.06));
  border: 2px solid var(--card-border);
  padding: 1.5rem;
  border-radius: 0.75rem;
  margin: 1.5rem 0;
  box-shadow: 0 8px 30px rgba(2,6,23,0.45);
}

.itinerary-foods h3 {
  color: var(--accent-1);
  margin: 0 0 1rem 0;
  font-size: 1.3rem;
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

/* Tiny focus ring for accessibility */
.sq-field:focus, .code-editor:focus, .sq-btn:focus { 
  box-shadow: 0 0 0 4px rgba(59,130,246,0.12); 
  border-color: rgba(59,130,246,0.22); 
  outline: none; 
}

/* small responsive */
@media (max-width: 720px) {
  body { padding: 0.75rem; }
  .sq-card { padding: 0.8rem; }
  .next-city-btn { 
    right: 12px; 
    left: auto; 
    bottom: 12px; 
    font-size: 0.95rem; 
    padding: 0.6rem 1rem; 
  }
}

/* small inline remove button styling */
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

<!-- Add a toast element -->
<div id="sqToast" class="sq-toast"></div>

<!-- Itinerary Foods Display -->
<div class="itinerary-foods">
  <h3>🌉 Your San Francisco Food Selections</h3>
  <div id="itinerary-foods-display"></div>
</div>

# 🌉 San Francisco — UPDATE (CRUD Submodule 3)

<!-- Progress Tracker -->
<div class="progress-tracker">
  <h3>🎯 San Francisco Progress Tracker</h3>
  <div id="progress-display">
    <div id="task-dimsum" class="task-item">Task 1: Dim Sum Menu - <span class="status">Incomplete</span></div>
    <div id="task-chowmein" class="task-item">Task 2: Chowmein Order - <span class="status">Incomplete</span></div>
    <div id="task-sourdough" class="task-item">Task 3: Update Sourdough - <span class="status">Incomplete</span></div>
    <div id="task-seed" class="task-item">Task 4: Seed Pantry - <span class="status">Incomplete</span></div>
    <div id="task-view" class="task-item">Task 5: View Pantry - <span class="status">Incomplete</span></div>
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

**Quest Chapter:** *The Food Route*  
**Focus:** U in CRUD — **UPDATE**  
**Location:** San Francisco, CA 🌉🍜

Welcome! This interactive page lets learners *actually* update dishes, ingredients, and join records via simulated API calls — right in the browser.

<!-- Dark mode toggle -->
<div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-bottom:0.75rem;">
  <button id="themeToggleBtn" class="sq-btn" title="Toggle dark / light">🌙 Dark</button>
</div>

<!-- Fill-in-the-blanks for Sourdough -->
<div class="sq-card">
  <div class="sq-label">Fill in the blanks about updating Sourdough. Type the missing words below.</div>
  <form id="sourdough-fill-blank" onsubmit="return checkSourdoughAnswers()" style="display:grid; gap:0.75rem;">
    <label class="sq-label">1. What field is required to identify which dish to update?</label>
    <input class="sq-field" type="text" id="blank-id" placeholder="Field name...">

    <label class="sq-label">2. What field stores the number of calories?</label>
    <input class="sq-field" type="text" id="blank-calories" placeholder="Field name...">

    <label class="sq-label">3. What field stores the dish's category?</label>
    <input class="sq-field" type="text" id="blank-category" placeholder="Field name...">

    <button class="sq-btn sq-run" type="submit">Check Answers</button>
    <div id="sourdough-feedback" class="small" style="margin-top:0.5rem"></div>
  </form>
</div>

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

---

# %% Interactive Task: DimSum Menu (Editable + Run)

<!-- Example for reference -->
<details open>
  <summary>Example: DimSumMenu class</summary>
  <pre class="sq-terminal" style="background: #181e2a; color: #e6eef6;">
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
  }
  addOption(option) {
    this.options.push(option);
  }
  removeOption(itemId) {
    const index = this.options.findIndex(o => o.id === itemId);
    if (index > -1) this.options.splice(index, 1);
  }
}
  </pre>
</details>

<div class="sq-card">
  <div class="sq-label">Fill in the blanks to complete the <strong>DimSumMenu</strong> class. Type the missing code in the input fields below.</div>
  <form id="dimsum-fill-blank" onsubmit="return checkDimSumAnswers()" style="display:grid; gap:0.75rem;">
    <label class="sq-label">1. What method updates the price of a menu item?</label>
    <input class="sq-field" type="text" id="blank-updatePrice" placeholder="Method name...">

    <label class="sq-label">2. What array holds all the menu options?</label>
    <input class="sq-field" type="text" id="blank-options" placeholder="Property name...">

    <label class="sq-label">3. What keyword is used to define a class in JavaScript?</label>
    <input class="sq-field" type="text" id="blank-class" placeholder="Keyword...">

    <label class="sq-label">4. What method adds a new option to the menu?</label>
    <input class="sq-field" type="text" id="blank-addOption" placeholder="Method name...">

    <label class="sq-label">5. What method removes an option from the menu?</label>
    <input class="sq-field" type="text" id="blank-removeOption" placeholder="Method name...">

    <button class="sq-btn sq-run" type="submit">Check Answers</button>
    <div id="dimsum-feedback" class="small" style="margin-top:0.5rem"></div>
  </form>
</div>

---

# %% Interactive Task: ChowmeinOrder (Editable + Run)

<!-- Example for reference -->
<details open>
  <summary>Example: ChowmeinOrder class</summary>
  <pre class="sq-terminal" style="background: #181e2a; color: #e6eef6;">
class ChowmeinOrder {
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
  }
  updateSpiceLevel(level) {
    this.spiceLevel = level;
  }
  updateExtras(newExtras) {
    this.extras = newExtras;
  }
}
  </pre>
</details>

<div class="sq-card">
  <div class="sq-label">Fill in the blanks about ChowmeinOrder. Type the missing words below.</div>
  <form id="chowmein-fill-blank" onsubmit="return checkChowmeinAnswers()" style="display:grid; gap:0.75rem;">
    <label class="sq-label">1. What property stores the type of noodle?</label>
    <input class="sq-field" type="text" id="blank-noodleType" placeholder="Property name...">

    <label class="sq-label">2. What method changes the protein?</label>
    <input class="sq-field" type="text" id="blank-updateProtein" placeholder="Method name...">

    <label class="sq-label">3. What property stores extra toppings?</label>
    <input class="sq-field" type="text" id="blank-extras" placeholder="Property name...">

    <button class="sq-btn sq-run" type="submit">Check Answers</button>
    <div id="chowmein-feedback" class="small" style="margin-top:0.5rem"></div>
  </form>
</div>

---

# %% Interactive Task: Update the Sourdough (Form + Run)

<!-- Example for reference -->
<details open>
  <summary>Example: Sourdough update payload</summary>
  <pre class="sq-terminal" style="background: #181e2a; color: #e6eef6;">
{
  id: "d123",
  name: "SF Sourdough",
  category: "Artisan Bread",
  calories: 180,
  photo: "https://...",
  ingredients: [
    { name: "flour", qty: "3", unit: "cups" }
  ],
  city: "sf"
}
  </pre>
</details>

<div class="sq-card">
  <div class="sq-label">Use the form to update a <strong>Sourdough</strong>. Required fields: <em>id, name, category, ingredients (name, qty, unit), calories</em>. Photo may be a URL or uploaded file (stored as data URL).</div>

  <div style="display:grid; grid-template-columns: 1fr; gap:0.5rem;">
    <label class="sq-label">Dish ID to update</label>
    <input id="dish-id" class="sq-field" placeholder="d123" />

    <label class="sq-label">Updated name</label>
    <input id="dish-name" class="sq-field" placeholder="Sourdough" value="SF Sourdough" />

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
      <button class="sq-btn sq-run" onclick="runUpdateForm()">Update Dish (PUT)</button>
      <button class="sq-btn" onclick="clearForm()">Clear</button>
    </div>

    <div style="margin-top:0.5rem">
      <div id="terminal-update" class="sq-terminal"></div>
    </div>
  </div>
</div>

---

# %% Interactive: Simulated PUT endpoint + Unit Test

<!-- Example for reference -->
<details open>
  <summary>Example: PUT endpoint usage</summary>
  <pre class="sq-terminal" style="background: #181e2a; color: #e6eef6;">
// Update a dish using PUT
const id = "d123";
const payload = {
  name: "Garlic Noodles",
  category: "Noodles",
  calories: 550,
  photo: null,
  ingredients: [
    { name: "noodles", qty: "8", unit: "oz" },
    { name: "garlic", qty: "6", unit: "cloves" },
    { name: "butter", qty: "2", unit: "tbsp" }
  ],
  city: "sf"
};
const res = await window.MockAPIInstance.putDish(id, payload);
if (res.status === 200) {
  console.log("Update successful!");
  console.log(res.body);
}
  </pre>
</details>

<div class="sq-card">
  <div class="sq-label">Fill in the blanks about the PUT endpoint. Type the missing words below.</div>

  <form id="put-fill-blank" onsubmit="return checkPutAnswers()" style="display:grid; gap:0.75rem;">
    <label class="sq-label">1. What HTTP method is used to update a dish?</label>
    <input class="sq-field" type="text" id="blank-method" placeholder="Method...">

    <label class="sq-label">2. What status code means the update was successful?</label>
    <input class="sq-field" type="text" id="blank-status" placeholder="Status code...">

    <label class="sq-label">3. What property in the payload contains the dish's name?</label>
    <input class="sq-field" type="text" id="blank-name" placeholder="Property name...">

    <button class="sq-btn sq-run" type="submit">Check Answers</button>
    <div id="put-feedback" class="small" style="margin-top:0.5rem"></div>
  </form>

  <div style="margin-top:0.75rem;">
    <button class="sq-btn sq-run" onclick="runUnitTest()">Run Unit Test: PUT returns 200 & updated resource</button>
    <div id="terminal-test" class="sq-terminal" style="margin-top:0.5rem"></div>
  </div>
</div>

---

# %% Interactive Task: Seed Pantry (Initial Data)

<div class="sq-card">
  <div class="sq-label">Seed the San Francisco pantry with at least three dishes (Sourdough, Cioppino, Dim Sum)</div>

  <div style="display:flex; gap:0.5rem;">
    <button class="sq-btn sq-run" onclick="seedPantry()">Seed Pantry</button>
    <button class="sq-btn" onclick="clearTerm('terminal-seed')">Clear</button>
  </div>

  <pre id="terminal-seed" class="sq-terminal" style="margin-top:0.5rem"></pre>
</div>

---

# %% Interactive Task: View Pantry (GET /api/dishes?city=sf)

<div class="sq-card">
  <div class="sq-label">View the San Francisco pantry (GET /api/dishes?city=sf)</div>

  <div style="display:flex; gap:0.5rem;">
    <button class="sq-btn sq-run" onclick="viewPantry()">View Pantry</button>
    <button class="sq-btn" onclick="clearTerm('terminal-pantry')">Clear</button>
  </div>

  <pre id="terminal-pantry" class="sq-terminal" style="margin-top:0.5rem"></pre>
</div>

---

## 🎉 Module Complete — San Francisco

Congratulations! You've successfully completed **CRUD: UPDATE** in San Francisco. All tasks — updating dim sum menu, chowmein orders, and the interactive pantry — are done. ✅  

Your **Sourdough** update earned you **+50 XP** and the **"First Update"** badge! 🏆  

The next city awaits: **Seattle — DELETE module unlocked!** 🌲  
Click through to begin exploring **removing dishes and cleaning up records** in Seattle.

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

<script type="text/javascript">
/* Mock API + utilities for this page. Outputs go to terminal elements using `logTo(id,...)` */
(function () {
  // helpers
  function t() { return Date.now().toString(36).slice(-6); }
  
  // Task completion tracking
  window.taskProgress = {
    dimsum: false,
    chowmein: false,
    sourdough: false,
    seed: false,
    view: false
  };

  // Load progress from localStorage
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

  // Save progress to localStorage
  function saveTaskProgress() {
    try {
      localStorage.setItem('sf_task_progress', JSON.stringify(window.taskProgress));
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
    const tasks = ['dimsum', 'chowmein', 'sourdough', 'seed', 'view'];
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
      // Show the unlock notification
      const notification = document.getElementById('unlockNotification');
      if (notification) {
        notification.style.display = 'block';
        setTimeout(() => notification.style.display = 'none', 4000);
      }
      unlockSeattle();
      console.log('🎉 San Francisco module completed! Seattle should now be unlocked.');
    }
  }

  // Unlock Seattle (city index 3)
  function unlockSeattle() {
    try {
      const saved = localStorage.getItem('city_progress');
      let gameProgress = saved ? JSON.parse(saved) : { unlockedCities:[0,1,2], completedCities:[], totalCitiesCompleted:0 };
      if (!gameProgress.completedCities.includes(2)) {
        gameProgress.completedCities.push(2);
        gameProgress.totalCitiesCompleted++;
      }
      if (!gameProgress.unlockedCities.includes(3)) {
        gameProgress.unlockedCities.push(3);
      }
      localStorage.setItem('city_progress', JSON.stringify(gameProgress));
      console.log('✅ SF Progress updated:', gameProgress);
    } catch (e) {
      console.error('SF Unlock failed:', e);
    }
  }

  // Load and display itinerary foods
  function loadItineraryFoods() {
    const itineraryData = localStorage.getItem('westCoastItinerary');
    const displayElement = document.getElementById('itinerary-foods-display');
    
    if (!itineraryData) {
      displayElement.innerHTML = '<div class="no-itinerary-msg">No itinerary found. Please complete the trip planner quiz first!</div>';
      return;
    }

    try {
      const itinerary = JSON.parse(itineraryData);
      const sfFoods = itinerary.cities['San Francisco']?.foods || [];
      
      if (sfFoods.length === 0) {
        displayElement.innerHTML = '<div class="no-itinerary-msg">No foods selected for San Francisco in your itinerary.</div>';
        return;
      }

      let html = '';
      sfFoods.forEach((food, index) => {
        html += `
          <div class="food-item">
            <h4>🍽️ ${food}</h4>
            <p>Selected food #${index + 1} from your personalized itinerary</p>
          </div>
        `;
      });
      
      displayElement.innerHTML = html;
    } catch (e) {
      console.error('Error loading itinerary:', e);
      displayElement.innerHTML = '<div class="no-itinerary-msg">Error loading itinerary data.</div>';
    }
  }

  window.logTo = function (id, ...parts) {
    const el = document.getElementById(id);
    if (!el) return;
    const text = parts.map(p => typeof p === 'object' ? JSON.stringify(p, null, 2) : String(p)).join(' ');
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

  // API simulating atomic update with transaction-like rollback
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

    // Simulates POST /api/dishes (for seeding)
    async postDish(payload) {
      if (!payload || !payload.name || !payload.category || !Array.isArray(payload.ingredients) || isNaN(payload.calories))
        return { status:400, body:{error:"Missing required fields"} };
      const dish = { id:t(), ...payload, createdAt:new Date().toISOString() };
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

    // Simulates PUT /api/dishes/{id}
    async putDish(id, payload) {
      // server-side validation
      if (!payload || !payload.name || !payload.category || !Array.isArray(payload.ingredients) || isNaN(payload.calories)) {
        return { status: 400, body: { error: "Missing required fields" } };
      }

      const dishIndex = this.db.dishes.findIndex(d => d.id === id);
      if (dishIndex === -1) {
        return { status: 404, body: { error: "Dish not found" } };
      }

      // transaction simulation
      const before = this._cloneState();
      try {
        const dish = { ...this.db.dishes[dishIndex], ...payload, updatedAt: new Date().toISOString() };
        this.db.dishes[dishIndex] = dish;

        // remove old dish ingredients
        this.db.dishIngredients = this.db.dishIngredients.filter(di => di.dishId !== id);

        // create ingredients if missing, add dishIngredients
        for (const ing of payload.ingredients) {
          if (!ing || !ing.name) throw new Error("Invalid ingredient");
          const ingRec = this.findOrCreateIngredient(ing.name);
          this.db.dishIngredients.push({ id: t(), dishId: dish.id, ingredientId: ingRec.id, qty: ing.qty || null, unit: ing.unit || null });
        }

        // save and return updated resource
        this.db.save();
        return { status: 200, body: dish };
      } catch (err) {
        // rollback
        this._restoreState(before);
        return { status: 500, body: { error: err.message || "Transaction failed" } };
      }
    }

    // Bulk PUT
    async putBulk(updates) {
      if (!Array.isArray(updates)) return { status: 400, body: { error: "Expected array" } };
      const updated = [];
      for (const u of updates) {
        if (!u.id) return { status: 400, body: { error: "Missing id in update" } };
        const payload = Object.assign({ ingredients: [] }, u);
        const res = await this.putDish(u.id, payload);
        if (res.status !== 200) { return { status: 500, body: { error: "Bulk update failed" } }; }
        updated.push(res.body);
      }
      return { status: 200, body: updated };
    }

    // GET /api/dishes?city=sf
    async getDishes(query = {}) {
      const city = (query.city || 'sf').toLowerCase();
      const itineraryData = localStorage.getItem('westCoastItinerary');
      
      // If itinerary exists, filter to show only selected foods
      if (itineraryData) {
        try {
          const itinerary = JSON.parse(itineraryData);
          const selectedFoods = itinerary.cities['San Francisco']?.foods || [];
          
          if (selectedFoods.length > 0) {
            return this.db.dishes.filter(d => 
              (d.city||'sf').toLowerCase() === city && 
              selectedFoods.some(food => d.name.includes(food) || food.includes(d.name.split(' ')[0]))
            );
          }
        } catch (e) {
          console.error('Error filtering by itinerary:', e);
        }
      }
      
      // Default: return all dishes for the city
      return this.db.dishes.filter(d => (d.city||'sf').toLowerCase()===city);
    }

    // reset
    reset() { this.db.reset(); }
  }

  // singleton
  window.MockAPIInstance = new MockAPI();

  // expose initializer
  window.initMock = function() {
    window.MockAPIInstance.reset();
    window.logTo('terminal-init', '[MockAPI] Reset DB. You can seed or update dishes now.');
    showToast("Mock DB reset");
  };

  // toast helper
  window.showToast = function(text, ms = 3000) {
    const b = document.getElementById('sqToast');
    if (b) {
      b.textContent = text;
      b.style.display = 'block';
      setTimeout(()=> b.style.display = 'none', ms);
    }
  };

  // initialize on load
  if (!localStorage.getItem('foodquest_sf_db_v1')) {
    window.MockAPIInstance.db.save();
    window.logTo('terminal-init', '[MockAPI] Initialized new DB. Try seeding!');
  } else {
    window.logTo('terminal-init', '[MockAPI] DB loaded from localStorage.');
  }

  // Initialize everything
  loadTaskProgress();
  loadItineraryFoods();

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
    if (!window._localIngredientBuffer.length) { el.textContent = 'No ingredients yet'; return; }
    el.innerHTML = window._localIngredientBuffer.map((ing,i) => `${i+1}. ${ing.name} — ${ing.qty||''} ${ing.unit||''} <button class="ingredients-remove-btn" onclick="removeIngredient(${i})">remove</button>`).join('<br>');
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

  window.runUpdateForm = async function() {
    clearTerm('terminal-update');
    const id = document.getElementById('dish-id').value.trim();
    const name = document.getElementById('dish-name').value.trim();
    const category = document.getElementById('dish-category').value.trim();
    const calories = parseInt(document.getElementById('dish-calories').value);
    const photo = document.getElementById('dish-photo').value.trim() || null;
    const ingredients = window._localIngredientBuffer.slice();

    // client-side validation
    if (!id || !name || !category || isNaN(calories) || !ingredients.length) {
      logTo('terminal-update', '[Client] Validation failed: id, name, category, calories, and at least 1 ingredient required');
      return;
    }

    const payload = { name, category, calories, photo, ingredients, city: 'sf' };

    logTo('terminal-update', '[Client] Sending PUT /api/dishes/' + id, payload);

    // call mock API
    const res = await window.MockAPIInstance.putDish(id, payload);
    if (res.status === 200) {
      logTo('terminal-update', '[Server] 200 OK', res.body);
      showToast(res.body.name + ' updated — +50 XP');
    } else {
      logTo('terminal-update', '[Server] Error', res);
    }
  };

  // Other interactive functions
  window.seedPantry = async function() {
    clearTerm('terminal-seed');
    const seed = [
      { name: "Clam Chowder in Sourdough Bread Bowl", category: "Bread", calories: 180, ingredients: [{name:"flour", qty:"3", unit:"cups"}], city:'sf' },
      { name: "Mission Burrito", category: "Mexican", calories: 450, ingredients: [{name:"tortilla", qty:"1", unit:"large"}], city:'sf' },
      { name: "Dungeness Crab", category: "Seafood", calories: 600, ingredients: [{name:"crab", qty:"1", unit:"whole"}], city:'sf' },
    ];
    logTo('terminal-seed', '[Client] Sending bulk seed...');
    const res = await window.MockAPIInstance.postBulk(seed);
    if (res.status === 201) {
      logTo('terminal-seed', '✅ Seed success:', res.body);
      completeTask('seed');
      showToast('Pantry seeded successfully!');
    } else {
      logTo('terminal-seed', '❌ Seed failed', res);
    }
  };

  window.viewPantry = async function() {
    clearTerm('terminal-pantry');
    const dishes = await window.MockAPIInstance.getDishes({ city: 'sf' });
    if (!dishes.length) {
      logTo('terminal-pantry','[Server] 200 OK — No dishes found for city=sf. Try seeding.');
      return;
    }
    logTo('terminal-pantry','[Server] 200 OK — Dishes for city=sf:');
    dishes.forEach(d => logTo('terminal-pantry', JSON.stringify(d, null, 2)));
    completeTask('view');
    showToast('Pantry viewed successfully!');
  };

  window.runUnitTest = async function() {
    clearTerm('terminal-test');
    // first create a dish
    const createRes = await window.MockAPIInstance.postDish({
      name: "Test Dish",
      category: "Test",
      calories: 100,
      ingredients: [{ name: "test", qty: "1", unit: "unit" }],
      city: "sf"
    });
    if (createRes.status !== 201) {
      logTo('terminal-test', '❌ Setup Failed: Could not create test dish');
      return;
    }
    // Now update it
    const id = createRes.body.id;
    const updateRes = await window.MockAPIInstance.putDish(id, {
      name: "Updated Test Dish",
      category: "Test",
      calories: 200,
      ingredients: [{ name: "test", qty: "2", unit: "units" }],
      city: "sf"
    });
    if (updateRes.status === 200 && updateRes.body && updateRes.body.name === "Updated Test Dish") {
      logTo('terminal-test', '✅ Unit Test Passed: PUT returned 200 and resource updated');
      logTo('terminal-test', JSON.stringify(updateRes.body, null, 2));
      showToast('Unit test passed!');
    } else {
      logTo('terminal-test', '❌ Unit Test Failed', JSON.stringify(updateRes, null, 2));
    }
  };
})();

// Quiz answer checking functions
function checkSourdoughAnswers() {
  const answers = {
    blank_id: "id",
    blank_calories: "calories",
    blank_category: "category"
  };
  let correct = 0;
  let total = Object.keys(answers).length;
  for (const key in answers) {
    const val = document.getElementById(key.replace('_', '-')).value.trim();
    if (val.toLowerCase() === answers[key].toLowerCase()) correct++;
  }
  const feedback = document.getElementById('sourdough-feedback');
  if (correct === total) {
    feedback.textContent = '✅ All correct! You understand the Sourdough update.';
    feedback.style.color = 'var(--success)';
    completeTask('sourdough');
    showToast('Sourdough quiz completed!');
  } else {
    feedback.textContent = `You got ${correct} out of ${total} correct. Try again!`;
    feedback.style.color = 'var(--danger)';
  }
  return false;
}

function checkDimSumAnswers() {
  const answers = {
    blank_updatePrice: "updatePrice",
    blank_options: "options",
    blank_class: "class",
    blank_addOption: "addOption",
    blank_removeOption: "removeOption"
  };
  let correct = 0;
  let total = Object.keys(answers).length;
  for (const key in answers) {
    const val = document.getElementById(key.replace('_', '-')).value.trim();
    if (val.toLowerCase() === answers[key].toLowerCase()) correct++;
  }
  const feedback = document.getElementById('dimsum-feedback');
  if (correct === total) {
    feedback.textContent = '✅ All correct! You understand the DimSumMenu class.';
    feedback.style.color = 'var(--success)';
    completeTask('dimsum');
    showToast('DimSum quiz completed!');
  } else {
    feedback.textContent = `You got ${correct} out of ${total} correct. Try again!`;
    feedback.style.color = 'var(--danger)';
  }
  return false;
}

function checkChowmeinAnswers() {
  const answers = {
    blank_noodleType: "noodleType",
    blank_updateProtein: "updateProtein",
    blank_extras: "extras"
  };
  let correct = 0;
  let total = Object.keys(answers).length;
  for (const key in answers) {
    const val = document.getElementById(key.replace('_', '-')).value.trim();
    if (val.toLowerCase() === answers[key].toLowerCase()) correct++;
  }
  const feedback = document.getElementById('chowmein-feedback');
  if (correct === total) {
    feedback.textContent = '✅ All correct! You understand ChowmeinOrder.';
    feedback.style.color = 'var(--success)';
    completeTask('chowmein');
    showToast('Chowmein quiz completed!');
  } else {
    feedback.textContent = `You got ${correct} out of ${total} correct. Try again!`;
    feedback.style.color = 'var(--danger)';
  }
  return false;
}

function checkPutAnswers() {
  const answers = {
    blank_method: "PUT",
    blank_status: "200", 
    blank_name: "name"
  };
  let correct = 0;
  let total = Object.keys(answers).length;
  for (const key in answers) {
    const val = document.getElementById(key.replace('_', '-')).value.trim();
    if (val.toLowerCase() === answers[key].toLowerCase()) correct++;
  }
  const feedback = document.getElementById('put-feedback');
  if (correct === total) {
    feedback.textContent = '✅ All correct! You understand PUT endpoints.';
    feedback.style.color = 'var(--success)';
    showToast('PUT quiz completed!');
  } else {
    feedback.textContent = `You got ${correct} out of ${total} correct. Try again!`;
    feedback.style.color = 'var(--danger)';
  }
  return false;
}

// Auto complete all tasks function
function autoCompleteAllTasks() {
  // Hide the button after clicking
  document.getElementById('quickCompleteBtn').style.display = 'none';
  
  // Fill in all the form blanks automatically
  
  // Sourdough fill-in-the-blanks
  document.getElementById('blank-id').value = 'id';
  document.getElementById('blank-calories').value = 'calories';  
  document.getElementById('blank-category').value = 'category';
  checkSourdoughAnswers();
  
  // DimSum fill-in-the-blanks
  document.getElementById('blank-updatePrice').value = 'updatePrice';
  document.getElementById('blank-options').value = 'options';
  document.getElementById('blank-class').value = 'class';
  document.getElementById('blank-addOption').value = 'addOption';
  document.getElementById('blank-removeOption').value = 'removeOption';
  checkDimSumAnswers();
  
  // Chowmein fill-in-the-blanks
  document.getElementById('blank-noodleType').value = 'noodleType';
  document.getElementById('blank-updateProtein').value = 'updateProtein';
  document.getElementById('blank-extras').value = 'extras';
  checkChowmeinAnswers();
  
  // PUT endpoint fill-in-the-blanks
  document.getElementById('blank-method').value = 'PUT';
  document.getElementById('blank-status').value = '200';
  document.getElementById('blank-name').value = 'name';
  checkPutAnswers();
  
  // Run the interactive tasks in sequence
  setTimeout(() => {
    seedPantry();
  }, 500);
  
  setTimeout(() => {
    viewPantry();
  }, 1000);
  
  setTimeout(() => {
    runUnitTest();
  }, 1500);
  
  showToast('🎉 All tasks completed! Seattle unlocked!', 4000);
}

// Theme toggle functionality
(function(){
  const btn = document.getElementById('themeToggleBtn');
  if (!btn) return;
  
  const preferred = localStorage.getItem('sf_theme') || 'dark';
  if (preferred === 'light') document.body.classList.add('light');
  updateThemeButton();

  btn.addEventListener('click', () => {
    document.body.classList.toggle('light');
    localStorage.setItem('sf_theme', document.body.classList.contains('light') ? 'light' : 'dark');
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
</script>