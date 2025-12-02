--- 
layout: post
tailwind: true
title: "Backend Development Hub"
description: "A consolidated guide to backend development, covering APIs, databases, frameworks, and advanced concepts."
author: "CSA 2025-26"
permalink: /bigsix/backend_module
---

<style>
    .concept-section {
        border: 1px solid #3a3a3a;
        padding: 1.5rem;
        border-radius: 8px;
        margin-bottom: 2rem;
        background: #1c1c1e;
    }
    .concept-section h2 {
        font-size: 1.5rem;
        color: #ea8c33;
        margin-bottom: 1rem;
    }
    .concept-section p {
        line-height: 1.6;
    }
    .code-snippet {
        background: #0f0f0f;
        border: 1px solid #2a2a2a;
        padding: 1rem;
        border-radius: 6px;
        margin-top: 1rem;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        white-space: pre-wrap;
    }
    #mc-quiz, #mc-quiz-3, #vocab-crossword, #vocab-picker-3 {
        border: 1px solid #574e4eff;
        padding: 12px;
        border-radius: 6px;
        max-width: 900px;
        margin-bottom: 1.5rem;
    }
    .api-tester-container {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: #1a1a1a;
        color: #d0d0d0;
        padding: 20px;
        border-radius: 8px;
        margin-top: 1.5rem;
    }
</style>

## 1. What is the Backend?
The backend is the engine of an application. It handles user authentication, processes requests from the frontend, manages data in the database, and exposes functionality through API endpoints. Key responsibilities include validating user credentials, processing business logic, organizing data, and defining what actions a user can perform via HTTP methods like GET, POST, PUT, PATCH, and DELETE.

### Quick Quiz — Module 1 (Interactive)
<div id="mc-quiz" style="border:1px solid #574e4eff;padding:12px;border-radius:6px;max-width:900px;">
 <form id="quiz-form">
   <ol>
     <li>
       <div style="margin-bottom:6px">You see this frontend call:
       <pre style="display:inline-block;margin:6px 0;padding:6px;border-radius:4px;background:#574e4eff">fetch(`${javaURI}/api/responses`, {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ name: "Ana", response: "Here is my answer" })
});
</pre>
     <li>
       What is the backend expected to do first when this request arrives?</div>
       <div><label><input type="radio" name="q0" value="A"> A. Write the body to the database without checks</label></div>
       <div><label><input type="radio" name="q0" value="B"> B. Return status 200 immediately to acknowledge receipt</label></div>
       <div><label><input type="radio" name="q0" value="C"> C. Validate the request format and required fields, then authenticate the user if needed</label></div>
       <div><label><input type="radio" name="q0" value="D"> D. Close the connection</label></div>
       <div class="feedback" aria-live="polite" style="margin-top:6px"></div>
     </li>
     <li>
       <div style="margin-bottom:6px">A request arrives without an Authorization header but the endpoint requires authentication. Which status code should the backend most appropriately return?</div>
       <div><label><input type="radio" name="q1" value="A"> A. 200 OK</label></div>
       <div><label><input type="radio" name="q1" value="B"> B. 400 Bad Request</label></div>
       <div><label><input type="radio" name="q1" value="C"> C. 401 Unauthorized</label></div>
       <div><label><input type="radio" name="q1" value="D"> D. 500 Internal Server Error</label></div>
       <div class="feedback" aria-live="polite" style="margin-top:6px"></div>
     </li>
     <li>
       <div style="margin-bottom:6px">Which Content-Type header should the client set when sending JSON in the request body?</div>
       <div><label><input type="radio" name="q2" value="A"> A. text/plain</label></div>
       <div><label><input type="radio" name="q2" value="B"> B. application/json</label></div>
       <div><label><input type="radio" name="q2" value="C"> C. multipart/form-data</label></div>
       <div><label><input type="radio" name="q2" value="D"> D. application/x-www-form-urlencoded</label></div>
       <div class="feedback" aria-live="polite" style="margin-top:6px"></div>
     </li>
     <li>
       <div style="margin-bottom:6px">Your responses table declares `id` as a primary key. Two incoming inserts accidentally use the same id value. What is the typical outcome?</div>
       <div><label><input type="radio" name="q3" value="A"> A. The database accepts both rows and duplicates the id</label></div>
       <div><label><input type="radio" name="q3" value="B"> B. The database rejects the second insert or raises a constraint error</label></div>
       <div><label><input type="radio" name="q3" value="C"> C. The database silently renames the second id to keep it unique</label></div>
       <div><label><input type="radio" name="q3" value="D"> D. The backend will always overwrite the first row automatically</label></div>
       <div class="feedback" aria-live="polite" style="margin-top:6px"></div>
     </li>
     <li>
       <div style="margin-bottom:6px">During development you switch `javaURI` from `http://localhost:8085` to your production API by mistake and run tests. What's the primary risk?</div>
       <div><label><input type="radio" name="q4" value="A"> A. Tests will run faster and use fewer resources</label></div>
       <div><label><input type="radio" name="q4" value="B"> B. You might modify or overwrite real production data and leak test input</label></div>
       <div><label><input type="radio" name="q4" value="C"> C. Local files will be deleted on your machine</label></div>
       <div><label><input type="radio" name="q4" value="D"> D. The browser will block all requests automatically</label></div>
       <div class="feedback" aria-live="polite" style="margin-top:6px"></div>
     </li>
   </ol>
   <div style="margin-top:12px;">
     <button type="submit" id="quiz-submit">Submit</button>
     <button type="button" id="quiz-reset" style="margin-left:8px">Reset</button>
     <span id="quiz-result" style="margin-left:12px;font-weight:600"></span>
   </div>
 </form>
</div>

## 2. Databases & APIs
Databases are organized collections of data. They can be SQL (relational, with structured tables) or NoSQL (non-relational, with flexible documents). APIs (Application Programming Interfaces) are the bridges that allow the frontend to communicate with the backend to perform CRUD (Create, Read, Update, Delete) operations on the data stored in the database.

### Vocab Short Answers — Module 2
<div id="vocab-crossword" style="border:1px solid #e0e0e0;padding:12px;border-radius:6px;max-width:760px;">
  <ol>
    <li>
      <div style="margin-bottom:6px"><strong>1.</strong> A structured collection of rows and columns in a relational database. (5 letters)</div>
      <input name="w0" maxlength="5" style="width:120px;text-transform:uppercase" />
    </li>
    <li>
      <div style="margin-bottom:6px"><strong>2.</strong> One record in a table. (3 letters)</div>
      <input name="w1" maxlength="3" style="width:80px;text-transform:uppercase" />
    </li>
    <li>
      <div style="margin-bottom:6px"><strong>3.</strong> Common format for API request and response bodies. (4 letters)</div>
      <input name="w2" maxlength="4" style="width:100px;text-transform:uppercase" />
    </li>
    <li>
      <div style="margin-bottom:6px"><strong>4.</strong> HTTP method used to create new resources via an API. (4 letters)</div>
      <input name="w3" maxlength="4" style="width:100px;text-transform:uppercase" />
    </li>
    <li>
      <div style="margin-bottom:6px"><strong>5.</strong> SQL operation that combines rows from two tables based on a related column. (4 letters)</div>
      <input name="w4" maxlength="4" style="width:100px;text-transform:uppercase" />
    </li>
  </ol>
  <div style="margin-top:12px;">
    <button id="vocab-submit">Submit</button>
    <button id="vocab-reset" type="button" style="margin-left:8px">Reset</button>
    <span id="vocab-result" style="margin-left:12px;font-weight:600"></span>
  </div>
</div>

## 3. Backend Frameworks
Frameworks provide structure and tools to build backend applications more efficiently. Flask (Python) is a minimal microframework, great for rapid prototyping. Spring Boot (Java) is a full-featured framework ideal for large, enterprise-scale applications.

### Quick Quiz — Module 3 (Interactive)
<div id="mc-quiz-3" style="border:1px solid #e0e0e0;padding:12px;border-radius:6px;max-width:900px;">
  <form id="quiz-form-3">
    <ol>
      <li>
        <div style="margin-bottom:6px">What does this Flask decorator do?
        <pre style="display:inline-block;margin:6px 0;padding:6px;border-radius:4px;background:#f7f7f7">@app.route('/api/posts', methods=['GET'])</pre>
        </div>
        <div><label><input type="radio" name="q0" value="A"> A. Binds a function to that URL and HTTP method (defines an endpoint)</label></div>
        <div><label><input type="radio" name="q0" value="B"> B. Runs the function only when the server starts</label></div>
        <div><label><input type="radio" name="q0" value="C"> C. Defines a database table named /api/posts</label></div>
        <div><label><input type="radio" name="q0" value="D"> D. Automatically secures the route with authentication</label></div>
      </li>
      <li>
        <div style="margin-bottom:6px">In Spring Boot's layered architecture, which layer should contain business logic?</div>
        <div><label><input type="radio" name="q1" value="A"> A. Controller</label></div>
        <div><label><input type="radio" name="q1" value="B"> B. Service</label></div>
        <div><label><input type="radio" name="q1" value="C"> C. Repository</label></div>
        <div><label><input type="radio" name="q1" value="D"> D. Entity</label></div>
      </li>
      <li>
        <div style="margin-bottom:6px">What is a primary benefit of IoC / dependency injection?</div>
        <div><label><input type="radio" name="q2" value="A"> A. Makes code run faster by removing all objects</label></div>
        <div><label><input type="radio" name="q2" value="B"> B. Easier to test and swap implementations without changing callers</label></div>
        <div><label><input type="radio" name="q2" value="C"> C. Automatically creates database tables</label></div>
        <div><label><input type="radio" name="q2" value="D"> D. Forces static typing in the codebase</label></div>
      </li>
      <li>
        <div style="margin-bottom:6px">In SQLAlchemy, what is the role of a column declared with primary_key=True?</div>
        <div><label><input type="radio" name="q3" value="A"> A. It is ignored by the database</label></div>
        <div><label><input type="radio" name="q3" value="B"> B. Acts as the unique identifier for each row</label></div>
        <div><label><input type="radio" name="q3" value="C"> C. Encrypts the column values automatically</label></div>
        <div><label><input type="radio" name="q3" value="D"> D. Prevents that column from being returned in queries</label></div>
      </li>
      <li>
        <div style="margin-bottom:6px">Which HTTP status code is most appropriate when a POST request successfully creates a new resource?</div>
        <div><label><input type="radio" name="q4" value="A"> A. 200 OK</label></div>
        <div><label><input type="radio" name="q4" value="B"> B. 201 Created</label></div>
        <div><label><input type="radio" name="q4" value="C"> C. 204 No Content</label></div>
        <div><label><input type="radio" name="q4" value="D"> D. 404 Not Found</label></div>
      </li>
    </ol>
    <div style="margin-top:12px;">
      <button type="submit" id="quiz-submit-3">Submit</button>
      <button type="button" id="quiz-reset-3" style="margin-left:8px">Reset</button>
      <span id="quiz-result-3" style="margin-left:12px;font-weight:600"></span>
    </div>
  </form>
</div>

### Vocab Picker — Module 3
<div id="vocab-picker-3" style="border:1px solid #e0e0e0;padding:12px;border-radius:6px;max-width:760px;margin-top:12px;">
  <form id="vocab-form-3">
    <ol>
      <li style="margin-bottom:8px;">
        <div><strong>1.</strong> Where should HTTP request handling live in a Spring Boot app?</div>
        <select name="v0" style="margin-top:6px;width:240px;">
          <option value="">— select —</option>
          <option value="Controller">Controller</option>
          <option value="Service">Service</option>
          <option value="Repository">Repository</option>
          <option value="Entity">Entity</option>
        </select>
      </li>
      <li style="margin-bottom:8px;">
        <div><strong>2.</strong> What converts objects to database rows and back (library/tool)?</div>
        <select name="v1" style="margin-top:6px;width:240px;">
          <option value="">— select —</option>
          <option value="ORM">ORM</option>
          <option value="IoC">IoC</option>
          <option value="REST">REST</option>
          <option value="Schema">Schema</option>
        </select>
      </li>
      <li style="margin-bottom:8px;">
        <div><strong>3.</strong> Which format is commonly used for API request/response bodies?</div>
        <select name="v2" style="margin-top:6px;width:240px;">
          <option value="">— select —</option>
          <option value="XML">XML</option>
          <option value="CSV">CSV</option>
          <option value="JSON">JSON</option>
          <option value="YAML">YAML</option>
        </select>
      </li>
    </ol>
    <div style="margin-top:10px;">
      <button id="vocab-picker-submit-3">Submit</button>
      <button id="vocab-picker-reset-3" type="button" style="margin-left:8px">Reset</button>
      <span id="vocab-picker-result-3" style="margin-left:12px;font-weight:600"></span>
    </div>
  </form>
</div>

## 4. Final Project: API and Postman Validation
The final project is a capstone where you will build a functional RESTful API for a blog platform and validate it using a Postman Collection.

### Postman Simulator
<div class="api-tester-container">
    <h1>API Tester</h1>
    <div class="presets">
        <button class="preset-btn" onclick="loadPreset('/api/users', 'GET')">GET /api/users</button>
        <button class="preset-btn" onclick="loadPreset('/api/users/1', 'GET')">GET /api/users/1</button>
        <button class="preset-btn" onclick="loadPreset('/api/users', 'POST')">POST /api/users</button>
        <button class="preset-btn" onclick="loadPreset('/api/users/1', 'PUT')">PUT /api/users/1</button>
        <button class="preset-btn" onclick="loadPreset('/api/users/1', 'DELETE')">DELETE /api/users/1</button>
        <button class="preset-btn" onclick="loadPreset('/api/invalid', 'GET')">GET /api/invalid (404)</button>
    </div>
    <div class="tester-section">
        <div class="input-group">
            <label>Method</label>
            <select id="method">
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
            </select>
            <label>Endpoint</label>
            <input type="text" id="url" placeholder="/api/users">
            <button class="btn" onclick="sendRequest(event)" style="margin-top: 20px;">Send Request</button>
        </div>
    </div>
    <div id="response-container" class="response-section">
        <div class="response-header">
            <h2>Response</h2>
            <span id="status-code" class="status-badge"></span>
        </div>
        <div id="response-time" class="response-info"></div>
        <div id="response-body" class="response-body"></div>
    </div>
</div>

## 5. Advanced Backend Concepts

<div class="concept-section">
    <h2>Automated Documentation & Testing</h2>
    <p>Modern backend development emphasizes automation. You can create tests that not only verify your code\'s correctness but also generate documentation, such as data flow diagrams, ensuring your documentation always stays in sync with your code.</p>
</div>

<div class="concept-section">
    <h2>Infrastructure as Code (IaC) Analytics</h2>
    <p>Backends run on infrastructure that can be defined as code (e.g., using Terraform). You can write scripts to analyze this infrastructure code, fetching details about modules, tracking versions, and understanding dependencies, which is crucial for managing complex systems.</p>
</div>

<div class="concept-section">
    <h2>AI-Powered Backends</h2>
    <p>You can integrate Large Language Models (LLMs) into your backend to create intelligent features. For example, an AI can read a piece of text and automatically generate a summary or a set of question-answer pairs, enabling features like automated FAQs or chatbots.</p>
</div>

<!-- FRQ: Placeholder -->
<div class="frq-box" id="quest-frq" style="border:1px solid #2c2c2e; padding:1rem; border-radius:8px; margin:1.5rem 0; background:#1c1c1e; color:#e5e5ea; font-weight:300;">
  <b>FRQ:</b> <span id="frq-question">Placeholder FRQ: Describe the backend API or database feature you plan to implement.</span><br><br>
  <textarea id="frq-answer" rows="5" placeholder="Type your response here..." style="width:100%; border-radius:6px; border:1px solid #3a3a3c; padding:0.5rem; margin-top:0.5rem; background:#2c2c2e; color:#f2f2f7;"></textarea>
  <p></p>
  <button id="frq-grade-btn" style="margin-top:10px; background:#2c2c2e; color:#e5e5ea; border:1px solid #3a3a3c; padding:0.4rem 0.75rem; border-radius:6px;">Grade</button>
  <div id="frq-feedback"></div>
</div>

<script type="module">
// --- Combined Scripts ---

// From Submodule 1
(() => {
 const form = document.getElementById('quiz-form');
 const resultSpan = document.getElementById('quiz-result');
 const resetBtn = document.getElementById('quiz-reset');
 const answers = ['C','C','B','B','B'];
 function setDisabled(disabled) {
   document.querySelectorAll('#mc-quiz input').forEach(i => i.disabled = disabled);
   document.getElementById('quiz-submit').disabled = disabled;
 }
 form.addEventListener('submit', (e) => {
   e.preventDefault();
   let score = 0;
   for (let i = 0; i < answers.length; i++) {
     const selected = form['q' + i] ? form['q' + i].value : null;
     if (selected === answers[i]) score += 1;
   }
   resultSpan.textContent = `You scored ${score} / ${answers.length}`;
   setDisabled(true);
 });
 resetBtn.addEventListener('click', () => {
   form.reset();
   resultSpan.textContent = '';
   setDisabled(false);
 });
})();

// From Submodule 2
(() => {
  const answers = ['TABLE','ROW','JSON','POST','JOIN'];
  const submitBtn = document.getElementById('vocab-submit');
  const resetBtn = document.getElementById('vocab-reset');
  const resultSpan = document.getElementById('vocab-result');
  const container = document.getElementById('vocab-crossword');
  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const vals = Array.from(container.querySelectorAll('input')).map(i => i.value.trim().toUpperCase());
    let score = 0;
    for (let i = 0; i < answers.length; i++) if (vals[i] === answers[i]) score += 1;
    resultSpan.textContent = `You scored ${score} / ${answers.length}`;
    container.querySelectorAll('input').forEach(i => i.disabled = true);
    submitBtn.disabled = true;
  });
  resetBtn.addEventListener('click', () => {
    container.querySelectorAll('input').forEach(i => { i.value = ''; i.disabled = false; });
    resultSpan.textContent = '';
    submitBtn.disabled = false;
  });
})();

// From Submodule 3 (Quiz)
(() => {
  const form = document.getElementById('quiz-form-3');
  const resultSpan = document.getElementById('quiz-result-3');
  const resetBtn = document.getElementById('quiz-reset-3');
  const answers = ['A','B','B','B','B'];
  function setDisabled(disabled) {
    document.querySelectorAll('#mc-quiz-3 input').forEach(i => i.disabled = disabled);
    document.getElementById('quiz-submit-3').disabled = disabled;
  }
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let score = 0;
    for (let i = 0; i < answers.length; i++) {
      const selected = form['q' + i] ? form['q' + i].value : null;
      if (selected === answers[i]) score += 1;
    }
    resultSpan.textContent = `You scored ${score} / ${answers.length}`;
    setDisabled(true);
  });
  resetBtn.addEventListener('click', () => {
    form.reset();
    resultSpan.textContent = '';
    setDisabled(false);
  });
})();

// From Submodule 3 (Vocab Picker)
(() => {
  const form = document.getElementById('vocab-form-3');
  const submitBtn = document.getElementById('vocab-picker-submit-3');
  const resetBtn = document.getElementById('vocab-picker-reset-3');
  const resultSpan = document.getElementById('vocab-picker-result-3');
  const answers = ['Controller','ORM','JSON'];
  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const vals = [form.v0.value, form.v1.value, form.v2.value];
    let score = 0;
    for (let i = 0; i < answers.length; i++) if (vals[i] === answers[i]) score += 1;
    resultSpan.textContent = `You scored ${score} / ${answers.length}`;
    form.querySelectorAll('select').forEach(s => s.disabled = true);
    submitBtn.disabled = true;
  });
  resetBtn.addEventListener('click', () => {
    form.reset();
    resultSpan.textContent = '';
    form.querySelectorAll('select').forEach(s => s.disabled = false);
    submitBtn.disabled = false;
  });
})();

// From Submodule 4 (API Tester)
const mockEndpoints = {
    'GET:/api/users': { status: 200, body: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }] },
    'GET:/api/users/1': { status: 200, body: { id: 1, name: 'Alice' } },
    'POST:/api/users': { status: 201, body: { id: 3, name: 'New User' } },
    'PUT:/api/users/1': { status: 200, body: { id: 1, name: 'Alice Updated' } },
    'DELETE:/api/users/1': { status: 200, body: { message: 'User deleted' } },
    'GET:/api/invalid': { status: 404, body: { error: 'Not Found' } }
};
window.loadPreset = function(endpoint, method) {
    document.getElementById('url').value = endpoint;
    document.getElementById('method').value = method;
}
window.sendRequest = function(event) {
    const method = document.getElementById('method').value;
    const endpoint = document.getElementById('url').value;
    if (!endpoint) {
        alert('Please enter an endpoint');
        return;
    }
    const key = `${method}:${endpoint}`;
    const mockResponse = mockEndpoints[key];
    const btn = event.target;
    btn.disabled = true;
    btn.textContent = 'Sending...';
    setTimeout(() => {
        document.getElementById('response-container').classList.add('active');
        const statusBadge = document.getElementById('status-code');
        const responseTimeEl = document.getElementById('response-time');
        const responseBodyEl = document.getElementById('response-body');
        if (mockResponse) {
            statusBadge.textContent = `${mockResponse.status}`;
            statusBadge.className = 'status-badge';
            if (mockResponse.status >= 200 && mockResponse.status < 300) {
                statusBadge.classList.add('status-2xx');
            } else if (mockResponse.status >= 400 && mockResponse.status < 500) {
                statusBadge.classList.add('status-4xx');
            } else {
                statusBadge.classList.add('status-5xx');
            }
            responseTimeEl.textContent = `Response time: ${Math.floor(Math.random() * 100) + 50}ms`;
            responseBodyEl.textContent = JSON.stringify(mockResponse.body, null, 2);
        } else {
            statusBadge.textContent = '404';
            statusBadge.className = 'status-badge status-4xx';
            responseTimeEl.textContent = `Response time: ${Math.floor(Math.random() * 50) + 30}ms`;
            responseBodyEl.textContent = JSON.stringify({ error: 'Endpoint not found' }, null, 2);
        }
        btn.disabled = false;
        btn.textContent = 'Send Request';
    }, 500);
}

// FRQ
import { javaURI } from '{{ site.baseurl }}/assets/js/api/config.js';
const btn = document.getElementById('frq-grade-btn');
btn.addEventListener('click', async () => {
    const q = document.getElementById('frq-question').textContent.trim();
    const a = document.getElementById('frq-answer').value.trim();
    const fb = document.getElementById('frq-feedback');
    if (!a) { fb.innerHTML = '<span style="color:red;">Please enter a response.</span>'; return; }
    btn.disabled = true;
    fb.innerHTML = 'Grading...';
    try {
        const res = await fetch(`${javaURI}/api/gemini-frq/grade`, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: q, answer: a })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();
        let feedbackText = result.candidates?.[0]?.content?.parts?.[0]?.text || 'No feedback.';
        fb.innerHTML = feedbackText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g,'<br>');
    } catch (e) {
        fb.innerHTML = `<span style="color:red;">Error: ${e.message}</span>`;
    } finally {
        btn.disabled = false;
    }
});
</script>