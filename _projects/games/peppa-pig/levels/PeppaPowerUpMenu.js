class PeppaPowerUpMenu {
    constructor(gameEnv) {
        this.gameEnv = gameEnv;
        this.selectedOption = 0;
        this.options = [
            { name: 'Extra Speed', description: 'Move faster in battle' },
            { name: 'Extra Health', description: 'Start with more health' },
            { name: 'Extra Damage', description: 'Deal more damage per laser' }
        ];
        this.chosenPower = null;
        // Required for engine compatibility
        this.classes = [];
    }

    initialize() {
        // Disable speech synthesis
        if (window.speechSynthesis) {
            window.speechSynthesis.speak = () => {};
            window.speechSynthesis.cancel();
        }
        this.createMenu();
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        // Disable global exit key during menu
        this.gameEnv.gameControl.removeExitKeyListener();
    }

    destroy() {
        document.removeEventListener('keydown', this.handleKeyDown.bind(this));
        const menu = document.getElementById('peppa-powerup-menu');
        if (menu) menu.remove();
        // Re-enable global exit key after menu
        this.gameEnv.gameControl.addExitKeyListener();
    }

    createMenu() {
        const menu = document.createElement('div');
        menu.id = 'peppa-powerup-menu';
        menu.style.cssText = `
            position: fixed; inset: 0; z-index: 99999; display: flex; flex-direction: column;
            align-items: center; justify-content: center; background: rgba(0,0,0,0.9);
            color: #fff; font-family: Arial, sans-serif; text-align: center;
        `;
        menu.innerHTML = `
            <div style="font-size: 36px; font-weight: bold; margin-bottom: 20px;">Power-Up Menu</div>
            <div style="font-size: 18px; margin-bottom: 30px;">Choose your power-up for the final battle:</div>
            <div id="options" style="display: flex; flex-direction: column; gap: 15px;"></div>
            <div style="font-size: 14px; opacity: 0.7; margin-top: 30px;">Use UP/DOWN arrows to select, ENTER to choose</div>
        `;
        document.body.appendChild(menu);
        this.renderOptions();
    }

    renderOptions() {
        const optionsEl = document.getElementById('options');
        optionsEl.innerHTML = this.options.map((option, index) => `
            <div style="
                padding: 15px 20px;
                border: 2px solid ${index === this.selectedOption ? '#ffd700' : '#666'};
                border-radius: 8px;
                background: ${index === this.selectedOption ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.1)'};
                cursor: pointer;
                font-size: 18px;
                font-weight: bold;
                transition: all 0.2s;
            " data-index="${index}">
                ${option.name}
                <div style="font-size: 14px; font-weight: normal; opacity: 0.8; margin-top: 5px;">${option.description}</div>
            </div>
        `).join('');
    }

    handleKeyDown(event) {
        if (event.key === 'ArrowUp') {
            this.selectedOption = (this.selectedOption - 1 + this.options.length) % this.options.length;
            this.renderOptions();
        } else if (event.key === 'ArrowDown') {
            this.selectedOption = (this.selectedOption + 1) % this.options.length;
            this.renderOptions();
        } else if (event.key === 'Enter') {
            this.selectPower();
        } else if (event.key === 'Escape') {
            // Prevent skipping the menu
            event.preventDefault();
        }
        event.preventDefault();
    }

    selectPower() {
        this.chosenPower = this.options[this.selectedOption].name;
        // Store in gameControl for persistence across levels
        this.gameEnv.gameControl.chosenPower = this.chosenPower;
        // Transition to next level
        this.gameEnv.gameControl.currentLevel.continue = false;
    }

    update() {
        // No-op for compatibility with game loop
    }
}

export default PeppaPowerUpMenu;