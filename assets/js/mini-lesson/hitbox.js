import { Transform } from './transform.js';

export function checkAABBCollision(box1, box2) {
    return (
        box1.x < box2.x + box2.w &&
        box1.x + box1.w > box2.x &&
        box1.y < box2.y + box2.h &&
        box1.y + box1.h > box2.y
    );
}

export function checkOBBCollision(box1, box2) {
    const rotation1 = (box1.rotation || 0) * (Math.PI / 180);
    const cos1 = Math.cos(rotation1);
    const sin1 = Math.sin(rotation1);

    const centerX1 = box1.x + box1.w / 2;
    const centerY1 = box1.y + box1.h / 2;
    const halfW1 = box1.w / 2;
    const halfH1 = box1.h / 2;

    const box1Corners = [
        { x: centerX1 + (-halfW1) * cos1 - (-halfH1) * sin1, y: centerY1 + (-halfW1) * sin1 + (-halfH1) * cos1 },
        { x: centerX1 + halfW1 * cos1 - (-halfH1) * sin1, y: centerY1 + halfW1 * sin1 + (-halfH1) * cos1 },
        { x: centerX1 + halfW1 * cos1 - halfH1 * sin1, y: centerY1 + halfW1 * sin1 + halfH1 * cos1 },
        { x: centerX1 + (-halfW1) * cos1 - halfH1 * sin1, y: centerY1 + (-halfW1) * sin1 + halfH1 * cos1 }
    ];

    const rotation2 = (box2.rotation || 0) * (Math.PI / 180);
    const cos2 = Math.cos(rotation2);
    const sin2 = Math.sin(rotation2);

    const centerX2 = box2.x + box2.w / 2;
    const centerY2 = box2.y + box2.h / 2;
    const halfW2 = box2.w / 2;
    const halfH2 = box2.h / 2;

    const box2Corners = [
        { x: centerX2 + (-halfW2) * cos2 - (-halfH2) * sin2, y: centerY2 + (-halfW2) * sin2 + (-halfH2) * cos2 },
        { x: centerX2 + halfW2 * cos2 - (-halfH2) * sin2, y: centerY2 + halfW2 * sin2 + (-halfH2) * cos2 },
        { x: centerX2 + halfW2 * cos2 - halfH2 * sin2, y: centerY2 + halfW2 * sin2 + halfH2 * cos2 },
        { x: centerX2 + (-halfW2) * cos2 - halfH2 * sin2, y: centerY2 + (-halfW2) * sin2 + halfH2 * cos2 }
    ];

    const axes = [];

    for (let i = 0; i < box1Corners.length; i++) {
        const edge = {
            x: box1Corners[(i + 1) % box1Corners.length].x - box1Corners[i].x,
            y: box1Corners[(i + 1) % box1Corners.length].y - box1Corners[i].y
        };
        const normal = { x: -edge.y, y: edge.x };
        const length = Math.sqrt(normal.x ** 2 + normal.y ** 2);
        if (length !== 0) {
            axes.push({ x: normal.x / length, y: normal.y / length });
        }
    }

    for (let i = 0; i < box2Corners.length; i++) {
        const edge = {
            x: box2Corners[(i + 1) % box2Corners.length].x - box2Corners[i].x,
            y: box2Corners[(i + 1) % box2Corners.length].y - box2Corners[i].y
        };
        const normal = { x: -edge.y, y: edge.x };
        const length = Math.sqrt(normal.x ** 2 + normal.y ** 2);
        if (length !== 0) {
            axes.push({ x: normal.x / length, y: normal.y / length });
        }
    }

    for (let axis of axes) {
        let min1 = Infinity, max1 = -Infinity;
        for (let corner of box1Corners) {
            const projection = corner.x * axis.x + corner.y * axis.y;
            min1 = Math.min(min1, projection);
            max1 = Math.max(max1, projection);
        }

        let min2 = Infinity, max2 = -Infinity;
        for (let corner of box2Corners) {
            const projection = corner.x * axis.x + corner.y * axis.y;
            min2 = Math.min(min2, projection);
            max2 = Math.max(max2, projection);
        }

        if (max1 < min2 || max2 < min1) {
            return false;
        }
    }

    return true;
}

export function checkPointAABBCollision(pointX, pointY, box) {
    return (
        pointX >= box.x &&
        pointX <= box.x + box.w &&
        pointY >= box.y &&
        pointY <= box.y + box.h
    );
}

export function checkPointOBBCollision(pointX, pointY, box) {
    const rotation = (box.rotation || 0) * (Math.PI / 180);
    const cos = Math.cos(-rotation);
    const sin = Math.sin(-rotation);

    const centerX = box.x + box.w / 2;
    const centerY = box.y + box.h / 2;

    const translatedX = pointX - centerX;
    const translatedY = pointY - centerY;

    const rotatedX = translatedX * cos - translatedY * sin;
    const rotatedY = translatedX * sin + translatedY * cos;

    return (
        Math.abs(rotatedX) <= box.w / 2 &&
        Math.abs(rotatedY) <= box.h / 2
    );
}

export function checkCircleAABBCollision(circleX, circleY, radius, box) {
    const closestX = Math.max(box.x, Math.min(circleX, box.x + box.w));
    const closestY = Math.max(box.y, Math.min(circleY, box.y + box.h));

    const distanceX = circleX - closestX;
    const distanceY = circleY - closestY;
    const distanceSquared = distanceX ** 2 + distanceY ** 2;

    return distanceSquared < radius ** 2;
}

