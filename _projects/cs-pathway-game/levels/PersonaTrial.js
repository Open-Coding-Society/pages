const VISION_BG = '/images/vision-doors.png';

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
        chapter: 'VISION I',
        title: 'The Chamber of First Light',
        narration:
          'As you step through the gateway, the past fades behind you. The air turns still. Lanterns light across stone walls, and a voice echoes from somewhere unseen:',
        quote:
          'Every builder carries a different instinct. Let yours speak.',
        prompt: 'Where does your instinct lead you first?',
        choices: [
          {
            label: 'Step toward the brightest corridor, drawn by challenge itself.',
            number: '1',
            accent: '#d6a23a',
            weights: { technologist: 2, planner: 1 },
          },
          {
            label: 'Pause and listen for the footsteps of others before moving.',
            number: '2',
            accent: '#2d8cff',
            weights: { scrummer: 2, finisher: 1 },
          },
          {
            label: 'Study the room and search for the shape of the path first.',
            number: '3',
            accent: '#8b4dff',
            weights: { planner: 3 },
          },
          {
            label: 'Choose the clearest route and commit to reaching its end.',
            number: '4',
            accent: '#73b84a',
            weights: { finisher: 3 },
          },
        ],
      },
      {
        chapter: 'VISION II',
        title: 'The Fractured Build',
        narration:
          'A new vision rises. It is the night before a showcase. The project trembles at the edge of failure. One feature flickers. One teammate panics. Another falls silent.',
        quote:
          'When time narrows, instinct becomes visible.',
        prompt: 'How do you move when the work begins to fracture?',
        choices: [
          {
            label: 'Take hold of the hardest technical flaw and begin solving it at once.',
            number: '1',
            accent: '#d6a23a',
            weights: { technologist: 3, finisher: 1 },
          },
          {
            label: 'Gather the group, steady their energy, and move everyone into sync.',
            number: '2',
            accent: '#2d8cff',
            weights: { scrummer: 3, planner: 1 },
          },
          {
            label: 'Cut through the chaos, rebuild the plan, and assign the next steps.',
            number: '3',
            accent: '#8b4dff',
            weights: { planner: 3, finisher: 1 },
          },
          {
            label: 'Carry one crucial piece fully across the line so something survives intact.',
            number: '4',
            accent: '#73b84a',
            weights: { finisher: 3, planner: 1 },
          },
        ],
      },
      {
        chapter: 'VISION III',
        title: 'The Unwritten Path',
        narration:
          'The chamber shifts again. Now you face a path with no instructions, no example, and no map. Only possibility.',
        quote:
          'What you choose without certainty reveals more than what you choose with guidance.',
        prompt: 'Which path calls to you when nothing is defined?',
        choices: [
          {
            label: 'Push toward the boldest technical solution and discover what is possible.',
            number: '1',
            accent: '#d6a23a',
            weights: { technologist: 3 },
          },
          {
            label: 'Turn first to the others around you and shape the path together.',
            number: '2',
            accent: '#2d8cff',
            weights: { scrummer: 3, planner: 1 },
          },
          {
            label: 'Break the unknown into milestones, tasks, and a path that can be followed.',
            number: '3',
            accent: '#8b4dff',
            weights: { planner: 3, finisher: 1 },
          },
          {
            label: 'Search for clarity before committing, so your effort lands in the right place.',
            number: '4',
            accent: '#73b84a',
            weights: { finisher: 3, planner: 1 },
          },
        ],
      },
      {
        chapter: 'VISION IV',
        title: 'The Final Passage',
        narration:
          'One last vision rises. Voices clash. Progress has stalled. The project can still be saved, but only if someone chooses how to move forward when the way is no longer obvious.',
        quote:
          'Your pattern has always been there. Now the chamber asks you to see it.',
        prompt: 'What do you do when the team stands at the edge of uncertainty?',
        choices: [
          {
            label: 'Take the implementation into your own hands and push progress forward.',
            number: '1',
            accent: '#d6a23a',
            weights: { technologist: 2, finisher: 1 },
          },
          {
            label: 'Guide the voices into alignment until the team can move as one.',
            number: '2',
            accent: '#2d8cff',
            weights: { scrummer: 3, planner: 1 },
          },
          {
            label: 'Define the roles, the order, and the next concrete actions.',
            number: '3',
            accent: '#8b4dff',
            weights: { planner: 3, finisher: 1 },
          },
          {
            label: 'Secure your part completely so at least one piece is unquestionably done.',
            number: '4',
            accent: '#73b84a',
            weights: { finisher: 3 },
          },
        ],
      },
    ];
  }

  start() {
    this.renderScene();
  }

  destroy() {
    if (this.overlay?.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
    this.overlay = null;
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

  makeProgressDots(current, total) {
    return Array.from({ length: total }).map((_, i) => {
      const active = i === current;
      return `
        <span style="
          width: 12px;
          height: 12px;
          border-radius: 999px;
          display: inline-block;
          border: 1px solid rgba(255,255,255,0.45);
          background: ${active ? '#d6a23a' : 'transparent'};
          box-shadow: ${active ? '0 0 10px rgba(214,162,58,0.45)' : 'none'};
        "></span>
      `;
    }).join('');
  }

  renderScene() {
    const scene = this.scenes[this.currentSceneIndex];
    if (!scene) return;
  
    this.destroy();
  
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      box-sizing: border-box;
      background: rgba(4, 8, 20, 0.48);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      font-family: Georgia, 'Times New Roman', serif;
    `;
  
    overlay.innerHTML = `
      <div style="
        position: relative;
        width: min(980px, 92vw);
        height: min(700px, 86vh);
        border-radius: 22px;
        overflow: hidden;
        border: 1px solid rgba(205, 170, 92, 0.38);
        box-shadow:
          0 24px 70px rgba(0,0,0,0.50),
          0 0 28px rgba(96,165,250,0.10);
        background:
          linear-gradient(to top, rgba(0,0,0,0.84) 0%, rgba(0,0,0,0.38) 42%, rgba(0,0,0,0.12) 100%),
          url('${VISION_BG}') center center / cover no-repeat;
        color: #f7f1de;
      ">
        <div style="
          position: absolute;
          top: 18px;
          left: 22px;
          right: 22px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          z-index: 2;
        ">
          <div style="display:flex; align-items:center; gap:10px; color:#e8e0c8;">
            <span style="color:#78b8ff; font-size:20px;">✦</span>
            <span style="font-size:22px;">The Persona Trial</span>
          </div>
  
          <div style="text-align:right; color:#e8e0c8;">
            <div style="font-size:15px; margin-bottom:8px;">Progress</div>
            <div style="display:flex; gap:8px; justify-content:flex-end;">
              ${this.makeProgressDots(this.currentSceneIndex, this.scenes.length)}
            </div>
          </div>
        </div>
  
        <div style="
          position: absolute;
          top: 52px;
          left: 0;
          width: 100%;
          text-align: center;
          z-index: 2;
        ">
          <div style="
            font-size: 44px;
            line-height: 1;
            letter-spacing: 0.08em;
            color: #8fc0ff;
            margin-bottom: 6px;
          ">
            ${scene.chapter}
          </div>
          <div style="
            font-size: 22px;
            color: #bcd6ff;
          ">
            ${scene.title}
          </div>
        </div>
  
        <div style="
          position: absolute;
          left: 22px;
          right: 22px;
          bottom: 20px;
          z-index: 2;
        ">
        <div style="
          background: linear-gradient(180deg, rgba(3,10,25,0.62), rgba(4,11,28,0.72));
          border: 1px solid rgba(182,140,66,0.24);
          border-radius: 16px;
          box-shadow: 0 10px 24px rgba(0,0,0,0.28);
          padding: 12px 16px;
          margin: 0 auto 10px auto;
          max-width: 760px;
          text-align: center;
          backdrop-filter: blur(3px);
          -webkit-backdrop-filter: blur(3px);
        ">            
        <div style="
          color:#7cb8ff;
          font-size:11px;
          letter-spacing:0.14em;
          text-transform:uppercase;
          margin-bottom:6px;
        ">
          The Chamber Whispers...
        </div>
            <div style="
              font-size:15px;
              line-height:1.45;
              color:#e9e1ce;
              margin-bottom:6px;
            ">
              ${scene.narration}
            </div>
            <div style="
              font-size:17px;
              line-height:1.4;
              color:#e3aa41;
              font-style:italic;
              font-weight:700;
              margin-bottom:8px;
            ">
              “${scene.quote}”
            </div>
              
            <div style="
              font-size:17px;
              color:#f4ead6;
              ">
                ${scene.prompt}
              </div>
          </div>
  
          <div style="
            display:grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          ">
            ${scene.choices.map((choice, index) => `
              <button
                data-choice-index="${index}"
                style="
                  display:flex;
                  align-items:center;
                  gap:14px;
                  text-align:left;
                  padding:14px 16px;
                  min-height:72px;
                  border-radius:14px;
                  border:1px solid ${choice.accent};
                  background: linear-gradient(180deg, rgba(8,15,32,0.94), rgba(10,18,38,0.96));
                  color:#f6eedb;
                  cursor:pointer;
                  box-shadow: 0 0 18px rgba(0,0,0,0.22);
                  font-family: Georgia, 'Times New Roman', serif;
                  transition: transform 0.14s ease, filter 0.14s ease, box-shadow 0.14s ease;
                "
              >
                <div style="
                  width:38px;
                  height:38px;
                  min-width:38px;
                  border-radius:999px;
                  border:1px solid ${choice.accent};
                  display:flex;
                  align-items:center;
                  justify-content:center;
                  color:${choice.accent};
                  font-size:18px;
                  box-shadow: 0 0 10px rgba(0,0,0,0.18);
                ">
                  ${choice.number}
                </div>
  
                <div style="
                  flex:1;
                  font-size:16px;
                  line-height:1.35;
                ">
                  ${choice.label}
                </div>
              </button>
            `).join('')}
          </div>
  
          <div style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            margin-top:12px;
          ">
            <div style="
              color:rgba(255,255,255,0.72);
              font-size:14px;
            ">
              The chamber is reading your pattern.
            </div>
  
            <button id="leave-trial-btn" style="
              padding:10px 14px;
              border-radius:12px;
              border:1px solid rgba(255,255,255,0.20);
              background: rgba(0,0,0,0.34);
              color:#ddd6c0;
              cursor:pointer;
              font-family: inherit;
              font-size:14px;
            ">
              Leave Chamber
            </button>
          </div>
        </div>
      </div>
    `;
  
    document.body.appendChild(overlay);
    this.overlay = overlay;
  
    overlay.querySelectorAll('[data-choice-index]').forEach((btn) => {
      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-2px)';
        btn.style.filter = 'brightness(1.06)';
        btn.style.boxShadow = '0 0 18px rgba(255,255,255,0.06)';
      });
  
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0)';
        btn.style.filter = 'brightness(1)';
        btn.style.boxShadow = '0 0 18px rgba(0,0,0,0.22)';
      });
  
      btn.addEventListener('click', () => {
        const choice = scene.choices[Number(btn.dataset.choiceIndex)];
        this.applyWeights(choice.weights);
  
        if (this.currentSceneIndex < this.scenes.length - 1) {
          this.currentSceneIndex += 1;
          this.renderScene();
        } else {
          this.renderResults();
        }
      });
    });
  
    overlay.querySelector('#leave-trial-btn').addEventListener('click', () => {
      this.destroy();
      this.onClose();
    });
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
  
    this.destroy();
  
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      box-sizing: border-box;
      background: rgba(4, 8, 20, 0.48);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      font-family: Georgia, 'Times New Roman', serif;
    `;
  
    overlay.innerHTML = `
      <div style="
        width:min(860px, 92vw);
        border-radius: 22px;
        overflow: hidden;
        border: 1px solid rgba(205, 170, 92, 0.38);
        box-shadow:
          0 24px 70px rgba(0,0,0,0.50),
          0 0 28px rgba(96,165,250,0.10);
        background:
          linear-gradient(180deg, rgba(3,10,25,0.90), rgba(4,11,28,0.96)),
          url('${VISION_BG}') center center / cover no-repeat;
        color: #f7f1de;
      ">
        <div style="
          padding: 22px 26px;
          border-bottom:1px solid rgba(255,255,255,0.08);
          color:#8fc0ff;
          font-size:13px;
          letter-spacing:0.16em;
          text-transform:uppercase;
        ">
          Persona Revealed
        </div>
  
        <div style="padding: 22px 26px 24px;">
          <div style="
            font-size:38px;
            color:#f4ead6;
            margin-bottom:10px;
          ">
            ${insights.title}
          </div>
  
          <div style="
            font-size:17px;
            line-height:1.6;
            color:#e9e1ce;
            margin-bottom:10px;
          ">
            ${insights.summary}
          </div>
  
          <div style="
            font-size:16px;
            line-height:1.55;
            color:#cbd7ea;
            margin-bottom:18px;
          ">
            <strong style="color:#e3aa41;">Growth edge:</strong> ${insights.growth}
          </div>
  
          <div style="
            display:grid;
            grid-template-columns: 1fr 1fr;
            gap:12px 20px;
            margin-bottom:18px;
          ">
            ${[
              ['Technologist', percentages.technologist],
              ['Scrummer', percentages.scrummer],
              ['Planner', percentages.planner],
              ['Finisher', percentages.finisher],
            ].map(([label, value]) => `
              <div>
                <div style="
                  display:flex;
                  justify-content:space-between;
                  font-size:15px;
                  margin-bottom:6px;
                ">
                  <span>${label}</span>
                  <span style="color:#8fc0ff; font-weight:700;">${value}%</span>
                </div>
                <div style="
                  width:100%;
                  height:10px;
                  border-radius:999px;
                  background: rgba(255,255,255,0.10);
                  overflow:hidden;
                ">
                  <div style="
                    width:${value}%;
                    height:100%;
                    background: linear-gradient(90deg, #3e8fff 0%, #8b4dff 100%);
                    box-shadow: 0 0 12px rgba(62,143,255,0.30);
                  "></div>
                </div>
              </div>
            `).join('')}
          </div>
  
          <div style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            gap:16px;
          ">
            <div style="
              color:rgba(255,255,255,0.72);
              font-size:14px;
              line-height:1.5;
            ">
              This is a living snapshot, not a fixed label.
            </div>
  
            <button id="accept-revelation-btn" style="
              padding:12px 18px;
              border:none;
              border-radius:12px;
              background: linear-gradient(135deg, #3e8fff 0%, #7b5cff 100%);
              color:white;
              cursor:pointer;
              font-family: inherit;
              font-size:15px;
              box-shadow: 0 10px 22px rgba(62,143,255,0.26);
            ">
              Accept Revelation
            </button>
          </div>
        </div>
      </div>
    `;
  
    document.body.appendChild(overlay);
    this.overlay = overlay;
  
    overlay.querySelector('#accept-revelation-btn').addEventListener('click', () => {
      this.destroy();
      this.onComplete(result);
    });
  }
}