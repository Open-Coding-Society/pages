// ============================================================
//  sandbox.js — Single Responsibility: Live code sandbox
//  Path: assets/js/bigsix/frontend/sandbox.js
//
//  Owns everything related to the sandbox step:
//    - Storing sandbox starter templates
//    - Loading a template into the editor
//    - Running the editor content in an isolated iframe
//    - Clearing the sandbox
//
//  EXPORTS:
//    initSandbox()  — call once on DOMContentLoaded
// ============================================================

// ── Sandbox starter templates ─────────────────────────────────
// All template content lives here — edit without touching logic.
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
  <p>Start writing HTML, CSS, and JS here!</p>`,
  };
  
  
  // ============================================================
  //  WORKER 1 — buildIframeContent
  //  Single responsibility: wrap user code in a full HTML document
  //  for the iframe. Pure function — no DOM access.
  // ============================================================
  
  /**
   * Wrap user sandbox code in a complete HTML document string.
   *
   * @param {string} code - User's HTML/CSS/JS code
   * @returns {string}    - Full HTML document for srcdoc
   */
  function buildIframeContent(code) {
    return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>* { box-sizing: border-box; } body { margin: 0; font-family: system-ui; }</style>
  </head>
  <body>${code}</body>
  </html>`;
  }
  
  
  // ============================================================
  //  WORKER 2 — runInIframe
  //  Single responsibility: inject content into the sandbox iframe.
  //  Only touches #sandboxFrame.
  // ============================================================
  
  /**
   * Run HTML/CSS/JS code inside the sandbox iframe.
   *
   * @param {string} code - User's combined HTML/CSS/JS
   */
  function runInIframe(code) {
    document.getElementById('sandboxFrame').srcdoc = buildIframeContent(code);
  }
  
  
  // ============================================================
  //  WORKER 3 — loadTemplate
  //  Single responsibility: copy a template into the editor
  //  and immediately run it. Only touches #sandboxCode and the iframe.
  // ============================================================
  
  /**
   * Load a named template into the sandbox editor and run it.
   *
   * @param {string} name - Key from SANDBOX_TEMPLATES
   */
  function loadTemplate(name) {
    const tmpl = SANDBOX_TEMPLATES[name];
    if (!tmpl) return;
    document.getElementById('sandboxCode').value = tmpl;
    runInIframe(tmpl);
  }
  
  
  // ============================================================
  //  ORCHESTRATOR — initSandbox
  //  Wires tab nav, Run button, Clear button.
  //  Loads the default template on init.
  //  Called once on DOMContentLoaded from frontend_lesson.md.
  // ============================================================
  
  /**
   * Initialise the sandbox section.
   * Call once on DOMContentLoaded.
   */
  export function initSandbox() {
    // Wire template tab buttons
    document.querySelectorAll('#sandboxTabNav button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#sandboxTabNav button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        loadTemplate(btn.dataset.template);
      });
    });
  
    // Wire Run button — run whatever is in the editor
    document.getElementById('sandboxRunBtn').addEventListener('click', () => {
      runInIframe(document.getElementById('sandboxCode').value);
    });
  
    // Wire Clear button — empty editor and show a placeholder
    document.getElementById('sandboxClearBtn').addEventListener('click', () => {
      document.getElementById('sandboxCode').value = '';
      document.getElementById('sandboxFrame').srcdoc =
        '<body style="display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#f8fafc;color:#94a3b8;font-family:system-ui;font-size:14px;">Sandbox cleared. Write some code and click Update Preview.</body>';
    });
  
    // Load the default template on init
    loadTemplate('click');
  }