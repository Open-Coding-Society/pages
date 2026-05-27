import Character from '@assets/js/GameEnginev1.1/essentials/Character.js';

const POWER_UP_TYPES = ['shield', 'charge', 'damageBoost', 'scythes', 'heal'];

const POWER_UP_SPRITES = {
    shield: 'powerupShield.png',
    charge: 'powerupCharge.png',
    damageBoost: 'powerupDamageBoost.png',
    scythes: 'powerupScythe.png',
    heal: 'powerupHeal.png'
};

const DEFAULT_SIZE = 70;

class PowerUp extends Character {
    constructor(data = null, gameEnv = null) {
        const powerType = data?.powerType || PowerUp.randomType();
        const spritePath = PowerUp.getSpritePath(powerType, gameEnv);
        const targetSize = data?.targetSize || DEFAULT_SIZE;
        const scaleFactor = data?.SCALE_FACTOR || (gameEnv?.innerHeight ? (gameEnv.innerHeight / targetSize) : 11);
        const spriteData = {
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1 },
            id: data?.id || `PowerUp-${powerType}`,
            greeting: data?.greeting || 'Power up collected.',
            src: data?.src || spritePath,
            SCALE_FACTOR: scaleFactor,
            INIT_POSITION: data?.INIT_POSITION || { x: 0, y: 0 },
            pixels: data?.pixels || { width: 100, height: 100 },
            hitbox: data?.hitbox || { radiusPercentage: 0.5 },
            zIndex: data?.zIndex || 90
        };

        super(spriteData, gameEnv);

        this.powerType = powerType;
        this.collected = false;
        this.spriteData.reaction = () => this.collect();
        this.direction = 'down';
    }

    static randomType() {
        return POWER_UP_TYPES[Math.floor(Math.random() * POWER_UP_TYPES.length)];
    }

    update() {
        if (this.collected) return;
        if (!this.spriteData?.orientation) {
            this.spriteData.orientation = { rows: 1, columns: 1 };
        }
        super.update();
    }

    static getSpritePath(powerType, gameEnv) {
        const assetBase = gameEnv?.path || '';
        const filename = POWER_UP_SPRITES[powerType] || POWER_UP_SPRITES.shield;
        return `${assetBase}/images/projects/mansionGame/${filename}`;
    }

    collect() {
        if (this.collected) return;

        const player = this.getNearestFightingPlayer();
        if (!player || typeof player.applyPowerUp !== 'function') return;

        this.collected = true;
        player.applyPowerUp(this.powerType);
        this.destroy();
    }

    getNearestFightingPlayer() {
        const players = this.gameEnv.gameObjects.filter(obj =>
            obj.constructor.name === 'FightingPlayer'
        );
        if (players.length === 0) return null;

        let nearest = players[0];
        let nearestDistance = Infinity;
        for (const player of players) {
            const dx = player.position.x - this.position.x;
            const dy = player.position.y - this.position.y;
            const distance = dx * dx + dy * dy;
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearest = player;
            }
        }
        return nearest;
    }
}

export default PowerUp;
