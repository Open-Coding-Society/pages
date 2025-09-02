import { player, pointAt, move } from './move.js';
import { distance, updCollide } from './collide.js';
import { camera } from './camera.js';
import { bullets } from './bullet.js';
import { checkOnscreen } from './screen.js';

export const enemy = {
    x: 0,
    y: 0,
    xv: 0,
    yv: 0,
    speed: 0.2,
    dir: 0,
    health: 100,
};

export var enemies = [];

export function addEnemy(x, y) {
    const newEnemy = {
        x: x,
        y: y,
        xv: 0,
        yv: 0,
        speed: enemy.speed,
        dir: 0,
        health: 100,
    };
    enemies.push(newEnemy);
};

function collideEnemy(e) {
    for (let i = 0; i < enemies.length; i++) {
        const other = enemies[i];
        if (e !== other) {
            if (distance(e.x, e.y, other.x, other.y) < 20) {
                pointAtEnemy(e, other.x, other.y) * (Math.PI / 180);
                moveEnemy(e, -e.speed);
            }
        }
    }
};

function collideBullets(e, id, bullets) {
    for (let i = 0; i < bullets.length; i++) {
        const b = bullets[i];
        if (updCollide(e, b, 20)) {
            e.health -= 50;
            bullets.splice(i, 1);
            if (e.health <= 0) {
                player.coins += 1;
                enemies.splice(id, 1);
            }
            i--;
        }
    }
};

export function updEnemies(ctx, canvas, target) {
    for (let i = 0; i < enemies.length; i++) {
        const e = enemies[i];
        if (e.health <= 0) {
            enemies.splice(i, 1);
            i--;
            continue;
        }
        pointAtEnemy(e, target.x, target.y);
        moveEnemy(e, e.speed);
        e.xv *= 0.9;
        e.yv *= 0.9;
        e.x += e.xv;
        e.y += e.yv;
        if (distance(e.x, e.y, target.x, target.y) < 25) {
            target.health -= 1;
            pointAt(e.x, e.y);
            move(-2);
        }
        collideEnemy(e);
        collideBullets(e, i, bullets);
        if (!checkOnscreen(e.x, e.y, canvas.width, canvas.height)) {
            continue;
        }
        ctx.fillStyle = 'red';
        ctx.fillRect((e.x - camera.x) + (canvas.width / 2) - 10, (e.y - camera.y) + (canvas.height / 2) - 10, 20, 20);
    }
};

export function spawnEnemies(count, canvas) {
    for (let i = 0; i < count; i++) {
        let rand = (Math.random() * 2) - 1;
        const temp = {
            x: Math.floor(rand * (canvas.width / 2 - 20)) + camera.x,
            y: Math.floor(rand * (canvas.height / 2 - 20)) + camera.y,
        };
        addEnemy(temp.x, temp.y);
    }
};

export function pointAtEnemy(e, x, y) {
    const dx = x - e.x;
    const dy = y - e.y;
    e.dir = Math.atan2(dy, dx) * (180 / Math.PI);
};

export function moveEnemy(e, speed) {
    const angle = e.dir * (Math.PI / 180);
    e.xv += Math.cos(angle) * speed;
    e.yv += Math.sin(angle) * speed;
};