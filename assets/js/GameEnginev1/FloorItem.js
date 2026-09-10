import Inventory from './Inventory.js';
import FloorItemManager from './FloorItemManager.js';

class FloorItem {
    constructor(x, y, item) {
        this.x = x;
        this.y = y;
        this.item = item;
        this.element = null;
        this.initialize();
    }

    initialize() {
        const style = document.createElement('style');
        style.textContent = `
            .floor-item {
                background: rgba(0, 0, 0, 0.7);
                border: 2px solid gold;
                border-radius: 8px;
                padding: 10px;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 5px;
                transition: transform 0.2s;
            }
            .floor-item:hover {
                transform: scale(1.1);
            }
            .item-emoji {
                font-size: 32px;
            }
            .item-name {
                color: white;
                font-size: 14px;
                text-align: center;
            }
        `;
        document.head.appendChild(style);

        this.element = document.createElement('div');
        this.element.className = 'floor-item';
        this.element.innerHTML = `
            <div class="item-emoji">${this.item.emoji}</div>
            <div class="item-name">${this.item.name}</div>
        `;
        
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            this.element.style.position = 'absolute';
            this.element.style.left = `${this.x}px`;
            this.element.style.top = `${this.y}px`;
            this.element.style.zIndex = '1000'; // Make sure it's above other elements
            this.element.style.transform = 'translate(-50%, -50%)'; 
            gameContainer.appendChild(this.element);
            console.log('Added floor item to game container at:', this.x, this.y);
        } else {
            console.log('Game container not found for floor item');
        }

        this.element.addEventListener('click', () => this.onClick());
    }

    onClick() {
        const inventory = Inventory.getInstance();
        if (inventory.addItem(this.item)) {
            this.remove();
        }
    }

    remove() {
        if (this.element && this.element.parentNode) {
            this.element.remove();
            this.element = null;
            const manager = FloorItemManager.getInstance();
            if (manager) {
                manager.removeItem(this);
            }
        }
    }

    static createRandomItem(x, y) {
        const items = [
            {
                id: 'test_emoji',
                name: 'Test Emoji',
                description: 'A test item to verify inventory pickup functionality.',
                emoji: '🎮',
                stackable: true,
                value: 50,
                quantity: 1
            },
            {
                id: 'gold_coin',
                name: 'Gold Coin',
                description: 'A valuable gold coin.',
                emoji: '🪙',
                stackable: true,
                value: 100,
                quantity: 1
            },
            {
                id: 'health_potion',
                name: 'Health Potion',
                description: 'Restores 50 HP.',
                emoji: '🧪',
                stackable: true,
                value: 50,
                quantity: 1
            },
            {
                id: 'trading_boost',
                name: 'Trading Boost',
                description: 'Increases trading profits by 50% for 30 seconds.',
                emoji: '⚡',
                stackable: true,
                value: 200,
                quantity: 1
            },
            {
                id: 'speed_boost',
                name: 'Speed Boost',
                description: 'Increases movement speed by 25% for 20 seconds.',
                emoji: '🚀',
                stackable: true,
                value: 150,
                quantity: 1
            }
        ];

        const randomItem = items[Math.floor(Math.random() * items.length)];
        return new FloorItem(x, y, randomItem);
    }
}

export default FloorItem; 