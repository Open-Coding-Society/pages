// CourseEnlistmentTrial.js

const ENLISTMENT_BG = '/images/vision-doors.png';

export default class CourseEnlistmentTrial {
  constructor({ profileData = {}, onComplete, onClose } = {}) {
    this.profileData = profileData || {};
    this.onComplete = onComplete || (() => {});
    this.onClose = onClose || (() => {});
    this.overlay = null;
    this.currentSceneIndex = 0;

    this.scores = {
      foundations: 0,
      creative: 0,
      systems: 0,
      ai: 0,
    };

    this.answers = [];

    this.scenes = [
      {
        chapter: 'ENLISTMENT I',
        title: 'The Signal of Intent',
        narration:
          'A crimson chamber opens beneath the gatekeeper. Symbols gather in the air like glowing constellations, waiting to read what you want from your time in computer science.',
        quote:
          'The path should not only challenge you. It should fit the kind of builder you are becoming.',
        prompt: 'What do you most want your CS journey to give you first?',
        choices: [
          {
            label: 'A strong foundation so I can understand the logic behind everything.',
            number: '1',
            accent: '#f59e0b',
            weights: { foundations: 3, systems: 1 },
          },
          {
            label: 'A way to build visible, expressive, interactive projects I can show people.',
            number: '2',
            accent: '#60a5fa',
            weights: { creative: 3, ai: 1 },
          },
          {
            label: 'A chance to solve hard technical problems and work with deeper systems.',
            number: '3',
            accent: '#a78bfa',
            weights: { systems: 3, foundations: 1 },
          },
          {
            label: 'A path toward AI, data, and the future of intelligent tools.',
            number: '4',
            accent: '#34d399',
            weights: { ai: 3, foundations: 1 },
          },
        ],
      },
      {
        chapter: 'ENLISTMENT II',
        title: 'The Mode of Learning',
        narration:
          'The chamber shifts. Four pathways unfold. One crackles with puzzles. One glows with interfaces. One hums with machine patterns. One rises in careful sequence, stone by stone.',
        quote:
          'How you learn matters almost as much as what you learn.',
        prompt: 'Which kind of work pulls you in most naturally?',
        choices: [
          {
            label: 'Solving structured problems step by step until the pattern makes sense.',
            number: '1',
            accent: '#f59e0b',
            weights: { foundations: 3 },
          },
          {
            label: 'Designing experiences, visuals, and things people can directly interact with.',
            number: '2',
            accent: '#60a5fa',
            weights: { creative: 3 },
          },
          {
            label: 'Understanding how programs really work under the hood.',
            number: '3',
            accent: '#a78bfa',
            weights: { systems: 3, foundations: 1 },
          },
          {
            label: 'Working with patterns, predictions, data, and intelligent behavior.',
            number: '4',
            accent: '#34d399',
            weights: { ai: 3, systems: 1 },
          },
        ],
      },
      {
        chapter: 'ENLISTMENT III',
        title: 'The Pace of Ascent',
        narration:
          'The gatekeeper draws a circle of light around your feet. The glow rises and falls, measuring not just ambition, but readiness.',
        quote:
          'A good route does not rush you past your footing. It builds it.',
        prompt: 'What level of challenge feels right for your next class?',
        choices: [
          {
            label: 'A steady entry point where I can build confidence and core habits first.',
            number: '1',
            accent: '#f59e0b',
            weights: { foundations: 3, creative: 1 },
          },
          {
            label: 'A class that lets me create while I learn, even if it is a little challenging.',
            number: '2',
            accent: '#60a5fa',
            weights: { creative: 3, foundations: 1 },
          },
          {
            label: 'Something rigorous where I can stretch technically and think more deeply.',
            number: '3',
            accent: '#a78bfa',
            weights: { systems: 3, ai: 1 },
          },
          {
            label: 'A forward-looking path that prepares me for AI and advanced applications.',
            number: '4',
            accent: '#34d399',
            weights: { ai: 3, systems: 1 },
          },
        ],
      },
      {
        chapter: 'ENLISTMENT IV',
        title: 'The Future Echo',
        narration:
          'The chamber shows a vision of you one year from now: a builder with more confidence, more direction, and a clearer sense of where you belong in the pathway.',
        quote:
          'Choose not only the class you can take. Choose the path you want to grow into.',
        prompt: 'Which future version of yourself feels most exciting?',
        choices: [
          {
            label: 'Someone with strong fundamentals who can later go anywhere in CS.',
            number: '1',
            accent: '#f59e0b',
            weights: { foundations: 3 },
          },
          {
            label: 'Someone building polished apps, websites, interfaces, and creative tools.',
            number: '2',
            accent: '#60a5fa',
            weights: { creative: 3 },
          },
          {
            label: 'Someone confident with logic, structure, debugging, and harder engineering work.',
            number: '3',
            accent: '#a78bfa',
            weights: { systems: 3 },
          },
          {
            label: 'Someone exploring machine intelligence, smart systems, and data-driven design.',
            number: '4',
            accent: '#34d399',
            weights: { ai: 3 },
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
    if (this._keyHandler) {
      document.removeEventListener('keydown', this._keyHandler);
      this._keyHandler = null;
    }
  }

  applyWeights(weights = {}) {
    Object.entries(weights).forEach(([key, value]) => {
      if (typeof this.scores[key] === 'number') {
        this.scores[key] += value;
      }
    });
  }

  getPercentages() {
    const total = Object.values(this.scores).reduce((sum, value) => sum + value, 0) || 1;
    const out = {};

    Object.entries(this.scores).forEach(([key, value]) => {
      out[key] = Math.round((value / total) * 100);
    });

    const sum = Object.values(out).reduce((a, b) => a + b, 0);
    const diff = 100 - sum;
    if (diff !== 0) {
      const maxKey = Object.keys(out).sort((a, b) => out[b] - out[a])[0];
      out[maxKey] += diff;
    }

    return out;
  }

  getPrimaryPath(percentages) {
    return Object.entries(percentages).sort((a, b) => b[1] - a[1])[0][0];
  }

  getSecondaryPath(percentages, primaryPath) {
    return Object.entries(percentages)
      .filter(([key]) => key !== primaryPath)
      .sort((a, b) => b[1] - a[1])[0][0];
  }

  getPathMeta(pathKey) {
    const map = {
      foundations: {
        title: 'Foundation Cartographer',
        summary:
          'Your best next step is a pathway that builds confidence, structure, and the core habits that make every later branch of CS stronger.',
        learningStyle:
          'You learn best when concepts are sequenced clearly and each new skill locks into a larger framework.',
        tokenCode: 'FOUNDATION_CARTOGRAPHER',
        tokenLabel: 'Foundation Route Token',
        tokenColor: '#f59e0b',
      },
      creative: {
        title: 'Creative Builder',
        summary:
          'You are energized by making things people can see, feel, and interact with. Your best class path should let you create while you grow.',
        learningStyle:
          'You learn fastest when ideas become visible through projects, interfaces, and hands-on building.',
        tokenCode: 'CREATIVE_BUILDER',
        tokenLabel: 'Creative Route Token',
        tokenColor: '#60a5fa',
      },
      systems: {
        title: 'Systems Pathfinder',
        summary:
          'You are drawn toward deeper technical structure. A stronger engineering-leaning route will keep you engaged and challenged.',
        learningStyle:
          'You grow through rigor, debugging, logic, and learning how the system works beneath the surface.',
        tokenCode: 'SYSTEMS_PATHFINDER',
        tokenLabel: 'Systems Route Token',
        tokenColor: '#a78bfa',
      },
      ai: {
        title: 'AI Wayfinder',
        summary:
          'You are looking ahead to intelligent systems, data, and the next generation of computational tools. Your route should prepare you for that future without skipping the base you need.',
        learningStyle:
          'You thrive when pattern-finding, experimentation, and future-facing ideas are connected to real projects.',
        tokenCode: 'AI_WAYFINDER',
        tokenLabel: 'AI Route Token',
        tokenColor: '#34d399',
      },
    };

    return map[pathKey];
  }

  getRecommendedClasses(primaryPath, secondaryPath) {
    const planMap = {
      foundations: [
        {
          name: 'CSSE',
          reason: 'Best entry point for building strong programming habits and confidence.',
          fit: 'foundation',
        },
        {
          name: 'CSP',
          reason: 'Expands your view of computing and keeps the pathway broad and exploratory.',
          fit: 'breadth',
        },
        {
          name: 'CSA',
          reason: 'A strong next step after your foundation is built and you are ready for deeper coding rigor.',
          fit: 'next-step',
        },
      ],
      creative: [
        {
          name: 'CSSE',
          reason: 'Gives you the coding basics you need to build interactive work with confidence.',
          fit: 'entry',
        },
        {
          name: 'CSP',
          reason: 'A great match for creative exploration, digital products, and broad computing ideas.',
          fit: 'best-fit',
        },
        {
          name: 'Code Hub / Frontend Projects',
          reason: 'Reinforces your visual and interactive strengths through actual creation.',
          fit: 'extension',
        },
      ],
      systems: [
        {
          name: 'CSA',
          reason: 'Best match for your interest in logic, rigor, and stronger programming depth.',
          fit: 'best-fit',
        },
        {
          name: 'CSSE',
          reason: 'Important if you still want to strengthen core habits before or alongside harder material.',
          fit: 'support',
        },
        {
          name: 'Code Hub / Backend Challenges',
          reason: 'Lets you practice structured engineering thinking in applied form.',
          fit: 'extension',
        },
      ],
      ai: [
        {
          name: 'CSSE',
          reason: 'Build the coding base you need so your future AI work has real technical footing.',
          fit: 'entry',
        },
        {
          name: 'CSA',
          reason: 'Strengthens algorithmic thinking that will support later AI and data work.',
          fit: 'core',
        },
        {
          name: 'AI / Data Exploration Projects',
          reason: 'Keeps your long-term goal visible while you build the right prerequisites.',
          fit: 'best-fit',
        },
      ],
    };

    const list = [...(planMap[primaryPath] || [])];

    if (secondaryPath === 'creative' && primaryPath !== 'creative') {
      list.push({
        name: 'Frontend / Design-Oriented Project Track',
        reason: 'Your secondary signal shows you will stay motivated when your work becomes visible and tangible.',
        fit: 'secondary-strength',
      });
    }

    if (secondaryPath === 'ai' && primaryPath !== 'ai') {
      list.push({
        name: 'AI Curiosity Sprint',
        reason: 'Your secondary signal suggests future-facing intelligent systems will keep you engaged.',
        fit: 'secondary-strength',
      });
    }

    if (secondaryPath === 'systems' && primaryPath !== 'systems') {
      list.push({
        name: 'Structured Problem-Solving Practice',
        reason: 'Your secondary signal shows you also enjoy technical challenge and deeper reasoning.',
        fit: 'secondary-strength',
      });
    }

    if (secondaryPath === 'foundations' && primaryPath !== 'foundations') {
      list.push({
        name: 'Foundation Reinforcement',
        reason: 'Your secondary signal suggests you still benefit from clear scaffolding and strong fundamentals.',
        fit: 'secondary-strength',
      });
    }

    return list.slice(0, 4);
  }

  getGamePlan(primaryPath, secondaryPath) {
    const map = {
      foundations: [
        {
          title: 'Secure the Core',
          description: 'Choose the class that builds dependable programming habits before trying to specialize too early.',
        },
        {
          title: 'Practice in Small Wins',
          description: 'Create short, consistent coding reps so confidence grows through repetition, not pressure.',
        },
        {
          title: 'Branch with Intention',
          description: `Use your secondary signal in ${this.prettyLabel(secondaryPath)} as the next thing you layer in after your footing is strong.`,
        },
      ],
      creative: [
        {
          title: 'Build While You Learn',
          description: 'Choose the route that lets you create visible projects instead of only studying concepts in isolation.',
        },
        {
          title: 'Strengthen the Engine Beneath the Art',
          description: 'Pair your creative momentum with enough coding rigor that your ideas can scale and improve.',
        },
        {
          title: 'Turn Projects into Proof',
          description: 'Use every build as evidence of growth for your passport, portfolio, and future pathway decisions.',
        },
      ],
      systems: [
        {
          title: 'Lean into Rigor',
          description: 'Take the class that gives you harder logical structure and stronger debugging experience.',
        },
        {
          title: 'Translate Depth into Output',
          description: 'Do not let your work stay hidden; turn deeper thinking into finished challenges or features.',
        },
        {
          title: 'Balance Precision with Curiosity',
          description: `Keep your ${this.prettyLabel(secondaryPath)} signal alive so your path stays motivating as well as rigorous.`,
        },
      ],
      ai: [
        {
          title: 'Build the Base First',
          description: 'Use your next class to strengthen the coding and algorithmic foundation behind future AI work.',
        },
        {
          title: 'Keep the Future Visible',
          description: 'Stay motivated by pairing current coursework with small AI or data explorations on the side.',
        },
        {
          title: 'Grow Toward Intelligent Systems',
          description: `Use your secondary strength in ${this.prettyLabel(secondaryPath)} to shape a broader, more resilient path forward.`,
        },
      ],
    };

    return map[primaryPath] || [];
  }

  prettyLabel(key) {
    const labels = {
      foundations: 'foundations',
      creative: 'creative building',
      systems: 'systems thinking',
      ai: 'AI exploration',
    };
    return labels[key] || key;
  }

  makeProgressDots(current, total) {
    return Array.from({ length: total })
      .map((_, i) => {
        const active = i === current;
        return `
          <span style="
            width: 12px;
            height: 12px;
            border-radius: 999px;
            display: inline-block;
            border: 1px solid rgba(255,255,255,0.45);
            background: ${active ? '#ef4444' : 'transparent'};
            box-shadow: ${active ? '0 0 10px rgba(239,68,68,0.45)' : 'none'};
          "></span>
        `;
      })
      .join('');
  }

  installEscapeToClose() {
    this._keyHandler = (event) => {
      if (event.key === 'Escape') {
        this.destroy();
        this.onClose();
      }
    };
    document.addEventListener('keydown', this._keyHandler);
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
      background: rgba(7, 5, 10, 0.56);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      font-family: Georgia, 'Times New Roman', serif;
    `;

    overlay.innerHTML = `
      <div style="
        position: relative;
        width: min(980px, 92vw);
        height: min(700px, 86vh);
        border-radius: 24px;
        overflow: hidden;
        border: 1px solid rgba(239, 68, 68, 0.34);
        box-shadow:
          0 28px 80px rgba(0,0,0,0.58),
          0 0 30px rgba(239,68,68,0.14);
        background:
          linear-gradient(to top, rgba(0,0,0,0.86) 0%, rgba(0,0,0,0.40) 42%, rgba(0,0,0,0.14) 100%),
          url('${ENLISTMENT_BG}') center center / cover no-repeat;
        color: #f8f1e7;
      ">
        <div style="
          position:absolute;
          inset:0;
          background:
            radial-gradient(circle at 20% 22%, rgba(239,68,68,0.16), transparent 26%),
            radial-gradient(circle at 80% 26%, rgba(168,85,247,0.14), transparent 24%),
            radial-gradient(circle at 50% 78%, rgba(96,165,250,0.10), transparent 24%);
          pointer-events:none;
        "></div>

        <div style="
          position:absolute;
          top:18px;
          left:22px;
          right:22px;
          display:flex;
          justify-content:space-between;
          align-items:flex-start;
          z-index:2;
        ">
          <div style="display:flex; align-items:center; gap:10px; color:#f6d7d2;">
            <span style="color:#f87171; font-size:20px;">✦</span>
            <span style="font-size:22px;">Course Enlistment Chamber</span>
          </div>

          <div style="text-align:right; color:#f5d9d5;">
            <div style="font-size:15px; margin-bottom:8px;">Path Calibration</div>
            <div style="display:flex; gap:8px; justify-content:flex-end;">
              ${this.makeProgressDots(this.currentSceneIndex, this.scenes.length)}
            </div>
          </div>
        </div>

        <div style="
          position:absolute;
          top:52px;
          left:0;
          width:100%;
          text-align:center;
          z-index:2;
        ">
          <div style="
            font-size:44px;
            line-height:1;
            letter-spacing:0.08em;
            color:#fca5a5;
            margin-bottom:6px;
          ">
            ${scene.chapter}
          </div>
          <div style="
            font-size:22px;
            color:#fde2e2;
          ">
            ${scene.title}
          </div>
        </div>

        <div style="
          position:absolute;
          left:22px;
          right:22px;
          bottom:20px;
          z-index:2;
        ">
          <div style="
            background: linear-gradient(180deg, rgba(24,8,12,0.70), rgba(16,6,12,0.78));
            border: 1px solid rgba(248,113,113,0.22);
            border-radius: 16px;
            box-shadow: 0 10px 24px rgba(0,0,0,0.30);
            padding: 12px 16px;
            margin: 0 auto 10px auto;
            max-width: 760px;
            text-align: center;
            backdrop-filter: blur(3px);
            -webkit-backdrop-filter: blur(3px);
          ">
            <div style="
              color:#fca5a5;
              font-size:11px;
              letter-spacing:0.14em;
              text-transform:uppercase;
              margin-bottom:6px;
            ">
              The Gatekeeper Reads Your Route...
            </div>
            <div style="
              font-size:15px;
              line-height:1.45;
              color:#f3e7dc;
              margin-bottom:6px;
            ">
              ${scene.narration}
            </div>
            <div style="
              font-size:17px;
              line-height:1.4;
              color:#fda4af;
              font-style:italic;
              font-weight:700;
              margin-bottom:8px;
            ">
              “${scene.quote}”
            </div>
            <div style="
              font-size:17px;
              color:#fff2f0;
            ">
              ${scene.prompt}
            </div>
          </div>

          <div style="
            display:grid;
            grid-template-columns: 1fr 1fr;
            gap:12px;
          ">
            ${scene.choices
              .map(
                (choice, index) => `
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
                  background: linear-gradient(180deg, rgba(20,9,16,0.94), rgba(16,8,18,0.98));
                  color:#fff6ef;
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
            `
              )
              .join('')}
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
              The chamber is calibrating your best next route.
            </div>

            <button id="leave-enlistment-btn" style="
              padding:10px 14px;
              border-radius:12px;
              border:1px solid rgba(255,255,255,0.20);
              background: rgba(0,0,0,0.34);
              color:#f1ddd7;
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
    this.installEscapeToClose();

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
        this.answers.push({
          chapter: scene.chapter,
          title: scene.title,
          prompt: scene.prompt,
          selection: choice.label,
          weights: { ...choice.weights },
        });
        this.applyWeights(choice.weights);

        if (this.currentSceneIndex < this.scenes.length - 1) {
          this.currentSceneIndex += 1;
          this.renderScene();
        } else {
          this.renderResults();
        }
      });
    });

    overlay.querySelector('#leave-enlistment-btn').addEventListener('click', () => {
      this.destroy();
      this.onClose();
    });
  }

  renderResults() {
    const percentages = this.getPercentages();
    const primaryPath = this.getPrimaryPath(percentages);
    const secondaryPath = this.getSecondaryPath(percentages, primaryPath);
    const meta = this.getPathMeta(primaryPath);

    const recommendedClasses = this.getRecommendedClasses(primaryPath, secondaryPath);
    const gamePlan = this.getGamePlan(primaryPath, secondaryPath);

    const result = {
      scores: { ...this.scores },
      percentages,
      answers: [...this.answers],
      primaryPath,
      secondaryPath,
      title: meta.title,
      summary: meta.summary,
      learningStyle: meta.learningStyle,
      recommendedClasses,
      gamePlan,
      redeemToken: {
        code: meta.tokenCode,
        label: meta.tokenLabel,
        color: meta.tokenColor,
        claimed: true,
      },
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
      background: rgba(7, 5, 10, 0.58);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      font-family: Georgia, 'Times New Roman', serif;
    `;

    overlay.innerHTML = `
      <div style="
        width:min(940px, 92vw);
        border-radius: 24px;
        overflow: hidden;
        border: 1px solid rgba(248,113,113,0.30);
        box-shadow:
          0 24px 70px rgba(0,0,0,0.56),
          0 0 30px rgba(239,68,68,0.14);
        background:
          linear-gradient(180deg, rgba(18,7,10,0.94), rgba(10,8,16,0.98)),
          url('${ENLISTMENT_BG}') center center / cover no-repeat;
        color: #f8f1e7;
      ">
        <div style="
          padding: 20px 26px;
          border-bottom:1px solid rgba(255,255,255,0.08);
          color:#fca5a5;
          font-size:13px;
          letter-spacing:0.16em;
          text-transform:uppercase;
        ">
          Route Generated
        </div>

        <div style="padding: 22px 26px 26px;">
          <div style="
            font-size:40px;
            color:#fff2f0;
            margin-bottom:10px;
          ">
            ${meta.title}
          </div>

          <div style="
            font-size:17px;
            line-height:1.6;
            color:#f3e7dc;
            margin-bottom:10px;
          ">
            ${meta.summary}
          </div>

          <div style="
            font-size:16px;
            line-height:1.55;
            color:#f5d6d0;
            margin-bottom:18px;
          ">
            <strong style="color:${meta.tokenColor};">AI Guide Insight:</strong> ${meta.learningStyle}
          </div>

          <div style="
            display:grid;
            grid-template-columns: 1fr 1fr;
            gap:12px 20px;
            margin-bottom:18px;
          ">
            ${[
              ['Foundations', percentages.foundations],
              ['Creative Build', percentages.creative],
              ['Systems', percentages.systems],
              ['AI / Data', percentages.ai],
            ]
              .map(
                ([label, value]) => `
              <div>
                <div style="
                  display:flex;
                  justify-content:space-between;
                  font-size:15px;
                  margin-bottom:6px;
                ">
                  <span>${label}</span>
                  <span style="color:${meta.tokenColor}; font-weight:700;">${value}%</span>
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
                    background: linear-gradient(90deg, ${meta.tokenColor} 0%, #fda4af 100%);
                    box-shadow: 0 0 12px rgba(248,113,113,0.20);
                  "></div>
                </div>
              </div>
            `
              )
              .join('')}
          </div>

          <div style="
            display:grid;
            grid-template-columns: 1.2fr 1fr;
            gap:18px;
            margin-bottom:20px;
          ">
            <div style="
              border:1px solid rgba(255,255,255,0.10);
              border-radius:16px;
              padding:16px;
              background: rgba(255,255,255,0.03);
            ">
              <div style="
                color:#fca5a5;
                font-size:12px;
                letter-spacing:0.12em;
                text-transform:uppercase;
                margin-bottom:10px;
                font-weight:700;
              ">
                AI Guided Class Selection
              </div>

              <div style="display:grid; gap:10px;">
                ${recommendedClasses
                  .map(
                    (item, index) => `
                  <div style="
                    padding:12px 12px;
                    border-radius:12px;
                    border:1px solid rgba(255,255,255,0.08);
                    background: rgba(0,0,0,0.16);
                  ">
                    <div style="
                      display:flex;
                      justify-content:space-between;
                      gap:12px;
                      align-items:center;
                      margin-bottom:6px;
                    ">
                      <div style="font-size:18px; color:#fff5f1;">
                        ${index + 1}. ${item.name}
                      </div>
                      <div style="
                        font-size:11px;
                        text-transform:uppercase;
                        letter-spacing:0.08em;
                        color:${meta.tokenColor};
                      ">
                        ${item.fit}
                      </div>
                    </div>
                    <div style="
                      font-size:14px;
                      line-height:1.5;
                      color:#eadfda;
                    ">
                      ${item.reason}
                    </div>
                  </div>
                `
                  )
                  .join('')}
              </div>
            </div>

            <div style="
              border:1px solid rgba(255,255,255,0.10);
              border-radius:16px;
              padding:16px;
              background: rgba(255,255,255,0.03);
            ">
              <div style="
                color:#fca5a5;
                font-size:12px;
                letter-spacing:0.12em;
                text-transform:uppercase;
                margin-bottom:10px;
                font-weight:700;
              ">
                Class Game Plan
              </div>

              <div style="display:grid; gap:10px;">
                ${gamePlan
                  .map(
                    (step, index) => `
                  <div style="
                    padding:12px 12px;
                    border-radius:12px;
                    border:1px solid rgba(255,255,255,0.08);
                    background: rgba(0,0,0,0.16);
                  ">
                    <div style="
                      font-size:16px;
                      color:#fff2f0;
                      margin-bottom:6px;
                    ">
                      Step ${index + 1}: ${step.title}
                    </div>
                    <div style="
                      font-size:14px;
                      line-height:1.5;
                      color:#e6dbd5;
                    ">
                      ${step.description}
                    </div>
                  </div>
                `
                  )
                  .join('')}
              </div>
            </div>
          </div>

          <div style="
            border:1px solid rgba(255,255,255,0.10);
            border-radius:18px;
            padding:16px 18px;
            background: linear-gradient(180deg, rgba(36,10,14,0.74), rgba(25,8,16,0.86));
            margin-bottom:20px;
          ">
            <div style="
              color:#fca5a5;
              font-size:12px;
              letter-spacing:0.12em;
              text-transform:uppercase;
              margin-bottom:10px;
              font-weight:700;
            ">
              Redeemable Path Token
            </div>

            <div style="
              display:flex;
              justify-content:space-between;
              align-items:center;
              gap:16px;
              flex-wrap:wrap;
            ">
              <div>
                <div style="
                  font-size:26px;
                  color:#fff2f0;
                  margin-bottom:6px;
                ">
                  ${result.redeemToken.label}
                </div>
                <div style="
                  font-size:14px;
                  color:#f2d9d6;
                  letter-spacing:0.08em;
                ">
                  ${result.redeemToken.code}
                </div>
              </div>

              <div style="
                padding:10px 16px;
                border-radius:999px;
                border:1px solid ${meta.tokenColor};
                color:${meta.tokenColor};
                font-weight:700;
                letter-spacing:0.08em;
                text-transform:uppercase;
                box-shadow: 0 0 18px rgba(255,255,255,0.04);
              ">
                Redeem Ready
              </div>
            </div>
          </div>

          <div style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            gap:12px;
            flex-wrap:wrap;
          ">
            <button id="course-restart-btn" style="
              padding:12px 16px;
              border-radius:12px;
              border:1px solid rgba(255,255,255,0.18);
              background: rgba(0,0,0,0.24);
              color:#f4dfda;
              cursor:pointer;
              font-family: inherit;
              font-size:14px;
            ">
              Recalibrate Path
            </button>

            <button id="course-redeem-btn" style="
              padding:12px 18px;
              border-radius:12px;
              border:1px solid ${meta.tokenColor};
              background: linear-gradient(180deg, rgba(248,113,113,0.22), rgba(127,29,29,0.18));
              color:#fff6f4;
              cursor:pointer;
              font-family: inherit;
              font-size:15px;
              font-weight:700;
              box-shadow: 0 0 18px rgba(248,113,113,0.12);
            ">
              Redeem Plan & Return
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    this.overlay = overlay;
    this.installEscapeToClose();

    overlay.querySelector('#course-restart-btn').addEventListener('click', () => {
      this.currentSceneIndex = 0;
      this.scores = {
        foundations: 0,
        creative: 0,
        systems: 0,
        ai: 0,
      };
      this.answers = [];
      this.renderScene();
    });

    overlay.querySelector('#course-redeem-btn').addEventListener('click', async () => {
      try {
        await this.onComplete(result);
      } finally {
        this.destroy();
      }
    });
  }
}