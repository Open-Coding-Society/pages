// Model: Real Estate Market Simulation Engine
// Handles dynamic price fluctuations, market events, and economic cycles

const STORAGE_KEY = 'ret_market_v2';

const EVENTS = [
  {
    id: 'housing_boom', title: '🏗️ Housing Boom!',
    desc: 'Construction surges. Residential prices up 22%!',
    effect: { residential: 1.22, commercial: 1.06, luxury: 1.10 }, duration: 35000, color: '#4eff91',
  },
  {
    id: 'recession', title: '📉 Market Recession',
    desc: 'Economic downturn hits hard. All prices drop 15%.',
    effect: { residential: 0.85, commercial: 0.82, luxury: 0.78 }, duration: 28000, color: '#ff5b5b',
  },
  {
    id: 'tech_boom', title: '💻 Tech Industry Expansion',
    desc: 'Big Tech firms leasing offices everywhere. Commercial +25%!',
    effect: { residential: 1.08, commercial: 1.25, luxury: 1.12 }, duration: 40000, color: '#4eff91',
  },
  {
    id: 'luxury_surge', title: '💎 Luxury Demand Surge',
    desc: 'Ultra-HNW buyers flooding market. Luxury +30%!',
    effect: { residential: 1.02, commercial: 1.04, luxury: 1.30 }, duration: 22000, color: '#ffd700',
  },
  {
    id: 'rate_hike', title: '🏦 Federal Rate Hike',
    desc: 'Borrowing costs spike. Market cools — all prices -12%.',
    effect: { residential: 0.88, commercial: 0.90, luxury: 0.86 }, duration: 45000, color: '#ff8f00',
  },
  {
    id: 'urban_renewal', title: '🏙️ Urban Renewal Project',
    desc: 'City revitalization announced. Residential + Commercial +15%!',
    effect: { residential: 1.15, commercial: 1.15, luxury: 1.05 }, duration: 32000, color: '#4eff91',
  },
  {
    id: 'disaster_risk', title: '⚠️ Natural Disaster Warning',
    desc: 'Evacuation zones reduce demand. All prices -12%.',
    effect: { residential: 0.88, commercial: 0.91, luxury: 0.84 }, duration: 20000, color: '#ff5b5b',
  },
  {
    id: 'foreign_investment', title: '🌏 Foreign Investment Wave',
    desc: 'Overseas capital floods in. Luxury and Commercial surge!',
    effect: { residential: 1.05, commercial: 1.20, luxury: 1.28 }, duration: 30000, color: '#ffd700',
  },
  {
    id: 'supply_squeeze', title: '🔨 Housing Supply Squeeze',
    desc: 'Low inventory drives residential prices up 18%!',
    effect: { residential: 1.18, commercial: 1.02, luxury: 1.08 }, duration: 28000, color: '#4eff91',
  },
  {
    id: 'market_correction', title: '📊 Market Correction',
    desc: 'Overheated market corrects. Prices normalize -10%.',
    effect: { residential: 0.90, commercial: 0.90, luxury: 0.90 }, duration: 25000, color: '#ff8f00',
  },
];

class MarketEngine {
  constructor() {
    this._mult = { residential: 1.0, commercial: 1.0, luxury: 1.0 };
    this._activeEvent = null;
    this._eventTimer = null;
    this._nextEventTimer = null;
    this._listeners = [];
    this._tickerText = '';
    this._initialized = false;
    this._lastTick = Date.now();
    this._priceHistory = { residential: [], commercial: [], luxury: [] };
  }

  initialize() {
    if (this._initialized) return;
    this._initialized = true;
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (saved.mult && Date.now() - (saved.ts || 0) < 300000) {
        this._mult = { ...{ residential: 1.0, commercial: 1.0, luxury: 1.0 }, ...saved.mult };
      }
    } catch (e) { /* use defaults */ }
    this._buildTicker();
    this._scheduleNextEvent();
  }

  _persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ mult: this._mult, ts: Date.now() }));
  }

  // Called regularly from game update loop
  tick() {
    const now = Date.now();
    const delta = Math.min((now - this._lastTick) / 1000, 5);
    this._lastTick = now;

    // Brownian motion with mean reversion toward 1.0
    const volatility = 0.0015;
    const meanReversion = 0.001;
    for (const type of ['residential', 'commercial', 'luxury']) {
      const rand = (Math.random() - 0.49) * volatility * delta * 60;
      const revert = (1.0 - this._mult[type]) * meanReversion;
      this._mult[type] = Math.max(0.55, Math.min(2.2, this._mult[type] + rand + revert));
    }

    // Record history (for chart in win screen)
    for (const key of ['residential', 'commercial', 'luxury']) {
      this._priceHistory[key].push(this._mult[key]);
      if (this._priceHistory[key].length > 60) this._priceHistory[key].shift();
    }

    this._persist();
  }

  triggerEvent(eventId = null) {
    const event = eventId
      ? EVENTS.find(e => e.id === eventId)
      : EVENTS[Math.floor(Math.random() * EVENTS.length)];
    if (!event) return;

    if (this._eventTimer) clearTimeout(this._eventTimer);
    this._activeEvent = event;

    for (const type of ['residential', 'commercial', 'luxury']) {
      if (event.effect[type]) {
        this._mult[type] = Math.max(0.55, Math.min(2.2, this._mult[type] * event.effect[type]));
      }
    }
    this._persist();
    this._buildTicker();
    this._notify('event', event);

    this._eventTimer = setTimeout(() => {
      this._activeEvent = null;
      this._buildTicker();
      this._notify('event-end', event);
      this._scheduleNextEvent();
    }, event.duration);
  }

  _scheduleNextEvent() {
    if (this._nextEventTimer) clearTimeout(this._nextEventTimer);
    const delay = 45000 + Math.random() * 75000;
    this._nextEventTimer = setTimeout(() => {
      if (!this._activeEvent) this.triggerEvent();
    }, delay);
  }

  _buildTicker() {
    const r = this._mult.residential;
    const c = this._mult.commercial;
    const l = this._mult.luxury;
    const rTag = r >= 1.0 ? `+${((r - 1) * 100).toFixed(1)}%` : `${((r - 1) * 100).toFixed(1)}%`;
    const cTag = c >= 1.0 ? `+${((c - 1) * 100).toFixed(1)}%` : `${((c - 1) * 100).toFixed(1)}%`;
    const lTag = l >= 1.0 ? `+${((l - 1) * 100).toFixed(1)}%` : `${((l - 1) * 100).toFixed(1)}%`;
    this._tickerText = [
      `🏠 RESIDENTIAL ${rTag}`,
      `🏢 COMMERCIAL ${cTag}`,
      `💎 LUXURY ${lTag}`,
      ...(this._activeEvent ? [`📰 ${this._activeEvent.title}`] : []),
      '🏦 BUY • SELL • BUILD • GROW',
    ].join('   •   ');
  }

  // ── Public API ───────────────────────────────────────────

  getMultiplier(type) { return this._mult[type] || 1.0; }

  getCurrentPrice(basePrice, type) {
    return Math.floor(basePrice * (this._mult[type] || 1.0));
  }

  getActiveEvent() { return this._activeEvent; }

  getTickerText() { return (this._tickerText + '   •   ').repeat(4); }

  getSummary() {
    return {
      residential: this._mult.residential,
      commercial: this._mult.commercial,
      luxury: this._mult.luxury,
      activeEvent: this._activeEvent,
    };
  }

  getPriceHistory() { return this._priceHistory; }

  addListener(fn) { this._listeners.push(fn); }
  removeListener(fn) { this._listeners = this._listeners.filter(l => l !== fn); }
  _notify(type, data) { this._listeners.forEach(fn => { try { fn(type, data); } catch (e) {} }); }

  destroy() {
    if (this._eventTimer) clearTimeout(this._eventTimer);
    if (this._nextEventTimer) clearTimeout(this._nextEventTimer);
    this._listeners = [];
    this._initialized = false;
  }
}

export default new MarketEngine();
