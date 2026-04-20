import GameEnvBackground from './essentials/GameEnvBackground.js';
import Npc from './essentials/Npc.js';
import Player from './essentials/Player.js';
import showDialogBox from './essentials/DialogBox.js';

class GameLevelOptionsHub {
  constructor(gameEnv) {
    const width = gameEnv.innerWidth;
    const height = gameEnv.innerHeight;
    const path = gameEnv.path;

    const image_data_hub = {
      id: 'Options-Hub-Background',
      src: `${path}/images/gamify/siliconvalley2.png`,
      pixels: { height: 1024, width: 1024 }
    };

    const sprite_data_player = {
      id: 'Chill Guy',
      greeting: 'I made it to the options hub. Time to level up strategy.',
      src: `${path}/images/gamify/chillguy.png`,
      SCALE_FACTOR: 5,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 50,
      INIT_POSITION: { x: width * 0.12, y: height * 0.84 },
      pixels: { height: 384, width: 512 },
      orientation: { rows: 3, columns: 4 },
      down: { row: 0, start: 0, columns: 3 },
      downRight: { row: 1, start: 0, columns: 3, rotate: Math.PI / 16 },
      downLeft: { row: 2, start: 0, columns: 3, rotate: -Math.PI / 16 },
      left: { row: 2, start: 0, columns: 3 },
      right: { row: 1, start: 0, columns: 3 },
      up: { row: 3, start: 0, columns: 3 },
      upLeft: { row: 2, start: 0, columns: 3, rotate: Math.PI / 16 },
      upRight: { row: 1, start: 0, columns: 3, rotate: -Math.PI / 16 },
      hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
      keypress: { up: 87, left: 65, down: 83, right: 68 }
    };

    const sprite_data_options_npc = {
      id: 'Options-Trader-NPC',
      greeting: 'Welcome to the options desk. Calls, puts, and risk control start here.',
      src: `${path}/images/gamify/stockguy.png`,
      SCALE_FACTOR: 10,
      ANIMATION_RATE: 50,
      pixels: { height: 441, width: 339 },
      INIT_POSITION: { x: width * 0.52, y: height * 0.58 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      interact: function () {
        showDialogBox(
          'Options Trading NPC',
          'Options are contracts with expiration dates. Use calls when you expect upside and puts when you want downside protection. Ready to open the options challenge?',
          [
            { label: 'Open Options Challenge', action: () => window.open(`${path}/gamify/fortuneFinders/quante`, '_blank') },
            { label: 'Risk Tip', action: () => showDialogBox('Risk Tip', 'Keep position size small and always define max loss before entering an options trade.', [{ label: 'Back', action: () => {}, keepOpen: false }]), keepOpen: true },
            { label: 'Close', action: () => {}, keepOpen: false }
          ]
        );
      }
    };

    const sprite_data_guide = {
      id: 'Wallstreet-Guide-NPC',
      greeting: 'You are ready for Wallstreet.',
      src: `${path}/images/gamify/janetYellen.png`,
      SCALE_FACTOR: 6,
      ANIMATION_RATE: 50,
      pixels: { height: 282, width: 268 },
      INIT_POSITION: { x: width * 0.78, y: height * 0.72 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      interact: function () {
        showDialogBox(
          'Guide',
          'You completed the options hub. Travel to Wallstreet now?',
          [
            {
              label: 'Travel to Wallstreet',
              action: () => {
                if (gameEnv?.game?.gameControl?.endLevel) {
                  gameEnv.game.gameControl.endLevel();
                }
              },
              keepOpen: false
            },
            { label: 'Stay Here', action: () => {}, keepOpen: false }
          ]
        );
      }
    };

    const sprite_data_airport_return = {
      id: 'Go-to-Airport-Level-NPC',
      greeting: 'Go to Airport Level',
      src: `${path}/images/gamify/miningRigMan.png`,
      SCALE_FACTOR: 6,
      ANIMATION_RATE: 50,
      pixels: { height: 400, width: 354 },
      INIT_POSITION: { x: width * 0.22, y: height * 0.55 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.08, heightPercentage: 0.14 },
      interact: function () {
        showDialogBox(
          'Crypto Miner: Go to Airport Level',
          'Want to go back to Airport Level?',
          [
            {
              label: 'Go to Airport Level',
              action: () => {
                if (gameEnv?.game?.gameControl) {
                  gameEnv.game.gameControl.currentLevelIndex = 0;
                  gameEnv.game.gameControl.transitionToLevel();
                }
              },
              keepOpen: false
            },
            { label: 'Stay on Map 2', action: () => {}, keepOpen: false }
          ]
        );
      }
    };

    this.classes = [
      { class: GameEnvBackground, data: image_data_hub },
      { class: Player, data: sprite_data_player },
      { class: Npc, data: sprite_data_options_npc },
      { class: Npc, data: sprite_data_airport_return },
      { class: Npc, data: sprite_data_guide }
    ];
  }
}

export default GameLevelOptionsHub;
