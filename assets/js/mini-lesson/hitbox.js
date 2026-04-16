function normalizeRect(rect) {
  // Supports both mini-lesson boxes ({ x, y, w, h }) and DOMRect/GameObject style.
  const x = rect.x ?? rect.left ?? 0;
  const y = rect.y ?? rect.top ?? 0;
  const w = rect.w ?? rect.width ?? ((rect.right ?? 0) - (rect.left ?? 0));
  const h = rect.h ?? rect.height ?? ((rect.bottom ?? 0) - (rect.top ?? 0));
  return { x, y, w, h };
}

function getReduction(rect, hitbox = {}) {
  const normalized = normalizeRect(rect);
  const widthReduction = normalized.w * (hitbox.widthPercentage || 0.0);
  const heightReduction = normalized.h * (hitbox.heightPercentage || 0.0);
  return { widthReduction, heightReduction };
}

export function toBounds(rect, hitbox = {}) {
  const normalized = normalizeRect(rect);
  const { widthReduction, heightReduction } = getReduction(rect, hitbox);
  const left = normalized.x + widthReduction;
  const top = normalized.y + heightReduction;
  const right = normalized.x + normalized.w - widthReduction;
  // Keep bottom edge behavior consistent with GameObject.isCollision.
  const bottom = normalized.y + normalized.h;

  return { left, top, right, bottom };
}

export function checkAABBCollision(box1, box2, hitbox1 = {}, hitbox2 = {}) {
  const thisBounds = toBounds(box1, hitbox1);
  const otherBounds = toBounds(box2, hitbox2);

  return (
    thisBounds.left < otherBounds.right &&
    thisBounds.right > otherBounds.left &&
    thisBounds.top < otherBounds.bottom &&
    thisBounds.bottom > otherBounds.top
  );
}

export function collisionTouchPoints(box1, box2, hitbox1 = {}, hitbox2 = {}) {
  const thisBounds = toBounds(box1, hitbox1);
  const otherBounds = toBounds(box2, hitbox2);

  return {
    top: thisBounds.bottom > otherBounds.top && thisBounds.top < otherBounds.top,
    bottom: thisBounds.top < otherBounds.bottom && thisBounds.bottom > otherBounds.bottom,
    left: thisBounds.right > otherBounds.left && thisBounds.left < otherBounds.left,
    right: thisBounds.left < otherBounds.right && thisBounds.right > otherBounds.right
  };
}

export function checkPointAABBCollision(pointX, pointY, box, hitbox = {}) {
  const bounds = toBounds(box, hitbox);
  return (
    pointX >= bounds.left &&
    pointX <= bounds.right &&
    pointY >= bounds.top &&
    pointY <= bounds.bottom
  );
}

export function checkCircleAABBCollision(circleX, circleY, radius, box, hitbox = {}) {
  const bounds = toBounds(box, hitbox);
  const closestX = Math.max(bounds.left, Math.min(circleX, bounds.right));
  const closestY = Math.max(bounds.top, Math.min(circleY, bounds.bottom));

  const distanceX = circleX - closestX;
  const distanceY = circleY - closestY;
  const distanceSquared = distanceX * distanceX + distanceY * distanceY;

  return distanceSquared < radius * radius;
}

// Kept for backward compatibility with older mini-lesson callers.
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

  for (let i = 0; i < box1Corners.length; i += 1) {
    const edge = {
      x: box1Corners[(i + 1) % box1Corners.length].x - box1Corners[i].x,
      y: box1Corners[(i + 1) % box1Corners.length].y - box1Corners[i].y
    };
    const normal = { x: -edge.y, y: edge.x };
    const length = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
    if (length !== 0) {
      axes.push({ x: normal.x / length, y: normal.y / length });
    }
  }

  for (let i = 0; i < box2Corners.length; i += 1) {
    const edge = {
      x: box2Corners[(i + 1) % box2Corners.length].x - box2Corners[i].x,
      y: box2Corners[(i + 1) % box2Corners.length].y - box2Corners[i].y
    };
    const normal = { x: -edge.y, y: edge.x };
    const length = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
    if (length !== 0) {
      axes.push({ x: normal.x / length, y: normal.y / length });
    }
  }

  for (const axis of axes) {
    let min1 = Infinity;
    let max1 = -Infinity;
    for (const corner of box1Corners) {
      const projection = corner.x * axis.x + corner.y * axis.y;
      min1 = Math.min(min1, projection);
      max1 = Math.max(max1, projection);
    }

    let min2 = Infinity;
    let max2 = -Infinity;
    for (const corner of box2Corners) {
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

// Kept for backward compatibility with older mini-lesson callers.
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

