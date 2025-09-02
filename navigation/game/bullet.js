
import { player, pointAt, move } from './move.js';
import { camera } from './camera.js';
import { checkOnscreen } from './screen.js';

export const bullet = {
    x: 0,
    y: 0,
    xv: 0,
    yv: 0,
    speed: 10,
    dir: 0,
    life: 100,
};

export var bullets = [];

export function shootBullet(x,y,type=0) {
    pointAt(x, y);
    const angle = player.dir * (Math.PI / 180);
    if (type === 1) {
        bullet.life = 100;
    } else {
        bullet.life = 50;
    }
    const newBullet = {
        x: player.x + Math.cos(angle) * 20,
        y: player.y + Math.sin(angle) * 20,
        xv: Math.cos(angle) * bullet.speed,
        yv: Math.sin(angle) * bullet.speed,
        speed: bullet.speed,
        dir: player.dir,
        life: bullet.life,
    };
    bullets.push(newBullet);
    player.ammo -= 1;
    if (player.ammo <= 0) player.ammo = 3;
};

export function updBullets(ctx, canvas) {
    for (let i = 0; i < bullets.length; i++) {
        const b = bullets[i];
        b.x += b.xv;
        b.y += b.yv;
        b.life -= 1;
        if (b.life <= 0) {
            bullets.splice(i, 1);
            i--;
            continue;
        }
        if (!checkOnscreen(b.x, b.y, canvas.width, canvas.height)) {
            bullets.splice(i, 1);
            i--;
            continue;
        }
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc((b.x - camera.x) + canvas.width/2, (b.y - camera.y) + canvas.height/2, 5, 0, Math.PI * 2);
        ctx.fill();
    }
};