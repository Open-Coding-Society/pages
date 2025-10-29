
export function directionOf(x1, y1, x2, y2) {
    return Math.atan2(y2-y1, x2-x1);
}

export function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2-x1)**2, (y2-y1)**2);
}

export function toRadians(dir) {
    return (dir * Math.PI) / 180;
}

export function magnitude(x, y) {
    return Math.sqrt(x**2, y**2);
}