export default class SkillPassport {
  constructor({ pythonURI, fetchOptions, onClose }) {
    this.pythonURI = pythonURI;
    this.fetchOptions = fetchOptions;
    this.onClose = onClose;
    this.overlay = null;
  }

  async start() {
    // 1. Fetch snapshots from your existing endpoint
    const resp = await fetch(`${this.pythonURI}/api/user/skill-snapshot`, this.fetchOptions);
    const snapshots = await resp.json(); // array of snapshot objects

    // 2. Build and inject the overlay
    this._render(snapshots);
  }

  _render(snapshots) {
    // Create full-screen overlay (same pattern as PersonaTrial)
    this.overlay = document.createElement('div');
    this.overlay.style.cssText = `
      position: fixed; inset: 0; background: rgba(0,0,0,0.85);
      z-index: 9999; display: flex; align-items: center;
      justify-content: center; font-family: sans-serif;
    `;

    const latest = snapshots.at(-1) ?? {};
    const skills = ['coding_ability','collaboration','problem_solving','initiative'];
    const labels = ['Coding','Collaboration','Problem Solving','Initiative'];

    // Build radar SVG from latest snapshot
    const radarSVG = this._buildRadar(latest, skills, labels);

    this.overlay.innerHTML = `
      <div style="background:#1e1e2e; border-radius:16px; padding:32px;
                  max-width:700px; width:90%; max-height:85vh; overflow-y:auto;
                  border: 1px solid #4f46e5;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px">
          <h2 style="color:#e2e8f0; font-size:22px; margin:0">🎖 Skill Passport</h2>
          <button id="sp-close" style="background:none; border:none; color:#94a3b8;
            font-size:20px; cursor:pointer">✕</button>
        </div>

        <!-- Radar + progress bars side by side -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-bottom:28px">
          <div>${radarSVG}</div>
          <div>${this._buildBars(latest, skills, labels)}</div>
        </div>

        <!-- Timeline -->
        <h3 style="color:#94a3b8; font-size:14px; margin-bottom:12px; text-transform:uppercase; letter-spacing:.05em">
          Project History
        </h3>
        ${this._buildTimeline(snapshots, skills, labels)}
      </div>
    `;

    document.body.appendChild(this.overlay);
    this.overlay.querySelector('#sp-close').onclick = () => this._close();
  }

  _buildRadar(snapshot, skills, labels) {
    const cx = 110, cy = 110, r = 80, n = skills.length;
    const val = (k) => ((snapshot[k] ?? 1) - 1) / 5; // normalize 1-6 to 0-1

    const angleOf = i => (Math.PI * 2 * i / n) - Math.PI / 2;
    const point = (i, radius) => {
      const a = angleOf(i);
      return [cx + radius * Math.cos(a), cy + radius * Math.sin(a)];
    };

    // Grid rings
    const rings = [0.25, 0.5, 0.75, 1].map(scale => {
      const pts = skills.map((_, i) => point(i, r * scale).join(',')).join(' ');
      return `<polygon points="${pts}" fill="none" stroke="#334155" stroke-width="1"/>`;
    }).join('');

    // Axes
    const axes = skills.map((_, i) => {
      const [x, y] = point(i, r);
      return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#334155" stroke-width="1"/>`;
    }).join('');

    // Data polygon
    const dataPts = skills.map((k, i) => point(i, r * val(k)).join(',')).join(' ');

    // Labels
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

  _buildBars(snapshot, skills, labels) {
    return labels.map((lbl, i) => {
      const val = snapshot[skills[i]] ?? 1;
      const pct = Math.round((val - 1) / 5 * 100);
      return `
        <div style="margin-bottom:14px">
          <div style="display:flex; justify-content:space-between; margin-bottom:4px">
            <span style="color:#cbd5e1; font-size:13px">${lbl}</span>
            <span style="color:#6366f1; font-size:13px; font-weight:600">${val}/6</span>
          </div>
          <div style="background:#1e293b; border-radius:4px; height:8px; overflow:hidden">
            <div style="background:#6366f1; width:${pct}%; height:100%;
              border-radius:4px; transition:width .4s"></div>
          </div>
        </div>`;
    }).join('');
  }

  _buildTimeline(snapshots, skills, labels) {
    if (!snapshots.length) {
      return `<p style="color:#64748b; text-align:center">No snapshots yet. Complete a project to get started!</p>`;
    }
    return [...snapshots].reverse().map(snap => {
      const date = snap.created_at ? new Date(snap.created_at).toLocaleDateString() : '';
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

  _close() {
    this.overlay?.remove();
    this.onClose?.();
  }
}