import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import Box from '@assets/js/GameEnginev1.1/essentials/Box.js';
import SplineBarrier from '/assets/js/GameEnginev1.1/essentials/SplineBarrier.js';
import TimeLapScreen from './TimeLapScreen.js';

class GameLevelAutumn {
  constructor(gameEnv) {
    const path = gameEnv.path;
    const background_data = {
      name: "Autumn Course",
      greeting: "Welcome to the Autumn Level!",
      src: "/images/projects/racing-game/Autumn_Track.jpeg",
      pixels: { height: 360, width: 643 }
    };
    const player_data = {
        name: "Red Car",
        greeting: "I'm the red car!",
        src: "/images/projects/racing-game/Directions_red_car.png",
        SCALE_FACTOR: 10,
        STEP_FACTOR: 1100,
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
      id: "barrier-1",
      coordinateSpace: "normalized",
      splinePoints: [{"x":0.1219,"y":0.8023},{"x":0.1093,"y":0.7819},{"x":0.1075,"y":0.7462},{"x":0.1047,"y":0.4477},{"x":0.1147,"y":0.4222},{"x":0.216,"y":0.4196},{"x":0.2775,"y":0.5191},{"x":0.3064,"y":0.5293},{"x":0.3309,"y":0.5293},{"x":0.3553,"y":0.5217},{"x":0.3752,"y":0.5089},{"x":0.491,"y":0.2921},{"x":0.5099,"y":0.2844},{"x":0.7533,"y":0.2819},{"x":0.7632,"y":0.3054},{"x":0.9052,"y":0.563},{"x":0.8962,"y":0.7798},{"x":0.8102,"y":0.8003},{"x":0.1319,"y":0.8079}]
    };
    const barrierData2 = {
      id: "barrier-2",
      coordinateSpace: "normalized",
      splinePoints: [{"x":0.0939,"y":0.9212},{"x":0.1156,"y":0.9314},{"x":0.6908,"y":0.9314},{"x":0.9097,"y":0.9309},{"x":0.9351,"y":0.9156},{"x":0.9477,"y":0.9028},{"x":0.964,"y":0.8671},{"x":0.9758,"y":0.8059},{"x":0.973,"y":0.5452},{"x":0.9631,"y":0.4865},{"x":0.8021,"y":0.1829},{"x":0.7885,"y":0.1599},{"x":0.7686,"y":0.1599},{"x":0.4991,"y":0.1574},{"x":0.4656,"y":0.1676},{"x":0.4439,"y":0.1982},{"x":0.4195,"y":0.2339},{"x":0.3969,"y":0.2824},{"x":0.3327,"y":0.3946},{"x":0.3092,"y":0.3946},{"x":0.263,"y":0.3105},{"x":0.235,"y":0.2875},{"x":0.1789,"y":0.2824},{"x":0.093,"y":0.3054},{"x":0.064,"y":0.3232},{"x":0.0423,"y":0.3793},{"x":0.0342,"y":0.4431},{"x":0.0414,"y":0.813},{"x":0.0505,"y":0.8793},{"x":0.0785,"y":0.9125}]
    };
    const BoxData = {
      id: "box-1",
      src: "/images/projects/racing-game/BoxObstacle.png",
      coordinateSpace: "normalized",
      position: { x: 0.5, y: 0.5 },
      size: { width: 0.1, height: 0.1 }
    };


    this.classes = [
      { class: GameEnvBackground, data: background_data },
      { class: Player, data: player_data },
      { class: SplineBarrier, data: barrierData1 },
      { class: SplineBarrier, data: barrierData2 },
      { class: Box, data: BoxData },
      { class: TimeLapScreen, data: { currentLap: 1, totalLaps: 3 } }
    ];
  }
}

export default GameLevelAutumn;