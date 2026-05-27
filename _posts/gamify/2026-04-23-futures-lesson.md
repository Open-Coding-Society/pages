---
toc: true
layout: post
title: Coding Behind Futures Trading
description: Learn how the backend tracks margins and triggers margin calls.
type: tangibles
permalink: /gamify/fortuneFinders/futures-lesson
---

<div id="App" class="quant-lesson-container">
  <div class="app-header">
    <div class="header-content">
      <h1 class="app-title">Coding Behind Futures Trading</h1>
      <p class="subtitle">Understand the logic of Margin Accounts and Mark-to-Market.</p>
    </div>
  </div>

  <div class="lesson-content">
    <div class="module-card">
      <h2>1. Margin & Mark-to-Market</h2>
      <p>In Futures trading, you don't pay the full price of the asset. Instead, you put down a deposit called <strong>Margin</strong>. At the end of every trading day, the exchange checks your account balance to see if your trades made or lost money (<strong>Mark-to-Market</strong>).</p>
      <p>If your account balance drops below the <strong>Maintenance Margin</strong> requirement, the system automatically triggers a <strong>Margin Call</strong>, forcing you to deposit more funds or liquidating your position.</p>
      <pre><code>// Backend Margin Check Logic
public void endOfDayCheck(TraderAccount account) {
    account.balance += calculateDailyPnL();
    
    if (account.balance < MAINTENANCE_MARGIN) {
        triggerMarginCall(account);
    }
}
</code></pre>
    </div>

    <div class="module-card">
      <h2>2. Interactive Margin Call Simulator</h2>
      <p>Step through the backend code execution as the market fluctuates day by day. Watch the system check your balance!</p>
      
      <div class="interactive-playground">
        <h3>🏦 Mark-to-Market Engine</h3>
        
        <div style="display: flex; gap: 20px; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 200px; background: #0f172a; padding: 15px; border-radius: 8px; border: 1px solid #334155;">
            <h4 style="margin-top: 0; color: #94a3b8;">Account Status</h4>
            <p>Day: <strong id="sim-day">1</strong></p>
            <p>Maintenance Margin: <strong>$1,000</strong></p>
            <p style="font-size: 24px; margin-bottom: 0;">Balance: $<span id="sim-balance" style="color: #10b981;">2500</span></p>
            
            <button class="btn-primary" onclick="simulateMarketDay()" id="sim-btn" style="width: 100%; margin-top: 20px;">Simulate Market Day</button>
            <button class="btn-secondary" onclick="resetSimulator()" style="width: 100%; margin-top: 10px;">Reset Account</button>
          </div>
          
          <div style="flex: 2; min-width: 300px;">
            <div class="console-output" id="sim-code-box">
              <div id="line-1">public void endOfDayCheck(TraderAccount account) {</div>
              <div id="line-2" style="padding-left: 20px;">// Daily PnL: $<span id="sim-pnl">0</span></div>
              <div id="line-3" style="padding-left: 20px;">account.balance += <span id="sim-pnl-val">0</span>; <span style="color:#94a3b8;">// Balance is now $<span id="sim-bal-val">2500</span></span></div>
              <div id="line-4" style="padding-left: 20px;"><br>if (account.balance < 1000) {</div>
              <div id="line-5" style="padding-left: 40px;">triggerMarginCall(account);</div>
              <div id="line-6" style="padding-left: 20px;">} else {</div>
              <div id="line-7" style="padding-left: 40px;">// All Good. Continue trading.</div>
              <div id="line-8" style="padding-left: 20px;">}</div>
              <div id="line-9">}</div>
            </div>
            
            <div id="margin-call-alert" style="display: none; background: #ef4444; color: white; padding: 15px; border-radius: 8px; margin-top: 15px; text-align: center; font-weight: bold; font-size: 20px; animation: flash 1s infinite alternate;">
              🚨 MARGIN CALL TRIGGERED 🚨<br>
              <span style="font-size: 14px; font-weight: normal;">Account balance fell below maintenance requirement!</span>
            </div>
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
  .console-output { background: #000; color: #4ade80; font-family: monospace; padding: 12px; border-radius: 4px; min-height: 50px; line-height: 1.5; }
  .btn-primary { padding: 10px 24px; border-radius: 8px; border: none; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; font-weight: bold; cursor: pointer; transition: transform 0.2s; }
  .btn-primary:hover { transform: translateY(-2px); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .btn-secondary { padding: 10px 24px; border-radius: 8px; border: 1px solid #64748b; background: transparent; color: #e2e8f0; font-weight: bold; cursor: pointer; }
  .btn-secondary:hover { background: #334155; }
  .active-line { background: #1e3a8a; border-radius: 4px; padding: 2px 5px; margin: -2px -5px; }
  
  @keyframes flash {
    from { background-color: #ef4444; }
    to { background-color: #991b1b; }
  }
</style>

<script>
  let day = 1;
  let balance = 2500;
  let isSimulating = false;

  function setLineActive(lineNum) {
    for (let i = 1; i <= 9; i++) {
      document.getElementById(`line-${i}`).className = i === lineNum ? 'active-line' : '';
    }
  }

  function simulateMarketDay() {
    if (isSimulating || balance < 1000) return;
    isSimulating = true;
    document.getElementById('sim-btn').disabled = true;
    
    // Random PnL between -$800 and +$500
    const pnl = Math.floor(Math.random() * 1300) - 800;
    
    document.getElementById('sim-pnl').innerText = pnl;
    document.getElementById('sim-pnl-val').innerText = pnl;
    document.getElementById('sim-pnl').style.color = pnl >= 0 ? '#10b981' : '#ef4444';
    
    // Step 1: Add PnL
    setLineActive(2);
    setTimeout(() => {
      setLineActive(3);
      balance += pnl;
      document.getElementById('sim-bal-val').innerText = balance;
      
      const balEl = document.getElementById('sim-balance');
      balEl.innerText = balance;
      balEl.style.color = balance < 1000 ? '#ef4444' : '#10b981';
      
      // Step 2: Check Margin
      setTimeout(() => {
        setLineActive(4);
        
        setTimeout(() => {
          if (balance < 1000) {
            setLineActive(5);
            setTimeout(() => {
              document.getElementById('margin-call-alert').style.display = 'block';
              isSimulating = false;
            }, 500);
          } else {
            setLineActive(7);
            setTimeout(() => {
              setLineActive(0); // clear
              day++;
              document.getElementById('sim-day').innerText = day;
              isSimulating = false;
              document.getElementById('sim-btn').disabled = false;
            }, 800);
          }
        }, 800);
      }, 800);
    }, 800);
  }
  
  function resetSimulator() {
    day = 1;
    balance = 2500;
    isSimulating = false;
    document.getElementById('sim-day').innerText = day;
    document.getElementById('sim-balance').innerText = balance;
    document.getElementById('sim-balance').style.color = '#10b981';
    document.getElementById('sim-pnl').innerText = "0";
    document.getElementById('sim-pnl-val').innerText = "0";
    document.getElementById('sim-bal-val').innerText = "2500";
    document.getElementById('sim-pnl').style.color = '#4ade80';
    document.getElementById('margin-call-alert').style.display = 'none';
    document.getElementById('sim-btn').disabled = false;
    setLineActive(0);
  }
</script>
