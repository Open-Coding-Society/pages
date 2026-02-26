

class GameLevelMinesweeper {
    constructor(gameEnv) {
        // Store gameEnv for later use
        this.gameEnv = gameEnv;
        // Initialize classes array - we don't need a background since we draw our own
        this.classes = [];
    }

    initialize() {
        // This method is called by GameLevel.js after creating game objects
        this.width = this.gameEnv.innerWidth;
        this.height = this.gameEnv.innerHeight;
        this.canvas = this.gameEnv.gameCanvas;
        this.ctx = this.canvas.getContext('2d');

        // Game settings
        this.gridSize = 10; // 10x10 grid
        this.cellSize = 40; // Size of each cell in pixels
        this.mineCount = 10; // Number of mines
        
        // Initialize 2D arrays
        this.grid = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(0));
        this.revealed = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(false));
        this.flagged = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(false));
        this.mines = [];
        this.gameOver = false;
        this.won = false;
        this.score = 0;
        this.firstClick = true;

        // Calculate grid position to center it
        this.gridX = (this.width - (this.gridSize * this.cellSize)) / 2;
        this.gridY = (this.height - (this.gridSize * this.cellSize)) / 2;

        // Initialize game
        this.initializeGrid();
        this.addEventListeners();

        // Start the game
        this.isRunning = true;
        
        // Start the game loop
        this.gameLoop();
    }

    gameLoop() {
        if (!this.isRunning) return;

        // Update game state
        this.update();
        
        // Draw the game
        this.draw();

        // Request next frame
        requestAnimationFrame(() => this.gameLoop());
    }

    initializeGrid() {
        // Reset arrays
        this.grid = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(0));
        this.revealed = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(false));
        this.flagged = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(false));
        this.mines = [];

        // Place mines randomly
        let minesPlaced = 0;
        while (minesPlaced < this.mineCount) {
            const x = Math.floor(Math.random() * this.gridSize);
            const y = Math.floor(Math.random() * this.gridSize);
            if (this.grid[x][y] !== -1) { // -1 represents a mine
                this.grid[x][y] = -1;
                this.mines.push({x, y});
                minesPlaced++;
            }
        }

        // Calculate numbers for adjacent cells
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if (this.grid[i][j] !== -1) {
                    this.grid[i][j] = this.countAdjacentMines(i, j);
                }
            }
        }
    }

    countAdjacentMines(x, y) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const newX = x + i;
                const newY = y + j;
                if (newX >= 0 && newX < this.gridSize && 
                    newY >= 0 && newY < this.gridSize && 
                    this.grid[newX][newY] === -1) {
                    count++;
                }
            }
        }
        return count;
    }

    addEventListeners() {
        // Store bound event handlers so we can remove them later
        this.handleClick = (e) => {
            if (this.gameOver) {
                // Check if click is on Play Again button
                const buttonWidth = 200;
                const buttonHeight = 50;
                const buttonX = this.width/2 - buttonWidth/2;
                const buttonY = this.height/2 + 80;
                
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                if (x >= buttonX && x <= buttonX + buttonWidth &&
                    y >= buttonY && y <= buttonY + buttonHeight) {
                    this.resetGame();
                }
                return;
            }
            
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left - this.gridX;
            const y = e.clientY - rect.top - this.gridY;
            
            const gridX = Math.floor(x / this.cellSize);
            const gridY = Math.floor(y / this.cellSize);
            
            if (gridX >= 0 && gridX < this.gridSize && 
                gridY >= 0 && gridY < this.gridSize) {
                this.revealCell(gridX, gridY);
            }
        };

        this.handleRightClick = (e) => {
            e.preventDefault();
            if (this.gameOver) return;
            
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left - this.gridX;
            const y = e.clientY - rect.top - this.gridY;
            
            const gridX = Math.floor(x / this.cellSize);
            const gridY = Math.floor(y / this.cellSize);
            
            if (gridX >= 0 && gridX < this.gridSize && 
                gridY >= 0 && gridY < this.gridSize) {
                this.toggleFlag(gridX, gridY);
            }
        };

        this.canvas.addEventListener('click', this.handleClick);
        this.canvas.addEventListener('contextmenu', this.handleRightClick);
    }

    revealCell(x, y) {
        if (this.revealed[x][y] || this.flagged[x][y]) return;

        this.revealed[x][y] = true;

        if (this.firstClick) {
            this.firstClick = false;
            // Ensure first click is not a mine
            if (this.grid[x][y] === -1) {
                this.grid[x][y] = 0;
                this.mines = this.mines.filter(mine => !(mine.x === x && mine.y === y));
                // Place new mine in empty spot
                let newMinePlaced = false;
                while (!newMinePlaced) {
                    const newX = Math.floor(Math.random() * this.gridSize);
                    const newY = Math.floor(Math.random() * this.gridSize);
                    if (this.grid[newX][newY] !== -1) {
                        this.grid[newX][newY] = -1;
                        this.mines.push({x: newX, y: newY});
                        newMinePlaced = true;
                    }
                }
                // Recalculate numbers
                for (let i = 0; i < this.gridSize; i++) {
                    for (let j = 0; j < this.gridSize; j++) {
                        if (this.grid[i][j] !== -1) {
                            this.grid[i][j] = this.countAdjacentMines(i, j);
                        }
                    }
                }
            }
        }

        if (this.grid[x][y] === -1) {
            this.gameOver = true;
            this.revealAll();
            return;
        }

        if (this.grid[x][y] === 0) {
            // Reveal adjacent cells
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const newX = x + i;
                    const newY = y + j;
                    if (newX >= 0 && newX < this.gridSize && 
                        newY >= 0 && newY < this.gridSize) {
                        this.revealCell(newX, newY);
                    }
                }
            }
        }

        this.checkWin();
    }

    toggleFlag(x, y) {
        if (this.revealed[x][y]) return;
        this.flagged[x][y] = !this.flagged[x][y];
        this.checkWin();
    }

    revealAll() {
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                this.revealed[i][j] = true;
                this.flagged[i][j] = false;
            }
        }
    }

    checkWin() {
        let correctFlags = 0;
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if (this.grid[i][j] === -1 && this.flagged[i][j]) {
                    correctFlags++;
                }
            }
        }
        if (correctFlags === this.mineCount) {
            this.won = true;
            this.gameOver = true;
            this.score = 100;
        }
    }

    draw() {
        if (!this.ctx) return;  // Make sure we have a context before drawing

        // Clear the entire canvas and draw desert background
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw desert sky gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#FFB74D');  // Light orange sky
        gradient.addColorStop(1, '#FFA726');  // Darker orange sky
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw sun
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(100, 100, 40, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw some desert dunes in the background
        this.ctx.fillStyle = '#F5DEB3';  // Wheat color
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.height * 0.7);
        this.ctx.quadraticCurveTo(this.width * 0.25, this.height * 0.6, this.width * 0.5, this.height * 0.7);
        this.ctx.quadraticCurveTo(this.width * 0.75, this.height * 0.8, this.width, this.height * 0.7);
        this.ctx.lineTo(this.width, this.height);
        this.ctx.lineTo(0, this.height);
        this.ctx.closePath();
        this.ctx.fill();

        // Add title with desert theme
        this.ctx.fillStyle = '#8B4513';  // Saddle brown
        this.ctx.font = 'bold 32px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Desert Minesweeper', this.width/2, 50);

        // Add instructions with desert theme
        this.ctx.font = '18px Arial';
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillText('Left-click to dig, Right-click to flag mines', this.width/2, 80);
        
        // Draw grid background with desert sand color
        this.ctx.fillStyle = '#DEB887';  // Burly wood color
        this.ctx.fillRect(
            this.gridX - 5, 
            this.gridY - 5, 
            this.gridSize * this.cellSize + 10, 
            this.gridSize * this.cellSize + 10
        );
        
        // Draw grid
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                const x = this.gridX + i * this.cellSize;
                const y = this.gridY + j * this.cellSize;

                // Draw cell background with 3D effect
                this.ctx.fillStyle = this.revealed[i][j] ? '#F5DEB3' : '#DEB887';  // Wheat and Burly wood colors
                this.ctx.fillRect(x, y, this.cellSize, this.cellSize);

                if (!this.revealed[i][j]) {
                    // Draw 3D effect for unrevealed cells
                    this.ctx.fillStyle = '#FFE4B5';  // Moccasin color
                    this.ctx.beginPath();
                    this.ctx.moveTo(x, y + this.cellSize);
                    this.ctx.lineTo(x, y);
                    this.ctx.lineTo(x + this.cellSize, y);
                    this.ctx.strokeStyle = '#FFE4B5';
                    this.ctx.stroke();

                    this.ctx.fillStyle = '#CD853F';  // Peru color
                    this.ctx.beginPath();
                    this.ctx.moveTo(x + this.cellSize, y);
                    this.ctx.lineTo(x + this.cellSize, y + this.cellSize);
                    this.ctx.lineTo(x, y + this.cellSize);
                    this.ctx.strokeStyle = '#CD853F';
                    this.ctx.stroke();
                }

                if (this.revealed[i][j]) {
                    if (this.grid[i][j] === -1) {
                        // Draw cactus instead of mine
                        this.ctx.fillStyle = '#228B22';  // Forest green
                        this.ctx.beginPath();
                        // Main body
                        this.ctx.moveTo(x + this.cellSize/2, y + this.cellSize/2);
                        this.ctx.lineTo(x + this.cellSize/2, y + this.cellSize/3);
                        // Left arm
                        this.ctx.moveTo(x + this.cellSize/2, y + this.cellSize/2);
                        this.ctx.lineTo(x + this.cellSize/3, y + this.cellSize/3);
                        // Right arm
                        this.ctx.moveTo(x + this.cellSize/2, y + this.cellSize/2);
                        this.ctx.lineTo(x + this.cellSize*2/3, y + this.cellSize/3);
                        this.ctx.stroke();
                    } else if (this.grid[i][j] > 0) {
                        // Draw number with desert theme colors
                        this.ctx.fillStyle = this.getNumberColor(this.grid[i][j]);
                        this.ctx.font = 'bold 20px Arial';
                        this.ctx.textAlign = 'center';
                        this.ctx.textBaseline = 'middle';
                        this.ctx.fillText(this.grid[i][j], x + this.cellSize/2, y + this.cellSize/2);
                    }
                } else if (this.flagged[i][j]) {
                    // Draw flag with desert theme
                    this.ctx.fillStyle = '#8B4513';  // Saddle brown
                    this.ctx.beginPath();
                    this.ctx.moveTo(x + this.cellSize/4, y + this.cellSize/4);
                    this.ctx.lineTo(x + this.cellSize*3/4, y + this.cellSize/2);
                    this.ctx.lineTo(x + this.cellSize/4, y + this.cellSize*3/4);
                    this.ctx.closePath();
                    this.ctx.fill();
                }
            }
        }

        // Draw game over message with desert theme
        if (this.gameOver) {
            this.ctx.fillStyle = 'rgba(139, 69, 19, 0.7)';  // Semi-transparent saddle brown
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.fillStyle = '#FFD700';  // Gold color
            this.ctx.font = 'bold 30px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(
                this.won ? 'You Found All the Cacti!' : 'Game Over!',
                this.width/2,
                this.height/2
            );
            if (this.won) {
                this.ctx.font = '20px Arial';
                this.ctx.fillText(
                    `Score: ${this.score}`,
                    this.width/2,
                    this.height/2 + 40
                );
            }
            
            // Add replay button with desert theme
            this.ctx.fillStyle = '#8B4513';  // Saddle brown
            const buttonWidth = 200;
            const buttonHeight = 50;
            const buttonX = this.width/2 - buttonWidth/2;
            const buttonY = this.height/2 + 80;
            this.ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
            this.ctx.fillStyle = '#FFD700';  // Gold color
            this.ctx.font = '20px Arial';
            this.ctx.fillText('Play Again', this.width/2, buttonY + buttonHeight/2);
        }

        // Draw remaining mines count with desert theme
        let remainingFlags = this.mineCount - this.flagged.flat().filter(Boolean).length;
        this.ctx.fillStyle = '#8B4513';  // Saddle brown
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Cacti remaining: ${remainingFlags}`, 10, 30);
    }

    getNumberColor(number) {
        const colors = [
            '#8B4513', // 1: Saddle brown
            '#A0522D', // 2: Sienna
            '#CD853F', // 3: Peru
            '#D2691E', // 4: Chocolate
            '#8B0000', // 5: Dark red
            '#B8860B', // 6: Dark goldenrod
            '#DAA520', // 7: Goldenrod
            '#BDB76B'  // 8: Dark khaki
        ];
        return colors[number - 1] || '#8B4513';
    }

    update() {
        if (this.isRunning) {
            this.draw();
        }
    }

    cleanup() {
        this.isRunning = false;
        if (this.canvas) {
            this.canvas.removeEventListener('click', this.handleClick);
            this.canvas.removeEventListener('contextmenu', this.handleRightClick);
        }
    }

    destroy() {
        this.cleanup();
    }

    resetGame() {
        // Reset game state
        this.gameOver = false;
        this.won = false;
        this.score = 0;
        this.firstClick = true;
        
        // Reinitialize the grid
        this.initializeGrid();
    }
}

export default GameLevelMinesweeper; 