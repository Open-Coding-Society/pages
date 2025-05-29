import FloorItem from './FloorItem.js';

class FloorItemManager {
    static instance = null;

    constructor() {
        if (FloorItemManager.instance) {
            return FloorItemManager.instance;
        }
        this.items = [];
        this.maxItems = 1;
        this.spawnInterval = 30000;
        this.spawnTimer = null;
        FloorItemManager.instance = this;
        this.initialize();
    }

    static getInstance() {
        if (!FloorItemManager.instance) {
            FloorItemManager.instance = new FloorItemManager();
        }
        return FloorItemManager.instance;
    }

    initialize() {
        console.log('FloorItemManager initializing...');
        this.waitForGameContainer();
    }

    waitForGameContainer() {
        const gameContainer = document.getElementById('gameContainer');
        if (!gameContainer) {
            console.log('Game container not found, retrying in 100ms...');
            setTimeout(() => this.waitForGameContainer(), 100);
            return;
        }
        console.log('Game container found, spawning initial item...');
        this.spawnRandomItem();
        this.startSpawning();
    }

    spawnRandomItem() {
        if (this.items.length >= this.maxItems) {
            console.log('Max items reached, not spawning new item');
            return;
        }

        const gameContainer = document.getElementById('gameContainer');
        if (!gameContainer) {
            console.log('Game container not found during spawn');
            return;
        }

        // Create a test item
        const testItem = {
            id: 'test-emoji',
            name: 'Test Emoji',
            description: 'A test emoji item',
            emoji: '🎮',
            stackable: true,
            value: 100,
            quantity: 1
        };

        // Position at the center of the game container
        const x = gameContainer.offsetWidth / 2;
        const y = gameContainer.offsetHeight / 2;

        console.log('Spawning test item at:', x, y);

        const item = new FloorItem(x, y, testItem);
        this.items.push(item);
    }

    startSpawning() {
        if (this.spawnTimer) {
            clearInterval(this.spawnTimer);
        }
        this.spawnTimer = setInterval(() => this.spawnRandomItem(), this.spawnInterval);
    }

    stopSpawning() {
        if (this.spawnTimer) {
            clearInterval(this.spawnTimer);
            this.spawnTimer = null;
        }
    }

    removeItem(item) {
        if (!item) return;
        
        const index = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
            if (item.element && item.element.parentNode) {
                item.element.remove();
            }
        }
    }

    clearItems() {
        this.items.forEach(item => {
            if (item && item.element && item.element.parentNode) {
                item.element.remove();
            }
        });
        this.items = [];
    }
}

export default FloorItemManager; 