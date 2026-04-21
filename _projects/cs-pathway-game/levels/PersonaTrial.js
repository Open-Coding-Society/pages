export default class PersonaTrial {
    constructor({ onComplete, onClose } = {}) {
      this.onComplete = onComplete || (() => {});
      this.onClose = onClose || (() => {});
      this.overlay = null;
      this.currentSceneIndex = 0;
  
      this.scores = {
        technologist: 0,
        scrummer: 0,
        planner: 0,
        finisher: 0,
      };
  
      this.scenes = [
        {
          title: 'The Project Falters',
          text: 'It is the night before demo day. Your team’s app suddenly stops working, and everyone looks to you for direction.',
          choices: [
            {
              text: 'Dive into the code and fix the hardest bug yourself.',
              weights: { technologist: 3, finisher: 1 },
            },
            {
              text: 'Pull everyone into a quick sync and assign roles immediately.',
              weights: { scrummer: 3, planner: 1 },
            },
            {
              text: 'Rebuild the plan, prioritize the essentials, and cut what is unnecessary.',
              weights: { planner: 3, finisher: 1 },
            },
            {
              text: 'Focus on getting one feature polished and complete before anything else.',
              weights: { finisher: 3, planner: 1 },
            },
          ],
        },
        {
          title: 'A New Assignment Appears',
          text: 'Your teacher introduces a new open-ended CS challenge with very few instructions.',
          choices: [
            {
              text: 'Experiment with advanced technical ideas and push the limits.',
              weights: { technologist: 3 },
            },
            {
              text: 'Talk with teammates first so the group can shape the direction together.',
              weights: { scrummer: 3, planner: 1 },
            },
            {
              text: 'Break the project into tasks, milestones, and responsibilities.',
              weights: { planner: 3, finisher: 1 },
            },
            {
              text: 'Look for examples, confirm expectations, and then begin with a clear goal.',
              weights: { finisher: 3, planner: 1 },
            },
          ],
        },
        {
          title: 'Tension in the Team',
          text: 'Two teammates disagree on what to build next, and progress has stalled.',
          choices: [
            {
              text: 'Take over the implementation so the project keeps moving.',
              weights: { technologist: 2, finisher: 1 },
            },
            {
              text: 'Help everyone talk it through and guide the group back into alignment.',
              weights: { scrummer: 3, planner: 1 },
            },
            {
              text: 'Clarify ownership, deadlines, and the next concrete steps.',
              weights: { planner: 3, finisher: 1 },
            },
            {
              text: 'Finish your part cleanly so at least one piece is guaranteed done.',
              weights: { finisher: 3 },
            },
          ],
        },
        {
          title: 'The Final Stretch',
          text: 'The deadline is close. There is still work left, and the team needs momentum.',
          choices: [
            {
              text: 'Tackle the most difficult remaining technical problem.',
              weights: { technologist: 3 },
            },
            {
              text: 'Keep morale high and help the team work together efficiently.',
              weights: { scrummer: 3 },
            },
            {
              text: 'Check progress against the plan and redirect effort where needed.',
              weights: { planner: 3 },
            },
            {
              text: 'Push tasks across the finish line and make sure deliverables are complete.',
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
    }
  
    createOverlayShell() {
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 10000;
        background: rgba(7, 11, 22, 0.86);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
        font-family: system-ui, sans-serif;
      `;
  
      const card = document.createElement('div');
      card.style.cssText = `
        width: min(760px, 100%);
        background: linear-gradient(180deg, #10192f 0%, #0f172a 100%);
        color: #f8fafc;
        border: 1px solid rgba(255,255,255,0.12);
        border-radius: 22px;
        box-shadow: 0 24px 80px rgba(0,0,0,0.38);
        padding: 28px;
      `;
  
      overlay.appendChild(card);
      this.overlay = overlay;
      document.body.appendChild(overlay);
  
      return card;
    }
  
    makeButton(label, onClick, kind = 'primary') {
      const btn = document.createElement('button');
      btn.textContent = label;
  
      const styles = {
        primary: `
          background: #3b82f6;
          color: white;
          border: none;
        `,
        secondary: `
          background: transparent;
          color: #cbd5e1;
          border: 1px solid rgba(255,255,255,0.18);
        `,
        choice: `
          background: rgba(255,255,255,0.04);
          color: #f8fafc;
          border: 1px solid rgba(255,255,255,0.12);
          text-align: left;
        `,
      };
  
      btn.style.cssText = `
        border-radius: 14px;
        padding: 14px 16px;
        cursor: pointer;
        font-size: 15px;
        line-height: 1.4;
        transition: transform 0.12s ease, opacity 0.12s ease;
        ${styles[kind] || styles.primary}
      `;
  
      btn.onmouseenter = () => {
        btn.style.transform = 'translateY(-1px)';
        btn.style.opacity = '0.96';
      };
  
      btn.onmouseleave = () => {
        btn.style.transform = 'translateY(0)';
        btn.style.opacity = '1';
      };
  
      btn.onclick = onClick;
      return btn;
    }
  
    clearOverlay() {
      if (!this.overlay) return null;
      const card = this.overlay.firstChild;
      card.innerHTML = '';
      return card;
    }
  
    renderIntro() {
      if (this.overlay) this.destroy();
      const card = this.createOverlayShell();
  
      const title = document.createElement('h2');
      title.textContent = 'The Persona Trial';
      title.style.cssText = 'margin:0 0 12px 0; font-size: 30px;';
  
      const subtitle = document.createElement('p');
      subtitle.textContent =
        'Every developer walks a different path. Step forward, and let your instincts reveal how you learn, build, and grow.';
      subtitle.style.cssText =
        'margin:0 0 22px 0; font-size:16px; line-height:1.65; color:#cbd5e1;';
  
      const story = document.createElement('div');
      story.textContent =
        'You enter the Persona Enrichment Gateway. Ahead lies a series of moments drawn from teamwork, deadlines, and uncertainty. There are no right answers—only the path that feels most natural to you.';
      story.style.cssText = `
        margin-bottom: 24px;
        padding: 16px 18px;
        border-radius: 16px;
        background: rgba(255,255,255,0.04);
        line-height: 1.65;
        color: #e2e8f0;
      `;
  
      const actions = document.createElement('div');
      actions.style.cssText = 'display:flex; gap:12px; justify-content:flex-end;';
  
      const cancelBtn = this.makeButton('Leave Gateway', () => {
        this.destroy();
        this.onClose();
      }, 'secondary');
  
      const beginBtn = this.makeButton('Begin Trial', () => {
        this.currentSceneIndex = 0;
        this.renderScene();
      });
  
      actions.append(cancelBtn, beginBtn);
      card.append(title, subtitle, story, actions);
    }
  
    renderScene() {
      const scene = this.scenes[this.currentSceneIndex];
      const card = this.clearOverlay();
      if (!card || !scene) return;
  
      const progress = document.createElement('div');
      progress.textContent = `Scene ${this.currentSceneIndex + 1} of ${this.scenes.length}`;
      progress.style.cssText = 'margin-bottom:10px; color:#93c5fd; font-size:14px;';
  
      const title = document.createElement('h3');
      title.textContent = scene.title;
      title.style.cssText = 'margin:0 0 12px 0; font-size: 28px;';
  
      const text = document.createElement('p');
      text.textContent = scene.text;
      text.style.cssText = 'margin:0 0 22px 0; color:#e2e8f0; line-height:1.7; font-size:16px;';
  
      const choicesWrap = document.createElement('div');
      choicesWrap.style.cssText = 'display:grid; gap:12px;';
  
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
  
        choicesWrap.appendChild(btn);
      });
  
      card.append(progress, title, text, choicesWrap);
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
  
      const raw = Object.fromEntries(
        Object.entries(this.scores).map(([key, value]) => [
          key,
          Math.round((value / total) * 100),
        ])
      );
  
      const diff = 100 - Object.values(raw).reduce((sum, v) => sum + v, 0);
      if (diff !== 0) {
        const maxKey = Object.entries(raw).sort((a, b) => b[1] - a[1])[0][0];
        raw[maxKey] += diff;
      }
  
      return raw;
    }
  
    getPrimaryPersona(percentages) {
      return Object.entries(percentages).sort((a, b) => b[1] - a[1])[0][0];
    }
  
    getPersonaInsights(primary) {
      const map = {
        technologist: {
          title: 'Technologist',
          summary: 'You are driven by mastery, technical depth, and solving hard problems.',
          growth: 'Your impact grows even more when communication and trust keep pace with your skill.',
        },
        scrummer: {
          title: 'Scrummer',
          summary: 'You thrive in collaboration, shared momentum, and helping teams move forward together.',
          growth: 'Your next step is making your individual contributions more visible within the group.',
        },
        planner: {
          title: 'Planner',
          summary: 'You bring structure, foresight, and coordination that helps complex work come together.',
          growth: 'Balancing planning with hands-on execution will strengthen your confidence and range.',
        },
        finisher: {
          title: 'Finisher',
          summary: 'You gain energy from clarity, completion, and turning effort into finished results.',
          growth: 'Open-ended challenges become easier when you trust yourself before seeking confirmation.',
        },
      };
  
      return map[primary] || {
        title: 'Student Archetype',
        summary: 'You are developing your own way of learning and contributing.',
        growth: 'Growth comes from staying curious and reflecting on how you work best.',
      };
    }
  
    renderBar(label, percent) {
      const wrap = document.createElement('div');
      wrap.style.cssText = 'margin-bottom: 12px;';
  
      const top = document.createElement('div');
      top.style.cssText = 'display:flex; justify-content:space-between; margin-bottom:6px; font-size:14px;';
      top.innerHTML = `<span>${label}</span><span>${percent}%</span>`;
  
      const track = document.createElement('div');
      track.style.cssText = `
        width: 100%;
        height: 10px;
        background: rgba(255,255,255,0.08);
        border-radius: 999px;
        overflow: hidden;
      `;
  
      const fill = document.createElement('div');
      fill.style.cssText = `
        width: ${percent}%;
        height: 100%;
        background: linear-gradient(90deg, #60a5fa 0%, #a78bfa 100%);
        border-radius: 999px;
      `;
  
      track.appendChild(fill);
      wrap.append(top, track);
      return wrap;
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
  
      const card = this.clearOverlay();
      if (!card) return;
  
      const label = document.createElement('div');
      label.textContent = 'Your working style is evolving...';
      label.style.cssText = 'margin-bottom:10px; color:#93c5fd; font-size:14px;';
  
      const title = document.createElement('h3');
      title.textContent = insights.title;
      title.style.cssText = 'margin:0 0 12px 0; font-size: 30px;';
  
      const summary = document.createElement('p');
      summary.textContent = insights.summary;
      summary.style.cssText = 'margin:0 0 10px 0; color:#e2e8f0; line-height:1.65;';
  
      const growth = document.createElement('p');
      growth.textContent = `Growth edge: ${insights.growth}`;
      growth.style.cssText = 'margin:0 0 24px 0; color:#cbd5e1; line-height:1.65;';
  
      const bars = document.createElement('div');
      bars.style.cssText = 'margin-bottom: 24px;';
      bars.append(
        this.renderBar('Technologist', percentages.technologist),
        this.renderBar('Scrummer', percentages.scrummer),
        this.renderBar('Planner', percentages.planner),
        this.renderBar('Finisher', percentages.finisher),
      );
  
      const footer = document.createElement('p');
      footer.textContent = 'This is a snapshot, not a fixed label. As you grow, your persona can evolve too.';
      footer.style.cssText = 'margin:0 0 22px 0; color:#94a3b8; line-height:1.6; font-size:14px;';
  
      const actions = document.createElement('div');
      actions.style.cssText = 'display:flex; justify-content:flex-end; gap:12px;';
  
      const closeBtn = this.makeButton('Close', () => {
        this.destroy();
        this.onComplete(result);
      });
  
      actions.appendChild(closeBtn);
      card.append(label, title, summary, growth, bars, footer, actions);
    }
  }