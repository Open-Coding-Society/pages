/**
 * End Ship Platformer Game Configuration
 * Contains all game constants and settings
 */

// Platform configurations
const PLATFORM_CONFIGS = {
    END: [
        { x: 0, y: 800, width: 400, height: 20 }, // End ship platforms
        { x: 1520, y: 800, width: 400, height: 20 },
        { x: 600, y: 650, width: 300, height: 20 },
        { x: 1020, y: 650, width: 300, height: 20 },
        { x: 860, y: 500, width: 200, height: 20 },
    ]
};

// Enemy spawn configurations
const ENEMY_SPAWNS = {
    END: [
        { x: 500, y: 700 },   // Ground level enemies
        { x: 1200, y: 700 },
        { x: 700, y: 550 },   // Platform enemies
        { x: 1100, y: 550 },
        { x: 900, y: 400 }    // High platform enemy
    ]
};

// Track current configurations
let currentPlatformConfig = 'END';
let currentEnemyConfig = 'END';

// Function to set the current platform configuration
function setPlatformConfig(configName) {
    if (PLATFORM_CONFIGS[configName]) {
        currentPlatformConfig = configName;
        // Update the CONFIG object with the new platform configuration
        CONFIG.ENVIRONMENT.PLATFORMS = PLATFORM_CONFIGS[currentPlatformConfig];
        return true;
    }
    return false;
}

// Function to set the current enemy spawn configuration
function setEnemyConfig(configName) {
    if (ENEMY_SPAWNS[configName]) {
        currentEnemyConfig = configName;
        CONFIG.ENEMY.SPAWN_POINTS = ENEMY_SPAWNS[currentEnemyConfig];
        return true;
    }
    return false;
}

// Function to get the current platform configuration
function getCurrentPlatformConfig() {
    return currentPlatformConfig;
}

// Function to get the current enemy configuration
function getCurrentEnemyConfig() {
    return currentEnemyConfig;
}

const CONFIG = {
    // Canvas settings - NOW FULLSCREEN
    CANVAS: {
        WIDTH: window.innerWidth,
        HEIGHT: window.innerHeight
    },
    
    // Game settings
    GAME: {
        FPS: 60,
        GRAVITY: 0.8,
        DEBUG_MODE: false
    },
    
    // Player settings
    PLAYER: {
        START_X: 200,
        START_Y: 700, // Adjusted to be above the platform
        WIDTH: 50,
        HEIGHT: 80,
        SPEED: 8,
        JUMP_FORCE: 20,
        MAX_HEALTH: 100,
        PROJECTILE_COOLDOWN: 1000, // ms between shots
        COLOR: "#9b30ff" // Purple for End theme
    },
    
    // Projectile settings
    PROJECTILE: {
        WIDTH: 20,
        HEIGHT: 6,
        SPEED: 30,
        DAMAGE: 1,
        MAX_DISTANCE: 2000, // Maximum travel distance
        COLOR: "#FFD700" // Gold color
    },
    
    // Enemy settings
    ENEMY: {
        WIDTH: 40,
        HEIGHT: 40,
        SPEED: 2, // Slower than player
        MAX_HEALTH: 1, // One hit to kill
        COLOR: "#8B0000", // Dark red
        DIRECTION_CHANGE_CHANCE: 0.015, // 1.5% chance per tick to change direction
        SPAWN_POINTS: ENEMY_SPAWNS.END // Default spawn points
    },
    
    // Environment settings - UPDATED FOR FULLSCREEN
    ENVIRONMENT: {
        FLOOR_Y: window.innerHeight - 100, // Dynamic floor based on screen height
        PLATFORMS: PLATFORM_CONFIGS.END, 
        FLOOR_ACTIVE: true,
        PITS: [], // Can add pit locations here
        WALLS: [], // Can add wall locations here
        WORLD_BOUNDS: {
            LEFT: 0,
            RIGHT: window.innerWidth, // Dynamic width
            TOP: 0,
            BOTTOM: window.innerHeight // Dynamic height
        }
    },
    
    // Game states
    STATES: {
        PLAYING: "playing",
        PAUSED: "paused",
        GAME_OVER: "game_over"
    }
};

// Export for use in other files
window.CONFIG = CONFIG;
window.PLATFORM_CONFIGS = PLATFORM_CONFIGS;
window.ENEMY_SPAWNS = ENEMY_SPAWNS;
window.setPlatformConfig = setPlatformConfig;
window.setEnemyConfig = setEnemyConfig;
window.getCurrentPlatformConfig = getCurrentPlatformConfig;
window.getCurrentEnemyConfig = getCurrentEnemyConfig;