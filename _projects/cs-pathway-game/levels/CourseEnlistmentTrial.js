// CourseEnlistmentTrial.js

import AiNpcSession from '/assets/js/GameEnginev1.1/essentials/AiNpcSession.js';
import { pythonURI, fetchOptions } from '/assets/js/api/config.js';

const ENLISTMENT_BG = '/images/vision-doors.png';

class CourseEnlistmentTrial {
  constructor({ profileData = {}, onComplete, onClose } = {}) {
    this.profileData = profileData || {};
    this.onComplete = onComplete || (() => {});
    this.onClose = onClose || (() => {});
    this.overlay = null;
    this.currentSceneIndex = 0;
    this.aiSession = null;
    this.advisorChatHistory = [];
    this.currentResult = null;
    this._escapeHandler = null;

    this.scores = {
      foundations: 0,
      creative: 0,
      systems: 0,
      ai: 0,
    };

    this.answers = [];
    this.historyModal = null;

    this.scenes = [
      {
        chapter: 'ENLISTMENT I',
        title: 'The Signal of Intent',
        narration:
          'A crimson chamber opens beneath the gatekeeper. Symbols gather in the air, reading what you want from computer science.',
        quote:
          'The best path is not the loudest one. It is the one that fits your growth.',
        prompt: 'What do you most want your CS journey to give you first?',
        choices: [
          {
            label: 'A strong foundation so I can understand how things work.',
            number: '1',
            accent: '#f59e0b',
            weights: { foundations: 3, systems: 1 },
          },
          {
            label: 'A way to build visible, creative, interactive projects.',
            number: '2',
            accent: '#60a5fa',
            weights: { creative: 3, ai: 1 },
          },
          {
            label: 'A chance to solve harder technical problems and go deeper.',
            number: '3',
            accent: '#a78bfa',
            weights: { systems: 3, foundations: 1 },
          },
          {
            label: 'A path toward AI, smart tools, and future-facing work.',
            number: '4',
            accent: '#34d399',
            weights: { ai: 3, systems: 1 },
          },
        ],
      },
      {
        chapter: 'ENLISTMENT II',
        title: 'The Mode of Learning',
        narration:
          'Four routes open. One is structured. One is expressive. One is rigorous. One points toward intelligent systems.',
        quote:
          'How you learn matters as much as what you learn.',
        prompt: 'Which kind of work pulls you in most naturally?',
        choices: [
          {
            label: 'Step-by-step logic that builds my confidence.',
            number: '1',
            accent: '#f59e0b',
            weights: { foundations: 3 },
          },
          {
            label: 'Designing and making things people can directly use.',
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
            label: 'Patterns, data, prediction, and intelligent behavior.',
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
          'The chamber measures not just ambition, but readiness.',
        quote:
          'A strong route builds footing before acceleration.',
        prompt: 'What level of challenge feels right for your next class?',
        choices: [
          {
            label: 'A steady entry point where I can build strong habits first.',
            number: '1',
            accent: '#f59e0b',
            weights: { foundations: 3, creative: 1 },
          },
          {
            label: 'A class that lets me create while I learn.',
            number: '2',
            accent: '#60a5fa',
            weights: { creative: 3, foundations: 1 },
          },
          {
            label: 'Something more rigorous where I can stretch technically.',
            number: '3',
            accent: '#a78bfa',
            weights: { systems: 3, ai: 1 },
          },
          {
            label: 'A path that gets me closer to AI and advanced applications.',
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
          'You see a future version of yourself one year from now: more capable, more directed, more sure of your place in the pathway.',
        quote:
          'Choose the class that helps you become who you want to be next.',
        prompt: 'Which future version of yourself feels most exciting?',
        choices: [
          {
            label: 'Someone with strong fundamentals who can go anywhere later.',
            number: '1',
            accent: '#f59e0b',
            weights: { foundations: 3 },
          },
          {
            label: 'Someone building polished apps, websites, and creative tools.',
            number: '2',
            accent: '#60a5fa',
            weights: { creative: 3 },
          },
          {
            label: 'Someone confident with logic, debugging, and deeper engineering.',
            number: '3',
            accent: '#a78bfa',
            weights: { systems: 3 },
          },
          {
            label: 'Someone exploring AI, data, and intelligent systems.',
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
    if (this._escapeHandler) {
      document.removeEventListener('keydown', this._escapeHandler);
      this._escapeHandler = null;
    }

    if (this.aiSession) {
      this.aiSession.cancel();
      this.aiSession = null;
    }

    if (this.historyModal?.parentNode) {
      this.historyModal.parentNode.removeChild(this.historyModal);
    }
    this.historyModal = null;

    if (this.overlay?.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
    this.overlay = null;
  }

  installEscapeHandler() {
    if (this._escapeHandler) {
      document.removeEventListener('keydown', this._escapeHandler);
    }

    this._escapeHandler = (event) => {
      if (event.key === 'Escape') {
        this.destroy();
        this.onClose();
      }
    };

    document.addEventListener('keydown', this._escapeHandler);
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
        summary: 'You will grow most strongly from a route that builds confidence, structure, and reliable core habits.',
        learningStyle: 'You learn best when concepts are clearly scaffolded and each skill locks into the next.',
        accent: '#f59e0b',
      },
      creative: {
        title: 'Creative Builder',
        summary: 'You are energized by making visible, expressive, interactive work.',
        learningStyle: 'You learn fastest when ideas become projects you can see, shape, and share.',
        accent: '#60a5fa',
      },
      systems: {
        title: 'Systems Pathfinder',
        summary: 'You are drawn toward rigor, deeper logic, and stronger engineering structure.',
        learningStyle: 'You grow through problem-solving, debugging, and understanding what is happening beneath the surface.',
        accent: '#a78bfa',
      },
      ai: {
        title: 'AI Wayfinder',
        summary: 'You are motivated by intelligent systems, pattern-finding, and future-facing applications.',
        learningStyle: 'You stay engaged when technical growth connects to smart systems and ambitious ideas.',
        accent: '#34d399',
      },
    };

    return map[pathKey];
  }

  getSingleRecommendedClass(primaryPath, percentages) {
    if (primaryPath === 'systems') {
      return {
        name: 'CSA',
        why: 'Your strongest signal points toward rigor, structured logic, and deeper programming depth.',
      };
    }

    if (primaryPath === 'creative') {
      return {
        name: 'CSP',
        why: 'Your strongest signal points toward creative exploration, building visible projects, and broad computing applications.',
      };
    }

    if (primaryPath === 'ai') {
      if ((percentages.systems || 0) >= 24 || (percentages.foundations || 0) >= 28) {
        return {
          name: 'CSA',
          why: 'Your path points toward AI, and you also show enough readiness for stronger programming depth that supports that future.',
        };
      }
      return {
        name: 'CSSE',
        why: 'Your path points toward AI, but the best next step is building the coding foundation that will make later advanced work much easier.',
      };
    }

    return {
      name: 'CSSE',
      why: 'Your strongest signal is foundations, so the best next step is the class that builds dependable coding habits and confidence first.',
    };
  }

  getSuccessPlanForClass(className, primaryPath, secondaryPath) {
    const plans = {
      CSSE: [
        {
          title: 'Build consistency',
          description: 'Practice small coding reps regularly so syntax and logic stop feeling intimidating.',
        },
        {
          title: 'Strengthen debugging',
          description: 'Get comfortable reading errors, testing changes, and fixing one issue at a time.',
        },
        {
          title: 'Ask how it works',
          description: `Use your ${this.prettyLabel(primaryPath)} interest to stay curious while your fundamentals grow.`,
        },
      ],
      CSP: [
        {
          title: 'Think through the user',
          description: 'Focus on how computing ideas become experiences, products, and real-world impact.',
        },
        {
          title: 'Create visible work',
          description: 'Turn your ideas into small projects, presentations, or prototypes you can reflect on.',
        },
        {
          title: 'Balance creativity with structure',
          description: `Use your ${this.prettyLabel(secondaryPath)} strength to give your creative work more technical depth.`,
        },
      ],
      CSA: [
        {
          title: 'Practice structured problem-solving',
          description: 'Break problems into parts and solve them carefully instead of rushing to the full answer.',
        },
        {
          title: 'Get stronger at persistence',
          description: 'More rigorous classes reward students who keep iterating through hard problems.',
        },
        {
          title: 'Connect rigor to purpose',
          description: `Use your ${this.prettyLabel(primaryPath)} motivation to stay engaged when the work gets more technical.`,
        },
      ],
    };

    return plans[className] || [];
  }

  prettyLabel(key) {
    const labels = {
      foundations: 'foundational growth',
      creative: 'creative building',
      systems: 'systems thinking',
      ai: 'AI exploration',
    };
    return labels[key] || 'future pathway growth';
  }

  buildResult() {
    const percentages = this.getPercentages();
    const primaryPath = this.getPrimaryPath(percentages);
    const secondaryPath = this.getSecondaryPath(percentages, primaryPath);
    const meta = this.getPathMeta(primaryPath);
    const recommendedClass = this.getSingleRecommendedClass(primaryPath, percentages);
    const successPlan = this.getSuccessPlanForClass(recommendedClass.name, primaryPath, secondaryPath);

    return {
      scores: { ...this.scores },
      percentages,
      answers: [...this.answers],
      primaryPath,
      secondaryPath,
      title: meta.title,
      summary: meta.summary,
      learningStyle: meta.learningStyle,
      accent: meta.accent,
      recommendedClass,
      successPlan,
      advisorChatHistory: [...this.advisorChatHistory],
      completedAt: new Date().toISOString(),
    };
  }

  createAdvisorKnowledgeContext(result) {
    const answers = result.answers
      .map((item, index) => `${index + 1}. ${item.prompt} -> ${item.selection}`)
      .join('\n');

    const successPlan = result.successPlan
      .map((item, index) => `${index + 1}. ${item.title}: ${item.description}`)
      .join('\n');

    return [
      `The student just completed a course recommendation flow in the Wayfinding game.`,
      `Recommended class: ${result.recommendedClass.name}`,
      `Why that class: ${result.recommendedClass.why}`,
      `Primary path: ${result.primaryPath}`,
      `Secondary path: ${result.secondaryPath}`,
      `Summary: ${result.summary}`,
      `Learning style: ${result.learningStyle}`,
      `Success plan:`,
      successPlan,
      `Survey answers:`,
      answers,
      `You should explain the recommendation clearly, compare classes when asked, and help the student succeed in the recommended class.`,
    ].join('\n');
  }

  canUseElement(element) {
    return !!element && element.isConnected && !!this.aiSession?.isActive?.();
  }

  async showTypedResponse(text, element, speed = 16) {
    if (!this.canUseElement(element)) return;

    element.textContent = '';
    element.style.display = 'block';
    let index = 0;

    const type = () => {
      if (!this.canUseElement(element)) return;
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index += 1;
        this.aiSession.setTimeout(type, speed);
      }
    };

    type();
  }

  renderChatHistory(listEl) {
    listEl.innerHTML = '';

    if (!this.advisorChatHistory.length) {
      const intro = document.createElement('div');
      intro.style.cssText = `
        padding: 10px 12px;
        border-radius: 12px;
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.08);
        color: #eadfd8;
        font-size: 13px;
        line-height: 1.5;
      `;
      intro.textContent = 'Ask why this class fits you, what to work on before taking it, or how to prepare for success.';
      listEl.appendChild(intro);
      return;
    }

    this.advisorChatHistory.forEach((entry) => {
      const bubble = document.createElement('div');
      const isUser = entry.role === 'user';
      bubble.style.cssText = `
        max-width: 88%;
        align-self: ${isUser ? 'flex-end' : 'flex-start'};
        padding: 10px 12px;
        margin-top: 8px;
        border-radius: 12px;
        font-size: 13px;
        line-height: 1.5;
        color: #fff4ef;
        background: ${isUser ? 'rgba(248,113,113,0.16)' : 'rgba(255,255,255,0.06)'};
        border: 1px solid ${isUser ? 'rgba(248,113,113,0.24)' : 'rgba(255,255,255,0.08)'};
        white-space: pre-wrap;
      `;
      bubble.textContent = entry.message;
      listEl.appendChild(bubble);
    });

    listEl.scrollTop = listEl.scrollHeight;
  }

  showChatHistoryModal() {
    if (this.historyModal?.parentNode) {
      this.historyModal.parentNode.removeChild(this.historyModal);
      this.historyModal = null;
    }

    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 10020;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.42);
      padding: 20px;
      box-sizing: border-box;
    `;

    modal.innerHTML = `
      <div style="
        width:min(640px, 92vw);
        max-height:75vh;
        overflow:auto;
        border-radius:18px;
        background: linear-gradient(180deg, rgba(18,7,10,0.98), rgba(10,8,16,0.98));
        border:1px solid rgba(255,255,255,0.10);
        box-shadow: 0 20px 50px rgba(0,0,0,0.38);
        color:#f8f1e7;
      ">
        <div style="
          display:flex;
          justify-content:space-between;
          align-items:center;
          padding:14px 16px;
          border-bottom:1px solid rgba(255,255,255,0.08);
        ">
          <div style="font-size:15px; color:#fca5a5; letter-spacing:0.08em; text-transform:uppercase;">
            Advisor Chat History
          </div>
          <button id="advisor-history-close" style="
            border:none;
            background:transparent;
            color:#f3dfd9;
            font-size:20px;
            cursor:pointer;
          ">×</button>
        </div>
        <div id="advisor-history-content" style="
          padding:14px 16px 18px;
          display:flex;
          flex-direction:column;
        "></div>
      </div>
    `;

    document.body.appendChild(modal);
    this.historyModal = modal;

    const content = modal.querySelector('#advisor-history-content');
    if (!this.advisorChatHistory.length) {
      const empty = document.createElement('div');
      empty.style.cssText = `
        color:#eadfd8;
        font-size:14px;
        line-height:1.5;
      `;
      empty.textContent = 'No messages yet.';
      content.appendChild(empty);
    } else {
      this.advisorChatHistory.forEach((entry) => {
        const bubble = document.createElement('div');
        const isUser = entry.role === 'user';
        bubble.style.cssText = `
          max-width: 88%;
          align-self: ${isUser ? 'flex-end' : 'flex-start'};
          padding: 10px 12px;
          margin-top: 8px;
          border-radius: 12px;
          font-size: 13px;
          line-height: 1.5;
          color: #fff4ef;
          background: ${isUser ? 'rgba(248,113,113,0.16)' : 'rgba(255,255,255,0.06)'};
          border: 1px solid ${isUser ? 'rgba(248,113,113,0.24)' : 'rgba(255,255,255,0.08)'};
          white-space: pre-wrap;
        `;
        bubble.textContent = entry.message;
        content.appendChild(bubble);
      });
    }

    modal.querySelector('#advisor-history-close').addEventListener('click', () => {
      if (this.historyModal?.parentNode) {
        this.historyModal.parentNode.removeChild(this.historyModal);
      }
      this.historyModal = null;
    });

    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        if (this.historyModal?.parentNode) {
          this.historyModal.parentNode.removeChild(this.historyModal);
        }
        this.historyModal = null;
      }
    });
  }

  async sendAdvisorMessage(userMessage, responseArea, inputField, sendBtn) {
    const trimmed = String(userMessage || '').trim();
    if (!trimmed || !this.currentResult || !this.aiSession?.isActive?.()) return;

    this.advisorChatHistory.push({ role: 'user', message: trimmed });
    this.renderChatHistory(responseArea);

    inputField.value = '';
    inputField.disabled = true;
    sendBtn.disabled = true;

    const thinking = document.createElement('div');
    thinking.style.cssText = `
      max-width: 88%;
      align-self: flex-start;
      padding: 10px 12px;
      margin-top: 8px;
      border-radius: 12px;
      font-size: 13px;
      line-height: 1.5;
      color: #f3e7de;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.08);
    `;
    thinking.textContent = 'Thinking...';
    responseArea.appendChild(thinking);
    responseArea.scrollTop = responseArea.scrollHeight;

    try {
      const knowledgeContext = this.createAdvisorKnowledgeContext(this.currentResult);
      const response = await fetch(`${pythonURI}/api/ainpc/prompt`, {
        ...fetchOptions,
        method: 'POST',
        body: JSON.stringify({
          prompt: trimmed,
          session_id: 'player-course-advisor',
          npc_type: 'course_advisor',
          expertise: 'course_advisor',
          knowledgeContext,
        }),
        signal: this.aiSession.signal,
      });

      const data = await response.json();
      if (!this.canUseElement(responseArea)) return;

      thinking.remove();

      if (data.status === 'error') {
        const failText = data.message || "I'm having trouble thinking right now.";
        this.advisorChatHistory.push({ role: 'ai', message: failText });
        this.currentResult.advisorChatHistory = [...this.advisorChatHistory];
        this.renderChatHistory(responseArea);
        return;
      }

      const aiResponse = data?.response || "I'm not sure how to answer that yet.";
      this.advisorChatHistory.push({ role: 'ai', message: aiResponse });
      this.currentResult.advisorChatHistory = [...this.advisorChatHistory];

      const aiBubble = document.createElement('div');
      aiBubble.style.cssText = `
        max-width: 88%;
        align-self: flex-start;
        padding: 10px 12px;
        margin-top: 8px;
        border-radius: 12px;
        font-size: 13px;
        line-height: 1.5;
        color: #fff4ef;
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.08);
        white-space: pre-wrap;
      `;
      responseArea.appendChild(aiBubble);
      responseArea.scrollTop = responseArea.scrollHeight;
      await this.showTypedResponse(aiResponse, aiBubble, 10);

    } catch (err) {
      if (err?.name === 'AbortError' || this.aiSession?.signal?.aborted) {
        return;
      }

      console.error('Course advisor frontend error:', err);

      if (this.canUseElement(responseArea)) {
        thinking.remove();
        const fallback = "I'm having trouble reaching my brain right now. Based on your path, focus on the recommended class first and build the success skills shown beside it.";
        this.advisorChatHistory.push({ role: 'ai', message: fallback });
        this.currentResult.advisorChatHistory = [...this.advisorChatHistory];
        this.renderChatHistory(responseArea);
      }
    } finally {
      inputField.disabled = false;
      sendBtn.disabled = false;
      if (this.canUseElement(inputField)) {
        this.aiSession.setTimeout(() => {
          if (this.canUseElement(inputField)) inputField.focus();
        }, 60);
      }
    }
  }

  resetAndRestart() {
    this.currentSceneIndex = 0;
    this.scores = {
      foundations: 0,
      creative: 0,
      systems: 0,
      ai: 0,
    };
    this.answers = [];
    this.advisorChatHistory = [];
    this.currentResult = null;
    this.renderScene();
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
      padding: 20px;
      box-sizing: border-box;
      background: rgba(7, 5, 10, 0.56);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      font-family: Georgia, 'Times New Roman', serif;
    `;

    overlay.innerHTML = `
      <div style="
        position: relative;
        width: min(920px, 92vw);
        height: min(640px, 86vh);
        border-radius: 22px;
        overflow: hidden;
        border: 1px solid rgba(239,68,68,0.30);
        box-shadow: 0 24px 70px rgba(0,0,0,0.56);
        background:
          linear-gradient(to top, rgba(0,0,0,0.84) 0%, rgba(0,0,0,0.38) 42%, rgba(0,0,0,0.12) 100%),
          url('${ENLISTMENT_BG}') center center / cover no-repeat;
        color: #f8f1e7;
      ">
        <button id="enlist-close-top" style="
          position:absolute;
          top:14px;
          right:16px;
          z-index:3;
          border:none;
          background:transparent;
          color:#f3dfd9;
          font-size:26px;
          cursor:pointer;
        ">×</button>

        <div style="
          position:absolute;
          top:18px;
          left:22px;
          right:58px;
          display:flex;
          justify-content:space-between;
          align-items:flex-start;
          z-index:2;
        ">
          <div style="display:flex; align-items:center; gap:10px; color:#f6d7d2;">
            <span style="color:#f87171; font-size:18px;">✦</span>
            <span style="font-size:20px;">Course Enlistment Chamber</span>
          </div>
          <div style="display:flex; gap:8px;">
            ${Array.from({ length: this.scenes.length }).map((_, i) => `
              <span style="
                width:10px; height:10px; border-radius:999px; display:inline-block;
                border:1px solid rgba(255,255,255,0.45);
                background:${i === this.currentSceneIndex ? '#ef4444' : 'transparent'};
              "></span>
            `).join('')}
          </div>
        </div>

        <div style="
          position:absolute;
          top:54px;
          left:0;
          width:100%;
          text-align:center;
          z-index:2;
        ">
          <div style="font-size:36px; letter-spacing:0.08em; color:#fca5a5; margin-bottom:6px;">
            ${scene.chapter}
          </div>
          <div style="font-size:20px; color:#fde2e2;">
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
            border: 1px solid rgba(248,113,113,0.20);
            border-radius: 16px;
            padding: 12px 16px;
            margin: 0 auto 12px auto;
            max-width: 720px;
            text-align: center;
          ">
            <div style="font-size:14px; line-height:1.45; color:#f3e7dc; margin-bottom:6px;">
              ${scene.narration}
            </div>
            <div style="font-size:16px; line-height:1.4; color:#fda4af; font-style:italic; font-weight:700; margin-bottom:8px;">
              “${scene.quote}”
            </div>
            <div style="font-size:16px; color:#fff2f0;">
              ${scene.prompt}
            </div>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
            ${scene.choices.map((choice, index) => `
              <button
                data-choice-index="${index}"
                style="
                  display:flex;
                  align-items:center;
                  gap:12px;
                  text-align:left;
                  padding:12px 14px;
                  min-height:66px;
                  border-radius:14px;
                  border:1px solid ${choice.accent};
                  background: linear-gradient(180deg, rgba(20,9,16,0.94), rgba(16,8,18,0.98));
                  color:#fff6ef;
                  cursor:pointer;
                  font-family: Georgia, 'Times New Roman', serif;
                "
              >
                <div style="
                  width:34px; height:34px; min-width:34px; border-radius:999px;
                  border:1px solid ${choice.accent};
                  display:flex; align-items:center; justify-content:center;
                  color:${choice.accent}; font-size:16px;
                ">
                  ${choice.number}
                </div>
                <div style="flex:1; font-size:15px; line-height:1.32;">
                  ${choice.label}
                </div>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    this.overlay = overlay;
    this.installEscapeHandler();

    overlay.querySelectorAll('[data-choice-index]').forEach((btn) => {
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

    overlay.querySelector('#enlist-close-top').addEventListener('click', () => {
      this.destroy();
      this.onClose();
    });
  }

  renderResults() {
    this.currentResult = this.buildResult();

    this.destroy();
    this.aiSession = new AiNpcSession('course-advisor');

    const result = this.currentResult;
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      box-sizing: border-box;
      background: rgba(7, 5, 10, 0.58);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      font-family: Georgia, 'Times New Roman', serif;
    `;

    overlay.innerHTML = `
      <div style="
        width:min(900px, 94vw);
        max-height:88vh;
        overflow:auto;
        border-radius:22px;
        border:1px solid rgba(248,113,113,0.26);
        box-shadow: 0 24px 70px rgba(0,0,0,0.56);
        background: linear-gradient(180deg, rgba(18,7,10,0.96), rgba(10,8,16,0.98));
        color:#f8f1e7;
      ">
        <div style="
          display:flex;
          justify-content:space-between;
          align-items:center;
          padding:14px 18px;
          border-bottom:1px solid rgba(255,255,255,0.08);
        ">
          <div style="
            color:#fca5a5;
            font-size:12px;
            letter-spacing:0.14em;
            text-transform:uppercase;
          ">
            Recommendation Complete
          </div>
          <button id="course-close-top" style="
            border:none;
            background:transparent;
            color:#f3dfd9;
            font-size:24px;
            cursor:pointer;
          ">×</button>
        </div>

        <div style="padding:18px;">
          <div style="font-size:28px; color:#fff2f0; margin-bottom:6px;">
            ${result.title}
          </div>

          <div style="font-size:15px; line-height:1.55; color:#f3e7dc; margin-bottom:14px;">
            ${result.summary}
          </div>

          <div style="
            display:grid;
            grid-template-columns: 1fr 1fr;
            gap:14px;
            margin-bottom:14px;
          ">
            <div style="
              border:1px solid rgba(255,255,255,0.10);
              border-radius:16px;
              padding:14px;
              background: rgba(255,255,255,0.03);
            ">
              <div style="
                color:#fca5a5;
                font-size:11px;
                letter-spacing:0.12em;
                text-transform:uppercase;
                margin-bottom:8px;
                font-weight:700;
              ">
                Recommended Class
              </div>

              <div style="font-size:28px; color:${result.accent}; margin-bottom:8px;">
                ${result.recommendedClass.name}
              </div>

              <div style="font-size:14px; line-height:1.55; color:#eadfd8;">
                ${result.recommendedClass.why}
              </div>
            </div>

            <div style="
              border:1px solid rgba(255,255,255,0.10);
              border-radius:16px;
              padding:14px;
              background: rgba(255,255,255,0.03);
            ">
              <div style="
                color:#fca5a5;
                font-size:11px;
                letter-spacing:0.12em;
                text-transform:uppercase;
                margin-bottom:8px;
                font-weight:700;
              ">
                Skills to Develop
              </div>

              <div style="display:grid; gap:8px;">
                ${result.successPlan.map((step, index) => `
                  <div style="
                    padding:10px 10px;
                    border-radius:12px;
                    border:1px solid rgba(255,255,255,0.08);
                    background: rgba(0,0,0,0.14);
                  ">
                    <div style="font-size:15px; color:#fff2f0; margin-bottom:4px;">
                      ${index + 1}. ${step.title}
                    </div>
                    <div style="font-size:13px; line-height:1.5; color:#e6dbd5;">
                      ${step.description}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <div style="
            border:1px solid rgba(255,255,255,0.10);
            border-radius:16px;
            padding:14px;
            background: rgba(255,255,255,0.03);
            margin-bottom:14px;
          ">
            <div style="
              display:flex;
              justify-content:space-between;
              align-items:center;
              gap:10px;
              margin-bottom:8px;
              flex-wrap:wrap;
            ">
              <div style="
                color:#fca5a5;
                font-size:11px;
                letter-spacing:0.12em;
                text-transform:uppercase;
                font-weight:700;
              ">
                Ask the AI Advisor
              </div>

              <button id="advisor-history-btn" style="
                padding:6px 10px;
                border-radius:999px;
                border:1px solid rgba(255,255,255,0.12);
                background: rgba(0,0,0,0.18);
                color:#f2e4de;
                cursor:pointer;
                font-size:12px;
                font-family: inherit;
              ">
                Chat History
              </button>
            </div>

            <div id="advisor-suggestion-wrap" style="
              display:flex;
              flex-wrap:wrap;
              gap:8px;
              margin-bottom:10px;
            ">
              ${[
                'Why is this class my best fit?',
                'What should I work on before taking it?',
                'Why not the other classes?',
              ].map((text) => `
                <button
                  class="advisor-suggestion-btn"
                  data-suggestion="${text.replace(/"/g, '&quot;')}"
                  style="
                    padding:8px 10px;
                    border-radius:999px;
                    border:1px solid rgba(255,255,255,0.12);
                    background: rgba(0,0,0,0.18);
                    color:#f2e4de;
                    cursor:pointer;
                    font-size:12px;
                    font-family: inherit;
                  "
                >
                  ${text}
                </button>
              `).join('')}
            </div>

            <div id="advisor-chat-history" style="
              min-height:120px;
              max-height:200px;
              overflow:auto;
              display:flex;
              flex-direction:column;
              padding:4px 0;
              margin-bottom:10px;
            "></div>

            <div style="
              display:grid;
              grid-template-columns: 1fr auto;
              gap:8px;
              align-items:end;
            ">
              <textarea
                id="advisor-input"
                rows="2"
                placeholder="Ask the advisor..."
                style="
                  resize:none;
                  width:100%;
                  border-radius:14px;
                  border:1px solid rgba(255,255,255,0.12);
                  background: rgba(12,8,14,0.58);
                  color:#fff4ef;
                  padding:10px 12px;
                  box-sizing:border-box;
                  font-family: inherit;
                  font-size:13px;
                  line-height:1.5;
                "
              ></textarea>

              <button id="advisor-send-btn" style="
                padding:10px 14px;
                border-radius:12px;
                border:1px solid ${result.accent};
                background: linear-gradient(180deg, rgba(248,113,113,0.20), rgba(127,29,29,0.16));
                color:#fff6f4;
                cursor:pointer;
                font-family: inherit;
                font-size:13px;
                font-weight:700;
                min-width:80px;
              ">
                Send
              </button>
            </div>
          </div>

          <div style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            gap:10px;
            flex-wrap:wrap;
          ">
            <button id="course-restart-btn" style="
              padding:10px 14px;
              border-radius:12px;
              border:1px solid rgba(255,255,255,0.18);
              background: rgba(0,0,0,0.24);
              color:#f4dfda;
              cursor:pointer;
              font-family: inherit;
              font-size:14px;
            ">
              Recalibrate
            </button>

            <button id="course-redeem-btn" style="
              padding:12px 18px;
              border-radius:12px;
              border:1px solid ${result.accent};
              background: linear-gradient(180deg, rgba(248,113,113,0.22), rgba(127,29,29,0.18));
              color:#fff6f4;
              cursor:pointer;
              font-family: inherit;
              font-size:15px;
              font-weight:700;
            ">
              Redeem and Move On
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    this.overlay = overlay;
    this.installEscapeHandler();

    const responseArea = overlay.querySelector('#advisor-chat-history');
    const inputField = overlay.querySelector('#advisor-input');
    const sendBtn = overlay.querySelector('#advisor-send-btn');

    this.renderChatHistory(responseArea);

    const sendCurrent = async () => {
      const value = inputField.value;
      if (!String(value || '').trim()) return;
      await this.sendAdvisorMessage(value, responseArea, inputField, sendBtn);
    };

    inputField.addEventListener('keydown', (event) => {
      event.stopPropagation();
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendCurrent();
      }
    });

    sendBtn.addEventListener('click', sendCurrent);

    overlay.querySelectorAll('.advisor-suggestion-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const suggestion = btn.getAttribute('data-suggestion') || '';
        await this.sendAdvisorMessage(suggestion, responseArea, inputField, sendBtn);
      });
    });

    overlay.querySelector('#advisor-history-btn').addEventListener('click', () => {
      this.showChatHistoryModal();
    });

    overlay.querySelector('#course-close-top').addEventListener('click', () => {
      this.destroy();
      this.onClose();
    });

    overlay.querySelector('#course-restart-btn').addEventListener('click', () => {
      this.resetAndRestart();
    });

    overlay.querySelector('#course-redeem-btn').addEventListener('click', async () => {
      try {
        if (this.currentResult) {
          this.currentResult.advisorChatHistory = [...this.advisorChatHistory];
          this.currentResult.completedAt = new Date().toISOString();
        }
        await this.onComplete(this.currentResult);
      } finally {
        this.destroy();
      }
    });

    if (this.aiSession) {
      this.aiSession.setTimeout(() => {
        if (this.canUseElement(inputField)) inputField.focus();
      }, 100);
    }
  }
}

export default CourseEnlistmentTrial;