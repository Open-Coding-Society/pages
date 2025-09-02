
const obj = {
    x: 0,
    y: 0,
    width: 50,
    height: 50
};

export function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
};

function moveObj(obj, speed, angle) {
    obj.x += Math.cos(angle) * speed;
    obj.y += Math.sin(angle) * speed;
};

export function updCollide(obj1, obj2, size) {
    return (
        obj1.x < obj2.x + size &&
        obj1.x + size > obj2.x &&
        obj1.y < obj2.y + size &&
        obj1.y + size > obj2.y
    );
};