// Clicker.js - A Clicker GameObject for GameEnginev1.1
import Npc from "./Npc.js";

class Clicker extends Npc {
    constructor(data = {}, gameEnv = null) {
        super(data, gameEnv);
        this.clcks = 0;
    }

    handleClick(event) {
        if (this.interact) {
            this.clcks++;
             this.interact(this.clcks);
        }
    }
}

export default Clicker;
