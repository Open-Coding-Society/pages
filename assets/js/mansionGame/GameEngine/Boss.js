import Enemy from './Enemy.js';
import Boomerang from './Boomerang.js';
import Projectile from './Projectile.js';

/*  This is a file for the Game Engine made by the Tinkerers (lvl6)
    Do not delete this file.
    - Tinkerers

    Boomerang class: used to make the scythe
    Projectile class: used to make the arrows/fireballs

*/

// The Reaper is a more powerful enemy that moves towards the player and performs various attacks
class Boss extends Enemy {
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);
        this.stage = 1;
        this.isThrowingScythe = false;
        this.fullHealth = 1500;
        this.helthPoints = this.fullHealth;
        this.arrows = [];
        this.fireballs = [];
        this.angerModifier = 1;  // Increase this once hp gets low and boss is angry
        this.projectileSpeed = 5;  // This applies to all projectiles
        this.scythes = [];
    }

    // Overwrite the update method to add movement towards the nearest player
    update() {
        // Start by drawing the enemy to the screen
        this.draw();

        // Set the stage & update angerModifer
        const healthRatio = this.healthPoints / this.fullHealth;
        if (healthRatio < 2 / 3) {
            this.stage = 2;
        } else if (healthRatio < 1 / 3) {
            this.stage = 3;
            this.angerModifier = 2;
        } else if (this.healthPoints <= 0) {
            this.stage = 4;
            this.angerModifier = 1;
        }

        // Add code here to move each arrow and fireball towards the player
        for (const fireball of this.fireballs) {
            fireball.update(this.projectileSpeed);
        }
        for (const arrow of this.arrows) {
            arrow.update(this.projectileSpeed);
        }

        // If the Reaper is throwing the scythe, then don't move (to simplify calculations)
        if (this.isThrowingScythe) {
            return;
        }

        // Direct copy-paste from the Enderman in the adventure game -- VERIFY THIS WORKS
        // Find all player objects
        const players = this.gameEnv.gameObjects.filter(obj => 
            obj.constructor.name === 'Player'
        );

        if (players.length === 0) return;
        
        // Find nearest player
        let nearest = players[0];
        let minDist = Infinity;

        for (const player of players) {
            const dx = player.position.x - this.position.x;
            const dy = player.position.y - this.position.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < minDist) {
                minDist = dist;
                nearest = player;
            }
        }

        // Move towards nearest player
        const Reaperspeed = 0.5; // Adjust speed as needed -- Enderman speed from adventureGame: 1.5
        const dx = nearest.position.x - this.position.x;
        const dy = nearest.position.y - this.position.y;
        const ReaperPlayerangle = Math.atan2(dy, dx);

        // Update position
        this.position.x += Math.cos(ReaperPlayerangle) * Reaperspeed;
        this.position.y += Math.sin(ReaperPlayerangle) * Reaperspeed;
    }

    // For now, disable the Reaper from exploding (we may change this later)
    explode(x, y) {
        // We don't want our Reaper exploding
        throw new Error("Reapers cannot explode! (yet :})");
    }

    // Now we'll define attacks, starting with the scythe
    scytheAttack() {
        this.isThrowingScythe = true;
        // Put logic for scytheAttack here
        this.scythes.push(new Boomerang(this.gameEnv, nearest.position.x, nearest.position.y, this.position.x, this.position.y));
        // TODO: finish logic for scythe updates & collision with player
        this.isThrowingScythe = false;
    }

    // This is the fireball attack, create a new Fireball
    fireballAttack() {
        // Add attack logic here
        this.fireballs.push(new Projectile());
    }

    // This is the arrow attak, create a new arrow
    arrowAttack() {
        // Add attack logic here
        this.arrows.push(new Projectile());
    }
}

export default Boss;