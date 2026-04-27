---
layout: post
title: Bit Rate, Bandwidth, & Latency
description: CSN-1.B — measuring data transfer and network speed
type: lessons
permalink: /bit-rate-latency
---

## Bit Rate, Bandwidth, and Latency

The internet runs on speed. But not all "speed" is the same. You need to know the difference between **how much** data can move, **how fast** it actually moves, and **how long** a round trip takes.

---

<style>
.sc-pill{display:inline-block;font-size:11px;font-weight:500;padding:2px 8px;border-radius:20px}
.sc-label{font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#c4bbf0;margin-bottom:12px}
.sc-tab{padding:7px 14px;border-radius:20px;border:none;background:#1e1c45;cursor:pointer;font-size:13px;font-weight:500;color:#c4bbf0;transition:all .15s}
.sc-tab.active{background:#534AB7;color:#ffffff}
.sc-section{display:none}
.sc-section.active{display:block}
.sc-term-btn{width:100%;text-align:left;background:#2a2660;border:1px solid #4a45a0;border-radius:8px;padding:12px 16px;cursor:pointer;display:flex;align-items:center;gap:12px;transition:background .15s;margin-bottom:6px}
.sc-term-btn:hover{background:#332f75}
.sc-term-btn.active{border-color:#a09af0;background:#332f75}
.sc-term-body{display:none;margin-bottom:6px;border:1px solid #4a45a0;border-radius:0 0 8px 8px;padding:16px;background:#1a1840}
.sc-term-body.open{display:block}
.sc-example-row{display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:8px;border:1px solid #4a45a0;margin-bottom:6px;cursor:pointer;transition:background .15s;background:#2a2660}
.sc-example-row:hover{background:#332f75}
.sc-example-row.active{border-color:#a09af0;border-radius:8px 8px 0 0;margin-bottom:0}
.sc-example-detail{display:none;font-size:13px;color:#e8e4ff;line-height:1.6;padding:12px 16px 14px 48px;background:#1a1840;border:1px solid #4a45a0;border-top:none;border-radius:0 0 8px 8px;margin-bottom:6px}
.sc-example-detail.open{display:block}
.sc-quiz-q{padding:14px 16px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:8px;border-bottom:1px solid #4a45a0;background:#2a2660;transition:background .15s}
.sc-quiz-q:hover{background:#332f75}
.sc-quiz-a{display:none;padding:14px 16px;font-size:14px;line-height:1.6;color:#e8e4ff;background:#1a1840;border-bottom:1px solid #4a45a0}
.sc-quiz-a.open{display:block}
.sc-chevron{transition:transform .2s;flex-shrink:0}
.sc-match-card{cursor:pointer;transition:all .15s}
.sc-match-card.matched{opacity:0.5;cursor:default;background:#1a1840 !important;border-color:#4a45a0 !important;text-decoration:line-through}
.sc-match-card.selected{border:2px solid #a09af0 !important; background:#332f75 !important}
</style>

<div id="sc-root" style="background:#13122e;border-radius:16px;padding:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">

  <div style="display:flex;gap:8px;margin-bottom:24px;flex-wrap:wrap" id="sc-nav">
    <button class="sc-tab active" data-tab="sc-terms">Core terms</button>
    <button class="sc-tab" data-tab="sc-examples">Real-world examples</button>
    <button class="sc-tab" data-tab="sc-match">🎴 Match game</button>
    <button class="sc-tab" data-tab="sc-quiz">Quick check ✅</button>
  </div>

  <!-- CORE TERMS SECTION -->
  <div id="sc-terms" class="sc-section active">
    <p class="sc-label">What each term actually means</p>
    <div id="sc-term-list"></div>
  </div>

  <!-- REAL-WORLD EXAMPLES SECTION -->
  <div id="sc-examples" class="sc-section">
    <p class="sc-label">How it feels in real life</p>
    <p style="font-size:14px;color:#e8e4ff;margin-bottom:16px;line-height:1.6">Click each scenario to see which network property is at play.</p>
    <div id="sc-example-list"></div>
  </div>

  <!-- MATCH GAME SECTION - RIGHT AFTER LESSON -->
  <div id="sc-match" class="sc-section">
    <p class="sc-label">🃏 Match each term to its correct definition</p>
    <p style="font-size:13px;color:#c4bbf0;margin-bottom:16px">Click a term on the LEFT, then click its definition on the RIGHT. Match all 3 to win!</p>
    <div id="sc-match-status" style="background:#2a2660;border-radius:8px;padding:10px 14px;margin-bottom:16px;font-size:13px;color:#e8e4ff;text-align:center"></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
      <div id="sc-match-terms" style="background:#1a1840;border-radius:12px;padding:14px;border:1px solid #4a45a0"></div>
      <div id="sc-match-defs" style="background:#1a1840;border-radius:12px;padding:14px;border:1px solid #4a45a0"></div>
    </div>
    <button id="sc-reset-match" style="margin-top:16px;background:#534AB7;border:none;border-radius:8px;padding:10px 20px;color:#fff;cursor:pointer;font-size:14px;font-weight:500">🔄 New round</button>
  </div>

  <!-- QUICK CHECK - SUPER EASY AP CSP LEVEL -->
  <div id="sc-quiz" class="sc-section">
    <p class="sc-label">✅ Quick check — AP CSP level easy</p>
    <div style="background:#2a2660;border-left:3px solid #a09af0;padding:14px 18px;border-radius:4px;margin-bottom:20px">
      <p style="font-weight:600;font-size:14px;color:#ffffff;margin-bottom:6px">💡 Remember:</p>
      <p style="font-size:13px;color:#e8e4ff;line-height:1.6">Bandwidth = max pipe size<br>Bit rate = actual speed<br>Latency = delay / ping time</p>
    </div>
    <div id="sc-quiz-list" style="border:1px solid #4a45a0;border-radius:12px;overflow:hidden"></div>
  </div>

</div>

<script>
(function(){
  // TERMS DATA
  var terms = [
    {name:"Bit rate", definition:"Number of bits of data sent each second. Most are now in Mbps (megabits per second).", key:"Lower bit rate = blurry video. Higher bit rate = HD streaming.", tag:"Measured in Mbps"},
    {name:"Bandwidth", definition:"The maximum bit rate a system can handle. The size of the pipe — not how full it is.", key:"Think: a 4-lane highway vs a 1-lane road. Bandwidth = lanes.", tag:"Theoretical max"},
    {name:"Latency", definition:"Time between sending a message and receiving it. Often measured as round-trip time (RTT).", key:"Ping = latency. Low ping = snappy gaming. High ping = lag.", tag:"Measured in ms"}
  ];

  // REAL EXAMPLES DATA
  var examples = [
    {scenario:"You're video calling Grandma. Her face freezes and looks blocky, but the audio is fine.", answer:"Bandwidth bottleneck — there aren't enough bits per second to send the video smoothly.", hint:"Video needs lots of bits every second. Audio needs fewer bits."},
    {scenario:"You click a link. Nothing happens for 2 seconds. Then the whole webpage appears instantly.", answer:"Latency issue — the round trip took time, but once data arrived, your connection was fast.", hint:"The wait was at the beginning, not during loading."},
    {scenario:"You're playing an online game. Your ping shows 250ms. Your friend next to you has 20ms.", answer:"You have high latency. Low bandwidth would affect both of you equally.", hint:"Ping measures your personal round-trip time."}
  ];

  // SUPER EASY AP CSP LEVEL QUESTIONS
  var easyQuestions = [
    {q:"You have a 100 Mbps internet plan. What does 'Mbps' stand for?", a:"Megabits per second — it measures how many million bits can be sent each second."},
    {q:"Your friend says their 'ping is 300ms' while gaming. Is that good or bad?", a:"Bad! 300ms means a 0.3 second delay. Pro gamers want under 30ms."},
    {q:"You're downloading a 5 GB game. Which matters more: bandwidth or latency?", a:"Bandwidth! Downloading big files is about moving lots of bits quickly. Latency only matters for the first bit."}
  ];

  // ========== RENDER TERMS ==========
  var termList = document.getElementById('sc-term-list');
  terms.forEach(function(t){
    var wrap = document.createElement('div');
    var btn = document.createElement('button');
    btn.className = 'sc-term-btn';
    btn.innerHTML = '<span style="font-weight:600;font-size:15px;color:#ffffff;flex:1">'+t.name+'</span>' +
      '<span class="sc-pill" style="background:#332f75;color:#a09af0">'+t.tag+'</span>' +
      '<svg class="sc-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="#c4bbf0" stroke-width="1.5" stroke-linecap="round"/></svg>';
    var body = document.createElement('div');
    body.className = 'sc-term-body';
    body.innerHTML = '<p style="font-size:14px;color:#e8e4ff;line-height:1.6;margin-bottom:12px">'+t.definition+'</p>' +
      '<div style="background:#2a2660;border:1px solid #4a45a0;border-radius:8px;padding:10px 14px">' +
      '<p style="font-size:11px;font-weight:600;color:#c4bbf0;text-transform:uppercase;margin-bottom:5px">💡 Key takeaway</p>' +
      '<p style="font-size:13px;color:#e8e4ff">'+t.key+'</p></div>';
    btn.addEventListener('click',function(){
      var isOpen = body.classList.contains('open');
      document.querySelectorAll('.sc-term-body.open').forEach(function(b){b.classList.remove('open')});
      document.querySelectorAll('.sc-term-btn.active').forEach(function(b){b.classList.remove('active'); b.querySelector('.sc-chevron').style.transform = 'rotate(0deg)'});
      if(!isOpen){ body.classList.add('open'); btn.classList.add('active'); btn.querySelector('.sc-chevron').style.transform = 'rotate(180deg)'; }
    });
    wrap.appendChild(btn); wrap.appendChild(body); termList.appendChild(wrap);
  });

  // ========== RENDER EXAMPLES ==========
  var exampleList = document.getElementById('sc-example-list');
  examples.forEach(function(ex, idx){
    var row = document.createElement('div');
    row.className = 'sc-example-row';
    row.innerHTML = '<div style="width:28px;height:28px;border-radius:50%;background:#332f75;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0">📱</div>' +
      '<span style="font-weight:500;font-size:13px;color:#ffffff;flex:1;line-height:1.4">'+ex.scenario+'</span>' +
      '<svg class="sc-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="#c4bbf0" stroke-width="1.5" stroke-linecap="round"/></svg>';
    var detail = document.createElement('div');
    detail.className = 'sc-example-detail';
    detail.innerHTML = '<p style="font-weight:600;color:#a09af0;margin-bottom:6px">✅ Answer:</p>' +
      '<p style="font-size:13px;margin-bottom:10px">'+ex.answer+'</p>' +
      '<p style="font-size:12px;color:#c4bbf0">🔍 Hint: '+ex.hint+'</p>';
    row.addEventListener('click',function(){
      var isOpen = detail.classList.contains('open');
      document.querySelectorAll('.sc-example-detail.open').forEach(function(d){d.classList.remove('open')});
      document.querySelectorAll('.sc-example-row.active').forEach(function(r){r.classList.remove('active'); r.querySelector('.sc-chevron').style.transform = 'rotate(0deg)'});
      if(!isOpen){ detail.classList.add('open'); row.classList.add('active'); row.querySelector('.sc-chevron').style.transform = 'rotate(180deg)'; }
    });
    exampleList.appendChild(row); exampleList.appendChild(detail);
  });

  // ========== MATCHING GAME ==========
  var matchTermsDiv = document.getElementById('sc-match-terms');
  var matchDefsDiv = document.getElementById('sc-match-defs');
  var matchStatus = document.getElementById('sc-match-status');
  var resetBtn = document.getElementById('sc-reset-match');
  
  var selectedTermId = null;
  var matched = { bitrate: false, bandwidth: false, latency: false };
  
  var termItems = [
    { id: 'bitrate', name: 'Bit rate' },
    { id: 'bandwidth', name: 'Bandwidth' },
    { id: 'latency', name: 'Latency' }
  ];
  
  var defItems = [
    { id: 'bitrate', text: 'Number of bits sent each second — measured in Mbps' },
    { id: 'bandwidth', text: 'Maximum bit rate a system can handle — the size of the pipe' },
    { id: 'latency', text: 'Time between sending and receiving a message — also called "ping"' }
  ];
  
  function shuffleArray(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }
  
  function updateMatchStatus() {
    var allMatched = matched.bitrate && matched.bandwidth && matched.latency;
    if (allMatched) {
      matchStatus.innerHTML = '🎉 PERFECT! You matched all three! 🎉<br><span style="font-size:12px;color:#a09af0">Bandwidth = max bit rate. Latency = round-trip time. Bit rate = actual speed.</span>';
      matchStatus.style.background = '#1e3a2e';
      matchStatus.style.border = '1px solid #2ecc71';
    } else {
      var count = (matched.bitrate?1:0) + (matched.bandwidth?1:0) + (matched.latency?1:0);
      matchStatus.innerHTML = '📊 Matched: ' + count + '/3. Click a term, then click its definition!';
      matchStatus.style.background = '#2a2660';
      matchStatus.style.border = '1px solid #4a45a0';
    }
  }
  
  function renderMatchGame() {
    var shuffledDefs = shuffleArray([...defItems]);
    matchTermsDiv.innerHTML = '';
    matchDefsDiv.innerHTML = '';
    matchTermsDiv.innerHTML = '<div style="font-size:11px;font-weight:600;color:#c4bbf0;margin-bottom:12px;text-transform:uppercase;letter-spacing:1px">📌 TERMS</div>';
    matchDefsDiv.innerHTML = '<div style="font-size:11px;font-weight:600;color:#c4bbf0;margin-bottom:12px;text-transform:uppercase;letter-spacing:1px">📖 DEFINITIONS</div>';
    
    termItems.forEach(function(term){
      var isMatched = matched[term.id];
      var card = document.createElement('div');
      card.className = 'sc-match-card';
      card.style.background = isMatched ? '#1a1840' : '#2a2660';
      card.style.border = '1px solid #4a45a0';
      card.style.borderRadius = '10px';
      card.style.padding = '14px';
      card.style.marginBottom = '10px';
      card.style.textAlign = 'center';
      card.style.fontWeight = '600';
      card.style.fontSize = '16px';
      card.style.color = isMatched ? '#6a6590' : '#ffffff';
      card.style.cursor = isMatched ? 'default' : 'pointer';
      card.textContent = term.name;
      if (!isMatched) {
        card.addEventListener('click', (function(tid) {
          return function() {
            document.querySelectorAll('#sc-match-terms .sc-match-card').forEach(function(c){
              c.classList.remove('selected');
              c.style.border = '1px solid #4a45a0';
            });
            card.classList.add('selected');
            card.style.border = '2px solid #a09af0';
            selectedTermId = tid;
          };
        })(term.id));
      }
      matchTermsDiv.appendChild(card);
    });
    
    shuffledDefs.forEach(function(def){
      var isMatched = matched[def.id];
      var card = document.createElement('div');
      card.className = 'sc-match-card';
      card.style.background = isMatched ? '#1a1840' : '#2a2660';
      card.style.border = '1px solid #4a45a0';
      card.style.borderRadius = '10px';
      card.style.padding = '14px';
      card.style.marginBottom = '10px';
      card.style.fontSize = '13px';
      card.style.color = isMatched ? '#6a6590' : '#e8e4ff';
      card.style.lineHeight = '1.5';
      card.style.cursor = isMatched ? 'default' : 'pointer';
      card.innerHTML = '📖 "' + def.text + '"';
      if (!isMatched) {
        card.addEventListener('click', (function(did) {
          return function() {
            if (selectedTermId === null) {
              matchStatus.innerHTML = '⚠️ First click a term on the LEFT, then click its definition!';
              matchStatus.style.background = '#4a1a1a';
              setTimeout(function() { updateMatchStatus(); }, 1500);
              return;
            }
            if (selectedTermId === did) {
              matched[did] = true;
              selectedTermId = null;
              renderMatchGame();
            } else {
              matchStatus.innerHTML = '❌ Wrong match! "' + selectedTermId + '" does not match that definition. Try again!';
              matchStatus.style.background = '#4a1a1a';
              selectedTermId = null;
              document.querySelectorAll('#sc-match-terms .sc-match-card').forEach(function(c){
                c.classList.remove('selected');
                c.style.border = '1px solid #4a45a0';
              });
              setTimeout(function() { updateMatchStatus(); }, 1500);
            }
          };
        })(def.id));
      }
      matchDefsDiv.appendChild(card);
    });
    updateMatchStatus();
  }
  
  function resetMatchGame() {
    matched = { bitrate: false, bandwidth: false, latency: false };
    selectedTermId = null;
    renderMatchGame();
    matchStatus.innerHTML = '🃏 New round! Click a term, then click its definition.';
    matchStatus.style.background = '#2a2660';
  }
  
  resetBtn.addEventListener('click', resetMatchGame);
  renderMatchGame();

  // ========== RENDER EASY QUESTIONS ==========
  var quizList = document.getElementById('sc-quiz-list');
  easyQuestions.forEach(function(q,i){
    var qDiv = document.createElement('div');
    qDiv.className = 'sc-quiz-q';
    qDiv.innerHTML = '<span style="font-size:14px;color:#ffffff;line-height:1.5">❓ ' + q.q + '</span>' +
      '<span style="font-size:11px;color:#c4bbf0;white-space:nowrap;flex-shrink:0;background:#332f75;padding:4px 10px;border-radius:20px">Reveal</span>';
    var aDiv = document.createElement('div');
    aDiv.className = 'sc-quiz-a';
    aDiv.innerHTML = '<span style="font-weight:600;color:#2ecc71">✔ Answer:</span> ' + q.a;
    var open = false;
    qDiv.addEventListener('click',function(){
      open = !open;
      aDiv.classList.toggle('open', open);
      qDiv.querySelector('span:last-child').textContent = open ? 'Hide' : 'Reveal';
    });
    quizList.appendChild(qDiv); quizList.appendChild(aDiv);
  });

  // TAB NAVIGATION
  document.getElementById('sc-nav').addEventListener('click', function(e){
    var tab = e.target.closest('.sc-tab');
    if(!tab) return;
    document.querySelectorAll('.sc-tab').forEach(function(t){t.classList.remove('active')});
    document.querySelectorAll('.sc-section').forEach(function(s){s.classList.remove('active')});
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
})();
</script>

---

## Key Vocabulary (AP CSP Cram Sheet)

| Term | Definition | AP Tip |
|------|-----------|--------|
| **Bit rate** | Actual bits sent per second (Mbps) | Lower bit rate = lower quality video |
| **Bandwidth** | Maximum possible bit rate of a system | The "size of the pipe" — theoretical limit |
| **Latency** | Time delay between send and receive | Measured in milliseconds (ms) — "ping" |
| **Mbps** | Megabits per second (1 million bits) | 8 Megabits = 1 Megabyte (MB) |
| **Round-trip time (RTT)** | Total time from click to response | Satellite internet has high RTT (~600ms) |

---

## How AP CSP Tests This (Made Simple)

**Easy way to remember:**
- **Bandwidth** = How fat is the straw? (max capacity)
- **Bit rate** = How fast is the milkshake actually flowing? (real speed)
- **Latency** = How long until the first sip reaches your mouth? (delay)
