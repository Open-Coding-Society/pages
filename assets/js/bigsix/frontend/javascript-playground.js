// ============================================================
//  javascript-playground.js — OOP class: JS playground
//  Path: assets/js/bigsix/frontend/javascript-playground.js
//
//  Owns everything related to the JavaScript step:
//    - Storing JS example snippets and concept descriptions
//    - Switching between examples via tab nav
//    - Running user code in a sandboxed Function() context
//    - Capturing console.log/warn/error output
//    - Rendering output lines in the console pane
//
//  EXPORTS:
//    JsPlayground  — instantiate and call .init() on DOMContentLoaded
// ============================================================

export class JsPlayground {

  // ── JS example data ───────────────────────────────────────────
  // All hardcoded example content lives here.
  // Add new examples by adding a new key to this object.
  #examples = {
    variables: {
      title: 'Variables &amp; Types',
      tag:   'BASICS',
      desc:  'JavaScript has three ways to declare variables: <code>let</code> (reassignable), <code>const</code> (fixed), and <code>var</code> (old — avoid). Every value has a type: string, number, boolean, object, array, or undefined.',
      code: `// Variables & Types
let name = "Alex";
const age = 22;
var score = 95;       // var is old — prefer let/const

console.log("Name:", name);
console.log("Age:", age);
console.log("Score:", score);
console.log("Type of name:", typeof name);
console.log("Type of age:", typeof age);
console.log("Is age a number?", typeof age === "number");`,
    },

    operators: {
      title: 'Operators',
      tag:   'MATH & LOGIC',
      desc:  'JavaScript supports arithmetic (+, -, *, /, %), comparison (===, !==, &gt;, &lt;), and logical operators (&amp;&amp;, ||, !). Always use === (strict equality) instead of ==.',
      code: `// Operators
let x = 10, y = 3;

console.log("Add:", x + y);
console.log("Subtract:", x - y);
console.log("Multiply:", x * y);
console.log("Divide:", x / y);
console.log("Modulus (remainder):", x % y);
console.log("Power:", x ** 2);
console.log("x > y:", x > y);
console.log("x === 10:", x === 10);
console.log("Both positive:", x > 0 && y > 0);
console.log("Either > 5:", x > 5 || y > 5);`,
    },

    functions: {
      title: 'Functions',
      tag:   'CORE CONCEPT',
      desc:  'Functions are reusable blocks of code. Write them as declarations (<code>function name(){}</code>), expressions (<code>const fn = function(){}</code>), or arrow functions (<code>const fn = () => {}</code>). Arrow functions are the modern standard.',
      code: `// Functions — 3 ways to write them
function greet(name) {
  return "Hello, " + name + "!";
}

const multiply = function(a, b) {
  return a * b;
};

const add = (a, b) => a + b;

// Higher-order function (takes a function as argument)
function applyTwice(fn, value) {
  return fn(fn(value));
}
const double = x => x * 2;

console.log(greet("Frontend Student"));
console.log("3 × 4 =", multiply(3, 4));
console.log("5 + 7 =", add(5, 7));
console.log("double(3) applied twice:", applyTwice(double, 3));`,
    },

    arrays: {
      title: 'Arrays',
      tag:   'DATA STRUCTURES',
      desc:  'Arrays store ordered lists. The most important methods are <code>.map()</code> (transform all items), <code>.filter()</code> (keep items that pass a test), and <code>.reduce()</code> (combine into one value). Used constantly in real projects.',
      code: `// Arrays & Array Methods
const scores = [88, 92, 75, 100, 63, 85];

console.log("First:", scores[0]);
console.log("Length:", scores.length);

const doubled = scores.map(s => s * 2);
console.log("Doubled:", JSON.stringify(doubled));

const passing = scores.filter(s => s >= 80);
console.log("Passing (>=80):", JSON.stringify(passing));

const total = scores.reduce((sum, s) => sum + s, 0);
console.log("Average:", (total / scores.length).toFixed(1));

console.log("Has 100?", scores.includes(100));
console.log("First > 90:", scores.find(s => s > 90));`,
    },

    dom: {
      title: 'DOM Manipulation',
      tag:   'BROWSER API',
      desc:  "The DOM is the browser's representation of your HTML. JavaScript can read and modify it with <code>getElementById()</code>, <code>querySelector()</code>, and properties like <code>.textContent</code>, <code>.style</code>, and <code>.classList</code>.",
      code: `// DOM Manipulation (logged as HTML strings here)
const div = document.createElement('div');
div.id = "myBox";
div.className = "card highlight";
div.textContent = "Dynamic content!";
div.style.color = "blue";

console.log("outerHTML:", div.outerHTML);
console.log("textContent:", div.textContent);
console.log("className:", div.className);

div.classList.add("active");
div.classList.remove("highlight");
console.log("After classList changes:", div.className);

div.setAttribute("data-id", "42");
console.log("data-id:", div.getAttribute("data-id"));`,
    },

    events: {
      title: 'Event Listeners',
      tag:   'INTERACTIVITY',
      desc:  'Events let JavaScript respond to user actions: clicks, key presses, input changes, and more. Use <code>addEventListener(event, callback)</code>. The <code>event</code> object has details about what happened.',
      code: `// Event Listeners (simulated — real events need a live page)
function handleClick(event) {
  console.log("Button clicked!");
  console.log("Event type:", event.type);
  console.log("Target id:", event.target.id);
}

function handleInput(event) {
  console.log("Input changed to:", event.target.value);
}

// Simulate calling them with fake events
handleClick({ type: "click", target: { id: "submitBtn" } });
handleInput({ type: "input", target: { value: "Hello World!" } });

const commonEvents = [
  "click", "dblclick", "keydown", "keyup",
  "input", "change", "submit", "mouseover", "scroll", "load"
];
console.log("Common events:", commonEvents.join(", "));`,
    },
  };


  // ============================================================
  //  WORKER 1 — #formatArg
  //  Single responsibility: convert any JS value to a printable string.
  //  Pure function — used by the console capture logic.
  // ============================================================

  /**
   * Convert any JS value to a human-readable string for console output.
   *
   * @param {*} a - Any value
   * @returns {string}
   */
  #formatArg(a) {
    if (a === null)      return 'null';
    if (a === undefined) return 'undefined';
    if (typeof a === 'object') {
      try { return JSON.stringify(a); } catch (e) { return String(a); }
    }
    return String(a);
  }


  // ============================================================
  //  WORKER 2 — #executeCode
  //  Single responsibility: run a JS string via new Function(),
  //  capture console output, and return log lines + any error.
  //  Does NOT touch the DOM — callers render the results.
  // ============================================================

  /**
   * Execute a JavaScript string, capture console output.
   *
   * @param {string} code - JS code to run
   * @returns {{ lines: Array<{type,msg}>, error: string|null }}
   */
  #executeCode(code) {
    const lines = [];
    const origLog   = console.log;
    const origWarn  = console.warn;
    const origError = console.error;

    // Temporarily hijack console methods to capture output
    console.log   = (...a) => { lines.push({ type:'log',   msg: a.map(x => this.#formatArg(x)).join(' ') }); origLog.apply(console,   a); };
    console.warn  = (...a) => { lines.push({ type:'warn',  msg: a.map(x => this.#formatArg(x)).join(' ') }); origWarn.apply(console,  a); };
    console.error = (...a) => { lines.push({ type:'error', msg: a.map(x => this.#formatArg(x)).join(' ') }); origError.apply(console, a); };

    let error = null;
    try {
      // new Function() creates a sandboxed scope for the user code
      new Function(code)();
    } catch (err) {
      error = err.message;
    }

    // Always restore original console methods
    console.log   = origLog;
    console.warn  = origWarn;
    console.error = origError;

    return { lines, error };
  }


  // ============================================================
  //  WORKER 3 — #renderConsoleOutput
  //  Single responsibility: inject log lines into the console pane.
  //  Only touches #jsConsole and #consoleStatus.
  // ============================================================

  /**
   * Render captured console lines into the console output pane.
   *
   * @param {Array<{type,msg}>} lines  - Log lines from #executeCode
   * @param {string|null}       error  - Error message if execution failed
   */
  #renderConsoleOutput(lines, error) {
    const out    = document.getElementById('jsConsole');
    const status = document.getElementById('consoleStatus');
    out.innerHTML = '';

    // If there was a thrown error, add it to lines
    if (error) lines.push({ type: 'error', msg: error });

    if (!lines.length) {
      out.innerHTML = '<span class="console-empty">No output — add a console.log() call.</span>';
      status.textContent = 'No output';
      return;
    }

    lines.forEach(({ type, msg }) => {
      const el = document.createElement('div');
      el.className   = 'console-line ' + type;
      el.textContent = msg;
      out.appendChild(el);
    });

    status.textContent = error
      ? 'Error'
      : `Done — ${lines.length} line(s)`;
  }


  // ============================================================
  //  WORKER 4 — #loadExample
  //  Single responsibility: update the editor and concept pane
  //  with a specific JS example. Only touches the JS editor elements.
  // ============================================================

  /**
   * Load a JS example into the editor and update the concept description.
   *
   * @param {string} key - Key from #examples (e.g. 'variables')
   */
  #loadExample(key) {
    const ex = this.#examples[key];
    if (!ex) return;

    document.getElementById('jsInput').value     = ex.code;
    document.getElementById('jsConceptTitle').innerHTML =
      `${ex.title} <span class="tag">${ex.tag}</span>`;
    document.getElementById('jsConceptDesc').innerHTML   = ex.desc;

    // Clear console when switching examples
    this.#clearConsole();
  }


  // ============================================================
  //  WORKER 5 — #clearConsole
  //  Single responsibility: reset the console pane to idle state.
  // ============================================================
  #clearConsole() {
    document.getElementById('jsConsole').innerHTML =
      '<span class="console-empty">Run your code to see output here…</span>';
    document.getElementById('consoleStatus').textContent = 'Ready';
  }


  // ============================================================
  //  ORCHESTRATOR — init
  //  Wires tab nav, Run button, Clear button, and loads the first example.
  //  Called once on DOMContentLoaded from frontend_lesson.md.
  // ============================================================

  /**
   * Initialise the JavaScript playground section.
   * Call once on DOMContentLoaded.
   */
  init() {
    // Wire tab nav — each button loads its example
    document.querySelectorAll('#jsTabNav button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#jsTabNav button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.#loadExample(btn.dataset.example);
      });
    });

    // Wire Run button — execute code and render output
    document.getElementById('jsRunBtn').addEventListener('click', () => {
      document.getElementById('consoleStatus').textContent = 'Running…';
      const { lines, error } = this.#executeCode(document.getElementById('jsInput').value);
      this.#renderConsoleOutput(lines, error);
    });

    // Wire Clear button
    document.getElementById('jsClearBtn').addEventListener('click', () => this.#clearConsole());

    // Load the first example on init
    this.#loadExample('variables');
  }
}
