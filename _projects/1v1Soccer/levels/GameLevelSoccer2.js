import GameEnvBackground from '/assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '/assets/js/GameEnginev1.1/essentials/Npc.js';

class GameLevelSoccer2 {
  constructor(gameEnv) {
    const width = gameEnv.innerWidth;
    const height = gameEnv.innerHeight;
    const path = gameEnv.path;

    const image_data_stadium = {
      id: 'SoccerStadium2',
      src: `${path}/images/projects/1v1Soccer/1v1SoccerBkground.png`,
      pixels: { height: 1080, width: 1920 }
    };

    const sprite_data_player = {
      id: 'PlayerSteve',
      greeting: 'Player: Steve (Level 2)',
      src: `${path}/images/projects/1v1Soccer/steve.png`,
      SCALE_FACTOR: 5,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 50,
      INIT_POSITION: { x: width * 0.15, y: height * 0.70 },
      pixels: { height: 256, width: 128 },
      orientation: { rows: 8, columns: 4 },
      down: { row: 1, start: 0, columns: 4 },
      downRight: { row: 7, start: 0, columns: 4, rotate: Math.PI / 16 },
      downLeft: { row: 5, start: 0, columns: 4, rotate: -Math.PI / 16 },
      left: { row: 5, start: 0, columns: 4 },
      right: { row: 7, start: 0, columns: 4 },
      up: { row: 3, start: 0, columns: 4 },
      upLeft: { row: 5, start: 0, columns: 4, rotate: Math.PI / 16 },
      upRight: { row: 7, start: 0, columns: 4, rotate: -Math.PI / 16 },
      hitbox: { widthPercentage: 0.40, heightPercentage: 0.25 },
      keypress: { up: 87, left: 65, down: 83, right: 68 }
    };

    const sprite_data_cpu = {
      id: 'CPU-Tux',
      greeting: 'CPU Opponent: Tux',
      src: `${path}/images/projects/1v1Soccer/tux.png`,
      SCALE_FACTOR: 8,
      ANIMATION_RATE: 50,
      INIT_POSITION: { x: width * 0.75, y: height * 0.70 },
      pixels: { height: 256, width: 352 },
      orientation: { rows: 8, columns: 11 },
      down: { row: 5, start: 0, columns: 3 },
      hitbox: { widthPercentage: 0.30, heightPercentage: 0.25 }
    };

    const sprite_data_ball = {
      id: 'SoccerBall',
      greeting: 'Kickoff ready!',
      src: `${path}/images/projects/1v1Soccer/bitcoin.png`,
      SCALE_FACTOR: 14,
      ANIMATION_RATE: 100,
      INIT_POSITION: { x: width * 0.50, y: height * 0.72 },
      pixels: { height: 256, width: 256 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.25, heightPercentage: 0.25 }
    };

    this.classes = [
      { class: GameEnvBackground, data: image_data_stadium },
      { class: Player, data: sprite_data_player },
      { class: Npc, data: sprite_data_cpu },
      { class: Npc, data: sprite_data_ball }
    ];
  }
}

export default GameLevelSoccer2;
