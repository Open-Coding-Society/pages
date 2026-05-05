
// Npc.js with dialogue REMOVED
import Character from "./Character.js";
// import DialogueSystem from "./DialogueSystem.js"; // ❌ disabled

class Npc extends Character {
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);
        this.interact = data?.interact;
        this.currentQuestionIndex = 0;
        this.alertTimeout = null;
        this.isInteracting = false;
        this.handleKeyDownBound = this.handleKeyDown.bind(this);
        this.handleKeyUpBound = this.handleKeyUp.bind(this);
        this.bindInteractKeyListeners();

        // Movement
        this.walkingArea = data?.walkingArea || null;
        this.speed = data?.speed || 1;
        this.moveDirection = data?.moveDirection || { x: 1, y: 1 };

        // Unique ID (still fine to keep)
        const sanitizedId = (data?.id || "").replace(/\s+/g, "_");
        this.uniqueId = sanitizedId + "_" + Math.random().toString(36).substr(2, 9);

        // ❌ Dialogue system completely removed
        this.dialogueSystem = null;

        if (gameEnv && gameEnv.gameControl) {
            gameEnv.gameControl.registerInteractionHandler(this);
        }
    }

    update() {
        if (this.walkingArea) {
            this.patrol();
        }
        this.draw();

        const players = this.gameEnv.gameObjects.filter(
            obj => obj && obj.state && obj.state.collisionEvents && obj.state.collisionEvents.includes(this.spriteData.id)
        );

        if (players.length === 0 && this.isInteracting) {
            this.isInteracting = false;
        }
    }

    patrol() {
        if (!this.moveDirection) this.moveDirection = { x: 1, y: 1 };
        if (!this.speed) this.speed = 1;

        this.position.x += this.moveDirection.x * this.speed;
        this.position.y += this.moveDirection.y * this.speed;

        if (this.position.x <= this.walkingArea.xMin) {
            this.position.x = this.walkingArea.xMin;
            this.moveDirection.x = 1;
            this.direction = 'right';
        }
        if (this.position.x + this.width >= this.walkingArea.xMax) {
            this.position.x = this.walkingArea.xMax - this.width;
            this.moveDirection.x = -1;
            this.direction = 'left';
        }

        if (this.position.y <= this.walkingArea.yMin) {
            this.position.y = this.walkingArea.yMin;
            this.moveDirection.y = 1;
        }
        if (this.position.y + this.height >= this.walkingArea.yMax) {
            this.position.y = this.walkingArea.yMax - this.height;
            this.moveDirection.y = -1;
        }
    }

    bindInteractKeyListeners() {
        document.addEventListener('keydown', this.handleKeyDownBound);
        document.addEventListener('keyup', this.handleKeyUpBound);
    }

    removeInteractKeyListeners() {
        document.removeEventListener('keydown', this.handleKeyDownBound);
        document.removeEventListener('keyup', this.handleKeyUpBound);

        if (this.alertTimeout) {
            clearTimeout(this.alertTimeout);
            this.alertTimeout = null;
        }

        this.isInteracting = false;
    }

    handleKeyDown(event) {
        if (event.key === 'e' || event.key === 'u') {
            this.handleKeyInteract();
        }
    }

    handleKeyUp(event) {
        if (event.key === 'e' || event.key === 'u') {
            if (this.alertTimeout) {
                clearTimeout(this.alertTimeout);
                this.alertTimeout = null;
            }
        }
    }

    handleKeyInteract() {
        if (this.gameEnv.gameControl && this.gameEnv.gameControl.isPaused) {
            return;
        }

        const players = this.gameEnv.gameObjects.filter(
            obj => obj && obj.state && obj.state.collisionEvents && obj.state.collisionEvents.includes(this.spriteData.id)
        );

        const hasInteract = this.interact !== undefined;

        if (players.length > 0 && hasInteract && !this.isInteracting) {
            this.isInteracting = true;

            const originalInteract = this.interact;
            originalInteract.call(this);

            if (this.gameEnv && this.gameEnv.gameControl && 
                !this.gameEnv.gameControl.isPaused) {
                setTimeout(() => {
                    this.isInteracting = false;
                }, 500);
            }
        }
    }

    // ❌ Dialogue functions disabled
    showReactionDialogue() { return; }
    showRandomDialogue() { return; }

    destroy() {
        if (this.gameEnv && this.gameEnv.gameControl) {
            this.gameEnv.gameControl.unregisterInteractionHandler(this);
        }

        this.removeInteractKeyListeners();
        super.destroy();
    }
}

export default Npc;