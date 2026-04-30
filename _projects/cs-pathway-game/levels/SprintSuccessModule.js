/**
 * SprintSuccessModule
 * -------------------
 * Interactive Agile planning game for Wayfinding World.
 *
 * Steps:
 * 1. Break the Problem - classify task cards by size
 * 2. Sprint Timeline - order tasks into a logical sprint sequence
 * 3. Kanban Builder - build a pseudo Kanban board
 *
 * Usage:
 *   const sprint = new SprintSuccessModule({ onComplete, onClose });
 *   sprint.start();
 */

export default class SprintSuccessModule {
  constructor({ onComplete, onClose } = {}) {
    this.onComplete = onComplete;
    this.onClose = onClose;
    this.overlay = null;

    this.step = 0;

    this.state = {
      decomposition: {},
      timeline: [],
      kanban: {
        backlog: [],
        inProgress: [],
        done: [],
      },
    };

    this.tasks = [
      {
        id: 'goal',
        text: 'Build the entire project',
        type: 'too-big',
        label: 'Too Big',
      },
      {
        id: 'wireframe',
        text: 'Sketch the main screen layout',
        type: 'good',
        label: 'Good Task',
      },
      {
        id: 'login',
        text: 'Create login button',
        type: 'good',
        label: 'Good Task',
      },
      {
        id: 'semicolon',
        text: 'Add one semicolon',
        type: 'too-small',
        label: 'Too Small',
      },
      {
        id: 'test',
        text: 'Test the user flow',
        type: 'good',
        label: 'Good Task',
      },
      {
        id: 'deploy',
        text: 'Publish the final version',
        type: 'good',
        label: 'Good Task',
      },
    ];

    this.timelineTasks = [
      'Understand the goal',
      'Break goal into tasks',
      'Build first version',
      'Test with a user',
      'Review and improve',
    ];
  }

  start() {
    this._render();
  }

  _render() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'ss-overlay';

    this.overlay.innerHTML = `
      <style>
        .ss-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(3, 7, 18, 0.92);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Courier New", monospace;
          color: #e5f6ff;
        }

        .ss-modal {
          width: min(980px, 92vw);
          max-height: 88vh;
          overflow: auto;
          background: linear-gradient(180deg, #101827, #07111f);
          border: 2px solid #38bdf8;
          border-radius: 18px;
          box-shadow: 0 0 30px rgba(56, 189, 248, 0.35);
        }

        .ss-header {
          padding: 18px 24px;
          border-bottom: 1px solid rgba(56, 189, 248, 0.35);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(15, 23, 42, 0.95);
        }

        .ss-title {
          font-size: 24px;
          font-weight: bold;
          color: #7dd3fc;
          letter-spacing: 1px;
        }

        .ss-subtitle {
          font-size: 12px;
          color: #bae6fd;
          margin-top: 4px;
        }

        .ss-step {
          color: #facc15;
          font-size: 13px;
        }

        .ss-body {
          padding: 22px 24px;
        }

        .ss-instructions {
          background: rgba(14, 165, 233, 0.1);
          border: 1px solid rgba(14, 165, 233, 0.35);
          padding: 14px;
          border-radius: 12px;
          margin-bottom: 18px;
          line-height: 1.5;
          color: #dbeafe;
        }

        .ss-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .ss-column {
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(148, 163, 184, 0.35);
          border-radius: 14px;
          min-height: 220px;
          padding: 12px;
        }

        .ss-column h3 {
          margin: 0 0 10px;
          font-size: 14px;
          color: #67e8f9;
          text-align: center;
        }

        .ss-card {
          background: #172554;
          border: 1px solid #38bdf8;
          border-radius: 10px;
          padding: 10px;
          margin: 8px 0;
          cursor: grab;
          color: #eff6ff;
          box-shadow: 0 4px 10px rgba(0,0,0,0.25);
          font-size: 13px;
        }

        .ss-card:active {
          cursor: grabbing;
        }

        .ss-bank {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 16px;
          padding: 12px;
          border-radius: 12px;
          border: 1px dashed rgba(125, 211, 252, 0.5);
          background: rgba(8, 47, 73, 0.35);
          min-height: 70px;
        }

        .ss-bank .ss-card {
          width: 175px;
          margin: 0;
        }

        .ss-timeline {
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: rgba(15, 23, 42, 0.95);
          border-radius: 14px;
          border: 1px solid rgba(56, 189, 248, 0.35);
          padding: 14px;
        }

        .ss-timeline-slot {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          border-radius: 12px;
          background: rgba(30, 41, 59, 0.85);
          border: 1px solid rgba(148, 163, 184, 0.25);
        }

        .ss-number {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #0ea5e9;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
          flex-shrink: 0;
        }

        .ss-actions {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 16px 24px 22px;
          border-top: 1px solid rgba(56, 189, 248, 0.25);
        }

        .ss-btn {
          border: 1px solid #38bdf8;
          background: rgba(14, 165, 233, 0.12);
          color: #e0f2fe;
          padding: 10px 18px;
          border-radius: 10px;
          cursor: pointer;
          font-family: "Courier New", monospace;
          font-weight: bold;
        }

        .ss-btn:hover {
          background: rgba(14, 165, 233, 0.28);
        }

        .ss-btn.primary {
          border-color: #22c55e;
          color: #dcfce7;
          background: rgba(34, 197, 94, 0.18);
        }

        .ss-btn.danger {
          border-color: #f87171;
          color: #fee2e2;
          background: rgba(248, 113, 113, 0.12);
        }

        .ss-feedback {
          margin-top: 14px;
          padding: 12px;
          border-radius: 10px;
          background: rgba(250, 204, 21, 0.12);
          border: 1px solid rgba(250, 204, 21, 0.35);
          color: #fef9c3;
          display: none;
        }

        .ss-result-card {
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(34, 197, 94, 0.5);
          border-radius: 14px;
          padding: 16px;
          line-height: 1.6;
        }

        .ss-pill {
          display: inline-block;
          border: 1px solid rgba(125, 211, 252, 0.5);
          color: #bae6fd;
          border-radius: 999px;
          padding: 4px 10px;
          font-size: 12px;
          margin: 4px;
          background: rgba(14, 165, 233, 0.12);
        }
      </style>

      <div class="ss-modal">
        <div class="ss-header">
          <div>
            <div class="ss-title">SPRINT SUCCESS</div>
            <div class="ss-subtitle">Learn agile planning by building a real mini sprint.</div>
          </div>
          <div class="ss-step" id="ss-step-label"></div>
        </div>

        <div class="ss-body" id="ss-body"></div>

        <div class="ss-actions">
          <button class="ss-btn danger" id="ss-close">Close</button>
          <button class="ss-btn" id="ss-back">Back</button>
          <button class="ss-btn primary" id="ss-next">Next</button>
        </div>
      </div>
    `;

    document.body.appendChild(this.overlay);

    this.overlay.querySelector('#ss-close').onclick = () => this._close();
    this.overlay.querySelector('#ss-back').onclick = () => this._back();
    this.overlay.querySelector('#ss-next').onclick = () => this._next();

    this._showStep();
  }

  _showStep() {
    const body = this.overlay.querySelector('#ss-body');
    const stepLabel = this.overlay.querySelector('#ss-step-label');
    const backBtn = this.overlay.querySelector('#ss-back');
    const nextBtn = this.overlay.querySelector('#ss-next');

    backBtn.style.visibility = this.step === 0 ? 'hidden' : 'visible';

    const labels = [
      'Step 1 of 4 · Break the Problem',
      'Step 2 of 4 · Sprint Timeline',
      'Step 3 of 4 · Kanban Builder',
      'Step 4 of 4 · Sprint Summary',
    ];

    stepLabel.textContent = labels[this.step] ?? '';

    if (this.step === 0) {
      nextBtn.textContent = 'Check Breakdown';
      body.innerHTML = this._problemBreakdownHTML();
      this._wireDragAndDrop();
    }

    if (this.step === 1) {
      nextBtn.textContent = 'Lock Timeline';
      body.innerHTML = this._timelineHTML();
      this._wireTimelineControls();
    }

    if (this.step === 2) {
      nextBtn.textContent = 'Finish Sprint';
      body.innerHTML = this._kanbanHTML();
      this._wireDragAndDrop();
    }

    if (this.step === 3) {
      nextBtn.textContent = 'Save Result';
      body.innerHTML = this._summaryHTML();
    }
  }

  _problemBreakdownHTML() {
    return `
      <div class="ss-instructions">
        <strong>Mission:</strong> Your team wants to build a simple study app.
        Sort each task by size. Agile teams try to avoid goals that are too vague
        and tasks that are too tiny to be useful.
      </div>

      <div class="ss-bank ss-dropzone" data-zone="bank">
        ${this.tasks.map(task => `
          <div class="ss-card" draggable="true" data-id="${task.id}">
            ${task.text}
          </div>
        `).join('')}
      </div>

      <div class="ss-grid">
        <div class="ss-column ss-dropzone" data-zone="too-big">
          <h3>Too Big</h3>
        </div>

        <div class="ss-column ss-dropzone" data-zone="good">
          <h3>Good Sprint Task</h3>
        </div>

        <div class="ss-column ss-dropzone" data-zone="too-small">
          <h3>Too Small</h3>
        </div>
      </div>

      <div class="ss-feedback" id="ss-feedback"></div>
    `;
  }

  _timelineHTML() {
    const shuffled = [...this.timelineTasks].sort(() => Math.random() - 0.5);

    return `
      <div class="ss-instructions">
        <strong>Mission:</strong> Put the sprint activities in an order that makes sense.
        Use the up/down buttons to create a realistic sprint flow.
      </div>

      <div class="ss-timeline" id="ss-timeline">
        ${shuffled.map((task, index) => `
          <div class="ss-timeline-slot" data-task="${task}">
            <div class="ss-number">${index + 1}</div>
            <div style="flex:1">${task}</div>
            <button class="ss-btn ss-up" style="padding:5px 9px">↑</button>
            <button class="ss-btn ss-down" style="padding:5px 9px">↓</button>
          </div>
        `).join('')}
      </div>

      <div class="ss-feedback" id="ss-feedback"></div>
    `;
  }

  _kanbanHTML() {
    return `
      <div class="ss-instructions">
        <strong>Mission:</strong> Build your pseudo Kanban board.
        Put future work in Backlog, active work in In Progress, and completed work in Done.
        Try not to overload In Progress.
      </div>

      <div class="ss-bank ss-dropzone" data-zone="kanban-bank">
        ${this.timelineTasks.map((task, index) => `
          <div class="ss-card" draggable="true" data-id="k-${index}">
            ${task}
          </div>
        `).join('')}
      </div>

      <div class="ss-grid">
        <div class="ss-column ss-dropzone" data-zone="backlog">
          <h3>Backlog</h3>
        </div>

        <div class="ss-column ss-dropzone" data-zone="inProgress">
          <h3>In Progress</h3>
        </div>

        <div class="ss-column ss-dropzone" data-zone="done">
          <h3>Done</h3>
        </div>
      </div>

      <div class="ss-feedback" id="ss-feedback"></div>
    `;
  }

  _summaryHTML() {
    const decompositionScore = this._scoreDecomposition();
    const timelineScore = this._scoreTimeline();
    const kanbanScore = this._scoreKanban();

    const total = decompositionScore + timelineScore + kanbanScore;

    let profile = 'Emerging Planner';
    if (total >= 8) profile = 'Sprint Strategist';
    else if (total >= 6) profile = 'Agile Builder';

    return `
      <div class="ss-result-card">
        <h2 style="color:#86efac; margin-top:0;">Sprint Complete</h2>

        <p>
          You created a sprint plan by breaking down work, sequencing tasks,
          and building a Kanban board.
        </p>

        <p>
          <strong>Your Sprint Profile:</strong>
          <span class="ss-pill">${profile}</span>
        </p>

        <p>
          <strong>Skill Signals:</strong>
          <span class="ss-pill">Planning</span>
          <span class="ss-pill">Problem Decomposition</span>
          <span class="ss-pill">Prioritization</span>
          <span class="ss-pill">Execution Flow</span>
        </p>

        <p>
          <strong>Scores:</strong><br>
          Problem Breakdown: ${decompositionScore}/3<br>
          Timeline Planning: ${timelineScore}/3<br>
          Kanban Flow: ${kanbanScore}/3
        </p>

        <p>
          <strong>Next Action:</strong>
          Use this structure for your real project: choose one goal, break it into
          tasks, place tasks into Backlog/In Progress/Done, and keep your active work limited.
        </p>
      </div>
    `;
  }

  _wireDragAndDrop() {
    const cards = this.overlay.querySelectorAll('.ss-card');
    const zones = this.overlay.querySelectorAll('.ss-dropzone');

    cards.forEach(card => {
      card.addEventListener('dragstart', event => {
        event.dataTransfer.setData('text/plain', card.dataset.id);
      });
    });

    zones.forEach(zone => {
      zone.addEventListener('dragover', event => {
        event.preventDefault();
      });

      zone.addEventListener('drop', event => {
        event.preventDefault();

        const id = event.dataTransfer.getData('text/plain');
        const card = this.overlay.querySelector(`[data-id="${id}"]`);

        if (card) {
          zone.appendChild(card);
        }
      });
    });
  }

  _wireTimelineControls() {
    const timeline = this.overlay.querySelector('#ss-timeline');

    timeline.querySelectorAll('.ss-up').forEach(btn => {
      btn.onclick = () => {
        const item = btn.closest('.ss-timeline-slot');
        const prev = item.previousElementSibling;
        if (prev) timeline.insertBefore(item, prev);
        this._renumberTimeline();
      };
    });

    timeline.querySelectorAll('.ss-down').forEach(btn => {
      btn.onclick = () => {
        const item = btn.closest('.ss-timeline-slot');
        const next = item.nextElementSibling;
        if (next) timeline.insertBefore(next, item);
        this._renumberTimeline();
      };
    });
  }

  _renumberTimeline() {
    this.overlay.querySelectorAll('.ss-timeline-slot').forEach((slot, index) => {
      slot.querySelector('.ss-number').textContent = index + 1;
    });
  }

  _next() {
    if (this.step === 0) {
      const score = this._scoreDecomposition();
      const feedback = this.overlay.querySelector('#ss-feedback');

      if (score < 2) {
        feedback.style.display = 'block';
        feedback.textContent =
          'Try again: Sprint tasks should be clear, useful, and not too huge or too tiny.';
        return;
      }
    }

    if (this.step === 1) {
      const score = this._scoreTimeline();
      const feedback = this.overlay.querySelector('#ss-feedback');

      if (score < 2) {
        feedback.style.display = 'block';
        feedback.textContent =
          'Try again: Think about what needs to happen before building, testing, and improving.';
        return;
      }
    }

    if (this.step === 2) {
      const score = this._scoreKanban();
      const feedback = this.overlay.querySelector('#ss-feedback');

      if (score < 2) {
        feedback.style.display = 'block';
        feedback.textContent =
          'Try again: A strong Kanban board has future work in Backlog, active work in In Progress, and completed/review work in Done.';
        return;
      }
    }

    if (this.step === 3) {
      const result = this._buildResult();
      this.onComplete?.(result);
      this._close(false);
      return;
    }

    this.step += 1;
    this._showStep();
  }

  _back() {
    if (this.step > 0) {
      this.step -= 1;
      this._showStep();
    }
  }

  _scoreDecomposition() {
    let correct = 0;

    this.tasks.forEach(task => {
      const card = this.overlay.querySelector(`[data-id="${task.id}"]`);
      const zone = card?.closest('.ss-dropzone')?.dataset.zone;

      if (zone === task.type) correct += 1;
    });

    if (correct >= 5) return 3;
    if (correct >= 4) return 2;
    if (correct >= 2) return 1;
    return 0;
  }

  _scoreTimeline() {
    const correctOrder = this.timelineTasks;
    const currentOrder = [...this.overlay.querySelectorAll('.ss-timeline-slot')]
      .map(slot => slot.dataset.task);

    let correct = 0;

    currentOrder.forEach((task, index) => {
      if (task === correctOrder[index]) correct += 1;
    });

    if (correct >= 4) return 3;
    if (correct >= 3) return 2;
    if (correct >= 2) return 1;
    return 0;
  }

  _scoreKanban() {
    const backlogCount = this.overlay.querySelector('[data-zone="backlog"]')?.querySelectorAll('.ss-card').length ?? 0;
    const inProgressCount = this.overlay.querySelector('[data-zone="inProgress"]')?.querySelectorAll('.ss-card').length ?? 0;
    const doneCount = this.overlay.querySelector('[data-zone="done"]')?.querySelectorAll('.ss-card').length ?? 0;

    let score = 0;

    if (backlogCount >= 1) score += 1;
    if (inProgressCount >= 1 && inProgressCount <= 2) score += 1;
    if (doneCount >= 1) score += 1;

    return score;
  }

  _buildResult() {
    const decompositionScore = this._scoreDecomposition();
    const timelineScore = this._scoreTimeline();
    const kanbanScore = this._scoreKanban();
    const total = decompositionScore + timelineScore + kanbanScore;

    let title = 'Emerging Planner';
    if (total >= 8) title = 'Sprint Strategist';
    else if (total >= 6) title = 'Agile Builder';

    return {
      title,
      summary:
        'Completed Sprint Success by breaking down a goal, creating a sprint timeline, and building a pseudo Kanban board.',
      scores: {
        problemBreakdown: decompositionScore,
        sprintTimeline: timelineScore,
        kanbanFlow: kanbanScore,
        total,
      },
      skills: {
        planning: Math.min(6, 2 + timelineScore),
        problem_solving: Math.min(6, 2 + decompositionScore),
        initiative: Math.min(6, 2 + kanbanScore),
        collaboration: Math.min(6, 2 + Math.round(total / 3)),
      },
      completedAt: new Date().toISOString(),
    };
  }

  _close(callCallback = true) {
    this.overlay?.remove();
    this.overlay = null;

    if (callCallback) {
      this.onClose?.();
    }
  }
}