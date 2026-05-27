---
toc: true
layout: post
title: Coding Behind Options Trading
description: Learn how the backend calculates Options payoffs and risk.
type: tangibles
permalink: /gamify/fortuneFinders/options-lesson
---

<div id="App" class="quant-lesson-container">
  <div class="app-header">
    <div class="header-content">
      <h1 class="app-title">Coding Behind Options Trading</h1>
      <p class="subtitle">Understand the math and logic behind calculating options payoffs.</p>
    </div>
  </div>

  <div class="lesson-content">
    <div class="module-card">
      <h2>1. The Basics of Options Logic</h2>
      <p>An <strong>Option</strong> gives you the right to buy or sell a stock at a specific price (the <strong>Strike Price</strong>). You pay a fee upfront (the <strong>Premium</strong>) for this right.</p>
      <ul>
        <li><strong>Call Option:</strong> Right to buy. You profit if the stock price goes UP.</li>
        <li><strong>Put Option:</strong> Right to sell. You profit if the stock price goes DOWN.</li>
      </ul>
      <p>In our trading engine backend, we calculate the profit of a Call option at expiration using a simple mathematical formula:</p>
      <pre><code>// Backend calculation for a Long Call Option
double currentPrice = marketData.getCurrentPrice();
double intrinsicValue = Math.max(0, currentPrice - strikePrice);
double profit = intrinsicValue - premium;
</code></pre>
    </div>

    <div class="module-card">
      <h2>2. Interactive Payoff Logic Sandbox</h2>
      <p>Adjust the sliders below to see how the JavaScript logic calculates your profit in real-time. Watch the code update!</p>
      
      <div class="interactive-playground">
        <h3>📈 Call Option Payoff Simulator</h3>
        <div class="playground-controls" style="flex-direction: column; align-items: stretch;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
            <label>Current Stock Price ($<span id="price-val">150</span>)</label>
            <input type="range" id="price-slider" min="50" max="250" value="150" oninput="updateOptionsSandbox()" style="width: 60%;" />
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
            <label>Strike Price ($<span id="strike-val">100</span>)</label>
            <input type="range" id="strike-slider" min="50" max="200" value="100" oninput="updateOptionsSandbox()" style="width: 60%;" />
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
            <label>Premium Paid ($<span id="premium-val">10</span>)</label>
            <input type="range" id="premium-slider" min="1" max="50" value="10" oninput="updateOptionsSandbox()" style="width: 60%;" />
          </div>
        </div>

        <div class="console-output" style="margin-top: 15px;">
          <code style="color: #60a5fa;">// Live Code Execution:</code><br>
          <code>let intrinsicValue = Math.max(0, <span id="code-price" style="color: #fcd34d;">150</span> - <span id="code-strike" style="color: #fcd34d;">100</span>); <span style="color: #94a3b8;">// Result: <span id="code-intrinsic">50</span></span></code><br>
          <code>let profit = <span id="code-intrinsic2" style="color: #fcd34d;">50</span> - <span id="code-premium" style="color: #fcd34d;">10</span>;</code><br>
          <code>return <span id="code-profit" style="font-weight: bold; color: #10b981;">40</span>;</code>
        </div>
        
        <div style="margin-top: 20px;">
          <p><strong>Visual Payoff:</strong></p>
          <div style="width: 100%; background: #0f172a; height: 30px; border-radius: 15px; position: relative; overflow: hidden; border: 1px solid #334155;">
            <div id="payoff-bar" style="height: 100%; width: 50%; background: #10b981; position: absolute; left: 50%; transition: all 0.2s;"></div>
            <div style="position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; background: white; z-index: 10;"></div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 12px; color: #94a3b8; margin-top: 5px;">
            <span>Max Loss</span>
            <span>Break Even</span>
            <span>Profit</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .quant-lesson-container { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; color: #e2e8f0; background: #0a1628; min-height: 100vh; padding-bottom: 50px; }
  .app-header { background: linear-gradient(135deg, #122039 0%, #1a2f4a 100%); border-bottom: 2px solid #2d4a6b; padding: 24px 32px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4); }
  .app-title { font-size: 32px; font-weight: 700; margin: 0; background: linear-gradient(135deg, #60a5fa, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .subtitle { color: #94a3b8; margin-top: 8px; }
  .lesson-content { max-width: 800px; margin: 40px auto; padding: 0 20px; }
  .module-card { background: #152844; border: 1px solid #2d4a6b; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 4px 8px rgba(0,0,0,0.3); }
  .module-card h2 { color: #60a5fa; margin-top: 0; }
  .module-card pre { background: #0f172a; padding: 16px; border-radius: 8px; overflow-x: auto; border: 1px solid #334155; }
  .module-card code { color: #38bdf8; }
  .interactive-playground { background: #1e293b; border: 1px solid #38bdf8; border-radius: 8px; padding: 16px; margin: 20px 0; }
  .interactive-playground h3 { margin-top: 0; color: #38bdf8; }
  .console-output { background: #000; color: #4ade80; font-family: monospace; padding: 12px; border-radius: 4px; min-height: 50px; white-space: pre-wrap; line-height: 1.5; }
</style>

<script>
  function updateOptionsSandbox() {
    const price = parseInt(document.getElementById('price-slider').value);
    const strike = parseInt(document.getElementById('strike-slider').value);
    const premium = parseInt(document.getElementById('premium-slider').value);
    
    // Update UI Labels
    document.getElementById('price-val').innerText = price;
    document.getElementById('strike-val').innerText = strike;
    document.getElementById('premium-val').innerText = premium;
    
    // Calculate logic
    const intrinsicValue = Math.max(0, price - strike);
    const profit = intrinsicValue - premium;
    
    // Update code block
    document.getElementById('code-price').innerText = price;
    document.getElementById('code-strike').innerText = strike;
    document.getElementById('code-intrinsic').innerText = intrinsicValue;
    document.getElementById('code-intrinsic2').innerText = intrinsicValue;
    document.getElementById('code-premium').innerText = premium;
    const profitEl = document.getElementById('code-profit');
    profitEl.innerText = profit;
    profitEl.style.color = profit >= 0 ? '#10b981' : '#ef4444';
    
    // Update visual bar
    const payoffBar = document.getElementById('payoff-bar');
    if (profit >= 0) {
      // Scale: 0 to 150 max profit relative to bar width (50%)
      const widthPercent = Math.min(50, (profit / 150) * 50);
      payoffBar.style.left = '50%';
      payoffBar.style.width = widthPercent + '%';
      payoffBar.style.background = '#10b981';
      payoffBar.style.borderRadius = '0 15px 15px 0';
    } else {
      // Scale: 0 to premium (max loss)
      const widthPercent = Math.min(50, (Math.abs(profit) / 50) * 50);
      payoffBar.style.left = (50 - widthPercent) + '%';
      payoffBar.style.width = widthPercent + '%';
      payoffBar.style.background = '#ef4444';
      payoffBar.style.borderRadius = '15px 0 0 15px';
    }
  }
  
  // Initialize
  updateOptionsSandbox();
</script>
