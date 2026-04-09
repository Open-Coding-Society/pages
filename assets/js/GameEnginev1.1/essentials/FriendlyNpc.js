import Npc from "./Npc.js";

class FriendlyNpc extends Npc {
    constructor(data = {}, gameEnv = null) {
        super(data, gameEnv);

        // NEW properties
        this.interactDistance = data.interactDistance || 120;
        this.hasAlerted = false;
    }

    update() {
        super.update();

        const player = this.gameEnv.gameObjects.find(obj => obj.constructor.name === "Player");
        if (!player) return;

        const dx = player.position.x - this.position.x;
        const dy = player.position.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.interactDistance && !this.hasAlerted) {
            this.hasAlerted = true;

            if (this.gameEnv?.currentLevel?.showToast) {
                this.gameEnv.currentLevel.showToast(
                    this.spriteData?.greeting || "Hey there!"
                );
            }

            // OPTIONAL: trigger reaction automatically
            if (this.reaction) {
                this.reaction();
            }
        }

        // Reset when player walks away
        if (distance >= this.interactDistance) {
            this.hasAlerted = false;
        }
    }
}

export default FriendlyNpc;