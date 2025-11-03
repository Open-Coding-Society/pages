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


<style>
  :root{
    --panel:#0b1220;
    --glass:rgba(255,255,255,0.04);
    --border:rgba(255,255,255,0.08);
    --text:#e6eef8;
    --muted:#9aa6bf;
    --accent:#7c3aed;
    --danger:#ef4444;
    --ok:#0ea5a4;
  }

  /* Page (no extra html/head wrappers) */
  html, body { margin:0; padding:0; }
  body{
    background:linear-gradient(180deg,var(--bg1) 0%, var(--bg2) 100%);
    color:var(--text);
    font-family:Inter, ui-sans-serif, system-ui, Segoe UI, Roboto, Arial, "Helvetica Neue";
    line-height:1.5;
  }

  /* Strictly vertical stack */
  .container{ max-width:980px; margin:0 auto; padding:24px 16px 40px; display:flex; flex-direction:column; gap:18px; }

  /* Cards and common UI */
  .card{ background:var(--panel); border:1px solid var(--border); border-radius:12px; padding:16px; box-shadow:0 6px 24px rgba(2,6,23,.6); }
  .muted{ color:var(--muted); font-size:13px; }
  .page-title{ font-size:28px; font-weight:800; margin:0 0 4px 0; }
  .page-subtitle{ color:var(--muted); font-size:14px; margin:0; }

  /* Lesson sections */
  .lesson{ display:flex; flex-direction:column; gap:12px; }
  .lesson .section{ background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:10px; padding:12px; }
  .lesson h3{ margin:0 0 6px 0; font-size:16px; }
  .lesson p, .exercise{ margin:0; font-size:14px; }
  .exercises{ display:flex; flex-direction:column; gap:8px; margin-top:6px; }
  .exercise{ background:rgba(124,58,237,0.08); border:1px solid rgba(124,58,237,0.18); border-radius:8px; padding:10px; }

  /* Controls */
  .toolbar{ display:flex; gap:10px; align-items:center; margin-bottom:10px; flex-wrap:wrap; }
  .btn{
    appearance:none; border:1px solid var(--border); background:var(--accent);
    color:#fff; padding:8px 12px; border-radius:10px; cursor:pointer; font-size:14px;
  }
  .btn.secondary{ background:#334155; }

  /* Editor + output (stacked vertically) */
  .editor{ display:flex; flex-direction:column; gap:12px; }
  textarea#code{
    width:100%; min-height:280px; resize:vertical;
    padding:12px; border-radius:10px; border:1px solid var(--glass);
    background:#051226; color:#dce9ff;
    font-family:ui-monospace, SFMono-Regular, Menlo, Consolas, "Roboto Mono", monospace; font-size:13px;
  }
  .output{ background:#020617; border-radius:10px; padding:12px; border:1px solid var(--glass); }
  .output-header{ display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; }
  .console{ min-height:170px; max-height:380px; overflow:auto; white-space:pre-wrap; font-family:ui-monospace,monospace; color:#cfe8ff; }

  /* Nav button */
  .nav-link-btn{
    display:inline-block; background:#1e3a8a; color:#fff; text-decoration:none;
    padding:10px 20px; border-radius:10px; border:1px solid rgba(255,255,255,0.12);
  }
  .nav-link-btn:hover{ background:#1d4ed8; }
</style>

<div class="container">
  <!-- Header -->
  <section class="card">
    <div class="page-title">Component Integration</div>
    <p class="page-subtitle">Submodule 6 of Frontend Development Mini-Quest • Interactive JavaScript Lesson</p>
  </section>

  <!-- Lesson (content unchanged; layout vertical) -->
  <section class="card lesson">
    <div>
      <div style="font-weight:700; margin-bottom:4px;">Interactive JavaScript Lesson</div>
      <div class="muted">Learn core concepts and run code instantly in the built-in interpreter.</div>
    </div>

    <div class="section">
      <h3>1 — Variables &amp; Types</h3>
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
      <h3>4 — Console &amp; Debugging</h3>
      <p><code>console.log()</code> prints values — you'll see output in the console pane. Throwing errors helps you locate bugs: use try/catch to handle runtime exceptions.</p>
    </div>

    <div class="section">
      <h3>Exercises</h3>
      <div class="exercises">
        <div class="exercise">1) Add a <code>Wire</code> class with initial variables of <code>x0, y0, x1, y1</code>.</div>
        <div class="exercise">2) Setup the wire class constructor and add <code>this.active = 0</code>.</div>
        <div class="exercise">3) Add a <code>function attachWire(startX, startY, endX, endY)</code> inside the wire class and set <code>(x0, y0) to (startX, startY)</code>, do the same as well with <code>(x1, y1) and (endX, endY)</code>.</div>
      </div>
    </div>

    <div class="muted">Tip: edit the code below and press <strong>Run</strong> to execute.</div>
  </section>

  <!-- Editor (stacked vertically with output) -->
  <section class="card">
    <div class="toolbar">
      <button id="run" class="btn">Run</button>
      <button id="reset" class="btn secondary">Reset</button>
      <span class="muted">Language: JavaScript (ES2020)</span>
      <span class="muted" style="margin-left:auto;">Sandbox: iframe</span>
    </div>

    <div class="editor">
      <textarea id="code">
class Wire {
  constructor(x0, y0, x1, y1) {
    this.x0 = x0; this.y0 = y0;
    this.x1 = x1; this.y1 = y1;
    this.active = 0;
  }

  attachWire(startX, startY, endX, endY) {
    this.x0 = startX; this.y0 = startY;
    this.x1 = endX;   this.y1 = endY;
    this.active = 1;
  }

  getWireInfo() {
    console.log(this.x0);
    console.log(this.y0);
    console.log(this.x1);
    console.log(this.y1);
  }
}

const wire = new Wire(0, 0, 15, 50);
wire.getWireInfo();
wire.attachWire(150, 100, 15, 50);
console.log("");
wire.getWireInfo();
      </textarea>

      <div class="output">
        <div class="output-header">
          <div style="font-weight:700">Console</div>
          <div class="muted">Output from the iframe</div>
        </div>
        <div id="console" class="console"></div>
      </div>
    </div>

    <div style="margin-top:12px; display:flex; gap:8px; align-items:center; justify-content:space-between; flex-wrap:wrap;">
      <div class="muted">Editor: Plain textarea. Paste code and Run. The iframe sandbox prevents access to parent.</div>
      <div style="display:flex; gap:8px;">
        <button id="example1" class="btn" style="background:var(--ok);">Example: sum()</button>
        <button id="example2" class="btn" style="background:var(--danger);">Error demo</button>
      </div>
    </div>
  </section>

  <!-- Nav -->
  <section>
    <a class="nav-link-btn" href="{{site.baseurl}}/cs-portfolio-quest/frontend/submodule_5">Previous</a>
  </section>
</div>

<script>
  (function(){
    const consoleEl = document.getElementById('console');
    function append(msg, kind){
      const line = document.createElement('div');
      line.textContent = msg;
      if(kind === 'err') line.style.color = '#ffb3b3';
      consoleEl.appendChild(line);
      consoleEl.scrollTop = consoleEl.scrollHeight;
    }

    // sandbox
    let iframe = null;
    function makeIframe(){
      if(iframe){ iframe.remove(); }
      iframe = document.createElement('iframe');
      iframe.sandbox = 'allow-scripts';
      iframe.style.width = '1px';
      iframe.style.height = '1px';
      iframe.style.border = '0';
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      document.body.appendChild(iframe);

      const src = "<!doctype html><html><head><meta charset='utf-8'></head><body>" +
      "<script>(function(){function send(t,a){try{parent.postMessage({type:'console',level:t,args:Array.from(a).map(v=>{try{return typeof v==='object'?JSON.stringify(v):String(v);}catch(e){return String(v);}})},'*');}catch(e){}};const L=console.log,E=console.error,W=console.warn;console.log=function(){send('log',arguments);L.apply(console,arguments);};console.error=function(){send('error',arguments);E.apply(console,arguments);};console.warn=function(){send('warn',arguments);W.apply(console,arguments);};window.onerror=function(m,s,l,c){send('error',[m+' (line:'+l+':'+c+')']);};})();<\/script>" +
      "</body></html>";
      iframe.srcdoc = src;
    }
    makeIframe();

    // message pipe
    window.addEventListener('message', (ev) => {
      try{
        const d = ev.data;
        if(d && d.type === 'console'){
          const text = d.args.join(' ');
          if(d.level === 'error') append(text, 'err');
          else append(text, 'log');
        }
      }catch(e){}
    });

    // execute user code
    function runCode(code){
      consoleEl.innerHTML = '';
      makeIframe();
      const userScript = "<script>try{\\n" + code + "\\n}catch(e){console.error(e.stack||e.message||String(e));}\\n<\\/script>";
      iframe.srcdoc = iframe.srcdoc.replace("</body></html>", userScript + "</body></html>");
    }

    // controls
    const runBtn = document.getElementById('run');
    const resetBtn = document.getElementById('reset');
    const codeArea = document.getElementById('code');
    const ex1 = document.getElementById('example1');
    const ex2 = document.getElementById('example2');

    runBtn.addEventListener('click', ()=> runCode(codeArea.value));
    resetBtn.addEventListener('click', ()=>{
      codeArea.value = "// Fresh code - try the exercises!\\n";
      consoleEl.innerHTML = '';
      makeIframe();
    });
    ex1.addEventListener('click', ()=>{
      codeArea.value = "function sum(a,b){ return a+b; }\\nconsole.log('sum(10,7)=', sum(10,7));";
    });
    ex2.addEventListener('click', ()=>{
      codeArea.value = "console.log('this will throw');\\nthrow new Error('demo failure');";
    });

    // auto-run initial code
    runCode(codeArea.value);
  })();
</script>



