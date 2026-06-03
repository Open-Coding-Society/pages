/**
 * AboutMeBuilder
 * --------------
 * Gamified markdown editor for Wayfinding World.
 *
 * Students build an About Me page using markdown skills from Code Hub.
 * They earn points for identity, persona, CS interests, fun facts,
 * headings, lists, links, and overall completeness.
 */

export default class AboutMeBuilder {
  constructor({ profileData = {}, onComplete, onClose } = {}) {
    this.profileData = profileData;
    this.onComplete = onComplete || (() => {});
    this.onClose = onClose || (() => {});
    this.overlay = null;
    this.usedBuilder = false;

    const persona =
      profileData?.personaMeta?.title ||
      profileData?.persona ||
      profileData?.aboutMeMeta?.persona ||
      '';

    this.state = {
      name: profileData?.name || '',
      persona,
      interests: '',
      funFacts: '',
      markdown: profileData?.aboutMeMeta?.markdown || '',
    };
  }

  start() {
    this._render();
  }

   _defaultMarkdown() {
    return `# About Me: <!-- Add your name here -->

    ## Identity
    <!-- Write 2-3 sentences about who you are. Include your persona, but explain it in your own words. -->

    ## My CS Interests
    <!-- Replace these comments with 3-5 bullet points about your real CS interests. -->
    - 
    - 
    - 

    ## Fun Facts
    <!-- Add 3 fun facts. Make them specific. -->
    - 
    - 
    - 

    ## Markdown Skills I Used
    <!-- Show that you know markdown. Use bold, a link, and inline code somewhere in this page. -->

    ## My CS Goal
    <!-- Write one specific goal for this class/project. -->
    `;
    }

  _render() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'amb-overlay';

    const starterMarkdown = this.state.markdown || this._defaultMarkdown();

    this.overlay.innerHTML = `
      <style>
        .amb-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(3, 7, 18, 0.94);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Courier New", monospace;
          color: #f8fafc;
        }

        .amb-modal {
          width: min(1120px, 94vw);
          max-height: 90vh;
          overflow: hidden;
          background: linear-gradient(180deg, #111827, #020617);
          border: 2px solid #f59e0b;
          border-radius: 18px;
          box-shadow: 0 0 32px rgba(245, 158, 11, 0.35);
          display: flex;
          flex-direction: column;
        }

        .amb-header {
          padding: 18px 24px;
          border-bottom: 1px solid rgba(245, 158, 11, 0.35);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(15, 23, 42, 0.96);
        }

        .amb-title {
          font-size: 24px;
          font-weight: bold;
          color: #fbbf24;
        }

        .amb-subtitle {
          font-size: 12px;
          color: #fde68a;
          margin-top: 4px;
        }

        .amb-scorebox {
          text-align: right;
          font-size: 13px;
          color: #fef3c7;
        }

        .amb-score {
          font-size: 28px;
          color: #facc15;
          font-weight: bold;
        }

        .amb-body {
          padding: 18px;
          overflow: auto;
        }

        .amb-grid {
          display: grid;
          grid-template-columns: 0.85fr 1.2fr 1.1fr;
          gap: 16px;
        }

        .amb-panel {
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(251, 191, 36, 0.3);
          border-radius: 14px;
          padding: 14px;
        }

        .amb-panel h3 {
          margin: 0 0 10px;
          color: #fbbf24;
          font-size: 15px;
        }

        .amb-label {
          display: block;
          margin-top: 10px;
          margin-bottom: 4px;
          color: #fde68a;
          font-size: 12px;
        }

        .amb-input,
        .amb-textarea,
        .amb-editor {
          width: 100%;
          box-sizing: border-box;
          background: #020617;
          border: 1px solid rgba(148, 163, 184, 0.45);
          color: #e5e7eb;
          border-radius: 10px;
          padding: 10px;
          font-family: "Courier New", monospace;
          resize: vertical;
        }

        .amb-input {
          min-height: 38px;
        }

        .amb-textarea {
          min-height: 72px;
        }

        .amb-editor {
          min-height: 430px;
          line-height: 1.45;
        }

        .amb-preview {
            min-height: 430px;
            background: #020617;
            color: #e5e7eb;
            border: 1px solid rgba(251, 191, 36, 0.35);
            border-radius: 12px;
            padding: 16px;
            font-family: Arial, sans-serif;
            overflow: auto;
            line-height: 1.5;
        }

        .amb-preview h1 {
            margin-top: 0;
            color: #fbbf24;
        }

        .amb-preview h2 {
            color: #f59e0b;
            border-bottom: 1px solid rgba(251, 191, 36, 0.35);
            padding-bottom: 4px;
        }

        .amb-preview h3 {
            color: #fde68a;
        }

        .amb-preview p,
        .amb-preview li {
            color: #e5e7eb;
        }

        .amb-preview a {
            color: #38bdf8;
        }

        .amb-preview code {
            background: #111827;
            color: #facc15;
            padding: 2px 5px;
            border-radius: 5px;
        }

        .amb-quest {
          display: flex;
          gap: 8px;
          align-items: flex-start;
          padding: 9px;
          border-radius: 10px;
          background: rgba(30, 41, 59, 0.9);
          border: 1px solid rgba(148, 163, 184, 0.25);
          margin-bottom: 8px;
          font-size: 12px;
          line-height: 1.35;
        }

        .amb-quest.done {
          border-color: rgba(34, 197, 94, 0.65);
          background: rgba(20, 83, 45, 0.4);
        }

        .amb-badge {
          width: 22px;
          height: 22px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #334155;
          color: #cbd5e1;
          flex-shrink: 0;
          font-weight: bold;
        }

        .amb-quest.done .amb-badge {
          background: #22c55e;
          color: #052e16;
        }

        .amb-actions {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          padding: 14px 18px;
          border-top: 1px solid rgba(245, 158, 11, 0.35);
          background: rgba(15, 23, 42, 0.96);
        }

        .amb-btn {
          border: 1px solid rgba(251, 191, 36, 0.6);
          background: rgba(245, 158, 11, 0.15);
          color: #fef3c7;
          border-radius: 10px;
          padding: 9px 14px;
          cursor: pointer;
          font-family: "Courier New", monospace;
          font-weight: bold;
        }

        .amb-btn:hover {
          background: rgba(245, 158, 11, 0.28);
        }

        .amb-btn.primary {
          background: #f59e0b;
          color: #111827;
        }

        .amb-btn.danger {
          border-color: rgba(248, 113, 113, 0.7);
          color: #fecaca;
          background: rgba(127, 29, 29, 0.35);
        }

        .amb-hint {
          font-size: 11px;
          color: #cbd5e1;
          line-height: 1.45;
          margin-top: 10px;
        }

        @media (max-width: 900px) {
          .amb-grid {
            grid-template-columns: 1fr;
          }

          .amb-editor,
          .amb-preview {
            min-height: 300px;
          }
        }
      </style>

      <div class="amb-modal">
        <div class="amb-header">
          <div>
            <div class="amb-title">ABOUT ME BUILDER</div>
            <div class="amb-subtitle">Use markdown skills to build your personal CS identity page.</div>
          </div>
          <div class="amb-scorebox">
            Builder Score<br>
            <span class="amb-score" id="amb-score">0</span> / 100
          </div>
        </div>

        <div class="amb-body">
          <div class="amb-grid">
            <div class="amb-panel">
              <h3>Identity Inputs</h3>

              <label class="amb-label">Name</label>
              <input class="amb-input" id="amb-name" value="${this._escapeAttr(this.state.name)}" placeholder="Your name">

              <label class="amb-label">Persona</label>
              <input class="amb-input" id="amb-persona" value="${this._escapeAttr(this.state.persona)}" placeholder="Technologist, Planner, Scrummer, Finisher...">

              <label class="amb-label">CS Interests</label>
              <textarea class="amb-textarea" id="amb-interests" placeholder="Example: frontend, game design, AI, cybersecurity"></textarea>

              <label class="amb-label">Fun Facts</label>
              <textarea class="amb-textarea" id="amb-facts" placeholder="Example: hobbies, favorite games, music, sports, goals"></textarea>

              <button class="amb-btn" id="amb-generate">Generate Starter Page</button>

              <div class="amb-hint">
                Goal: make the page personal, structured, and readable. 
                Use markdown headings, bold text, bullet lists, and at least one link.
              </div>
            </div>

            <div class="amb-panel">
              <h3>Markdown Editor</h3>
              <textarea class="amb-editor" id="amb-editor">${this._escapeHtml(starterMarkdown)}</textarea>
            </div>

            <div class="amb-panel">
              <h3>Live Preview</h3>
              <div class="amb-preview" id="amb-preview"></div>
            </div>
          </div>

          <div class="amb-panel" style="margin-top:16px;">
            <h3>Quest Checklist</h3>
            <div id="amb-quests"></div>
          </div>
        </div>

        <div class="amb-actions">
          <button class="amb-btn danger" id="amb-close">Close</button>
          <div>
            <button class="amb-btn" id="amb-download">Download .md</button>
            <button class="amb-btn primary" id="amb-complete">Complete Quest</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.overlay);

    this.editor = this.overlay.querySelector('#amb-editor');
    this.preview = this.overlay.querySelector('#amb-preview');

    this.overlay.querySelector('#amb-close').onclick = () => this._close();
    this.overlay.querySelector('#amb-generate').onclick = () => this._generateFromInputs();
    this.overlay.querySelector('#amb-download').onclick = () => this._downloadMarkdown();
    this.overlay.querySelector('#amb-complete').onclick = () => this._complete();

    this.editor.addEventListener('input', () => this._update());
    this.overlay.querySelector('#amb-name').addEventListener('input', () => this._update());
    this.overlay.querySelector('#amb-persona').addEventListener('input', () => this._update());
    this.overlay.querySelector('#amb-interests').addEventListener('input', () => this._update());
    this.overlay.querySelector('#amb-facts').addEventListener('input', () => this._update());

    this._update();
  }

 _generateFromInputs() {
    const name = this.overlay.querySelector('#amb-name').value.trim() || '<!-- Add your name -->';
    const persona = this.overlay.querySelector('#amb-persona').value.trim() || '<!-- Add your persona -->';

    this.editor.value = `# About Me: ${name}

    ## Identity
    <!-- Explain who you are in 2-3 sentences. Do NOT leave this as a comment. -->
    My CS persona is **${persona}**, which means...

    ## My CS Interests
    <!-- Add at least 3 real CS interests. -->
    - 
    - 
    - 

    ## Fun Facts
    <!-- Add at least 3 specific fun facts. -->
    - 
    - 
    - 

    ## Markdown Skills I Used
    <!-- Add one bold phrase, one link, and one inline code example. -->

    ## My CS Goal
    <!-- Write one specific goal. -->
    `;

    this.usedBuilder = true;
    this._update();
    }

  _getQuests(markdown) {
    const visibleMarkdown = markdown
        .replace(/<!--[\s\S]*?-->/g, '')
        .trim();

    const bulletMatches = visibleMarkdown.match(/^[-*]\s+\S+/gm) || [];
    const headingMatches = visibleMarkdown.match(/^#{1,3}\s+\S+/gm) || [];

    const builderPenalty = this.usedBuilder ? 0.5 : 1;

    const quests = [
        {
        label: 'Write a real personal intro, not just the template',
        points: 15,
        done: visibleMarkdown.length >= 250 && !/do not leave this as a comment/i.test(visibleMarkdown),
        },
        {
        label: 'Explain your persona in your own words',
        points: 15,
        done: /persona/i.test(visibleMarkdown) && visibleMarkdown.split(/\s+/).length >= 80,
        },
        {
        label: 'Add at least 3 filled-in CS interest bullets',
        points: 15,
        done: bulletMatches.length >= 3 && /frontend|backend|game|data|ai|cyber|web|design|java|python|coding/i.test(visibleMarkdown),
        },
        {
        label: 'Add at least 3 filled-in fun fact bullets',
        points: 15,
        done: bulletMatches.length >= 6,
        },
        {
        label: 'Use at least 4 markdown headings',
        points: 10,
        done: headingMatches.length >= 4,
        },
        {
        label: 'Use bold markdown meaningfully',
        points: 10,
        done: /\*\*[A-Za-z0-9].+?\*\*/.test(visibleMarkdown),
        },
        {
        label: 'Add a real markdown link',
        points: 10,
        done: /\[[^\]]+\]\(https?:\/\/[^)]+\)/.test(visibleMarkdown),
        },
        {
        label: 'Use inline code formatting',
        points: 10,
        done: /`[^`]+`/.test(visibleMarkdown),
        },
    ];

    return quests.map(q => ({
        ...q,
        points: this.usedBuilder ? Math.ceil(q.points * builderPenalty) : q.points,
    }));
    }

  _update() {
    const markdown = this.editor.value;
    const quests = this._getQuests(markdown);
    const score = quests.reduce((sum, q) => sum + (q.done ? q.points : 0), 0);

    this.overlay.querySelector('#amb-score').textContent = score;

    this.overlay.querySelector('#amb-quests').innerHTML = quests.map(q => `
      <div class="amb-quest ${q.done ? 'done' : ''}">
        <span class="amb-badge">${q.done ? '✓' : '+'}</span>
        <span>${q.label} <strong>(${q.points} pts)</strong></span>
      </div>
    `).join('');

    this.preview.innerHTML = this._markdownToHtml(markdown);
  }

  _markdownToHtml(markdown) {
    let html = this._escapeHtml(markdown);

    html = html.replace(/^### (.*)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*)$/gm, '<h1>$1</h1>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    const lines = html.split('\n');
    let inList = false;
    const converted = [];

    lines.forEach(line => {
      if (/^[-*]\s+/.test(line)) {
        if (!inList) {
          converted.push('<ul>');
          inList = true;
        }
        converted.push(`<li>${line.replace(/^[-*]\s+/, '')}</li>`);
      } else {
        if (inList) {
          converted.push('</ul>');
          inList = false;
        }

        if (
          line.startsWith('<h1>') ||
          line.startsWith('<h2>') ||
          line.startsWith('<h3>') ||
          line.trim() === ''
        ) {
          converted.push(line);
        } else {
          converted.push(`<p>${line}</p>`);
        }
      }
    });

    if (inList) converted.push('</ul>');

    return converted.join('\n');
  }

  _downloadMarkdown() {
    const markdown = this.editor.value;
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const name = this.overlay.querySelector('#amb-name').value.trim() || 'about-me';
    const safeName = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeName || 'about-me'}.md`;
    a.click();

    URL.revokeObjectURL(url);
  }

  _complete() {
    const markdown = this.editor.value;
    const quests = this._getQuests(markdown);
    const score = quests.reduce((sum, q) => sum + (q.done ? q.points : 0), 0);

    const persona = this.overlay.querySelector('#amb-persona').value.trim();
    const interests = this.overlay.querySelector('#amb-interests').value.trim();

    this.onComplete({
      title: score >= 85 ? 'Identity Page Architect' : score >= 65 ? 'Markdown Profile Builder' : 'Emerging Profile Builder',
      summary: 'Built a personal About Me markdown page using frontend identity and markdown skills.',
      markdown,
      score,
      persona,
      interests,
      completedAt: new Date().toISOString(),
    });

    this._close(false);
  }

  _close(callCallback = true) {
    this.overlay?.remove();
    this.overlay = null;

    if (callCallback) {
      this.onClose?.();
    }
  }

  _escapeHtml(value = '') {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  _escapeAttr(value = '') {
    return this._escapeHtml(value);
  }
}