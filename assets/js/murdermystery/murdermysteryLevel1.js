---
layout: post
codemirror: true
title: Game Runner Examples
description: Learn game development using the GameEngine framework in a contained educational environment. Build game levels, add characters, and create interactive experiences with live code editing and debugging controls.
permalink: /rpg/game

---

## Basic Game: Desert Adventure

{% capture challenge1 %}
Run the basic desert adventure game. Use WASD or arrow keys to move Chill Guy around the desert. Walk up to R2D2 to trigger a mini-game!
{% endcapture %}

{% capture code1 %}
import GameControl from '/assets/js/adventureGame/GameEngine/GameControl.js';
import GameEnvBackground from '/assets/js/adventureGame/GameEngine/GameEnvBackground.js';
import Player from '/assets/js/adventureGame/GameEngine/Player.js';
import Npc from '/assets/js/adventureGame/GameEngine/Npc.js';
import Barrier from '/assets/js/adventureGame/GameEngine/Barrier.js';

class CustomLevel {
    constructor(gameEnv) {
        const path = gameEnv.path;
        const width = gameEnv.innerWidth;
        const height = gameEnv.innerHeight;
        const bgData = {
            name: 'custom_bg',
            src: path + "/images/gamify/desert.png",
            pixels: { height: 580, width: 1038 }
        };
        const playerData = {
            id: 'Hero',
            src: path + "/images/gamify/chillguy.png",
            SCALE_FACTOR: 5,
            STEP_FACTOR: 1000,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: 100, y: 300 },
            pixels: { height: 512, width: 384 },
            orientation: { rows: 4, columns: 3 },
            down: { row: 0, start: 0, columns: 3 },
            downRight: { row: Math.min(1, 4 - 1), start: 0, columns: 3, rotate: Math.PI/16 },
            downLeft: { row: Math.min(2, 4 - 1), start: 0, columns: 3, rotate: -Math.PI/16 },
            right: { row: Math.min(1, 4 - 1), start: 0, columns: 3 },
            left: { row: Math.min(2, 4 - 1), start: 0, columns: 3 },
            up: { row: Math.min(3, 4 - 1), start: 0, columns: 3 },
            upRight: { row: Math.min(1, 4 - 1), start: 0, columns: 3, rotate: -Math.PI/16 },
            upLeft: { row: Math.min(2, 4 - 1), start: 0, columns: 3, rotate: Math.PI/16 },
            hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
            keypress: { up: 87, left: 65, down: 83, right: 68 }
        };
        const npcData1 = {
            id: 'NPC',
            greeting: 'hi',
            src: path + "/images/gamify/r2_idle.png",
            SCALE_FACTOR: 8,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: 500, y: 300 },
            pixels: { height: 223, width: 505 },
            orientation: { rows: 1, columns: 3 },
            down: { row: 0, start: 0, columns: 3 },
            hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
            dialogues: ['hi'],
            reaction: function() { if (this.dialogueSystem) { this.showReactionDialogue(); } else { console.log(this.greeting); } },
            interact: function() { if (this.dialogueSystem) { this.showRandomDialogue(); } }
        };

        this.classes = [
                  { class: GameEnvBackground, data: bgData },
      { class: Player, data: playerData },
      { class: Npc, data: npcData1 }
        ];
    }
}

export { GameControl };
export const gameLevelClasses = [CustomLevel];
{% endcapture %}

{% include game-runner.html
   runner_id="game1"
   challenge=challenge1
   code=code1
   height="150px"
%}
