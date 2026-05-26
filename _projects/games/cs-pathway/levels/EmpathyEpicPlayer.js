import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';

export default class EmpathyEpicPlayer extends Player {
    constructor(...args) {
        super(...args);
        
        // Disable regular keyboard tracking
        this.keypress = {}; 
        this.pressedKeys = {};

        // Speed config
        this.speed = 3.5;
        this.targetMouseX = this.x || 0;
        this.targetMouseY = this.y || 0;

        // Custom mouse track handler
        this.handleMouseMove = (e) => {
            const canvas = this.gameEnv?.gameContainer?.querySelector('canvas') || document.querySelector('canvas');
            if (canvas) {
                const rect = canvas.getBoundingClientRect();
                // Ensure coordinate scaling based on logic in nod-game or generic approach
                const scaleX = canvas.width / rect.width;
                const scaleY = canvas.height / rect.height;
                this.targetMouseX = (e.clientX - rect.left) * scaleX;
                this.targetMouseY = (e.clientY - rect.top) * scaleY;
            }
        };

        // We bind the listener globally or on the container
        document.addEventListener('mousemove', this.handleMouseMove);
    }

    bindMovementKeyListners() {
        // Overridden: prevent GameEngine Player from adding keyboard listeners
        // We will move with the head tracking / mouse logic
    }

    update() {
        if (!this.targetMouseX) {
            this.targetMouseX = this.x;
            this.targetMouseY = this.y;
        }

        const dx = this.targetMouseX - this.x;
        const dy = this.targetMouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Move towards cursor via velocity so collisions still work and Character.js handles x/y boundary checking
        if (dist > 5) {
            const angle = Math.atan2(dy, dx);
            this.velocity.x = Math.cos(angle) * this.speed;
            this.velocity.y = Math.sin(angle) * this.speed;
            
            // Required so Character knows the player is "moving" (helps animate sprites, etc.)
            this.moved = true; 
        } else {
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.moved = false;
        }

        // Call the parent Character/GameObject update for collisions and animation tick
        super.update();
    }

    destroy() {
        document.removeEventListener('mousemove', this.handleMouseMove);
        if (typeof super.destroy === 'function') {
            super.destroy();
        }
    }
}
