import PeppaBattleLevelBase from './PeppaBattleLevelBase.js';

class PeppaLevel3 extends PeppaBattleLevelBase {
	constructor(gameEnv) {
		let config = {
			levelId: 'lvl3',
			levelTitle: 'Level 3: Final Boss - Daddy Pig',
			levelIntro: 'Final round. Daddy Pig enters as the boss.',
			enemyName: 'Daddy Pig',
			enemyGreeting: 'Ho ho! Daddy Pig is the final boss of the ring.',
			enemyImage: 'daddypig.png',
			enemyHealth: 10,
			enemySpeed: 1.4,
			enemyScale: 4,
			playerHealth: 4,
			playerDamage: 1
		};

		// Apply power-up if chosen
		if (gameEnv.gameControl.chosenPower) {
			if (gameEnv.gameControl.chosenPower === 'Extra Speed') {
				config.playerSpeedMultiplier = 2; // Doubled for noticeable effect
			} else if (gameEnv.gameControl.chosenPower === 'Extra Health') {
				config.playerHealth = 6;
			} else if (gameEnv.gameControl.chosenPower === 'Extra Damage') {
				config.playerDamage = 2;
			}
		}

		super(gameEnv, config);
	}
}

export default PeppaLevel3;
