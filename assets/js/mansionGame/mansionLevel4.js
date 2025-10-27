// To build GameLevels, each contains GameObjects from below imports
import GameEnvBackground from './GameEngine/GameEnvBackground.js';
import Player from './GameEngine/Player.js';

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

	// Player data for character (Chill Guy)
	const sprite_src_chillguy = path + "/images/gamify/chillguy.png"; // be sure to include the path
	const CHILLGUY_SCALE_FACTOR = 5;
	const sprite_data_chillguy = {
		id: 'Chill Guy',
		greeting: "Hi I am Chill Guy, ready to explore the casino!",
		src: sprite_src_chillguy,
		SCALE_FACTOR: CHILLGUY_SCALE_FACTOR,
		STEP_FACTOR: 1000,
		ANIMATION_RATE: 50,
		INIT_POSITION: { x: 0, y: height - (height/CHILLGUY_SCALE_FACTOR) },
		pixels: {height: 384, width: 512},
		orientation: {rows: 3, columns: 4 },
		down: {row: 0, start: 0, columns: 3 },
		downRight: {row: 1, start: 0, columns: 3, rotate: Math.PI/16 },
		downLeft: {row: 2, start: 0, columns: 3, rotate: -Math.PI/16 },
		left: {row: 2, start: 0, columns: 3 },
		right: {row: 1, start: 0, columns: 3 },
		up: {row: 3, start: 0, columns: 3 },
		upLeft: {row: 2, start: 0, columns: 3, rotate: Math.PI/16 },
		upRight: {row: 1, start: 0, columns: 3, rotate: -Math.PI/16 },
		hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
	// Allow both WASD and Arrow keys: W/UpArrow, A/LeftArrow, S/DownArrow, D/RightArrow
	keypress: { up: [87, 38], left: [65, 37], down: [83, 40], right: [68, 39] } // W,A,S,D and Arrows
	};

	// List of objects defnitions for this level
	this.classes = [
	  { class: GameEnvBackground, data: image_data_background },
	  { class: Player, data: sprite_data_chillguy },
	];
  }

}

export default MansionLevel4