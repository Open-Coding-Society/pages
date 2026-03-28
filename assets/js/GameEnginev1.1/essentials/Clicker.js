// Clicker.js - A Clicker GameObject for GameEnginev1.1
import Npc from "./Npc.js";

class Clicker extends Npc {
    constructor(data = {}, gameEnv = null) {
        super(data, gameEnv);
    }

    handleClick(event) {
        if (this.interact) {
            this.interact('click');
        }
    }
}

export default Clicker;
