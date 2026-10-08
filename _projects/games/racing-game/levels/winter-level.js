import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import SplineBarrier from '@assets/js/GameEnginev1.1/essentials/SplineBarrier.js';
import TimeLapScreen from './TimeLapScreen.js';


class GameLevelWinter {
  constructor(gameEnv) {
    const path = gameEnv.path;
    const background_data = {
      name: "Winter Course",
      greeting: "Welcome to the Winter Level!",
      src: "/images/projects/racing-game/Winter_Track.png",
      pixels: { height: 360, width: 643 } //this is the old version im testing new sizes.
      
    };
    const player_data = {
        name: "Red Car",
        greeting: "I'm the red car!",
        src: "/images/projects/racing-game/Directions_red_car.png",
        SCALE_FACTOR: 10,
        STEP_FACTOR: 1100,
        INIT_POSITION: {x: 370 / 740, y: 465 / 585},
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
      splinePoints: [{"x":0.0977,"y":0.2642},{"x":0.0555,"y":0.2975},{"x":0.0319,"y":0.3737},{"x":0.0339,"y":0.4713},{"x":0.0731,"y":0.5285},{"x":0.1281,"y":0.5285},{"x":0.1772,"y":0.519},{"x":0.2106,"y":0.5713},{"x":0.1939,"y":0.638},{"x":0.2185,"y":0.6166},{"x":0.1694,"y":0.6499},{"x":0.1281,"y":0.6785},{"x":0.1085,"y":0.7475},{"x":0.1144,"y":0.8261},{"x":0.1448,"y":0.8404},{"x":0.1978,"y":0.8618},{"x":0.2518,"y":0.8594},{"x":0.4836,"y":0.8547},{"x":0.8046,"y":0.8475},{"x":0.8557,"y":0.8285},{"x":0.8763,"y":0.7761},{"x":0.8724,"y":0.6451},{"x":0.8861,"y":0.7285},{"x":0.8468,"y":0.5999},{"x":0.8223,"y":0.5951},{"x":0.7968,"y":0.588},{"x":0.8174,"y":0.5475},{"x":0.8616,"y":0.5451},{"x":0.9156,"y":0.5428},{"x":0.9637,"y":0.5285},{"x":0.9921,"y":0.4237},{"x":0.9696,"y":0.3404},{"x":0.9107,"y":0.2666},{"x":0.8508,"y":0.2047},{"x":0.6799,"y":0.2094},{"x":0.6298,"y":0.219},{"x":0.5768,"y":0.2118},{"x":0.4158,"y":0.2118},{"x":0.3373,"y":0.2213},{"x":0.2597,"y":0.1594},{"x":0.1919,"y":0.1785},{"x":0.133,"y":0.2499},{"x":0.1154,"y":0.2618}],
      visible: false,
      hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
      fromOverlay: true,
    };
    const barrierData2 = {
      id: "barrier-3",
      coordinateSpace: "normalized",
      splinePoints: [{"x":0.1674,"y":0.3118},{"x":0.1173,"y":0.3309},{"x":0.079,"y":0.4118},{"x":0.135,"y":0.4475},{"x":0.0947,"y":0.457},{"x":0.0849,"y":0.4309},{"x":0.2057,"y":0.4451},{"x":0.2499,"y":0.4975},{"x":0.2734,"y":0.6166},{"x":0.2302,"y":0.6904},{"x":0.1703,"y":0.719},{"x":0.1753,"y":0.7737},{"x":0.2921,"y":0.7737},{"x":0.7575,"y":0.7737},{"x":0.8292,"y":0.7404},{"x":0.8213,"y":0.6737},{"x":0.7614,"y":0.6547},{"x":0.7378,"y":0.588},{"x":0.782,"y":0.4904},{"x":0.8704,"y":0.4761},{"x":0.9372,"y":0.4523},{"x":0.9254,"y":0.4047},{"x":0.8743,"y":0.3213},{"x":0.7928,"y":0.2737},{"x":0.6966,"y":0.2809},{"x":0.6505,"y":0.3023},{"x":0.6073,"y":0.2785},{"x":0.4325,"y":0.2761},{"x":0.3598,"y":0.3094},{"x":0.2695,"y":0.2666},{"x":0.2243,"y":0.238},{"x":0.1861,"y":0.269},{"x":0.1713,"y":0.2951}],
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

export default GameLevelWinter;