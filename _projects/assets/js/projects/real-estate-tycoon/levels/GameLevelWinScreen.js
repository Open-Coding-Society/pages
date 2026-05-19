import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import PortfolioManager from '../model/PortfolioManager.js';
import MarketEngine from '../model/MarketEngine.js';

class GameLevelWinScreen {
  constructor(gameEnv) {
    this.gameEnv = gameEnv;
    const path = gameEnv.path;

    const image_data_bg = {
      id: 'WinBackground',
      src: `${path}/images/projects/real-estate-tycoon/city_background.svg`,
      pixels: { height: 600, width: 1200 },
    };

    this.classes = [
      { class: GameEnvBackground, data: image_data_bg },
    ];

    this._overlay = null;
    this._chartCanvas = null;
  }

  initialize() {
    const leaderboard = PortfolioManager.saveToLeaderboard();
    this._showWinScreen(leaderboard);
  }

  update() {}

  destroy() {
    if (this._overlay && this._overlay.parentNode) this._overlay.remove();
  }

  _container() {
    return this.gameEnv.gameContainer || document.getElementById('gameContainer') || document.body;
  }

  _showWinScreen(leaderboard) {
    const c = this._container();
    const p = PortfolioManager.getPortfolio();
    const netWorth = PortfolioManager.getNetWorth();
    const monthlyIncome = PortfolioManager.getMonthlyIncome();
    const props = p.properties;

    this._overlay = document.createElement('div');
    Object.assign(this._overlay.style, {
      position: 'absolute', inset: '0', zIndex: '99999',
      background: 'linear-gradient(160deg, #050510 0%, #0a1028 60%, #04100a 100%)',
      color: '#fff', fontFamily: '"Segoe UI",Arial,sans-serif',
      overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '32px 16px',
    });

    // Leaderboard rows
    const lbRows = leaderboard.slice(0, 8).map((e, i) => {
      const medal = ['🥇', '🥈', '🥉'][i] || `${i + 1}.`;
      const isYou = e.name === p.playerName;
      return `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;
          background:${isYou ? 'rgba(255,215,0,0.12)' : 'rgba(255,255,255,0.04)'};
          border:1px solid ${isYou ? 'rgba(255,215,0,0.3)' : 'transparent'};
          border-radius:8px;margin-bottom:4px">
          <div style="display:flex;gap:8px;align-items:center">
            <span style="font-size:18px">${medal}</span>
            <span style="font-weight:700;${isYou ? 'color:#ffd700' : ''}">${e.name}</span>
          </div>
          <div style="text-align:right">
            <div style="font-weight:800;color:#ffd700">$${_fmt(e.netWorth)}</div>
            <div style="font-size:10px;color:#888">${e.properties} properties</div>
          </div>
        </div>
      `;
    }).join('');

    // Property rows
    const propRows = props.map(pr => `
      <div style="display:flex;justify-content:space-between;padding:6px 10px;
        background:rgba(255,255,255,0.04);border-radius:8px;margin-bottom:4px;font-size:12px">
        <div>${pr.emoji || '🏠'} ${pr.name} ${pr.upgradeLevel > 0 ? `(Lv ${pr.upgradeLevel})` : ''}</div>
        <div style="text-align:right">
          <span style="color:#4eff91">$${_fmt(pr.monthlyRent)}/mo</span>
          <span style="color:#888;margin-left:8px">$${_fmt(pr.purchasePrice)}</span>
        </div>
      </div>
    `).join('');

    this._overlay.innerHTML = `
      <div style="text-align:center;margin-bottom:28px">
        <div style="font-size:14px;letter-spacing:2px;color:#ffd700;margin-bottom:6px">CONGRATULATIONS</div>
        <div style="font-size:42px;font-weight:900;text-shadow:0 0 32px gold">🏆 TYCOON STATUS ACHIEVED!</div>
        <div style="font-size:18px;margin-top:8px;opacity:.8">${p.playerName} has built a real estate empire!</div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px;width:100%;max-width:720px;margin-bottom:28px">
        ${[
          { label: 'Net Worth', value: `$${_fmt(netWorth)}`, color: '#ffd700' },
          { label: 'Cash', value: `$${_fmt(p.cash)}`, color: '#4eff91' },
          { label: 'Monthly Income', value: `$${_fmt(monthlyIncome)}`, color: '#4eff91' },
          { label: 'Total Rent Earned', value: `$${_fmt(p.totalRentCollected || 0)}`, color: '#64b5f6' },
          { label: 'Properties Owned', value: `${props.length}`, color: '#64b5f6' },
          { label: 'Deals Won', value: `${p.totalDealsWon || 0}`, color: '#ff9800' },
          { label: 'Total Debt', value: `$${_fmt(p.totalDebt)}`, color: p.totalDebt > 0 ? '#ff8f00' : '#4eff91' },
          { label: 'Debt-Free?', value: p.totalDebt === 0 ? '✅ YES' : '❌ NO', color: p.totalDebt === 0 ? '#4eff91' : '#ff5b5b' },
        ].map(s => `
          <div style="background:rgba(255,255,255,0.06);border-radius:10px;padding:12px;text-align:center">
            <div style="font-size:10px;color:#9ab;margin-bottom:4px">${s.label}</div>
            <div style="font-size:16px;font-weight:800;color:${s.color}">${s.value}</div>
          </div>
        `).join('')}
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;width:100%;max-width:720px;margin-bottom:24px">
        <div>
          <div style="font-weight:800;font-size:14px;color:#ffd700;margin-bottom:10px">📊 LEADERBOARD</div>
          ${lbRows || '<div style="color:#666;text-align:center">No scores yet!</div>'}
        </div>
        <div>
          <div style="font-weight:800;font-size:14px;color:#64b5f6;margin-bottom:10px">🏠 YOUR PORTFOLIO</div>
          ${propRows || '<div style="color:#666">No properties</div>'}
          <canvas id="ret-win-chart" width="300" height="150" style="margin-top:14px;border-radius:8px;background:rgba(255,255,255,0.04)"></canvas>
        </div>
      </div>

      <div style="display:flex;gap:12px;margin-top:8px">
        <button id="ret-play-again" style="padding:14px 32px;background:linear-gradient(135deg,#ffd700,#ff9800);
          border:none;border-radius:10px;color:#000;font-weight:800;font-size:16px;cursor:pointer;">
          🔄 Play Again
        </button>
        <button id="ret-view-stats" style="padding:14px 32px;background:rgba(100,181,246,.15);
          border:1px solid rgba(100,181,246,.4);border-radius:10px;color:#64b5f6;font-weight:700;font-size:14px;cursor:pointer;">
          📈 Market History
        </button>
      </div>
    `;

    c.appendChild(this._overlay);

    document.getElementById('ret-play-again')?.addEventListener('click', () => {
      if (confirm('Start a new game? Your current portfolio will be reset.')) {
        PortfolioManager.clear();
        window.location.reload();
      }
    });

    document.getElementById('ret-view-stats')?.addEventListener('click', () => {
      this._drawMarketChart();
    });

    // Draw chart after DOM paint
    setTimeout(() => this._drawMarketChart(), 150);
  }

  _drawMarketChart() {
    const canvas = document.getElementById('ret-win-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    const history = MarketEngine.getPriceHistory();
    const draw = (data, color) => {
      if (!data || data.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.shadowColor = color;
      ctx.shadowBlur = 4;
      data.forEach((v, i) => {
        const x = (i / (data.length - 1)) * (W - 20) + 10;
        const y = H - 10 - (v - 0.5) / 1.5 * (H - 20);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(10, 10); ctx.lineTo(10, H - 10); ctx.lineTo(W - 10, H - 10); ctx.stroke();

    // Base line (1.0)
    const baseY = H - 10 - (1.0 - 0.5) / 1.5 * (H - 20);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(10, baseY); ctx.lineTo(W - 10, baseY); ctx.stroke();
    ctx.setLineDash([]);

    draw(history.residential, '#4eff91');
    draw(history.commercial, '#64b5f6');
    draw(history.luxury, '#ffd700');

    // Legend
    ctx.font = '9px Arial';
    ctx.fillStyle = '#4eff91'; ctx.fillText('🏠 Residential', 14, 14);
    ctx.fillStyle = '#64b5f6'; ctx.fillText('🏢 Commercial', 14, 26);
    ctx.fillStyle = '#ffd700'; ctx.fillText('💎 Luxury', 14, 38);
  }
}

function _fmt(n) {
  if (n === undefined || n === null) return '0';
  const abs = Math.abs(Math.floor(n));
  const sign = n < 0 ? '-' : '';
  if (abs >= 1000000) return `${sign}${(abs / 1000000).toFixed(1)}M`;
  if (abs >= 1000) return `${sign}${(abs / 1000).toFixed(0)}K`;
  return `${sign}${abs}`;
}

export default GameLevelWinScreen;
