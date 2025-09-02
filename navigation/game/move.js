import { camera } from './camera.js';

export const player = {
    x: 0,
    y: 0,
    xv: 0,
    yv: 0,
    speed: 0.6,
    dir: 0,
    health: 100,
    coins: 0,
    ammo: 3,
    gun: 2,
};

export function pointAt(x,y) {
    const dx = x - player.x;
    const dy = y - player.y;
    player.dir = Math.atan2(dy, dx) * (180 / Math.PI);
};

export function move(speed) {
    const angle = player.dir * (Math.PI / 180);
    player.xv += Math.cos(angle) * speed;
    player.yv += Math.sin(angle) * speed;
};

