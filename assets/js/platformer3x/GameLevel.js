// GameLevel.js key objective is to load and intialize GameObject(s) for a level.
import GameEnv from './GameEnv.js';
import Socket from './Multiplayer.js';
import Character from './Character.js';

/**
 * The GameLevel class represents a level in the game.
 * Each instance of GameLevel contains all the game objects that make up a level,
 * and provides methods to load the images for these objects and create instances of them.
 */
class GameLevel {
    /**
     * Creates a new GameLevel.
     * @param {Object} levelObject - An object containing the properties for the level.
     */
    constructor(levelObject) {
        // The levelObjects property stores the levelObject parameter.
        this.levelObjects = levelObject;        
        // The tag is a friendly name used to identify the level.
        this.tag = levelObject?.tag;
        // The passive property determines if the level is passive (i.e., not playable).
        this.passive = levelObject?.passive;
        // The isComplete property is a function that determines if the level is complete.
        // build conditions to make determination of complete (e.g., all enemies defeated, player reached the end of the screen, etc.)
        this.isComplete = levelObject?.callback;
        // The gameObjects property is an array of the game objects for this level.
        this.gameObjects = this.levelObjects?.objects || [];
        // Each GameLevel instance is stored in the GameEnv.levels array.
        GameEnv.levels.push(this);
    }

    /**
     * Loads the images for the game objects and creates new instances of them.
     * If any image fails to load, an error is logged and the game is halted.
     */
    async load() {
        Socket.removeAllListeners("stateUpdate") //reset Socket Connections
        Socket.removeAllListeners("disconnection")
        Socket.removeAllListeners("leaderboardUpdate")
        // Socket.createListener("leaderboardUpdate",this.handleLeaderboardUpdates)
        // Socket.createListener("stateUpdate",this.handleStateUpdates)
        Socket.createListener("disconnection",this.handleSocketDisconnect)
        try {
            var objFile = null;
            for (const obj of this.gameObjects) {
                if (obj.data.file) {
                    // Load the image for the game object.
                    objFile = obj.data.file; 
                    console.log(objFile);
                    obj.image = await this.loadImage(obj.data.file);
                    // Create a new canvas for the game object.
                    const canvas = document.createElement("canvas");
                    canvas.id = obj.id;
                    document.querySelector("#canvasContainer").appendChild(canvas);
                    // Create a new instance of the game object.
                    new obj.class(canvas, obj.image, obj.data, obj.xPercentage, obj.yPercentage, obj.name, obj.minPosition);
                }
            }
        } catch (error) {
            console.error('Failed to load one or more GameLevel objects: ' + objFile, error);
        }
    }

    /**
     * Loads an image from a given source.
     * @param {string} src - The source of the image.
     * @returns {Promise} A promise that resolves with the loaded image.
     */
    async loadImage(src) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = src;
            image.onload = () => resolve(image);
            image.onerror = reject;
        });
    }


    handleStateUpdates(data){ //listen for stateupdates and update characters if needed
        let updated = false
        if (data.tag === GameEnv.currentLevel.tag) {
            for (var gameObj of GameEnv.gameObjects) {
                updated = updated || gameObj.updateInfo(data);
            }
            if (!updated) {
                var obj;
                //find the current type of player in game
                GameEnv.currentLevel.gameObjects.forEach(object=>{
                    if (object.id == "player"){
                        obj = object;
                    }
                });
                 // Load the image for the game object.
                const image = new Image();
                image.src = obj.data.file;
                 // Create a new canvas for the game object.
                 const canvas = document.createElement("canvas");
                 canvas.id = data.id;
                 document.querySelector("#canvasContainer").appendChild(canvas);
                 //console.log(canvas);
                 // Create a new instance of the game object.
                var obj1 =  new Character(canvas, image, obj.data, obj.xPercentage, obj.yPercentage, obj.minPosition);
                
                obj1.updateInfo(data);
                obj1.size();
                obj1.name = data.name;
            }
        }
    }

    handleSocketDisconnect(id) {
        for (var gameObj of GameEnv.gameObjects) {
            if (gameObj.canvas.id.includes(id)) {
                gameObj.destroy();
            }
        }
    }

    handleLeaderboardUpdates(data) {
        const existingTimeScores = JSON.parse(localStorage.getItem('GtimeScores')) || [];
        
        existingTimeScores.push(data);
        // Log the updated array to the console for debugging
        console.log(existingTimeScores);
        // Save the updated array to local storage
        localStorage.setItem('GtimeScores', JSON.stringify(existingTimeScores));
    }
}

export default GameLevel;