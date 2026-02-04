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
    <title>Make Debug Lab</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: #0a0e14;
            color: #e6e6e6;
            line-height: 1.6;
            padding: 2rem;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
        }

        h1 {
            font-size: 2.5rem;
            color: #00ff9f;
            margin-bottom: 0.5rem;
        }

        .subtitle {
            color: #8f93a2;
            margin-bottom: 3rem;
        }

        .os-selector {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
        }

        .os-btn {
            background: #151921;
            border: 1px solid #2d3340;
            padding: 0.75rem 1.5rem;
            color: #8f93a2;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.3s;
        }

        .os-btn.active {
            background: #1f2430;
            border-color: #00ff9f;
            color: #00ff9f;
        }

        .tabs {
            display: flex;
            gap: 2rem;
            border-bottom: 1px solid #2d3340;
            margin-bottom: 2rem;
        }

        .tab {
            background: none;
            border: none;
            padding: 1rem 0;
            color: #8f93a2;
            cursor: pointer;
            font-size: 1rem;
            border-bottom: 2px solid transparent;
            transition: all 0.3s;
        }

        .tab.active {
            color: #00ff9f;
            border-bottom-color: #00ff9f;
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
        }

        .error-grid {
            display: grid;
            gap: 2rem;
        }

        .error-card {
            background: linear-gradient(135deg, #151921 0%, #1a1f2e 100%);
            border: 1px solid #2d3340;
            padding: 1.5rem;
            transition: all 0.3s;
        }

        .error-card:hover {
            border-color: #00ff9f;
            transform: translateX(5px);
        }

        .error-title {
            font-size: 1.2rem;
            color: #00ccff;
            margin-bottom: 1rem;
        }

        .error-msg {
            background: #0a0e14;
            border-left: 3px solid #ff3366;
            padding: 0.75rem;
            margin: 1rem 0;
            color: #ff3366;
            font-size: 0.85rem;
            overflow-x: auto;
        }

        .solution {
            margin-top: 1rem;
        }

        .step {
            background: #1f2430;
            padding: 0.75rem;
            margin: 0.5rem 0;
            border-left: 2px solid #00ccff;
        }

        .code {
            background: #0a0e14;
            padding: 0.5rem;
            margin: 0.5rem 0;
            font-size: 0.85rem;
            color: #39ff14;
            overflow-x: auto;
            font-family: monospace;
        }

        .code::before {
            content: '$ ';
            color: #00ff9f;
        }

        .os-specific {
            display: none;
        }

        .os-specific.active {
            display: block;
        }

        /* Game styles */
        .game-container {
            background: linear-gradient(135deg, #0d1117 0%, #151921 100%);
            border: 2px solid #00ff9f;
            padding: 2rem;
        }

        .game-header {
            text-align: center;
            margin-bottom: 2rem;
        }

        .game-title {
            font-size: 2rem;
            color: #00ff9f;
            margin-bottom: 0.5rem;
        }

        .game-subtitle {
            color: #8f93a2;
            font-size: 0.9rem;
        }

        .game-layout {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 2rem;
            margin-top: 2rem;
        }

        .canvas-area {
            background: #000;
            border: 2px solid #2d3340;
            padding: 2rem;
            border-radius: 8px;
        }

        .canvas-title {
            color: #00ccff;
            margin-bottom: 1rem;
            text-align: center;
        }

        .pixel-grid {
            display: grid;
            grid-template-columns: repeat(16, 1fr);
            gap: 2px;
            max-width: 500px;
            margin: 0 auto;
            background: #1a1f2e;
            padding: 10px;
            border-radius: 4px;
        }

        .pixel {
            aspect-ratio: 1;
            background: #0a0e14;
            border: 1px solid #2d3340;
            cursor: pointer;
            transition: all 0.3s;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.7rem;
            color: #8f93a2;
        }

        .pixel:hover {
            border-color: #00ff9f;
            transform: scale(1.1);
            z-index: 10;
        }

        .pixel.filled {
            cursor: default;
            animation: fillPixel 0.3s ease;
        }

        @keyframes fillPixel {
            0% { transform: scale(0.5); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }

        .pixel.filled:hover {
            transform: scale(1);
        }

        .clue-panel {
            background: #151921;
            border: 1px solid #2d3340;
            padding: 1.5rem;
            border-radius: 8px;
            max-height: 600px;
            overflow-y: auto;
        }

        .clue-panel-title {
            color: #00ccff;
            margin-bottom: 1.5rem;
            font-size: 1.1rem;
        }

        .current-clue {
            background: #1f2430;
            border: 2px solid #00ff9f;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            border-radius: 4px;
        }

        .clue-error {
            background: #0a0e14;
            border-left: 3px solid #ff3366;
            padding: 0.75rem;
            margin: 0.75rem 0;
            color: #ff3366;
            font-size: 0.85rem;
            font-family: monospace;
        }

        .clue-question {
            color: #e6e6e6;
            margin: 1rem 0;
            font-size: 0.95rem;
        }

        .answer-options {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            margin-top: 1rem;
        }

        .answer-btn {
            background: #0a0e14;
            border: 2px solid #2d3340;
            padding: 1rem;
            color: #e6e6e6;
            cursor: pointer;
            text-align: left;
            transition: all 0.3s;
            font-size: 0.9rem;
        }

        .answer-btn:hover {
            border-color: #00ff9f;
            background: #151921;
        }

        .answer-btn.correct {
            border-color: #00ff9f;
            background: rgba(0, 255, 159, 0.1);
        }

        .answer-btn.incorrect {
            border-color: #ff3366;
            background: rgba(255, 51, 102, 0.1);
            animation: shake 0.5s;
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }

        .color-legend {
            background: #1f2430;
            padding: 1rem;
            margin-top: 1rem;
            border-radius: 4px;
        }

        .legend-title {
            color: #8f93a2;
            font-size: 0.85rem;
            margin-bottom: 0.75rem;
            text-transform: uppercase;
        }

        .legend-items {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
        }

        .legend-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.8rem;
        }

        .legend-color {
            width: 20px;
            height: 20px;
            border: 1px solid #2d3340;
        }

        .stats {
            display: flex;
            justify-content: space-around;
            margin-bottom: 2rem;
            padding: 1rem;
            background: rgba(0, 255, 159, 0.05);
            border: 1px solid #2d3340;
        }

        .stat {
            text-align: center;
        }

        .stat-label {
            font-size: 0.8rem;
            color: #8f93a2;
            text-transform: uppercase;
        }

        .stat-value {
            font-size: 2rem;
            color: #00ff9f;
            font-weight: bold;
        }

        .completion {
            text-align: center;
            padding: 3rem;
            background: linear-gradient(135deg, rgba(0, 255, 159, 0.1) 0%, rgba(0, 204, 255, 0.1) 100%);
            border: 2px solid #00ff9f;
            display: none;
            border-radius: 8px;
        }

        .completion.show {
            display: block;
            animation: fadeIn 0.5s;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .completion-title {
            font-size: 2.5rem;
            color: #00ff9f;
            margin-bottom: 1rem;
        }

        .revealed-image {
            max-width: 400px;
            margin: 2rem auto;
            border: 2px solid #00ff9f;
        }

        .restart-btn {
            background: #151921;
            border: 2px solid #00ff9f;
            padding: 1rem 2rem;
            color: #00ff9f;
            cursor: pointer;
            font-size: 1rem;
            margin-top: 1rem;
            transition: all 0.3s;
        }

        .restart-btn:hover {
            background: #1f2430;
            transform: scale(1.05);
        }

        @media (max-width: 1024px) {
            .game-layout {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Make Debug Lab</h1>
        <p class="subtitle">Learn to resolve common make errors</p>

        <div class="os-selector">
            <button class="os-btn active" data-os="mac" onclick="switchOS('mac')">macOS</button>
            <button class="os-btn" data-os="windows" onclick="switchOS('windows')">Windows</button>
        </div>

        <div class="tabs">
            <button class="tab active" onclick="switchTab('learn')">Learn</button>
            <button class="tab" onclick="switchTab('practice')">Practice</button>
        </div>

        <div id="learn-tab" class="tab-content active">
            <div class="error-grid">
                
                <div class="error-card">
                    <h3 class="error-title">Make Not Found</h3>
                    <div class="error-msg os-specific active" id="mac-err1">
                        make: command not found
                    </div>
                    <div class="error-msg os-specific" id="win-err1">
                        'make' is not recognized as an internal or external command
                    </div>
                    
                    <p>Your system does not have make installed.</p>
                    
                    <div class="solution os-specific active" id="mac-sol1">
                        <div class="step">Install Xcode Command Line Tools</div>
                        <div class="code">xcode-select --install</div>
                        <div class="step">Verify installation</div>
                        <div class="code">make --version</div>
                    </div>
                    
                    <div class="solution os-specific" id="win-sol1">
                        <div class="step">Install WSL</div>
                        <div class="code">wsl --install</div>
                        <div class="step">Install make in WSL</div>
                        <div class="code">sudo apt update && sudo apt install make</div>
                    </div>
                </div>

                <div class="error-card">
                    <h3 class="error-title">No Makefile Found</h3>
                    <div class="error-msg">
                        make: *** No targets specified and no makefile found. Stop.
                    </div>
                    
                    <p>Make cannot find the Makefile. You are probably in the wrong directory.</p>
                    
                    <div class="solution">
                        <div class="step">Check current directory</div>
                        <div class="code">pwd</div>
                        <div class="step">List files to confirm Makefile exists</div>
                        <div class="code os-specific active" id="mac-ls">ls -la</div>
                        <div class="code os-specific" id="win-ls">dir</div>
                        <div class="step">Navigate to project directory</div>
                        <div class="code">cd /path/to/project</div>
                    </div>
                </div>

                <div class="error-card">
                    <h3 class="error-title">No Rule to Make Target</h3>
                    <div class="error-msg">
                        make: *** No rule to make target 'sever'. Stop.
                    </div>
                    
                    <p>The target you specified does not exist in the Makefile. Check for typos.</p>
                    
                    <div class="solution">
                        <div class="step">List available targets</div>
                        <div class="code os-specific active" id="mac-grep">grep "^[a-zA-Z]" Makefile</div>
                        <div class="code os-specific" id="win-grep">findstr /B /R "^[a-zA-Z]" Makefile</div>
                        <div class="step">Fix the typo in your command</div>
                        <div class="code">make server</div>
                    </div>
                </div>

                <div class="error-card">
                    <h3 class="error-title">Missing Separator</h3>
                    <div class="error-msg">
                        Makefile:5: *** missing separator. Stop.
                    </div>
                    
                    <p>Commands in Makefiles must be indented with TAB characters, not spaces.</p>
                    
                    <div class="solution">
                        <div class="step">Open Makefile and go to line 5</div>
                        <div class="step">Delete any spaces at the beginning of command lines</div>
                        <div class="step">Press TAB key once before each command</div>
                    </div>
                </div>

                <div class="error-card">
                    <h3 class="error-title">Permission Denied</h3>
                    <div class="error-msg">
                        make: ./script.sh: Permission denied
                    </div>
                    
                    <p>The script does not have execute permissions.</p>
                    
                    <div class="solution">
                        <div class="step">Add execute permission</div>
                        <div class="code">chmod +x script.sh</div>
                        <div class="step">Run make again</div>
                    </div>
                </div>

                <div class="error-card">
                    <h3 class="error-title">Command Not Found in Makefile</h3>
                    <div class="error-msg">
                        make: *** [server] Error 127<br>
                        /bin/sh: python3: command not found
                    </div>
                    
                    <p>The Makefile is trying to run a command that is not installed on your system.</p>
                    
                    <div class="solution">
                        <div class="step">Check if command exists</div>
                        <div class="code os-specific active" id="mac-which">which python3</div>
                        <div class="code os-specific" id="win-which">where python3</div>
                        <div class="step">Install the missing tool</div>
                        <div class="code os-specific active" id="mac-install">brew install python3</div>
                        <div class="code os-specific" id="win-install">winget install Python.Python.3</div>
                    </div>
                </div>

            </div>
        </div>

        <div id="practice-tab" class="tab-content">
            <div class="game-container">
                <div class="game-header">
                    <h2 class="game-title">Debug Art Challenge</h2>
                    <p class="game-subtitle">Answer error clues correctly to reveal the hidden pixel art</p>
                </div>

                <div class="stats">
                    <div class="stat">
                        <div class="stat-label">Progress</div>
                        <div class="stat-value" id="progress">0/48</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Correct</div>
                        <div class="stat-value" id="correct">0</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Errors</div>
                        <div class="stat-value" id="errors">0</div>
                    </div>
                </div>

                <div class="game-layout">
                    <div class="canvas-area">
                        <h3 class="canvas-title">Your Pixel Art</h3>
                        <div class="pixel-grid" id="pixelGrid">
                        </div>
                    </div>

                    <div class="clue-panel">
                        <h3 class="clue-panel-title">Current Clue</h3>
                        
                        <div class="current-clue" id="currentClue">
                            <div class="clue-error" id="clueError">Click a numbered pixel to start!</div>
                            <div class="clue-question" id="clueQuestion">Select any pixel with a number.</div>
                            <div class="answer-options" id="answerOptions">
                            </div>
                        </div>

                        <div class="color-legend">
                            <div class="legend-title">Color Code</div>
                            <div class="legend-items">
                                <div class="legend-item">
                                    <div class="legend-color" style="background: #ff6b6b;"></div>
                                    <span>1 - Make Not Found</span>
                                </div>
                                <div class="legend-item">
                                    <div class="legend-color" style="background: #4ecdc4;"></div>
                                    <span>2 - No Makefile</span>
                                </div>
                                <div class="legend-item">
                                    <div class="legend-color" style="background: #ffe66d;"></div>
                                    <span>3 - No Rule/Typo</span>
                                </div>
                                <div class="legend-item">
                                    <div class="legend-color" style="background: #a8e6cf;"></div>
                                    <span>4 - Missing Tab</span>
                                </div>
                                <div class="legend-item">
                                    <div class="legend-color" style="background: #ff8b94;"></div>
                                    <span>5 - Permission</span>
                                </div>
                                <div class="legend-item">
                                    <div class="legend-color" style="background: #c7ceea;"></div>
                                    <span>6 - Missing Tool</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="completion" id="completion">
                    <h2 class="completion-title">Masterpiece Complete!</h2>
                    <p class="subtitle">You have mastered make debugging</p>
                    <div class="revealed-image">
                        <div class="pixel-grid" id="finalImage" style="max-width: 100%;"></div>
                    </div>
                    <div class="stats" style="margin-top: 2rem;">
                        <div class="stat">
                            <div class="stat-label">Accuracy</div>
                            <div class="stat-value" id="accuracy">0%</div>
                        </div>
                    </div>
                    <button class="restart-btn" onclick="restartGame()">Create New Art</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        let currentOS = 'mac';
        let correctCount = 0;
        let errorCount = 0;
        let filledPixels = 0;
        let currentPixel = null;

        const colors = {
            1: '#ff6b6b',
            2: '#4ecdc4',
            3: '#ffe66d',
            4: '#a8e6cf',
            5: '#ff8b94',
            6: '#c7ceea'
        };

        const pattern = [
            [0,0,0,0,6,6,6,6,6,6,6,6,0,0,0,0],
            [0,0,0,6,1,1,1,1,1,1,1,1,6,0,0,0],
            [0,0,6,2,2,2,2,2,2,2,2,2,2,6,0,0],
            [0,6,3,3,3,3,3,3,3,3,3,3,3,3,6,0],
            [0,6,4,4,0,0,4,4,4,4,0,0,4,4,6,0],
            [6,5,5,5,0,0,5,5,5,5,0,0,5,5,5,6],
            [6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6],
            [6,2,2,1,2,2,2,2,2,2,2,2,1,2,2,6],
            [6,3,3,3,3,3,3,3,3,3,3,3,3,3,3,6],
            [6,4,4,4,4,4,4,4,4,4,4,4,4,4,4,6],
            [6,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6],
            [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
            [0,0,6,1,1,1,6,6,6,6,2,2,2,6,0,0],
            [0,0,0,6,6,6,0,0,0,0,6,6,6,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ];

        const clues = [
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
                    { text: "Fix the typo - use 'server' instead of 'sever'", correct: true },
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
            }
        ];

        function switchOS(os) {
            currentOS = os;
            
            document.querySelectorAll('.os-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector('[data-os="' + os + '"]').classList.add('active');
            
            document.querySelectorAll('.os-specific').forEach(el => {
                el.classList.remove('active');
            });
            
            const prefix = os === 'mac' ? 'mac-' : 'win-';
            document.querySelectorAll('[id^="' + prefix + '"]').forEach(el => {
                el.classList.add('active');
            });
        }

        function switchTab(tab) {
            document.querySelectorAll('.tab').forEach(t => {
                t.classList.remove('active');
            });
            event.target.classList.add('active');
            
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tab + '-tab').classList.add('active');

            if (tab === 'practice') {
                initGame();
            }
        }

        function initGame() {
            correctCount = 0;
            errorCount = 0;
            filledPixels = 0;
            currentPixel = null;
            
            updateStats();
            
            const grid = document.getElementById('pixelGrid');
            grid.innerHTML = '';
            
            for (let row = 0; row < 16; row++) {
                for (let col = 0; col < 16; col++) {
                    const pixel = document.createElement('div');
                    pixel.className = 'pixel';
                    pixel.dataset.row = row;
                    pixel.dataset.col = col;
                    pixel.dataset.color = pattern[row][col];
                    
                    if (pattern[row][col] !== 0) {
                        pixel.textContent = pattern[row][col];
                        pixel.onclick = function() { selectPixel(row, col); };
                    } else {
                        pixel.style.background = '#000';
                        pixel.classList.add('filled');
                    }
                    
                    grid.appendChild(pixel);
                }
            }
            
            document.getElementById('completion').classList.remove('show');
        }

        function selectPixel(row, col) {
            const pixel = document.querySelector('[data-row="' + row + '"][data-col="' + col + '"]');
            if (pixel.classList.contains('filled')) return;
            
            currentPixel = { row: row, col: col, color: pattern[row][col] };
            
            document.querySelectorAll('.pixel').forEach(p => {
                p.style.boxShadow = '';
            });
            pixel.style.boxShadow = '0 0 15px #00ff9f';
            
            const clueType = pattern[row][col];
            loadClue(clueType);
        }

        function loadClue(type) {
            const clue = clues.find(c => c.type === type);
            if (!clue) return;
            
            document.getElementById('clueError').textContent = clue.error;
            document.getElementById('clueQuestion').textContent = clue.question;
            
            const optionsContainer = document.getElementById('answerOptions');
            optionsContainer.innerHTML = '';
            
            const shuffled = clue.answers.slice().sort(() => Math.random() - 0.5);
            
            shuffled.forEach(function(answer) {
                const btn = document.createElement('button');
                btn.className = 'answer-btn';
                btn.textContent = answer.text;
                btn.onclick = function() { checkAnswer(answer.correct, type); };
                optionsContainer.appendChild(btn);
            });
        }

        function checkAnswer(correct, colorType) {
            const buttons = document.querySelectorAll('.answer-btn');
            buttons.forEach(btn => btn.disabled = true);
            
            if (correct && currentPixel) {
                correctCount++;
                
                const pixel = document.querySelector('[data-row="' + currentPixel.row + '"][data-col="' + currentPixel.col + '"]');
                pixel.style.background = colors[colorType];
                pixel.classList.add('filled');
                pixel.textContent = '';
                pixel.style.boxShadow = '';
                
                filledPixels++;
                
                Array.from(buttons).forEach(function(btn) {
                    if (btn.textContent.includes('Install') || btn.textContent.includes('Navigate') || btn.textContent.includes('Fix') || btn.textContent.includes('Replace') || btn.textContent.includes('chmod')) {
                        btn.classList.add('correct');
                    }
                });
                
                setTimeout(function() {
                    currentPixel = null;
                    document.getElementById('clueError').textContent = 'Click a numbered pixel to start!';
                    document.getElementById('clueQuestion').textContent = 'Select any pixel with a number.';
                    document.getElementById('answerOptions').innerHTML = '';
                    
                    checkCompletion();
                }, 1000);
                
            } else {
                errorCount++;
                event.target.classList.add('incorrect');
                
                setTimeout(function() {
                    buttons.forEach(function(btn) {
                        btn.disabled = false;
                        btn.classList.remove('incorrect');
                    });
                }, 500);
            }
            
            updateStats();
        }

        function updateStats() {
            const totalPixels = pattern.flat().filter(p => p !== 0).length;
            document.getElementById('progress').textContent = filledPixels + '/' + totalPixels;
            document.getElementById('correct').textContent = correctCount;
            document.getElementById('errors').textContent = errorCount;
        }

        function checkCompletion() {
            const totalPixels = pattern.flat().filter(p => p !== 0).length;
            if (filledPixels >= totalPixels) {
                setTimeout(function() {
                    showCompletion();
                }, 500);
            }
        }

        function showCompletion() {
            const accuracy = Math.round((correctCount / (correctCount + errorCount)) * 100);
            document.getElementById('accuracy').textContent = accuracy + '%';
            
            const finalGrid = document.getElementById('finalImage');
            finalGrid.innerHTML = '';
            
            for (let row = 0; row < 16; row++) {
                for (let col = 0; col < 16; col++) {
                    const pixel = document.createElement('div');
                    pixel.className = 'pixel filled';
                    
                    const colorType = pattern[row][col];
                    if (colorType !== 0) {
                        pixel.style.background = colors[colorType];
                    } else {
                        pixel.style.background = '#000';
                    }
                    
                    finalGrid.appendChild(pixel);
                }
            }
            
            document.getElementById('completion').classList.add('show');
        }

        function restartGame() {
            document.getElementById('completion').classList.remove('show');
            initGame();
        }

        initGame();
    </script>
</body>
</html>