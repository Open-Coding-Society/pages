/**
 * End Ship Platformer - UI Manager
 * Handles user interface updates and messaging
 */

const UI = {
    /**
     * Initialize UI elements
     */
    init: function() {
        // No status message container to initialize anymore
        console.log('UI initialized for fullscreen mode');
    },
    
    /**
     * Update health bars for players
     * @param {Player} player - Player object
     */
    updateHealthBars: function(player) {
        if (player) {
            const healthPercentage = (player.health / player.maxHealth) * 100;
            const healthBar = document.getElementById('player1-health');
            if (healthBar) {
                healthBar.style.width = healthPercentage + '%';
            }
        }
    },
    
    /**
     * Show a temporary message (now just logs to console since no status area)
     * @param {String} message - Message to display
     * @param {Number} duration - Duration in milliseconds
     */
    showMessage: function(message, duration = 2000) {
        // Since we removed the status message area, just log to console
        // You could implement a temporary overlay here if desired
        console.log(`Game Message: ${message}`);
        
        // Optional: Could add a temporary floating message system here
        // For now, keeping it simple without the bottom message area
    },
    
    /**
     * Update player name display
     * @param {String} name - Player name
     */
    updatePlayerName: function(name) {
        const nameElement = document.getElementById('player1-name');
        if (nameElement) {
            nameElement.textContent = name;
        }
    },
    
    /**
     * Show/hide loading indicator (if needed)
     * @param {Boolean} show - Whether to show loading
     */
    showLoading: function(show) {
        // Could implement a loading overlay here if needed
        if (show) {
            console.log('Loading...');
        } else {
            console.log('Loading complete');
        }
    }
};