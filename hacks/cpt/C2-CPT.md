---
layout: post
microblog: True
title: CPT Project Layout Builder
description: A structured AP CSP CPT drafting tool for manually building components.
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
    {% include code-runner.html
       runner_id="full_program_runner"
       language="python"
       code=""
    %}
  </div>

  <div class="section">
    <h3>CPT Components</h3>

    <label for="inputField">Input</label>
    {% include code-runner.html
       runner_id="input_runner"
       language="python"
       code=""
    %}

    <label for="outputField">Output</label>
    {% include code-runner.html
       runner_id="output_runner"
       language="python"
       code=""
    %}

    <label for="listField">List</label>
    {% include code-runner.html
       runner_id="list_runner"
       language="python"
       code=""
    %}

    <label for="procedureField">Procedure</label>
    {% include code-runner.html
       runner_id="procedure_runner"
       language="python"
       code=""
    %}

    <label for="algorithmField">Algorithm</label>
    {% include code-runner.html
       runner_id="algorithm_runner"
       language="python"
       code=""
    %}
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
    idea: "ideaInput"
    // Note: original component textareas removed; idea still supported.
  };

  function getValues() {
    const data = {};
    for (const key in fields) {
      const el = document.getElementById(fields[key]);
      data[key] = el ? el.value : "";
    }
    return data;
  }

  function setValues(data) {
    for (const key in fields) {
      const el = document.getElementById(fields[key]);
      if (el) el.value = data[key] || "";
    }
  }

  function setStatus(msg) {
    const s = document.getElementById("status");
    if (s) s.innerText = msg;
  }

  window.saveCPT = function () {
    try {
      localStorage.setItem("cpt_data", JSON.stringify(getValues()));
      setStatus("Saved successfully.");
    } catch (e) {
      setStatus("Save failed (localStorage not available).");
    }
  };

  window.loadCPT = function () {
    try {
      const raw = localStorage.getItem("cpt_data");
      if (!raw) {
        setStatus("No saved data.");
        return;
      }
      const data = JSON.parse(raw);
      setValues(data);
      setStatus("Loaded successfully.");
    } catch (e) {
      setStatus("Load failed (localStorage not available).");
    }
  };

  window.clearCPT = function () {
    try {
      localStorage.removeItem("cpt_data");
    } catch (e) {
      // ignore if not available
    }
    setValues({});
    setStatus("Cleared.");
  };
});
</script>
{% endraw %}