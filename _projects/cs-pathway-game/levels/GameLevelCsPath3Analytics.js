// Imports: Level objects and UI helpers.
import GamEnvBackground from '/assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '/assets/js/GameEnginev1.1/essentials/Npc.js';
import DialogueSystem from '/assets/js/GameEnginev1.1/essentials/DialogueSystem.js';
import GameLevelCsPathIdentity from './GameLevelCsPathIdentity.js';
import { pythonURI, javaURI, fetchOptions } from '/assets/js/api/config.js';

/**
 * GameLevel CS Pathway - Analytics Observatory
 * 
 * This level introduces students to their personal analytics and learning metrics.
 * An Analytics Guide NPC provides insights into:
 * - User profile (email, uid, name)
 * - GitHub contribution stats (commits, PRs, issues)
 * - Skill metrics and progress
 * - Grade predictions
 * - Learning journey overview
 */
class GameLevelCsPath3Analytics extends GameLevelCsPathIdentity {
  static levelId = 'analytics-observatory';
  static displayName = 'Analytics Observatory';

  constructor(gameEnv) {
    super(gameEnv, {
      levelDisplayName: GameLevelCsPath3Analytics.displayName,
      logPrefix: 'Analytics Observatory',
    });

    let { width, height, path } = this.getLevelDimensions();

    /**
     * Section: Level objects.
     */

    // ── Background ──────────────────────────────────────────────
    const image_src = path + "/images/projects/cs-pathway-game/bg3/analytics-observatory-fantasy.png";
    const bg_data = {
        name: GameLevelCsPath3Analytics.displayName,
        greeting: "Welcome to the Analytics Observatory! Here you can explore your learning journey, track your progress, and discover insights from your contributions and achievements.",
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
      greeting: "Welcome to the Analytics Observatory! Let's explore your learning journey.",
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
    // Position NPCs on opposite sides of screen, centered vertically
    const analyticsGuidePos = {
      x: width * 0.30,
      y: height * 0.35,
    };

    const githubMetricsPos = {
      x: width * 0.60,
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

    // GitHub Metrics NPC - shows contribution statistics
    const npc_data_githubGuide = createGatekeeperData({
      id: 'GitHubGuide',
      greeting: 'Explore your GitHub contribution metrics: commits, pull requests, issues, and code changes.',
      position: githubMetricsPos,
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
    ];

    // FriendlyNpc expects these level references for toast routing
    this.gameEnv.currentLevel = this;
    this.gameEnv.gameLevel = this;

    // Dialogue: Sequential helper.
    this.levelDialogueSystem = new DialogueSystem({
      id: 'analytics-observatory-dialogue',
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

    // Toast: Show status message.
    this.showToast = function(message) {
      if (message === 'Press E to interact') {
        return;
      }

      const host = document.body;
      if (!host) return;

      if (this._toastEl?.parentNode) {
        this._toastEl.parentNode.removeChild(this._toastEl);
      }
      if (this._toastTimer) {
        clearTimeout(this._toastTimer);
      }

      const toast = document.createElement('div');
      toast.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        z-index: 1200; pointer-events: none;
        background: rgba(13,13,26,0.95); border: 2px solid #4ecca3;
        color: #4ecca3; font-family: 'Courier New', monospace; font-size: 13px;
        padding: 10px 16px; border-radius: 8px; letter-spacing: 0.6px;
        box-shadow: 0 0 20px rgba(78,204,163,0.25);
        width: min(360px, 32vw); text-align: left;
      `;
      toast.textContent = message;
      host.appendChild(toast);

      this._toastEl = toast;
      this._toastTimer = setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
        if (this._toastEl === toast) this._toastEl = null;
        this._toastTimer = null;
      }, 2200);
    }.bind(this);
  }

  /**
   * Show complete analytics dashboard
   */
  async showAnalyticsDashboard() {
    const userData = await this.fetchUserData();
    
    if (!userData) {
      await this.showDialogue('Analytics Guide', [
        'Unable to load your analytics.',
        'Please ensure you are logged in.',
      ]);
      return;
    }

    const summary = userData.analyticsSummary || {};
    
    const messages = [
      'Your Learning Analytics:',
      '',
      `Name: ${userData.name || 'Not set'}`,
      `Email: ${userData.email || 'Not set'}`,
      `UID: ${userData.uid || 'Not set'}`,
      '',
      'Time & Engagement:',
      `Total Time Spent: ${this.formatTime(summary.totalTimeSpent || 0)}`,
      `Sessions: ${summary.totalSessions || 0}`,
      `Quests Completed: ${summary.questsCompleted || 0}`,
      `Engagement Score: ${summary.engagementScore || 0}%`,
      '',
      'Learning Progress:',
      `Lessons Completed: ${summary.lessonsCompleted || 0}`,
      `Current Quest: ${summary.currentQuestName || 'None'}`,
      `Quest Progress: ${summary.questProgress || 0}%`,
      '',
      `Last Active: ${this.formatDate(summary.lastActiveDate) || 'Never'}`,
      '',
      'Press Next to see more details!',
    ];

    await this.showDialogue('Analytics Guide', messages);
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
   * Show GitHub contribution statistics
   */
  async showGitHubStats() {
    const userData = await this.fetchUserData();
    
    if (!userData || !userData.github) {
      await this.showDialogue('GitHub Guide', [
        'No GitHub data available.',
        'Connect your GitHub account in the Dashboard.',
      ]);
      return;
    }

    const gh = userData.github;
    const messages = [
      'Your GitHub Contribution Stats:',
      '',
      `Total Commits: ${gh.commits || 0}`,
      `Pull Requests: ${gh.prs || 0}`,
      `Issues: ${gh.issues || 0}`,
      `Code Reviews: ${gh.codeReviews || 0}`,
      `Repositories: ${gh.repos || 0}`,
      `Gists: ${gh.gists || 0}`,
      '',
      `Lines Added: ${gh.additions || 0}`,
      `Lines Deleted: ${gh.deletions || 0}`,
      `Files Changed: ${gh.filesChanged || 0}`,
      '',
      `Followers: ${gh.followers || 0}`,
      `Following: ${gh.following || 0}`,
      '',
      'Your contributions matter! Keep coding!',
    ];

    await this.showDialogue('GitHub Guide', messages);
  }

  /**
   * Fetch user data from backend
   * @returns {Promise<Object|null>} User data or null if fetch fails
   */
  async fetchUserData() {
    try {
      // Fetch user identity from Flask
      const userResponse = await fetch(`${pythonURI}/api/id`, fetchOptions);
      
      if (!userResponse.ok) {
        console.warn('Analytics: Could not fetch user info');
        return null;
      }

      const userData = await userResponse.json();
      
      // Fetch OCS analytics summary from Spring backend
      // This endpoint returns time spent, sessions, engagement metrics, etc.
      try {
        const analyticsResponse = await fetch(`${javaURI}/api/ocs-analytics/user/summary`, fetchOptions);
        if (analyticsResponse.ok) {
          const analyticsSummary = await analyticsResponse.json();
          userData.analyticsSummary = analyticsSummary;
        }
      } catch (err) {
        console.warn('Analytics: Could not fetch OCS analytics summary', err);
      }

      // Try to fetch GitHub analytics if available
      try {
        const githubResponse = await fetch(`${pythonURI}/api/analytics/github/user`, fetchOptions);
        if (githubResponse.ok) {
          const githubData = await githubResponse.json();
          userData.github = githubData;
        }
      } catch (err) {
        console.warn('Analytics: Could not fetch GitHub data', err);
      }

      // Try to fetch skill count from profile
      try {
        const profileResponse = await fetch(`${pythonURI}/api/profile/game`, fetchOptions);
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          userData.gameProfile = profileData;
          // Count skills from passport if available
          if (profileData.skillPassport) {
            userData.skillsCount = Object.keys(profileData.skillPassport).length;
          }
        }
      } catch (err) {
        console.warn('Analytics: Could not fetch game profile', err);
      }

      return userData;
    } catch (err) {
      console.error('Analytics: Error fetching user data', err);
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
}

export default GameLevelCsPath3Analytics;
