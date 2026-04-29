---
layout: post
title: Compression Quest — Squeeze the Bits
description: A 5-minute gamified AP CSP lesson on lossy and lossless compression. Compress strings with run-length encoding, then sort real-world file types into the right bin.
breadcrumbs: True
permalink: /csp/big-idea-2/compression-quest
authors: Sprinters Capstone
---

<style>
  .cq-wrap { font-family: "Segoe UI", Tahoma, sans-serif; max-width: 900px; margin: 0 auto; color: #0f172a; }
  .cq-wrap p, .cq-wrap li, .cq-wrap ol, .cq-wrap ul, .cq-wrap small, .cq-wrap code, .cq-wrap i, .cq-wrap b, .cq-wrap span, .cq-wrap div { color: inherit; }
  .cq-hero { background: linear-gradient(135deg,#0ea5e9,#7c3aed); color:#ffffff !important; border-radius:18px; padding:22px 26px; box-shadow:0 8px 24px rgba(0,0,0,.18); }
  .cq-hero h1, .cq-hero p, .cq-hero span { color:#ffffff !important; }
  .cq-hero h1 { margin:0 0 6px; font-size:1.7rem; }
  .cq-hero p { margin:0; opacity:.95; }
  .cq-pills { display:flex; gap:10px; flex-wrap:wrap; margin-top:12px; }
  .cq-pill { background:rgba(255,255,255,.22); border:1px solid rgba(255,255,255,.55); padding:4px 12px; border-radius:999px; font-size:.85rem; color:#ffffff !important; }
  .cq-intro { background:#0f172a; color:#f8fafc !important; border-radius:14px; padding:16px 20px; margin:16px 0; box-shadow:0 2px 10px rgba(0,0,0,.18); }
  .cq-intro h2 { color:#fbbf24 !important; margin:0 0 8px; font-size:1.15rem; }
  .cq-intro ul { margin:6px 0 0 20px; padding:0; }
  .cq-intro li { color:#f8fafc !important; margin:4px 0; line-height:1.45; }
  .cq-intro li b { color:#fbbf24 !important; }
  .cq-card { background:#ffffff; border:1px solid #cbd5e1; border-radius:14px; padding:18px 20px; margin:16px 0; box-shadow:0 2px 10px rgba(0,0,0,.08); color:#000000 !important; }
  .cq-card h2, .cq-card h3, .cq-card h4, .cq-card p, .cq-card li, .cq-card ol, .cq-card ul, .cq-card small, .cq-card i, .cq-card b, .cq-card span, .cq-card div, .cq-card label { color:#000000 !important; }
  .cq-card code { color:#000000 !important; background:#e2e8f0; padding:1px 6px; border-radius:4px; font-weight:600; }
  .cq-card h2 { margin:0 0 8px; font-size:1.25rem; font-weight:800; color:#000000 !important; border-bottom:2px solid #cbd5e1; padding-bottom:6px; }
  .cq-grid2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .cq-box { border-radius:12px; padding:14px; color:#000000 !important; }
  .cq-box, .cq-box * { color:#000000 !important; }
  .cq-lossless { background:#d1fae5; border:2px solid #047857; }
  .cq-lossless h3 { color:#064e3b !important; font-weight:800 !important; }
  .cq-lossy { background:#fed7aa; border:2px solid #c2410c; }
  .cq-lossy h3 { color:#7c2d12 !important; font-weight:800 !important; }
  .cq-box h3 { margin:0 0 6px; font-size:1.1rem; }
  .cq-box small { color:#000000 !important; font-weight:500; }
  /* Game 1 */
  .rle-row { display:flex; gap:10px; margin-top:10px; flex-wrap:wrap; }
  .rle-row input { flex:1; min-width:200px; padding:10px; border:2px solid #475569; border-radius:8px; font-size:1rem; background:#ffffff; color:#000000 !important; font-weight:600; }
  .rle-row button { background:#5b21b6; color:#ffffff !important; border:0; padding:10px 16px; border-radius:8px; cursor:pointer; font-weight:700; }
  .rle-row button:hover { background:#4c1d95; }
  .rle-out { margin-top:10px; padding:10px 12px; border-radius:8px; background:#e2e8f0; font-family:monospace; min-height:24px; color:#000000 !important; font-weight:700; border:1px solid #94a3b8; }
  .rle-stat { display:flex; gap:14px; margin-top:8px; font-size:.92rem; color:#000000 !important; flex-wrap:wrap;}
  .rle-stat span { color:#000000 !important; }
  .rle-stat span b { color:#000000 !important; font-weight:800; }
  /* Game 2 */
  .files { display:flex; flex-wrap:wrap; gap:8px; margin:10px 0; }
  .file { background:#000000; color:#ffffff !important; padding:8px 14px; border-radius:8px; cursor:pointer; user-select:none; transition:transform .1s; font-weight:700; }
  .file:hover { transform:translateY(-2px); }
  .file.placed { opacity:.35; cursor:default; pointer-events:none; }
  .bins { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-top:10px; }
  .bin { min-height:90px; border:2px dashed #475569; border-radius:12px; padding:10px; cursor:pointer; }
  .bin.l { border-color:#047857; background:#d1fae5; }
  .bin.l h4 { color:#064e3b !important; font-weight:800 !important; }
  .bin.y { border-color:#c2410c; background:#fed7aa; }
  .bin.y h4 { color:#7c2d12 !important; font-weight:800 !important; }
  .bin h4 { margin:0 0 6px; font-size:1rem; }
  .bin .tray { display:flex; flex-wrap:wrap; gap:6px; min-height:30px; }
  .chip { padding:6px 10px; border-radius:6px; font-size:.85rem; font-weight:700; }
  .chip.ok { background:#047857; color:#ffffff !important; }
  .chip.bad { background:#b91c1c; color:#ffffff !important; }
  .scorebar { display:flex; gap:12px; align-items:center; margin-top:10px; font-size:.95rem; color:#000000 !important; }
  .scorebar span, .scorebar b { color:#000000 !important; font-weight:700; }
  .scorebar .meter { flex:1; height:10px; background:#cbd5e1; border-radius:6px; overflow:hidden; }
  .scorebar .fill { height:100%; background:linear-gradient(90deg,#047857,#5b21b6); width:0%; transition:width .3s; }
  .scorebar button { background:#cbd5e1 !important; color:#000000 !important; font-weight:700; }
  .badge { display:inline-block; margin-top:8px; padding:6px 14px; border-radius:999px; background:#000000; color:#ffffff !important; font-weight:800; }
  .picker { display:flex; gap:6px; flex-wrap:wrap; margin-top:6px; align-items:center; }
  .picker span { color:#000000 !important; font-weight:600; }
  .picker button { background:#cbd5e1; color:#000000 !important; border:0; padding:6px 10px; border-radius:6px; cursor:pointer; font-weight:700; }
  .picker button:hover { background:#94a3b8; }
  .ap-tip { background:#fde68a; border-left:4px solid #b45309; padding:10px 14px; border-radius:8px; font-size:.95rem; color:#000000 !important; }
  .ap-tip b, .ap-tip i { color:#000000 !important; }
  .howto { background:#dbeafe; border-left:4px solid #1d4ed8; padding:10px 14px; border-radius:8px; font-size:.95rem; color:#000000 !important; margin:8px 0 12px; }
  .howto b, .howto i { color:#000000 !important; }
  .howto .label { display:inline-block; background:#1d4ed8; color:#ffffff !important; font-weight:800; font-size:.78rem; padding:2px 8px; border-radius:999px; margin-right:8px; vertical-align:middle; letter-spacing:.05em; }
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

<div class="cq-intro">
  <h2>What is Compression?</h2>
  <ul>
    <li><b>The core idea:</b> Compression is an algorithm that re-encodes data into <i>fewer bits</i> than the original. The encoded version takes less storage and travels faster across networks.</li>
    <li><b>Why it exists:</b> Bandwidth and storage cost real money. Without compression, a 4-minute song would be ~40MB instead of ~4MB, and HD streaming would be impossible on most connections.</li>
    <li><b>Lossless compression:</b> The original file can be <i>perfectly</i> reconstructed bit-for-bit. It works by spotting patterns (repeated characters, common byte sequences) and replacing them with shorter codes. Examples: ZIP, PNG, GIF, FLAC, run-length encoding, Huffman coding.</li>
    <li><b>Lossy compression:</b> The algorithm <i>permanently discards</i> data the human eye/ear is least likely to notice (subtle color shifts, high-frequency sound). The result is much smaller but cannot be restored to the original. Examples: JPEG, MP3, MP4, AAC.</li>
    <li><b>The big trade-off:</b> File size vs. fidelity. Lossy gives smaller files at the cost of detail; lossless guarantees fidelity but compresses less. Pick by use case — never use lossy on source code, text, financial records, or anything where every bit matters.</li>
    <li><b>AP exam angle:</b> You'll be asked to identify <i>which</i> type fits a scenario, explain why a file might or might not compress well, and reason about trade-offs between size, quality, and processing time.</li>
  </ul>
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
  <div class="howto">
    <span class="label">HOW TO PLAY</span>
    Type any string into the box (or hit a <b>Quick load</b> sample), then click <b>Compress</b>. The output and savings % appear below — try to <b>beat 50% savings</b> by feeding it long repeated runs.
  </div>
  <div class="rle-row">
    <input id="rle-in" maxlength="40" placeholder="Try: AAAAABBBCCDAA" />
    <button onclick="runRLE()">Compress</button>
  </div>
  <div class="picker">
    <span style="font-size:.9rem;color:#000000;align-self:center;font-weight:600;">Quick load:</span>
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
  <p>Decide whether each file format uses <b>lossless</b> or <b>lossy</b> compression and drop it into the matching bin.</p>
  <div class="howto">
    <span class="label">HOW TO PLAY</span>
    <b>1.</b> Click a file tile (it gets a yellow outline). <b>2.</b> Click the <span style="color:#064e3b;font-weight:800;">🟢 Lossless</span> or <span style="color:#7c2d12;font-weight:800;">🟠 Lossy</span> bin to place it. Correct picks turn green ✓, wrong ones red ✗. <b>Goal:</b> all 8 right for the Master Cruncher badge.
  </div>
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
    <button onclick="resetSort()" style="background:#cbd5e1;color:#000000;border:0;padding:6px 12px;border-radius:6px;cursor:pointer;font-weight:700;">Reset</button>
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
    const verdict = ratio>0 ? `<span style="color:#047857;font-weight:800;"><b>shrunk</b></span>` : ratio<0 ? `<span style="color:#b91c1c;font-weight:800;"><b>got bigger!</b></span>` : `<span style="color:#000000;font-weight:800;"><b>no change</b></span>`;
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
