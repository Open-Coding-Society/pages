/**
 * SkillPassport
 * -------------
 * Opens a full-screen modal overlay inside the game that displays a player's
 * skill snapshot history fetched from the Python backend.
 *
 * The modal contains three sections:
 *   1. A radar (spider) chart showing the latest snapshot's skill shape
 *   2. Progress bars showing each skill's value from the latest snapshot
 *   3. A timeline of every past project snapshot, newest first
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
    this.overlay = null; // will hold the DOM element once rendered
  }

  /**
   * start()
   * Fetches the current user's skill snapshots from the backend,
   * then hands them off to _render() to build the modal.
   */
  async start() {
    const resp = await fetch(`${this.pythonURI}/api/user/skill-snapshot`, this.fetchOptions);
    const snapshots = await resp.json(); // array of snapshot objects from the DB
    this._render(snapshots);
  }

  /**
   * _render(snapshots)
   * Builds and injects the full-screen overlay into the page.
   * Uses the most recent snapshot for the chart and bars,
   * and passes all snapshots to the timeline.
   *
   * @param {Array} snapshots - All skill snapshots for the current user
   */
  _render(snapshots) {
    // Create the darkened full-screen backdrop
    this.overlay = document.createElement('div');
    this.overlay.style.cssText = `
      position: fixed; inset: 0; background: rgba(0,0,0,0.85);
      z-index: 9999; display: flex; align-items: center;
      justify-content: center; font-family: sans-serif;
    `;

    // Use the most recent snapshot for the chart and bars.
    // Fall back to an empty object if there are no snapshots yet.
    const latest = snapshots.at(-1) ?? {};

    // The backend field names and their human-readable display labels
    const skills = ['coding_ability', 'collaboration', 'problem_solving', 'initiative'];
    const labels = ['Coding', 'Collaboration', 'Problem Solving', 'Initiative'];

    // Pre-build the radar SVG so it can be injected as a string below
    const radarSVG = this._buildRadar(latest, skills, labels);

    // Build the modal card with three sections: radar, bars, timeline
    this.overlay.innerHTML = `
      <div style="background:#1e1e2e; border-radius:16px; padding:32px;
                  max-width:700px; width:90%; max-height:85vh; overflow-y:auto;
                  border: 1px solid #4f46e5;">

        <!-- Header row: title + close button -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px">
          <h2 style="color:#e2e8f0; font-size:22px; margin:0">🎖 Skill Passport</h2>
          <button id="sp-close" style="background:none; border:none; color:#94a3b8;
            font-size:20px; cursor:pointer">✕</button>
        </div>

        <!-- Section 1 & 2: Radar chart + progress bars displayed side by side -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-bottom:28px">
          <div>${radarSVG}</div>
          <div>${this._buildBars(latest, skills, labels)}</div>
        </div>

        <!-- Section 3: Project history timeline -->
        <h3 style="color:#94a3b8; font-size:14px; margin-bottom:12px; text-transform:uppercase; letter-spacing:.05em">
          Project History
        </h3>
        ${this._buildTimeline(snapshots, skills, labels)}
      </div>
    `;

    // Add the overlay to the page and wire up the close button
    document.body.appendChild(this.overlay);
    this.overlay.querySelector('#sp-close').onclick = () => this._close();
  }

  /**
   * _buildRadar(snapshot, skills, labels)
   * Generates an SVG radar (spider) chart for a single snapshot.
   * Each skill occupies one axis; the filled polygon shows the player's shape.
   *
   * Skills are scored 1–6, normalized to 0–1 for plotting.
   *
   * @param {object}   snapshot - A single skill snapshot object
   * @param {string[]} skills   - Backend field names (e.g. 'coding_ability')
   * @param {string[]} labels   - Display names shown around the chart
   * @returns {string} Raw SVG markup
   */
  _buildRadar(snapshot, skills, labels) {
    const cx = 110, cy = 110, r = 80, n = skills.length;

    // Normalize a skill value from the 1–6 scale to a 0–1 ratio for the chart
    const val = (k) => ((snapshot[k] ?? 1) - 1) / 5;

    // Convert a skill index + radius into an (x, y) SVG coordinate.
    // Skills are evenly spaced around the circle, starting from the top (−π/2).
    const angleOf = i => (Math.PI * 2 * i / n) - Math.PI / 2;
    const point = (i, radius) => {
      const a = angleOf(i);
      return [cx + radius * Math.cos(a), cy + radius * Math.sin(a)];
    };

    // Background grid rings at 25%, 50%, 75%, and 100% of the max radius
    const rings = [0.25, 0.5, 0.75, 1].map(scale => {
      const pts = skills.map((_, i) => point(i, r * scale).join(',')).join(' ');
      return `<polygon points="${pts}" fill="none" stroke="#334155" stroke-width="1"/>`;
    }).join('');

    // Axis lines radiating from the center to each skill's outer point
    const axes = skills.map((_, i) => {
      const [x, y] = point(i, r);
      return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#334155" stroke-width="1"/>`;
    }).join('');

    // The filled polygon representing the player's actual skill values
    const dataPts = skills.map((k, i) => point(i, r * val(k)).join(',')).join(' ');

    // Skill name labels placed just outside each axis tip
    const labelEls = labels.map((lbl, i) => {
      const [x, y] = point(i, r + 18);
      return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central"
        font-size="11" fill="#94a3b8">${lbl}</text>`;
    }).join('');

    return `<svg viewBox="0 0 220 220" width="100%" style="max-width:220px">
      ${rings}${axes}
      <polygon points="${dataPts}" fill="rgba(99,102,241,0.35)" stroke="#6366f1" stroke-width="2"/>
      ${labelEls}
    </svg>`;
  }

  /**
   * _buildBars(snapshot, skills, labels)
   * Renders a horizontal progress bar for each skill based on the latest snapshot.
   * Each bar shows the numeric value (e.g. "5/6") and fills proportionally.
   *
   * @param {object}   snapshot - A single skill snapshot object
   * @param {string[]} skills   - Backend field names
   * @param {string[]} labels   - Display names
   * @returns {string} HTML markup for all four bars
   */
  _buildBars(snapshot, skills, labels) {
    return labels.map((lbl, i) => {
      const val = snapshot[skills[i]] ?? 1;
      // Convert 1–6 to a percentage width for the filled bar
      const pct = Math.round((val - 1) / 5 * 100);
      return `
        <div style="margin-bottom:14px">
          <div style="display:flex; justify-content:space-between; margin-bottom:4px">
            <span style="color:#cbd5e1; font-size:13px">${lbl}</span>
            <span style="color:#6366f1; font-size:13px; font-weight:600">${val}/6</span>
          </div>
          <!-- Track (background) + fill (foreground) -->
          <div style="background:#1e293b; border-radius:4px; height:8px; overflow:hidden">
            <div style="background:#6366f1; width:${pct}%; height:100%;
              border-radius:4px; transition:width .4s"></div>
          </div>
        </div>`;
    }).join('');
  }

  /**
   * _buildTimeline(snapshots, skills, labels)
   * Renders every project snapshot as a card in reverse-chronological order
   * (newest first), showing the project name, date, and all four skill values.
   *
   * @param {Array}    snapshots - All skill snapshots for the current user
   * @param {string[]} skills    - Backend field names
   * @param {string[]} labels    - Display names
   * @returns {string} HTML markup for the full timeline
   */
  _buildTimeline(snapshots, skills, labels) {
    // Show a placeholder message if the player hasn't logged any snapshots yet
    if (!snapshots.length) {
      return `<p style="color:#64748b; text-align:center">No snapshots yet. Complete a project to get started!</p>`;
    }

    // Reverse so the most recent snapshot appears at the top
    return [...snapshots].reverse().map(snap => {
      const date = snap.created_at ? new Date(snap.created_at).toLocaleDateString() : '';

      // Build a compact "Coding: 5 · Collaboration: 4 · ..." summary line
      const bars = skills.map((k, i) => {
        const v = snap[k] ?? 1;
        return `<span style="font-size:11px; color:#94a3b8">${labels[i]}: <strong style="color:#a5b4fc">${v}</strong></span>`;
      }).join('  ·  ');

      return `
        <div style="border-left:3px solid #4f46e5; padding:10px 14px; margin-bottom:10px; background:#0f172a; border-radius:0 8px 8px 0">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px">
            <span style="color:#e2e8f0; font-weight:600; font-size:14px">${snap.project_name ?? 'Untitled'}</span>
            <span style="color:#475569; font-size:12px">${date}</span>
          </div>
          <div style="line-height:1.8">${bars}</div>
        </div>`;
    }).join('');
  }

  /**
   * _close()
   * Removes the overlay from the DOM and fires the onClose callback
   * so the game level knows the passport has been dismissed.
   */
  _close() {
    this.overlay?.remove();
    this.onClose?.();
  }
}