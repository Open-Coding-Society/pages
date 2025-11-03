---
layout: post
title: "Media Literacy Vault"
description: "Enter the vault code with numbers gathered through the mission to get your Media Literacy certificate"
permalink: /digital-famine/media-lit/submodule_5/
footer:
  previous: /digital-famine/media-lit/submodule_4/
  home: /hacks/navigation
parent: "Analytics/Admin"
team: "Scratchers"
submodule: 3
categories: [CSP, Submodule, Analytics/Admin, Vault]
tags: [analytics, submodule, curators]
breadcrumb: true
microblog: true
date: 2025-10-28
---

<div style="min-height:100vh;background:radial-gradient(circle at 20% 20%,#0e153a,#000418 80%);color:#e8f0ff;font-family:'Poppins',system-ui,sans-serif;display:flex;align-items:center;justify-content:center;padding:40px;">

  <div style="background:#101833cc;backdrop-filter:blur(10px);border:1px solid #323e77ff;border-radius:20px;box-shadow:0 0 30px #0f21a6cd;max-width:650px;width:100%;padding:40px;text-align:center;">
    
    <h1 style="font-size:2rem;letter-spacing:1px;margin-bottom:10px;background:linear-gradient(90deg,#69aaff,#a2b7ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">
      🛰️ Mission Debrief: Final Access
    </h1>

    <p style="color:#b7c8ff;font-size:1.05rem;line-height:1.6;margin-bottom:30px;">
      Cadet, your defense of <b>Media Literacy Planet</b> is complete.  
      Enter the <span style="color:#79aaff;">four-digit code</span> sequence you earned across your missions to access your <b>Certificate of Completion</b>.
    </p>

    <!-- Code Entry Card -->
    <div style="display:flex;justify-content:center;gap:15px;margin-bottom:32px;">
      <div class="digit-card"><input id="code1" maxlength="1" type="text"></div>
      <div class="digit-card"><input id="code2" maxlength="1" type="text"></div>
      <div class="digit-card"><input id="code3" maxlength="1" type="text"></div>
      <div class="digit-card"><input id="code4" maxlength="1" type="text"></div>
    </div>

    <button id="submit-code" style="padding:12px 30px;border:none;border-radius:12px;background:linear-gradient(90deg,#3b82f6,#6366f1);color:white;font-size:1rem;font-weight:700;cursor:pointer;transition:all 0.2s ease;box-shadow:0 0 20px #4057ff55;">
      Verify Access Code
    </button>

    <div id="result-msg" style="margin-top:30px;font-size:1.2rem;"></div>
  </div>

  <style>
    .digit-card {
      background: #18204d;
      border: 1px solid #2e3b8d;
      box-shadow: 0 0 12px #4058b997 inset;
      border-radius: 14px;
      width: 70px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.15s ease, box-shadow 0.2s ease;
      
    }
    body {
     min-height: 100vh;
     background: url('{{ site.baseurl }}/hacks/digital-famine/media-lit/media/assets/spacebackground.jpg') no-repeat center center fixed;
    background-size: cover;
    background-color: #0a1b3aff; /* fallback */
    }
    .digit-card:hover {
      transform: scale(1.08);
      box-shadow: 0 0 18px #805ad4b4 inset;
    }
    .digit-card input {
      background: transparent;
      border: none;
      color: #d8e4ff;
      font-size: 2rem;
      text-align: center;
      width: 100%;
      outline: none;
    }
    #submit-code:hover {
      transform: scale(1.05);
      box-shadow: 0 0 30px #4f64ff88;
    }
  </style>

  <script>
    const submitBtn = document.getElementById('submit-code');
    const msg = document.getElementById('result-msg');

    submitBtn.addEventListener('click', () => {
      const code = [
        document.getElementById('code1').value,
        document.getElementById('code2').value,
        document.getElementById('code3').value,
        document.getElementById('code4').value
      ].join('');

      if (code === '2594') {
        msg.innerHTML = `
          <div style="background:#1b254d;border-radius:16px;padding:24px;margin-top:12px;box-shadow:0 0 25px #4f64ff55;">
            <h2 style="color:#73b3ff;margin-bottom:8px;" Access Granted</h2>
            <p style="color:#b4d4ff;margin-bottom:12px;">Welcome back, Cadet. Mission logs verified and Certificate of Completion claimed.</p>
          </div>
        `;
      } else {
        msg.innerHTML = `
          <div style="background:#3d1e2e;border-radius:16px;padding:18px;margin-top:12px;box-shadow:0 0 25px #e5455fba;">
            <h3 style="color:#ff8fa5;"> Access Denied</h3>
            <p style="color:#ffcdd2;">Incorrect code sequence. Recheck your mission intel and try again.</p>
          </div>
        `;
      }
    });
  </script>
</div>

<script>
let progress = JSON.parse(localStorage.getItem('planetProgression')) || {
  microblog: false,
  medialit: false,
  ai: false,
  cyber: false,
  current: 'medialit'
};

// ✅ Automatically mark Media Literacy Planet as complete
progress.medialit = true;

// Save progress
localStorage.setItem('planetProgression', JSON.stringify(progress));
</script>