import GameLevelPropertyDeal from './GameLevelPropertyDeal.js';

class GameLevelCommercial extends GameLevelPropertyDeal {
  constructor(gameEnv) {
    super(gameEnv, {
      propertyType: 'commercial',
      backgroundImage: 'bg_commercial.svg',
      title: '🏢 COMMERCIAL DEAL',
      sellerName: 'Marcus Corp',
      sellerEmoji: '🏦',
      sellerHp: 15,
      maxBadDeals: 3,
      counterIntervalMs: 1300,
      attackCooldownMs: 400,
      coinTotal: 8,
    });
  }
}

export default GameLevelCommercial;
