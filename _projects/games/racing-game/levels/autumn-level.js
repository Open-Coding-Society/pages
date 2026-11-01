import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from './PlayerCar.js';
import RacingBot from './RacingBot.js';
import Character from '@assets/js/GameEnginev1.1/essentials/Character.js';
import SplineBarrier from '@assets/js/GameEnginev1.1/essentials/SplineBarrier.js';
import TimeLapScreen from './TimeLapScreen.js';
import { AUTUMN_SPLINE_BARRIER_POINTS, AUTUMN_SPLINE_COLLISION_WIDTH } from './AutumnTrackGeometry.js';
import RaceDifficultyPrompt from './RaceDifficultyPrompt.js';
import { RACING_CAR_HITBOX } from './RacingCarPhysics.js';
import cleanupRacingLevel from './cleanup-racing-level.js';

class GameLevelAutumn {
  constructor(gameEnv) {
    this.gameEnv = gameEnv;
    const path = gameEnv.path;
    const background_data = {
      name: "Autumn Course",
      greeting: "Welcome to the Autumn Level!",
      src: path + '/images/projects/racing-game/Autumn_Mud_track.png',
      pixels: { height: 360, width: 643 }
    };
    const player_data = {
        name: "Red Car",
        greeting: "I'm the red car!",
        src: path + '/images/projects/racing-game/Directions_red_car.png',
        SCALE_FACTOR: 10,
        STEP_FACTOR: 1100,
        heading: Math.PI / 2,
        INIT_POSITION: {x: 0.4, y: 0.77},
        pixels: { height: 1024, width: 1536 },
        orientation: { rows: 4, columns: 4 },
        up:        { row: 3, start: 0, columns: 1 },
        upRight:   { row: 0, start: 2, columns: 1, rotate: Math.PI },
        right:     { row: 1, start: 0, columns: 1 },
        downRight: { row: 2, start: 0, columns: 1 },
        down:      { row: 0, start: 0, columns: 1 },
        downLeft:  { row: 0, start: 2, columns: 1 },
        left:      { row: 3, start: 2, columns: 1 },
        upLeft:    { row: 2, start: 0, columns: 1, rotate: Math.PI },
        hitbox: RACING_CAR_HITBOX,
        keypress: { up: 87, left: 65, down: 83, right: 68 } // W, A, S, D
    }
    const bot_data = {
        name: "Blue Car",
        greeting: "Race against the blue car!",
        src: path + '/images/projects/racing-game/Directions_blue_car.png',
        SCALE_FACTOR: 10,
        STEP_FACTOR: 1100,
        heading: Math.PI / 2,
        INIT_POSITION: {x: 0.4, y: 0.82},
        pixels: { height: 1024, width: 1536 },
        orientation: { rows: 4, columns: 4 },
        up:        { row: 3, start: 0, columns: 1 },
        upRight:   { row: 0, start: 2, columns: 1, rotate: Math.PI },
        right:     { row: 3, start: 2, columns: 1, rotate: Math.PI },
        downRight: { row: 2, start: 0, columns: 1 },
        down:      { row: 0, start: 0, columns: 1 },
        downLeft:  { row: 0, start: 2, columns: 1 },
        left:      { row: 3, start: 2, columns: 1 },
        upLeft:    { row: 2, start: 0, columns: 1, rotate: Math.PI },
        hitbox: RACING_CAR_HITBOX,
        keypress: { up: 38, left: 37, down: 40, right: 39 }
    }
    const barrierData1 = {
      id: "barrier-1",
      coordinateSpace: "normalized",
      splinePoints: AUTUMN_SPLINE_BARRIER_POINTS[0],
      collisionWidth: AUTUMN_SPLINE_COLLISION_WIDTH,
      visible: false,
      hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
      fromOverlay: true,
    };
    const barrierData2 = {
      id: "barrier-2",
      coordinateSpace: "normalized",
      splinePoints: AUTUMN_SPLINE_BARRIER_POINTS[1],
      collisionWidth: AUTUMN_SPLINE_COLLISION_WIDTH,
      visible: false,
      hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
      fromOverlay: true,
    };
    const BoxData = {
      id: "box-1",
      src: path + '/images/projects/racing-game/BoxObstacle.png',
      coordinateSpace: "normalized",
      SCALE_FACTOR: 10,
      INIT_POSITION: { x: 0.47, y: 0.25 },
      hitbox: { widthPercentage: 0.5, heightPercentage: 0.5 },
      pixels: { height: 369, width: 676 },
      orientation: { rows: 1, columns: 1 },
    };
    const ConeData = {
      id: "cone-1",
      src: path + '/images/projects/racing-game/ConeObstacle.png',
      coordinateSpace: "normalized",
      SCALE_FACTOR: 10,
      INIT_POSITION: { x: 0.2985, y: 0.8404 },
      hitbox: { widthPercentage: 0.5, heightPercentage: 0.5 },
      pixels: { height: 369, width: 676 },
      orientation: { rows: 1, columns: 1 },
    };


    // Finish line on the painted start/finish line; HUD in the trees above the top-left corner.
    const lap_data = {
      totalLaps: 3,
      finishLine: { x: 0.453, top: 0.794, bottom: 0.941 },
      hudPosition: { x: 0.01, y: 0.02 }
    };

    this.classes = [
      { class: GameEnvBackground, data: background_data },
      { class: Player, data: player_data },
      { class: RacingBot, data: bot_data },
      { class: SplineBarrier, data: barrierData1 },
      { class: SplineBarrier, data: barrierData2 },
      { class: Character, data: BoxData },
      { class: TimeLapScreen, data: lap_data },
      { class: RaceDifficultyPrompt, data: {} },
    ];
  }

  destroy() {
    cleanupRacingLevel(this.gameEnv);
  }
}

export default GameLevelAutumn;