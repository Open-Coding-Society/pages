---
layout: cs-portfolio-lesson
title: "Component Integration"
description: "Submodule 6 of Frontend Development Mini-Quest"
permalink: /cs-portfolio-quest/frontend/submodule_6/
parent: "Frontend Development"
team: "Creators"
submodule: 6
categories: [CSP, Submodule, Frontend]
tags: [components, integration, frontend]
author: "Creators Team"
date: 2025-10-21
---

<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Interactive JavaScript Lesson — Live Editor & Interpreter</title>
  <style>
    :root{--bg:#0f1724;--panel:#0b1220;--muted:#9aa6bf;--accent:#7c3aed;--glass:rgba(255,255,255,0.03)}
    html,body{height:100%;margin:0;font-family:Inter,ui-sans-serif,system-ui,Segoe UI,Roboto,'Helvetica Neue',Arial}
    body{background:linear-gradient(180deg,#071029 0%, #071b2b 100%);color:#e6eef8}
    .app{display:grid;grid-template-columns:420px 1fr;gap:18px;height:100vh;padding:18px}
    .card{background:var(--panel);border-radius:12px;padding:16px;box-shadow:0 6px 24px rgba(2,6,23,0.6)}
    header .title{font-size:16px;font-weight:700;color:#fff;margin-bottom:6px}
    header .subtitle{font-size:13px;color:var(--muted)}
    /* left column */
    .lesson{display:flex;flex-direction:column;gap:12px}
    .lesson .section{background:var(--glass);padding:10px;border-radius:10px}
    .lesson h3{margin:0 0 6px 0;font-size:14px}
    .lesson p{margin:0;color:var(--muted);font-size:13px;line-height:1.45}
    .exercises{display:flex;flex-direction:column;gap:8px;margin-top:6px}
    .exercise{background:rgba(124,58,237,0.06);padding:8px;border-radius:8px;border:1px solid rgba(124,58,237,0.12);font-size:13px}
    .btn{display:inline-block;padding:8px 10px;border-radius:8px;background:var(--accent);color:white;border:none;cursor:pointer}
    /* right column - editor + output */
    .editorWrap{display:flex;flex-direction:column;height:100%}
    .toolbar{display:flex;gap:10px;align-items:center;margin-bottom:10px}
    .editor{flex:1;display:grid;grid-template-rows:1fr 180px;gap:12px}
    textarea#code{width:100%;height:100%;resize:none;padding:12px;border-radius:10px;border:1px solid rgba(255,255,255,0.04);background:#051226;color:#dce9ff;font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', monospace;font-size:13px;line-height:1.45}
    .output{background:#020617;border-radius:10px;padding:12px;border:1px solid rgba(255,255,255,0.03);overflow:auto}
    .console{height:100%;white-space:pre-wrap;font-family:ui-monospace,monospace;color:#cfe8ff}
    .row{display:flex;gap:8px}
    .small{font-size:12px;color:var(--muted)}
    footer{font-size:12px;color:var(--muted);padding-top:6px}
    /* responsive */
    @media (max-width:980px){.app{grid-template-columns:1fr;grid-auto-rows:auto;padding:12px;height:auto}.editor{grid-template-rows:1fr 220px}}
  </style>
</head>
<body>
  <div class="app">
    <div class="card lesson">
      <div>
        <div class="title">Interactive JavaScript Lesson</div>
        <div class="subtitle">Learn core concepts and run code instantly in the built-in interpreter.</div>
      </div>
      <div class="section">
        <h3>1 — Variables & Types</h3>
        <p>JavaScript has a few key ways to hold values: <code>let</code>, <code>const</code>, and <code>var</code>. Use <code>let</code> for mutable values and <code>const</code> for constants.</p>
      </div>
      <div class="section">
        <h3>2 — Functions</h3>
        <p>Functions group behaviour. Arrow functions (<code>() =&gt; {}</code>) are concise but have lexical <code>this</code>. Regular functions get their own <code>this</code> when called as methods.</p>
      </div>
      <div class="section">
        <h3>3 — DOM Basics</h3>
        <p>Use <code>document.querySelector</code> or <code>getElementById</code> to find elements. Change text with <code>el.textContent</code> and listen using <code>addEventListener</code>.</p>
      </div>
      <div class="section">
        <h3>4 — Console & Debugging</h3>
        <p><code>console.log()</code> prints values — you'll see output in the console pane. Throwing errors helps you locate bugs: use try/catch to handle runtime exceptions.</p>
      </div>
      <div class="section">
        <h3>Exercises</h3>
        <div class="exercises">
          <div class="exercise">1) Write a function <code>sum(a,b)</code> that returns the sum. Log <code>sum(2,3)</code>.</div>
          <div class="exercise">2) Create a DOM button that increments a counter on-screen.</div>
          <div class="exercise">3) Given an array, map it to doubled values and log results.</div>
        </div>
      </div>
      <footer>Tip: edit the code on the right and press <strong>Run</strong> to execute.</footer>
    </div>
    <div class="card editorWrap">
      <div class="toolbar">
        <button id="run" class="btn">Run</button>
        <button id="reset" class="btn" style="background:#475569">Reset</button>
        <div class="small">Language: JavaScript (ES2020)</div>
        <div style="margin-left:auto" class="small">Sandbox: iframe</div>
      </div>
      <div class="editor">
        <textarea id="code">
            // Start here: try the exercises from the lesson
            // 1) sum example
            function sum(a, b) {
            return a + b;
            }
            console.log('sum(2,3)=', sum(2,3));
            // 2) DOM button example (runs in the iframe):
            const btn = document.createElement('button');
            btn.textContent = 'Click me';
            btn.id = 'demo-btn';
            btn.style.padding = '8px 12px';
            document.body.appendChild(btn);
            let count = 0;
            btn.addEventListener('click', () => {
            count++;
            console.log('button clicked', count);
            const el = document.getElementById('count');
            if (el) el.textContent = 'Count: ' + count;
            });
            // show a small element for the demo
            const p = document.createElement('div');
            p.id = 'count';
            p.style.marginTop = '12px';
            p.textContent = 'Count: 0';
            document.body.appendChild(p);
            // 3) array map example
            const arr = [1,2,3,4];
            console.log('doubled', arr.map(n => n*2));
            // throw an example error to see error handling
            // throw new Error('example error');
        </textarea>
        <div class="output">
          <div style="display:flex;align-items:center;justify-content:space-between">
            <div style="font-weight:600">Console</div>
            <div style="font-size:12px;color:var(--muted)">Output from the iframe</div>
          </div>
          <div id="console" class="console"></div>
        </div>
      </div>
      <div style="margin-top:12px;display:flex;gap:10px;align-items:center;justify-content:space-between">
        <div class="small">Editor: Plain textarea. Paste code and Run. The iframe sandbox prevents access to parent.</div>
        <div style="display:flex;gap:8px">
          <button id="example1" class="btn" style="background:#0ea5a4">Example: sum()</button>
          <button id="example2" class="btn" style="background:#ef4444">Error demo</button>
        </div>
      </div>
    </div>
  </div>

<script>
(function(){
  // Helper: write to console pane
  const consoleEl = document.getElementById('console');
  function append(msg, kind){
    const line = document.createElement('div');
    line.textContent = msg;
    if(kind === 'err') line.style.color = '#ffb3b3';
    consoleEl.appendChild(line);
    consoleEl.scrollTop = consoleEl.scrollHeight;
  }

  // Create sandbox iframe
  let iframe = null;
  function makeIframe(){
    if(iframe){ iframe.remove(); }
    iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '240px';
    iframe.style.border = '1px solid rgba(255,255,255,0.04)';
    iframe.sandbox = 'allow-scripts';
    document.body.appendChild(iframe);

    // Build a small HTML that routes console to parent
    const src = `<!doctype html><html><head><meta charset="utf-8"></head><body>
    <script>
      // pipe console.log to parent
      (function(){
        function send(type, args){
          try{ parent.postMessage({type:'console', level:type, args: Array.from(args).map(a=>{
            try{return typeof a === 'object' ? JSON.stringify(a) : String(a);
            }catch(e){return String(a)}
          })}, '*'); }catch(e){}
        }
        const origLog = console.log, origErr = console.error, origWarn = console.warn;
        console.log = function(){ send('log', arguments); origLog.apply(console, arguments); }
        console.error = function(){ send('error', arguments); origErr.apply(console, arguments); }
        console.warn = function(){ send('warn', arguments); origWarn.apply(console, arguments); }
        window.onerror = function(msg, src, line, col, err){
          send('error', [msg + ' (line:'+line+':'+col+')']);
        }
      })();
    <\/script>
    </body></html>`;

    iframe.srcdoc = src;
  }

  makeIframe();

  // Listen for messages from iframe
  window.addEventListener('message', (ev) => {
    try{
      const d = ev.data;
      if(d && d.type === 'console'){
        const text = d.args.join(' ');
        if(d.level === 'error') append(text, 'err');
        else append(text, 'log');
      }
    }catch(e){/* ignore */}
  });

  // Run code: write user code into iframe and execute
  function runCode(code){
    consoleEl.innerHTML = '';
    makeIframe();
    // Inject user code into the iframe's srcdoc after the console capture script
    const userScript = `<script>try{\n${code}\n}catch(e){console.error(e.stack||e.message||String(e))}\n<\/script>`;
    iframe.srcdoc = iframe.srcdoc.replace('</body></html>', userScript + '</body></html>');
  }

  const runBtn = document.getElementById('run');
  const resetBtn = document.getElementById('reset');
  const codeArea = document.getElementById('code');
  const ex1 = document.getElementById('example1');
  const ex2 = document.getElementById('example2');

  runBtn.addEventListener('click', ()=> runCode(codeArea.value));
  resetBtn.addEventListener('click', ()=>{ codeArea.value = "// Fresh code - try the exercises!\n"; consoleEl.innerHTML = ''; makeIframe(); });

  ex1.addEventListener('click', ()=>{
    codeArea.value = `function sum(a,b){ return a+b; }\nconsole.log('sum(10,7)=', sum(10,7));`;
  });

  ex2.addEventListener('click', ()=>{
    codeArea.value = `console.log('this will throw');\nthrow new Error('demo failure');`;
  });

  // auto-run initial content
  runCode(codeArea.value);
})();
</script>
</body>
</html>
