/**
 * NPC Interaction Manager - Handles showing/hiding interact button based on NPC proximity
 * This utility helps manage the conditional display of the interact button (E key)
 * when players are near NPCs in the adventure game.
 */

/**
 * Example usage in your game level or update loop:
 * Call this function in your game's update cycle to manage interact button visibility
 * 
 * @param {Player} player - The player object
 * @param {Array} npcs - Array of NPC objects in the current level
 */
function updateInteractButton(player, npcs) {
    if (!player || !player.touchControls) return;
    
    // Check if player is near any NPC
    let nearNpc = false;
    
    for (const npc of npcs) {
        if (npc && player.state && player.state.collisionEvents) {
            // Check if this NPC is in the player's collision events
            if (player.state.collisionEvents.includes(npc.spriteData.id)) {
                nearNpc = true;
                break;
            }
        }
    }
    
    // Show or hide interact button based on proximity
    if (nearNpc && !player.isInteractButtonVisible()) {
        player.showInteractButton();
    } else if (!nearNpc && player.isInteractButtonVisible()) {
        player.hideInteractButton();
    }
}

/**
 * Alternative proximity-based detection (if collision events aren't reliable)
 * Uses distance calculation to determine if player is near an NPC
 * 
 * @param {Player} player - The player object  
 * @param {Array} npcs - Array of NPC objects
 * @param {number} interactDistance - Maximum distance for interaction (default: 100)
 */
function updateInteractButtonByDistance(player, npcs, interactDistance = 100) {
    if (!player || !player.touchControls) return;
    
    let nearNpc = false;
    
    for (const npc of npcs) {
        if (npc && npc.x !== undefined && npc.y !== undefined) {
            // Calculate distance between player and NPC
            const dx = player.x - npc.x;
            const dy = player.y - npc.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= interactDistance) {
                nearNpc = true;
                break;
            }
        }
    }
    
    // Show or hide interact button based on proximity
    if (nearNpc && !player.isInteractButtonVisible()) {
        player.showInteractButton();
    } else if (!nearNpc && player.isInteractButtonVisible()) {
        player.hideInteractButton();
    }
}

/**
 * Example integration in GameLevelBasic.js or similar:
 * 
 * // In your game level class, add this to the update method:
 * update() {
 *     super.update();
 *     
 *     // Get player and NPCs
 *     const player = this.gameEnv.gameObjects.find(obj => obj instanceof Player);
 *     const npcs = this.gameEnv.gameObjects.filter(obj => obj instanceof Npc);
 *     
 *     // Update interact button visibility
 *     updateInteractButton(player, npcs);
 * }
 */

// Export for use in game levels
export { updateInteractButton, updateInteractButtonByDistance };