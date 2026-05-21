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
  .sc-wrap p, .sc-wrap li, .sc-wrap ol, .sc-wrap ul, .sc-wrap small, .sc-wrap code, .sc-wrap i, .sc-wrap b, .sc-wrap span, .sc-wrap div { color: inherit; }
  .sc-hero { background:linear-gradient(135deg,#0f172a,#1e3a8a 60%,#7c3aed); color:#ffffff !important; border-radius:18px; padding:22px 26px; box-shadow:0 8px 24px rgba(0,0,0,.25); }
  .sc-hero h1, .sc-hero p, .sc-hero span { color:#ffffff !important; }
  .sc-hero h1 { margin:0 0 6px; font-size:1.7rem; }
  .sc-hero p { margin:0; opacity:.95; }
  .sc-pills { display:flex; gap:10px; flex-wrap:wrap; margin-top:12px; }
  .sc-pill { background:rgba(255,255,255,.20); border:1px solid rgba(255,255,255,.55); padding:4px 12px; border-radius:999px; font-size:.85rem; color:#ffffff !important; }
  .sc-intro { background:#0f172a; color:#f8fafc !important; border-radius:14px; padding:16px 20px; margin:16px 0; box-shadow:0 2px 10px rgba(0,0,0,.18); }
  .sc-intro h2 { color:#fbbf24 !important; margin:0 0 8px; font-size:1.15rem; }
  .sc-intro ul { margin:6px 0 0 20px; padding:0; }
  .sc-intro li { color:#f8fafc !important; margin:4px 0; line-height:1.45; }
  .sc-intro li b { color:#fbbf24 !important; }
  .sc-card { background:#ffffff; border:1px solid #cbd5e1; border-radius:14px; padding:18px 20px; margin:16px 0; box-shadow:0 2px 10px rgba(0,0,0,.08); color:#000000 !important; }
  .sc-card h2, .sc-card h3, .sc-card h4, .sc-card p, .sc-card li, .sc-card ol, .sc-card ul, .sc-card small, .sc-card i, .sc-card b, .sc-card span, .sc-card div, .sc-card label { color:#000000 !important; }
  .sc-card code { color:#000000 !important; background:#e2e8f0; padding:1px 6px; border-radius:4px; font-weight:600; }
  .sc-card h2 { margin:0 0 8px; font-size:1.25rem; font-weight:800; border-bottom:2px solid #cbd5e1; padding-bottom:6px; }
  .key { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:10px; margin-top:8px; }
  .key div { background:#e2e8f0; padding:10px 12px; border-radius:10px; font-size:.92rem; color:#000000 !important; border:1px solid #94a3b8; }
  .key div * { color:#000000 !important; }
  .key b { color:#1e3a8a !important; font-weight:800 !important; }
  /* Phishing inbox */
  .inbox { display:flex; flex-direction:column; gap:10px; margin-top:10px; }
  .mail { border:1px solid #94a3b8; border-radius:10px; padding:12px 14px; background:#f1f5f9; color:#000000 !important; }
  .mail .from { font-size:.88rem; color:#000000 !important; font-weight:600; }
  .mail .subj { font-weight:800; margin:4px 0; color:#000000 !important; font-size:1.02rem; }
  .mail .body { font-size:.95rem; color:#000000 !important; }
  .mail .row { display:flex; gap:8px; margin-top:10px; }
  .mail button { padding:8px 14px; border:0; border-radius:8px; cursor:pointer; font-weight:800; }
  .btn-phish { background:#b91c1c; color:#ffffff !important; }
  .btn-safe  { background:#047857; color:#ffffff !important; }
  .mail.locked { opacity:.85; }
  .verdict { margin-top:8px; font-size:.92rem; padding:8px 10px; border-radius:8px; font-weight:600; }
  .verdict.ok { background:#a7f3d0; color:#064e3b !important; border:1px solid #047857; }
  .verdict.ok b { color:#064e3b !important; font-weight:800; }
  .verdict.bad { background:#fecaca; color:#7f1d1d !important; border:1px solid #b91c1c; }
  .verdict.bad b { color:#7f1d1d !important; font-weight:800; }
  /* Password forge */
  .forge { display:flex; flex-direction:column; gap:10px; margin-top:10px; }
  .forge input { padding:10px 12px; border:2px solid #475569; border-radius:8px; font-size:1rem; font-family:monospace; background:#ffffff; color:#000000 !important; font-weight:600; }
  .strength { height:14px; border-radius:8px; background:#cbd5e1; overflow:hidden; border:1px solid #94a3b8; }
  .strength > div { height:100%; width:0%; transition:width .25s, background .25s; background:#b91c1c; }
  .checks { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:6px; font-size:.9rem; }
  .check { padding:6px 10px; border-radius:8px; background:#e2e8f0; color:#000000 !important; font-weight:600; border:1px solid #94a3b8; }
  .check.ok { background:#a7f3d0; color:#064e3b !important; border-color:#047857; font-weight:700; }
  #pw-verdict { color:#000000 !important; font-size:1.05rem; }
  /* Match game */
  .match { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-top:10px; }
  .col h4 { margin:0 0 6px; color:#000000 !important; font-weight:800; font-size:1rem; }
  .item { padding:10px; background:#e2e8f0; border-radius:8px; margin-bottom:8px; cursor:pointer; user-select:none; transition:transform .1s; color:#000000 !important; font-weight:600; border:1px solid #94a3b8; }
  .item:hover { transform:translateY(-1px); background:#cbd5e1; }
  .item.selected { outline:3px solid #f59e0b; background:#fef3c7; }
  .item.matched { background:#a7f3d0; color:#064e3b !important; cursor:default; border-color:#047857; font-weight:700; }
  .item.miss { background:#fecaca; color:#7f1d1d !important; border-color:#b91c1c; }
  .scorebar { display:flex; gap:12px; align-items:center; margin-top:12px; font-size:.95rem; color:#000000 !important; }
  .scorebar span, .scorebar b { color:#000000 !important; font-weight:700; }
  .scorebar .meter { flex:1; height:10px; background:#cbd5e1; border-radius:6px; overflow:hidden; }
  .scorebar .fill { height:100%; background:linear-gradient(90deg,#047857,#1d4ed8,#5b21b6); width:0%; transition:width .3s; }
  .scorebar button { background:#cbd5e1 !important; color:#000000 !important; font-weight:700; }
  .badge { display:inline-block; margin-top:8px; padding:6px 14px; border-radius:999px; background:#000000; color:#ffffff !important; font-weight:800; }
  .ap-tip { background:#bfdbfe; border-left:4px solid #1d4ed8; padding:10px 14px; border-radius:8px; font-size:.95rem; margin-top:10px; color:#000000 !important;}
  .ap-tip b, .ap-tip i { color:#000000 !important; }
  .howto { background:#fde68a; border-left:4px solid #b45309; padding:10px 14px; border-radius:8px; font-size:.95rem; color:#000000 !important; margin:8px 0 12px; }
  .howto b, .howto i { color:#000000 !important; }
  .howto .label { display:inline-block; background:#b45309; color:#ffffff !important; font-weight:800; font-size:.78rem; padding:2px 8px; border-radius:999px; margin-right:8px; vertical-align:middle; letter-spacing:.05em; }
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

<div class="sc-intro">
  <h2>What is Safe Computing?</h2>
  <ul>
    <li><b>The core idea:</b> Safe computing is the combination of <i>habits</i> (skepticism, good passwords, careful sharing) and <i>technology</i> (encryption, MFA, anti-malware) that protects your data, identity, and devices from attackers.</li>
    <li><b>PII (Personally Identifiable Information):</b> Any data that could uniquely identify you — full name, address, SSN, date of birth, school ID, biometric data. The fewer places it lives, the smaller the attack surface. Treat PII like cash: only share it when absolutely necessary.</li>
    <li><b>Phishing:</b> Fake messages (email, text, DM) that impersonate trusted senders to trick you into clicking malicious links, entering credentials on fake sites, or sending money. Red flags: urgency, generic greetings, mismatched domains, unexpected attachments.</li>
    <li><b>Malware:</b> Software designed to harm or exploit. <i>Viruses</i> attach to files, <i>worms</i> spread by themselves, <i>trojans</i> hide inside legit-looking apps, and <i>ransomware</i> encrypts your files and demands payment to unlock them.</li>
    <li><b>Strong authentication:</b> Long unique passwords (12+ characters, mixed types) stop guessing. <b>MFA</b> (multi-factor authentication) adds a second proof — something you have (phone, key) or are (fingerprint) — and blocks ~99% of automated account attacks even if your password leaks.</li>
    <li><b>Encryption:</b> Scrambles data so only the holder of the right key can read it. <i>Symmetric</i> uses one shared key (fast, used after a connection is set up). <i>Public-key (asymmetric)</i> uses a public key to encrypt and a private key to decrypt — this is what powers HTTPS, digital signatures, and secure messaging.</li>
    <li><b>Why it's on the AP exam:</b> Big Idea 4 tests cybersecurity (HTTPS, encryption, authentication) and Big Idea 5 tests the ethical/legal/social impacts (privacy, PII, digital footprint). Expect MCQs on identifying threats and FRQs on explaining defenses.</li>
  </ul>
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
  <p>Inspect 4 emails and decide which are scams.</p>
  <div class="howto">
    <span class="label">HOW TO PLAY</span>
    For each email, read the <b>sender</b>, <b>subject</b>, and <b>body</b>. Click <span style="color:#7f1d1d;font-weight:800;">Phish</span> if it looks like a scam, or <span style="color:#064e3b;font-weight:800;">Safe</span> if legit. The verdict and explanation appear instantly. <b>Watch for:</b> urgency, weird domains, prize bait, "verify your account" demands.
  </div>
  <div class="inbox" id="inbox"></div>
</div>

<div class="sc-card">
  <h2>Mini-game 2 — Password Forge</h2>
  <p>Build a password that satisfies all 6 strength rules.</p>
  <div class="howto">
    <span class="label">HOW TO PLAY</span>
    Type any password into the box. The <b>strength bar</b> grows from red → blue → green as you hit more rules. Each satisfied rule lights up. <b>Goal:</b> turn every check green for "Fortress-grade." Try a passphrase like <code>Pizza-Time-2026!</code>.
  </div>
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
  <p>Pair each cyber threat with the right defense.</p>
  <div class="howto">
    <span class="label">HOW TO PLAY</span>
    <b>1.</b> Click a threat on the <b>left</b> (yellow outline = selected). <b>2.</b> Click the matching defense on the <b>right</b>. Right answers turn green and lock in; wrong answers flash red. <b>Goal:</b> match all 6 to earn the Cyber Defender badge.
  </div>
  <div class="match">
    <div class="col"><h4>Threats / Terms</h4><div id="left"></div></div>
    <div class="col"><h4>Defenses / Definitions</h4><div id="right"></div></div>
  </div>
  <div class="scorebar">
    <span><b id="m-score">0</b> / <span id="m-total">0</span></span>
    <div class="meter"><div class="fill" id="m-fill"></div></div>
    <button onclick="resetMatch()" style="background:#cbd5e1;color:#000000;border:0;padding:6px 12px;border-radius:6px;cursor:pointer;font-weight:700;">Reset</button>
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
