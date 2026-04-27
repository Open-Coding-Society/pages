---
layout: post
title: Compression Quest — Squeeze the Bits
description: A 5-minute gamified AP CSP lesson on lossy and lossless compression. Compress strings with run-length encoding, then sort real-world file types into the right bin.
breadcrumbs: True
permalink: /csp/big-idea-2/compression-quest
authors: Sprinters Capstone
---

<style>
  .cq-wrap { font-family: "Segoe UI", Tahoma, sans-serif; max-width: 900px; margin: 0 auto; color: #1a1a1a; }
  .cq-hero { background: linear-gradient(135deg,#0ea5e9,#7c3aed); color:#fff; border-radius:18px; padding:22px 26px; box-shadow:0 8px 24px rgba(0,0,0,.18); }
  .cq-hero h1 { margin:0 0 6px; font-size:1.7rem; }
  .cq-hero p { margin:0; opacity:.95; }
  .cq-pills { display:flex; gap:10px; flex-wrap:wrap; margin-top:12px; }
  .cq-pill { background:rgba(255,255,255,.18); border:1px solid rgba(255,255,255,.35); padding:4px 12px; border-radius:999px; font-size:.85rem; }
  .cq-card { background:#fff; border:1px solid #e5e7eb; border-radius:14px; padding:18px 20px; margin:16px 0; box-shadow:0 2px 10px rgba(0,0,0,.05); }
  .cq-card h2 { margin:0 0 8px; font-size:1.2rem; color:#0f172a; }
  .cq-grid2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .cq-box { border-radius:12px; padding:14px; }
  .cq-lossless { background:#ecfdf5; border:2px solid #10b981; }
  .cq-lossy { background:#fff7ed; border:2px solid #f59e0b; }
  .cq-box h3 { margin:0 0 6px; }
  .cq-box small { color:#475569; }
  /* Game 1 */
  .rle-row { display:flex; gap:10px; margin-top:10px; flex-wrap:wrap; }
  .rle-row input { flex:1; min-width:200px; padding:10px; border:1px solid #cbd5e1; border-radius:8px; font-size:1rem; }
  .rle-row button { background:#7c3aed; color:#fff; border:0; padding:10px 16px; border-radius:8px; cursor:pointer; font-weight:600; }
  .rle-row button:hover { background:#6d28d9; }
  .rle-out { margin-top:10px; padding:10px 12px; border-radius:8px; background:#f1f5f9; font-family:monospace; min-height:24px; }
  .rle-stat { display:flex; gap:14px; margin-top:8px; font-size:.9rem; color:#334155; flex-wrap:wrap;}
  .rle-stat span b { color:#0f172a; }
  /* Game 2 */
  .files { display:flex; flex-wrap:wrap; gap:8px; margin:10px 0; }
  .file { background:#1e293b; color:#fff; padding:8px 14px; border-radius:8px; cursor:pointer; user-select:none; transition:transform .1s; font-weight:600; }
  .file:hover { transform:translateY(-2px); }
  .file.placed { opacity:.35; cursor:default; pointer-events:none; }
  .bins { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-top:10px; }
  .bin { min-height:90px; border:2px dashed #94a3b8; border-radius:12px; padding:10px; }
  .bin.l { border-color:#10b981; background:#f0fdf4; }
  .bin.y { border-color:#f59e0b; background:#fffbeb; }
  .bin h4 { margin:0 0 6px; }
  .bin .tray { display:flex; flex-wrap:wrap; gap:6px; min-height:30px; }
  .chip { padding:6px 10px; border-radius:6px; font-size:.85rem; font-weight:600; }
  .chip.ok { background:#10b981; color:#fff; }
  .chip.bad { background:#ef4444; color:#fff; }
  .scorebar { display:flex; gap:12px; align-items:center; margin-top:10px; font-size:.95rem; }
  .scorebar .meter { flex:1; height:10px; background:#e5e7eb; border-radius:6px; overflow:hidden; }
  .scorebar .fill { height:100%; background:linear-gradient(90deg,#10b981,#7c3aed); width:0%; transition:width .3s; }
  .badge { display:inline-block; margin-top:8px; padding:6px 14px; border-radius:999px; background:#0f172a; color:#fff; font-weight:700; }
  .picker { display:flex; gap:6px; flex-wrap:wrap; margin-top:6px; }
  .picker button { background:#e2e8f0; border:0; padding:6px 10px; border-radius:6px; cursor:pointer; font-weight:600; }
  .picker button:hover { background:#cbd5e1; }
  .ap-tip { background:#fef3c7; border-left:4px solid #f59e0b; padding:10px 14px; border-radius:8px; font-size:.92rem; }
  @media (max-width:640px){ .cq-grid2,.bins { grid-template-columns:1fr; } }
</style>

<div class="cq-wrap">

<div class="cq-hero">
  <h1>Compression Quest: Squeeze the Bits</h1>
  <p>AP CSP Big Idea 2 · ~5 minute lesson · Lossy vs Lossless compression</p>
  <div class="cq-pills">
    <span class="cq-pill">Earn a Cruncher Badge</span>
    <span class="cq-pill">2 mini-games</span>
    <span class="cq-pill">Exam-ready</span>
  </div>
</div>

<div class="cq-card">
  <h2>The 30-second briefing</h2>
  <p><b>Compression</b> shrinks data so it moves faster and stores smaller. There are two flavors:</p>
  <div class="cq-grid2">
    <div class="cq-box cq-lossless">
      <h3>Lossless</h3>
      <small>Original is <b>perfectly</b> reconstructed. Zero data lost.</small>
      <p style="margin:8px 0 0">Examples: <code>.zip</code>, <code>.png</code>, <code>.gif</code>, <code>.flac</code>, text files.</p>
    </div>
    <div class="cq-box cq-lossy">
      <h3>Lossy</h3>
      <small>Throws away "less important" bits. Smaller, but <b>can't get original back</b>.</small>
      <p style="margin:8px 0 0">Examples: <code>.jpg</code>, <code>.mp3</code>, <code>.mp4</code>, streaming video.</p>
    </div>
  </div>
  <p class="ap-tip" style="margin-top:12px"><b>AP rule of thumb:</b> If losing detail is unacceptable (code, bank records, archives), pick <b>lossless</b>. If a smaller file matters more than perfect fidelity (photos, music, video), pick <b>lossy</b>.</p>
</div>

<div class="cq-card">
  <h2>Mini-game 1 — Run-Length Encoder</h2>
  <p>RLE is a classic <b>lossless</b> trick: replace runs of repeated chars with <code>char+count</code>. Try to make a string that compresses well!</p>
  <div class="rle-row">
    <input id="rle-in" maxlength="40" placeholder="Try: AAAAABBBCCDAA" />
    <button onclick="runRLE()">Compress</button>
  </div>
  <div class="picker">
    <span style="font-size:.85rem;color:#475569;align-self:center;">Quick load:</span>
    <button onclick="loadRLE('AAAAABBBCCDAA')">AAAAABBBCCDAA</button>
    <button onclick="loadRLE('WWWWWWWWWWWWBWWWWWWWWWWWWBBB')">long run</button>
    <button onclick="loadRLE('ABCDEFG')">no repeats</button>
  </div>
  <div class="rle-out" id="rle-out">→ result will show here</div>
  <div class="rle-stat" id="rle-stat"></div>
  <p class="ap-tip" style="margin-top:10px"><b>Why this matters:</b> RLE shows that compression <i>ratio depends on the data</i>. Lots of repetition = great savings. Random data = often <b>bigger</b> after compression.</p>
</div>

<div class="cq-card">
  <h2>Mini-game 2 — Sort the Files</h2>
  <p>Click a file, then click the bin it belongs in. Get all 8 right to max your Cruncher Badge!</p>
  <div class="files" id="files"></div>
  <div class="bins">
    <div class="bin l">
      <h4>🟢 Lossless</h4>
      <div class="tray" id="bin-l"></div>
    </div>
    <div class="bin y">
      <h4>🟠 Lossy</h4>
      <div class="tray" id="bin-y"></div>
    </div>
  </div>
  <div class="scorebar">
    <span><b id="cq-score">0</b> / 8</span>
    <div class="meter"><div class="fill" id="cq-fill"></div></div>
    <button onclick="resetSort()" style="background:#e2e8f0;border:0;padding:6px 12px;border-radius:6px;cursor:pointer;">Reset</button>
  </div>
  <div id="cq-badge"></div>
</div>

<div class="cq-card">
  <h2>Lock it in — quick check</h2>
  <ol>
    <li>You're emailing the only copy of a contract. Lossy or lossless? <i>(lossless — you can't lose words)</i></li>
    <li>Streaming a music video over slow Wi-Fi. Lossy or lossless? <i>(lossy — smaller wins)</i></li>
    <li>RLE on the string <code>"ABCABC"</code> — would it shrink? <i>(no — no runs to collapse; could even grow)</i></li>
  </ol>
</div>

</div>

<script>
  function runRLE(){
    const s = document.getElementById('rle-in').value || '';
    if(!s){ document.getElementById('rle-out').textContent='→ type something first'; return; }
    let out=''; let i=0;
    while(i<s.length){ let j=i; while(j<s.length && s[j]===s[i]) j++; out += s[i] + (j-i); i=j; }
    const orig=s.length, comp=out.length;
    const ratio = orig ? Math.round((1 - comp/orig)*100) : 0;
    document.getElementById('rle-out').textContent = '→ ' + out;
    const verdict = ratio>0 ? `<span style="color:#059669"><b>shrunk</b></span>` : ratio<0 ? `<span style="color:#dc2626"><b>got bigger!</b></span>` : `<span><b>no change</b></span>`;
    document.getElementById('rle-stat').innerHTML =
      `<span>Original: <b>${orig}</b> chars</span>`+
      `<span>Compressed: <b>${comp}</b> chars</span>`+
      `<span>Savings: <b>${ratio}%</b> ${verdict}</span>`;
  }
  function loadRLE(v){ document.getElementById('rle-in').value=v; runRLE(); }

  const FILES = [
    {n:'photo.jpg', t:'y'},
    {n:'song.mp3', t:'y'},
    {n:'movie.mp4', t:'y'},
    {n:'stream.webm', t:'y'},
    {n:'archive.zip', t:'l'},
    {n:'logo.png', t:'l'},
    {n:'notes.txt', t:'l'},
    {n:'master.flac', t:'l'},
  ];
  let selected = null, score = 0, placed = 0;
  function renderFiles(){
    const f = document.getElementById('files'); f.innerHTML='';
    FILES.forEach((x, i)=>{
      const el = document.createElement('div');
      el.className = 'file' + (x._placed ? ' placed':'');
      el.textContent = x.n;
      el.onclick = ()=>{ selected = i; document.querySelectorAll('.file').forEach(e=>e.style.outline=''); el.style.outline='3px solid #fbbf24'; };
      f.appendChild(el);
    });
  }
  function place(binType){
    if(selected===null) return;
    const f = FILES[selected]; if(f._placed) return;
    const correct = f.t === binType;
    const tray = document.getElementById('bin-'+binType);
    const chip = document.createElement('span');
    chip.className = 'chip ' + (correct?'ok':'bad');
    chip.textContent = (correct?'✓ ':'✗ ') + f.n + (correct?'':' (wrong)');
    tray.appendChild(chip);
    f._placed = true; placed++;
    if(correct) score++;
    document.getElementById('cq-score').textContent = score;
    document.getElementById('cq-fill').style.width = (score/FILES.length*100)+'%';
    selected = null;
    renderFiles();
    if(placed === FILES.length){
      const b = document.getElementById('cq-badge');
      let title = score===8?'🏆 Master Cruncher': score>=6?'🥈 Bit Squeezer': score>=4?'🥉 Apprentice Packer':'📦 Keep practicing';
      b.innerHTML = `<div class="badge">${title} — ${score}/8</div>`;
    }
  }
  function resetSort(){
    FILES.forEach(f=>delete f._placed);
    score=0; placed=0; selected=null;
    document.getElementById('bin-l').innerHTML='';
    document.getElementById('bin-y').innerHTML='';
    document.getElementById('cq-score').textContent='0';
    document.getElementById('cq-fill').style.width='0%';
    document.getElementById('cq-badge').innerHTML='';
    renderFiles();
  }
  document.addEventListener('DOMContentLoaded', ()=>{
    renderFiles();
    document.querySelector('.bin.l').onclick = ()=>place('l');
    document.querySelector('.bin.y').onclick = ()=>place('y');
  });
</script>
