import GameEnv from './GameEnv.js';

export class hpBar {
    constructor(width, height, objectWidth, objectHeight, maxHp, currentHp, x, y) {

        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.id = "hpBar";
        this.maxHp = maxHp;
        this.currentHp = currentHp;
        this.hpPercentage = this.currentHp / this.maxHp;
        this.x = (x + objectWidth / 2 - this.canvas.width / 2);
        this.y = (y - objectHeight / 40);


        document.querySelector("#canvasContainer").appendChild(this.canvas);
        GameEnv.gameObjects.push(this);
    }

    updateHpBar(currentHp, x, y, objectWidth, objectHeight) {
        this.x = (x + objectWidth / 2 - this.canvas.width / 2);
        this.y = (y - objectHeight / 40);
        this.hpPercentage = this.currentHp / this.maxHp;
        this.currentHp = currentHp;
    }


    // Required, but no update action
    update() {
        this.canvas.style.left = `${this.x}px`;
        this.canvas.style.top = `${this.y}px`;
        this.draw()
    }

    // Draw position is always 0,0
    draw() {
        // Draw the background (gray)
        this.ctx.fillStyle = 'gray';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // Draw the health bar (green, based on current health)
        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(0, 0, this.canvas.width * this.hpPercentage, this.canvas.height);
    }

    // Set platform position
    size() {
        this.canvas.style.position = 'absolute';  //code from Flag.js, define the style of the Hp Bar
        this.canvas.style.left = `${this.x}px`;
        this.canvas.style.top = `${this.y}px`;
        this.canvas.style.borderRadius = '5px';
        this.canvas.style.width = `${this.canvas.width}px`;
        this.canvas.style.height = `${this.canvas.height}px`;
        this.canvas.style.border = '2px solid black';
    }

    destroy() {
        const index = GameEnv.gameObjects.indexOf(this);
        if (index !== -1) {
            // Remove the canvas from the DOM
            this.canvas.parentNode.removeChild(this.canvas);
            GameEnv.gameObjects.splice(index, 1);
        }
    }

    // extract change from Game Objects into JSON
    serialize() {
        this.logElement();
    }

    // log Character element change
    logElement() {
        var jsonifiedElement = this.stringifyElement();
        if (jsonifiedElement !== this.jsonifiedElement) {
            //console.log(jsonifiedElement);
            this.jsonifiedElement = jsonifiedElement;
            if (this.shouldBeSynced && !GameEnv.inTransition) {
                Socket.sendData("update", this.jsonifiedElement);
            }
        }
    }

    // strigify Character key data
    stringifyElement() {
        var element = this.canvas;
        if (element && element.id) {
            // Convert the relevant properties of the element to a string for comparison
            return {
                id: element.id,
                width: element.width,
                height: element.height,
                style: element.style.cssText,
                position: {
                    left: element.style.left,
                    top: element.style.top
                },
                filter: element.style.filter,
                tag: GameEnv.currentLevel.tag,
                x: this.x / GameEnv.innerWidth,
                y: (this.y - GameEnv.top) / (GameEnv.bottom - GameEnv.top),
                frameY: this.frameY
            };
        }
    }
}

export default hpBar;