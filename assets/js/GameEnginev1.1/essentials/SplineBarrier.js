import GameObject from './GameObject.js';

/**
 * @class SplineBarrier
 * @description Draws a smooth open spline and keeps the Player outside its
 * collision radius. Normalized control points resize with the game canvas.
 * @usage Add `{ class: SplineBarrier, data }` to a level's `this.classes`.
 * `data.splinePoints` needs at least two points; set `coordinateSpace` to
 * `normalized` for coordinates in the inclusive range 0–1.
 */
class SplineBarrier extends GameObject {
    constructor(data = {}, gameEnv = null) {
        super(gameEnv);
        if (!Array.isArray(data.splinePoints) || data.splinePoints.length < 2) {
            throw new TypeError('SplineBarrier requires at least two splinePoints');
        }

        this.coordinateSpace = data.coordinateSpace || 'pixels';
        if (!['pixels', 'normalized'].includes(this.coordinateSpace)) {
            throw new TypeError('SplineBarrier coordinateSpace must be "pixels" or "normalized"');
        }
        this.controlPoints = data.splinePoints.map((point, index) => {
            if (!Number.isFinite(point?.x) || !Number.isFinite(point?.y)) {
                throw new TypeError(`SplineBarrier point ${index + 1} must have finite x and y coordinates`);
            }
            if (this.coordinateSpace === 'normalized'
                && (point.x < 0 || point.x > 1 || point.y < 0 || point.y > 1)) {
                throw new RangeError(`SplineBarrier point ${index + 1} must be between 0 and 1`);
            }
            return { x: point.x, y: point.y };
        });

        this.id = data.id || 'spline_barrier';
        this.visible = data.visible !== false;
        this.lineWidth = Number.isFinite(data.lineWidth) && data.lineWidth > 0 ? data.lineWidth : 5;
        this.collisionWidth = Number.isFinite(data.collisionWidth) && data.collisionWidth > 0
            ? Math.max(this.lineWidth, data.collisionWidth)
            : this.lineWidth;

        const container = this.gameEnv?.container;
        if (!container) {
            throw new TypeError('SplineBarrier requires a GameEnv with a container');
        }
        const themeColor = getComputedStyle(container).getPropertyValue('--pref-accent-color').trim();
        this.color = data.color || themeColor || '#8B4513';
        this.renderCanvas = document.createElement('canvas');
        this.renderCanvas.id = `${this.id}-spline-renderer`;
        this.renderContext = this.renderCanvas.getContext('2d');
        if (!this.renderContext) {
            throw new Error('SplineBarrier could not create a 2D rendering context');
        }
        this.renderCanvas.style.position = 'absolute';
        this.renderCanvas.style.left = '0px';
        this.renderCanvas.style.pointerEvents = 'none';
        this.renderCanvas.style.zIndex = '11';
        container.append(this.renderCanvas);
        this.resize();
    }

    getCanvasPoints() {
        if (this.coordinateSpace === 'pixels') {
            return this.controlPoints.map((point) => ({ ...point }));
        }
        return this.controlPoints.map(({ x, y }) => ({
            x: x * this.gameEnv.innerWidth,
            y: y * this.gameEnv.innerHeight
        }));
    }

    draw() {
        const { renderCanvas, renderContext } = this;
        renderContext.clearRect(0, 0, renderCanvas.width, renderCanvas.height);
        if (!this.visible) return;

        const points = SplineBarrier.getCurvePoints(this.getCanvasPoints());
        if (points.length < 2) return;

        renderContext.beginPath();
        renderContext.moveTo(points[0].x, points[0].y);
        for (let index = 1; index < points.length; index++) {
            renderContext.lineTo(points[index].x, points[index].y);
        }
        renderContext.strokeStyle = this.color;
        renderContext.lineWidth = this.lineWidth;
        renderContext.lineCap = 'round';
        renderContext.lineJoin = 'round';
        renderContext.stroke();
    }

    update() {
        this.draw();
        this.resolvePlayerCollision();
    }

    resolvePlayerCollision() {
        const player = this.gameEnv.gameObjects.find((object) => object?.constructor?.name === 'Player');
        if (!player) return;

        const curvePoints = SplineBarrier.getCurvePoints(this.getCanvasPoints());
        const center = typeof player.getCenter === 'function'
            ? player.getCenter()
            : { x: player.x || 0, y: player.y || 0 };
        const nearest = SplineBarrier.getNearestPoint(center, curvePoints);
        if (!nearest) return;

        const width = player.width || player.canvas?.width || 32;
        const height = player.height || player.canvas?.height || 32;
        const hitbox = player.hitbox || {};
        const playerRadius = Math.min(
            width * (1 - (hitbox.widthPercentage || 0)),
            height * (1 - (hitbox.heightPercentage || 0))
        ) / 2;
        const collisionRadius = playerRadius + this.collisionWidth / 2;
        if (nearest.distance >= collisionRadius) return;

        const direction = nearest.distance > 0
            ? { x: nearest.dx / nearest.distance, y: nearest.dy / nearest.distance }
            : { x: nearest.normalX, y: nearest.normalY };
        const correction = collisionRadius - nearest.distance;
        player.x += direction.x * correction;
        player.y += direction.y * correction;
    }

    resize() {
        const width = Math.max(1, Math.round(this.gameEnv.innerWidth));
        const height = Math.max(1, Math.round(this.gameEnv.innerHeight));
        this.renderCanvas.width = width;
        this.renderCanvas.height = height;
        this.renderCanvas.style.width = `${width}px`;
        this.renderCanvas.style.height = `${height}px`;
        this.renderCanvas.style.top = `${this.gameEnv.top || 0}px`;
        this.draw();
    }

    destroy() {
        this.renderCanvas.remove();
        const index = this.gameEnv?.gameObjects?.indexOf(this) ?? -1;
        if (index >= 0) this.gameEnv.gameObjects.splice(index, 1);
    }

    static catmullRom(p0, p1, p2, p3, t) {
        const t2 = t * t;
        const t3 = t2 * t;
        return 0.5 * (
            2 * p1
            + (-p0 + p2) * t
            + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2
            + (-p0 + 3 * p1 - 3 * p2 + p3) * t3
        );
    }

    static getCurvePoints(controlPoints, segmentsPerSection = 24) {
        if (!Array.isArray(controlPoints) || controlPoints.length < 2) {
            throw new TypeError('A spline needs at least two points');
        }
        if (!Number.isInteger(segmentsPerSection) || segmentsPerSection < 1) {
            throw new RangeError('Spline segment count must be a positive integer');
        }

        const curvePoints = [];
        for (let index = 0; index < controlPoints.length - 1; index++) {
            const p0 = controlPoints[index - 1] || controlPoints[index];
            const p1 = controlPoints[index];
            const p2 = controlPoints[index + 1];
            const p3 = controlPoints[index + 2] || p2;

            for (let segment = 0; segment < segmentsPerSection; segment++) {
                const t = segment / segmentsPerSection;
                curvePoints.push({
                    x: this.catmullRom(p0.x, p1.x, p2.x, p3.x, t),
                    y: this.catmullRom(p0.y, p1.y, p2.y, p3.y, t)
                });
            }
        }
        curvePoints.push({ ...controlPoints.at(-1) });
        return curvePoints;
    }

    static getNearestPoint(point, curvePoints) {
        let nearest = null;
        for (let index = 0; index < curvePoints.length - 1; index++) {
            const start = curvePoints[index];
            const end = curvePoints[index + 1];
            const segmentX = end.x - start.x;
            const segmentY = end.y - start.y;
            const segmentLengthSquared = segmentX * segmentX + segmentY * segmentY;
            if (segmentLengthSquared === 0) continue;

            const projection = Math.max(0, Math.min(1,
                ((point.x - start.x) * segmentX + (point.y - start.y) * segmentY) / segmentLengthSquared
            ));
            const nearestX = start.x + projection * segmentX;
            const nearestY = start.y + projection * segmentY;
            const dx = point.x - nearestX;
            const dy = point.y - nearestY;
            const distance = Math.hypot(dx, dy);
            if (!nearest || distance < nearest.distance) {
                const segmentLength = Math.sqrt(segmentLengthSquared);
                nearest = {
                    distance,
                    dx,
                    dy,
                    normalX: -segmentY / segmentLength,
                    normalY: segmentX / segmentLength
                };
            }
        }
        return nearest;
    }
}

export default SplineBarrier;
