---
layout: cs-portfolio-lesson
title: "Frontend Development — All-in-One Interactive Lesson"
description: "Compact lesson combining Markdown, HTML, CSS, Sass, Tailwind, and JavaScript with interactive playgrounds"
permalink: /bigsix/frontend_lesson
parent: "Frontend Development"
team: "Creators"
categories: [CSP, Frontend, Interactive]
tags: [html, css, javascript, markdown, interactive]
author: "Creators Team"
date: 2025-12-02
---

<link href="https://cdn.tailwindcss.com" rel="stylesheet">
<link href="https://cdn.quilljs.com/1.3.7/quill.snow.css" rel="stylesheet">
<script src="https://cdn.quilljs.com/1.3.7/quill.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

<style>
  :root {
    --bg: #0a0e27;
    --panel: #0f1729;
    --border: rgba(255, 255, 255, 0.08);
    --text: #e6eef8;
    --muted: #9aa6bf;
    --accent: #7c3aed;
  }

  * { box-sizing: border-box; }
  body { margin: 0; padding: 0; background: var(--bg); color: var(--text); font-family: Inter, system-ui, sans-serif; line-height: 1.5; }

  .container { max-width: 1000px; margin: 0 auto; padding: 24px 16px 40px; }
  .header { margin-bottom: 32px; }
  .header h1 { font-size: 28px; font-weight: 800; margin: 0 0 4px 0; }
  .header p { color: var(--muted); font-size: 14px; margin: 0; }

  .progress-bar { display: flex; gap: 8px; margin: 20px 0; justify-content: space-between; align-items: center; }
  .progress-bar .step { flex: 1; height: 4px; background: rgba(255, 255, 255, 0.1); border-radius: 2px; cursor: pointer; transition: 0.2s; }
  .progress-bar .step.active { background: var(--accent); height: 6px; }

  .section { display: none; }
  .section.active { display: block; }

  .card { background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-bottom: 16px; }
  .card h2 { margin-top: 0; font-size: 20px; color: #a6c9ff; }
  .card h3 { margin-top: 16px; font-size: 16px; color: #a6c9ff; }

  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }

  .editor-box { background: #051226; border: 1px solid var(--border); border-radius: 10px; padding: 12px; }
  .editor-box textarea, .editor-box input { width: 100%; background: #051226; color: #dce9ff; border: none; font-family: Consolas, monospace; font-size: 13px; padding: 8px; resize: vertical; min-height: 120px; }
  .editor-box textarea:focus, .editor-box input:focus { outline: none; box-shadow: 0 0 8px rgba(124, 58, 237, 0.3); }

  .preview-box { background: #0f1729; border: 1px solid var(--border); border-radius: 10px; padding: 12px; min-height: 200px; overflow: auto; }

  button { appearance: none; border: 1px solid var(--border); background: var(--accent); color: #fff; padding: 8px 14px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; transition: 0.2s; }
  button:hover { background: #6d28d9; transform: translateY(-1px); }
  button.secondary { background: #334155; }
  button.secondary:hover { background: #1e293b; }

  .toolbar { display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }

  .nav-buttons { display: flex; gap: 12px; margin-top: 24px; justify-content: space-between; }

  .code-console { background: #020617; border: 1px solid var(--border); border-radius: 10px; padding: 12px; min-height: 150px; max-height: 300px; overflow: auto; font-family: Consolas, monospace; font-size: 12px; color: #cfe8ff; white-space: pre-wrap; word-wrap: break-word; }

  .lesson-nav { display: flex; gap: 6px; margin: 12px 0; flex-wrap: wrap; }
  .lesson-nav button { padding: 6px 12px; font-size: 12px; }

  .code-input-area { margin: 12px 0; }
  .code-input-area label { display: block; font-size: 12px; color: var(--muted); margin-bottom: 6px; font-weight: 600; }

  .tooltip { font-size: 11px; color: var(--muted); margin-top: 6px; }

  .exercise { background: rgba(124, 58, 237, 0.1); border-left: 3px solid var(--accent); padding: 12px; border-radius: 6px; margin: 8px 0; }

  .split-view { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 900px) { .split-view { grid-template-columns: 1fr; } }
</style>

<div class="container">
  <div class="header">
    <h1>Frontend Development — All-in-One</h1>
    <p>Interactive lessons: Markdown → HTML, CSS styling, Tailwind + Sass, JavaScript, and code sandbox.</p>
    <a href="../" class="button back-btn">Back</a>
  </div>

  <div class="progress-bar" id="progressBar"></div>

  <!-- Step 1: Markdown to HTML -->
  <div class="section active" id="step1">
    <div class="card">
      <h2>1 — Markdown to HTML Conversion</h2>
      <p>Write Markdown on the left. Watch it render as HTML on the right. Markdown simplifies content creation.</p>
      
      <div class="split-view">
        <div>
          <label style="display: block; color: var(--muted); font-size: 12px; font-weight: 600; margin-bottom: 6px;">Markdown Input</label>
          <textarea id="mdInput" class="editor-box" style="min-height: 280px; padding: 12px;">## Hello Frontend

Write your **Markdown** here:
- HTML structures pages
- CSS styles them
- JavaScript makes them interactive

```
// Code blocks too!
const x = 5;
```

[Link example](https://example.com)</textarea>
        </div>
        <div>
          <label style="display: block; color: var(--muted); font-size: 12px; font-weight: 600; margin-bottom: 6px;">HTML Output</label>
          <div id="htmlPreview" class="preview-box" style="min-height: 280px;"></div>
        </div>
      </div>
      <button onclick="convertMarkdown()" style="margin-top: 12px;">Convert to HTML</button>
      <div class="tooltip">Pro tip: Use Markdown for fast writing, then convert to HTML for the web.</div>
    </div>
  </div>

  <!-- Step 2: CSS Playground -->
  <div class="section" id="step2">
    <div class="card">
      <h2>2 — CSS Styling Playground</h2>
      <p>Write CSS and see your styled preview instantly. Practice selectors, box model, colors, and animations.</p>
      
      <div class="split-view">
        <div>
          <label style="display: block; color: var(--muted); font-size: 12px; font-weight: 600; margin-bottom: 6px;">CSS Rules</label>
          <textarea id="cssInput" class="editor-box" style="min-height: 300px; padding: 12px;">.box {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 30px;
  border-radius: 10px;
  color: white;
  text-align: center;
  font-size: 18px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.box:hover {
  transform: translateY(-5px);
}</textarea>
        </div>
        <div>
          <label style="display: block; color: var(--muted); font-size: 12px; font-weight: 600; margin-bottom: 6px;">Live Preview</label>
          <div id="cssPreview" class="preview-box" style="min-height: 300px; display: flex; align-items: center; justify-content: center;">
            <div class="box" style="padding: 20px; text-align: center;">Hover over me</div>
          </div>
        </div>
      </div>
      <div style="display: flex; gap: 8px; margin-top: 12px;">
        <button onclick="applyCss()">Apply CSS</button>
        <button onclick="resetCss()" class="secondary">Reset</button>
      </div>
      <div class="tooltip">Tip: Use flexbox, grid, and transitions for modern layouts.</div>
    </div>
  </div>

  <!-- Step 3: Tailwind + Sass -->
  <div class="section" id="step3">
    <div class="card">
      <h2>3 — Tailwind CSS & Sass</h2>
      <p><strong>Tailwind:</strong> Utility-first classes for rapid UI (e.g., <code>p-4 bg-blue-500 rounded</code>).<br><strong>Sass:</strong> Preprocessor with variables and mixins for larger projects.</p>
      
      <div style="margin: 16px 0; padding: 12px; background: rgba(255, 255, 255, 0.05); border-radius: 8px;">
        <h3>Tailwind Demo</h3>
        <label style="display: block; color: var(--muted); font-size: 12px; margin-bottom: 8px;">Adjust settings:</label>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
          <select id="twPadding" style="padding: 6px; border-radius: 6px; border: 1px solid var(--border); background: var(--panel); color: var(--text);">
            <option value="p-2">p-2 (small)</option>
            <option value="p-4">p-4 (medium)</option>
            <option value="p-6">p-6 (large)</option>
          </select>
          <select id="twColor" style="padding: 6px; border-radius: 6px; border: 1px solid var(--border); background: var(--panel); color: var(--text);">
            <option value="bg-blue-500 text-white">Blue</option>
            <option value="bg-purple-500 text-white">Purple</option>
            <option value="bg-green-500 text-white">Green</option>
          </select>
          <select id="twRadius" style="padding: 6px; border-radius: 6px; border: 1px solid var(--border); background: var(--panel); color: var(--text);">
            <option value="rounded">rounded</option>
            <option value="rounded-lg">rounded-lg</option>
            <option value="rounded-full">rounded-full</option>
          </select>
          <button onclick="applyTailwind()">Apply</button>
        </div>
        <div id="twPreview" class="p-4 rounded bg-blue-500 text-white" style="text-align: center;">Tailwind Card</div>
      </div>

      <div style="margin: 16px 0; padding: 12px; background: rgba(255, 255, 255, 0.05); border-radius: 8px;">
        <h3>Sass Example</h3>
        <p style="font-size: 13px; color: var(--muted);">Sass adds power with variables, nesting, and mixins:</p>
        <pre style="background: #051226; padding: 12px; border-radius: 6px; overflow-x: auto; color: #dce9ff; font-size: 12px;">$primary: #667eea;
$spacing: 1rem;

.card {
  padding: $spacing;
  background: $primary;
  
  &:hover {
    transform: scale(1.05);
  }
}</pre>
      </div>
      <div class="tooltip">Use Tailwind for quick prototyping. Use Sass when you need reusable design tokens and mixins.</div>
    </div>
  </div>

  <!-- Step 4: JavaScript Basics -->
  <div class="section" id="step4">
    <div class="card">
      <h2>4 — JavaScript Fundamentals</h2>
      <p>Variables, operators, functions, and DOM manipulation. Type code and run it in the sandbox below.</p>
      
      <div class="lesson-nav">
        <button onclick="setJsExample('variables')" class="secondary">Variables</button>
        <button onclick="setJsExample('operators')" class="secondary">Operators</button>
        <button onclick="setJsExample('functions')" class="secondary">Functions</button>
        <button onclick="setJsExample('dom')" class="secondary">DOM</button>
      </div>

      <div class="code-input-area">
        <label>JavaScript Code</label>
        <textarea id="jsInput" class="editor-box" style="min-height: 200px; padding: 12px;">// Variables
let x = 5;
const y = 10;
var z = x + y;

console.log("Sum:", z);
console.log("Type of z:", typeof z);</textarea>
      </div>

      <div style="display: flex; gap: 8px; margin-bottom: 12px;">
        <button onclick="runJsCode()">Run Code</button>
        <button onclick="clearJsConsole()" class="secondary">Clear</button>
      </div>

      <label style="display: block; color: var(--muted); font-size: 12px; font-weight: 600; margin-bottom: 6px;">Console Output</label>
      <div id="jsConsole" class="code-console"></div>

      <div class="tooltip">Use console.log() to print values. Errors appear in red.</div>
    </div>
  </div>

  <!-- Step 5: Code Sandbox -->
  <div class="section" id="step5">
    <div class="card">
      <h2>5 — Interactive Code Sandbox</h2>
      <p>Write HTML, CSS, and JavaScript. See live output instantly in an iframe sandbox.</p>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
        <div>
          <label style="display: block; color: var(--muted); font-size: 12px; font-weight: 600; margin-bottom: 6px;">HTML + CSS + JS</label>
          <textarea id="sandboxCode" class="editor-box" style="min-height: 350px; padding: 12px;"><div id="app" style="padding: 20px; text-align: center; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border-radius: 10px;">
  <h2>Click the button</h2>
  <button id="btn" style="padding: 10px 20px; background: white; color: #667eea; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
    Click me
  </button>
</div>

<script>
  document.getElementById('btn').addEventListener('click', () => {
    alert('Hello from the sandbox!');
  });
</script></textarea>
        </div>
        <div>
          <label style="display: block; color: var(--muted); font-size: 12px; font-weight: 600; margin-bottom: 6px;">Live Preview</label>
          <iframe id="sandboxFrame" style="width: 100%; height: 350px; border: 1px solid var(--border); border-radius: 10px; background: white;"></iframe>
        </div>
      </div>
      <button onclick="runSandbox()">Update Preview</button>
      <div class="tooltip">The iframe runs in a sandbox for safety. Scripts run in isolation.</div>
    </div>
  </div>

  <!-- Step 6: Reflection -->
  <div class="section" id="step6">
    <div class="card">
      <h2>6 — Reflection & Next Steps</h2>
      <p>You've explored the core tools of frontend development. Here are key takeaways:</p>
      
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div class="exercise">
          <strong>Markdown & HTML:</strong> Markdown is fast to write; HTML is what browsers render. Tools like Jekyll auto-convert.
        </div>
        <div class="exercise">
          <strong>CSS:</strong> Style with selectors, box model, flexbox, grid, and animations. Practice specificity and cascading.
        </div>
        <div class="exercise">
          <strong>Tailwind & Sass:</strong> Tailwind speeds up UI prototyping. Sass centralizes design tokens and reusable logic.
        </div>
        <div class="exercise">
          <strong>JavaScript:</strong> Variables, functions, DOM manipulation, and event listeners make pages interactive.
        </div>
        <div class="exercise">
          <strong>Integration:</strong> Combine HTML, CSS, and JS in a single sandbox to build complete components.
        </div>
      </div>

      <div style="margin-top: 20px; padding: 12px; background: rgba(255, 255, 255, 0.05); border-radius: 8px;">
        <h3>Challenge</h3>
        <p>Try building a simple calculator in the sandbox. Use HTML for buttons, CSS for styling, and JavaScript for logic. You can save your progress locally by copying the code.</p>
      </div>
    </div>
  </div>

  <!-- Navigation -->
  <div class="nav-buttons">
    <button id="prevBtn" onclick="prevStep()" class="secondary">← Previous</button>
    <div style="display: flex; gap: 8px;">
      <span id="stepIndicator" style="color: var(--muted); font-size: 12px; align-self: center;">Step 1 / 6</span>
      <button id="nextBtn" onclick="nextStep()">Next →</button>
    </div>
  </div>
</div>

<script>
// ========== State & Navigation ==========
let currentStep = 0;
const steps = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6'];
const STORAGE_KEY = 'frontend_combined_v1';

function showStep(n) {
  currentStep = Math.max(0, Math.min(steps.length - 1, n));
  steps.forEach((s, i) => document.getElementById(s).classList.toggle('active', i === currentStep));
  
  // Update progress bar
  const bar = document.getElementById('progressBar');
  bar.innerHTML = steps.map((_, i) => `<div class="step ${i <= currentStep ? 'active' : ''}"></div>`).join('');
  
  document.getElementById('stepIndicator').textContent = `Step ${currentStep + 1} / ${steps.length}`;
  document.getElementById('prevBtn').disabled = currentStep === 0;
  document.getElementById('nextBtn').disabled = currentStep === steps.length - 1;

  persist();
}

function prevStep() { showStep(currentStep - 1); }
function nextStep() { showStep(currentStep + 1); }

// ========== Markdown to HTML ==========
function convertMarkdown() {
  const md = document.getElementById('mdInput').value;
  const html = marked.parse(md);
  document.getElementById('htmlPreview').innerHTML = html;
  persist();
}

// ========== CSS Playground ==========
function applyCss() {
  const css = document.getElementById('cssInput').value;
  let style = document.getElementById('dynamicStyle');
  if (!style) {
    style = document.createElement('style');
    style.id = 'dynamicStyle';
    document.head.appendChild(style);
  }
  style.textContent = css;
  persist();
}

function resetCss() {
  document.getElementById('cssInput').value = '.box { background: #667eea; padding: 30px; border-radius: 10px; }';
  applyCss();
}

// ========== Tailwind Demo ==========
function applyTailwind() {
  const padding = document.getElementById('twPadding').value;
  const color = document.getElementById('twColor').value;
  const radius = document.getElementById('twRadius').value;
  const preview = document.getElementById('twPreview');
  preview.className = `${padding} ${color} ${radius}`;
  persist();
}

// ========== JavaScript Sandbox ==========
function clearJsConsole() {
  document.getElementById('jsConsole').innerHTML = '';
}

function runJsCode() {
  clearJsConsole();
  const code = document.getElementById('jsInput').value;
  const console_output = document.getElementById('jsConsole');

  // Override console.log
  const origLog = console.log;
  const logs = [];
  console.log = function(...args) {
    logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    origLog.apply(console, args);
  };

  try {
    eval(code);
    logs.forEach(log => {
      const line = document.createElement('div');
      line.textContent = log;
      console_output.appendChild(line);
    });
  } catch (err) {
    const errLine = document.createElement('div');
    errLine.style.color = '#ffb3b3';
    errLine.textContent = '❌ ' + (err.message || err);
    console_output.appendChild(errLine);
  }
  console.log = origLog;
  persist();
}

function setJsExample(type) {
  const examples = {
    variables: `// Variables & Types
let name = "Alex";
const age = 22;
var score = 95;

console.log(name, age, score);
console.log(typeof name, typeof age);`,
    operators: `// Operators
let x = 10, y = 3;

console.log("Add:", x + y);
console.log("Subtract:", x - y);
console.log("Multiply:", x * y);
console.log("Divide:", x / y);
console.log("Modulus:", x % y);
console.log("Power:", x ** 2);`,
    functions: `// Functions
function greet(name) {
  return "Hello, " + name;
}

const add = (a, b) => a + b;

console.log(greet("Frontend"));
console.log("Sum:", add(5, 7));`,
    dom: `// DOM Manipulation
const element = document.createElement('div');
element.textContent = 'DOM Content';
element.style.color = 'blue';
element.style.padding = '10px';
console.log(element.outerHTML);`
  };
  document.getElementById('jsInput').value = examples[type] || '';
}

// ========== Code Sandbox ==========
function runSandbox() {
  const code = document.getElementById('sandboxCode').value;
  const frame = document.getElementById('sandboxFrame');
  frame.srcdoc = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body { margin: 0; font-family: system-ui; }</style></head><body>${code}</body></html>`;
  persist();
}

// ========== Persistence ==========
function persist() {
  const data = {
    step: currentStep,
    md: document.getElementById('mdInput').value,
    css: document.getElementById('cssInput').value,
    js: document.getElementById('jsInput').value,
    sandbox: document.getElementById('sandboxCode').value,
    twPadding: document.getElementById('twPadding').value,
    twColor: document.getElementById('twColor').value,
    twRadius: document.getElementById('twRadius').value
  };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
}

function restore() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!data) return;
    if (data.md) document.getElementById('mdInput').value = data.md;
    if (data.css) document.getElementById('cssInput').value = data.css;
    if (data.js) document.getElementById('jsInput').value = data.js;
    if (data.sandbox) document.getElementById('sandboxCode').value = data.sandbox;
    if (data.twPadding) document.getElementById('twPadding').value = data.twPadding;
    if (data.twColor) document.getElementById('twColor').value = data.twColor;
    if (data.twRadius) document.getElementById('twRadius').value = data.twRadius;
    showStep(data.step || 0);
  } catch (e) {}
}

// ========== Boot ==========
document.addEventListener('DOMContentLoaded', () => {
  restore();
  applyCss();
  convertMarkdown();
  runSandbox();
});
</script>

<script>
// Back button handler: prefer history.back() when possible, fall back to parent path
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('a.back-btn').forEach(function(a){
      a.addEventListener('click', function(e){
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
        e.preventDefault();
        try{ if (document.referrer && new URL(document.referrer).origin === location.origin){ history.back(); return; } }catch(err){}
        var p = location.pathname.replace(/\/$/,'').split('/');
        if (p.length>1){ p.pop(); window.location.href = p.join('/') + '/'; } else { window.location.href = '/'; }
      });
    });
  });
})();
</script>
