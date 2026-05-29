---
layout: post
microblog: True
title: CPT Project Layout Builder
description: A structured AP CSP CPT drafting tool to learn the foundations and building required components.
author: David M, Sloane S
permalink: /cpt/2
breadcrumb: True
---

## CPT Requirements Overview

The Create Performance Task (CPT) requires a program that demonstrates core computational thinking concepts.

Your program must include:

- **Input**: user interaction  
- **Output**: program-generated result  
- **List**: collection of data items  
- **Procedure**: reusable function with parameter  
- **Algorithm**: sequencing, selection, iteration  

---
<style>

/* FORCE ALL CODEMIRROR CHARACTERS TO BE PURE WHITE */
.CodeMirror,
.CodeMirror * {
  color: #ffffff !important;
  background: #000000 !important;
}

/* Line numbers also white */
.CodeMirror-linenumber {
  color: #ffffff !important;
}

/* Gutter background black */
.CodeMirror-gutters {
  background: #000000 !important;
  border-right: 1px solid #333 !important;
}

/* Output box also white text on black */
.output-content {
  background: #000000 !important;
  color: #ffffff !important;
}

/* PAGE STYLING — NOW FULL DARK MODE */

/* Container stays normal so layout doesn’t break */
.container {
  max-width: 900px;
  margin: auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

/* ALL SECTION BOXES → BLACK */
.section {
  margin-top: 16px;
  padding: 16px;
  border-radius: 10px;
  border: 1px solid #444;
  background: #000000 !important;
  color: #ffffff !important;
}

/* TEXTAREAS → BLACK BOXES + WHITE TEXT */
textarea {
  width: 100%;
  min-height: 120px;
  padding: 10px;
  margin-top: 6px;
  border-radius: 8px;
  border: 1px solid #444;
  font-size: 14px;
  background: #000000 !important;
  color: #ffffff !important;
  resize: vertical;
}

/* LABELS → WHITE */
label {
  font-weight: bold;
  display: block;
  margin-top: 10px;
  color: #ffffff !important;
}

/* BUTTONS — KEEP ORIGINAL COLORS */
button {
  padding: 10px 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-right: 8px;
  margin-top: 10px;
  font-weight: bold;
}

button.save { background: #28a745; color: #fff; }
button.load { background: #007bff; color: #fff; }
button.clear { background: #dc3545; color: #fff; }

/* STATUS TEXT → WHITE */
#status {
  margin-top: 10px;
  font-size: 14px;
  color: #ffffff !important;
}

</style>

<div class="container">

  <div class="section">
    <h3>📘 CPT Purpose</h3>
    <textarea id="ideaInput"></textarea>
  </div>

  <div class="section">
    <h3>Full Program</h3>
    <p>This area can contain a full program combining the component examples below. For now, use the individual component boxes to learn and experiment.</p>
  </div>

  <div class="section">
    <h3>CPT Components</h3>
    <p>Use the sections below to learn each CPT component. Each section explains the concept, gives a short learning tip, and includes an editable example you can run in your browser.</p>

    <div class="section" style="background:#0a0a0a;margin-top:12px;">
      <h4>Input</h4>
      <p><strong>What it is:</strong> data entered by the user (typing, clicking, selecting).</p>
      <p><strong>How to learn:</strong> practice reading values from form fields and using them in your program.</p>
      <label for="input_note">Your notes</label>
      <textarea id="input_note" placeholder="Describe what 'Input' means..."></textarea>
      <label>Example (edit &amp; Run)</label>
      <input id="input_example_field" placeholder="Type something here" style="width:100%;padding:8px;margin-top:6px;border-radius:6px;border:1px solid #444;background:#000;color:#fff;">
      <textarea id="input_example_code">// Read the value from the textbox and show it
const v = document.getElementById('input_example_field').value;
console.log('You entered:', v);
</textarea>
      <div>
        <button onclick="runExample('input')">Run</button>
        <pre id="input_output" class="output-content" style="padding:10px;border-radius:6px;border:1px solid #333;min-height:40px;"></pre>
      </div>
    </div>

    <div class="section" style="background:#0a0a0a;margin-top:12px;">
      <h4>Output</h4>
      <p><strong>What it is:</strong> results produced by the program (text, images, files).</p>
      <p><strong>How to learn:</strong> practice formatting and presenting data clearly.</p>
      <label for="output_note">Your notes</label>
      <textarea id="output_note" placeholder="Describe what 'Output' means..."></textarea>
      <label>Example (edit &amp; Run)</label>
      <textarea id="output_example_code">// Compute a result and display it
const result = 2 + 3;
console.log('Result:', result);
</textarea>
      <div>
        <button onclick="runExample('output')">Run</button>
        <pre id="output_output" class="output-content" style="padding:10px;border-radius:6px;border:1px solid #333;min-height:40px;"></pre>
      </div>
    </div>

    <div class="section" style="background:#0a0a0a;margin-top:12px;">
      <h4>List</h4>
      <p><strong>What it is:</strong> a collection of items you can store and iterate over.</p>
      <p><strong>How to learn:</strong> manipulate arrays/collections (add, remove, search, sort).</p>
      <label for="list_note">Your notes</label>
      <textarea id="list_note" placeholder="Describe what 'List' means..."></textarea>
      <label>Example (edit &amp; Run)</label>
      <textarea id="list_example_code">// Work with a list (array)
const fruits = ['apple','banana'];
fruits.push('cherry');
console.log('Fruits now:', fruits);
console.log('First item:', fruits[0]);
</textarea>
      <div>
        <button onclick="runExample('list')">Run</button>
        <pre id="list_output" class="output-content" style="padding:10px;border-radius:6px;border:1px solid #333;min-height:40px;"></pre>
      </div>
    </div>

    <div class="section" style="background:#0a0a0a;margin-top:12px;">
      <h4>Procedure</h4>
      <p><strong>What it is:</strong> a reusable function with parameters.</p>
      <p><strong>How to learn:</strong> write small functions, call them with different inputs, and reuse them.</p>
      <label for="procedure_note">Your notes</label>
      <textarea id="procedure_note" placeholder="Describe what 'Procedure' means..."></textarea>
      <label>Example (edit &amp; Run)</label>
      <textarea id="procedure_example_code">// Define a procedure (function) and call it
function greet(name) {
  return 'Hello, ' + name + '!';
}
console.log(greet('Student'));
</textarea>
      <div>
        <button onclick="runExample('procedure')">Run</button>
        <pre id="procedure_output" class="output-content" style="padding:10px;border-radius:6px;border:1px solid #333;min-height:40px;"></pre>
      </div>
    </div>

    <div class="section" style="background:#0a0a0a;margin-top:12px;">
      <h4>Algorithm</h4>
      <p><strong>What it is:</strong> step-by-step instructions using sequencing, selection, and iteration.</p>
      <p><strong>How to learn:</strong> trace algorithms on paper, then implement them and test edge cases.</p>
      <label for="algorithm_note">Your notes</label>
      <textarea id="algorithm_note" placeholder="Describe what 'Algorithm' means..."></textarea>
      <label>Example (edit &amp; Run)</label>
      <textarea id="algorithm_example_code">// Simple algorithm: find the largest number
const nums = [3,7,2,9,4];
let max = nums[0];
for (let i=1;i<nums.length;i++){
  if (nums[i] > max) max = nums[i];
}
console.log('Max is', max);
</textarea>
      <div>
        <button onclick="runExample('algorithm')">Run</button>
        <pre id="algorithm_output" class="output-content" style="padding:10px;border-radius:6px;border:1px solid #333;min-height:40px;"></pre>
      </div>
    </div>
  </div>

  <div class="section">
    <h3>💾 Save System</h3>

    <button class="save" onclick="saveCPT()">Save</button>
    <button class="load" onclick="loadCPT()">Load</button>
    <button class="clear" onclick="clearCPT()">Clear</button>

    <p id="status"></p>
  </div>

</div>

{% raw %}
<script>
document.addEventListener("DOMContentLoaded", () => {
  const fields = {
    idea: 'ideaInput',
    input_note: 'input_note',
    output_note: 'output_note',
    list_note: 'list_note',
    procedure_note: 'procedure_note',
    algorithm_note: 'algorithm_note',
    input_example_code: 'input_example_code',
    output_example_code: 'output_example_code',
    list_example_code: 'list_example_code',
    procedure_example_code: 'procedure_example_code',
    algorithm_example_code: 'algorithm_example_code',
    input_example_value: 'input_example_field'
  };

  function getValues() {
    const data = {};
    for (const key in fields) {
      const el = document.getElementById(fields[key]);
      data[key] = el ? el.value : '';
    }
    return data;
  }

  function setValues(data) {
    for (const key in fields) {
      const el = document.getElementById(fields[key]);
      if (!el) continue;
      el.value = data[key] || '';
    }
  }

  function setStatus(msg) {
    const s = document.getElementById('status');
    if (s) s.innerText = msg;
  }

  window.saveCPT = function () {
    try {
      localStorage.setItem('cpt_data', JSON.stringify(getValues()));
      setStatus('Saved successfully.');
    } catch (e) {
      setStatus('Save failed (localStorage not available).');
    }
  };

  window.loadCPT = function () {
    try {
      const raw = localStorage.getItem('cpt_data');
      if (!raw) { setStatus('No saved data.'); return; }
      const data = JSON.parse(raw);
      setValues(data);
      setStatus('Loaded successfully.');
    } catch (e) {
      setStatus('Load failed (localStorage not available).');
    }
  };

  window.clearCPT = function () {
    try { localStorage.removeItem('cpt_data'); } catch (e) { }
    setValues({});
    setStatus('Cleared.');
  };

  window.runExample = function(kind) {
    const codeId = kind + '_example_code';
    const outId = kind + '_output';
    const codeEl = document.getElementById(codeId);
    const outEl = document.getElementById(outId);
    if (!codeEl || !outEl) return;
    outEl.textContent = '';
    const logs = [];
    const originalLog = console.log;
    try {
      console.log = function(...args) {
        logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
      };
      const fn = new Function(codeEl.value);
      fn();
    } catch (e) {
      logs.push('Error: ' + (e && e.message ? e.message : String(e)));
    } finally {
      console.log = originalLog;
      outEl.textContent = logs.join('\n');
    }
  };
});
</script>
{% endraw %}