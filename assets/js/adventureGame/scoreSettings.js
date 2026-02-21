/**
 * scoreSettings.js for Adventure Game
 * Tracks and saves coins collected.
 */

export const scoreSettings = {
    gameName: 'AdventureGame',
    counterVar: 'coinsCollected',
    counterLabel: 'Coins Collected',
    scoreVar: 'coinsCollected',
    storageKey: 'pauseMenuStats:adventure',
    counterPerLevel: false,

    buildDto(pauseMenu) {
        const uid = 'guest';
        const varName = this.counterVar;

        if (pauseMenu.gameControl && pauseMenu.gameControl.stats) {
            pauseMenu.stats = pauseMenu.gameControl.stats;
        }

        const coins = pauseMenu.stats && pauseMenu.stats[varName] ? Number(pauseMenu.stats[varName]) : 0;
        const sessionTime = pauseMenu.stats && (pauseMenu.stats.sessionTime || pauseMenu.stats.elapsedMs || pauseMenu.stats.timePlayed || 0);

        const dto = {
            user: uid,
            score: coins,
            coinsCollected: coins,
            sessionTime: Number(sessionTime) || 0,
            status: 'PAUSED',
            gameName: this.gameName,
            variableName: varName
        };
        console.log('AdventureGame scoreSettings: built DTO', dto);
        return dto;
    }
};

export default scoreSettings;
