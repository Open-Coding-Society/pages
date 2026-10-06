/**
 * StationVerificationTrial
 * ------------------------
 * The "go run a real terminal command" screen described in
 * game-progression-plan.md section 1:
 *
 *   1. Game shows a short instruction + narrative hook.
 *   2. Student goes to the terminal and runs the real command.
 *   3. A lightweight local agent/script watches for the result and sends
 *      a signed payload to the backend.
 *   4. Backend validates it against the student's current required step.
 *   5. Valid → station complete, NPC fun-fact popup, next station unlocks.
 *      Invalid/missing → nothing unlocks.
 *
 * WIRING NOTE (read this before shipping):
 *   No backend "terminal agent" endpoint exists yet, so this trial ships
 *   with a CLIENT-SIDE MOCK terminal: the student types the expected
 *   command into a fake shell and it's checked against a regex. This is
 *   enough to demo the full station flow end-to-end today.
 *
 *   To wire up the real thing later, replace `_mockVerify()` with a call
 *   to your real verification endpoint, e.g.:
 *
 *     const res = await fetch(`${pythonURI}/api/toolchain/verify`, {
 *       ...fetchOptions,
 *       method: 'POST',
 *       body: JSON.stringify({ stationId: this.station.id }),
 *     });
 *     const { verified } = await res.json();
 *
 *   and poll it (or push to it via websocket) instead of checking the
 *   typed string client-side. The `onComplete` / `onClose` contract below
 *   will not need to change.
 *
 * Visual language: dark space/cockpit terminal, cyan/violet glow, matches
 * the space theme requested for Level 2 while keeping the same
 * overlay/card structure as CourseEnlistmentTrial / PersonaHallTrial /
 * AboutMeBuilder so it feels native to the existing engine.
 */

export default class StationVerificationTrial {
  /**
   * @param {Object} opts
   * @param {Object} opts.station - station descriptor, see GameLevelCsPath2Toolchain.js STATIONS
   * @param {string} opts.station.id
   * @param {string} opts.station.name - in-world display name (e.g. "Terminal Town Gate")
   * @param {string} opts.station.skill - real-world skill label (e.g. "Shell fundamentals and package management")
   * @param {string} opts.station.narrativeHook - 1-2 sentence flavor text shown before the terminal
   * @param {string[]} opts.station.instructions - ordered list of real-world steps to show the student
   * @param {RegExp} opts.station.expectedCommandPattern - pattern the mock terminal checks input against
   * @param {string} opts.station.exampleCommand - a valid example command (shown as a hint)
   * @param {string} opts.station.funFact - fun fact shown by the NPC popup on success (level owns the popup, not this trial)
   * @param {Function} [opts.onComplete] - called with { stationId } when verified
   * @param {Function} [opts.onClose] - called when the student closes without completing
   */
  constructor({ station, onComplete, onClose } = {}) {
    this.station = station || {};
    this.onComplete = onComplete || (() => {});
    this.onClose = onClose || (() => {});
    this.overlay = null;
    this.verified = false;
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
          z-index: 9999;
          background: radial-gradient(circle at 50% 20%, rgba(30,10,60,0.92), rgba(2,2,10,0.97));
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Courier New", monospace;
          color: #dbeafe;
        }

        .svt-modal {
          width: min(880px, 94vw);
          max-height: 90vh;
          overflow: hidden;
          background: linear-gradient(180deg, #0b1026, #030410);
          border: 2px solid #7dd3fc;
          border-radius: 16px;
          box-shadow: 0 0 40px rgba(125, 211, 252, 0.35), 0 0 90px rgba(139, 92, 246, 0.15);
          display: flex;
          flex-direction: column;
        }

        .svt-header {
          padding: 16px 22px;
          border-bottom: 1px solid rgba(125, 211, 252, 0.35);
          background: rgba(8, 12, 32, 0.9);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .svt-title {
          font-size: 20px;
          font-weight: bold;
          color: #67e8f9;
          letter-spacing: 0.5px;
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
          padding: 18px 22px;
          overflow: auto;
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 18px;
        }

        .svt-panel {
          background: rgba(10, 14, 36, 0.85);
          border: 1px solid rgba(125, 211, 252, 0.25);
          border-radius: 12px;
          padding: 14px;
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
          padding: 14px 22px;
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

        @media (max-width: 760px) {
          .svt-body { grid-template-columns: 1fr; }
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
              ${instructions.map((step) => `<li>${this._escape(step)}</li>`).join('')}
            </ol>
          </div>

          <div class="svt-panel">
            <h4>SHIP TERMINAL (demo mode)</h4>
            <div class="svt-terminal">
              <div class="svt-terminal-log" id="svt-log">Awaiting real terminal action...\nType the command below and press Enter to simulate it.</div>
              <div class="svt-terminal-row">
                <span>&gt;</span>
                <input id="svt-input" type="text" autocomplete="off" spellcheck="false" placeholder="type command here..." />
              </div>
            </div>
            <div class="svt-hint">
              Hint: try something like <code>${this._escape(this.station.exampleCommand || '')}</code><br/>
              In production this panel is replaced by a real signal from a local terminal-watching agent — see the
              comment at the top of StationVerificationTrial.js.
            </div>
            <div class="svt-status" id="svt-status"></div>
          </div>
        </div>

        <div class="svt-actions">
          <button class="svt-btn" id="svt-cancel">Not Now</button>
          <button class="svt-btn primary" id="svt-run" disabled>Verify Command</button>
        </div>
      </div>
    `;

    document.body.appendChild(this.overlay);

    this.logEl = this.overlay.querySelector('#svt-log');
    this.statusEl = this.overlay.querySelector('#svt-status');
    this.inputEl = this.overlay.querySelector('#svt-input');
    this.runBtn = this.overlay.querySelector('#svt-run');

    this.overlay.querySelector('#svt-close').onclick = () => this._close();
    this.overlay.querySelector('#svt-cancel').onclick = () => this._close();
    this.runBtn.onclick = () => this._attemptVerify();

    this.inputEl.addEventListener('input', () => {
      this.runBtn.disabled = this.inputEl.value.trim().length === 0;
    });
    this.inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !this.runBtn.disabled) {
        this._attemptVerify();
      }
    });

    this.inputEl.focus();
  }

  async _attemptVerify() {
    const typed = this.inputEl.value.trim();
    if (!typed) return;

    this._appendLog(`$ ${typed}`);
    this._setStatus('pending', 'Contacting verification agent...');
    this.runBtn.disabled = true;

    // Small delay so it reads like a real round-trip to a backend/agent.
    await new Promise((r) => setTimeout(r, 450));

    const ok = await this._mockVerify(typed);

    if (ok) {
      this._appendLog('✓ Signal received — station verified.');
      this._setStatus('ok', '✓ Verified! Unlocking next station...');
      this.verified = true;
      setTimeout(() => {
        this.onComplete({ stationId: this.station.id });
        this._close(false);
      }, 700);
    } else {
      this._appendLog('✗ No matching signal detected. Try again.');
      this._setStatus('err', 'Not verified yet — check the mission briefing and try again.');
      this.runBtn.disabled = false;
      this.inputEl.value = '';
      this.inputEl.focus();
    }
  }

  /**
   * Client-side mock check. Swap this out for a real backend call — see
   * the file-level comment for the exact shape to use.
   * @private
   */
  async _mockVerify(typed) {
    const pattern = this.station.expectedCommandPattern;
    if (!pattern) return true; // stations without a pattern always pass (safety fallback)
    try {
      return pattern.test(typed);
    } catch (_) {
      return false;
    }
  }

  _appendLog(line) {
    if (!this.logEl) return;
    this.logEl.textContent += `\n${line}`;
    this.logEl.scrollTop = this.logEl.scrollHeight;
  }

  _setStatus(kind, text) {
    if (!this.statusEl) return;
    this.statusEl.className = `svt-status ${kind}`;
    this.statusEl.textContent = text;
  }

  _close(callCallback = true) {
    this.overlay?.remove();
    this.overlay = null;
    if (callCallback && !this.verified) {
      this.onClose?.();
    }
  }

  destroy() {
    this._close(false);
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
