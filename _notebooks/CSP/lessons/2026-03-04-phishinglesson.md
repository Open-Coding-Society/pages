---
layout: post
title: 5.6 Safe Computing
description: IOC-2 — threats, defenses, and encryption
type: lessons
permalink: /phishing
---
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<title>Phishing Lesson + Security Training Game</title>
<style>
/* ---------- Lesson styles (from second part) ---------- */
.sc-pill{display:inline-block;font-size:11px;font-weight:500;padding:2px 8px;border-radius:20px}
.sc-label{font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#c4bbf0;margin-bottom:12px}
.sc-tab{padding:7px 14px;border-radius:20px;border:none;background:#1e1c45;cursor:pointer;font-size:13px;font-weight:500;color:#c4bbf0;transition:all .15s}
.sc-tab.active{background:#534AB7;color:#ffffff}
.sc-section{display:none}
.sc-section.active{display:block}
.sc-threat-btn{width:100%;text-align:left;background:#2a2660;border:1px solid #4a45a0;border-radius:8px;padding:12px 16px;cursor:pointer;display:flex;align-items:center;gap:12px;transition:background .15s;margin-bottom:6px}
.sc-threat-btn:hover{background:#332f75}
.sc-threat-btn.active{border-color:#a09af0;background:#332f75}
.sc-threat-body{display:none;margin-bottom:6px;border:1px solid #4a45a0;border-radius:0 0 8px 8px;padding:16px;background:#1a1840}
.sc-threat-body.open{display:block}
.sc-layer-row{display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:8px;border:1px solid #4a45a0;margin-bottom:6px;cursor:pointer;transition:background .15s;background:#2a2660}
.sc-layer-row:hover{background:#332f75}
.sc-layer-row.active{border-color:#a09af0;border-radius:8px 8px 0 0;margin-bottom:0}
.sc-layer-detail{display:none;font-size:13px;color:#e8e4ff;line-height:1.6;padding:12px 16px 14px 48px;background:#1a1840;border:1px solid #4a45a0;border-top:none;border-radius:0 0 8px 8px;margin-bottom:6px}
.sc-layer-detail.open{display:block}
.sc-quiz-q{padding:14px 16px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:8px;border-bottom:1px solid #4a45a0;background:#2a2660;transition:background .15s}
.sc-quiz-q:hover{background:#332f75}
.sc-quiz-a{display:none;padding:14px 16px;font-size:14px;line-height:1.6;color:#e8e4ff;background:#1a1840;border-bottom:1px solid #4a45a0}
.sc-quiz-a.open{display:block}
.sc-chevron{transition:transform .2s;flex-shrink:0}

/* ---------- Game styles (from first part) ---------- */
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Barlow+Condensed:wght@400;700;900&display=swap');

* { box-sizing: border-box; user-select: none; -webkit-tap-highlight-color: transparent; }

body {
  margin: 0;
  padding: 24px 16px;
  background: #c8dce8;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  font-family: 'Barlow Condensed', system-ui, sans-serif;
}

#mainContainer {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Lesson card wrapper */
.lesson-card {
  background: #13122e;
  border-radius: 24px;
  padding: 20px 24px;
  box-shadow: 0 8px 28px rgba(0,0,0,0.2);
}

/* Game root unchanged */
#gameRoot {
  width: 100%;
  background: #d4e8f0;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 8px 32px rgba(0,0,0,.18);
}

canvas {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 900 / 420;
  cursor: crosshair;
}

/* Info bar */
#infoBar {
  padding: 10px 16px 12px;
  background: #e8f4facc;
  border-bottom: 1px solid #90b8cc;
  min-height: 70px;
  transition: background .3s;
}
#infoBar.safe    { background: #d0f0e0cc; border-bottom-color: #60b080; }
#infoBar.danger  { background: #f5ddd8cc; border-bottom-color: #c07060; }

#infoTitle {
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 2px;
  color: #2a6080;
  margin-bottom: 4px;
  font-family: 'Share Tech Mono', monospace;
}
#infoTitle.safe   { color: #1a7040; }
#infoTitle.danger { color: #b03030; }

#infoBody {
  font-size: 13px;
  color: #2a4a5a;
  line-height: 1.5;
  max-width: 700px;
}

#infoTip {
  font-size: 11px;
  color: #5a8a9a;
  margin-top: 4px;
  font-family: 'Share Tech Mono', monospace;
  letter-spacing: .3px;
}

/* HUD */
#hud {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: #b8d4e0;
  border-top: 1px solid #90b8cc;
  flex-wrap: wrap;
  gap: 8px;
}

.stat {
  font-size: 13px;
  color: #2a5a70;
  letter-spacing: .5px;
  font-family: 'Share Tech Mono', monospace;
}
.stat span       { color: #0a3a50; font-size: 16px; margin-left: 6px; }
.stat.bad span   { color: #c03030; }
.stat.good span  { color: #207840; }

#resetBtn {
  background: #e8f4fa;
  border: 1px solid #70a8c0;
  color: #1a5070;
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 1px;
  padding: 5px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: .15s;
}
#resetBtn:hover { background: #c8e4f4; color: #0a3050; }

/* Modal */
#modal {
  position: absolute;
  inset: 0;
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(180,210,225,.85);
  z-index: 10;
  backdrop-filter: blur(2px);
}
#modal.show { display: flex; }

#modalBox {
  background: #fff;
  border: 1px solid #d06060;
  border-radius: 8px;
  padding: 20px 24px;
  max-width: 440px;
  width: 90%;
  animation: popIn .18s ease-out;
  box-shadow: 0 4px 24px rgba(0,0,0,.12);
}
@keyframes popIn {
  from { transform: scale(.92); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}

#modalHeader {
  font-size: 11px;
  letter-spacing: 3px;
  color: #c04040;
  font-family: 'Share Tech Mono', monospace;
  margin-bottom: 6px;
}
#modalThreatName {
  font-size: 26px;
  font-weight: 900;
  color: #2a2a2a;
  letter-spacing: 1px;
  margin-bottom: 4px;
}
#modalTagline {
  font-size: 13px;
  color: #707070;
  margin-bottom: 10px;
  font-style: italic;
}
#modalExplain {
  font-size: 13px;
  color: #3a3a3a;
  line-height: 1.55;
  margin-bottom: 12px;
  border-left: 3px solid #d06060;
  padding-left: 12px;
}
#modalPrompt {
  font-size: 13px;
  font-weight: 700;
  color: #2a2a2a;
  margin-bottom: 12px;
  letter-spacing: .3px;
}
.mc-line {
  font-family: 'Share Tech Mono', monospace;
  font-size: 11px;
  color: #803030;
  background: #fdf0f0;
  border-radius: 4px;
  padding: 8px 12px;
  margin-bottom: 12px;
  line-height: 1.5;
  border-left: 3px solid #e06060;
}

.modal-btns { display: flex; gap: 10px; }
.modal-btns button {
  flex: 1;
  padding: 9px 0;
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 900;
  font-size: 14px;
  letter-spacing: 1px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: .12s;
}
#btnGiveIn { background: #d04040; color: #fff; }
#btnGiveIn:hover { background: #e85050; }
#btnReject { background: #e8f8f0; color: #1a6040; border: 1px solid #60b080; }
#btnReject:hover { background: #c8ecd8; }

/* Responsive */
@media (max-width: 700px) {
  .lesson-card { padding: 16px; }
  body { padding: 16px; }
}
</style>
</head>
<body>
<div id="mainContainer">

  <!-- LESSON SECTION (from second code, unchanged) -->
  <div class="lesson-card">
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
      <h2 style="color:#ffffff; margin-top:0; margin-bottom:8px;">5.6 Safe Computing</h2>
      <p style="color:#c4bbf0; margin-bottom:20px; font-size:14px;">Knowing <em>what</em> PII is (from 5.5) is only half the picture. Now we look at <strong>how it gets stolen</strong>, <strong>how systems get compromised</strong>, and <strong>how to defend against it</strong> — all part of College Board's IOC-2 standards.</p>
      <div id="sc-root" style="background:#13122e;border-radius:16px;padding:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
        <div style="display:flex;gap:8px;margin-bottom:24px;flex-wrap:wrap" id="sc-nav">
          <button class="sc-tab active" data-tab="sc-threats">Threats</button>
          <button class="sc-tab" data-tab="sc-defense">Defense layers</button>
          <button class="sc-tab" data-tab="sc-encryption">Encryption</button>
          <button class="sc-tab" data-tab="sc-quiz">Knowledge check</button>
        </div>

        <!-- THREATS -->
        <div id="sc-threats" class="sc-section active">
          <p class="sc-label">IOC-2.C — how attackers get in</p>
          <div id="sc-threat-list"></div>
        </div>

        <!-- DEFENSE -->
        <div id="sc-defense" class="sc-section">
          <p class="sc-label">IOC-2.B — defense in depth</p>
          <p style="font-size:14px;color:#e8e4ff;margin-bottom:16px;line-height:1.6">Good security is layered — if one fails, the next holds. Click each layer to expand.</p>
          <div id="sc-layer-list"></div>
        </div>

        <!-- ENCRYPTION -->
        <div id="sc-encryption" class="sc-section">
          <p class="sc-label">IOC-2.B.5 — encryption types</p>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;margin-bottom:20px">
            <div style="background:#2a2660;border:1px solid #4a45a0;border-radius:12px;padding:16px 20px">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px"><div style="width:32px;height:32px;border-radius:8px;background:#332f75;display:flex;align-items:center;justify-content:center;font-size:16px">🔐</div><span style="font-weight:600;font-size:15px;color:#ffffff">Symmetric</span><span class="sc-pill" style="background:#332f75;color:#e8e4ff;margin-left:auto">1 key</span></div>
              <p style="font-size:13px;color:#e8e4ff;line-height:1.6;margin-bottom:12px">One shared key handles both encryption and decryption. Fast and efficient, but both parties must securely share the key beforehand.</p>
              <div style="display:flex;align-items:center;gap:6px;font-size:12px;flex-wrap:wrap"><span style="background:#332f75;border-radius:4px;padding:2px 8px;color:#e8e4ff">Sender</span><span style="color:#c4bbf0">— key →</span><span style="background:#332f75;border-radius:4px;padding:2px 8px;color:#e8e4ff">encrypt</span><span style="color:#c4bbf0">— key →</span><span style="background:#332f75;border-radius:4px;padding:2px 8px;color:#e8e4ff">decrypt</span></div>
            </div>
            <div style="background:#2a2660;border:2px solid #a09af0;border-radius:12px;padding:16px 20px">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px"><div style="width:32px;height:32px;border-radius:8px;background:#332f75;display:flex;align-items:center;justify-content:center;font-size:16px">🔑</div><span style="font-weight:600;font-size:15px;color:#ffffff">Public key</span><span class="sc-pill" style="background:#332f75;color:#e8e4ff;margin-left:auto">2 keys</span></div>
              <p style="font-size:13px;color:#e8e4ff;line-height:1.6;margin-bottom:12px">A public key encrypts, a private key decrypts. Anyone can encrypt a message for you — only you can read it with your private key.</p>
              <div style="display:flex;align-items:center;gap:6px;font-size:12px;flex-wrap:wrap"><span style="background:#332f75;border-radius:4px;padding:2px 8px;color:#e8e4ff">public key</span><span style="color:#c4bbf0">→ encrypt</span><span style="color:#c4bbf0;margin:0 2px">·</span><span style="background:#332f75;border-radius:4px;padding:2px 8px;color:#e8e4ff">private key</span><span style="color:#c4bbf0">→ decrypt</span></div>
            </div>
          </div>
          <div style="background:#2a2660;border-left:3px solid #a09af0;padding:14px 18px;border-radius:4px"><p style="font-weight:600;font-size:14px;color:#ffffff;margin-bottom:6px">Certificate authorities (CAs)</p><p style="font-size:13px;color:#e8e4ff;line-height:1.6">CAs issue digital certificates that prove a public key genuinely belongs to who claims to own it. This trust model is what makes HTTPS work — your browser checks the certificate before trusting the connection.</p></div>
        </div>

        <!-- QUIZ -->
        <div id="sc-quiz" class="sc-section">
          <p class="sc-label">5 questions — click to reveal</p>
          <div id="sc-quiz-list" style="border:1px solid #4a45a0;border-radius:12px;overflow:hidden"></div>
          <div id="sc-score-bar" style="display:none;margin-top:16px;padding:14px 16px;background:#2a2660;border-radius:8px;font-size:14px;color:#e8e4ff;border:1px solid #4a45a0"></div>
        </div>
      </div>

      <div style="margin-top: 20px; border-top: 1px solid #4a45a0; padding-top: 16px;">
        <p style="font-size:13px; color:#c4bbf0; margin:0;"><strong>Key Vocabulary</strong> — Phishing, Keylogging, Rogue access point, Malware, Virus, MFA, Symmetric encryption, Public key encryption, Certificate authority.<br>Remember: Security isn't about being paranoid — it's about being intentional.</p>
      </div>
    </div>
  </div>

  <!-- GAME SECTION (first code unchanged, exactly as provided) -->
  <div id="gameRoot">
    <div id="infoBar">
      <div id="infoTitle">PHISHING LAKE — SECURITY TRAINING</div>
      <div id="infoBody">Click on fish to intercept threats. Red fish carry cyberattacks — green fish are safe behaviors. React fast before threats swim past.</div>
      <div id="infoTip">TIP: Real phishers use urgency, fear, and fake authority to steal your data.</div>
    </div>
    <canvas id="gc" width="900" height="420"></canvas>
    <div id="hud">
      <div class="stat good">SECURE <span id="ss">0</span></div>
      <div class="stat bad">BREACHED <span id="bs">0</span></div>
      <button id="resetBtn">NEW SESSION</button>
    </div>
    <div id="modal">
      <div id="modalBox">
        <div id="modalHeader">THREAT INTERCEPTED</div>
        <div id="modalThreatName"></div>
        <div id="modalTagline"></div>
        <div id="modalExplain"></div>
        <div class="mc-line" id="mcLine"></div>
        <div id="modalPrompt"></div>
        <div class="modal-btns">
          <button id="btnGiveIn">Hand Over PII</button>
          <button id="btnReject">Reject &amp; Report</button>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
// ---------- LESSON SCRIPT (exactly from second part) ----------
(function(){
  var threats=[
    {icon:"🎣",name:"Phishing",tag:"Credential theft",tagBg:"#4a1a1a",tagColor:"#ffb3b3",what:"Fake emails or sites impersonating trusted sources to harvest your login credentials or PII.",example:"An email from 'your bank' leads to a pixel-perfect fake login page. You enter your password — and the attacker has it.",tip:"Always inspect the actual URL in the address bar, not just the display text of a hyperlink."},
    {icon:"⌨️",name:"Keylogging",tag:"Surveillance",tagBg:"#3d2800",tagColor:"#ffd494",what:"Malware that silently records every keystroke to capture passwords and sensitive messages.",example:"A free pirated app bundles a keylogger that streams every password you type to an attacker's server.",tip:"Only install software from official, trusted sources. Run regular antivirus scans."},
    {icon:"📶",name:"Rogue access point",tag:"Network intercept",tagBg:"#0d3322",tagColor:"#6de8bc",what:"A fake Wi-Fi hotspot set up by an attacker to intercept and read traffic passing through it.",example:"'Free_Airport_WiFi' is run by an attacker capturing every unencrypted request you send.",tip:"Use a VPN on public Wi-Fi. Verify hotspot names with staff before connecting."},
    {icon:"🔗",name:"Malicious links",tag:"Drive-by install",tagBg:"#3d2800",tagColor:"#ffd494",what:"Links or files that install malware, redirect to phishing pages, or exploit browser bugs when clicked.",example:"A hacked friend's account DMs you a 'Google Doc' link that silently installs spyware.",tip:"Hover over links to preview their real destination URL before clicking."},
    {icon:"🦠",name:"Malware & viruses",tag:"System compromise",tagBg:"#4a1a1a",tagColor:"#ffb3b3",what:"Software that damages systems or grants attackers control. Viruses self-replicate by attaching to legitimate programs.",example:"A virus bundled in a software installer copies itself to every USB drive plugged into the infected machine.",tip:"Keep your OS and all apps updated — most attacks exploit already-patched vulnerabilities."}
  ];
  var layers=[
    {icon:"🔑",label:"Layer 1 — Strong passwords",detail:"Easy for you to recall, hard for others to guess. Avoid birthdays or dictionary words. A passphrase like 'correct-horse-battery-staple' beats 'P@ssw0rd' every time. Use a password manager."},
    {icon:"📱",label:"Layer 2 — Multi-factor auth (MFA)",detail:"Combines something you know (password), something you have (phone/token), and/or something you are (biometric). Even a leaked password can't unlock your account without the second factor."},
    {icon:"🔒",label:"Layer 3 — Encryption",detail:"Scrambles data in transit and at rest so unauthorized parties can't read it. Symmetric uses one shared key; public key encryption uses a key pair — public to encrypt, private to decrypt."},
    {icon:"⬆️",label:"Layer 4 — Software updates",detail:"Most successful attacks exploit known vulnerabilities that already have patches available. Enabling automatic updates closes those doors before attackers walk through them."},
    {icon:"🛡️",label:"Layer 5 — Antivirus & permissions",detail:"Antivirus scans for known malware signatures and quarantines threats. Review app permissions regularly — does your flashlight app really need access to your contacts and microphone?"}
  ];
  var questions=[
    {q:"An email asks you to click a link and verify your bank account. What attack type is this?",a:"Phishing — the attacker impersonates a trusted institution to trick you into entering credentials on a fake site."},
    {q:"What is the difference between a virus and malware?",a:"Malware is the broad category — any software that damages or takes control of a system. A virus is a specific kind that self-replicates by attaching to legitimate programs."},
    {q:"You log in with a password and a code sent to your phone. What is this called?",a:"Multi-factor authentication (MFA) — combining something you know (password) with something you have (your phone)."},
    {q:"Why is connecting to free public Wi-Fi risky?",a:"Attackers can set up rogue access points. Data sent through them can be intercepted, read, and modified — especially without a VPN or HTTPS."},
    {q:"In public key encryption, what does the sender use to encrypt a message?",a:"The receiver's public key. Only the receiver's matching private key can decrypt it, so the message is secure even if the public key is widely shared."}
  ];

  var tl=document.getElementById('sc-threat-list');
  threats.forEach(function(t){
    var wrap=document.createElement('div');
    var btn=document.createElement('button');
    btn.className='sc-threat-btn';
    btn.innerHTML='<span style="font-size:18px">'+t.icon+'</span><span style="font-weight:500;font-size:14px;color:#ffffff;flex:1">'+t.name+'</span><span class="sc-pill" style="background:'+t.tagBg+';color:'+t.tagColor+'">'+t.tag+'</span><svg class="sc-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="#c4bbf0" stroke-width="1.5" stroke-linecap="round"/></svg>';
    var body=document.createElement('div');
    body.className='sc-threat-body';
    body.innerHTML='<p style="font-size:13px;color:#e8e4ff;line-height:1.6;margin-bottom:12px">'+t.what+'</p><div style="background:#2a2660;border:1px solid #4a45a0;border-radius:8px;padding:10px 14px;margin-bottom:12px"><p style="font-size:11px;font-weight:600;color:#c4bbf0;text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px">Example</p><p style="font-size:13px;color:#e8e4ff;line-height:1.5">'+t.example+'</p></div><p style="font-size:13px;color:#e8e4ff;line-height:1.5"><span style="font-weight:600;color:#a09af0">💡 Tip:</span> '+t.tip+'</p>';
    btn.addEventListener('click',function(){
      var isOpen=body.classList.contains('open');
      document.querySelectorAll('.sc-threat-body.open').forEach(function(b){b.classList.remove('open')});
      document.querySelectorAll('.sc-threat-btn.active').forEach(function(b){b.classList.remove('active');b.querySelector('.sc-chevron').style.transform='rotate(0deg)'});
      if(!isOpen){body.classList.add('open');btn.classList.add('active');btn.querySelector('.sc-chevron').style.transform='rotate(180deg)'}
    });
    wrap.appendChild(btn);wrap.appendChild(body);tl.appendChild(wrap);
  });

  var ll=document.getElementById('sc-layer-list');
  layers.forEach(function(l){
    var row=document.createElement('div');
    row.className='sc-layer-row';
    row.innerHTML='<div style="width:28px;height:28px;border-radius:50%;background:#332f75;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0">'+l.icon+'</div><span style="font-weight:500;font-size:14px;color:#ffffff;flex:1">'+l.label+'</span><svg class="sc-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="#c4bbf0" stroke-width="1.5" stroke-linecap="round"/></svg>';
    var detail=document.createElement('div');
    detail.className='sc-layer-detail';
    detail.textContent=l.detail;
    row.addEventListener('click',function(){
      var isOpen=detail.classList.contains('open');
      document.querySelectorAll('.sc-layer-detail.open').forEach(function(d){d.classList.remove('open')});
      document.querySelectorAll('.sc-layer-row.active').forEach(function(r){r.classList.remove('active');r.querySelector('.sc-chevron').style.transform='rotate(0deg)'});
      if(!isOpen){detail.classList.add('open');row.classList.add('active');row.querySelector('.sc-chevron').style.transform='rotate(180deg)'}
    });
    ll.appendChild(row);ll.appendChild(detail);
  });

  var revealed=0;
  var ql=document.getElementById('sc-quiz-list');
  questions.forEach(function(q,i){
    var qDiv=document.createElement('div');
    qDiv.className='sc-quiz-q';
    qDiv.innerHTML='<span style="font-size:14px;color:#ffffff;line-height:1.5">Q'+(i+1)+': '+q.q+'</span><span style="font-size:12px;color:#c4bbf0;white-space:nowrap;flex-shrink:0">Reveal</span>';
    var aDiv=document.createElement('div');
    aDiv.className='sc-quiz-a';
    aDiv.innerHTML='<span style="font-weight:600;color:#a09af0">Answer:</span> '+q.a;
    var open=false;
    qDiv.addEventListener('click',function(){
      open=!open;
      aDiv.classList.toggle('open',open);
      qDiv.querySelector('span:last-child').textContent=open?'Hide':'Reveal';
      if(open){revealed++;if(revealed===questions.length){
        var sb=document.getElementById('sc-score-bar');
        sb.style.display='block';
        sb.innerHTML='<span style="font-weight:600;color:#ffffff">All done!</span> Great work reviewing 5.6.';
      }}
    });
    ql.appendChild(qDiv);ql.appendChild(aDiv);
  });

  document.getElementById('sc-nav').addEventListener('click',function(e){
    var tab=e.target.closest('.sc-tab');
    if(!tab)return;
    document.querySelectorAll('.sc-tab').forEach(function(t){t.classList.remove('active')});
    document.querySelectorAll('.sc-section').forEach(function(s){s.classList.remove('active')});
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
})();

// ---------- GAME SCRIPT (first part completely unchanged) ----------
(function(){
  const canvas = document.getElementById('gc');
  const ctx = canvas.getContext('2d');
  const W = 900, H = 420;
  let secureScore = 0, breaches = 0, gameActive = true;
  let fish = [], spawnTimer = 20, pendingFish = null;
  const threats = [
    { label: "PHISH", full: "Phishing Email", tagline: "Impersonates a trusted brand to steal credentials", explain: "Attackers spoof logos and sender addresses. The link leads to a cloned login page that harvests your username and password. Credentials are sold or used immediately to drain accounts.", mc: '"Your account is suspended. Verify your identity NOW or lose access permanently. Click here to confirm your password."', piiAsk: 'They ask: "Enter your email and password to verify your account." — What do you do?' },
    { label: "RANSOM", full: "Ransomware", tagline: "Encrypts all your files and demands payment", explain: "Once executed, ransomware silently encrypts every document, photo, and database on your system. A ransom note demands Bitcoin within 72 hours. Paying rarely recovers data.", mc: '"Your files are encrypted. Send 0.5 BTC to this wallet in 72 hours or they are deleted forever."', piiAsk: 'They ask: "Enter your Bitcoin wallet to negotiate a reduced ransom." — What do you do?' },
    { label: "TROJAN", full: "Trojan Horse", tagline: "Disguised as legitimate software — opens a backdoor", explain: "The file looks like a PDF or free utility. When opened, it installs a remote-access trojan in the background. Attackers gain full control: webcam, files, keystrokes, and banking sessions.", mc: '"Hello, I am from IT Support. Please run this diagnostic tool so we can fix your connection issue."', piiAsk: 'They ask: "Enter your employee ID and admin credentials to authorize the tool." — What do you do?' },
    { label: "SPYWARE", full: "Spyware / Keylogger", tagline: "Records every keystroke and screen — invisibly", explain: "Spyware runs silently, logging every key typed — capturing SSNs, credit card numbers, and passwords — then transmits them to a remote server. It can persist for months undetected.", mc: '"We noticed unusual login activity. Re-enter your social security number and PIN to confirm your identity."', piiAsk: 'They ask: "Provide your SSN and banking PIN to unlock your account." — What do you do?' },
    { label: "WORM", full: "Network Worm", tagline: "Self-replicates across every device on your network", explain: "Unlike viruses, worms need no user action to spread. Once inside one machine, they scan and infect every reachable device, installing backdoors or wiping data across an entire office.", mc: '"This urgent security patch must be installed on all company devices now. Your manager approved this."', piiAsk: 'They ask: "Enter your network login to authorize the patch deployment." — What do you do?' },
    { label: "FAKE", full: "Fake Invoice / BEC", tagline: "Business email compromise — redirects wire transfers", explain: "Attackers impersonate a CEO or vendor. They request an urgent wire transfer or updated payment details. Billions of dollars are stolen annually this way — no malware needed, just social engineering.", mc: '"Urgent: Update our bank account details for tomorrow\'s $48,000 wire. Do not call — I am in a meeting."', piiAsk: 'They ask: "Confirm your company bank account number to process the transfer." — What do you do?' },
  ];
  const goodTypes = [
    { label: "MFA", full: "Multi-Factor Auth", tagline: "Second factor blocks stolen-credential attacks", explain: "Even if your password is captured, MFA requires a physical device or biometric to log in. It stops over 99% of automated credential-stuffing attacks." },
    { label: "VERIFY", full: "Verify Sender", tagline: "Check the real domain before clicking anything", explain: "Hover over links to reveal the true URL. Attackers use domains like 'paypa1.com'. One second of checking prevents total account compromise." },
    { label: "REPORT", full: "Report Phishing", tagline: "Forward suspicious emails to your security team", explain: "Reporting a phishing email protects every colleague who may receive the same lure. Security teams can block the domain before a breach occurs." },
    { label: "BACKUP", full: "Offline Backup", tagline: "Isolated backups defeat ransomware completely", explain: "Ransomware can only encrypt drives it can reach. Air-gapped or immutable cloud backups let you restore everything within hours with zero ransom paid." },
    { label: "FREEZE", full: "Credit Freeze", tagline: "Prevents new accounts being opened in your name", explain: "After a breach, attackers use your SSN to open credit cards. A freeze at all three credit bureaus blocks this instantly. It is free, reversible, and one of the most powerful identity-theft defenses." },
  ];
  function rnd(a,b){return a+Math.random()*(b-a);}
  function spawnFish(){
    const bad=Math.random()<0.55;
    const data=bad?{...threats[Math.floor(Math.random()*threats.length)]}:{...goodTypes[Math.floor(Math.random()*goodTypes.length)]};
    const fromLeft=Math.random()<0.5;
    return { id:Math.random(), x:fromLeft?-55:W+55, y:rnd(265,H-60), r:36, type:bad?'bad':'good', data, facingRight:fromLeft, vx:fromLeft?rnd(.45,.85):rnd(-.85,-.45), phase:rnd(0,Math.PI*2), active:true };
  }
  function removeFish(f){const i=fish.indexOf(f);if(i!==-1)fish.splice(i,1);}
  function setInfoBar(title,body,tip,mode){document.getElementById('infoBar').className=mode||'';const t=document.getElementById('infoTitle');t.className=mode||'';t.textContent=title;document.getElementById('infoBody').textContent=body;document.getElementById('infoTip').textContent=tip;}
  function openModal(f){
    pendingFish=f;const d=f.data;
    document.getElementById('modalHeader').textContent='THREAT INTERCEPTED — '+d.full.toUpperCase();
    document.getElementById('modalThreatName').textContent=d.label+' — '+d.full;
    document.getElementById('modalTagline').textContent=d.tagline;
    document.getElementById('modalExplain').textContent=d.explain;
    document.getElementById('mcLine').textContent='Attacker says: '+d.mc;
    document.getElementById('modalPrompt').textContent=d.piiAsk;
    document.getElementById('modal').classList.add('show');
    gameActive=false;
  }
  function closeModal(){document.getElementById('modal').classList.remove('show');pendingFish=null;if(breaches<8)gameActive=true;}
  document.getElementById('btnGiveIn').onclick=function(){if(!pendingFish)return;breaches++;document.getElementById('bs').textContent=breaches;const d=pendingFish.data;removeFish(pendingFish);setInfoBar('PII LEAKED — '+d.full.toUpperCase(),'You handed over your information. '+d.explain,'Defense: verify every request. Never give PII under pressure or urgency.','danger');closeModal();if(breaches>=8){gameActive=false;setInfoBar('IDENTITY COMPROMISED — PRESS NEW SESSION','You fell for '+breaches+' attacks. Your personal data is at risk. Review each threat type and try again.','Core rule: Stop. Think. Verify. Never share PII under pressure.','danger');}canvas.style.transform='translateX(4px)';setTimeout(()=>{canvas.style.transform='';},100);};
  document.getElementById('btnReject').onclick=function(){if(!pendingFish)return;secureScore++;document.getElementById('ss').textContent=secureScore;const d=pendingFish.data;removeFish(pendingFish);setInfoBar('THREAT BLOCKED — '+d.full.toUpperCase(),'Correct. You recognized and rejected the attack. '+d.explain,'Keep it up: report this to your security team so colleagues are protected too.','safe');closeModal();};
  canvas.addEventListener('click',function(e){if(!gameActive)return;const rect=canvas.getBoundingClientRect();const sx=canvas.width/rect.width;const sy=canvas.height/rect.height;const cx=(e.clientX-rect.left)*sx;const cy=(e.clientY-rect.top)*sy;for(let i=fish.length-1;i>=0;i--){const f=fish[i];if(!f.active)continue;if(Math.hypot(cx-f.x,cy-f.y)<=f.r+8){f.active=false;if(f.type==='bad'){openModal(f);}else{secureScore++;document.getElementById('ss').textContent=secureScore;removeFish(f);setInfoBar('SECURE ACTION — '+f.data.full.toUpperCase(),f.data.explain,'Well done. Secure behaviors protect you and your entire organization.','safe');}break;}}});
  canvas.addEventListener('touchstart',function(e){e.preventDefault();const touch=e.touches[0];canvas.dispatchEvent(new MouseEvent('click',{clientX:touch.clientX,clientY:touch.clientY}));},{passive:false});
  document.getElementById('resetBtn').onclick=function(){secureScore=0;breaches=0;fish=[];gameActive=true;document.getElementById('ss').textContent=0;document.getElementById('bs').textContent=0;document.getElementById('modal').classList.remove('show');pendingFish=null;setInfoBar('PHISHING LAKE — SECURITY TRAINING','Click on fish to intercept threats. Red fish carry cyberattacks — green fish are safe behaviors. React fast before threats swim past.','TIP: Real phishers use urgency, fear, and fake authority to steal your data.','');for(let i=0;i<4;i++)fish.push(spawnFish());spawnTimer=20;};
  function drawFish(f){const bob=Math.sin(Date.now()*.0025+f.phase)*4;const x=f.x,y=f.y+bob;const bad=f.type==='bad';ctx.save();if(!f.facingRight){ctx.translate(x,y);ctx.scale(-1,1);ctx.translate(-x,-y);}ctx.beginPath();ctx.ellipse(x,y,f.r,f.r*.62,0,0,Math.PI*2);ctx.fillStyle=bad?'#d05050':'#2a9060';ctx.fill();ctx.strokeStyle=bad?'#ff9090':'#60d090';ctx.lineWidth=1.5;ctx.stroke();ctx.beginPath();ctx.moveTo(x-f.r+5,y);ctx.lineTo(x-f.r-15,y-14);ctx.lineTo(x-f.r-15,y+14);ctx.closePath();ctx.fillStyle=bad?'#a03030':'#1a7040';ctx.fill();ctx.beginPath();ctx.moveTo(x-8,y-f.r*.6);ctx.lineTo(x+8,y-f.r*.6);ctx.lineTo(x+4,y-f.r*.15);ctx.lineTo(x-4,y-f.r*.15);ctx.closePath();ctx.fillStyle=bad?'#b04040':'#228850';ctx.fill();ctx.beginPath();ctx.arc(x+f.r*.38,y-f.r*.2,5,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();ctx.beginPath();ctx.arc(x+f.r*.42,y-f.r*.22,2.5,0,Math.PI*2);ctx.fillStyle='#111';ctx.fill();ctx.restore();ctx.save();ctx.font="bold 13px 'Share Tech Mono', monospace";ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#fff';ctx.shadowColor='rgba(0,0,0,.5)';ctx.shadowBlur=3;ctx.fillText(f.data.label,x,y);ctx.shadowBlur=0;ctx.restore();}
  function drawPhisher(){const bx=115,by=185;ctx.fillStyle='#3a5a3a';ctx.beginPath();ctx.ellipse(bx,by+8,24,36,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#d4a878';ctx.beginPath();ctx.arc(bx,by-28,21,0,Math.PI*2);ctx.fill();ctx.fillStyle='#2a3a28';ctx.fillRect(bx-28,by-44,56,7);ctx.fillRect(bx-18,by-64,36,24);ctx.fillStyle='#1a1a1a';ctx.beginPath();ctx.arc(bx-7,by-31,3,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(bx+7,by-31,3,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#804030';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(bx+4,by-20,6,0.15,Math.PI*.65);ctx.stroke();ctx.strokeStyle='#3a5a3a';ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(bx+16,by-4);ctx.lineTo(bx+42,by-44);ctx.stroke();ctx.beginPath();ctx.moveTo(bx+40,by-46);ctx.lineTo(bx+240,by-88);ctx.lineWidth=7;ctx.strokeStyle='#8a6030';ctx.stroke();ctx.lineWidth=2.5;ctx.strokeStyle='#d8a850';ctx.stroke();ctx.font="bold 11px 'Share Tech Mono', monospace";ctx.textAlign='center';ctx.fillStyle='#2a5a30';ctx.fillText('THE PHISHER',bx,by-72);ctx.font="10px 'Share Tech Mono', monospace";ctx.fillStyle='#4a7a48';ctx.fillText('"your data or your files"',bx,by-59);ctx.textAlign='left';}
  function drawScene(){ctx.clearRect(0,0,W,H);const t=Date.now();const sky=ctx.createLinearGradient(0,0,0,210);sky.addColorStop(0,'#a8d8f0');sky.addColorStop(1,'#d0ecfa');ctx.fillStyle=sky;ctx.fillRect(0,0,W,215);ctx.fillStyle='rgba(255,255,255,.8)';const cOff=(t*.008)%W;[[cOff+60,50,52,18],[cOff+165,40,38,14],[cOff+450,65,62,22],[cOff+620,48,44,16]].forEach(([cx,cy,rw,rh])=>{ctx.beginPath();ctx.ellipse(cx%W,cy,rw,rh,0,0,Math.PI*2);ctx.fill();});ctx.fillStyle='#5a9060';[[W*.12,215,88,38],[W*.34,218,68,30],[W*.7,212,98,44],[W*.92,218,74,34]].forEach(([hx,hy,rw,rh])=>{ctx.beginPath();ctx.ellipse(hx,hy,rw,rh,0,0,Math.PI*2);ctx.fill();});ctx.fillStyle='#8ab870';ctx.fillRect(0,210,W,20);ctx.fillStyle='#70a858';ctx.fillRect(0,220,W,10);const water=ctx.createLinearGradient(0,228,0,H);water.addColorStop(0,'#4ab0d8');water.addColorStop(1,'#2880a8');ctx.fillStyle=water;ctx.fillRect(0,228,W,H-228);ctx.strokeStyle='rgba(255,255,255,.18)';ctx.lineWidth=1;for(let i=0;i<18;i++){const rx=((i*130+t*.05)%W);const ry=248+Math.sin(t*.0012+i*.8)*7;ctx.beginPath();ctx.ellipse(rx,ry,32,5,0,0,Math.PI*2);ctx.stroke();}ctx.fillStyle='#c8a060';ctx.fillRect(0,225,180,14);ctx.fillStyle='#b08848';for(let p=0;p<6;p++)ctx.fillRect(p*32+8,226,6,28);drawPhisher();for(const f of fish)drawFish(f);const bx=272+Math.sin(t*.006)*8;const by2=208+Math.sin(t*.008)*5;ctx.beginPath();ctx.moveTo(248,97);ctx.quadraticCurveTo(275,150,bx,by2);ctx.strokeStyle='rgba(80,60,40,.6)';ctx.lineWidth=1.5;ctx.stroke();ctx.beginPath();ctx.arc(bx,by2-4,6,Math.PI,0);ctx.fillStyle='#e04040';ctx.fill();ctx.beginPath();ctx.arc(bx,by2+2,6,0,Math.PI);ctx.fillStyle='#f0f0f0';ctx.fill();if(!gameActive&&breaches>=8){ctx.fillStyle='rgba(240,220,210,.82)';ctx.fillRect(0,0,W,H);ctx.textAlign='center';ctx.font="bold 34px 'Barlow Condensed', sans-serif";ctx.fillStyle='#b03030';ctx.fillText('IDENTITY COMPROMISED',W/2,H/2-18);ctx.font="15px 'Share Tech Mono', monospace";ctx.fillStyle='#805050';ctx.fillText('Press NEW SESSION to try again',W/2,H/2+18);ctx.textAlign='left';}}
  function loop(){if(gameActive){spawnTimer--;if(spawnTimer<=0&&fish.length<9){fish.push(spawnFish());spawnTimer=55;}if(fish.length<3)spawnTimer=Math.min(spawnTimer,20);for(let i=fish.length-1;i>=0;i--){fish[i].x+=fish[i].vx;if(fish[i].x<-90||fish[i].x>W+90)fish.splice(i,1);}}drawScene();requestAnimationFrame(loop);}
  for(let i=0;i<4;i++)fish.push(spawnFish());loop();
})();
</script>
</body>
</html>