export default class PersonaTrial {
  constructor({ onComplete, onClose } = {}) {
    this.onComplete = onComplete || (() => {});
    this.onClose = onClose || (() => {});
    this.overlay = null;
    this.card = null;
    this.currentSceneIndex = 0;

    this.scores = {
      technologist: 0,
      scrummer: 0,
      planner: 0,
      finisher: 0,
    };

    this.scenes = [
      {
        chapter: 'Vision I',
        title: 'The Chamber of First Light',
        text:
          'As you step through the gateway, the forest fades behind you. The air turns still. Lanternlight drifts across stone walls, and a voice echoes from somewhere unseen: “Every builder carries a different instinct. Let yours speak.”',
        choices: [
          {
            text: 'Step toward the brightest corridor, drawn by challenge itself.',
            weights: { technologist: 2, planner: 1 },
          },
          {
            text: 'Pause and listen for the footsteps of others before moving.',
            weights: { scrummer: 2, finisher: 1 },
          },
          {
            text: 'Study the room and search for the shape of the path first.',
            weights: { planner: 3 },
          },
          {
            text: 'Choose the clearest route and commit to reaching its end.',
            weights: { finisher: 3 },
          },
        ],
      },
      {
        chapter: 'Vision II',
        title: 'The Fractured Build',
        text:
          'A vision forms before you. It is the night before a great showcase. Your team’s project trembles at the edge of failure. One feature flickers. One teammate panics. Another falls silent. The clock grows louder.',
        choices: [
          {
            text: 'Take hold of the hardest technical flaw and begin solving it at once.',
            weights: { technologist: 3, finisher: 1 },
          },
          {
            text: 'Gather the group, steady their energy, and move everyone into sync.',
            weights: { scrummer: 3, planner: 1 },
          },
          {
            text: 'Cut through the chaos, rebuild the plan, and assign the next steps.',
            weights: { planner: 3, finisher: 1 },
          },
          {
            text: 'Carry one crucial piece fully across the line so something survives intact.',
            weights: { finisher: 3, planner: 1 },
          },
        ],
      },
      {
        chapter: 'Vision III',
        title: 'The Unwritten Path',
        text:
          'The chamber shifts again. Now you face a challenge with no instructions, no example, and no map. Only possibility. The path ahead is open, but uncertain.',
        choices: [
          {
            text: 'Push toward the boldest technical solution and discover what is possible.',
            weights: { technologist: 3 },
          },
          {
            text: 'Turn first to the others around you and shape the path together.',
            weights: { scrummer: 3, planner: 1 },
          },
          {
            text: 'Break the unknown into milestones, tasks, and a path that can be followed.',
            weights: { planner: 3, finisher: 1 },
          },
          {
            text: 'Search for clarity before committing, so your effort lands in the right place.',
            weights: { finisher: 3, planner: 1 },
          },
        ],
      },
      {
        chapter: 'Vision IV',
        title: 'The Final Passage',
        text:
          'One last vision rises. Voices clash. Progress has stalled. The project still can be saved, but only if someone chooses how to move forward when the way is no longer obvious.',
        choices: [
          {
            text: 'Take the implementation into your own hands and push progress forward.',
            weights: { technologist: 2, finisher: 1 },
          },
          {
            text: 'Guide the voices into alignment until the team can move as one.',
            weights: { scrummer: 3, planner: 1 },
          },
          {
            text: 'Define the roles, the order, and the next concrete actions.',
            weights: { planner: 3, finisher: 1 },
          },
          {
            text: 'Secure your part completely so at least one piece is unquestionably done.',
            weights: { finisher: 3 },
          },
        ],
      },
    ];
  }

  start() {
    this.renderIntro();
  }

  destroy() {
    if (this.overlay?.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
    this.overlay = null;
    this.card = null;
  }

  ensureOverlay() {
    if (this.overlay) return;

    this.overlay = document.createElement('div');
    this.overlay.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background:
        radial-gradient(circle at 50% 20%, rgba(56,189,248,0.10), transparent 24%),
        radial-gradient(circle at 20% 80%, rgba(168,85,247,0.08), transparent 24%),
        radial-gradient(circle at 80% 30%, rgba(250,204,21,0.06), transparent 20%),
        rgba(4, 8, 20, 0.50);
      backdrop-filter: blur(4px) brightness(0.84);
      -webkit-backdrop-filter: blur(4px) brightness(0.84);
      box-shadow: inset 0 0 160px rgba(0, 0, 0, 0.36);
      font-family: system-ui, sans-serif;
    `;

    this.card = document.createElement('div');
    this.card.style.cssText = `
      width: min(680px, 92%);
      max-height: 78vh;
      overflow-y: auto;
      border-radius: 18px;
      color: #f8fafc;
      background: linear-gradient(180deg, rgba(14,22,40,0.86) 0%, rgba(8,13,28,0.88) 100%);
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow:
        0 18px 46px rgba(0,0,0,0.42),
        0 0 34px rgba(96,165,250,0.08);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
    `;

    this.overlay.appendChild(this.card);
    document.body.appendChild(this.overlay);
  }

  clearCard() {
    this.ensureOverlay();
    this.card.innerHTML = '';
  }

  makeTopBar(leftText, rightText) {
    const top = document.createElement('div');
    top.style.cssText = `
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap: 10px;
      padding:12px 16px;
      border-bottom:1px solid rgba(255,255,255,0.08);
      background:linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
    `;

    const left = document.createElement('div');
    left.textContent = leftText;
    left.style.cssText = `
      color:#93c5fd;
      font-size:12px;
      font-weight:700;
      letter-spacing:0.10em;
      text-transform:uppercase;
    `;

    const right = document.createElement('div');
    right.textContent = rightText;
    right.style.cssText = `
      color:#94a3b8;
      font-size:12px;
    `;

    top.append(left, right);
    return top;
  }

  makeShell() {
    const wrap = document.createElement('div');
    wrap.style.cssText = `
      display:flex;
      flex-direction:column;
      gap: 10px;
      padding: 14px 16px 12px 16px;
    `;

    const left = document.createElement('div');
    left.style.cssText = `
      padding: 0;
    `;

    const right = document.createElement('div');
    right.style.cssText = `
      padding: 0;
    `;

    wrap.append(left, right);
    return { wrap, left, right };
  }

  makeFooter(leftNode, rightNode) {
    const footer = document.createElement('div');
    footer.style.cssText = `
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:10px;
      padding:12px 16px;
      border-top:1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.02);
    `;

    if (leftNode) footer.appendChild(leftNode);
    if (rightNode) footer.appendChild(rightNode);
    return footer;
  }

  makeButton(label, onClick, variant = 'primary') {
    const btn = document.createElement('button');
    btn.textContent = label;

    const styles = {
      primary: `
        background: linear-gradient(135deg, #60a5fa 0%, #8b5cf6 100%);
        color: #ffffff;
        border: none;
        box-shadow: 0 10px 24px rgba(96,165,250,0.16);
      `,
      secondary: `
        background: rgba(255,255,255,0.03);
        color: #cbd5e1;
        border: 1px solid rgba(255,255,255,0.14);
      `,
      choice: `
        width:100%;
        text-align:left;
        background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
        color:#f8fafc;
        border:1px solid rgba(255,255,255,0.10);
      `,
    };

    btn.style.cssText = `
      padding: 12px 14px;
      border-radius: 14px;
      cursor: pointer;
      font-size: 14px;
      line-height: 1.35;
      transition: transform 0.14s ease, opacity 0.14s ease, border-color 0.14s ease;
      ${styles[variant]}
    `;

    btn.onmouseenter = () => {
      btn.style.transform = 'translateY(-1px)';
      btn.style.opacity = '0.98';
      btn.style.borderColor = 'rgba(147,197,253,0.42)';
    };

    btn.onmouseleave = () => {
      btn.style.transform = 'translateY(0)';
      btn.style.opacity = '1';
      if (variant === 'choice') {
        btn.style.borderColor = 'rgba(255,255,255,0.10)';
      }
    };

    btn.onclick = onClick;
    return btn;
  }

  applyWeights(weights = {}) {
    Object.entries(weights).forEach(([key, value]) => {
      if (typeof this.scores[key] === 'number') {
        this.scores[key] += value;
      }
    });
  }

  getPercentages() {
    const total = Object.values(this.scores).reduce((sum, v) => sum + v, 0) || 1;
    const out = {};

    for (const [key, value] of Object.entries(this.scores)) {
      out[key] = Math.round((value / total) * 100);
    }

    const sum = Object.values(out).reduce((a, b) => a + b, 0);
    const diff = 100 - sum;
    if (diff !== 0) {
      const maxKey = Object.keys(out).sort((a, b) => out[b] - out[a])[0];
      out[maxKey] += diff;
    }

    return out;
  }

  getPrimaryPersona(percentages) {
    return Object.entries(percentages).sort((a, b) => b[1] - a[1])[0][0];
  }

  getPersonaInsights(primary) {
    const map = {
      technologist: {
        title: 'Technologist',
        summary: 'You are drawn toward difficult systems, deep mastery, and solving what others hesitate to touch.',
        growth: 'When trust and communication grow alongside your skill, your influence becomes even stronger.',
      },
      scrummer: {
        title: 'Scrummer',
        summary: 'You create momentum through people, collaboration, and the energy of moving forward together.',
        growth: 'Making your individual impact more visible will help others see the leadership you already carry.',
      },
      planner: {
        title: 'Planner',
        summary: 'You see structure inside complexity and naturally shape scattered effort into a path others can follow.',
        growth: 'Your confidence expands when planning stays paired with direct action.',
      },
      finisher: {
        title: 'Finisher',
        summary: 'You are driven by clarity, completion, and the quiet confidence of bringing work across the finish line.',
        growth: 'As ambiguity rises, trusting your own judgment sooner will make you even stronger.',
      },
    };

    return map[primary];
  }

  makeBar(label, percent) {
    const wrap = document.createElement('div');
    wrap.style.cssText = `margin-bottom:12px;`;

    const top = document.createElement('div');
    top.style.cssText = `
      display:flex;
      justify-content:space-between;
      align-items:center;
      margin-bottom:6px;
      color:#e2e8f0;
      font-size:14px;
    `;

    const left = document.createElement('span');
    left.textContent = label;

    const right = document.createElement('span');
    right.textContent = `${percent}%`;
    right.style.cssText = `color:#bfdbfe; font-weight:700;`;

    top.append(left, right);

    const track = document.createElement('div');
    track.style.cssText = `
      width:100%;
      height:10px;
      border-radius:999px;
      background: rgba(255,255,255,0.08);
      overflow:hidden;
    `;

    const fill = document.createElement('div');
    fill.style.cssText = `
      width:${percent}%;
      height:100%;
      border-radius:999px;
      background: linear-gradient(90deg, #60a5fa 0%, #8b5cf6 100%);
      box-shadow: 0 0 16px rgba(96,165,250,0.16);
    `;

    track.appendChild(fill);
    wrap.append(top, track);
    return wrap;
  }

  renderIntro() {
    this.clearCard();

    this.card.appendChild(this.makeTopBar('Persona Enrichment Gateway', 'Threshold'));

    const { wrap, left, right } = this.makeShell();

    const orb = document.createElement('div');
    orb.style.cssText = `
      width: 64px;
      height: 64px;
      border-radius: 999px;
      margin-bottom: 14px;
      background: radial-gradient(circle, rgba(147,197,253,0.95) 0%, rgba(96,165,250,0.50) 36%, rgba(168,85,247,0.28) 56%, rgba(0,0,0,0) 74%);
      box-shadow: 0 0 34px rgba(96,165,250,0.20);
    `;

    const title = document.createElement('h2');
    title.textContent = 'The Chamber of Persona';
    title.style.cssText = `
      margin:0 0 10px 0;
      font-size: 30px;
      line-height:1.05;
      letter-spacing:-0.02em;
    `;

    const text = document.createElement('p');
    text.textContent =
      'Beyond this threshold, your instincts will be reflected back to you through a sequence of living visions. There are no correct answers here—only the shape of the path that feels most like yours.';
    text.style.cssText = `
      margin:0;
      color:#cbd5e1;
      line-height:1.6;
      font-size:15px;
    `;

    left.append(orb, title, text);

    const panel = document.createElement('div');
    panel.style.cssText = `
      padding:16px;
      border-radius:16px;
      border:1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.03);
    `;

    const panelLabel = document.createElement('div');
    panelLabel.textContent = 'What the gateway will reveal';
    panelLabel.style.cssText = `
      margin-bottom:10px;
      color:#93c5fd;
      font-size:12px;
      text-transform:uppercase;
      letter-spacing:0.10em;
      font-weight:700;
    `;

    const panelText = document.createElement('p');
    panelText.textContent =
      'You will walk through moments shaped by uncertainty, teamwork, pressure, and choice. At the end, the gateway will reveal your current persona as a living balance, not a fixed label.';
    panelText.style.cssText = `
      margin:0 0 14px 0;
      color:#e2e8f0;
      line-height:1.55;
      font-size:14px;
    `;

    const beginBtn = this.makeButton('Step Into the Vision', () => {
      this.currentSceneIndex = 0;
      this.renderScene();
    }, 'primary');

    const leaveBtn = this.makeButton('Turn Back', () => {
      this.destroy();
      this.onClose();
    }, 'secondary');

    const actionWrap = document.createElement('div');
    actionWrap.style.cssText = `display:grid; gap:10px;`;
    actionWrap.append(beginBtn, leaveBtn);

    panel.append(panelLabel, panelText, actionWrap);
    right.appendChild(panel);

    const leftFooter = document.createElement('div');
    leftFooter.textContent = 'The chamber responds to instinct, not performance.';
    leftFooter.style.cssText = `color:#94a3b8; font-size:13px;`;

    this.card.append(wrap, this.makeFooter(leftFooter, null));
  }

  renderScene() {
    const scene = this.scenes[this.currentSceneIndex];
    this.clearCard();

    this.card.appendChild(
      this.makeTopBar(scene.chapter, `Vision ${this.currentSceneIndex + 1} of ${this.scenes.length}`)
    );

    const { wrap, left, right } = this.makeShell();

    const title = document.createElement('h2');
    title.textContent = scene.title;
    title.style.cssText = `
      margin:0 0 10px 0;
      font-size:28px;
      line-height:1.08;
      letter-spacing:-0.02em;
    `;

    const text = document.createElement('p');
    text.textContent = scene.text;
    text.style.cssText = `
      margin:0;
      color:#dbeafe;
      line-height:1.6;
      font-size:15px;
    `;

    const hint = document.createElement('div');
    hint.textContent = 'Choose the response that feels most natural in this moment.';
    hint.style.cssText = `
      margin-top:12px;
      color:#94a3b8;
      font-size:13px;
    `;

    left.append(title, text, hint);

    const label = document.createElement('div');
    label.textContent = 'How do you answer the vision?';
    label.style.cssText = `
      margin-bottom:10px;
      color:#93c5fd;
      font-size:12px;
      text-transform:uppercase;
      letter-spacing:0.10em;
      font-weight:700;
    `;

    const choices = document.createElement('div');
    choices.style.cssText = `display:grid; gap:10px;`;

    scene.choices.forEach((choice) => {
      const btn = this.makeButton(choice.text, () => {
        this.applyWeights(choice.weights);

        if (this.currentSceneIndex < this.scenes.length - 1) {
          this.currentSceneIndex += 1;
          this.renderScene();
        } else {
          this.renderResults();
        }
      }, 'choice');

      choices.appendChild(btn);
    });

    right.append(label, choices);

    const footerLeft = document.createElement('div');
    footerLeft.textContent = 'The gateway is reading your pattern.';
    footerLeft.style.cssText = `color:#94a3b8; font-size:13px;`;

    const footerRight = this.makeButton('Leave Chamber', () => {
      this.destroy();
      this.onClose();
    }, 'secondary');

    this.card.append(wrap, this.makeFooter(footerLeft, footerRight));
  }

  renderResults() {
    const percentages = this.getPercentages();
    const primary = this.getPrimaryPersona(percentages);
    const insights = this.getPersonaInsights(primary);

    const result = {
      scores: { ...this.scores },
      percentages,
      primaryPersona: primary,
      title: insights.title,
      summary: insights.summary,
      growth: insights.growth,
      completedAt: new Date().toISOString(),
    };

    this.clearCard();

    this.card.appendChild(this.makeTopBar('Persona Revealed', 'Revelation'));

    const { wrap, left, right } = this.makeShell();

    const label = document.createElement('div');
    label.textContent = 'The chamber reveals your current path as...';
    label.style.cssText = `
      margin-bottom:8px;
      color:#93c5fd;
      font-size:12px;
      text-transform:uppercase;
      letter-spacing:0.10em;
      font-weight:700;
    `;

    const title = document.createElement('h2');
    title.textContent = insights.title;
    title.style.cssText = `
      margin:0 0 10px 0;
      font-size:32px;
      line-height:1.05;
      letter-spacing:-0.02em;
    `;

    const summary = document.createElement('p');
    summary.textContent = insights.summary;
    summary.style.cssText = `
      margin:0 0 10px 0;
      color:#e2e8f0;
      line-height:1.6;
      font-size:15px;
    `;

    const growth = document.createElement('p');
    growth.textContent = `Growth edge: ${insights.growth}`;
    growth.style.cssText = `
      margin:0;
      color:#cbd5e1;
      line-height:1.6;
      font-size:14px;
    `;

    left.append(label, title, summary, growth);

    const panel = document.createElement('div');
    panel.style.cssText = `
      padding:16px;
      border-radius:16px;
      border:1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.03);
    `;

    const panelTitle = document.createElement('div');
    panelTitle.textContent = 'Current persona balance';
    panelTitle.style.cssText = `
      margin-bottom:12px;
      color:#93c5fd;
      font-size:12px;
      text-transform:uppercase;
      letter-spacing:0.10em;
      font-weight:700;
    `;

    panel.append(
      panelTitle,
      this.makeBar('Technologist', percentages.technologist),
      this.makeBar('Scrummer', percentages.scrummer),
      this.makeBar('Planner', percentages.planner),
      this.makeBar('Finisher', percentages.finisher),
    );

    const note = document.createElement('p');
    note.textContent =
      'This is a living snapshot, not a permanent label. As your choices change, the balance of your persona can shift with them.';
    note.style.cssText = `
      margin:12px 0 0 0;
      color:#94a3b8;
      line-height:1.55;
      font-size:13px;
    `;

    panel.appendChild(note);
    right.appendChild(panel);

    const footerLeft = document.createElement('div');
    footerLeft.textContent = 'Your path continues beyond this chamber.';
    footerLeft.style.cssText = `color:#94a3b8; font-size:13px;`;

    const footerRight = this.makeButton('Accept Revelation', () => {
      this.destroy();
      this.onComplete(result);
    }, 'primary');

    this.card.append(wrap, this.makeFooter(footerLeft, footerRight));
  }
}