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
    <title>Merge Conflict Mastery</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #000;
            color: #fff;
            overflow-x: hidden;
        }

        .header-section {
            max-width: 800px;
            margin: 0 auto;
            padding: 60px 20px 40px;
        }

        .header-section h1 {
            font-size: 2.5em;
            margin-bottom: 15px;
            color: #ffffff;
            text-align: center;
        }

        .header-section .subtitle {
            color: #999;
            margin-bottom: 40px;
            font-size: 1.1em;
            text-align: center;
        }

        .lesson-content {
            margin-bottom: 40px;
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 12px;
            padding: 40px;
        }

        .lesson-content h2 {
            font-size: 1.8em;
            margin-bottom: 25px;
            color: #fcfcfc;
        }

        .lesson-content ul {
            list-style: none;
            margin-top: 20px;
        }

        .lesson-content li {
            padding: 15px 0;
            border-bottom: 1px solid #333;
            font-size: 1.1em;
            line-height: 1.6;
        }

        .lesson-content li:last-child {
            border-bottom: none;
        }

        .start-button-container {
            text-align: center;
            margin-top: 40px;
        }

        .start-button-container button {
            background: #ffffff;
            color: #000;
            border: none;
            padding: 15px 40px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1.1em;
            font-weight: 600;
            transition: all 0.2s;
        }

        .start-button-container button:hover {
            background: #ffffff;
            transform: translateY(-2px);
        }

        .card-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
        }

        .card {
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 12px;
            max-width: 800px;
            width: 100%;
            padding: 50px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
            animation: slideIn 0.4s ease-out;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .card-number {
            color: #666;
            font-size: 0.9em;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        h2 {
            font-size: 1.8em;
            margin-bottom: 25px;
            color: #ffffff;
        }

        .scenario {
            background: #252525;
            padding: 20px;
            border-left: 3px solid #ffffff;
            margin-bottom: 30px;
            border-radius: 4px;
            font-size: 1em;
            line-height: 1.6;
        }

        .code-block {
            background: #0d0d0d;
            padding: 25px;
            border-radius: 8px;
            font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 25px;
            overflow-x: auto;
            white-space: pre;
            border: 1px solid #222;
        }

        .conflict-marker {
            color: #ff6b6b;
            font-weight: bold;
        }

        .current-change {
            color: #51cf66;
        }

        .incoming-change {
            color: #339af0;
        }

        textarea {
            width: 100%;
            min-height: 200px;
            padding: 20px;
            font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
            font-size: 14px;
            background: #0d0d0d;
            color: #fff;
            border: 1px solid #333;
            border-radius: 8px;
            resize: vertical;
            margin-bottom: 20px;
        }

        textarea:focus {
            outline: none;
            border-color: #00ff88;
        }

        .button-group {
            display: flex;
            gap: 15px;
            margin-top: 30px;
        }

        button {
            background: #ffffff;
            color: #000;
            border: none;
            padding: 15px 30px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1em;
            font-weight: 600;
            transition: all 0.2s;
            flex: 1;
        }

        button:hover {
            background: #00dd77;
            transform: translateY(-2px);
        }

        button.secondary {
            background: #333;
            color: #fff;
        }

        button.secondary:hover {
            background: #444;
        }

        .feedback {
            margin-top: 25px;
            padding: 20px;
            border-radius: 8px;
            font-size: 1em;
            display: none;
            animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .feedback.success {
            background: rgba(0, 255, 136, 0.1);
            border: 1px solid #00ff88;
            color: #00ff88;
            display: block;
        }

        .feedback.error {
            background: rgba(255, 107, 107, 0.1);
            border: 1px solid #ff6b6b;
            color: #ff6b6b;
            display: block;
        }

        .feedback.hint {
            background: rgba(51, 154, 240, 0.1);
            border: 1px solid #339af0;
            color: #339af0;
            display: block;
        }

        .nav-buttons {
            display: flex;
            justify-content: space-between;
            margin-top: 40px;
            padding-top: 30px;
            border-top: 1px solid #333;
        }

        .nav-buttons button {
            flex: 0 0 auto;
            min-width: 120px;
        }

        .progress-dots {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 30px;
        }

        .dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #333;
            transition: all 0.3s;
        }

        .dot.active {
            background: #00ff88;
            transform: scale(1.3);
        }

        .dot.completed {
            background: #00ff88;
        }

        /* Game Styles */
        .game-container {
            text-align: center;
        }

        .game-board {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin: 30px 0;
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
        }

        .game-tile {
            aspect-ratio: 1;
            background: #0d0d0d;
            border: 2px solid #333;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2em;
            font-weight: bold;
            transition: all 0.2s;
            font-family: 'Monaco', monospace;
        }

        .game-tile:hover:not(.revealed) {
            background: #1a1a1a;
            border-color: #00ff88;
            transform: scale(1.05);
        }

        .game-tile.revealed {
            cursor: default;
        }

        .game-tile.conflict {
            color: #ff6b6b;
        }

        .game-tile.resolved {
            color: #00ff88;
        }

        .game-tile.matched {
            background: rgba(0, 255, 136, 0.1);
            border-color: #00ff88;
            animation: pulse 0.5s;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }

        .game-stats {
            display: flex;
            justify-content: space-around;
            margin-top: 30px;
            padding: 20px;
            background: #0d0d0d;
            border-radius: 8px;
        }

        .stat {
            text-align: center;
        }

        .stat-value {
            font-size: 2em;
            color: #00ff88;
            font-weight: bold;
        }

        .stat-label {
            color: #999;
            font-size: 0.9em;
            margin-top: 5px;
        }

        .hidden {
            display: none;
        }
    </style>
</head>
<body>
    <!-- Header Section with Instructions -->
    <div class="header-section">
        <h1>🔀 Merge Conflict Mastery</h1>
        <p class="subtitle">Learn to resolve merge conflicts like a pro</p>
        
        <div class="lesson-content">
            <h2>What is a Merge Conflict?</h2>
            <ul>
                <li>When two branches modify the same lines of code, Git can't automatically decide which changes to keep</li>
                <li>Conflicts must be resolved manually by choosing which changes to keep, combining them, or writing something new</li>
                <li>Leaving conflicts unresolved blocks your work - you can't commit or merge until they're fixed</li>
                <li>Resolving conflicts correctly prevents bugs and ensures everyone's work integrates smoothly</li>
            </ul>
        </div>

        <div class="start-button-container">
            <button onclick="scrollToModules()">Start Practice Modules ↓</button>
        </div>
    </div>

    <!-- Card 0: Module 1 -->
    <div class="card-container" id="card-0">
        <div class="card">
            <div class="card-number">Module 1 of 3</div>
            <h2>Simple Text Conflict</h2>
            
            <div class="scenario">
                <strong>Scenario:</strong> Two developers updated the welcome message differently. Resolve the conflict by keeping the most appropriate version or combining them.
            </div>

            <div class="code-block" id="module1-display"></div>
            
            <textarea id="module1-editor" placeholder="Edit the code here to resolve the conflict..."></textarea>
            
            <div class="button-group">
                <button onclick="checkModule1()">Check Solution</button>
                <button class="secondary" onclick="showHint1()">Hint</button>
            </div>
            
            <div id="module1-feedback" class="feedback"></div>

            <div class="nav-buttons">
                <button onclick="scrollToTop()">← Back to Lesson</button>
                <button onclick="nextCard()">Next →</button>
            </div>

            <div class="progress-dots">
                <div class="dot active"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        </div>
    </div>

    <!-- Card 1: Module 2 -->
    <div class="card-container hidden" id="card-1">
        <div class="card">
            <div class="card-number">Module 2 of 3</div>
            <h2>Function Definition Conflict</h2>
            
            <div class="scenario">
                <strong>Scenario:</strong> Two developers added different parameters to a function. Merge both changes to include all parameters.
            </div>

            <div class="code-block" id="module2-display"></div>
            
            <textarea id="module2-editor" placeholder="Edit the code here to resolve the conflict..."></textarea>
            
            <div class="button-group">
                <button onclick="checkModule2()">Check Solution</button>
                <button class="secondary" onclick="showHint2()">Hint</button>
            </div>
            
            <div id="module2-feedback" class="feedback"></div>

            <div class="nav-buttons">
                <button onclick="previousCard()">← Previous</button>
                <button onclick="nextCard()">Next →</button>
            </div>

            <div class="progress-dots">
                <div class="dot completed"></div>
                <div class="dot active"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        </div>
    </div>

    <!-- Card 2: Module 3 -->
    <div class="card-container hidden" id="card-2">
        <div class="card">
            <div class="card-number">Module 3 of 3</div>
            <h2>Complex Multi-line Conflict</h2>
            
            <div class="scenario">
                <strong>Scenario:</strong> Two developers modified a configuration file. One added new settings while another reorganized existing ones. Combine both changes thoughtfully.
            </div>

            <div class="code-block" id="module3-display"></div>
            
            <textarea id="module3-editor" placeholder="Edit the code here to resolve the conflict..."></textarea>
            
            <div class="button-group">
                <button onclick="checkModule3()">Check Solution</button>
                <button class="secondary" onclick="showHint3()">Hint</button>
            </div>
            
            <div id="module3-feedback" class="feedback"></div>

            <div class="nav-buttons">
                <button onclick="previousCard()">← Previous</button>
                <button onclick="nextCard()">Next →</button>
            </div>

            <div class="progress-dots">
                <div class="dot completed"></div>
                <div class="dot completed"></div>
                <div class="dot active"></div>
                <div class="dot"></div>
            </div>
        </div>
    </div>

    <!-- Card 3: Game -->
    <div class="card-container hidden" id="card-3">
        <div class="card">
            <div class="card-number">Bonus Round!</div>
            <div class="game-container">
                <h2>🎮 Merge Conflict Memory Game</h2>
                <p class="subtitle">Match the conflict markers with their meanings!</p>

                <div class="game-board" id="game-board"></div>

                <div class="game-stats">
                    <div class="stat">
                        <div class="stat-value" id="moves">0</div>
                        <div class="stat-label">Moves</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value" id="matches">0</div>
                        <div class="stat-label">Matches</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value" id="timer">0:00</div>
                        <div class="stat-label">Time</div>
                    </div>
                </div>

                <div id="game-feedback" class="feedback"></div>

                <div class="button-group">
                    <button onclick="resetGame()">Play Again</button>
                </div>
            </div>

            <div class="nav-buttons">
                <button onclick="previousCard()">← Previous</button>
                <button onclick="restartTutorial()">Restart Tutorial</button>
            </div>

            <div class="progress-dots">
                <div class="dot completed"></div>
                <div class="dot completed"></div>
                <div class="dot completed"></div>
                <div class="dot active"></div>
            </div>
        </div>
    </div>

    <script>
        let currentCard = 0;
        let completedModules = new Set();

        // Module data
        const module1Original = `# Welcome to Our Project

<<<<<<< HEAD
Welcome! This project helps you learn Git.
=======
Hello! This amazing project teaches Git fundamentals.
>>>>>>> feature-branch

Let's get started!`;

        const module2Original = `function calculateTotal(items) {
<<<<<<< HEAD
function calculateTotal(items, taxRate) {
    return items.reduce((sum, item) => sum + item.price, 0) * (1 + taxRate);
=======
function calculateTotal(items, discount) {
    return items.reduce((sum, item) => sum + item.price, 0) * (1 - discount);
>>>>>>> feature-branch
}`;

        const module3Original = `{
  "name": "my-app",
<<<<<<< HEAD
  "version": "2.0.0",
  "description": "An awesome application",
  "main": "index.js",
=======
  "version": "1.5.0",
  "main": "app.js",
  "description": "A cool app",
  "author": "Dev Team",
>>>>>>> feature-branch
  "license": "MIT"
}`;

        // Navigation
        function scrollToModules() {
            document.getElementById('card-0').scrollIntoView({ behavior: 'smooth' });
        }

        function scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function nextCard() {
            document.getElementById(`card-${currentCard}`).classList.add('hidden');
            currentCard++;
            document.getElementById(`card-${currentCard}`).classList.remove('hidden');
            window.scrollTo(0, 0);
            
            if (currentCard === 3) {
                initGame();
            }
        }

        function previousCard() {
            document.getElementById(`card-${currentCard}`).classList.add('hidden');
            currentCard--;
            document.getElementById(`card-${currentCard}`).classList.remove('hidden');
            window.scrollTo(0, 0);
        }

        function restartTutorial() {
            document.getElementById(`card-${currentCard}`).classList.add('hidden');
            currentCard = 0;
            completedModules.clear();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            initModules();
        }

        // Syntax highlighting
        function highlightConflicts(code) {
            return code
                .replace(/<<<<<<< HEAD/g, '<span class="conflict-marker"><<<<<<< HEAD</span>')
                .replace(/=======/g, '<span class="conflict-marker">=======</span>')
                .replace(/>>>>>>> feature-branch/g, '<span class="conflict-marker">>>>>>>> feature-branch</span>')
                .split('\n')
                .map(line => {
                    if (line.includes('<<<<<<< HEAD')) return line;
                    if (line.includes('=======')) return line;
                    if (line.includes('>>>>>>> feature-branch')) return line;
                    
                    const inCurrentBlock = code.split('<<<<<<< HEAD')[1]?.split('=======')[0];
                    const inIncomingBlock = code.split('=======')[1]?.split('>>>>>>>')[0];
                    
                    if (inCurrentBlock && inCurrentBlock.includes(line.replace(/<[^>]*>/g, ''))) {
                        return `<span class="current-change">${line}</span>`;
                    }
                    if (inIncomingBlock && inIncomingBlock.includes(line.replace(/<[^>]*>/g, ''))) {
                        return `<span class="incoming-change">${line}</span>`;
                    }
                    return line;
                })
                .join('\n');
        }

        function initModules() {
            document.getElementById('module1-display').innerHTML = highlightConflicts(module1Original);
            document.getElementById('module1-editor').value = module1Original;
            
            document.getElementById('module2-display').innerHTML = highlightConflicts(module2Original);
            document.getElementById('module2-editor').value = module2Original;
            
            document.getElementById('module3-display').innerHTML = highlightConflicts(module3Original);
            document.getElementById('module3-editor').value = module3Original;
        }

        // Module 1
        function checkModule1() {
            const userSolution = document.getElementById('module1-editor').value.trim();
            const feedback = document.getElementById('module1-feedback');
            
            const hasConflictMarkers = userSolution.includes('<<<<<<<') || 
                                      userSolution.includes('=======') || 
                                      userSolution.includes('>>>>>>>');
            
            if (hasConflictMarkers) {
                feedback.className = 'feedback error';
                feedback.textContent = '❌ Remove all conflict markers (<<<<<<<, =======, >>>>>>>) from your code!';
                return;
            }
            
            const hasWelcome = userSolution.toLowerCase().includes('welcome');
            const hasContent = userSolution.split('\n').filter(line => line.trim()).length >= 3;
            
            if (hasWelcome && hasContent) {
                feedback.className = 'feedback success';
                feedback.textContent = '✅ Perfect! You resolved the conflict successfully.';
                completedModules.add(1);
            } else {
                feedback.className = 'feedback error';
                feedback.textContent = '❌ Keep the important content and remove all conflict markers.';
            }
        }

        function showHint1() {
            const feedback = document.getElementById('module1-feedback');
            feedback.className = 'feedback hint';
            feedback.textContent = '💡 Combine the best parts of both messages and remove the conflict markers (<<<<<<<, =======, >>>>>>>).';
        }

        // Module 2
        function checkModule2() {
            const userSolution = document.getElementById('module2-editor').value.trim();
            const feedback = document.getElementById('module2-feedback');
            
            const hasConflictMarkers = userSolution.includes('<<<<<<<') || 
                                      userSolution.includes('=======') || 
                                      userSolution.includes('>>>>>>>');
            
            if (hasConflictMarkers) {
                feedback.className = 'feedback error';
                feedback.textContent = '❌ Remove all conflict markers from your code!';
                return;
            }
            
            const hasTaxRate = userSolution.includes('taxRate');
            const hasDiscount = userSolution.includes('discount');
            const hasThreeParams = /calculateTotal\s*\(\s*items\s*,\s*\w+\s*,\s*\w+\s*\)/.test(userSolution);
            
            if (hasTaxRate && hasDiscount && hasThreeParams) {
                feedback.className = 'feedback success';
                feedback.textContent = '✅ Excellent! You merged both parameters.';
                completedModules.add(2);
            } else {
                feedback.className = 'feedback error';
                feedback.textContent = '❌ Include all three parameters: items, taxRate, and discount.';
            }
        }

        function showHint2() {
            const feedback = document.getElementById('module2-feedback');
            feedback.className = 'feedback hint';
            feedback.textContent = '💡 Both developers added useful parameters. Your function should have items, taxRate, AND discount.';
        }

        // Module 3
        function checkModule3() {
            const userSolution = document.getElementById('module3-editor').value.trim();
            const feedback = document.getElementById('module3-feedback');
            
            const hasConflictMarkers = userSolution.includes('<<<<<<<') || 
                                      userSolution.includes('=======') || 
                                      userSolution.includes('>>>>>>>');
            
            if (hasConflictMarkers) {
                feedback.className = 'feedback error';
                feedback.textContent = '❌ Remove all conflict markers from your code!';
                return;
            }
            
            const hasVersion2 = userSolution.includes('"version": "2.0.0"');
            const hasIndexJs = userSolution.includes('"main": "index.js"');
            const hasAuthor = userSolution.includes('"author"');
            
            let isValidJson = false;
            try {
                JSON.parse(userSolution);
                isValidJson = true;
            } catch {}
            
            if (hasVersion2 && hasIndexJs && hasAuthor && isValidJson) {
                feedback.className = 'feedback success';
                feedback.textContent = '✅ Outstanding! You created valid JSON with the best of both versions.';
                completedModules.add(3);
            } else if (!isValidJson) {
                feedback.className = 'feedback error';
                feedback.textContent = '❌ Your JSON syntax is invalid. Check commas and brackets.';
            } else {
                feedback.className = 'feedback error';
                feedback.textContent = '❌ Keep version 2.0.0, index.js as main, and include the author field.';
            }
        }

        function showHint3() {
            const feedback = document.getElementById('module3-feedback');
            feedback.className = 'feedback hint';
            feedback.textContent = '💡 Keep the higher version (2.0.0), use index.js for main, and add the author field.';
        }

        // Memory Game
        const gameCards = [
            { id: 1, content: '<<<<<<<', type: 'marker' },
            { id: 2, content: 'Current Branch', type: 'meaning' },
            { id: 3, content: '=======', type: 'marker' },
            { id: 4, content: 'Separator', type: 'meaning' },
            { id: 5, content: '>>>>>>>', type: 'marker' },
            { id: 6, content: 'Incoming Branch', type: 'meaning' },
            { id: 7, content: 'HEAD', type: 'term' },
            { id: 8, content: 'Your Changes', type: 'meaning' },
            { id: 9, content: '?', type: 'filler' }
        ];

        let flippedCards = [];
        let matchedPairs = 0;
        let moves = 0;
        let gameStartTime;
        let timerInterval;
        let gameBoard;

        function initGame() {
            const board = document.getElementById('game-board');
            board.innerHTML = '';
            matchedPairs = 0;
            moves = 0;
            flippedCards = [];
            
            document.getElementById('moves').textContent = '0';
            document.getElementById('matches').textContent = '0';
            document.getElementById('timer').textContent = '0:00';
            document.getElementById('game-feedback').className = 'feedback';
            
            const shuffled = [...gameCards].sort(() => Math.random() - 0.5);
            gameBoard = shuffled;
            
            shuffled.forEach((card, index) => {
                const tile = document.createElement('div');
                tile.className = 'game-tile';
                tile.dataset.index = index;
                tile.textContent = '?';
                tile.onclick = () => flipCard(index);
                board.appendChild(tile);
            });
            
            if (timerInterval) clearInterval(timerInterval);
            gameStartTime = Date.now();
            timerInterval = setInterval(updateTimer, 1000);
        }

        function updateTimer() {
            const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            document.getElementById('timer').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }

        function flipCard(index) {
            const tile = document.querySelector(`[data-index="${index}"]`);
            const card = gameBoard[index];
            
            if (tile.classList.contains('revealed') || 
                flippedCards.length >= 2 || 
                card.type === 'filler') {
                return;
            }
            
            tile.textContent = card.content;
            tile.classList.add('revealed');
            tile.classList.add(card.type === 'marker' ? 'conflict' : 'resolved');
            flippedCards.push(index);
            
            if (flippedCards.length === 2) {
                moves++;
                document.getElementById('moves').textContent = moves;
                setTimeout(checkMatch, 800);
            }
        }

        function checkMatch() {
            const [index1, index2] = flippedCards;
            const card1 = gameBoard[index1];
            const card2 = gameBoard[index2];
            const tile1 = document.querySelector(`[data-index="${index1}"]`);
            const tile2 = document.querySelector(`[data-index="${index2}"]`);
            
            const isMatch = 
                (card1.content === '<<<<<<<' && card2.content === 'Current Branch') ||
                (card2.content === '<<<<<<<' && card1.content === 'Current Branch') ||
                (card1.content === '=======' && card2.content === 'Separator') ||
                (card2.content === '=======' && card1.content === 'Separator') ||
                (card1.content === '>>>>>>>' && card2.content === 'Incoming Branch') ||
                (card2.content === '>>>>>>>' && card1.content === 'Incoming Branch') ||
                (card1.content === 'HEAD' && card2.content === 'Your Changes') ||
                (card2.content === 'HEAD' && card1.content === 'Your Changes');
            
            if (isMatch) {
                tile1.classList.add('matched');
                tile2.classList.add('matched');
                matchedPairs++;
                document.getElementById('matches').textContent = matchedPairs;
                
                if (matchedPairs === 4) {
                    clearInterval(timerInterval);
                    setTimeout(() => {
                        const feedback = document.getElementById('game-feedback');
                        feedback.className = 'feedback success';
                        feedback.textContent = `🎉 You won in ${moves} moves! You're a merge conflict master!`;
                    }, 500);
                }
            } else {
                tile1.textContent = '?';
                tile2.textContent = '?';
                tile1.classList.remove('revealed', 'conflict', 'resolved');
                tile2.classList.remove('revealed', 'conflict', 'resolved');
            }
            
            flippedCards = [];
        }

        function resetGame() {
            initGame();
        }

        // Initialize on load
        window.onload = function() {
            initModules();
        };
    </script>
</body>
</html>

