
import {camera} from './camera.js';

export function checkOnscreen(x, y, width, height) {
    const temp = {x: x - camera.x, y: y - camera.y};
    if (Math.abs(temp.x) <= width / 2 && Math.abs(temp.y) <= height / 2) {
        return true;
    }
    return false;
};