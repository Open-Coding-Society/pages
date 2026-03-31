---
layout: cs-bigsix-lesson
title: "Frontend Development — All-in-One Interactive Lesson"
description: "Compact lesson combining Markdown, HTML, CSS, Sass, Tailwind, and JavaScript with interactive playgrounds"
permalink: /bigsix/frontend_lesson
parent: "bigsix"
lesson_number: 1
team: "Creators"
categories: [CSP, Frontend, Interactive]
tags: [html, css, javascript, markdown, interactive]
author: "Creators Team"
date: 2025-12-02
---

<link href="https://cdn.quilljs.com/1.3.7/quill.snow.css" rel="stylesheet">
<script src="https://cdn.quilljs.com/1.3.7/quill.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

<style>
  :root {
    --bg: #0a0e27;
    --panel: #0f1729;
    --panel-2: #1a2540;
    --border: rgba(255,255,255,0.08);
    --border-accent: rgba(124,58,237,0.4);
    --text: #e6eef8;
    --muted: #9aa6bf;
    --accent: #7c3aed;
    --accent-hover: #6d28d9;
    --success: #b6f5c2;
    --success-bg: rgba(34,197,94,0.12);
    --error: #fbbebe;
    --error-bg: rgba(239,68,68,0.12);
    --code-bg: #051226;
    --hover-bg: rgba(124,58,237,0.1);
  }
  * { box-sizing: border-box; }
  body { margin:0; padding:0; background:var(--bg); color:var(--text); font-family:'Segoe UI',system-ui,sans-serif; line-height:1.6; }
  .container { max-width:1000px; margin:0 auto; padding:24px 16px 60px; }
  .header { margin-bottom:32px; }
  .header h1 { font-size:28px; font-weight:800; margin:0 0 4px; }
  .header p { color:var(--muted); font-size:14px; margin:0 0 12px; }

  .progress-bar { display:flex; gap:6px; margin:20px 0; align-items:center; }
  .progress-bar .step { flex:1; height:4px; background:rgba(255,255,255,0.08); border-radius:2px; cursor:pointer; transition:0.2s; }
  .progress-bar .step.active { background:var(--accent); height:6px; }
  .progress-bar .step:hover { background:var(--accent-hover); }

  .section { display:none; }
  .section.active { display:block; animation:fadeIn 0.3s ease; }
  @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }

  .card { background:var(--panel); border:1px solid var(--border); border-radius:14px; padding:22px; margin-bottom:16px; }
  .card h2 { margin:0 0 6px; font-size:20px; color:#a6c9ff; }
  .card h3 { margin:20px 0 8px; font-size:15px; color:#a6c9ff; }
  .card > p { color:var(--muted); font-size:14px; margin:0 0 16px; }

  .block-desc {
    background:linear-gradient(90deg,rgba(96,165,250,0.1),rgba(167,139,250,0.1));
    border-left:3px solid var(--accent);
    padding:10px 14px; border-radius:8px;
    color:var(--text); font-size:14px; margin:0 0 18px; line-height:1.6;
  }

  .split-view { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  @media (max-width:860px) { .split-view { grid-template-columns:1fr; } }

  .field-label { display:block; font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--muted); margin-bottom:6px; }

  .editor-wrap { background:var(--code-bg); border:1px solid var(--border); border-radius:10px; overflow:hidden; }
  .editor-header { background:var(--panel-2); border-bottom:1px solid var(--border); padding:6px 12px; display:flex; align-items:center; gap:6px; }
  .editor-header .dot { width:10px; height:10px; border-radius:50%; }
  .editor-header .dot.red   { background:#ff5f57; }
  .editor-header .dot.yellow{ background:#ffbd2e; }
  .editor-header .dot.green { background:#28c840; }
  .editor-header .lang-tag { margin-left:auto; font-size:10px; color:var(--muted); font-family:monospace; }
  .editor-wrap textarea { display:block; width:100%; background:var(--code-bg); color:#dce9ff; border:none; font-family:'Consolas','Fira Code',monospace; font-size:13px; padding:14px; resize:vertical; min-height:200px; line-height:1.6; }
  .editor-wrap textarea:focus { outline:none; }

  .preview-wrap { background:var(--panel-2); border:1px solid var(--border); border-radius:10px; overflow:hidden; display:flex; flex-direction:column; }
  .preview-header { background:var(--panel); border-bottom:1px solid var(--border); padding:6px 12px; font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--muted); display:flex; align-items:center; gap:8px; }
  .preview-header::before { content:''; display:inline-block; width:8px; height:8px; border-radius:50%; background:#28c840; box-shadow:0 0 6px #28c840; }
  .preview-body { padding:16px; flex:1; overflow:auto; min-height:200px; color:var(--text); font-size:14px; line-height:1.7; }
  .preview-body h1,.preview-body h2,.preview-body h3 { color:#a6c9ff; margin-top:12px; }
  .preview-body code { background:var(--code-bg); padding:2px 6px; border-radius:4px; font-family:monospace; font-size:12px; }
  .preview-body pre { background:var(--code-bg); padding:12px; border-radius:8px; overflow-x:auto; }
  .preview-body a { color:#7c9fff; }
  .preview-body ul,.preview-body ol { padding-left:20px; }

  .console-wrap { background:#020617; border:1px solid var(--border); border-radius:10px; overflow:hidden; }
  .console-header { background:#0a0f1e; border-bottom:1px solid var(--border); padding:6px 12px; font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--muted); display:flex; align-items:center; justify-content:space-between; }
  .console-body { padding:12px 14px; min-height:140px; max-height:280px; overflow-y:auto; font-family:'Consolas','Fira Code',monospace; font-size:12px; color:#cfe8ff; white-space:pre-wrap; word-break:break-word; line-height:1.6; }
  .console-line.log::before   { content:'> ';  color:var(--muted); }
  .console-line.error { color:var(--error); }
  .console-line.error::before { content:'✕ '; }
  .console-line.warn  { color:#fde68a; }
  .console-line.warn::before  { content:'⚠ '; }
  .console-empty { color:var(--muted); font-style:italic; }

  button { appearance:none; border:1px solid var(--border); background:var(--accent); color:#fff; padding:8px 16px; border-radius:8px; cursor:pointer; font-size:13px; font-weight:600; transition:all 0.2s; }
  button:hover { background:var(--accent-hover); transform:translateY(-1px); box-shadow:0 4px 12px rgba(124,58,237,0.3); }
  button:active { transform:translateY(0); }
  button:disabled { opacity:0.4; cursor:not-allowed; transform:none; box-shadow:none; }
  button.secondary { background:var(--panel-2); color:var(--text); }
  button.secondary:hover { background:#243050; box-shadow:none; }
  .btn-row { display:flex; gap:8px; flex-wrap:wrap; margin-top:12px; align-items:center; }

  .tab-nav { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:16px; }
  .tab-nav button { background:var(--panel-2); color:var(--muted); border:1px solid var(--border); padding:6px 14px; font-size:12px; border-radius:20px; font-weight:600; }
  .tab-nav button.active { background:var(--accent); color:#fff; border-color:var(--accent); }
  .tab-nav button:hover:not(.active) { background:var(--hover-bg); color:var(--text); transform:none; box-shadow:none; }

  .concept-box { border:1px solid var(--border); border-radius:10px; padding:14px 16px; background:var(--panel-2); margin-bottom:10px; }
  .concept-title { font-size:13px; font-weight:700; color:#a6c9ff; margin-bottom:6px; display:flex; align-items:center; gap:8px; }
  .concept-title .tag { background:var(--hover-bg); border:1px solid var(--border-accent); color:#a78bfa; border-radius:4px; padding:1px 7px; font-size:10px; font-weight:700; letter-spacing:0.06em; }
  .concept-box p,.concept-box ul { font-size:13px; color:var(--muted); margin:0; line-height:1.65; }
  .concept-box code { background:var(--code-bg); color:#93c5fd; border-radius:4px; padding:1px 6px; font-size:12px; font-family:monospace; }
  .concept-box ul { padding-left:18px; margin-top:6px; }
  .concept-box ul li { margin-bottom:3px; }

  .exercise { background:var(--hover-bg); border-left:3px solid var(--accent); padding:12px 16px; border-radius:0 8px 8px 0; margin:10px 0; font-size:14px; color:var(--text); line-height:1.6; }
  .exercise strong { color:#a6c9ff; }

  select { background:var(--panel-2); border:1px solid var(--border); border-radius:8px; color:var(--text); padding:7px 10px; font-size:13px; cursor:pointer; }
  select:focus { outline:none; box-shadow:0 0 0 2px rgba(124,58,237,0.4); }

  #twPreviewArea { background:var(--panel-2); border:1px solid var(--border); border-radius:10px; padding:20px; min-height:100px; display:flex; align-items:center; justify-content:center; margin-top:12px; }

  .code-block { background:var(--code-bg); border:1px solid var(--border); border-radius:10px; overflow:hidden; }
  .code-block-header { background:var(--panel-2); border-bottom:1px solid var(--border); padding:6px 14px; font-size:11px; color:var(--muted); font-family:monospace; display:flex; justify-content:space-between; align-items:center; }
  .code-block pre { margin:0; padding:14px; font-family:'Consolas','Fira Code',monospace; font-size:12px; color:#dce9ff; overflow-x:auto; line-height:1.6; }

  #sandboxFrame { width:100%; min-height:340px; border:1px solid var(--border); border-radius:0 0 10px 10px; background:white; display:block; }
  .sandbox-preview-header { background:var(--panel); border:1px solid var(--border); border-bottom:none; border-radius:10px 10px 0 0; padding:8px 14px; display:flex; align-items:center; gap:8px; font-size:11px; color:var(--muted); font-weight:700; letter-spacing:0.07em; text-transform:uppercase; }

  .nav-buttons { display:flex; gap:12px; margin-top:28px; justify-content:space-between; align-items:center; }
  #stepIndicator { color:var(--muted); font-size:12px; }

  .tooltip { font-size:12px; color:var(--muted); margin-top:10px; padding:8px 12px; background:var(--panel-2); border-radius:6px; border-left:2px solid var(--accent); line-height:1.5; }
  .tooltip::before { content:'💡 '; }

  .checkpoint-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:12px; margin-top:4px; }
  .checkpoint { background:var(--panel-2); border:1px solid var(--border); border-radius:10px; padding:14px 16px; font-size:13px; line-height:1.6; color:var(--text); }
  .checkpoint-title { font-weight:700; color:#a6c9ff; margin-bottom:4px; font-size:14px; }
  .checkpoint p { color:var(--muted); margin:0; }
</style>

<div class="container page-content">
  <div class="header">
    <h1>Frontend Development — All-in-One</h1>
    <p>Interactive lessons: Markdown → HTML, CSS styling, Tailwind + Sass, JavaScript, and a live code sandbox.</p>
    <a href="../" class="button back-btn" style="font-size:13px;padding:6px 14px;text-decoration:none;display:inline-block;margin-top:6px;">← Back</a>
  </div>

  <div class="progress-bar" id="progressBar"></div>

  <!-- STEP 1: Markdown -->
  <div class="section active" id="step1">
    <div class="card">
      <h2>1 — Markdown to HTML Conversion</h2>
      <div class="block-desc"><strong>What this shows:</strong> Markdown is shorthand that converts to HTML. Write on the left, click Convert, see the rendered HTML on the right.</div>
      <div class="concept-box" style="margin-bottom:16px;">
        <div class="concept-title">Markdown Cheat Sheet <span class="tag">REFERENCE</span></div>
        <ul>
          <li><code># H1</code> → &lt;h1&gt; &nbsp;·&nbsp; <code>## H2</code> → &lt;h2&gt;</li>
          <li><code>**bold**</code> → <strong>bold</strong> &nbsp;·&nbsp; <code>*italic*</code> → <em>italic</em></li>
          <li><code>- item</code> → unordered list &nbsp;·&nbsp; <code>1. item</code> → ordered list</li>
          <li><code>[text](url)</code> → link &nbsp;·&nbsp; <code>![alt](url)</code> → image</li>
          <li>Backtick <code>`code`</code> → inline code &nbsp;·&nbsp; <code>&gt; text</code> → blockquote</li>
        </ul>
      </div>
      <div class="split-view">
        <div>
          <span class="field-label">✏️ Markdown Input</span>
          <div class="editor-wrap">
            <div class="editor-header">
              <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
              <span class="lang-tag">markdown</span>
            </div>
            <textarea id="mdInput" rows="14">## Hello Frontend!

Write your **Markdown** here and hit Convert.

### Why Markdown?
- HTML structures pages
- CSS styles them
- JavaScript makes them *interactive*

> Markdown is faster to write than raw HTML.

[Visit MDN Docs](https://developer.mozilla.org)</textarea>
          </div>
          <!-- Button IDs match what markdown.js listens for -->
          <div class="btn-row">
            <button id="mdConvertBtn">Convert to HTML</button>
            <button id="mdResetBtn" class="secondary">Reset</button>
          </div>
        </div>
        <div>
          <span class="field-label">👁️ Rendered HTML Preview</span>
          <div class="preview-wrap" style="min-height:320px;">
            <div class="preview-header">Live Preview</div>
            <div class="preview-body" id="htmlPreview">
              <span style="color:var(--muted);font-style:italic;">Click "Convert to HTML" to see output here.</span>
            </div>
          </div>
        </div>
      </div>
      <div class="tooltip">Pro tip: Jekyll and GitHub Pages auto-convert <code>.md</code> files to HTML.</div>
    </div>
  </div>

  <!-- STEP 2: CSS -->
  <div class="section" id="step2">
    <div class="card">
      <h2>2 — CSS Styling Playground</h2>
      <div class="block-desc"><strong>What this shows:</strong> CSS controls how HTML looks. Edit the rules on the left and click Apply CSS to see them instantly on the right.</div>
      <div class="concept-box" style="margin-bottom:16px;">
        <div class="concept-title">Key CSS Concepts <span class="tag">REFERENCE</span></div>
        <ul>
          <li><strong>Selector</strong> — targets elements: <code>.class</code> <code>#id</code> <code>element:hover</code></li>
          <li><strong>Box model</strong> — margin → border → padding → content</li>
          <li><strong>Flexbox</strong> — <code>display:flex</code> aligns items in a row or column</li>
          <li><strong>Transitions</strong> — <code>transition: all 0.3s ease</code> animates changes</li>
          <li><strong>Gradients</strong> — <code>background: linear-gradient(direction, color1, color2)</code></li>
        </ul>
      </div>
      <div class="split-view">
        <div>
          <span class="field-label">✏️ CSS Editor</span>
          <div class="editor-wrap">
            <div class="editor-header">
              <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
              <span class="lang-tag">css</span>
            </div>
            <textarea id="cssInput" rows="16">.box {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 32px 24px;
  border-radius: 12px;
  color: white;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  max-width: 280px;
  margin: 0 auto;
}
.box:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 32px rgba(102,126,234,0.4);
}</textarea>
          </div>
          <!-- Button IDs match what css-playground.js listens for -->
          <div class="btn-row">
            <button id="cssApplyBtn">Apply CSS</button>
            <button id="cssResetBtn" class="secondary">Reset</button>
          </div>
        </div>
        <div>
          <span class="field-label">👁️ Live Preview</span>
          <div class="preview-wrap">
            <div class="preview-header">CSS Output</div>
            <div class="preview-body" id="cssPreviewBody" style="display:flex;align-items:center;justify-content:center;min-height:280px;">
              <div class="box">Hover over me ✨</div>
            </div>
          </div>
        </div>
      </div>
      <style id="dynamicStyle"></style>
      <div class="tooltip">Try changing <code>border-radius</code> to <code>50%</code> or swapping the gradient for a solid color.</div>
    </div>
  </div>

  <!-- STEP 3: Tailwind + Sass -->
  <div class="section" id="step3">
    <div class="card">
      <h2>3 — Tailwind CSS &amp; Sass</h2>
      <div class="block-desc"><strong>What this shows:</strong> Two professional CSS tools. <strong>Tailwind</strong> uses utility classes directly in HTML. <strong>Sass</strong> adds variables and nesting for large projects.</div>
      <div class="concept-box"><div class="concept-title">Tailwind CSS — Live Demo <span class="tag">INTERACTIVE</span></div><p>Adjust the dropdowns and the card updates instantly.</p></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:12px 0 20px;">
        <div>
          <!-- Dropdown IDs match what tailwind.js listens for -->
          <span class="field-label">Padding</span>
          <select id="twPadding" style="width:100%;margin-bottom:10px;">
            <option value="p-2">p-2 (small · 8px)</option>
            <option value="p-4" selected>p-4 (medium · 16px)</option>
            <option value="p-6">p-6 (large · 24px)</option>
            <option value="p-8">p-8 (xl · 32px)</option>
          </select>
          <span class="field-label">Color</span>
          <select id="twColor" style="width:100%;margin-bottom:10px;">
            <option value="bg-blue-600 text-white">Blue</option>
            <option value="bg-purple-600 text-white">Purple</option>
            <option value="bg-emerald-600 text-white">Green</option>
            <option value="bg-rose-600 text-white">Red</option>
            <option value="bg-amber-400 text-black">Yellow</option>
            <option value="bg-slate-800 text-white">Dark</option>
          </select>
          <span class="field-label">Border Radius</span>
          <select id="twRadius" style="width:100%;margin-bottom:10px;">
            <option value="rounded-none">rounded-none</option>
            <option value="rounded">rounded</option>
            <option value="rounded-lg" selected>rounded-lg</option>
            <option value="rounded-2xl">rounded-2xl</option>
            <option value="rounded-full">rounded-full</option>
          </select>
          <span class="field-label">Shadow</span>
          <select id="twShadow" style="width:100%;margin-bottom:10px;">
            <option value="">none</option>
            <option value="shadow-sm">shadow-sm</option>
            <option value="shadow-md" selected>shadow-md</option>
            <option value="shadow-xl">shadow-xl</option>
            <option value="shadow-2xl">shadow-2xl</option>
          </select>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <span class="field-label">Live Preview</span>
          <div id="twPreviewArea">
            <div id="twPreview" style="text-align:center;font-weight:700;min-width:160px;padding:16px;border-radius:8px;background:#2563eb;color:white;">Tailwind Card</div>
          </div>
          <span class="field-label">Generated Class String</span>
          <div class="code-block">
            <div class="code-block-header"><span>HTML</span></div>
            <pre id="twClassDisplay">&lt;div class="p-4 bg-blue-600 text-white rounded-lg shadow-md"&gt;
  Tailwind Card
&lt;/div&gt;</pre>
          </div>
        </div>
      </div>
      <div class="concept-box"><div class="concept-title">Sass vs CSS <span class="tag">REFERENCE</span></div><p>Sass compiles to plain CSS. Here is what it adds:</p></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px;">
        <div>
          <span class="field-label">Sass (.scss)</span>
          <div class="code-block">
            <div class="code-block-header"><span>scss</span><span style="color:#a78bfa;">preprocessor</span></div>
            <pre>$primary: #667eea;
$radius: 12px;

.card {
  padding: 1rem;
  background: $primary;
  border-radius: $radius;

  &amp;:hover { transform: scale(1.05); }
  &amp;__title { font-size: 1.25rem; }
}</pre>
          </div>
        </div>
        <div>
          <span class="field-label">CSS output</span>
          <div class="code-block">
            <div class="code-block-header"><span>css</span><span style="color:#86efac;">compiled</span></div>
            <pre>.card {
  padding: 1rem;
  background: #667eea;
  border-radius: 12px;
}
.card:hover { transform: scale(1.05); }
.card__title { font-size: 1.25rem; }</pre>
          </div>
        </div>
      </div>
      <div class="tooltip">Use Tailwind for fast prototyping. Use Sass in larger projects with reusable design tokens.</div>
    </div>
  </div>

  <!-- STEP 4: JavaScript -->
  <div class="section" id="step4">
    <div class="card">
      <h2>4 — JavaScript Fundamentals</h2>
      <div class="block-desc"><strong>What this shows:</strong> JavaScript makes pages interactive. Pick a tab, read the concept, then hit Run Code to see output in the console.</div>
      <!-- data-example attributes match keys in JS_EXAMPLES in javascript-playground.js -->
      <div class="tab-nav" id="jsTabNav">
        <button class="active" data-example="variables">Variables &amp; Types</button>
        <button data-example="operators">Operators</button>
        <button data-example="functions">Functions</button>
        <button data-example="arrays">Arrays</button>
        <button data-example="dom">DOM</button>
        <button data-example="events">Events</button>
      </div>
      <div class="concept-box" id="jsConcept" style="margin-bottom:14px;">
        <div class="concept-title" id="jsConceptTitle">Variables &amp; Types <span class="tag">BASICS</span></div>
        <p id="jsConceptDesc">JavaScript has three ways to declare variables: <code>let</code>, <code>const</code>, and <code>var</code> (old — avoid).</p>
      </div>
      <div class="split-view">
        <div>
          <span class="field-label">✏️ JavaScript Editor</span>
          <div class="editor-wrap">
            <div class="editor-header">
              <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
              <span class="lang-tag">javascript</span>
            </div>
            <textarea id="jsInput" rows="14"></textarea>
          </div>
          <!-- Button IDs match what javascript-playground.js listens for -->
          <div class="btn-row">
            <button id="jsRunBtn">▶ Run Code</button>
            <button id="jsClearBtn" class="secondary">Clear Console</button>
          </div>
        </div>
        <div>
          <span class="field-label">📟 Console Output</span>
          <div class="console-wrap">
            <div class="console-header">
              <span>Console</span>
              <span id="consoleStatus" style="font-size:10px;color:var(--muted);">Ready</span>
            </div>
            <div class="console-body" id="jsConsole">
              <span class="console-empty">Run your code to see output here…</span>
            </div>
          </div>
        </div>
      </div>
      <div class="tooltip">Use <code>console.log()</code> to print any value. Errors appear in red.</div>
    </div>
  </div>

  <!-- STEP 5: Sandbox -->
  <div class="section" id="step5">
    <div class="card">
      <h2>5 — Live Code Sandbox</h2>
      <div class="block-desc"><strong>What this shows:</strong> Write HTML, CSS, and JavaScript together and see the result live in an isolated preview.</div>
      <!-- data-template attributes match keys in SANDBOX_TEMPLATES in sandbox.js -->
      <div class="tab-nav" id="sandboxTabNav" style="margin-bottom:14px;">
        <button class="active" data-template="click">Click Counter</button>
        <button data-template="todo">To-Do List</button>
        <button data-template="color">Color Picker</button>
        <button data-template="timer">Countdown Timer</button>
        <button data-template="blank">Blank</button>
      </div>
      <div class="split-view">
        <div>
          <span class="field-label">✏️ HTML + CSS + JS</span>
          <div class="editor-wrap">
            <div class="editor-header">
              <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
              <span class="lang-tag">html · css · js</span>
            </div>
            <textarea id="sandboxCode" rows="18"></textarea>
          </div>
          <!-- Button IDs match what sandbox.js listens for -->
          <div class="btn-row">
            <button id="sandboxRunBtn">▶ Update Preview</button>
            <button id="sandboxClearBtn" class="secondary">Clear</button>
          </div>
        </div>
        <div>
          <span class="field-label">👁️ Live Preview</span>
          <div class="sandbox-preview-header">
            <span style="width:8px;height:8px;border-radius:50%;background:#28c840;display:inline-block;box-shadow:0 0 6px #28c840;"></span>
            Sandbox Output
          </div>
          <iframe id="sandboxFrame" sandbox="allow-scripts"></iframe>
        </div>
      </div>
      <div class="tooltip">The sandbox is isolated — use <code>alert()</code>, <code>addEventListener()</code>, <code>setInterval()</code>, and more.</div>
    </div>
  </div>

  <!-- STEP 6: Reflection -->
  <div class="section" id="step6">
    <div class="card">
      <h2>6 — Reflection &amp; What's Next</h2>
      <div class="block-desc"><strong>You covered the full frontend stack.</strong> Here is a summary of each piece and where to go next.</div>
      <div class="checkpoint-grid">
        <div class="checkpoint"><div class="checkpoint-title">📝 Markdown &amp; HTML</div><p>Markdown is shorthand for HTML. Tools like Jekyll convert <code>.md</code> to <code>.html</code> automatically.</p></div>
        <div class="checkpoint"><div class="checkpoint-title">🎨 CSS</div><p>CSS controls layout, colors, spacing, and animation. Master selectors, the box model, flexbox, and grid.</p></div>
        <div class="checkpoint"><div class="checkpoint-title">⚡ Tailwind CSS</div><p>Utility-first classes like <code>p-4 rounded-lg bg-blue-600</code> let you build UI without CSS files.</p></div>
        <div class="checkpoint"><div class="checkpoint-title">🔧 Sass</div><p>Sass adds variables, nesting, and mixins. Use it in larger projects with reusable design tokens.</p></div>
        <div class="checkpoint"><div class="checkpoint-title">📦 JavaScript</div><p>JS makes pages interactive. The beginner stack: variables → functions → arrays → DOM → events.</p></div>
        <div class="checkpoint"><div class="checkpoint-title">🚀 Next Steps</div><p>Build a calculator in the sandbox. Then explore React, fetch APIs, and GitHub Pages to deploy live.</p></div>
      </div>
      <div class="exercise" style="margin-top:20px;">
        <strong>🎯 Challenge:</strong> Go back to the sandbox and build a simple calculator. Use <code>&lt;button&gt;</code> elements for digits and JavaScript to handle clicks and compute results.
      </div>
    </div>
  </div>

  <div class="nav-buttons">
    <button id="prevBtn" class="secondary" disabled>← Previous</button>
    <span id="stepIndicator">Step 1 / 6</span>
    <button id="nextBtn">Next →</button>
  </div>
</div>

<!-- ============================================================
     MAIN SCRIPT — ORCHESTRATOR
     Imports all SRP modules and calls their init functions.
     No logic lives here.
     ============================================================ -->
<script type="module">
import { javaURI, pythonURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';

// SRP modules — each owns exactly one responsibility
import { restore, persist }         from '{{ site.baseurl }}/assets/js/bigsix/frontend/persistence.js';
import { initNavigation, showStep } from '{{ site.baseurl }}/assets/js/bigsix/frontend/navigation.js';
import { initMarkdown }             from '{{ site.baseurl }}/assets/js/bigsix/frontend/markdown.js';
import { initCssPlayground }        from '{{ site.baseurl }}/assets/js/bigsix/frontend/css-playground.js';
import { initTailwind }             from '{{ site.baseurl }}/assets/js/bigsix/frontend/tailwind.js';
import { initJsPlayground }         from '{{ site.baseurl }}/assets/js/bigsix/frontend/javascript-playground.js';
import { initSandbox }              from '{{ site.baseurl }}/assets/js/bigsix/frontend/sandbox.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();         // auto-detect steps, wire buttons
  restore(showStep);        // jump to saved step
  initMarkdown();           // wire Convert/Reset, wait for marked.js
  initCssPlayground();      // wire Apply/Reset CSS
  initTailwind();           // wire dropdowns, render initial preview
  initJsPlayground();       // wire tabs, Run, Clear
  initSandbox();            // wire sandbox tabs, Run, Clear
});
</script>

<!-- Back button handler (plain script — no imports needed) -->
<script>
(function(){
  document.addEventListener('DOMContentLoaded',function(){
    document.querySelectorAll('a.back-btn').forEach(function(a){
      a.addEventListener('click',function(e){
        if(e.metaKey||e.ctrlKey||e.shiftKey||e.button===1)return;
        e.preventDefault();
        try{if(document.referrer&&new URL(document.referrer).origin===location.origin){history.back();return;}}catch(err){}
        var p=location.pathname.replace(/\/$/,'').split('/');
        if(p.length>1){p.pop();window.location.href=p.join('/')+'/';}else{window.location.href='/';}
      });
    });
  });
})();
</script>
<script src="/assets/js/lesson-completion-bigsix.js"></script>