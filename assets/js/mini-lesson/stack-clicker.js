import { AiNpc, Leaderboard } from '/assets/js/GameEnginev1.1/essentials/Imports.js';

const state = {
  points: 0,
  maxKnowledgePoints: 0,
  stackDepth: 0,
  maxDepth: 32,
  overflowCount: 0,
  activeUpgradeTab: 'main',
  pushPower: 1,
  autoPushPerFrame: 0,
  processRate: 1,
  overflowPenaltyRatio: 0.25,
  upgradeMultipliers: {
    pushPower: 1,
    processRate: 1,
    autoPushPerFrame: 1,
    maxDepth: 1,
    overflowReduction: 1
  },
  tickMs: 450
};

const upgrades = [
  {
    id: 'frames101',
    category: 'main',
    name: 'Stack Frames 101',
    description: '+1 frame per click. Learn that each call adds a frame.',
    baseCost: 25,
    purchases: 0,
    apply() {
      state.pushPower += scaledGain(1, state.upgradeMultipliers.pushPower);
    }
  },
  {
    id: 'lifoDrills',
    category: 'main',
    name: 'LIFO Drills',
    description: '+1 frame processed per tick. Last In, First Out in action.',
    baseCost: 50,
    purchases: 0,
    apply() {
      state.processRate += scaledGain(1, state.upgradeMultipliers.processRate);
    }
  },
  {
    id: 'backgroundCalls',
    category: 'main',
    name: 'Background Calls',
    description: '+1 automatic push per frame. Calls stack up on their own.',
    baseCost: 70,
    purchases: 0,
    apply() {
      state.autoPushPerFrame += scaledGain(1, state.upgradeMultipliers.autoPushPerFrame);
    }
  },
  {
    id: 'guardClauses',
    category: 'main',
    name: 'Guard Clauses',
    description: '+20 stack capacity. Prevent runaway recursion sooner.',
    baseCost: 90,
    purchases: 0,
    apply() {
      state.maxDepth += scaledGain(20, state.upgradeMultipliers.maxDepth);
    }
  },
  {
    id: 'recursionProfiler',
    category: 'main',
    name: 'Recursion Profiler',
    description: 'Reduce overflow penalty by 5%. Understand stack overflow costs.',
    baseCost: 140,
    purchases: 0,
    apply() {
      const reduction = 0.05 * state.upgradeMultipliers.overflowReduction;
      state.overflowPenaltyRatio = Math.max(0.01, state.overflowPenaltyRatio - reduction);
    }
  },
  {
    id: 'frameTuning',
    category: 'multiplier',
    name: 'Frame Tuning',
    description: 'Boost Stack Frames 101 strength by +25%.',
    baseCost: 85,
    purchases: 0,
    apply() {
      state.upgradeMultipliers.pushPower += 0.25;
    }
  },
  {
    id: 'unwindOptimizer',
    category: 'multiplier',
    name: 'Unwind Optimizer',
    description: 'Boost LIFO Drills strength by +25%.',
    baseCost: 110,
    purchases: 0,
    apply() {
      state.upgradeMultipliers.processRate += 0.25;
    }
  },
  {
    id: 'eventLoopThreads',
    category: 'multiplier',
    name: 'Event Loop Threads',
    description: 'Boost Background Calls strength by +25%.',
    baseCost: 130,
    purchases: 0,
    apply() {
      state.upgradeMultipliers.autoPushPerFrame += 0.25;
    }
  },
  {
    id: 'allocatorPattern',
    category: 'multiplier',
    name: 'Allocator Pattern',
    description: 'Boost Guard Clauses strength by +25%.',
    baseCost: 150,
    purchases: 0,
    apply() {
      state.upgradeMultipliers.maxDepth += 0.25;
    }
  },
  {
    id: 'riskModeling',
    category: 'multiplier',
    name: 'Risk Modeling',
    description: 'Boost Recursion Profiler strength by +25%.',
    baseCost: 175,
    purchases: 0,
    apply() {
      state.upgradeMultipliers.overflowReduction += 0.25;
    }
  }
];

const pointsEl = document.getElementById('points');
const stackDepthEl = document.getElementById('stackDepth');
const maxDepthEl = document.getElementById('maxDepth');
const overflowCountEl = document.getElementById('overflowCount');
const meterFillEl = document.getElementById('meterFill');
const tipTextEl = document.getElementById('tipText');
const pushBtn = document.getElementById('pushBtn');
const aiTutorBtn = document.getElementById('aiTutorBtn');
const leaderboardToggleBtn = document.getElementById('leaderboardToggleBtn');
const upgradeList = document.getElementById('upgradeList');
const tabMainUpgrades = document.getElementById('tabMainUpgrades');
const tabMultiplierUpgrades = document.getElementById('tabMultiplierUpgrades');
const logList = document.getElementById('logList');
const leaderboard = new Leaderboard(null, {
  gameName: 'StackClicker',
  initiallyHidden: true
});

const rpnBox = {
  id: 'Stacky Box',
  src: '/images/boxSprite.png',
  greeting: "Hey! I'm Stacky Box. Ask me about stacks, tokenizing, postfix notation, or overflow.",
  expertise: 'rpn',
  chatHistory: [],
  dialogues: [
    'Ask me how infix expressions are converted to postfix with Shunting Yard.',
    'Want to trace an RPN expression step by step with a stack?',
    'Try asking how stack overflow happens and how to reduce it.'
  ],
  knowledgeBase: {
    rpn: [
      {
        question: 'What is Reverse Polish Notation?',
        answer: 'RPN is postfix notation where operators come after operands, like 3 4 +.'
      },
      {
        question: 'How do you evaluate RPN?',
        answer: 'Read left to right: push numbers onto a stack, then pop operands when an operator appears, compute, and push the result.'
      },
      {
        question: 'How does this game model stacks?',
        answer: 'Push adds call frames, processing returns frames in LIFO order, and overflow happens when depth exceeds max capacity.'
      }
    ]
  },
  reaction: function() {
    if (this.dialogueSystem) {
      this.showReactionDialogue();
    } else {
      console.log(this.greeting);
    }
  },
  interact: function() {
    AiNpc.showInteraction(this);
  }
};

rpnBox.spriteData = rpnBox;

function scaledGain(base, multiplier) {
  return Math.max(1, Math.floor(base * multiplier));
}

function addLog(text) {
  const li = document.createElement('li');
  li.textContent = text;
  logList.prepend(li);
  if (logList.children.length > 18) {
    logList.removeChild(logList.lastChild);
  }
}

function upgradeCost(upgrade) {
  return Math.floor(upgrade.baseCost * Math.pow(1.45, upgrade.purchases));
}

function maybeOverflow() {
  if (state.stackDepth <= state.maxDepth) {
    return;
  }

  state.maxKnowledgePoints = Math.max(state.maxKnowledgePoints, state.points);

  state.overflowCount += 1;
  const penalty = Math.floor(state.points * state.overflowPenaltyRatio);
  state.points = Math.max(0, state.points - penalty);
  state.stackDepth = Math.floor(state.maxDepth * 0.45);

  tipTextEl.textContent = 'Overflow! Too many calls were pushed before enough frames returned.';
  addLog('Stack Overflow: stack exceeded capacity, points were lost due to crash recovery.');
}

function renderUpgrades() {
  upgradeList.innerHTML = '';

  const visibleUpgrades = upgrades.filter((upgrade) => upgrade.category === state.activeUpgradeTab);
  for (const upgrade of visibleUpgrades) {
    const cost = upgradeCost(upgrade);
    const card = document.createElement('article');
    card.className = 'upgrade';

    const title = document.createElement('h3');
    title.textContent = `${upgrade.name} (Lv ${upgrade.purchases})`;

    const desc = document.createElement('p');
    desc.textContent = upgrade.description;

    const btn = document.createElement('button');
    btn.textContent = `Buy - ${cost} points`;
    btn.disabled = state.points < cost;

    btn.addEventListener('click', () => {
      if (state.points < cost) {
        return;
      }

      state.points -= cost;
      upgrade.purchases += 1;
      upgrade.apply();
      addLog(`Upgrade purchased: ${upgrade.name}.`);
      render();
    });

    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(btn);
    upgradeList.appendChild(card);
  }
}

function renderUpgradeTabs() {
  const isMain = state.activeUpgradeTab === 'main';
  tabMainUpgrades.classList.toggle('active', isMain);
  tabMultiplierUpgrades.classList.toggle('active', !isMain);
  tabMainUpgrades.setAttribute('aria-selected', String(isMain));
  tabMultiplierUpgrades.setAttribute('aria-selected', String(!isMain));
}

function render() {
  state.maxKnowledgePoints = Math.max(state.maxKnowledgePoints, state.points);

  pointsEl.textContent = String(state.points);
  stackDepthEl.textContent = String(state.stackDepth);
  maxDepthEl.textContent = String(state.maxDepth);
  overflowCountEl.textContent = String(state.overflowCount);

  const fill = Math.min(100, (state.stackDepth / state.maxDepth) * 100);
  meterFillEl.style.width = `${fill}%`;

  updateLeaderboardKnowledgePreview();

  renderUpgradeTabs();
  renderUpgrades();
}

tabMainUpgrades.addEventListener('click', () => {
  state.activeUpgradeTab = 'main';
  render();
});

tabMultiplierUpgrades.addEventListener('click', () => {
  state.activeUpgradeTab = 'multiplier';
  render();
});

pushBtn.addEventListener('click', () => {
  state.stackDepth += state.pushPower;
  tipTextEl.textContent = `Pushed ${state.pushPower} frame(s). A call adds frames to the stack.`;
  maybeOverflow();
  render();
});

const setAiTutorButtonLabel = () => {
  const isOpen = Boolean(rpnBox.dialogueSystem?.isDialogueOpen?.());
  aiTutorBtn.textContent = isOpen ? 'Hide Stacky Box' : 'Ask Stacky Box';
};

const setLeaderboardButtonLabel = () => {
  const isVisible = Boolean(leaderboard?.isVisible?.());
  leaderboardToggleBtn.textContent = isVisible ? 'Hide Leaderboard' : 'Show Leaderboard';
};

const updateLeaderboardKnowledgePreview = () => {
  const currentScoreEl = document.getElementById('leaderboard-current-score');
  if (currentScoreEl) {
    currentScoreEl.textContent = `Knowledge Points: ${state.maxKnowledgePoints.toLocaleString()}`;
  }

  const previewEl = document.getElementById('leaderboard-preview');
  if (previewEl) {
    previewEl.textContent = `Knowledge Points: ${state.maxKnowledgePoints.toLocaleString()}`;
  }
};

const wireLeaderboardSaveButton = () => {
  const originalSaveBtn = document.getElementById('leaderboard-save-score');
  if (!originalSaveBtn || originalSaveBtn.dataset.stackClickerBound === 'true') {
    return;
  }

  const saveBtn = originalSaveBtn.cloneNode(true);
  saveBtn.dataset.stackClickerBound = 'true';
  originalSaveBtn.replaceWith(saveBtn);

  saveBtn.addEventListener('click', async () => {
    const previousName = localStorage.getItem('stackClickerPlayerName') || '';
    const entered = window.prompt('Enter your name to save this score:', previousName || 'Player');
    const username = entered?.trim();

    if (!username) {
      return;
    }

    localStorage.setItem('stackClickerPlayerName', username);
    saveBtn.disabled = true;

    try {
      await leaderboard.submitScore(username, state.maxKnowledgePoints, 'StackClicker');
      addLog(`Leaderboard updated: ${username} saved ${state.maxKnowledgePoints} knowledge points.`);
    } catch (error) {
      console.error('Failed to save leaderboard score:', error);
      addLog('Could not save score to leaderboard. Try again.');
    } finally {
      saveBtn.disabled = false;
    }
  });
};

aiTutorBtn.addEventListener('click', () => {
  const isOpen = Boolean(rpnBox.dialogueSystem?.isDialogueOpen?.());
  if (isOpen) {
    rpnBox.dialogueSystem.closeDialogue();
    setAiTutorButtonLabel();
    return;
  }

  AiNpc.showInteraction(rpnBox);
  setAiTutorButtonLabel();
});

leaderboardToggleBtn.addEventListener('click', () => {
  leaderboard.toggleVisibility();
  setLeaderboardButtonLabel();
});

setInterval(() => {
  let tip = '';

  if (state.autoPushPerFrame > 0) {
    state.stackDepth += state.autoPushPerFrame;
    tip = `Auto-pushed ${state.autoPushPerFrame} frame(s).`;
    maybeOverflow();
  }

  if (state.stackDepth > 0) {
    const resolved = Math.min(state.processRate, state.stackDepth);
    state.stackDepth -= resolved;
    state.points += resolved;

    if (resolved > 0) {
      tip = tip
        ? `${tip} Returned ${resolved} frame(s).`
        : `Returned ${resolved} frame(s). Stack unwinds in LIFO order.`;
    }
  }

  if (tip) {
    tipTextEl.textContent = tip;
  }

  render();
}, state.tickMs);

addLog('Welcome. Click Push Function Call to grow the stack and earn points as frames return.');
wireLeaderboardSaveButton();
setAiTutorButtonLabel();
setLeaderboardButtonLabel();
render();
