import showDialogBox from './DialogBox.js';

class NpcProgressSystem {
    constructor() {
        this.progressionOrder = [
            "Stock-NPC",
            "Fidelity",
            "Schwab",
            "Casino-NPC",
            "Crypto-NPC",
            "Bank-NPC"
        ];
    }

    /**
     * Checks if the player can interact with the given NPC based on progression.
     * @param {Game} game - The main game instance.
     * @param {string} npcId - The id of the NPC to check.
     * @returns {Promise<boolean>} - Resolves to true if allowed, false if not.
     */
    async checkNpcProgress(game, npcId) {
        if (!game || !game.statsManager || !game.id) {
            return true; // fallback: allow interaction if game context is missing
        }
        try {
            const npcProgress = await game.statsManager.getNpcProgress(game.id);
            if (!npcProgress || !(npcId in npcProgress)) {
                return true; // fallback: allow interaction if progress data is missing
            }
            if (!npcProgress[npcId]) {
                // Find the first NPC in order that is still false
                const nextNpcId = this.progressionOrder.find(id => npcProgress[id] === false);
                let message;
                if (nextNpcId && nextNpcId !== npcId) {
                    message = `You must visit ${nextNpcId.replace(/-/g, ' ')} before talking to ${npcId.replace(/-/g, ' ')}!`;
                } else {
                    message = `You must visit the required NPC before talking to ${npcId.replace(/-/g, ' ')}!`;
                }
                showDialogBox('NPC Locked', message, [
                    { label: 'OK', action: () => {}, keepOpen: false }
                ]);
                return false;
            }
            return true;
        } catch (err) {
            return true; // On error, fallback to allow interaction
        }
    }
}

export default NpcProgressSystem; 