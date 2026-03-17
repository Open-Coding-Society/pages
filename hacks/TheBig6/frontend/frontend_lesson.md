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

  .field-label {
    display:block; font-size:11px; font-weight:700;
    letter-spacing:0.08em; text-transform:uppercase;
    color:var(--muted); margin-bottom:6px;
  }

  /* Editor */
  .editor-wrap { background:var(--code-bg); border:1px solid var(--border); border-radius:10px; overflow:hidden; }
  .editor-header {
    background:var(--panel-2); border-bottom:1px solid var(--border);
    padding:6px 12px; display:flex; align-items:center; gap:6px;
  }
  .editor-header .dot { width:10px; height:10px; border-radius:50%; }
  .editor-header .dot.red   { background:#ff5f57; }
  .editor-header .dot.yellow{ background:#ffbd2e; }
  .editor-header .dot.green { background:#28c840; }
  .editor-header .lang-tag { margin-left:auto; font-size:10px; color:var(--muted); font-family:monospace; }
  .editor-wrap textarea {
    display:block; width:100%;
    background:var(--code-bg); color:#dce9ff;
    border:none; font-family:'Consolas','Fira Code',monospace;
    font-size:13px; padding:14px; resize:vertical; min-height:200px; line-height:1.6;
  }
  .editor-wrap textarea:focus { outline:none; }

  /* Preview */
  .preview-wrap { background:var(--panel-2); border:1px solid var(--border); border-radius:10px; overflow:hidden; display:flex; flex-direction:column; }
  .preview-header {
    background:var(--panel); border-bottom:1px solid var(--border);
    padding:6px 12px; font-size:11px; font-weight:700;
    letter-spacing:0.08em; text-transform:uppercase; color:var(--muted);
    display:flex; align-items:center; gap:8px;
  }
  .preview-header::before { content:''; display:inline-block; width:8px; height:8px; border-radius:50%; background:#28c840; box-shadow:0 0 6px #28c840; }
  .preview-body { padding:16px; flex:1; overflow:auto; min-height:200px; color:var(--text); font-size:14px; line-height:1.7; }
  .preview-body h1,.preview-body h2,.preview-body h3 { color:#a6c9ff; margin-top:12px; }
  .preview-body code { background:var(--code-bg); padding:2px 6px; border-radius:4px; font-family:monospace; font-size:12px; }
  .preview-body pre { background:var(--code-bg); padding:12px; border-radius:8px; overflow-x:auto; }
  .preview-body a { color:#7c9fff; }
  .preview-body ul,.preview-body ol { padding-left:20px; }

  /* Console */
  .console-wrap { background:#020617; border:1px solid var(--border); border-radius:10px; overflow:hidden; }
  .console-header {
    background:#0a0f1e; border-bottom:1px solid var(--border);
    padding:6px 12px; font-size:11px; font-weight:700;
    letter-spacing:0.08em; text-transform:uppercase; color:var(--muted);
    display:flex; align-items:center; justify-content:space-between;
  }
  .console-body {
    padding:12px 14px; min-height:140px; max-height:280px;
    overflow-y:auto; font-family:'Consolas','Fira Code',monospace;
    font-size:12px; color:#cfe8ff; white-space:pre-wrap; word-break:break-word; line-height:1.6;
  }
  .console-line.log   { color:#cfe8ff; }
  .console-line.log::before  { content:'> '; color:var(--muted); }
  .console-line.error { color:var(--error); }
  .console-line.error::before { content:'✕ '; }
  .console-line.warn  { color:#fde68a; }
  .console-line.warn::before  { content:'⚠ '; }
  .console-empty { color:var(--muted); font-style:italic; }

  /* Buttons */
  button {
    appearance:none; border:1px solid var(--border);
    background:var(--accent); color:#fff;
    padding:8px 16px; border-radius:8px; cursor:pointer;
    font-size:13px; font-weight:600; transition:all 0.2s; margin-top:0;
  }
  button:hover { background:var(--accent-hover); transform:translateY(-1px); box-shadow:0 4px 12px rgba(124,58,237,0.3); }
  button:active { transform:translateY(0); }
  button:disabled { opacity:0.4; cursor:not-allowed; transform:none; box-shadow:none; }
  button.secondary { background:var(--panel-2); color:var(--text); }
  button.secondary:hover { background:#243050; box-shadow:none; }
  .btn-row { display:flex; gap:8px; flex-wrap:wrap; margin-top:12px; align-items:center; }

  /* Tab nav */
  .tab-nav { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:16px; }
  .tab-nav button {
    background:var(--panel-2); color:var(--muted);
    border:1px solid var(--border); padding:6px 14px;
    font-size:12px; border-radius:20px; font-weight:600;
  }
  .tab-nav button.active { background:var(--accent); color:#fff; border-color:var(--accent); }
  .tab-nav button:hover:not(.active) { background:var(--hover-bg); color:var(--text); transform:none; box-shadow:none; }

  /* Concept boxes */
  .concept-box { border:1px solid var(--border); border-radius:10px; padding:14px 16px; background:var(--panel-2); margin-bottom:10px; }
  .concept-title { font-size:13px; font-weight:700; color:#a6c9ff; margin-bottom:6px; display:flex; align-items:center; gap:8px; }
  .concept-title .tag {
    background:var(--hover-bg); border:1px solid var(--border-accent);
    color:#a78bfa; border-radius:4px; padding:1px 7px;
    font-size:10px; font-weight:700; letter-spacing:0.06em;
  }
  .concept-box p,.concept-box ul { font-size:13px; color:var(--muted); margin:0; line-height:1.65; }
  .concept-box code { background:var(--code-bg); color:#93c5fd; border-radius:4px; padding:1px 6px; font-size:12px; font-family:monospace; }
  .concept-box ul { padding-left:18px; margin-top:6px; }
  .concept-box ul li { margin-bottom:3px; }

  /* Exercise callout */
  .exercise {
    background:var(--hover-bg); border-left:3px solid var(--accent);
    padding:12px 16px; border-radius:0 8px 8px 0;
    margin:10px 0; font-size:14px; color:var(--text); line-height:1.6;
  }
  .exercise strong { color:#a6c9ff; }

  /* Selects */
  select {
    background:var(--panel-2); border:1px solid var(--border);
    border-radius:8px; color:var(--text); padding:7px 10px; font-size:13px; cursor:pointer;
  }
  select:focus { outline:none; box-shadow:0 0 0 2px rgba(124,58,237,0.4); }

  /* Tailwind preview area */
  #twPreviewArea {
    background:var(--panel-2); border:1px solid var(--border); border-radius:10px;
    padding:20px; min-height:100px; display:flex; align-items:center; justify-content:center; margin-top:12px;
  }

  /* Code block (static) */
  .code-block { background:var(--code-bg); border:1px solid var(--border); border-radius:10px; overflow:hidden; }
  .code-block-header {
    background:var(--panel-2); border-bottom:1px solid var(--border);
    padding:6px 14px; font-size:11px; color:var(--muted);
    font-family:monospace; display:flex; justify-content:space-between; align-items:center;
  }
  .code-block pre { margin:0; padding:14px; font-family:'Consolas','Fira Code',monospace; font-size:12px; color:#dce9ff; overflow-x:auto; line-height:1.6; }

  /* Sandbox iframe */
  #sandboxFrame { width:100%; min-height:340px; border:1px solid var(--border); border-radius:0 0 10px 10px; background:white; display:block; }
  .sandbox-preview-header {
    background:var(--panel); border:1px solid var(--border); border-bottom:none;
    border-radius:10px 10px 0 0; padding:8px 14px;
    display:flex; align-items:center; gap:8px;
    font-size:11px; color:var(--muted); font-weight:700; letter-spacing:0.07em; text-transform:uppercase;
  }

  /* Nav */
  .nav-buttons { display:flex; gap:12px; margin-top:28px; justify-content:space-between; align-items:center; }
  #stepIndicator { color:var(--muted); font-size:12px; }

  /* Tooltip */
  .tooltip { font-size:12px; color:var(--muted); margin-top:10px; padding:8px 12px; background:var(--panel-2); border-radius:6px; border-left:2px solid var(--accent); line-height:1.5; }
  .tooltip::before { content:'💡 '; }

  /* Completion checkpoints */
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
      <div class="block-desc"><strong>What this shows:</strong> Markdown is shorthand that converts to HTML. Write on the left, click Convert, see the rendered HTML on the right. This is how Jekyll, GitHub, and Notion work behind the scenes.</div>

      <div class="concept-box" style="margin-bottom:16px;">
        <div class="concept-title">Markdown Cheat Sheet <span class="tag">REFERENCE</span></div>
        <ul>
          <li><code># H1</code> → &lt;h1&gt; &nbsp;·&nbsp; <code>## H2</code> → &lt;h2&gt; &nbsp;·&nbsp; <code>### H3</code> → &lt;h3&gt;</li>
          <li><code>**bold**</code> → <strong>bold</strong> &nbsp;·&nbsp; <code>*italic*</code> → <em>italic</em></li>
          <li><code>- item</code> → unordered list &nbsp;·&nbsp; <code>1. item</code> → ordered list</li>
          <li><code>[text](url)</code> → link &nbsp;·&nbsp; <code>![alt](url)</code> → image</li>
          <li>Backtick <code>`code`</code> → inline code &nbsp;·&nbsp; Triple backtick → code block</li>
          <li><code>&gt; text</code> → blockquote &nbsp;·&nbsp; <code>---</code> → horizontal rule</li>
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

```javascript
// Code blocks work too
const greeting = "Hello World";
console.log(greeting);
```

[Visit MDN Docs](https://developer.mozilla.org)</textarea>
          </div>
          <div class="btn-row">
            <button onclick="convertMarkdown()">Convert to HTML</button>
            <button onclick="resetMarkdown()" class="secondary">Reset</button>
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
      <div class="tooltip">Pro tip: Jekyll and GitHub Pages auto-convert <code>.md</code> files to HTML — you never have to write raw HTML for content.</div>
    </div>
  </div>

  <!-- STEP 2: CSS -->
  <div class="section" id="step2">
    <div class="card">
      <h2>2 — CSS Styling Playground</h2>
      <div class="block-desc"><strong>What this shows:</strong> CSS controls how HTML looks. Edit the rules on the left and click Apply CSS to see them instantly on the right. Try changing colors, padding, border-radius, and hover effects.</div>

      <div class="concept-box" style="margin-bottom:16px;">
        <div class="concept-title">Key CSS Concepts <span class="tag">REFERENCE</span></div>
        <ul>
          <li><strong>Selector</strong> — targets elements: <code>.class</code> <code>#id</code> <code>element</code> <code>element:hover</code></li>
          <li><strong>Box model</strong> — <code>margin</code> (outside) → <code>border</code> → <code>padding</code> (inside) → content</li>
          <li><strong>Flexbox</strong> — <code>display:flex</code> aligns items in a row or column</li>
          <li><strong>Transitions</strong> — <code>transition: all 0.3s ease</code> animates property changes smoothly</li>
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
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  max-width: 280px;
  margin: 0 auto;
}

.box:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 32px rgba(102, 126, 234, 0.4);
}</textarea>
          </div>
          <div class="btn-row">
            <button onclick="applyCss()">Apply CSS</button>
            <button onclick="resetCss()" class="secondary">Reset</button>
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
      <div class="tooltip">Try changing <code>border-radius</code> to <code>50%</code>, or swap <code>linear-gradient</code> for <code>background: #ff6b6b</code> to see instant changes.</div>
    </div>
  </div>

  <!-- STEP 3: Tailwind + Sass -->
  <div class="section" id="step3">
    <div class="card">
      <h2>3 — Tailwind CSS &amp; Sass</h2>
      <div class="block-desc"><strong>What this shows:</strong> Two professional CSS tools. <strong>Tailwind</strong> uses utility classes directly in HTML for fast prototyping. <strong>Sass</strong> adds variables, nesting, and mixins for large-scale projects.</div>

      <div class="concept-box"><div class="concept-title">Tailwind CSS — Live Demo <span class="tag">INTERACTIVE</span></div><p>Adjust the dropdowns and the card updates instantly. Watch the generated class string change.</p></div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:12px 0 20px;">
        <div>
          <span class="field-label">Padding</span>
          <select id="twPadding" onchange="applyTailwind()" style="width:100%;margin-bottom:10px;">
            <option value="p-2">p-2 (small · 8px)</option>
            <option value="p-4" selected>p-4 (medium · 16px)</option>
            <option value="p-6">p-6 (large · 24px)</option>
            <option value="p-8">p-8 (xl · 32px)</option>
          </select>
          <span class="field-label">Color</span>
          <select id="twColor" onchange="applyTailwind()" style="width:100%;margin-bottom:10px;">
            <option value="bg-blue-600 text-white">Blue</option>
            <option value="bg-purple-600 text-white">Purple</option>
            <option value="bg-emerald-600 text-white">Green</option>
            <option value="bg-rose-600 text-white">Red</option>
            <option value="bg-amber-400 text-black">Yellow</option>
            <option value="bg-slate-800 text-white">Dark</option>
          </select>
          <span class="field-label">Border Radius</span>
          <select id="twRadius" onchange="applyTailwind()" style="width:100%;margin-bottom:10px;">
            <option value="rounded-none">rounded-none (square)</option>
            <option value="rounded">rounded (small)</option>
            <option value="rounded-lg" selected>rounded-lg (medium)</option>
            <option value="rounded-2xl">rounded-2xl (large)</option>
            <option value="rounded-full">rounded-full (pill)</option>
          </select>
          <span class="field-label">Shadow</span>
          <select id="twShadow" onchange="applyTailwind()" style="width:100%;margin-bottom:10px;">
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

      <div class="concept-box"><div class="concept-title">Sass vs CSS — Side by Side <span class="tag">REFERENCE</span></div><p>Sass compiles to plain CSS. Here is what it adds:</p></div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px;">
        <div>
          <span class="field-label">Sass (.scss) — what you write</span>
          <div class="code-block">
            <div class="code-block-header"><span>scss</span><span style="color:#a78bfa;">preprocessor</span></div>
            <pre>$primary: #667eea;
$radius: 12px;
$spacing: 1rem;

.card {
  padding: $spacing;
  background: $primary;
  border-radius: $radius;

  &amp;:hover {
    transform: scale(1.05);
    background: darken($primary, 10%);
  }

  &amp;__title {
    font-size: 1.25rem;
    font-weight: bold;
  }
}</pre>
          </div>
        </div>
        <div>
          <span class="field-label">CSS output — what the browser sees</span>
          <div class="code-block">
            <div class="code-block-header"><span>css</span><span style="color:#86efac;">compiled</span></div>
            <pre>.card {
  padding: 1rem;
  background: #667eea;
  border-radius: 12px;
}
.card:hover {
  transform: scale(1.05);
  background: #4a5fd4;
}
.card__title {
  font-size: 1.25rem;
  font-weight: bold;
}</pre>
          </div>
        </div>
      </div>
      <div class="tooltip">Use Tailwind for fast UI prototyping. Use Sass in larger projects where you need reusable variables and organized stylesheets.</div>
    </div>
  </div>

  <!-- STEP 4: JavaScript -->
  <div class="section" id="step4">
    <div class="card">
      <h2>4 — JavaScript Fundamentals</h2>
      <div class="block-desc"><strong>What this shows:</strong> JavaScript makes pages interactive. Pick an example tab, read the concept description, then hit Run Code to see the output in the console below.</div>

      <div class="tab-nav" id="jsTabNav">
        <button class="active" onclick="setJsExample('variables',this)">Variables &amp; Types</button>
        <button onclick="setJsExample('operators',this)">Operators</button>
        <button onclick="setJsExample('functions',this)">Functions</button>
        <button onclick="setJsExample('arrays',this)">Arrays</button>
        <button onclick="setJsExample('dom',this)">DOM</button>
        <button onclick="setJsExample('events',this)">Events</button>
      </div>

      <div class="concept-box" id="jsConcept" style="margin-bottom:14px;">
        <div class="concept-title" id="jsConceptTitle">Variables &amp; Types <span class="tag">BASICS</span></div>
        <p id="jsConceptDesc">JavaScript has three ways to declare variables: <code>let</code> (reassignable), <code>const</code> (fixed), and <code>var</code> (old style, avoid). Every value has a type: string, number, boolean, object, array, or undefined.</p>
      </div>

      <div class="split-view">
        <div>
          <span class="field-label">✏️ JavaScript Editor</span>
          <div class="editor-wrap">
            <div class="editor-header">
              <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
              <span class="lang-tag">javascript</span>
            </div>
            <textarea id="jsInput" rows="14">// Variables & Types
let name = "Alex";
const age = 22;
var score = 95;       // var is old — prefer let/const

console.log("Name:", name);
console.log("Age:", age);
console.log("Score:", score);
console.log("Type of name:", typeof name);
console.log("Type of age:", typeof age);</textarea>
          </div>
          <div class="btn-row">
            <button onclick="runJsCode()">▶ Run Code</button>
            <button onclick="clearJsConsole()" class="secondary">Clear Console</button>
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
      <div class="tooltip">Use <code>console.log()</code> to print any value. You can log strings, numbers, arrays, and objects. Errors appear in red.</div>
    </div>
  </div>

  <!-- STEP 5: Sandbox -->
  <div class="section" id="step5">
    <div class="card">
      <h2>5 — Live Code Sandbox</h2>
      <div class="block-desc"><strong>What this shows:</strong> Write HTML, CSS, and JavaScript together and see the result live in an isolated preview. Pick a starter template or write your own from scratch.</div>

      <div class="tab-nav" id="sandboxTabNav" style="margin-bottom:14px;">
        <button class="active" onclick="setSandboxTemplate('click',this)">Click Counter</button>
        <button onclick="setSandboxTemplate('todo',this)">To-Do List</button>
        <button onclick="setSandboxTemplate('color',this)">Color Picker</button>
        <button onclick="setSandboxTemplate('timer',this)">Countdown Timer</button>
        <button onclick="setSandboxTemplate('blank',this)">Blank</button>
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
          <div class="btn-row">
            <button onclick="runSandbox()">▶ Update Preview</button>
            <button onclick="clearSandbox()" class="secondary">Clear</button>
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
      <div class="tooltip">Tip: The sandbox is isolated — use <code>alert()</code>, <code>addEventListener()</code>, <code>setInterval()</code>, and more. Build a mini project right here!</div>
    </div>
  </div>

  <!-- STEP 6: Reflection -->
  <div class="section" id="step6">
    <div class="card">
      <h2>6 — Reflection &amp; What's Next</h2>
      <div class="block-desc"><strong>You covered the full frontend stack.</strong> Here is a summary of each piece and where to go next.</div>

      <div class="checkpoint-grid">
        <div class="checkpoint">
          <div class="checkpoint-title">📝 Markdown &amp; HTML</div>
          <p>Markdown is shorthand for HTML. Tools like Jekyll convert <code>.md</code> to <code>.html</code> automatically. HTML is what browsers render.</p>
        </div>
        <div class="checkpoint">
          <div class="checkpoint-title">🎨 CSS</div>
          <p>CSS controls layout, colors, spacing, and animation. Master selectors, the box model, flexbox, and grid — these cover 90% of all layouts.</p>
        </div>
        <div class="checkpoint">
          <div class="checkpoint-title">⚡ Tailwind CSS</div>
          <p>Utility-first classes like <code>p-4 rounded-lg bg-blue-600</code> let you build UI without CSS files. Great for fast prototyping.</p>
        </div>
        <div class="checkpoint">
          <div class="checkpoint-title">🔧 Sass</div>
          <p>Sass adds variables, nesting, and mixins to CSS. Use it in larger projects where you need reusable design tokens.</p>
        </div>
        <div class="checkpoint">
          <div class="checkpoint-title">📦 JavaScript</div>
          <p>JS makes pages interactive. The beginner stack: variables → functions → arrays → DOM → event listeners.</p>
        </div>
        <div class="checkpoint">
          <div class="checkpoint-title">🚀 Next Steps</div>
          <p>Build a calculator in the sandbox. Then explore React, APIs (fetch), and GitHub Pages to deploy your work live.</p>
        </div>
      </div>

      <div class="exercise" style="margin-top:20px;">
        <strong>🎯 Challenge:</strong> Go back to the sandbox and build a simple calculator. Use <code>&lt;button&gt;</code> elements for digits, a <code>&lt;div&gt;</code> as the display, and JavaScript to handle clicks and compute results. Bonus: add keyboard support with <code>document.addEventListener('keydown', ...)</code>.
      </div>
    </div>
  </div>

  <!-- Navigation -->
  <div class="nav-buttons">
    <button id="prevBtn" onclick="prevStep()" class="secondary" disabled>← Previous</button>
    <span id="stepIndicator">Step 1 / 6</span>
    <button id="nextBtn" onclick="nextStep()">Next →</button>
  </div>
</div>

<script>
const STEPS = ['step1','step2','step3','step4','step5','step6'];
const STORAGE_KEY = 'frontend_combined_v2';

const JS_EXAMPLES = {
  variables: {
    title: 'Variables &amp; Types', tag: 'BASICS',
    desc: 'JavaScript has three ways to declare variables: <code>let</code> (reassignable), <code>const</code> (fixed), and <code>var</code> (old — avoid). Every value has a type: string, number, boolean, object, array, or undefined.',
    code: `// Variables & Types
let name = "Alex";
const age = 22;
var score = 95;       // var is old — prefer let/const

console.log("Name:", name);
console.log("Age:", age);
console.log("Score:", score);
console.log("Type of name:", typeof name);
console.log("Type of age:", typeof age);
console.log("Is age a number?", typeof age === "number");`
  },
  operators: {
    title: 'Operators', tag: 'MATH & LOGIC',
    desc: 'JavaScript supports arithmetic (+, -, *, /, %), comparison (===, !==, &gt;, &lt;), and logical operators (&amp;&amp;, ||, !). Always use === (strict equality) instead of ==.',
    code: `// Operators
let x = 10, y = 3;

// Arithmetic
console.log("Add:", x + y);
console.log("Subtract:", x - y);
console.log("Multiply:", x * y);
console.log("Divide:", x / y);
console.log("Modulus (remainder):", x % y);
console.log("Power:", x ** 2);

// Comparison
console.log("x > y:", x > y);
console.log("x === 10:", x === 10);
console.log("x !== y:", x !== y);

// Logical
console.log("Both positive:", x > 0 && y > 0);
console.log("Either > 5:", x > 5 || y > 5);`
  },
  functions: {
    title: 'Functions', tag: 'CORE CONCEPT',
    desc: 'Functions are reusable blocks of code. Write them as declarations (<code>function name(){}</code>), expressions (<code>const fn = function(){}</code>), or arrow functions (<code>const fn = () => {}</code>). Arrow functions are the modern standard.',
    code: `// Functions — 3 ways to write them
function greet(name) {
  return "Hello, " + name + "!";
}

const multiply = function(a, b) {
  return a * b;
};

const add = (a, b) => a + b;

// Higher-order function (takes a function as argument)
function applyTwice(fn, value) {
  return fn(fn(value));
}

const double = x => x * 2;

console.log(greet("Frontend Student"));
console.log("3 × 4 =", multiply(3, 4));
console.log("5 + 7 =", add(5, 7));
console.log("double(3) applied twice:", applyTwice(double, 3));`
  },
  arrays: {
    title: 'Arrays', tag: 'DATA STRUCTURES',
    desc: 'Arrays store ordered lists. The most important methods are <code>.map()</code> (transform all items), <code>.filter()</code> (keep items that pass a test), and <code>.reduce()</code> (combine into one value). Used constantly in real projects.',
    code: `// Arrays & Array Methods
const scores = [88, 92, 75, 100, 63, 85];

// Basic access
console.log("First:", scores[0]);
console.log("Length:", scores.length);

// map — transform every element
const doubled = scores.map(s => s * 2);
console.log("Doubled:", JSON.stringify(doubled));

// filter — keep elements that pass the test
const passing = scores.filter(s => s >= 80);
console.log("Passing (>=80):", JSON.stringify(passing));

// reduce — combine into one value
const total = scores.reduce((sum, s) => sum + s, 0);
console.log("Average:", (total / scores.length).toFixed(1));

// Other useful methods
console.log("Has 100?", scores.includes(100));
console.log("First > 90:", scores.find(s => s > 90));`
  },
  dom: {
    title: 'DOM Manipulation', tag: 'BROWSER API',
    desc: 'The DOM is the browser\'s representation of your HTML. JavaScript can read and modify it with <code>getElementById()</code>, <code>querySelector()</code>, and properties like <code>.textContent</code>, <code>.style</code>, and <code>.classList</code>.',
    code: `// DOM Manipulation (logged as HTML strings here)
// In a real page these would update visible elements

const div = document.createElement('div');
div.id = "myBox";
div.className = "card highlight";
div.textContent = "Dynamic content!";
div.style.color = "blue";
div.style.padding = "12px";

console.log("outerHTML:", div.outerHTML);
console.log("textContent:", div.textContent);
console.log("className:", div.className);

// classList methods
div.classList.add("active");
div.classList.remove("highlight");
console.log("After classList changes:", div.className);

// Attributes
div.setAttribute("data-id", "42");
console.log("data-id:", div.getAttribute("data-id"));`
  },
  events: {
    title: 'Event Listeners', tag: 'INTERACTIVITY',
    desc: 'Events let JavaScript respond to user actions: clicks, key presses, input changes, and more. Use <code>addEventListener(event, callback)</code>. The <code>event</code> object passed to your callback has details about what happened.',
    code: `// Event Listeners (simulated — real events need a live page)

function handleClick(event) {
  console.log("Button clicked!");
  console.log("Event type:", event.type);
  console.log("Target id:", event.target.id);
}

function handleInput(event) {
  console.log("Input changed to:", event.target.value);
}

// In a real HTML page you'd write:
// document.getElementById('btn').addEventListener('click', handleClick);
// document.getElementById('input').addEventListener('input', handleInput);

// Simulate calling them with fake events
handleClick({ type: "click", target: { id: "submitBtn" } });
handleInput({ type: "input", target: { value: "Hello World!" } });

// Common events to know:
const commonEvents = [
  "click", "dblclick", "keydown", "keyup",
  "input", "change", "submit", "mouseover", "scroll", "load"
];
console.log("Common events:", commonEvents.join(", "));`
  }
};

const SANDBOX_TEMPLATES = {
  click: `<style>
body{font-family:system-ui;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;background:#0f172a;}
.card{text-align:center;background:#1e293b;padding:40px;border-radius:16px;color:white;min-width:220px;}
h2{margin:0 0 8px;font-size:22px;}
.count{font-size:64px;font-weight:800;color:#818cf8;line-height:1;margin:16px 0;}
button{background:#6366f1;color:white;border:none;padding:12px 28px;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer;margin:4px;}
button:hover{background:#4f46e5;}
#resetBtn{background:#374151;}
</style>
<div class="card">
  <h2>Click Counter</h2>
  <div class="count" id="count">0</div>
  <div>
    <button id="btn">Click me</button>
    <button id="resetBtn">Reset</button>
  </div>
</div>
<script>
let count=0;
document.getElementById('btn').addEventListener('click',()=>{count++;document.getElementById('count').textContent=count;});
document.getElementById('resetBtn').addEventListener('click',()=>{count=0;document.getElementById('count').textContent=0;});
<\/script>`,

  todo: `<style>
body{font-family:system-ui;max-width:400px;margin:24px auto;padding:0 16px;background:#f8fafc;}
h2{color:#1e293b;}
.row{display:flex;gap:8px;margin-bottom:16px;}
input{flex:1;padding:10px 12px;border:2px solid #e2e8f0;border-radius:8px;font-size:15px;}
input:focus{outline:none;border-color:#6366f1;}
button{background:#6366f1;color:white;border:none;padding:10px 16px;border-radius:8px;cursor:pointer;font-weight:600;}
button:hover{background:#4f46e5;}
ul{list-style:none;padding:0;margin:0;}
li{display:flex;align-items:center;gap:10px;padding:10px 12px;background:white;border-radius:8px;margin-bottom:8px;box-shadow:0 1px 3px rgba(0,0,0,0.08);}
li.done span{text-decoration:line-through;color:#94a3b8;}
li button{background:#ef4444;padding:4px 10px;font-size:12px;border-radius:6px;}
input[type=checkbox]{width:18px;height:18px;cursor:pointer;}
.empty{color:#94a3b8;text-align:center;padding:20px 0;}
</style>
<h2>📋 To-Do List</h2>
<div class="row"><input id="inp" placeholder="Add a task..." /><button onclick="add()">Add</button></div>
<ul id="list"></ul>
<p class="empty" id="empty">No tasks yet!</p>
<script>
let tasks=[];
function render(){
  document.getElementById('list').innerHTML=tasks.map((t,i)=>
    '<li class="'+(t.done?'done':'')+'"><input type="checkbox" '+(t.done?'checked':'')+' onchange="toggle('+i+')"><span style="flex:1">'+t.text+'</span><button onclick="remove('+i+')">✕</button></li>'
  ).join('');
  document.getElementById('empty').style.display=tasks.length?'none':'block';
}
function add(){const inp=document.getElementById('inp');const t=inp.value.trim();if(!t)return;tasks.push({text:t,done:false});inp.value='';render();}
function toggle(i){tasks[i].done=!tasks[i].done;render();}
function remove(i){tasks.splice(i,1);render();}
document.getElementById('inp').addEventListener('keydown',e=>{if(e.key==='Enter')add();});
render();
<\/script>`,

  color: `<style>
body{font-family:system-ui;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;background:#111827;}
.card{background:#1f2937;border-radius:16px;padding:32px;color:white;min-width:280px;text-align:center;}
h2{margin:0 0 20px;}
.swatch{width:100%;height:120px;border-radius:12px;margin-bottom:16px;transition:background 0.3s;}
input[type=color]{width:60px;height:60px;border:none;border-radius:50%;cursor:pointer;padding:0;}
.hex{font-family:monospace;font-size:20px;margin:12px 0;letter-spacing:2px;}
</style>
<div class="card">
  <h2>🎨 Color Picker</h2>
  <div class="swatch" id="swatch"></div>
  <input type="color" id="picker" value="#6366f1">
  <div class="hex" id="hex">#6366F1</div>
</div>
<script>
const picker=document.getElementById('picker');
const swatch=document.getElementById('swatch');
const hex=document.getElementById('hex');
function update(){swatch.style.background=picker.value;hex.textContent=picker.value.toUpperCase();}
picker.addEventListener('input',update);
update();
<\/script>`,

  timer: `<style>
body{font-family:system-ui;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;background:#0f172a;}
.card{text-align:center;background:#1e293b;padding:40px 50px;border-radius:20px;color:white;}
h2{margin:0 0 20px;color:#94a3b8;font-size:16px;letter-spacing:2px;text-transform:uppercase;}
.time{font-size:72px;font-weight:800;color:#f1f5f9;font-family:monospace;letter-spacing:4px;margin:0 0 24px;}
.time.danger{color:#ef4444;}
input{width:80px;padding:10px;border:2px solid #334155;border-radius:8px;background:#0f172a;color:white;font-size:18px;text-align:center;margin-bottom:16px;}
.btns{display:flex;gap:10px;justify-content:center;}
button{padding:10px 22px;border-radius:8px;border:none;font-size:15px;font-weight:700;cursor:pointer;}
#startBtn{background:#22c55e;color:white;}
#resetBtn{background:#64748b;color:white;}
</style>
<div class="card">
  <h2>Countdown Timer</h2>
  <input type="number" id="secs" value="10" min="1" max="999"/>
  <div class="time" id="display">10</div>
  <div class="btns">
    <button id="startBtn">Start</button>
    <button id="resetBtn">Reset</button>
  </div>
</div>
<script>
let timer=null,remaining=10;
const display=document.getElementById('display');
const input=document.getElementById('secs');
function update(){display.textContent=remaining;display.className='time'+(remaining<=3?' danger':'');}
document.getElementById('startBtn').addEventListener('click',()=>{
  if(timer){clearInterval(timer);timer=null;document.getElementById('startBtn').textContent='Start';return;}
  remaining=parseInt(input.value)||10;update();
  document.getElementById('startBtn').textContent='Pause';
  timer=setInterval(()=>{remaining--;update();if(remaining<=0){clearInterval(timer);timer=null;document.getElementById('startBtn').textContent='Start';}},1000);
});
document.getElementById('resetBtn').addEventListener('click',()=>{clearInterval(timer);timer=null;remaining=parseInt(input.value)||10;update();document.getElementById('startBtn').textContent='Start';});
input.addEventListener('change',()=>{remaining=parseInt(input.value)||10;update();});
<\/script>`,

  blank: `<style>body{font-family:system-ui;padding:20px;background:#f8fafc;color:#1e293b;}</style>
<h2>Your Sandbox</h2>
<p>Start writing HTML, CSS, and JS here!</p>`
};

// State
let currentStep = 0;
const $ = id => document.getElementById(id);

// Navigation
function showStep(n) {
  currentStep = Math.max(0, Math.min(STEPS.length - 1, n));
  STEPS.forEach((s,i) => $(s).classList.toggle('active', i === currentStep));
  $('progressBar').innerHTML = STEPS.map((_,i) =>
    '<div class="step '+(i<=currentStep?'active':'')+'" onclick="showStep('+i+')" title="Step '+(i+1)+'"></div>'
  ).join('');
  $('stepIndicator').textContent = 'Step '+(currentStep+1)+' / '+STEPS.length;
  $('prevBtn').disabled = currentStep === 0;
  $('nextBtn').disabled = currentStep === STEPS.length - 1;
  persist();
}
function prevStep() { showStep(currentStep-1); }
function nextStep() { showStep(currentStep+1); }

// Step 1 — Markdown
const DEFAULT_MARKDOWN = `## Hello Frontend!\n\nWrite your **Markdown** here and hit Convert.\n\n### Why Markdown?\n- HTML structures pages\n- CSS styles them\n- JavaScript makes them *interactive*\n\n> Markdown is faster to write than raw HTML.\n\n[Visit MDN Docs](https://developer.mozilla.org)`;

function convertMarkdown() {
  if (typeof marked === 'undefined') {
    $('htmlPreview').innerHTML = '<p style="color:var(--error);">Marked.js loading... please try again in a moment.</p>';
    return;
  }
  $('htmlPreview').innerHTML = marked.parse($('mdInput').value);
  persist();
}
function resetMarkdown() { $('mdInput').value = DEFAULT_MARKDOWN; convertMarkdown(); }

// Step 2 — CSS
const DEFAULT_CSS = `.box {
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
}`;

function applyCss() {
  const css = $('cssInput').value;
  $('dynamicStyle').textContent = css.replace(/\.box/g, '#cssPreviewBody .box');
  persist();
}
function resetCss() { $('cssInput').value = DEFAULT_CSS; applyCss(); }

// Step 3 — Tailwind
const TW_COLOR_MAP = {
  'bg-blue-600 text-white': '#2563eb',
  'bg-purple-600 text-white': '#9333ea',
  'bg-emerald-600 text-white': '#059669',
  'bg-rose-600 text-white': '#e11d48',
  'bg-amber-400 text-black': '#f59e0b',
  'bg-slate-800 text-white': '#1e293b'
};
const TW_RADIUS_MAP = {
  'rounded-none':'0','rounded':'4px','rounded-lg':'8px','rounded-2xl':'16px','rounded-full':'9999px'
};
const TW_PADDING_MAP = {
  'p-2':'8px','p-4':'16px','p-6':'24px','p-8':'32px'
};
const TW_SHADOW_MAP = {
  '':'none',
  'shadow-sm':'0 1px 2px rgba(0,0,0,0.2)',
  'shadow-md':'0 4px 6px rgba(0,0,0,0.3)',
  'shadow-xl':'0 20px 25px rgba(0,0,0,0.4)',
  'shadow-2xl':'0 25px 50px rgba(0,0,0,0.5)'
};

function applyTailwind() {
  const padding = $('twPadding').value;
  const color   = $('twColor').value;
  const radius  = $('twRadius').value;
  const shadow  = $('twShadow').value;

  const preview = $('twPreview');
  const colorParts = color.split(' ');
  const bgColor = TW_COLOR_MAP[color] || '#2563eb';
  const textColor = colorParts.includes('text-white') ? 'white' : 'black';

  preview.style.padding       = TW_PADDING_MAP[padding] || '16px';
  preview.style.background    = bgColor;
  preview.style.color         = textColor;
  preview.style.borderRadius  = TW_RADIUS_MAP[radius] || '8px';
  preview.style.boxShadow     = TW_SHADOW_MAP[shadow] || 'none';

  const classes = [padding, color, radius, shadow].filter(Boolean).join(' ');
  $('twClassDisplay').textContent = '<div class="'+classes+'">\n  Tailwind Card\n</div>';
}

// Step 4 — JavaScript
function setJsExample(type, btn) {
  const ex = JS_EXAMPLES[type];
  if (!ex) return;
  $('jsInput').value = ex.code;
  $('jsConceptTitle').innerHTML = ex.title + ' <span class="tag">'+ex.tag+'</span>';
  $('jsConceptDesc').innerHTML = ex.desc;
  clearJsConsole();
  if (btn) {
    document.querySelectorAll('#jsTabNav button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
}

function clearJsConsole() {
  $('jsConsole').innerHTML = '<span class="console-empty">Run your code to see output here…</span>';
  $('consoleStatus').textContent = 'Ready';
}

function formatArg(a) {
  if (a === null) return 'null';
  if (a === undefined) return 'undefined';
  if (typeof a === 'object') { try { return JSON.stringify(a); } catch(e) { return String(a); } }
  return String(a);
}

function runJsCode() {
  const out = $('jsConsole');
  out.innerHTML = '';
  $('consoleStatus').textContent = 'Running…';
  const code = $('jsInput').value;
  const lines = [];
  const origLog = console.log, origWarn = console.warn, origError = console.error;
  console.log   = (...a) => { lines.push({type:'log',   msg:a.map(formatArg).join(' ')}); origLog.apply(console,a); };
  console.warn  = (...a) => { lines.push({type:'warn',  msg:a.map(formatArg).join(' ')}); origWarn.apply(console,a); };
  console.error = (...a) => { lines.push({type:'error', msg:a.map(formatArg).join(' ')}); origError.apply(console,a); };
  try {
    new Function(code)();
    $('consoleStatus').textContent = 'Done — '+lines.length+' line(s)';
  } catch(err) {
    lines.push({type:'error', msg: err.message});
    $('consoleStatus').textContent = 'Error';
  }
  console.log = origLog; console.warn = origWarn; console.error = origError;
  if (!lines.length) { out.innerHTML = '<span class="console-empty">No output — add a console.log() call.</span>'; return; }
  lines.forEach(({type,msg}) => {
    const el = document.createElement('div');
    el.className = 'console-line '+type;
    el.textContent = msg;
    out.appendChild(el);
  });
  persist();
}

// Step 5 — Sandbox
function setSandboxTemplate(name, btn) {
  const tmpl = SANDBOX_TEMPLATES[name];
  if (!tmpl) return;
  $('sandboxCode').value = tmpl;
  if (btn) {
    document.querySelectorAll('#sandboxTabNav button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  runSandbox();
}

function runSandbox() {
  const code = $('sandboxCode').value;
  $('sandboxFrame').srcdoc = '<!DOCTYPE html><html><head><meta charset="utf-8"><style>*{box-sizing:border-box;}body{margin:0;font-family:system-ui;}</style></head><body>'+code+'</body></html>';
  persist();
}

function clearSandbox() {
  $('sandboxCode').value = '';
  $('sandboxFrame').srcdoc = '<body style="display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#f8fafc;color:#94a3b8;font-family:system-ui;font-size:14px;">Sandbox cleared. Write some code and click Update Preview.</body>';
}

// Persistence
function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      step: currentStep,
      md: $('mdInput').value,
      css: $('cssInput').value,
      js: $('jsInput').value,
      sandbox: $('sandboxCode').value,
      twPadding: $('twPadding').value,
      twColor: $('twColor').value,
      twRadius: $('twRadius').value,
      twShadow: $('twShadow').value
    }));
  } catch(e) {}
}

function restore() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!data) return;
    if (data.md)        $('mdInput').value     = data.md;
    if (data.css)       $('cssInput').value    = data.css;
    if (data.js)        $('jsInput').value     = data.js;
    if (data.sandbox)   $('sandboxCode').value = data.sandbox;
    if (data.twPadding) $('twPadding').value   = data.twPadding;
    if (data.twColor)   $('twColor').value     = data.twColor;
    if (data.twRadius)  $('twRadius').value    = data.twRadius;
    if (data.twShadow)  $('twShadow').value    = data.twShadow;
    showStep(data.step || 0);
  } catch(e) { showStep(0); }
}

// Boot
document.addEventListener('DOMContentLoaded', () => {
  restore();
  applyCss();
  applyTailwind();
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || !saved.sandbox) setSandboxTemplate('click', null);
    else runSandbox();
  } catch(e) { setSandboxTemplate('click', null); }
  if (typeof marked !== 'undefined') {
    convertMarkdown();
  } else {
    const check = setInterval(() => { if (typeof marked !== 'undefined') { convertMarkdown(); clearInterval(check); } }, 100);
  }
});
</script>

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