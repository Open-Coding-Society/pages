
import GameControl from './GameControl.js';

function RandomEvent() {
let randomNum = Math.floor(Math.random() * 8) + 3; // random num from 3 to 10 sec

let startRandomEvent = setTimeout(function request() {
    GameControl.startRandomEvent("boss")
    randomNum = Math.floor(Math.random() * 8) + 3; // reset the random num from 3 to 10 sec
    GameControl.startRandomEvent("narwhalboss")
    randomNum = Math.floor(Math.random() * 8) + 3; // reset the random num from 3 to 10 sec
    startRandomEvent = setTimeout(request, randomNum * 1000);
}, randomNum * 1000); //each random event will happen each 3 to 10 sec 
}
export default RandomEvent;