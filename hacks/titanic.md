---
layout: opencs
permalink: /titanic
title: Titanic Survival Predictor
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Titanic Survival Predictor</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background: linear-gradient(135deg, #0a1628 0%, #1a3a5c 50%, #0d2137 100%);
      min-height: 100vh;
      color: #e0e8f0;
    }

    header {
      text-align: center;
      padding: 40px 20px 20px;
      background: rgba(0,0,0,0.3);
      border-bottom: 2px solid rgba(180,200,220,0.2);
    }

    header h1 {
      font-size: 2.4rem;
      color: #c8dff0;
      letter-spacing: 2px;
      text-shadow: 0 0 20px rgba(100,180,255,0.4);
    }

    header p {
      color: #8aa8c0;
      margin-top: 8px;
      font-size: 1rem;
    }

    .container {
      max-width: 900px;
      margin: 40px auto;
      padding: 0 20px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    @media (max-width: 680px) {
      .container { grid-template-columns: 1fr; }
    }

    .card {
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(180,210,240,0.15);
      border-radius: 12px;
      padding: 28px;
      backdrop-filter: blur(6px);
    }

    .card h2 {
      color: #90c4e8;
      font-size: 1.15rem;
      margin-bottom: 20px;
      border-bottom: 1px solid rgba(144,196,232,0.3);
      padding-bottom: 10px;
    }

    label {
      display: block;
      font-size: 0.82rem;
      color: #8aa8c0;
      margin-bottom: 4px;
      margin-top: 14px;
    }

    input[type="number"],
    select {
      width: 100%;
      padding: 9px 12px;
      background: rgba(0,0,0,0.35);
      border: 1px solid rgba(144,196,232,0.25);
      border-radius: 7px;
      color: #d0e4f4;
      font-size: 0.93rem;
      outline: none;
      transition: border-color 0.2s;
    }

    input[type="number"]:focus,
    select:focus {
      border-color: #5ba8d4;
    }

    select option { background: #1a3a5c; }

    .radio-group {
      display: flex;
      gap: 20px;
      margin-top: 6px;
    }

    .radio-group label {
      margin: 0;
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      color: #c0d8ec;
    }

    .radio-group input[type="radio"] { accent-color: #5ba8d4; }

    button#predict-btn {
      grid-column: 1 / -1;
      width: 100%;
      padding: 14px;
      background: linear-gradient(90deg, #1a6fa8, #0e4d7a);
      color: #fff;
      border: none;
      border-radius: 9px;
      font-size: 1.05rem;
      font-weight: 600;
      cursor: pointer;
      letter-spacing: 1px;
      transition: background 0.25s, transform 0.1s;
      margin-top: 4px;
    }

    button#predict-btn:hover { background: linear-gradient(90deg, #2280bf, #1560a0); }
    button#predict-btn:active { transform: scale(0.98); }
    button#predict-btn:disabled { opacity: 0.55; cursor: default; }

    /* Result section */
    #result-section {
      grid-column: 1 / -1;
      display: none;
    }

    #result-section.visible { display: block; }

    .result-card {
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(180,210,240,0.15);
      border-radius: 12px;
      padding: 28px;
      text-align: center;
    }

    .result-title {
      font-size: 1.3rem;
      color: #90c4e8;
      margin-bottom: 24px;
    }

    .probability-bars {
      display: flex;
      gap: 20px;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 28px;
    }

    .prob-item { flex: 1; min-width: 160px; max-width: 220px; }

    .prob-label {
      font-size: 0.85rem;
      color: #8aa8c0;
      margin-bottom: 8px;
    }

    .prob-value {
      font-size: 2rem;
      font-weight: 700;
    }

    .prob-value.survive { color: #4cce88; }
    .prob-value.die { color: #e05b5b; }

    .prob-bar-track {
      height: 10px;
      background: rgba(255,255,255,0.1);
      border-radius: 5px;
      margin-top: 10px;
      overflow: hidden;
    }

    .prob-bar-fill {
      height: 100%;
      border-radius: 5px;
      transition: width 0.6s ease;
    }

    .prob-bar-fill.survive { background: linear-gradient(90deg, #2ea860, #4cce88); }
    .prob-bar-fill.die     { background: linear-gradient(90deg, #a83030, #e05b5b); }

    #verdict {
      font-size: 1.1rem;
      padding: 14px 24px;
      border-radius: 8px;
      display: inline-block;
      font-weight: 600;
      margin-bottom: 28px;
    }

    #verdict.survived {
      background: rgba(76,206,136,0.15);
      color: #4cce88;
      border: 1px solid rgba(76,206,136,0.4);
    }

    #verdict.perished {
      background: rgba(224,91,91,0.15);
      color: #e05b5b;
      border: 1px solid rgba(224,91,91,0.4);
    }

    /* Feature importance */
    .features-title {
      font-size: 1rem;
      color: #90c4e8;
      margin-bottom: 14px;
      text-align: left;
    }

    .feature-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }

    .feature-name {
      width: 130px;
      font-size: 0.8rem;
      color: #8aa8c0;
      text-align: right;
      flex-shrink: 0;
    }

    .feature-track {
      flex: 1;
      height: 8px;
      background: rgba(255,255,255,0.1);
      border-radius: 4px;
      overflow: hidden;
    }

    .feature-fill {
      height: 100%;
      background: linear-gradient(90deg, #1a6fa8, #5ba8d4);
      border-radius: 4px;
      transition: width 0.5s ease;
    }

    .feature-pct {
      width: 42px;
      font-size: 0.78rem;
      color: #7099b8;
      text-align: right;
      flex-shrink: 0;
    }

    #error-msg {
      color: #e07070;
      font-size: 0.9rem;
      text-align: center;
      margin-top: 6px;
      min-height: 20px;
    }

    .spinner {
      display: none;
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255,255,255,0.2);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      margin: 0 auto 12px;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <header>
    <h1>&#9875; Titanic Survival Predictor</h1>
    <p>Enter your passenger details to find out if you would have survived.</p>
  </header>

  <div class="container">

    <!-- Left card: Personal info -->
    <div class="card">
      <h2>Personal Details</h2>

      <label for="name">Your Name</label>
      <input type="text" id="name" placeholder="e.g. Jane Smith"
             style="width:100%;padding:9px 12px;background:rgba(0,0,0,0.35);border:1px solid rgba(144,196,232,0.25);border-radius:7px;color:#d0e4f4;font-size:0.93rem;outline:none;" />

      <label>Sex</label>
      <div class="radio-group">
        <label><input type="radio" name="sex" value="male" checked /> Male</label>
        <label><input type="radio" name="sex" value="female" /> Female</label>
      </div>

      <label for="age">Age</label>
      <input type="number" id="age" value="30" min="0" max="100" />

      <label for="pclass">Passenger Class</label>
      <select id="pclass">
        <option value="1">1st Class (Upper)</option>
        <option value="2" selected>2nd Class (Middle)</option>
        <option value="3">3rd Class (Lower)</option>
      </select>

      <label>Travelling Alone?</label>
      <div class="radio-group">
        <label><input type="radio" name="alone" value="false" checked /> No (with family)</label>
        <label><input type="radio" name="alone" value="true" /> Yes, alone</label>
      </div>
    </div>

    <!-- Right card: Travel info -->
    <div class="card">
      <h2>Travel Details</h2>

      <label for="sibsp">Siblings / Spouses Aboard</label>
      <input type="number" id="sibsp" value="1" min="0" max="10" />

      <label for="parch">Parents / Children Aboard</label>
      <input type="number" id="parch" value="0" min="0" max="10" />

      <label for="fare">Fare Paid (£)</label>
      <input type="number" id="fare" value="16.00" min="0" max="512" step="0.01" />

      <label for="embarked">Port of Embarkation</label>
      <select id="embarked">
        <option value="S" selected>Southampton (S) — most common</option>
        <option value="C">Cherbourg (C)</option>
        <option value="Q">Queenstown (Q)</option>
      </select>
    </div>

    <!-- Full-width predict button -->
    <button id="predict-btn" onclick="predict()">&#9670; Predict My Survival</button>
    <div id="error-msg"></div>

    <!-- Result section -->
    <div id="result-section">
      <div class="result-card">
        <div class="spinner" id="spinner"></div>
        <div class="result-title" id="result-name"></div>

        <div class="probability-bars">
          <div class="prob-item">
            <div class="prob-label">Survival Probability</div>
            <div class="prob-value survive" id="survive-pct">—</div>
            <div class="prob-bar-track">
              <div class="prob-bar-fill survive" id="survive-bar" style="width:0%"></div>
            </div>
          </div>
          <div class="prob-item">
            <div class="prob-label">Death Probability</div>
            <div class="prob-value die" id="die-pct">—</div>
            <div class="prob-bar-track">
              <div class="prob-bar-fill die" id="die-bar" style="width:0%"></div>
            </div>
          </div>
        </div>

        <div id="verdict"></div>

        <div style="text-align:left;margin-top:10px;">
          <div class="features-title">Feature Importance (Decision Tree)</div>
          <div id="feature-bars"></div>
        </div>
      </div>
    </div>

  </div>

  <script type="module">
    import { pythonURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';

    window.predict = async function () {
      const errorEl = document.getElementById('error-msg');
      errorEl.textContent = '';

      const name   = document.getElementById('name').value.trim() || 'Passenger';
      const sex    = document.querySelector('input[name="sex"]:checked').value;
      const age    = parseFloat(document.getElementById('age').value);
      const pclass = parseInt(document.getElementById('pclass').value);
      const alone  = document.querySelector('input[name="alone"]:checked').value === 'true';
      const sibsp  = parseInt(document.getElementById('sibsp').value);
      const parch  = parseInt(document.getElementById('parch').value);
      const fare   = parseFloat(document.getElementById('fare').value);
      const embarked = document.getElementById('embarked').value;

      if (isNaN(age) || isNaN(fare)) {
        errorEl.textContent = 'Please fill in all numeric fields correctly.';
        return;
      }

      const passenger = { name, pclass, sex, age, sibsp, parch, fare, embarked, alone };

      const btn = document.getElementById('predict-btn');
      const spinner = document.getElementById('spinner');
      btn.disabled = true;
      spinner.style.display = 'block';
      document.getElementById('result-section').classList.remove('visible');

      try {
        const response = await fetch(`${pythonURI}/api/titanic/predict`, {
          ...fetchOptions,
          method: 'POST',
          body: JSON.stringify(passenger),
        });

        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        const data = await response.json();

        // Probabilities
        const surviveP = (data.survive * 100).toFixed(1);
        const dieP     = (data.die * 100).toFixed(1);

        document.getElementById('survive-pct').textContent = surviveP + '%';
        document.getElementById('die-pct').textContent     = dieP + '%';
        document.getElementById('survive-bar').style.width = surviveP + '%';
        document.getElementById('die-bar').style.width     = dieP + '%';

        const verdictEl = document.getElementById('verdict');
        if (data.survive >= 0.5) {
          verdictEl.textContent = `✓ ${name} would likely have SURVIVED!`;
          verdictEl.className = 'survived';
        } else {
          verdictEl.textContent = `✗ ${name} would likely have PERISHED.`;
          verdictEl.className = 'perished';
        }

        document.getElementById('result-name').textContent =
          `Prediction for: ${name}`;

        // Feature weights
        const fwResp = await fetch(`${pythonURI}/api/titanic/feature-weights`, {
          ...fetchOptions,
          method: 'GET',
        });
        if (fwResp.ok) {
          const fw = await fwResp.json();
          const container = document.getElementById('feature-bars');
          container.innerHTML = '';
          const sorted = Object.entries(fw).sort((a,b) => b[1]-a[1]);
          const maxW = sorted[0]?.[1] || 1;
          for (const [feat, weight] of sorted) {
            const pct = (weight * 100).toFixed(1);
            const barW = ((weight / maxW) * 100).toFixed(1);
            container.innerHTML += `
              <div class="feature-row">
                <div class="feature-name">${feat.replace('embarked_', 'embarked ')}</div>
                <div class="feature-track">
                  <div class="feature-fill" style="width:${barW}%"></div>
                </div>
                <div class="feature-pct">${pct}%</div>
              </div>`;
          }
        }

        document.getElementById('result-section').classList.add('visible');
      } catch (err) {
        errorEl.textContent = 'Could not reach the prediction server. Is the Flask backend running?';
        console.error(err);
      } finally {
        btn.disabled = false;
        spinner.style.display = 'none';
      }
    };
  </script>
</body>
</html>
