// Imports: Level objects and UI helpers.
import GamEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import FriendlyNpc from '@assets/js/GameEnginev1.1/essentials/FriendlyNpc.js';
import AiChallengeNpc from '@assets/js/GameEnginev1.1/essentials/AiChallengeNpc.js';
import DialogueSystem from '@assets/js/GameEnginev1.1/essentials/DialogueSystem.js';
import GameLevelCsPathIdentity from './GameLevelCsPathIdentity.js';
import { pythonURI, javaURI, fetchOptions } from '@assets/js/api/config.js';
import StatusPanel from '@assets/js/GameEnginev1.1/essentials/StatusPanel.js';


/**
 * Generate dynamic SVG orb sprite data URI
 * Creates animated glowing orbs with orbiting markers (like Wayfinding World)
 */
const createOrbSvgSrc = (fillColor, borderColor = '#f8fafc') => {
  const frameOpacity = [0.7, 0.78, 0.86, 0.94, 1, 0.94, 0.86, 0.78];
  const orbFrames = frameOpacity
    .map((opacity, index) => {
      const cx = 128 + (index * 256);
      const ringAngle = index * 45;
      const angleRad = (ringAngle * Math.PI) / 180;
      const oppositeAngleRad = angleRad + Math.PI;
      const orbitRadius = 112;
      const markerX = cx + (Math.cos(angleRad) * orbitRadius);
      const markerY = 128 + (Math.sin(angleRad) * orbitRadius);
      const marker2X = cx + (Math.cos(oppositeAngleRad) * orbitRadius);
      const marker2Y = 128 + (Math.sin(oppositeAngleRad) * orbitRadius);
      const markerShadowX = cx + (Math.cos(angleRad) * (orbitRadius + 4));
      const markerShadowY = 128 + (Math.sin(angleRad) * (orbitRadius + 4));
      const marker2ShadowX = cx + (Math.cos(oppositeAngleRad) * (orbitRadius + 4));
      const marker2ShadowY = 128 + (Math.sin(oppositeAngleRad) * (orbitRadius + 4));
      return `
        <g opacity='${opacity}'>
          <circle cx='${cx}' cy='128' r='114' fill='none' stroke='rgba(0,0,0,0.5)' stroke-width='20'/>
          <circle cx='${cx}' cy='128' r='106' fill='${fillColor}' stroke='${borderColor}' stroke-width='18'/>
          <circle cx='${cx}' cy='128' r='98' fill='none' stroke='rgba(255,255,255,0.34)' stroke-width='6'/>
          <circle cx='${cx}' cy='128' r='104' fill='url(#shine)' />
          <circle cx='${cx}' cy='128' r='112' fill='none' stroke='rgba(255,255,255,0.92)' stroke-width='11' stroke-linecap='round' stroke-dasharray='190 500' transform='rotate(${ringAngle} ${cx} 128)'/>
          <circle cx='${markerShadowX}' cy='${markerShadowY}' r='12' fill='rgba(0,0,0,0.45)' />
          <circle cx='${markerX}' cy='${markerY}' r='10' fill='#ffffff' />
          <circle cx='${marker2ShadowX}' cy='${marker2ShadowY}' r='10' fill='rgba(0,0,0,0.35)' />
          <circle cx='${marker2X}' cy='${marker2Y}' r='8' fill='#fde047' />
        </g>`;
    })
    .join('');

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='2048' height='256' viewBox='0 0 2048 256'>
    <defs>
      <radialGradient id='shine' cx='35%' cy='30%' r='70%'>
        <stop offset='0%' stop-color='#ffffff' stop-opacity='0.45' />
        <stop offset='45%' stop-color='#ffffff' stop-opacity='0.14' />
        <stop offset='100%' stop-color='#000000' stop-opacity='0.22' />
      </radialGradient>
    </defs>
    ${orbFrames}
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

/**
 * GameLevel CS Pathway - Assessment Observatory
 *
 * NPC 1 (Blue  - AI Skill Advisor):  Performance Analytics, Sprint Comparison (timestamp-aware), AI Recommendations + chat, Mini Challenges (Wordle only)
 * NPC 2 (Green - GitHub Analytics):  GitHub / Code Metrics
 * NPC 3 (Amber - Sprint Coach):      Skill Radar (self-evaluated, rendered correctly)
 */
class GameLevelCsPath3Analytics extends GameLevelCsPathIdentity {
  static levelId = 'assessment-observatory';
  static displayName = 'Assessment Observatory';

  constructor(gameEnv) {
    super(gameEnv, {
      levelDisplayName: GameLevelCsPath3Analytics.displayName,
      logPrefix: 'Assessment Observatory',
    });

    let { width, height, path } = this.getLevelDimensions();

    this.profilePanelView = new StatusPanel({
      id: 'csse-analytics-panel',
      title: 'ASSESSMENT OBSERVATORY',
      fields: [
        { key: 'grade', label: 'Grade', emptyValue: '—' },
      ],
      theme: {
        background: 'var(--ocs-game-panel-bg, rgba(13,13,26,0.92))',
        borderColor: 'var(--ocs-game-accent, #4ecca3)',
        textColor: 'var(--ocs-game-text, #e0e0e0)',
        accentColor: 'var(--ocs-game-accent, #4ecca3)',
        secondaryButtonBackground: 'var(--ocs-game-surface-alt, #1a1a2e)',
        secondaryButtonTextColor: 'var(--ocs-game-text, #e0e0e0)',
      },
      position: { top: '16px', left: '16px' },
      width: '260px',
      padding: '12px 14px',
      zIndex: '10000',
      fontFamily: '"Courier New", monospace',
    });
    this.profilePanelView.render();
    this.profilePanelView.update({ grade: '—' });

    // ── Background ──────────────────────────────────────────────
    const image_src = path + "/images/projects/cs-pathway-game/bg3/assessment-observatory-fantasy.png";
    const bg_data = {
      name: GameLevelCsPath3Analytics.displayName,
      greeting: "Welcome to the Assessment Observatory! Here you can explore your learning journey, track your progress, and discover insights from your contributions and achievements.",
      src: image_src,
    };

    this.restoreIdentitySelections({
      bgData: bg_data,
      themeManifestUrl: `${path}/images/projects/cs-pathway-game/bg3/index.json`,
      themeAssetPrefix: `${path}/images/projects/cs-pathway-game/bg3/`,
    });

    // ── Player ───────────────────────────────────────────────────
    const player_src = path + "/images/projects/cs-pathway-game/player/minimalist.png";
    const PLAYER_SCALE_FACTOR = 5;
    const player_data = {
      id: 'Minimalist_Identity',
      greeting: "Welcome to the Assessment Observatory! Let's explore your learning journey.",
      src: player_src,
      SCALE_FACTOR: PLAYER_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 50,
      INIT_POSITION: { x: 0, y: height - (height / PLAYER_SCALE_FACTOR) },
      pixels: { height: 1024, width: 1024 },
      orientation: { rows: 2, columns: 2 },
      down:      { row: 0, start: 0, columns: 1 },
      downRight: { row: 0, start: 0, columns: 1, rotate:  Math.PI / 16 },
      downLeft:  { row: 0, start: 0, columns: 1, rotate: -Math.PI / 16 },
      left:      { row: 1, start: 0, columns: 1, mirror: true },
      right:     { row: 1, start: 0, columns: 1 },
      up:        { row: 0, start: 1, columns: 1 },
      upLeft:    { row: 1, start: 0, columns: 1, mirror: true, rotate:  Math.PI / 16 },
      upRight:   { row: 1, start: 0, columns: 1, rotate: -Math.PI / 16 },
      hitbox: { widthPercentage: 0.4, heightPercentage: 0.4 },
      keypress: { up: 87, left: 65, down: 83, right: 68 },
    };

    this.primeAssetGate({
      playerSrc: player_data.src,
      backgroundSrc: bg_data.src,
    });

    // ── NPC Positions ──────────────────────────────────────────────
    const analyticsGuidePos = { x: width * 0.20, y: height * 0.65 };
    const githubMetricsPos  = { x: width * 0.80, y: height * 0.65 };
    const selfEvalPos       = { x: width * 0.48, y: height * 0.44 };

    const createOrbNpcData = ({ id, greeting, position, color, expertise, interact }) => ({
      src: createOrbSvgSrc(color),
      SCALE_FACTOR: 12,
      ANIMATION_RATE: 6,
      pixels: { width: 2048, height: 256 },
      orientation: { rows: 1, columns: 8 },
      down: { row: 0, start: 0, columns: 8, wiggle: { angle: Math.PI / 60, speed: 0.08 } },
      up: { row: 0, start: 0, columns: 8 },
      left: { row: 0, start: 0, columns: 8 },
      right: { row: 0, start: 0, columns: 8 },
      hitbox: { widthPercentage: 0.4, heightPercentage: 0.4 },
      id,
      greeting,
      INIT_POSITION: { ...position },
      interactDistance: 120,
      expertise,
      chatHistory: [],
      ...(interact ? { interact } : {}),
    });

    const level = this;

    // ── NPC 1: AI Skill Advisor (blue) ──────────────────────────
    const npc_data_analyticsGuide = createOrbNpcData({
      id: 'AI Skill Advisor',
      greeting: 'Analytics Station: Performance metrics, sprint comparisons, AI recommendations, and mini challenges. Press E to interact.',
      position: analyticsGuidePos,
      color: '#3b82f6',
      expertise: 'Personal learning analytics, skill assessment, performance coaching, sprint comparisons, and progress tracking. Help students understand their strengths and growth areas with actionable feedback.',
      interact: async function() {
        await level.showAnalyticsDashboard();
      },
    });

    // ── NPC 2: GitHub Analytics (green) ─────────────────────────
    const npc_data_githubGuide = createOrbNpcData({
      id: 'GitHub Analytics',
      greeting: 'GitHub Analytics Station: Deep dive into your code contributions, commit history, and collaboration patterns. Press E to explore.',
      position: githubMetricsPos,
      color: '#10b981',
      expertise: 'Code contribution analysis, GitHub metrics interpretation, code quality insights, collaboration patterns, and commit history analysis. Help students understand their coding productivity and collaboration effectiveness.',
      interact: async function() {
        await level.showGitHubStats();
      },
    });

    // ── NPC 3: Sprint Coach (amber) – Skill Radar only ───────────
    const npc_data_selfEval = createOrbNpcData({
      id: 'Sprint Coach',
      greeting: 'Skill Radar Station: Rate yourself on your skills and visualise your strengths and growth areas. Press E to begin.',
      position: selfEvalPos,
      color: '#f59e0b',
      expertise: 'Self-reflection coaching, skill radar visualisation, strength identification, and growth-area planning.',
      interact: async function() {
        await level.showSkillRadar();
      },
    });

    this.classes = [
      { class: GamEnvBackground, data: bg_data },
      { class: Player, data: player_data },
      { class: FriendlyNpc, data: npc_data_analyticsGuide },
      { class: FriendlyNpc, data: npc_data_githubGuide },
      { class: FriendlyNpc, data: npc_data_selfEval },
    ];

    this.gameEnv.currentLevel = this;
    this.gameEnv.gameLevel = this;

    // Preload
    this.cachedUserData = null;
    this.dataLoaded = Promise.resolve().then(() => this.fetchUserData()).then((data) => {
      this.cachedUserData = data;
      console.log('Assessment Observatory: Data preloaded', data);
      return data;
    }).catch((err) => {
      console.error('Assessment Observatory: Failed to preload data', err);
    });

    // Dialogue helper
    this.levelDialogueSystem = new DialogueSystem({
      id: 'assessment-observatory-dialogue',
      dialogues: [],
      gameControl: gameEnv.gameControl,
      enableVoice: true,
      enableTypewriter: true,
      typewriterSpeed: 24,
      voiceRate: 0.9,
    });

    this.showDialogue = function(speakerName, lines, options = {}) {
      const queue = Array.isArray(lines) ? lines.filter(Boolean) : [String(lines || '')];
      if (queue.length === 0) return Promise.resolve();

      return new Promise((resolve) => {
        let index = 0;
        let finished = false;
        const finish = () => {
          if (finished) return;
          finished = true;
          this.levelDialogueSystem.closeDialogue();
          resolve();
        };
        const showStep = () => {
          if (finished) return;
          const message = queue[index];
          const isLast = index === queue.length - 1;
          this.levelDialogueSystem.closeDialogue();
          this.levelDialogueSystem.showDialogue(message, speakerName, options.avatarSrc || null, options.spriteData || null);
          this.levelDialogueSystem.closeBtn.textContent = isLast ? 'Close' : 'Skip';
          this.levelDialogueSystem.closeBtn.onclick = () => finish();
          this.levelDialogueSystem.addButtons([{
            text: isLast ? 'Done' : 'Next',
            primary: true,
            action: () => {
              index += 1;
              if (index < queue.length) showStep();
              else finish();
            },
          }]);
        };
        showStep();
      });
    }.bind(this);
  }

  // ════════════════════════════════════════════════════════════════
  //  NPC 1 – ANALYTICS DASHBOARD
  //  Tabs: Performance Analytics | Sprint Comparison | AI Recommendations | Mini Challenges
  // ════════════════════════════════════════════════════════════════
  async showAnalyticsDashboard() {
    try {
      await this.dataLoaded;
      const userData = this.cachedUserData || await this.fetchUserData();

      if (!userData || !userData.analyticsSummary) {
        this.showToast('Unable to load analytics. Please ensure you are logged in.');
        return;
      }

      const modal = document.createElement('div');
      modal.id = 'analytics-dashboard-modal';
      modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.95); display: flex;
        justify-content: center; align-items: center; z-index: 10000; overflow-y: auto;
      `;

      const container = document.createElement('div');
      container.style.cssText = `
        background: #0f172a; border: 2px solid #3b82f6; border-radius: 16px;
        padding: 40px; max-width: 1000px; max-height: 90vh; overflow-y: auto;
        color: #e5e7eb; margin: 20px auto;
      `;

      // Header
      const titleBox = document.createElement('div');
      titleBox.style.cssText = `
        display: flex; justify-content: space-between; align-items: center;
        margin-bottom: 30px; padding-bottom: 15px; border-bottom: 2px solid #1e293b;
      `;
      const s = userData.analyticsSummary || {};
      titleBox.innerHTML = `
        <div>
          <h1 style="margin:0;color:#60a5fa;font-size:28px;">Learning Analytics Dashboard</h1>
          <p style="margin:5px 0 0 0;color:#94a3b8;font-size:13px;">${userData.name || 'Student'} | UID: ${userData.uid || 'N/A'}</p>
        </div>
        <div style="text-align:right;font-size:12px;">
          <div style="color:#10b981;font-weight:bold;">Engagement: ${(s.interactionPercentage || 0).toFixed(1)}%</div>
          <div style="color:#f59e0b;">Scroll Depth: ${(s.averageScrollDepth || 0).toFixed(1)}%</div>
        </div>
      `;
      container.appendChild(titleBox);

      // Tabs
      const tabContainer = document.createElement('div');
      tabContainer.style.cssText = `
        display: flex; gap: 10px; margin-bottom: 30px;
        border-bottom: 2px solid #1e293b; padding-bottom: 15px; flex-wrap: wrap;
      `;

      const tabs = [
        { name: 'Performance Analytics', id: 'performance' },
        { name: 'Sprint Comparison',     id: 'sprint' },
        { name: 'AI Recommendations',    id: 'recommendations' },
        { name: 'Mini Challenges',       id: 'challenges' },
      ];

      const contentArea = document.createElement('div');
      contentArea.id = 'dashboard-content';
      contentArea.style.cssText = 'min-height: 400px;';

      let activeTabBtn = null;
      const switchTab = async (tabId, btn) => {
        if (activeTabBtn) { activeTabBtn.style.background = '#334155'; activeTabBtn.style.color = '#cbd5e1'; }
        btn.style.background = '#3b82f6'; btn.style.color = '#ffffff';
        activeTabBtn = btn;

        contentArea.innerHTML = '';
        if      (tabId === 'performance')    await this.renderPerformanceAnalytics(userData, contentArea);
        else if (tabId === 'sprint')         await this.renderSprintComparison(userData, contentArea);
        else if (tabId === 'recommendations')await this.renderRecommendations(userData, contentArea);
        else if (tabId === 'challenges')     await this.renderMiniChallenges(userData, contentArea);
      };

      tabs.forEach((tab, idx) => {
        const tabBtn = document.createElement('button');
        tabBtn.textContent = tab.name;
        tabBtn.style.cssText = `
          padding: 10px 18px; background: #334155; color: #cbd5e1;
          border: 1px solid #475569; border-radius: 8px; cursor: pointer;
          font-size: 13px; font-weight: 500; transition: all 0.2s;
        `;
        tabBtn.onmouseover = () => { if (tabBtn !== activeTabBtn) tabBtn.style.background = '#475569'; };
        tabBtn.onmouseout  = () => { if (tabBtn !== activeTabBtn) tabBtn.style.background = '#334155'; };
        tabBtn.onclick = () => switchTab(tab.id, tabBtn);
        tabContainer.appendChild(tabBtn);
        if (idx === 0) { tabBtn.style.background = '#3b82f6'; tabBtn.style.color = '#ffffff'; activeTabBtn = tabBtn; }
      });

      container.appendChild(tabContainer);
      container.appendChild(contentArea);

      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'Close Dashboard';
      closeBtn.style.cssText = `
        margin-top: 30px; padding: 12px 30px; background: #64748b; color: white;
        border: none; border-radius: 8px; cursor: pointer; font-size: 14px; width: 100%;
      `;
      closeBtn.onclick = () => modal.remove();
      container.appendChild(closeBtn);

      modal.appendChild(container);
      document.body.appendChild(modal);

      // Render first tab
      await switchTab('performance', activeTabBtn);
    } catch (err) {
      console.error('Error showing analytics dashboard:', err);
      this.showToast('Error loading dashboard');
    }
  }

  // ── Performance Analytics ────────────────────────────────────────
  async renderPerformanceAnalytics(userData, container) {
    const s = userData.analyticsSummary || {};

    const metrics = [
      { label: 'Engagement Rate', current: (s.interactionPercentage || 0).toFixed(1), target: 85, unit: '%' },
      { label: 'Scroll Depth',    current: (s.averageScrollDepth || 0).toFixed(1), target: 70, unit: '%' },
      { label: 'Time Spent',      current: Math.round((s.totalTimeSpentSeconds || 0) / 60), target: 300, unit: ' min', type: 'count' },
    ];

    const grid = document.createElement('div');
    grid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 15px;';

    metrics.forEach(m => {
      const card = document.createElement('div');
      const progress = m.type === 'count' ? Math.min(100, (m.current / m.target) * 100) : parseFloat(m.current);
      const isOnTrack = progress >= 80;

      card.style.cssText = `background:#1e293b;border:1px solid #334155;border-radius:12px;padding:20px;`;
      card.innerHTML = `
        <div style="color:#94a3b8;font-size:12px;margin-bottom:8px;">${m.label}</div>
        <div style="color:#60a5fa;font-size:24px;font-weight:bold;margin-bottom:12px;">${m.current}${m.unit}</div>
        <div style="background:#0f172a;border-radius:8px;height:8px;overflow:hidden;margin-bottom:8px;">
          <div style="background:${isOnTrack ? '#10b981' : '#f59e0b'};width:${Math.min(100, progress)}%;height:100%;transition:width 1s ease-out;"></div>
        </div>
        <div style="color:#cbd5e1;font-size:11px;">Target: ${m.target}${m.unit} ${isOnTrack ? '✓ On Track' : '- Keep Going'}</div>
      `;
      grid.appendChild(card);
    });

    container.appendChild(grid);

    // Session overview
    const sessionBox = document.createElement('div');
    sessionBox.style.cssText = `
      background:#1e293b;border:1px solid #334155;border-radius:12px;
      padding:20px;margin-top:20px;
    `;
    sessionBox.innerHTML = `
      <h3 style="margin:0 0 15px 0;color:#60a5fa;">Session Overview</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:15px;">
        <div style="background:#0f172a;padding:12px;border-radius:8px;">
          <div style="color:#94a3b8;font-size:11px;">Total Sessions</div>
          <div style="color:#e5e7eb;font-size:20px;font-weight:bold;">${s.totalSessions || 0}</div>
        </div>
        <div style="background:#0f172a;padding:12px;border-radius:8px;">
          <div style="color:#94a3b8;font-size:11px;">Lessons Completed</div>
          <div style="color:#10b981;font-size:20px;font-weight:bold;">${s.lessonsCompleted || 0}</div>
        </div>
        <div style="background:#0f172a;padding:12px;border-radius:8px;">
          <div style="color:#94a3b8;font-size:11px;">Avg Session Length</div>
          <div style="color:#f59e0b;font-size:20px;font-weight:bold;">${this.formatTime(s.averageSessionDurationSeconds || 0)}</div>
        </div>
      </div>
    `;
    container.appendChild(sessionBox);
  }

  // ── Sprint Comparison (timestamp-aware, 4-week sprints) ──────────
  async renderSprintComparison(userData, container) {
    const s = userData.analyticsSummary || {};
    const sessions = userData.analyticsSessions || s.sessions || s.recentSessions || [];

    const SPRINT_DAYS = 28;
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - (SPRINT_DAYS - 1));
    startDate.setHours(0, 0, 0, 0);

    const dayKey = (date) => date.toLocaleDateString('en-CA');
    const dayBuckets = new Map();

    for (let i = 0; i < SPRINT_DAYS; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dayBuckets.set(dayKey(date), { date, minutes: 0, sessions: 0 });
    }

    sessions.forEach((session) => {
      const rawDate = session.sessionStartTime || session.createdAt || session.timestamp || session.date;
      const rawMinutes = Number(session.sessionDurationSeconds || 0) / 60;
      const parsedDate = new Date(rawDate);
      if (Number.isNaN(parsedDate.getTime())) return;
      const key = dayKey(parsedDate);
      if (!dayBuckets.has(key)) return;
      const bucket = dayBuckets.get(key);
      bucket.minutes += rawMinutes;
      bucket.sessions += 1;
    });

    const buckets = Array.from(dayBuckets.values());
    const maxMinutes = Math.max(...buckets.map((bucket) => bucket.minutes), 1);
    const totalMinutes = buckets.reduce((sum, bucket) => sum + bucket.minutes, 0);
    const busiest = buckets.reduce((best, current) => (current.minutes > best.minutes ? current : best), buckets[0]);
    const avgMinutes = totalMinutes / buckets.length;

    const heatColor = (minutes) => {
      if (minutes <= 0) return '#0f172a';
      const ratio = minutes / maxMinutes;
      if (ratio < 0.2) return '#1e293b';
      if (ratio < 0.4) return '#334155';
      if (ratio < 0.6) return '#475569';
      if (ratio < 0.8) return '#0f766e';
      return '#10b981';
    };

    const textColor = (minutes) => (minutes <= 0 ? '#64748b' : (minutes / maxMinutes > 0.6 ? '#ecfdf5' : '#e5e7eb'));

    const box = document.createElement('div');
    box.style.cssText = `background:#1e293b;border:1px solid #334155;border-radius:12px;padding:20px;`;

    box.innerHTML = `
      <h3 style="margin:0 0 6px 0;color:#60a5fa;">Sprint Activity Heatmap</h3>
      <div style="color:#94a3b8;font-size:12px;margin-bottom:16px;">
        Each cell is one day from the last 28 days. Color intensity shows total minutes spent that day based on saved analytics sessions.
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:16px;flex-wrap:wrap;">
        <div style="background:#0f172a;border-radius:10px;padding:12px 14px;min-width:180px;">
          <div style="color:#94a3b8;font-size:11px;">Total time in sprint</div>
          <div style="color:#10b981;font-size:22px;font-weight:bold;">${Math.round(totalMinutes)} min</div>
        </div>
        <div style="background:#0f172a;border-radius:10px;padding:12px 14px;min-width:180px;">
          <div style="color:#94a3b8;font-size:11px;">Most active day</div>
          <div style="color:#f59e0b;font-size:14px;font-weight:bold;">${busiest.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
          <div style="color:#cbd5e1;font-size:12px;">${Math.round(busiest.minutes)} min</div>
        </div>
        <div style="background:#0f172a;border-radius:10px;padding:12px 14px;min-width:180px;">
          <div style="color:#94a3b8;font-size:11px;">Average per day</div>
          <div style="color:#60a5fa;font-size:22px;font-weight:bold;">${Math.round(avgMinutes)} min</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(7, 1fr);gap:8px;margin-bottom:10px;color:#64748b;font-size:11px;text-align:center;">
        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
      </div>
    `;

    const heatmap = document.createElement('div');
    heatmap.style.cssText = 'display:grid;grid-template-columns:repeat(7, minmax(0, 1fr));gap:8px;';

    buckets.forEach((bucket) => {
      const cell = document.createElement('div');
      cell.title = `${bucket.date.toLocaleDateString()} — ${Math.round(bucket.minutes)} min across ${bucket.sessions} session(s)`;
      cell.style.cssText = `
        aspect-ratio: 1 / 1;
        min-height: 68px;
        border-radius: 10px;
        padding: 8px;
        background: ${heatColor(bucket.minutes)};
        border: 1px solid rgba(148,163,184,0.18);
        display:flex;
        flex-direction:column;
        justify-content:space-between;
        box-sizing:border-box;
      `;

      cell.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:4px;">
          <div style="color:${textColor(bucket.minutes)};font-size:11px;font-weight:bold;">${bucket.date.getDate()}</div>
          <div style="color:${textColor(bucket.minutes)};font-size:10px;opacity:0.85;">${bucket.sessions}</div>
        </div>
        <div style="color:${textColor(bucket.minutes)};font-size:12px;font-weight:bold;line-height:1.1;">${Math.round(bucket.minutes)}m</div>
      `;

      heatmap.appendChild(cell);
    });

    box.appendChild(heatmap);

    const legend = document.createElement('div');
    legend.style.cssText = 'display:flex;align-items:center;gap:8px;margin-top:14px;flex-wrap:wrap;color:#94a3b8;font-size:11px;';
    legend.innerHTML = `
      <span>Low</span>
      <div style="width:16px;height:16px;border-radius:4px;background:#0f172a;border:1px solid #334155;"></div>
      <div style="width:16px;height:16px;border-radius:4px;background:#1e293b;border:1px solid #334155;"></div>
      <div style="width:16px;height:16px;border-radius:4px;background:#334155;border:1px solid #334155;"></div>
      <div style="width:16px;height:16px;border-radius:4px;background:#0f766e;border:1px solid #0f766e;"></div>
      <div style="width:16px;height:16px;border-radius:4px;background:#10b981;border:1px solid #10b981;"></div>
      <span>High</span>
    `;
    box.appendChild(legend);

    container.appendChild(box);
  }

  // ── AI Recommendations with chat ────────────────────────────────
  async renderRecommendations(userData, container) {
    const s = userData.analyticsSummary || {};
    const gh = userData.github || {};

    // Build the stats context string used in every AI prompt
    const statsContext = `
Student Stats:
- Engagement: ${(s.interactionPercentage || 0).toFixed(1)}% (target: 85%)
  - Scroll Depth: ${(s.averageScrollDepth || 0).toFixed(1)}%
  - Time Invested: ${Math.round((s.totalTimeSpentSeconds || 0) / 60)} minutes
- Total Sessions: ${s.totalSessions || 0}
- Lessons Completed: ${s.lessonsCompleted || 0}
- GitHub Commits: ${gh.commits || 0}
- Pull Requests: ${gh.prs || 0}
- Issues Resolved: ${gh.issues || 0}
- Lines Added: ${gh.linesAdded || 0}
- Lines Deleted: ${gh.linesDeleted || 0}
    `.trim();

    const recHeader = document.createElement('div');
    recHeader.style.cssText = 'color:#60a5fa;font-weight:bold;margin-bottom:15px;font-size:14px;';
    recHeader.textContent = 'AI generating personalized recommendations...';
    container.appendChild(recHeader);

    const recListArea = document.createElement('div');
    container.appendChild(recListArea);

    const renderRecCards = (recCards) => {
      recListArea.innerHTML = '';
      recCards.forEach((rec) => {
        const card = document.createElement('div');
        const bgColor     = rec.priority === 'High' ? '#7c2d12' : rec.priority === 'Medium' ? '#3f3f00' : '#0f172a';
        const borderColor = rec.priority === 'High' ? '#ea580c' : rec.priority === 'Medium' ? '#eab308' : '#334155';
        const labelColor  = rec.priority === 'High' ? '#fdba74' : rec.priority === 'Medium' ? '#facc15' : '#cbd5e1';
        card.style.cssText = `background:${bgColor};border:2px solid ${borderColor};border-radius:12px;padding:15px;margin-bottom:15px;`;
        card.innerHTML = `
          <div style="color:${labelColor};font-weight:bold;font-size:13px;margin-bottom:6px;">${rec.priority} Priority</div>
          <div style="color:#e5e7eb;font-weight:bold;margin-bottom:5px;">${rec.action}</div>
          <div style="color:#cbd5e1;font-size:12px;margin-bottom:10px;">${rec.reason}</div>
          <div style="color:#94a3b8;font-size:11px;">${rec.steps.map(s => `• ${s}`).join('<br>')}</div>
        `;
        recListArea.appendChild(card);
      });
    };

    // AI call
    let recommendations = [];
    try {
      const recPrompt = `You are an expert learning coach. Analyze this student's data and provide 3 prioritized action items.

${statsContext}

Format each recommendation as:
[PRIORITY: High|Medium|Low]
[ACTION: short title]
[REASON: 1 sentence why this matters]
[STEPS: 3 bullet points separated by newlines]

Do not include any other text. Generate exactly 3 recommendations.`;

      const spriteData = { id: 'AI Skill Advisor', expertise: 'Learning analytics and personalized coaching' };
      const aiResponse = await AiChallengeNpc.requestAiText(spriteData, recPrompt, 'assessment-observatory-recommendations', 'Personalized learning recommendations');

      const recParts = aiResponse.split('[PRIORITY:').filter(r => r.trim().length > 0);
      recParts.forEach(recText => {
        const priorityMatch = recText.match(/High|Medium|Low/);
        const actionMatch   = recText.match(/\[ACTION: ([^\]]+)\]/);
        const reasonMatch   = recText.match(/\[REASON: ([^\]]+)\]/);
        const stepsMatch    = recText.match(/\[STEPS: ([^\]]+)\]/s);

        const priority = priorityMatch ? priorityMatch[0] : 'Medium';
        const action   = actionMatch ? actionMatch[1] : 'Continue Learning';
        const reason   = reasonMatch ? reasonMatch[1] : 'Focus on your learning goals.';
        const stepsText = stepsMatch ? stepsMatch[1] : '• Set daily goals\n• Track progress\n• Review regularly';
        const steps = stepsText.split('\n').map(s => s.replace(/^[•\-]\s*/, '').trim()).filter(s => s.length > 0);

        recommendations.push({ priority, action, reason, steps });
      });
    } catch (err) {
      console.error('AI recommendations failed:', err);
      recommendations = [
        { priority: 'High',   action: 'Increase Practice Volume',  reason: 'Consistent practice builds mastery.',          steps: ['Complete daily coding challenges', 'Review solutions carefully', 'Practice similar problems'] },
        { priority: 'Medium', action: 'Boost Engagement',          reason: 'Regular participation accelerates learning.',   steps: ['Set daily learning goals', 'Join study sessions', 'Track your progress'] },
        { priority: 'Low',    action: 'Share Your Knowledge',       reason: 'Teaching reinforces your own understanding.',  steps: ['Help struggling peers', 'Explain concepts clearly', 'Review fundamentals'] },
      ];
    }

    recHeader.textContent = 'Personalized Recommendations';
    renderRecCards(recommendations);

    // ── AI Chat Box ──────────────────────────────────────────────
    const chatSection = document.createElement('div');
    chatSection.style.cssText = `
      background:#1e293b;border:1px solid #334155;border-radius:12px;padding:20px;margin-top:10px;
    `;

    const chatTitle = document.createElement('div');
    chatTitle.style.cssText = 'color:#60a5fa;font-weight:bold;margin-bottom:12px;font-size:13px;';
    chatTitle.textContent = 'Ask the AI Coach about your recommendations';
    chatSection.appendChild(chatTitle);

    const chatHistory = document.createElement('div');
    chatHistory.style.cssText = `
      background:#0f172a;border-radius:8px;padding:12px;min-height:80px;max-height:200px;
      overflow-y:auto;margin-bottom:12px;font-size:13px;color:#cbd5e1;line-height:1.6;
    `;
    chatHistory.innerHTML = '<span style="color:#475569;font-style:italic;">Ask why you got these recommendations, request more detail, or ask for tips...</span>';
    chatSection.appendChild(chatHistory);

    const chatInputRow = document.createElement('div');
    chatInputRow.style.cssText = 'display:flex;gap:10px;';

    const chatInput = document.createElement('input');
    chatInput.type = 'text';
    chatInput.placeholder = 'e.g. "Why did I get the engagement recommendation?"';
    chatInput.style.cssText = `
      flex:1;padding:10px;background:#0f172a;border:1px solid #334155;
      border-radius:6px;color:#e5e7eb;font-size:13px;
    `;

    const chatSendBtn = document.createElement('button');
    chatSendBtn.textContent = 'Ask';
    chatSendBtn.style.cssText = `
      padding:10px 20px;background:#3b82f6;color:white;border:none;
      border-radius:6px;cursor:pointer;font-size:13px;font-weight:500;white-space:nowrap;
    `;

    const conversationHistory = [];

    const sendChatMessage = async () => {
      const userMsg = chatInput.value.trim();
      if (!userMsg) return;
      chatInput.value = '';

      // Add user message to display
      const userBubble = document.createElement('div');
      userBubble.style.cssText = 'margin-bottom:8px;';
      userBubble.innerHTML = `<span style="color:#60a5fa;font-weight:bold;">You:</span> ${userMsg}`;
      chatHistory.appendChild(userBubble);
      chatHistory.scrollTop = chatHistory.scrollHeight;

      chatSendBtn.disabled = true;
      chatSendBtn.textContent = '...';

      // Build full prompt with stats + conversation context
      conversationHistory.push({ role: 'user', content: userMsg });

      const systemPrompt = `You are an expert learning coach in a CS education game. 
You have already given this student the following 3 recommendations:
${recommendations.map((r, i) => `${i+1}. [${r.priority}] ${r.action}: ${r.reason}`).join('\n')}

The student's current stats are:
${statsContext}

Answer the student's question concisely and helpfully. Refer to their specific stats when relevant. Keep responses to 2-4 sentences unless more detail is genuinely needed.`;

      try {
        const spriteData = { id: 'AI Skill Advisor', expertise: 'Learning analytics and personalized coaching' };
        const fullPrompt = `${systemPrompt}\n\nStudent question: ${userMsg}`;
        const aiReply = await AiChallengeNpc.requestAiText(spriteData, fullPrompt, 'assessment-observatory-chat', 'AI coach chat reply');

        const aiBubble = document.createElement('div');
        aiBubble.style.cssText = 'margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid #1e293b;';
        aiBubble.innerHTML = `<span style="color:#10b981;font-weight:bold;">Coach:</span> ${aiReply}`;
        chatHistory.appendChild(aiBubble);
        conversationHistory.push({ role: 'assistant', content: aiReply });
      } catch (err) {
        const errBubble = document.createElement('div');
        errBubble.style.cssText = 'margin-bottom:8px;color:#f59e0b;';
        errBubble.textContent = 'Coach: Sorry, I had trouble connecting. Please try again.';
        chatHistory.appendChild(errBubble);
      }

      chatSendBtn.disabled = false;
      chatSendBtn.textContent = 'Ask';
      chatHistory.scrollTop = chatHistory.scrollHeight;
    };

    chatSendBtn.onclick = sendChatMessage;
    chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendChatMessage(); });

    chatInputRow.appendChild(chatInput);
    chatInputRow.appendChild(chatSendBtn);
    chatSection.appendChild(chatInputRow);
    container.appendChild(chatSection);
  }

  // ── Mini Challenges – Wordle only ───────────────────────────────
  async renderMiniChallenges(userData, container) {
    const wordleBox = document.createElement('div');
    wordleBox.style.cssText = `background:#1e293b;border:1px solid #334155;border-radius:12px;padding:24px;`;

    const wordleTitle = document.createElement('h3');
    wordleTitle.textContent = 'Learning Wordle';
    wordleTitle.style.cssText = 'margin:0 0 4px 0;color:#60a5fa;font-size:20px;';
    wordleBox.appendChild(wordleTitle);

    const wordleSubtitle = document.createElement('div');
    wordleSubtitle.textContent = 'Guess the 6-letter CS / analytics word in 6 tries.';
    wordleSubtitle.style.cssText = 'color:#94a3b8;font-size:13px;margin-bottom:20px;';
    wordleBox.appendChild(wordleSubtitle);

    // Word bank (all 6 letters)
    const wordBank = ['COMMIT', 'SYNTAX', 'BRANCH', 'PYTHON', 'SPRINT', 'GITHUB', 'ARRAYS', 'BINARY', 'REBASE', 'STATIC', 'EXPORT', 'STRUCT', 'RETURN', 'IMPORT', 'OBJECT', 'MATRIX'];
    const targetWord = wordBank[Math.floor(Math.random() * wordBank.length)];
    const MAX_GUESSES = 6;
    const WORD_LEN = 6;

    let guesses = [];         // Array of submitted guess strings
    let currentGuess = '';
    let gameOver = false;

    // ── Grid ────────────────────────────────────────────────────
    const grid = document.createElement('div');
    grid.style.cssText = `display:grid;grid-template-columns:repeat(${WORD_LEN},52px);grid-template-rows:repeat(6,52px);gap:6px;margin:0 auto 20px auto;width:${WORD_LEN * 58}px;`;
    const cells = [];
    for (let row = 0; row < MAX_GUESSES; row++) {
      const rowCells = [];
      for (let col = 0; col < WORD_LEN; col++) {
        const cell = document.createElement('div');
        cell.style.cssText = `
          width:48px;height:48px;border:2px solid #334155;border-radius:6px;
          display:flex;align-items:center;justify-content:center;
          font-size:22px;font-weight:bold;color:#e5e7eb;
          text-transform:uppercase;transition:background 0.3s,border-color 0.3s;
          background:#0f172a;
        `;
        grid.appendChild(cell);
        rowCells.push(cell);
      }
      cells.push(rowCells);
    }
    wordleBox.appendChild(grid);

    // ── Keyboard ────────────────────────────────────────────────
    const rows = [
      ['Q','W','E','R','T','Y','U','I','O','P'],
      ['A','S','D','F','G','H','J','K','L'],
      ['ENTER','Z','X','C','V','B','N','M','⌫'],
    ];

    const keyMap = {};
    const keyboard = document.createElement('div');
    keyboard.style.cssText = 'display:flex;flex-direction:column;gap:6px;align-items:center;margin-bottom:16px;';

    rows.forEach(rowKeys => {
      const rowEl = document.createElement('div');
      rowEl.style.cssText = 'display:flex;gap:5px;';
      rowKeys.forEach(key => {
        const btn = document.createElement('button');
        btn.textContent = key;
        const isWide = key === 'ENTER' || key === '⌫';
        btn.style.cssText = `
          padding: 14px ${isWide ? '10px' : '12px'};
          background:#334155;color:#e5e7eb;border:none;border-radius:6px;
          cursor:pointer;font-size:${isWide ? '11px' : '14px'};font-weight:600;
          min-width:${isWide ? '52px' : '36px'};transition:background 0.2s;
        `;
        btn.onclick = () => handleKey(key);
        if (!isWide) keyMap[key] = btn;
        rowEl.appendChild(btn);
      });
      keyboard.appendChild(rowEl);
    });
    wordleBox.appendChild(keyboard);

    // ── Message area ────────────────────────────────────────────
    const message = document.createElement('div');
    message.style.cssText = 'text-align:center;font-size:14px;color:#94a3b8;min-height:22px;margin-bottom:10px;';
    wordleBox.appendChild(message);

    // ── Current row display helper ───────────────────────────────
    const updateCurrentRow = () => {
      const rowIdx = guesses.length;
      if (rowIdx >= MAX_GUESSES) return;
      for (let c = 0; c < WORD_LEN; c++) {
        cells[rowIdx][c].textContent = currentGuess[c] || '';
        cells[rowIdx][c].style.borderColor = currentGuess[c] ? '#60a5fa' : '#334155';
      }
    };

    // ── Colour a submitted row ───────────────────────────────────
    const colourRow = (rowIdx, guess) => {
      // Build per-position result
      const result = Array(WORD_LEN).fill('absent');
      const targetArr = targetWord.split('');
      const guessArr  = guess.split('');

      // First pass: correct positions
      guessArr.forEach((ch, i) => {
        if (ch === targetArr[i]) {
          result[i] = 'correct';
          targetArr[i] = null;
        }
      });
      // Second pass: present but wrong position
      guessArr.forEach((ch, i) => {
        if (result[i] === 'correct') return;
        const idx = targetArr.indexOf(ch);
        if (idx !== -1) {
          result[i] = 'present';
          targetArr[idx] = null;
        }
      });

      const colors = { correct: '#16a34a', present: '#d97706', absent: '#374151' };
      const borders = { correct: '#22c55e', present: '#f59e0b', absent: '#4b5563' };
      const keyColors = { correct: '#16a34a', present: '#d97706', absent: '#4b5563' };

      result.forEach((state, i) => {
        setTimeout(() => {
          cells[rowIdx][i].style.background   = colors[state];
          cells[rowIdx][i].style.borderColor  = borders[state];
          cells[rowIdx][i].style.color        = '#ffffff';
          // Update keyboard
          const key = guess[i];
          if (keyMap[key]) {
            const current = keyMap[key].dataset.state;
            // Correct > present > absent – don't downgrade
            if (current !== 'correct' && (state === 'correct' || current !== 'present')) {
              keyMap[key].dataset.state = state;
              keyMap[key].style.background = keyColors[state];
              keyMap[key].style.color = '#ffffff';
            }
          }
        }, i * 120);
      });

      return result;
    };

    // ── Handle key input ─────────────────────────────────────────
    const handleKey = (key) => {
      if (gameOver) return;

      if (key === '⌫' || key === 'Backspace') {
        if (currentGuess.length > 0) {
          currentGuess = currentGuess.slice(0, -1);
          updateCurrentRow();
        }
        return;
      }

      if (key === 'ENTER' || key === 'Enter') {
        if (currentGuess.length < WORD_LEN) {
          message.textContent = `Word must be ${WORD_LEN} letters.`;
          message.style.color = '#f59e0b';
          return;
        }
        // Submit guess
        const rowIdx = guesses.length;
        guesses.push(currentGuess);
        const result = colourRow(rowIdx, currentGuess);

        const won = currentGuess === targetWord;
        currentGuess = '';
        message.textContent = '';

        setTimeout(() => {
          if (won) {
            gameOver = true;
            message.textContent = `You got it in ${guesses.length}! The word was ${targetWord}.`;
            message.style.color = '#10b981';
          } else if (guesses.length >= MAX_GUESSES) {
            gameOver = true;
            message.textContent = `Game over! The word was ${targetWord}.`;
            message.style.color = '#ef4444';
          }
        }, WORD_LEN * 120 + 100);

        return;
      }

      if (/^[A-Za-z]$/.test(key) && currentGuess.length < WORD_LEN) {
        currentGuess += key.toUpperCase();
        updateCurrentRow();
      }
    };

    // Physical keyboard listener
    const keyListener = (e) => {
      if (gameOver) return;
      if (e.key === 'Backspace') { handleKey('⌫'); return; }
      if (e.key === 'Enter')     { handleKey('ENTER'); return; }
      if (/^[A-Za-z]$/.test(e.key)) handleKey(e.key);
    };
    document.addEventListener('keydown', keyListener);

    // Cleanup listener when modal closes (observe DOM removal)
    const observer = new MutationObserver(() => {
      if (!document.body.contains(wordleBox)) {
        document.removeEventListener('keydown', keyListener);
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    container.appendChild(wordleBox);
  }

  // ════════════════════════════════════════════════════════════════
  //  NPC 2 – GITHUB ANALYTICS (standalone modal)
  // ════════════════════════════════════════════════════════════════
  async showGitHubStats() {
    try {
      await this.dataLoaded;
      const userData = this.cachedUserData || await this.fetchUserData();

      if (!userData || !userData.github) {
        this.showToast('No GitHub data available. Connect your GitHub account in the Dashboard.');
        return;
      }

      const gh = userData.github;
      const totalEdits = (gh.linesAdded || 0) + (gh.linesDeleted || 0);

      const modal = document.createElement('div');
      modal.style.cssText = `
        position:fixed;top:0;left:0;width:100%;height:100%;
        background:rgba(0,0,0,0.92);display:flex;justify-content:center;
        align-items:center;z-index:10000;overflow-y:auto;
      `;

      const container = document.createElement('div');
      container.style.cssText = `
        background:#0f172a;border:2px solid #10b981;border-radius:16px;
        padding:40px;max-width:600px;max-height:90vh;overflow-y:auto;
        color:#e5e7eb;margin:20px auto;
      `;

      container.innerHTML = `
        <h1 style="margin:0 0 6px 0;color:#10b981;font-size:26px;">GitHub Contribution Report</h1>
        <p style="margin:0 0 28px 0;color:#64748b;font-size:13px;">
          ${userData.name || 'Student'} — GitHub ID: ${userData.githubID || 'N/A'}
        </p>
      `;

      // Stat cards
      const statsGrid = document.createElement('div');
      statsGrid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:24px;';

      const stats = [
        { label: 'Commits',        value: gh.commits || 0,    color: '#10b981', suffix: '' },
        { label: 'Pull Requests',  value: gh.prs    || 0,    color: '#3b82f6', suffix: '' },
        { label: 'Issues Resolved',value: gh.issues || 0,    color: '#f59e0b', suffix: '' },
        { label: 'Total Edits',    value: totalEdits,         color: '#8b5cf6', suffix: ' lines' },
      ];

      stats.forEach(stat => {
        const card = document.createElement('div');
        card.style.cssText = `
          background:${stat.color}15;border:2px solid ${stat.color};
          border-radius:10px;padding:18px;text-align:center;
        `;
        card.innerHTML = `
          <div style="color:#94a3b8;font-size:12px;margin-bottom:6px;">${stat.label}</div>
          <div style="color:${stat.color};font-size:32px;font-weight:bold;">${stat.value}${stat.suffix}</div>
        `;
        statsGrid.appendChild(card);
      });
      container.appendChild(statsGrid);

      // Code quality breakdown
      const addRatio    = totalEdits > 0 ? ((gh.linesAdded    || 0) / totalEdits * 100).toFixed(0) : 50;
      const deleteRatio = totalEdits > 0 ? ((gh.linesDeleted  || 0) / totalEdits * 100).toFixed(0) : 50;

      const qualityBox = document.createElement('div');
      qualityBox.style.cssText = `background:#1e293b;border:1px solid #334155;border-radius:12px;padding:20px;margin-bottom:20px;`;
      qualityBox.innerHTML = `
        <h3 style="margin:0 0 16px 0;color:#10b981;">Code Quality Metrics</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:16px;">
          <div style="background:#0f172a;padding:12px;border-radius:8px;">
            <div style="color:#94a3b8;font-size:11px;">Lines Added</div>
            <div style="color:#10b981;font-size:22px;font-weight:bold;">+${gh.linesAdded || 0}</div>
          </div>
          <div style="background:#0f172a;padding:12px;border-radius:8px;">
            <div style="color:#94a3b8;font-size:11px;">Lines Deleted</div>
            <div style="color:#ef4444;font-size:22px;font-weight:bold;">-${gh.linesDeleted || 0}</div>
          </div>
        </div>
        <div style="margin-bottom:8px;font-size:12px;color:#94a3b8;">Net change bar (green = additions, red = deletions)</div>
        <div style="background:#0f172a;border-radius:6px;height:14px;overflow:hidden;display:flex;">
          <div style="background:#10b981;width:${addRatio}%;height:100%;"></div>
          <div style="background:#ef4444;width:${deleteRatio}%;height:100%;"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:#64748b;margin-top:5px;">
          <span>Additions: ${addRatio}%</span>
          <span>Deletions: ${deleteRatio}%</span>
        </div>
      `;
      container.appendChild(qualityBox);

      // Contribution insight
      const insight = document.createElement('div');
      insight.style.cssText = `background:#0f172a;border-left:4px solid #10b981;padding:14px 18px;border-radius:0 8px 8px 0;margin-bottom:24px;`;
      const commitLevel = gh.commits > 100 ? 'Elite contributor' : gh.commits > 50 ? 'Active contributor' : gh.commits > 10 ? 'Growing contributor' : 'Getting started';
      const commitMsg   = gh.commits > 100 ? 'Outstanding dedication to the codebase!' : gh.commits > 50 ? 'Solid commit cadence — keep it up.' : gh.commits > 10 ? 'Good start — try to commit more regularly.' : 'Push your first commits to build momentum.';
      insight.innerHTML = `
        <div style="color:#10b981;font-weight:bold;margin-bottom:4px;">${commitLevel}</div>
        <div style="color:#cbd5e1;font-size:13px;">${commitMsg}</div>
      `;
      container.appendChild(insight);

      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'Close';
      closeBtn.style.cssText = `
        width:100%;padding:12px;background:#10b981;color:#000;
        border:none;border-radius:8px;cursor:pointer;font-weight:bold;font-size:14px;
      `;
      closeBtn.onclick = () => modal.remove();
      container.appendChild(closeBtn);

      modal.appendChild(container);
      document.body.appendChild(modal);
    } catch (err) {
      console.error('Error showing GitHub stats:', err);
      this.showToast('Error loading GitHub stats');
    }
  }

  // ════════════════════════════════════════════════════════════════
  //  NPC 3 – SKILL RADAR (standalone modal, fixed rendering)
  // ════════════════════════════════════════════════════════════════
  async showSkillRadar() {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position:fixed;top:0;left:0;width:100%;height:100%;
      background:rgba(0,0,0,0.92);display:flex;justify-content:center;
      align-items:center;z-index:10000;overflow-y:auto;
    `;

    const container = document.createElement('div');
    container.style.cssText = `
      background:#0f172a;border:2px solid #f59e0b;border-radius:16px;
      padding:40px;max-width:750px;max-height:90vh;overflow-y:auto;
      color:#e5e7eb;margin:20px auto;
    `;

    container.innerHTML = `
      <h1 style="margin:0 0 4px 0;color:#f59e0b;font-size:26px;">Skill Radar</h1>
      <p style="margin:0 0 24px 0;color:#64748b;font-size:13px;">This radar is built directly from your saved self-evaluation data.</p>
    `;

    const loadingBox = document.createElement('div');
    loadingBox.style.cssText = 'padding:16px;border-radius:12px;background:#1e293b;border:1px solid #334155;color:#cbd5e1;margin-bottom:20px;';
    loadingBox.textContent = 'Loading your self-evaluation...';
    container.appendChild(loadingBox);

    const canvasWrap = document.createElement('div');
    canvasWrap.style.cssText = 'display:none;background:#1e293b;border:1px solid #334155;border-radius:12px;padding:20px;margin-bottom:20px;';

    const canvasTitle = document.createElement('div');
    canvasTitle.style.cssText = 'color:#f59e0b;font-weight:bold;margin-bottom:16px;font-size:16px;text-align:center;';
    canvasTitle.textContent = 'Your Skill Radar';
    canvasWrap.appendChild(canvasTitle);

    const canvas = document.createElement('canvas');
    const CANVAS_SIZE = 440;
    const DPR = window.devicePixelRatio || 1;
    canvas.width = CANVAS_SIZE * DPR;
    canvas.height = CANVAS_SIZE * DPR;
    canvas.style.cssText = `display:block;margin:0 auto;width:${CANVAS_SIZE}px;height:${CANVAS_SIZE}px;`;
    canvasWrap.appendChild(canvas);

    const analysisBox = document.createElement('div');
    analysisBox.style.cssText = 'margin-top:16px;';
    canvasWrap.appendChild(analysisBox);
    container.appendChild(canvasWrap);

    const apiToSkillLabel = {
      attendance: 'Attendance',
      workHabits: 'Work Habits',
      behavior: 'Behavior',
      timeliness: 'Timeliness',
      techSense: 'Tech Sense',
      techTalk: 'Tech Talk',
      techGrowth: 'Tech Growth',
      advocacy: 'Advocacy',
      communication: 'Communication',
      integrity: 'Integrity',
      organization: 'Organization',
    };

    const normalizeSkillValue = (value) => {
      const numeric = Number(value);
      if (Number.isFinite(numeric)) return Math.max(1, Math.min(5, numeric));
      return 3;
    };

    try {
      const pyRes = await fetch(`${pythonURI}/api/id`, fetchOptions);
      if (!pyRes.ok) throw new Error('Unable to identify the current user');
      const pyData = await pyRes.json();

      const personRes = await fetch(`${javaURI}/api/person/uid/${pyData.uid}`, fetchOptions);
      if (!personRes.ok) throw new Error('Unable to load the student record');
      const person = await personRes.json();

      const evalRes = await fetch(`${javaURI}/api/student-evaluation/get/${person.id}`, fetchOptions);
      if (!evalRes.ok) throw new Error('Unable to load self-evaluation data');
      const evalJson = await evalRes.json();
      const evaluation = evalJson.evaluation || evalJson;

      const skills = {};
      Object.entries(apiToSkillLabel).forEach(([apiKey, label]) => {
        const rawValue = evaluation?.[apiKey] ?? evaluation?.[label] ?? 3;
        skills[label] = normalizeSkillValue(rawValue);
      });

      const orderedSkills = Object.entries(skills).map(([label, value]) => ({ label, value }));
      const strongest = orderedSkills.reduce((best, current) => (current.value > best.value ? current : best), orderedSkills[0]);
      const weakest = orderedSkills.reduce((best, current) => (current.value < best.value ? current : best), orderedSkills[0]);

      this.drawSkillRadarOnCanvas(canvas, skills, DPR);
      loadingBox.remove();
      canvasWrap.style.display = 'block';

      analysisBox.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div style="background:#0f172a;border:1px solid #22c55e;border-radius:8px;padding:14px;">
            <div style="color:#22c55e;font-weight:bold;margin-bottom:4px;">Strongest: ${strongest.label}</div>
            <div style="color:#94a3b8;font-size:12px;">${strongest.value}/5 — Leverage this strength to take on harder challenges or mentor peers.</div>
          </div>
          <div style="background:#0f172a;border:1px solid #f59e0b;border-radius:8px;padding:14px;">
            <div style="color:#f59e0b;font-weight:bold;margin-bottom:4px;">Growth Area: ${weakest.label}</div>
            <div style="color:#94a3b8;font-size:12px;">${weakest.value}/5 — Focus deliberate practice here and seek feedback.</div>
          </div>
        </div>
      `;
    } catch (error) {
      console.error('Error loading skill radar:', error);
      loadingBox.textContent = 'Unable to load your self-evaluation right now.';
      loadingBox.style.borderColor = '#ef4444';
      loadingBox.style.color = '#fca5a5';
    }

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.cssText = `
      width:100%;padding:12px;background:#64748b;color:white;
      border:none;border-radius:8px;cursor:pointer;font-size:14px;
    `;
    closeBtn.onclick = () => modal.remove();
    container.appendChild(closeBtn);

    modal.appendChild(container);
    document.body.appendChild(modal);
  }

  /**
   * Draw a skill radar on a canvas element.
   * @param {HTMLCanvasElement} canvas
   * @param {Object} skills  e.g. { Attendance: 4, "Work Habits": 3, ... }
   * @param {number} dpr     device pixel ratio (default 1)
   */
  drawSkillRadarOnCanvas(canvas, skills, dpr = 1) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width;   // already multiplied by dpr
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.scale(dpr, dpr);      // scale once so all coords are in CSS pixels

    const cssW = W / dpr;
    const cssH = H / dpr;
    const cx = cssW / 2;
    const cy = cssH / 2;
    const radius = Math.min(cx, cy) * 0.60;   // 60% of half-size → leaves room for labels

    const labels  = Object.keys(skills);
    const values  = Object.values(skills);     // 1–5
    const n = labels.length;
    if (n === 0) return;

    const angleStep = (2 * Math.PI) / n;
    const startAngle = -Math.PI / 2;           // start at top

    const ptX = (i, r) => cx + r * Math.cos(startAngle + i * angleStep);
    const ptY = (i, r) => cy + r * Math.sin(startAngle + i * angleStep);

    // ── Grid rings (1–5) ────────────────────────────────────────
    for (let ring = 1; ring <= 5; ring++) {
      const r = (radius / 5) * ring;
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const x = ptX(i, r);
        const y = ptY(i, r);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(251,191,36,${0.08 + ring * 0.04})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // ── Spokes ───────────────────────────────────────────────────
    ctx.strokeStyle = 'rgba(251,191,36,0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(ptX(i, radius), ptY(i, radius));
      ctx.stroke();
    }

    // ── Data polygon ─────────────────────────────────────────────
    ctx.beginPath();
    labels.forEach((label, i) => {
      const r = (values[i] / 5) * radius;
      const x = ptX(i, r);
      const y = ptY(i, r);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle   = 'rgba(251,191,36,0.25)';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth   = 2.5;
    ctx.fill();
    ctx.stroke();

    // ── Data points ──────────────────────────────────────────────
    labels.forEach((label, i) => {
      const r = (values[i] / 5) * radius;
      ctx.beginPath();
      ctx.arc(ptX(i, r), ptY(i, r), 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#fbbf24';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // ── Labels ───────────────────────────────────────────────────
    const LABEL_PADDING = 22;
    ctx.font = `bold ${Math.round(cssW * 0.028)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    labels.forEach((label, i) => {
      const lx = ptX(i, radius + LABEL_PADDING);
      const ly = ptY(i, radius + LABEL_PADDING);
      ctx.fillStyle = '#e5e7eb';
      ctx.fillText(label, lx, ly);

      // Score below label
      ctx.font = `${Math.round(cssW * 0.024)}px Arial`;
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`${values[i]}/5`, lx, ly + 14);
      ctx.font = `bold ${Math.round(cssW * 0.028)}px Arial`;
    });

    // Reset scale for future redraws
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  // ════════════════════════════════════════════════════════════════
  //  DATA FETCHING
  // ════════════════════════════════════════════════════════════════
  async fetchUserData() {
    try {
      console.log('Assessment Observatory: Starting data fetch...');

      // Check for debug test data flag
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('debug-test-data')) {
        console.log('Assessment Observatory: Using debug test data');
        return {
          uid: 'test-student',
          name: 'Test Student',
          avatar: 'default.png',
          analyticsSummary: {
            interactionPercentage: 72.5,
            averageScrollDepth: 64.2,
            totalTimeSpentSeconds: 170820,
            scrollDepthTrend: 'stable',
            engagementTrend: 'stable'
          },
          github: {
            commits: 42,
            prs: 8,
            issues: 15,
            linesAdded: 3421,
            linesDeleted: 892
          },
          skills: {
            'Attendance': 4,
            'Work Habits': 3,
            'Behavior': 4,
            'Timeliness': 3,
            'Tech Sense': 4,
            'Tech Talk': 3,
            'Tech Growth': 4,
            'Advocacy': 2,
            'Communication': 3,
            'Integrity': 5,
            'Organization': 3
          }
        };
      }

      const userResponse = await fetch(`${pythonURI}/api/id`, fetchOptions);
      if (!userResponse.ok) {
        console.error('Assessment Observatory: User info fetch failed:', userResponse.status);
        return null;
      }

      const userData = await userResponse.json();
      console.log('Assessment Observatory: User info fetched, uid:', userData.uid);

      const [analyticsRes, detailedRes, commitsRes, prsRes, issuesRes] = await Promise.all([
        fetch(`${javaURI}/api/ocs-analytics/user/summary`, fetchOptions).catch(e => { console.error('Analytics fetch error:', e); return { ok: false }; }),
        fetch(`${javaURI}/api/ocs-analytics/user/detailed`, fetchOptions).catch(e => { console.error('Detailed analytics fetch error:', e); return { ok: false }; }),
        fetch(`${pythonURI}/api/analytics/github/user/commits`, fetchOptions).catch(e => { console.error('Commits fetch error:', e); return { ok: false }; }),
        fetch(`${pythonURI}/api/analytics/github/user/prs`,     fetchOptions).catch(e => { console.error('PRs fetch error:', e);     return { ok: false }; }),
        fetch(`${pythonURI}/api/analytics/github/user/issues`,  fetchOptions).catch(e => { console.error('Issues fetch error:', e);  return { ok: false }; }),
      ]);

      if (analyticsRes.ok) {
        try { userData.analyticsSummary = await analyticsRes.json(); }
        catch (err) { console.error('Failed to parse OCS response:', err); }
      }

      if (detailedRes.ok) {
        try {
          userData.analyticsSessions = await detailedRes.json();
        } catch (err) {
          console.error('Failed to parse detailed analytics:', err);
          userData.analyticsSessions = [];
        }
      } else {
        userData.analyticsSessions = [];
      }

      if (commitsRes.ok) {
        try {
          const d = await commitsRes.json();
          userData.github = userData.github || {};
          userData.github.commits      = d.total_commit_contributions || 0;
          userData.github.linesAdded   = d.total_lines_added   || 0;
          userData.github.linesDeleted = d.total_lines_deleted  || 0;
        } catch (err) { console.error('Failed to parse commits:', err); }
      }

      if (prsRes.ok) {
        try {
          const d = await prsRes.json();
          userData.github = userData.github || {};
          userData.github.prs = (d.pull_requests || []).length;
        } catch (err) { console.error('Failed to parse PRs:', err); }
      }

      if (issuesRes.ok) {
        try {
          const d = await issuesRes.json();
          userData.github = userData.github || {};
          userData.github.issues = (d.issues || []).length;
        } catch (err) { console.error('Failed to parse issues:', err); }
      }

      console.log('Assessment Observatory: All data fetched', userData);
      return userData;
    } catch (err) {
      console.error('Assessment Observatory: Fatal error in fetchUserData:', err);
      return null;
    }
  }

  // ════════════════════════════════════════════════════════════════
  //  UTILITIES
  // ════════════════════════════════════════════════════════════════
  formatTime(milliseconds) {
    if (!milliseconds || milliseconds <= 0) return '0h 0m';
    const totalMinutes = Math.floor(milliseconds / (1000 * 60));
    const hours   = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours === 0) return `${minutes}m`;
    return `${hours}h ${minutes}m`;
  }

  formatDate(dateString) {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch { return dateString; }
  }

  destroy() {
    super.destroy();
  }
}

export default GameLevelCsPath3Analytics;