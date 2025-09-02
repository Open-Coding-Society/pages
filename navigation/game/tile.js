
import {camera} from './camera.js';
import {checkOnscreen} from './screen.js';

export const tile = {
    type: 1,
    x: 0,
    y: 0,
    col: 0,
    life: 0,
};

var editorType = 1;
var actionEnabled = false;

export var tiles = [];

export function addTile(x, y, type) {
    const temp = {x: x - camera.x, y: y - camera.y};
    const newTile = {
        x: Math.floor(temp.x/20)*20 - camera.x,
        y: Math.floor(temp.y/20)*20 - camera.y,
        type: type,
        col: 0,
        life: 0
    };
    tiles.push(newTile);
};

// canvas.addEventListener("mousemove", (e) => {
//     const rect = canvas.getBoundingClientRect();
//     mouse = {x: e.clientX, y: e.clientY};
// });

// document.addEventListener("keydown", (e) => {
//     if (e.altKey && e.key === "0") {
//     actionEnabled = !actionEnabled;
//     console.log("Developer Mode:", actionEnabled);
//     }
// });

// canvas.addEventListener("click", (e) => {
//         const rect = canvas.getBoundingClientRect();
//         if (!actionEnabled) return;
//         addTile(mouse.x, mouse.y, editorType);
// });