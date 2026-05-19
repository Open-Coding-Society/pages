import GameLevelPropertyDeal from './GameLevelPropertyDeal.js';

class GameLevelLuxury extends GameLevelPropertyDeal {
  constructor(gameEnv) {
    super(gameEnv, {
      propertyType: 'luxury',
      backgroundImage: 'bg_luxury.svg',
      title: '💎 LUXURY DEAL',
      sellerName: 'Victoria Estates',
      sellerEmoji: '💎',
      sellerHp: 20,
      maxBadDeals: 2,
      counterIntervalMs: 1000,
      attackCooldownMs: 420,
      coinTotal: 9,
    });
  }
}

export default GameLevelLuxury;
