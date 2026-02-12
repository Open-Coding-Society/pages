import GameEnvBackground from '/assets/js/GameEnginev1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1/essentials/Player.js';
import Boss from '/assets/js/GameEnginev1/essentials/Boss.js';

class MurderMysteryBossFight {
  constructor(gameEnv) {
    this.gameEnv = gameEnv;
    const path = gameEnv.path;

    const image_data_background = {
      name: 'background',
      greeting: "The story begins here, you will search for clues and solve the mystery of this murder.",
      src: path + "/images/murderMystery/boss_map.png",
      pixels: { height: 580, width: 1038 },
      mode: 'contain',
    };

    const sprite_data_archie = {
      id: 'Archie',
      greeting: "Hi, I am Archie.",
      src: path + "/images/murderMystery/archie_left.png",
      SCALE_FACTOR: 4,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 0,
      INIT_POSITION: { x: 250, y: 350 },
      pixels: { height: 150, width: 100 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      downRight: { row: 0, start: 0, columns: 1 },
      downLeft: { row: 0, start: 0, columns: 1 },
      left: { row: 0, start: 0, columns: 1 },
      right: { row: 0, start: 0, columns: 1 },
      up: { row: 0, start: 0, columns: 1 },
      upLeft: { row: 0, start: 0, columns: 1 },
      upRight: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.5, heightPercentage: 0.5 },
      keypress: { left: 65, right: 68, up: 87, down: 83 } // A, D, W, S
    };

    const sprite_data_boss = {
      id: 'Boss',
      src: path + "/images/murderMystery/bossleft.png",
      SCALE_FACTOR: 2.1,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 0,
      INIT_POSITION: { x: 850, y: 400 },
      pixels: { height: 200, width: 400 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      downRight: { row: 0, start: 0, columns: 1 },
      downLeft: { row: 0, start: 0, columns: 1 },
      left: { row: 0, start: 0, columns: 1 },
      right: { row: 0, start: 0, columns: 1 },
      up: { row: 0, start: 0, columns: 1 },
      upLeft: { row: 0, start: 0, columns: 1 },
      upRight: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.8, heightPercentage: 0.8 },
    };

    this.classes = [
      { class: GameEnvBackground, data: image_data_background },
      { class: Boss, data: sprite_data_boss },
      { class: Player, data: sprite_data_archie },
    ];
  }
}

export default MurderMysteryBossFight;


/*

--- BEFORE THE FIGHT ---

Narrator:
"The air grows cold as you step forward. The frigid air makes you uneasy. You can tell, the end is near."

Narrator:
"Beyond this chamber waits the perpetrator. The one responsible for the string of murders that have plagued this town"

Narrator:
"Take this bow. You will need it."

Narrator:
"Uncover the truth. End the murders."

Narrator:
"Take home the crown."

------------------------------

--- AFTER THE BOSS IS DEFEATED ---

Narrator:
"The captain falls. Dissolving into the shadows."

Narrator:
"From the ashes, an enchanted sword remains — humming with
a power not meant for mortal hands."

Narrator:
"The weapon is now yours."

Narrator:
"The mystery is solved. The people are safe once more."

Narrator:
"Congratulations."

------------------------------

--- CREDITS ---

"Thank you for playing."
"Murder Mystery"

Thank to our classmates, Mr. Mort and Anusha for guiding us through this trimester!

The End.
*/
