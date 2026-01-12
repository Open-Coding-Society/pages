---
layout: opencs
title: "Connect 4 Algorithms"
permalink: /connect4/lesson/algorithms
authors: Nora, Soni, Avika, Yuva, Yash, Nolan
---

<style>
    .flowchart-container {
        margin: 20px 0;
        padding: 20px;
        border: 2px solid #007acc;
        border-radius: 8px;
        background: #f8f9fa;
    }

    body {
        font-family: system-ui, sans-serif;
        max-width: 900px;
        margin: 0 auto;
        padding: 20px;
        line-height: 1.6;
    }

    .cell {
        width: 30px;
        height: 30px;
        border: 1px solid #333;
        display: inline-block;
        text-align: center;
        line-height: 28px;
        margin: 1px;
    }

    .red {
        background: #ff6b6b;
    }

    .yellow {
        background: #ffd93d;
    }

    .highlight {
        background: #90EE90;
    }

    button {
        padding: 8px 16px;
        margin: 5px;
        background: #007acc;
        color: white;
        border: none;
        cursor: pointer;
        border-radius: 4px;
    }

    button:hover {
        background: #005999;
    }

    .interactive-demo {
        margin: 20px 0;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
        background: rgb(0, 0, 0);
    }

    .grid {
        margin: 10px 0;
    }

    .current-player {
        font-weight: bold;
        padding: 3px 8px;
        border-radius: 3px;
    }

    pre {
        background: rgb(0, 0, 0);
        padding: 15px;
        border-radius: 5px;
        overflow-x: auto;
    }
</style>
<h1>What is Connect 4 Algorithm Design?</h1>
<p>Connect 4 algorithm design is about creating the game logic - the rules, win detection, and player management that
    make the game work. This means:</p>
<ul>
    <li>How pieces fall into the lowest available position</li>
    <li>Detecting when a player connects four pieces in a row</li>
    <li>Managing player turns and game state</li>
    <li>Validating moves before they happen</li>
</ul>
<p><strong>The Big Picture:</strong> Algorithms are the step-by-step instructions that make games fair, fun, and
    functional.</p>
<h2>Algorithm Flow Overview</h2>
<p>Before diving into the details, let's see the complete Connect 4 algorithm flow:</p>
<img src="{{site.baseurl}}/images/flowchart.png">
<h2>The Algorithm Stack: Data Structures, Logic, Validation</h2>
<h3>Data Structure: The Game Board</h3>
<p>The board is a 2D array that represents our playing field:</p>
<pre>
// 2D array structure tells us what's in each position
let board = [
    [null, null, null, null, null, null, null], // Row 0 (top)
    [null, null, null, null, null, null, null], // Row 1
    [null, null, null, null, null, null, null], // Row 2
    [null, null, null, null, null, null, null], // Row 3
    [null, null, null, null, null, null, null], // Row 4
    [null, null, 'red', null, null, null, null]  // Row 5 (bottom)
];</pre>
<p><strong>Key Principle:</strong> Arrays create the foundation. Each position can hold null (empty), 'red', or
    'yellow'.</p>
<div id="board-demo" class="grid"></div>
<button onclick="showEmptyBoard()">Show Empty Board</button>
<h3>Algorithm 1: Finding the Drop Position</h3>
<pre>
function getDropRow(board, col) {
    // Start from bottom and work up
    for (let row = 5; row >= 0; row--) {
        if (board[row][col] === null) {
            return row; // Found empty spot
        }
    }
    return -1; // Column is full
}</pre>
<p><strong>Key Principle:</strong> Gravity simulation - pieces always fall to the lowest available position.</p>
<div class="interactive-demo">
    <h4>Try It Yourself</h4>
    <div id="drop-demo" class="grid"></div>
    <p>Click a column to see where the piece would fall:</p>
    <button onclick="testDrop(0)">Col 0</button>
    <button onclick="testDrop(1)">Col 1</button>
    <button onclick="testDrop(2)">Col 2</button>
    <button onclick="testDrop(3)">Col 3</button>
    <button onclick="testDrop(4)">Col 4</button>
    <button onclick="testDrop(5)">Col 5</button>
    <button onclick="testDrop(6)">Col 6</button>
</div>
<h3>Algorithm 2: Win Detection Logic</h3>
<pre>
function checkWin(board, row, col) {
    const color = board[row][col];
    const directions = [
        [1, 0],   // vertical ↓
        [0, 1],   // horizontal →
        [1, 1],   // diagonal ↘
        [1, -1]   // diagonal ↙
    ];
    for (const [deltaRow, deltaCol] of directions) {
        let count = 1; // count current piece
        
        // Check both directions from current piece
        for (const direction of [-1, 1]) {
            let r = row + deltaRow * direction;
            let c = col + deltaCol * direction;
            
            while (r >= 0 && r < 6 && c >= 0 && c < 7 && 
                   board[r][c] === color) {
                count++;
                r += deltaRow * direction;
                c += deltaCol * direction;
            }
        }
        
        if (count >= 4) return true;
    }
    return false;
}</pre>
<p><strong>Key Concepts:</strong> Direction vectors, boundary checking, pattern matching</p>
<h2>Core Algorithm Skills You'll Learn</h2>
<h3>Skill 1: State Management</h3>
<p><strong>Learning Goal:</strong> Keep track of game data and player turns</p>
<div class="interactive-demo">
    <h4>Try It Yourself</h4>
    <div id="game-demo" class="grid"></div>
    <p>Current Player: <span id="current-player" class="current-player">Red</span></p>
    <button onclick="playMove(0)">Col 0</button>
    <button onclick="playMove(1)">Col 1</button>
    <button onclick="playMove(2)">Col 2</button>
    <button onclick="playMove(3)">Col 3</button>
    <button onclick="playMove(4)">Col 4</button>
    <button onclick="playMove(5)">Col 5</button>
    <button onclick="playMove(6)">Col 6</button>
    <br><br>
    <button onclick="resetGame()">Reset Game</button>
</div>
<pre>
// State management connects all pieces together
class GameState {
    constructor() {
        this.board = this.createEmptyBoard();
        this.currentPlayer = 'red';
        this.gameOver = false;
    }
    
    makeMove(col) {
        const row = this.getDropRow(col);
        if (row >= 0) {
            this.board[row][col] = this.currentPlayer;
            
            if (this.checkWin(row, col)) {
                this.gameOver = true;
                return `${this.currentPlayer} wins!`;
            }
            
            this.switchPlayer();
        }
        return null;
    }
}</pre>
<h3>Skill 2: Win Detection in Action</h3>
<p><strong>Learning Goal:</strong> Detect four-in-a-row patterns immediately after each move</p>
<div class="interactive-demo">
    <h4>Try to Win!</h4>
    <div id="win-demo" class="grid"></div>
    <p>Current Player: <span id="win-current-player" class="current-player">Red</span></p>
    <button onclick="playWinMove(0)">Col 0</button>
    <button onclick="playWinMove(1)">Col 1</button>
    <button onclick="playWinMove(2)">Col 2</button>
    <button onclick="playWinMove(3)">Col 3</button>
    <button onclick="playWinMove(4)">Col 4</button>
    <button onclick="playWinMove(5)">Col 5</button>
    <button onclick="playWinMove(6)">Col 6</button>
    <br><br>
    <button onclick="resetWinGame()">Reset</button>
    <div id="win-message"></div>
</div>
<p><strong>Why This Matters:</strong> The game must instantly recognize victory conditions and end appropriately.</p>
<h2>Quick Check</h2>
<p>What's the most important concept you learned about Connect 4 algorithms?</p>
<textarea placeholder="Type your reflection here..." style="width: 100%; height: 80px; padding: 10px;"></textarea>
<br><br>
<button>Save Reflection</button>
<h2>What You Just Learned</h2>
<p><strong>Skill 1:</strong> Using 2D arrays to represent game boards<br>
    <strong>Skill 2:</strong> Implementing gravity with bottom-up searching<br>
    <strong>Skill 3:</strong> Detecting patterns using direction vectors
</p>
<h2>Key Takeaways</h2>
<ul>
    <li><strong>Data Structures Matter:</strong> 2D arrays perfectly model grid-based games</li>
    <li><strong>Algorithm Efficiency:</strong> Check wins only after moves, not constantly</li>
    <li><strong>Edge Cases:</strong> Always validate bounds and handle full columns</li>
    <li><strong>State Management:</strong> Keep track of whose turn it is and game status</li>
    <li><strong>Pattern Recognition:</strong> Use mathematical approaches to detect wins</li>
</ul>
<h2>Related Resources</h2>
<ul>
    <li>MDN: JavaScript Arrays</li>
    <li>Algorithm Design Manual</li>
    <li>Game Programming Patterns</li>
</ul>
<p><em>Duration: ~60 minutes | Audience: CS students learning algorithms | Meta-Goal: Understanding game logic through
        hands-on interaction</em></p>
<script>
    // Game state variables
    let demoBoard = Array.from({ length: 6 }, () => Array(7).fill(null));
    let dropBoard = Array.from({ length: 6 }, () => Array(7).fill(null));
    let gameBoard = Array.from({ length: 6 }, () => Array(7).fill(null));
    let winBoard = Array.from({ length: 6 }, () => Array(7).fill(null));
    let currentGamePlayer = 'red';
    let currentWinPlayer = 'red';
    function createBoard(containerId, board) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 7; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                if (board[row][col]) {
                    cell.classList.add(board[row][col]);
                }
                cell.id = `${containerId}-${row}-${col}`;
                container.appendChild(cell);
            }
            container.appendChild(document.createElement('br'));
        }
    }
    function showEmptyBoard() {
        createBoard('board-demo', demoBoard);
    }
    function getDropRow(board, col) {
        for (let row = 5; row >= 0; row--) {
            if (board[row][col] === null) {
                return row;
            }
        }
        return -1;
    }
    function testDrop(col) {
        // Clear previous highlights
        createBoard('drop-demo', dropBoard);
        const dropRow = getDropRow(dropBoard, col);
        if (dropRow >= 0) {
            const cell = document.getElementById(`drop-demo-${dropRow}-${col}`);
            if (cell) cell.classList.add('highlight');
        }
    }
    function playMove(col) {
        const dropRow = getDropRow(gameBoard, col);
        if (dropRow >= 0) {
            gameBoard[dropRow][col] = currentGamePlayer;
            createBoard('game-demo', gameBoard);
            currentGamePlayer = currentGamePlayer === 'red' ? 'yellow' : 'red';
            const playerElement = document.getElementById('current-player');
            if (playerElement) {
                playerElement.textContent = currentGamePlayer === 'red' ? 'Red' : 'Yellow';
                playerElement.style.color = currentGamePlayer;
            }
        }
    }
    function resetGame() {
        gameBoard = Array.from({ length: 6 }, () => Array(7).fill(null));
        currentGamePlayer = 'red';
        const playerElement = document.getElementById('current-player');
        if (playerElement) {
            playerElement.textContent = 'Red';
            playerElement.style.color = 'red';
        }
        createBoard('game-demo', gameBoard);
    }
    function checkWin(board, row, col) {
        const color = board[row][col];
        const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
        for (const [deltaRow, deltaCol] of directions) {
            let count = 1;
            for (const direction of [-1, 1]) {
                let r = row + deltaRow * direction;
                let c = col + deltaCol * direction;
                while (r >= 0 && r < 6 && c >= 0 && c < 7 && board[r][c] === color) {
                    count++;
                    r += deltaRow * direction;
                    c += deltaCol * direction;
                }
            }
            if (count >= 4) return true;
        }
        return false;
    }
    function playWinMove(col) {
        const dropRow = getDropRow(winBoard, col);
        if (dropRow >= 0) {
            winBoard[dropRow][col] = currentWinPlayer;
            createBoard('win-demo', winBoard);
            if (checkWin(winBoard, dropRow, col)) {
                const messageElement = document.getElementById('win-message');
                if (messageElement) {
                    messageElement.innerHTML =
                        `<h3 style="color: ${currentWinPlayer};">${currentWinPlayer.toUpperCase()} WINS!</h3>`;
                }
            } else {
                currentWinPlayer = currentWinPlayer === 'red' ? 'yellow' : 'red';
                const playerElement = document.getElementById('win-current-player');
                if (playerElement) {
                    playerElement.textContent = currentWinPlayer === 'red' ? 'Red' : 'Yellow';
                    playerElement.style.color = currentWinPlayer;
                }
            }
        }
    }
    function resetWinGame() {
        winBoard = Array.from({ length: 6 }, () => Array(7).fill(null));
        currentWinPlayer = 'red';
        const playerElement = document.getElementById('win-current-player');
        if (playerElement) {
            playerElement.textContent = 'Red';
            playerElement.style.color = 'red';
        }
        const messageElement = document.getElementById('win-message');
        if (messageElement) {
            messageElement.innerHTML = '';
        }
        createBoard('win-demo', winBoard);
    }
    // Initialize boards when page loads
    document.addEventListener('DOMContentLoaded', function () {
        showEmptyBoard();
        createBoard('drop-demo', dropBoard);
        createBoard('game-demo', gameBoard);
        createBoard('win-demo', winBoard);
    });
</script>