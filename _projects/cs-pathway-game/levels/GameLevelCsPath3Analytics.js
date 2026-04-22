// Imports: Level objects and UI helpers.
import GamEnvBackground from '/assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1.1/essentials/Player.js';
import FriendlyNpc from '/assets/js/GameEnginev1.1/essentials/FriendlyNpc.js';
import AiChallengeNpc from '/assets/js/GameEnginev1.1/essentials/AiChallengeNpc.js';
import DialogueSystem from '/assets/js/GameEnginev1.1/essentials/DialogueSystem.js';
import GameLevelCsPathIdentity from './GameLevelCsPathIdentity.js';
import { pythonURI, javaURI, fetchOptions } from '/assets/js/api/config.js';

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
 * This level introduces students to their personal analytics and learning metrics.
 * An Assessment Hub with NPCs provides insights into:
 * - User profile (email, uid, name)
 * - GitHub contribution stats (commits, PRs, issues)
 * - Skill metrics and progress
 * - Grade predictions
 * - Learning journey overview
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

    /**
     * Section: Level objects.
     */

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
    // Position NPCs along pathway progression
    const analyticsGuidePos = {
      x: width * 0.20,
      y: height * 0.65,
    };

    const githubMetricsPos = {
      x: width * 0.48,
      y: height * 0.44,
    };

    // Self-evaluation NPC at end of pathway
    const selfEvalPos = {
      x: width * 0.80,
      y: height * 0.65,
    };

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

    // Store reference to this level for use in callbacks
    const level = this;

    // Analytics Guide - AI coaching on skills and performance
    const npc_data_analyticsGuide = createOrbNpcData({
      id: 'AI Skill Advisor',
      greeting: 'Analytics Station: Your AI coaching assistant analyzes your skills and provides personalized guidance. Press E to interact.',
      position: analyticsGuidePos,
      color: '#3b82f6',
      expertise: 'Personal learning analytics, skill assessment, performance coaching, and progress tracking. Help students understand their strengths and growth areas with actionable feedback.',
      interact: async function() {
        await level.showAnalyticsDashboard();
      },
    });

    // GitHub Metrics Station - AI analysis of code contributions
    const npc_data_githubGuide = createOrbNpcData({
      id: 'GitHub Analytics',
      greeting: 'GitHub Analytics Station: Your AI guide analyzes your code contributions and collaboration patterns. Press E to explore.',
      position: githubMetricsPos,
      color: '#10b981',
      expertise: 'Code contribution analysis, GitHub metrics interpretation, code quality insights, collaboration patterns, and commit history analysis. Help students understand their coding productivity and collaboration effectiveness.',
      interact: async function() {
        await level.showGitHubStats();
      },
    });

    // Self-Evaluation Station - AI coach for sprint reflection
    const npc_data_selfEval = createOrbNpcData({
      id: 'Sprint Coach',
      greeting: 'Self-Assessment Station: Your AI coach guides your sprint reflection and celebrates your progress. Press E to begin.',
      position: selfEvalPos,
      color: '#f59e0b',
      expertise: 'Sprint retrospectives, self-reflection coaching, progress celebration, learning trajectory analysis, and next-step planning. Help students reflect on their sprint work and plan continuous improvement.',
      interact: async function() {
        await level.showSelfEvaluation();
      },
    });

    // List of objects definitions for this level
    this.classes = [
      { class: GamEnvBackground, data: bg_data },
      { class: Player, data: player_data },
      { class: FriendlyNpc, data: npc_data_analyticsGuide },
      { class: FriendlyNpc, data: npc_data_githubGuide },
      { class: FriendlyNpc, data: npc_data_selfEval },
    ];

    // FriendlyNpc expects these level references for toast routing
    this.gameEnv.currentLevel = this;
    this.gameEnv.gameLevel = this;

    // Preload user analytics data as soon as the level initializes
    this.cachedUserData = null;
    this.dataLoaded = Promise.resolve().then(() => this.fetchUserData()).then((data) => {
      this.cachedUserData = data;
      console.log('Assessment Observatory: Data preloaded', data);
      return data;
    }).catch((err) => {
      console.error('Assessment Observatory: Failed to preload data', err);
    });

    // Dialogue: Sequential helper.
    this.levelDialogueSystem = new DialogueSystem({
      id: 'assessment-observatory-dialogue',
      dialogues: [],
      gameControl: gameEnv.gameControl,
      enableVoice: true,
      enableTypewriter: true,
      typewriterSpeed: 24,
      voiceRate: 0.9,
    });

    // Dialogue: Show lines in sequence.
    this.showDialogue = function(speakerName, lines, options = {}) {
      const queue = Array.isArray(lines) ? lines.filter(Boolean) : [String(lines || '')];
      if (queue.length === 0) {
        return Promise.resolve();
      }

      return new Promise((resolve) => {
        let index = 0;
        let finished = false;

        const finish = () => {
          if (finished) {
            return;
          }
          finished = true;
          this.levelDialogueSystem.closeDialogue();
          resolve();
        };

        const showStep = () => {
          if (finished) {
            return;
          }

          const message = queue[index];
          const isLast = index === queue.length - 1;

          this.levelDialogueSystem.closeDialogue();
          this.levelDialogueSystem.showDialogue(
            message,
            speakerName,
            options.avatarSrc || null,
            options.spriteData || null,
          );

          this.levelDialogueSystem.closeBtn.textContent = isLast ? 'Close' : 'Skip';
          this.levelDialogueSystem.closeBtn.onclick = () => finish();

          this.levelDialogueSystem.addButtons([
            {
              text: isLast ? 'Done' : 'Next',
              primary: true,
              action: () => {
                index += 1;
                if (index < queue.length) {
                  showStep();
                } else {
                  finish();
                }
              },
            },
          ]);
        };

        showStep();
      });
    }.bind(this);

  }

  /**
   * Accumulated Toast System - collects toasts until complete
   */
  createAccumulatedToastContainer() {
    const container = document.createElement('div');
    container.id = 'accumulated-toast-' + Date.now();
    container.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      max-width: 400px;
      background: rgba(26, 26, 26, 0.95);
      border: 2px solid #3b82f6;
      border-radius: 12px;
      padding: 20px;
      color: #e5e7eb;
      font-family: Arial, sans-serif;
      font-size: 14px;
      line-height: 1.6;
      max-height: 60vh;
      overflow-y: auto;
      z-index: 9999;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    `;
    document.body.appendChild(container);
    return container;
  }

  addToAccumulatedToast(container, text) {
    const line = document.createElement('div');
    line.style.cssText = `
      margin: 6px 0;
      padding: 4px 0;
      border-bottom: 1px solid rgba(59, 130, 246, 0.2);
      animation: slideInRight 0.3s ease-out;
    `;
    
    if (text === '') {
      line.style.borderBottom = 'none';
      line.style.height = '8px';
    } else {
      line.textContent = text;
    }
    
    container.appendChild(line);
    return container;
  }

  /**
   * PROFESSIONAL ANALYTICS DASHBOARD - Comprehensive Learning Analytics & AI Coaching
   */
  async showAnalyticsDashboard() {
    try {
      await this.dataLoaded;
      const userData = this.cachedUserData || await this.fetchUserData();
      
      if (!userData || !userData.analyticsSummary) {
        this.showToast('Unable to load analytics. Please ensure you are logged in.');
        return;
      }

      // Create main dashboard modal
      const modal = document.createElement('div');
      modal.id = 'analytics-dashboard-modal';
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        overflow-y: auto;
      `;

      const container = document.createElement('div');
      container.style.cssText = `
        background: #0f172a;
        border: 2px solid #3b82f6;
        border-radius: 16px;
        padding: 40px;
        max-width: 1000px;
        max-height: 90vh;
        overflow-y: auto;
        color: #e5e7eb;
        margin: 20px auto;
      `;

      // Title with profile
      const titleBox = document.createElement('div');
      titleBox.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        padding-bottom: 15px;
        border-bottom: 2px solid #1e293b;
      `;

      const title = document.createElement('div');
      title.innerHTML = `<h1 style="margin: 0; color: #60a5fa; font-size: 28px;">Learning Analytics Dashboard</h1>
        <p style="margin: 5px 0 0 0; color: #94a3b8; font-size: 13px;">${userData.name || 'Student'} | UID: ${userData.uid || 'N/A'}</p>`;
      titleBox.appendChild(title);

      // Stats snapshot
      const snapshot = document.createElement('div');
      snapshot.style.cssText = `
        text-align: right;
        font-size: 12px;
      `;
      const s = userData.analyticsSummary || {};
      snapshot.innerHTML = `
        <div style="color: #10b981; font-weight: bold;">Engagement: ${(s.interactionPercentage || 0).toFixed(1)}%</div>
        <div style="color: #f59e0b;">Accuracy: ${(s.averageAccuracyPercentage || 0).toFixed(1)}%</div>
      `;
      titleBox.appendChild(snapshot);
      container.appendChild(titleBox);

      // Tab system - No emojis!
      const tabContainer = document.createElement('div');
      tabContainer.style.cssText = `
        display: flex;
        gap: 10px;
        margin-bottom: 30px;
        border-bottom: 2px solid #1e293b;
        padding-bottom: 15px;
        flex-wrap: wrap;
      `;

      const tabs = [
        { name: 'Skill Advisor', id: 'advisor' },
        { name: 'Performance Analytics', id: 'performance' },
        { name: 'Code Metrics', id: 'github' },
        { name: 'Growth Projections', id: 'projections' },
        { name: 'Recommendations', id: 'recommendations' },
        { name: 'Mini Challenges', id: 'challenges' }
      ];

      const contentArea = document.createElement('div');
      contentArea.id = 'dashboard-content';
      contentArea.style.cssText = 'min-height: 400px;';

      // Tab click handler
      const switchTab = async (tabId) => {
        // Update button styling
        tabContainer.querySelectorAll('button').forEach(btn => {
          btn.style.background = '#334155';
          btn.style.color = '#cbd5e1';
        });
        event.target.style.background = '#3b82f6';
        event.target.style.color = '#ffffff';

        // Render content
        contentArea.innerHTML = '';
        if (tabId === 'advisor') {
          await this.renderSkillAdvisor(userData, contentArea);
        } else if (tabId === 'performance') {
          await this.renderPerformanceAnalytics(userData, contentArea);
        } else if (tabId === 'github') {
          await this.renderGitHubMetrics(userData, contentArea);
        } else if (tabId === 'projections') {
          await this.renderGrowthProjections(userData, contentArea);
        } else if (tabId === 'recommendations') {
          await this.renderRecommendations(userData, contentArea);
        } else if (tabId === 'challenges') {
          await this.renderMiniChallenges(userData, contentArea);
        }
      };

      // Create tabs
      tabs.forEach((tab, idx) => {
        const tabBtn = document.createElement('button');
        tabBtn.textContent = tab.name;
        tabBtn.style.cssText = `
          padding: 10px 18px;
          background: ${idx === 0 ? '#3b82f6' : '#334155'};
          color: ${idx === 0 ? '#ffffff' : '#cbd5e1'};
          border: 1px solid #475569;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s;
        `;
        
        tabBtn.onmouseover = () => {
          if (tabBtn.style.background !== '#3b82f6') {
            tabBtn.style.background = '#475569';
          }
        };
        tabBtn.onmouseout = () => {
          if (tabBtn.style.background !== '#3b82f6') {
            tabBtn.style.background = '#334155';
          }
        };

        tabBtn.onclick = () => switchTab(tab.id);
        tabContainer.appendChild(tabBtn);
      });

      container.appendChild(tabContainer);
      container.appendChild(contentArea);

      // Close button
      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'Close Dashboard';
      closeBtn.style.cssText = `
        margin-top: 30px;
        padding: 12px 30px;
        background: #64748b;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        width: 100%;
        transition: background 0.2s;
      `;
      closeBtn.onmouseover = () => closeBtn.style.background = '#475569';
      closeBtn.onmouseout = () => closeBtn.style.background = '#64748b';
      closeBtn.onclick = () => modal.remove();
      container.appendChild(closeBtn);

      modal.appendChild(container);
      document.body.appendChild(modal);

      // Render first tab
      await switchTab('advisor');

    } catch (err) {
      console.error('Error showing analytics dashboard:', err);
      this.showToast('Error loading dashboard');
    }
  }

  /**
   * SKILL ADVISOR - AI-Powered Skill Analysis with Chat
   */
  async renderSkillAdvisor(userData, container) {
    const skillFields = [
      { name: 'attendance', label: 'Attendance' },
      { name: 'work_habits', label: 'Work Habits' },
      { name: 'behavior', label: 'Behavior' },
      { name: 'timeliness', label: 'Timeliness' },
      { name: 'tech_sense', label: 'Tech Sense' },
      { name: 'tech_talk', label: 'Tech Talk' },
      { name: 'tech_growth', label: 'Tech Growth' },
      { name: 'advocacy', label: 'Advocacy' },
      { name: 'communication', label: 'Communication' },
      { name: 'integrity', label: 'Integrity' },
      { name: 'organization', label: 'Organization' }
    ];

    // Create layout
    const layout = document.createElement('div');
    layout.style.cssText = 'display: grid; grid-template-columns: 1fr; gap: 20px;';

    // Section 1: Evaluation Form
    const evalBox = document.createElement('div');
    evalBox.style.cssText = `
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 20px;
    `;

    const evalTitle = document.createElement('h3');
    evalTitle.textContent = 'Self-Evaluation of Skills (1=Lowest, 5=Highest)';
    evalTitle.style.cssText = 'margin: 0 0 15px 0; color: #60a5fa;';
    evalBox.appendChild(evalTitle);

    // Create slider inputs for skill evaluation
    const sliders = {};
    const grid = document.createElement('div');
    grid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;';

    skillFields.forEach(field => {
      const sliderBox = document.createElement('div');
      sliderBox.style.cssText = `
        background: #0f172a;
        border: 1px solid #334155;
        border-radius: 8px;
        padding: 12px;
      `;

      const label = document.createElement('label');
      label.textContent = field.label;
      label.style.cssText = 'display: block; font-size: 13px; color: #cbd5e1; margin-bottom: 8px;';

      const slider = document.createElement('input');
      slider.type = 'range';
      slider.min = '1';
      slider.max = '5';
      slider.value = '3';
      slider.style.cssText = 'width: 100%; cursor: pointer;';

      const value = document.createElement('div');
      value.textContent = '3/5';
      value.style.cssText = 'font-size: 12px; color: #60a5fa; text-align: center; margin-top: 6px;';

      slider.oninput = () => {
        value.textContent = slider.value + '/5';
      };

      sliders[field.name] = slider;
      sliderBox.appendChild(label);
      sliderBox.appendChild(slider);
      sliderBox.appendChild(value);
      grid.appendChild(sliderBox);
    });

    evalBox.appendChild(grid);
    layout.appendChild(evalBox);

    // Section 2: Skill Radar Display
    const radarBox = document.createElement('div');
    radarBox.style.cssText = `
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 20px;
      display: none;
    `;

    const radarTitle = document.createElement('h3');
    radarTitle.textContent = 'Your Skill Radar';
    radarTitle.style.cssText = 'margin: 0 0 15px 0; color: #60a5fa;';
    radarBox.appendChild(radarTitle);

    const radarCanvas = document.createElement('canvas');
    radarCanvas.width = 400;
    radarCanvas.height = 400;
    radarCanvas.style.cssText = 'display: block; margin: 0 auto;';
    radarBox.appendChild(radarCanvas);

    layout.appendChild(radarBox);

    // Section 3: Strength & Growth Areas
    const analysisBox = document.createElement('div');
    analysisBox.style.cssText = `
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 20px;
      display: none;
    `;

    const analysisTitle = document.createElement('h3');
    analysisTitle.textContent = 'Strength & Growth Areas';
    analysisTitle.style.cssText = 'margin: 0 0 15px 0; color: #60a5fa;';
    analysisBox.appendChild(analysisTitle);

    const analysisList = document.createElement('div');
    analysisList.style.cssText = '';
    analysisBox.appendChild(analysisList);

    layout.appendChild(analysisBox);

    // Generate Radar Button
    const genBtn = document.createElement('button');
    genBtn.textContent = 'Generate My Skill Radar';
    genBtn.style.cssText = `
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 12px 24px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      width: 100%;
    `;

    genBtn.onclick = () => {
      // Collect skill values
      const skills = {};
      let lowestSkill = null;
      let lowestValue = 6;
      let highestSkill = null;
      let highestValue = 0;

      skillFields.forEach(field => {
        const value = parseInt(sliders[field.name].value);
        skills[field.label] = value;

        if (value < lowestValue) {
          lowestValue = value;
          lowestSkill = field.label;
        }
        if (value > highestValue) {
          highestValue = value;
          highestSkill = field.label;
        }
      });

      // Draw radar
      this.drawSkillRadar(radarCanvas, skills);
      radarBox.style.display = 'block';

      // Show analysis
      analysisList.innerHTML = `
        <div style="margin-bottom: 15px;">
          <div style="color: #10b981; font-weight: bold; margin-bottom: 8px;">Strongest Area: ${highestSkill} (${highestValue}/5)</div>
          <div style="color: #cbd5e1; font-size: 13px;">You excel in this area. Consider leveraging this strength to help teammates or take on advanced challenges.</div>
        </div>
        <div>
          <div style="color: #f59e0b; font-weight: bold; margin-bottom: 8px;">Growth Area: ${lowestSkill} (${lowestValue}/5)</div>
          <div style="color: #cbd5e1; font-size: 13px;">This is an opportunity for growth. Focus on deliberate practice and seek feedback in this area.</div>
        </div>
      `;
      analysisBox.style.display = 'block';

      genBtn.textContent = 'Radar Generated';
      genBtn.disabled = true;
    };

    evalBox.appendChild(document.createElement('br'));
    evalBox.appendChild(genBtn);

    layout.appendChild(evalBox);
    container.appendChild(layout);
  }

  /**
   * PERFORMANCE ANALYTICS - Detailed metrics with trends
   */
  async renderPerformanceAnalytics(userData, container) {
    const s = userData.analyticsSummary || {};

    const metrics = [
      { label: 'Engagement Rate', current: (s.interactionPercentage || 0).toFixed(1), target: 85, unit: '%' },
      { label: 'Accuracy Score', current: (s.averageAccuracyPercentage || 0).toFixed(1), target: 90, unit: '%' },
      { label: 'Time Spent', current: (s.totalTimeSpentMinutes || 0), target: 300, unit: ' min', type: 'count' },
    ];

    const grid = document.createElement('div');
    grid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 15px;';

    metrics.forEach(m => {
      const card = document.createElement('div');
      const progress = m.type === 'count' ? Math.min(100, (m.current / m.target) * 100) : m.current;
      const isOnTrack = progress >= (m.type === 'count' ? (m.target * 80 / 100) : 80);

      card.style.cssText = `
        background: #1e293b;
        border: 1px solid #334155;
        border-radius: 12px;
        padding: 20px;
      `;

      card.innerHTML = `
        <div style="color: #94a3b8; font-size: 12px; margin-bottom: 8px;">${m.label}</div>
        <div style="color: #60a5fa; font-size: 24px; font-weight: bold; margin-bottom: 12px;">${m.current}${m.unit}</div>
        <div style="background: #0f172a; border-radius: 8px; height: 8px; overflow: hidden; margin-bottom: 8px;">
          <div style="background: ${isOnTrack ? '#10b981' : '#f59e0b'}; width: ${Math.min(100, progress)}%; height: 100%; transition: width 1s ease-out;"></div>
        </div>
        <div style="color: #cbd5e1; font-size: 11px;">Target: ${m.target}${m.unit} ${isOnTrack ? '✓ On Track' : '- Keep Going'}</div>
      `;
      grid.appendChild(card);
    });

    container.appendChild(grid);

    // Comparison section
    const compBox = document.createElement('div');
    compBox.style.cssText = `
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 20px;
      margin-top: 20px;
    `;

    compBox.innerHTML = `
      <h3 style="margin: 0 0 15px 0; color: #60a5fa;">Sprint Comparison</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
        <div style="background: #0f172a; padding: 12px; border-radius: 8px;">
          <div style="color: #94a3b8; font-size: 11px;">Previous Sprint</div>
          <div style="color: #94a3b8; font-size: 18px; font-weight: bold;">-15%</div>
        </div>
        <div style="background: #0f172a; padding: 12px; border-radius: 8px;">
          <div style="color: #94a3b8; font-size: 11px;">This Sprint (Projected)</div>
          <div style="color: #10b981; font-size: 18px; font-weight: bold;">+12%</div>
        </div>
      </div>
    `;
    container.appendChild(compBox);
  }

  /**
   * GITHUB METRICS - Code contribution analytics with visualizations
   */
  async renderGitHubMetrics(userData, container) {
    const gh = userData.github || {};
    const totalEdits = (gh.linesAdded || 0) + (gh.linesDeleted || 0);

    const metrics = [
      { label: 'Total Commits', value: gh.commits || 0, color: '#10b981' },
      { label: 'Pull Requests', value: gh.prs || 0, color: '#3b82f6' },
      { label: 'Issues Resolved', value: gh.issues || 0, color: '#f59e0b' },
      { label: 'Code Changes', value: totalEdits, color: '#8b5cf6', suffix: ' lines' },
    ];

    const grid = document.createElement('div');
    grid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;';

    metrics.forEach(m => {
      const card = document.createElement('div');
      card.style.cssText = `
        background: ${m.color}15;
        border: 2px solid ${m.color};
        border-radius: 12px;
        padding: 20px;
        text-align: center;
      `;

      card.innerHTML = `
        <div style="color: #94a3b8; font-size: 12px; margin-bottom: 8px;">${m.label}</div>
        <div style="color: ${m.color}; font-size: 32px; font-weight: bold;">${m.value}</div>
        ${m.suffix ? `<div style="color: #94a3b8; font-size: 11px;">${m.suffix}</div>` : ''}
      `;
      grid.appendChild(card);
    });

    container.appendChild(grid);

    // Code quality analysis
    const qualityBox = document.createElement('div');
    qualityBox.style.cssText = `
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 20px;
    `;

    const addRatio = gh.linesAdded > 0 ? ((gh.linesDeleted / (gh.linesAdded + gh.linesDeleted)) * 100).toFixed(0) : 0;

    qualityBox.innerHTML = `
      <h3 style="margin: 0 0 15px 0; color: #60a5fa;">Code Quality Metrics</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
        <div style="background: #0f172a; padding: 12px; border-radius: 8px;">
          <div style="color: #94a3b8; font-size: 11px;">Lines Added</div>
          <div style="color: #10b981; font-size: 20px; font-weight: bold;">+${gh.linesAdded || 0}</div>
        </div>
        <div style="background: #0f172a; padding: 12px; border-radius: 8px;">
          <div style="color: #94a3b8; font-size: 11px;">Lines Deleted</div>
          <div style="color: #ef4444; font-size: 20px; font-weight: bold;">-${gh.linesDeleted || 0}</div>
        </div>
      </div>
      <div style="margin-top: 12px; padding: 12px; background: #0f172a; border-radius: 8px;">
        <div style="color: #94a3b8; font-size: 11px;">Code Churn Rate (Deletions)</div>
        <div style="color: #f59e0b; font-size: 18px; font-weight: bold;">${addRatio}%</div>
      </div>
    `;
    container.appendChild(qualityBox);
  }

  /**
   * GROWTH PROJECTIONS - AI-predicted trajectory
   */
  async renderGrowthProjections(userData, container) {
    const s = userData.analyticsSummary || {};

    const projectionBox = document.createElement('div');
    projectionBox.style.cssText = `
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 20px;
    `;

    const engagement = s.interactionPercentage || 50;
    const accuracy = s.averageAccuracyPercentage || 50;
    const projected4Weeks = Math.min(100, (engagement + accuracy) / 2 + 8);

    projectionBox.innerHTML = `
      <h2 style="margin: 0 0 20px 0; color: #60a5fa;">4-Week Growth Projection</h2>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div>
          <div style="color: #94a3b8; font-size: 12px; margin-bottom: 8px;">Current Performance</div>
          <div style="background: #0f172a; padding: 20px; border-radius: 8px; text-align: center;">
            <div style="color: #60a5fa; font-size: 36px; font-weight: bold;">${((engagement + accuracy) / 2).toFixed(0)}%</div>
          </div>
        </div>
        <div>
          <div style="color: #94a3b8; font-size: 12px; margin-bottom: 8px;">Projected (Maintaining Pace)</div>
          <div style="background: #1e7e34; padding: 20px; border-radius: 8px; text-align: center;">
            <div style="color: #86efac; font-size: 36px; font-weight: bold;">${projected4Weeks.toFixed(0)}%</div>
          </div>
        </div>
      </div>

      <div style="margin-top: 20px; padding: 15px; background: #0f172a; border-radius: 8px; border-left: 4px solid #3b82f6;">
        <div style="color: #94a3b8; font-size: 12px; margin-bottom: 5px;">Mastery Timeline</div>
        <div style="color: #60a5fa; font-weight: bold;">Estimated ${Math.ceil(100 / Math.max(projected4Weeks, 1))} weeks to reach mastery (95%+)</div>
      </div>
    `;
    container.appendChild(projectionBox);
  }

  /**
   * RECOMMENDATIONS - AI-generated action items
   */
  async renderRecommendations(userData, container) {
    const s = userData.analyticsSummary || {};

    // Show loading state while AI generates recommendations
    const recHeader = document.createElement('div');
    recHeader.style.cssText = 'color: #60a5fa; font-weight: bold; margin-bottom: 15px; font-size: 14px;';
    recHeader.textContent = 'AI generating personalized recommendations...';
    container.appendChild(recHeader);

    try {
      // Build a prompt for AI to generate personalized recommendations
      const recPrompt = `You are an expert learning coach. Analyze this student's data and provide 3 prioritized action items:
      
Student Data:
- Engagement: ${(s.interactionPercentage || 0).toFixed(1)}% (target: 85%+)
- Accuracy: ${(s.averageAccuracyPercentage || 0).toFixed(1)}%
- Time Invested: ${(s.totalTimeSpentMinutes || 0)} minutes (building consistent habits)

Format each recommendation as:
[PRIORITY: High|Medium|Low]
[ACTION: short title]
[REASON: 1 sentence why this matters]
[STEPS: 3 bullet points]

Do not include any other text. Generate exactly 3 recommendations.`;

      const spriteData = { id: 'AI Skill Advisor', expertise: 'Learning analytics and personalized coaching' };
      const aiResponse = await AiChallengeNpc.requestAiText(
        spriteData,
        recPrompt,
        'assessment-observatory-recommendations',
        'Personalized learning recommendations'
      );

      container.innerHTML = '';
      recHeader.textContent = 'Personalized Recommendations';
      container.appendChild(recHeader);

      // Parse AI response into recommendation cards
      const recCards = aiResponse.split('[PRIORITY:').filter(r => r.trim().length > 0);

      recCards.forEach((recText, index) => {
        const priorityMatch = recText.match(/High|Medium|Low/);
        const actionMatch = recText.match(/\[ACTION: ([^\]]+)\]/);
        const reasonMatch = recText.match(/\[REASON: ([^\]]+)\]/);
        const stepsMatch = recText.match(/\[STEPS: ([^\]]+)\]/);

        const priority = priorityMatch ? priorityMatch[0] : 'Medium';
        const action = actionMatch ? actionMatch[1] : 'Continue Learning';
        const reason = reasonMatch ? reasonMatch[1] : 'Focus on your learning goals.';
        const stepsText = stepsMatch ? stepsMatch[1] : '• Set daily goals\n• Track progress\n• Review regularly';
        const steps = stepsText.split('\n').map(s => s.replace(/^[•\-]\s*/, '').trim()).filter(s => s.length > 0);

        const card = document.createElement('div');
        const bgColor = priority === 'High' ? '#7c2d12' : priority === 'Medium' ? '#3f3f00' : '#0f172a';
        const borderColor = priority === 'High' ? '#ea580c' : priority === 'Medium' ? '#eab308' : '#334155';

        card.style.cssText = `
          background: ${bgColor};
          border: 2px solid ${borderColor};
          border-radius: 12px;
          padding: 15px;
          margin-bottom: 15px;
        `;

        card.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="color: ${priority === 'High' ? '#fdba74' : priority === 'Medium' ? '#facc15' : '#cbd5e1'}; font-weight: bold; font-size: 13px;">
              ${priority} Priority
            </div>
          </div>
          <div style="color: #e5e7eb; font-weight: bold; margin-bottom: 5px;">${action}</div>
          <div style="color: #cbd5e1; font-size: 12px; margin-bottom: 10px;">${reason}</div>
          <div style="color: #94a3b8; font-size: 11px;">
            ${steps.map(s => `• ${s}`).join('<br>')}
          </div>
        `;
        container.appendChild(card);
      });

    } catch (error) {
      console.error('AI recommendations request failed:', error);
      container.innerHTML = '';
      recHeader.textContent = 'Personalized Recommendations';
      container.appendChild(recHeader);

      // Fallback recommendations
      const fallbackRecs = [
        {
          priority: 'High',
          action: 'Increase Practice Volume',
          reason: 'Consistent practice builds mastery.',
          steps: ['Complete daily coding challenges', 'Review solutions carefully', 'Practice similar problems']
        },
        {
          priority: 'Medium',
          action: 'Boost Engagement',
          reason: 'Regular participation accelerates learning.',
          steps: ['Set daily learning goals', 'Join study sessions', 'Track your progress']
        },
        {
          priority: 'Low',
          action: 'Share Your Knowledge',
          reason: 'Teaching reinforces your own understanding.',
          steps: ['Help struggling peers', 'Explain concepts clearly', 'Review fundamentals']
        },
      ];

      fallbackRecs.forEach(rec => {
        const card = document.createElement('div');
        const bgColor = rec.priority === 'High' ? '#7c2d12' : rec.priority === 'Medium' ? '#3f3f00' : '#0f172a';
        const borderColor = rec.priority === 'High' ? '#ea580c' : rec.priority === 'Medium' ? '#eab308' : '#334155';

        card.style.cssText = `
          background: ${bgColor};
          border: 2px solid ${borderColor};
          border-radius: 12px;
          padding: 15px;
          margin-bottom: 15px;
        `;

        card.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="color: ${rec.priority === 'High' ? '#fdba74' : rec.priority === 'Medium' ? '#facc15' : '#cbd5e1'}; font-weight: bold; font-size: 13px;">
              ${rec.priority} Priority
            </div>
          </div>
          <div style="color: #e5e7eb; font-weight: bold; margin-bottom: 5px;">${rec.action}</div>
          <div style="color: #cbd5e1; font-size: 12px; margin-bottom: 10px;">${rec.reason}</div>
          <div style="color: #94a3b8; font-size: 11px;">
            ${rec.steps.map(s => `• ${s}`).join('<br>')}
          </div>
        `;
        container.appendChild(card);
      });
    }
  }

  /**
   * MINI CHALLENGES - Real engaging games
   */
  async renderMiniChallenges(userData, container) {
    const s = userData.analyticsSummary || {};
    const gh = userData.github || {};

    const layout = document.createElement('div');
    layout.style.cssText = 'display: grid; grid-template-columns: 1fr; gap: 20px;';

    // GAME 1: Analytics Wordle
    const wordleBox = document.createElement('div');
    wordleBox.style.cssText = `
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 20px;
    `;

    const wordleTitle = document.createElement('h3');
    wordleTitle.textContent = 'Game 1: Learning Wordle';
    wordleTitle.style.cssText = 'margin: 0 0 15px 0; color: #60a5fa;';
    wordleBox.appendChild(wordleTitle);

    const wordleWords = ['COMMIT', 'ITERATE', 'REFACTOR', 'COMPILE', 'SYNTAX', 'EXECUTE'];
    let wordleWord = wordleWords[Math.floor(Math.random() * wordleWords.length)].toUpperCase();
    let wordleGuesses = 0;
    const wordleMaxGuesses = 6;

    const wordleInput = document.createElement('input');
    wordleInput.type = 'text';
    wordleInput.placeholder = 'Guess an analytics/coding word (6 letters)...';
    wordleInput.style.cssText = `
      width: 100%;
      padding: 10px;
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 6px;
      color: #e5e7eb;
      margin-bottom: 10px;
      box-sizing: border-box;
    `;

    const wordleResult = document.createElement('div');
    wordleResult.style.cssText = 'color: #cbd5e1; font-size: 14px; margin-bottom: 10px; min-height: 20px;';
    wordleResult.textContent = `Guesses remaining: ${wordleMaxGuesses}`;

    const wordleGuessBtn = document.createElement('button');
    wordleGuessBtn.textContent = 'Guess';
    wordleGuessBtn.style.cssText = `
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 10px 20px;
      cursor: pointer;
      width: 100%;
    `;

    wordleGuessBtn.onclick = () => {
      const guess = wordleInput.value.toUpperCase().trim();
      wordleInput.value = '';

      if (guess.length !== 6) {
        wordleResult.textContent = 'Please enter a 6-letter word';
        wordleResult.style.color = '#f59e0b';
        return;
      }

      wordleGuesses++;

      if (guess === wordleWord) {
        wordleResult.textContent = `Correct! The word is ${wordleWord}. You used ${wordleGuesses}/${wordleMaxGuesses} guesses.`;
        wordleResult.style.color = '#10b981';
        wordleInput.disabled = true;
        wordleGuessBtn.disabled = true;
      } else if (wordleGuesses >= wordleMaxGuesses) {
        wordleResult.textContent = `Game Over! The word was ${wordleWord}.`;
        wordleResult.style.color = '#ef4444';
        wordleInput.disabled = true;
        wordleGuessBtn.disabled = true;
      } else {
        const correct = guess.split('').filter((c, i) => c === wordleWord[i]).length;
        wordleResult.textContent = `Incorrect. ${correct} letter(s) in correct position. Guesses remaining: ${wordleMaxGuesses - wordleGuesses}`;
        wordleResult.style.color = '#f59e0b';
      }
    };

    wordleBox.appendChild(wordleInput);
    wordleBox.appendChild(wordleResult);
    wordleBox.appendChild(wordleGuessBtn);
    layout.appendChild(wordleBox);

    // GAME 2: Schedule Optimizer
    const scheduleBox = document.createElement('div');
    scheduleBox.style.cssText = `
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 20px;
    `;

    const scheduleTitle = document.createElement('h3');
    scheduleTitle.textContent = 'Game 2: Weekly Schedule Builder';
    scheduleTitle.style.cssText = 'margin: 0 0 15px 0; color: #60a5fa;';
    scheduleBox.appendChild(scheduleTitle);

    const scheduleDesc = document.createElement('p');
    scheduleDesc.textContent = 'Plan your week: allocate your engagement across 4 days. Your actual engagement is ' + (s.interactionPercentage || 0).toFixed(1) + '%. Can you match it?';
    scheduleDesc.style.cssText = 'color: #cbd5e1; font-size: 13px; margin-bottom: 15px;';
    scheduleBox.appendChild(scheduleDesc);

    const schedule = { Mon: 0, Tue: 0, Wed: 0, Thu: 0 };
    const scheduleInputs = {};
    const scheduleGrid = document.createElement('div');
    scheduleGrid.style.cssText = 'display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 15px;';

    Object.keys(schedule).forEach(day => {
      const dayBox = document.createElement('div');
      const dayInput = document.createElement('input');
      dayInput.type = 'range';
      dayInput.min = '0';
      dayInput.max = '100';
      dayInput.value = '25';
      dayInput.style.cssText = 'width: 100%;';

      const dayLabel = document.createElement('div');
      dayLabel.style.cssText = 'font-size: 12px; color: #9ca3af; text-align: center; margin-bottom: 5px;';
      dayLabel.textContent = day;

      const dayValue = document.createElement('div');
      dayValue.style.cssText = 'font-size: 14px; font-weight: bold; color: #60a5fa; text-align: center;';
      dayValue.textContent = '25%';

      dayInput.oninput = () => {
        dayValue.textContent = dayInput.value + '%';
        scheduleInputs[day] = parseInt(dayInput.value);
      };

      scheduleInputs[day] = 25;
      dayBox.appendChild(dayLabel);
      dayBox.appendChild(dayInput);
      dayBox.appendChild(dayValue);
      scheduleGrid.appendChild(dayBox);
    });

    scheduleBox.appendChild(scheduleGrid);

    const scheduleCheckBtn = document.createElement('button');
    scheduleCheckBtn.textContent = 'Check My Schedule';
    scheduleCheckBtn.style.cssText = `
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 10px 20px;
      cursor: pointer;
      width: 100%;
    `;

    const scheduleResult = document.createElement('div');
    scheduleResult.style.cssText = 'color: #cbd5e1; font-size: 13px; margin-top: 10px; min-height: 20px;';

    scheduleCheckBtn.onclick = () => {
      const total = Object.values(scheduleInputs).reduce((a, b) => a + b, 0);
      const target = s.interactionPercentage || 50;
      const diff = Math.abs(total - target);

      if (diff < 5) {
        scheduleResult.textContent = `Excellent scheduling! You matched your engagement pattern perfectly.`;
        scheduleResult.style.color = '#10b981';
      } else if (diff < 15) {
        scheduleResult.textContent = `Good plan! You're close to your engagement target (off by ${diff.toFixed(1)}%).`;
        scheduleResult.style.color = '#f59e0b';
      } else {
        scheduleResult.textContent = `Your plan differs from your pattern by ${diff.toFixed(1)}%. Consider if this is more balanced or realistic.`;
        scheduleResult.style.color = '#cbd5e1';
      }
    };

    scheduleBox.appendChild(scheduleCheckBtn);
    scheduleBox.appendChild(scheduleResult);
    layout.appendChild(scheduleBox);

    // GAME 3: Engagement Predictor
    const predictorBox = document.createElement('div');
    predictorBox.style.cssText = `
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 20px;
    `;

    const predictorTitle = document.createElement('h3');
    predictorTitle.textContent = 'Game 3: Next Week Engagement Predictor';
    predictorTitle.style.cssText = 'margin: 0 0 15px 0; color: #60a5fa;';
    predictorBox.appendChild(predictorTitle);

    const predictorDesc = document.createElement('p');
    predictorDesc.textContent = 'Based on your current engagement (' + (s.interactionPercentage || 0).toFixed(1) + '%) and accuracy (' + (s.averageAccuracyPercentage || 0).toFixed(1) + '%), predict your engagement next week:';
    predictorDesc.style.cssText = 'color: #cbd5e1; font-size: 13px; margin-bottom: 15px;';
    predictorBox.appendChild(predictorDesc);

    const predictionOptions = document.createElement('div');
    predictionOptions.style.cssText = 'display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 15px;';

    const predictions = [
      { label: 'Higher (+10%)', value: 'higher' },
      { label: 'Lower (-10%)', value: 'lower' },
      { label: 'Same', value: 'same' },
      { label: 'Much Higher (+20%)', value: 'much_higher' }
    ];

    let selectedPrediction = null;
    predictions.forEach(pred => {
      const btn = document.createElement('button');
      btn.textContent = pred.label;
      btn.style.cssText = `
        padding: 12px;
        background: #334155;
        color: #cbd5e1;
        border: 1px solid #475569;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
      `;

      btn.onmouseover = () => btn.style.background = '#475569';
      btn.onmouseout = () => btn.style.background = selectedPrediction === pred.value ? '#3b82f6' : '#334155';

      btn.onclick = () => {
        predictions.forEach(p => {
          const allBtns = predictionOptions.querySelectorAll('button');
          allBtns.forEach(b => b.style.background = '#334155');
        });
        btn.style.background = '#3b82f6';
        selectedPrediction = pred.value;
        predictorResult.textContent = '';
      };

      predictionOptions.appendChild(btn);
    });

    predictorBox.appendChild(predictionOptions);

    const predictorCheckBtn = document.createElement('button');
    predictorCheckBtn.textContent = 'Submit Prediction';
    predictorCheckBtn.style.cssText = `
      background: #10b981;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 10px 20px;
      cursor: pointer;
      width: 100%;
      marginBottom: '10px';
    `;

    const predictorResult = document.createElement('div');
    predictorResult.style.cssText = 'color: #cbd5e1; font-size: 13px; margin-top: 10px; min-height: 20px;';

    predictorCheckBtn.onclick = () => {
      if (!selectedPrediction) {
        predictorResult.textContent = 'Please select a prediction';
        predictorResult.style.color = '#f59e0b';
        return;
      }

      const currentEngagement = s.interactionPercentage || 50;
      const currentAccuracy = s.averageAccuracyPercentage || 70;
      const accuracyTrend = currentAccuracy > 80 ? 'strong' : 'moderate';

      let prediction = '';
      if (accuracyTrend === 'strong') {
        prediction = (selectedPrediction === 'higher' || selectedPrediction === 'much_higher') ? 'Correct' : 'Incorrect';
      } else {
        prediction = (selectedPrediction === 'same' || selectedPrediction === 'lower') ? 'Correct' : 'Incorrect';
      }

      if (prediction === 'Correct') {
        predictorResult.textContent = 'Your prediction aligns with the trend! Based on your accuracy, you understand your learning patterns well.';
        predictorResult.style.color = '#10b981';
      } else {
        predictorResult.textContent = 'Your prediction differs from the trend. Review your patterns to improve predictions next time.';
        predictorResult.style.color = '#f59e0b';
      }
    };

    predictorBox.appendChild(predictorCheckBtn);
    predictorBox.appendChild(predictorResult);
    layout.appendChild(predictorBox);

    container.appendChild(layout);
  }

  /**
   * Helper: Draw skill radar chart
   */
  drawSkillRadar(canvas, skills) {
    const ctx = canvas.getContext('2d');
    const centerX = 150, centerY = 150, radius = 120;
    const skillNames = Object.keys(skills);
    const angles = skillNames.map((_, i) => (i * 2 * Math.PI) / skillNames.length - Math.PI / 2);

    // Draw grid
    for (let i = 1; i <= 5; i++) {
      ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 + i * 0.08})`;
      ctx.beginPath();
      angles.forEach((angle, idx) => {
        const r = (radius / 5) * i;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.stroke();
    }

    // Draw data polygon
    ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 2;
    ctx.beginPath();
    skillNames.forEach((skill, idx) => {
      const value = (skills[skill] / 100) * radius;
      const x = centerX + value * Math.cos(angles[idx]);
      const y = centerY + value * Math.sin(angles[idx]);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw labels
    ctx.fillStyle = '#e5e7eb';
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'center';
    skillNames.forEach((skill, idx) => {
      const x = centerX + (radius + 25) * Math.cos(angles[idx]);
      const y = centerY + (radius + 25) * Math.sin(angles[idx]);
      ctx.fillText(skill, x, y);
    });
  }

  /**
   * Helper: Get skill-specific tips
   */
  getSkillTip(skill, score) {
   const tips = {
      'Problem Solving': 'Focus on breaking down complex problems into smaller steps. Practice algorithmic thinking.',
      'Communication': 'Expand your peer interactions and documentation efforts.',
      'Code Quality': 'Review code best practices and refactoring techniques.',
      'Testing': 'Increase unit test coverage and testing scenarios.',
      'Time Management': 'Track your study sessions and optimize scheduling.',
      'Persistence': 'Diversify your learning resources and difficulty levels.',
    };
    return tips[skill] || 'Continue practicing this skill area.';
  }

  /**
   * Helper: Get recommended actions
   */
  getSkillAction(skill) {
    const actions = {
      'Problem Solving': 'Complete algorithm challenges on LeetCode',
      'Communication': 'Write a technical blog post or present to peers',
      'Code Quality': 'Refactor old projects using design patterns',
      'Testing': 'Add 10 unit tests to existing code',
      'Time Management': 'Schedule focused 90-minute study blocks',
      'Persistence': 'Complete one challenge daily for a week',
    };
    return actions[skill] || 'Practice this skill regularly';
  }
  // renderSkillsRadar removed - use renderSkillAdvisor for self-evaluated skills instead
  async renderSkillsRadar(userData, container) {
    container.innerHTML = '';
    const msg = document.createElement('div');
    msg.textContent = 'Skills are now tracked through self-evaluation in the Skill Advisor section.';
    msg.style.cssText = 'color: #94a3b8; padding: 20px; text-align: center;';
    container.appendChild(msg);
    const angles = skillNames.map((_, i) => (i * 2 * Math.PI) / skillNames.length - Math.PI / 2);

    // Animate radar fill
    let animationProgress = 0;
    const animationDuration = 2000;
    const startTime = Date.now();

    const drawRadar = () => {
      const elapsed = Date.now() - startTime;
      animationProgress = Math.min(1, elapsed / animationDuration);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw hexagon grid
      for (let i = 1; i <= 5; i++) {
        ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 + i * 0.1})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        angles.forEach((angle, idx) => {
          const r = (radius / 5) * i;
          const x = centerX + r * Math.cos(angle);
          const y = centerY + r * Math.sin(angle);
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.stroke();
      }

      // Draw axes
      ctx.strokeStyle = 'rgba(96, 165, 250, 0.3)';
      angles.forEach(angle => {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
        ctx.stroke();
      });

      // Draw data polygon (animated)
      ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      skillNames.forEach((skill, idx) => {
        const value = (skills[skill] / 100) * radius * animationProgress;
        const x = centerX + value * Math.cos(angles[idx]);
        const y = centerY + value * Math.sin(angles[idx]);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Draw points and labels
      skillNames.forEach((skill, idx) => {
        const x = centerX + radius * Math.cos(angles[idx]);
        const y = centerY + radius * Math.sin(angles[idx]);

        // Point
        ctx.fillStyle = '#60a5fa';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();

        // Label
        ctx.fillStyle = '#e5e7eb';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        const labelX = centerX + (radius + 30) * Math.cos(angles[idx]);
        const labelY = centerY + (radius + 30) * Math.sin(angles[idx]);
        ctx.fillText(skill, labelX, labelY);

        // Score
        ctx.font = '11px Arial';
        ctx.fillStyle = '#a5f3fc';
        ctx.fillText(`${skills[skill].toFixed(0)}%`, labelX, labelY + 15);
      });

      if (animationProgress < 1) {
        requestAnimationFrame(drawRadar);
      }
    };

    drawRadar();

    // Add stats below
    const statsDiv = document.createElement('div');
    statsDiv.style.cssText = `
      margin-top: 30px;
      padding: 20px;
      background: rgba(59, 130, 246, 0.1);
      border-radius: 8px;
      border-left: 4px solid #60a5fa;
    `;
    statsDiv.innerHTML = `
      <p style="margin: 0;"><strong>Skill Insights:</strong></p>
      <p style="margin: 8px 0 0 0; font-size: 13px; color: #d1d5db;">
        Your radar shows a balanced skill profile. Focus on areas with lower scores through targeted practice and exercises.
      </p>
    `;
    container.appendChild(statsDiv);
  }

  /**
   * Profile Information Display
   */
  async renderProfileDisplay(userData, container) {
    // Reserved for future profile visualizations
    container.innerHTML = '';
    const msg = document.createElement('div');
    msg.textContent = 'Profile information displayed in the Profile Info section.';
    msg.style.cssText = 'color: #94a3b8; padding: 20px; text-align: center;';
    container.appendChild(msg);
  }

  /**
   * Show Performance Info - DEPRECATED: Use renderPerformanceAnalytics and renderGitHubMetrics
   */
  async showPerformanceInfo() {
    // This function is no longer needed - performance info is shown in the dashboard tabs
    console.log('showPerformanceInfo() is deprecated. Use renderPerformanceAnalytics instead.');
    return;
    
    const s = userData.analyticsSummary || {};
    const gh = userData.github || {};

    const gameContainer = document.createElement('div');
    gameContainer.style.cssText = `
      padding: 20px;
    `;

    // Game 1: Guess Your Stats
    const game1 = document.createElement('div');
    game1.style.cssText = `
      background: rgba(59, 130, 246, 0.1);
      border: 2px solid #3b82f6;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
    `;

    game1.innerHTML = `
      <h3 style="color: #60a5fa; margin: 0 0 15px 0;">Game 1: Guess Your Engagement</h3>
      <p style="margin: 0 0 15px 0; color: #d1d5db;">How much do you think your engagement score is? (0-100%)</p>
    `;

    const guessContainer = document.createElement('div');
    guessContainer.style.cssText = 'display: flex; gap: 10px; align-items: center;';

    const guessInput = document.createElement('input');
    guessInput.type = 'range';
    guessInput.min = '0';
    guessInput.max = '100';
    guessInput.value = '50';
    guessInput.style.cssText = 'flex: 1; cursor: pointer;';

    const guessDisplay = document.createElement('span');
    guessDisplay.textContent = '50%';
    guessDisplay.style.cssText = 'color: #60a5fa; font-weight: bold; min-width: 50px;';

    const guessBtn = document.createElement('button');
    guessBtn.textContent = 'Reveal';
    guessBtn.style.cssText = `
      padding: 10px 20px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    `;

    guessInput.oninput = () => {
      guessDisplay.textContent = guessInput.value + '%';
    };

    guessBtn.onclick = () => {
      const actualScore = (s.interactionPercentage || 0).toFixed(1);
      const guess = parseInt(guessInput.value);
      const diff = Math.abs(guess - actualScore);
      
      let resultMsg = '';
      if (diff < 5) resultMsg = 'Perfect! You know yourself well!';
      else if (diff < 15) resultMsg = 'Close! Great self-awareness!';
      else resultMsg = `Actual: ${actualScore}% - ${guess > actualScore ? 'You were too optimistic!' : 'You undersold yourself!'}`;

      guessBtn.textContent = resultMsg;
      guessBtn.style.background = '#10b981';
      guessBtn.disabled = true;
    };

    guessContainer.appendChild(guessInput);
    guessContainer.appendChild(guessDisplay);
    guessContainer.appendChild(guessBtn);
    game1.appendChild(guessContainer);
    gameContainer.appendChild(game1);

    // Game 2: Skill Calibration
    const game2 = document.createElement('div');
    game2.style.cssText = `
      background: rgba(139, 92, 246, 0.1);
      border: 2px solid #8b5cf6;
      border-radius: 12px;
      padding: 20px;
    `;

    game2.innerHTML = `
      <h3 style="color: #d8b4fe; margin: 0 0 15px 0;">Game 2: Skill Calibration</h3>
      <p style="margin: 0 0 15px 0; color: #d1d5db;">Rate your Problem-Solving skill (1-5)</p>
    `;

    const calibContainer = document.createElement('div');
    calibContainer.style.cssText = 'display: flex; gap: 10px;';

    [1, 2, 3, 4, 5].forEach(num => {
      const btn = document.createElement('button');
      btn.textContent = num;
      btn.style.cssText = `
        flex: 1;
        padding: 15px;
        background: #374151;
        color: #e5e7eb;
        border: 2px solid #4b5563;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
        font-size: 18px;
        transition: all 0.2s;
      `;

      btn.onmouseover = () => {
        btn.style.background = '#8b5cf6';
        btn.style.borderColor = '#d8b4fe';
      };

      btn.ontouched = btn.onmouseout = () => {
        if (!btn.dataset.selected) {
          btn.style.background = '#374151';
          btn.style.borderColor = '#4b5563';
        }
      };

      btn.onclick = () => {
        calibContainer.querySelectorAll('button').forEach(b => {
          b.dataset.selected = '';
          b.style.background = '#374151';
          b.style.borderColor = '#4b5563';
        });
        btn.dataset.selected = 'true';
        btn.style.background = '#8b5cf6';
        btn.style.borderColor = '#d8b4fe';

        const systemScore = (s.averageAccuracyPercentage || 0) / 20; // Convert 0-100 to 1-5
        const feedbackDiv = document.querySelector('#calib-feedback');
        if (feedbackDiv) {
          const diff = Math.abs(num - systemScore);
          if (diff < 1) {
            feedbackDiv.innerHTML = `✅ Excellent calibration! Your assessment matches your metrics.`;
          } else if (num > systemScore) {
            feedbackDiv.innerHTML = `💪 Confident! Consider taking on more challenging problems to build those skills.`;
          } else {
            feedbackDiv.innerHTML = `Humble! You may be stronger than you think. Keep building confidence!`;
          }
        }
      };

      calibContainer.appendChild(btn);
    });

    game2.appendChild(calibContainer);
    const feedbackDiv = document.createElement('div');
    feedbackDiv.id = 'calib-feedback';
    feedbackDiv.style.cssText = 'color: #a5f3fc; margin-top: 15px; text-align: center; font-size: 13px;';
    game2.appendChild(feedbackDiv);

    gameContainer.appendChild(game2);
    container.appendChild(gameContainer);
  }

  /**
   * Render Momentum Meter - Growth visualization - DEPRECATED
   */
  async renderMomentumMeter(userData, container) {
    const s = userData.analyticsSummary || {};

    // Growth visualization using real data
    const engagementTrend = (s.interactionPercentage || 0);
    const accuracyTrend = (s.averageAccuracyPercentage || 0);
    const progressTrend = Math.min(100, (s.totalTimeSpentMinutes || 0) / 3);

    const meterContainer = document.createElement('div');
    meterContainer.style.cssText = `
      padding: 20px;
    `;

    const metrics = [
      { label: 'Engagement Momentum', value: engagementTrend, color: '#10b981' },
      { label: 'Accuracy Momentum', value: accuracyTrend, color: '#f59e0b' },
      { label: 'Progress Momentum', value: Math.min(100, progressTrend), color: '#3b82f6' },
    ];

    metrics.forEach((metric, idx) => {
      const meterDiv = document.createElement('div');
      meterDiv.style.cssText = 'margin-bottom: 30px;';

      const label = document.createElement('div');
      label.style.cssText = 'margin-bottom: 10px;';
      label.innerHTML = `
        <span style="color: #e5e7eb; font-weight: bold;">${metric.icon} ${metric.label}</span>
        <span style="float: right; color: ${metric.color}; font-weight: bold;">↗ ${metric.value.toFixed(1)}%</span>
      `;

      const barContainer = document.createElement('div');
      barContainer.style.cssText = `
        background: #374151;
        border-radius: 10px;
        height: 25px;
        overflow: hidden;
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
      `;

      const bar = document.createElement('div');
      bar.style.cssText = `
        background: linear-gradient(90deg, ${metric.color}80, ${metric.color});
        height: 100%;
        width: 0%;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
        transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 0.2}s;
      `;

      barContainer.appendChild(bar);

      meterDiv.appendChild(label);
      meterDiv.appendChild(barContainer);
      meterContainer.appendChild(meterDiv);

      // Animate on render
      setTimeout(() => {
        bar.style.width = metric.value + '%';
        if (metric.value > 0) {
          bar.textContent = metric.value.toFixed(0) + '%';
        }
      }, 100);
    });

    // Add projection
    const projectionDiv = document.createElement('div');
    projectionDiv.style.cssText = `
      background: rgba(96, 165, 250, 0.1);
      border: 2px solid #60a5fa;
      border-radius: 12px;
      padding: 20px;
      margin-top: 30px;
    `;

    const avgMomentum = (engagementTrend + accuracyTrend + progressTrend) / 3;
    let projection = '🌟 Stellar Growth!';
    if (avgMomentum < 30) projection = 'Building Momentum - Keep Going!';
    else if (avgMomentum < 60) projection = '⚡ Good Pace - You\'re on Track!';
    else if (avgMomentum < 85) projection = 'Excellent Trajectory!';

    projectionDiv.innerHTML = `
      <p style="margin: 0; color: #d1d5db;"><strong>Overall Momentum Score: ${avgMomentum.toFixed(1)}/100</strong></p>
      <p style="margin: 10px 0 0 0; color: #a5f3fc;">${projection}</p>
      <p style="margin: 10px 0 0 0; font-size: 12px; color: #9ca3af;">
        If you maintain this pace, you'll reach mastery in ~${Math.ceil(100 / Math.max(avgMomentum, 1))} sprints.
      </p>
    `;

    meterContainer.appendChild(projectionDiv);
    container.appendChild(meterContainer);
  }

  /**
   * Show profile information
   */
  async showProfileInfo() {
    const userData = await this.fetchUserData();
    
    if (!userData) {
      await this.showDialogue('Profile Guide', [
        'Unable to load your profile.',
        'Please ensure you are logged in.',
      ]);
      return;
    }

    const summary = userData.analyticsSummary || {};
    
    const messages = [
      '👤 Your Profile & Learning Summary:',
      '',
      `Name: ${userData.name || 'Not set'}`,
      `Email: ${userData.email || 'Not set'}`,
      `UID: ${userData.uid || 'Not set'}`,
      `GitHub ID: ${userData.githubID || 'Not set'}`,
      '',
      'Overall Learning Metrics:',
      `Engagement Score: ${summary.engagementScore || 0}%`,
      `Total Sessions: ${summary.totalSessions || 0}`,
      `Avg Session Length: ${this.formatTime(summary.avgSessionDuration || 0)}`,
      `Lessons Completed: ${summary.lessonsCompleted || 0}`,
      `Quests Completed: ${summary.questsCompleted || 0}`,
      '',
      'Your dedication shows growth! Keep going!',
    ];

    await this.showDialogue('Profile Guide', messages);
  }

  /**
   * Show GitHub contribution statistics with gamified display
   */
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
      
      // Create modal for GitHub stats with gamification
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
      `;

      const container = document.createElement('div');
      container.style.cssText = `
        background: #1a1a1a;
        border: 2px solid #06b6d4;
        border-radius: 12px;
        padding: 40px;
        max-width: 450px;
        color: #e5e7eb;
      `;

      const title = document.createElement('h1');
      title.textContent = 'Your GitHub Journey';
      title.style.cssText = 'color: #06b6d4; margin: 0 0 30px 0; text-align: center; font-size: 28px;';
      container.appendChild(title);

      // Stat cards with animations
      const stats = [
        { icon: '📝', label: 'Commits', value: gh.commits || 0, color: '#10b981' },
        { icon: '🔀', label: 'Pull Requests', value: gh.prs || 0, color: '#f59e0b' },
        { label: 'Issues', value: gh.issues || 0, color: '#ef4444' },
        { label: 'Total Edits', value: totalEdits, color: '#06b6d4' },
      ];

      const statsGrid = document.createElement('div');
      statsGrid.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;';

      stats.forEach((stat, idx) => {
        const card = document.createElement('div');
        card.style.cssText = `
          background: ${stat.color}15;
          border: 2px solid ${stat.color};
          border-radius: 8px;
          padding: 15px;
          text-align: center;
          animation: scaleIn 0.5s ease-out ${idx * 0.1}s backwards;
        `;

        card.innerHTML = `
          <div style="font-size: 24px; margin-bottom: 5px;">${stat.icon}</div>
          <div style="font-size: 24px; font-weight: bold; color: ${stat.color};">${stat.value}</div>
          <div style="font-size: 12px; color: #9ca3af; margin-top: 5px;">${stat.label}</div>
        `;

        statsGrid.appendChild(card);
      });

      container.appendChild(statsGrid);

      // Code insight
      const codeInsight = document.createElement('div');
      codeInsight.style.cssText = `
        background: rgba(96, 165, 250, 0.1);
        border: 2px solid #60a5fa;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 20px;
      `;

      const lineRatio = gh.linesAdded > 0 ? (gh.linesDeleted / (gh.linesAdded + gh.linesDeleted) * 100).toFixed(0) : 0;
      const insight = gh.commits > 50 ? 'Heavy contributor - Amazing dedication!' : 'Keep pushing those commits!';

      codeInsight.innerHTML = `
        <p style="margin: 0 0 8px 0; color: #60a5fa;"><strong>${insight}</strong></p>
        <p style="margin: 0; font-size: 12px; color: #d1d5db;">
          Lines added vs removed ratio: ${lineRatio}% deletions - ${100 - lineRatio}% additions
        </p>
      `;

      container.appendChild(codeInsight);

      // Close button
      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'Great Work! Close';
      closeBtn.style.cssText = `
        width: 100%;
        padding: 12px;
        background: #06b6d4;
        color: #000;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
      `;
      closeBtn.onclick = () => modal.remove();
      container.appendChild(closeBtn);

      modal.appendChild(container);
      document.body.appendChild(modal);

      // Add animation CSS
      if (!document.querySelector('style#github-animations')) {
        const style = document.createElement('style');
        style.id = 'github-animations';
        style.textContent = `
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }
        `;
        document.head.appendChild(style);
      }
    } catch (err) {
      console.error('Error showing GitHub stats:', err);
      this.showToast('Error loading GitHub stats');
    }
  }

  /**
   * Show interactive end-of-sprint self-evaluation with sliders
   */
  async showSelfEvaluation() {
    try {
      // Create evaluation modal overlay
      const modal = document.createElement('div');
      modal.id = 'self-eval-modal';
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
      `;

      const container = document.createElement('div');
      container.style.cssText = `
        background: #1a1a1a;
        border: 2px solid #3b82f6;
        border-radius: 12px;
        padding: 30px;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        color: #e5e7eb;
        font-family: Arial, sans-serif;
      `;

      // Title
      const title = document.createElement('h2');
      title.textContent = 'Sprint Self-Evaluation';
      title.style.cssText = 'margin-top: 0; color: #60a5fa; margin-bottom: 20px; font-size: 24px;';
      container.appendChild(title);

      // Instructions
      const instructions = document.createElement('p');
      instructions.textContent = 'Rate your skills on a scale of 1-5 for this sprint:';
      instructions.style.cssText = 'color: #9ca3af; margin-bottom: 20px; font-size: 14px;';
      container.appendChild(instructions);

      // Skills to evaluate
      const skills = [
        { id: 'communication', label: 'Communication & Collaboration', category: 'soft' },
        { id: 'problem_solving', label: 'Problem Solving & Creativity', category: 'soft' },
        { id: 'perseverance', label: 'Perseverance & Growth Mindset', category: 'soft' },
        { id: 'time_mgmt', label: 'Time Management & Organization', category: 'soft' },
        { id: 'code_quality', label: 'Code Quality & Best Practices', category: 'hard' },
        { id: 'debugging', label: 'Debugging & Testing', category: 'hard' },
        { id: 'algorithms', label: 'Algorithm Understanding', category: 'hard' },
        { id: 'optimization', label: 'Performance Optimization', category: 'hard' },
      ];

      const sliderValues = {};

      // Soft Skills Section
      const softTitle = document.createElement('h3');
      softTitle.textContent = 'Soft Skills';
      softTitle.style.cssText = 'color: #10b981; margin-top: 20px; margin-bottom: 15px; font-size: 16px;';
      container.appendChild(softTitle);

      // Hard Skills Section
      const hardTitle = document.createElement('h3');
      hardTitle.textContent = 'Hard Coding Skills';
      hardTitle.style.cssText = 'color: #f59e0b; margin-top: 20px; margin-bottom: 15px; font-size: 16px;';

      // Add sliders for soft skills
      let firstHardSkillIndex = -1;
      skills.forEach((skill, idx) => {
        if (skill.category === 'hard' && firstHardSkillIndex === -1) {
          firstHardSkillIndex = idx;
          container.appendChild(hardTitle);
        }

        const sliderBox = document.createElement('div');
        sliderBox.style.cssText = 'margin-bottom: 15px;';

        const label = document.createElement('label');
        label.textContent = skill.label;
        label.style.cssText = 'display: block; font-size: 13px; margin-bottom: 5px; color: #d1d5db;';
        sliderBox.appendChild(label);

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '1';
        slider.max = '5';
        slider.value = '3';
        slider.style.cssText = 'width: 100%; cursor: pointer;';
        sliderValues[skill.id] = 3;

        const valueDisplay = document.createElement('span');
        valueDisplay.textContent = '3 / 5';
        valueDisplay.style.cssText = 'float: right; color: #60a5fa; font-size: 12px; font-weight: bold;';
        label.appendChild(valueDisplay);

        slider.addEventListener('input', (e) => {
          sliderValues[skill.id] = parseInt(e.target.value);
          valueDisplay.textContent = `${e.target.value} / 5`;
        });

        sliderBox.appendChild(slider);
        container.appendChild(sliderBox);
      });

      // Buttons
      const buttonBox = document.createElement('div');
      buttonBox.style.cssText = 'margin-top: 30px; display: flex; gap: 10px; justify-content: flex-end;';

      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = 'Cancel';
      cancelBtn.style.cssText = `
        padding: 10px 20px;
        background: #4b5563;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
      `;
      cancelBtn.onclick = () => modal.remove();

      const submitBtn = document.createElement('button');
      submitBtn.textContent = 'Submit & Predict Grade';
      submitBtn.style.cssText = `
        padding: 10px 20px;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
      `;
      submitBtn.onclick = async () => {
        await this.submitSelfEvaluation(sliderValues);
        modal.remove();
      };

      buttonBox.appendChild(cancelBtn);
      buttonBox.appendChild(submitBtn);
      container.appendChild(buttonBox);

      modal.appendChild(container);
      document.body.appendChild(modal);
    } catch (err) {
      console.error('Error showing self-evaluation:', err);
      this.showToast('Error loading self-evaluation');
    }
  }

  /**
   * Submit self-evaluation and show grade prediction
   */
  async submitSelfEvaluation(sliderValues) {
    try {
      // Calculate weighted score
      const softSkills = ['communication', 'problem_solving', 'perseverance', 'time_mgmt'];
      const hardSkills = ['code_quality', 'debugging', 'algorithms', 'optimization'];

      const softAvg = softSkills.reduce((sum, id) => sum + (sliderValues[id] || 0), 0) / softSkills.length;
      const hardAvg = hardSkills.reduce((sum, id) => sum + (sliderValues[id] || 0), 0) / hardSkills.length;

      // Weighted: 40% soft skills, 60% hard skills
      const overallScore = (softAvg * 0.4 + hardAvg * 0.6);

      // Convert to grade
      let grade, gradeColor;
      if (overallScore >= 4.5) {
        grade = 'A (Excellent)';
        gradeColor = '#10b981';
      } else if (overallScore >= 4.0) {
        grade = 'A- (Very Good)';
        gradeColor = '#10b981';
      } else if (overallScore >= 3.5) {
        grade = 'B+ (Good)';
        gradeColor = '#60a5fa';
      } else if (overallScore >= 3.0) {
        grade = 'B (Satisfactory)';
        gradeColor = '#60a5fa';
      } else if (overallScore >= 2.5) {
        grade = 'C (Needs Improvement)';
        gradeColor = '#f59e0b';
      } else {
        grade = 'F (Below Expectations)';
        gradeColor = '#ef4444';
      }

      // Show result
      const resultModal = document.createElement('div');
      resultModal.id = 'eval-result-modal';
      resultModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10001;
      `;

      const resultContainer = document.createElement('div');
      resultContainer.style.cssText = `
        background: #1a1a1a;
        border: 2px solid #3b82f6;
        border-radius: 12px;
        padding: 40px;
        max-width: 400px;
        text-align: center;
        color: #e5e7eb;
      `;

      const resultTitle = document.createElement('h2');
      resultTitle.textContent = 'Your Sprint Grade';
      resultTitle.style.cssText = 'color: #60a5fa; margin-bottom: 30px; font-size: 28px;';
      resultContainer.appendChild(resultTitle);

      const gradeDisplay = document.createElement('div');
      gradeDisplay.textContent = grade;
      gradeDisplay.style.cssText = `
        font-size: 48px;
        font-weight: bold;
        color: ${gradeColor};
        margin-bottom: 20px;
        padding: 20px;
        background: rgba(0, 0, 0, 0.4);
        border-radius: 8px;
      `;
      resultContainer.appendChild(gradeDisplay);

      const scoreText = document.createElement('p');
      scoreText.textContent = `Score: ${overallScore.toFixed(2)} / 5.0`;
      scoreText.style.cssText = 'color: #9ca3af; margin-bottom: 20px; font-size: 14px;';
      resultContainer.appendChild(scoreText);

      const breakdown = document.createElement('div');
      breakdown.style.cssText = 'text-align: left; margin: 20px 0; font-size: 13px; color: #d1d5db;';
      breakdown.innerHTML = `
        <p>Soft Skills Average: <span style="color: #10b981; font-weight: bold;">${softAvg.toFixed(2)}/5</span></p>
        <p>Hard Skills Average: <span style="color: #f59e0b; font-weight: bold;">${hardAvg.toFixed(2)}/5</span></p>
      `;
      resultContainer.appendChild(breakdown);

      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'Great! Keep improving!';
      closeBtn.style.cssText = `
        margin-top: 30px;
        padding: 12px 24px;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        width: 100%;
      `;
      closeBtn.onclick = () => {
        resultModal.remove();
      };
      resultContainer.appendChild(closeBtn);

      resultModal.appendChild(resultContainer);
      document.body.appendChild(resultModal);

      // Show toast celebration
      this.showToast('Evaluation submitted! Check your grade above.');
    } catch (err) {
      console.error('Error submitting evaluation:', err);
      this.showToast('Error saving evaluation. Please try again.');
    }
  }

  /**
   * Fetch user data from backend
   * @returns {Promise<Object|null>} User data or null if fetch fails
   */
  async fetchUserData() {
    try {
      console.log('Assessment Observatory: Starting data fetch...');
      
      // Fetch user identity from Flask
      const userResponse = await fetch(`${pythonURI}/api/id`, fetchOptions);
      
      if (!userResponse.ok) {
        console.error('Assessment Observatory: User info fetch failed:', userResponse.status);
        return null;
      }

      const userData = await userResponse.json();
      console.log('Assessment Observatory: User info fetched, uid:', userData.uid);
      
      // Fetch all analytics in parallel
      const [analyticsRes, commitsRes, prsRes, issuesRes] = await Promise.all([
        fetch(`${javaURI}/api/ocs-analytics/user/summary`, fetchOptions).catch(e => {
          console.error('Analytics: OCS fetch threw error:', e);
          return { ok: false };
        }),
        fetch(`${pythonURI}/api/analytics/github/user/commits`, fetchOptions).catch(e => {
          console.error('Assessment Observatory: GitHub commits fetch threw error:', e);
          return { ok: false };
        }),
        fetch(`${pythonURI}/api/analytics/github/user/prs`, fetchOptions).catch(e => {
          console.error('Assessment Observatory: GitHub prs fetch threw error:', e);
          return { ok: false };
        }),
        fetch(`${pythonURI}/api/analytics/github/user/issues`, fetchOptions).catch(e => {
          console.error('Assessment Observatory: GitHub issues fetch threw error:', e);
          return { ok: false };
        })
      ]);

      // Process OCS Analytics
      if (analyticsRes.ok) {
        try {
          const analyticsSummary = await analyticsRes.json();
          console.log('Assessment Observatory: OCS summary received:', analyticsSummary);
          userData.analyticsSummary = analyticsSummary;
        } catch (err) {
          console.error('Assessment Observatory: Failed to parse OCS response:', err);
        }
      } else {
        console.warn('Assessment Observatory: OCS response not ok, status:', analyticsRes.status);
      }

      // Process GitHub Commits
      if (commitsRes.ok) {
        try {
          const commitsData = await commitsRes.json();
          console.log('Assessment Observatory: GitHub commits received:', commitsData);
          userData.github = userData.github || {};
          userData.github.commits = commitsData.total_commit_contributions || 0;
          userData.github.linesAdded = commitsData.total_lines_added || 0;
          userData.github.linesDeleted = commitsData.total_lines_deleted || 0;
        } catch (err) {
          console.error('Assessment Observatory: Failed to parse commits response:', err);
        }
      } else {
        console.warn('Assessment Observatory: Commits response not ok, status:', commitsRes.status);
      }

      // Process GitHub PRs
      if (prsRes.ok) {
        try {
          const prsData = await prsRes.json();
          console.log('Assessment Observatory: GitHub PRs received:', prsData);
          userData.github = userData.github || {};
          userData.github.prs = (prsData.pull_requests || []).length;
        } catch (err) {
          console.error('Assessment Observatory: Failed to parse PRs response:', err);
        }
      } else {
        console.warn('Assessment Observatory: PRs response not ok, status:', prsRes.status);
      }

      // Process GitHub Issues
      if (issuesRes.ok) {
        try {
          const issuesData = await issuesRes.json();
          console.log('Assessment Observatory: GitHub issues received:', issuesData);
          userData.github = userData.github || {};
          userData.github.issues = (issuesData.issues || []).length;
        } catch (err) {
          console.error('Assessment Observatory: Failed to parse issues response:', err);
        }
      } else {
        console.warn('Assessment Observatory: Issues response not ok, status:', issuesRes.status);
      }

      console.log('Assessment Observatory: All data fetched, final object:', userData);
      return userData;
    } catch (err) {
      console.error('Assessment Observatory: Fatal error in fetchUserData:', err);
      return null;
    }
  }

  /**
   * Format time in milliseconds to human-readable format
   */
  formatTime(milliseconds) {
    if (!milliseconds || milliseconds <= 0) return '0h 0m';
    
    const totalMinutes = Math.floor(milliseconds / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours === 0) return `${minutes}m`;
    return `${hours}h ${minutes}m`;
  }

  /**
   * Format date to human-readable format
   */
  formatDate(dateString) {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateString;
    }
  }

  destroy() {
    super.destroy();
  }
}

export default GameLevelCsPath3Analytics;
