
export const camera = {
  x: 0,
  y: 0,
  zoom: 1,
};

 export var followSpeed = 0.08;

export const target = camera;

export function updateCamera() {
    camera.x += followSpeed * (target.x - camera.x);
    camera.y += followSpeed * (target.y - camera.y);
    camera.zoom += followSpeed * (target.zoom - camera.zoom);
};

export function setCameraTarget(newTarget) {
    target.x = newTarget.x;
    target.y = newTarget.y;
};