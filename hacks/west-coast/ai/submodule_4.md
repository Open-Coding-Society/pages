--- 
layout: post
title: "Submodule 4"
description: "Submodule 4 of AI Usage Mini-Quest of Generating the Itinerary"
permalink: /west-coast/ai/submodule_4/
parent: "AI Usage"
team: "TheSprinters"
microblog: True
submodule: 4
categories: [CSP, Submodule, AIUsage]
tags: [ai, submodule, Generation]
author: "TheSprinters"
date: 2025-10-21
---
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>West Coast Trip Planner</title>
  <meta name="description" content="Plan a beautiful, accessible, and shareable West Coast itinerary in five guided steps." />
  <meta property="og:title" content="West Coast Trip Planner" />
  <meta property="og:description" content="Plan a beautiful, accessible, and shareable West Coast itinerary in five guided steps." />
  <meta name="theme-color" content="#667eea" />
  <style>
    :root {
      --bg1: #667eea;
      --bg2: #764ba2;
      --text: #e4e4e7;
      --card: #ffffff;
      --ink: #111827;
      --muted: #6b7280;
      --brand: #667eea;
      --brand-2: #764ba2;
      --ok: #10b981;
      --ok-2: #34d399;
      --ring: #93c5fd;
      --radius: 16px;
      --shadow: 0 10px 40px rgba(0,0,0,.18);
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --card: rgba(255,255,255,.98);
        --ink: #1f2937;
      }
    }

    * { box-sizing: border-box }
    html, body { height: 100% }
    body {
      margin: 0; padding: 40px 20px; line-height: 1.65; font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
      color: var(--text);
      background: linear-gradient(135deg, var(--bg1) 0%, var(--bg2) 100%);
      min-height: 100vh;
    }

    .container { max-width: 980px; margin: 0 auto }

    h1 { color: #fff; font-weight: 800; font-size: clamp(2rem, 2.5vw + 1rem, 3rem); text-align: center; margin: 0 0 12px; text-shadow: 2px 2px 4px rgba(0,0,0,.25) }
    .subtitle { text-align: center; color: #efeafe; margin: 0 0 28px; font-size: 1.05rem }

    .progress-container { background: rgba(255,255,255,.18); height: 10px; border-radius: 999px; overflow: hidden; margin: 26px 0 36px; backdrop-filter: blur(10px) }
    .progress-bar { height: 100%; background: linear-gradient(90deg, var(--ok), var(--ok-2)); width: 0%; transition: width .4s ease }

    .steps { display: grid; grid-template-columns: repeat(5, minmax(48px,1fr)); gap: 12px; margin-bottom: 28px }
    .step-dot { height: 44px; border-radius: 999px; display: grid; place-items: center; font-weight: 700; color: #fff; border: 2px solid transparent; background: rgba(255,255,255,.22); transition: transform .2s }
    .step-dot[aria-current="step"] { background: var(--ok); border-color: #fff; transform: scale(1.06) }
    .step-dot.completed { background: var(--ok-2) }

    section.step { display: none }
    section.step.active { display: block; animation: fade-in .35s ease both }

    @keyframes fade-in { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }

    .card {
      background: var(--card); color: var(--ink); border-radius: var(--radius); box-shadow: var(--shadow); padding: clamp(22px, 2vw, 36px); margin-bottom: 22px
    }

    h2 { color: var(--brand); margin: 0 0 10px; font-size: clamp(1.4rem, 1.4vw + .9rem, 2rem) }
    .step-description { color: var(--muted); margin-bottom: 18px }

    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px,1fr)); gap: 16px }

    .selectable {
      appearance: none; border: 3px solid #e5e7eb; border-radius: 14px; background: #fff; padding: 20px; text-align: left; cursor: pointer; transition: transform .15s, border-color .15s, box-shadow .15s; position: relative
    }
    .selectable .icon { font-size: 2rem; display: inline-block; margin-right: 8px }
    .selectable .title { font-weight: 700; color: #374151 }
    .selectable .hint { color: #6b7280; font-size: .95rem }
    .selectable:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(102,126,234,.25); border-color: var(--brand) }
    .selectable:focus-visible { outline: 3px solid var(--ring); outline-offset: 3px }
    .selectable[aria-pressed="true"], .selectable[aria-checked="true"] { border-color: var(--brand); background: #eef2ff }
    .selectable[disabled] { opacity: .55; cursor: not-allowed }

    .buttons { display: flex; gap: 12px; justify-content: flex-end; margin-top: 16px; flex-wrap: wrap }
    .btn { border: 0; border-radius: 12px; padding: 12px 22px; font-weight: 700; cursor: pointer; transition: transform .15s, box-shadow .15s }
    .btn:disabled { opacity: .5; cursor: not-allowed }
    .btn.primary { color: #fff; background: linear-gradient(135deg, var(--brand), var(--brand-2)) }
    .btn.primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(102,126,234,.35) }
    .btn.secondary { background: #e5e7eb; color: #374151 }
    .btn.secondary:hover { background: #d1d5db }

    .pill { color: var(--brand); font-weight: 600; margin: 8px 0 0 }

    .itinerary { background: linear-gradient(135deg, #f9fafb, #eef2ff); border-radius: 14px; padding: 24px }
    .itinerary h3 { color: var(--brand); text-align: center; margin: 0 0 16px }
    .stop { background: #fff; border-left: 4px solid var(--brand); border-radius: 10px; padding: 16px; margin: 0 0 12px }
    .stop h4 { margin: 0 0 8px; color: #111827 }
    .row { display: flex; gap: 16px; flex-wrap: wrap; color: #4b5563; font-size: .98rem }
    .row .item { display: inline-flex; gap: 8px; align-items: center }

    textarea { width: 100%; border: 2px solid #e5e7eb; border-radius: 12px; padding: 14px; font: inherit; min-height: 120px }
    textarea:focus { outline: none; border-color: var(--brand) }

    .helper { color: #ef4444; font-weight: 600; margin: 8px 0 0; min-height: 1.2em }
    [hidden] { display: none !important }

    /* Print itinerary nicely */
    @media print {
      body { background: #fff; color: #000; padding: 0 }
      .container { max-width: none }
      .steps, .progress-container, .buttons, .subtitle { display: none }
      .card { box-shadow: none; border: 0; padding: 0 }
      .itinerary, .stop { page-break-inside: avoid }
    }

    /* Motion accessibility */
    @media (prefers-reduced-motion: reduce) {
      .selectable:hover, .btn.primary:hover { transform: none; box-shadow: none }
      .progress-bar, section.step.active { transition: none; animation: none }
    }
  </style>
</head>
<body>
  <div class="container" role="application" aria-labelledby="title">
    <h1 id="title">🌴 West Coast Trip Planner</h1>
    <p class="subtitle">Plan your dream vacation step by step!</p>

    <div class="progress-container" aria-hidden="true">
      <div class="progress-bar" id="progressBar"></div>
    </div>

    <div class="steps" aria-label="Progress">
      <div class="step-dot" id="dot1" aria-current="step">1</div>
      <div class="step-dot" id="dot2">2</div>
      <div class="step-dot" id="dot3">3</div>
      <div class="step-dot" id="dot4">4</div>
      <div class="step-dot" id="dot5">5</div>
    </div>

    <div class="card" role="alert" aria-live="polite" id="msg" hidden></div>

    <!-- Step 1: Choose Destinations -->
    <section class="card step active" id="step1" aria-labelledby="s1h">
      <h2 id="s1h">Step 1: Choose Your Destinations</h2>
      <p class="step-description">Select <strong>exactly three</strong> cities for your West Coast adventure.</p>
      <p class="pill" id="destCount">Selected: 0/3</p>

      <div class="grid" role="group" aria-label="Destinations (choose 3)">
        <!-- Use buttons with aria-pressed for multi-select -->
        <button class="selectable" data-destination="San Francisco, CA" aria-pressed="false">
          <div class="icon" aria-hidden="true">🌉</div>
          <div class="title">San Francisco</div>
          <div class="hint">Golden Gate Bridge, cable cars, tech hub</div>
        </button>
        <button class="selectable" data-destination="Los Angeles, CA" aria-pressed="false">
          <div class="icon" aria-hidden="true">🎬</div>
          <div class="title">Los Angeles</div>
          <div class="hint">Hollywood, beaches, entertainment</div>
        </button>
        <button class="selectable" data-destination="San Diego, CA" aria-pressed="false">
          <div class="icon" aria-hidden="true">🏖️</div>
          <div class="title">San Diego</div>
          <div class="hint">Perfect weather, beaches, zoo</div>
        </button>
        <button class="selectable" data-destination="Portland, OR" aria-pressed="false">
          <div class="icon" aria-hidden="true">🌲</div>
          <div class="title">Portland</div>
          <div class="hint">Food scene, nature, quirky culture</div>
        </button>
        <button class="selectable" data-destination="Seattle, WA" aria-pressed="false">
          <div class="icon" aria-hidden="true">☕</div>
          <div class="title">Seattle</div>
          <div class="hint">Space Needle, coffee, tech culture</div>
        </button>
        <button class="selectable" data-destination="Las Vegas, NV" aria-pressed="false">
          <div class="icon" aria-hidden="true">🎰</div>
          <div class="title">Las Vegas</div>
          <div class="hint">Entertainment, shows, nightlife</div>
        </button>
      </div>

      <div class="buttons">
        <button class="btn primary" id="nextFromDest" disabled>Next Step</button>
      </div>

      <p class="helper" id="destError" aria-live="polite"></p>
    </section>

    <!-- Step 2: Transportation -->
    <section class="card step" id="step2" aria-labelledby="s2h">
      <h2 id="s2h">Step 2: Choose Your Transportation</h2>
      <p class="step-description">How do you want to travel between destinations?</p>

      <div class="grid" role="radiogroup" aria-label="Transportation">
        <button class="selectable" data-transport="Drive" role="radio" aria-checked="false">
          <div class="icon" aria-hidden="true">🚗</div>
          <div class="title">Drive</div>
          <div class="hint">Flexible, scenic routes, road trip vibes</div>
        </button>
        <button class="selectable" data-transport="Fly" role="radio" aria-checked="false">
          <div class="icon" aria-hidden="true">✈️</div>
          <div class="title">Fly</div>
          <div class="hint">Fast, convenient, saves time</div>
        </button>
        <button class="selectable" data-transport="Train" role="radio" aria-checked="false">
          <div class="icon" aria-hidden="true">🚂</div>
          <div class="title">Take the Train</div>
          <div class="hint">Relaxing, scenic, eco-friendly</div>
        </button>
        <button class="selectable" data-transport="Bus" role="radio" aria-checked="false">
          <div class="icon" aria-hidden="true">🚌</div>
          <div class="title">Take the Bus</div>
          <div class="hint">Budget-friendly, meet people</div>
        </button>
      </div>

      <div class="buttons">
        <button class="btn secondary" id="backFromTransport">Back</button>
        <button class="btn primary" id="nextFromTransport" disabled>Next Step</button>
      </div>
    </section>

    <!-- Step 3: Accommodations -->
    <section class="card step" id="step3" aria-labelledby="s3h">
      <h2 id="s3h">Step 3: Choose Your Accommodations</h2>
      <p class="step-description">Where will you stay during your trip?</p>

      <div class="grid" role="radiogroup" aria-label="Accommodations">
        <button class="selectable" data-accommodation="Hotel" role="radio" aria-checked="false">
          <div class="icon" aria-hidden="true">🏨</div>
          <div class="title">Hotel</div>
          <div class="hint">Comfortable, amenities, room service</div>
        </button>
        <button class="selectable" data-accommodation="Hostel" role="radio" aria-checked="false">
          <div class="icon" aria-hidden="true">🛏️</div>
          <div class="title">Hostel</div>
          <div class="hint">Budget-friendly, social, meet travelers</div>
        </button>
        <button class="selectable" data-accommodation="Airbnb" role="radio" aria-checked="false">
          <div class="icon" aria-hidden="true">🏠</div>
          <div class="title">Airbnb</div>
          <div class="hint">Home away from home, local experience</div>
        </button>
        <button class="selectable" data-accommodation="Camping" role="radio" aria-checked="false">
          <div class="icon" aria-hidden="true">⛺</div>
          <div class="title">Camping</div>
          <div class="hint">Adventure, nature, budget-friendly</div>
        </button>
      </div>

      <div class="buttons">
        <button class="btn secondary" id="backFromAccommodation">Back</button>
        <button class="btn primary" id="nextFromAccommodation" disabled>Generate Itinerary</button>
      </div>
    </section>

    <!-- Step 4: Generated Itinerary -->
    <section class="card step" id="step4" aria-labelledby="s4h">
      <h2 id="s4h">Step 4: Your Custom Itinerary</h2>
      <p class="step-description">Here's your personalized West Coast trip plan!</p>

      <div id="itineraryPreview" class="itinerary"></div>

      <div class="card" style="margin-top:16px">
        <h3 style="color:var(--brand); margin:0 0 10px">💡 Trip Planning Notes</h3>
        <p style="margin: 0 0 10px; color: var(--muted)">Jot down ideas to make your trip better, save money, or be more eco-friendly:</p>
        <label for="tripNotes" class="visually-hidden">Trip notes</label>
        <textarea id="tripNotes" placeholder="Examples: Research free activities • Bring reusable bottles • Look for local farmers markets…"></textarea>
        <div class="buttons">
          <button class="btn secondary" id="printBtn" title="Print / Save as PDF">🖨️ Print</button>
          <button class="btn secondary" id="exportBtn" title="Export to JSON">⬇️ Export</button>
          <button class="btn secondary" id="shareBtn" title="Share summary">🔗 Share</button>
        </div>
      </div>

      <div class="buttons">
        <button class="btn secondary" id="backFromItinerary">Back</button>
        <button class="btn primary" id="nextFromItinerary">Share & Discuss</button>
      </div>
    </section>

    <!-- Step 5: Share & Reflect -->
    <section class="card step" id="step5" aria-labelledby="s5h">
      <h2 id="s5h">Step 5: Share Your Itinerary</h2>
      <p class="step-description">Share your trip plan and discuss improvements with classmates!</p>

      <div class="card">
        <h3 style="color:var(--brand); margin:0 0 8px">🌟 Your Trip Summary</h3>
        <div id="finalSummary"></div>
      </div>

      <div class="card">
        <h3 style="color:var(--brand); margin:0 0 8px">💬 Discussion Questions</h3>
        <ul style="color: var(--muted); margin: 4px 0 0 18px; line-height: 1.9">
          <li>What can you do to make your trip more enjoyable?</li>
          <li>Where could you save money without losing fun?</li>
          <li>What eco-friendly choices can you add?</li>
          <li>How does your itinerary compare to classmates?</li>
        </ul>
      </div>

      <div class="card">
        <h3 style="color:var(--brand); margin:0 0 8px">✍️ Reflection</h3>
        <label for="reflection" class="visually-hidden">Reflection</label>
        <textarea id="reflection" placeholder="What did you learn from your classmates? What would you change about your itinerary?"></textarea>
      </div>

      <div class="buttons">
        <button class="btn secondary" id="backFromShare">Back</button>
        <button class="btn primary" id="restartBtn">Plan Another Trip 🎉</button>
      </div>
    </section>
  </div>

  <script>
    // --- State ---
    const STEPS = 5;
    let currentStep = 1;
    let selectedDestinations = [];
    let selectedTransport = '';
    let selectedAccommodation = '';

    // Restore from localStorage if available
    const saved = JSON.parse(localStorage.getItem('wc-trip') || 'null');
    if (saved) {
      ({ currentStep, selectedDestinations, selectedTransport, selectedAccommodation } = saved);
      // Delay until DOM paints, then rehydrate
      window.addEventListener('DOMContentLoaded', () => {
        rehydrateSelections();
        for (let i = 1; i < currentStep; i++) stepTo(i + 1, false);
        if (currentStep >= 4) generateItinerary();
        if (currentStep >= 5) generateFinalSummary();
      });
    }

    // --- DOM helpers ---
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

    const progressBar = $('#progressBar');
    const msg = $('#msg');

    function persist() {
      localStorage.setItem('wc-trip', JSON.stringify({ currentStep, selectedDestinations, selectedTransport, selectedAccommodation }));
    }

    function announce(text, type = 'info') {
      if (!text) { msg.hidden = true; return; }
      msg.textContent = text;
      msg.hidden = false;
      msg.style.color = type === 'error' ? '#991b1b' : '#065f46';
      msg.style.background = type === 'error' ? '#fee2e2' : '#ecfdf5';
      msg.style.border = '1px solid ' + (type === 'error' ? '#fecaca' : '#a7f3d0');
      msg.style.borderRadius = '12px';
      msg.style.padding = '12px 14px';
      setTimeout(() => { msg.hidden = true; }, 3000);
    }

    function updateProgress() {
      const progress = ((currentStep - 1) / (STEPS - 1)) * 100;
      progressBar.style.width = progress + '%';
      for (let i = 1; i <= STEPS; i++) {
        const dot = $('#dot' + i);
        dot.removeAttribute('aria-current');
        dot.classList.toggle('completed', i < currentStep);
      }
      $('#dot' + currentStep).setAttribute('aria-current', 'step');
    }

    function stepTo(next, scroll = true) {
      $('#step' + currentStep).classList.remove('active');
      currentStep = next;
      $('#step' + currentStep).classList.add('active');
      updateProgress();
      if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' });
      persist();
    }

    // --- Step 1: Destinations (multi-select, max 3) ---
    const destButtons = $$('[data-destination]');
    const destCount = $('#destCount');
    const nextFromDest = $('#nextFromDest');

    destButtons.forEach(btn => {
      btn.type = 'button';
      btn.addEventListener('click', () => toggleDestination(btn));
      btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleDestination(btn); } });
    });

    function toggleDestination(btn) {
      const dest = btn.dataset.destination;
      const isSelected = btn.getAttribute('aria-pressed') === 'true';
      if (isSelected) {
        btn.setAttribute('aria-pressed', 'false');
        selectedDestinations = selectedDestinations.filter(d => d !== dest);
      } else {
        if (selectedDestinations.length >= 3) { announce('You can choose up to three destinations.', 'error'); return; }
        btn.setAttribute('aria-pressed', 'true');
        selectedDestinations.push(dest);
      }

      // Disable remaining when 3 selected
      const atMax = selectedDestinations.length === 3;
      destButtons.forEach(b => {
        const pressed = b.getAttribute('aria-pressed') === 'true';
        b.disabled = atMax && !pressed;
      });

      destCount.textContent = `Selected: ${selectedDestinations.length}/3`;
      nextFromDest.disabled = selectedDestinations.length !== 3;
      persist();
    }

    nextFromDest.addEventListener('click', () => stepTo(2));

    // --- Step 2: Transport (single-select as radio) ---
    const transportButtons = $$('[data-transport]');
    const nextFromTransport = $('#nextFromTransport');

    transportButtons.forEach(btn => {
      btn.type = 'button';
      btn.addEventListener('click', () => {
        transportButtons.forEach(b => b.setAttribute('aria-checked', 'false'));
        btn.setAttribute('aria-checked', 'true');
        selectedTransport = btn.dataset.transport;
        nextFromTransport.disabled = false;
        persist();
      });
    });

    $('#backFromTransport').addEventListener('click', () => stepTo(1));
    nextFromTransport.addEventListener('click', () => stepTo(3));

    // --- Step 3: Accommodation (radio) ---
    const accommodationButtons = $$('[data-accommodation]');
    const nextFromAccommodation = $('#nextFromAccommodation');

    accommodationButtons.forEach(btn => {
      btn.type = 'button';
      btn.addEventListener('click', () => {
        accommodationButtons.forEach(b => b.setAttribute('aria-checked', 'false'));
        btn.setAttribute('aria-checked', 'true');
        selectedAccommodation = btn.dataset.accommodation;
        nextFromAccommodation.disabled = false;
        persist();
      });
    });

    $('#backFromAccommodation').addEventListener('click', () => stepTo(2));
    nextFromAccommodation.addEventListener('click', () => { generateItinerary(); stepTo(4); });

    // --- Step 4: Itinerary + utilities ---
    $('#backFromItinerary').addEventListener('click', () => stepTo(3));
    $('#nextFromItinerary').addEventListener('click', () => { generateFinalSummary(); stepTo(5); });

    $('#printBtn').addEventListener('click', () => window.print());

    $('#exportBtn').addEventListener('click', () => {
      const data = buildExport();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'west-coast-itinerary.json'; a.click();
      URL.revokeObjectURL(url);
    });

    $('#shareBtn').addEventListener('click', async () => {
      const summary = summaryText();
      try {
        if (navigator.share) {
          await navigator.share({ title: 'West Coast Trip', text: summary });
        } else {
          await navigator.clipboard.writeText(summary);
          announce('Summary copied to clipboard!');
        }
      } catch (e) {
        announce('Could not share. Copied summary to clipboard instead.');
        try { await navigator.clipboard.writeText(summary); } catch {}
      }
    });

    // --- Step 5: Share & Reflect ---
    $('#backFromShare').addEventListener('click', () => stepTo(4));
    $('#restartBtn').addEventListener('click', () => restart());

    // --- Core generators ---
    function generateItinerary() {
      const wrap = $('#itineraryPreview');
      wrap.innerHTML = `
        <h3>✨ Your West Coast Adventure</h3>
        ${selectedDestinations.map((dest, i) => `
          <div class="stop">
            <h4>Stop ${i + 1}: ${dest}</h4>
            <div class="row">
              <div class="item"><span>🚗</span><span>Travel: ${selectedTransport || '—'}</span></div>
              <div class="item"><span>🏨</span><span>Stay: ${selectedAccommodation || '—'}</span></div>
              <div class="item"><span>📅</span><span>2–3 days recommended</span></div>
            </div>
          </div>
        `).join('')}
      `;
    }

    function generateFinalSummary() {
      const notes = $('#tripNotes').value.trim();
      $('#finalSummary').innerHTML = `
        <p style="color:#4b5563; line-height:1.9">
          <strong>🌍 Destinations:</strong> ${selectedDestinations.join(' → ')}<br />
          <strong>🚗 Transportation:</strong> ${selectedTransport}<br />
          <strong>🏨 Accommodations:</strong> ${selectedAccommodation}<br />
          <strong>⏱️ Total Trip Duration:</strong> ${(selectedDestinations.length * 2.5).toFixed(1)} days (approx)${notes ? `<br /><br /><strong>📝 Your Notes:</strong><br />${escapeHtml(notes)}` : ''}
        </p>`;
    }

    function buildExport() {
      return {
        version: 1,
        generatedAt: new Date().toISOString(),
        selections: {
          destinations: selectedDestinations,
          transport: selectedTransport,
          accommodation: selectedAccommodation,
        },
        estimatedDays: selectedDestinations.length * 2.5,
        notes: $('#tripNotes').value || ''
      };
    }

    function summaryText() {
      return `West Coast Trip\n\nDestinations: ${selectedDestinations.join(' → ')}\nTransport: ${selectedTransport}\nAccommodation: ${selectedAccommodation}\nDuration: ${(selectedDestinations.length * 2.5).toFixed(1)} days`;
    }

    function restart() {
      currentStep = 1;
      selectedDestinations = [];
      selectedTransport = '';
      selectedAccommodation = '';
      localStorage.removeItem('wc-trip');

      // Reset UI selections
      destButtons.forEach(b => { b.setAttribute('aria-pressed', 'false'); b.disabled = false; });
      transportButtons.forEach(b => b.setAttribute('aria-checked', 'false'));
      accommodationButtons.forEach(b => b.setAttribute('aria-checked', 'false'));

      $('#tripNotes').value = '';
      $('#reflection').value = '';
      $('#finalSummary').innerHTML = '';
      $('#itineraryPreview').innerHTML = '';

      $('#destCount').textContent = 'Selected: 0/3';
      $('#nextFromDest').disabled = true;
      $('#nextFromTransport').disabled = true;
      $('#nextFromAccommodation').disabled = true;

      // Switch step
      $$('.step').forEach(s => s.classList.remove('active'));
      $('#step1').classList.add('active');
      updateProgress();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function rehydrateSelections() {
      // Destinations
      destButtons.forEach(b => {
        const sel = selectedDestinations.includes(b.dataset.destination);
        b.setAttribute('aria-pressed', sel ? 'true' : 'false');
      });
      const atMax = selectedDestinations.length === 3;
      destButtons.forEach(b => {
        const pressed = b.getAttribute('aria-pressed') === 'true';
        b.disabled = atMax && !pressed;
      });
      $('#destCount').textContent = `Selected: ${selectedDestinations.length}/3`;
      $('#nextFromDest').disabled = selectedDestinations.length !== 3;

      // Transport
      transportButtons.forEach(b => b.setAttribute('aria-checked', (b.dataset.transport === selectedTransport).toString()))
      $('#nextFromTransport').disabled = !selectedTransport;

      // Accommodation
      accommodationButtons.forEach(b => b.setAttribute('aria-checked', (b.dataset.accommodation === selectedAccommodation).toString()))
      $('#nextFromAccommodation').disabled = !selectedAccommodation;

      updateProgress();
    }

    function escapeHtml(str) {
      return str.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
    }

    // Keyboard shortcuts for power users
    document.addEventListener('keydown', (e) => {
      if (e.altKey || e.metaKey || e.ctrlKey) return;
      if (e.key === 'ArrowRight') {
        if (currentStep === 1 && selectedDestinations.length !== 3) return announce('Pick 3 destinations first', 'error');
        if (currentStep === 2 && !selectedTransport) return announce('Choose a transportation option', 'error');
        if (currentStep === 3 && !selectedAccommodation) return announce('Choose an accommodation', 'error');
        if (currentStep < STEPS) stepTo(currentStep + 1);
      }
      if (e.key === 'ArrowLeft' && currentStep > 1) stepTo(currentStep - 1);
    });

    // Initialize first render when no saved state
    if (!saved) updateProgress();
  </script>
</body>
</html>
<style>
.completion-banner {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 25px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  z-index: 1000;
  animation: slideInBanner 0.5s ease-out;
}

@keyframes slideInBanner {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>



<!-- Lock/Unlock Logic -->
<script>
// Scroll-to-bottom completion tracking
document.addEventListener("DOMContentLoaded", function() {
    const storageKey = 'ai-module-c4-completed';
    
    // Check if already completed
    if (localStorage.getItem(storageKey) === 'true') {
        return;
    }
    
    let hasScrolledToBottom = false;
    
    function checkScrollPosition() {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Check if user scrolled to within 100px of bottom
        if (scrollTop + windowHeight >= documentHeight - 100) {
            if (!hasScrolledToBottom) {
                hasScrolledToBottom = true;
                
                // Mark module as completed
                localStorage.setItem(storageKey, 'true');
                
                // Show completion banner
                const banner = document.createElement('div');
                banner.className = 'completion-banner';
                banner.innerHTML = `
                    <h3 style="margin: 0; font-size: 18px; font-weight: bold;">🎉 Module 4 Completed!</h3>
                    <p style="margin: 5px 0 0 0; font-size: 14px;">You have finished the AI Module!!</p>
                `;
                document.body.appendChild(banner);
                
                // Remove banner after 4 seconds
                setTimeout(() => {
                    banner.style.animation = 'slideInBanner 0.5s ease-out reverse';
                    setTimeout(() => banner.remove(), 500);
                }, 4000);
                
                // Remove scroll listener
                window.removeEventListener('scroll', checkScrollPosition);
            }
        }
    }
    
    // Add scroll listener
    window.addEventListener('scroll', checkScrollPosition);
    
    // Check immediately in case page is short
    checkScrollPosition();
});
</script>