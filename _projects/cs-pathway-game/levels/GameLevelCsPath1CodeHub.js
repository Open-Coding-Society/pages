// Imports
import GamEnvBackground from '/assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '/assets/js/GameEnginev1.1/essentials/Npc.js';
import GameLevelCsPathIdentity from './GameLevelCsPathIdentity.js';

// ── Shared panel shell ────────────────────────────────────────────────────────
// Creates the floating panel container used by all three terminals.
// Positioned at top:5% so it never overlaps the DialogueSystem (bottom:100px).

function createPanel(title, accentColor) {
  document.getElementById('code-hub-panel')?.remove();

  const panel = document.createElement('div');
  panel.id = 'code-hub-panel';
  Object.assign(panel.style, {
    position:     'fixed',
    top:          '4%',
    left:         '50%',
    transform:    'translateX(-50%)',
    width:        'min(720px, 94vw)',
    maxHeight:    '72vh',
    overflowY:    'auto',
    background:   '#0d1526',
    border:       `1px solid ${accentColor}55`,
    borderRadius: '12px',
    zIndex:       '9998',
    fontFamily:   'system-ui, sans-serif',
    boxShadow:    '0 8px 40px rgba(0,0,0,0.7)',
  });

  const header = document.createElement('div');
  Object.assign(header.style, {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'space-between',
    padding:        '9px 16px',
    background:     `${accentColor}18`,
    borderBottom:   `1px solid ${accentColor}33`,
    position:       'sticky',
    top:            '0',
    zIndex:         '1',
  });
  header.innerHTML = `
    <span style="font-size:11px;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:${accentColor};">${title}</span>
    <button id="panel-close" style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:#aaa;padding:4px 10px;font-size:12px;cursor:pointer;">✕</button>
  `;

  const body = document.createElement('div');
  body.id = 'panel-body';
  Object.assign(body.style, { padding: '16px' });

  panel.appendChild(header);
  panel.appendChild(body);
  document.body.appendChild(panel);

  document.getElementById('panel-close').onclick = () => panel.remove();
  return body;
}

// ── Frontend Panel — Markdown Converter + CSS Playground ─────────────────────
function openFrontendPanel() {
  const body = createPanel('⌨ Frontend Terminal — Markdown & CSS', '#4caef0');

  body.innerHTML = `
    <div style="margin-bottom:14px;">
      <div style="font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#4caef0;margin-bottom:8px;">Markdown → HTML Converter</div>
      <div style="font-size:12px;color:#94a3b8;margin-bottom:10px;">Write Markdown on the left, click Convert, see the rendered HTML on the right.</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div>
          <div style="font-size:10px;font-weight:700;color:#555;text-transform:uppercase;margin-bottom:4px;">Markdown Input</div>
          <textarea id="md-input" spellcheck="false" style="width:100%;height:160px;background:#0a0f1e;border:1px solid rgba(76,175,239,0.2);border-radius:6px;color:#e2e8f0;font-family:'Fira Code',monospace;font-size:12px;padding:10px;resize:none;outline:none;box-sizing:border-box;"># Hello World

Write your **Markdown** here.

- HTML gives structure
- CSS adds style
- JavaScript adds logic

> Markdown converts to HTML automatically.</textarea>
          <button id="md-convert" style="margin-top:8px;background:#4caef0;border:none;border-radius:6px;color:#fff;padding:6px 16px;font-size:12px;font-weight:700;cursor:pointer;width:100%;">▶ Convert</button>
        </div>
        <div>
          <div style="font-size:10px;font-weight:700;color:#555;text-transform:uppercase;margin-bottom:4px;">Rendered Output</div>
          <div id="md-output" style="width:100%;height:190px;background:#0a0f1e;border:1px solid rgba(76,175,239,0.2);border-radius:6px;color:#e2e8f0;font-size:13px;padding:10px;overflow-y:auto;box-sizing:border-box;line-height:1.6;">(output appears here)</div>
        </div>
      </div>
    </div>

    <hr style="border:none;border-top:1px solid rgba(255,255,255,0.07);margin:16px 0;">

    <div>
      <div style="font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#4caef0;margin-bottom:8px;">CSS Playground</div>
      <div style="font-size:12px;color:#94a3b8;margin-bottom:10px;">Edit the CSS rules and click Apply to see them update the box on the right.</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div>
          <div style="font-size:10px;font-weight:700;color:#555;text-transform:uppercase;margin-bottom:4px;">CSS Editor</div>
          <textarea id="css-input" spellcheck="false" style="width:100%;height:140px;background:#0a0f1e;border:1px solid rgba(76,175,239,0.2);border-radius:6px;color:#e2e8f0;font-family:'Fira Code',monospace;font-size:12px;padding:10px;resize:none;outline:none;box-sizing:border-box;">.box {
  background: #4caef0;
  color: white;
  padding: 20px;
  border-radius: 12px;
  font-size: 18px;
  text-align: center;
  font-weight: bold;
}</textarea>
          <div style="display:flex;gap:8px;margin-top:8px;">
            <button id="css-apply" style="background:#4caef0;border:none;border-radius:6px;color:#fff;padding:6px 14px;font-size:12px;font-weight:700;cursor:pointer;flex:1;">Apply CSS</button>
            <button id="css-reset" style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:#aaa;padding:6px 14px;font-size:12px;cursor:pointer;">Reset</button>
          </div>
        </div>
        <div>
          <div style="font-size:10px;font-weight:700;color:#555;text-transform:uppercase;margin-bottom:4px;">Preview</div>
          <div id="css-preview" style="width:100%;height:170px;background:#0a0f1e;border:1px solid rgba(76,175,239,0.2);border-radius:6px;display:flex;align-items:center;justify-content:center;box-sizing:border-box;">
            <div class="box" style="background:#4caef0;color:white;padding:20px;border-radius:12px;font-size:18px;text-align:center;font-weight:bold;">Hello CSS!</div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Markdown converter — simple parser
  document.getElementById('md-convert').onclick = () => {
    const raw = document.getElementById('md-input').value;
    let html = raw
      .replace(/^### (.+)$/gm,  '<h3 style="color:#4caef0;margin:8px 0 4px">$1</h3>')
      .replace(/^## (.+)$/gm,   '<h2 style="color:#4caef0;margin:10px 0 6px">$1</h2>')
      .replace(/^# (.+)$/gm,    '<h1 style="color:#4caef0;margin:12px 0 8px">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g,     '<em>$1</em>')
      .replace(/^> (.+)$/gm,    '<blockquote style="border-left:3px solid #4caef0;padding-left:10px;color:#94a3b8;margin:6px 0">$1</blockquote>')
      .replace(/^- (.+)$/gm,    '<li style="margin:3px 0">$1</li>')
      .replace(/(<li.*<\/li>\n?)+/g, s => `<ul style="padding-left:18px;margin:6px 0">${s}</ul>`)
      .replace(/\n\n/g, '<br>');
    document.getElementById('md-output').innerHTML = html;
  };

  // CSS playground
  const defaultCSS = `.box {
  background: #4caef0;
  color: white;
  padding: 20px;
  border-radius: 12px;
  font-size: 18px;
  text-align: center;
  font-weight: bold;
}`;
  document.getElementById('css-apply').onclick = () => {
    const rules = document.getElementById('css-input').value;
    const preview = document.getElementById('css-preview');
    let el = preview.querySelector('.box');
    if (!el) { el = document.createElement('div'); el.className = 'box'; el.textContent = 'Hello CSS!'; preview.appendChild(el); }
    // Parse .box rules and apply inline
    const match = rules.match(/\.box\s*\{([^}]*)\}/s);
    if (match) {
      el.removeAttribute('style');
      match[1].split(';').forEach(decl => {
        const [prop, val] = decl.split(':').map(s => s.trim());
        if (prop && val) el.style[prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = val;
      });
    }
  };
  document.getElementById('css-reset').onclick = () => {
    document.getElementById('css-input').value = defaultCSS;
    const preview = document.getElementById('css-preview');
    preview.innerHTML = `<div class="box" style="background:#4caef0;color:white;padding:20px;border-radius:12px;font-size:18px;text-align:center;font-weight:bold;">Hello CSS!</div>`;
  };
}

// ── Backend Panel — Mock REST API Simulator ───────────────────────────────────
function openBackendPanel() {
  const body = createPanel('⌨ Backend Terminal — REST API Simulator', '#86efac');

  const db = [
    { id: 1, name: 'Ada Lovelace',   role: 'Engineer' },
    { id: 2, name: 'Grace Hopper',   role: 'Architect' },
    { id: 3, name: 'Alan Turing',    role: 'Researcher' },
  ];
  let nextId = 4;

  const renderDB = () => db.map(r => `  { id: ${r.id}, name: "${r.name}", role: "${r.role}" }`).join(',\n') || '  (empty)';
  const log = (status, color, msg) => {
    const out = document.getElementById('api-output');
    out.style.color = color;
    out.textContent = `HTTP ${status}\n\n${msg}`;
  };

  body.innerHTML = `
    <div style="font-size:12px;color:#94a3b8;margin-bottom:12px;">Simulate REST API calls against a live in-memory database. Try each method to see what happens.</div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
      <div>
        <div style="font-size:10px;font-weight:700;color:#555;text-transform:uppercase;margin-bottom:6px;">Name</div>
        <input id="api-name" placeholder="e.g. Linus Torvalds" style="width:100%;background:#0a0f1e;border:1px solid rgba(134,239,172,0.2);border-radius:6px;color:#e2e8f0;font-size:13px;padding:8px 10px;outline:none;box-sizing:border-box;">
      </div>
      <div>
        <div style="font-size:10px;font-weight:700;color:#555;text-transform:uppercase;margin-bottom:6px;">Role</div>
        <input id="api-role" placeholder="e.g. Developer" style="width:100%;background:#0a0f1e;border:1px solid rgba(134,239,172,0.2);border-radius:6px;color:#e2e8f0;font-size:13px;padding:8px 10px;outline:none;box-sizing:border-box;">
      </div>
    </div>

    <div style="font-size:10px;font-weight:700;color:#555;text-transform:uppercase;margin-bottom:6px;">ID (for PUT / DELETE)</div>
    <input id="api-id" placeholder="e.g. 1" type="number" style="width:100%;background:#0a0f1e;border:1px solid rgba(134,239,172,0.2);border-radius:6px;color:#e2e8f0;font-size:13px;padding:8px 10px;outline:none;box-sizing:border-box;margin-bottom:12px;">

    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;">
      <button id="btn-post"   style="background:#86efac;border:none;border-radius:6px;color:#0d1526;padding:7px 16px;font-size:12px;font-weight:700;cursor:pointer;">POST — Create</button>
      <button id="btn-get"    style="background:#4caef0;border:none;border-radius:6px;color:#fff;padding:7px 16px;font-size:12px;font-weight:700;cursor:pointer;">GET — Read All</button>
      <button id="btn-put"    style="background:#fbbf24;border:none;border-radius:6px;color:#0d1526;padding:7px 16px;font-size:12px;font-weight:700;cursor:pointer;">PUT — Update</button>
      <button id="btn-delete" style="background:#f87171;border:none;border-radius:6px;color:#fff;padding:7px 16px;font-size:12px;font-weight:700;cursor:pointer;">DELETE — Remove</button>
    </div>

    <div style="font-size:10px;font-weight:700;color:#555;text-transform:uppercase;margin-bottom:6px;">Response</div>
    <pre id="api-output" style="background:#0a0f1e;border:1px solid rgba(134,239,172,0.15);border-radius:6px;padding:12px;font-size:12px;color:#86efac;min-height:80px;white-space:pre-wrap;margin:0;">Hit a method to see the response...</pre>
  `;

  document.getElementById('btn-post').onclick = () => {
    const name = document.getElementById('api-name').value.trim();
    const role = document.getElementById('api-role').value.trim();
    if (!name || !role) { log(400, '#f87171', 'Bad Request: name and role are required.'); return; }
    const record = { id: nextId++, name, role };
    db.push(record);
    log(201, '#86efac', `Created:\n${JSON.stringify(record, null, 2)}\n\nDatabase:\n[\n${renderDB()}\n]`);
  };

  document.getElementById('btn-get').onclick = () => {
    log(200, '#86efac', `[\n${renderDB()}\n]`);
  };

  document.getElementById('btn-put').onclick = () => {
    const id   = parseInt(document.getElementById('api-id').value);
    const name = document.getElementById('api-name').value.trim();
    const role = document.getElementById('api-role').value.trim();
    const rec  = db.find(r => r.id === id);
    if (!rec) { log(404, '#f87171', `Not Found: no record with id ${id}.`); return; }
    if (name) rec.name = name;
    if (role) rec.role = role;
    log(200, '#fbbf24', `Updated:\n${JSON.stringify(rec, null, 2)}`);
  };

  document.getElementById('btn-delete').onclick = () => {
    const id  = parseInt(document.getElementById('api-id').value);
    const idx = db.findIndex(r => r.id === id);
    if (idx === -1) { log(404, '#f87171', `Not Found: no record with id ${id}.`); return; }
    const removed = db.splice(idx, 1)[0];
    log(200, '#f87171', `Deleted:\n${JSON.stringify(removed, null, 2)}\n\nDatabase:\n[\n${renderDB()}\n]`);
  };
}

// ── Dataviz Panel — Pagination + Filter Demo ──────────────────────────────────
function openDatavizPanel() {
  const body = createPanel('⌨ Dataviz Terminal — Pagination & Filtering', '#c084fc');

  const dataset = [
    { id:1,  name:'TechCorp',    industry:'Technology', size:500  },
    { id:2,  name:'HealthPlus',  industry:'Healthcare', size:120  },
    { id:3,  name:'EduWorld',    industry:'Education',  size:80   },
    { id:4,  name:'DataStream',  industry:'Technology', size:340  },
    { id:5,  name:'GreenEnergy', industry:'Energy',     size:60   },
    { id:6,  name:'MediCare',    industry:'Healthcare', size:210  },
    { id:7,  name:'CloudNine',   industry:'Technology', size:900  },
    { id:8,  name:'LearnFast',   industry:'Education',  size:45   },
    { id:9,  name:'PowerGrid',   industry:'Energy',     size:380  },
    { id:10, name:'ByteWorks',   industry:'Technology', size:150  },
    { id:11, name:'CareFirst',   industry:'Healthcare', size:95   },
    { id:12, name:'SolarTech',   industry:'Energy',     size:270  },
  ];

  let page = 1;
  const PAGE_SIZE = 3;

  body.innerHTML = `
    <div style="font-size:12px;color:#94a3b8;margin-bottom:12px;">Filter and page through a live dataset. Try combining filters and navigating pages.</div>

    <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:14px;">
      <div>
        <div style="font-size:10px;font-weight:700;color:#555;text-transform:uppercase;margin-bottom:4px;">Industry</div>
        <select id="dv-industry" style="background:#0a0f1e;border:1px solid rgba(192,132,252,0.3);border-radius:6px;color:#e2e8f0;font-size:13px;padding:7px 10px;outline:none;">
          <option value="">All</option>
          <option>Technology</option>
          <option>Healthcare</option>
          <option>Education</option>
          <option>Energy</option>
        </select>
      </div>
      <div>
        <div style="font-size:10px;font-weight:700;color:#555;text-transform:uppercase;margin-bottom:4px;">Min Size</div>
        <input id="dv-size" type="number" placeholder="e.g. 100" style="width:110px;background:#0a0f1e;border:1px solid rgba(192,132,252,0.3);border-radius:6px;color:#e2e8f0;font-size:13px;padding:7px 10px;outline:none;">
      </div>
      <button id="dv-filter" style="background:#c084fc;border:none;border-radius:6px;color:#0d1526;padding:7px 16px;font-size:12px;font-weight:700;cursor:pointer;margin-top:16px;">Apply Filter</button>
      <button id="dv-reset"  style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:#aaa;padding:7px 14px;font-size:12px;cursor:pointer;margin-top:16px;">Reset</button>
    </div>

    <div id="dv-table-wrap"></div>

    <div style="display:flex;align-items:center;justify-content:space-between;margin-top:12px;">
      <div id="dv-info" style="font-size:12px;color:#94a3b8;"></div>
      <div style="display:flex;gap:8px;">
        <button id="dv-prev" style="background:rgba(192,132,252,0.15);border:1px solid rgba(192,132,252,0.3);border-radius:6px;color:#c084fc;padding:6px 14px;font-size:12px;cursor:pointer;">← Prev</button>
        <button id="dv-next" style="background:rgba(192,132,252,0.15);border:1px solid rgba(192,132,252,0.3);border-radius:6px;color:#c084fc;padding:6px 14px;font-size:12px;cursor:pointer;">Next →</button>
      </div>
    </div>
  `;

  let filtered = [...dataset];

  const renderTable = () => {
    const total = filtered.length;
    const pages = Math.ceil(total / PAGE_SIZE) || 1;
    page = Math.min(page, pages);
    const slice = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    document.getElementById('dv-info').textContent =
      `Showing ${slice.length} of ${total} results — Page ${page} / ${pages}`;

    const rows = slice.map(r => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.05);color:#e2e8f0;">${r.id}</td>
        <td style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.05);color:#e2e8f0;">${r.name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.05);color:#c084fc;">${r.industry}</td>
        <td style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.05);color:#86efac;">${r.size}</td>
      </tr>`).join('');

    document.getElementById('dv-table-wrap').innerHTML = `
      <table style="width:100%;border-collapse:collapse;background:#0a0f1e;border-radius:8px;overflow:hidden;font-size:13px;">
        <thead>
          <tr style="background:rgba(192,132,252,0.1);">
            <th style="padding:8px 12px;text-align:left;font-size:10px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#c084fc;">ID</th>
            <th style="padding:8px 12px;text-align:left;font-size:10px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#c084fc;">Name</th>
            <th style="padding:8px 12px;text-align:left;font-size:10px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#c084fc;">Industry</th>
            <th style="padding:8px 12px;text-align:left;font-size:10px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#c084fc;">Size</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;
  };

  renderTable();

  document.getElementById('dv-filter').onclick = () => {
    const ind  = document.getElementById('dv-industry').value;
    const size = parseInt(document.getElementById('dv-size').value) || 0;
    filtered = dataset.filter(r =>
      (!ind  || r.industry === ind) &&
      (!size || r.size >= size)
    );
    page = 1;
    renderTable();
  };

  document.getElementById('dv-reset').onclick = () => {
    document.getElementById('dv-industry').value = '';
    document.getElementById('dv-size').value = '';
    filtered = [...dataset];
    page = 1;
    renderTable();
  };

  document.getElementById('dv-prev').onclick = () => { if (page > 1) { page--; renderTable(); } };
  document.getElementById('dv-next').onclick = () => {
    if (page < Math.ceil(filtered.length / PAGE_SIZE)) { page++; renderTable(); }
  };
}
// ─────────────────────────────────────────────────────────────────────────────


/**
 * GameLevel — Code Hub
 * Central guide NPC + three topic terminals: Frontend, Backend, Dataviz.
 * Entered from the Wayfinding World via the Code Hub gatekeeper.
 */
class GameLevelCsPath1CodeHub extends GameLevelCsPathIdentity {
  static levelId      = 'code-hub';
  static displayName  = 'Code Hub';

  constructor(gameEnv) {
    super(gameEnv, {
      levelDisplayName: GameLevelCsPath1CodeHub.displayName,
      logPrefix:        'Code Hub',
    });

    let { width, height, path } = this.getLevelDimensions();

    // ── Background ─────────────────────────────────────────────────────────
    const bg_data = {
      name:     GameLevelCsPath1CodeHub.displayName,
      greeting: 'Welcome to the Code Hub.',
      src:      path + '/images/projects/cs-pathway-game/bg-codehub/tech_hub_rpg_map.png',
    };

    this.primeAssetGate({ backgroundSrc: bg_data.src, playerSrc: path + '/images/projects/cs-pathway-game/player/minimalist.png' });

    // Restore only the player avatar (not the world theme)
    this.profileReady.then(async (restored) => {
      const sprite = restored?.profileData?.spriteMeta;
      if (sprite) await this.applyAvatarOptions({ sprite });
      this.finishLoadingWork();
    }).catch(() => this.finishLoadingWork());

    // ── Player ──────────────────────────────────────────────────────────────
    const SCALE = 5;
    const player_data = {
      id:             'Minimalist_Identity',
      greeting:       'I am ready to learn!',
      src:            path + '/images/projects/cs-pathway-game/player/minimalist.png',
      SCALE_FACTOR:   SCALE,
      STEP_FACTOR:    1000,
      ANIMATION_RATE: 50,
      INIT_POSITION:  { x: width * 0.48, y: height * 0.55 },
      pixels:         { height: 1024, width: 1024 },
      orientation:    { rows: 2, columns: 2 },
      down:      { row: 0, start: 0, columns: 1 },
      downRight: { row: 0, start: 0, columns: 1, rotate:  Math.PI / 16 },
      downLeft:  { row: 0, start: 0, columns: 1, rotate: -Math.PI / 16 },
      left:      { row: 1, start: 0, columns: 1, mirror: true },
      right:     { row: 1, start: 0, columns: 1 },
      up:        { row: 0, start: 1, columns: 1 },
      upLeft:    { row: 1, start: 0, columns: 1, mirror: true, rotate:  Math.PI / 16 },
      upRight:   { row: 1, start: 0, columns: 1, rotate: -Math.PI / 16 },
      hitbox:    { widthPercentage: 0.4, heightPercentage: 0.4 },
      keypress:  { up: 87, left: 65, down: 83, right: 68 },
    };

    // ── Shared NPC base ──────────────────────────────────────────────────────
    const npcBase = {
      src:            path + '/images/projects/cs-pathway-game/npc/gatekeeper2.png',
      SCALE_FACTOR:   SCALE,
      ANIMATION_RATE: 50,
      pixels:         { width: 1024, height: 1024 },
      orientation:    { rows: 2, columns: 2 },
      down:           { row: 0, start: 0, columns: 1, wiggle: 0.005 },
      up:             { row: 0, start: 1, columns: 1 },
      left:           { row: 1, start: 0, columns: 1 },
      right:          { row: 1, start: 1, columns: 1 },
      hitbox:         { widthPercentage: 0.4, heightPercentage: 0.4 },
      interactDistance: 120,
    };

    // NPC positions — centered in each zone on tech_hub_rpg_map.png
    const positions = {
      center:   { x: 0.50, y: 0.45 },  // Central Plaza guide
      frontend: { x: 0.19, y: 0.28 },  // top-left zone
      backend:  { x: 0.82, y: 0.28 },  // top-right zone
      dataviz:  { x: 0.82, y: 0.72 },  // bottom-right zone
      exit:     { x: 0.19, y: 0.72 },  // bottom-left (Code Hub exit portal)
    };

    // ── Central Guide NPC ────────────────────────────────────────────────────
    const npc_guide = {
      ...npcBase,
      id:            'CodeHubGuide',
      greeting:      'Welcome to the Code Hub! Head to a terminal to start learning.',
      INIT_POSITION: { x: width * positions.center.x, y: height * positions.center.y },
      interact: function() {
        document.getElementById('code-hub-panel')?.remove();
        this.dialogueSystem.dialogues = [
          'Hey! Welcome to the Code Hub.',
          'Head to the Frontend terminal in the top-left to learn HTML, CSS, and Markdown.',
          'The Backend terminal is top-right — REST APIs, databases, and CRUD.',
          'Bottom-right is Dataviz — filtering, pagination, and data visualization.',
          'Use the exit portal in the bottom-left to return to the Wayfinding World.',
        ];
        this.dialogueSystem.lastShownIndex = -1;
        this.dialogueSystem.showRandomDialogue('Code Hub Guide');
      },
    };

    // ── Frontend Terminal ────────────────────────────────────────────────────
    const npc_frontend = {
      ...npcBase,
      id:            'FrontendTerminal',
      greeting:      'Frontend — HTML, CSS, Markdown. Walk up and press E!',
      INIT_POSITION: { x: width * positions.frontend.x, y: height * positions.frontend.y },
      interact: function() {
        document.getElementById('code-hub-panel')?.remove();
        this.dialogueSystem.dialogues = [
          'Frontend is everything the user sees.',
          'HTML gives the page structure — headings, divs, links, images.',
          'CSS styles it — colors, fonts, Flexbox, Grid.',
          'JavaScript makes it interactive — DOM events, fetch, logic.',
          'Markdown converts plain text to HTML. Used for blogs and lessons like Big Six.',
        ];
        this.dialogueSystem.lastShownIndex = -1;
        this.dialogueSystem.showRandomDialogue('Frontend Terminal');
        this.dialogueSystem.addButtons([
          {
            text:    '⌨ Open Terminal',
            primary: true,
            action:  () => openFrontendPanel(),
          },
        ]);
      },
    };

    // ── Backend Terminal ─────────────────────────────────────────────────────
    const npc_backend = {
      ...npcBase,
      id:            'BackendTerminal',
      greeting:      'Backend — REST APIs, databases, CRUD. Walk up and press E!',
      INIT_POSITION: { x: width * positions.backend.x, y: height * positions.backend.y },
      interact: function() {
        document.getElementById('code-hub-panel')?.remove();
        this.dialogueSystem.dialogues = [
          'The backend is everything the user does NOT see.',
          'REST APIs expose your data through URL endpoints.',
          'GET reads, POST creates, PUT updates, DELETE removes.',
          'SQL databases use fixed tables. NoSQL uses flexible documents.',
          'Flask (Python) is minimal. Spring Boot (Java) is full-featured.',
        ];
        this.dialogueSystem.lastShownIndex = -1;
        this.dialogueSystem.showRandomDialogue('Backend Terminal');
        this.dialogueSystem.addButtons([
          {
            text:    '⌨ Open Terminal',
            primary: true,
            action:  () => openBackendPanel(),
          },
        ]);
      },
    };

    // ── Dataviz Terminal ─────────────────────────────────────────────────────
    const npc_dataviz = {
      ...npcBase,
      id:            'DatavizTerminal',
      greeting:      'Dataviz — filtering, pagination, data tables. Walk up and press E!',
      INIT_POSITION: { x: width * positions.dataviz.x, y: height * positions.dataviz.y },
      interact: function() {
        document.getElementById('code-hub-panel')?.remove();
        this.dialogueSystem.dialogues = [
          'Data visualization turns raw data into something humans can read.',
          'Every data API is built on CRUD — Create, Read, Update, Delete.',
          'Filter with query params: /api/users?role=admin',
          'Paginate to keep responses fast: /api/data?page=1&size=10',
          'Chart.js and D3 render data as charts, graphs, and tables.',
        ];
        this.dialogueSystem.lastShownIndex = -1;
        this.dialogueSystem.showRandomDialogue('Dataviz Terminal');
        this.dialogueSystem.addButtons([
          {
            text:    '⌨ Open Terminal',
            primary: true,
            action:  () => openDatavizPanel(),
          },
        ]);
      },
    };

    // ── Exit portal ──────────────────────────────────────────────────────────
    const npc_exit = {
      ...npcBase,
      id:            'ExitPortal',
      greeting:      'Head back to the Wayfinding World.',
      INIT_POSITION: { x: width * positions.exit.x, y: height * positions.exit.y },
      interact: function() {
        document.getElementById('code-hub-panel')?.remove();
        this.dialogueSystem.dialogues = [
          'Ready to head back to the Wayfinding World?',
        ];
        this.dialogueSystem.lastShownIndex = -1;
        this.dialogueSystem.showRandomDialogue('Exit');
        this.dialogueSystem.addButtons([
          {
            text:    '← Back to Wayfinding',
            primary: true,
            action:  () => {
              this.dialogueSystem.closeDialogue();
              const gc = this.gameEnv.gameControl;
              gc.levelClasses.splice(gc.currentLevelIndex, 1);
              gc.currentLevelIndex = Math.max(0, gc.currentLevelIndex - 1);
              gc.transitionToLevel();
            },
          },
        ]);
      },
    };

    // ── Scene objects ────────────────────────────────────────────────────────
    this.classes = [
      { class: GamEnvBackground, data: bg_data },
      { class: Player,           data: player_data },
      { class: Npc,              data: npc_guide },
      { class: Npc,              data: npc_frontend },
      { class: Npc,              data: npc_backend },
      { class: Npc,              data: npc_dataviz },
      { class: Npc,              data: npc_exit },
    ];
  }
}

export default GameLevelCsPath1CodeHub;
