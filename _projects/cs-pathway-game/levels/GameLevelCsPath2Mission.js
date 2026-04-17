// Imports: Level objects and UI helpers.
import GamEnvBackground from '/assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1.1/essentials/Player.js';
import FriendlyNpc from '/assets/js/GameEnginev1.1/essentials/FriendlyNpc.js';
import AiNpc from '/assets/js/GameEnginev1.1/essentials/AiNpc.js';
import { pythonURI, fetchOptions } from '/assets/js/api/config.js';
import GameLevelCsPathIdentity from './GameLevelCsPathIdentity.js';

const CHALLENGE_ERROR_TYPES = {
  HTTP_ERROR: 'HTTP_ERROR',
  EMPTY_RESPONSE: 'EMPTY_RESPONSE',
  INVALID_RESPONSE: 'INVALID_RESPONSE',
  UNKNOWN: 'UNKNOWN',
};

const CHALLENGE_ERROR_MESSAGES = {
  [CHALLENGE_ERROR_TYPES.HTTP_ERROR]: (status) => `Challenge request failed (${status}).`,
  [CHALLENGE_ERROR_TYPES.EMPTY_RESPONSE]: () => 'Challenge response was empty.',
  [CHALLENGE_ERROR_TYPES.INVALID_RESPONSE]: () => 'Challenge response format was invalid.',
  [CHALLENGE_ERROR_TYPES.UNKNOWN]: () => 'Challenge generation failed.',
};

// Centralized communication prompt text used for AI question generation and grading.
const CHALLENGE_PROMPT_TEXT = {
  QUESTION_ROLE: 'You are {{deskName}} in a classroom coding game.',
  QUESTION_FOCUS: 'Generate exactly one challenge question focused on: {{expertise}}.',
  QUESTION_CONCISE: 'Use the provided desk context and keep the question concise (max 30 words).',
  QUESTION_SHORT_ANSWER: 'The challenge should require a short written answer from a student.',
  QUESTION_FORMAT: 'Do not include explanation, rubric, markdown, numbering, or extra text.',
  QUESTION_TOPIC_HEADER: 'Desk topic examples:\n{{sampleTopics}}',

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

// Grading is intentionally binary for student-facing feedback in this level.
const CHALLENGE_VERDICTS = {
  RIGHT: 'RIGHT',
  WRONG: 'WRONG',
};

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
    this._handleMissionDeskKeyDownBound = this._handleMissionDeskKeyDown.bind(this);
  }

  // Find desk objects after engine instantiates them and apply runtime behavior patches.
  initialize() {
    const objects = this.gameEnv?.gameObjects || [];
    const desks = objects.filter((obj) => this._missionDeskIds?.includes(obj?.spriteData?.id));
    this._rebindMissingDeskReactions(desks);
    this._wireDeskClickDistanceGate(desks);
    document.addEventListener('keydown', this._handleMissionDeskKeyDownBound);

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
          AiNpc.showInteraction(npc);
          const challengeQuestion = await this._runWithLoading(() => this._loadDeskChallengeQuestion(npc.spriteData));
          this._deliverChallengeToNpc(npc, challengeQuestion);
          this._armChallengeSubmission(npc, deskId, challengeQuestion);
          this._logChallengeEvent({
            deskId,
            expertise: npc?.spriteData?.expertise || '',
            question: challengeQuestion,
            createdAt: Date.now(),
          });
        } catch (error) {
          this._handleChallengeFailure(npc, deskId, error);
        }
      },
    });
  }

  // Generic concurrency guard keyed per desk so duplicate async actions do not overlap.
  async _runBusyTask({ busySet, key, busyMessage, task }) {
    // Shared guard so generation/evaluation cannot overlap per desk instance.
    if (busySet.has(key)) {
      if (busyMessage) this.showToast?.(busyMessage);
      return;
    }

    busySet.add(key);
    try {
      await task();
    } finally {
      busySet.delete(key);
    }
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
    const prompt = this._buildChallengePrompt(spriteData);
    const raw = await this._requestChallengeAiText(spriteData, prompt);
    return this._extractFirstChallengeLine(raw);
  }

  // Build and execute answer-evaluation request, then parse verdict + feedback.
  async _loadChallengeEvaluation(spriteData, question, answer) {
    const prompt = this._buildChallengeEvaluationPrompt(spriteData, question, answer);
    const raw = await this._requestChallengeAiText(spriteData, prompt);
    return this._parseChallengeEvaluation(raw);
  }

  // Shared request chain used by both question generation and answer evaluation.
  async _requestChallengeAiText(spriteData, prompt) {
    // Unified request pipeline used by both question generation and answer grading.
    const payload = this._buildChallengeRequestPayload(spriteData, prompt);
    const response = await this._postChallengeRequest(payload);
    const data = await this._parseChallengeResponseData(response);
    return this._extractAiResponseText(data);
  }

  // Create backend payload shape for this level's AI challenge requests.
  _buildChallengeRequestPayload(spriteData, prompt) {
    return {
      prompt,
      session_id: `mission-challenge-${spriteData?.id || 'desk'}`,
      npc_type: spriteData?.expertise || 'challenge',
      expertise: spriteData?.expertise || 'challenge',
      knowledgeContext: 'Mission Tools challenge generation',
    };
  }

  // Send request to AI backend and convert non-2xx status into typed error codes.
  async _postChallengeRequest(payload) {
    const pythonURL = `${pythonURI}/api/ainpc/prompt`;
    const response = await fetch(pythonURL, {
      ...fetchOptions,
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`${CHALLENGE_ERROR_TYPES.HTTP_ERROR}_${response.status}`);
    }

    return response;
  }

  // Parse JSON safely so malformed body maps to a known error category.
  async _parseChallengeResponseData(response) {
    try {
      return await response.json();
    } catch (_error) {
      throw new Error(CHALLENGE_ERROR_TYPES.INVALID_RESPONSE);
    }
  }

  // Keep generated question concise by taking first non-empty line only.
  _extractFirstChallengeLine(raw) {
    const firstLine = raw.split(/\r?\n/).find((line) => line.trim().length > 0) || raw;
    return firstLine.trim();
  }

  // Standard extractor for model text response with empty-response validation.
  _extractAiResponseText(data) {
    const raw = (data?.response || '').toString().trim();
    if (!raw) {
      throw new Error(CHALLENGE_ERROR_TYPES.EMPTY_RESPONSE);
    }
    return raw;
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

  // Parse AI grading output into app-level verdict and feedback fields.
  _parseChallengeEvaluation(raw) {
    // Accept strict format first, then gracefully fall back to first two lines.
    const lines = raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    let verdictLine = lines.find((line) => /^VERDICT\s*:/i.test(line)) || lines[0] || '';
    let feedbackLine = lines.find((line) => /^FEEDBACK\s*:/i.test(line)) || lines[1] || '';

    const verdictText = verdictLine.replace(/^VERDICT\s*:/i, '').trim().toUpperCase();
    const feedbackText = feedbackLine.replace(/^FEEDBACK\s*:/i, '').trim();

    const verdict = verdictText.includes(CHALLENGE_VERDICTS.RIGHT)
      ? CHALLENGE_VERDICTS.RIGHT
      : CHALLENGE_VERDICTS.WRONG;

    return {
      verdict,
      feedback: feedbackText || 'Review the desk topic and try again with a more specific answer.',
    };
  }

  // Configure input box for mission mode: Enter submits answer for grading.
  _armChallengeSubmission(npc, deskId, challengeQuestion) {
    const ui = this._getChallengeUiElements(npc);
    if (!ui?.input || !ui?.responseArea) return;

    const npcId = npc?.spriteData?.id || deskId;
    this._activeDeskChallenges.set(npcId, {
      deskId,
      question: challengeQuestion,
      startedAt: Date.now(),
    });

    ui.input.value = '';
    ui.input.placeholder = 'Type your answer, then press Enter to submit...';
    // Mission mode: Enter submits to evaluator, Shift+Enter remains newline.
    ui.input.onkeypress = (event) => {
      event.stopPropagation();
      if (event.key !== 'Enter' || event.shiftKey) return;

      event.preventDefault();
      const answer = ui.input.value.trim();
      if (!answer) {
        this.showToast?.(`${deskId}: please type an answer first.`);
        return;
      }

      this._submitChallengeAnswer(npc, npcId, answer, ui);
    };
  }

  // Resolve current NPC dialogue DOM nodes needed for question/answer rendering.
  _getChallengeUiElements(npc) {
    const safeId = npc?.dialogueSystem?.safeId;
    if (!safeId) return null;

    const dialogueRoot = document.getElementById(`custom-dialogue-box-${safeId}`);
    if (!dialogueRoot) return null;

    return {
      dialogueRoot,
      input: dialogueRoot.querySelector('.ai-npc-input'),
      responseArea: dialogueRoot.querySelector('.ai-npc-response-area'),
    };
  }

  // Evaluate one submitted answer and update UI/TTS/log in a guarded async flow.
  async _submitChallengeAnswer(npc, npcId, answer, ui) {
    const active = this._activeDeskChallenges.get(npcId);
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
          this._renderChallengeEvaluation(ui.responseArea, active.question, answer, evaluation);
          this._speakChallengeEvaluation(npc, evaluation);
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
          this._renderChallengeEvaluation(ui.responseArea, active.question, answer, {
            verdict: CHALLENGE_VERDICTS.WRONG,
            feedback: 'Could not evaluate right now. Please try submitting again.',
          });
          this.showToast?.(`${active.deskId}: evaluation unavailable, please retry.`);
        }
      },
    });
  }

  // Render full grading summary so learner sees question, answer, verdict, feedback.
  _renderChallengeEvaluation(responseArea, question, answer, evaluation) {
    if (!responseArea) return;

    const verdictLabel = evaluation?.verdict === CHALLENGE_VERDICTS.RIGHT ? 'RIGHT' : 'WRONG';
    const icon = verdictLabel === 'RIGHT' ? '✅' : '❌';

    responseArea.style.display = 'block';
    responseArea.textContent = [
      `Challenge Question: ${question}`,
      `Your Answer: ${answer}`,
      `${icon} Result: ${verdictLabel}`,
      `Feedback: ${evaluation?.feedback || 'No feedback provided.'}`,
    ].join('\n\n');
  }

  // Read verdict and feedback aloud for accessibility and reinforcement.
  _speakChallengeEvaluation(npc, evaluation) {
    if (!npc?.dialogueSystem?.speakText) return;

    const verdict = evaluation?.verdict === CHALLENGE_VERDICTS.RIGHT ? 'Right' : 'Wrong';
    const feedback = evaluation?.feedback || 'Please try again.';
    npc.dialogueSystem.speakText(`${verdict}. ${feedback}`);
  }

  // Display and speak generated question when challenge starts.
  _deliverChallengeToNpc(npc, challengeQuestion) {
    this._renderChallengeQuestion(npc, challengeQuestion);
    if (npc?.dialogueSystem?.speakText) {
      npc.dialogueSystem.speakText(challengeQuestion);
    }
  }

  // Fallback path when question generation fails: show safe default and keep flow usable.
  _handleChallengeFailure(npc, deskId, error) {
    const mappedMessage = this._getChallengeErrorMessage(error);
    console.warn('[MissionTools] challenge generation failed:', mappedMessage, error);

    const fallback = 'Challenge unavailable right now. Ask this: What is one practical step you would take for this desk topic?';
    this._renderChallengeQuestion(npc, fallback);
    this.showToast?.(`${deskId}: using fallback challenge.`);
    if (npc?.dialogueSystem?.speakText) {
      npc.dialogueSystem.speakText(fallback);
    }
  }

  // Map internal error codes to user-readable messages for logs and diagnostics.
  _getChallengeErrorMessage(error) {
    const code = (error?.message || '').toString();

    if (code.startsWith(`${CHALLENGE_ERROR_TYPES.HTTP_ERROR}_`)) {
      const status = code.replace(`${CHALLENGE_ERROR_TYPES.HTTP_ERROR}_`, '');
      return CHALLENGE_ERROR_MESSAGES[CHALLENGE_ERROR_TYPES.HTTP_ERROR](status);
    }

    const formatter = CHALLENGE_ERROR_MESSAGES[code] || CHALLENGE_ERROR_MESSAGES[CHALLENGE_ERROR_TYPES.UNKNOWN];
    return formatter();
  }

  // Prompt template for producing a single desk-specific challenge question.
  _buildChallengePrompt(spriteData) {
    const expertise = spriteData?.expertise || 'general problem solving';
    const deskName = spriteData?.id || 'Desk Guide';
    const sampleTopics = (spriteData?.knowledgeBase?.[expertise] || [])
      .slice(0, 4)
      .map((topic) => `- ${topic.question}`)
      .join('\n');

    return [
      CHALLENGE_PROMPT_TEXT.QUESTION_ROLE.replace('{{deskName}}', deskName),
      CHALLENGE_PROMPT_TEXT.QUESTION_FOCUS.replace('{{expertise}}', expertise),
      CHALLENGE_PROMPT_TEXT.QUESTION_CONCISE,
      CHALLENGE_PROMPT_TEXT.QUESTION_SHORT_ANSWER,
      CHALLENGE_PROMPT_TEXT.QUESTION_FORMAT,
      sampleTopics ? CHALLENGE_PROMPT_TEXT.QUESTION_TOPIC_HEADER.replace('{{sampleTopics}}', sampleTopics) : '',
    ].filter(Boolean).join('\n\n');
  }

  // Inject generated question into the AI response area and prepare answer input.
  _renderChallengeQuestion(npc, questionText) {
    const safeId = npc?.dialogueSystem?.safeId;
    if (!safeId) return;

    const dialogueRoot = document.getElementById(`custom-dialogue-box-${safeId}`);
    if (!dialogueRoot) return;

    const responseArea = dialogueRoot.querySelector('.ai-npc-response-area');
    if (responseArea) {
      responseArea.style.display = 'block';
      responseArea.textContent = `Challenge Question: ${questionText}`;
    }

    const input = dialogueRoot.querySelector('.ai-npc-input');
    if (input) {
      input.placeholder = 'Type your answer to the challenge question...';
    }
  }

  // Keep a bounded in-memory challenge log for debugging and future persistence hooks.
  _logChallengeEvent(entry) {
    this._challengeLog.push(entry);
    if (this._challengeLog.length > 100) {
      this._challengeLog.shift();
    }
    console.log('[MissionTools] challenge created:', entry);
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
      const inZone = distance < this._getDeskAlertDistancePx(desk);

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
  }

}

export default GameLevelCsPath2Mission;