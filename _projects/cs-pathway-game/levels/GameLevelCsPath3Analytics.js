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

    // Preload user analytics data as soon as the level initializes
    this.cachedUserData = null;
    this.dataLoaded = Promise.resolve().then(() => this.fetchUserData()).then((data) => {
      this.cachedUserData = data;
      console.log('Analytics Observatory: Data preloaded', data);
      return data;
    }).catch((err) => {
      console.error('Analytics Observatory: Failed to preload data', err);
    });

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
    // Wait for preloaded data
    await this.dataLoaded;
    
    // Use cached data if available
    const userData = this.cachedUserData || await this.fetchUserData();
    
    if (!userData || !userData.analyticsSummary) {
      await this.showDialogue('Analytics Guide', [
        'Unable to load your analytics.',
        'Please ensure you are logged in.',
      ]);
      return;
    }

    const s = userData.analyticsSummary;
    
    const timeSpent = s.totalTimeSpentSeconds ? this.formatTime(s.totalTimeSpentSeconds * 1000) : '0h';
    const codeRuns = s.totalCodeExecutions || 0;
    const lessonsViewed = s.totalLessonsViewed || 0;
    const lessonsCompleted = s.totalLessonsCompleted || 0;
    const engagement = ((s.interactionPercentage || 0).toFixed(1)) + '%';
    const scrollDepth = ((s.averageScrollDepth || 0).toFixed(0)) + '%';
    const avgSessionDuration = s.averageSessionDurationSeconds ? this.formatTime(s.averageSessionDurationSeconds * 1000) : '0m';
    const accuracy = ((s.averageAccuracyPercentage || 0).toFixed(1)) + '%';
    const copyPaste = s.totalCopyPasteAttempts || 0;
    
    const messages = [
      'Your Learning Analytics:',
      '',
      `Name: ${userData.name || 'Not set'}`,
      `Email: ${userData.email || 'Not set'}`,
      `UID: ${userData.uid || 'Not set'}`,
      '',
      'Time & Engagement:',
      `Total Time Spent: ${timeSpent}`,
      `Avg Session Duration: ${avgSessionDuration}`,
      `Code Executions: ${codeRuns}`,
      `Engagement Rate: ${engagement}`,
      `Accuracy: ${accuracy}`,
      '',
      'Learning Progress:',
      `Lessons Viewed: ${lessonsViewed}`,
      `Lessons Completed: ${lessonsCompleted}`,
      `Scroll Depth: ${scrollDepth}`,
      `Copy/Paste Attempts: ${copyPaste}`,
      '',
      'You are making excellent progress!',
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
    // Wait for preloaded data
    await this.dataLoaded;
    
    // Use cached data if available
    const userData = this.cachedUserData || await this.fetchUserData();
    
    if (!userData || !userData.github) {
      await this.showDialogue('GitHub Guide', [
        'No GitHub data available.',
        'Connect your GitHub account in the Dashboard.',
      ]);
      return;
    }

    const gh = userData.github;
    const totalEdits = (gh.linesAdded || 0) + (gh.linesDeleted || 0);
    
    const messages = [
      'Your GitHub Contribution Stats:',
      '',
      `Total Commits: ${gh.commits || 0}`,
      `Pull Requests: ${gh.prs || 0}`,
      `Issues Reported: ${gh.issues || 0}`,
      '',
      `Lines Added: +${gh.linesAdded || 0}`,
      `Lines Deleted: -${gh.linesDeleted || 0}`,
      `Total Edits: ${totalEdits}`,
      '',
      'Your code contributions show dedication!',
      'Keep coding and collaborating!',
    ];

    await this.showDialogue('GitHub Guide', messages);
  }

  /**
   * Fetch user data from backend
   * @returns {Promise<Object|null>} User data or null if fetch fails
   */
  async fetchUserData() {
    try {
      console.log('Analytics: Starting data fetch...');
      
      // Fetch user identity from Flask
      const userResponse = await fetch(`${pythonURI}/api/id`, fetchOptions);
      
      if (!userResponse.ok) {
        console.error('Analytics: User info fetch failed:', userResponse.status);
        return null;
      }

      const userData = await userResponse.json();
      console.log('Analytics: User info fetched, uid:', userData.uid);
      
      // Fetch all analytics in parallel
      const [analyticsRes, commitsRes, prsRes, issuesRes] = await Promise.all([
        fetch(`${javaURI}/api/ocs-analytics/user/summary`, fetchOptions).catch(e => {
          console.error('Analytics: OCS fetch threw error:', e);
          return { ok: false };
        }),
        fetch(`${pythonURI}/api/analytics/github/user/commits`, fetchOptions).catch(e => {
          console.error('Analytics: GitHub commits fetch threw error:', e);
          return { ok: false };
        }),
        fetch(`${pythonURI}/api/analytics/github/user/prs`, fetchOptions).catch(e => {
          console.error('Analytics: GitHub prs fetch threw error:', e);
          return { ok: false };
        }),
        fetch(`${pythonURI}/api/analytics/github/user/issues`, fetchOptions).catch(e => {
          console.error('Analytics: GitHub issues fetch threw error:', e);
          return { ok: false };
        })
      ]);

      // Process OCS Analytics
      if (analyticsRes.ok) {
        try {
          const analyticsSummary = await analyticsRes.json();
          console.log('Analytics: OCS summary received:', analyticsSummary);
          userData.analyticsSummary = analyticsSummary;
        } catch (err) {
          console.error('Analytics: Failed to parse OCS response:', err);
        }
      } else {
        console.warn('Analytics: OCS response not ok, status:', analyticsRes.status);
      }

      // Process GitHub Commits
      if (commitsRes.ok) {
        try {
          const commitsData = await commitsRes.json();
          console.log('Analytics: GitHub commits received:', commitsData);
          userData.github = userData.github || {};
          userData.github.commits = commitsData.total_commit_contributions || 0;
          userData.github.linesAdded = commitsData.total_lines_added || 0;
          userData.github.linesDeleted = commitsData.total_lines_deleted || 0;
        } catch (err) {
          console.error('Analytics: Failed to parse commits response:', err);
        }
      } else {
        console.warn('Analytics: Commits response not ok, status:', commitsRes.status);
      }

      // Process GitHub PRs
      if (prsRes.ok) {
        try {
          const prsData = await prsRes.json();
          console.log('Analytics: GitHub PRs received:', prsData);
          userData.github = userData.github || {};
          userData.github.prs = (prsData.pull_requests || []).length;
        } catch (err) {
          console.error('Analytics: Failed to parse PRs response:', err);
        }
      } else {
        console.warn('Analytics: PRs response not ok, status:', prsRes.status);
      }

      // Process GitHub Issues
      if (issuesRes.ok) {
        try {
          const issuesData = await issuesRes.json();
          console.log('Analytics: GitHub issues received:', issuesData);
          userData.github = userData.github || {};
          userData.github.issues = (issuesData.issues || []).length;
        } catch (err) {
          console.error('Analytics: Failed to parse issues response:', err);
        }
      } else {
        console.warn('Analytics: Issues response not ok, status:', issuesRes.status);
      }

      console.log('Analytics: All data fetched, final object:', userData);
      return userData;
    } catch (err) {
      console.error('Analytics: Fatal error in fetchUserData:', err);
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
