/**
 * scoreSettings.js for Adventure Game
 * Configures what metrics are saved for the Adventure Game (coins collected)
 */

export const scoreSettings = {
    gameName: 'AdventureGame',
    counterVar: 'coinsCollected',
    counterLabel: 'Coins Collected',
    scoreVar: 'coinsCollected',
    storageKey: 'pauseMenuStats:adventure',
    counterPerLevel: false,
    
    /**
     * Build custom DTO for Adventure Game
     */
    buildDto(pauseMenu) {
        const uid = 'guest';
        const varName = this.counterVar;
        
        // Sync stats with gameControl.stats
        if (pauseMenu.gameControl && pauseMenu.gameControl.stats) {
            pauseMenu.stats = pauseMenu.gameControl.stats;
        }
        
        const coins = pauseMenu.stats && pauseMenu.stats[varName] ? Number(pauseMenu.stats[varName]) : 0;
        const sessionTime = pauseMenu.stats && (pauseMenu.stats.sessionTime || pauseMenu.stats.elapsedMs || pauseMenu.stats.timePlayed || 0);

        const dto = {
            user: uid,
            score: pauseMenu.stats && pauseMenu.stats[this.scoreVar] ? Number(pauseMenu.stats[this.scoreVar]) : 0,
            coinsCollected: coins,
            sessionTime: Number(sessionTime) || 0,
            totalPowerUps: (pauseMenu.stats && Number(pauseMenu.stats.totalPowerUps)) || 0,
            status: 'PAUSED',
            gameName: this.gameName,
            variableName: varName
        };
        console.log('AdventureGame scoreSettings: built DTO', dto);
        return dto;
    }
};

export default scoreSettings;
