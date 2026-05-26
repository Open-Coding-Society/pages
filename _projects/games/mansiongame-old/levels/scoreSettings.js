/**
 * scoreSettings.js for Mansion Game
 * Configures what metrics are saved for the Mansion Game
 */

export const scoreSettings = {
    gameName: 'MansionGame',
    counterVar: 'levelsCompleted',
    counterLabel: 'Levels Completed',
    scoreVar: 'levelsCompleted',
    storageKey: 'pauseMenuStats:mansion',
    counterPerLevel: false,
    
    /**
     * Build custom DTO for Mansion Game
     */
    buildDto(pauseMenu) {
        const uid = 'guest';
        const varName = this.counterVar;
        
        // Sync stats with gameControl.stats
        if (pauseMenu.gameControl && pauseMenu.gameControl.stats) {
            pauseMenu.stats = pauseMenu.gameControl.stats;
        }
        
        const levels = pauseMenu.stats && pauseMenu.stats[varName] ? Number(pauseMenu.stats[varName]) : 0;
        const sessionTime = pauseMenu.stats && (pauseMenu.stats.sessionTime || pauseMenu.stats.elapsedMs || pauseMenu.stats.timePlayed || 0);

        const dto = {
            user: uid,
            score: pauseMenu.stats && pauseMenu.stats[this.scoreVar] ? Number(pauseMenu.stats[this.scoreVar]) : 0,
            levelsCompleted: levels,
            sessionTime: Number(sessionTime) || 0,
            totalPowerUps: (pauseMenu.stats && Number(pauseMenu.stats.totalPowerUps)) || 0,
            status: 'PAUSED',
            gameName: this.gameName,
            variableName: varName
        };
        console.log('MansionGame scoreSettings: built DTO', dto);
        return dto;
    }
};

export default scoreSettings;
