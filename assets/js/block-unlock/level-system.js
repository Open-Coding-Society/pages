// CHANGES: New level system for storing and loading game levels with smooth transitions

export class LevelSystem {
    constructor() {
        this.currentLevelIndex = 0;
        this.levels = [];
        this.initializeLevels();
    }

    initializeLevels() {
        // Level 1: Simple introduction
        this.levels.push({
            name: "Level 1: First Steps",
            gridSize: [15, 10],
            borders: [
                // Placeable area (left side) - larger area
                {x: 2, y: 3, directions: ['e']},
                {x: 3, y: 3, directions: ['e', 'w']},
                {x: 4, y: 3, directions: ['e', 'w']},
                {x: 5, y: 3, directions: ['w']},
                {x: 2, y: 4, directions: ['e']},
                {x: 3, y: 4, directions: ['e', 'w']},
                {x: 4, y: 4, directions: ['e', 'w']},
                {x: 5, y: 4, directions: ['w']},
                {x: 2, y: 5, directions: ['e']},
                {x: 3, y: 5, directions: ['e', 'w']},
                {x: 4, y: 5, directions: ['e', 'w']},
                {x: 5, y: 5, directions: ['w']},
                {x: 2, y: 6, directions: ['e']},
                {x: 3, y: 6, directions: ['e', 'w']},
                {x: 4, y: 6, directions: ['e', 'w']},
                {x: 5, y: 6, directions: ['w']},
            ],
            tiles: [
                {x: 3, y: 4, state: 7, direction: 'north'}, // Key in placeable area
                {x: 10, y: 4, state: 8, direction: 'north'}, // Door
            ]
        });

        // Level 2: Basic pushing
        this.levels.push({
            name: "Level 2: Push It",
            gridSize: [15, 10],
            borders: [
                // Placeable area - same size as level 1
                {x: 2, y: 3, directions: ['e']},
                {x: 3, y: 3, directions: ['e', 'w']},
                {x: 4, y: 3, directions: ['e', 'w']},
                {x: 5, y: 3, directions: ['w']},
                {x: 2, y: 4, directions: ['e']},
                {x: 3, y: 4, directions: ['e', 'w']},
                {x: 4, y: 4, directions: ['e', 'w']},
                {x: 5, y: 4, directions: ['w']},
                {x: 2, y: 5, directions: ['e']},
                {x: 3, y: 5, directions: ['e', 'w']},
                {x: 4, y: 5, directions: ['e', 'w']},
                {x: 5, y: 5, directions: ['w']},
                {x: 2, y: 6, directions: ['e']},
                {x: 3, y: 6, directions: ['e', 'w']},
                {x: 4, y: 6, directions: ['e', 'w']},
                {x: 5, y: 6, directions: ['w']},
            ],
            tiles: [
                {x: 3, y: 4, state: 7, direction: 'north'}, // Key
                {x: 7, y: 4, state: 1, direction: 'north'}, // Block in the way
                {x: 12, y: 4, state: 8, direction: 'north'}, // Door
            ]
        });

        // Level 3: Pusher introduction
        this.levels.push({
            name: "Level 3: The Pusher",
            gridSize: [15, 10],
            borders: [
                // Larger placeable area
                {x: 1, y: 2, directions: ['e']},
                {x: 2, y: 2, directions: ['e', 'w']},
                {x: 3, y: 2, directions: ['e', 'w']},
                {x: 4, y: 2, directions: ['w']},
                {x: 1, y: 3, directions: ['e']},
                {x: 2, y: 3, directions: ['e', 'w']},
                {x: 3, y: 3, directions: ['e', 'w']},
                {x: 4, y: 3, directions: ['w']},
                {x: 1, y: 4, directions: ['e']},
                {x: 2, y: 4, directions: ['e', 'w']},
                {x: 3, y: 4, directions: ['e', 'w']},
                {x: 4, y: 4, directions: ['w']},
                {x: 1, y: 5, directions: ['e']},
                {x: 2, y: 5, directions: ['e', 'w']},
                {x: 3, y: 5, directions: ['e', 'w']},
                {x: 4, y: 5, directions: ['w']},
                {x: 1, y: 6, directions: ['e']},
                {x: 2, y: 6, directions: ['e', 'w']},
                {x: 3, y: 6, directions: ['e', 'w']},
                {x: 4, y: 6, directions: ['w']},
            ],
            tiles: [
                {x: 1, y: 4, state: 7, direction: 'north'}, // Key
                {x: 6, y: 4, state: 1, direction: 'north'}, // Block
                {x: 7, y: 4, state: 1, direction: 'north'}, // Block
                {x: 12, y: 4, state: 8, direction: 'north'}, // Door
            ]
        });

        console.log(`Initialized ${this.levels.length} levels`);
    }

    getCurrentLevel() {
        if (this.currentLevelIndex >= 0 && this.currentLevelIndex < this.levels.length) {
            return this.levels[this.currentLevelIndex];
        }
        return null;
    }

    nextLevel() {
        if (this.currentLevelIndex < this.levels.length - 1) {
            this.currentLevelIndex++;
            return true;
        }
        return false; // No more levels
    }

    prevLevel() {
        if (this.currentLevelIndex > 0) {
            this.currentLevelIndex--;
            return true;
        }
        return false;
    }

    resetToLevel(index) {
        if (index >= 0 && index < this.levels.length) {
            this.currentLevelIndex = index;
            return true;
        }
        return false;
    }

    getLevelCount() {
        return this.levels.length;
    }

    getCurrentLevelIndex() {
        return this.currentLevelIndex;
    }
}

export class LevelLoader {
    constructor(grid, gameContainer, cells) {
        this.grid = grid;
        this.gameContainer = gameContainer;
        this.cells = cells;
        this.levelSystem = new LevelSystem();
    }

    async loadLevel(levelData) {
        if (!levelData) {
            console.error("No level data provided");
            return false;
        }

        console.log(`Loading: ${levelData.name}`);

        // Clear current level
        this.grid.clearLevel();

        // Resize grid if needed
        const [newWidth, newHeight] = levelData.gridSize;
        if (newWidth !== this.grid.Xsize || newHeight !== this.grid.Ysize) {
            this.resizeGrid(newWidth, newHeight);
        }

        // Add borders
        levelData.borders.forEach(border => {
            this.grid.addBorder(border.x, border.y, border.directions);
        });

        // Add tiles - import Tile class dynamically
        const { Tile } = await import('./tile.js');
        levelData.tiles.forEach(tileData => {
            const tile = new Tile(
                [tileData.x, tileData.y], 
                tileData.state, 
                tileData.direction || 'north'
            );
            this.grid.addTile(tile);
        });

        // Refresh visual display
        this.refreshDisplay();

        return true;
    }

    async loadCurrentLevel() {
        const levelData = this.levelSystem.getCurrentLevel();
        return this.loadLevel(levelData);
    }

    async nextLevel() {
        if (this.levelSystem.nextLevel()) {
            await this.loadCurrentLevel();
            return true;
        } else {
            console.log("🎉 All levels completed!");
            return false;
        }
    }

    async prevLevel() {
        if (this.levelSystem.prevLevel()) {
            await this.loadCurrentLevel();
            return true;
        }
        return false;
    }

    resizeGrid(newWidth, newHeight) {
        // Update grid size
        this.grid.Xsize = newWidth;
        this.grid.Ysize = newHeight;
        this.grid.grid = Array.from({length: newHeight}, () => Array(newWidth).fill(0));

        // Update container styling
        this.gameContainer.style.setProperty("--grid-cols", newWidth);
        this.gameContainer.style.setProperty("--grid-rows", newHeight);
        this.gameContainer.style.gridTemplateColumns = `repeat(${newWidth}, 1fr)`;
        this.gameContainer.style.gridTemplateRows = `repeat(${newHeight}, 1fr)`;

        // Clear and recreate cells
        this.gameContainer.innerHTML = '';
        this.cells.length = 0;

        // Recreate cells array (will be populated by main game file)
        for(let y = 0; y < newHeight; y++) {
            for(let x = 0; x < newWidth; x++) {
                this.cells.push(null); // Placeholder, will be filled by main file
            }
        }
    }

    refreshDisplay() {
        // Trigger a refresh of all cells
        for(let y = 0; y < this.grid.Ysize; y++) {
            for(let x = 0; x < this.grid.Xsize; x++) {
                this.grid.notify(x, y);
            }
        }
    }

    getCurrentLevelInfo() {
        const level = this.levelSystem.getCurrentLevel();
        return {
            name: level ? level.name : "Unknown",
            index: this.levelSystem.getCurrentLevelIndex() + 1,
            total: this.levelSystem.getLevelCount()
        };
    }
}