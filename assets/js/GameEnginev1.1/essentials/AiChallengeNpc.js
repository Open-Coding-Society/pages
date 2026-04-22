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
  static async requestAiText(spriteData, prompt, sessionPrefix = 'challenge', knowledgeContext = '', session = null) {
    const payload = AiChallengeNpc.buildPayload(spriteData, prompt, sessionPrefix, knowledgeContext);
    const response = await AiChallengeNpc.postRequest(payload, session);
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
  static async postRequest(payload, session = null) {
    const pythonURL = `${pythonURI}/api/ainpc/prompt`;
    const response = await fetch(pythonURL, {
      ...fetchOptions,
      method: 'POST',
      signal: session?.signal,
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

    const session = AiNpc.beginSession(npc);
    if (npc.dialogueSystem?.setLifecycleSession) {
      npc.dialogueSystem.setLifecycleSession(session);
    }

    // Show the dialogue box using the NPC name / avatar but with a fixed
    // challenge-mode title rather than cycling through the dialogues array.
    npc.dialogueSystem?.showRandomDialogue(data.id, null, data);

    // Build the shared AiNpc chat UI shell (input + response area).
    const ui = AiNpc.createChatUI(data);

    // Challenge mode uses an in-panel scrollable chat log instead of a modal transcript.
    if (ui.historyBtn) ui.historyBtn.style.display = 'none';

    // Prevent game input while input is focused — but do NOT wire Enter yet;
    // armSubmission() will do that once the question is ready.
    AiNpc.preventGameInput(ui.inputField);
    ui.inputField.placeholder = 'Generating challenge question…';
    ui.inputField.disabled = true;

    if (ui.responseArea) {
      ui.responseArea.style.display = 'block';
      ui.responseArea.style.maxHeight = '220px';
      ui.responseArea.style.overflowY = 'auto';
      ui.responseArea.style.whiteSpace = 'normal';
      ui.responseArea.style.display = 'flex';
      ui.responseArea.style.flexDirection = 'column';
      ui.responseArea.style.gap = '6px';
      ui.responseArea.style.padding = '8px';
      ui.responseArea.style.position = 'relative';
      AiChallengeNpc.ensureModeLabel(ui.container, 'Challenge Question');
      AiChallengeNpc.ensureJumpToLatestButton(ui.responseArea);
      AiChallengeNpc.renderChatHistory(ui.responseArea, data?.chatHistory || []);
      AiChallengeNpc.appendChatMessage(ui.responseArea, 'ai', 'Generating challenge question…');
    }

    AiNpc.attachToDialogue(npc.dialogueSystem, ui.container);

    // Auto-focus once the DOM has settled.
    if (session) {
      session.setTimeout(() => {
        if (AiNpc.canUseElement(ui.inputField, session)) ui.inputField.focus();
      }, 100);
    } else {
      setTimeout(() => ui.inputField?.focus(), 100);
    }
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
    if (!AiNpc.isSessionActive(npc?.aiSession)) return;

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
    if (!AiNpc.isSessionActive(npc?.aiSession)) return;

    const ui = AiChallengeNpc.getUiElements(npc);
    if (!ui) return;

    if (ui.responseArea) {
      ui.responseArea.style.display = 'block';
      AiChallengeNpc.appendChatMessage(ui.responseArea, 'ai', `Challenge Question: ${questionText}`);
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
    ui.input.placeholder = 'Type your answer, or ask for a hint, then press Enter...';

    ui.input.onkeypress = (event) => {
      event.stopPropagation();
      if (event.key !== 'Enter' || event.shiftKey) return;

      event.preventDefault();
      const answer = ui.input.value.trim();
      if (!answer) {
        showToast?.(`${deskId}: please type an answer first.`);
        return;
      }

      if (AiChallengeNpc.isChallengeFollowUpQuestion(answer)) {
        AiChallengeNpc.handleChallengeFollowUpQuestion(npc, deskId, challengeQuestion, answer, ui, activeChallenges, npcId);
        ui.input.value = '';
        return;
      }

      AiChallengeNpc.appendChatMessage(ui.responseArea, 'user', answer);
      const active = activeChallenges.get(npcId);
      onSubmit(answer, active, ui);
    };
  }

  /**
   * Detect whether the input is a follow-up question rather than a challenge answer.
   * This keeps players from accidentally submitting requests for hints as their answer.
   */
  static isChallengeFollowUpQuestion(text) {
    const normalized = (text || '').trim().toLowerCase();
    if (!normalized) return false;

    if (normalized.includes('?')) return true;

    return /^(what|why|how|when|where|who|which|can you|could you|would you|should i|please|hint|help|give me|tell me|explain)/i.test(normalized);
  }

  /**
   * Answer a follow-up question without revealing the challenge answer.
   * The active challenge remains open and the follow-up is not scored.
   */
  static async handleChallengeFollowUpQuestion(npc, deskId, challengeQuestion, followUpQuestion, ui, activeChallenges = null, npcId = '') {
    const session = npc?.aiSession || null;
    if (!npc?.spriteData || !ui?.responseArea || !AiNpc.canUseElement(ui.responseArea, session)) return;

    AiChallengeNpc.appendChatMessage(ui.responseArea, 'user', followUpQuestion);
    AiChallengeNpc.appendChatMessage(ui.responseArea, 'ai', 'Thinking about a safe hint...');

    const activeChallenge = activeChallenges?.get?.(npcId) || null;

    try {
      const prompt = AiChallengeNpc.buildFollowUpPrompt(
        npc.spriteData,
        challengeQuestion,
        followUpQuestion,
        activeChallenge,
      );
      const raw = await AiChallengeNpc.requestAiText(
        npc.spriteData,
        prompt,
        'mission-challenge-followup',
        'Mission Tools challenge follow-up assistance',
        session,
      );

      if (!AiNpc.canUseElement(ui.responseArea, session)) return;

      const safeReply = AiChallengeNpc.sanitizeFollowUpReply(raw);
      AiChallengeNpc.appendChatMessage(ui.responseArea, 'ai', safeReply);
      if (npc?.dialogueSystem?.speakText) {
        npc.dialogueSystem.speakText(safeReply);
      }

      if (Array.isArray(npc.spriteData.chatHistory)) {
        npc.spriteData.chatHistory.push({ role: 'user', message: followUpQuestion, createdAt: Date.now() });
        npc.spriteData.chatHistory.push({ role: 'ai', message: safeReply, createdAt: Date.now() });
      }

      AiChallengeNpc.updateJumpToLatestVisibility(ui.responseArea);
    } catch (error) {
      if (error?.name === 'AbortError' || session?.signal?.aborted) {
        return;
      }
      console.warn(`[AiChallengeNpc] follow-up hint failed for ${deskId}:`, error);
      const fallbackReply = 'I can give a hint, but I cannot reveal the full answer. Try focusing on the next step or the key concept the question is testing.';
      AiChallengeNpc.appendChatMessage(ui.responseArea, 'ai', fallbackReply);
      if (npc?.dialogueSystem?.speakText) {
        npc.dialogueSystem.speakText(fallbackReply);
      }
    }
  }

  /**
   * Build a safe follow-up prompt that keeps the answer hidden.
   */
  static buildFollowUpPrompt(spriteData, challengeQuestion, followUpQuestion, activeChallenge = null) {
    const expertise = spriteData?.expertise || 'general problem solving';
    const deskName = spriteData?.id || 'Desk Guide';
    const lastVerdict = activeChallenge?.lastEvaluation?.verdict || '';
    const lastFeedback = activeChallenge?.lastEvaluation?.feedback || '';
    const lastAnswer = activeChallenge?.lastAnswer || '';
    const hasFeedback = Boolean(lastVerdict || lastFeedback);

    const modeInstructions = hasFeedback
      ? [
          'The student already submitted an answer and received feedback.',
          `Last student answer: ${lastAnswer || 'not recorded'}`,
          `Last verdict: ${lastVerdict || 'not recorded'}`,
          `Last feedback: ${lastFeedback || 'not recorded'}`,
          'The student is asking why the feedback was given.',
          'Explain the reasoning behind the verdict using the question and the student answer.',
          'Do not re-grade the answer.',
          'Do not change the verdict.',
        ]
      : [
          'The student has not submitted an answer yet.',
          'Answer as a hint or clarification only.',
          'Do not reveal the full answer to the challenge question.',
          'Do not say whether the student is correct.',
          'Do not grade the answer.',
          'If the student asks for the answer directly, refuse politely and offer a hint instead.',
        ];

    return [
      `You are ${deskName} in a classroom coding game.`,
      `Desk expertise: ${expertise}.`,
      `Current challenge question: ${challengeQuestion}`,
      `Student follow-up question: ${followUpQuestion}`,
      ...modeInstructions,
      'Respond with a short helpful explanation or hint depending on the current mode.',
      'Keep the reply to 2 sentences maximum.',
    ].join('\n\n');
  }

  /**
   * Trim and constrain the AI follow-up response so it stays hint-like.
   */
  static sanitizeFollowUpReply(raw) {
    const reply = (raw || '').toString().trim();
    if (!reply) {
      return 'Try narrowing your focus to the key concept in the question.';
    }

    return AiChallengeNpc.extractFirstLine(reply);
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
    const feedback = evaluation?.feedback || 'No feedback provided.';

    responseArea.style.display = 'block';
    AiChallengeNpc.ensureModeLabel(responseArea.parentElement, 'Feedback Q&A');
    AiChallengeNpc.appendChatMessage(responseArea, 'ai', `${icon} ${verdictLabel}: ${feedback}`);
  }

  /**
   * Build chat log entries from saved history so the panel can be scrolled like
   * a standard messenger timeline each time the dialogue is opened.
   */
  static renderChatHistory(responseArea, history) {
    if (!responseArea) return;
    responseArea.textContent = '';
    AiChallengeNpc.ensureJumpToLatestButton(responseArea);

    history.forEach((entry) => {
      const role = entry?.role === 'user' ? 'user' : 'ai';
      const message = (entry?.message || '').toString().trim();
      if (!message) return;
      AiChallengeNpc.appendChatMessage(responseArea, role, message, false);
    });

    responseArea.scrollTop = responseArea.scrollHeight;
    AiChallengeNpc.updateJumpToLatestVisibility(responseArea);
  }

  /**
   * Append a single chat bubble into the scrollable response area.
   */
  static appendChatMessage(responseArea, role, message, scrollToBottom = true) {
    if (!responseArea || !message) return;

    const bubble = document.createElement('div');
    bubble.className = role === 'user' ? 'ai-challenge-user-message' : 'ai-challenge-ai-message';
    bubble.textContent = message;
    bubble.style.maxWidth = '92%';
    bubble.style.padding = '6px 8px';
    bubble.style.borderRadius = '8px';
    bubble.style.lineHeight = '1.35';
    bubble.style.alignSelf = role === 'user' ? 'flex-end' : 'flex-start';
    bubble.style.background = role === 'user' ? 'rgba(76, 139, 245, 0.18)' : 'rgba(255, 255, 255, 0.08)';
    bubble.style.border = role === 'user' ? '1px solid rgba(76, 139, 245, 0.45)' : '1px solid rgba(255, 255, 255, 0.18)';

    responseArea.appendChild(bubble);
    AiChallengeNpc.ensureJumpToLatestButton(responseArea);
    if (scrollToBottom) {
      responseArea.scrollTop = responseArea.scrollHeight;
    }
    AiChallengeNpc.updateJumpToLatestVisibility(responseArea);
  }

  /**
   * Create a sticky jump control that appears when the user scrolls up.
   */
  static ensureJumpToLatestButton(responseArea) {
    if (!responseArea) return;

    if (!responseArea.dataset.jumpLatestBound) {
      responseArea.dataset.jumpLatestBound = 'true';
      responseArea.addEventListener('scroll', () => {
        AiChallengeNpc.updateJumpToLatestVisibility(responseArea);
      });
    }

    if (responseArea.querySelector('.ai-challenge-jump-latest')) {
      return;
    }

    const jumpBtn = document.createElement('button');
    jumpBtn.type = 'button';
    jumpBtn.className = 'ai-challenge-jump-latest';
    jumpBtn.textContent = 'Jump to latest';
    jumpBtn.style.position = 'sticky';
    jumpBtn.style.bottom = '0';
    jumpBtn.style.alignSelf = 'center';
    jumpBtn.style.margin = '4px auto 0';
    jumpBtn.style.padding = '5px 10px';
    jumpBtn.style.borderRadius = '999px';
    jumpBtn.style.border = '1px solid rgba(255, 255, 255, 0.22)';
    jumpBtn.style.background = 'rgba(12, 16, 24, 0.88)';
    jumpBtn.style.color = '#f7f7f7';
    jumpBtn.style.fontSize = '12px';
    jumpBtn.style.cursor = 'pointer';
    jumpBtn.style.zIndex = '2';
    jumpBtn.style.display = 'none';

    jumpBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      responseArea.scrollTop = responseArea.scrollHeight;
      AiChallengeNpc.updateJumpToLatestVisibility(responseArea);
    });

    responseArea.appendChild(jumpBtn);
    AiChallengeNpc.updateJumpToLatestVisibility(responseArea);
  }

  /**
   * Ensure the chat panel has a small mode label above the response log.
   */
  static ensureModeLabel(container, text) {
    if (!container) return;

    let label = container.querySelector('.ai-challenge-mode-label');
    if (!label) {
      label = document.createElement('div');
      label.className = 'ai-challenge-mode-label';
      label.style.margin = '0 0 6px 0';
      label.style.padding = '4px 8px';
      label.style.borderRadius = '999px';
      label.style.border = '1px solid rgba(255, 255, 255, 0.18)';
      label.style.background = 'rgba(12, 16, 24, 0.72)';
      label.style.color = '#f7f7f7';
      label.style.fontSize = '12px';
      label.style.fontWeight = '600';
      label.style.letterSpacing = '0.02em';
      label.style.width = 'fit-content';
      label.style.maxWidth = '100%';

      const responseArea = container.querySelector('.ai-npc-response-area');
      if (responseArea && responseArea.parentNode === container) {
        container.insertBefore(label, responseArea);
      } else {
        container.appendChild(label);
      }
    }

    label.textContent = text;
    return label;
  }

  /**
   * Toggle jump button visibility based on distance from the bottom.
   */
  static updateJumpToLatestVisibility(responseArea) {
    if (!responseArea) return;

    const jumpBtn = responseArea.querySelector('.ai-challenge-jump-latest');
    if (!jumpBtn) return;

    const distanceFromBottom = Math.max(
      0,
      responseArea.scrollHeight - responseArea.clientHeight - responseArea.scrollTop
    );

    jumpBtn.style.display = distanceFromBottom > 24 ? 'inline-flex' : 'none';
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
