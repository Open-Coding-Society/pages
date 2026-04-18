// Imports: Level objects and UI helpers.
import GamEnvBackground from '/assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1.1/essentials/Player.js';
import FriendlyNpc from '/assets/js/GameEnginev1.1/essentials/FriendlyNpc.js';
import AiChallengeNpc, { CHALLENGE_ERROR_TYPES, CHALLENGE_VERDICTS } from '/assets/js/GameEnginev1.1/essentials/AiChallengeNpc.js';
import GameLevelCsPathIdentity from './GameLevelCsPathIdentity.js';

// CHALLENGE_ERROR_TYPES and CHALLENGE_VERDICTS are imported from AiChallengeNpc.

// Centralized communication prompt text used for AI question generation and grading.
const CHALLENGE_PROMPT_TEXT = {
  QUESTION_ROLE: 'You are {{deskName}} in a classroom coding game.',
  QUESTION_FOCUS: 'Generate exactly one challenge question focused on: {{expertise}}.',
  QUESTION_CONCISE: 'Use the provided desk context and keep the question concise (max 30 words).',
  QUESTION_SHORT_ANSWER: 'The challenge should require a short written answer from a student.',
  QUESTION_FORMAT: 'Do not include explanation, rubric, markdown, numbering, or extra text.',
  QUESTION_TOPIC_HEADER: 'Desk topic examples:\n{{sampleTopics}}',
  QUESTION_VARIETY_HEADER: 'Question style options:\n{{questionStyles}}',
  QUESTION_RECENT_HEADER: 'Recently used questions to avoid repeating:\n{{recentQuestions}}',
  QUESTION_ANTI_REPEAT: 'Do not repeat or closely paraphrase any recent question. Prefer a fresh angle each time.',
  QUESTION_UNIQUE_STYLE: 'Choose a different question style than the recent examples when possible.',

  EVAL_ROLE: 'You are grading a student answer for {{deskName}}.',
  EVAL_EXPERTISE: 'Desk expertise: {{expertise}}.',
  EVAL_SCOPE: 'Assess whether the student answer is correct, mostly correct, or incorrect.',
  EVAL_QUESTION: 'Challenge question: {{question}}',
  EVAL_ANSWER: 'Student answer: {{answer}}',
  EVAL_FORMAT: 'Respond in exactly two lines and nothing else:',
  EVAL_VERDICT: 'VERDICT: RIGHT or WRONG',
  EVAL_FEEDBACK: 'FEEDBACK: one short sentence with actionable feedback.',
  EVAL_RIGHT_RULE: 'Mark RIGHT for correct or mostly correct answers.',
};


const CHALLENGE_QUESTION_STYLES = [
  'Ask for a definition in the desk topic area.',
  'Ask for the best next step in a scenario.',
  'Ask the student to compare two options.',
  'Ask which tool, command, or process fits best.',
  'Ask for a debugging or troubleshooting step.',
  'Ask for a short explanation of why something works.',
  'Ask the student to order steps in the correct sequence.',
  'Ask what would happen if one part changed.',
  'Ask for a practical example from the topic.',
  'Ask the student to identify the most important concept.',
  'Ask how to avoid a common mistake in the topic.',
  'Ask for a simple decision between two approaches.',
  'Ask for a real-world use case.',
  'Ask for a short scenario response that needs a concise answer.',
  'Ask for a best-practice recommendation.',
  'Ask for a quick cause-and-effect explanation.',
];

const CHALLENGE_RECENT_HISTORY_LIMIT = 12;

/**
 * GameLevel CS Pathway - Mission Tools
 */
class GameLevelCsPath2Mission extends GameLevelCsPathIdentity {
  static levelId = 'mission-tools';
  static displayName = 'Mission Tools';

  constructor(gameEnv) {
    super(gameEnv, {
      levelDisplayName: GameLevelCsPath2Mission.displayName,
      logPrefix: 'Mission Tools',
    });
    const level = this;

    let { width, height, path } = this.getLevelDimensions();

    /**
     * Section: Level objects.
     */

    // ── Background ──────────────────────────────────────────────
    const image_src = path + "/images/projects/cs-pathway-game/bg2/mission-tools-fantasy.png";
    const bg_data = {
        name: GameLevelCsPath2Mission.displayName,
        greeting: "Welcome to the CS pathway! This quest will prepare you for your mission ahead by introducing your essential tools and resources!",
        src: image_src,
    };

    this.restoreIdentitySelections({
      bgData: bg_data,
      themeManifestUrl: `${path}/images/projects/cs-pathway-game/bg2/index.json`,
      themeAssetPrefix: `${path}/images/projects/cs-pathway-game/bg2/`,
    });

    // FriendlyNpc looks up toast via gameEnv.currentLevel/gameLevel in this engine build.
    this.gameEnv.currentLevel = this;
    this.gameEnv.gameLevel = this;
    
    // ── Player ───────────────────────────────────────────────────
    const player_src = path + "/images/projects/cs-pathway-game/player/minimalist.png";
    const PLAYER_SCALE_FACTOR = 5;
    const player_data = {
      id: 'Minimalist_Identity',
      greeting: "Hi I am a new adventurer on the CS pathway!",
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

    // Toast helper for zone prompts.
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
    };

    this.setZoneAlert = function(message) {
      const host = document.body;
      if (!host) return;

      if (!this._zoneAlertEl) {
        const zoneAlert = document.createElement('div');
        zoneAlert.style.cssText = `
          position: fixed; top: 84px; right: 20px;
          z-index: 1201; pointer-events: none;
          background: rgba(13,13,26,0.95); border: 2px solid #4ecca3;
          color: #4ecca3; font-family: 'Courier New', monospace; font-size: 13px;
          padding: 10px 16px; border-radius: 8px; letter-spacing: 0.6px;
          box-shadow: 0 0 20px rgba(78,204,163,0.25);
          width: min(360px, 32vw); text-align: left;
        `;
        document.body.appendChild(zoneAlert);
        this._zoneAlertEl = zoneAlert;
      }

      this._zoneAlertEl.textContent = message;
    };

    this.clearZoneAlert = function() {
      if (this._zoneAlertEl?.parentNode) {
        this._zoneAlertEl.parentNode.removeChild(this._zoneAlertEl);
      }
      this._zoneAlertEl = null;
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
      reaction: function () {
        if (reaction) reaction.call(this);
        if (level?.showToast) {
            level.showToast('Click desk or press E to start challenge.');
        }
      },
      ...(interact ? { interact } : {}),
    });

    const deskAiKnowledgeBase = {
      'debug-assistant': [
        { question: 'How do I isolate a bug quickly?', answer: 'Reproduce, narrow the scope, inspect state changes, then retest.' },
      ],
      'design-assistant': [
        { question: 'How can I improve the user flow?', answer: 'Remove friction points and make the next action obvious.' },
      ],
      'data-assistant': [
        { question: 'How should I store this data?', answer: 'Pick structures based on retrieval and update patterns.' },
      ],
      'planning-assistant': [
        { question: 'How do I break down a feature?', answer: 'Split into milestones with clear outcomes and tests.' },
      ],
    };

    const createHiddenMissionDesk = ({ id, expertise, position, zonePrompt }) => ({
      zoneMessage: `${id}: ${zonePrompt}`,
      ...createGatekeeperData({
        id,
        greeting: `${id} ready. ${zonePrompt}`,
        position,
        interactDistance: 40,
        interact: function (_clicks, _objectId, npc) {
          level.startDeskChallenge(this, id, npc);
        },
      }),
      visible: false,
      clickOnly: true,
      hitbox: { widthPercentage: 0.35, heightPercentage: 0.35 },
      alertDistance: 0.30,
      dialogues: [
        `${id} channel online.`,
        'Ask your mission question and I will guide you.',
      ],
      expertise,
      chatHistory: [],
      knowledgeBase: deskAiKnowledgeBase,
      zoneUnlocked: true,
    });

    const missionDeskZones = [
      createHiddenMissionDesk({
        id: 'The Admin',
        expertise: 'how to work different operating systems',
        position: { x: width * 0.20, y: height * 0.17 },
        zonePrompt: 'Move to desk and click or press E to start challenge.',
      }),
      createHiddenMissionDesk({
        id: 'The Archivist',
        expertise: 'how to manage files and folders',
        position: { x: width * 0.67, y: height * 0.17 },
        zonePrompt: 'Move to desk and click or press E to start challenge.',
      }),
      createHiddenMissionDesk({
        id: 'The SDLC Master',
        expertise: 'what SDLC is',
        position: { x: width * 0.18, y: height * 0.60 },
        zonePrompt: 'Move to desk and click or press E to start challenge.',
      }),
      createHiddenMissionDesk({
        id: 'The Scrum Master',
        expertise: 'how to set up a scrum board',
        position: { x: width * 0.62, y: height * 0.58 },
        zonePrompt: 'Move to desk and click or press E to start challenge.',
      }),
    ];

    // List of objects definitions for this level
    this.classes = [
      { class: GamEnvBackground, data: bg_data },
      { class: Player, data: player_data },
      ...missionDeskZones.map((zone) => ({ class: FriendlyNpc, data: zone })),
    ];

    this._missionDeskIds = missionDeskZones.map((zone) => zone.id);
    this._challengeLog = [];
    this._deskChallengeBusy = new Set();
    this._deskChallengeEvalBusy = new Set();
    this._activeDeskChallenges = new Map();
    this._missionQuestionHistory = new Map();
    this._missionCompletedStations = new Set();
    this._missionProgressCount = 0;
    this._missionProgressEl = null;
    this._handleMissionDeskKeyDownBound = this._handleMissionDeskKeyDown.bind(this);
  }

  // Find desk objects after engine instantiates them and apply runtime behavior patches.
  initialize() {
    const objects = this.gameEnv?.gameObjects || [];
    const desks = objects.filter((obj) => this._missionDeskIds?.includes(obj?.spriteData?.id));
    this._rebindMissingDeskReactions(desks);
    this._wireDeskClickDistanceGate(desks);
    document.addEventListener('keydown', this._handleMissionDeskKeyDownBound);
    this._syncMissionProgressBoard();

    console.log('[MissionTools] desk reactions rebound:', desks.map((d) => ({
      id: d?.spriteData?.id,
      hasReaction: typeof d?.reaction === 'function',
      hasSpriteReaction: typeof d?.spriteData?.reaction === 'function',
    })));

    this._missionDeskObjects = desks;
    this._activeZoneDeskId = null;
  }

  // Entry point when a desk is clicked in-range: generate one question and arm submission.
  async startDeskChallenge(desk, deskId, npcRef = null) {
    const npc = npcRef || desk;
    if (!npc?.spriteData?.id) return;

    const npcId = npc.spriteData.id;
    // Orchestrator: open UI, generate one question, then arm answer submission.
    await this._runBusyTask({
      busySet: this._deskChallengeBusy,
      key: npcId,
      busyMessage: `${deskId}: challenge is already loading.`,
      task: async () => {
        try {
          this.showToast?.(`${deskId}: challenge channel opened.`);
          AiChallengeNpc.showInteraction(npc);
          const challengeQuestion = await this._runWithLoading(() => this._loadDeskChallengeQuestion(npc.spriteData));
          AiChallengeNpc.deliverQuestion(npc, challengeQuestion);
          AiChallengeNpc.armSubmission(
            npc, deskId, challengeQuestion, this._activeDeskChallenges,
            (answer, active, ui) => this._submitChallengeAnswer(npc, npcId, answer, active, ui),
            this.showToast?.bind(this),
          );
          this._logChallengeEvent({
            deskId,
            expertise: npc?.spriteData?.expertise || '',
            question: challengeQuestion,
            createdAt: Date.now(),
          });
        } catch (error) {
          AiChallengeNpc.handleFailure(npc, deskId, error, this.showToast?.bind(this));
        }
      },
    });
  }

  // Delegate to shared concurrency guard in AiChallengeNpc.
  async _runBusyTask(opts) {
    return AiChallengeNpc.runBusyTask({ ...opts, showToast: this.showToast?.bind(this) });
  }

  // Wrap async work with level spinner lifecycle so loading UX stays consistent.
  async _runWithLoading(task) {
    // Keeps spinner lifecycle consistent for any async challenge operation.
    this.queueLoadingWork();
    try {
      return await task();
    } finally {
      this.finishLoadingWork();
    }
  }

  // Build and execute question-generation request, then normalize to one display line.
  async _loadDeskChallengeQuestion(spriteData) {
    let lastQuestion = '';

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const prompt = this._buildChallengePrompt(spriteData);
      const raw = await this._requestChallengeAiText(spriteData, prompt);
      const question = AiChallengeNpc.extractFirstLine(raw);
      lastQuestion = question;

      if (!this._isRepeatedMissionQuestion(spriteData, question)) {
        this._recordMissionQuestion(spriteData, question);
        return question;
      }
    }

    this._recordMissionQuestion(spriteData, lastQuestion);
    return lastQuestion;
  }

  // Build and execute answer-evaluation request, then parse verdict + feedback.
  async _loadChallengeEvaluation(spriteData, question, answer) {
    const prompt = this._buildChallengeEvaluationPrompt(spriteData, question, answer);
    const raw = await this._requestChallengeAiText(spriteData, prompt);
    return this._parseChallengeEvaluation(raw);
  }

  // AI request pipeline delegated to AiChallengeNpc.
  async _requestChallengeAiText(spriteData, prompt) {
    return AiChallengeNpc.requestAiText(spriteData, prompt, 'mission-challenge', 'Mission Tools challenge generation');
  }

  // Prompt template that forces a strict 2-line grading format for easy parsing.
  _buildChallengeEvaluationPrompt(spriteData, question, answer) {
    const expertise = spriteData?.expertise || 'general problem solving';
    const deskName = spriteData?.id || 'Desk Guide';

    return [
      CHALLENGE_PROMPT_TEXT.EVAL_ROLE.replace('{{deskName}}', deskName),
      CHALLENGE_PROMPT_TEXT.EVAL_EXPERTISE.replace('{{expertise}}', expertise),
      CHALLENGE_PROMPT_TEXT.EVAL_SCOPE,
      CHALLENGE_PROMPT_TEXT.EVAL_QUESTION.replace('{{question}}', question),
      CHALLENGE_PROMPT_TEXT.EVAL_ANSWER.replace('{{answer}}', answer),
      CHALLENGE_PROMPT_TEXT.EVAL_FORMAT,
      CHALLENGE_PROMPT_TEXT.EVAL_VERDICT,
      CHALLENGE_PROMPT_TEXT.EVAL_FEEDBACK,
      CHALLENGE_PROMPT_TEXT.EVAL_RIGHT_RULE,
    ].join('\n\n');
  }

  // Return a stable per-desk key so prompt history stays isolated by station.
  _getMissionQuestionHistoryKey(spriteData) {
    return spriteData?.id || 'desk';
  }

  // Normalize questions before comparing them so punctuation and case don't matter.
  _normalizeMissionQuestion(question) {
    return (question || '')
      .toString()
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/[^a-z0-9 ]/g, '')
      .trim();
  }

  // Keep a rolling recent-question list per station to discourage repeats.
  _recordMissionQuestion(spriteData, question) {
    const key = this._getMissionQuestionHistoryKey(spriteData);
    const normalized = this._normalizeMissionQuestion(question);
    if (!normalized) return;

    const existing = this._missionQuestionHistory.get(key) || [];
    const nextHistory = [...existing, question].slice(-CHALLENGE_RECENT_HISTORY_LIMIT);
    this._missionQuestionHistory.set(key, nextHistory);
  }

  // Pull the recent question list for the current desk.
  _getRecentMissionQuestions(spriteData) {
    const key = this._getMissionQuestionHistoryKey(spriteData);
    return this._missionQuestionHistory.get(key) || [];
  }

  // Detect whether the new question is a repeat of a recent station question.
  _isRepeatedMissionQuestion(spriteData, question) {
    const normalizedQuestion = this._normalizeMissionQuestion(question);
    if (!normalizedQuestion) return false;

    return this._getRecentMissionQuestions(spriteData).some((recentQuestion) => {
      return this._normalizeMissionQuestion(recentQuestion) === normalizedQuestion;
    });
  }

  // Build a large, varied prompt that tells the model which recent questions to avoid.
  _buildChallengePrompt(spriteData) {
    const expertise = spriteData?.expertise || 'general problem solving';
    const deskName = spriteData?.id || 'Desk Guide';
    const sampleTopics = (spriteData?.knowledgeBase?.[expertise] || [])
      .slice(0, 8)
      .map((topic) => `- ${topic.question}`)
      .join('\n');
    const recentQuestions = this._getRecentMissionQuestions(spriteData)
      .slice(-CHALLENGE_RECENT_HISTORY_LIMIT)
      .map((question) => `- ${question}`)
      .join('\n');
    const questionStyles = CHALLENGE_QUESTION_STYLES
      .map((style, index) => `${index + 1}. ${style}`)
      .join('\n');

    return [
      CHALLENGE_PROMPT_TEXT.QUESTION_ROLE.replace('{{deskName}}', deskName),
      CHALLENGE_PROMPT_TEXT.QUESTION_FOCUS.replace('{{expertise}}', expertise),
      CHALLENGE_PROMPT_TEXT.QUESTION_CONCISE,
      CHALLENGE_PROMPT_TEXT.QUESTION_SHORT_ANSWER,
      CHALLENGE_PROMPT_TEXT.QUESTION_FORMAT,
      CHALLENGE_PROMPT_TEXT.QUESTION_ANTI_REPEAT,
      CHALLENGE_PROMPT_TEXT.QUESTION_UNIQUE_STYLE,
      CHALLENGE_PROMPT_TEXT.QUESTION_VARIETY_HEADER.replace('{{questionStyles}}', questionStyles),
      recentQuestions ? CHALLENGE_PROMPT_TEXT.QUESTION_RECENT_HEADER.replace('{{recentQuestions}}', recentQuestions) : '',
      sampleTopics ? CHALLENGE_PROMPT_TEXT.QUESTION_TOPIC_HEADER.replace('{{sampleTopics}}', sampleTopics) : '',
    ].filter(Boolean).join('\n\n');
  }

  // Delegate grading parse to AiChallengeNpc.
  _parseChallengeEvaluation(raw) {
    return AiChallengeNpc.parseEvaluation(raw);
  }

  // Evaluate one submitted answer and update UI/TTS/log in a guarded async flow.
  // Called by AiChallengeNpc.armSubmission via the onSubmit callback.
  async _submitChallengeAnswer(npc, npcId, answer, active, ui) {
    if (!active?.question) return;

    // Orchestrator: evaluate, render, speak, and log in one guarded flow.
    await this._runBusyTask({
      busySet: this._deskChallengeEvalBusy,
      key: npcId,
      busyMessage: `${active.deskId}: still evaluating your previous answer.`,
      task: async () => {
        try {
          ui.input.value = '';
          const evaluation = await this._runWithLoading(() =>
            this._loadChallengeEvaluation(npc?.spriteData, active.question, answer)
          );
          AiChallengeNpc.renderEvaluation(ui.responseArea, active.question, answer, evaluation);
          AiChallengeNpc.speakEvaluation(npc, evaluation);
          if (evaluation?.verdict === CHALLENGE_VERDICTS.RIGHT) {
            this._awardMissionProgress(active?.deskId || '');
          }
          this._logChallengeEvent({
            deskId: active?.deskId || '',
            question: active?.question || '',
            answer,
            verdict: evaluation?.verdict || CHALLENGE_VERDICTS.WRONG,
            feedback: evaluation?.feedback || '',
            createdAt: Date.now(),
          });
        } catch (error) {
          console.warn('[MissionTools] challenge answer evaluation failed:', error);
          AiChallengeNpc.renderEvaluation(ui.responseArea, active.question, answer, {
            verdict: CHALLENGE_VERDICTS.WRONG,
            feedback: 'Could not evaluate right now. Please try submitting again.',
          });
          this.showToast?.(`${active.deskId}: evaluation unavailable, please retry.`);
        }
      },
    });
  }

  // Keep a bounded in-memory challenge log for debugging and future persistence hooks.
  _logChallengeEvent(entry) {
    this._challengeLog.push(entry);
    if (this._challengeLog.length > 100) {
      this._challengeLog.shift();
    }
    console.log('[MissionTools] challenge created:', entry);
  }

  // Progress rule: repeats do not count until every station is completed once.
  _awardMissionProgress(deskId) {
    if (!deskId) return;

    const stationTargetCount = this._missionDeskIds?.length || 4;
    const alreadyCompleted = this._missionCompletedStations.has(deskId);
    const allStationsCompleted = this._missionCompletedStations.size >= stationTargetCount;

    if (!alreadyCompleted) {
      this._missionCompletedStations.add(deskId);
      this._missionProgressCount += 1;
      this._syncMissionProgressBoard();

      if (this._missionCompletedStations.size >= stationTargetCount) {
        this.showToast?.('All stations cleared once. Repeat solves now count toward bonus progress.');
      }
      return;
    }

    if (!allStationsCompleted) {
      this.showToast?.('Progress lock: clear each station once before repeats count.');
      return;
    }

    this._missionProgressCount += 1;
    this._syncMissionProgressBoard();
  }

  // Render the level scoreboard with score ramp and completion count.
  _syncMissionProgressBoard() {
    const host = document.body;
    if (!host) return;

    if (!this._missionProgressEl) {
      const board = document.createElement('div');
      board.style.cssText = `
        position: fixed; right: 20px; bottom: 20px;
        z-index: 9999; pointer-events: none;
        min-width: 220px;
        background: rgba(13,13,26,0.96);
        border: 2px solid #f59e0b;
        color: #f8fafc;
        font-family: 'Courier New', monospace;
        padding: 12px 14px;
        border-radius: 10px;
        box-shadow: 0 0 20px rgba(245,158,11,0.22);
        letter-spacing: 0.6px;
      `;
      board.innerHTML = `
        <div style="font-size: 11px; text-transform: uppercase; opacity: 0.78; margin-bottom: 6px;">Mission Scoreboard</div>
        <div class="mission-progress-score" style="font-size: 24px; font-weight: 700; line-height: 1; margin-bottom: 6px;">.55</div>
        <div class="mission-progress-count" style="font-size: 13px; opacity: 0.92; margin-bottom: 10px;">0/4</div>
        <div style="height: 8px; border-radius: 999px; background: rgba(255,255,255,0.10); overflow: hidden;">
          <div class="mission-progress-bar" style="height: 100%; width: 0%; border-radius: inherit; background: linear-gradient(90deg, #f59e0b, #fbbf24, #fde68a);"></div>
        </div>
      `;
      host.appendChild(board);
      this._missionProgressEl = board;
    }

    const score = this._getMissionProgressScore(this._missionProgressCount);
    const scoreText = score.toFixed(2).replace(/^0/, '');
    const completedText = `${this._missionProgressCount}/4`;
    const progressRatio = Math.max(0, Math.min(1, (score - 0.55) / (0.92 - 0.55)));

    const scoreNode = this._missionProgressEl.querySelector('.mission-progress-score');
    const countNode = this._missionProgressEl.querySelector('.mission-progress-count');
    const barNode = this._missionProgressEl.querySelector('.mission-progress-bar');

    if (scoreNode) scoreNode.textContent = scoreText;
    if (countNode) countNode.textContent = completedText;
    if (barNode) barNode.style.width = `${progressRatio * 100}%`;
  }

  // Map completions to the requested mission score progression.
  _getMissionProgressScore(completedCount) {
    if (completedCount <= 0) return 0.55;
    if (completedCount === 1) return 0.66;
    if (completedCount === 2) return 0.77;
    if (completedCount === 3) return 0.88;
    if (completedCount === 4) return 0.89;

    const bonusSteps = Math.min(completedCount - 4, 12);
    return 0.89 + (bonusSteps * 0.0025);
  }

  // Helper to locate the player object in active game objects.
  _findPlayer() {
    return this.gameEnv?.gameObjects?.find((obj) => obj?.constructor?.name === 'Player');
  }

  // True when engine collision state reports player overlapping a desk.
  _deskIsColliding(player, desk) {
    return !!player?.state?.collisionEvents?.includes(desk?.spriteData?.id);
  }

  // Enforce mission rule: desk clicks only work while player is near that desk.
  _wireDeskClickDistanceGate(desks) {
    desks.forEach((desk) => {
      if (!desk || typeof desk.handleClick !== 'function') return;

      const originalHandleClick = desk.handleClick.bind(desk);
      desk.handleClick = (event) => {
        const player = this._findPlayer();
        if (!player) return;

        const playerCenter = this._getObjectCenter(player);
        const deskCenter = this._getObjectCenter(desk);
        const distance = Math.hypot(playerCenter.x - deskCenter.x, playerCenter.y - deskCenter.y);
        const inCollision = this._deskIsColliding(player, desk);
        const clickDistance = this._getDeskClickDistancePx(desk);
        const inZone = inCollision || distance < clickDistance;

        if (!inZone) return;

        originalHandleClick(event);
      };
    });
  }

  // Allow the mission challenge to start with E as well as click while in range.
  _handleMissionDeskKeyDown(event) {
    if (event?.key !== 'e' && event?.key !== 'E' && event?.code !== 'KeyE') return;
    if (event?.target?.closest?.('input, textarea, select, [contenteditable="true"]')) return;

    const player = this._findPlayer();
    if (!player || !Array.isArray(this._missionDeskObjects)) return;

    const nearestDesk = this._findNearestDeskInZone(player, this._missionDeskObjects);
    if (!nearestDesk) return;

    event.preventDefault();
    event.stopPropagation();

    const deskId = nearestDesk?.spriteData?.id;
    if (!deskId) return;

    this.startDeskChallenge(nearestDesk, deskId, nearestDesk);
  }

  // Runtime patch for engine quirk where reaction function may not bind automatically.
  _rebindMissingDeskReactions(desks) {
    // Runtime patch: Npc currently doesn't assign this.reaction from data.
    desks.forEach((desk) => {
      if (typeof desk?.reaction !== 'function' && typeof desk?.spriteData?.reaction === 'function') {
        desk.reaction = desk.spriteData.reaction;
      }
    });
  }

  // Compute center point for distance checks using current object position/size.
  _getObjectCenter(object) {
    return {
      x: (object?.position?.x || 0) + (object?.width || 0) / 2,
      y: (object?.position?.y || 0) + (object?.height || 0) / 2,
    };
  }

  // Alert radius in pixels used for zone prompts and nearest-desk detection.
  _getDeskAlertDistancePx(desk) {
    const alertMultiplier = desk?._alertDistanceMultiplier ?? desk?.spriteData?.alertDistance ?? 1.25;
    if ((desk?.width || 0) > 0) {
      return desk.width * alertMultiplier;
    }
    return (desk?.interactDistance || 120) * 1.5;
  }

  // Click radius in pixels; at least alert distance, with interact-distance fallback.
  _getDeskClickDistancePx(desk) {
    const alertDistance = this._getDeskAlertDistancePx(desk);
    const interactDistance = desk?.interactDistance || 120;
    return Math.max(alertDistance, interactDistance * 1.5);
  }

  // Return nearest desk currently within alert radius of player.
  _findNearestDeskInZone(player, desks) {
    const playerCenter = this._getObjectCenter(player);

    let nearestDesk = null;
    let nearestDistance = Infinity;

    for (const desk of desks) {
      const deskCenter = this._getObjectCenter(desk);
      const distance = Math.hypot(playerCenter.x - deskCenter.x, playerCenter.y - deskCenter.y);
      const inCollision = this._deskIsColliding(player, desk);
      const inZone = inCollision || distance < this._getDeskAlertDistancePx(desk);

      if (inZone && distance < nearestDistance) {
        nearestDesk = desk;
        nearestDistance = distance;
      }
    }

    return nearestDesk;
  }

  // Keep right-side zone alert banner in sync with current nearest desk.
  _syncDeskZoneAlert(nearestDesk) {
    if (nearestDesk) {
      const zoneMessage = nearestDesk.spriteData?.zoneMessage || 'Click to interact';
      this.setZoneAlert(zoneMessage);
      this._activeZoneDeskId = nearestDesk.spriteData?.id || null;
      return;
    }

    if (this._activeZoneDeskId) {
      this.clearZoneAlert();
      this._activeZoneDeskId = null;
    }
  }

  // Per-frame update: recompute nearest desk and refresh zone hint text.
  update() {
    const player = this.gameEnv?.gameObjects?.find((obj) => obj?.constructor?.name === 'Player');
    if (!player || !Array.isArray(this._missionDeskObjects)) return;

    const nearestDesk = this._findNearestDeskInZone(player, this._missionDeskObjects);
    this._syncDeskZoneAlert(nearestDesk);
  }

  // Cleanup transient UI owned by this level.
  destroy() {
    this.clearZoneAlert();
    document.removeEventListener('keydown', this._handleMissionDeskKeyDownBound);
    if (this._missionProgressEl?.parentNode) {
      this._missionProgressEl.parentNode.removeChild(this._missionProgressEl);
    }
    this._missionProgressEl = null;
  }

}

export default GameLevelCsPath2Mission;