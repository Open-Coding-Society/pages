// To build GameLevels, each contains GameObjects from below imports
import GameEnvBackground from './GameEngine/GameEnvBackground.js';


class MansionLevel5 {
  constructor(gameEnv) {
	let width = gameEnv.innerWidth;
	let height = gameEnv.innerHeight;
	let path = gameEnv.path;

	// Background data
	const image_background = path + "/images/mansionGame/image_lvl4.png"; // be sure to include the path
	const image_data_background = {
		name: 'background',
		greeting: "This is the library, you will fight hordes of enemies, survive as long as possible.",
		src: image_background,
		pixels: {height: 1280, width: 720}
	};

	// List of objects defnitions for this level
	this.classes = [
	  { class: GameEnvBackground, data: image_data_background },
	//   { class: Player, data: sprite_data_chillguy },
	];
  }

}

export default MansionLevel5