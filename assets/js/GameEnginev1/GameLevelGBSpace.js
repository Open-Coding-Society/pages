// Adventure Game Custom Level
// Exported from GameBuilder on 2026-03-09T17:24:52.088Z
// How to use this file:
// 1) Save as assets/js/adventureGame/GameLevelBspace.js in your repo.
// 2) Reference it in your runner or level selector. Examples:
//    import GameLevelPlanets from '/assets/js/GameEnginev1/GameLevelPlanets.js';
//    import GameLevelBspace from '/assets/js/adventureGame/GameLevelBspace.js';
//    export const gameLevelClasses = [GameLevelPlanets, GameLevelBspace];
//    // or pass it directly to your GameControl as the only level.
// 3) Ensure images exist and paths resolve via 'path' provided by the engine.
// 4) You can add more objects to this.classes inside the constructor.

import GameEnvBackground from './essentials/GameEnvBackground.js';
import Player from './essentials/Player.js';
import Npc from './essentials/Npc.js';
import Barrier from './essentials/Barrier.js';

class GameLevelGBSpace {
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
            src: path + "/images/gamebuilder/sprites/ufos.png",
            SCALE_FACTOR: 6,
            STEP_FACTOR: 1000,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: 100, y: 300 },
            pixels: { height: 500, width: 500 },
            orientation: { rows: 4, columns: 3 },
            down: { row: 0, start: 0, columns: 3 },
            downRight: { row: 1, start: 0, columns: 3, rotate: Math.PI/16 },
            downLeft: { row: 0, start: 0, columns: 3, rotate: -Math.PI/16 },
            left: { row: 2, start: 0, columns: 3 },
            right: { row: 1, start: 0, columns: 3 },
            up: { row: 3, start: 0, columns: 3 },
            upLeft: { row: 2, start: 0, columns: 3, rotate: Math.PI/16 },
            upRight: { row: 3, start: 0, columns: 3, rotate: -Math.PI/16 },
            hitbox: { widthPercentage: 0.2, heightPercentage: 0.4 },
            keypress: { up: 87, left: 65, down: 83, right: 68 }
            };

        const npcData1 = {
            id: 'NPC',
            greeting: 'Hello!',
            src: path + "/images/gamebuilder/sprites/astro.png",
            SCALE_FACTOR: 9,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: 0.7, y: 0.2 },
            pixels: { height: 770, width: 513 },
            orientation: { rows: 4, columns: 4 },
            down: { row: 0, start: 0, columns: 3 },
            right: { row: Math.min(1, 4 - 1), start: 0, columns: 3 },
            left: { row: Math.min(2, 4 - 1), start: 0, columns: 3 },
            up: { row: Math.min(3, 4 - 1), start: 0, columns: 3 },
            upRight: { row: Math.min(3, 4 - 1), start: 0, columns: 3 },
            downRight: { row: Math.min(1, 4 - 1), start: 0, columns: 3 },
            upLeft: { row: Math.min(2, 4 - 1), start: 0, columns: 3 },
            downLeft: { row: 0, start: 0, columns: 3 },
            hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
            dialogues: ['Hello!'],
            reaction: function() { if (this.dialogueSystem) { this.showReactionDialogue(); } else { console.log(this.greeting); } },
            interact: function() { if (this.dialogueSystem) { this.showRandomDialogue(); } }
        };

        // Simple maze barriers using relative positioning (0-1 values)
        // Maze is offset from center, creating a playable area
        
        // Outer walls
        const mazeTop = {
            id: 'maze_top',
            x: 0.2, y: 0.15, width: 0.6, height: 0.02,
            color: 'rgba(100, 50, 200, 0.5)',
            visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 }
        };
        
        const mazeBottom = {
            id: 'maze_bottom',
            x: 0.2, y: 0.83, width: 0.6, height: 0.02,
            color: 'rgba(100, 50, 200, 0.5)',
            visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 }
        };
        
        // Split left wall into two parts with an entrance gap
        const mazeLeftTop = {
            id: 'maze_left_top',
            x: 0.2, y: 0.15, width: 0.02, height: 0.20,  // Top section
            color: 'rgba(100, 50, 200, 0.5)',
            visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 }
        };
        
        const mazeLeftBottom = {
            id: 'maze_left_bottom',
            x: 0.2, y: 0.55, width: 0.02, height: 0.30,  // Bottom section (gap at 0.40-0.55)
            color: 'rgba(100, 50, 200, 0.5)',
            visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 }
        };
        
        const mazeRight = {
            id: 'maze_right',
            x: 0.78, y: 0.15, width: 0.02, height: 0.7,
            color: 'rgba(100, 50, 200, 0.5)',
            visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 }
        };
        
        // Internal maze walls - creating a simple path
        const mazeWall1 = {
            id: 'maze_wall_1',
            x: 0.3, y: 0.25, width: 0.02, height: 0.3,
            color: 'rgba(150, 100, 255, 0.5)',
            visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 }
        };
        
        const mazeWall2 = {
            id: 'maze_wall_2',
            x: 0.45, y: 0.35, width: 0.25, height: 0.02,
            color: 'rgba(150, 100, 255, 0.5)',
            visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 }
        };
        
        const mazeWall3 = {
            id: 'maze_wall_3',
            x: 0.45, y: 0.55, width: 0.02, height: 0.2,
            color: 'rgba(150, 100, 255, 0.5)',
            visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 }
        };
        
        const mazeWall4 = {
            id: 'maze_wall_4',
            x: 0.55, y: 0.45, width: 0.15, height: 0.02,
            color: 'rgba(150, 100, 255, 0.5)',
            visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 }
        };
        
        const mazeWall5 = {
            id: 'maze_wall_5',
            x: 0.6, y: 0.25, width: 0.02, height: 0.35,
            color: 'rgba(150, 100, 255, 0.5)',
            visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 }
        };

this.classes = [
      { class: GameEnvBackground, data: bgData },
      { class: Player, data: playerData },
      { class: Npc, data: npcData1 },
      // Maze barriers
      { class: Barrier, data: mazeTop },
      { class: Barrier, data: mazeBottom },
      { class: Barrier, data: mazeLeftTop },      // Split left wall
      { class: Barrier, data: mazeLeftBottom },   // with entrance gap
      { class: Barrier, data: mazeRight },
      { class: Barrier, data: mazeWall1 },
      { class: Barrier, data: mazeWall2 },
      { class: Barrier, data: mazeWall3 },
      { class: Barrier, data: mazeWall4 },
      { class: Barrier, data: mazeWall5 }
];

        
    }
}

export default GameLevelGBSpace;