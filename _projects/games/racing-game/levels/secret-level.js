import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import SplineBarrier from '/assets/js/GameEnginev1.1/essentials/SplineBarrier.js';
import TimeLapScreen from './TimeLapScreen.js';

class GameLevelSecret {
  constructor(gameEnv) {
    const path = gameEnv.path;
    const background_data = {
      name: "Secret Course",
      greeting: "You have found the secret level.",
      src: "/images/projects/racing-game/Secret_Track.png",
      pixels: { height: 360, width: 643 }
    };
    const player_data = {
        name: "Red Car",
        greeting: "I'm the red car!",
        src: "/images/projects/racing-game/Directions_red_car.png",
        SCALE_FACTOR: 10,
        STEP_FACTOR: 1100,
        INIT_POSITION: { x: 360 / 750, y: 500 / 570},
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
      splinePoints: [{"x":0.4333,"y":0.8504},{"x":0.3909,"y":0.8571},{"x":0.339,"y":0.8571},{"x":0.2848,"y":0.8548},{"x":0.2389,"y":0.8437},{"x":0.2059,"y":0.8437},{"x":0.1682,"y":0.8348},{"x":0.1222,"y":0.8414},{"x":0.0798,"y":0.8236},{"x":0.0586,"y":0.7633},{"x":0.0645,"y":0.7098},{"x":0.0669,"y":0.6629},{"x":0.0928,"y":0.6406},{"x":0.1258,"y":0.6316},{"x":0.1588,"y":0.6339},{"x":0.1988,"y":0.6205},{"x":0.2212,"y":0.6048},{"x":0.2471,"y":0.5423},{"x":0.2483,"y":0.5089},{"x":0.2448,"y":0.4419},{"x":0.2165,"y":0.4084},{"x":0.1835,"y":0.3705},{"x":0.1364,"y":0.3682},{"x":0.0951,"y":0.3749},{"x":0.068,"y":0.3638},{"x":0.0622,"y":0.308},{"x":0.0892,"y":0.2812},{"x":0.1222,"y":0.2343},{"x":0.1493,"y":0.1941},{"x":0.1859,"y":0.1673},{"x":0.2212,"y":0.1696},{"x":0.2459,"y":0.183},{"x":0.2695,"y":0.2031},{"x":0.3072,"y":0.2187},{"x":0.3437,"y":0.2209},{"x":0.3897,"y":0.2164},{"x":0.4462,"y":0.2053},{"x":0.5275,"y":0.2075},{"x":0.6041,"y":0.2031},{"x":0.6642,"y":0.2075},{"x":0.6972,"y":0.1986},{"x":0.742,"y":0.1696},{"x":0.8009,"y":0.1606},{"x":0.8598,"y":0.1651},{"x":0.8904,"y":0.1763},{"x":0.9128,"y":0.1986},{"x":0.9234,"y":0.2522},{"x":0.8951,"y":0.2633},{"x":0.8633,"y":0.2611},{"x":0.8256,"y":0.27},{"x":0.7761,"y":0.2611},{"x":0.7561,"y":0.2789},{"x":0.7349,"y":0.3124},{"x":0.7255,"y":0.3682},{"x":0.7325,"y":0.4263},{"x":0.7679,"y":0.4664},{"x":0.8115,"y":0.4664},{"x":0.8515,"y":0.4687},{"x":0.8892,"y":0.4731},{"x":0.9281,"y":0.5044},{"x":0.9352,"y":0.5825},{"x":0.9022,"y":0.6495},{"x":0.861,"y":0.7187},{"x":0.8598,"y":0.7611},{"x":0.8563,"y":0.8057},{"x":0.8292,"y":0.8414},{"x":0.7785,"y":0.8548},{"x":0.7054,"y":0.8504},{"x":0.4274,"y":0.8526}],
      visible: false,
      hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
      fromOverlay: true,
    };
    const barrierData2 = {
      id: "barrier-3",
      coordinateSpace: "normalized",
      splinePoints: [{"x":0.451,"y":0.933},{"x":0.3685,"y":0.9285},{"x":0.2954,"y":0.9285},{"x":0.22,"y":0.9062},{"x":0.1599,"y":0.9084},{"x":0.1222,"y":0.9151},{"x":0.0845,"y":0.9062},{"x":0.0504,"y":0.8816},{"x":0.028,"y":0.8481},{"x":0.0115,"y":0.7946},{"x":0.0115,"y":0.7544},{"x":0.0103,"y":0.6919},{"x":0.0127,"y":0.6539},{"x":0.0339,"y":0.6004},{"x":0.0716,"y":0.5691},{"x":0.1246,"y":0.5557},{"x":0.1764,"y":0.5557},{"x":0.2012,"y":0.52},{"x":0.1988,"y":0.4754},{"x":0.1788,"y":0.4464},{"x":0.1246,"y":0.4397},{"x":0.0775,"y":0.4464},{"x":0.0339,"y":0.4196},{"x":0.015,"y":0.3682},{"x":0.0162,"y":0.2834},{"x":0.0409,"y":0.2388},{"x":0.0657,"y":0.2142},{"x":0.0845,"y":0.1785},{"x":0.1046,"y":0.1517},{"x":0.1305,"y":0.1249},{"x":0.167,"y":0.0981},{"x":0.2,"y":0.0959},{"x":0.2424,"y":0.1026},{"x":0.2825,"y":0.1316},{"x":0.3308,"y":0.1495},{"x":0.3685,"y":0.145},{"x":0.4439,"y":0.1361},{"x":0.4557,"y":0.1383},{"x":0.4557,"y":0.1071},{"x":0.458,"y":0.0513},{"x":0.4568,"y":0.0245},{"x":0.451,"y":0.0044}],
      visible: false,
      hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
      fromOverlay: true,
    };
    const barrierData3 = {
      id: "barrier-4",
      coordinateSpace: "normalized",
      splinePoints: [{"x":0.4474,"y":0.9352},{"x":0.4568,"y":0.933},{"x":0.458,"y":0.9932}],
      visible: false,
      hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
      fromOverlay: true,
    };
    const barrierData4 = {
      id: "barrier-5",
      coordinateSpace: "normalized",
      splinePoints: [{"x":0.5275,"y":0.991},{"x":0.5299,"y":0.9263},{"x":0.5959,"y":0.9307},{"x":0.6677,"y":0.9352},{"x":0.7208,"y":0.933},{"x":0.762,"y":0.9263},{"x":0.8127,"y":0.9307},{"x":0.8657,"y":0.9084},{"x":0.8975,"y":0.8705},{"x":0.9116,"y":0.8147},{"x":0.9175,"y":0.7589},{"x":0.9305,"y":0.7031},{"x":0.9588,"y":0.6718},{"x":0.9835,"y":0.6048},{"x":0.9859,"y":0.5178},{"x":0.9658,"y":0.4553},{"x":0.9234,"y":0.4106},{"x":0.8657,"y":0.3995},{"x":0.8091,"y":0.395},{"x":0.7879,"y":0.3973},{"x":0.7761,"y":0.3682},{"x":0.7797,"y":0.3414},{"x":0.7997,"y":0.3325},{"x":0.8327,"y":0.3303},{"x":0.8763,"y":0.3325},{"x":0.9293,"y":0.3325},{"x":0.9717,"y":0.3057},{"x":0.9788,"y":0.241},{"x":0.9588,"y":0.1718},{"x":0.9258,"y":0.1339},{"x":0.8928,"y":0.1093},{"x":0.8457,"y":0.0959},{"x":0.7938,"y":0.0981},{"x":0.749,"y":0.0937},{"x":0.7078,"y":0.1227},{"x":0.6619,"y":0.1473},{"x":0.5982,"y":0.1383},{"x":0.5311,"y":0.1406},{"x":0.5299,"y":0.1406},{"x":0.5299,"y":0.1406},{"x":0.5299,"y":0.1406},{"x":0.5299,"y":0.1406},{"x":0.5299,"y":0.1406},{"x":0.5287,"y":0.0289},{"x":0.5264,"y":0.0022}],
      visible: false,
      hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
      fromOverlay: true,
    };
    this.classes = [
        {class: GameEnvBackground, data: background_data},
        {class: Player, data: player_data},
        { class: SplineBarrier, data: barrierData1 },
        { class: SplineBarrier, data: barrierData2 },
        { class: SplineBarrier, data: barrierData3 },
        { class: SplineBarrier, data: barrierData4 },
        { class: TimeLapScreen, data: { currentLap: 1, totalLaps: 3 } },
    ]
  }
}

export default GameLevelSecret;