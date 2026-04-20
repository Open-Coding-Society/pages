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

    // Self-Evaluation NPC - end-of-sprint reflection
    const npc_data_selfEval = createGatekeeperData({
      id: 'SelfEvaluator',
      greeting: 'Welcome to the end-of-sprint reflection station! Here you can evaluate your progress, assess your skills, and reflect on your learning. Press E to begin your self-evaluation.',
      position: selfEvalPos,
      reaction: function() {
        if (level?.showToast) {
          level.showToast('Self-Evaluator: Press E to reflect on your sprint');
        }
      },
      interact: async function() {
        await level.showSelfEvaluation();
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

  }

  /**
   * Show complete analytics dashboard with dialogue + accumulating toasts
   */
  async showAnalyticsDashboard() {
    try {
      // Wait for preloaded data
      await this.dataLoaded;
      
      // Use cached data if available
      const userData = this.cachedUserData || await this.fetchUserData();
      
      if (!userData || !userData.analyticsSummary) {
        this.showToast('Unable to load your analytics. Please ensure you are logged in.');
        return;
      }

      const s = userData.analyticsSummary;
      
      // Build dialogue lines
      const stats = [
        `Analytics for ${userData.name || 'Student'}`,
        `Email: ${userData.email || 'Not set'}`,
        `UID: ${userData.uid || 'Not set'}`,
        '',
        'Time & Engagement:',
        `Total Time Spent: ${s.totalTimeSpentSeconds ? this.formatTime(s.totalTimeSpentSeconds * 1000) : '0h'}`,
        `Avg Session: ${s.averageSessionDurationSeconds ? this.formatTime(s.averageSessionDurationSeconds * 1000) : '0m'}`,
        `Code Executions: ${s.totalCodeExecutions || 0}`,
        `Engagement: ${((s.interactionPercentage || 0).toFixed(1))}%`,
        `Accuracy: ${((s.averageAccuracyPercentage || 0).toFixed(1))}%`,
        '',
        'Learning Progress:',
        `Lessons Viewed: ${s.totalLessonsViewed || 0}`,
        `Lessons Completed: ${s.totalLessonsCompleted || 0}`,
        `Scroll Depth: ${((s.averageScrollDepth || 0).toFixed(0))}%`,
        `Copy/Paste: ${s.totalCopyPasteAttempts || 0}`,
        '',
        'Keep pushing forward! You are making progress!',
      ];

      // Show dialogue while toasts accumulate
      this.showDialogue('Analytics Guide', stats);
      
      // Simultaneously show toasts
      for (const stat of stats) {
        this.showToast(stat);
        await new Promise(resolve => setTimeout(resolve, 400));
      }
    } catch (err) {
      console.error('Error showing analytics:', err);
      this.showToast('Error loading analytics');
    }
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
   * Show GitHub contribution statistics with dialogue + accumulating toasts
   */
  async showGitHubStats() {
    try {
      // Wait for preloaded data
      await this.dataLoaded;
      
      // Use cached data if available
      const userData = this.cachedUserData || await this.fetchUserData();
      
      if (!userData || !userData.github) {
        this.showToast('No GitHub data available. Connect your GitHub account in the Dashboard.');
        return;
      }

      const gh = userData.github;
      const totalEdits = (gh.linesAdded || 0) + (gh.linesDeleted || 0);
      
      // Build dialogue lines
      const stats = [
        'Your GitHub Contributions:',
        '',
        `Total Commits: ${gh.commits || 0}`,
        `Pull Requests: ${gh.prs || 0}`,
        `Issues Reported: ${gh.issues || 0}`,
        '',
        `Lines Added: +${gh.linesAdded || 0}`,
        `Lines Deleted: -${gh.linesDeleted || 0}`,
        `Total Edits: ${totalEdits}`,
        '',
        'Your code shows dedication and growth!',
      ];

      // Show dialogue while toasts accumulate
      this.showDialogue('GitHub Guide', stats);
      
      // Simultaneously show toasts
      for (const stat of stats) {
        this.showToast(stat);
        await new Promise(resolve => setTimeout(resolve, 400));
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

  destroy() {
    super.destroy();
  }
}

export default GameLevelCsPath3Analytics;
