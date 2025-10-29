// Collectible.js with DialogueSystem integration
import Character from "./Character.js";
import DialogueSystem from "../DialogueSystem.js";

class Collectible extends Character {
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);
        this.interact = data?.interact;
        this.alertTimeout = null;
        this.isInteracting = false; // Flag to track if currently interacting
        this.handleKeyDownBound = this.handleKeyDown.bind(this);
        this.handleKeyUpBound = this.handleKeyUp.bind(this);
        this.bindInteractKeyListeners();
        
        // Initialize dialogue system if needed
        if (data?.dialogues) {
            this.dialogueSystem = new DialogueSystem({
                dialogues: data.dialogues,
                enableSound: data.enableDialogueSound
            });
        } else {
            // Create a default dialogue with the item greeting
            const itemMessage = data?.greeting || "Press E to interact.";
            this.dialogueSystem = new DialogueSystem({
                dialogues: [itemMessage]
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
            // Close dialogue if player moves away
            if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) {
                this.dialogueSystem.closeDialogue();
            }
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
        
        // Find players in collision with this collectible
        const players = this.gameEnv.gameObjects.filter(
            obj => obj.state.collisionEvents.includes(this.spriteData.id)
        );
        
        // Check if this collectible has an interact function
        const hasInteract = this.interact !== undefined;

        // Only trigger interaction if:
        // 1. Player is in collision with this collectible
        // 2. Collectible has an interact function
        if (players.length > 0 && hasInteract) {
            // Store a reference to this collectible's interact function
            const originalInteract = this.interact;
            
            // Execute the interact function
            originalInteract.call(this);
            
            // IMPORTANT: Always reset the interaction state immediately
            // This ensures we can interact multiple times with the same collectible
            this.isInteracting = false;
        }
    }
    
    // Method for showing item message
    showItemMessage() {
        if (!this.dialogueSystem) return;
        
        // Get item name and icon if available
        const itemName = this.spriteData?.id || "";
        const itemIcon = this.spriteData?.src || null;
        
        // Show dialogue with item message
        const message = this.spriteData?.greeting || "Press E to interact.";
        this.dialogueSystem.showDialogue(message, itemName, itemIcon);
    }

    // Clean up event listeners when Collectible is destroyed
    destroy() {
        // Unregister from game control
        if (this.gameEnv && this.gameEnv.gameControl) {
            this.gameEnv.gameControl.unregisterInteractionHandler(this);
        }
        
        this.removeInteractKeyListeners();
        super.destroy();
    }
}

export default Collectible;