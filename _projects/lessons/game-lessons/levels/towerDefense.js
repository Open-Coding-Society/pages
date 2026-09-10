/**
 * Tower Defense game class managing state, rendering, and interactions.
 * @class
 */
class Game {
    /**
     * Create a Game instance.
     * @param {Object} gameEnv - Environment with canvas, ctx, innerWidth, innerHeight
     */
    constructor(gameEnv) {
        this.gameEnv = gameEnv;

        this.towers = [];
        this.enemies = [];
        this.path = [];
        this.classes = [];

        this.backgroundColor = '#efe9dd';

        this.canvas = null;
        this.ctx = null;

        this.boardWidth = 10;
        this.boardHeight = 10;

        this.board = [];

        this.coins = 0;
        this.level = 0;
        
        this.width = 0;
        this.height = 0;
        this.cellSize = 0;
        this.boardSize = 0;
        this.offsetX = 0;
        this.offsetY = 0;

        this.handleCanvasClick = this.handleCanvasClick.bind(this);
    }

    /**
     * Initialize the game: set up canvas, resize, reset, event listeners, and draw.
     * @returns {void}
     */
    initialize() {
        this.canvas = this.gameEnv.canvas;
        this.ctx = this.gameEnv.ctx;

        this.resize();
        this.reset();
        this.canvas.addEventListener('click', this.handleCanvasClick);
        this.draw();
    }

    /**
     * Recalculate layout sizes based on current canvas/environment size.
     * @returns {void}
     */
    resize() {
        if (!this.canvas) {
            this.canvas = this.gameEnv.canvas;
        }

        this.width = this.gameEnv.innerWidth;
        this.height = this.gameEnv.innerHeight;

        if (this.canvas) {
            this.canvas.width = this.width;
            this.canvas.height = this.height;
        }

        this.cellSize = Math.max(32, Math.floor(Math.min((this.width - 40) / this.boardWidth, (this.height - 40) / this.boardHeight)));
        this.boardSize = this.cellSize * Math.max(this.boardWidth, this.boardHeight);
        this.offsetX = Math.floor((this.width - this.cellSize * this.boardWidth) / 2);
        this.offsetY = Math.floor((this.height - this.cellSize * this.boardHeight) / 2);
    }

    /**
     * Get a short status string for display in the UI.
     * @returns {string}
     */
    getStatusText() {
        return `Level ${this.level} | Coins: ${this.coins}`;
    }

    /**
     * Convert a board row/column pair into a unique string key.
     * @param {number} row
     * @param {number} col
     * @returns {string}
     */
    makeCellKey(row, col) {
        return `${row},${col}`;
    }

    /**
     * Reset the current round (alias of `reset`).
     * @returns {void}
     */
    resetRound() {
        this.reset();
    }

    /**
     * Reset game state and regenerate the board and path.
     * @returns {void}
     */
    reset() {
        this.towers = [];
        this.enemies = [];
        this.path = [];

        this.coins = 0;
        this.level = 0;

        this.board = [];
        for (let r = 0; r < this.boardHeight; r++) {
            const row = [];
            for (let c = 0; c < this.boardWidth; c++) {
                row.push([]);
            }
            this.board.push(row);
        }

        this.drawEnemyPath();
    }

    /**
     * Generate a randomized enemy path across the board and mark path cells.
     * @returns {Array<number[]>} The generated path as an array of [row, col] coordinates.
     */
    drawEnemyPath() {
        if (!this.board.length) {
            return [];
        }

        const randomInt = (min, max) => {
            if (max < min) {
                return min;
            }

            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        const startRow = 0;
        const lastRow = this.boardHeight - 1;
        const startCol = Math.floor(this.boardWidth / 2);
        const path = [[startRow, startCol]];

        let currentRow = startRow;
        let currentCol = startCol;
        let moveHorizontallyNext = true;

        while (currentRow < lastRow) {
            if (moveHorizontallyNext || this.boardWidth === 1) {
                currentRow += 1;
                path.push([currentRow, currentCol]);

                const maxLeft = currentCol;
                const maxRight = this.boardWidth - 1 - currentCol;
                const canMoveLeft = maxLeft > 0;
                const canMoveRight = maxRight > 0;

                if (canMoveLeft || canMoveRight) {
                    const direction = canMoveLeft && canMoveRight ? (Math.random() < 0.5 ? -1 : 1) : (canMoveLeft ? -1 : 1);
                    const maxDistance = direction < 0 ? maxLeft : maxRight;
                    const distance = randomInt(1, Math.max(1, Math.min(3, maxDistance)));

                    for (let step = 0; step < distance; step++) {
                    
                    currentCol += direction;
                        path.push([currentRow, currentCol]);
                    }
                }

                moveHorizontallyNext = false;
                continue;
            }

            const remainingRows = lastRow - currentRow;
            const downDistance = randomInt(1, Math.max(1, Math.min(3, remainingRows)));

            for (let step = 0; step < downDistance && currentRow < lastRow; step++) {
                currentRow += 1;
                path.push([currentRow, currentCol]);
            }

            moveHorizontallyNext = true;
        }

        const pathSet = new Set(path.map(([row, col]) => this.makeCellKey(row, col)));

        for (let row = 0; row < this.boardHeight; row++) {
            for (let col = 0; col < this.boardWidth; col++) {
                this.board[row][col].length = 0;

                if (pathSet.has(this.makeCellKey(row, col))) {
                    this.board[row][col].push('path');
                }
            }
        }

        this.path = path;
        console.log('Generated path:', path);
        return path;
    }

    /**
     * Clear the canvas and draw the background fill.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} width
     * @param {number} height
     * @returns {void}
     */
    drawBackground(ctx, width, height) {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, width, height);
    }

    /**
     * Draw the board grid and the path cells.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} originX - X offset for the board origin
     * @param {number} originY - Y offset for the board origin
     * @param {number} cellSize - Size of each square cell in pixels
     * @returns {void}
     */
    drawPath(ctx, originX, originY, cellSize) { {
        for (let row = 0; row < this.boardHeight; row++) {
            for (let col = 0; col < this.boardWidth; col++) {
                const x = originX + col * cellSize;
                const y = originY + row * cellSize;
                const isPath = this.board[row][col].includes('path');
                const startCell = this.path[0];
                const endCell = this.path[this.path.length - 1];
                const isStart = Array.isArray(startCell) && row === startCell[0] && col === startCell[1];
                const isEnd = Array.isArray(endCell) && row === endCell[0] && col === endCell[1];

                ctx.fillStyle = isPath ? '#5c9d3f' : '#d7d1c5';
                ctx.fillRect(x, y, cellSize, cellSize);

                ctx.strokeStyle = '#b8b0a3';
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, cellSize, cellSize);

                if (isPath) {
                    if (isStart) {
                        ctx.fillStyle = '#8ef06b';
                    } else if (isEnd) {
                        ctx.fillStyle = '#335f22';
                    } else {
                        ctx.fillStyle = '#6ead49';
                    }

                    ctx.fillRect(x + Math.floor(cellSize * 0.2), y + Math.floor(cellSize * 0.2), Math.ceil(cellSize * 0.6), Math.ceil(cellSize * 0.6));

                    if (isStart || isEnd) {
                        ctx.fillStyle = '#10210c';
                    }
                }
            }
        }
    }
    }

    /**
     * Render the game: background, path, towers, enemies and status text.
     * @returns {void}
     */
    draw() {
        const ctx = this.ctx || this.gameEnv.ctx;
        if (!ctx || !this.board.length) {
            return;
        }

        const canvasWidth = ctx.canvas.width;
        const canvasHeight = ctx.canvas.height;
        const cellSize = this.cellSize || Math.floor(Math.min((canvasWidth - 40) / this.boardWidth, (canvasHeight - 40) / this.boardHeight));
        const originX = this.offsetX;
        const originY = this.offsetY;

        this.drawBackground(ctx, canvasWidth, canvasHeight);

        this.drawPath(ctx, originX, originY, cellSize);

        for (const tower of this.towers) {
            if (tower == null) {
                continue;
            }

            const row = tower.row ?? tower.gridRow ?? tower.y;
            const col = tower.col ?? tower.gridCol ?? tower.x;
            if (!Number.isInteger(row) || !Number.isInteger(col)) {
                continue;
            }

            if (row < 0 || row >= this.boardHeight || col < 0 || col >= this.boardWidth) {
                continue;
            }

            const x = originX + col * cellSize;
            const y = originY + row * cellSize;
            ctx.fillStyle = '#2f5aa8';
            ctx.fillRect(x + Math.floor(cellSize * 0.15), y + Math.floor(cellSize * 0.15), Math.ceil(cellSize * 0.7), Math.ceil(cellSize * 0.7));
        }

        for (const enemy of this.enemies) {
            if (enemy == null) {
                continue;
            }

            const row = enemy.row ?? enemy.gridRow ?? enemy.y;
            const col = enemy.col ?? enemy.gridCol ?? enemy.x;
            if (!Number.isInteger(row) || !Number.isInteger(col)) {
                continue;
            }

            if (row < 0 || row >= this.boardHeight || col < 0 || col >= this.boardWidth) {
                continue;
            }

            const x = originX + col * cellSize + cellSize / 2;
            const y = originY + row * cellSize + cellSize / 2;
            ctx.beginPath();
            ctx.fillStyle = '#b23a48';
            ctx.arc(x, y, Math.max(4, Math.floor(cellSize * 0.28)), 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.fillStyle = '#2b241d';
        ctx.font = '22px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.getStatusText(), canvasWidth / 2, Math.max(20, originY - 24));
    }

    /**
     * Update the game state; handle resizing and redraw.
     * @returns {void}
     */
    update() {
        const nextWidth = this.gameEnv.innerWidth;
        const nextHeight = this.gameEnv.innerHeight;

        if (nextWidth !== this.width || nextHeight !== this.height) {
            this.resize();
        }

        this.draw();
    }

    /**
     * Destroy the game instance, removing event listeners and clearing refs.
     * @returns {void}
     */
    destroy() {
        if (this.canvas) {
            this.canvas.removeEventListener('click', this.handleCanvasClick);
        }

        this.canvas = null;
        this.ctx = null;
    }

    /**
     * Add a tower to the game.
     * @param {Object} tower
     * @returns {void}
     */
    addTower(tower) {
        this.towers.push(tower);
    }

    /**
     * Add an enemy to the game.
     * @param {Object} enemy
     * @returns {void}
     */
    addEnemy(enemy) {
        this.enemies.push(enemy);
    }

    /**
     * Canvas click event handler; converts the DOM mouse event to game coordinates
     * and delegates to `handleClick`.
     * @param {MouseEvent} event
     * @returns {void}
     */
    handleCanvasClick(event) {
        if (!this.canvas) {
            return;
        }

        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        this.handleClick(x, y);
        this.draw();
    }

    /**
     * Handle a click at canvas coordinates, translate to board row/col and
     * perform click logic (e.g., ignore path cells).
     * @param {number} x - Canvas X coordinate
     * @param {number} y - Canvas Y coordinate
     * @returns {void}
     */
    handleClick(x, y) {
        const col = Math.floor((x - this.offsetX) / this.cellSize);
        const row = Math.floor((y - this.offsetY) / this.cellSize);

        if (row < 0 || row >= this.boardHeight || col < 0 || col >= this.boardWidth) {
            return;
        }

        const cell = this.board[row][col];

        if (cell.includes('path')) {
            return;
        }

        console.log(cell);

        console.log(`Clicked on cell: (${row}, ${col})`);
    }
}

export default Game;