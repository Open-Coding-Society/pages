---
layout: opencs
microblog: true
title: "Los Angeles"
description: "City Two of Food - Los Angeles"
parent: "Los Angeles"
team: "Syntax Terrors"
submodule: 2
categories: [CSP]
tags: [food, losangeles, read, crud]
author: "Syntax Terrors"
date: 2025-10-24
footer:
  previous: /west-coast/food/SD/
  home: /west-coast/food/
  next: /west-coast/food/SF/
permalink: /west-coast/food/LA/
---

# 🍊 Los Angeles — READ & QUERY (CRUD Submodule 2)

**Quest Chapter:** *The Food Route*  
**Focus:** R in CRUD — **READ & QUERY**  
**Location:** Los Angeles, CA 🌆🌮  

Welcome to LA! This interactive page teaches database READ operations through LA's diverse food scene. Master SELECT queries, filtering, pagination, and search techniques.

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
  box-shadow: 0 20px 60px rgba(139,92,246,0.4);
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
</style>

<!-- Progress Tracker -->
<div class="progress-tracker">
  <h3>🎯 Los Angeles Progress Tracker</h3>
  <div id="progress-display">
    <div id="task-koreanbbq" class="task-item">🍖 Korean BBQ - <span class="status">Incomplete</span></div>
    <div id="task-streettacos" class="task-item">🌮 Street Tacos (al pastor) - <span class="status">Incomplete</span></div>
    <div id="task-innout" class="task-item">🍔: In-N-Out Burger - <span class="status">Incomplete</span></div>
    <div id="task-avocado" class="task-item">🥑 Avocado Toast - <span class="status">Incomplete</span></div>
    <div id="task-ramen" class="task-item">🍜 Ramen & Fusion Dishes - <span class="status">Incomplete</span></div>
    <div id="task-erewhon" class="task-item">🥤 Erewhon - <span class="status">Incomplete</span></div>
  </div>
  <div style="margin-top: 1rem; padding: 0.75rem; background: rgba(255,255,255,0.01); border-radius: 0.5rem;">
    <strong>Completion: <span id="completion-percentage">0%</span></strong>
    <div style="background: rgba(2,6,23,0.45); height: 8px; border-radius: 6px; margin-top: 0.5rem;">
      <div id="progress-bar" style="background: linear-gradient(90deg, var(--success), #059669); height: 100%; border-radius: 4px; width: 0%; transition: width 0.3s ease;"></div>
    </div>
  </div>
</div>

<div class="sq-toast" id="sqToast">Korean BBQ query — +15 XP</div>

<!-- Unlock Notification -->
<div id="unlockNotification" class="unlock-notification">
  🎉 San Francisco Unlocked!<br>
  <small style="font-size: 13px; opacity: 0.95;">You can now continue to the next city!</small>
</div>

- **🧠 What Does READ Mean?**  
  - In databases, **READ** = retrieving existing records using SELECT queries.  
  <br>
  - On the web, a client sends GET /api/dishes requests with filters.  
  <br>
  - The server processes:
    - **SELECT** statements to fetch data,  
    - **WHERE** clauses to filter results, and  
    - **ORDER BY**, **LIMIT** for sorting and pagination.  
  <br>
  - Analogy: your database is like a **restaurant directory**. Reading = **searching** the directory for specific cuisines, prices, or ratings.

---

<!-- Task 1: Korean BBQ -->
<details open>
  <summary>🍖 Korean BBQ SELECT Query</summary>
  <div class="sq-card">
    <div class="sq-label">Practice <strong>SELECT</strong> queries to retrieve Korean BBQ dishes from our database. Learn basic data retrieval patterns.</div>
    <textarea id="code-koreanbbq" class="code-editor">
// Korean BBQ - Basic SELECT operations
const koreanBBQQuery = {
  // Basic SELECT query
  getAllKoreanBBQ: () => {
    return `
      SELECT dish_id, name, protein, marinated_hours, grill_temperature, price
      FROM korean_bbq_dishes 
      WHERE cuisine_type = 'Korean BBQ'
      ORDER BY price ASC;
    `;
  },

  // SELECT with specific filters
  getSpicyKoreanBBQ: () => {
    return `
      SELECT name, spice_level, banchan_count, price
      FROM korean_bbq_dishes 
      WHERE spice_level >= 3 
        AND cuisine_type = 'Korean BBQ'
        AND city = 'la'
      ORDER BY spice_level DESC;
    `;
  },

  // SELECT with calculated fields
  getBBQWithTotalCost: () => {
    return `
      SELECT 
        name,
        price,
        (price * 1.09) AS price_with_tax,
        CASE 
          WHEN price < 15 THEN 'Budget'
          WHEN price < 25 THEN 'Mid-range'
          ELSE 'Premium'
        END as price_category
      FROM korean_bbq_dishes
      WHERE cuisine_type = 'Korean BBQ';
    `;
  }
};

// Execute queries and display results
console.log("🍖 Korean BBQ Query Examples:");
console.log("1. All Korean BBQ:", koreanBBQQuery.getAllKoreanBBQ());
console.log("2. Spicy Korean BBQ:", koreanBBQQuery.getSpicyKoreanBBQ());
console.log("3. BBQ with Tax:", koreanBBQQuery.getBBQWithTotalCost());

// Mock execution
const sampleResults = [
  { name: "Galbi Short Ribs", protein: "beef", price: 28.99, spice_level: 2 },
  { name: "Bulgogi", protein: "beef", price: 22.50, spice_level: 1 },
  { name: "Spicy Pork Belly", protein: "pork", price: 24.99, spice_level: 4 }
];

console.log("📊 Sample Korean BBQ Results:", sampleResults);
completeTask('koreanbbq');
    </textarea>
    <div style="margin-top:0.5rem" class="editor-actions">
      <button class="sq-btn sq-run" onclick="runEditor('code-koreanbbq','terminal-koreanbbq')">🍖 Run BBQ Queries</button>
      <button class="sq-btn" onclick="copyEditor('code-koreanbbq')">Copy Code</button>
    </div>
    <pre id="terminal-koreanbbq" class="sq-terminal"></pre>
    
    <div class="quiz-block">
      <strong>🧩 Quick Quiz:</strong>
      <div class="quiz-question" data-answer="b">
        <p>1️⃣ What does ORDER BY price ASC do?</p>
        <label><input type="radio" name="q1-bbq" value="a"> Shows highest prices first</label><br>
        <label><input type="radio" name="q1-bbq" value="b"> Shows lowest prices first</label><br>
        <label><input type="radio" name="q1-bbq" value="c"> Filters by price range</label>
      </div>
      <button class="sq-btn sq-run" onclick="submitQuiz(this)">Submit Answer</button>
      <div class="quiz-feedback small" style="margin-top:0.5rem;"></div>
    </div>
  </div>
</details>

<!-- Task 2: Street Tacos (al pastor) -->
<details>
  <summary>🌮 Street Tacos WHERE Filtering</summary>
  <div class="sq-card">
    <div class="sq-label">Master <strong>WHERE</strong> clauses to filter al pastor tacos by location, price, and authenticity ratings.</div>
    <textarea id="code-streettacos" class="code-editor">
// Street Tacos (al pastor) - WHERE clause filtering
const tacoQueries = {
  // Filter by location and authenticity
  getAuthenticTacos: () => {
    return `
      SELECT vendor_name, location, authenticity_score, price_per_taco
      FROM street_tacos 
      WHERE taco_type = 'al pastor'
        AND authenticity_score >= 4.5
        AND city = 'la'
        AND has_pineapple = true;
    `;
  },

  // Price range filtering
  getBudgetTacos: () => {
    return `
      SELECT vendor_name, location, price_per_taco, rating
      FROM street_tacos 
      WHERE taco_type = 'al pastor'
        AND price_per_taco BETWEEN 2.00 AND 4.00
        AND rating >= 4.0
      ORDER BY price_per_taco ASC;
    `;
  },

  // Complex filtering with multiple conditions
  getPremiumTacos: () => {
    return `
      SELECT 
        vendor_name, 
        location,
        price_per_taco,
        authenticity_score,
        CASE 
          WHEN authenticity_score >= 4.8 THEN 'Exceptional'
          WHEN authenticity_score >= 4.5 THEN 'Excellent'
          ELSE 'Good'
        END as quality_tier
      FROM street_tacos 
      WHERE taco_type = 'al pastor'
        AND (authenticity_score > 4.5 OR rating > 4.5)
        AND vendor_type IN ('food_truck', 'street_cart')
      ORDER BY authenticity_score DESC;
    `;
  }
};

// Execute the queries
console.log("🌮 Al Pastor Taco Filtering:");
console.log("1. Authentic Tacos:", tacoQueries.getAuthenticTacos());
console.log("2. Budget Tacos:", tacoQueries.getBudgetTacos());
console.log("3. Premium Tacos:", tacoQueries.getPremiumTacos());

// Mock results
const tacoResults = [
  { vendor: "Leo's Taco Truck", location: "Highland Park", price: 3.25, authenticity: 4.8 },
  { vendor: "Mariscos Jalisco", location: "Boyle Heights", price: 3.50, authenticity: 4.9 },
  { vendor: "King Taco", location: "Multiple", price: 2.75, authenticity: 4.2 }
];

console.log("📊 Found", tacoResults.length, "al pastor vendors");
completeTask('streettacos');
    </textarea>
    <div style="margin-top:0.5rem" class="editor-actions">
      <button class="sq-btn sq-run" onclick="runEditor('code-streettacos','terminal-streettacos')">🌮 Filter Tacos</button>
      <button class="sq-btn" onclick="copyEditor('code-streettacos')">Copy Code</button>
    </div>
    <pre id="terminal-streettacos" class="sq-terminal"></pre>
    
    <div class="quiz-block">
      <strong>🧩 Quick Quiz:</strong>
      <div class="quiz-question" data-answer="c">
        <p>1️⃣ What does BETWEEN 2.00 AND 4.00 filter?</p>
        <label><input type="radio" name="q2-taco" value="a"> Exactly $2.00 or $4.00</label><br>
        <label><input type="radio" name="q2-taco" value="b"> Less than $2.00</label><br>
        <label><input type="radio" name="q2-taco" value="c"> Prices from $2.00 to $4.00 inclusive</label>
      </div>
      <button class="sq-btn sq-run" onclick="submitQuiz(this)">Submit Answer</button>
      <div class="quiz-feedback small" style="margin-top:0.5rem;"></div>
    </div>
  </div>
</details>

<!-- Task 3: In-N-Out Burger -->
<details>
  <summary>🍔 In-N-Out Burger Pagination & LIMIT</summary>
  <div class="sq-card">
    <div class="sq-label">Learn <strong>LIMIT</strong> and <strong>OFFSET</strong> for pagination. Browse In-N-Out menu items across multiple pages.</div>
    <textarea id="code-innout" class="code-editor">
// In-N-Out Burger - Pagination and LIMIT queries
const inNOutPagination = {
  // Basic pagination
  getMenuPage: (page = 1, itemsPerPage = 5) => {
    const offset = (page - 1) * itemsPerPage;
    return `
      SELECT item_name, category, price, calories, secret_menu
      FROM innout_menu 
      WHERE available = true
      ORDER BY category, price ASC
      LIMIT ${itemsPerPage} OFFSET ${offset};
    `;
  },

  // Top items with LIMIT
  getTopBurgers: (limit = 3) => {
    return `
      SELECT item_name, rating, order_count, price
      FROM innout_menu 
      WHERE category = 'burger'
        AND available = true
      ORDER BY rating DESC, order_count DESC
      LIMIT ${limit};
    `;
  },

  // Secret menu items
  getSecretMenu: () => {
    return `
      SELECT item_name, description, estimated_price, popularity_score
      FROM innout_menu 
      WHERE secret_menu = true
        AND item_name IN ('Animal Style', 'Protein Style', '4x4', 'Flying Dutchman')
      ORDER BY popularity_score DESC;
    `;
  },

  // Count total items for pagination
  getTotalCount: () => {
    return `
      SELECT 
        COUNT(*) as total_items,
        COUNT(CASE WHEN secret_menu = true THEN 1 END) as secret_items,
        COUNT(CASE WHEN category = 'burger' THEN 1 END) as burger_count
      FROM innout_menu 
      WHERE available = true;
    `;
  }
};

// Demonstrate pagination
console.log("🍔 In-N-Out Pagination Examples:");
console.log("Page 1:", inNOutPagination.getMenuPage(1, 5));
console.log("Page 2:", inNOutPagination.getMenuPage(2, 5));
console.log("Top 3 Burgers:", inNOutPagination.getTopBurgers(3));
console.log("Secret Menu:", inNOutPagination.getSecretMenu());

// Mock pagination results
const mockPage1 = [
  { item: "Hamburger", category: "burger", price: 2.65, calories: 390 },
  { item: "Cheeseburger", category: "burger", price: 2.95, calories: 480 },
  { item: "Double-Double", category: "burger", price: 3.85, calories: 670 },
  { item: "French Fries", category: "sides", price: 1.95, calories: 395 },
  { item: "Chocolate Shake", category: "drinks", price: 2.40, calories: 590 }
];

console.log("📖 Page 1 Results:", mockPage1);
console.log("📊 Showing 5 items per page");

completeTask('innout');
    </textarea>
    <div style="margin-top:0.5rem" class="editor-actions">
      <button class="sq-btn sq-run" onclick="runEditor('code-innout','terminal-innout')">🍔 Paginate Menu</button>
      <button class="sq-btn" onclick="copyEditor('code-innout')">Copy Code</button>
    </div>
    <pre id="terminal-innout" class="sq-terminal"></pre>
    
    <div class="quiz-block">
      <strong>🧩 Quick Quiz:</strong>
      <div class="quiz-question" data-answer="a">
        <p>1️⃣ For page 3 with 10 items per page, what should OFFSET be?</p>
        <label><input type="radio" name="q3-innout" value="a"> 20</label><br>
        <label><input type="radio" name="q3-innout" value="b"> 30</label><br>
        <label><input type="radio" name="q3-innout" value="c"> 10</label>
      </div>
      <button class="sq-btn sq-run" onclick="submitQuiz(this)">Submit Answer</button>
      <div class="quiz-feedback small" style="margin-top:0.5rem;"></div>
    </div>
  </div>
</details>

<!-- Task 4: Avocado Toast -->
<details>
  <summary>🥑 Avocado Toast LIKE Search</summary>
  <div class="sq-card">
    <div class="sq-label">Master <strong>LIKE</strong> and pattern matching to search for avocado-based dishes across LA brunch spots.</div>
    <textarea id="code-avocado" class="code-editor">
// Avocado Toast - LIKE search and pattern matching
const avocadoSearch = {
  // Basic LIKE search
  findAvocadoDishes: () => {
    return `
      SELECT dish_name, restaurant, price, description
      FROM brunch_menu 
      WHERE dish_name ILIKE '%avocado%'
        OR description ILIKE '%avocado%'
        AND city = 'la'
      ORDER BY price ASC;
    `;
  },

  // Advanced pattern matching
  findToastVariations: () => {
    return `
      SELECT 
        dish_name,
        restaurant,
        price,
        toppings,
        bread_type
      FROM brunch_menu 
      WHERE (dish_name ILIKE '%toast%' OR dish_name ILIKE '%bread%')
        AND (toppings ILIKE '%avocado%' OR description ILIKE '%avocado%')
        AND price BETWEEN 8.00 AND 25.00
      ORDER BY restaurant, price;
    `;
  },

  // Search with multiple patterns
  findHealthyOptions: () => {
    return `
      SELECT 
        dish_name,
        restaurant,
        price,
        calories,
        healthy_tags
      FROM brunch_menu 
      WHERE dish_name ILIKE ANY(ARRAY['%avocado%', '%quinoa%', '%kale%', '%superfood%'])
        OR healthy_tags && ARRAY['vegan', 'gluten-free', 'organic']
        AND calories < 600
      ORDER BY calories ASC;
    `;
  },

  // Full-text search simulation
  searchByKeywords: (keywords) => {
    const keywordPattern = keywords.split(' ').map(k => `%${k}%`).join('');
    return `
      SELECT 
        dish_name,
        restaurant,
        price,
        description,
        ts_rank(to_tsvector('english', description), plainto_tsquery('english', '${keywords}')) AS rank
      FROM brunch_menu 
      WHERE to_tsvector('english', description) @@ plainto_tsquery('english', '${keywords}')
        AND city = 'la'
      ORDER BY rank DESC, price ASC;
    `;
  }
};

// Execute searches
console.log("🥑 Avocado Toast Search Patterns:");
console.log("1. Find Avocado Dishes:", avocadoSearch.findAvocadoDishes());
console.log("2. Toast Variations:", avocadoSearch.findToastVariations());
console.log("3. Healthy Options:", avocadoSearch.findHealthyOptions());
console.log("4. Keyword Search:", avocadoSearch.searchByKeywords("avocado sourdough"));

// Mock search results
const searchResults = [
  { dish: "Classic Avocado Toast", restaurant: "République", price: 14.00, description: "Smashed avocado on sourdough" },
  { dish: "Avocado Benedict", restaurant: "Guelaguetza", price: 18.50, description: "Poached eggs over avocado" },
  { dish: "Superfood Bowl", restaurant: "Café Gratitude", price: 16.00, description: "Quinoa, avocado, kale" }
];

console.log("🔍 Search Results:", searchResults);
console.log("📊 Found", searchResults.length, "matching dishes");

completeTask('avocado');
    </textarea>
    <div style="margin-top:0.5rem" class="editor-actions">
      <button class="sq-btn sq-run" onclick="runEditor('code-avocado','terminal-avocado')">🥑 Search Avocado</button>
      <button class="sq-btn" onclick="copyEditor('code-avocado')">Copy Code</button>
    </div>
    <pre id="terminal-avocado" class="sq-terminal"></pre>
    
    <div class="quiz-block">
      <strong>🧩 Quick Quiz:</strong>
      <div class="quiz-question" data-answer="b">
        <p>1️⃣ What does ILIKE '%avocado%' find?</p>
        <label><input type="radio" name="q4-avocado" value="a"> Exactly "avocado"</label><br>
        <label><input type="radio" name="q4-avocado" value="b"> Any text containing "avocado"</label><br>
        <label><input type="radio" name="q4-avocado" value="c"> Text starting with "avocado"</label>
      </div>
      <button class="sq-btn sq-run" onclick="submitQuiz(this)">Submit Answer</button>
      <div class="quiz-feedback small" style="margin-top:0.5rem;"></div>
    </div>
  </div>
</details>

<!-- Task 5: Ramen & Fusion Dishes -->
<details>
  <summary>🍜 Ramen JOINs & Complex Queries</summary>
  <div class="sq-card">
    <div class="sq-label">Practice <strong>JOIN</strong> operations and complex queries to explore LA's ramen and fusion scene with restaurant ratings.</div>
    <textarea id="code-ramen" class="code-editor">
// Ramen & Fusion Dishes - JOIN operations and complex queries
const ramenQueries = {
  // Basic JOIN between ramen dishes and restaurants
  getRamenWithRestaurants: () => {
    return `
      SELECT 
        r.restaurant_name,
        r.neighborhood,
        r.rating as restaurant_rating,
        d.dish_name,
        d.broth_type,
        d.spice_level,
        d.price,
        d.fusion_style
      FROM restaurants r
      JOIN dishes d ON r.restaurant_id = d.restaurant_id
      WHERE d.category = 'ramen'
        AND r.city = 'la'
        AND r.rating >= 4.0
      ORDER BY r.rating DESC, d.price ASC;
    `;
  },

  // Complex JOIN with aggregates
  getFusionPopularity: () => {
    return `
      SELECT 
        d.fusion_style,
        COUNT(*) as dish_count,
        AVG(d.price) as avg_price,
        AVG(r.rating) as avg_restaurant_rating,
        MAX(d.spice_level) as max_spice
      FROM dishes d
      JOIN restaurants r ON d.restaurant_id = r.restaurant_id
      WHERE d.category IN ('ramen', 'fusion')
        AND r.city = 'la'
        AND d.fusion_style IS NOT NULL
      GROUP BY d.fusion_style
      HAVING COUNT(*) >= 2
      ORDER BY avg_restaurant_rating DESC;
    `;
  },

  // Multi-table JOIN with ingredients
  getRamenIngredients: () => {
    return `
      SELECT 
        r.restaurant_name,
        d.dish_name,
        d.broth_type,
        STRING_AGG(i.ingredient_name, ', ') as toppings,
        COUNT(di.ingredient_id) as topping_count
      FROM restaurants r
      JOIN dishes d ON r.restaurant_id = d.restaurant_id
      JOIN dish_ingredients di ON d.dish_id = di.dish_id
      JOIN ingredients i ON di.ingredient_id = i.ingredient_id
      WHERE d.category = 'ramen'
        AND r.neighborhood IN ('Little Tokyo', 'Sawtelle', 'West LA')
      GROUP BY r.restaurant_name, d.dish_name, d.broth_type
      HAVING COUNT(di.ingredient_id) >= 5
      ORDER BY topping_count DESC;
    `;
  },

  // Subquery for top-rated fusion
  getTopFusionRamen: () => {
    return `
      SELECT 
        r.restaurant_name,
        d.dish_name,
        d.fusion_style,
        d.price,
        r.rating
      FROM restaurants r
      JOIN dishes d ON r.restaurant_id = d.restaurant_id
      WHERE r.rating >= (
        SELECT AVG(rating) + 0.5 
        FROM restaurants 
        WHERE city = 'la'
      )
      AND d.category = 'ramen'
      AND d.fusion_style IS NOT NULL
      ORDER BY r.rating DESC, d.price ASC;
    `;
  }
};

// Execute complex queries
console.log("🍜 Ramen & Fusion Analysis:");
console.log("1. Ramen with Restaurants:", ramenQueries.getRamenWithRestaurants());
console.log("2. Fusion Popularity:", ramenQueries.getFusionPopularity());
console.log("3. Ramen Ingredients:", ramenQueries.getRamenIngredients());
console.log("4. Top Fusion Ramen:", ramenQueries.getTopFusionRamen());

// Mock complex results
const fusionResults = [
  { style: "Korean-Japanese", dish_count: 8, avg_price: 16.50, avg_rating: 4.4 },
  { style: "Mexican-Japanese", dish_count: 5, avg_price: 14.25, avg_rating: 4.2 },
  { style: "Vietnamese-Japanese", dish_count: 6, avg_price: 15.75, avg_rating: 4.3 }
];

console.log("🌐 Fusion Analysis:", fusionResults);
console.log("📊 Korean-Japanese fusion is most popular!");

completeTask('ramen');
    </textarea>
    <div style="margin-top:0.5rem" class="editor-actions">
      <button class="sq-btn sq-run" onclick="runEditor('code-ramen','terminal-ramen')">🍜 Analyze Ramen</button>
      <button class="sq-btn" onclick="copyEditor('code-ramen')">Copy Code</button>
    </div>
    <pre id="terminal-ramen" class="sq-terminal"></pre>
    
    <div class="quiz-block">
      <strong>🧩 Quick Quiz:</strong>
      <div class="quiz-question" data-answer="c">
        <p>1️⃣ What does GROUP BY fusion_style do?</p>
        <label><input type="radio" name="q5-ramen" value="a"> Sorts by fusion style</label><br>
        <label><input type="radio" name="q5-ramen" value="b"> Filters fusion styles</label><br>
        <label><input type="radio" name="q5-ramen" value="c"> Groups rows by fusion style for aggregation</label>
      </div>
      <button class="sq-btn sq-run" onclick="submitQuiz(this)">Submit Answer</button>
      <div class="quiz-feedback small" style="margin-top:0.5rem;"></div>
    </div>
  </div>
</details>

<!-- Task 6: Erewhon -->
<details>
  <summary>🥤 Erewhon Analytics & Indexing</summary>
  <div class="sq-card">
    <div class="sq-label">Learn database <strong>indexing</strong> and performance optimization through Erewhon's premium smoothie analytics.</div>
    <div style="display:grid; grid-template-columns: 1fr; gap:0.5rem;">
      <label class="sq-label">Smoothie Name Filter</label>
      <input id="smoothie-name" class="sq-field" placeholder="Green Goddess" value="Green Goddess" />

      <label class="sq-label">Max Calories</label>
      <input id="max-calories" type="number" class="sq-field" placeholder="400" value="400" />

      <label class="sq-label">Min Price</label>
      <input id="min-price" type="number" step="0.01" class="sq-field" placeholder="15.00" value="15.00" />

      <label class="sq-label">Ingredient Filter</label>
      <select id="ingredient-filter" class="sq-field">
        <option value="collagen">Collagen</option>
        <option value="spirulina">Spirulina</option>
        <option value="adaptogens">Adaptogens</option>
        <option value="maca">Maca Root</option>
      </select>

      <div style="display:flex; gap:0.5rem; margin-top:0.75rem;">
        <button class="sq-btn sq-run" onclick="queryErewhonSmoothies()">🥤 Query Smoothies</button>
        <button class="sq-btn" onclick="analyzeErewhonPerformance()">📊 Analyze Performance</button>
        <button class="sq-btn" onclick="clearTerm('terminal-erewhon')">Clear Terminal</button>
      </div>

      <div id="terminal-erewhon" class="sq-terminal" style="margin-top:0.5rem"></div>
    </div>

    <div class="quiz-block">
      <strong>🧩 Quick Quiz:</strong>
      <div class="quiz-question" data-answer="a">
        <p>1️⃣ Why would you create an index on the 'ingredients' column?</p>
        <label><input type="radio" name="q6-erewhon" value="a"> To speed up WHERE clauses on ingredients</label><br>
        <label><input type="radio" name="q6-erewhon" value="b"> To save storage space</label><br>
        <label><input type="radio" name="q6-erewhon" value="c"> To enforce data validation</label>
      </div>
      <button class="sq-btn sq-run" onclick="submitQuiz(this)">Submit Answer</button>
      <div class="quiz-feedback small" style="margin-top:0.5rem;"></div>
    </div>
  </div>
</details>

---

## 🎉 Module Complete — Los Angeles READ Mastery

Congratulations! You've mastered **READ operations** through LA's diverse food scene:
- 🍖 **Korean BBQ**: Basic SELECT queries and ordering
- 🌮 **Street Tacos**: WHERE clause filtering and conditions  
- 🍔 **In-N-Out**: LIMIT, OFFSET, and pagination
- 🥑 **Avocado Toast**: LIKE searches and pattern matching
- 🍜 **Ramen & Fusion**: JOIN operations and aggregations
- 🥤 **Erewhon**: Performance optimization and indexing

**San Francisco — UPDATE module unlocked!** 🌉 Continue to learn data modification!

<script>
// Task completion tracking
window.taskProgress = {
  koreanbbq: false,
  streettacos: false,
  innout: false,
  avocado: false,
  ramen: false,
  erewhon: false
};

// Erewhon-specific functions
window.queryErewhonSmoothies = async function() {
  clearTerm('terminal-erewhon');
  
  const name = document.getElementById('smoothie-name').value.trim();
  const maxCalories = parseInt(document.getElementById('max-calories').value);
  const minPrice = parseFloat(document.getElementById('min-price').value);
  const ingredient = document.getElementById('ingredient-filter').value;
  
  const query = `
    SELECT 
      smoothie_name, 
      price, 
      calories, 
      ingredients,
      influencer_rating,
      wellness_score
    FROM erewhon_smoothies 
    WHERE smoothie_name ILIKE '%${name}%'
      AND calories <= ${maxCalories}
      AND price >= ${minPrice}
      AND ingredients @> ARRAY['${ingredient}']
      AND city = 'la'
    ORDER BY wellness_score DESC, price ASC;
  `;
  
  logTo('terminal-erewhon', '[Client] Executing Erewhon query...');
  logTo('terminal-erewhon', query);
  
  // Mock results
  const mockResults = [
    { name: "Green Goddess Supreme", price: 22.50, calories: 380, wellness_score: 95, ingredients: [ingredient, "spirulina", "chlorella"] },
    { name: "Adaptogenic Blend", price: 24.00, calories: 320, wellness_score: 92, ingredients: [ingredient, "ashwagandha", "reishi"] },
    { name: "Beauty Elixir", price: 26.50, calories: 290, wellness_score: 88, ingredients: [ingredient, "biotin", "vitamin C"] }
  ];
  
  logTo('terminal-erewhon', `[Server] Found ${mockResults.length} premium smoothies`);
  logTo('terminal-erewhon', JSON.stringify(mockResults, null, 2));
  
  completeTask('erewhon');
};

window.analyzeErewhonPerformance = function() {
  clearTerm('terminal-erewhon');
  
  logTo('terminal-erewhon', '📊 Erewhon Performance Analysis:');
  logTo('terminal-erewhon', '');
  
  const indexAnalysis = `
    -- Current query performance (without index)
    EXPLAIN ANALYZE 
    SELECT * FROM erewhon_smoothies 
    WHERE ingredients @> ARRAY['collagen'];
    
    -- Execution time: ~45ms for 10,000 records
    -- Seq Scan on erewhon_smoothies (cost=0.00..2500.00 rows=100)
    
    -- CREATE INDEX for better performance
    CREATE INDEX idx_smoothie_ingredients 
    ON erewhon_smoothies USING GIN (ingredients);
    
    -- After index creation
    -- Execution time: ~2ms for same query
    -- Bitmap Index Scan using idx_smoothie_ingredients (cost=12.00..116.00)
    
    -- Performance improvement: 95% faster!
  `;
  
  logTo('terminal-erewhon', indexAnalysis);
  logTo('terminal-erewhon', '');
  logTo('terminal-erewhon', '💡 Key Insights:');
  logTo('terminal-erewhon', '• GIN index perfect for array/JSONB searches');
  logTo('terminal-erewhon', '• 20x performance improvement on ingredient queries');
  logTo('terminal-erewhon', '• Essential for Erewhon\'s real-time smoothie filtering');
};

// Load progress from localStorage
function loadTaskProgress() {
  const saved = localStorage.getItem('la_task_progress');
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
    localStorage.setItem('la_task_progress', JSON.stringify(window.taskProgress));
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
  const tasks = ['koreanbbq', 'streettacos', 'innout', 'avocado', 'ramen', 'erewhon'];
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
    unlockSanFrancisco();
    console.log('🎉 Los Angeles module completed! San Francisco should now be unlocked.');
  }
}

// Unlock San Francisco
function unlockSanFrancisco() {
  try {
    const saved = localStorage.getItem('city_progress'); 
    let gameProgress = saved ? JSON.parse(saved) : { 
      unlockedCities: [0, 1], 
      completedCities: [], 
      totalCitiesCompleted: 0 
    };
    
    if (!gameProgress.completedCities.includes(1)) {
      gameProgress.completedCities.push(1);
      gameProgress.totalCitiesCompleted++;
    }
    if (!gameProgress.unlockedCities.includes(2)) {
      gameProgress.unlockedCities.push(2);
    }
    
    localStorage.setItem('city_progress', JSON.stringify(gameProgress));
    console.log('✅ LA completed! SF unlocked. Progress:', gameProgress);
    
    // Try to notify parent window
    if (window.parent && window.parent.markCityCompleted) {
      window.parent.markCityCompleted(1);
    }
    
  } catch (e) {
    console.error('❌ LA Unlock failed:', e);
  }
}

// Auto complete function for testing
function autoCompleteAllTasks() {
  document.getElementById('quickCompleteBtn').style.display = 'none';
  
  // Auto-fill the Erewhon form and query
  document.getElementById('smoothie-name').value = 'Green Goddess';
  document.getElementById('max-calories').value = '400';
  document.getElementById('min-price').value = '15.00';
  document.getElementById('ingredient-filter').value = 'collagen';
  
  // Complete tasks in sequence
  setTimeout(() => queryErewhonSmoothies(), 500);
  
  // Mark all tasks as complete
  setTimeout(() => {
    completeTask('koreanbbq');
    completeTask('streettacos');
    completeTask('innout');
    completeTask('avocado');
    completeTask('ramen');
    completeTask('erewhon');
    
    showToast('🎉 All READ tasks completed! San Francisco unlocked!', 4000);
  }, 1000);
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

// Quiz functionality
window.submitQuiz = function(button) {
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
    feedback.textContent = '✅ Correct! Great job understanding READ operations.';
    feedback.style.color = '#10b981';
  } else {
    feedback.textContent = '❌ Try again! Review the concepts above.';
    feedback.style.color = '#fb7185';
  }
};

// Utility functions for code editors and terminals
window.runEditor = function(editorId, terminalId) {
  const code = document.getElementById(editorId).value;
  const terminal = document.getElementById(terminalId);
  terminal.textContent = '> Running code...\n\n' + 
    '// Code executed successfully\n' +
    '// Check console for detailed output\n';
  
  try {
    eval(code);
  } catch (e) {
    terminal.textContent += '\n❌ Error: ' + e.message;
  }
};

window.copyEditor = function(editorId) {
  const code = document.getElementById(editorId).value;
  navigator.clipboard.writeText(code).then(() => {
    showToast('📋 Code copied to clipboard!');
  });
};

window.clearTerm = function(terminalId) {
  document.getElementById(terminalId).textContent = '';
};

window.logTo = function(terminalId, message, data = null) {
  const terminal = document.getElementById(terminalId);
  terminal.textContent += message + '\n';
  if (data) {
    terminal.textContent += JSON.stringify(data, null, 2) + '\n';
  }
  terminal.scrollTop = terminal.scrollHeight;
};

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