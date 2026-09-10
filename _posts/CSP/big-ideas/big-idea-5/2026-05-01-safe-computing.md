---
layout: post
title: Safe Computing — Inbox Defense
description: A 5-minute gamified AP CSP lesson on safe computing. Identify phishing attacks, match risks to defenses, and earn a Security Pro badge.
breadcrumbs: True
permalink: /csp/big-idea-5/safe-computing/
authors: Aditya, Aaryav
toc: true
comments: false
---

<style>
  .sc-wrap { font-family: "Segoe UI", Tahoma, sans-serif; max-width: 900px; margin: 0 auto; color: #0f172a; }
  .sc-wrap p, .sc-wrap li, .sc-wrap ol, .sc-wrap ul, .sc-wrap small, .sc-wrap code, .sc-wrap i, .sc-wrap b, .sc-wrap span, .sc-wrap div { color: inherit; }
  .sc-hero { background: linear-gradient(135deg,#dc2626,#7c3aed); color:#ffffff !important; border-radius:18px; padding:22px 26px; box-shadow:0 8px 24px rgba(0,0,0,.18); }
  .sc-hero h1, .sc-hero p, .sc-hero span { color:#ffffff !important; }
  .sc-hero h1 { margin:0 0 6px; font-size:1.7rem; }
  .sc-hero p { margin:0; opacity:.95; }
  .sc-pills { display:flex; gap:10px; flex-wrap:wrap; margin-top:12px; }
  .sc-pill { background:rgba(255,255,255,.22); border:1px solid rgba(255,255,255,.55); padding:4px 12px; border-radius:999px; font-size:.85rem; color:#ffffff !important; }
  .sc-intro { background:#0f172a; color:#f8fafc !important; border-radius:14px; padding:16px 20px; margin:16px 0; box-shadow:0 2px 10px rgba(0,0,0,.18); }
  .sc-intro h2 { color:#fbbf24 !important; margin:0 0 8px; font-size:1.15rem; }
  .sc-intro ul { margin:6px 0 0 20px; padding:0; }
  .sc-intro li { color:#f8fafc !important; margin:4px 0; line-height:1.45; }
  .sc-intro li b { color:#fbbf24 !important; }
  .sc-card { background:#ffffff; border:1px solid #cbd5e1; border-radius:14px; padding:18px 20px; margin:16px 0; box-shadow:0 2px 10px rgba(0,0,0,.08); color:#000000 !important; }
  .sc-card h2, .sc-card h3, .sc-card h4, .sc-card p, .sc-card li, .sc-card ol, .sc-card ul, .sc-card small, .sc-card i, .sc-card b, .sc-card span, .sc-card div, .sc-card label { color:#000000 !important; }
  .sc-card code { color:#000000 !important; background:#e2e8f0; padding:1px 6px; border-radius:4px; font-weight:600; }
  .sc-card h2 { margin:0 0 8px; font-size:1.25rem; font-weight:800; color:#000000 !important; border-bottom:2px solid #cbd5e1; padding-bottom:6px; }
  .sc-grid2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .sc-box { border-radius:12px; padding:14px; color:#000000 !important; }
  .sc-box, .sc-box * { color:#000000 !important; }
  .sc-safe { background:#d1fae5; border:2px solid #047857; }
  .sc-safe h3 { color:#064e3b !important; font-weight:800 !important; }
  .sc-danger { background:#fee2e2; border:2px solid #dc2626; }
  .sc-danger h3 { color:#7f1d1d !important; font-weight:800 !important; }
  .howto { background:#dbeafe; border-left:4px solid #1d4ed8; padding:10px 14px; border-radius:8px; font-size:.95rem; color:#000000 !important; margin:8px 0 12px; }
  .howto b, .howto i { color:#000000 !important; }
  .howto .label { display:inline-block; background:#1d4ed8; color:#ffffff !important; font-weight:800; font-size:.78rem; padding:2px 8px; border-radius:999px; margin-right:8px; vertical-align:middle; letter-spacing:.05em; }
  .ap-tip { background:#fde68a; border-left:4px solid #b45309; padding:10px 14px; border-radius:8px; font-size:.95rem; color:#000000 !important; }
  .ap-tip b, .ap-tip i { color:#000000 !important; }
  /* Inbox game */
  .inbox { margin-top:12px; }
  .msg { background:#f8fafc; border:2px solid #cbd5e1; border-radius:10px; padding:12px 16px; margin:8px 0; transition:border-color .2s; }
  .msg-from { font-weight:700; font-size:.95rem; }
  .msg-subject { font-size:.9rem; margin:4px 0; }
  .msg-body { font-size:.85rem; color:#475569 !important; }
  .msg-btns { display:flex; gap:8px; margin-top:8px; }
  .msg-btns button { border:0; padding:7px 14px; border-radius:6px; cursor:pointer; font-weight:700; font-size:.85rem; }
  .btn-safe { background:#d1fae5; color:#047857 !important; border:2px solid #047857 !important; }
  .btn-safe:hover { background:#a7f3d0; }
  .btn-phish { background:#fee2e2; color:#dc2626 !important; border:2px solid #dc2626 !important; }
  .btn-phish:hover { background:#fecaca; }
  .msg.correct { border-color:#047857; background:#ecfdf5; }
  .msg.wrong { border-color:#dc2626; background:#fef2f2; }
  .msg .feedback { font-size:.82rem; margin-top:6px; padding:6px 10px; border-radius:6px; font-weight:600; }
  .msg .feedback.ok { background:#d1fae5; color:#047857 !important; }
  .msg .feedback.bad { background:#fee2e2; color:#dc2626 !important; }
  .scorebar { display:flex; gap:12px; align-items:center; margin-top:12px; font-size:.95rem; color:#000000 !important; }
  .scorebar span, .scorebar b { color:#000000 !important; font-weight:700; }
  .scorebar .meter { flex:1; height:10px; background:#cbd5e1; border-radius:6px; overflow:hidden; }
  .scorebar .fill { height:100%; background:linear-gradient(90deg,#047857,#7c3aed); width:0%; transition:width .3s; }
  .badge { display:inline-block; margin-top:8px; padding:6px 14px; border-radius:999px; background:#000000; color:#ffffff !important; font-weight:800; }
  /* Match game */
  .match-pool { display:flex; flex-wrap:wrap; gap:8px; margin:10px 0; }
  .match-chip { background:#0f172a; color:#ffffff !important; padding:8px 14px; border-radius:8px; cursor:pointer; user-select:none; font-weight:700; font-size:.85rem; transition:transform .1s; }
  .match-chip:hover { transform:translateY(-2px); }
  .match-chip.selected { outline:3px solid #eab308; }
  .match-chip.placed { opacity:.35; pointer-events:none; }
  .match-slots { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:10px; }
  .match-slot { border:2px dashed #475569; border-radius:10px; padding:10px 14px; cursor:pointer; min-height:50px; }
  .match-slot .slot-label { font-weight:700; font-size:.9rem; margin-bottom:4px; }
  .match-slot .slot-answer { font-size:.85rem; font-weight:600; padding:4px 10px; border-radius:6px; display:inline-block; }
  .match-slot .slot-answer.ok { background:#047857; color:#ffffff !important; }
  .match-slot .slot-answer.bad { background:#b91c1c; color:#ffffff !important; }
  .match-slot.filled { border-style:solid; }
  @media (max-width:640px){ .sc-grid2, .match-slots { grid-template-columns:1fr; } }
</style>

<div class="sc-wrap">

<div class="sc-hero">
  <h1>Safe Computing: Inbox Defense</h1>
  <p>AP CSP Big Idea 5.6 &middot; ~5 minute lesson &middot; Risks, defenses, and phishing</p>
  <div class="sc-pills">
    <span class="sc-pill">Earn Security Pro Badge</span>
    <span class="sc-pill">2 mini-games</span>
    <span class="sc-pill">Exam-ready</span>
  </div>
</div>

<div class="sc-intro">
  <h2>Key Concepts</h2>
  <ul>
    <li><b>PII (Personally Identifiable Information):</b> Data that can identify a person — name, location, medical records, SSN, biometrics.</li>
    <li><b>Phishing:</b> Fake messages designed to trick you into revealing private info. Look for urgency, suspicious links, and requests for credentials.</li>
    <li><b>Malware:</b> Software built to damage or spy — keyloggers, ransomware, viruses.</li>
    <li><b>Encryption:</b> Scrambles data so only authorized parties can read it. HTTPS encrypts web traffic.</li>
    <li><b>Multifactor Authentication (MFA):</b> Requires 2+ forms of proof (password + phone code). A stolen password alone won't grant access.</li>
    <li><b>AP exam angle:</b> You'll match a <i>risk</i> to the correct <i>defense</i>. A defense <i>reduces</i> risk — it rarely eliminates it entirely.</li>
  </ul>
</div>

<div class="sc-card">
  <h2>Risks vs. Defenses at a Glance</h2>
  <div class="sc-grid2">
    <div class="sc-box sc-danger">
      <h3>Common Risks</h3>
      <ul style="margin:6px 0 0 16px;padding:0;">
        <li>Stolen passwords</li>
        <li>Phishing emails</li>
        <li>Public Wi-Fi snooping</li>
        <li>Unpatched software</li>
        <li>Over-sharing PII online</li>
      </ul>
    </div>
    <div class="sc-box sc-safe">
      <h3>Defenses</h3>
      <ul style="margin:6px 0 0 16px;padding:0;">
        <li>Multifactor authentication</li>
        <li>Verify sender before clicking</li>
        <li>Use HTTPS / VPN</li>
        <li>Install updates promptly</li>
        <li>Limit what you share publicly</li>
      </ul>
    </div>
  </div>
  <p class="ap-tip" style="margin-top:12px"><b>AP tip:</b> A defense <i>reduces</i> risk. It does not eliminate all risk. The exam loves this distinction.</p>
</div>

<div class="sc-card">
  <h2>Mini-game 1 — Inbox Triage</h2>
  <p>You just got 5 messages. For each one, decide: is it <b>safe</b> or <b>phishing</b>?</p>
  <div class="howto">
    <span class="label">HOW TO PLAY</span>
    Read each message and click <b>Safe</b> or <b>Phishing</b>. You'll get instant feedback and a score at the end.
  </div>
  <div class="inbox" id="inbox"></div>
  <div class="scorebar">
    <span><b id="inbox-score">0</b> / 5</span>
    <div class="meter"><div class="fill" id="inbox-fill"></div></div>
    <button onclick="resetInbox()" style="background:#cbd5e1;color:#000000;border:0;padding:6px 12px;border-radius:6px;cursor:pointer;font-weight:700;">Reset</button>
  </div>
  <div id="inbox-badge"></div>
</div>

<div class="sc-card">
  <h2>Mini-game 2 — Match Risk to Defense</h2>
  <p>Select a defense from the pool, then click the risk it protects against.</p>
  <div class="howto">
    <span class="label">HOW TO PLAY</span>
    <b>1.</b> Click a defense chip (yellow outline appears). <b>2.</b> Click the matching risk slot to place it. Green = correct, red = wrong.
  </div>
  <div class="match-pool" id="match-pool"></div>
  <div class="match-slots" id="match-slots"></div>
  <div class="scorebar" style="margin-top:12px;">
    <span><b id="match-score">0</b> / 4</span>
    <div class="meter"><div class="fill" id="match-fill"></div></div>
    <button onclick="resetMatch()" style="background:#cbd5e1;color:#000000;border:0;padding:6px 12px;border-radius:6px;cursor:pointer;font-weight:700;">Reset</button>
  </div>
  <div id="match-badge"></div>
</div>

<div class="sc-card">
  <h2>Lock it in</h2>
  <ol>
    <li>A website asks for your SSN to "verify your prize." Risk? <i>(Phishing — never give PII to unverified sources)</i></li>
    <li>Why is MFA safer than a password alone? <i>(Even if the password is stolen, the attacker lacks the second factor)</i></li>
    <li>Your friend posts their phone number publicly. What's the risk? <i>(PII exposure — could enable identity theft or spam)</i></li>
  </ol>
</div>

</div>

<script>
(function(){
  // ===== GAME 1: Inbox Triage =====
  const messages = [
    { from:"noreply@school.edu", subject:"Wi-Fi password update", body:"The campus Wi-Fi password has changed. Ask your teacher for the new one during class.", phish:false, explain:"Legit — it directs you to ask in person, not click a link." },
    { from:"security@bankk-alerts.com", subject:"URGENT: Account suspended!", body:"Your account will be closed in 24 hours. Click here immediately and enter your password to verify.", phish:true, explain:"Phishing — urgency, misspelled domain, asks for password via link." },
    { from:"teacher@school.edu", subject:"Homework reminder", body:"Don't forget the reading quiz is due Friday. See the class page for details.", phish:false, explain:"Legit — no links, no urgency, normal school communication." },
    { from:"support@amaz0n-deals.net", subject:"You won a $500 gift card!", body:"Congratulations! Enter your name, address, and credit card to claim your prize now.", phish:true, explain:"Phishing — fake domain, too-good-to-be-true offer, asks for PII and payment info." },
    { from:"irs-refund@tax-claims.biz", subject:"Tax refund pending", body:"We owe you $3,200. Provide your SSN and bank routing number to receive your refund today.", phish:true, explain:"Phishing — the IRS never emails for SSN. Suspicious domain, requests sensitive PII." }
  ];

  let inboxAnswered = 0, inboxCorrect = 0;

  function buildInbox(){
    const el = document.getElementById('inbox');
    el.innerHTML = '';
    inboxAnswered = 0; inboxCorrect = 0;
    updateInboxScore();
    document.getElementById('inbox-badge').innerHTML = '';
    messages.forEach((m,i) => {
      const div = document.createElement('div');
      div.className = 'msg';
      div.id = 'msg-'+i;
      div.innerHTML = `<div class="msg-from">${m.from}</div><div class="msg-subject"><b>${m.subject}</b></div><div class="msg-body">${m.body}</div><div class="msg-btns"><button class="btn-safe" onclick="answerMsg(${i},false)">Safe</button><button class="btn-phish" onclick="answerMsg(${i},true)">Phishing</button></div>`;
      el.appendChild(div);
    });
  }

  window.answerMsg = function(i, guessPhish){
    const m = messages[i];
    const div = document.getElementById('msg-'+i);
    if(div.classList.contains('correct') || div.classList.contains('wrong')) return;
    const correct = (guessPhish === m.phish);
    div.classList.add(correct ? 'correct' : 'wrong');
    div.querySelector('.msg-btns').style.display='none';
    const fb = document.createElement('div');
    fb.className = 'feedback ' + (correct ? 'ok' : 'bad');
    fb.textContent = (correct ? 'Correct! ' : 'Wrong! ') + m.explain;
    div.appendChild(fb);
    inboxAnswered++;
    if(correct) inboxCorrect++;
    updateInboxScore();
    if(inboxAnswered === 5 && inboxCorrect === 5){
      document.getElementById('inbox-badge').innerHTML = '<span class="badge">Phishing Expert Badge Earned!</span>';
    }
  };

  function updateInboxScore(){
    document.getElementById('inbox-score').textContent = inboxCorrect;
    document.getElementById('inbox-fill').style.width = (inboxCorrect/5*100)+'%';
  }

  window.resetInbox = buildInbox;
  buildInbox();

  // ===== GAME 2: Match Risk to Defense =====
  const pairs = [
    { risk:"Stolen password", defense:"Multifactor authentication" },
    { risk:"Phishing email", defense:"Verify the sender" },
    { risk:"Public Wi-Fi snooping", defense:"Use HTTPS / VPN" },
    { risk:"Unpatched software bug", defense:"Install updates" }
  ];

  let selectedDefense = null, matchCorrect = 0, matchAnswered = 0;

  function shuffled(arr){ return [...arr].sort(()=>Math.random()-0.5); }

  function buildMatch(){
    selectedDefense = null; matchCorrect = 0; matchAnswered = 0;
    document.getElementById('match-badge').innerHTML = '';
    updateMatchScore();
    const pool = document.getElementById('match-pool');
    const slots = document.getElementById('match-slots');
    pool.innerHTML = ''; slots.innerHTML = '';
    const defenses = shuffled(pairs);
    defenses.forEach((p,i) => {
      const chip = document.createElement('span');
      chip.className = 'match-chip';
      chip.textContent = p.defense;
      chip.dataset.idx = i;
      chip.dataset.defense = p.defense;
      chip.onclick = function(){ selectDefense(this); };
      pool.appendChild(chip);
    });
    const risks = shuffled(pairs);
    risks.forEach((p) => {
      const slot = document.createElement('div');
      slot.className = 'match-slot';
      slot.dataset.risk = p.risk;
      slot.dataset.answer = p.defense;
      slot.innerHTML = `<div class="slot-label">${p.risk}</div>`;
      slot.onclick = function(){ placeDefense(this); };
      slots.appendChild(slot);
    });
  }

  function selectDefense(chip){
    if(chip.classList.contains('placed')) return;
    document.querySelectorAll('.match-chip').forEach(c=>c.classList.remove('selected'));
    chip.classList.add('selected');
    selectedDefense = chip;
  }

  function placeDefense(slot){
    if(!selectedDefense || slot.classList.contains('filled')) return;
    const correct = (selectedDefense.dataset.defense === slot.dataset.answer);
    slot.classList.add('filled');
    const ans = document.createElement('span');
    ans.className = 'slot-answer ' + (correct ? 'ok' : 'bad');
    ans.textContent = selectedDefense.dataset.defense + (correct ? ' ✓' : ' ✗');
    slot.appendChild(ans);
    selectedDefense.classList.add('placed');
    selectedDefense.classList.remove('selected');
    selectedDefense = null;
    matchAnswered++;
    if(correct) matchCorrect++;
    updateMatchScore();
    if(matchAnswered === 4 && matchCorrect === 4){
      document.getElementById('match-badge').innerHTML = '<span class="badge">Security Pro Badge Earned!</span>';
    }
  }

  window.selectDefense = selectDefense;
  window.placeDefense = placeDefense;

  function updateMatchScore(){
    document.getElementById('match-score').textContent = matchCorrect;
    document.getElementById('match-fill').style.width = (matchCorrect/4*100)+'%';
  }

  window.resetMatch = buildMatch;
  buildMatch();
})();
</script>
