// Npc.js with DialogueSystem integration
import Character from "./Character.js";
import DialogueSystem from "../DialogueSystem.js";

class Npc extends Character {
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);
        this.interact = data?.interact; // Interact function
        this.currentQuestionIndex = 0;
        this.alertTimeout = null;
        this.isInteracting = false; // Flag to track if currently interacting
        this.handleKeyDownBound = this.handleKeyDown.bind(this);
        this.handleKeyUpBound = this.handleKeyUp.bind(this);
        this.bindInteractKeyListeners();
        
        // IMPORTANT: Create a unique ID for each NPC to avoid conflicts
        this.uniqueId = data?.id + "_" + Math.random().toString(36).substr(2, 9);
        
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
        this.draw();
        // Check if player is still in collision
        const players = this.gameEnv.gameObjects.filter(
            obj => obj.state.collisionEvents.includes(this.spriteData.id)
        );
        
        // Reset interaction state if player moved away
        if (players.length === 0 && this.isInteracting) {
            this.isInteracting = false;
        }
    }

    bindInteractKeyListeners() {
        // Add event listeners for keydown and keyup
        document.addEventListener('keydown', this.handleKeyDownBound);
        document.addEventListener('keyup', this.handleKeyUpBound);
    }

    removeInteractKeyListeners() {
        // Remove event listeners to prevent memory leaks
        document.removeEventListener('keydown', this.handleKeyDownBound);
        document.removeEventListener('keyup', this.handleKeyUpBound);
        
        // Clear any pending timeouts
        if (this.alertTimeout) {
            clearTimeout(this.alertTimeout);
            this.alertTimeout = null;
        }
        
        // Close any open dialogue
        if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) {
            this.dialogueSystem.closeDialogue();
        }
        
        // Reset interaction state
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
        // Check if game is active - don't allow interactions during transitions
        if (this.gameEnv.gameControl && this.gameEnv.gameControl.isPaused) {
            return;
        }
        
        // Check if dialogue is already open - close it instead of opening new one
        if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) {
            this.dialogueSystem.closeDialogue();
            return;
        }
        
        const players = this.gameEnv.gameObjects.filter(
            obj => obj.state.collisionEvents.includes(this.spriteData.id)
        );
        const hasInteract = this.interact !== undefined;

        // Only trigger interaction if:
        // 1. Player is in collision with this NPC
        // 2. NPC has an interact function
        // 3. Not already interacting
        if (players.length > 0 && hasInteract && !this.isInteracting) {
            this.isInteracting = true;
            
            // Store a reference to this NPC's interact function
            const originalInteract = this.interact;
            
            // Execute the interact function
            originalInteract.call(this);
            
            // Check if we're still in the same game level after interaction
            // This is important for transitions to other levels
            if (this.gameEnv && this.gameEnv.gameControl && 
                !this.gameEnv.gameControl.isPaused) {
                // Reset interaction state after a short delay
                // This prevents multiple rapid interactions
                setTimeout(() => {
                    this.isInteracting = false;
                }, 500);
            }
        }
    }
    
    // Method for showing reaction dialogue
    showReactionDialogue() {
        if (!this.dialogueSystem) return;
        
        // Get NPC name and avatar if available
        const npcName = this.spriteData?.id || "";
        const npcAvatar = this.spriteData?.src || null;
        
        // Show dialogue with greeting message
        const greeting = this.spriteData?.greeting || "Hello!";
        this.dialogueSystem.showDialogue(greeting, npcName, npcAvatar);
    }
    
    // Method for showing random interaction dialogue
    showRandomDialogue() {
        if (!this.dialogueSystem) return;
        
        // Get NPC name and avatar if available
        const npcName = this.spriteData?.id || "";
        const npcAvatar = this.spriteData?.src || null;
        
        // Show random dialogue
        this.dialogueSystem.showRandomDialogue(npcName, npcAvatar);
    }

    // Clean up event listeners when NPC is destroyed
    destroy() {
        // Unregister from game control
        if (this.gameEnv && this.gameEnv.gameControl) {
            this.gameEnv.gameControl.unregisterInteractionHandler(this);
        }
        
        this.removeInteractKeyListeners();
        super.destroy();
    }
}

export default Npc;