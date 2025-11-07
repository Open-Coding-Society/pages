---
layout: post
show_reading_time: false
title: Code Runner
description: Write, test, and run code in Python, Java, and JavaScript.
permalink: /code
---

<!-- CodeMirror CSS -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/theme/darcula.min.css">

<!-- CodeMirror JS -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/python/python.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/clike/clike.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/javascript/javascript.min.js"></script>

<style>

  .CodeMirror {
    height: 400px;
    font-size: 14px;
  }

  .control-group label {
    color: white;
    font-weight: 600;
  }

  /* Control bar styles */
  .control-bar {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: #222;
    padding: 0.75rem 1rem;
    border-radius: 10px 10px 0 0;
  }

  .control-bar select {
    color: #cbc4c4ff;
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
  }

  select {
    min-width: 150px;
    background: none
  }

  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }

  .editor-container {
    border: 1px solid rgba(128, 128, 128, 0.3);
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }

  .output-section {
    border: 1px solid rgba(128, 128, 128, 0.3);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }

  .output-content {
    padding: 16px;
    white-space: pre-wrap;
    min-height: 100px;
    max-height: 300px;
    overflow-y: auto;
  }

  .examples-section {
    padding: 20px;
    border-radius: 8px;
    border: 1px solid rgba(128, 128, 128, 0.3);
  }

  /* Dark theme overrides */
  .output-section {
    background-color: #2e2e2e;
    border: 1px solid #444;
  }

  .output-content {
    background-color: #1e1e1e;
  }

  .examples-section {
    background-color: #2e2e2e;
    border: 1px solid #444;
  }

  /* Help panel styles */
  .help-panel {
    background: #222;
    padding: 1rem;
    border-radius: 0 0 10px 10px;
    display: none;
  }

  .help-panel strong {
    display: block;
    margin-bottom: 0.5rem;
  }

  .help-panel ul {
    margin-top: 0.5rem;
    margin-left: 1.2rem;
  }

  @media (max-width: 768px) {
    .controls-section {
      flex-direction: column;
      align-items: stretch;
    }

    .example-buttons {
      flex-direction: column;
    }
  }
</style>

<div class="code-runner-container">
  <div class="editor-container">
    <div class="control-bar">
      <button id="runBtn" title="Run">▶</button>
      <select id="language">
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="javascript">JavaScript</option>
      </select>
      <select id="fontSize">
        <option value="14">14px</option>
        <option value="16">16px</option>
        <option value="18">18px</option>
        <option value="20">20px</option>
      </select>
      <button id="copyBtn" title="Copy Code">⎘</button>
      <button id="clearBtn" title="Clear Code">⎚</button>
      <button id="helpBtn" title="Help">?</button>
    </div>
    <div id="help-panel" class="help-panel">
      <strong>Tips & Shortcuts:</strong>
      <ul>
        <li>Use dropdowns to change language and text size</li>
        <li>Click buttons to fill editor with a code sample</li>
      </ul>
      <div class="examples-section">
        <div id="exampleButtons" class="example-buttons"></div>
      </div>
    </div>
    <textarea id="editor"></textarea>
    <div class="control-bar">
      <span id="lineCount">Lines: 1</span>
      <span id="charCount">Characters: 22</span>
    </div>
    <div class="output-section">
      <div class="control-bar">
        <span>Output</span>
        <button id="copyOutputIcon" title="Copy Output">⎘</button>
      </div>
      <div class="output-content" id="output">Click "Run Code" to see output here...</div>
    </div>
    <div class="control-bar">
      <span id="execTime"></span>
    </div>
  </div>
</div>

<script type="module">
import { pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

// Example code snippets
const examples = {
  python: [
    {
      name: "Hello World",
      code: "print('Hello, world!')"
    },
    {
      name: "Variables & Math",
      code: "x = 10\ny = 20\nsum = x + y\nprint(f'Sum: {sum}')\nprint(f'Product: {x * y}')"
    },
    {
      name: "For Loop",
      code: "for i in range(5):\n    print(f'Count: {i}')"
    },
    {
      name: "List Operations",
      code: "numbers = [1, 2, 3, 4, 5]\nsquares = [x**2 for x in numbers]\nprint('Numbers:', numbers)\nprint('Squares:', squares)\nprint('Sum:', sum(numbers))"
    },
    {
      name: "Function",
      code: "def greet(name):\n    return f'Hello, {name}!'\n\nprint(greet('Alice'))\nprint(greet('Bob'))"
    },
    {
      name: "Conditionals",
      code: "age = 18\nif age >= 18:\n    print('Adult')\nelse:\n    print('Minor')\n\nfor i in range(3):\n    if i % 2 == 0:\n        print(f'{i} is even')\n    else:\n        print(f'{i} is odd')"
    }
  ],
  java: [
    {
      name: "Hello World",
      code: "public class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hello, world!\");\n  }\n}"
    },
    {
      name: "Variables & Math",
      code: "public class Main {\n  public static void main(String[] args) {\n    int x = 10;\n    int y = 20;\n    System.out.println(\"Sum: \" + (x + y));\n    System.out.println(\"Product: \" + (x * y));\n  }\n}"
    },
    {
      name: "For Loop",
      code: "public class Main {\n  public static void main(String[] args) {\n    for (int i = 0; i < 5; i++) {\n      System.out.println(\"Count: \" + i);\n    }\n  }\n}"
    },
    {
      name: "Array",
      code: "public class Main {\n  public static void main(String[] args) {\n    int[] numbers = {1, 2, 3, 4, 5};\n    int sum = 0;\n    for (int num : numbers) {\n      sum += num;\n    }\n    System.out.println(\"Sum: \" + sum);\n  }\n}"
    },
    {
      name: "Method",
      code: "public class Main {\n  public static String greet(String name) {\n    return \"Hello, \" + name + \"!\";\n  }\n  \n  public static void main(String[] args) {\n    System.out.println(greet(\"Alice\"));\n    System.out.println(greet(\"Bob\"));\n  }\n}"
    },
    {
      name: "Conditionals",
      code: "public class Main {\n  public static void main(String[] args) {\n    int age = 18;\n    if (age >= 18) {\n      System.out.println(\"Adult\");\n    } else {\n      System.out.println(\"Minor\");\n    }\n  }\n}"
    }
  ],
  javascript: [
    {
      name: "Hello World",
      code: "console.log('Hello, world!');"
    },
    {
      name: "Variables & Math",
      code: "const x = 10;\nconst y = 20;\nconsole.log(`Sum: ${x + y}`);\nconsole.log(`Product: ${x * y}`);"
    },
    {
      name: "For Loop",
      code: "for (let i = 0; i < 5; i++) {\n  console.log(`Count: ${i}`);\n}"
    },
    {
      name: "Array Operations",
      code: "const numbers = [1, 2, 3, 4, 5];\nconst squares = numbers.map(x => x ** 2);\nconsole.log('Numbers:', numbers);\nconsole.log('Squares:', squares);\nconsole.log('Sum:', numbers.reduce((a, b) => a + b, 0));"
    },
    {
      name: "Function",
      code: "function greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet('Alice'));\nconsole.log(greet('Bob'));"
    },
    {
      name: "Conditionals",
      code: "const age = 18;\nif (age >= 18) {\n  console.log('Adult');\n} else {\n  console.log('Minor');\n}\n\nfor (let i = 0; i < 3; i++) {\n  console.log(i % 2 === 0 ? `${i} is even` : `${i} is odd`);\n}"
    }
  ]
};

document.addEventListener("DOMContentLoaded", () => {
  const editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
    lineNumbers: true,
    mode: "python",
    theme: "darcula",
    indentUnit: 4,
    tabSize: 4
  });

  const langSelect = document.getElementById("language");
  const fontSizeSelect = document.getElementById("fontSize");
  const outputDiv = document.getElementById("output");
  const lineCountSpan = document.getElementById("lineCount");
  const charCountSpan = document.getElementById("charCount");
  const execTimeSpan = document.getElementById("execTime");
  const helpBtn = document.getElementById("helpBtn");
  const helpPanel = document.getElementById("help-panel");

  // Help button toggle
  // Ensure help panel is hidden initially
  helpPanel.style.display = "none";
  helpBtn.addEventListener("click", () => {
    if (helpPanel.style.display === "none" || !helpPanel.style.display) {
      helpPanel.style.display = "block";
    } else {
      helpPanel.style.display = "none";
    }
  });

  // Update stats
  function updateStats() {
    const code = editor.getValue();
    const lines = code.split('\n').length;
    const chars = code.length;
    lineCountSpan.textContent = `Lines: ${lines}`;
    charCountSpan.textContent = `Characters: ${chars}`;
  }
  editor.on('change', updateStats);

  // Font size changer
  fontSizeSelect.addEventListener("change", () => {
    const size = fontSizeSelect.value;
    const cm = document.querySelector('.CodeMirror');
    cm.style.fontSize = size + 'px';
    editor.refresh();
  });

  // Sample Selector logic (inside Help panel)
  function loadExamples(lang) {
    const exampleButtonsDiv = document.getElementById("exampleButtons");
    if (!exampleButtonsDiv) return;
    exampleButtonsDiv.innerHTML = '';
    if (examples[lang]) {
      examples[lang].forEach((example, index) => {
        const btn = document.createElement('button');
        btn.className= "small"
        btn.textContent = example.name;
        btn.onclick = () => {
          editor.setValue(example.code);
          updateStats();
        };
        exampleButtonsDiv.appendChild(btn);
      });
    }
  }

  // Language switcher
  langSelect.addEventListener("change", () => {
    const lang = langSelect.value;
    if (lang === "python") {
      editor.setOption("mode", "python");
      editor.setValue("print('Hello, world!')");
    } else if (lang === "java") {
      editor.setOption("mode", "text/x-java");
      editor.setValue("public class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hello, world!\");\n  }\n}");
    } else if (lang === "javascript") {
      editor.setOption("mode", "javascript");
      editor.setValue("console.log('Hello, world!');");
    }
    loadExamples(lang);
  });

  // Clear button
  document.getElementById("clearBtn").onclick = () => {
    editor.setValue("");
    outputDiv.textContent = 'Click "Run Code" to see output here...';
    execTimeSpan.textContent = '';
  };

  // Copy code button
  document.getElementById("copyBtn").onclick = () => {
    const code = editor.getValue();
    navigator.clipboard.writeText(code).then(() => {
      const btn = document.getElementById("copyBtn");
      const originalText = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 2000);
    });
  };

  // Copy output icon
  document.getElementById("copyOutputIcon").onclick = () => {
    const output = outputDiv.textContent;
    const icon = document.getElementById("copyOutputIcon");
    const original = icon.textContent;
    navigator.clipboard.writeText(output).then(() => {
      icon.textContent = '✔';
      setTimeout(() => {
        icon.textContent = original;
      }, 1200);
    });
  };

  // Run button logic
  function runCode() {
    const code = editor.getValue();
    const lang = langSelect.value;
    outputDiv.textContent = "⏳ Running...";
    execTimeSpan.textContent = '';

    const startTime = Date.now();

    let runURL;
    if (lang === "python") runURL = `${pythonURI}/run/python`;
    else if (lang === "java") runURL = `${javaURI}/run/java`;
    else if (lang === "javascript") runURL = `${pythonURI}/run/javascript`;

    const body = JSON.stringify({ code });
    const options = { ...fetchOptions, method: "POST", body };

    fetch(runURL, options)
      .then(res => res.json())
      .then(result => {
        const endTime = Date.now();
        const execTime = endTime - startTime;
        const output = result.output || "[no output]";
        outputDiv.textContent = output;
        execTimeSpan.textContent = `⏱Execution time: ${execTime}ms`;
      })
      .catch(err => {
        outputDiv.textContent = "Error: " + err.message;
        execTimeSpan.textContent = '';
      });
  }

  document.getElementById("runBtn").onclick = runCode;

  // Keyboard shortcut: Ctrl+Enter or Cmd+Enter to run
  editor.setOption("extraKeys", {
    "Ctrl-Enter": runCode,
    "Cmd-Enter": runCode
  });

  // Load initial examples
  loadExamples('python');
  updateStats();
});
</script>