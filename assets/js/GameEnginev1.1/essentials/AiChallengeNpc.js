/**
 * AiChallengeNpc.js — Reusable AI challenge system for game NPCs.
 *
 * Extends the conversational AiNpc pattern into a structured challenge flow:
 *   1. NPC generates a question via AI.
 *   2. Player types an answer and presses Enter.
 *   3. AI grades the answer and returns VERDICT + FEEDBACK.
 *   4. Level receives the result via callback and handles progression.
 *
 * USAGE (from a game level):
 *
 *   import AiChallengeNpc from '.../AiChallengeNpc.js';
 *
 *   // Fetch a question:
 *   const raw = await AiChallengeNpc.requestAiText(spriteData, myPrompt, 'my-level');
 *   const question = AiChallengeNpc.extractFirstLine(raw);
 *
 *   // Deliver question and arm answer input:
 *   AiChallengeNpc.deliverQuestion(npc, question);
 *   AiChallengeNpc.armSubmission(npc, deskId, question, activeChallengesMap, onSubmit, showToast);
 *
 *   // Grade an answer:
 *   const raw = await AiChallengeNpc.requestAiText(spriteData, evalPrompt, 'my-level');
 *   const result = AiChallengeNpc.parseEvaluation(raw);
 *   // result → { verdict: 'RIGHT'|'WRONG', feedback: '...' }
 *
 *   // Render and speak:
 *   AiChallengeNpc.renderEvaluation(responseArea, question, answer, result);
 *   AiChallengeNpc.speakEvaluation(npc, result);
 *
 * LEVEL RESPONSIBILITIES (not in this class):
 *   - Building the question and evaluation prompts (level-specific wording).
 *   - Tracking question history / deduplication per station.
 *   - Awarding progression / updating scoreboards.
 *   - Loading spinners (queueLoadingWork / finishLoadingWork).
 */

import AiNpc from './AiNpc.js';
import DialogueSystem from './DialogueSystem.js';
import { pythonURI, fetchOptions } from '../../api/config.js';

// ── Shared error codes ────────────────────────────────────────────────────────

export const CHALLENGE_ERROR_TYPES = {
  HTTP_ERROR: 'HTTP_ERROR',
  EMPTY_RESPONSE: 'EMPTY_RESPONSE',
  INVALID_RESPONSE: 'INVALID_RESPONSE',
  UNKNOWN: 'UNKNOWN',
};

export const CHALLENGE_ERROR_MESSAGES = {
  [CHALLENGE_ERROR_TYPES.HTTP_ERROR]: (status) => `Challenge request failed (${status}).`,
  [CHALLENGE_ERROR_TYPES.EMPTY_RESPONSE]: () => 'Challenge response was empty.',
  [CHALLENGE_ERROR_TYPES.INVALID_RESPONSE]: () => 'Challenge response format was invalid.',
  [CHALLENGE_ERROR_TYPES.UNKNOWN]: () => 'Challenge generation failed.',
};

// ── Grading verdicts ──────────────────────────────────────────────────────────

export const CHALLENGE_VERDICTS = {
  RIGHT: 'RIGHT',
  WRONG: 'WRONG',
};

// ── Main class ────────────────────────────────────────────────────────────────

class AiChallengeNpc extends AiNpc {

  // ── Network pipeline ────────────────────────────────────────────────────────

  /**
   * Full AI text request pipeline: build payload → POST → parse JSON → extract text.
   * @param {Object} spriteData  - NPC sprite data (id, expertise).
   * @param {string} prompt      - Fully-formed prompt string.
   * @param {string} [sessionPrefix='challenge'] - Namespace for session_id.
   * @param {string} [knowledgeContext='']       - Optional context hint for backend.
   * @returns {Promise<string>} Raw AI response text.
   */
  static async requestAiText(spriteData, prompt, sessionPrefix = 'challenge', knowledgeContext = '') {
    const payload = AiChallengeNpc.buildPayload(spriteData, prompt, sessionPrefix, knowledgeContext);
    const response = await AiChallengeNpc.postRequest(payload);
    const data = await AiChallengeNpc.parseResponseData(response);
    return AiChallengeNpc.extractAiResponseText(data);
  }

  /**
   * Build the JSON payload shape expected by /api/ainpc/prompt.
   */
  static buildPayload(spriteData, prompt, sessionPrefix = 'challenge', knowledgeContext = '') {
    return {
      prompt,
      session_id: `${sessionPrefix}-${spriteData?.id || 'npc'}`,
      npc_type: spriteData?.expertise || 'challenge',
      expertise: spriteData?.expertise || 'challenge',
      knowledgeContext: knowledgeContext || 'Challenge generation',
    };
  }

  /**
   * POST to the AI backend; throws a typed error on non-2xx responses.
   */
  static async postRequest(payload) {
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

  /**
   * Parse JSON from a fetch Response; maps malformed body to a typed error.
   */
  static async parseResponseData(response) {
    try {
      return await response.json();
    } catch (_error) {
      throw new Error(CHALLENGE_ERROR_TYPES.INVALID_RESPONSE);
    }
  }

  /**
   * Extract the model's response string from the parsed payload.
   * Throws EMPTY_RESPONSE when the backend returns nothing useful.
   */
  static extractAiResponseText(data) {
    const raw = (data?.response || '').toString().trim();
    if (!raw) {
      throw new Error(CHALLENGE_ERROR_TYPES.EMPTY_RESPONSE);
    }
    return raw;
  }

  // ── Text helpers ────────────────────────────────────────────────────────────

  /**
   * Return only the first non-empty line of a multi-line AI response.
   * Keeps generated questions to one concise line.
   */
  static extractFirstLine(raw) {
    const firstLine = raw.split(/\r?\n/).find((line) => line.trim().length > 0) || raw;
    return firstLine.trim();
  }

  // ── Evaluation parsing ──────────────────────────────────────────────────────

  /**
   * Parse AI grading output (VERDICT / FEEDBACK format) into a structured result.
   * Accepts strict labelled format first, then falls back to first two lines.
   *
   * Expected AI output:
   *   VERDICT: RIGHT
   *   FEEDBACK: One sentence of actionable feedback.
   *
   * @param {string} raw - Raw AI response text.
   * @returns {{ verdict: string, feedback: string }}
   */
  static parseEvaluation(raw) {
    const lines = raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const verdictLine = lines.find((line) => /^VERDICT\s*:/i.test(line)) || lines[0] || '';
    const feedbackLine = lines.find((line) => /^FEEDBACK\s*:/i.test(line)) || lines[1] || '';

    const verdictText = verdictLine.replace(/^VERDICT\s*:/i, '').trim().toUpperCase();
    const feedbackText = feedbackLine.replace(/^FEEDBACK\s*:/i, '').trim();

    const verdict = verdictText.includes(CHALLENGE_VERDICTS.RIGHT)
      ? CHALLENGE_VERDICTS.RIGHT
      : CHALLENGE_VERDICTS.WRONG;

    return {
      verdict,
      feedback: feedbackText || 'Review the topic and try again with a more specific answer.',
    };
  }

  // ── DOM helpers ─────────────────────────────────────────────────────────────

  /**
   * Open the NPC dialogue panel in challenge mode.
   * Unlike AiNpc.showInteraction this does NOT cycle through the dialogues array
   * and does NOT wire Enter to free-form AI send.  The input is left inert until
   * armSubmission() wires it after question delivery.
   *
   * Immediately shows a "Generating challenge…" placeholder so the player sees
   * feedback before the first AI round-trip completes.
   *
   * @param {Object} npc - Live NPC game object.
   */
  static showInteraction(npc) {
    const data = npc?.spriteData;
    if (!data) return;

    // Close any already-open dialogue for this NPC.
    if (npc.dialogueSystem?.isDialogueOpen()) {
      npc.dialogueSystem.closeDialogue();
    }

    // Initialise DialogueSystem if this is the first interaction.
    if (!npc.dialogueSystem) {
      npc.dialogueSystem = new DialogueSystem({
        dialogues: data.dialogues || [data.greeting || 'Challenge starting…'],
        gameControl: npc.gameControl,
      });
    }

    // Show the dialogue box using the NPC name / avatar but with a fixed
    // challenge-mode title rather than cycling through the dialogues array.
    npc.dialogueSystem?.showRandomDialogue(data.id, data.src, data);

    // Build the shared AiNpc chat UI shell (input + response area).
    const ui = AiNpc.createChatUI(data);

    // Challenge mode: disable history button (not relevant) and show loading state.
    if (ui.historyBtn) ui.historyBtn.style.display = 'none';

    // Prevent game input while input is focused — but do NOT wire Enter yet;
    // armSubmission() will do that once the question is ready.
    AiNpc.preventGameInput(ui.inputField);
    ui.inputField.placeholder = 'Generating challenge question…';
    ui.inputField.disabled = true;

    if (ui.responseArea) {
      ui.responseArea.style.display = 'block';
      ui.responseArea.textContent = 'Generating challenge question…';
    }

    AiNpc.attachToDialogue(npc.dialogueSystem, ui.container);

    // Auto-focus once the DOM has settled.
    setTimeout(() => ui.inputField?.focus(), 100);
  }

  /**
   * Resolve the challenge UI elements (input, responseArea) from the NPC's dialogue DOM.
   * Also re-enables the input field if it was disabled during the loading state.
   * @param {Object} npc - Live NPC game object with dialogueSystem attached.
   * @returns {{ dialogueRoot, input, responseArea }|null}
   */
  static getUiElements(npc) {
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

  /**
   * Display and speak the generated question inside the NPC's dialogue panel.
   * Also re-enables the input field that was disabled during the loading state.
   * @param {Object} npc           - Live NPC game object.
   * @param {string} questionText  - Generated question string.
   */
  static deliverQuestion(npc, questionText) {
    // Re-enable input now that the question is ready.
    const ui = AiChallengeNpc.getUiElements(npc);
    if (ui?.input) ui.input.disabled = false;

    AiChallengeNpc.renderQuestion(npc, questionText);
    if (npc?.dialogueSystem?.speakText) {
      npc.dialogueSystem.speakText(questionText);
    }
  }

  /**
   * Inject a question string into the response area and update the input placeholder.
   */
  static renderQuestion(npc, questionText) {
    const ui = AiChallengeNpc.getUiElements(npc);
    if (!ui) return;

    if (ui.responseArea) {
      ui.responseArea.style.display = 'block';
      ui.responseArea.textContent = `Challenge Question: ${questionText}`;
    }

    if (ui.input) {
      ui.input.placeholder = 'Type your answer to the challenge question...';
    }
  }

  // ── Answer submission ───────────────────────────────────────────────────────

  /**
   * Wire the NPC input box for challenge mode: Enter submits, Shift+Enter = newline.
   * Records the active challenge in the provided Map so the level can track it.
   *
   * @param {Object}   npc               - Live NPC game object.
   * @param {string}   deskId            - Human-readable station identifier.
   * @param {string}   challengeQuestion - The question the player must answer.
   * @param {Map}      activeChallenges  - Level-owned Map<npcId, {deskId, question, startedAt}>.
   * @param {Function} onSubmit          - Called with (answer, activeEntry, ui) when player submits.
   * @param {Function} [showToast]       - Optional level toast callback for validation nudges.
   */
  static armSubmission(npc, deskId, challengeQuestion, activeChallenges, onSubmit, showToast) {
    const ui = AiChallengeNpc.getUiElements(npc);
    if (!ui?.input || !ui?.responseArea) return;

    const npcId = npc?.spriteData?.id || deskId;
    activeChallenges.set(npcId, {
      deskId,
      question: challengeQuestion,
      startedAt: Date.now(),
    });

    ui.input.value = '';
    ui.input.placeholder = 'Type your answer, then press Enter to submit...';

    ui.input.onkeypress = (event) => {
      event.stopPropagation();
      if (event.key !== 'Enter' || event.shiftKey) return;

      event.preventDefault();
      const answer = ui.input.value.trim();
      if (!answer) {
        showToast?.(`${deskId}: please type an answer first.`);
        return;
      }

      const active = activeChallenges.get(npcId);
      onSubmit(answer, active, ui);
    };
  }

  // ── Evaluation rendering ────────────────────────────────────────────────────

  /**
   * Render the full grading summary into the NPC response area.
   * @param {HTMLElement} responseArea - Target DOM node.
   * @param {string}      question     - The challenge question.
   * @param {string}      answer       - The player's answer.
   * @param {{ verdict: string, feedback: string }} evaluation
   */
  static renderEvaluation(responseArea, question, answer, evaluation) {
    if (!responseArea) return;

    const isRight = evaluation?.verdict === CHALLENGE_VERDICTS.RIGHT;
    const verdictLabel = isRight ? 'RIGHT' : 'WRONG';
    const icon = isRight ? '✅' : '❌';

    responseArea.style.display = 'block';
    responseArea.textContent = [
      `Challenge Question: ${question}`,
      `Your Answer: ${answer}`,
      `${icon} Result: ${verdictLabel}`,
      `Feedback: ${evaluation?.feedback || 'No feedback provided.'}`,
    ].join('\n\n');
  }

  /**
   * Speak the verdict and feedback aloud via the NPC's dialogue system.
   * @param {Object} npc        - Live NPC game object.
   * @param {{ verdict: string, feedback: string }} evaluation
   */
  static speakEvaluation(npc, evaluation) {
    if (!npc?.dialogueSystem?.speakText) return;

    const verdict = evaluation?.verdict === CHALLENGE_VERDICTS.RIGHT ? 'Right' : 'Wrong';
    const feedback = evaluation?.feedback || 'Please try again.';
    npc.dialogueSystem.speakText(`${verdict}. ${feedback}`);
  }

  // ── Error handling ──────────────────────────────────────────────────────────

  /**
   * Concurrency guard: prevent duplicate async tasks per desk key.
   * @param {{ busySet: Set, key: string, busyMessage: string, task: Function, showToast?: Function }}
   */
  static async runBusyTask({ busySet, key, busyMessage, task, showToast }) {
    if (busySet.has(key)) {
      if (busyMessage) showToast?.(busyMessage);
      return;
    }

    busySet.add(key);
    try {
      await task();
    } finally {
      busySet.delete(key);
    }
  }

  /**
   * Map a thrown Error to a user-readable string using the standard error type codes.
   * @param {Error} error
   * @returns {string}
   */
  static getErrorMessage(error) {
    const code = (error?.message || '').toString();

    if (code.startsWith(`${CHALLENGE_ERROR_TYPES.HTTP_ERROR}_`)) {
      const status = code.replace(`${CHALLENGE_ERROR_TYPES.HTTP_ERROR}_`, '');
      return CHALLENGE_ERROR_MESSAGES[CHALLENGE_ERROR_TYPES.HTTP_ERROR](status);
    }

    const formatter =
      CHALLENGE_ERROR_MESSAGES[code] ||
      CHALLENGE_ERROR_MESSAGES[CHALLENGE_ERROR_TYPES.UNKNOWN];
    return formatter();
  }

  /**
   * Fallback path when question generation fails: show a generic challenge and keep
   * the flow usable so the player is never stuck at a broken desk.
   *
   * @param {Object}   npc       - Live NPC game object.
   * @param {string}   deskId    - Human-readable station identifier.
   * @param {Error}    error     - The thrown error.
   * @param {Function} [showToast] - Optional level toast callback.
   */
  static handleFailure(npc, deskId, error, showToast) {
    const mappedMessage = AiChallengeNpc.getErrorMessage(error);
    console.warn('[AiChallengeNpc] challenge generation failed:', mappedMessage, error);

    const fallback =
      'Challenge unavailable right now. Ask this: What is one practical step you would take for this desk topic?';
    AiChallengeNpc.deliverQuestion(npc, fallback);
    showToast?.(`${deskId}: using fallback challenge.`);
  }
}

export default AiChallengeNpc;
