import GameObject from '/assets/js/GameEnginev1.1/essentials/GameObject.js';

class SplineBarrier extends GameObject {
    constructor(data, gameEnv) {
        super(gameEnv);

        // Safety check: ensure splinePoints is a valid array
        let splinePoints;
        if (data && data.splinePoints && Array.isArray(data.splinePoints)) {
            splinePoints = data.splinePoints;
        } else {
            console.warn('SplineBarrier: No valid splinePoints provided, using default curve');
            // Provide a default simple curve as fallback
            splinePoints = [
                { x: 100, y: 200 },
                { x: 300, y: 100 },
                { x: 500, y: 300 }
            ];
        }

        // Calculate bounds from spline points
        const bounds = SplineBarrier.calculateBounds(splinePoints);

        // Set properties manually (since GameObject doesn't take data)
        this.splinePoints = splinePoints;
        this.visible = data.visible !== undefined ? data.visible : true;
        this.barrierColor = data.color || '#8B4513';
        this.lineWidth = data.lineWidth || 5;
        this.splineBounds = bounds;
        this.id = data.id || 'spline_barrier';

        // No hitbox - we use custom spline collision instead
        this.hitbox = {};

        // Create a canvas for drawing the spline (not for collision)
        this.canvas = document.createElement('canvas');
        this.canvas.id = this.id;
        this.canvas.width = this.gameEnv.innerWidth;
        this.canvas.height = this.gameEnv.innerHeight;
        this.ctx = this.canvas.getContext('2d');

        // Position canvas to cover the game area
        const container = this.gameEnv?.container;
        if (container) container.appendChild(this.canvas);
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = '0px';
        this.canvas.style.top = `${this.gameEnv?.top || 0}px`;
        this.canvas.style.pointerEvents = 'none'; // Don't intercept mouse events
        this.canvas.style.zIndex = '15'; // Above background and other elements
    }

    draw() {
        // Draw spline curve on the spline barrier's canvas
        if (!this.ctx || !this.canvas) return;
        if (!this.visible) return;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Get curve points
        const curvePoints = SplineBarrier.getCurvePoints(this.splinePoints);
        if (curvePoints.length === 0) return;

        // Draw the spline curve
        this.ctx.strokeStyle = this.barrierColor;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        this.ctx.beginPath();
        this.ctx.moveTo(curvePoints[0].x, curvePoints[0].y);

        for (let i = 1; i < curvePoints.length; i++) {
            this.ctx.lineTo(curvePoints[i].x, curvePoints[i].y);
        }

        this.ctx.stroke();
    }

    update() {
        // Draw the spline every frame
        this.draw();

        // Find player
        const player = this.gameEnv?.gameObjects?.find(obj => obj.constructor?.name === 'Player');
        if (!player) return;

        // Get curve points for collision detection
        const curvePoints = SplineBarrier.getCurvePoints(this.splinePoints);
        const collisionPoint = this.getCollisionPoint(player, curvePoints);

        if (collisionPoint) {
            // Block player movement by pushing them away from the curve
            const playerCenter = player.getCenter();
            const dx = playerCenter.x - collisionPoint.x;
            const dy = playerCenter.y - collisionPoint.y;
            const dist = Math.hypot(dx, dy);

            // Normalize and push away
            if (dist > 0) {
                const pushX = (dx / dist) * 2; // Push strength
                const pushY = (dy / dist) * 2;

                // Move player away from collision point
                if (player.transform) {
                    player.transform.x += pushX;
                    player.transform.y += pushY;
                }
            }
        }
    }

    resize() {
        // No resize needed since we draw on game canvas
    }

    destroy() {
        // Remove from gameObjects array
        const idx = this.gameEnv?.gameObjects?.indexOf?.(this) ?? -1;
        if (idx > -1) this.gameEnv.gameObjects.splice(idx, 1);
    }

    // Override to prevent parent's rectangular collision detection
    collisionChecks() {
        // Collision handled manually in update()
    }

    // Override to prevent parent's rectangular collision detection
    isCollision(other) {
        // Collision handled manually in update()
        return false;
    }

    static calculateBounds(splinePoints) {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const point of splinePoints) {
            minX = Math.min(minX, point.x);
            minY = Math.min(minY, point.y);
            maxX = Math.max(maxX, point.x);
            maxY = Math.max(maxY, point.y);
        }
        return {
            minX, minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }

    getCollisionPoint(player, curvePoints) {
        const playerCenter = player.getCenter();
        const collisionDistance = 20; // pixels

        // Check if player is close to any curve point
        for (const point of curvePoints) {
            const distance = Math.hypot(point.x - playerCenter.x, point.y - playerCenter.y);
            if (distance < collisionDistance) {
                return point;
            }
        }
        return null;
    }

    checkCurveCollision(player, curvePoints) {
        const playerCenter = player.getCenter();
        const collisionDistance = 20; // pixels

        // Check if player is close to any curve point
        for (const point of curvePoints) {
            const distance = Math.hypot(point.x - playerCenter.x, point.y - playerCenter.y);
            if (distance < collisionDistance) {
                return true;
            }
        }
        return false;
    }

    // Interpolates between point P1 and P2, using P0 and P3 as control points
    static catmullRom(p0, p1, p2, p3, t) {
        const t2 = t * t;
        const t3 = t2 * t;

        return 0.5 * (
            2 * p1 +
            (-p0 + p2) * t +
            (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
            (-p0 + 3 * p1 - 3 * p2 + p3) * t3
        );
    }

    // Generate curve positions
    static getCurvePoints(splinePoints, segments = 50) {
        const curvePoints = [];

        // Safety check: if splinePoints is undefined or not an array, return empty array
        if (!splinePoints || !Array.isArray(splinePoints) || splinePoints.length < 2) {
            console.warn('SplineBarrier: Invalid splinePoints array', splinePoints);
            return curvePoints;
        }

        for (let i = 0; i < splinePoints.length - 1; i++) {
            const p0 = splinePoints[i - 1] || splinePoints[i];
            const p1 = splinePoints[i];
            const p2 = splinePoints[i + 1];
            const p3 = splinePoints[i + 2] || splinePoints[i + 1];

            for (let j = 0; j < segments; j++) {
                const t = j / segments;
                const x = this.catmullRom(p0.x, p1.x, p2.x, p3.x, t);
                const y = this.catmullRom(p0.y, p1.y, p2.y, p3.y, t);
                curvePoints.push({ x, y });
            }
        }
        return curvePoints;
    }
}

export default SplineBarrier;
