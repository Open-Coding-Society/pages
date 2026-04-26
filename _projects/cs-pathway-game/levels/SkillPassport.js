/**
 * SkillPassport
 * -------------
 * Opens a full-screen modal overlay inside the game that displays a player's
 * skill snapshot history fetched from the Python backend.
 *
 * The modal is styled like a physical passport — deep green cover, gold accents,
 * machine-readable zone, and tabbed pages for Skills and History.
 *
 * The modal contains two pages:
 *   1. Skills — progress bars for the latest snapshot's four skill values
 *   2. History — every past project snapshot listed as a passport entry
 *
 * Usage (from GameLevelCsPath1Way.js):
 *   const passport = new SkillPassport({ pythonURI, fetchOptions, onClose });
 *   passport.start();
 */
export default class SkillPassport {

  /**
   * @param {string}   pythonURI    - Base URL of the Python/Flask backend
   * @param {object}   fetchOptions - Shared fetch config (credentials, headers, etc.)
   * @param {function} onClose      - Callback fired when the modal is closed
   */
  constructor({ pythonURI, fetchOptions, onClose }) {
    this.pythonURI = pythonURI;
    this.fetchOptions = fetchOptions;
    this.onClose = onClose;
    this.overlay = null;
  }

  /**
   * start()
   * Fetches the current user's skill snapshots from the backend,
   * then hands them off to _render() to build the modal.
   */
async start() {
  try {
    const resp = await fetch(`${this.pythonURI}/api/user/skill-passport`, this.fetchOptions);
    if (!resp.ok) throw new Error(`Server returned ${resp.status}`);
    const data = await resp.json();
    // The endpoint returns { history: [...], current_skills: {...}, ... }
    // so we pull out the history array to pass to _render
    this._render(data.history ?? []);
  } catch (err) {
    console.error('SkillPassport fetch failed:', err);
    // Still open the modal so the player sees something instead of nothing
    this._render([]);
  }
}
  /**
   * _render(snapshots)
   * Builds and injects the passport-styled full-screen overlay into the page.
   *
   * @param {Array} snapshots - All skill snapshots for the current user
   */
  _render(snapshots) {
    // The backend field names and their human-readable display labels
    const skills = ['coding_ability', 'collaboration', 'problem_solving', 'initiative'];
    const labels = ['Coding Ability', 'Collaboration', 'Problem Solving', 'Initiative'];

    // Use the most recent snapshot for the skills page
    const latest = snapshots.at(-1) ?? {};

    const issueDate = new Date().toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    }).toUpperCase();

    // Create the darkened full-screen backdrop
    this.overlay = document.createElement('div');
    this.overlay.style.cssText = `
      position: fixed; inset: 0; background: rgba(0,0,0,0.88);
      z-index: 9999; display: flex; align-items: center;
      justify-content: center; font-family: Georgia, serif;
    `;

    this.overlay.innerHTML = `
      <style>
        .sp-passport { width: 520px; background: #1e3a2f; border-radius: 8px; border: 2px solid #2d5440; margin: auto; }        .sp-cover-row { display: flex; align-items: flex-start; justify-content: space-between; }
        .sp-titles { text-align: center; flex: 1; }
        .sp-country { font-size: 10px; letter-spacing: 3px; color: #c9a84c; text-transform: uppercase; margin-bottom: 4px; }
        .sp-doctype { font-size: 20px; font-weight: bold; color: #e8dcc8; letter-spacing: 2px; margin-bottom: 2px; }
        .sp-subtitle { font-size: 10px; color: #8fa898; letter-spacing: 1.5px; text-transform: uppercase; }
        .sp-holder { padding: 10px 28px 12px; border-bottom: 1px solid #2d5440; display: flex; justify-content: space-between; align-items: flex-end; }
        .sp-field label { font-size: 8px; letter-spacing: 2px; color: #8fa898; text-transform: uppercase; display: block; margin-bottom: 2px; }
        .sp-field span { font-size: 13px; color: #e8dcc8; font-family: 'Courier New', monospace; }
        .sp-nav { display: flex; gap: 8px; padding: 10px 20px; border-bottom: 1px solid #2d5440; justify-content: center; }
        .sp-btn { background: none; border: 1px solid #2d5440; color: #8fa898; font-size: 10px; padding: 4px 14px; border-radius: 3px; cursor: pointer; font-family: 'Courier New', monospace; letter-spacing: 1px; transition: all 0.15s; }
        .sp-btn:hover { border-color: #c9a84c; color: #c9a84c; }
        .sp-btn.active { border-color: #c9a84c; color: #c9a84c; }
        .sp-page { display: none; }
        .sp-page.active { display: block; }
        .sp-page-inner { padding: 16px 28px; }
        .sp-page-title { font-size: 9px; letter-spacing: 2px; color: #c9a84c; text-transform: uppercase; margin-bottom: 14px; border-bottom: 1px solid #2d5440; padding-bottom: 6px; }
        .sp-skill-row { margin-bottom: 12px; }
        .sp-skill-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
        .sp-skill-name { font-size: 12px; color: #c8d8cc; }
        .sp-skill-val { font-size: 12px; color: #c9a84c; font-family: 'Courier New', monospace; }
        .sp-track { height: 5px; background: #0f2318; border-radius: 3px; overflow: hidden; }
        .sp-fill { height: 100%; background: #c9a84c; border-radius: 3px; }
        .sp-entry { display: flex; gap: 12px; align-items: flex-start; margin-bottom: 10px; }
        .sp-entry-stamp { width: 40px; border: 1.5px solid #4a9e6b; border-radius: 3px; padding: 4px 5px; text-align: center; flex-shrink: 0; }
        .sp-entry-stamp-date { font-size: 7px; color: #4a9e6b; font-family: 'Courier New', monospace; display: block; }
        .sp-entry-stamp-word { font-size: 8px; color: #4a9e6b; font-weight: bold; font-family: 'Courier New', monospace; display: block; }
        .sp-entry-info { flex: 1; }
        .sp-entry-project { font-size: 13px; color: #e8dcc8; margin-bottom: 3px; }
        .sp-entry-scores { font-size: 10px; color: #8fa898; font-family: 'Courier New', monospace; }
        .sp-empty { font-size: 12px; color: #4d7a60; text-align: center; padding: 16px 0; font-family: 'Courier New', monospace; }
        .sp-close-row { padding: 10px 20px; border-top: 1px solid #2d5440; text-align: center; }
        .sp-close-btn { background: none; border: 1px solid #2d5440; color: #8fa898; font-size: 11px; padding: 6px 28px; border-radius: 3px; cursor: pointer; font-family: 'Courier New', monospace; letter-spacing: 1px; transition: all 0.15s; }
        .sp-close-btn:hover { border-color: #c45c4a; color: #c45c4a; }
      </style>

      <div class="sp-passport">

        <!-- Cover / Header -->
        <div class="sp-cover">
          <div class="sp-cover-row">
            <svg width="48" height="48" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="22" fill="none" stroke="#c9a84c" stroke-width="1.5"/>
              <circle cx="24" cy="24" r="16" fill="none" stroke="#c9a84c" stroke-width="0.75" stroke-dasharray="3 2"/>
              <text x="24" y="29" text-anchor="middle" font-size="13" fill="#c9a84c" font-family="Georgia">&#9670;</text>
            </svg>
            <div class="sp-titles">
              <div class="sp-country">Open Coding Society</div>
              <div class="sp-doctype">SKILL PASSPORT</div>
              <div class="sp-subtitle">CS Pathway · Wayfinding World</div>
            </div>
            <svg width="48" height="48" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="22" fill="none" stroke="#c9a84c" stroke-width="1.5"/>
              <circle cx="24" cy="24" r="16" fill="none" stroke="#c9a84c" stroke-width="0.75" stroke-dasharray="3 2"/>
              <text x="24" y="29" text-anchor="middle" font-size="13" fill="#c9a84c" font-family="Georgia">&#9670;</text>
            </svg>
          </div>
        </div>

        <!-- Holder info row -->
        <div class="sp-holder">
          <div class="sp-field">
            <label>Holder</label>
            <span>ADVENTURER</span>
          </div>
          <div class="sp-field" style="text-align:center">
            <label>Class</label>
            <span>CSSE · 2026</span>
          </div>
          <div class="sp-field" style="text-align:right">
            <label>Issued</label>
            <span>${issueDate}</span>
          </div>
        </div>

        <!-- Page tabs -->
        <div class="sp-nav">
          <button class="sp-btn active" onclick="spShowPage('skills', this)">Skills</button>
          <button class="sp-btn" onclick="spShowPage('history', this)">History</button>
        </div>

        <!-- Skills page: progress bars from latest snapshot -->
        <div class="sp-page active" id="sp-page-skills">
          <div class="sp-page-inner">
            <div class="sp-page-title">Latest Snapshot · Skill Levels</div>
            ${skills.map((k, i) => {
              const val = latest[k] ?? 1;
              const pct = Math.round((val - 1) / 5 * 100);
              return `
                <div class="sp-skill-row">
                  <div class="sp-skill-top">
                    <span class="sp-skill-name">${labels[i]}</span>
                    <span class="sp-skill-val">${val} / 6</span>
                  </div>
                  <div class="sp-track">
                    <div class="sp-fill" style="width:${pct}%"></div>
                  </div>
                </div>`;
            }).join('')}
          </div>
        </div>

        <!-- History page: all snapshots listed as passport entry stamps -->
        <div class="sp-page" id="sp-page-history">
          <div class="sp-page-inner">
            <div class="sp-page-title">Travel Log · Project History</div>
            ${snapshots.length === 0
              ? `<div class="sp-empty">No entries yet. Complete a project to get started.</div>`
              : [...snapshots].reverse().map((snap, idx) => {
                  const date = snap.created_at
                    ? new Date(snap.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }).toUpperCase()
                    : '---';
                  // Compact score summary: C:5 · P:6 · T:4 · I:3
                  const scoreStr = skills.map((k, i) => {
                    const abbr = labels[i].charAt(0);
                    return `${abbr}:${snap[k] ?? 1}`;
                  }).join(' · ');
                  // Alternate stamp color between green and blue
                  const color = idx % 2 === 0 ? '#4a9e6b' : '#5a8fc9';
                  const rotate = idx % 2 === 0 ? '-2deg' : '2deg';
                  return `
                    <div class="sp-entry">
                      <div class="sp-entry-stamp" style="border-color:${color}; transform:rotate(${rotate})">
                        <span class="sp-entry-stamp-date" style="color:${color}">${date}</span>
                        <span class="sp-entry-stamp-word" style="color:${color}">ENTRY</span>
                      </div>
                      <div class="sp-entry-info">
                        <div class="sp-entry-project">${snap.project_name ?? 'Untitled'}</div>
                        <div class="sp-entry-scores">${scoreStr}</div>
                      </div>
                    </div>`;
                }).join('')
            }
          </div>

          </div>

        <!-- Close button -->
        <div class="sp-close-row">
            <button class="sp-close-btn" id="sp-close">Close Passport</button>
        </div>

        </div>

    `;

    document.body.appendChild(this.overlay);

    // Wire up close button
    this.overlay.querySelector('#sp-close').onclick = () => this._close();

    // Expose tab switcher globally so inline onclick handlers can reach it
    window.spShowPage = (name, btn) => {
      this.overlay.querySelectorAll('.sp-page').forEach(p => p.classList.remove('active'));
      this.overlay.querySelectorAll('.sp-btn').forEach(b => b.classList.remove('active'));
      this.overlay.querySelector(`#sp-page-${name}`).classList.add('active');
      btn.classList.add('active');
    };
  }

  /**
   * _close()
   * Removes the overlay from the DOM, cleans up the global tab helper,
   * and fires the onClose callback so the game level knows it's dismissed.
   */
  _close() {
    this.overlay?.remove();
    delete window.spShowPage;
    this.onClose?.();
  }
}