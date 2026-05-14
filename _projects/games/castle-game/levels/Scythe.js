import Enemy from '@assets/js/GameEnginev1.1/essentials/Enemy.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import showDeathScreen from './DeathScreen.js';

class Scythe extends Enemy {
    constructor(gameEnv, spawnX = null) {
        const path = gameEnv.path;
        const width = gameEnv.innerWidth;

        // Random spawn position at top of screen
        // Get the player position
        const players = gameEnv.gameObjects.filter(obj => obj instanceof Player);
        if (players.length === 0) {
            console.error("No player found in game environment");
            return;
        }
        const player = players[0];
        const spawnXPos = player.position.x;
        const spawnYPos = player.position.y;

        const targetXPos = spawnX !== null ? spawnX : Math.random() * (width - 64);
        const targetYPos = -64;

        const scytheData = {
            id: `scythe_${Math.random().toString(36).substr(2, 9)}`,
            src: path + "/images/mansionGame/scythe.png",
            SCALE_FACTOR: 10,
            ANIMATION_RATE: 10,
            pixels: { width: 64, height: 64 },
            INIT_POSITION: {
                x: spawnXPos,
                y: spawnYPos
            },
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1 },
            hitbox: { widthPercentage: 0.3, heightPercentage: 0.3 }
        };

        super(scytheData, gameEnv);

        // Initialize hittingNPC flag
        this._hittingNPC ??= false;

        // Check for NPC collision
        this.checkNPCCollision();

        // Disable dialogue system for scythes - they shouldn't talk to players
        if (this.dialogueSystem) {
            this.dialogueSystem = null;
        }
        
        // Remove interact key listeners to prevent dialogue triggers
        if (this.removeInteractKeyListeners) {
            this.removeInteractKeyListeners();
        }

        // All the logic to update the NPC position and rotation
        // Ellipse motion properties (similar to Mansion game's Boomerang)
        this.source_coords = { x: spawnXPos, y: spawnYPos };
        this.target_coords = { x: targetXPos, y: targetYPos };

        // Calculate ellipse center and dimensions
        this.ellipse_center = {
            x: (spawnXPos + targetXPos) / 2,
            y: (spawnYPos + targetYPos) / 2
        };

        this.ellipse_width = Math.sqrt((targetXPos - spawnXPos) ** 2 + (targetYPos - spawnYPos) ** 2);
        this.ellipse_height = this.ellipse_width / 3; // Make it less tall for better arc
        this.ellipse_tilt = Math.atan2(targetYPos - spawnYPos, targetXPos - spawnXPos);

        // Motion properties
        this.radian_prog = 0;
        this.radian_limit = 2 * Math.PI; // Full ellipse (top to bottom)
        this.projectileSpeed = 0.01; // Radians per update

        // State tracking
        this.revComplete = false;
        this.rotationAngle = 0;
        this.rotationSpeed = 0.1; // Spinning speed

        // Override default velocity since we use ellipse motion
        this.velocity.x = 0;
        this.velocity.y = 0;

        // Manual image loading like Projectile class
        this.spriteSheet = new Image();
        this.imageLoaded = false;
        this.spriteSheet.onload = () => {
            this.imageLoaded = true;
        };
        this.spriteSheet.src = path + "/images/mansionGame/scythe.png";
    }

    update() {
        if (this.revComplete) return;

        // Update whether we are hitting the NPC
        this.checkNPCCollision();

        // Update positioning logic is only necisary when we aren't stuck
        if (!this._hittingNPC) {
            // Check if scythe has completed its path
            if (this.radian_prog >= this.radian_limit) {
                this.revComplete = true;
                this.destroy();
                return;
            }

            // Update position along elliptical path
            this.radian_prog += this.projectileSpeed;

            const cosProg = Math.cos(this.radian_prog);
            const sinProg = Math.sin(this.radian_prog);
            const cosTilt = Math.cos(this.ellipse_tilt);
            const sinTilt = Math.sin(this.ellipse_tilt);

            const x_coord = this.ellipse_center.x +
                (this.ellipse_width / 2) * cosProg * cosTilt -
                this.ellipse_height * sinProg * sinTilt;

            const y_coord = this.ellipse_center.y +
                (this.ellipse_width / 2) * cosProg * sinTilt +
                this.ellipse_height * sinProg * cosTilt;

            this.position.x = x_coord;
            this.position.y = y_coord;

            // Update rotation for spinning effect
            this.rotationAngle += this.rotationSpeed;

            // Check for collisions with player
            this.checkPlayerCollision();
        }

        super.update();
    }

    checkPlayerCollision() {
        // Find all player objects
        const players = this.gameEnv.gameObjects.filter(obj =>
            obj.constructor.name === 'Player' ||
            (obj.isPlayer !== undefined && obj.isPlayer)
        );

        if (players.length === 0) return;

        // Check collision with each player using relative hit distance
        for (const player of players) {
            // Calculate center points of both sprites
            const scytheCenterX = this.position.x + this.width / 2;
            const scytheCenterY = this.position.y + this.height / 2;
            const playerCenterX = player.position.x + player.width / 2;
            const playerCenterY = player.position.y + player.height / 2;

            // Calculate distance between center points
            const dx = playerCenterX - scytheCenterX;
            const dy = playerCenterY - scytheCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Use relative hit distance based on sprite sizes
            const HIT_DISTANCE = (this.width + player.width) / 3; // One-third of combined width

            if (distance <= HIT_DISTANCE) {
                this.handleCollisionWithPlayer();
                break;
            }
        }
    }

    checkNPCCollision() {
        // Find all NPC objects
        const npcs = this.gameEnv.gameObjects.filter(obj =>
            obj.constructor.name === 'Npc' ||
            (obj.isNpc !== undefined && obj.isNpc)
        );

        if (npcs.length === 0) return;

        // Check collision with each NPC using relative hit distance
        for (const npc of npcs) {
            // Calculate center points of both sprites
            const scytheCenterX = this.position.x + this.width / 2;
            const scytheCenterY = this.position.y + this.height / 2;
            const npcCenterX = npc.position.x + npc.width / 2;
            const npcCenterY = npc.position.y + npc.height / 2;

            // Calculate distance between center points
            const dx = npcCenterX - scytheCenterX;
            const dy = npcCenterY - scytheCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Use relative hit distance based on sprite sizes
            const HIT_DISTANCE = (this.width + npc.width) / 3; // One-third of combined width

            if (distance <= HIT_DISTANCE) {
                this._hittingNPC = true;
                break;
            }
        }
    }

    handleCollisionWithPlayer() {
        // Mark scythe as complete and destroy it
        this.revComplete = true;
        this.destroy();

        // Find the player object
        const player = this.gameEnv.gameObjects.find(obj => obj.constructor.name === 'Player');

        // Display that the user has failed the game
        showDeathScreen(player);
    }

    draw() {
        if (!this.imageLoaded) {
            return;
        }

        // Use parent's canvas system like Character class
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // Apply rotation transformation
        this.ctx.save();
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.rotate(this.rotationAngle);

        // Draw the scythe
        this.ctx.drawImage(
            this.spriteSheet,
            0, 0, this.spriteSheet.naturalWidth, this.spriteSheet.naturalHeight,
            -this.width / 2, -this.height / 2, this.width, this.height
        );

        this.ctx.restore();

        // Set up canvas position (this handles positioning)
        this.setupCanvas();
    }

    handleCollisionEvent() {
        // This method is called by the collision system
        // We'll handle collisions in our own checkPlayerCollision method
    }

    destroy() {
        // Remove from gameObjects array
        const index = this.gameEnv.gameObjects.indexOf(this);
        if (index > -1) {
            this.gameEnv.gameObjects.splice(index, 1);
        }

        // Remove canvas from container
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }

        // Call parent destroy if it exists
        if (super.destroy) {
            super.destroy();
        }
    }
}

export default Scythe;

