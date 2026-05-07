import PeppaBattleLevelBase from './PeppaBattleLevelBase.js';

class PeppaLevel2 extends PeppaBattleLevelBase {
	constructor(gameEnv) {
		super(gameEnv, {
			levelId: 'lvl2',
			levelTitle: 'Level 2: Ring Fight vs Peppa Pig',
			levelIntro: 'Round two starts. Peppa Pig steps into the ring.',
			enemyName: 'Peppa Pig',
			enemyGreeting: 'Snort! Peppa Pig is not going easy on you.',
			enemyImage: 'peppapig.png',
			enemyHealth: 5,
			enemySpeed: 1.2,
			enemyScale: 4,
			playerHealth: 4
			});
	}
}

export default PeppaLevel2;
