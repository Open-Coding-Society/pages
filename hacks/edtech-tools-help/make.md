---
layout: post
title: Edtech Make
author: Nithika Vivek
permalink: /tools-help/make
breadcrumb: True
---

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Make Error Quest | Debug & Conquer</title>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Zilla+Slab:wght@600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --bg-primary: #0a0e14;
            --bg-secondary: #151921;
            --bg-tertiary: #1f2430;
            --accent-primary: #00ff9f;
            --accent-secondary: #00ccff;
            --accent-danger: #ff3366;
            --accent-warning: #ffaa00;
            --text-primary: #e6e6e6;
            --text-secondary: #8f93a2;
            --border-color: #2d3340;
            --terminal-green: #39ff14;
            --glow: 0 0 20px rgba(0, 255, 159, 0.3);
        }

        body {
            font-family: 'JetBrains Mono', monospace;
            background: linear-gradient(135deg, var(--bg-primary) 0%, #0d1117 100%);
            color: var(--text-primary);
            line-height: 1.6;
            min-height: 100vh;
            position: relative;
            overflow-x: hidden;
        }

        /* Animated background grid */
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
                repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(0, 255, 159, 0.03) 50px, rgba(0, 255, 159, 0.03) 51px),
                repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(0, 255, 159, 0.03) 50px, rgba(0, 255, 159, 0.03) 51px);
            pointer-events: none;
            z-index: 0;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem;
            position: relative;
            z-index: 1;
        }

        /* Header */
        header {
            text-align: center;
            padding: 3rem 0;
            margin-bottom: 3rem;
            position: relative;
        }

        h1 {
            font-family: 'Zilla Slab', serif;
            font-size: 4rem;
            font-weight: 700;
            background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 0.5rem;
            text-shadow: var(--glow);
            animation: glow-pulse 3s ease-in-out infinite;
        }

        @keyframes glow-pulse {
            0%, 100% { filter: drop-shadow(0 0 10px rgba(0, 255, 159, 0.4)); }
            50% { filter: drop-shadow(0 0 20px rgba(0, 255, 159, 0.6)); }
        }

        .subtitle {
            font-size: 1.2rem;
            color: var(--text-secondary);
            font-weight: 400;
        }

        .tagline {
            margin-top: 1rem;
            font-size: 0.9rem;
            color: var(--accent-primary);
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        /* OS Selector */
        .os-selector {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 3rem;
        }

        .os-btn {
            background: var(--bg-tertiary);
            border: 2px solid var(--border-color);
            padding: 1rem 2rem;
            border-radius: 8px;
            color: var(--text-secondary);
            font-family: 'JetBrains Mono', monospace;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .os-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(0, 255, 159, 0.2), transparent);
            transition: left 0.5s ease;
        }

        .os-btn:hover::before {
            left: 100%;
        }

        .os-btn:hover {
            border-color: var(--accent-primary);
            color: var(--accent-primary);
            box-shadow: var(--glow);
        }

        .os-btn.active {
            background: linear-gradient(135deg, rgba(0, 255, 159, 0.1), rgba(0, 204, 255, 0.1));
            border-color: var(--accent-primary);
            color: var(--accent-primary);
            box-shadow: var(--glow);
        }

        /* Tab System */
        .tabs {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
            border-bottom: 2px solid var(--border-color);
        }

        .tab {
            background: transparent;
            border: none;
            padding: 1rem 2rem;
            color: var(--text-secondary);
            font-family: 'Zilla Slab', serif;
            font-size: 1.2rem;
            font-weight: 600;
            cursor: pointer;
            border-bottom: 3px solid transparent;
            transition: all 0.3s ease;
            position: relative;
        }

        .tab:hover {
            color: var(--accent-primary);
        }

        .tab.active {
            color: var(--accent-primary);
            border-bottom-color: var(--accent-primary);
        }

        .tab-content {
            display: none;
            animation: fadeIn 0.5s ease;
        }

        .tab-content.active {
            display: block;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Learning Module Cards */
        .learning-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
            margin-bottom: 3rem;
        }

        .error-card {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 2rem;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .error-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: var(--accent-primary);
            transform: scaleY(0);
            transition: transform 0.3s ease;
        }

        .error-card:hover {
            transform: translateY(-5px);
            border-color: var(--accent-primary);
            box-shadow: 0 10px 30px rgba(0, 255, 159, 0.2);
        }

        .error-card:hover::before {
            transform: scaleY(1);
        }

        .error-title {
            font-family: 'Zilla Slab', serif;
            font-size: 1.5rem;
            color: var(--accent-primary);
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .error-icon {
            font-size: 1.8rem;
        }

        .error-message {
            background: var(--bg-tertiary);
            border-left: 3px solid var(--accent-danger);
            padding: 1rem;
            margin: 1rem 0;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.9rem;
            color: var(--accent-danger);
            border-radius: 4px;
            overflow-x: auto;
        }

        .solution-steps {
            margin-top: 1.5rem;
        }

        .step {
            background: var(--bg-tertiary);
            border-left: 3px solid var(--accent-secondary);
            padding: 1rem;
            margin: 0.75rem 0;
            border-radius: 4px;
        }

        .step-number {
            color: var(--accent-secondary);
            font-weight: 700;
            margin-right: 0.5rem;
        }

        .code-block {
            background: var(--bg-primary);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            padding: 1rem;
            margin: 0.75rem 0;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.85rem;
            color: var(--terminal-green);
            overflow-x: auto;
            position: relative;
        }

        .code-block::before {
            content: '$ ';
            color: var(--accent-primary);
            font-weight: 700;
        }

        /* Game Section */
        .game-arena {
            background: var(--bg-secondary);
            border: 2px solid var(--accent-primary);
            border-radius: 16px;
            padding: 2rem;
            margin-top: 2rem;
            box-shadow: 0 0 40px rgba(0, 255, 159, 0.2);
        }

        .game-header {
            text-align: center;
            margin-bottom: 2rem;
        }

        .game-title {
            font-family: 'Zilla Slab', serif;
            font-size: 2.5rem;
            color: var(--accent-primary);
            margin-bottom: 0.5rem;
        }

        .game-stats {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-bottom: 2rem;
        }

        .stat-box {
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 1rem 2rem;
            text-align: center;
        }

        .stat-label {
            font-size: 0.8rem;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .stat-value {
            font-size: 2rem;
            font-weight: 700;
            color: var(--accent-primary);
            margin-top: 0.25rem;
        }

        .challenge-box {
            background: var(--bg-tertiary);
            border: 2px solid var(--border-color);
            border-radius: 12px;
            padding: 2rem;
            margin-bottom: 2rem;
        }

        .challenge-header {
            font-family: 'Zilla Slab', serif;
            font-size: 1.5rem;
            color: var(--accent-secondary);
            margin-bottom: 1rem;
        }

        .terminal-output {
            background: var(--bg-primary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 1.5rem;
            margin: 1rem 0;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.9rem;
            min-height: 150px;
        }

        .choices-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
            margin-top: 1.5rem;
        }

        .choice-btn {
            background: var(--bg-primary);
            border: 2px solid var(--border-color);
            border-radius: 8px;
            padding: 1.5rem;
            text-align: left;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .choice-btn::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(0, 255, 159, 0.1);
            transform: translate(-50%, -50%);
            transition: width 0.5s ease, height 0.5s ease;
        }

        .choice-btn:hover::before {
            width: 500px;
            height: 500px;
        }

        .choice-btn:hover {
            border-color: var(--accent-primary);
            transform: translateX(10px);
        }

        .choice-btn.correct {
            border-color: var(--accent-primary);
            background: rgba(0, 255, 159, 0.1);
            animation: pulse-correct 0.5s ease;
        }

        .choice-btn.incorrect {
            border-color: var(--accent-danger);
            background: rgba(255, 51, 102, 0.1);
            animation: shake 0.5s ease;
        }

        @keyframes pulse-correct {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }

        .choice-letter {
            display: inline-block;
            width: 30px;
            height: 30px;
            background: var(--accent-primary);
            color: var(--bg-primary);
            border-radius: 50%;
            text-align: center;
            line-height: 30px;
            font-weight: 700;
            margin-right: 1rem;
        }

        .feedback {
            background: var(--bg-primary);
            border-left: 4px solid var(--accent-primary);
            border-radius: 8px;
            padding: 1.5rem;
            margin-top: 1.5rem;
            display: none;
        }

        .feedback.show {
            display: block;
            animation: slideIn 0.5s ease;
        }

        @keyframes slideIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
        }

        .feedback.correct {
            border-color: var(--accent-primary);
        }

        .feedback.incorrect {
            border-color: var(--accent-danger);
        }

        .next-btn {
            background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
            border: none;
            border-radius: 8px;
            padding: 1rem 3rem;
            color: var(--bg-primary);
            font-family: 'Zilla Slab', serif;
            font-size: 1.2rem;
            font-weight: 700;
            cursor: pointer;
            margin-top: 1.5rem;
            transition: all 0.3s ease;
            display: none;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .next-btn.show {
            display: inline-block;
        }

        .next-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 0 30px rgba(0, 255, 159, 0.5);
        }

        .completion-screen {
            text-align: center;
            padding: 3rem;
            display: none;
        }

        .completion-screen.show {
            display: block;
            animation: fadeIn 1s ease;
        }

        .trophy {
            font-size: 5rem;
            margin-bottom: 1rem;
            animation: bounce 1s ease infinite;
        }

        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }

        .completion-title {
            font-family: 'Zilla Slab', serif;
            font-size: 3rem;
            color: var(--accent-primary);
            margin-bottom: 1rem;
        }

        .restart-btn {
            background: var(--bg-tertiary);
            border: 2px solid var(--accent-primary);
            border-radius: 8px;
            padding: 1rem 2rem;
            color: var(--accent-primary);
            font-family: 'JetBrains Mono', monospace;
            font-size: 1rem;
            cursor: pointer;
            margin-top: 2rem;
            transition: all 0.3s ease;
        }

        .restart-btn:hover {
            background: var(--accent-primary);
            color: var(--bg-primary);
            transform: scale(1.05);
        }

        .os-specific {
            display: none;
        }

        .os-specific.active {
            display: block;
        }

        /* Progress bar */
        .progress-bar {
            background: var(--bg-tertiary);
            height: 8px;
            border-radius: 4px;
            margin-bottom: 2rem;
            overflow: hidden;
        }

        .progress-fill {
            background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
            height: 100%;
            width: 0%;
            transition: width 0.5s ease;
            box-shadow: 0 0 10px rgba(0, 255, 159, 0.5);
        }

        /* Tips box */
        .tip-box {
            background: linear-gradient(135deg, rgba(0, 255, 159, 0.1), rgba(0, 204, 255, 0.1));
            border: 1px solid var(--accent-primary);
            border-radius: 8px;
            padding: 1rem;
            margin-top: 1rem;
        }

        .tip-label {
            color: var(--accent-primary);
            font-weight: 700;
            text-transform: uppercase;
            font-size: 0.8rem;
            letter-spacing: 1px;
            margin-bottom: 0.5rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
            h1 { font-size: 2.5rem; }
            .learning-grid { grid-template-columns: 1fr; }
            .os-selector { flex-direction: column; }
            .tabs { flex-direction: column; border-bottom: none; }
            .tab { border-bottom: 1px solid var(--border-color); }
            .stat-box { padding: 0.75rem 1rem; }
            .stat-value { font-size: 1.5rem; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>⚡ Make Error Quest</h1>
            <p class="subtitle">Master the art of debugging build errors</p>
            <p class="tagline">Learn • Debug • Conquer</p>
        </header>

        <!-- OS Selector -->
        <div class="os-selector">
            <button class="os-btn active" data-os="mac" onclick="switchOS('mac')">
                🍎 macOS
            </button>
            <button class="os-btn" data-os="windows" onclick="switchOS('windows')">
                🪟 Windows
            </button>
        </div>

        <!-- Tab Navigation -->
        <div class="tabs">
            <button class="tab active" onclick="switchTab('learn')">📚 Learn</button>
            <button class="tab" onclick="switchTab('practice')">🎮 Practice</button>
        </div>

        <!-- Learning Tab -->
        <div id="learn-tab" class="tab-content active">
            <div class="learning-grid">
                <!-- Error 1: Make not found -->
                <div class="error-card">
                    <h3 class="error-title">
                        <span class="error-icon">🔍</span>
                        Make Not Found
                    </h3>
                    <div class="error-message">
                        <div class="os-specific active" id="mac-error-1">
                            make: command not found
                        </div>
                        <div class="os-specific" id="windows-error-1">
                            'make' is not recognized as an internal or external command
                        </div>
                    </div>
                    <p><strong>What This Means:</strong> Your system doesn't know what "make" is. It's like asking someone to use a tool they don't have!</p>
                    
                    <div class="solution-steps">
                        <div class="os-specific active" id="mac-solution-1">
                            <div class="step">
                                <span class="step-number">1.</span>
                                Install Xcode Command Line Tools (includes make)
                            </div>
                            <div class="code-block">xcode-select --install</div>
                            
                            <div class="step">
                                <span class="step-number">2.</span>
                                Agree to the license and wait for installation
                            </div>
                            
                            <div class="step">
                                <span class="step-number">3.</span>
                                Verify make is installed
                            </div>
                            <div class="code-block">make --version</div>
                            
                            <div class="tip-box">
                                <div class="tip-label">💡 Pro Tip</div>
                                If you have Homebrew, you can also use: <code>brew install make</code>
                            </div>
                        </div>
                        
                        <div class="os-specific" id="windows-solution-1">
                            <div class="step">
                                <span class="step-number">1.</span>
                                Install Windows Subsystem for Linux (WSL) or use Git Bash
                            </div>
                            
                            <div class="step">
                                <span class="step-number">2.</span>
                                For WSL: Open PowerShell as Administrator and run:
                            </div>
                            <div class="code-block">wsl --install</div>
                            
                            <div class="step">
                                <span class="step-number">3.</span>
                                In WSL/Ubuntu, install make:
                            </div>
                            <div class="code-block">sudo apt update && sudo apt install make</div>
                            
                            <div class="tip-box">
                                <div class="tip-label">💡 Pro Tip</div>
                                Git Bash (comes with Git for Windows) also includes make! Just make sure Git is in your PATH.
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Error 2: Makefile not found -->
                <div class="error-card">
                    <h3 class="error-title">
                        <span class="error-icon">📄</span>
                        No Makefile Found
                    </h3>
                    <div class="error-message">
                        make: *** No targets specified and no makefile found. Stop.
                    </div>
                    <p><strong>What This Means:</strong> Make is looking for instructions (a Makefile) but can't find any. You're in the wrong directory!</p>
                    
                    <div class="solution-steps">
                        <div class="step">
                            <span class="step-number">1.</span>
                            Check where you are
                        </div>
                        <div class="code-block">pwd</div>
                        
                        <div class="step">
                            <span class="step-number">2.</span>
                            List files to see if Makefile exists
                        </div>
                        <div class="code-block os-specific active" id="mac-list">ls -la</div>
                        <div class="code-block os-specific" id="windows-list">dir</div>
                        
                        <div class="step">
                            <span class="step-number">3.</span>
                            Navigate to the correct project directory
                        </div>
                        <div class="code-block">cd /path/to/your/project</div>
                        
                        <div class="tip-box">
                            <div class="tip-label">🎯 Quick Check</div>
                            Look for a file named exactly "Makefile" (capital M, no extension). It should be in your project root!
                        </div>
                    </div>
                </div>

                <!-- Error 3: No rule to make target -->
                <div class="error-card">
                    <h3 class="error-title">
                        <span class="error-icon">🎯</span>
                        No Rule to Make Target
                    </h3>
                    <div class="error-message">
                        make: *** No rule to make target 'sever'. Stop.
                    </div>
                    <p><strong>What This Means:</strong> You asked make to run a task that doesn't exist in the Makefile. Typos are the usual suspect!</p>
                    
                    <div class="solution-steps">
                        <div class="step">
                            <span class="step-number">1.</span>
                            Check available targets in your Makefile
                        </div>
                        <div class="code-block os-specific active" id="mac-targets">grep "^[a-zA-Z]" Makefile</div>
                        <div class="code-block os-specific" id="windows-targets">findstr /B /R "^[a-zA-Z]" Makefile</div>
                        
                        <div class="step">
                            <span class="step-number">2.</span>
                            Fix your typo - it's probably "server" not "sever"!
                        </div>
                        <div class="code-block">make server</div>
                        
                        <div class="tip-box">
                            <div class="tip-label">🔎 Common Typos</div>
                            server → sever | install → instal | clean → clen | test → tset
                        </div>
                    </div>
                </div>

                <!-- Error 4: Missing separator -->
                <div class="error-card">
                    <h3 class="error-title">
                        <span class="error-icon">⚠️</span>
                        Missing Separator
                    </h3>
                    <div class="error-message">
                        Makefile:5: *** missing separator. Stop.
                    </div>
                    <p><strong>What This Means:</strong> Makefiles are VERY picky about tabs. You probably used spaces instead of a TAB character.</p>
                    
                    <div class="solution-steps">
                        <div class="step">
                            <span class="step-number">1.</span>
                            Open your Makefile in a text editor
                        </div>
                        
                        <div class="step">
                            <span class="step-number">2.</span>
                            Look at line 5 (the error tells you which line!)
                        </div>
                        
                        <div class="step">
                            <span class="step-number">3.</span>
                            Make sure commands under targets start with a TAB, not spaces
                        </div>
                        
                        <div class="tip-box">
                            <div class="tip-label">⌨️ The Tab Rule</div>
                            In a Makefile, every command must start with a TAB character. Delete any spaces at the start of the line and press TAB once!
                        </div>
                    </div>
                </div>

                <!-- Error 5: Permission denied -->
                <div class="error-card">
                    <h3 class="error-title">
                        <span class="error-icon">🔒</span>
                        Permission Denied
                    </h3>
                    <div class="error-message os-specific active" id="mac-permission">
                        make: ./script.sh: Permission denied
                    </div>
                    <div class="error-message os-specific" id="windows-permission">
                        Access is denied.
                    </div>
                    <p><strong>What This Means:</strong> The script or file doesn't have execute permissions. Your system won't run it for safety!</p>
                    
                    <div class="solution-steps">
                        <div class="os-specific active" id="mac-permission-fix">
                            <div class="step">
                                <span class="step-number">1.</span>
                                Add execute permission to the file
                            </div>
                            <div class="code-block">chmod +x script.sh</div>
                            
                            <div class="step">
                                <span class="step-number">2.</span>
                                Run make again
                            </div>
                            
                            <div class="tip-box">
                                <div class="tip-label">🛡️ What chmod does</div>
                                chmod +x adds "execute" permission, telling your OS "yes, this file is safe to run"
                            </div>
                        </div>
                        
                        <div class="os-specific" id="windows-permission-fix">
                            <div class="step">
                                <span class="step-number">1.</span>
                                In WSL, add execute permission
                            </div>
                            <div class="code-block">chmod +x script.sh</div>
                            
                            <div class="step">
                                <span class="step-number">2.</span>
                                Or right-click file → Properties → Security → Edit permissions
                            </div>
                            
                            <div class="tip-box">
                                <div class="tip-label">🔧 Windows Note</div>
                                If using WSL, chmod works the same as macOS/Linux. In native Windows, check file properties!
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Error 6: File not found -->
                <div class="error-card">
                    <h3 class="error-title">
                        <span class="error-icon">❌</span>
                        No Such File or Directory
                    </h3>
                    <div class="error-message">
                        make: *** [server] Error 127
                        /bin/sh: python3: command not found
                    </div>
                    <p><strong>What This Means:</strong> Make is trying to run a command (like python3) that your system can't find.</p>
                    
                    <div class="solution-steps">
                        <div class="step">
                            <span class="step-number">1.</span>
                            Check if the command exists
                        </div>
                        <div class="code-block os-specific active" id="mac-which">which python3</div>
                        <div class="code-block os-specific" id="windows-which">where python3</div>
                        
                        <div class="step">
                            <span class="step-number">2.</span>
                            If it returns nothing, install the missing tool
                        </div>
                        
                        <div class="os-specific active" id="mac-install">
                            <div class="code-block">brew install python3</div>
                        </div>
                        
                        <div class="os-specific" id="windows-install">
                            <div class="step">Download from python.org or use:</div>
                            <div class="code-block">winget install Python.Python.3</div>
                        </div>
                        
                        <div class="tip-box">
                            <div class="tip-label">🔍 Debugging Tip</div>
                            The error often tells you what's missing. Look for "command not found" followed by the program name!
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Practice Tab (Game) -->
        <div id="practice-tab" class="tab-content">
            <div class="game-arena">
                <div class="game-header">
                    <h2 class="game-title">🎮 Debug Challenge Arena</h2>
                    <p class="subtitle">Test your make debugging skills!</p>
                </div>

                <div class="progress-bar">
                    <div class="progress-fill" id="progress"></div>
                </div>

                <div class="game-stats">
                    <div class="stat-box">
                        <div class="stat-label">Score</div>
                        <div class="stat-value" id="score">0</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">Level</div>
                        <div class="stat-value" id="level">1</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">Streak</div>
                        <div class="stat-value" id="streak">0</div>
                    </div>
                </div>

                <div id="game-content">
                    <div class="challenge-box">
                        <h3 class="challenge-header" id="challenge-title">Challenge #1</h3>
                        <p id="challenge-scenario">Loading challenge...</p>
                        
                        <div class="terminal-output" id="terminal-output">
                            <span style="color: var(--accent-primary);">$</span> make server<br>
                            <span style="color: var(--accent-danger);">make: command not found</span>
                        </div>

                        <div class="choices-grid" id="choices">
                            <!-- Choices will be populated by JavaScript -->
                        </div>

                        <div class="feedback" id="feedback">
                            <h4 id="feedback-title"></h4>
                            <p id="feedback-text"></p>
                        </div>

                        <button class="next-btn" id="next-btn" onclick="nextChallenge()">
                            Next Challenge →
                        </button>
                    </div>
                </div>

                <div class="completion-screen" id="completion">
                    <div class="trophy">🏆</div>
                    <h2 class="completion-title">Quest Complete!</h2>
                    <p class="subtitle">You've mastered the fundamentals of Make debugging!</p>
                    <div class="game-stats" style="margin-top: 2rem;">
                        <div class="stat-box">
                            <div class="stat-label">Final Score</div>
                            <div class="stat-value" id="final-score">0</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-label">Accuracy</div>
                            <div class="stat-value" id="accuracy">0%</div>
                        </div>
                    </div>
                    <button class="restart-btn" onclick="restartGame()">🔄 Play Again</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        // State management
        let currentOS = 'mac';
        let currentTab = 'learn';
        let currentChallenge = 0;
        let score = 0;
        let streak = 0;
        let totalAttempts = 0;
        let correctAnswers = 0;

        // Challenge data
        const challenges = [
            {
                title: "Challenge #1: Command Not Found",
                scenario: "You just cloned a project and tried to run 'make server'. You see an error...",
                terminal: "<span style='color: var(--accent-primary);'>$</span> make server<br><span style='color: var(--accent-danger);'>make: command not found</span>",
                choices: [
                    { text: "Install make using package manager", correct: true, explanation: "Correct! You need to install make first. On Mac use xcode-select --install, on Windows use WSL or Git Bash." },
                    { text: "Delete the Makefile and create a new one", correct: false, explanation: "Not quite! The Makefile is fine - your system just doesn't have make installed yet." },
                    { text: "Change 'make' to 'python' in the command", correct: false, explanation: "That won't work! Make is a build tool - you need to install it first." },
                    { text: "Restart your computer", correct: false, explanation: "Restarting won't help if make isn't installed. Install it first!" }
                ]
            },
            {
                title: "Challenge #2: Lost in Space",
                scenario: "You're sure you have a Makefile, but make can't find it...",
                terminal: "<span style='color: var(--accent-primary);'>$</span> make<br><span style='color: var(--accent-danger);'>make: *** No targets specified and no makefile found. Stop.</span>",
                choices: [
                    { text: "Check current directory with 'pwd' and navigate to project root", correct: true, explanation: "Perfect! You're probably in the wrong directory. Use 'pwd' to check and 'cd' to navigate to your project root." },
                    { text: "Create a new Makefile from scratch", correct: false, explanation: "Wait! The Makefile already exists - you're just in the wrong folder." },
                    { text: "Reinstall make", correct: false, explanation: "Make is working fine - it just can't find the Makefile because you're in the wrong directory." },
                    { text: "Run 'make install' instead", correct: false, explanation: "That won't help. You need to find your Makefile first by navigating to the right directory." }
                ]
            },
            {
                title: "Challenge #3: The Typo Trap",
                scenario: "You're trying to start the server but getting a strange error...",
                terminal: "<span style='color: var(--accent-primary);'>$</span> make sever<br><span style='color: var(--accent-danger);'>make: *** No rule to make target 'sever'. Stop.</span>",
                choices: [
                    { text: "Fix the typo - it should be 'server' not 'sever'", correct: true, explanation: "Excellent eye! 'sever' is a typo. The correct target is 'server'. Check your Makefile for available targets." },
                    { text: "Add a new 'sever' target to the Makefile", correct: false, explanation: "You could, but that's probably not what you want. Check if you meant 'server' instead!" },
                    { text: "Run make without any target", correct: false, explanation: "That might work, but you have a typo! The target should be 'server' not 'sever'." },
                    { text: "Delete and reinstall the project", correct: false, explanation: "Way too drastic! Just fix the simple typo in your command." }
                ]
            },
            {
                title: "Challenge #4: The Tab Trap",
                scenario: "You edited your Makefile but now it won't work at all...",
                terminal: "<span style='color: var(--accent-primary);'>$</span> make server<br><span style='color: var(--accent-danger);'>Makefile:5: *** missing separator. Stop.</span>",
                choices: [
                    { text: "Replace spaces at the start of line 5 with a TAB character", correct: true, explanation: "That's it! Makefiles require TAB characters (not spaces) before commands. Delete the spaces and press TAB." },
                    { text: "Add more spaces to line 5", correct: false, explanation: "More spaces won't help! Makefiles need TAB characters, not spaces, before commands." },
                    { text: "Delete line 5 entirely", correct: false, explanation: "Don't delete it! Just replace the leading spaces with a TAB character." },
                    { text: "Add semicolons to the end of each line", correct: false, explanation: "Semicolons won't fix this. The issue is using spaces instead of TAB before the command." }
                ]
            },
            {
                title: "Challenge #5: Permission Problem",
                scenario: "Make found your script but refuses to run it...",
                terminal: "<span style='color: var(--accent-primary);'>$</span> make run<br><span style='color: var(--accent-danger);'>make: ./start.sh: Permission denied</span>",
                choices: [
                    { text: "Run 'chmod +x start.sh' to add execute permission", correct: true, explanation: "Perfect! The file needs execute permission. chmod +x grants permission to run the script." },
                    { text: "Delete start.sh and create it again", correct: false, explanation: "You don't need to delete it! Just add execute permission with chmod +x." },
                    { text: "Run make with sudo", correct: false, explanation: "Using sudo is risky and unnecessary. Just add execute permission with chmod +x start.sh." },
                    { text: "Change the file extension to .txt", correct: false, explanation: "Changing the extension won't help. The file just needs execute permission." }
                ]
            },
            {
                title: "Challenge #6: Missing Tool",
                scenario: "Your Makefile is calling a program that doesn't exist on your system...",
                terminal: "<span style='color: var(--accent-primary);'>$</span> make server<br><span style='color: var(--accent-danger);'>make: *** [server] Error 127<br>/bin/sh: python3: command not found</span>",
                choices: [
                    { text: "Install python3 using your package manager", correct: true, explanation: "Exactly! The Makefile needs python3 but it's not installed. Use brew (Mac) or apt/winget (Windows/WSL) to install it." },
                    { text: "Remove all Python references from the Makefile", correct: false, explanation: "Don't edit the Makefile! The project needs Python - just install python3 on your system." },
                    { text: "Rename python to python3", correct: false, explanation: "You can't rename what doesn't exist! Install python3 first." },
                    { text: "Change 'server' to 'run' in the command", correct: false, explanation: "Changing the target name won't help. The real issue is that python3 isn't installed." }
                ]
            }
        ];

        // OS switcher
        function switchOS(os) {
            currentOS = os;
            
            // Update button states
            document.querySelectorAll('.os-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector(`[data-os="${os}"]`).classList.add('active');
            
            // Show/hide OS-specific content
            document.querySelectorAll('.os-specific').forEach(el => {
                el.classList.remove('active');
            });
            
            if (os === 'mac') {
                document.querySelectorAll('[id^="mac-"]').forEach(el => {
                    el.classList.add('active');
                });
            } else {
                document.querySelectorAll('[id^="windows-"]').forEach(el => {
                    el.classList.add('active');
                });
            }
        }

        // Tab switcher
        function switchTab(tab) {
            currentTab = tab;
            
            // Update tab buttons
            document.querySelectorAll('.tab').forEach(t => {
                t.classList.remove('active');
            });
            event.target.classList.add('active');
            
            // Show/hide tab content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tab}-tab`).classList.add('active');
        }

        // Game functions
        function loadChallenge(index) {
            if (index >= challenges.length) {
                showCompletion();
                return;
            }

            const challenge = challenges[index];
            document.getElementById('challenge-title').textContent = challenge.title;
            document.getElementById('challenge-scenario').textContent = challenge.scenario;
            document.getElementById('terminal-output').innerHTML = challenge.terminal;
            document.getElementById('level').textContent = index + 1;
            
            // Update progress bar
            const progress = ((index) / challenges.length) * 100;
            document.getElementById('progress').style.width = progress + '%';

            // Clear previous feedback
            document.getElementById('feedback').classList.remove('show', 'correct', 'incorrect');
            document.getElementById('next-btn').classList.remove('show');

            // Render choices
            const choicesContainer = document.getElementById('choices');
            choicesContainer.innerHTML = '';
            
            challenge.choices.forEach((choice, i) => {
                const btn = document.createElement('button');
                btn.className = 'choice-btn';
                btn.innerHTML = `
                    <span class="choice-letter">${String.fromCharCode(65 + i)}</span>
                    <span>${choice.text}</span>
                `;
                btn.onclick = () => checkAnswer(i);
                choicesContainer.appendChild(btn);
            });
        }

        function checkAnswer(choiceIndex) {
            totalAttempts++;
            const challenge = challenges[currentChallenge];
            const choice = challenge.choices[choiceIndex];
            const buttons = document.querySelectorAll('.choice-btn');
            const feedback = document.getElementById('feedback');
            
            // Disable all buttons
            buttons.forEach(btn => btn.style.pointerEvents = 'none');
            
            if (choice.correct) {
                buttons[choiceIndex].classList.add('correct');
                feedback.classList.add('show', 'correct');
                document.getElementById('feedback-title').textContent = '✅ Correct!';
                document.getElementById('feedback-text').textContent = choice.explanation;
                
                // Update score
                correctAnswers++;
                streak++;
                const points = 100 + (streak * 10);
                score += points;
                document.getElementById('score').textContent = score;
                document.getElementById('streak').textContent = streak;
                
                document.getElementById('next-btn').classList.add('show');
            } else {
                buttons[choiceIndex].classList.add('incorrect');
                feedback.classList.add('show', 'incorrect');
                document.getElementById('feedback-title').textContent = '❌ Not quite!';
                document.getElementById('feedback-text').textContent = choice.explanation;
                
                streak = 0;
                document.getElementById('streak').textContent = streak;
                
                // Show correct answer after wrong choice
                setTimeout(() => {
                    challenge.choices.forEach((c, i) => {
                        if (c.correct) {
                            buttons[i].classList.add('correct');
                        }
                    });
                    document.getElementById('next-btn').classList.add('show');
                }, 1500);
            }
        }

        function nextChallenge() {
            currentChallenge++;
            loadChallenge(currentChallenge);
        }

        function showCompletion() {
            document.getElementById('game-content').style.display = 'none';
            const completion = document.getElementById('completion');
            completion.classList.add('show');
            
            document.getElementById('final-score').textContent = score;
            const accuracy = totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0;
            document.getElementById('accuracy').textContent = accuracy + '%';
            
            // Update progress to 100%
            document.getElementById('progress').style.width = '100%';
        }

        function restartGame() {
            currentChallenge = 0;
            score = 0;
            streak = 0;
            totalAttempts = 0;
            correctAnswers = 0;
            
            document.getElementById('score').textContent = '0';
            document.getElementById('streak').textContent = '0';
            document.getElementById('level').textContent = '1';
            
            document.getElementById('game-content').style.display = 'block';
            document.getElementById('completion').classList.remove('show');
            
            loadChallenge(0);
        }

        // Initialize game
        loadChallenge(0);
    </script>
</body>
</html>