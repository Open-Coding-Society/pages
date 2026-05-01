import PeppaBattleLevelBase from './PeppaBattleLevelBase.js';

class PeppaLevel1 extends PeppaBattleLevelBase {
	constructor(gameEnv) {
		super(gameEnv, {
			levelId: 'lvl1',
			levelTitle: 'Level 1: Ring Fight vs George Pig',
			levelIntro: 'Ishan Jha enters the fighting ring for round one against George Pig.',
			enemyName: 'George Pig',
			enemyGreeting: 'Dinosaur roar! George Pig is ready to fight!',
			enemyImage: 'georgiepig.png',
			enemyHealth: 5,
			enemySpeed: 1.0,
			enemyScale: 4,
			playerHealth: 4
			});
	}
}

export default PeppaLevel1;
