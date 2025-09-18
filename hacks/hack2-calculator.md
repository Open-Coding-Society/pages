---
title: Hack 2 Calculator Code (Starter)
layout: base
description: Complete the TODOs in this file to finish Hack 2 (calculator history).
permalink: /hack2calculator
---

<!-- 
Hack 2 focus: Add a CALCULATION HISTORY that shows the last 10 expressions, like Chrome's calculator.
These TODOs practice variables, functions, buttons, CSS styling, and DOM updates.
-->

<!-- ===== STYLE (students can tweak this) ===== -->
<style>
  .calculator-output {
    /* result panel spans the first row */
    grid-column: span 4;
    grid-row: span 1;
    border-radius: 10px;
    padding: 0.25em;
    font-size: 20px;
    border: 5px solid black;
    display: flex;
    flex-direction: column;      /* show history above the live output */
    align-items: flex-end;       /* right-align text like real calculators */
    gap: .25rem;
  }

  /*
  ┌─────────────────────────────────────────┐
  │ 📝 TODO-H1: STYLE THE HISTORY AREA      │
  │ Change the font-size or color to make   │
  │ history readable.                       │
  │ Example: font-size: 12px; color: #9aa0a6│
  └─────────────────────────────────────────┘
  */
  #history {
    /* your styles here */
  }
  #history ul { margin: 0; padding: 0 0 0 1rem; }
  #history li { list-style: none; }

  .history-controls {
    display: flex; gap: .5rem; align-self: stretch; justify-content: flex-end;
  }
  .history-btn {
    /* tiny utility button for clear/export */
    border: 1px solid #444; border-radius: 6px; padding: 2px 6px; font-size: 12px; cursor: pointer;
    background: transparent;
  }

  canvas { filter: none; }
</style>

<!-- ===== CALCULATOR UI ===== -->
<div id="animation">
  <div class="calculator-container">
      <!-- result + history -->
      <div class="calculator-output">
        <div class="history-controls">
         <!--
         ┌─────────────────────────────────────────┐
         │ 📝 TODO-H2: CREATE CLEAR HISTORY BUTTON │
         │ Add a button element with               │
         │ id="clear-history" and class="history-  │
         │ btn". Text should be "Clear"            │
         └─────────────────────────────────────────┘
         -->
         <!-- your button here -->
        </div>
        <div id="history"><!-- history list renders here --></div>
        <div id="output">0</div>
      </div>
      <!-- keypad -->
      <!-- row 1 -->
      <div class="calculator-number">1</div>
      <div class="calculator-number">2</div>
      <div class="calculator-number">3</div>
      <div class="calculator-operation">+</div>
      <!-- row 2 -->
      <div class="calculator-number">4</div>
      <div class="calculator-number">5</div>
      <div class="calculator-number">6</div>
      <div class="calculator-operation">-</div>
      <!-- row 3 -->
      <div class="calculator-number">7</div>
      <div class="calculator-number">8</div>
      <div class="calculator-number">9</div>
      <div class="calculator-operation">*</div>
      <!-- row 4 -->
      <div class="calculator-clear">A/C</div>
      <div class="calculator-number">0</div>
      <div class="calculator-number">.</div>
      <div class="calculator-equals">=</div>
  </div>
</div>

<!-- ===== JavaScript (INLINE EXPRESSION + HISTORY TODOs) ===== -->
<script>
// ========== STATE ==========
let tokens = [];          // expression tokens: ["12", "/", "3", "+", "2", "*", "4"]
let currentNum = "";      // digits being typed (string, allows ".")
let justEvaluated = false;

/*
┌─────────────────────────────────────────┐
│ 📝 TODO-H3: DECLARE HISTORY VARIABLE    │
│ Create a variable named `history` to    │
│ store the history entries (array)       │
└─────────────────────────────────────────┘
*/
// code here

// ========== DOM ==========
const output     = document.getElementById("output");
const historyEl  = document.getElementById("history");
const numbers    = document.querySelectorAll(".calculator-number");
const operations = document.querySelectorAll(".calculator-operation");
const equals     = document.querySelectorAll(".calculator-equals");
const clearBtns  = document.querySelectorAll(".calculator-clear");
const clearHistoryBtn = document.getElementById("clear-history");

// ========== UTILITIES ==========
function isOp(x){ return x === "+" || x === "-" || x === "*" || x === "/"; }

function updateScreen(){
  const expr = tokens.join(" ");
  const tail = currentNum !== "" ? (expr ? " " : "") + currentNum : "";
  output.textContent = (expr + tail) || "0";
}

// ===== HISTORY FUNCTIONS =====

function renderHistory(){
  historyEl.innerHTML = `<ul>${history.map(item => `<li>${item}</li>`).join("")}</ul>`;
}

function addToHistory(exprString, resultShown){
  history.unshift(`${exprString} = ${resultShown}`);
  /*
  ┌─────────────────────────────────────────┐
  │ 📝 TODO-H4: UPDATE HISTORY VARIABLE     │
  │ Update the history array to keep only   │
  │ the last 10 entries by using            │
  │ slice(0, 10) to assign the first 10     │
  │ items back to the history variable.     │
  │ Then call renderHistory() to update     │
  │ the display.                            │
  └─────────────────────────────────────────┘
  */
  // your code here to update history variable

}

/*
┌─────────────────────────────────────────┐
│ 📝 TODO-H5: CREATE RESETALL FUNCTION    │
│ Create a function called resetAll() that│
│ resets the calculator to its starting   │
│ state. Look at the STATE section above  │
│ to see what variables need to be reset  │
│ to their initial values (don't forget   |
|  the history variable). Also call       |
|  updateScreen() and renderHistory()     │
└─────────────────────────────────────────┘
*/
// your function here

// ===== precedence-aware evaluation (provided) =====
function evalTokens(seq){
  if (!seq.length) return 0;

  const arr = seq.slice();
  if (isOp(arr[arr.length - 1])) arr.pop();
  if (!arr.length) return 0;

  // Pass 1: collapse * and / left-to-right
  let stage = [];
  stage.push(parseFloat(arr[0]));
  for (let i = 1; i < arr.length; i += 2) {
    const op  = arr[i];
    const num = parseFloat(arr[i + 1]);
    if (op === "*" || op === "/") {
      const prev = stage.pop();
      stage.push(op === "*" ? prev * num : prev / num);
    } else {
      stage.push(op, num);
    }
  }

  // Pass 2: + and - left-to-right
  let result = stage[0];
  for (let i = 1; i < stage.length; i += 2) {
    const op  = stage[i];
    const num = stage[i + 1];
    result = (op === "+") ? result + num : result - num;
  }
  return result;
}

// ========== INPUT HANDLERS ==========
numbers.forEach(btn => btn.addEventListener("click", () => onDigit(btn.textContent)));
operations.forEach(btn => btn.addEventListener("click", () => onOperator(btn.textContent)));
equals.forEach(btn => btn.addEventListener("click", onEquals));
clearBtns.forEach(btn => btn.addEventListener("click", resetAll));


if (clearHistoryBtn) {
  clearHistoryBtn.addEventListener("click", () => {
    history = [];
    renderHistory();
  });
}

function onDigit(ch){
  if (justEvaluated) {
    tokens = [];
    currentNum = "";
    justEvaluated = false;
  }

  if (ch === "."){
    // allow only one dot per number
    if (currentNum.includes(".")) return;
    currentNum = (currentNum === "") ? "0." : currentNum + ".";
  } else {
    currentNum = (currentNum === "0") ? ch : currentNum + ch;
  }
  updateScreen();
}

function onOperator(op){
  // No current number yet
  if (currentNum === ""){
    // Replace last operator if two typed in a row
    if (tokens.length && isOp(tokens[tokens.length-1])){
      tokens[tokens.length-1] = op;
      updateScreen();
      return;
    }
    if (!tokens.length) { updateScreen(); return; }
  } else {
    tokens.push(currentNum);
    currentNum = "";
  }

  // Guard: replace or push
  if (tokens.length && isOp(tokens[tokens.length-1])){
    tokens[tokens.length-1] = op;
  } else {
    tokens.push(op);
  }

  justEvaluated = false;
  updateScreen();
}

function onEquals(){
  if (currentNum !== "") tokens.push(currentNum);
  if (!tokens.length || isOp(tokens[tokens.length-1])) { updateScreen(); return; }

  const exprString = tokens.join(" ");
  const result = evalTokens(tokens);

  // OPTIONAL: Round for nicer display
  const shown = Math.round((result + Number.EPSILON) * 1e12) / 1e12;

  // Show "expr = result"
  output.textContent = `${exprString} = ${shown}`;

  /*
  ┌─────────────────────────────────────────┐
  │ 📝 TODO-H6: SAVE TO HISTORY            │
  │ Call addToHistory() with exprString     │
  │ and shown result so calculation gets    │
  │ saved to history list                   │
  └─────────────────────────────────────────┘
  */
  // code here

  // Continue from result
  tokens = [];
  currentNum = String(shown);
  justEvaluated = true;
}

// initial render
updateScreen();
renderHistory();  // show empty history on load
</script>

<!-- ===== Background animations (unchanged) ===== -->
<script src="{{site.baseurl}}/assets/js/three.r119.min.js"></script>
<script src="{{site.baseurl}}/assets/js/vanta.halo.min.js"></script>
<script src="{{site.baseurl}}/assets/js/vanta.birds.min.js"></script>
<script src="{{site.baseurl}}/assets/js/vanta.net.min.js"></script>
<script src="{{site.baseurl}}/assets/js/vanta.rings.min.js"></script>
<script>
var vantaInstances = { halo: VANTA.HALO, birds: VANTA.BIRDS, net: VANTA.NET, rings: VANTA.RINGS };
var vantaInstance = vantaInstances[Object.keys(vantaInstances)[Math.floor(Math.random() * Object.keys(vantaInstances).length)]];
vantaInstance({ el: "#animation", mouseControls: true, touchControls: true, gyroControls: false });
</script>