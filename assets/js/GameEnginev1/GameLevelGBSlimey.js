// Adventure Game Custom Level
// Exported from GameBuilder on 2026-03-04T18:17:45.111Z
// How to use this file:
// 1) Save as assets/js/adventureGame/GameLevelSlimey.js in your repo.
// 2) Reference it in your runner or level selector. Examples:
//    import GameLevelPlanets from '/assets/js/GameEnginev1/GameLevelPlanets.js';
//    import GameLevelSlimey from '/assets/js/adventureGame/GameLevelSlimey.js';
//    export const gameLevelClasses = [GameLevelPlanets, GameLevelSlimey];
//    // or pass it directly to your GameControl as the only level.
// 3) Ensure images exist and paths resolve via 'path' provided by the engine.
// 4) You can add more objects to this.classes inside the constructor.

import GameEnvBackground from './essentials/GameEnvBackground.js';
import Player from './essentials/Player.js';
import Npc from './essentials/Npc.js';
import Barrier from './essentials/Barrier.js';

class GameLevelGBSlimey {
    constructor(gameEnv) {
        const path = gameEnv.path;
        const width = gameEnv.innerWidth;
        const height = gameEnv.innerHeight;

        const bgData = {
            name: "custom_bg",
            src: path + "/images/gamebuilder/bg/alien_planet.jpg",
            pixels: { height: 772, width: 1134 }
        };

        const playerData = {
            id: 'playerData',
            src: path + "/images/gamebuilder/sprites/slime.png",
            SCALE_FACTOR: 5,
            STEP_FACTOR: 1000,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: 450, y: 300 },
            pixels: { height: 225, width: 225 },
            orientation: { rows: 4, columns: 4 },
            down: { row: 2, start: 0, columns: 3 },
            downRight: { row: 1, start: 0, columns: 3, rotate: Math.PI/16 },
            downLeft: { row: 0, start: 0, columns: 3, rotate: -Math.PI/16 },
            left: { row: 0, start: 0, columns: 3 },
            right: { row: 1, start: 0, columns: 3 },
            up: { row: 3, start: 0, columns: 3 },
            upLeft: { row: 2, start: 0, columns: 3, rotate: Math.PI/16 },
            upRight: { row: 3, start: 0, columns: 3, rotate: -Math.PI/16 },
            hitbox: { widthPercentage: 0, heightPercentage: .20 },
            keypress: { up: 87, left: 65, down: 83, right: 68 }
            };

        const npcData1 = {
            id: 'NPC',
            greeting: 'Hi I am r2d2',
            src: path + "/images/gamify/r2_idle.png",
            SCALE_FACTOR: 8,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: 500, y: 158 },
            pixels: { height: 223, width: 505 },
            orientation: { rows: 1, columns: 3 },
            down: { row: 0, start: 0, columns: 3 },
            right: { row: Math.min(1, 1 - 1), start: 0, columns: 3 },
            left: { row: Math.min(2, 1 - 1), start: 0, columns: 3 },
            up: { row: Math.min(3, 1 - 1), start: 0, columns: 3 },
            upRight: { row: Math.min(3, 1 - 1), start: 0, columns: 3 },
            downRight: { row: Math.min(1, 1 - 1), start: 0, columns: 3 },
            upLeft: { row: Math.min(2, 1 - 1), start: 0, columns: 3 },
            downLeft: { row: 0, start: 0, columns: 3 },
            hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
            dialogues: ['Hi I am r2d2'],
            reaction: function() { if (this.dialogueSystem) { this.showReactionDialogue(); } else { console.log(this.greeting); } },
            interact: function() { if (this.dialogueSystem) { this.showRandomDialogue(); } }
        };
        const dbarrier_1 = {
            id: 'dbarrier_1', x: 216, y: 12, width: 28, height: 125, visible: false,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_2 = {
            id: 'dbarrier_2', x: 11, y: 96, width: 202, height: 42, visible: false,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };
this.classes = [      { class: GameEnvBackground, data: bgData },
      { class: Player, data: playerData },
      { class: Npc, data: npcData1 },
      { class: Barrier, data: dbarrier_1 },
      { class: Barrier, data: dbarrier_2 }
];

        
    }
}

export default GameLevelGBSlimey;