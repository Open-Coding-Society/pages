---
layout: post
microblog: True
title: CPT Program Trace Builder
description: A simple manual tool for tracing program execution step-by-step for AP CSP CPT practice.
author: David M, Sloane S
permalink: /cpt/3
breadcrumb: True
---

## CPT Program Tracing Overview

In AP CSP, “tracing a program” means explaining how a program runs step-by-step.

You should describe:
- Input or starting state
- How values change during execution
- How loops repeat actions
- How conditions affect decisions
- Final output

Key idea: You are tracking execution over time, not just describing code.

---

<style>
body, .container, .container * {
  color: #000 !important;
}

.container {
  max-width: 900px;
  margin: auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.section {
  margin-top: 16px;
  padding: 16px;
  border-radius: 10px;
  border: 1px solid #ddd;
  background: #f8f8f8;
}

textarea {
  width: 100%;
  min-height: 120px;
  padding: 10px;
  margin-top: 6px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  background: #fff;
}

label {
  font-weight: bold;
  display: block;
  margin-top: 10px;
}

button {
  padding: 10px 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-right: 8px;
  margin-top: 10px;
  font-weight: bold;
}

.save {
  background: #28a745;
  color: white;
}
</style>

<div class="container">

<div class="section">
<h3>📘 Written Response of Purpose</h3>
<textarea id="programInput"></textarea>
<button class="save" onclick="save('programInput')">Save</button>
</div>

<div class="section">
<h3>✍️ Program Trace</h3>

<label>Input / Start State</label>
<textarea id="inputState"></textarea>
<button class="save" onclick="save('inputState')">Save</button>

<label>Loop Behavior</label>
<textarea id="loopState"></textarea>
<button class="save" onclick="save('loopState')">Save</button>

<label>Condition</label>
<textarea id="conditionState"></textarea>
<button class="save" onclick="save('conditionState')">Save</button>

<label>Updates</label>
<textarea id="updateState"></textarea>
<button class="save" onclick="save('updateState')">Save</button>

<label>Output</label>
<textarea id="outputState"></textarea>
<button class="save" onclick="save('outputState')">Save</button>

</div>

<script>
function save(id) {
  const el = document.getElementById(id);
  if (!el) return;
  localStorage.setItem(id, el.value);
}

window.addEventListener("DOMContentLoaded", () => {
  ["programInput","inputState","loopState","conditionState","updateState","outputState"]
  .forEach(id => {
    const saved = localStorage.getItem(id);
    if (saved) document.getElementById(id).value = saved;
  });
});
</script>