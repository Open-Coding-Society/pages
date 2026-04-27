---
layout: post
title: Cyber Defender — Safe Computing Drill
description: A 5-minute gamified AP CSP lesson on safe computing. Spot phishing, forge strong passwords, and match cyber threats to defenses.
breadcrumbs: True
permalink: /csp/safe-computing-defender
authors: Sprinters Capstone
---

<style>
  .sc-wrap { font-family: "Segoe UI", Tahoma, sans-serif; max-width: 900px; margin: 0 auto; color:#0f172a; }
  .sc-hero { background:linear-gradient(135deg,#0f172a,#1e3a8a 60%,#7c3aed); color:#fff; border-radius:18px; padding:22px 26px; box-shadow:0 8px 24px rgba(0,0,0,.25); }
  .sc-hero h1 { margin:0 0 6px; font-size:1.7rem; }
  .sc-hero p { margin:0; opacity:.95; }
  .sc-pills { display:flex; gap:10px; flex-wrap:wrap; margin-top:12px; }
  .sc-pill { background:rgba(255,255,255,.16); border:1px solid rgba(255,255,255,.35); padding:4px 12px; border-radius:999px; font-size:.85rem; }
  .sc-card { background:#fff; border:1px solid #e5e7eb; border-radius:14px; padding:18px 20px; margin:16px 0; box-shadow:0 2px 10px rgba(0,0,0,.05); }
  .sc-card h2 { margin:0 0 8px; font-size:1.2rem; }
  .key { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:10px; margin-top:8px; }
  .key div { background:#f1f5f9; padding:10px 12px; border-radius:10px; font-size:.92rem; }
  .key b { color:#1e3a8a; }
  /* Phishing inbox */
  .inbox { display:flex; flex-direction:column; gap:10px; margin-top:10px; }
  .mail { border:1px solid #e2e8f0; border-radius:10px; padding:12px 14px; background:#fafafa; }
  .mail .from { font-size:.85rem; color:#475569; }
  .mail .subj { font-weight:700; margin:4px 0; }
  .mail .body { font-size:.92rem; color:#334155; }
  .mail .row { display:flex; gap:8px; margin-top:10px; }
  .mail button { padding:8px 14px; border:0; border-radius:8px; cursor:pointer; font-weight:700; }
  .btn-phish { background:#ef4444; color:#fff; }
  .btn-safe  { background:#10b981; color:#fff; }
  .mail.locked { opacity:.7; }
  .verdict { margin-top:8px; font-size:.9rem; padding:8px 10px; border-radius:8px; }
  .verdict.ok { background:#ecfdf5; color:#065f46; }
  .verdict.bad { background:#fef2f2; color:#991b1b; }
  /* Password forge */
  .forge { display:flex; flex-direction:column; gap:10px; margin-top:10px; }
  .forge input { padding:10px 12px; border:1px solid #cbd5e1; border-radius:8px; font-size:1rem; font-family:monospace; }
  .strength { height:14px; border-radius:8px; background:#e5e7eb; overflow:hidden; }
  .strength > div { height:100%; width:0%; transition:width .25s, background .25s; background:#ef4444; }
  .checks { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:6px; font-size:.88rem; }
  .check { padding:6px 10px; border-radius:8px; background:#f1f5f9; }
  .check.ok { background:#dcfce7; color:#065f46; }
  /* Match game */
  .match { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-top:10px; }
  .col h4 { margin:0 0 6px; }
  .item { padding:10px; background:#f1f5f9; border-radius:8px; margin-bottom:8px; cursor:pointer; user-select:none; transition:transform .1s; }
  .item:hover { transform:translateY(-1px); }
  .item.selected { outline:3px solid #fbbf24; }
  .item.matched { background:#dcfce7; color:#065f46; cursor:default; }
  .item.miss { background:#fee2e2; }
  .scorebar { display:flex; gap:12px; align-items:center; margin-top:12px; font-size:.95rem; }
  .scorebar .meter { flex:1; height:10px; background:#e5e7eb; border-radius:6px; overflow:hidden; }
  .scorebar .fill { height:100%; background:linear-gradient(90deg,#10b981,#3b82f6,#7c3aed); width:0%; transition:width .3s; }
  .badge { display:inline-block; margin-top:8px; padding:6px 14px; border-radius:999px; background:#0f172a; color:#fff; font-weight:700; }
  .ap-tip { background:#dbeafe; border-left:4px solid #3b82f6; padding:10px 14px; border-radius:8px; font-size:.92rem; margin-top:10px;}
  @media (max-width:640px){ .match { grid-template-columns:1fr; } }
</style>

<div class="sc-wrap">

<div class="sc-hero">
  <h1>Cyber Defender: Safe Computing Drill</h1>
  <p>AP CSP Big Idea 5 (and 4) · ~5 minute lesson · Phishing, passwords, threats, encryption</p>
  <div class="sc-pills">
    <span class="sc-pill">3 mini-games</span>
    <span class="sc-pill">Earn a Defender Rank</span>
    <span class="sc-pill">Exam-ready</span>
  </div>
</div>

<div class="sc-card">
  <h2>The 30-second briefing</h2>
  <div class="key">
    <div><b>PII</b> — personally identifying info (SSN, address, DOB). Never share it casually online.</div>
    <div><b>Phishing</b> — fake messages tricking you into clicking, paying, or revealing data.</div>
    <div><b>Malware</b> — virus, worm, trojan, ransomware. Software designed to harm.</div>
    <div><b>Strong password</b> — long, mixed case, digits, symbols, <i>unique</i> per site.</div>
    <div><b>MFA</b> — 2nd factor (code/app/biometric). Stops 99% of password attacks.</div>
    <div><b>Symmetric key</b> — same key encrypts &amp; decrypts (fast). Both sides must know it.</div>
    <div><b>Public key</b> — encrypt with public, decrypt with private. Powers HTTPS &amp; signing.</div>
    <div><b>Keylogger</b> — silently records keystrokes; a reason to use MFA.</div>
  </div>
</div>

<div class="sc-card">
  <h2>Mini-game 1 — Phish or Pass?</h2>
  <p>Read each message. Tap <b>Phish</b> or <b>Safe</b>. Watch for urgency, weird links, mismatched senders, and "verify your account" demands.</p>
  <div class="inbox" id="inbox"></div>
</div>

<div class="sc-card">
  <h2>Mini-game 2 — Password Forge</h2>
  <p>Type a password. Hit every check to fill the bar.</p>
  <div class="forge">
    <input id="pw" placeholder="type a password..." autocomplete="off"/>
    <div class="strength"><div id="pw-fill"></div></div>
    <div class="checks" id="pw-checks"></div>
    <div id="pw-verdict" style="font-weight:700;"></div>
  </div>
  <p class="ap-tip"><b>Why it matters:</b> Each extra character multiplies the time to brute-force. A 12-char mixed password is exponentially harder to crack than an 8-char one. <b>MFA</b> beats even a weak password.</p>
</div>

<div class="sc-card">
  <h2>Mini-game 3 — Match the Threat</h2>
  <p>Click a threat on the left, then click its matching defense or definition on the right.</p>
  <div class="match">
    <div class="col"><h4>Threats / Terms</h4><div id="left"></div></div>
    <div class="col"><h4>Defenses / Definitions</h4><div id="right"></div></div>
  </div>
  <div class="scorebar">
    <span><b id="m-score">0</b> / <span id="m-total">0</span></span>
    <div class="meter"><div class="fill" id="m-fill"></div></div>
    <button onclick="resetMatch()" style="background:#e2e8f0;border:0;padding:6px 12px;border-radius:6px;cursor:pointer;">Reset</button>
  </div>
  <div id="rank"></div>
</div>

<div class="sc-card">
  <h2>Lock it in — quick check</h2>
  <ol>
    <li>An email says "URGENT: click here to keep your account active." Verdict? <i>(phishing — urgency + suspicious link)</i></li>
    <li>HTTPS uses which kind of cryptography? <i>(public-key / asymmetric for the handshake, then symmetric for speed)</i></li>
    <li>Best single upgrade for account safety? <i>(turn on multi-factor authentication)</i></li>
  </ol>
</div>

</div>

<script>
  // -------- Mini-game 1: Phishing --------
  const MAILS = [
    { from:'noreply@paypa1-security.com', subj:'URGENT: Verify your account in 24 hours', body:'Your account will be locked. Click http://paypa1-secure.ru/login to verify now.', phish:true,
      why:'Misspelled domain (paypa1), urgency, suspicious .ru link.' },
    { from:'github@github.com', subj:'New sign-in to your account', body:'We noticed a new sign-in from Chrome on macOS. If this was you, no action needed.', phish:false,
      why:'Legit domain, informational, no link demanding action.' },
    { from:'principal-school-rewards@gmail.com', subj:'You won a $500 Amazon gift card!', body:'Click the link below and enter your bank info to claim within 1 hour.', phish:true,
      why:'Free prize + bank info + Gmail address pretending to be a school = classic phish.' },
    { from:'support@yourschool.edu', subj:'Library book due Friday', body:'Reminder: "Intro to Algorithms" is due 04/30. Renew via the library portal.', phish:false,
      why:'Plausible sender, no link asking for credentials.' },
  ];
  function renderInbox(){
    const ib = document.getElementById('inbox'); ib.innerHTML='';
    MAILS.forEach((m,i)=>{
      const d = document.createElement('div'); d.className='mail';
      d.innerHTML = `<div class="from">From: ${m.from}</div>
        <div class="subj">${m.subj}</div>
        <div class="body">${m.body}</div>
        <div class="row">
          <button class="btn-phish" data-i="${i}" data-v="1">Phish</button>
          <button class="btn-safe" data-i="${i}" data-v="0">Safe</button>
        </div>
        <div class="verdict" id="v-${i}" style="display:none"></div>`;
      ib.appendChild(d);
    });
    ib.querySelectorAll('button').forEach(b=>{
      b.onclick = ()=>{
        const i = +b.dataset.i, guess = b.dataset.v==='1';
        const m = MAILS[i]; const v = document.getElementById('v-'+i);
        const correct = guess === m.phish;
        v.style.display='block';
        v.className = 'verdict ' + (correct?'ok':'bad');
        v.innerHTML = (correct?'✓ Correct: ':'✗ Not quite: ') + (m.phish?'<b>phishing</b>':'<b>safe</b>') + ' — ' + m.why;
        b.parentElement.parentElement.classList.add('locked');
        b.parentElement.querySelectorAll('button').forEach(x=>x.disabled=true);
      };
    });
  }

  // -------- Mini-game 2: Password forge --------
  const RULES = [
    { id:'len',  label:'12+ characters',   test:p=>p.length>=12 },
    { id:'low',  label:'lowercase letter', test:p=>/[a-z]/.test(p) },
    { id:'up',   label:'UPPERCASE letter', test:p=>/[A-Z]/.test(p) },
    { id:'num',  label:'a number',         test:p=>/\d/.test(p) },
    { id:'sym',  label:'a symbol (!@#…)',  test:p=>/[^A-Za-z0-9]/.test(p) },
    { id:'no',   label:'not "password" or "1234"', test:p=>!/password|1234|qwerty/i.test(p) && p.length>0 },
  ];
  function renderChecks(){
    const c = document.getElementById('pw-checks'); c.innerHTML='';
    RULES.forEach(r=>{
      const d = document.createElement('div'); d.className='check'; d.id='c-'+r.id; d.textContent='○ '+r.label;
      c.appendChild(d);
    });
  }
  function gradePW(){
    const p = document.getElementById('pw').value;
    let pass = 0;
    RULES.forEach(r=>{
      const ok = r.test(p);
      const el = document.getElementById('c-'+r.id);
      el.classList.toggle('ok', ok);
      el.textContent = (ok?'✓ ':'○ ') + r.label;
      if(ok) pass++;
    });
    const pct = Math.round(pass/RULES.length*100);
    const fill = document.getElementById('pw-fill');
    fill.style.width = pct+'%';
    fill.style.background = pct<40?'#ef4444':pct<70?'#f59e0b':pct<100?'#3b82f6':'#10b981';
    const v = document.getElementById('pw-verdict');
    v.textContent = pct===100?'🛡️ Fortress-grade':pct>=70?'👍 Solid':pct>=40?'⚠️ Risky':'🚨 Weak';
  }

  // -------- Mini-game 3: Match --------
  const PAIRS = [
    { l:'Phishing email',     r:'Hover links + verify the sender domain' },
    { l:'Weak password',      r:'Use a long passphrase + a password manager' },
    { l:'Keylogger malware',  r:'Multi-factor authentication (MFA)' },
    { l:'Public Wi-Fi snoop', r:'HTTPS / VPN encryption' },
    { l:'Ransomware',         r:'Regular offline backups' },
    { l:'PII leak',           r:'Share only the minimum needed' },
  ];
  let mSel = null, mScore = 0, mDone = 0;
  function shuffled(a){ return a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(v=>v[1]); }
  let rightOrder = [];
  function renderMatch(){
    document.getElementById('m-total').textContent = PAIRS.length;
    const L = document.getElementById('left'); const R = document.getElementById('right');
    L.innerHTML=''; R.innerHTML='';
    PAIRS.forEach((p,i)=>{
      const e = document.createElement('div'); e.className='item'; e.textContent=p.l; e.dataset.i=i; e.dataset.side='l';
      e.onclick = ()=>{ if(e.classList.contains('matched')) return; document.querySelectorAll('#left .item').forEach(x=>x.classList.remove('selected')); e.classList.add('selected'); mSel=i; };
      L.appendChild(e);
    });
    rightOrder = shuffled(PAIRS.map((_,i)=>i));
    rightOrder.forEach(i=>{
      const p = PAIRS[i];
      const e = document.createElement('div'); e.className='item'; e.textContent=p.r; e.dataset.i=i;
      e.onclick = ()=>{
        if(e.classList.contains('matched') || mSel===null) return;
        if(mSel === i){
          e.classList.add('matched');
          document.querySelectorAll('#left .item').forEach(x=>{ if(+x.dataset.i===i){ x.classList.add('matched'); x.classList.remove('selected'); }});
          mScore++; mDone++;
        } else {
          e.classList.add('miss'); setTimeout(()=>e.classList.remove('miss'),500);
          mDone++;
        }
        mSel=null;
        document.getElementById('m-score').textContent=mScore;
        document.getElementById('m-fill').style.width = (mScore/PAIRS.length*100)+'%';
        if(mScore===PAIRS.length){
          const r=document.getElementById('rank');
          r.innerHTML = `<div class="badge">🛡️ Cyber Defender — All ${PAIRS.length} matched!</div>`;
        }
      };
      R.appendChild(e);
    });
  }
  function resetMatch(){ mSel=null; mScore=0; mDone=0; document.getElementById('rank').innerHTML=''; document.getElementById('m-score').textContent='0'; document.getElementById('m-fill').style.width='0%'; renderMatch(); }

  document.addEventListener('DOMContentLoaded', ()=>{
    renderInbox();
    renderChecks();
    document.getElementById('pw').addEventListener('input', gradePW);
    renderMatch();
  });
</script>
