/**
 * Class representing a game board.
 * @class
 * @classdesc This is used to track the state of a Tic Tac Toe game.
 */
class GameBoard {
    /**
     * @param {import('/assets/js/GameEnginev1.1/essentials/GameEnv.js').default} gameEnv - Active game environment.
     */
    constructor(gameEnv) {
        this.gameEnv = gameEnv;
        this.board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
        this.players = ['X', 'O'];
        this.currentPlayerIndex = 0;
    }

    /**
     * Resets board state to an empty 3x3 grid and starts with player X (index 0).
     * @returns {void}
     */
    reset() {
        this.board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
        this.currentPlayerIndex = 0;
    }

    /**
     * Makes a move on the board for a given player.
     * @param {number} row 
     * @param {number} col 
     * @param {number} playerIndex 
     * @returns {boolean} 
     */
    makeMove(row, col, playerIndex) {
        if (row < 0 || row > 2 || col < 0 || col > 2) {
            return false;
        }

        if (this.board[row][col] === '') {
            this.board[row][col] = this.players[playerIndex];
            this.currentPlayerIndex = 1 - this.currentPlayerIndex;
            return true;
        }
        return false;
    }

    /**
     * Evaluates the board and returns the winning symbol when a line is complete.
     * @returns {'X'|'O'|null} The winner, or null if no winner exists.
     */
    checkWinner() {
        const lines = this.getWinningLineSet();

        // for.. of.. loop will iterate through each winning combination, and check if it exists on our board (if all cells are equal).
        for (const [[r1, c1], [r2, c2], [r3, c3]] of lines) {
            const first = this.board[r1][c1];
            if (first && first === this.board[r2][c2] && first === this.board[r3][c3]) {
                return first;
            }
        }

        return null;
    }

    /**
     * Returns all line combinations that can produce a win.
     * @returns {Array<[[number, number], [number, number], [number, number]]>} 8 possible winning lines.
     */
    getWinningLineSet() {
        return [
            // rows
            [[0, 0], [0, 1], [0, 2]],
            [[1, 0], [1, 1], [1, 2]],
            [[2, 0], [2, 1], [2, 2]],
            // columns
            [[0, 0], [1, 0], [2, 0]],
            [[0, 1], [1, 1], [2, 1]],
            [[0, 2], [1, 2], [2, 2]],
            // diagonals
            [[0, 0], [1, 1], [2, 2]],
            [[0, 2], [1, 1], [2, 0]],
        ];
    }

    /**
     * Determines whether the game is a draw (All cells are filled & there is no winner).
     * @returns {boolean} True when all cells are filled and no winner exists.
     */
    isDraw() {
        return this.board.every(row => row.every(cell => cell !== '')) && !this.checkWinner();
    }

    /**
     * Draws the board and status text to the game canvas.
     * @param {CanvasRenderingContext2D} ctx - Rendering context for the active canvas.
     * @param {number} cellSize - Width/height of each tic-tac-toe cell.
     * @param {number} offsetX - Left edge of the board in canvas space.
     * @param {number} offsetY - Top edge of the board in canvas space.
     * @param {string} statusText - Status label rendered above the board.
     * @returns {void}
     */
    draw(ctx, cellSize, offsetX, offsetY, statusText = '') {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        const boardSize = cellSize * 3;

        // Draw grid lines
        for (let i = 1; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(offsetX + i * cellSize, offsetY);
            ctx.lineTo(offsetX + i * cellSize, offsetY + boardSize);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(offsetX, offsetY + i * cellSize);
            ctx.lineTo(offsetX + boardSize, offsetY + i * cellSize);
            ctx.stroke();
        }

        // Draw X and O
        ctx.font = `${cellSize * 0.8}px Arial`;
        ctx.fillStyle = '#111';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const symbol = this.board[row][col];
                if (symbol) {
                    ctx.fillText(
                        symbol,
                        offsetX + col * cellSize + cellSize / 2,
                        offsetY + row * cellSize + cellSize / 2
                    );
                }
            }
        }

        ctx.font = '24px Arial';
        ctx.fillStyle = '#222';
        ctx.fillText(statusText, ctx.canvas.width / 2, Math.max(24, offsetY - 24));
    }
}

/**
 * Tic Tac Toe level that runs inside GameControl.
 *
 * - `initialize()` prepares canvas state and input listeners.
 * - `update()` is called each frame by GameControl.
 * - `resetRound()` clears the board after a win/draw delay.
 * - `destroy()` removes listeners when the level is torn down.
 *
 * This level keeps running continuously. After each win/draw it displays the
 * result briefly, then resets the board to the initial state for a new round.
 */
class ticTacToe {
    /**
     * @param {import('/assets/js/GameEnginev1.1/essentials/GameEnv.js').default} gameEnv - Active game environment.
     */
    constructor(gameEnv) {
        this.gameEnv = gameEnv;
        this.classes = [];
        this.gameBoard = new GameBoard(gameEnv);
        this.cellSize = 120;
        this.boardSize = this.cellSize * 3;
        this.offsetX = 0;
        this.offsetY = 0;
        this.winner = null;
        this.isGameOver = false;
        this.roundResetAt = null;
        this.roundResetDelayMs = 1200;

        this.handleCanvasClick = this.handleCanvasClick.bind(this);
    }

    /**
     * Initializes the level and binds click interaction.
     * @returns {void}
     */
    initialize() {
        this.canvas = this.gameEnv.canvas;
        this.ctx = this.gameEnv.ctx;

        this.resize();
        this.canvas.addEventListener('click', this.handleCanvasClick);
        this.draw();
    }

    /**
     * Recomputes board size and placement for the current viewport.
     * @returns {void}
     */
    resize() {
        this.width = this.gameEnv.innerWidth;
        this.height = this.gameEnv.innerHeight;

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.cellSize = Math.max(80, Math.floor(Math.min(this.width, this.height) * 0.2));
        this.boardSize = this.cellSize * 3;
        this.offsetX = Math.floor((this.width - this.boardSize) / 2);
        this.offsetY = Math.floor((this.height - this.boardSize) / 2);
    }

    /**
     * Builds the status label shown above the board.
     * @returns {string} Turn indicator, winner message, or draw message.
     */
    getStatusText() {
        if (this.winner) {
            return `Player ${this.winner} wins!`;
        }

        if (this.isGameOver) {
            return "It's a draw!";
        }

        return `Turn: ${this.gameBoard.players[this.gameBoard.currentPlayerIndex]}`;
    }

    /**
     * Resets round state after a completed game.
     * @returns {void}
     */
    resetRound() {
        this.gameBoard.reset();
        this.winner = null;
        this.isGameOver = false;
        this.roundResetAt = null;
    }

    /**
     * Draws the current level frame.
     * @returns {void}
     */
    draw() {
        this.gameBoard.draw(
            this.ctx,
            this.cellSize,
            this.offsetX,
            this.offsetY,
            this.getStatusText()
        );
    }

    /**
     * Handles a canvas click and applies one move when valid.
     * @param {MouseEvent} event - Click event from the game canvas.
     * @returns {void}
     */
    handleCanvasClick(event) {
        if (this.isGameOver) {
            return;
        }

        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const localX = x - this.offsetX;
        const localY = y - this.offsetY;

        if (localX < 0 || localY < 0 || localX > this.boardSize || localY > this.boardSize) {
            return;
        }

        const row = Math.floor(localY / this.cellSize);
        const col = Math.floor(localX / this.cellSize);
        const playerIndex = this.gameBoard.currentPlayerIndex;

        if (this.gameBoard.makeMove(row, col, playerIndex)) {
            this.winner = this.gameBoard.checkWinner();

            if (this.winner || this.gameBoard.isDraw()) {
                this.isGameOver = true;
                this.roundResetAt = performance.now() + this.roundResetDelayMs;
            }

            this.draw();
        }
    }

    /**
     * Per-frame update called by GameControl.
    * Handles responsive layout updates, redraw, and per-round reset flow.
     * @returns {void}
     */
    update() {
        const prevWidth = this.width;
        const prevHeight = this.height;
        this.width = this.gameEnv.innerWidth;
        this.height = this.gameEnv.innerHeight;

        if (this.width !== prevWidth || this.height !== prevHeight) {
            this.resize();
        }

        this.draw();

        // Start a new round after showing the final state briefly.
        if (this.isGameOver && this.roundResetAt && performance.now() >= this.roundResetAt) {
            this.resetRound();
        }
    }

    /**
     * Cleans up canvas listeners when level is destroyed.
     * @returns {void}
     */
    destroy() {
        if (this.canvas) {
            this.canvas.removeEventListener('click', this.handleCanvasClick);
        }
    }
}

export default ticTacToe;