import Character from '../MansionLogic/Character.js';

/*
    Arm class for the Reaper boss.
    - Follows the boss using offsets
    - Can switch between weapon and empty images
    - Small animation when shooting
*/

class Arm extends Character {
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);

        this.xOffset = data?.xOffset ?? 0;
        this.yOffset = data?.yOffset ?? 0;

        // Weapon handling
        this.hasWeapon = data?.hasWeapon ?? false;
        this.weaponSrc = data?.weaponSrc ?? '';
        this.emptySrc = data?.emptySrc ?? '';
        this.src = this.hasWeapon ? this.weaponSrc : this.emptySrc;

        // Animation flags
        this.isShooting = false;
        this.shootingTimer = 0;
        this.shootingDuration = 200; // ms

        // Position
        this.position = { x: 0, y: 0 };
    }

    /**
     * Update arm position relative to boss and handle animation
     * @param {number} bossX 
     * @param {number} bossY 
     */
    update(bossX, bossY) {
        // Follow the boss
        this.position.x = bossX + this.xOffset;
        this.position.y = bossY + this.yOffset;

        // Handle shooting animation
        if (this.isShooting) {
            this.shootingTimer += this.gameEnv.deltaTime || 16;
            if (this.shootingTimer >= this.shootingDuration) {
                this.isShooting = false;
                this.shootingTimer = 0;
            }
        }

        // Update sprite based on weapon status
        this.src = this.hasWeapon ? this.weaponSrc : this.emptySrc;

        // Draw to screen
        this.draw();
    }

    /**
     * Trigger a small shooting animation
     */
    shoot() {
        this.isShooting = true;
        this.shootingTimer = 0;
    }

    /**
     * Temporarily remove weapon (e.g., throwing scythe)
     */
    removeWeapon() {
        this.hasWeapon = false;
        this.src = this.emptySrc;
    }

    /**
     * Restore weapon (e.g., scythe returned)
     */
    restoreWeapon() {
        this.hasWeapon = true;
        this.src = this.weaponSrc;
    }
}

export default Arm;
