// personaTrial.js — Persona Reveal + Group Formation Flow
// Replaces the old persona-quiz-only version.
// Entry point: new PersonaTrial({ pythonURI, javaURI, fetchOptions, onGroupsGenerated, onClose }).start()

const VISION_BG = '/images/vision-doors.png';

const PERSONA_META = {
  technologist: {
    title: 'Technologist',
    color: '#d6a23a',
    glow: 'rgba(214,162,58,0.35)',
    icon: '⚙',
    summary: 'You are drawn toward difficult systems, deep mastery, and solving what others hesitate to touch.',
    growth: 'When trust and communication grow alongside your skill, your influence becomes even stronger.',
    role: 'The builder who holds the hardest technical ground.',
  },
  scrummer: {
    title: 'Scrummer',
    color: '#2d8cff',
    glow: 'rgba(45,140,255,0.35)',
    icon: '◈',
    summary: 'You create momentum through people, collaboration, and the energy of moving forward together.',
    growth: 'Making your individual impact more visible will help others see the leadership you already carry.',
    role: 'The engine that keeps the team moving as one.',
  },
  planner: {
    title: 'Planner',
    color: '#8b4dff',
    glow: 'rgba(139,77,255,0.35)',
    icon: '⬡',
    summary: 'You see structure inside complexity and naturally shape scattered effort into a path others can follow.',
    growth: 'Your confidence expands when planning stays paired with direct action.',
    role: 'The architect who turns chaos into a clear path.',
  },
  finisher: {
    title: 'Finisher',
    color: '#73b84a',
    glow: 'rgba(115,184,74,0.35)',
    icon: '◎',
    summary: 'You are driven by clarity, completion, and the quiet confidence of bringing work across the finish line.',
    growth: 'As ambiguity rises, trusting your own judgment sooner will make you even stronger.',
    role: 'The one who ensures something actually gets done.',
  },
};

const QUIZ_SCENES = [
  {
    chapter: 'VISION I',
    title: 'The Chamber of First Light',
    narration: 'As you step through the gateway, the past fades behind you. The air turns still. Lanterns light across stone walls, and a voice echoes from somewhere unseen:',
    quote: 'Every builder carries a different instinct. Let yours speak.',
    prompt: 'Where does your instinct lead you first?',
    choices: [
      { label: 'Step toward the brightest corridor, drawn by challenge itself.', number: '1', accent: '#d6a23a', weights: { technologist: 2, planner: 1 } },
      { label: 'Pause and listen for the footsteps of others before moving.', number: '2', accent: '#2d8cff', weights: { scrummer: 2, finisher: 1 } },
      { label: 'Study the room and search for the shape of the path first.', number: '3', accent: '#8b4dff', weights: { planner: 3 } },
      { label: 'Choose the clearest route and commit to reaching its end.', number: '4', accent: '#73b84a', weights: { finisher: 3 } },
    ],
  },
  {
    chapter: 'VISION II',
    title: 'The Fractured Build',
    narration: 'A new vision rises. It is the night before a showcase. The project trembles at the edge of failure. One feature flickers. One teammate panics. Another falls silent.',
    quote: 'When time narrows, instinct becomes visible.',
    prompt: 'How do you move when the work begins to fracture?',
    choices: [
      { label: 'Take hold of the hardest technical flaw and begin solving it at once.', number: '1', accent: '#d6a23a', weights: { technologist: 3, finisher: 1 } },
      { label: 'Gather the group, steady their energy, and move everyone into sync.', number: '2', accent: '#2d8cff', weights: { scrummer: 3, planner: 1 } },
      { label: 'Cut through the chaos, rebuild the plan, and assign the next steps.', number: '3', accent: '#8b4dff', weights: { planner: 3, finisher: 1 } },
      { label: 'Carry one crucial piece fully across the line so something survives intact.', number: '4', accent: '#73b84a', weights: { finisher: 3, planner: 1 } },
    ],
  },
  {
    chapter: 'VISION III',
    title: 'The Unwritten Path',
    narration: 'The chamber shifts again. Now you face a path with no instructions, no example, and no map. Only possibility.',
    quote: 'What you choose without certainty reveals more than what you choose with guidance.',
    prompt: 'Which path calls to you when nothing is defined?',
    choices: [
      { label: 'Push toward the boldest technical solution and discover what is possible.', number: '1', accent: '#d6a23a', weights: { technologist: 3 } },
      { label: 'Turn first to the others around you and shape the path together.', number: '2', accent: '#2d8cff', weights: { scrummer: 3, planner: 1 } },
      { label: 'Break the unknown into milestones, tasks, and a path that can be followed.', number: '3', accent: '#8b4dff', weights: { planner: 3, finisher: 1 } },
      { label: 'Search for clarity before committing, so your effort lands in the right place.', number: '4', accent: '#73b84a', weights: { finisher: 3, planner: 1 } },
    ],
  },
  {
    chapter: 'VISION IV',
    title: 'The Final Passage',
    narration: 'One last vision rises. Voices clash. Progress has stalled. The project can still be saved, but only if someone chooses how to move forward when the way is no longer obvious.',
    quote: 'Your pattern has always been there. Now the chamber asks you to see it.',
    prompt: 'What do you do when the team stands at the edge of uncertainty?',
    choices: [
      { label: 'Take the implementation into your own hands and push progress forward.', number: '1', accent: '#d6a23a', weights: { technologist: 2, finisher: 1 } },
      { label: 'Guide the voices into alignment until the team can move as one.', number: '2', accent: '#2d8cff', weights: { scrummer: 3, planner: 1 } },
      { label: 'Define the roles, the order, and the next concrete actions.', number: '3', accent: '#8b4dff', weights: { planner: 3, finisher: 1 } },
      { label: 'Secure your part completely so at least one piece is unquestionably done.', number: '4', accent: '#73b84a', weights: { finisher: 3 } },
    ],
  },
];

/* ─────────────────────────────────────────────
   UTILITIES
───────────────────────────────────────────── */
function css(el, styles) {
  Object.assign(el.style, styles);
}

function el(tag, styles = {}, attrs = {}) {
  const node = document.createElement(tag);
  css(node, styles);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function fadeIn(node, ms = 320) {
  node.style.opacity = '0';
  node.style.transition = `opacity ${ms}ms ease`;
  requestAnimationFrame(() => requestAnimationFrame(() => { node.style.opacity = '1'; }));
}

function fadeOut(node, ms = 280) {
  return new Promise(res => {
    node.style.transition = `opacity ${ms}ms ease`;
    node.style.opacity = '0';
    setTimeout(res, ms);
  });
}

/* ─────────────────────────────────────────────
   MAIN CLASS
───────────────────────────────────────────── */
export default class PersonaTrial {
  /**
   * @param {object} opts
   * @param {string}   opts.pythonURI
   * @param {string}   opts.javaURI
   * @param {object}   opts.fetchOptions        – base fetch config (credentials, headers, etc.)
   * @param {function} opts.onGroupsGenerated   – called with { groups, method, period, course }
   * @param {function} opts.onClose             – called when user exits without completing
   */
  constructor({ pythonURI, javaURI, fetchOptions, onGroupsGenerated, onClose } = {}) {
    this.pythonURI        = pythonURI        || '';
    this.javaURI          = javaURI          || '';
    this.fetchOptions     = fetchOptions     || {};
    this.onGroupsGenerated = onGroupsGenerated || (() => {});
    this.onClose          = onClose          || (() => {});

    this.overlay          = null;
    this.currentScene     = 0;
    this.scores           = { technologist: 0, scrummer: 0, planner: 0, finisher: 0 };
    this.savedPersona     = null; // fetched from backend
    this.allGroups        = [];   // fetched from backend for member lookup
  }

  async start() {
    this._buildShell();
  
    if (this.savedPersona) {
      this._renderSavedPersonaGate();
    } else {
      this._renderQuizScene();
    }
  }
  destroy() {
    if (this.overlay?.parentNode) this.overlay.parentNode.removeChild(this.overlay);
    this.overlay = null;
  }
  /* ── shell ──────────────────────────────── */
  _buildShell() {
    this.destroy();
    const ov = el('div', {
      position: 'fixed', inset: '0', zIndex: '10000',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', boxSizing: 'border-box',
      background: 'rgba(4,8,20,0.55)',
      backdropFilter: 'blur(6px)',
      fontFamily: "Georgia, 'Times New Roman', serif",
    });
    document.body.appendChild(ov);
    this.overlay = ov;
  }

  _setContent(html) {
    this.overlay.innerHTML = html;
    fadeIn(this.overlay, 260);
  }

  /* ── loading ────────────────────────────── */
  _showLoading(msg = 'Loading…') {
    this._setContent(`
      <div style="
        color:#8fc0ff;
        font-size:18px;
        letter-spacing:0.12em;
        text-align:center;
        animation: ptPulse 1.6s ease-in-out infinite;
      ">
        <div style="font-size:36px;margin-bottom:14px;">✦</div>
        ${msg}
      </div>
      <style>
        @keyframes ptPulse { 0%,100%{opacity:.4} 50%{opacity:1} }
        @keyframes ptFadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        @keyframes ptSlideIn { from{opacity:0;transform:translateX(-18px)} to{opacity:1;transform:none} }
        @keyframes ptGlow { 0%,100%{box-shadow:0 0 18px var(--glow)} 50%{box-shadow:0 0 38px var(--glow)} }
      </style>
    `);
  }

  _hideLoading() { /* content replaced by next render call */ }

  /* ────────────────────────────────────────────────────
     PHASE 1A — Saved Persona Gate
  ──────────────────────────────────────────────────── */
  _renderSavedPersonaGate() {
    const meta = PERSONA_META[this.savedPersona] || PERSONA_META.technologist;
    this._setContent(`
      <style>
        @keyframes ptFadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        @keyframes ptGlowPulse { 0%,100%{opacity:.55} 50%{opacity:1} }
        .pt-gate-card { animation: ptFadeUp .45s ease both; }
        .pt-gate-card .pt-btn { transition: filter .15s, transform .15s; }
        .pt-gate-card .pt-btn:hover { filter: brightness(1.12); transform: translateY(-2px); }
      </style>
      <div class="pt-gate-card" style="
        width: min(640px, 92vw);
        border-radius: 22px;
        overflow: hidden;
        border: 1px solid ${meta.color}66;
        box-shadow: 0 24px 70px rgba(0,0,0,.55), 0 0 60px ${meta.glow};
        background:
          linear-gradient(180deg, rgba(3,10,25,.92), rgba(4,11,28,.97)),
          url('${VISION_BG}') center/cover no-repeat;
        color: #f7f1de;
        padding: 36px 32px 30px;
        text-align: center;
      ">
        <div style="
          font-size: 52px;
          margin-bottom: 6px;
          color: ${meta.color};
          animation: ptGlowPulse 2.4s ease-in-out infinite;
        ">${meta.icon}</div>

        <div style="color:${meta.color};font-size:12px;letter-spacing:.18em;text-transform:uppercase;margin-bottom:8px;">
          Your Recorded Persona
        </div>

        <div style="font-size:36px;margin-bottom:10px;color:#f4ead6;">${meta.title}</div>

        <div style="
          font-size:15px;line-height:1.65;color:#ddd6c0;
          max-width:460px;margin:0 auto 10px;
        ">${meta.role}</div>

        <div style="
          font-size:13px;line-height:1.55;color:#a0aec0;
          max-width:440px;margin:0 auto 28px;
          font-style:italic;
        ">${meta.summary}</div>

        <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;">
          <button id="pt-proceed-btn" class="pt-btn" style="
            padding: 13px 28px;
            border-radius: 12px;
            border: none;
            background: linear-gradient(135deg, ${meta.color}, ${meta.color}99);
            color: #0a0e1a;
            font-family: inherit;
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
            letter-spacing: .04em;
          ">Continue to Group Formation →</button>

          <button id="pt-retake-btn" class="pt-btn" style="
            padding: 13px 22px;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,.22);
            background: rgba(0,0,0,.32);
            color: #ddd6c0;
            font-family: inherit;
            font-size: 14px;
            cursor: pointer;
          ">Retake the Trial</button>

          <button id="pt-close-gate-btn" class="pt-btn" style="
            padding: 13px 18px;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,.14);
            background: transparent;
            color: rgba(255,255,255,.45);
            font-family: inherit;
            font-size: 13px;
            cursor: pointer;
          ">Leave Chamber</button>
        </div>
      </div>
    `);

    this.overlay.querySelector('#pt-proceed-btn').addEventListener('click', () => {
      this._chapterTransition('GROUP FORMATION BEGINS', 'The chamber shifts. Your persona is known. Now the work of building teams begins.', () => {
        this._renderGroupFormation(this.savedPersona);
      });
    });
    this.overlay.querySelector('#pt-retake-btn').addEventListener('click', () => {
      this.scores = { technologist: 0, scrummer: 0, planner: 0, finisher: 0 };
      this.currentScene = 0;
      this._renderQuizScene();
    });
    this.overlay.querySelector('#pt-close-gate-btn').addEventListener('click', () => {
      this.destroy();
      this.onClose();
    });
  }

  /* ────────────────────────────────────────────────────
     PHASE 1B — Quiz Scenes
  ──────────────────────────────────────────────────── */
  _makeProgressDots(current, total) {
    return Array.from({ length: total }).map((_, i) => `
      <span style="
        width:11px; height:11px; border-radius:999px; display:inline-block;
        border:1px solid rgba(255,255,255,.40);
        background:${i === current ? '#d6a23a' : 'transparent'};
        box-shadow:${i === current ? '0 0 10px rgba(214,162,58,.5)' : 'none'};
        transition: all .3s;
      "></span>
    `).join('');
  }

  _renderQuizScene() {
    const scene = QUIZ_SCENES[this.currentScene];
    if (!scene) { this._renderQuizResults(); return; }

    this._setContent(`
      <style>
        @keyframes ptFadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        .pt-choice { transition: transform .14s, filter .14s, box-shadow .14s; animation: ptFadeUp .38s ease both; }
        .pt-choice:nth-child(1) { animation-delay: .05s }
        .pt-choice:nth-child(2) { animation-delay: .10s }
        .pt-choice:nth-child(3) { animation-delay: .15s }
        .pt-choice:nth-child(4) { animation-delay: .20s }
        .pt-choice:hover { transform: translateY(-3px); filter: brightness(1.07); }
      </style>
      <div style="
        position:relative;
        width:min(980px,92vw);
        height:min(700px,86vh);
        border-radius:22px;
        overflow:hidden;
        border:1px solid rgba(205,170,92,.38);
        box-shadow:0 24px 70px rgba(0,0,0,.50),0 0 28px rgba(96,165,250,.10);
        background:
          linear-gradient(to top, rgba(0,0,0,.84) 0%, rgba(0,0,0,.38) 42%, rgba(0,0,0,.12) 100%),
          url('${VISION_BG}') center/cover no-repeat;
        color:#f7f1de;
      ">
        <!-- Top bar -->
        <div style="position:absolute;top:18px;left:22px;right:22px;display:flex;justify-content:space-between;align-items:flex-start;z-index:2;">
          <div style="display:flex;align-items:center;gap:10px;color:#e8e0c8;">
            <span style="color:#78b8ff;font-size:20px;">✦</span>
            <span style="font-size:22px;">The Persona Trial</span>
          </div>
          <div style="text-align:right;color:#e8e0c8;">
            <div style="font-size:14px;margin-bottom:8px;">Progress</div>
            <div style="display:flex;gap:8px;justify-content:flex-end;">
              ${this._makeProgressDots(this.currentScene, QUIZ_SCENES.length)}
            </div>
          </div>
        </div>

        <!-- Chapter heading -->
        <div style="position:absolute;top:52px;left:0;width:100%;text-align:center;z-index:2;">
          <div style="font-size:44px;letter-spacing:.08em;color:#8fc0ff;margin-bottom:6px;">${scene.chapter}</div>
          <div style="font-size:22px;color:#bcd6ff;">${scene.title}</div>
        </div>

        <!-- Bottom panel -->
        <div style="position:absolute;left:22px;right:22px;bottom:20px;z-index:2;">
          <!-- Narration box -->
          <div style="
            background:linear-gradient(180deg,rgba(3,10,25,.62),rgba(4,11,28,.72));
            border:1px solid rgba(182,140,66,.24);
            border-radius:16px;
            padding:12px 16px;
            margin:0 auto 10px;
            max-width:760px;
            text-align:center;
            backdrop-filter:blur(3px);
          ">
            <div style="color:#7cb8ff;font-size:11px;letter-spacing:.14em;text-transform:uppercase;margin-bottom:6px;">The Chamber Whispers…</div>
            <div style="font-size:14px;line-height:1.45;color:#e9e1ce;margin-bottom:6px;">${scene.narration}</div>
            <div style="font-size:17px;line-height:1.4;color:#e3aa41;font-style:italic;font-weight:700;margin-bottom:8px;">"${scene.quote}"</div>
            <div style="font-size:16px;color:#f4ead6;">${scene.prompt}</div>
          </div>

          <!-- Choices -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            ${scene.choices.map((c, i) => `
              <button
                class="pt-choice"
                data-index="${i}"
                style="
                  display:flex;align-items:center;gap:14px;text-align:left;
                  padding:13px 15px;min-height:70px;
                  border-radius:14px;border:1px solid ${c.accent};
                  background:linear-gradient(180deg,rgba(8,15,32,.94),rgba(10,18,38,.96));
                  color:#f6eedb;cursor:pointer;
                  font-family:Georgia,'Times New Roman',serif;
                "
              >
                <div style="
                  width:36px;height:36px;min-width:36px;border-radius:999px;
                  border:1px solid ${c.accent};display:flex;align-items:center;justify-content:center;
                  color:${c.accent};font-size:17px;
                ">${c.number}</div>
                <div style="flex:1;font-size:15px;line-height:1.35;">${c.label}</div>
              </button>
            `).join('')}
          </div>

          <!-- Footer -->
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;">
            <div style="color:rgba(255,255,255,.6);font-size:13px;">The chamber is reading your pattern.</div>
            <button id="pt-leave-quiz" style="
              padding:9px 14px;border-radius:12px;
              border:1px solid rgba(255,255,255,.20);
              background:rgba(0,0,0,.34);color:#ddd6c0;
              cursor:pointer;font-family:inherit;font-size:13px;
            ">Leave Chamber</button>
          </div>
        </div>
      </div>
    `);

    this.overlay.querySelectorAll('.pt-choice').forEach(btn => {
      btn.addEventListener('click', () => {
        const choice = scene.choices[Number(btn.dataset.index)];
        Object.entries(choice.weights || {}).forEach(([k, v]) => { this.scores[k] = (this.scores[k] || 0) + v; });
        this.currentScene++;
        if (this.currentScene < QUIZ_SCENES.length) {
          this._renderQuizScene();
        } else {
          this._renderQuizResults();
        }
      });
    });

    this.overlay.querySelector('#pt-leave-quiz').addEventListener('click', () => {
      this.destroy();
      this.onClose();
    });
  }

  /* ────────────────────────────────────────────────────
     PHASE 1C — Quiz Results → Persona Reveal
  ──────────────────────────────────────────────────── */
  _calcPercentages() {
    const total = Object.values(this.scores).reduce((s, v) => s + v, 0) || 1;
    const out = {};
    for (const [k, v] of Object.entries(this.scores)) out[k] = Math.round((v / total) * 100);
    const diff = 100 - Object.values(out).reduce((a, b) => a + b, 0);
    if (diff) out[Object.keys(out).sort((a, b) => out[b] - out[a])[0]] += diff;
    return out;
  }

  _renderQuizResults() {
    const pct     = this._calcPercentages();
    const primary = Object.entries(pct).sort((a, b) => b[1] - a[1])[0][0];
    const meta    = PERSONA_META[primary];

    this._setContent(`
      <style>
        @keyframes ptFadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        @keyframes ptGlowPulse { 0%,100%{opacity:.55} 50%{opacity:1} }
        @keyframes ptBarGrow { from{width:0} to{width:var(--w)} }
        .pt-result-card { animation: ptFadeUp .45s ease both; }
        .pt-result-btn { transition: filter .15s, transform .15s; }
        .pt-result-btn:hover { filter:brightness(1.1); transform:translateY(-2px); }
        .pt-bar { animation: ptBarGrow .9s cubic-bezier(.22,1,.36,1) both; animation-delay:.35s; }
      </style>
      <div class="pt-result-card" style="
        width:min(860px,92vw);
        border-radius:22px;overflow:hidden;
        border:1px solid ${meta.color}66;
        box-shadow:0 24px 70px rgba(0,0,0,.55),0 0 60px ${meta.glow};
        background:
          linear-gradient(180deg,rgba(3,10,25,.92),rgba(4,11,28,.97)),
          url('${VISION_BG}') center/cover no-repeat;
        color:#f7f1de;
      ">
        <div style="padding:20px 26px;border-bottom:1px solid rgba(255,255,255,.08);color:#8fc0ff;font-size:12px;letter-spacing:.18em;text-transform:uppercase;">
          Persona Revealed
        </div>

        <div style="padding:22px 26px 26px;display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start;">
          <!-- Left: identity -->
          <div>
            <div style="font-size:52px;color:${meta.color};margin-bottom:6px;animation:ptGlowPulse 2.4s ease-in-out infinite;">${meta.icon}</div>
            <div style="font-size:36px;color:#f4ead6;margin-bottom:8px;">${meta.title}</div>
            <div style="font-size:14px;line-height:1.6;color:#ddd6c0;margin-bottom:10px;">${meta.summary}</div>
            <div style="font-size:13px;line-height:1.55;color:#a0aec0;font-style:italic;">
              <span style="color:#e3aa41;font-style:normal;font-weight:700;">Growth edge:</span> ${meta.growth}
            </div>
          </div>

          <!-- Right: bars -->
          <div>
            <div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#8fc0ff;margin-bottom:14px;">Persona Composition</div>
            ${['technologist','scrummer','planner','finisher'].map(k => `
              <div style="margin-bottom:12px;">
                <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:5px;">
                  <span>${PERSONA_META[k].title}</span>
                  <span style="color:${PERSONA_META[k].color};font-weight:700;">${pct[k]}%</span>
                </div>
                <div style="width:100%;height:9px;border-radius:999px;background:rgba(255,255,255,.10);overflow:hidden;">
                  <div class="pt-bar" style="
                    --w:${pct[k]}%;
                    height:100%;
                    background:linear-gradient(90deg,${PERSONA_META[k].color},${PERSONA_META[k].color}99);
                    border-radius:999px;
                  "></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="padding:0 26px 26px;display:flex;gap:14px;justify-content:flex-end;flex-wrap:wrap;border-top:1px solid rgba(255,255,255,.06);padding-top:18px;">
          <div style="flex:1;font-size:13px;color:rgba(255,255,255,.6);line-height:1.5;align-self:center;">
            This is a living snapshot, not a fixed label.<br>
            It will help the chamber form your team.
          </div>
          <button id="pt-to-groups-btn" class="pt-result-btn" style="
            padding:13px 26px;border:none;border-radius:12px;
            background:linear-gradient(135deg,${meta.color},${meta.color}aa);
            color:#0a0e1a;font-family:inherit;font-size:15px;font-weight:700;cursor:pointer;
          ">Continue to Group Formation →</button>
          <button id="pt-close-results" class="pt-result-btn" style="
            padding:13px 16px;border-radius:12px;
            border:1px solid rgba(255,255,255,.18);background:rgba(0,0,0,.3);
            color:#ddd6c0;font-family:inherit;font-size:13px;cursor:pointer;
          ">Leave</button>
        </div>
      </div>
    `);

    this.overlay.querySelector('#pt-to-groups-btn').addEventListener('click', () => {
      this._chapterTransition('GROUP FORMATION BEGINS', 'Your persona is known. Now the work of building teams begins.', () => {
        this._renderGroupFormation(primary);
      });
    });
    this.overlay.querySelector('#pt-close-results').addEventListener('click', () => {
      this.destroy();
      this.onClose();
    });
  }

  /* ────────────────────────────────────────────────────
     CHAPTER TRANSITION — cinematic between phases
  ──────────────────────────────────────────────────── */
  _chapterTransition(chapter, subtitle, then) {
    this._setContent(`
      <style>
        @keyframes ptTransIn { from{opacity:0;letter-spacing:.5em} to{opacity:1;letter-spacing:.10em} }
        @keyframes ptTransSub { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        @keyframes ptTransFade { 0%{opacity:0} 30%{opacity:1} 70%{opacity:1} 100%{opacity:0} }
        .pt-trans-wrap { animation: ptTransFade 2.2s ease forwards; }
        .pt-trans-title { animation: ptTransIn .7s ease both .1s; }
        .pt-trans-sub { animation: ptTransSub .6s ease both .45s; }
      </style>
      <div class="pt-trans-wrap" style="text-align:center;color:#f7f1de;pointer-events:none;">
        <div style="color:#8fc0ff;font-size:13px;letter-spacing:.2em;text-transform:uppercase;margin-bottom:12px;">✦</div>
        <div class="pt-trans-title" style="font-size:46px;letter-spacing:.10em;color:#8fc0ff;">${chapter}</div>
        <div class="pt-trans-sub" style="font-size:18px;color:#e9e1ce;margin-top:10px;max-width:460px;">${subtitle}</div>
      </div>
    `);
    setTimeout(then, 2300);
  }

  /* ────────────────────────────────────────────────────
     PHASE 2 — Group Formation Settings
  ──────────────────────────────────────────────────── */
  _renderGroupFormation(primaryPersona) {
    const meta = PERSONA_META[primaryPersona] || PERSONA_META.technologist;
  
    this._setContent(`
      <div style="
        width:min(620px,92vw);
        border-radius:22px;
        border:1px solid ${meta.color}55;
        box-shadow:0 24px 70px rgba(0,0,0,.55),0 0 50px ${meta.glow};
        background:
          linear-gradient(180deg,rgba(3,10,25,.93),rgba(4,11,28,.98)),
          url('${VISION_BG}') center/cover no-repeat;
        color:#f7f1de;
        padding:30px;
        text-align:center;
      ">
        <div style="font-size:42px;color:${meta.color};margin-bottom:10px;">${meta.icon}</div>
  
        <div style="font-size:13px;letter-spacing:.16em;text-transform:uppercase;color:#8fc0ff;margin-bottom:8px;">
          Team Simulation
        </div>
  
        <div style="font-size:28px;color:#f4ead6;margin-bottom:10px;">
          You belong as a ${meta.title}
        </div>
  
        <div style="font-size:14px;line-height:1.6;color:#ddd6c0;max-width:460px;margin:0 auto 18px;">
          The chamber will create a balanced simulated team of 6 members around your persona.
        </div>
  
        <div style="font-size:13px;color:rgba(255,255,255,.55);margin-bottom:24px;">
          No roster, class period, or backend data is used.
        </div>
  
        <div id="pt-form-status" style="font-size:13px;color:#f87171;min-height:20px;margin-bottom:12px;"></div>
  
        <div style="display:flex;justify-content:space-between;gap:12px;">
          <button id="pt-back-btn" style="
            padding:11px 18px;
            border-radius:11px;
            border:1px solid rgba(255,255,255,.18);
            background:rgba(0,0,0,.3);
            color:#ddd6c0;
            font-family:inherit;
            font-size:13px;
            cursor:pointer;
          ">← Back</button>
  
          <button id="pt-generate-btn" style="
            padding:13px 28px;
            border:none;
            border-radius:12px;
            background:linear-gradient(135deg,${meta.color},${meta.color}aa);
            color:#0a0e1a;
            font-family:inherit;
            font-size:15px;
            font-weight:700;
            cursor:pointer;
          ">Generate My Team →</button>
        </div>
      </div>
    `);
  
    this.overlay.querySelector('#pt-back-btn').addEventListener('click', () => {
      this._renderQuizResults();
    });
  
    this.overlay.querySelector('#pt-generate-btn').addEventListener('click', () => {
      this._handleGenerate(primaryPersona);
    });
  }  /* ────────────────────────────────────────────────────
     PHASE 3 — Generate + Reveal
  ──────────────────────────────────────────────────── */
  async _handleGenerate(primaryPersona) {
    const groupSize = 6;
  
    const meta = PERSONA_META[primaryPersona] || PERSONA_META.technologist;
  
    const currentUser = {
      id: 0,
      uid: 'you',
      name: 'You',
      persona: primaryPersona,
      role: meta.title,
    };
  
    const mockUsers = [
      { id: 1, uid: 'indy', name: 'Indy', persona: 'technologist', role: 'Technologist' },
      { id: 2, uid: 'salem', name: 'Salem', persona: 'scrummer', role: 'Scrummer' },
      { id: 3, uid: 'phoenix', name: 'Phoenix', persona: 'planner', role: 'Planner' },
      { id: 4, uid: 'cody', name: 'Cody', persona: 'finisher', role: 'Finisher' },
      { id: 5, uid: 'pixel', name: 'Pixel', persona: 'technologist', role: 'Technologist' },
      { id: 6, uid: 'cadence', name: 'Cadence', persona: 'scrummer', role: 'Scrummer' },
      { id: 7, uid: 'ace', name: 'Ace', persona: 'finisher', role: 'Finisher' },
      { id: 8, uid: 'marco', name: 'Marco', persona: 'planner', role: 'Planner' },
    ];
  
    const otherPersonas = ['technologist', 'scrummer', 'planner', 'finisher']
    .filter(p => p !== primaryPersona);
  
    const balancedPool = [];
    
    otherPersonas.forEach(persona => {
      const candidates = mockUsers.filter(u => u.persona === persona);
      const picked = candidates[Math.floor(Math.random() * candidates.length)];
      if (picked) balancedPool.push(picked);
    });
    
    const remainingPool = mockUsers
      .filter(u => !balancedPool.some(p => p.uid === u.uid))
      .sort(() => Math.random() - 0.5);
    
    const needed = groupSize - 1;
    
    const teammates = [
      ...balancedPool,
      ...remainingPool,
    ].slice(0, needed);
    
    const yourTeam = [currentUser, ...teammates];  
    const namedGroups = [
      {
        name: `Your ${meta.title} Team`,
        period: 'simulation',
        course: 'simulation',
        team_score: Math.floor(72 + Math.random() * 22),
        memberIds: [],
        members: yourTeam,
      }
    ];
  
    this._chapterTransition(
      'YOUR TEAM IS FORMING',
      `The chamber recognizes you as a ${meta.title} and places you with a simulated team.`,
      () => {
        this._renderReveal(namedGroups, 'simulation', primaryPersona);
      }
    );
  }/* ────────────────────────────────────────────────────
     PHASE 4 — Group Reveal Screen
  ──────────────────────────────────────────────────── */
  _renderReveal(namedGroups, method, primaryPersona) {
    const meta = PERSONA_META[primaryPersona] || PERSONA_META.technologist;
    const badgeLabel = 'Simulated Team';
    const badgeBg = '#4f46e5';
    const strengths = {
      technologist: 'deep technical problem solving',
      scrummer: 'team coordination and momentum',
      planner: 'structure and strategic direction',
      finisher: 'execution and follow-through',
    };
  
    const team = namedGroups[0];
    const counts = { technologist: 0, scrummer: 0, planner: 0, finisher: 0 };
  
    team.members.forEach(m => {
      if (counts[m.persona] !== undefined) counts[m.persona]++;
    });
  
    const total = team.members.length || 1;
  
    const compositionBars = Object.entries(counts).map(([key, count]) => {
      const p = PERSONA_META[key];
      const percent = Math.round((count / total) * 100);
  
      return `
        <div style="margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px;">
            <span style="color:#f4ead6;">${p.icon} ${p.title}</span>
            <span style="color:${p.color};font-weight:700;">${percent}%</span>
          </div>
          <div style="height:9px;border-radius:999px;background:rgba(255,255,255,.10);overflow:hidden;">
            <div style="
              width:${percent}%;
              height:100%;
              border-radius:999px;
              background:linear-gradient(90deg,${p.color},${p.color}99);
            "></div>
          </div>
        </div>
      `;
    }).join('');
  
    const memberPills = team.members.map(m => {
      const p = PERSONA_META[m.persona] || PERSONA_META.technologist;
  
      return `
        <span style="
          display:inline-flex;
          align-items:center;
          gap:6px;
          padding:6px 11px;
          border-radius:999px;
          background:rgba(255,255,255,.07);
          border:1px solid ${p.color}66;
          font-size:12px;
          color:#ddd6c0;
        ">
          <span style="color:${p.color};">${p.icon}</span>
          ${m.name}
          <span style="color:rgba(255,255,255,.45);">${p.title}</span>
        </span>
      `;
    }).join('');
  
    this._setContent(`
      <style>
        @keyframes ptFadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        .pt-reveal-btn { transition:filter .15s,transform .15s; }
        .pt-reveal-btn:hover { filter:brightness(1.1);transform:translateY(-2px); }
      </style>
  
      <div style="
        width:min(920px,92vw);
        max-height:88vh;
        overflow-y:auto;
        border-radius:22px;
        border:1px solid ${meta.color}55;
        box-shadow:0 24px 70px rgba(0,0,0,.55),0 0 50px ${meta.glow};
        background:
          linear-gradient(180deg,rgba(3,10,25,.93),rgba(4,11,28,.98)),
          url('${VISION_BG}') center/cover no-repeat;
        color:#f7f1de;
      ">
        <div style="
          padding:20px 26px;
          border-bottom:1px solid rgba(255,255,255,.08);
          display:flex;
          justify-content:space-between;
          align-items:center;
        ">
          <div>
            <div style="font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#8fc0ff;margin-bottom:5px;">
              Your Simulated Team
            </div>
            <div style="font-size:22px;color:#f4ead6;">${team.name}</div>
          </div>
  
          <span style="
            display:inline-flex;
            padding:6px 14px;
            border-radius:999px;
            background:${badgeBg};
            color:#fff;
            font-size:12px;
            font-weight:700;
          ">${badgeLabel}</span>
        </div>
  
        <div style="padding:22px 26px;display:grid;grid-template-columns:1fr 1fr;gap:18px;">
          <div style="
            border-radius:16px;
            border:1px solid ${meta.color}55;
            background:rgba(255,255,255,.045);
            padding:18px;
          ">
            <div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#8fc0ff;margin-bottom:10px;">
              Your Persona Contribution
            </div>
  
            <div style="font-size:38px;color:${meta.color};margin-bottom:6px;">${meta.icon}</div>
            <div style="font-size:24px;color:#f4ead6;margin-bottom:8px;">${meta.title}</div>
            <div style="font-size:13px;line-height:1.55;color:#ddd6c0;">
              ${meta.role}
            </div>
          </div>
  
          <div style="
            border-radius:16px;
            border:1px solid rgba(255,255,255,.12);
            background:rgba(255,255,255,.045);
            padding:18px;
          ">
            <div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#8fc0ff;margin-bottom:14px;">
              Group Persona Composition
            </div>
  
            ${compositionBars}
          </div>
  
          <div style="
            grid-column:1/-1;
            border-radius:16px;
            border:1px solid rgba(255,255,255,.12);
            background:rgba(255,255,255,.04);
            padding:18px;
          ">
            <div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#8fc0ff;margin-bottom:12px;">
              Simulated Teammates
            </div>
  
            <div style="display:flex;flex-wrap:wrap;gap:8px;">
              ${memberPills}
            </div>
          </div>
  
          <div style="
            grid-column:1/-1;
            border-radius:16px;
            border:1px solid ${meta.color}44;
            background:rgba(0,0,0,.22);
            padding:16px;
            font-size:14px;
            line-height:1.6;
            color:#ddd6c0;
          ">
<span style="color:${meta.color};font-weight:700;">Why this team works:</span>
Your ${meta.title} perspective contributes ${strengths[primaryPersona]}.
Your teammates add different strengths, so the group has a stronger mix of solving, organizing, communicating, and finishing.          </div>
        </div>
  
        <div style="
          padding:18px 26px;
          border-top:1px solid rgba(255,255,255,.08);
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:14px;
          flex-wrap:wrap;
        ">
          <div style="font-size:13px;color:rgba(255,255,255,.55);">
            This is a simulated team preview created by the chamber.
          </div>
  
          <div style="display:flex;gap:12px;flex-wrap:wrap;">
            <button id="pt-reveal-back" class="pt-reveal-btn" style="
              padding:11px 18px;
              border-radius:11px;
              border:1px solid rgba(255,255,255,.18);
              background:rgba(0,0,0,.3);
              color:#ddd6c0;
              font-family:inherit;
              font-size:13px;
              cursor:pointer;
            ">← Adjust Settings</button>
  
            <button id="pt-reveal-confirm" class="pt-reveal-btn" style="
              padding:12px 26px;
              border:none;
              border-radius:12px;
              background:linear-gradient(135deg,${meta.color},${meta.color}aa);
              color:#0a0e1a;
              font-family:inherit;
              font-size:15px;
              font-weight:700;
              cursor:pointer;
            ">Continue →</button>
          </div>
        </div>
      </div>
    `);
  
    this.overlay.querySelector('#pt-reveal-back').addEventListener('click', () => {
      this._renderGroupFormation(primaryPersona);
    });
  
    this.overlay.querySelector('#pt-reveal-confirm').addEventListener('click', async () => {
      await fadeOut(this.overlay, 320);
      this.destroy();
      this.onClose();
    });
  }
}