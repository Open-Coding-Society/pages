/**
 * io is for the node js module: socket.io
 * this is used to create the socket listener for the client side of the multiplayer
 */
import GameControl from "./GameControl.js";
import GameEnv from "./GameEnv.js";
import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";


// Setup a variable

export class Socket{
/**
 * @property {boolean} shouldBeSynced - should we be connected to the server
 * @property {Object} socket - used by Multiplayer, creates socket for the client
 * @property {string} socketID - id given by the websocket server when a player connects
 */

    static shouldBeSynced = true;
    static socket = io("wss://platformer.nighthawkcodingsociety.com"); //aws server
    //static socket = io(`ws://${window.location.host.split(":")[0]}:3000`); //local server
    static socketId;
    static {
        this.socket.on("id",(id)=>{this.socketId = id});
    }

    constructor(){throw new Error('Socket is a static class and cannot be instantiated.');}

    static sendData(key,value) {
        if (this.shouldBeSynced == false){return "offline"};
        if (typeof key != "string"){return "key is not a string"};
        this.socket.emit(key,value);
    }

    static createListener(key, func){
        if (this.shouldBeSynced == false){return "offline"};
        if (typeof key != "string"){return "key is not a string"};
        this.socket.on(key,func);
    }

    static removeListener(key){
        if (typeof key == "string"){return "key is not a string"};
        this.socket.off(key)
    }

    static removeAllListeners(){
        this.socket.removeAllListeners();
    }

    static changeStatus(){
        this.shouldBeSynced = !this.shouldBeSynced;
        if(this.shouldBeSynced){
            this.removeAllListeners();

            GameControl.transitionToLevel(GameEnv.levels[GameEnv.levels.indexOf(GameEnv.currentLevel)]);
        } else{
            GameControl.transitionToLevel(GameEnv.levels[GameEnv.levels.indexOf(GameEnv.currentLevel)]);
        }
        return this.shouldBeSynced;
    }
}
export default Socket;