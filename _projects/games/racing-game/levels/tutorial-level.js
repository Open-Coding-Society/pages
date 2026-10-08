import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import SplineBarrier from '@assets/js/GameEnginev1.1/essentials/SplineBarrier.js';
import TimeLapScreen from './TimeLapScreen.js';

class GameLevelTutorial {
  constructor(gameEnv) {
    const path = gameEnv.path;
    const background_data = {
      name: "Tutorial Course",
      greeting: "Welcome to the Tutorial Level!",
      src: "/images/projects/racing-game/Tutorial_Track.jpeg",
      pixels: { height: 360, width: 643 }
    };
    const player_data = {
        name: "Red Car",
        greeting: "I'm the red car!",
        src: "/images/projects/racing-game/Directions_red_car.png",
        SCALE_FACTOR: 10,
        STEP_FACTOR: 1100,
        INIT_POSITION: { x: 700 / 1408, y: 440 / 600},
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
        hitbox: { widthPercentage: 0.5, heightPercentage: 0.5 },
        keypress: { up: 87, left: 65, down: 83, right: 68 } // W, A, S, D
    }

    const barrierData1 = {
      id: "barrier-2",
      coordinateSpace: "normalized",
      splinePoints: [{"x":0.1207,"y":0.5246},{"x":0.1336,"y":0.3795},{"x":0.1788,"y":0.259},{"x":0.2633,"y":0.1585},{"x":0.3465,"y":0.1362},{"x":0.4798,"y":0.134},{"x":0.6983,"y":0.1429},{"x":0.7499,"y":0.1674},{"x":0.79,"y":0.2121},{"x":0.8287,"y":0.2657},{"x":0.8624,"y":0.3505},{"x":0.8732,"y":0.4264},{"x":0.876,"y":0.4933},{"x":0.8739,"y":0.5737},{"x":0.8624,"y":0.6496},{"x":0.8474,"y":0.6987},{"x":0.8237,"y":0.75},{"x":0.7865,"y":0.8081},{"x":0.7399,"y":0.8482},{"x":0.679,"y":0.8683},{"x":0.6009,"y":0.8683},{"x":0.3149,"y":0.8683},{"x":0.2605,"y":0.8482},{"x":0.1996,"y":0.7902},{"x":0.1587,"y":0.7121},{"x":0.1329,"y":0.6139},{"x":0.12,"y":0.5157}],
      visible: false,
      hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
      fromOverlay: true,
    };
    const barrierData2 = {
      id: "barrier-3",
      coordinateSpace: "normalized",
      splinePoints: [{"x":0.2132,"y":0.5134},{"x":0.2196,"y":0.4308},{"x":0.239,"y":0.3661},{"x":0.2684,"y":0.3237},{"x":0.3128,"y":0.2969},{"x":0.6826,"y":0.2902},{"x":0.7169,"y":0.3081},{"x":0.7599,"y":0.3683},{"x":0.7807,"y":0.4331},{"x":0.7836,"y":0.509},{"x":0.7764,"y":0.5849},{"x":0.7449,"y":0.6607},{"x":0.6783,"y":0.7076},{"x":0.613,"y":0.7076},{"x":0.3286,"y":0.7032},{"x":0.2727,"y":0.6853},{"x":0.244,"y":0.6429},{"x":0.2239,"y":0.5804},{"x":0.2153,"y":0.5201}],
      visible: false,
      hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
      fromOverlay: true,
    };


    this.classes = [
      { class: GameEnvBackground, data: background_data },
      { class: Player, data: player_data },
      { class: SplineBarrier, data: barrierData1 },
      { class: SplineBarrier, data: barrierData2 },
      { class: TimeLapScreen, data: { currentLap: 1, totalLaps: 3 } }
    ];
  }
}

export default GameLevelTutorial; 