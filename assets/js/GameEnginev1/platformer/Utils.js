/**
 * CS Fighters - Utility Functions
 * Contains helper functions used throughout the game
 */

const Utils = {
    /**
     * Checks collision between two rectangles
     * @param {Object} rect1 - First rectangle {x, y, width, height}
     * @param {Object} rect2 - Second rectangle {x, y, width, height}
     * @returns {Boolean} Whether the rectangles collide
     */
    checkCollision: function(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    },
    
    /**
     * Calculates distance between two points
     * @param {Number} x1 - X coordinate of first point
     * @param {Number} y1 - Y coordinate of first point
     * @param {Number} x2 - X coordinate of second point
     * @param {Number} y2 - Y coordinate of second point
     * @returns {Number} Distance between points
     */
    getDistance: function(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    },
    
    /**
     * Returns a random integer between min and max
     * @param {Number} min - Minimum value (inclusive)
     * @param {Number} max - Maximum value (inclusive)
     * @returns {Number} Random integer
     */
    randomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    /**
     * Clamps a value between min and max
     * @param {Number} value - The value to clamp
     * @param {Number} min - Minimum value
     * @param {Number} max - Maximum value
     * @returns {Number} Clamped value
     */
    clamp: function(value, min, max) {
        return Math.max(min, Math.min(value, max));
    },
    
    /**
     * Lerps (linear interpolates) between two values
     * @param {Number} start - Start value
     * @param {Number} end - End value
     * @param {Number} t - Interpolation factor (0-1)
     * @returns {Number} Interpolated value
     */
    lerp: function(start, end, t) {
        return start * (1 - t) + end * t;
    },
    
    /**
     * Checks if a point is inside a rectangle
     * @param {Number} px - Point X coordinate
     * @param {Number} py - Point Y coordinate
     * @param {Object} rect - Rectangle {x, y, width, height}
     * @returns {Boolean} Whether point is inside rectangle
     */
    pointInRect: function(px, py, rect) {
        return px >= rect.x && 
               px <= rect.x + rect.width && 
               py >= rect.y && 
               py <= rect.y + rect.height;
    },
    
    /**
     * Draws text with a stroke/outline
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {String} text - Text to draw
     * @param {Number} x - X position
     * @param {Number} y - Y position
     * @param {String} fillStyle - Fill color
     * @param {String} strokeStyle - Stroke color
     */
    drawTextWithStroke: function(ctx, text, x, y, fillStyle, strokeStyle) {
        ctx.font = '20px Arial';
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = 3;
        ctx.strokeText(text, x, y);
        ctx.fillStyle = fillStyle;
        ctx.fillText(text, x, y);
    }
};