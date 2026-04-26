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

            // Required for Teacher's AiNpc.js
            data.expertise = "the woods";
            data.chatHistory = [];
            data.greeting = "Good morning, Little Red Riding Hood. Where are you going so early?";
            data.dialogues = ["Where are you going?", "What is in the basket?"];
            data.knowledgeBase = {
                "the woods": [
                    { question: "Where are you going?" },
                    { question: "What is in the basket?" }
                ]
            };
        }
        
        super(data, gameEnv);
        this.gameEnv = gameEnv;
        this.spriteData = data;

        if (this.canvas) {
            this.canvas.width = 632;
            this.canvas.height = 395;
            this.canvas.style.zIndex = "9999"; 
            this.canvas.style.display = "block";
            this.canvas.style.opacity = "1";
        }

        this.isInteracting = false;
        this.injectWhiteTextStyles();
    }

    // MANDATORY ENGINE FIX: Stops the "targetObject.showReactionDialogue is not a function" error
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

    injectWhiteTextStyles() {
        if (document.getElementById('wolf-ai-style')) return;
        const style = document.createElement('style');
        style.id = 'wolf-ai-style';
        style.innerHTML = `
            .ai-npc-container, .ai-npc-input, .ai-npc-response-area, .user-message, .ai-message { 
                color: white !important; 
                font-family: monospace;
            }
            .ai-npc-container { 
                background: rgba(0,0,0,0.9) !important; 
                border: 2px solid red !important; 
                z-index: 10000;
            }
            .ai-npc-input { background: #222 !important; border: 1px solid red !important; }
        `;
        document.head.appendChild(style);
    }

    update() {
        this.draw();
        this.checkProximity();
    }

    checkProximity() {
        const player = this.gameEnv.gameObjects.find(obj => obj.canvas?.id === 'player');
        if (player) {
            const distance = Math.sqrt(
                Math.pow(player.x - this.x, 2) + Math.pow(player.y - this.y, 2)
            );
            
            if (distance < 150 && !this.isInteracting) {
                this.handleAiTrigger();
            } else if (distance >= 150) {
                this.isInteracting = false;
            }
        }
    }

    draw() {
        if (this.canvas) { this.canvas.style.zIndex = "9999"; }
        super.draw();
    }
}

export default Wolf;