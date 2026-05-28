import GameLevelPropertyDeal from './GameLevelPropertyDeal.js';

class GameLevelResidential extends GameLevelPropertyDeal {
  constructor(gameEnv) {
    super(gameEnv, {
      propertyType: 'residential',
      backgroundImage: 'bg_residential.svg',
      title: '🏠 RESIDENTIAL DEAL',
      sellerName: 'Sarah (Seller)',
      sellerEmoji: '🏘️',
      sellerHp: 10,
      maxBadDeals: 4,
      counterIntervalMs: 1800,
      attackCooldownMs: 350,
      coinTotal: 7,
    });
  }
}

export default GameLevelResidential;
