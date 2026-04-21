---
layout: post
title: Futures Mini-Game
permalink: /gamify/fortuneFinders/futures
---

<style>
  :root{
    --bg:#070f16;
    --panel:#0c1a24;
    --panel2:#0b1620;
    --text:#e7fff7;
    --muted:rgba(231,255,247,0.7);
    --accent:#39ffb6;
    --accent2:#00c2ff;
    --danger:#ff4d6d;
    --warn:#fbbf24;
    --ok:#22c55e;
    --line:#173445;
  }
  body{background:radial-gradient(900px 600px at 20% 10%, rgba(57,255,182,0.14), transparent 60%),
               radial-gradient(700px 500px at 80% 0%, rgba(0,194,255,0.12), transparent 55%),
               var(--bg);
       color:var(--text); font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;}
  .wrap{max-width:980px;margin:24px auto;padding:0 16px;}
  .header{display:flex;gap:14px;align-items:flex-end;justify-content:space-between;margin-bottom:14px;}
  .title{font-size:26px;letter-spacing:0.5px;}
  .sub{color:var(--muted);font-size:13px;}
  .grid{display:grid;grid-template-columns: 360px 1fr;gap:14px;}
  @media (max-width: 900px){.grid{grid-template-columns:1fr;}}
  .card{background:linear-gradient(180deg, rgba(12,26,36,0.98), rgba(7,15,22,0.98));
        border:1px solid rgba(57,255,182,0.22); border-radius:14px; padding:14px;}
  .card h3{margin:0 0 10px 0;font-size:14px;color:rgba(231,255,247,0.9);text-transform:uppercase;letter-spacing:1px;}
  label{display:block;font-size:12px;color:var(--muted);margin:10px 0 6px;}
  select,input{width:100%;padding:10px 10px;border-radius:12px;border:1px solid var(--line);
               background:var(--panel2); color:var(--text); outline:none;}
  .row{display:grid;grid-template-columns:1fr 1fr; gap:10px;}
  .btnRow{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px;}
  button{padding:10px 12px;border-radius:12px;border:1px solid rgba(57,255,182,0.35);
         background:rgba(57,255,182,0.12); color:var(--text); cursor:pointer;}
  button.primary{background:linear-gradient(90deg, rgba(57,255,182,0.25), rgba(0,194,255,0.18)); border-color:rgba(57,255,182,0.55);}
  button.danger{background:rgba(255,77,109,0.14); border-color:rgba(255,77,109,0.35);}
  button:disabled{opacity:0.45;cursor:not-allowed;}
  .statGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:8px;}
  .stat{background:rgba(9,20,30,0.75);border:1px solid rgba(23,52,69,0.9);border-radius:12px;padding:10px;}
  .stat .k{font-size:11px;color:var(--muted);}
  .stat .v{font-size:16px;margin-top:6px;}
  .log{height:220px; overflow:auto; background:rgba(9,20,30,0.75);
       border:1px solid rgba(23,52,69,0.9); border-radius:12px; padding:10px; font-size:12px; line-height:1.45;}
  canvas{width:100%; height:280px; border-radius:12px; border:1px solid rgba(23,52,69,0.9); background:rgba(9,20,30,0.75);}
  .pill{display:inline-flex;align-items:center;gap:8px;padding:6px 10px;border-radius:999px;border:1px solid rgba(57,255,182,0.25);
        color:var(--muted);font-size:12px;}
  .dot{width:8px;height:8px;border-radius:50%;background:var(--warn);}
  .dot.ok{background:var(--ok);}
  .dot.bad{background:var(--danger);}
  .footer{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:12px;color:var(--muted);font-size:12px;}
</style>

<div class="wrap">
  <div class="header">
    <div>
      <div class="title">Futures Trading Mini‑Game</div>
      <div class="sub">Pick a product (seeds/pigs), choose LONG/SHORT, manage margin, survive volatility.</div>
    </div>
    <div class="pill"><span id="statusDot" class="dot"></span><span id="statusText">Not started</span></div>
  </div>

  <div class="grid">
    <div class="card">
      <h3>Setup</h3>
      <label>Commodity</label>
      <select id="commodity">
        <option value="CORN">Corn seeds (bushels)</option>
        <option value="WHEAT">Wheat seeds (bushels)</option>
        <option value="HOGS">Lean hogs / pigs (lbs)</option>
      </select>

      <div class="row">
        <div>
          <label>Position</label>
          <select id="side">
            <option value="LONG">LONG</option>
            <option value="SHORT">SHORT</option>
          </select>
        </div>
        <div>
          <label>Contracts</label>
          <input id="contracts" type="number" min="1" step="1" value="1"/>
        </div>
      </div>

      <div class="row">
        <div>
          <label>Margin %</label>
          <input id="marginPct" type="number" min="5" max="50" step="1" value="12"/>
        </div>
        <div>
          <label>Starting Cash ($)</label>
          <input id="cash" type="number" min="100" step="100" value="10000"/>
        </div>
      </div>

      <div class="btnRow">
        <button class="primary" id="btnStart">Start session</button>
        <button id="btnStep" disabled>Simulate 1 day</button>
        <button class="danger" id="btnReset">Reset</button>
      </div>

      <div class="statGrid">
        <div class="stat"><div class="k">Futures Price</div><div class="v" id="px">—</div></div>
        <div class="stat"><div class="k">Unrealized P/L</div><div class="v" id="pnl">—</div></div>
        <div class="stat"><div class="k">Margin Used</div><div class="v" id="marginUsed">—</div></div>
      </div>

      <div class="footer">
        <div>Goal: finish 10 simulated days without going negative.</div>
        <button id="btnComplete" disabled class="primary">Mark complete</button>
      </div>
    </div>

    <div class="card">
      <h3>Market</h3>
      <canvas id="chart" width="900" height="420"></canvas>
      <h3 style="margin-top:12px;">Tape</h3>
      <div class="log" id="log"></div>
    </div>
  </div>
</div>

<script>
(() => {
  const PRODUCTS = {
    CORN: { label: "Corn seeds", unit: "bushel", contractSize: 5000, base: 4.2, vol: 0.025 },
    WHEAT: { label: "Wheat seeds", unit: "bushel", contractSize: 5000, base: 5.1, vol: 0.028 },
    HOGS: { label: "Lean hogs (pigs)", unit: "lb", contractSize: 40000, base: 0.86, vol: 0.032 },
  };

  const el = (id) => document.getElementById(id);
  const logEl = el("log");
  const chart = el("chart");
  const ctx = chart.getContext("2d");

  const statusDot = el("statusDot");
  const statusText = el("statusText");

  function setStatus(kind, text) {
    statusDot.className = "dot" + (kind === "ok" ? " ok" : kind === "bad" ? " bad" : "");
    statusText.textContent = text;
  }

  function fmt(n) {
    if (!Number.isFinite(n)) return "—";
    return "$" + n.toFixed(2);
  }

  function appendLog(line) {
    const p = document.createElement("div");
    p.textContent = line;
    logEl.appendChild(p);
    logEl.scrollTop = logEl.scrollHeight;
  }

  let state = null;

  function draw() {
    ctx.clearRect(0,0,chart.width,chart.height);

    // background grid
    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = "#173445";
    for (let x=0;x<=chart.width;x+=60){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,chart.height); ctx.stroke(); }
    for (let y=0;y<=chart.height;y+=60){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(chart.width,y); ctx.stroke(); }
    ctx.globalAlpha = 1;

    if (!state || state.prices.length < 2) return;

    const prices = state.prices;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const pad = (max-min) * 0.15 + 1e-6;
    const lo = min - pad;
    const hi = max + pad;

    const toX = (i) => 40 + (i/(prices.length-1))*(chart.width-70);
    const toY = (p) => 20 + (1-((p-lo)/(hi-lo)))*(chart.height-50);

    // axis labels
    ctx.fillStyle = "rgba(231,255,247,0.75)";
    ctx.font = "12px ui-monospace, monospace";
    ctx.fillText(fmt(hi), 12, 20);
    ctx.fillText(fmt(lo), 12, chart.height-20);

    // line
    ctx.lineWidth = 3;
    const grad = ctx.createLinearGradient(0,0,chart.width,0);
    grad.addColorStop(0, "#39ffb6");
    grad.addColorStop(1, "#00c2ff");
    ctx.strokeStyle = grad;
    ctx.beginPath();
    ctx.moveTo(toX(0), toY(prices[0]));
    for (let i=1;i<prices.length;i++) ctx.lineTo(toX(i), toY(prices[i]));
    ctx.stroke();

    // last dot
    ctx.fillStyle = "#39ffb6";
    const lx = toX(prices.length-1), ly = toY(prices[prices.length-1]);
    ctx.beginPath(); ctx.arc(lx, ly, 6, 0, Math.PI*2); ctx.fill();
  }

  function recompute() {
    if (!state) return;
    const p = state.prices[state.prices.length-1];
    const prod = PRODUCTS[state.product];
    const contracts = state.contracts;
    const notional = p * prod.contractSize * contracts;
    const marginUsed = notional * state.marginPct;
    const delta = p - state.entryPx;
    const pnl = (state.side === "LONG" ? delta : -delta) * prod.contractSize * contracts;
    state.pnl = pnl;
    state.marginUsed = marginUsed;

    el("px").textContent = fmt(p);
    el("pnl").textContent = fmt(pnl);
    el("marginUsed").textContent = fmt(marginUsed);

    draw();
  }

  function start() {
    const product = el("commodity").value;
    const side = el("side").value;
    const contracts = Math.max(1, Math.floor(Number(el("contracts").value || 1)));
    const cash = Number(el("cash").value || 10000);
    const marginPct = Number(el("marginPct").value || 12) / 100;

    const prod = PRODUCTS[product];
    const entry = +(prod.base * (0.92 + Math.random()*0.18)).toFixed(3);

    state = {
      product,
      side,
      contracts,
      cash,
      marginPct,
      entryPx: entry,
      prices: [entry],
      day: 0,
      pnl: 0,
      marginUsed: 0,
    };

    logEl.innerHTML = "";
    appendLog(`Started: ${prod.label} | ${side} | ${contracts} contract(s)`);
    appendLog(`Entry futures: $${entry}/${prod.unit} | Contract size: ${prod.contractSize.toLocaleString()} ${prod.unit}`);
    setStatus("warn","In session");

    el("btnStep").disabled = false;
    el("btnComplete").disabled = true;
    recompute();
  }

  function step() {
    if (!state) return;
    const prod = PRODUCTS[state.product];
    const last = state.prices[state.prices.length-1];

    // Random walk with occasional shock
    const shock = Math.random() < 0.12 ? (Math.random()*2-1) * prod.vol * 4 : 0;
    const drift = (Math.random()*2-1) * prod.vol;
    const next = Math.max(0.05, +(last * (1 + drift + shock)).toFixed(3));

    state.prices.push(next);
    state.day++;

    recompute();

    const equity = state.cash + state.pnl - state.marginUsed;
    const sign = state.pnl >= 0 ? "+" : "";
    appendLog(`Day ${state.day}: futures=${fmt(next)} | P/L=${sign}${state.pnl.toFixed(2)} | equity≈${equity.toFixed(2)}`);

    if (equity < 0) {
      setStatus("bad","Margin call (failed)");
      appendLog("Margin call: equity below $0. Reset and try again.");
      el("btnStep").disabled = true;
      el("btnComplete").disabled = true;
      return;
    }

    if (state.day >= 10) {
      setStatus("ok","Completed 10 days");
      appendLog("You survived 10 days. Mark complete to unlock the next map.");
      el("btnStep").disabled = true;
      el("btnComplete").disabled = false;
    }
  }

  function reset() {
    state = null;
    logEl.innerHTML = "";
    el("px").textContent = "—";
    el("pnl").textContent = "—";
    el("marginUsed").textContent = "—";
    el("btnStep").disabled = true;
    el("btnComplete").disabled = true;
    setStatus("warn","Not started");
    draw();
  }

  function complete() {
    if (!state || state.day < 10) return;
    setStatus("ok","Complete (sent to game)");
    // Notify parent level (Fortune Finders) to unlock the gate.
    window.parent?.postMessage({ type: "ff:futures:complete" }, "*");
    appendLog("Completion sent to Fortune Finders (you can close this window).");
  }

  el("btnStart").addEventListener("click", start);
  el("btnStep").addEventListener("click", step);
  el("btnReset").addEventListener("click", reset);
  el("btnComplete").addEventListener("click", complete);

  reset();
})();
</script>

