import Character from '@assets/js/GameEnginev1.1/essentials/Character.js';

const POWER_UP_TYPES = ['shield', 'charge', 'damageBoost', 'scythes'];

const POWER_UP_DISPLAY = {
    shield: { label: 'SHIELD', icon: 'S', color: '#4CC9F0', glow: 'rgba(76, 201, 240, 0.9)' },
    charge: { label: 'CHARGE', icon: 'C', color: '#FFD166', glow: 'rgba(255, 209, 102, 0.95)' },
    damageBoost: { label: 'DAMAGE', icon: 'D', color: '#EF476F', glow: 'rgba(239, 71, 111, 0.9)' },
    scythes: { label: 'SCYTHE', icon: 'X', color: '#B8F2E6', glow: 'rgba(184, 242, 230, 0.85)' }
};

class PowerUp extends Character {
    constructor(data = null, gameEnv = null) {
        const powerType = data?.powerType || PowerUp.randomType();
        const display = POWER_UP_DISPLAY[powerType] || POWER_UP_DISPLAY.shield;
        const spriteData = {
            id: data?.id || `PowerUp-${powerType}`,
            greeting: data?.greeting || 'Power up collected.',
            SCALE_FACTOR: data?.SCALE_FACTOR || 11,
            INIT_POSITION: data?.INIT_POSITION || { x: 0, y: 0 },
            pixels: data?.pixels || { width: 128, height: 128 },
            hitbox: data?.hitbox || { radiusPercentage: 0.65 },
            zIndex: data?.zIndex || 90,
            fillStyle: display.color
        };

        super(spriteData, gameEnv);

        this.powerType = powerType;
        this.display = display;
        this.collected = false;
        this.pulse = 0;
        this.spriteData.reaction = () => this.collect();
    }

    static randomType() {
        return POWER_UP_TYPES[Math.floor(Math.random() * POWER_UP_TYPES.length)];
    }

    update() {
        if (this.collected) return;
        this.pulse = (this.pulse + 0.06) % (Math.PI * 2);
        this.draw();
    }

    draw() {
        this.clearCanvas();

        const ctx = this.ctx;
        const size = Math.min(this.canvas.width, this.canvas.height);
        const center = size / 2;
        const pulseScale = 0.88 + Math.sin(this.pulse) * 0.08;
        const radius = center * 0.68 * pulseScale;

        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(Math.PI / 4);
        ctx.fillStyle = this.display.color;
        ctx.shadowColor = this.display.glow;
        ctx.shadowBlur = 28;
        ctx.fillRect(-radius / 2, -radius / 2, radius, radius);
        ctx.restore();

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = Math.max(4, size * 0.04);
        ctx.beginPath();
        ctx.arc(center, center, center * 0.43 * pulseScale, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#111';
        ctx.font = `bold ${Math.floor(size * 0.34)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.display.icon, center, center - size * 0.03);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold ${Math.floor(size * 0.12)}px sans-serif`;
        ctx.strokeStyle = '#111';
        ctx.lineWidth = Math.max(2, size * 0.015);
        ctx.strokeText(this.display.label, center, size * 0.86);
        ctx.fillText(this.display.label, center, size * 0.86);

        this.setupCanvas();
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
