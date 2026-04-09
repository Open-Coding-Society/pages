// FriendlyNpc.js - A friendly NPC that toasts when nearby and responds to E key
import Npc from "./Npc.js";

class FriendlyNpc extends Npc {
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);
        this.toastShown = false; // Only show the approach toast once per visit
        this.wasNearPlayer = false; // Track previous proximity state
    }

    update() {
        super.update();
        this.checkProximityToast();
    }

    // Show a toast when player first enters range, hide state when they leave
    checkProximityToast() {
        const nearPlayer = this.canInteractWithPlayer();

        if (nearPlayer && !this.wasNearPlayer) {
            // Player just entered range
            if (!this.toastShown) {
                const name = this.spriteData?.id || 'NPC';
                this.showProximityToast(`Press E to talk to ${name}`);
                this.toastShown = true;
            }
            this.wasNearPlayer = true;
        } else if (!nearPlayer && this.wasNearPlayer) {
            // Player left range - reset so toast shows again next visit
            this.wasNearPlayer = false;
            this.toastShown = false;
        }
    }

    showProximityToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 99999;
            background: #0d0d1a; border: 2px solid #4ecca3;
            color: #4ecca3; font-family: 'Courier New', monospace; font-size: 13px;
            padding: 12px 20px; border-radius: 6px; letter-spacing: 1px;
            box-shadow: 0 0 20px rgba(78,204,163,0.3);
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    }

    // Override handleKeyInteract to only fire for the nearest FriendlyNpc
    handleKeyInteract() {
        if (!this.isNearestFriendlyNpcToPlayer()) return;
        super.handleKeyInteract();
    }

    isNearestFriendlyNpcToPlayer() {
        const player = this.findPlayer();
        if (!player) return false;

        const myDist = Math.hypot(
            (this.position.x + this.width / 2) - (player.position.x + player.width / 2),
            (this.position.y + this.height / 2) - (player.position.y + player.height / 2)
        );

        const otherFriendlyNpcs = this.gameEnv.gameObjects.filter(
            obj => obj instanceof FriendlyNpc && obj !== this && obj.canInteractWithPlayer()
        );

        // No other FriendlyNpcs in range - we're automatically the nearest
        if (otherFriendlyNpcs.length === 0) return true;

        return otherFriendlyNpcs.every(other => {
            const otherDist = Math.hypot(
                (other.position.x + other.width / 2) - (player.position.x + player.width / 2),
                (other.position.y + other.height / 2) - (player.position.y + player.height / 2)
            );
            return myDist <= otherDist;
        });
    }
}

export default FriendlyNpc;