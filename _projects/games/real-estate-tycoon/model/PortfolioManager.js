// Model: Real Estate Tycoon - Portfolio Manager
// Handles all player financial data with localStorage persistence

const STORAGE_KEY = 'ret_portfolio_v2';

class PortfolioManager {
  constructor() {
    this._cache = null;
  }

  _defaults() {
    return {
      playerName: 'Investor',
      cash: 500000,
      totalDebt: 0,
      interestRate: 0.065,
      properties: [],
      transactions: [],
      marketLevel: 1,
      totalRentCollected: 0,
      totalDealsWon: 0,
      lastRentCollection: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }

  _load() {
    if (this._cache) return this._cache;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      this._cache = raw ? JSON.parse(raw) : null;
    } catch (e) {
      this._cache = null;
    }
    return this._cache;
  }

  _persist() {
    if (!this._cache) return;
    this._cache.updatedAt = Date.now();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._cache));
    } catch (e) {
      console.warn('PortfolioManager: persist failed', e);
    }
  }

  exists() {
    return Boolean(this._load());
  }

  initialize(playerName) {
    const p = this._defaults();
    p.playerName = (playerName || 'Investor').slice(0, 20);
    this._cache = p;
    this._persist();
    return p;
  }

  getPortfolio() {
    return this._load() || this._defaults();
  }

  // ── Cash ──────────────────────────────────────────────────

  getCash() {
    return this.getPortfolio().cash;
  }

  addCash(amount) {
    const p = this.getPortfolio();
    p.cash += amount;
    this._cache = p;
    this._persist();
  }

  spendCash(amount) {
    const p = this.getPortfolio();
    if (p.cash < amount) return false;
    p.cash -= amount;
    this._cache = p;
    this._persist();
    return true;
  }

  // ── Properties ────────────────────────────────────────────

  getProperties() {
    return this.getPortfolio().properties || [];
  }

  ownsProperty(propertyId) {
    return this.getProperties().some(p => p.id === propertyId);
  }

  addProperty(property, purchasePrice) {
    const p = this.getPortfolio();
    const owned = {
      ...property,
      ownedId: `own_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      purchasePrice: purchasePrice ?? property.price,
      purchaseDate: Date.now(),
      upgradeLevel: 0,
      monthlyRent: property.monthlyRent,
    };
    p.properties.push(owned);
    p.totalDealsWon = (p.totalDealsWon || 0) + 1;
    p.transactions.push({
      type: 'buy',
      name: property.name,
      amount: -purchasePrice,
      date: Date.now(),
    });
    p.cash -= purchasePrice;
    this._cache = p;
    this._persist();
    return owned;
  }

  sellProperty(ownedId, salePrice) {
    const p = this.getPortfolio();
    const idx = p.properties.findIndex(pr => pr.ownedId === ownedId);
    if (idx === -1) return false;
    const prop = p.properties.splice(idx, 1)[0];
    p.cash += salePrice;
    p.transactions.push({
      type: 'sell',
      name: prop.name,
      amount: salePrice,
      date: Date.now(),
    });
    this._cache = p;
    this._persist();
    return true;
  }

  upgradeProperty(ownedId) {
    const p = this.getPortfolio();
    const prop = p.properties.find(pr => pr.ownedId === ownedId);
    if (!prop || prop.upgradeLevel >= 3) return false;
    const cost = Math.floor(prop.purchasePrice * 0.15 * (prop.upgradeLevel + 1));
    if (p.cash < cost) return false;
    p.cash -= cost;
    prop.upgradeLevel += 1;
    prop.monthlyRent = Math.floor(prop.monthlyRent * 1.3);
    p.transactions.push({
      type: 'upgrade',
      name: prop.name,
      amount: -cost,
      date: Date.now(),
    });
    this._cache = p;
    this._persist();
    return cost;
  }

  // ── Loans ────────────────────────────────────────────────

  takeLoan(amount, netWorthOverride = null) {
    const p = this.getPortfolio();
    const nw = netWorthOverride !== null ? netWorthOverride : this.getNetWorth();
    const maxLoan = Math.floor(nw * 0.65);
    if (p.totalDebt + amount > maxLoan || amount <= 0) return false;
    p.cash += amount;
    p.totalDebt += amount;
    p.transactions.push({ type: 'loan', name: 'Bank Loan', amount, date: Date.now() });
    this._cache = p;
    this._persist();
    return true;
  }

  repayLoan(amount) {
    const p = this.getPortfolio();
    const payment = Math.min(amount, p.totalDebt);
    if (p.cash < payment || payment <= 0) return false;
    p.cash -= payment;
    p.totalDebt -= payment;
    p.transactions.push({ type: 'repay', name: 'Loan Repayment', amount: -payment, date: Date.now() });
    this._cache = p;
    this._persist();
    return payment;
  }

  // ── Rent Collection ──────────────────────────────────────

  collectRent() {
    const p = this.getPortfolio();
    const now = Date.now();
    const minsElapsed = (now - p.lastRentCollection) / 60000;
    // Game time: 1 real minute = 1 game day
    const daysElapsed = minsElapsed;

    let totalRent = 0;
    for (const prop of p.properties) {
      const dailyRent = prop.monthlyRent / 30;
      totalRent += dailyRent * daysElapsed;
    }

    const annualInterest = p.totalDebt * p.interestRate;
    const dailyInterest = annualInterest / 365;
    const interestOwed = dailyInterest * daysElapsed;

    const netRent = totalRent - interestOwed;
    if (netRent !== 0) {
      p.cash += netRent;
      p.totalRentCollected = (p.totalRentCollected || 0) + Math.max(0, totalRent);
    }

    p.lastRentCollection = now;
    this._cache = p;
    this._persist();
    return { totalRent: Math.floor(totalRent), interestOwed: Math.floor(interestOwed), netRent: Math.floor(netRent) };
  }

  // ── Net Worth & Stats ────────────────────────────────────

  getNetWorth(marketMultipliers = null) {
    const p = this.getPortfolio();
    const propValue = p.properties.reduce((sum, prop) => {
      const mult = marketMultipliers ? (marketMultipliers[prop.type] || 1) : 1;
      return sum + Math.floor(prop.purchasePrice * mult);
    }, 0);
    return p.cash + propValue - p.totalDebt;
  }

  getMonthlyIncome() {
    const p = this.getPortfolio();
    const monthlyRent = p.properties.reduce((sum, pr) => sum + pr.monthlyRent, 0);
    const monthlyInterest = Math.floor((p.totalDebt * p.interestRate) / 12);
    return monthlyRent - monthlyInterest;
  }

  getPropertyValue() {
    return this.getProperties().reduce((sum, p) => sum + p.purchasePrice, 0);
  }

  // ── Progression ──────────────────────────────────────────

  getMarketLevel() {
    return this.getPortfolio().marketLevel || 1;
  }

  unlockMarketLevel(level) {
    const p = this.getPortfolio();
    if (p.marketLevel < level) {
      p.marketLevel = level;
      this._cache = p;
      this._persist();
    }
  }

  // ── Leaderboard ──────────────────────────────────────────

  getLeaderboard() {
    try {
      return JSON.parse(localStorage.getItem('ret_leaderboard') || '[]');
    } catch (e) { return []; }
  }

  saveToLeaderboard() {
    const p = this.getPortfolio();
    const board = this.getLeaderboard();
    const entry = {
      name: p.playerName,
      netWorth: this.getNetWorth(),
      properties: p.properties.length,
      date: Date.now(),
    };
    board.push(entry);
    board.sort((a, b) => b.netWorth - a.netWorth);
    const top = board.slice(0, 10);
    localStorage.setItem('ret_leaderboard', JSON.stringify(top));
    return top;
  }

  clear() {
    localStorage.removeItem(STORAGE_KEY);
    this._cache = null;
  }
}

export default new PortfolioManager();
