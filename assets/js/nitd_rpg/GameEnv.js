/**
 * GameEnv is a static class that manages the game environment.
 *
 * The focus of the file is the canvas management and the calculation of the game area dimensions.
 * All calculations are based on the window size, header, and footer.
 *
 * This code uses a classic Java static class pattern, which is nice for managing centralized data.
 *
 * The static class pattern ensures that there is only one instance of the game environment,
 * providing a single point of reference for all game objects. This approach helps maintain
 * consistency and simplifies the management of shared resources like the canvas and its dimensions.
 *
 * @class GameEnv
 * @property {Object} canvas - The canvas element.
 * @property {Object} ctx - The 2D rendering context of the canvas.
 * @property {number} innerWidth - The inner width of the game area.
 * @property {number} innerHeight - The inner height of the game area.
 * @property {number} top - The top offset of the game area.
 * @property {number} bottom - The bottom offset of the game area.
 */
class GameEnv {
    static canvas;
    static ctx;
    static innerWidth;
    static innerHeight;
    static top;
    static bottom;
    /**
     * Private constructor to prevent instantiation.
     *
     * @constructor
     * @throws {Error} Throws an error if an attempt is made to instantiate the class.
     */
    constructor() {
        throw new Error('GameEnv is a static class and cannot be instantiated.');
    }
    /**
     * Create the game environment by setting up the canvas and calculating dimensions.
     *
     * This method sets the canvas element, calculates the top and bottom offsets,
     * and determines the inner width and height of the game area. It then sizes the canvas
     * to fit within the calculated dimensions.
     *
     * @static
     */
    static create() {
        this.setCanvas();
        this.setTop();
        this.setBottom();
        this.innerWidth = window.innerWidth;
        this.innerHeight = window.innerHeight - this.top - this.bottom;
        this.size();
    }
    /**
     * Sets the canvas element and its 2D rendering context.
     *
     * @static
     */
    static setCanvas() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
    }
    /**
     * Sets the top offset based on the height of the header element.
     *
     * @static
     */
    static setTop() {
        const header = document.querySelector('header');
        this.top = header ? header.offsetHeight : 0;
    }
    /**
     * Sets the bottom offset based on the height of the footer element.
     *
     * @static
     */
    static setBottom() {
        const footer = document.querySelector('footer');
        this.bottom = footer ? footer.offsetHeight : 0;
    }
    /**
     * Sizes the canvas to fit within the calculated dimensions.
     *
     * @static
     */
    static size() {
        this.canvas.width = this.innerWidth;
        this.canvas.height = this.innerHeight;
        this.canvas.style.width = `${this.innerWidth}px`;
        this.canvas.style.height = `${this.innerHeight}px`;
        this.canvas.style.position = 'relative';
        this.canvas.style.left = '0px';
        this.canvas.style.top = `${this.top}px`;
    }
    /**
     * Resizes the game environment by re-creating it.
     *
     * @static
     */
    static resize() {
        this.create();
    }
    /**
     * Clears the canvas.
     *
     * This method clears the entire canvas, making it ready for the next frame.
     *
     * @static
     */
    static clear() {
        this.ctx.clearRect(0, 0, this.innerWidth, this.innerHeight);
    }
}
export default GameEnv;