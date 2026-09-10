// enpeecee.js with DialogueSystem integration
import Character from "@assets/js/GameEnginev1.1/essentials/Character.js";
import DialogueSystem from "@assets/js/GameEnginev1.1/essentials/DialogueSystem.js";

class Npc extends Character {
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);
        this.currentQuestionIndex = 0;
        this.alertTimeout = null;
        this.isInteracting = false; // Flag to track if currently interacting

        // --- Patrol/Movement properties from data ---
        this.walkingArea = data?.walkingArea || null;
        this.speed = data?.speed || 1;
        this.moveDirection = data?.moveDirection || { x: 1, y: 1 };

        // IMPORTANT: Create a unique ID for each NPC to avoid conflicts
        // Sanitize id to remove/replace spaces (spaces are not valid in DOM tokens)
        const sanitizedId = (data?.id || "").replace(/\s+/g, "_");
        this.uniqueId = sanitizedId + "_" + Math.random().toString(36).substr(2, 9);

        // IMPORTANT: Create a local dialogue system for this NPC specifically
        if (data?.dialogues) {
            this.dialogueSystem = new DialogueSystem({
                dialogues: data.dialogues,
                id: this.uniqueId
            });
        } else {
            // Create a default dialogue system with a greeting based on NPC data
            const greeting = data?.greeting || "Hello, traveler!";
            this.dialogueSystem = new DialogueSystem({
                dialogues: [
                    greeting,
                    "Nice weather we're having, isn't it?",
                    "I've been standing here for quite some time."
                ],
                // Pass unique ID to prevent conflicts
                id: this.uniqueId
            });
        }

        // Register with game control for cleanup during transitions
        if (gameEnv && gameEnv.gameControl) {
            gameEnv.gameControl.registerInteractionHandler(this);
        }
    }

    update() {
        // Call parent update for collision detection
        super.update();

        // General patrol logic for any NPC with walkingArea
        if (this.walkingArea) {
            this.patrol();
        }
    }

    /**
     * General patrol movement within defined walking area (bouncing behavior)
     */
    patrol() {
        // Use moveDirection and speed, defaulting if not set
        if (!this.moveDirection) this.moveDirection = { x: 1, y: 1 };
        if (!this.speed) this.speed = 1;
        // Update position based on direction and speed
        this.position.x += this.moveDirection.x * this.speed;
        this.position.y += this.moveDirection.y * this.speed;

        // Bounce off left/right boundaries and update sprite direction
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

        // Bounce off top/bottom boundaries
        if (this.position.y <= this.walkingArea.yMin) {
            this.position.y = this.walkingArea.yMin;
            this.moveDirection.y = 1;
        }
        if (this.position.y + this.height >= this.walkingArea.yMax) {
            this.position.y = this.walkingArea.yMax - this.height;
            this.moveDirection.y = -1;
        }
    }

    // Method for showing reaction dialogue
    showReactionDialogue() {
        if (!this.dialogueSystem) return;

        const npcName = this.spriteData?.id || "";
        const npcAvatar = this.spriteData?.src || null;

        const dialogue = this.dialogueSystem?.dialogues?.[0] || this.spriteData?.dialogues?.[0] || this.spriteData?.greeting || "Hello!";
        if (this.spriteData?.greeting === false && !this.spriteData?.dialogues?.length) {
            console.log("Greeting set to false and no dialogue entries provided!")
            return;
        }
        this.dialogueSystem.showDialogue(dialogue, npcName, npcAvatar, this.spriteData);
    }

    // Method for showing random interaction dialogue
    showRandomDialogue() {
        if (!this.dialogueSystem) return;

        const npcName = this.spriteData?.id || "";
        const npcAvatar = this.spriteData?.src || null;

        this.dialogueSystem.showRandomDialogue(npcName, npcAvatar, this.spriteData);
    }

    // Clean up event listeners when NPC is destroyed
    destroy() {
        if (this.gameEnv && this.gameEnv.gameControl) {
            this.gameEnv.gameControl.unregisterInteractionHandler(this);
        }

        super.destroy();
    }
}

export default Npc;
