import Character from '@assets/js/GameEnginev1.1/essentials/Character.js';

class PlayerScythe extends Character {
    static spriteCache = new Map();
    static scytheCount = 0;

    constructor(gameEnv = null, owner, options = {}) {
        PlayerScythe.scytheCount += 1;
        super({
            id: `PlayerScythe-${Date.now()}-${PlayerScythe.scytheCount}`,
            pixels: { width: 64, height: 60 },
            SCALE_FACTOR: options.scaleFactor || 16,
            INIT_POSITION: owner?.position || { x: 0, y: 0 },
            hitbox: { radiusPercentage: 0 },
            zIndex: 15
        }, gameEnv);

        this.owner = owner;
        this.angle = options.angle || 0;
        this.radius = options.radius || 82;
        this.rotation = 0;
        this.speed = options.speed || 0.08;
        this.expiresAt = Date.now() + (options.durationMs || 12000);
        this.revComplete = false;
        this.setSprite((gameEnv?.path || '') + '/images/projects/mansionGame/scythe.png');
    }

    setSprite(src) {
        const cachedSprite = PlayerScythe.spriteCache.get(src);
        if (cachedSprite) {
            this.spriteSheet = cachedSprite;
            this.imageLoaded = cachedSprite.complete;
            if (!this.imageLoaded) {
                cachedSprite.addEventListener('load', () => {
                    this.imageLoaded = true;
                }, { once: true });
            }
            return;
        }

        const sprite = new Image();
        sprite.onload = () => {
            this.imageLoaded = true;
        };
        sprite.src = src;
        PlayerScythe.spriteCache.set(src, sprite);
        this.spriteSheet = sprite;
    }

    update() {
        if (this.revComplete) return;
        if (!this.owner || Date.now() >= this.expiresAt) {
            this.revComplete = true;
            this.destroy();
            return;
        }

        this.angle = (this.angle + this.speed) % (Math.PI * 2);
        this.rotation = (this.rotation + 0.28) % (Math.PI * 2);

        const ownerCenterX = this.owner.position.x + this.owner.width / 2;
        const ownerCenterY = this.owner.position.y + this.owner.height / 2;
        this.position.x = ownerCenterX + Math.cos(this.angle) * this.radius - this.width / 2;
        this.position.y = ownerCenterY + Math.sin(this.angle) * this.radius - this.height / 2;

        this.killTouchedZombies();
        this.destroyEnemyProjectiles();
        this.draw();
    }

    draw() {
        this.clearCanvas();
        const ctx = this.ctx;
        const dstW = Math.max(1, Math.floor(this.canvas.width));
        const dstH = Math.max(1, Math.floor(this.canvas.height));

        ctx.save();
        ctx.translate(dstW / 2, dstH / 2);
        ctx.rotate(this.rotation);
        ctx.shadowColor = 'rgba(184, 242, 230, 0.75)';
        ctx.shadowBlur = 12;

        if (this.imageLoaded && this.spriteSheet?.complete) {
            ctx.drawImage(
                this.spriteSheet,
                0, 0, this.spriteSheet.naturalWidth, this.spriteSheet.naturalHeight,
                -dstW / 2, -dstH / 2, dstW, dstH
            );
        } else {
            ctx.fillStyle = '#B8F2E6';
            ctx.fillRect(-dstW / 2, -dstH / 8, dstW, dstH / 4);
        }

        ctx.restore();
        this.setupCanvas();
    }

    killTouchedZombies() {
        const killDistance = 48;
        const scytheCenterX = this.position.x + this.width / 2;
        const scytheCenterY = this.position.y + this.height / 2;
        const zombies = this.gameEnv.gameObjects.filter(obj => obj.constructor.name === 'Zombie');

        zombies.forEach(zombie => {
            const zombieCenterX = zombie.position.x + zombie.width / 2;
            const zombieCenterY = zombie.position.y + zombie.height / 2;
            const dx = zombieCenterX - scytheCenterX;
            const dy = zombieCenterY - scytheCenterY;
            if (Math.sqrt(dx * dx + dy * dy) <= killDistance) {
                if (typeof zombie.takeDamage === 'function') {
                    zombie.takeDamage(9999);
                } else if (typeof zombie.destroy === 'function') {
                    zombie.destroy();
                }
            }
        });
    }

    destroyEnemyProjectiles() {
        const killDistance = 48;
        const scytheCenterX = this.position.x + this.width / 2;
        const scytheCenterY = this.position.y + this.height / 2;

        const projectiles = this.gameEnv.gameObjects.filter(obj => {
            const name = obj?.constructor?.name;
            if (name === 'Boomerang') return true;
            if (name === 'Projectile') {
                return obj?.type !== 'PLAYER' && obj?.type !== 'PUMPKIN';
            }
            return false;
        });

        projectiles.forEach(projectile => {
            const projCenterX = projectile.position.x + projectile.width / 2;
            const projCenterY = projectile.position.y + projectile.height / 2;
            const dx = projCenterX - scytheCenterX;
            const dy = projCenterY - scytheCenterY;
            if (Math.sqrt(dx * dx + dy * dy) <= killDistance) {
                projectile.revComplete = true;
                if (typeof projectile.destroy === 'function') {
                    projectile.destroy();
                }
            }
        });
    }
}

export default PlayerScythe;
