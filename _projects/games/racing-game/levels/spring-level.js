import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import TimeLapScreen from './TimeLapScreen.js';
import SplineBarrier from '@assets/js/GameEnginev1.1/essentials/SplineBarrier.js'

class GameLevelSpring {
  constructor(gameEnv) {
    const path = gameEnv.path;
    const background_data = {
      name: "Spring Course",
      greeting: "Welcome to the 3rd Annual Spring Grand Prix!",
      src: "/images/projects/racing-game/spring_track_level_3.jpg",
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
        keypress: { up: 87, left: 65, down: 83, right: 68 }
    }
    const barrierData1 = {
      id: "barrier-1",
      coordinateSpace: "normalized",
      splinePoints: [{"x":0.0214,"y":0.3282},{"x":0.025,"y":0.2345},{"x":0.0421,"y":0.1988},{"x":0.0679,"y":0.1697},{"x":0.1007,"y":0.1474},{"x":0.125,"y":0.1407},{"x":0.1671,"y":0.1363},{"x":0.21,"y":0.1497},{"x":0.2643,"y":0.1965},{"x":0.2821,"y":0.2122},{"x":0.3121,"y":0.2322},{"x":0.3371,"y":0.2412},{"x":0.3614,"y":0.2412},{"x":0.3914,"y":0.23},{"x":0.4243,"y":0.1854},{"x":0.4571,"y":0.1519},{"x":0.4957,"y":0.134},{"x":0.5271,"y":0.1273},{"x":0.5757,"y":0.1273},{"x":0.6229,"y":0.1296},{"x":0.6886,"y":0.1296},{"x":0.7457,"y":0.1385},{"x":0.7964,"y":0.1675},{"x":0.8457,"y":0.1965},{"x":0.8907,"y":0.2635},{"x":0.9657,"y":0.3617},{"x":0.9871,"y":0.4465},{"x":0.9864,"y":0.5827},{"x":0.9821,"y":0.6519},{"x":0.955,"y":0.7256},{"x":0.8886,"y":0.7947},{"x":0.7771,"y":0.8126},{"x":0.6171,"y":0.8059},{"x":0.5879,"y":0.8104},{"x":0.57,"y":0.8215},{"x":0.5643,"y":0.8863},{"x":0.5636,"y":0.9175},{"x":0.5636,"y":0.9956},{"x":0.3543,"y":0.9956},{"x":0.3529,"y":0.8595},{"x":0.3457,"y":0.8081},{"x":0.2921,"y":0.8126},{"x":0.2421,"y":0.8104},{"x":0.1379,"y":0.8081},{"x":0.0786,"y":0.7814},{"x":0.0543,"y":0.7456},{"x":0.0357,"y":0.7032},{"x":0.0229,"y":0.6117},{"x":0.0243,"y":0.5671},{"x":0.0371,"y":0.5425},{"x":0.05,"y":0.518},{"x":0.0671,"y":0.5001},{"x":0.1179,"y":0.4622},{"x":0.1379,"y":0.4555},{"x":0.1693,"y":0.451},{"x":0.2293,"y":0.4733},{"x":0.2871,"y":0.5381},{"x":0.3393,"y":0.5894},{"x":0.3871,"y":0.6184},{"x":0.4286,"y":0.634},{"x":0.475,"y":0.6139},{"x":0.5157,"y":0.5894},{"x":0.5636,"y":0.5604},{"x":0.6121,"y":0.5581},{"x":0.6721,"y":0.547},{"x":0.7571,"y":0.5492},{"x":0.7886,"y":0.5358},{"x":0.7986,"y":0.509},{"x":0.7943,"y":0.4889},{"x":0.7764,"y":0.4555},{"x":0.7464,"y":0.4153},{"x":0.705,"y":0.3706},{"x":0.6221,"y":0.3729},{"x":0.5357,"y":0.3706},{"x":0.4664,"y":0.4465},{"x":0.4029,"y":0.5113},{"x":0.35,"y":0.5247},{"x":0.2979,"y":0.5068},{"x":0.24,"y":0.4577},{"x":0.1871,"y":0.4175},{"x":0.1086,"y":0.4175},{"x":0.055,"y":0.4041},{"x":0.0257,"y":0.3394},{"x":0.0193,"y":0.2992}],
      visible: false,
      hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
      fromOverlay: true,
    };
    const barrierData2 = {
      id: "barrier-2",
      coordinateSpace: "normalized",
      splinePoints: [{"x":0.1,"y":0.2881},{"x":0.11,"y":0.2546},{"x":0.1243,"y":0.2389},{"x":0.1521,"y":0.2322},{"x":0.1907,"y":0.2412},{"x":0.2336,"y":0.2635},{"x":0.2943,"y":0.3104},{"x":0.3907,"y":0.3126},{"x":0.4486,"y":0.2657},{"x":0.4736,"y":0.2389},{"x":0.5121,"y":0.2077},{"x":0.5643,"y":0.201},{"x":0.615,"y":0.2032},{"x":0.6707,"y":0.2032},{"x":0.7114,"y":0.2032},{"x":0.7457,"y":0.2144},{"x":0.7757,"y":0.2434},{"x":0.8743,"y":0.3662},{"x":0.9,"y":0.4041},{"x":0.9086,"y":0.4443},{"x":0.91,"y":0.5894},{"x":0.895,"y":0.6385},{"x":0.8514,"y":0.7032},{"x":0.8164,"y":0.7099},{"x":0.7829,"y":0.7211},{"x":0.7114,"y":0.7211},{"x":0.5643,"y":0.73},{"x":0.3357,"y":0.7233},{"x":0.1729,"y":0.7099},{"x":0.1264,"y":0.6831},{"x":0.1064,"y":0.6273},{"x":0.1129,"y":0.576},{"x":0.1414,"y":0.5425},{"x":0.1643,"y":0.5381},{"x":0.1943,"y":0.5626},{"x":0.2179,"y":0.5827},{"x":0.2714,"y":0.6385},{"x":0.3193,"y":0.6876},{"x":0.3421,"y":0.7055},{"x":0.5221,"y":0.7166},{"x":0.5543,"y":0.6854},{"x":0.5957,"y":0.6675},{"x":0.6336,"y":0.6541},{"x":0.6936,"y":0.6541},{"x":0.7707,"y":0.6541},{"x":0.8243,"y":0.6497},{"x":0.865,"y":0.6206},{"x":0.885,"y":0.5358},{"x":0.8714,"y":0.4555},{"x":0.82,"y":0.3885},{"x":0.765,"y":0.3126},{"x":0.7364,"y":0.2903},{"x":0.6964,"y":0.2947},{"x":0.5743,"y":0.2903},{"x":0.5093,"y":0.2925},{"x":0.4793,"y":0.3081},{"x":0.4414,"y":0.355},{"x":0.4029,"y":0.3974},{"x":0.3536,"y":0.422},{"x":0.3171,"y":0.4086},{"x":0.2579,"y":0.3595},{"x":0.2279,"y":0.3416},{"x":0.2071,"y":0.3327},{"x":0.1643,"y":0.3349},{"x":0.1286,"y":0.3349},{"x":0.105,"y":0.3171},{"x":0.1014,"y":0.2903}],
      visible: false,
      hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
      fromOverlay: true,
    };
    this.classes = [
        {class: GameEnvBackground, data: background_data},
        {class: Player, data: player_data},
        {class: SplineBarrier, data: barrierData1},
        {class: SplineBarrier, data: barrierData2},
        {class: TimeLapScreen, data: { currentLap: 1, totalLaps: 3 }}
    ]
  }
}

export default GameLevelSpring;
