---
toc: True
layout: post
data: tools
title: VSCode Setup 
description: A key to learning in this class is understanding how to make a GitHub Pages project.  This guide will setup and run the project.  At the end, you will have a student Website that can be used for blogging classroom learnings and progress.
categories: ['DevOps']
author: Lily Wu
permalink: /tools/vscode
breadcrumb: /tools 
breadcrumbs: True 
---

## Starting a Project

The following commands are universal for all machine types, terminals, and projects. The previous installation steps ensured that all machine types have compatible tools. Follow these steps in order:

### Open a Linux-supported Terminal

You are using Ubuntu, Kali, MacOS in this step.

### Clone repository

Use same repo that you modified in vscode.dev.

Change the commands below to use your own organization name (**not** "opencs" of "jm1021").  This is your personal template repository (**not** "open-coding-society/student.git").

For example, if your GitHub organization is **jm1021** and your repo is ****student**, use:

   ```bash
   cd                # move to your home directory
   mkdir -p jm1021   # use your organization name here
   cd jm1021         # use your organization name here
   git clone https://github.com/jm1021/student.git   # use your organization/repo here
   ```

### Prepare project prior to opening VS Code

   ```bash
   cd student # Move to your personal project directory
   ./scripts/venv.sh # Activate the virtual environment (observe the prompt change)
   source venv/bin/activate # Prefix (venv) in path
   bundle install # Ensure Ruby gems for GitHub Pages is installed in (venv)
   code . # Open the project in VS Code
   ```

### Authenticate with GitHub

* At some point, you may be prompted to authenticate with GitHub. Follow the dialog and instructions.

### For WSL Users Only

* Ensure that VS Code is opened in WSL. Check the bottom-left corner of the VS Code window to confirm. This is critical for success!
   ![wsl]({{ site.baseurl }}/images/notebooks/foundation/wsl.jpg)

---

## Software Development Life Cycle (SDLC)

The development cycle involves iterative steps of running the server, making changes, testing, committing, and syncing changes to GitHub. This process ensures that your website is updated and functioning correctly both locally and on GitHub Pages.

### SDLC Workflow

```text
+-------------------+       +-------------------+       +-------------------+       +-------------------+       +-------------------+
|                   |       |                   |       |                   |       |                   |       |                   |
|   Make Server     | ----> |   Change Code     | ----> |     Commit        | ----> |      Test         | ----> |     Sync          |
|                   |       |                   |       |                   |       |                   |       |                   |
+-------------------+       +-------------------+       +-------------------+       +-------------------+       +-------------------+
        |                           |                           |                           |                           |
        v                           v                           v                           v                           v
 Start Local Server           Edit Code Files           Stage Changes Locally        Verify Local Changes        Push Changes to Cloud
```

### Open Project and Make

All students are building a GitHub Pages website.  These steps get your website running on your desktop (local or cloud).

#### What is `make`?

Think of `make` as a smart **task helper** for developers.

* It **automates commands** you would normally type one by one.
* It starts a **localhost server** on you machine, enabling Testing prior to Sync.
* It reads a special file called a **Makefile**, which lists tasks and how to run them.  

Simply run:

```bash
make
```

And it will do everything listed in the `Makefile`.

1. Open a terminal

2. Navigate to your project directory

3. Activate virtual environment (venv) `source venv/bin/activate`

4. Open VSCode `code .`

5. Open a VSCode Terminal

6. Type `make` This runs a build to a local server. Repeat this command as often as you make changes.

7. Hover then Cmd or Ctl Click on the localhost Server Address **<http://localhost:> ...** provided in the terminal output from the make command.

```bash
### Congratulations!!! An output similar to below means tool and equipment success ###
(venv) johnmortensen@Mac pages % make
Stopping server...
Stopping logging process...
Starting server with current config/Gemfile...
Server PID: 40638
appending output to nohup.out
Server started in 17 seconds
    Server address: http://localhost:4500/
Terminal logging starting, watching server for regeneration...
Server started in 0 seconds
Configuration file: /Users/johnmortensen/opencs/pages/_config.yml
            Source: /Users/johnmortensen/opencs/pages
       Destination: /Users/johnmortensen/opencs/pages/_site
 Incremental build: enabled
      Generating... 
      Remote Theme: Using theme jekyll/minima
                    done in 16.396 seconds.
 Auto-regeneration: enabled for '/Users/johnmortensen/opencs/pages'
    Server address: http://localhost:4500/
```

#### Make workflow (local build: make, make dev, make clean, make stop, make convert)

These commands are used to build and manage a localhost version of the website. The purpose of this is to verify and test code changes prior to pushing changes to GitHub Pages.

* `make`: Runs the full local server with all features and document overhead.

* `make dev`: Runs a **minimal, faster build** intended for developers actively coding. Skips heavy document processing so the server starts and regenerates quickly. Use this when you are iterating on game logic, layouts, or interactive features and want rapid feedback.

* `make clean`: Stops the local server and cleans the build files. Try this after rename as it could cause duplicates in build.

* `make stop`: Stops the local server. This means you will be unable to access your blog on <http://localhost> until you run `make` again.

* `make convert`: Converts Jupyter Notebook files. Run this if your `.ipynb` files are not updating on the server; it may assist in finding the error.

---

#### Make Debug Lab — Interactive Practice

Got errors? This interactive lab covers common `make` errors **and browser DevTools debugging** scenarios. Use the **Learn** tab for a quick reference, then test yourself in **Practice** by solving errors to reveal pixel art.

<details>
<summary><strong>Click to open the Make Debug Lab</strong></summary>

<div style="margin-top: 1rem;">

<style>
  .mdb * { margin: 0; padding: 0; box-sizing: border-box; }
  .mdb { background: #0a0e14; color: #e6e6e6; line-height: 1.6; padding: 1.5rem; border-radius: 8px; font-family: sans-serif; }
  .mdb h2 { font-size: 1.8rem; color: #00ff9f; margin-bottom: 0.25rem; }
  .mdb .subtitle { color: #8f93a2; margin-bottom: 1.5rem; }
  .mdb .os-selector { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; }
  .mdb .os-btn { background: #151921; border: 1px solid #2d3340; padding: 0.5rem 1.25rem; color: #8f93a2; cursor: pointer; font-size: 0.85rem; transition: all 0.3s; border-radius: 4px; }
  .mdb .os-btn.active { background: #1f2430; border-color: #00ff9f; color: #00ff9f; }
  .mdb .tabs { display: flex; gap: 1.5rem; border-bottom: 1px solid #2d3340; margin-bottom: 1.5rem; }
  .mdb .tab { background: none; border: none; padding: 0.75rem 0; color: #8f93a2; cursor: pointer; font-size: 0.95rem; border-bottom: 2px solid transparent; transition: all 0.3s; }
  .mdb .tab.active { color: #00ff9f; border-bottom-color: #00ff9f; }
  .mdb .tab-content { display: none; }
  .mdb .tab-content.active { display: block; }
  .mdb .error-grid { display: grid; gap: 1.25rem; }
  .mdb .error-card { background: #151921; border: 1px solid #2d3340; padding: 1.25rem; border-radius: 6px; transition: all 0.3s; }
  .mdb .error-card:hover { border-color: #00ff9f; }
  .mdb .error-title { font-size: 1rem; color: #00ccff; margin-bottom: 0.75rem; }
  .mdb .error-msg { background: #0a0e14; border-left: 3px solid #ff3366; padding: 0.6rem 0.75rem; margin: 0.75rem 0; color: #ff3366; font-size: 0.8rem; overflow-x: auto; font-family: monospace; border-radius: 2px; }
  .mdb .info-msg { background: #0a0e14; border-left: 3px solid #ffe66d; padding: 0.6rem 0.75rem; margin: 0.75rem 0; color: #ffe66d; font-size: 0.8rem; overflow-x: auto; font-family: monospace; border-radius: 2px; }
  .mdb .step { background: #1f2430; padding: 0.6rem 0.75rem; margin: 0.4rem 0; border-left: 2px solid #00ccff; font-size: 0.85rem; border-radius: 2px; }
  .mdb .cmd { background: #0a0e14; padding: 0.4rem 0.75rem; margin: 0.4rem 0; font-size: 0.8rem; color: #39ff14; font-family: monospace; border-radius: 2px; }
  .mdb .cmd::before { content: '$ '; color: #00ff9f; }
  .mdb .os-sp { display: none; }
  .mdb .os-sp.active { display: block; }
  .mdb .section-header { font-size: 1.1rem; color: #00ff9f; margin: 1.5rem 0 0.75rem 0; padding-bottom: 0.4rem; border-bottom: 1px solid #2d3340; }
  .mdb .badge { display: inline-block; font-size: 0.7rem; padding: 0.15rem 0.5rem; border-radius: 3px; margin-left: 0.5rem; vertical-align: middle; font-weight: bold; }
  .mdb .badge-make { background: #1f2430; color: #00ccff; border: 1px solid #00ccff; }
  .mdb .badge-devtools { background: #1f2430; color: #ffe66d; border: 1px solid #ffe66d; }
  .mdb .game-container { background: #0d1117; border: 2px solid #00ff9f; padding: 1.5rem; border-radius: 6px; }
  .mdb .game-title { font-size: 1.5rem; color: #00ff9f; text-align: center; margin-bottom: 0.25rem; }
  .mdb .game-subtitle { color: #8f93a2; font-size: 0.85rem; text-align: center; margin-bottom: 1.5rem; }
  .mdb .stats { display: flex; justify-content: space-around; padding: 0.75rem; background: rgba(0,255,159,0.05); border: 1px solid #2d3340; margin-bottom: 1.5rem; border-radius: 4px; }
  .mdb .stat-label { font-size: 0.75rem; color: #8f93a2; text-transform: uppercase; text-align: center; }
  .mdb .stat-value { font-size: 1.5rem; color: #00ff9f; font-weight: bold; text-align: center; }
  .mdb .canvas-area { background: #000; border: 2px solid #2d3340; padding: 1.25rem; border-radius: 8px; margin-bottom: 1.5rem; }
  .mdb .canvas-title { color: #00ccff; margin-bottom: 1rem; text-align: center; font-size: 1rem; }
  .mdb .pixel-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; max-width: 420px; margin: 0 auto; background: #1a1f2e; padding: 14px; border-radius: 8px; }
  .mdb .pixel { aspect-ratio: 1; background: #0a0e14; border: 2px solid #2d3340; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; color: #8f93a2; font-weight: bold; border-radius: 4px; }
  .mdb .pixel:hover { border-color: #00ff9f; transform: scale(1.08); }
  .mdb .pixel.filled { cursor: default; border-color: transparent; }
  .mdb .pixel.filled:hover { transform: scale(1); }
  .mdb .clue-section { background: #151921; border: 2px solid #2d3340; padding: 1.25rem; border-radius: 8px; }
  .mdb .clue-title { color: #00ccff; font-size: 1rem; margin-bottom: 0.75rem; }
  .mdb .color-legend { background: #1f2430; padding: 0.75rem 1rem; border-radius: 4px; display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1rem; }
  .mdb .legend-item { display: flex; align-items: center; gap: 0.4rem; font-size: 0.75rem; }
  .mdb .legend-color { width: 16px; height: 16px; border: 1px solid #2d3340; border-radius: 3px; flex-shrink: 0; }
  .mdb .current-clue { background: #1f2430; border: 2px solid #00ff9f; padding: 1.25rem; border-radius: 8px; }
  .mdb .clue-error { background: #0a0e14; border-left: 4px solid #ff3366; padding: 0.75rem; margin-bottom: 1rem; color: #ff3366; font-size: 0.85rem; font-family: monospace; border-radius: 2px; }
  .mdb .clue-devtools { background: #0a0e14; border-left: 4px solid #ffe66d; padding: 0.75rem; margin-bottom: 1rem; color: #ffe66d; font-size: 0.85rem; font-family: monospace; border-radius: 2px; }
  .mdb .clue-question { color: #e6e6e6; margin-bottom: 1rem; font-size: 0.95rem; }
  .mdb .answer-options { display: grid; gap: 0.75rem; }
  .mdb .answer-btn { background: #0a0e14; border: 2px solid #2d3340; padding: 1rem; color: #e6e6e6; cursor: pointer; text-align: left; transition: all 0.3s; font-size: 0.9rem; border-radius: 4px; width: 100%; }
  .mdb .answer-btn:hover { border-color: #00ff9f; background: #151921; transform: translateX(4px); }
  .mdb .answer-btn.correct { border-color: #00ff9f; background: rgba(0,255,159,0.1); }
  .mdb .answer-btn.incorrect { border-color: #ff3366; background: rgba(255,51,102,0.1); }
  .mdb .completion { text-align: center; padding: 2rem; background: linear-gradient(135deg, rgba(0,255,159,0.1), rgba(0,204,255,0.1)); border: 2px solid #00ff9f; display: none; border-radius: 8px; margin-top: 1rem; }
  .mdb .completion.show { display: block; }
  .mdb .completion-title { font-size: 2rem; color: #00ff9f; margin-bottom: 0.5rem; }
  .mdb .completion-message { color: #8f93a2; margin-bottom: 1.5rem; }
  .mdb .final-art { max-width: 420px; margin: 1rem auto; padding: 1.25rem; background: #000; border: 3px solid #00ff9f; border-radius: 8px; }
  .mdb .restart-btn { background: #151921; border: 2px solid #00ff9f; padding: 0.75rem 1.75rem; color: #00ff9f; cursor: pointer; font-size: 0.95rem; margin-top: 1rem; transition: all 0.3s; border-radius: 4px; }
  .mdb .restart-btn:hover { background: #1f2430; }
</style>

<div class="mdb">
  <h2>Make &amp; DevTools Debug Lab</h2>
  <p class="subtitle">Learn to resolve common make errors and use browser DevTools to debug game issues</p>

  <div class="os-selector">
    <button class="os-btn active" data-os="mac" onclick="mdbSwitchOS('mac')">macOS</button>
    <button class="os-btn" data-os="windows" onclick="mdbSwitchOS('windows')">Windows</button>
  </div>

  <div class="tabs">
    <button class="tab active" onclick="mdbSwitchTab('learn', event)">Learn</button>
    <button class="tab" onclick="mdbSwitchTab('practice', event)">Practice</button>
  </div>

  <div id="mdb-learn" class="tab-content active">
    <div class="error-grid">

      <h3 class="section-header">Make Errors <span class="badge badge-make">Terminal</span></h3>

      <div class="error-card">
        <h3 class="error-title">Make Not Found</h3>
        <div class="error-msg os-sp active" id="mdb-mac-err1">make: command not found</div>
        <div class="error-msg os-sp" id="mdb-win-err1">'make' is not recognized as an internal or external command</div>
        <p style="font-size:0.9rem; color:#8f93a2; margin: 0.5rem 0;">Your system does not have make installed.</p>
        <div class="os-sp active" id="mdb-mac-sol1">
          <div class="step">Install Xcode Command Line Tools</div>
          <div class="cmd">xcode-select --install</div>
          <div class="step">Verify installation</div>
          <div class="cmd">make --version</div>
        </div>
        <div class="os-sp" id="mdb-win-sol1">
          <div class="step">Install WSL</div>
          <div class="cmd">wsl --install</div>
          <div class="step">Install make in WSL</div>
          <div class="cmd">sudo apt update && sudo apt install make</div>
        </div>
      </div>

      <div class="error-card">
        <h3 class="error-title">No Makefile Found</h3>
        <div class="error-msg">make: *** No targets specified and no makefile found. Stop.</div>
        <p style="font-size:0.9rem; color:#8f93a2; margin: 0.5rem 0;">Make cannot find the Makefile. You are probably in the wrong directory.</p>
        <div class="step">Check current directory</div>
        <div class="cmd">pwd</div>
        <div class="step">List files to confirm Makefile exists</div>
        <div class="cmd os-sp active" id="mdb-mac-ls">ls -la</div>
        <div class="cmd os-sp" id="mdb-win-ls">dir</div>
        <div class="step">Navigate to project directory</div>
        <div class="cmd">cd /path/to/project</div>
      </div>

      <div class="error-card">
        <h3 class="error-title">No Rule to Make Target</h3>
        <div class="error-msg">make: *** No rule to make target 'sever'. Stop.</div>
        <p style="font-size:0.9rem; color:#8f93a2; margin: 0.5rem 0;">The target you specified does not exist. Check for typos.</p>
        <div class="step">List available targets</div>
        <div class="cmd os-sp active" id="mdb-mac-grep">grep "^[a-zA-Z]" Makefile</div>
        <div class="cmd os-sp" id="mdb-win-grep">findstr /B /R "^[a-zA-Z]" Makefile</div>
        <div class="step">Fix the typo in your command — or use make dev for a faster build</div>
        <div class="cmd">make server</div>
        <div class="cmd">make dev</div>
      </div>

      <div class="error-card">
        <h3 class="error-title">Missing Separator</h3>
        <div class="error-msg">Makefile:5: *** missing separator. Stop.</div>
        <p style="font-size:0.9rem; color:#8f93a2; margin: 0.5rem 0;">Commands in Makefiles must be indented with TAB characters, not spaces.</p>
        <div class="step">Open Makefile and go to the indicated line</div>
        <div class="step">Delete any spaces at the beginning of command lines</div>
        <div class="step">Press TAB key once before each command</div>
      </div>

      <div class="error-card">
        <h3 class="error-title">Permission Denied</h3>
        <div class="error-msg">make: ./script.sh: Permission denied</div>
        <p style="font-size:0.9rem; color:#8f93a2; margin: 0.5rem 0;">The script does not have execute permissions.</p>
        <div class="step">Add execute permission</div>
        <div class="cmd">chmod +x script.sh</div>
        <div class="step">Run make again</div>
      </div>

      <div class="error-card">
        <h3 class="error-title">Command Not Found in Makefile</h3>
        <div class="error-msg">make: *** [server] Error 127<br>/bin/sh: python3: command not found</div>
        <p style="font-size:0.9rem; color:#8f93a2; margin: 0.5rem 0;">The Makefile is trying to run a command that is not installed.</p>
        <div class="step">Check if command exists</div>
        <div class="cmd os-sp active" id="mdb-mac-which">which python3</div>
        <div class="cmd os-sp" id="mdb-win-which">where python3</div>
        <div class="step">Install the missing tool</div>
        <div class="cmd os-sp active" id="mdb-mac-install">brew install python3</div>
        <div class="cmd os-sp" id="mdb-win-install">winget install Python.Python.3</div>
      </div>

      <h3 class="section-header">Game / Browser DevTools Errors <span class="badge badge-devtools">DevTools</span></h3>
      <p style="font-size:0.875rem; color:#8f93a2; margin-bottom:1rem;">When building or debugging a game in your GitHub Pages project, use browser DevTools (F12 or Cmd+Option+I) to diagnose these common issues. Run <code style="color:#39ff14;font-size:0.8rem;">make dev</code> for a fast local server while iterating on game code.</p>

      <div class="error-card">
        <h3 class="error-title">Collision Bug — Elements View</h3>
        <div class="info-msg">Player passes through wall / hitbox looks wrong in the game</div>
        <p style="font-size:0.9rem; color:#8f93a2; margin: 0.5rem 0;">The collision box does not match the visible sprite. Inspect the element to see its real size and position.</p>
        <div class="step">Open DevTools → Elements tab (Cmd+Option+I → Elements)</div>
        <div class="step">Hover over the player or wall element in the DOM — the browser highlights its bounding box on screen</div>
        <div class="step">Check that width, height, and position CSS match your expected hitbox dimensions</div>
        <div class="step">Fix the discrepancy in your CSS or JavaScript collision logic</div>
        <div class="cmd">// Example: log element bounds in console
const box = player.getBoundingClientRect();
console.log(box.width, box.height, box.x, box.y);</div>
      </div>

      <div class="error-card">
        <h3 class="error-title">Style Bug — CSS View</h3>
        <div class="info-msg">Sprite is invisible, wrong color, or in the wrong position</div>
        <p style="font-size:0.9rem; color:#8f93a2; margin: 0.5rem 0;">A style rule is overriding your intended CSS. Use the Styles panel to find the conflict.</p>
        <div class="step">Open DevTools → Elements → Styles panel</div>
        <div class="step">Select the game element — look for strikethrough rules, which means a rule is being overridden</div>
        <div class="step">Identify the conflicting selector with higher specificity and either increase your specificity or remove the conflict</div>
        <div class="step">Toggle rules on/off live in the Styles panel to test fixes before changing code</div>
        <div class="cmd">/* Example: use a more specific selector to override */
#game-canvas .player-sprite { display: block; visibility: visible; }</div>
      </div>

      <div class="error-card">
        <h3 class="error-title">CORS Error — Network View</h3>
        <div class="error-msg">Access to fetch at 'https://api.example.com/npc-data' from origin 'http://localhost:4500' has been blocked by CORS policy</div>
        <p style="font-size:0.9rem; color:#8f93a2; margin: 0.5rem 0;">Your game is fetching data (NPC configs, maps, scores) from a server that has not allowed your origin. Check the Network tab to diagnose.</p>
        <div class="step">Open DevTools → Network tab, then reload or trigger the fetch</div>
        <div class="step">Find the failing request (shown in red) and click it to see Response Headers</div>
        <div class="step">Look for <code>Access-Control-Allow-Origin</code> — if missing or wrong, the server must add it</div>
        <div class="step">As a local workaround during <code>make dev</code>, proxy the request through your Jekyll server or use a CORS-friendly test API</div>
        <div class="cmd">// Example: catch CORS errors explicitly
fetch('https://api.example.com/npc-data')
  .catch(err => console.error('CORS or network error:', err));</div>
      </div>

      <div class="error-card">
        <h3 class="error-title">Logic Bug — Player / NPC Interaction</h3>
        <div class="info-msg">NPC does not react to player / interaction triggers at wrong time</div>
        <p style="font-size:0.9rem; color:#8f93a2; margin: 0.5rem 0;">The interaction condition in your game logic has a bug. Use the Console and Sources tabs to step through the code.</p>
        <div class="step">Open DevTools → Console — look for errors or add <code>console.log</code> calls inside your interaction handler</div>
        <div class="step">Open DevTools → Sources → find your game JS file and set a breakpoint on the interaction function</div>
        <div class="step">Trigger the interaction in the game — execution pauses at the breakpoint so you can inspect variable values</div>
        <div class="step">Check distance/overlap calculations, event listener binding, and state flags (e.g., <code>isNearNPC</code>)</div>
        <div class="cmd">// Example: debug interaction check
function checkInteraction(player, npc) {
  const dist = Math.hypot(player.x - npc.x, player.y - npc.y);
  console.log('distance to NPC:', dist, '| threshold:', npc.triggerRadius);
  if (dist < npc.triggerRadius) npc.interact();
}</div>
      </div>

    </div>
  </div>

  <div id="mdb-practice" class="tab-content">
    <div class="game-container">
      <h2 class="game-title">Debug Art Challenge</h2>
      <p class="game-subtitle">Answer error clues correctly to reveal the hidden pixel art — now with DevTools challenges!</p>
      <div class="stats">
        <div class="stat"><div class="stat-label">Progress</div><div class="stat-value" id="mdb-progress">0/21</div></div>
        <div class="stat"><div class="stat-label">Correct</div><div class="stat-value" id="mdb-correct">0</div></div>
        <div class="stat"><div class="stat-label">Errors</div><div class="stat-value" id="mdb-errors">0</div></div>
      </div>
      <div class="canvas-area">
        <h3 class="canvas-title">Click a number to solve its error</h3>
        <div class="pixel-grid" id="mdb-pixelGrid"></div>
      </div>
      <div class="clue-section">
        <h3 class="clue-title">Current Clue</h3>
        <div class="color-legend">
          <div class="legend-item"><div class="legend-color" style="background:#ff6b6b;"></div><span>1 - Not Found</span></div>
          <div class="legend-item"><div class="legend-color" style="background:#4ecdc4;"></div><span>2 - No File</span></div>
          <div class="legend-item"><div class="legend-color" style="background:#ffe66d;"></div><span>3 - Typo</span></div>
          <div class="legend-item"><div class="legend-color" style="background:#a8e6cf;"></div><span>4 - Tab</span></div>
          <div class="legend-item"><div class="legend-color" style="background:#ff8b94;"></div><span>5 - Permission</span></div>
          <div class="legend-item"><div class="legend-color" style="background:#c7ceea;"></div><span>6 - Tool</span></div>
          <div class="legend-item"><div class="legend-color" style="background:#f7b731;"></div><span>7 - Collision</span></div>
          <div class="legend-item"><div class="legend-color" style="background:#a29bfe;"></div><span>8 - Style</span></div>
          <div class="legend-item"><div class="legend-color" style="background:#fd79a8;"></div><span>9 - CORS</span></div>
          <div class="legend-item"><div class="legend-color" style="background:#55efc4;"></div><span>10 - Logic</span></div>
        </div>
        <div class="current-clue">
          <div class="clue-error" id="mdb-clueError">Click a numbered pixel above to start!</div>
          <div class="clue-question" id="mdb-clueQuestion">Select any pixel with a number to see its error.</div>
          <div class="answer-options" id="mdb-answerOptions"></div>
        </div>
      </div>
      <div class="completion" id="mdb-completion">
        <div class="completion-title">Build Successful!</div>
        <p class="completion-message">You have mastered make and DevTools debugging</p>
        <div class="final-art"><div class="pixel-grid" id="mdb-finalImage" style="max-width:100%;"></div></div>
        <div class="stats">
          <div class="stat"><div class="stat-label">Accuracy</div><div class="stat-value" id="mdb-accuracy">0%</div></div>
        </div>
        <button class="restart-btn" onclick="mdbRestart()">Build Again</button>
      </div>
    </div>
  </div>
</div>

<script>

// =============================================================================
// MDB_DATA — stores all static game data (clues, colors, pixel pattern)
// Only change this when clue text, colors, or the grid pattern needs updating
// =============================================================================
const MDB_DATA = {
  colors: {
    1: '#ff6b6b', 2: '#4ecdc4', 3: '#ffe66d', 4: '#a8e6cf',
    5: '#ff8b94', 6: '#c7ceea', 7: '#f7b731', 8: '#a29bfe',
    9: '#fd79a8', 10: '#55efc4'
  },
  pattern: [
    [1, 1, 0,  7, 0,  9,  9],
    [2, 4, 4,  7, 8,  8,  3],
    [2, 5, 5, 10, 8,  3,  3],
    [0, 0, 6, 10, 0,  0,  0],
    [0, 6, 6,  0, 10, 0,  0]
  ],
  clues: [
    {
      type: 1,
      error: "make: command not found",
      question: "What is the solution?",
      answers: [
        { text: "Install make using xcode-select --install or package manager", correct: true },
        { text: "Delete the project", correct: false },
        { text: "Rename the Makefile", correct: false }
      ]
    },
    {
      type: 2,
      error: "make: *** No targets specified and no makefile found. Stop.",
      question: "What should you do?",
      answers: [
        { text: "Navigate to the correct directory with cd", correct: true },
        { text: "Reinstall make", correct: false },
        { text: "Run sudo make", correct: false }
      ]
    },
    {
      type: 3,
      error: "make: *** No rule to make target 'sever'. Stop.",
      question: "How do you fix this?",
      answers: [
        { text: "Fix the typo — use 'make server' or 'make dev' for a faster build", correct: true },
        { text: "Add a new sever target", correct: false },
        { text: "Delete the Makefile", correct: false }
      ]
    },
    {
      type: 4,
      error: "Makefile:5: *** missing separator. Stop.",
      question: "What is the problem?",
      answers: [
        { text: "Replace spaces with TAB character before commands", correct: true },
        { text: "Add more spaces", correct: false },
        { text: "Add semicolons", correct: false }
      ]
    },
    {
      type: 5,
      error: "make: ./script.sh: Permission denied",
      question: "How do you fix this?",
      answers: [
        { text: "Run chmod +x script.sh to add execute permission", correct: true },
        { text: "Delete and recreate the file", correct: false },
        { text: "Always use sudo", correct: false }
      ]
    },
    {
      type: 6,
      error: "make: *** [test] Error 127 - /bin/sh: python3: command not found",
      question: "What is the solution?",
      answers: [
        { text: "Install python3 using brew or apt", correct: true },
        { text: "Remove python from Makefile", correct: false },
        { text: "Create a symbolic link", correct: false }
      ]
    },
    {
      type: 7,
      error: "[Game] Player passes through walls — collision not working",
      question: "Which DevTools panel helps you debug a collision hitbox mismatch?",
      answers: [
        { text: "Elements tab — hover over the DOM element to see its real bounding box on screen", correct: true },
        { text: "Network tab — check if wall data loaded correctly", correct: false },
        { text: "Application tab — clear localStorage and retry", correct: false }
      ]
    },
    {
      type: 8,
      error: "[Game] Sprite is invisible on screen despite being in the DOM",
      question: "How do you find the CSS rule that is hiding the sprite?",
      answers: [
        { text: "Elements → Styles panel — look for strikethrough rules being overridden by a higher-specificity selector", correct: true },
        { text: "Network tab — the image must have failed to load", correct: false },
        { text: "Console — run location.reload()", correct: false }
      ]
    },
    {
      type: 9,
      error: "Access to fetch at 'https://api.example.com/npc-data' blocked by CORS policy",
      question: "Where in DevTools do you find the missing Access-Control-Allow-Origin header?",
      answers: [
        { text: "Network tab — click the failing request (red) and inspect Response Headers", correct: true },
        { text: "Console tab — the full header list is printed there automatically", correct: false },
        { text: "Elements tab — check the meta tags in head", correct: false }
      ]
    },
    {
      type: 10,
      error: "[Game] NPC does not react when player walks into trigger zone",
      question: "What is the best first step to debug the player/NPC interaction logic?",
      answers: [
        { text: "Sources tab — set a breakpoint in the interaction function and step through variable values when triggered", correct: true },
        { text: "Network tab — the NPC config file probably did not load", correct: false },
        { text: "Application tab — the interaction state is stored in a cookie", correct: false }
      ]
    }
  ]
};

// =============================================================================
// MDBState — tracks all runtime game state
// Only change this when the set of tracked values or reset logic changes
// =============================================================================
const MDBState = {
  os: 'mac',
  correct: 0,
  errors: 0,
  filled: 0,
  currentPixel: null,

  reset() {
    this.correct = 0;
    this.errors = 0;
    this.filled = 0;
    this.currentPixel = null;
  },

  getTotalPixels() {
    return MDB_DATA.pattern.flat().filter(p => p !== 0).length;
  },

  calculateAccuracy() {
    const total = this.correct + this.errors;
    return total === 0 ? 0 : Math.round((this.correct / total) * 100);
  }
};

// =============================================================================
// MDBOSToggle — handles OS button switching
// Only change this when the OS toggle UI or section IDs change
// =============================================================================
const MDBOSToggle = {
  switch(os) {
    MDBState.os = os;
    this.renderButtons(os);
    this.renderSections(os);
  },

  renderButtons(os) {
    document.querySelectorAll('.mdb .os-btn')
      .forEach(b => b.classList.remove('active'));
    document.querySelector(`.mdb [data-os="${os}"]`)
      .classList.add('active');
  },

  renderSections(os) {
    document.querySelectorAll('.mdb .os-sp')
      .forEach(el => el.classList.remove('active'));
    const prefix = os === 'mac' ? 'mdb-mac-' : 'mdb-win-';
    document.querySelectorAll(`[id^="${prefix}"]`)
      .forEach(el => el.classList.add('active'));
  }
};

// =============================================================================
// MDBStatsTracker — updates the score display in the DOM
// Only change this when the stats UI elements or their formatting changes
// =============================================================================
const MDBStatsTracker = {
  update() {
    const total = MDBState.getTotalPixels();
    document.getElementById('mdb-progress').textContent = `${MDBState.filled}/${total}`;
    document.getElementById('mdb-correct').textContent = MDBState.correct;
    document.getElementById('mdb-errors').textContent = MDBState.errors;
  }
};

// =============================================================================
// MDBCompletionHandler — detects game over and renders the final screen
// Only change this when end-game detection or the completion screen changes
// =============================================================================
const MDBCompletionHandler = {
  check() {
    if (MDBState.filled >= MDBState.getTotalPixels()) {
      setTimeout(() => this.show(), 600);
    }
  },

  show() {
    document.getElementById('mdb-accuracy').textContent = `${MDBState.calculateAccuracy()}%`;
    this.renderFinalGrid();
    document.getElementById('mdb-completion').classList.add('show');
  },

  renderFinalGrid() {
    const fg = document.getElementById('mdb-finalImage');
    fg.innerHTML = '';
    MDB_DATA.pattern.forEach(row => {
      row.forEach(cell => {
        const p = document.createElement('div');
        p.className = 'pixel filled';
        p.style.background = cell !== 0 ? MDB_DATA.colors[cell] : '#000';
        fg.appendChild(p);
      });
    });
  }
};

// =============================================================================
// MDBAnswerChecker — validates answers and updates pixel/button feedback
// Only change this when answer validation or correct/incorrect feedback changes
// =============================================================================
const MDBAnswerChecker = {
  check(correct, colorType, e) {
    this.disableButtons(true);
    if (correct && MDBState.currentPixel) {
      this.handleCorrect(colorType, e);
    } else {
      this.handleIncorrect(e);
    }
    MDBStatsTracker.update();
  },

  handleCorrect(colorType, e) {
    MDBState.correct++;
    MDBState.filled++;

    const { row, col } = MDBState.currentPixel;
    const pixel = document.querySelector(`.mdb [data-row="${row}"][data-col="${col}"]`);
    pixel.style.background = MDB_DATA.colors[colorType];
    pixel.classList.add('filled');
    pixel.textContent = '';
    pixel.style.boxShadow = '';
    e.target.classList.add('correct');

    setTimeout(() => {
      MDBState.currentPixel = null;
      document.getElementById('mdb-clueError').textContent = 'Great! Click another number.';
      document.getElementById('mdb-clueQuestion').textContent = 'Keep going to reveal the image!';
      document.getElementById('mdb-answerOptions').innerHTML = '';
      MDBCompletionHandler.check();
    }, 1000);
  },

  handleIncorrect(e) {
    MDBState.errors++;
    e.target.classList.add('incorrect');
    setTimeout(() => {
      this.disableButtons(false);
      document.querySelectorAll('.mdb .answer-btn')
        .forEach(b => b.classList.remove('incorrect'));
    }, 600);
  },

  disableButtons(disabled) {
    document.querySelectorAll('.mdb .answer-btn')
      .forEach(b => b.disabled = disabled);
  }
};

// =============================================================================
// MDBClueManager — looks up clue data and renders it into the DOM
// Only change this when clue lookup logic or the clue display UI changes
// =============================================================================
const MDBClueManager = {
  getByType(type) {
    return MDB_DATA.clues.find(c => c.type === type);
  },

  render(clue, type) {
    const errorEl = document.getElementById('mdb-clueError');
    errorEl.textContent = clue.error;
    errorEl.className = type >= 7 ? 'clue-devtools' : 'clue-error';
    document.getElementById('mdb-clueQuestion').textContent = clue.question;

    const opts = document.getElementById('mdb-answerOptions');
    opts.innerHTML = '';
    clue.answers
      .slice()
      .sort(() => Math.random() - 0.5)
      .forEach(answer => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = answer.text;
        btn.onclick = (e) => MDBAnswerChecker.check(answer.correct, type, e);
        opts.appendChild(btn);
      });
  },

  load(type) {
    const clue = this.getByType(type);
    if (clue) this.render(clue, type);
  }
};

// =============================================================================
// MDBGridRenderer — builds the pixel grid DOM elements
// Only change this when the grid layout or individual pixel structure changes
// =============================================================================
const MDBGridRenderer = {
  render() {
    const grid = document.getElementById('mdb-pixelGrid');
    grid.innerHTML = '';
    MDB_DATA.pattern.forEach((row, r) => {
      row.forEach((cell, c) => {
        const p = document.createElement('div');
        p.className = 'pixel';
        p.dataset.row = r;
        p.dataset.col = c;
        p.dataset.color = cell;

        if (cell !== 0) {
          p.textContent = cell;
          p.onclick = () => MDBGame.selectPixel(r, c);
        } else {
          p.style.background = '#000';
          p.classList.add('filled');
        }
        grid.appendChild(p);
      });
    });
  }
};

// =============================================================================
// MDBGame — coordinates overall game flow (init, reset, pixel selection)
// Only change this when the sequence of game startup steps changes
// =============================================================================
const MDBGame = {
  init() {
    MDBState.reset();
    MDBGridRenderer.render();
    this.resetCluePanel();
    document.getElementById('mdb-completion').classList.remove('show');
    MDBStatsTracker.update();
  },

  resetCluePanel() {
    document.getElementById('mdb-clueError').textContent = 'Click a numbered pixel above to start!';
    document.getElementById('mdb-clueQuestion').textContent = 'Select any pixel with a number to see its error.';
    document.getElementById('mdb-answerOptions').innerHTML = '';
  },

  selectPixel(row, col) {
    const pixel = document.querySelector(`.mdb [data-row="${row}"][data-col="${col}"]`);
    if (pixel.classList.contains('filled')) return;

    MDBState.currentPixel = { row, col, color: MDB_DATA.pattern[row][col] };
    document.querySelectorAll('.mdb .pixel').forEach(p => p.style.boxShadow = '');
    pixel.style.boxShadow = '0 0 16px #00ff9f';
    MDBClueManager.load(MDB_DATA.pattern[row][col]);
  }
};

// =============================================================================
// Public API — wires module methods to HTML onclick attributes
// =============================================================================
window.mdbSwitchOS  = (os) => MDBOSToggle.switch(os);
window.mdbSwitchTab = (tab, e) => {
  document.querySelectorAll('.mdb .tab').forEach(t => t.classList.remove('active'));
  e.target.classList.add('active');
  document.querySelectorAll('.mdb .tab-content').forEach(c => c.classList.remove('active'));
  document.getElementById('mdb-' + tab).classList.add('active');
  if (tab === 'practice') MDBGame.init();
};
window.mdbRestart = () => {
  document.getElementById('mdb-completion').classList.remove('show');
  MDBGame.init();
};

MDBGame.init();

</script>

</div>
</details>

---


### VSCode Commit and Sync Workflow

All students will be writing and changing code.  These steps allow you to change the website, first locally and then on public location.

```text
+-------------------+       +-------------------+       +-------------------+       +-------------------+
|                   |       |                   |       |                   |       |                   |
|   VS Code Editor  | ----> |   Local Git Repo  | ----> |   Remote GitHub   | ----> |   GitHub Pages    |
|                   |       |                   |       |                   |       |                   |
+-------------------+       +-------------------+       +-------------------+       +-------------------+
        |                           |                           |                           |
        |                           |                           |                           |
        v                           v                           v                           v
    Save Files                Commit Changes               Sync Changes                Public Website
   Local Website
```

#### Detailed SDLC Steps

The SDLC adds the important steps of Make and Test to the workflow. This ensures that you **never** sync code that is broken locally. This helps the developer troubleshoot errors early and as you are working.

1. Save Files in VS Code:

   * Edit your files.
   * Save the changes (Cmd + S on Mac or Ctrl + S on Windows/Linux).
   * Verify changes on the local web server.

2. Commit Changes in VS Code:

   * Click on the "Source Control" icon in the left sidebar.
   * Stage your changes by clicking the plus sign next to the files.
   * Enter a commit message.
   * Click the "Commit" button.

3. Test Changes on Local Server:

   * Open Terminal.
   * Be sure the "(venv)" prefix is in the prompt.
   * Type `make` in the prompt (run `make`).
   * If you are actively developing a game or interactive feature, use `make dev` instead — it skips heavy document processing for a faster build cycle.
   * If successful, you will see log output in the prompt:

   ```text
       Server address: http://localhost:4500/
   ```

   * If delayed open 2nd terminal using + and execute command `cat \tmp\jekyl4500.log`.  This keeps ongoing history of logs if things are right a below, if things are wrong you will see errors.  

   ```text
   (venv) johnmortensen@Mac pages % cat /tmp/jekyll4500.log 
   Configuration file: /Users/johnmortensen/opencs/pages/_config.yml
               Source: /Users/johnmortensen/opencs/pages
         Destination: /Users/johnmortensen/opencs/pages/_site
   Incremental build: enabled
         Generating... 
         Remote Theme: Using theme jekyll/minima
                     done in 16.396 seconds.
   Auto-regeneration: enabled for '/Users/johnmortensen/opencs/pages'
      Server address: http://localhost:4500/
   Server running... press ctrl-c to stop.
         Regenerating: 1 file(s) changed at 2025-11-20 06:20:27
                     _posts/Foundation/B-tools_and_equipment/2025-04-15-tools_setup-vscode.md
         Remote Theme: Using theme jekyll/minima
                     ...done in 16.992685 seconds.
                     
         Regenerating: 1 file(s) changed at 2025-11-20 06:22:30
                     _posts/Foundation/B-tools_and_equipment/2025-04-15-tools_setup-vscode.md
         Remote Theme: Using theme jekyll/minima
                     ...done in 16.763741 seconds.
   ```

   * Open the localhost Server address in deskop or cloud computer browser `http://localhost:4500/`
   * Test your changes before you commit.

4. Errors in terminal
   * Most likely cause is `(venv)` in prompt `(venv) johnmortensen@Mac pages %`.  This will fail 100% of the time
   * If there are errors in coding the will show in terminal (with a delay/timeout) and be in log: `cat /tmp/jekyll4500.log`
   * Most likely error, is what you just changed!!!  Easiest fix is to undo, see if it fixes things.  Then try again.

5. Regeneration messages
   * Most changes will show regeneration message in terminal after you save file.
   * If you see a message in terminal like the one below, you can test your localhost change by refreshing page you are working on.

   ```text
   Regenerating: 1 file(s) changed at 2025-11-20 06:40:18
                     _posts/Foundation/B-tools_and_equipment/2025-04-15-tools_setup-vscode.md
         Remote Theme: Using theme jekyll/minima
                     ...done in 16.537365 seconds.
   ```

6. Sync Changes to GitHub:

   * Never sync changes before you test, as this activates Actions on GitHub.
   * Click the "Sync Changes" button in the Source Control view.
   * This pushes your local commits to the remote GitHub repository.

7. Update GitHub Pages:

   * GitHub Pages Action automatically rebuilds your site with the latest changes.
   * Visit your public website at https://<yourGitHubID>.github.io/student to see the updates.

```mermaid
flowchart TD
    A[Run Server] --> B[Make Changes]
    B --> C[Commit]
    C --> D[Test]
    D --> E{Tests Pass?}
    E -- Yes --> F[Sync]
    E -- No  --> B

   style E fill:#FF0000
```

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Rock Paper Scissors — Console Debugging Lesson</title>
<style>
  .rps-lesson { max-width: 780px; margin: 0 auto; padding: 2rem 1.25rem 4rem; }

  /* Game widget */
  .rps-game-box {
    border: 1px solid currentColor;
    border-radius: 10px;
    padding: 1.5rem;
    margin-bottom: 2.5rem;
    text-align: center;
    opacity: 0.95;
  }
  .rps-btns { display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem; }
  .rps-btn {
    background: none;
    border: 2px solid transparent;
    border-radius: 10px;
    padding: 4px;
    cursor: pointer;
    transition: border-color 0.15s, transform 0.15s;
  }
  .rps-btn:hover { border-color: currentColor; transform: translateY(-3px); }
  .rps-btn.selected { border-color: currentColor; opacity: 1; }
  .rps-btn img { width: 80px; height: 80px; object-fit: cover; border-radius: 6px; display: block; }
  .rps-btn-label { font-size: 0.7rem; margin-top: 4px; opacity: 0.6; }

  #battleCanvas {
    display: block;
    margin: 0 auto 1rem;
    border-radius: 8px;
    border: 1px solid currentColor;
    max-width: 100%;
    opacity: 0.9;
  }

  #resultBox {
    font-family: monospace;
    font-size: 0.9rem;
    min-height: 3rem;
    padding: 0.75rem 1rem;
    border: 1px dashed currentColor;
    border-radius: 6px;
    opacity: 0.85;
    text-align: left;
  }

  /* Lesson sections */
  .lesson-section { margin-bottom: 2.5rem; }
  .lesson-section h2 { margin-bottom: 0.5rem; }
  .lesson-section p  { margin-bottom: 0.75rem; }

  /* Error cards */
  .error-card {
    border: 1px solid currentColor;
    border-left: 4px solid #c0392b;
    border-radius: 8px;
    padding: 1.25rem 1.25rem 1rem;
    margin-bottom: 1.25rem;
    position: relative;
  }
  .error-card h3 { margin: 0 0 0.75rem; font-family: monospace; font-size: 1rem; }

  .error-badge {
    display: inline-block;
    font-size: 0.7rem;
    font-family: monospace;
    border: 1px solid currentColor;
    border-radius: 20px;
    padding: 1px 8px;
    margin-bottom: 0.6rem;
    opacity: 0.7;
  }

  /* RPS image row in error cards */
  .rps-preview { display: flex; align-items: center; gap: 10px; margin: 0.5rem 0 0.75rem; }
  .rps-preview img {
    width: 48px; height: 48px; object-fit: cover;
    border-radius: 6px; border: 1px solid currentColor; opacity: 0.3;
  }
  .rps-preview img.active { opacity: 1; }
  .rps-preview p { margin: 0; font-size: 0.88rem; opacity: 0.75; }

  /* Code blocks */
  .code-block {
    font-family: monospace;
    font-size: 0.9rem;
    border: 1px solid currentColor;
    border-radius: 6px;
    padding: 0.65rem 1rem;
    margin: 0.4rem 0;
    overflow-x: auto;
    opacity: 0.9;
  }
  .code-block.bad  { border-left: 3px solid #c0392b; }
  .code-block.good { border-left: 3px solid #27ae60; }
  .code-err { color: #c0392b; }
  .code-str { color: #e67e22; }
  .code-fn  { font-weight: bold; }

  .badge-bad  { font-size: 0.78rem; font-family: monospace; color: #c0392b; }
  .badge-good { font-size: 0.78rem; font-family: monospace; color: #27ae60; }

  /* Buttons */
  .lesson-btn {
    font-family: monospace;
    font-size: 0.82rem;
    background: none;
    border: 1px solid currentColor;
    border-radius: 5px;
    padding: 5px 12px;
    cursor: pointer;
    margin-top: 6px;
    opacity: 0.8;
    transition: opacity 0.15s;
    color: inherit;
  }
  .lesson-btn:hover { opacity: 1; }
  .lesson-btn.bad  { border-color: #c0392b; color: #c0392b; }
  .lesson-btn.bad:hover  { background: #c0392b; color: white; }
  .lesson-btn.good { border-color: #27ae60; color: #27ae60; }
  .lesson-btn.good:hover { background: #27ae60; color: white; }

  /* Inline mini console output */
  .mini-console {
    font-family: monospace;
    font-size: 0.82rem;
    border: 1px solid currentColor;
    border-radius: 5px;
    padding: 0.6rem 0.9rem;
    margin-top: 8px;
    display: none;
    opacity: 0.85;
    line-height: 1.6;
  }
  .mini-console.show { display: block; }
  .mc-err { color: #c0392b; }
  .mc-ok  { color: #27ae60; }
  .mc-dim { opacity: 0.55; }

  /* Steps list */
  .steps ol { padding-left: 1.4rem; }
  .steps li { margin-bottom: 0.4rem; }
  .steps code {
    font-family: monospace;
    border: 1px solid currentColor;
    border-radius: 3px;
    padding: 0 5px;
    font-size: 0.88rem;
    opacity: 0.85;
  }

  /* Info boxes (challenge, checkpoint) */
  .info-box {
    border: 1px dashed currentColor;
    border-radius: 8px;
    padding: 1.25rem;
    margin-top: 1.5rem;
    opacity: 0.9;
  }
  .info-box h3 { margin: 0 0 0.75rem; font-size: 1rem; }

  /* Checkpoint */
  .cp-row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-top: 0.75rem; }
  .cp-input {
    font-family: monospace;
    font-size: 0.9rem;
    border: 1px solid currentColor;
    border-radius: 5px;
    padding: 7px 10px;
    flex: 1;
    min-width: 200px;
    background: transparent;
    color: inherit;
    outline: none;
  }
  .cp-input.correct { border-color: #27ae60; }
  .cp-input.wrong   { border-color: #c0392b; }

  .show-ans-btn {
    font-family: monospace;
    font-size: 0.78rem;
    background: none;
    border: 1px solid currentColor;
    border-radius: 5px;
    padding: 7px 10px;
    cursor: pointer;
    opacity: 0.5;
    color: inherit;
    transition: opacity 0.15s;
  }
  .show-ans-btn:hover { opacity: 1; }

  .cp-feedback { font-family: monospace; font-size: 0.82rem; margin-top: 6px; }
  .cp-feedback.ok  { color: #27ae60; }
  .cp-feedback.bad { color: #c0392b; }

  hr.divider { border: none; border-top: 1px solid currentColor; opacity: 0.15; margin: 2.5rem 0; }

  kbd {
    font-family: monospace;
    border: 1px solid currentColor;
    border-bottom-width: 2px;
    border-radius: 3px;
    padding: 1px 6px;
    font-size: 0.85rem;
  }
</style>
</head>
<body>
<div class="rps-lesson">

  <h1>🎮 Debugging with Rock Paper Scissors</h1>
  <p>Play the game by clicking the images — or open your browser console and type commands directly. Each section teaches a real debugging concept using the game.</p>

  <!-- ── LIVE GAME ── -->
  <div class="rps-game-box">
    <h2 style="margin-bottom:1rem">▶ Play the Game</h2>
    <div class="rps-btns">
      <div>
        <button class="rps-btn" id="btn-rock" onclick="clickPlay('rock')">
          <img id="rock-img" src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Rock-paper-scissors_%28rock%29.png/100px-Rock-paper-scissors_%28rock%29.png" alt="rock">
        </button>
        <div class="rps-btn-label">ROCK</div>
      </div>
      <div>
        <button class="rps-btn" id="btn-paper" onclick="clickPlay('paper')">
          <img id="paper-img" src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Rock-paper-scissors_%28paper%29.png/100px-Rock-paper-scissors_%28paper%29.png" alt="paper">
        </button>
        <div class="rps-btn-label">PAPER</div>
      </div>
      <div>
        <button class="rps-btn" id="btn-scissors" onclick="clickPlay('scissors')">
          <img id="scissors-img" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Rock-paper-scissors_%28scissors%29.png/100px-Rock-paper-scissors_%28scissors%29.png" alt="scissors">
        </button>
        <div class="rps-btn-label">SCISSORS</div>
      </div>
    </div>

    <canvas id="battleCanvas" width="360" height="160"></canvas>

    <div id="resultBox">
      Click an image above — or type <code>playRPS("rock")</code> in the console.
    </div>
  </div>

  <hr class="divider">

  <!-- ── LESSON 1 ── -->
  <div class="lesson-section steps">
    <h2>Lesson 1 — What Is the Console?</h2>
    <p>The browser console lets you run JavaScript live — no file editing needed. This game is already loaded on the page, so you can control it directly from there.</p>
    <ol>
      <li>Press <kbd>F12</kbd> (or <kbd>Cmd+Option+I</kbd> on Mac) to open DevTools</li>
      <li>Click the <strong>Console</strong> tab</li>
      <li>Type <code>playRPS("rock")</code> and press Enter</li>
      <li>Watch the battle animation above respond!</li>
    </ol>
  </div>

  <hr class="divider">

  <!-- ── LESSON 2 ── -->
  <div class="lesson-section">
    <h2>Lesson 2 — Finding &amp; Fixing Bugs</h2>
    <p>Debugging means reading error messages and fixing the code. Click <strong>Run Broken</strong> to see the error output, then <strong>Run Fixed</strong> to play the game with the corrected code.</p>

    <!-- Bug 1 -->
    <div class="error-card" id="card1">
      <div class="error-badge">Bug #1 — Missing Quotes</div>
      <h3>playRPS(rock)</h3>
      <div class="rps-preview">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Rock-paper-scissors_%28rock%29.png/100px-Rock-paper-scissors_%28rock%29.png" alt="rock" class="active">
        <p>Without quotes, JavaScript thinks <code style="font-family:monospace">rock</code> is a variable name — but no variable by that name exists.</p>
      </div>

      <div class="badge-bad">❌ Broken</div>
      <div class="code-block bad"><span class="code-fn">playRPS</span>(<span class="code-err">rock</span>)</div>
      <button class="lesson-btn bad" onclick="runBroken1()">▶ Run Broken Code</button>
      <div class="mini-console" id="con1"></div>

      <div style="margin-top:1rem">
        <div class="badge-good">✅ Fixed</div>
        <div class="code-block good"><span class="code-fn">playRPS</span>(<span class="code-str">"rock"</span>)</div>
        <button class="lesson-btn good" onclick="runFixed('rock','con1fix','card1')">▶ Run Fixed Code</button>
        <div class="mini-console" id="con1fix"></div>
      </div>

      <p style="margin-top:0.75rem; font-size:0.88rem; opacity:0.7">
        <strong>Why?</strong> String values need quotes. Without them, JS looks for a variable called <code style="font-family:monospace">rock</code> and throws a ReferenceError when it can't find one.
      </p>
    </div>

    <!-- Bug 2 -->
    <div class="error-card" id="card2">
      <div class="error-badge">Bug #2 — Invalid Input</div>
      <h3>playRPS("lizard")</h3>
      <div class="rps-preview">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Rock-paper-scissors_%28rock%29.png/100px-Rock-paper-scissors_%28rock%29.png" alt="rock">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Rock-paper-scissors_%28paper%29.png/100px-Rock-paper-scissors_%28paper%29.png" alt="paper">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Rock-paper-scissors_%28scissors%29.png/100px-Rock-paper-scissors_%28scissors%29.png" alt="scissors">
        <p>"lizard" isn't one of the three valid choices the game knows about.</p>
      </div>

      <div class="badge-bad">❌ Broken</div>
      <div class="code-block bad"><span class="code-fn">playRPS</span>(<span class="code-str">"lizard"</span>)</div>
      <button class="lesson-btn bad" onclick="runBroken2()">▶ Run Broken Code</button>
      <div class="mini-console" id="con2"></div>

      <div style="margin-top:1rem">
        <div class="badge-good">✅ Fixed — use a valid choice</div>
        <div class="code-block good"><span class="code-fn">playRPS</span>(<span class="code-str">"scissors"</span>)</div>
        <button class="lesson-btn good" onclick="runFixed('scissors','con2fix','card2')">▶ Run Fixed Code</button>
        <div class="mini-console" id="con2fix"></div>
      </div>

      <p style="margin-top:0.75rem; font-size:0.88rem; opacity:0.7">
        <strong>Why?</strong> The game checks your input against <code style="font-family:monospace">["rock","paper","scissors"]</code>. "lizard" isn't in that array, so the function rejects it.
      </p>
    </div>

    <!-- Bug 3 -->
    <div class="error-card" id="card3">
      <div class="error-badge">Bug #3 — Wrong Capitalization</div>
      <h3>playRps("paper")</h3>
      <div class="rps-preview">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Rock-paper-scissors_%28paper%29.png/100px-Rock-paper-scissors_%28paper%29.png" alt="paper" class="active">
        <p>JavaScript is case-sensitive. <code style="font-family:monospace">playRps</code> and <code style="font-family:monospace">playRPS</code> are completely different names.</p>
      </div>

      <div class="badge-bad">❌ Broken</div>
      <div class="code-block bad"><span class="code-err">playRps</span>(<span class="code-str">"paper"</span>)</div>
      <button class="lesson-btn bad" onclick="runBroken3()">▶ Run Broken Code</button>
      <div class="mini-console" id="con3"></div>

      <div style="margin-top:1rem">
        <div class="badge-good">✅ Fixed</div>
        <div class="code-block good"><span class="code-fn">playRPS</span>(<span class="code-str">"paper"</span>)</div>
        <button class="lesson-btn good" onclick="runFixed('paper','con3fix','card3')">▶ Run Fixed Code</button>
        <div class="mini-console" id="con3fix"></div>
      </div>

      <p style="margin-top:0.75rem; font-size:0.88rem; opacity:0.7">
        <strong>Why?</strong> JS treats every character as meaningful. <code style="font-family:monospace">playRps</code> doesn't exist as a function — only <code style="font-family:monospace">playRPS</code> does.
      </p>
    </div>
  </div>

  <hr class="divider">

  <!-- ── LESSON 3 ── -->
  <div class="lesson-section steps">
    <h2>Lesson 3 — The Debug Process</h2>
    <ol>
      <li><strong>Read the error message</strong> — it usually pinpoints the problem</li>
      <li><strong>Check spelling &amp; capitalization</strong> — <code>playRPS</code> ≠ <code>playRps</code></li>
      <li><strong>Check your inputs</strong> — strings need quotes, values must be valid</li>
      <li><strong>Run the fix</strong> and verify it works</li>
    </ol>
  </div>

  <hr class="divider">

  <!-- ── CHALLENGE ── -->
  <div class="info-box">
    <h3>🏆 Challenge — Why Does This Work?</h3>
    <p style="margin-bottom:0.75rem">Try this — it uses all caps but still plays correctly:</p>
    <div class="code-block"><span class="code-fn">playRPS</span>(<span class="code-str">"ROCK"</span>)</div>
    <button class="lesson-btn" onclick="runFixed('ROCK','conChallenge',null)" style="margin-bottom:0.5rem">▶ Try It</button>
    <div class="mini-console" id="conChallenge"></div>
    <p style="margin-top:0.75rem; font-size:0.88rem; opacity:0.7">
      <strong>Hint:</strong> The game calls <code style="font-family:monospace">.toLowerCase()</code> on your input before checking it. So <code style="font-family:monospace">"ROCK"</code>, <code style="font-family:monospace">"Rock"</code>, and <code style="font-family:monospace">"rock"</code> all work. That's called <em>defensive programming</em>.
    </p>
  </div>

  <hr class="divider">

  <!-- ── CHECKPOINT ── -->
  <div class="info-box">
    <h3>✅ Checkpoint — Fix the Bug</h3>
    <p>The code below has an error. Type the corrected version in the box:</p>
    <div class="code-block bad" style="margin-top:0.5rem"><span class="code-err">playRPS(rock)</span></div>
    <div class="cp-row">
      <input class="cp-input" id="cp-input" type="text" placeholder='Type the fixed code…' autocomplete="off" spellcheck="false">
      <button class="show-ans-btn" id="cp-show">Show Answer</button>
    </div>
    <div class="cp-feedback" id="cp-feedback"></div>
    <div style="margin-top:0.75rem">
      <button class="lesson-btn good" id="cp-run-btn" style="display:none" onclick="runCheckpointAnswer()">▶ Run Your Fix</button>
      <div class="mini-console" id="cp-console"></div>
    </div>
  </div>

</div><!-- /rps-lesson -->

<script>
// ── OOP CLASSES ──────────────────────────────────────────────

class BattleSprite {
  constructor(image, width, height, x, y) {
    this.image = image;
    this.width = width; this.height = height;
    this.homeX = x; this.homeY = y;
    this.x = x; this.y = y;
    this.targetX = x; this.targetY = y;
    this.opacity = 1; this.scale = 1; this.rotation = 0;
    this.animating = false;
  }
  update() {
    if (this.animating) {
      this.x += (this.targetX - this.x) * 0.12;
      this.y += (this.targetY - this.y) * 0.12;
    } else {
      this.x += (this.homeX - this.x) * 0.08;
      this.y += (this.homeY - this.y) * 0.08;
    }
  }
  draw(ctx) {
    if (!this.image.complete || this.image.naturalWidth === 0) return;
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.rotation);
    ctx.scale(this.scale, this.scale);
    ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
    ctx.restore();
  }
  resetVisuals() { this.opacity = 1; this.scale = 1; this.rotation = 0; }
}

class GameObject {
  constructor(id) { this.el = document.getElementById(id); }
  rotate(deg)      { if(this.el) this.el.style.transform = `rotate(${deg}deg)`; return this; }
  setBorder(style) { if(this.el) this.el.style.border = style; return this; }
  setWidth(px)     { if(this.el) this.el.style.width = `${px}px`; return this; }
  reset()          { if(this.el){ this.el.style.transform=''; this.el.style.border=''; this.el.style.width=''; } return this; }
}
class Rock     extends GameObject { constructor(){ super("rock-img"); } }
class Paper    extends GameObject { constructor(){ super("paper-img"); } }
class Scissors extends GameObject { constructor(){ super("scissors-img"); } }

window.rock     = new Rock();
window.paper    = new Paper();
window.scissors = new Scissors();

// ── CANVAS ───────────────────────────────────────────────────

const canvas = document.getElementById('battleCanvas');
const ctx    = canvas.getContext('2d');

const rockImg     = document.getElementById('rock-img');
const paperImg    = document.getElementById('paper-img');
const scissorsImg = document.getElementById('scissors-img');

const sprites = {
  rock:     new BattleSprite(rockImg,     72, 72,  22, 44),
  paper:    new BattleSprite(paperImg,    72, 72, 144, 44),
  scissors: new BattleSprite(scissorsImg, 72, 72, 266, 44)
};

const battle = { active:false, winner:null, loser:null, frames:0, max:110, tie:null };

function startBattle(winner, loser) {
  battle.active=true; battle.tie=null; battle.winner=winner; battle.loser=loser; battle.frames=0;
  sprites[winner].animating=true;
  sprites[winner].targetX = sprites[loser].homeX;
  sprites[winner].targetY = sprites[loser].homeY;
  sprites[loser].animating=false;
}
function startTie(choice) {
  battle.active=true; battle.tie=choice; battle.winner=null; battle.loser=null; battle.frames=0;
  Object.values(sprites).forEach(s=>{ s.animating=false; });
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(128,128,128,0.07)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.font = "bold 8px monospace";
  ctx.fillStyle = 'gray';
  ctx.globalAlpha = 0.5;
  ctx.textAlign = 'center';
  ctx.fillText('ANIMATED BATTLE — OOP IN ACTION', canvas.width/2, 16);
  ctx.restore();

  if (battle.active) {
    const t = battle.frames / battle.max;
    if (battle.tie) {
      sprites[battle.tie].rotation = Math.sin(battle.frames * 0.3) * 4 * Math.PI / 180;
    } else {
      const w = sprites[battle.winner];
      const l = sprites[battle.loser];
      const pulse = battle.frames < battle.max/2
        ? 1 + (battle.frames/(battle.max/2)) * 0.2
        : 1.2 - ((battle.frames - battle.max/2)/(battle.max/2)) * 0.2;
      w.scale = pulse;
      l.opacity = Math.max(0.1, 1 - t * 0.9);
      l.scale   = Math.max(0.5, 1 - t * 0.5);
      if(battle.winner==='rock'     && battle.loser==='scissors') l.rotation = -t*(Math.PI/4);
      if(battle.winner==='paper'    && battle.loser==='rock')     { w.targetX=l.homeX-4; w.targetY=l.homeY-4; }
      if(battle.winner==='scissors' && battle.loser==='paper')    { w.rotation=t*(Math.PI/10); l.rotation=-t*(Math.PI/10); }
    }
    battle.frames++;
    if (battle.frames >= battle.max) {
      battle.active = false;
      Object.values(sprites).forEach(s=>{ s.resetVisuals(); s.animating=false; });
    }
  }

  Object.values(sprites).forEach(s=>{ s.update(); s.draw(ctx); });

  ctx.save();
  ctx.font = "7px monospace";
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = 'gray';
  ctx.textAlign = 'center';
  [['ROCK',58],['PAPER',180],['SCISSORS',302]].forEach(([label,x])=>{
    ctx.fillText(label, x, 140);
  });
  ctx.restore();

  requestAnimationFrame(render);
}
render();

// ── GAME LOGIC ───────────────────────────────────────────────

function highlightImage(choice) {
  ['rock','paper','scissors'].forEach(c => {
    document.getElementById('btn-'+c).classList.remove('selected');
  });
  document.getElementById('btn-'+choice).classList.add('selected');
}

function playRPSCore(playerChoice) {
  const choices = ["rock","paper","scissors"];
  playerChoice = playerChoice.toLowerCase();
  if (!choices.includes(playerChoice)) return null;

  const computerChoice = choices[Math.floor(Math.random()*choices.length)];
  let resultText, winner=null, loser=null;

  if (playerChoice === computerChoice) {
    resultText="Tie!"; startTie(playerChoice);
  } else if (
    (playerChoice==="rock"     && computerChoice==="scissors") ||
    (playerChoice==="paper"    && computerChoice==="rock")     ||
    (playerChoice==="scissors" && computerChoice==="paper")
  ) {
    resultText="You Win!"; winner=playerChoice; loser=computerChoice;
  } else {
    resultText="You Lose!"; winner=computerChoice; loser=playerChoice;
  }

  document.getElementById("resultBox").innerHTML =
    `You chose: <strong>${playerChoice.toUpperCase()}</strong> &nbsp;|&nbsp; ` +
    `Computer chose: <strong>${computerChoice.toUpperCase()}</strong><br>` +
    `<strong>${resultText}</strong>`;

  if (winner && loser) startBattle(winner, loser);
  return { player:playerChoice, computer:computerChoice, result:resultText };
}

window.playRPS = function(playerChoice) {
  if (!playerChoice || typeof playerChoice !== 'string') {
    console.error('Please provide a valid choice: "rock", "paper", or "scissors"');
    return;
  }
  if (!["rock","paper","scissors"].includes(playerChoice.toLowerCase())) {
    console.error('Invalid choice! Use "rock", "paper", or "scissors"');
    return;
  }
  highlightImage(playerChoice.toLowerCase());
  const result = playRPSCore(playerChoice);
  if (result) {
    console.log("You chose:", result.player.toUpperCase());
    console.log("Computer chose:", result.computer.toUpperCase());
    console.log("Result:", result.result);
  }
  return result;
};

function clickPlay(choice) {
  highlightImage(choice);
  const result = playRPSCore(choice);
  if (result) {
    console.log("You chose:", result.player.toUpperCase());
    console.log("Computer chose:", result.computer.toUpperCase());
    console.log("Result:", result.result);
  }
}

// ── LESSON HELPERS ───────────────────────────────────────────

function showConsole(id, lines) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('show');
  el.innerHTML = lines.map(l => `<div class="${l.cls}">${l.text}</div>`).join('');
}

function runBroken1() {
  showConsole('con1', [
    {cls:'mc-err', text:'❌ ReferenceError: rock is not defined'},
    {cls:'mc-dim', text:'   JS looked for a variable called rock — not found.'},
    {cls:'mc-dim', text:'   Fix: add quotes → playRPS("rock")'}
  ]);
}
function runBroken2() {
  showConsole('con2', [
    {cls:'mc-err', text:'❌ Invalid choice! Use "rock", "paper", or "scissors"'},
    {cls:'mc-dim', text:'   choices = ["rock", "paper", "scissors"]'},
    {cls:'mc-dim', text:'   "lizard" is not in that array.'}
  ]);
}
function runBroken3() {
  showConsole('con3', [
    {cls:'mc-err', text:'❌ TypeError: playRps is not a function'},
    {cls:'mc-dim', text:'   JS is case-sensitive. playRps ≠ playRPS'},
    {cls:'mc-dim', text:'   Fix: playRPS("paper")  ← capital R, P, S'}
  ]);
}

function runFixed(choice, consoleId, cardId) {
  const normalized = choice.toLowerCase();
  if (!["rock","paper","scissors"].includes(normalized)) {
    showConsole(consoleId, [{cls:'mc-err', text:`❌ Invalid choice: "${choice}"`}]);
    return;
  }
  highlightImage(normalized);
  const result = playRPSCore(choice);
  if (!result) return;
  const rCls = result.result==="You Win!" ? 'mc-ok' : result.result==="You Lose!" ? 'mc-err' : '';
  showConsole(consoleId, [
    {cls:'mc-dim', text:`> playRPS("${choice}")`},
    {cls:'',       text:`  You chose: ${result.player.toUpperCase()}`},
    {cls:'',       text:`  Computer chose: ${result.computer.toUpperCase()}`},
    {cls:rCls,     text:`  Result: ${result.result}`}
  ]);
  if (cardId) {
    const card = document.getElementById(cardId);
    card.style.borderLeftColor = '#27ae60';
    const badge = card.querySelector('.error-badge');
    if (badge) badge.textContent = '✓ Fixed!';
  }
}

// ── CHECKPOINT ───────────────────────────────────────────────

const cpInput    = document.getElementById('cp-input');
const cpFeedback = document.getElementById('cp-feedback');
const cpShow     = document.getElementById('cp-show');
const cpRunBtn   = document.getElementById('cp-run-btn');

const correctAnswers = [
  'playRPS("rock")', "playRPS('rock')",
  'playRPS("paper")', "playRPS('paper')",
  'playRPS("scissors")', "playRPS('scissors')"
];

cpInput.addEventListener('input', function() {
  const val = cpInput.value.trim();
  if (!val) {
    cpFeedback.textContent = '';
    cpFeedback.className = 'cp-feedback';
    cpInput.className = 'cp-input';
    cpRunBtn.style.display = 'none';
    return;
  }
  if (correctAnswers.includes(val)) {
    cpInput.className = 'cp-input correct';
    cpFeedback.textContent = '✅ Correct! The string is properly quoted.';
    cpFeedback.className = 'cp-feedback ok';
    cpShow.style.display = 'none';
    cpRunBtn.style.display = 'inline-block';
  } else {
    cpInput.className = 'cp-input wrong';
    cpFeedback.textContent = 'Not quite — check your quotes and spelling.';
    cpFeedback.className = 'cp-feedback bad';
    cpShow.style.display = 'inline-block';
    cpRunBtn.style.display = 'none';
  }
});

cpShow.onclick = function() {
  cpInput.value = 'playRPS("rock")';
  cpInput.dispatchEvent(new Event('input'));
};

function runCheckpointAnswer() {
  const match = cpInput.value.trim().match(/playRPS\(["'](\w+)["']\)/i);
  if (match) runFixed(match[1], 'cp-console', null);
}
</script>
</body>
</html>