// Imports
import GamEnvBackground from '/assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '/assets/js/GameEnginev1.1/essentials/Npc.js';
import GameLevelCsPathIdentity from './GameLevelCsPathIdentity.js';

// ── Code Runner ───────────────────────────────────────────────────────────────
// Appears in the TOP half of the screen so it never overlaps the dialogue box
// (DialogueSystem is anchored at bottom: 100px).

function openCodeTerminal({ title, starterCode }) {
  document.getElementById('code-terminal')?.remove();

  const terminal = document.createElement('div');
  terminal.id = 'code-terminal';
  Object.assign(terminal.style, {
    position:     'fixed',
    top:          '5%',
    left:         '50%',
    transform:    'translateX(-50%)',
    width:        'min(660px, 92vw)',
    background:   '#0d1526',
    border:       '1px solid rgba(76,175,239,0.35)',
    borderRadius: '12px',
    overflow:     'hidden',
    zIndex:       '9998',
    fontFamily:   'system-ui, sans-serif',
    boxShadow:    '0 8px 32px rgba(0,0,0,0.6)',
  });

  terminal.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 14px;background:rgba(76,175,239,0.12);border-bottom:1px solid rgba(76,175,239,0.2);">
      <span style="font-size:11px;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:#4caef0;">⌨ ${title} — Code Terminal</span>
      <div style="display:flex;gap:8px;align-items:center;">
        <button id="terminal-run"   style="background:#4caef0;border:none;border-radius:6px;color:#fff;padding:4px 12px;font-size:12px;font-weight:700;cursor:pointer;">▶ Run</button>
        <button id="terminal-close" style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:#aaa;padding:4px 10px;font-size:12px;cursor:pointer;">✕</button>
      </div>
    </div>
    <textarea id="terminal-code" spellcheck="false" style="display:block;width:100%;min-height:110px;background:transparent;border:none;border-bottom:1px solid rgba(255,255,255,0.06);color:#e2e8f0;font-family:'Fira Code',monospace;font-size:13px;padding:12px;resize:vertical;outline:none;box-sizing:border-box;">${starterCode}</textarea>
    <div style="padding:6px 14px;font-size:10px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#555;border-bottom:1px solid rgba(255,255,255,0.05);">Output</div>
    <div id="terminal-output" style="padding:8px 14px 12px;font-family:monospace;font-size:12px;color:#86efac;min-height:36px;white-space:pre-wrap;">(output appears here)</div>
  `;

  document.body.appendChild(terminal);

  document.getElementById('terminal-close').onclick = () => terminal.remove();

  document.getElementById('terminal-run').onclick = () => {
    const code   = document.getElementById('terminal-code').value;
    const output = document.getElementById('terminal-output');
    const lines  = [];
    const sandbox = { console: { log: (...args) => lines.push(args.map(String).join(' ')) } };
    try {
      new Function(...Object.keys(sandbox), code)(...Object.values(sandbox));
      output.style.color = '#86efac';
      output.textContent = lines.join('\n') || '(no output)';
    } catch (err) {
      output.style.color = '#f87171';
      output.textContent = 'Error: ' + err.message;
    }
  };
}
// ─────────────────────────────────────────────────────────────────────────────


/**
 * GameLevel — Code Hub
 * Three topic terminals: Frontend, Backend, Dataviz.
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
    // Use a fixed background — do NOT call restoreIdentitySelections here
    // because that would overwrite it with the player's saved world theme.
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
      INIT_POSITION:  { x: width * 0.08, y: height - (height / SCALE) },
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

    // NPC x/y ratios — aligned to the four corner zones on tech_hub_rpg_map.png
    const positions = {
      frontend: { x: 0.18, y: 0.30 },  // top-left zone
      backend:  { x: 0.75, y: 0.30 },  // top-right zone
      dataviz:  { x: 0.75, y: 0.68 },  // bottom-right zone
      exit:     { x: 0.18, y: 0.68 },  // bottom-left (Code Hub exit portal)
    };

    // ── Frontend Terminal ────────────────────────────────────────────────────
    const npc_frontend = {
      ...npcBase,
      id:           'FrontendTerminal',
      greeting:     'Frontend Terminal — HTML, CSS, JavaScript, Markdown.',
      INIT_POSITION: { x: width * positions.frontend.x, y: height * positions.frontend.y },
      interact: function() {
        document.getElementById('code-terminal')?.remove();
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
            action:  () => openCodeTerminal({
              title: 'Frontend',
              starterCode: [
                '// Frontend basics — edit and run!',
                'const skills = ["HTML", "CSS", "JavaScript"];',
                'skills.forEach(s => console.log("Skill:", s));',
                '',
                'const greeting = "Hello from Code Hub!";',
                'console.log(greeting);',
              ].join('\n'),
            }),
          },
        ]);
      },
    };

    // ── Backend Terminal ─────────────────────────────────────────────────────
    const npc_backend = {
      ...npcBase,
      id:           'BackendTerminal',
      greeting:     'Backend Terminal — REST APIs, databases, Flask, Spring Boot.',
      INIT_POSITION: { x: width * positions.backend.x, y: height * positions.backend.y },
      interact: function() {
        document.getElementById('code-terminal')?.remove();
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
            action:  () => openCodeTerminal({
              title: 'Backend',
              starterCode: [
                '// REST method reference',
                'const methods = {',
                '  GET:    "Read data",',
                '  POST:   "Create data",',
                '  PUT:    "Update data",',
                '  DELETE: "Remove data"',
                '};',
                '',
                'Object.entries(methods).forEach(([m, d]) => {',
                '  console.log(m + " → " + d);',
                '});',
              ].join('\n'),
            }),
          },
        ]);
      },
    };

    // ── Dataviz Terminal ─────────────────────────────────────────────────────
    const npc_dataviz = {
      ...npcBase,
      id:           'DatavizTerminal',
      greeting:     'Dataviz Terminal — queries, filtering, pagination, visualization.',
      INIT_POSITION: { x: width * positions.dataviz.x, y: height * positions.dataviz.y },
      interact: function() {
        document.getElementById('code-terminal')?.remove();
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
            action:  () => openCodeTerminal({
              title: 'Dataviz',
              starterCode: [
                '// Pagination example',
                'const data = Array.from({ length: 20 }, (_, i) => ({',
                '  id: i + 1, name: "Item " + (i + 1)',
                '}));',
                '',
                'function paginate(arr, page, size) {',
                '  return arr.slice((page - 1) * size, page * size);',
                '}',
                '',
                'console.log("Page 1:", paginate(data, 1, 5).map(d => d.name).join(", "));',
                'console.log("Page 2:", paginate(data, 2, 5).map(d => d.name).join(", "));',
              ].join('\n'),
            }),
          },
        ]);
      },
    };

    // ── Exit portal ──────────────────────────────────────────────────────────
    const npc_exit = {
      ...npcBase,
      id:           'ExitPortal',
      greeting:     'Head back to the Wayfinding World.',
      INIT_POSITION: { x: width * positions.exit.x, y: height * positions.exit.y },
      interact: function() {
        document.getElementById('code-terminal')?.remove();
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
      { class: Npc,              data: npc_frontend },
      { class: Npc,              data: npc_backend },
      { class: Npc,              data: npc_dataviz },
      { class: Npc,              data: npc_exit },
    ];
  }
}

export default GameLevelCsPath1CodeHub;
