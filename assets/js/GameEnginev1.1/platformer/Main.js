/**
 * End Ship Platformer - Main Entry Point
 * Initializes the game and handles overall game state
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('End Ship Platformer - Fullscreen Game Initializing');
    
    // Initialize UI
    UI.init();
    
    // Create game instance without background image for now
    // You can add a background image path here when you have one
    // const backgroundImagePath = 'images/end-background.jpg'; // Example path
    const game = new Game(); // No background for now
    
    // You can also set the background image later:
    // game.setBackgroundImage('path/to/another/background.png');
    
    // Handle window resizing for fullscreen
    window.addEventListener('resize', resizeGame);
    resizeGame();
    
    // Handle visibility change (tab switching)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && game.currentState === CONFIG.STATES.PLAYING) {
            game.pauseGame();
        }
    });
    
    /**
     * Resizes the game for fullscreen mode
     */
    function resizeGame() {
        // Update CONFIG values for new screen size
        CONFIG.CANVAS.WIDTH = window.innerWidth;
        CONFIG.CANVAS.HEIGHT = window.innerHeight;
        
        // Update all scaled configurations
        updateConfigForResize();
        
        // Update canvas size if game exists
        if (window.game && window.game.canvas) {
            window.game.handleResize();
            
            // Reposition existing game objects if they exist
            if (window.game.player1) {
                // Scale player position
                const scaleX = CONFIG.CANVAS.WIDTH / CONFIG.CANVAS.BASE_WIDTH;
                const scaleY = CONFIG.CANVAS.HEIGHT / CONFIG.CANVAS.BASE_HEIGHT;
                
                // Keep player proportionally positioned
                const playerRelativeX = window.game.player1.x / (CONFIG.CANVAS.WIDTH / scaleX);
                const playerRelativeY = window.game.player1.y / (CONFIG.CANVAS.HEIGHT / scaleY);
                
                window.game.player1.x = Math.min(playerRelativeX * scaleX, CONFIG.CANVAS.WIDTH - window.game.player1.width);
                window.game.player1.y = Math.min(playerRelativeY * scaleY, CONFIG.ENVIRONMENT.FLOOR_Y - window.game.player1.height);
            }
            
            // Update enemy positions if they exist
            if (window.game.enemies) {
                const scaleX = CONFIG.CANVAS.WIDTH / CONFIG.CANVAS.BASE_WIDTH;
                const scaleY = CONFIG.CANVAS.HEIGHT / CONFIG.CANVAS.BASE_HEIGHT;
                
                window.game.enemies.forEach(enemy => {
                    // Keep enemies proportionally positioned
                    const enemyRelativeX = enemy.x / (CONFIG.CANVAS.WIDTH / scaleX);
                    const enemyRelativeY = enemy.y / (CONFIG.CANVAS.HEIGHT / scaleY);
                    
                    enemy.x = Math.min(enemyRelativeX * scaleX, CONFIG.CANVAS.WIDTH - enemy.width);
                    enemy.y = Math.min(enemyRelativeY * scaleY, CONFIG.ENVIRONMENT.FLOOR_Y - enemy.height);
                });
            }
        }
        
        console.log(`Game resized to: ${CONFIG.CANVAS.WIDTH}x${CONFIG.CANVAS.HEIGHT}`);
    }
    
    console.log('End Ship Platformer - Game-in-game Initialized');
});

// Global function to change background image during gameplay
window.changeBackground = function(imagePath) {
    if (window.game) {
        window.game.setBackgroundImage(imagePath);
    }
};