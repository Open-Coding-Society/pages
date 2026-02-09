---
layout: post
title: Edtech Merge
author: Saanvi Dogra
permalink: /tools-help/merge
breadcrumb: True
---

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GitHub Merge Conflict Tutorial</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            background: #000;
            color: #e0e0e0;
            font-family: 'Courier New', monospace;
            padding: 20px;
            line-height: 1.6;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        h1 {
            color: #fff;
            margin-bottom: 30px;
            font-size: 2em;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }
        
        h2 {
            color: #fff;
            margin: 30px 0 15px 0;
            font-size: 1.5em;
        }
        
        h3 {
            color: #ccc;
            margin: 20px 0 10px 0;
        }
        
        .section {
            margin-bottom: 40px;
            padding: 20px;
            border: 1px solid #333;
        }
        
        .terminal {
            background: #0a0a0a;
            border: 1px solid #333;
            padding: 15px;
            margin: 15px 0;
            font-family: 'Courier New', monospace;
            overflow-x: auto;
        }
        
        .terminal-header {
            color: #888;
            margin-bottom: 10px;
            font-size: 0.9em;
        }
        
        .terminal input {
            background: transparent;
            border: none;
            color: #0f0;
            font-family: 'Courier New', monospace;
            width: 100%;
            outline: none;
        }
        
        .terminal-output {
            color: #0f0;
            white-space: pre-wrap;
            margin-top: 10px;
        }
        
        .prompt {
            color: #0af;
        }
        
        button {
            background: #222;
            color: #fff;
            border: 1px solid #444;
            padding: 10px 20px;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            margin: 5px;
        }
        
        button:hover {
            background: #333;
            border-color: #666;
        }
        
        .github-sim {
            border: 1px solid #333;
            padding: 20px;
            margin: 15px 0;
        }
        
        .file-tree {
            margin: 10px 0;
            padding: 10px;
            background: #0a0a0a;
            border: 1px solid #333;
        }
        
        .file-item {
            padding: 5px;
            cursor: pointer;
        }
        
        .file-item:hover {
            background: #1a1a1a;
        }
        
        ul {
            margin: 15px 0 15px 30px;
        }
        
        li {
            margin: 8px 0;
        }
        
        .slideshow {
            margin-top: 30px;
        }
        
        .slide {
            display: none;
            border: 1px solid #333;
            padding: 30px;
            margin: 20px 0;
        }
        
        .slide.active {
            display: block;
        }
        
        .conflict-editor {
            background: #0a0a0a;
            border: 1px solid #333;
            padding: 15px;
            margin: 15px 0;
            font-family: 'Courier New', monospace;
            min-height: 200px;
        }
        
        .conflict-editor textarea {
            width: 100%;
            min-height: 200px;
            background: transparent;
            border: none;
            color: #e0e0e0;
            font-family: 'Courier New', monospace;
            resize: vertical;
            outline: none;
        }
        
        .conflict-marker {
            color: #f00;
        }
        
        .nav-buttons {
            margin-top: 20px;
            text-align: center;
        }
        
        .slide-counter {
            text-align: center;
            margin: 10px 0;
            color: #888;
        }
        
        .success {
            color: #0f0;
            padding: 10px;
            margin: 10px 0;
            display: none;
        }
        
        .error {
            color: #f00;
            padding: 10px;
            margin: 10px 0;
            display: none;
        }
        
        .hint {
            background: #0a0a0a;
            border: 1px solid #444;
            padding: 15px;
            margin: 10px 0;
            display: none;
            color: #ff0;
        }
        
        code {
            background: #1a1a1a;
            padding: 2px 6px;
            border: 1px solid #333;
        }
        
        .instruction-box {
            background: #0a0a0a;
            border-left: 3px solid #444;
            padding: 15px;
            margin: 15px 0;
        }
        
        .github-interface {
            background: #0a0a0a;
            border: 1px solid #333;
            padding: 15px;
            margin: 15px 0;
        }
        
        .github-header {
            border-bottom: 1px solid #333;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        
        .branch-selector {
            background: #1a1a1a;
            border: 1px solid #444;
            padding: 8px 12px;
            display: inline-block;
            margin: 10px 0;
            cursor: pointer;
        }
        
        .branch-selector:hover {
            background: #222;
        }
        
        .branch-dropdown {
            background: #1a1a1a;
            border: 1px solid #444;
            padding: 10px;
            margin-top: 5px;
            display: none;
        }
        
        .branch-item {
            padding: 8px;
            cursor: pointer;
        }
        
        .branch-item:hover {
            background: #2a2a2a;
        }
        
        .create-branch-input {
            background: #0a0a0a;
            border: 1px solid #444;
            color: #fff;
            padding: 8px;
            width: 100%;
            font-family: 'Courier New', monospace;
            margin: 5px 0;
        }
        
        .fork-button {
            background: #1a1a1a;
            border: 1px solid #444;
            padding: 10px 20px;
            cursor: pointer;
            display: inline-block;
        }
        
        .fork-button:hover {
            background: #2a2a2a;
        }
        
        .repo-info {
            margin: 10px 0;
            padding: 10px;
            border-left: 3px solid #444;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>GitHub Merge Conflict Resolution Tutorial</h1>
        
        <!-- Section 1: Fork/Branch Instructions -->
        <div class="section">
            <h2>Step 1: Fork or Branch a Repository</h2>
            <div class="instruction-box">
                <h3>To Fork a Repository:</h3>
                <ol>
                    <li>Navigate to the repository on GitHub</li>
                    <li>Click the "Fork" button in the top-right corner</li>
                    <li>Select your account as the destination</li>
                    <li>Wait for the fork to complete</li>
                </ol>
                
                <h3 style="margin-top: 20px;">To Create a Branch:</h3>
                <ol>
                    <li>Navigate to your repository on GitHub</li>
                    <li>Click the branch dropdown (usually says "main")</li>
                    <li>Type a new branch name (e.g., "feature-branch")</li>
                    <li>Click "Create branch"</li>
                </ol>
            </div>
            
            <h3>Practice: GitHub Interface Simulator</h3>
            
            <!-- Fork Simulation -->
            <div class="github-interface">
                <div class="github-header">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="color: #888; font-size: 0.9em;">github.com</div>
                            <div style="margin-top: 5px;"><strong>upstream-user / learning-merge-conflicts</strong></div>
                        </div>
                        <div id="fork-button-container">
                            <div class="fork-button" onclick="forkRepo()">
                                <span style="margin-right: 5px;">⑂</span> Fork
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="repo-info">
                    <div>📄 Public repository</div>
                    <div style="margin-top: 5px; color: #888;">A sample repository for learning merge conflicts</div>
                </div>
                
                <div id="fork-status"></div>
            </div>
            
            <!-- Branch Simulation -->
            <div class="github-interface" style="margin-top: 30px;">
                <div class="github-header">
                    <div style="color: #888; font-size: 0.9em;">github.com</div>
                    <div style="margin-top: 5px;"><strong><span id="repo-owner">your-username</span> / learning-merge-conflicts</strong></div>
                </div>
                
                <div style="margin: 15px 0;">
                    <div class="branch-selector" onclick="toggleBranchDropdown()">
                        <span style="margin-right: 10px;">⎇</span>
                        <span id="current-branch">main</span>
                        <span style="margin-left: 10px;">▼</span>
                    </div>
                    
                    <div class="branch-dropdown" id="branch-dropdown">
                        <div style="padding: 10px; border-bottom: 1px solid #333;">
                            <strong>Switch branches/tags</strong>
                        </div>
                        <div style="padding: 10px;">
                            <input type="text" id="branch-input" class="create-branch-input" placeholder="Find or create a branch..." onkeyup="handleBranchInput(event)">
                        </div>
                        <div id="branch-list" style="max-height: 200px; overflow-y: auto;">
                            <div class="branch-item" onclick="switchBranch('main')">
                                <span style="margin-right: 10px;">✓</span> main
                            </div>
                        </div>
                        <div id="create-branch-option" style="display: none; padding: 10px; border-top: 1px solid #333;">
                            <div style="color: #888; margin-bottom: 5px;">Create branch:</div>
                            <button onclick="createBranch()" style="width: 100%;">Create branch: <span id="new-branch-name"></span></button>
                        </div>
                    </div>
                </div>
                
                <div id="branch-status"></div>
                
                <div class="file-tree" style="margin-top: 15px;">
                    <div style="padding: 10px; border-bottom: 1px solid #333; color: #888;">
                        <span id="branch-file-count">3 files</span>
                    </div>
                    <div class="file-item">📄 README.md</div>
                    <div class="file-item">📄 app.js</div>
                    <div class="file-item">📄 styles.css</div>
                </div>
            </div>
        </div>
        
        <!-- Section 2: Clone and Open in WSL -->
        <div class="section">
            <h2>Step 2: Clone Repository and Open in WSL</h2>
            <div class="instruction-box">
                <h3>Instructions:</h3>
                <ol>
                    <li>Copy your repository URL from GitHub</li>
                    <li>Open WSL terminal</li>
                    <li>Navigate to your desired directory</li>
                    <li>Run: <code>git clone &lt;repository-url&gt;</code></li>
                    <li>Navigate into the cloned directory</li>
                    <li>Open in VS Code: <code>code .</code></li>
                </ol>
            </div>
            
            <h3>Practice Terminal:</h3>
            <div class="terminal">
                <div class="terminal-header">WSL Terminal Simulator</div>
                <div id="terminal-output"></div>
                <div>
                    <span class="prompt">user@wsl:~$</span> 
                    <input type="text" id="terminal-input" onkeypress="handleCommand(event)" placeholder="Type your command here...">
                </div>
            </div>
            <div style="margin-top: 10px; padding: 15px; background: #0a0a0a; border: 1px solid #333;">
                <strong>Try cloning this repository:</strong><br>
                <code style="display: block; margin: 10px 0; padding: 10px; background: #000;">git clone https://github.com/your-username/learning-merge-conflicts.git</code>
                <div style="color: #888; margin-top: 10px;">
                    Then try: <code>cd learning-merge-conflicts</code>, <code>ls</code>, <code>code .</code>
                </div>
            </div>
        </div>
        
        <!-- Section 3: Why Merge Conflicts Matter -->
        <div class="section">
            <h2>Step 3: Why Resolving Merge Conflicts is Important</h2>
            <ul>
                <li><strong>Team Collaboration:</strong> Multiple developers often work on the same files simultaneously, leading to conflicting changes that must be reconciled</li>
                <li><strong>Code Integrity:</strong> Improper conflict resolution can introduce bugs, break functionality, or lose important changes</li>
                <li><strong>Version Control:</strong> Understanding conflicts helps you better understand how Git tracks and merges changes across branches</li>
                <li><strong>Professional Development:</strong> Merge conflict resolution is a fundamental skill for any developer working in collaborative environments</li>
                <li><strong>Workflow Efficiency:</strong> Quick and accurate conflict resolution keeps the development process moving smoothly without blocking team progress</li>
            </ul>
        </div>
        
        <!-- Section 4: Merge Conflict Slideshow -->
        <div class="section slideshow">
            <h2>Step 4: Practice Resolving Merge Conflicts</h2>
            <div class="slide-counter" id="slide-counter">Scenario 1 of 5</div>
            
            <!-- Slide 1: Simple Text Conflict -->
            <div class="slide active" id="slide-1">
                <h3>Scenario 1: Simple Text Conflict in README.md</h3>
                <p style="margin: 15px 0;">Two developers changed the project description simultaneously.</p>
                
                <div class="conflict-editor">
                    <textarea id="editor-1" spellcheck="false"># Project Title

<<<<<<< HEAD
This project is a web application for managing tasks and todos.
=======
This project is a task management system with collaboration features.
>>>>>>> feature-branch

## Features
- Task creation
- User management</textarea>
                </div>
                
                <div class="instruction-box">
                    <strong>Instructions:</strong> Remove the conflict markers (<code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, <code>=======</code>, <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>) and keep the better description or combine both.
                </div>
                
                <button onclick="checkConflict(1)">Check Resolution</button>
                <button onclick="resetConflict(1)">Reset</button>
                <button onclick="toggleHint(1)"> Hint</button>
                <div class="hint" id="hint-1">
                    <strong>Hint:</strong> Both descriptions have useful information. Consider combining them:<br>
                    "This project is a web application for managing tasks and todos with collaboration features."<br><br>
                    Make sure to delete all three conflict markers: <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</code>, <code>=======</code>, and <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature-branch</code>
                </div>
                <div class="success" id="success-1">✓ Conflict resolved correctly!</div>
                <div class="error" id="error-1">✗ Conflict markers still present. Remove all &lt;&lt;&lt;, ===, and &gt;&gt;&gt; markers.</div>
            </div>
            
            <!-- Slide 2: Code Conflict with Different Logic -->
            <div class="slide" id="slide-2">
                <h3>Scenario 2: Function Logic Conflict in app.js</h3>
                <p style="margin: 15px 0;">Two developers implemented the same function differently.</p>
                
                <div class="conflict-editor">
                    <textarea id="editor-2" spellcheck="false">function calculateTotal(items) {
<<<<<<< HEAD
    let total = 0;
    for (let i = 0; i < items.length; i++) {
        total += items[i].price;
    }
    return total;
=======
    return items.reduce((sum, item) => sum + item.price, 0);
>>>>>>> feature-branch
}</textarea>
                </div>
                
                <div class="instruction-box">
                    <strong>Instructions:</strong> Choose the better implementation or combine them. The reduce method is more modern and concise.
                </div>
                
                <button onclick="checkConflict(2)">Check Resolution</button>
                <button onclick="resetConflict(2)">Reset</button>
                <button onclick="toggleHint(2)"> Hint</button>
                <div class="hint" id="hint-2">
                    <strong>Hint:</strong> The version from <code>feature-branch</code> (the reduce method) is more concise and modern JavaScript.<br>
                    Keep this version:<br>
                    <code>return items.reduce((sum, item) => sum + item.price, 0);</code><br><br>
                    Delete the for loop version and all conflict markers.
                </div>
                <div class="success" id="success-2">✓ Conflict resolved correctly!</div>
                <div class="error" id="error-2">✗ Conflict markers still present. Remove all &lt;&lt;&lt;, ===, and &gt;&gt;&gt; markers.</div>
            </div>
            
            <!-- Slide 3: CSS Styling Conflict -->
            <div class="slide" id="slide-3">
                <h3>Scenario 3: CSS Styling Conflict in styles.css</h3>
                <p style="margin: 15px 0;">Different styling approaches for the same element.</p>
                
                <div class="conflict-editor">
                    <textarea id="editor-3" spellcheck="false">.button {
<<<<<<< HEAD
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
=======
    background: linear-gradient(to right, #0066cc, #0099ff);
    color: #ffffff;
    padding: 12px 24px;
    border: 1px solid #0066cc;
    border-radius: 4px;
>>>>>>> feature-branch
    cursor: pointer;
}</textarea>
                </div>
                
                <div class="instruction-box">
                    <strong>Instructions:</strong> Decide which styling is appropriate or merge the best properties from both versions.
                </div>
                
                <button onclick="checkConflict(3)">Check Resolution</button>
                <button onclick="resetConflict(3)">Reset</button>
                <button onclick="toggleHint(3)"> Hint</button>
                <div class="hint" id="hint-3">
                    <strong>Hint:</strong> The <code>feature-branch</code> version has more modern styling with gradient and border-radius.<br>
                    However, you could also combine the best of both:<br>
                    - Use the gradient background from feature-branch<br>
                    - Keep the padding, border, border-radius, and cursor properties<br><br>
                    Don't forget to remove all conflict markers!
                </div>
                <div class="success" id="success-3">✓ Conflict resolved correctly!</div>
                <div class="error" id="error-3">✗ Conflict markers still present. Remove all &lt;&lt;&lt;, ===, and &gt;&gt;&gt; markers.</div>
            </div>
            
            <!-- Slide 4: Multiple Conflicts in Same File -->
            <div class="slide" id="slide-4">
                <h3>Scenario 4: Multiple Conflicts in config.js</h3>
                <p style="margin: 15px 0;">Multiple sections of the same file have conflicts.</p>
                
                <div class="conflict-editor">
                    <textarea id="editor-4" spellcheck="false">const config = {
<<<<<<< HEAD
    apiUrl: 'http://localhost:3000/api',
=======
    apiUrl: 'https://api.example.com',
>>>>>>> feature-branch
    timeout: 5000,
<<<<<<< HEAD
    retries: 3,
    logLevel: 'debug'
=======
    retries: 5,
    logLevel: 'info',
    cacheEnabled: true
>>>>>>> feature-branch
};

export default config;</textarea>
                </div>
                
                <div class="instruction-box">
                    <strong>Instructions:</strong> Resolve BOTH conflicts. Consider which environment (local vs production) and which settings make sense together.
                </div>
                
                <button onclick="checkConflict(4)">Check Resolution</button>
                <button onclick="resetConflict(4)">Reset</button>
                <button onclick="toggleHint(4)"> Hint</button>
                <div class="hint" id="hint-4">
                    <strong>Hint:</strong> This file has TWO separate conflicts to resolve!<br><br>
                    <strong>First conflict (apiUrl):</strong> Use localhost for development: <code>'http://localhost:3000/api'</code><br><br>
                    <strong>Second conflict (retries, logLevel, cacheEnabled):</strong><br>
                    - For development, use: <code>retries: 3</code>, <code>logLevel: 'debug'</code><br>
                    - But also keep the new feature: <code>cacheEnabled: true</code><br><br>
                    Remove all 4 conflict markers (2 sets of &lt;&lt;&lt;/===/&gt;&gt;&gt;)!
                </div>
                <div class="success" id="success-4">✓ All conflicts resolved correctly!</div>
                <div class="error" id="error-4">✗ Conflict markers still present. Make sure to resolve ALL conflicts in the file.</div>
            </div>
            
            <!-- Slide 5: Conflict with Added Lines -->
            <div class="slide" id="slide-5">
                <h3>Scenario 5: Conflict with New Features in package.json</h3>
                <p style="margin: 15px 0;">Both branches added different dependencies.</p>
                
                <div class="conflict-editor">
                    <textarea id="editor-5" spellcheck="false">{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.0",
<<<<<<< HEAD
    "mongoose": "^6.0.0",
    "dotenv": "^16.0.0"
=======
    "axios": "^1.0.0",
    "lodash": "^4.17.21"
>>>>>>> feature-branch
  }
}</textarea>
                </div>
                
                <div class="instruction-box">
                    <strong>Instructions:</strong> Both sets of dependencies might be needed! Merge them together alphabetically.
                </div>
                
                <button onclick="checkConflict(5)">Check Resolution</button>
                <button onclick="resetConflict(5)">Reset</button>
                <button onclick="toggleHint(5)"> Hint</button>
                <div class="hint" id="hint-5">
                    <strong>Hint:</strong> Both branches added useful dependencies! Keep all of them.<br><br>
                    Your dependencies should include ALL of these in alphabetical order:<br>
                    - axios<br>
                    - dotenv<br>
                    - express (already there)<br>
                    - lodash<br>
                    - mongoose<br><br>
                    Remember to keep proper JSON formatting with commas between items, and remove all conflict markers!
                </div>
                <div class="success" id="success-5">✓ Conflict resolved correctly!</div>
                <div class="error" id="error-5">✗ Conflict markers still present. Remove all &lt;&lt;&lt;, ===, and &gt;&gt;&gt; markers.</div>
            </div>
            
            <div class="nav-buttons">
                <button onclick="previousSlide()">← Previous</button>
                <button onclick="nextSlide()">Next →</button>
            </div>
        </div>
        
        <div class="section" style="text-align: center; margin-top: 40px;">
            <h2>🎉 Tutorial Complete!</h2>
            <p style="margin: 20px 0;">You've learned the basics of resolving merge conflicts in GitHub.</p>
            <p>Remember: Always test your code after resolving conflicts!</p>
        </div>
    </div>

    <script>
        // Terminal simulation
        let currentDir = '~';
        let cloned = false;
        
        const terminalCommands = {
            'git clone https://github.com/your-username/learning-merge-conflicts.git': () => {
                cloned = true;
                return 'Cloning into \'learning-merge-conflicts\'...\nremote: Enumerating objects: 15, done.\nremote: Counting objects: 100% (15/15), done.\nremote: Compressing objects: 100% (10/10), done.\nremote: Total 15 (delta 2), reused 15 (delta 2)\nUnpacking objects: 100% (15/15), done.';
            },
            'git clone': () => 'fatal: You must specify a repository to clone.\nusage: git clone <repository-url>',
            'cd learning-merge-conflicts': () => {
                if (cloned) {
                    currentDir = '~/learning-merge-conflicts';
                    return '';
                }
                return 'bash: cd: learning-merge-conflicts: No such file or directory';
            },
            'ls': () => {
                if (currentDir.includes('learning-merge-conflicts')) {
                    return 'README.md  app.js  styles.css  package.json';
                }
                return 'Documents  Downloads  learning-merge-conflicts';
            },
            'code .': () => {
                if (currentDir.includes('learning-merge-conflicts')) {
                    return 'Opening VS Code in current directory...';
                }
                return 'Please navigate to a directory first.';
            },
            'pwd': () => currentDir,
            'clear': () => 'CLEAR',
            'help': () => 'Available commands:\n  git clone <url> - Clone a repository\n  cd <dir>        - Change directory\n  ls              - List files\n  code .          - Open VS Code\n  pwd             - Print working directory\n  clear           - Clear terminal'
        };
        
        function handleCommand(event) {
            if (event.key === 'Enter') {
                const input = document.getElementById('terminal-input');
                const output = document.getElementById('terminal-output');
                const command = input.value.trim();
                
                let result = '';
                const matchedCommand = Object.keys(terminalCommands).find(cmd => 
                    command === cmd || command.startsWith(cmd + ' ')
                );
                
                if (matchedCommand) {
                    result = terminalCommands[matchedCommand]();
                } else if (command) {
                    result = `bash: ${command.split(' ')[0]}: command not found`;
                }
                
                if (result === 'CLEAR') {
                    output.innerHTML = '';
                } else {
                    output.innerHTML += `<span class="prompt">user@wsl:${currentDir}$</span> ${command}\n${result}\n\n`;
                }
                
                input.value = '';
                output.scrollTop = output.scrollHeight;
            }
        }
        
        // GitHub fork simulator
        let forked = false;
        
        function forkRepo() {
            if (forked) {
                alert('Repository already forked!');
                return;
            }
            
            const forkButtonContainer = document.getElementById('fork-button-container');
            forkButtonContainer.innerHTML = '<div style="color: #888;">⏳ Forking repository...</div>';
            
            setTimeout(() => {
                forked = true;
                document.getElementById('fork-status').innerHTML = `
                    <div style="margin-top: 20px; padding: 15px; background: #0a0a0a; border: 1px solid #444;">
                        <div style="color: #0f0; margin-bottom: 10px;">✓ Fork successful!</div>
                        <div>Repository forked to: <strong>your-username/learning-merge-conflicts</strong></div>
                        <div style="margin-top: 10px; color: #888;">You now have your own copy of this repository where you can make changes.</div>
                    </div>
                `;
                forkButtonContainer.innerHTML = '<div class="fork-button" style="opacity: 0.5; cursor: not-allowed;">⑂ Forked</div>';
                document.getElementById('repo-owner').textContent = 'your-username';
            }, 1500);
        }
        
        // GitHub branch simulator
        let branches = ['main'];
        let currentBranch = 'main';
        let dropdownOpen = false;
        
        function toggleBranchDropdown() {
            const dropdown = document.getElementById('branch-dropdown');
            dropdownOpen = !dropdownOpen;
            dropdown.style.display = dropdownOpen ? 'block' : 'none';
        }
        
        function handleBranchInput(event) {
            const input = document.getElementById('branch-input').value.trim();
            const createOption = document.getElementById('create-branch-option');
            const newBranchName = document.getElementById('new-branch-name');
            
            if (input && !branches.includes(input)) {
                createOption.style.display = 'block';
                newBranchName.textContent = input;
            } else {
                createOption.style.display = 'none';
            }
        }
        
        function createBranch() {
            const branchName = document.getElementById('branch-input').value.trim();
            
            if (!branchName) {
                alert('Please enter a branch name');
                return;
            }
            
            if (branches.includes(branchName)) {
                alert('Branch already exists!');
                return;
            }
            
            branches.push(branchName);
            currentBranch = branchName;
            
            // Update UI
            document.getElementById('current-branch').textContent = branchName;
            document.getElementById('branch-input').value = '';
            document.getElementById('create-branch-option').style.display = 'none';
            
            // Update branch list
            updateBranchList();
            
            // Show success message
            document.getElementById('branch-status').innerHTML = `
                <div style="margin-top: 15px; padding: 15px; background: #0a0a0a; border: 1px solid #444;">
                    <div style="color: #0f0; margin-bottom: 10px;">✓ Branch created!</div>
                    <div>Created and switched to branch: <strong>${branchName}</strong></div>
                    <div style="margin-top: 10px; color: #888;">You can now make changes on this branch without affecting the main branch.</div>
                </div>
            `;
            
            dropdownOpen = false;
            document.getElementById('branch-dropdown').style.display = 'none';
        }
        
        function switchBranch(branchName) {
            currentBranch = branchName;
            document.getElementById('current-branch').textContent = branchName;
            updateBranchList();
            
            document.getElementById('branch-status').innerHTML = `
                <div style="margin-top: 15px; padding: 10px; background: #0a0a0a; border: 1px solid #444;">
                    Switched to branch: <strong>${branchName}</strong>
                </div>
            `;
            
            dropdownOpen = false;
            document.getElementById('branch-dropdown').style.display = 'none';
        }
        
        function updateBranchList() {
            const branchList = document.getElementById('branch-list');
            branchList.innerHTML = branches.map(branch => `
                <div class="branch-item" onclick="switchBranch('${branch}')">
                    <span style="margin-right: 10px;">${branch === currentBranch ? '✓' : ' '}</span> ${branch}
                </div>
            `).join('');
        }
        
        // Slideshow navigation
        let currentSlide = 1;
        const totalSlides = 5;
        
        function showSlide(n) {
            const slides = document.querySelectorAll('.slide');
            slides.forEach(slide => slide.classList.remove('active'));
            
            if (n > totalSlides) currentSlide = totalSlides;
            if (n < 1) currentSlide = 1;
            
            document.getElementById(`slide-${currentSlide}`).classList.add('active');
            document.getElementById('slide-counter').textContent = `Scenario ${currentSlide} of ${totalSlides}`;
        }
        
        function nextSlide() {
            currentSlide++;
            if (currentSlide > totalSlides) currentSlide = totalSlides;
            showSlide(currentSlide);
        }
        
        function previousSlide() {
            currentSlide--;
            if (currentSlide < 1) currentSlide = 1;
            showSlide(currentSlide);
        }
        
        // Hint toggle
        function toggleHint(slideNum) {
            const hint = document.getElementById(`hint-${slideNum}`);
            hint.style.display = hint.style.display === 'none' || hint.style.display === '' ? 'block' : 'none';
        }
        
        // Original content for reset
        const originalContent = {
            1: `# Project Title

<<<<<<< HEAD
This project is a web application for managing tasks and todos.
=======
This project is a task management system with collaboration features.
>>>>>>> feature-branch

## Features
- Task creation
- User management`,
            2: `function calculateTotal(items) {
<<<<<<< HEAD
    let total = 0;
    for (let i = 0; i < items.length; i++) {
        total += items[i].price;
    }
    return total;
=======
    return items.reduce((sum, item) => sum + item.price, 0);
>>>>>>> feature-branch
}`,
            3: `.button {
<<<<<<< HEAD
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
=======
    background: linear-gradient(to right, #0066cc, #0099ff);
    color: #ffffff;
    padding: 12px 24px;
    border: 1px solid #0066cc;
    border-radius: 4px;
>>>>>>> feature-branch
    cursor: pointer;
}`,
            4: `const config = {
<<<<<<< HEAD
    apiUrl: 'http://localhost:3000/api',
=======
    apiUrl: 'https://api.example.com',
>>>>>>> feature-branch
    timeout: 5000,
<<<<<<< HEAD
    retries: 3,
    logLevel: 'debug'
=======
    retries: 5,
    logLevel: 'info',
    cacheEnabled: true
>>>>>>> feature-branch
};

export default config;`,
            5: `{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.0",
<<<<<<< HEAD
    "mongoose": "^6.0.0",
    "dotenv": "^16.0.0"
=======
    "axios": "^1.0.0",
    "lodash": "^4.17.21"
>>>>>>> feature-branch
  }
}`
        };
        
        function checkConflict(slideNum) {
            const editor = document.getElementById(`editor-${slideNum}`);
            const content = editor.value;
            const success = document.getElementById(`success-${slideNum}`);
            const error = document.getElementById(`error-${slideNum}`);
            
            // Check if conflict markers are still present
            const hasConflictMarkers = content.includes('<<<<<<<') || 
                                       content.includes('=======') || 
                                       content.includes('>>>>>>>');
            
            if (!hasConflictMarkers && content.trim().length > 0) {
                success.style.display = 'block';
                error.style.display = 'none';
                setTimeout(() => {
                    success.style.display = 'none';
                }, 3000);
            } else {
                success.style.display = 'none';
                error.style.display = 'block';
                setTimeout(() => {
                    error.style.display = 'none';
                }, 3000);
            }
        }
        
        function resetConflict(slideNum) {
            const editor = document.getElementById(`editor-${slideNum}`);
            editor.value = originalContent[slideNum];
            document.getElementById(`success-${slideNum}`).style.display = 'none';
            document.getElementById(`error-${slideNum}`).style.display = 'none';
            document.getElementById(`hint-${slideNum}`).style.display = 'none';
        }
    </script>
</body>
</html>