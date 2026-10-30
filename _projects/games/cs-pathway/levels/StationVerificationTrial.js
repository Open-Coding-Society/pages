/**
 * Station verification for Toolchain Trail.
 *
 * Main path (one-time device pairing, once per trail): at the first station the
 * page gets a single-use pairing code and the student starts the local agent
 * (scripts/toolchain_agent.py) with it. The agent stays open; at every later
 * station the page just asks the backend to check that station, and the agent
 * runs the real commands and reports them. The backend decides pass/fail; the
 * page polls for the verdict.
 *
 * Fallback: when the backend cannot start a session (signed out, offline), the
 * student can paste output for practice feedback checked in the browser.
 */

import { verifyStationOutput, PASTE_PROMPTS } from '@assets/js/projects/cs-pathway/model/stationVerifiers.js';
import {
  startToolchainSession,
  getToolchainSession,
  requestStationCheck,
  agentCommands,
  usesLocalBackend,
  loadPairedSessionId,
  savePairedSessionId,
  forgetPairedSessionId,
} from '../services/ToolchainApi.js';
import { TOOLCHAIN_TRAIL_SETTINGS } from '../data/toolchainTrailSettings.js';
import { copyToClipboard } from '../services/clipboard.js';
import { fixStepsFor, stuckHelpFor } from '../data/toolchainTrailFixes.js';

const { pollIntervalMs: POLL_INTERVAL_MS, silentAgentHintMs: SILENT_AGENT_HINT_MS } = TOOLCHAIN_TRAIL_SETTINGS;
export default class StationVerificationTrial {
  /**
   * @param {Object} opts
   * @param {Object} opts.station - station descriptor, see GameLevelCsPath2Toolchain.js STATIONS
   * @param {string} opts.station.id
   * @param {string} opts.station.name - in-world display name (e.g. "Terminal Town Gate")
   * @param {string} opts.station.skill - real-world skill label (e.g. "Shell fundamentals and package management")
   * @param {string} opts.station.narrativeHook - 1-2 sentence flavor text shown before the terminal
   * @param {Array<string|{text: string, commands: string[]}>} opts.station.instructions - ordered real-world
   *   steps; a step with commands shows each one with its own Copy button
   * @param {RegExp} opts.station.expectedCommandPattern - pattern the mock terminal checks input against
   * @param {string} opts.station.exampleCommand - a valid example command (shown as a hint)
   * @param {string} opts.station.funFact - fun fact shown by the NPC popup on success (level owns the popup, not this trial)
   * @param {Function} [opts.onComplete] - called with { stationId } when verified
   * @param {Function} [opts.onClose] - called when the student closes without completing
   */
   constructor({ station, os, onComplete, onClose } = {}) {
    this.station = station || {};
    this.os = os || 'linux';
    this.onComplete = onComplete || (() => {});
    this.onClose = onClose || (() => {});
    this.overlay = null;
    this.verified = false;
    this.session = null;
    this.pollTimer = null;
    this.countdownTimer = null;
    this.checkingSince = null;
  }

  start() {
    this._render();
  }

  _render() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'svt-overlay';

    const instructions = Array.isArray(this.station.instructions) ? this.station.instructions : [];

    this.overlay.innerHTML = `
      <style>
        .svt-overlay {
          position: fixed;
          inset: 0;
          /* Above the level's status panels (10000) and zone alerts (100010). */
          z-index: 100040;
          background: radial-gradient(circle at 50% 20%, rgba(30,10,60,0.92), rgba(2,2,10,0.97));
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          padding: 20px;
          font-family: "Courier New", monospace;
          color: #dbeafe;
        }

        .svt-modal {
          width: min(820px, 100%);
          max-height: calc(100vh - 40px);
          overflow: hidden;
          background: linear-gradient(180deg, #0b1026, #030410);
          border: 2px solid #7dd3fc;
          border-radius: 16px;
          box-shadow: 0 0 40px rgba(125, 211, 252, 0.35), 0 0 90px rgba(139, 92, 246, 0.15);
          display: flex;
          flex-direction: column;
        }

        .svt-header {
          padding: 14px 18px;
          border-bottom: 1px solid rgba(125, 211, 252, 0.35);
          background: rgba(8, 12, 32, 0.9);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .svt-title {
          font-size: 18px;
          font-weight: bold;
          color: #67e8f9;
          letter-spacing: 0.5px;
          line-height: 1.25;
        }

        .svt-skill {
          font-size: 11px;
          color: #a5b4fc;
          margin-top: 4px;
        }

        .svt-hook {
          font-size: 12px;
          color: #e0e7ff;
          margin-top: 10px;
          line-height: 1.5;
          font-style: italic;
          border-left: 2px solid #7dd3fc;
          padding-left: 10px;
        }

        .svt-close {
          background: transparent;
          border: 1px solid rgba(248, 113, 113, 0.6);
          color: #fca5a5;
          border-radius: 8px;
          padding: 5px 10px;
          cursor: pointer;
          font-family: inherit;
          font-size: 11px;
          flex-shrink: 0;
        }
        .svt-close:hover { background: rgba(127, 29, 29, 0.35); }

        .svt-body {
          padding: 16px 18px;
          overflow: auto;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
          gap: 14px;
        }

        .svt-panel {
          background: rgba(10, 14, 36, 0.85);
          border: 1px solid rgba(125, 211, 252, 0.25);
          border-radius: 12px;
          padding: 12px;
          min-width: 0;
        }

        .svt-panel h4 {
          margin: 0 0 8px;
          color: #93c5fd;
          font-size: 12px;
          letter-spacing: 1px;
        }

        .svt-steps {
          margin: 0;
          padding-left: 18px;
          font-size: 12.5px;
          line-height: 1.7;
          color: #dbeafe;
        }

        .svt-terminal {
          background: #000;
          border: 1px solid #22d3ee;
          border-radius: 10px;
          padding: 12px;
          font-size: 13px;
          min-height: 190px;
          display: flex;
          flex-direction: column;
          box-shadow: inset 0 0 24px rgba(34, 211, 238, 0.12);
        }

        .svt-terminal-log {
          flex: 1;
          overflow-y: auto;
          color: #4ade80;
          white-space: pre-wrap;
          margin-bottom: 8px;
        }

        .svt-terminal-row {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #22d3ee;
        }

        .svt-terminal-row input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #e0f2fe;
          font-family: inherit;
          font-size: 13px;
        }

        .svt-hint {
          margin-top: 8px;
          font-size: 11px;
          color: #94a3b8;
        }

        .svt-hint code {
          color: #fbbf24;
          background: rgba(30, 41, 59, 0.7);
          padding: 1px 5px;
          border-radius: 4px;
        }

        .svt-status {
          margin-top: 10px;
          font-size: 12px;
          min-height: 16px;
        }
        .svt-status.pending { color: #fbbf24; }
        .svt-status.ok { color: #4ade80; }
        .svt-status.err { color: #f87171; }

        .svt-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 12px 18px;
          border-top: 1px solid rgba(125, 211, 252, 0.3);
          background: rgba(8, 12, 32, 0.9);
        }

        .svt-btn {
          border: 1px solid #7dd3fc;
          background: rgba(56, 189, 248, 0.12);
          color: #e0f2fe;
          border-radius: 10px;
          padding: 9px 16px;
          cursor: pointer;
          font-family: inherit;
          font-weight: bold;
          font-size: 12px;
        }
        .svt-btn:hover { background: rgba(56, 189, 248, 0.25); }
        .svt-btn.primary {
          background: #38bdf8;
          color: #061225;
        }
        .svt-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .svt-checks {
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .svt-check {
          font-size: 12px;
          line-height: 1.4;
          padding: 6px 8px;
          border-radius: 6px;
        }
        .svt-check.pass {
          color: #4ade80;
          background: rgba(34, 197, 94, 0.08);
        }
        .svt-check.fail {
          color: #f87171;
          background: rgba(248, 113, 113, 0.08);
        }
        .svt-check-detail {
          display: block;
          margin-top: 2px;
          font-size: 11px;
          color: #fca5a5;
        }

        .svt-verify {
          margin-top: 12px;
          padding: 10px 12px;
          border: 1px dashed rgba(251, 191, 36, 0.6);
          border-radius: 8px;
          font-size: 12px;
          line-height: 1.5;
          color: #fde68a;
        }
        .svt-verify strong { color: #fbbf24; }

        .svt-prompt {
          font-size: 12px;
          color: #fbbf24;
          margin-bottom: 8px;
          line-height: 1.5;
        }

        .svt-paste {
          flex: 1;
          min-height: 170px;
          resize: vertical;
          background: transparent;
          border: none;
          outline: none;
          color: #e0f2fe;
          font-family: inherit;
          font-size: 12px;
          white-space: pre;
        }

        .svt-code {
          display: flex;
          gap: 8px;
          align-items: center;
          margin: 8px 0;
        }
        .svt-code input {
          flex: 1;
          min-width: 0;
          background: #000;
          border: 1px solid #22d3ee;
          border-radius: 8px;
          color: #fbbf24;
          font-family: inherit;
          font-size: 13px;
          padding: 8px;
        }
        .svt-cmd {
          margin: 6px 0;
          font-size: 12px;
          color: #cbd5e1;
        }
        .svt-cmdrow {
          display: flex;
          gap: 6px;
          align-items: stretch;
          margin-top: 4px;
        }
        .svt-cmdrow code {
          flex: 1;
          min-width: 0;
          font-size: 12px;
          color: #fbbf24;
          background: #000;
          border: 1px solid rgba(34, 211, 238, 0.4);
          border-radius: 6px;
          padding: 6px 8px;
          white-space: pre-wrap;
          word-break: break-all;
        }
        .svt-fix {
          margin: 6px 0 2px;
          padding-left: 18px;
          font-size: 12px;
          color: #e2e8f0;
        }
        .svt-fix li { margin: 4px 0; }
        .svt-copy {
          flex: none;
          border: 1px solid #7dd3fc;
          background: rgba(56, 189, 248, 0.12);
          color: #e0f2fe;
          border-radius: 6px;
          padding: 0 10px;
          cursor: pointer;
          font-family: inherit;
          font-size: 11px;
          font-weight: bold;
        }
        .svt-copy:hover { background: rgba(56, 189, 248, 0.25); }
        .svt-agent-steps {
          margin: 6px 0 0;
          padding-left: 18px;
          font-size: 12px;
          line-height: 1.6;
        }
        .svt-agent-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 10px;
        }
        .svt-link {
          background: none;
          border: none;
          padding: 0;
          color: #7dd3fc;
          text-decoration: underline;
          cursor: pointer;
          font-family: inherit;
          font-size: 11px;
        }
        .svt-hidden { display: none !important; }

        @media (max-width: 860px) {
          .svt-body { grid-template-columns: 1fr; }
        }

        @media (max-width: 520px) {
          .svt-overlay { padding: 10px; }
          .svt-modal { max-height: calc(100vh - 20px); }
          .svt-header {
            padding: 12px;
            flex-direction: column;
          }
          .svt-body { padding: 12px; }
          .svt-actions {
            padding: 12px;
            flex-direction: column-reverse;
          }
          .svt-btn { width: 100%; }
        }
      </style>

      <div class="svt-modal">
        <div class="svt-header">
          <div>
            <div class="svt-title">⚙ ${this._escape(this.station.name || 'Station')}</div>
            <div class="svt-skill">${this._escape(this.station.skill || '')}</div>
            <div class="svt-hook">${this._escape(this.station.narrativeHook || '')}</div>
          </div>
          <button class="svt-close" id="svt-close">✕ Close</button>
        </div>

        <div class="svt-body">
          <div class="svt-panel">
            <h4>MISSION BRIEFING</h4>
            <ol class="svt-steps">
              ${instructions.map((step) => `<li>${this._renderStep(step)}</li>`).join('')}
            </ol>
            <div class="svt-verify"><strong>FINAL STEP, VERIFY:</strong> the Toolchain agent on your computer runs the real commands and reports them to the server. Start it once; it keeps running in the background for the whole trail.</div>
          </div>

          <div class="svt-panel" id="svt-agent-panel">
            <h4>VERIFY WITH THE TOOLCHAIN AGENT</h4>
            <div id="svt-agent-start" class="svt-hidden">
              <div class="svt-prompt">Get a one-time pairing code and paste it into the agent. You only do this once for the whole trail.</div>
              <button class="svt-btn primary" id="svt-get-code">Get pairing code</button>
            </div>
            <div id="svt-agent-pairing" class="svt-hidden">
              <ol class="svt-agent-steps">
                <li>Open a terminal and <code>cd</code> into your pages repository.</li>
                <li>Run the agent:
                  ${agentCommands(this.os).map((item) => `<div class="svt-cmd">${this._escape(item.label)}${this._commandRow(item.command)}</div>`).join('')}
                </li>
                <li>Paste the code below when it asks (it stays hidden while you type).</li>
                <li>The agent then runs in the background until you finish the trail, so keep using the same terminal for your setup commands.</li>
              </ol>
              <div class="svt-code">
                <input id="svt-code" type="text" readonly spellcheck="false" aria-label="Pairing code">
                <button class="svt-btn" id="svt-copy-code">Copy</button>
              </div>
              <div class="svt-hint" id="svt-code-expiry"></div>
            </div>
            <div class="svt-status" id="svt-agent-status"></div>
            <div class="svt-checks" id="svt-agent-checks"></div>
            <div class="svt-agent-actions">
              <button class="svt-btn primary svt-hidden" id="svt-check-again">Check again</button>
              <button class="svt-link svt-hidden" id="svt-new-agent">Pair a new agent</button>
            </div>
          </div>

          <div class="svt-panel svt-hidden" id="svt-paste-panel">
            <h4>PRACTICE CHECK (OFFLINE)</h4>
            <div class="svt-prompt">${this._escape(PASTE_PROMPTS[this.station.id] || 'Run the command and paste its output.')}</div>
            <div class="svt-terminal">
              <textarea class="svt-paste" id="svt-input" spellcheck="false" placeholder="Paste your terminal output here..."></textarea>
            </div>
            <div class="svt-hint">
              Paste terminal output for practice feedback. This page cannot confirm that a command ran on your computer. Never paste passwords, tokens, or private keys.
            </div>
            <div class="svt-status" id="svt-status"></div>
            <div class="svt-checks" id="svt-checks"></div>
          </div>
        </div>

        <div class="svt-actions">
          <button class="svt-btn" id="svt-cancel">Not Now</button>
          <button class="svt-btn primary svt-hidden" id="svt-run" disabled>Verify Output</button>
        </div>
      </div>
    `;

    document.body.appendChild(this.overlay);

    this.logEl = this.overlay.querySelector('#svt-log');
    this.statusEl = this.overlay.querySelector('#svt-status');
    this.checksEl = this.overlay.querySelector('#svt-checks');
    this.inputEl = this.overlay.querySelector('#svt-input');
    this.runBtn = this.overlay.querySelector('#svt-run');

    this.overlay.querySelector('#svt-close').onclick = () => this._close();
    this.overlay.querySelector('#svt-cancel').onclick = () => this._close();
    this.runBtn.onclick = () => this._attemptVerify();

    this.inputEl.addEventListener('input', () => {
      this.runBtn.disabled = this.inputEl.value.trim().length === 0;
    });

    this.agentStatusEl = this.overlay.querySelector('#svt-agent-status');
    this.agentChecksEl = this.overlay.querySelector('#svt-agent-checks');
    this.getCodeBtn = this.overlay.querySelector('#svt-get-code');
    this.getCodeBtn.onclick = () => this._startAgentSession();
    this.overlay.querySelector('#svt-copy-code').onclick = () => this._copyCode();
    // Every command's Copy button copies the command shown right next to it.
    this.overlay.addEventListener('click', (event) => {
      const copyButton = event.target.closest('.svt-copy');
      if (copyButton) copyToClipboard(copyButton.previousElementSibling.textContent, copyButton);
    });
    this.checkAgainBtn = this.overlay.querySelector('#svt-check-again');
    this.checkAgainBtn.onclick = () => this._askAgentToCheck(this.session.sessionId);
    this.overlay.querySelector('#svt-new-agent').onclick = () => {
      forgetPairedSessionId();
      this._startAgentSession();
    };

    // An agent paired at an earlier station keeps working here: no new code needed.
    const pairedSessionId = loadPairedSessionId();
    if (pairedSessionId) {
      this._askAgentToCheck(pairedSessionId);
    } else {
      this._showPairingStart();
    }
  }

  _show(selector, visible) {
    this.overlay?.querySelector(selector)?.classList.toggle('svt-hidden', !visible);
  }

  _showPairingStart(message) {
    this._stopPolling();
    this.session = null;
    this._show('#svt-agent-start', true);
    this._show('#svt-agent-pairing', false);
    this._show('#svt-check-again', false);
    this._show('#svt-new-agent', false);
    this.getCodeBtn.disabled = false;
    this._renderChecks([], this.agentChecksEl);
    this._setAgentStatus(message ? 'err' : '', message || '');
  }

  /** Points the already-paired agent at this station, then waits for its results. */
  async _askAgentToCheck(sessionId) {
    this._stopPolling();
    this._show('#svt-agent-start', false);
    this._show('#svt-agent-pairing', false);
    this._show('#svt-check-again', false);
    this._renderChecks([], this.agentChecksEl);
    this._setAgentStatus('pending', 'Asking your agent to check this station...');
    try {
      this.session = await requestStationCheck(sessionId, this.station.id);
    } catch (error) {
      if (!this.overlay) return;
      console.warn('[StationVerificationTrial] paired agent unavailable:', error);
      forgetPairedSessionId();
      this._showPairingStart("Your agent isn't connected anymore. Get a new pairing code and run the agent again.");
      return;
    }
    if (!this.overlay) return;
    this._show('#svt-new-agent', true);
    this.checkingSince = Date.now();
    this._setAgentStatus('pending', 'Your agent is running the checks...');
    this.pollTimer = setInterval(() => this._pollSession(), POLL_INTERVAL_MS);
  }

  /** Asks the backend for a single-use pairing code bound to this student; it covers the whole trail. */
  async _startAgentSession() {
    this._stopPolling();
    this._show('#svt-agent-start', true);
    this._show('#svt-check-again', false);
    this._show('#svt-new-agent', false);
    this.getCodeBtn.disabled = true;
    this._setAgentStatus('pending', 'Getting a pairing code...');
    this._renderChecks([], this.agentChecksEl);
    let session;
    try {
      session = await startToolchainSession(this.station.id);
    } catch (error) {
      if (!this.overlay) return;
      console.warn('[StationVerificationTrial] could not start an agent session:', error);
      this.getCodeBtn.disabled = false;
      this._showStuckHelp(stuckHelpFor(error, { localBackend: usesLocalBackend() }));
      this._showPasteFallback();
      return;
    }
    if (!this.overlay) return; // closed while waiting

    this.session = session;
    savePairedSessionId(session.sessionId);
    this.checkingSince = null;
    this._show('#svt-agent-start', false);
    this._show('#svt-agent-pairing', true);
    const codeEl = this.overlay.querySelector('#svt-code');
    codeEl.value = session.pairingCode;
    codeEl.select();
    this._startCountdown(new Date(session.expiresAt).getTime());
    this._setAgentStatus('pending', 'Waiting for the agent to pair...');
    this.pollTimer = setInterval(() => this._pollSession(), POLL_INTERVAL_MS);
  }

  async _pollSession() {
    const session = this.session;
    if (!session || !this.overlay) return;
    let view;
    try {
      view = await getToolchainSession(session.sessionId);
    } catch (error) {
      // Keep polling: one failed check (Wi-Fi blip, server restart) should not end the wait.
      console.warn('[StationVerificationTrial] could not check the station:', error);
      return;
    }
    if (this.session !== session || !this.overlay) return;

    if (view.stationId !== this.station.id) return; // another tab moved the agent elsewhere

    switch (view.status) {
      case 'WAITING_FOR_AGENT':
        break;
      case 'CHECKING':
        if (this.checkingSince === null) {
          // Just paired: the agent is already running this station's checks.
          this.checkingSince = Date.now();
          this._stopCountdown('Code used. The agent is paired and running in the background.');
          this._show('#svt-new-agent', true);
        }
        this._setAgentStatus('pending', Date.now() - this.checkingSince > SILENT_AGENT_HINT_MS
          ? 'No answer from your agent yet. If you stopped it or restarted your computer, use Pair a new agent.'
          : 'Your agent is running the checks...');
        break;
      case 'FAILED': {
        this._stopCountdown('Code used. The agent is paired and running in the background.');
        const checks = view.checks || [];
        const passed = checks.filter((c) => c.passed).length;
        this._renderChecks(checks, this.agentChecksEl);
        this._setAgentStatus('err', `${passed}/${checks.length} checks passed. Fix the ✗ items, then click Check again.`);
        this._show('#svt-check-again', true);
        this._show('#svt-new-agent', true);
        break;
      }
      case 'VERIFIED':
        this._stopPolling();
        this._renderChecks(view.checks || [], this.agentChecksEl);
        this._succeed(this.agentStatusEl);
        break;
      case 'EXPIRED':
        forgetPairedSessionId();
        this.getCodeBtn.textContent = 'Get a new code';
        this._showPairingStart('The pairing code expired before the agent used it. Get a new code.');
        break;
      case 'AGENT_EXPIRED':
        forgetPairedSessionId();
        this._showPairingStart('Your agent pairing has ended. Get a new pairing code and run the agent again.');
        break;
      default:
        break;
    }
  }

  _startCountdown(expiresAtMs) {
    const expiryEl = this.overlay.querySelector('#svt-code-expiry');
    const tick = () => {
      const seconds = Math.max(0, Math.round((expiresAtMs - Date.now()) / 1000));
      expiryEl.textContent = seconds > 0
        ? `Works once. Expires in ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}.`
        : 'Expired.';
    };
    tick();
    this.countdownTimer = setInterval(tick, 1000);
  }

  _stopCountdown(message) {
    clearInterval(this.countdownTimer);
    this.countdownTimer = null;
    const expiryEl = this.overlay?.querySelector('#svt-code-expiry');
    if (expiryEl && message) expiryEl.textContent = message;
  }

  _stopPolling() {
    clearInterval(this.pollTimer);
    this.pollTimer = null;
    this._stopCountdown();
  }

  async _copyCode() {
    const codeEl = this.overlay?.querySelector('#svt-code');
    if (!codeEl?.value) return;
    const copied = await copyToClipboard(codeEl.value, this.overlay.querySelector('#svt-copy-code'));
    if (!copied) codeEl.select(); // clipboard blocked; leave it selected for Ctrl/Cmd+C
  }

  _showPasteFallback() {
    const pastePanel = this.overlay?.querySelector('#svt-paste-panel');
    if (!pastePanel) return;
    pastePanel.classList.remove('svt-hidden');
    this.runBtn?.classList.remove('svt-hidden');
    // The panel opens below the fold on small windows; bring it into view so the next step is visible.
    pastePanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  _setAgentStatus(kind, text) {
    this._setStatus(kind, text, this.agentStatusEl);
  }

  /** Shared success path for the agent and the practice check. */
  _succeed(statusEl) {
    if (this.verified) return;
    this._setStatus('ok', '✓ Verified! Unlocking next station...', statusEl);
    this.verified = true;
    setTimeout(() => {
      this.onComplete({ stationId: this.station.id });
      this._close(false);
    }, 1200);
  }

  async _attemptVerify() {
    const pasted = this.inputEl.value;
    if (!pasted.trim()) return;

    this._setStatus('pending', 'Checking your output...');
    this._renderChecks([]);
    this.runBtn.disabled = true;
    await new Promise((r) => setTimeout(r, 300));

    const result = verifyStationOutput(this.station.id, pasted, { os: this.os });
    this._renderChecks(result.checks);

    if (result.ok) {
      this._succeed(this.statusEl);
    } else {
      const passed = result.checks.filter((c) => c.passed).length;
      const total = result.checks.length;
      this._setStatus(
        'err',
        total > 0
          ? `${passed}/${total} checks passed. Fix the ✗ items and paste again.`
          : result.summary,
      );
      this.runBtn.disabled = false;
      this.inputEl.focus();
    }
  }
  _renderChecks(checks = [], target = this.checksEl) {
    if (!target) return;
    target.innerHTML = checks.map((c) => {
      // A failed check shows its exact fix commands; the server's one-line hint is the fallback.
      const fixSteps = c.passed ? '' : this._renderFixSteps(c.id);
      const hint = !c.passed && !fixSteps && c.detail ? `<span class="svt-check-detail">${this._escape(c.detail)}</span>` : '';
      return `
      <div class="svt-check ${c.passed ? 'pass' : 'fail'}">
        ${c.passed ? '✓' : '✗'} ${this._escape(c.label)}
        ${hint}${fixSteps}
      </div>`;
    }).join('');
  }

  /** The exact commands that fix a failed check on this student's OS (see data/toolchainTrailFixes.js). */
  _renderFixSteps(checkId) {
    const steps = fixStepsFor(checkId, this.os, agentCommands(this.os)[0].command);
    if (steps.length === 0) return '';
    return `<ol class="svt-fix">${steps.map((step) => `<li>${this._renderStep(step)}</li>`).join('')}</ol>`;
  }

  /** Shows what to do next when no pairing code could be made (see STUCK_HELP). */
  _showStuckHelp(help) {
    const [summary, ...steps] = help;
    this._setAgentStatus('err', summary);
    this.agentChecksEl.innerHTML = `<ol class="svt-fix">${steps.map((step) => `<li>${this._renderStep(step)}</li>`).join('')}</ol>`;
  }

  _appendLog(line) {
    if (!this.logEl) return;
    this.logEl.textContent += `\n${line}`;
    this.logEl.scrollTop = this.logEl.scrollHeight;
  }

  _setStatus(kind, text, target = this.statusEl) {
    if (!target) return;
    target.className = `svt-status ${kind}`;
    target.textContent = text;
  }

  _close(callCallback = true) {
    this._stopPolling();
    this.session = null;
    this.overlay?.remove();
    this.overlay = null;
    if (callCallback && !this.verified) {
      this.onClose?.();
    }
  }

  destroy() {
    this._close(false);
  }

  /** A step is plain text, or { text, commands } with a Copy button per command. */
  _renderStep(step) {
    if (typeof step === 'string') return this._escape(step);
    return this._escape(step.text) + (step.commands || []).map((command) => this._commandRow(command)).join('');
  }

  _commandRow(command) {
    return `<div class="svt-cmdrow"><code>${this._escape(command)}</code>`
      + `<button type="button" class="svt-copy" aria-label="Copy command">Copy</button></div>`;
  }

  _escape(value = '') {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
}
