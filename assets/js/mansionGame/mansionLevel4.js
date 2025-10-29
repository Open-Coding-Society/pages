// To build GameLevels, each contains GameObjects from below imports
import GameEnvBackground from './GameEngine/GameEnvBackground.js';

class MansionLevel4 {
  constructor(gameEnv) {
	let width = gameEnv.innerWidth;
	let height = gameEnv.innerHeight;
	let path = gameEnv.path;

	// Background data
	const image_background = path + "/images/mansionGame/image_lvl4.png"; // be sure to include the path
	const image_data_background = {
		name: 'background',
		greeting: "This is the casino, you will try to gamble your way out of the level, survive as long as possible.",
		src: image_background,
		pixels: {height: 1280, width: 720}
	};

	
	const sprite_src_mc = path + "/images/gamify/spookMcWalk.png"; // be sure to include the path
	const MC_SCALE_FACTOR = 6;
	const sprite_data_chillguy = {
		id: 'Spook',
		greeting: "Hi, I am Spook.",
		src: sprite_src_mc,
		SCALE_FACTOR: MC_SCALE_FACTOR,
		STEP_FACTOR: 800,
		ANIMATION_RATE: 10,
		INIT_POSITION: { x: (width / 2 - width / (5 * MC_SCALE_FACTOR)), y: height - (height / MC_SCALE_FACTOR)},
		pixels: {height: 2400, width: 3600},
		orientation: {rows: 2, columns: 3},
		down: {row: 1, start: 0, columns: 3},
		downRight: {row: 1, start: 0, columns: 3, rotate: Math.PI/16},
		downLeft: {row: 0, start: 0, columns: 3, rotate: -Math.PI/16},
		left: {row: 0, start: 0, columns: 3},
		right: {row: 1, start: 0, columns: 3},
		up: {row: 1, start: 0, columns: 3},
		upLeft: {row: 0, start: 0, columns: 3, rotate: Math.PI/16},
		upRight: {row: 1, start: 0, columns: 3, rotate: -Math.PI/16},
		hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
	// Allow both WASD and Arrow keys: W/UpArrow, A/LeftArrow, S/DownArrow, D/RightArrow
	keypress: { up: [87, 38], left: [65, 37], down: [83, 40], right: [68, 39] } // W,A,S,D and Arrows
	};

	// List of objects defnitions for this level
	this.classes = [
		{ class: GameEnvBackground, data: image_data_background },
	];
  }

}

export default MansionLevel4