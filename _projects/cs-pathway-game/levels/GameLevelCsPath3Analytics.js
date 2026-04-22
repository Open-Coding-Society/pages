// Imports: Level objects and UI helpers.
import GamEnvBackground from '/assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '/assets/js/GameEnginev1.1/essentials/Npc.js';
import DialogueSystem from '/assets/js/GameEnginev1.1/essentials/DialogueSystem.js';
import GameLevelCsPathIdentity from './GameLevelCsPathIdentity.js';
import { pythonURI, javaURI, fetchOptions } from '/assets/js/api/config.js';

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
      y: height * 0.35,
    };

    const githubMetricsPos = {
      x: width * 0.50,
      y: height * 0.35,
    };

    // Self-evaluation NPC at end of pathway
    const selfEvalPos = {
      x: width * 0.80,
      y: height * 0.35,
    };

    const gatekeeperBaseData = {
      src: path + '/images/projects/cs-pathway-game/npc/gatekeeper2.png',
      SCALE_FACTOR: PLAYER_SCALE_FACTOR,
      ANIMATION_RATE: 50,
      pixels: { width: 1024, height: 1024 },
      orientation: { rows: 2, columns: 2 },
      down: { row: 0, start: 0, columns: 1, wiggle: 0.005 },
      up: { row: 0, start: 1, columns: 1 },
      left: { row: 1, start: 0, columns: 1 },
      right: { row: 1, start: 1, columns: 1 },
      hitbox: { widthPercentage: 0.4, heightPercentage: 0.4 },
    };

    const createGatekeeperData = ({ id, greeting, position, reaction, interact, interactDistance }) => ({
      ...gatekeeperBaseData,
      id,
      greeting,
      INIT_POSITION: { ...position },
      interactDistance: interactDistance || 120,
      ...(reaction ? { reaction } : {}),
      ...(interact ? { interact } : {}),
    });

    // Store reference to this level for use in callbacks
    const level = this;

    // Analytics Guide NPC - central hub for viewing analytics
    const npc_data_analyticsGuide = createGatekeeperData({
      id: 'AnalyticsGuide',
      greeting: 'Welcome to Analytics Observatory! I am your guide through your learning metrics and progress. Press E to view your complete analytics profile.',
      position: analyticsGuidePos,
      reaction: function() {
        if (level?.showToast) {
          level.showToast('Analytics Guide: Press E to view your analytics');
        }
      },
      interact: async function() {
        await level.showAnalyticsDashboard();
      },
    });

    // Self-Evaluation NPC - end-of-sprint reflection (at 50%)
    const npc_data_selfEval = createGatekeeperData({
      id: 'SelfEvaluator',
      greeting: 'Welcome to the mid-sprint assessment station! Here you can evaluate your progress, assess your skills, and reflect on your learning. Press E to begin your self-evaluation.',
      position: githubMetricsPos,
      reaction: function() {
        if (level?.showToast) {
          level.showToast('Self-Evaluator: Press E to reflect on your sprint');
        }
      },
      interact: async function() {
        await level.showSelfEvaluation();
      },
    });

    // GitHub Metrics NPC - shows contribution statistics (at 80%)
    const npc_data_githubGuide = createGatekeeperData({
      id: 'GitHubGuide',
      greeting: 'Welcome to the GitHub contributions hub! Explore your GitHub contribution metrics: commits, pull requests, issues, and code changes.',
      position: selfEvalPos,
      reaction: function() {
        if (level?.showToast) {
          level.showToast('GitHub Guide: Press E to see your GitHub stats');
        }
      },
      interact: async function() {
        await level.showGitHubStats();
      },
    });

    // List of objects definitions for this level
    this.classes = [
      { class: GamEnvBackground, data: bg_data },
      { class: Player, data: player_data },
      { class: Npc, data: npc_data_analyticsGuide },
      { class: Npc, data: npc_data_githubGuide },
      { class: Npc, data: npc_data_selfEval },
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
   * Show complete analytics dashboard with Skill Radar, Holographic Stats, and Mini-Games
   */
  async showAnalyticsDashboard() {
    try {
      await this.dataLoaded;
      const userData = this.cachedUserData || await this.fetchUserData();
      
      if (!userData || !userData.analyticsSummary) {
        this.showToast('Unable to load your analytics. Please ensure you are logged in.');
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
        background: rgba(0, 0, 0, 0.9);
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
        padding: 40px;
        max-width: 900px;
        max-height: 85vh;
        overflow-y: auto;
        color: #e5e7eb;
      `;

      // Title
      const title = document.createElement('h1');
      title.textContent = `📊 Analytics Dashboard - ${userData.name || 'Student'}`;
      title.style.cssText = 'color: #60a5fa; margin: 0 0 30px 0; text-align: center; font-size: 28px;';
      container.appendChild(title);

      // Add tabs for different views
      const tabContainer = document.createElement('div');
      tabContainer.style.cssText = `
        display: flex;
        gap: 10px;
        margin-bottom: 30px;
        border-bottom: 2px solid #3b82f6;
        padding-bottom: 15px;
      `;

      const tabs = [
        { name: 'Skills Radar', id: 'skills' },
        { name: 'Holographic Stats', id: 'holoStats' },
        { name: 'Mini-Games', id: 'miniGames' },
        { name: 'Momentum', id: 'momentum' }
      ];

      const contentArea = document.createElement('div');
      contentArea.id = 'dashboard-content';

      tabs.forEach(tab => {
        const tabBtn = document.createElement('button');
        tabBtn.textContent = tab.name;
        tabBtn.style.cssText = `
          padding: 10px 20px;
          background: ${tab.id === 'skills' ? '#3b82f6' : '#4b5563'};
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          font-weight: bold;
          transition: all 0.2s;
        `;
        
        tabBtn.onmouseover = () => {
          if (tabBtn.style.background !== '#3b82f6') {
            tabBtn.style.background = '#5a6979';
          }
        };
        tabBtn.onmouseout = () => {
          if (tabBtn.style.background !== '#3b82f6') {
            tabBtn.style.background = '#4b5563';
          }
        };

        tabBtn.onclick = async () => {
          // Update tab styling
          tabContainer.querySelectorAll('button').forEach(btn => {
            btn.style.background = '#4b5563';
          });
          tabBtn.style.background = '#3b82f6';

          // Show appropriate content
          contentArea.innerHTML = '';
          if (tab.id === 'skills') {
            await this.renderSkillsRadar(userData, contentArea);
          } else if (tab.id === 'holoStats') {
            await this.renderHolographicStats(userData, contentArea);
          } else if (tab.id === 'miniGames') {
            await this.renderMiniGames(userData, contentArea);
          } else if (tab.id === 'momentum') {
            await this.renderMomentumMeter(userData, contentArea);
          }
        };

        tabContainer.appendChild(tabBtn);
      });

      container.appendChild(tabContainer);
      container.appendChild(contentArea);

      // Close button
      const closeBtn = document.createElement('button');
      closeBtn.textContent = '✕ Close';
      closeBtn.style.cssText = `
        margin-top: 30px;
        padding: 12px 30px;
        background: #ef4444;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        width: 100%;
      `;
      closeBtn.onclick = () => modal.remove();
      container.appendChild(closeBtn);

      modal.appendChild(container);
      document.body.appendChild(modal);

      // Trigger first tab
      tabContainer.querySelector('button').click();

    } catch (err) {
      console.error('Error showing analytics dashboard:', err);
      this.showToast('Error loading analytics dashboard');
    }
  }

  /**
   * Render Skill Radar - Hexagon chart with skills
   */
  async renderSkillsRadar(userData, container) {
    const s = userData.analyticsSummary || {};
    
    // Calculate skill scores (0-100)
    const skills = {
      'Problem Solving': Math.min(100, (s.averageAccuracyPercentage || 0) * 1.1),
      'Communication': Math.min(100, (s.interactionPercentage || 0)),
      'Code Quality': Math.min(100, ((s.totalCodeExecutions || 0) / 100) * 10),
      'Testing': Math.min(100, ((s.totalLessonsCompleted || 0) / 10) * 10),
      'Time Mgmt': Math.min(100, (s.averageScrollDepth || 0)),
      'Learning': Math.min(100, ((s.totalLessonsViewed || 0) / (s.totalLessonsCompleted || 1)) * 50),
    };

    // Create SVG canvas
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 500;
    canvas.style.cssText = `
      display: block;
      margin: 20px auto;
      filter: drop-shadow(0 0 10px rgba(96, 165, 250, 0.4));
    `;
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const centerX = 250, centerY = 250, radius = 150;
    const skillNames = Object.keys(skills);
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
      <p style="margin: 0;"><strong>💡 Skill Insights:</strong></p>
      <p style="margin: 8px 0 0 0; font-size: 13px; color: #d1d5db;">
        Your radar shows a balanced skill profile. Focus on areas with lower scores through targeted practice and exercises.
      </p>
    `;
    container.appendChild(statsDiv);
  }

  /**
   * Render Holographic Stats Display - Animated stat cards
   */
  async renderHolographicStats(userData, container) {
    const s = userData.analyticsSummary || {};
    const gh = userData.github || {};

    const stats = [
      { label: '⏱️ Total Time Spent', value: s.totalTimeSpentSeconds ? this.formatTime(s.totalTimeSpentSeconds * 1000) : '0h', color: '#10b981' },
      { label: '📊 Engagement', value: `${(s.interactionPercentage || 0).toFixed(1)}%`, color: '#f59e0b' },
      { label: '🎯 Accuracy', value: `${(s.averageAccuracyPercentage || 0).toFixed(1)}%`, color: '#3b82f6' },
      { label: '📚 Lessons Completed', value: s.totalLessonsCompleted || 0, color: '#8b5cf6' },
      { label: '💻 Code Executions', value: s.totalCodeExecutions || 0, color: '#ec4899' },
      { label: '🔗 GitHub Commits', value: gh.commits || 0, color: '#06b6d4' },
    ];

    const grid = document.createElement('div');
    grid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin: 20px 0;
    `;

    stats.forEach((stat, idx) => {
      const card = document.createElement('div');
      card.style.cssText = `
        background: linear-gradient(135deg, ${stat.color}22 0%, ${stat.color}11 100%);
        border: 2px solid ${stat.color};
        border-radius: 12px;
        padding: 20px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s;
        position: relative;
        overflow: hidden;
        animation: holographicPulse 2s ease-in-out ${idx * 0.1}s infinite;
      `;

      const label = document.createElement('div');
      label.textContent = stat.label;
      label.style.cssText = `
        font-size: 12px;
        color: #9ca3af;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 10px;
      `;

      const valueDisplay = document.createElement('div');
      valueDisplay.textContent = stat.value;
      valueDisplay.style.cssText = `
        font-size: 32px;
        font-weight: bold;
        color: ${stat.color};
        text-shadow: 0 0 10px ${stat.color}60;
      `;

      card.appendChild(label);
      card.appendChild(valueDisplay);

      card.style.setProperty('--stat-color', stat.color);
      card.onmouseover = () => {
        card.style.transform = 'scale(1.05) translateY(-5px)';
        card.style.boxShadow = `0 10px 30px ${stat.color}40`;
      };
      card.onmouseout = () => {
        card.style.transform = 'scale(1)';
        card.style.boxShadow = 'none';
      };

      grid.appendChild(card);
    });

    container.appendChild(grid);

    // Add CSS animation if not exists
    if (!document.querySelector('style#holographic-animations')) {
      const style = document.createElement('style');
      style.id = 'holographic-animations';
      style.textContent = `
        @keyframes holographicPulse {
          0%, 100% { transform: translateZ(0); box-shadow: 0 0 5px ${stats[0].color}40; }
          50% { transform: translateZ(5px); box-shadow: 0 0 20px ${stats[0].color}60; }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * Render Mini-Games - Interactive stat discovery
   */
  async renderMiniGames(userData, container) {
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
      <h3 style="color: #60a5fa; margin: 0 0 15px 0;">🎮 Game 1: Guess Your Engagement</h3>
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
      if (diff < 5) resultMsg = '🎯 Perfect! You know yourself well!';
      else if (diff < 15) resultMsg = '😄 Close! Great self-awareness!';
      else resultMsg = `📊 Actual: ${actualScore}% - ${guess > actualScore ? 'You were too optimistic!' : 'You undersold yourself!'}`;

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
      <h3 style="color: #d8b4fe; margin: 0 0 15px 0;">🎯 Game 2: Skill Calibration</h3>
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
            feedbackDiv.innerHTML = `📚 Humble! You may be stronger than you think. Keep building confidence!`;
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
   * Render Momentum Meter - Growth visualization
   */
  async renderMomentumMeter(userData, container) {
    const s = userData.analyticsSummary || {};

    // Simulate growth data
    const engagementTrend = (s.interactionPercentage || 0);
    const accuracyTrend = (s.averageAccuracyPercentage || 0);
    const progressTrend = ((s.totalLessonsCompleted || 0) / (s.totalLessonsViewed || 1)) * 100;

    const meterContainer = document.createElement('div');
    meterContainer.style.cssText = `
      padding: 20px;
    `;

    const metrics = [
      { label: 'Engagement Momentum', value: engagementTrend, icon: '📈', color: '#10b981' },
      { label: 'Accuracy Momentum', value: accuracyTrend, icon: '🎯', color: '#f59e0b' },
      { label: 'Progress Momentum', value: Math.min(100, progressTrend), icon: '🚀', color: '#3b82f6' },
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
    if (avgMomentum < 30) projection = '📈 Building Momentum - Keep Going!';
    else if (avgMomentum < 60) projection = '⚡ Good Pace - You\'re on Track!';
    else if (avgMomentum < 85) projection = '🚀 Excellent Trajectory!';

    projectionDiv.innerHTML = `
      <p style="margin: 0; color: #d1d5db;"><strong>📊 Overall Momentum Score: ${avgMomentum.toFixed(1)}/100</strong></p>
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
      '📊 Overall Learning Metrics:',
      `Engagement Score: ${summary.engagementScore || 0}%`,
      `Total Sessions: ${summary.totalSessions || 0}`,
      `Avg Session Length: ${this.formatTime(summary.avgSessionDuration || 0)}`,
      `Lessons Completed: ${summary.lessonsCompleted || 0}`,
      `Quests Completed: ${summary.questsCompleted || 0}`,
      '',
      'Your dedication shows growth! Keep going! 🚀',
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
      title.textContent = '🔗 Your GitHub Journey';
      title.style.cssText = 'color: #06b6d4; margin: 0 0 30px 0; text-align: center; font-size: 28px;';
      container.appendChild(title);

      // Stat cards with animations
      const stats = [
        { icon: '📝', label: 'Commits', value: gh.commits || 0, color: '#10b981' },
        { icon: '🔀', label: 'Pull Requests', value: gh.prs || 0, color: '#f59e0b' },
        { icon: '⚠️', label: 'Issues', value: gh.issues || 0, color: '#ef4444' },
        { icon: '📊', label: 'Total Edits', value: totalEdits, color: '#06b6d4' },
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
      const insight = gh.commits > 50 ? '🔥 Heavy contributor - Amazing dedication!' : '✨ Keep pushing those commits!';

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