import Character from '@assets/js/GameEnginev1.1/essentials/Character.js';
import AiNpc from '@assets/js/GameEnginev1.1/essentials/AiNpc.js';

class Wolf extends Character {
    constructor(data = null, gameEnv = null) {
        if (data) {
            data.name = "wolf";
            data.pixels = { width: 632, height: 395 }; 
            data.orientation = { rows: 1, columns: 1 }; 
            data.down = { row: 0, start: 0, columns: 1 };
            data.left = { row: 0, start: 0, columns: 1 };
            data.right = { row: 0, start: 0, columns: 1 };
            data.up = { row: 0, start: 0, columns: 1 };

            data.id = "wolf";
            data.expertise = "the woods";
            data.chatHistory = [];
            data.greeting = "Good morning, Little Red Riding Hood. Where are you going so early?";
            data.dialogues = ["Where are you going?", "What is in the basket?"];
            data.knowledgeBase = { "the woods": [] };
        }
        
        super(data, gameEnv);
        this.gameEnv = gameEnv;
        this.spriteData = data;
        this.isInteracting = false;

        // --- THE "NO-FAIL" MONKEY PATCH ---
        // This forces the Wolf to answer locally even if the teacher's code tries to call a server
        this.handleResponse = (message) => {
            const msg = message.toLowerCase();
            if (msg.includes("who are you")) return "I am the Big Bad Wolf... and you look delicious.";
            if (msg.includes("grandma")) return "She's already waiting for us at the cottage. Why don't you hurry along?";
            if (msg.includes("basket") || msg.includes("food")) return "Is that cake I smell? I love treats... and little girls.";
            if (msg.includes("hi") || msg.includes("hello")) return "Hello indeed... are you lost?";
            return "Grrr... " + message + "? That's a strange thing to say to a hungry wolf.";
        };

        // We override the static method ONLY for this specific instance
        const originalSend = AiNpc.sendPromptToBackend;
        AiNpc.sendPromptToBackend = async (npcInstance, userMessage, responseArea) => {
            if (npcInstance === this || npcInstance?.spriteData?.id === "wolf") {
                const localReply = this.handleResponse(userMessage);
                this.spriteData.chatHistory.push({ role: 'user', message: userMessage });
                this.spriteData.chatHistory.push({ role: 'ai', message: localReply });
                AiNpc.showResponse(localReply, responseArea, 30, this.aiSession);
                return;
            }
            return originalSend(npcInstance, userMessage, responseArea);
        };
    }

    showReactionDialogue() {
        if (!this.isInteracting) {
            this.handleAiTrigger();
        }
    }

    handleAiTrigger() {
        this.isInteracting = true;
        if (AiNpc && typeof AiNpc.showInteraction === 'function') {
            AiNpc.showInteraction(this);
        }
    }

    update() {
        this.draw();
        this.checkProximity();
    }

    checkProximity() {
        const player = this.gameEnv.gameObjects.find(obj => obj.canvas?.id === 'player');
        if (player) {
            const distance = Math.sqrt(Math.pow(player.x - this.x, 2) + Math.pow(player.y - this.y, 2));
            
            if (distance < 150 && !this.isInteracting) {
                this.showReactionDialogue();
            } else if (distance >= 150 && this.isInteracting) {
                this.isInteracting = false;
                if (AiNpc && typeof AiNpc.cleanupInteraction === 'function') {
                    AiNpc.cleanupInteraction(this);
                }
            }
        }
    }

    draw() {
        if (this.canvas) { this.canvas.style.zIndex = "9999"; }
        super.draw();
    }
}

export default Wolf;