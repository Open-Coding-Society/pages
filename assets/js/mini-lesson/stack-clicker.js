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
  autoPushPerSecond: 0,
  processRate: 1,
  processRatePerSecond: 0,
  overflowPenaltyRatio: 0.25,
  autoPushSecondBuffer: 0,
  processSecondBuffer: 0,
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
    id: 'schedulerClock',
    category: 'main',
    name: 'Scheduler Clock',
    description: '+1 automatic push per second. Adds steady call pressure over time.',
    baseCost: 95,
    purchases: 0,
    apply() {
      state.autoPushPerSecond += 1;
    }
  },
  {
    id: 'pipelinePacer',
    category: 'main',
    name: 'Pipeline Pacer',
    description: '+1 frame processed per second. Smooths stack unwinding continuously.',
    baseCost: 105,
    purchases: 0,
    apply() {
      state.processRatePerSecond += 1;
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
const meterEl = meterFillEl?.parentElement;
const meterWrapEl = document.getElementById('meterWrap');
const steamLayerEl = document.getElementById('steamLayer');
const tipTextEl = document.getElementById('tipText');
const pushBtn = document.getElementById('pushBtn');
const clickerStage = document.getElementById('clickerStage');
const burstLayer = document.getElementById('burstLayer');
const aiTutorBtn = document.getElementById('aiTutorBtn');
const leaderboardToggleBtn = document.getElementById('leaderboardToggleBtn');
const upgradeList = document.getElementById('upgradeList');
const tabMainUpgrades = document.getElementById('tabMainUpgrades');
const tabMultiplierUpgrades = document.getElementById('tabMultiplierUpgrades');
const logList = document.getElementById('logList');
const activeBurstParticles = [];
let burstRafId = null;
const EMBED_MESSAGE_SOURCE = 'stack-clicker-mini-lesson';
const scoreGameEnv = {
  stats: {
    knowledgePoints: 0,
    levelsCompleted: 0,
    sessionTime: 0,
    totalPowerUps: 0
  },
  scoreConfig: {
    counterVar: 'knowledgePoints',
    counterLabel: 'Knowledge Points',
    scoreVar: 'knowledgePoints'
  },
  game: {
    gameName: 'StackClicker'
  },
  initScoreManager() {
    if (this.scoreManager) {
      return Promise.resolve(this.scoreManager);
    }
    return import('/assets/js/GameEnginev1.1/essentials/GameEnvScore.js').then((module) => {
      const GameEnvScore = module.default || module;
      this.scoreManager = new GameEnvScore(this);
      return this.scoreManager;
    });
  }
};

const leaderboardControlBridge = {
  currentLevel: {
    gameEnv: scoreGameEnv
  },
  gameEnv: scoreGameEnv
};

leaderboardControlBridge.game = {
  getActiveControl: () => leaderboardControlBridge
};

const leaderboard = new Leaderboard(leaderboardControlBridge, {
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

function spawnSteamParticles(count, fillPercent) {
  if (!steamLayerEl || !meterEl) {
    return;
  }

  const meterWidth = meterEl.clientWidth || 0;
  const edgeX = (Math.max(0, Math.min(100, fillPercent)) / 100) * meterWidth;

  for (let i = 0; i < count; i += 1) {
    const particle = document.createElement('span');
    particle.className = 'steam-particle';
    const spawnX = Math.max(6, Math.min(meterWidth - 6, edgeX + (-10 + Math.random() * 20)));
    particle.style.setProperty('--x', `${spawnX}px`);
    particle.style.setProperty('--size', `${7 + Math.random() * 8}px`);
    particle.style.setProperty('--driftX', `${-10 + Math.random() * 20}px`);
    steamLayerEl.appendChild(particle);
    window.setTimeout(() => particle.remove(), 1200);
  }
}

function updateSteamEffects(fillPercent) {
  if (!meterWrapEl || !steamLayerEl) {
    return;
  }

  const nearLimit = fillPercent >= 82;
  const shakeActive = fillPercent > 0;
  const ampPx = 0.2 + (fillPercent / 100) * 3.4;
  const speedSeconds = Math.max(0.1, 0.42 - (fillPercent / 100) * 0.28);

  meterWrapEl.style.setProperty('--meter-shake-amp', `${ampPx.toFixed(2)}px`);
  meterWrapEl.style.setProperty('--meter-shake-speed', `${speedSeconds.toFixed(3)}s`);
  meterWrapEl.classList.toggle('stack-shaking', shakeActive);
  meterWrapEl.classList.toggle('near-limit', nearLimit);

  if (!nearLimit) {
    return;
  }

  const intensity = fillPercent >= 96 ? 3 : fillPercent >= 90 ? 2 : 1;
  if (Math.random() < 0.78) {
    spawnSteamParticles(intensity, fillPercent);
  }
}

function render() {
  state.maxKnowledgePoints = Math.max(state.maxKnowledgePoints, state.points);
  scoreGameEnv.stats.knowledgePoints = state.maxKnowledgePoints;
  scoreGameEnv.stats.levelsCompleted = state.overflowCount;
  scoreGameEnv.stats.totalPowerUps = upgrades.reduce((sum, upgrade) => sum + upgrade.purchases, 0);

  if (pointsEl) pointsEl.textContent = String(state.points);
  if (stackDepthEl) stackDepthEl.textContent = String(state.stackDepth);
  if (maxDepthEl) maxDepthEl.textContent = String(state.maxDepth);
  if (overflowCountEl) overflowCountEl.textContent = String(state.overflowCount);

  const fill = Math.min(100, (state.stackDepth / state.maxDepth) * 100);
  meterFillEl.style.width = `${fill}%`;
  updateSteamEffects(fill);

  updateLeaderboardKnowledgePreview();

  renderUpgradeTabs();
  renderUpgrades();
  postControlStateToParent();
}

function triggerButtonImpact() {
  pushBtn.classList.remove('impact');
  clickerStage.classList.remove('stage-shake');

  // Force reflow so repeated clicks retrigger CSS animations.
  void pushBtn.offsetWidth;

  pushBtn.classList.add('impact');
  clickerStage.classList.add('stage-shake');

  window.setTimeout(() => pushBtn.classList.remove('impact'), 140);
  window.setTimeout(() => clickerStage.classList.remove('stage-shake'), 240);
}

function spawnBurstSprites(event, burstPower = state.pushPower) {
  if (!burstLayer || !clickerStage) {
    return;
  }

  const stageRect = clickerStage.getBoundingClientRect();
  const btnRect = pushBtn.getBoundingClientRect();
  const centerX = (btnRect.left + btnRect.width / 2) - stageRect.left;
  const centerY = (btnRect.top + btnRect.height / 2) - stageRect.top;
  const particleCount = Math.max(1, Math.floor(burstPower));

  for (let i = 0; i < particleCount; i += 1) {
    const chip = document.createElement('div');
    chip.className = 'burst-chip';

    const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.35;
    const speed = 220 + Math.random() * 300;
    const size = 28 + Math.random() * 12;

    chip.style.width = `${size}px`;
    chip.style.height = `${size}px`;
    chip.style.left = `${centerX - size / 2}px`;
    chip.style.top = `${centerY - size / 2}px`;

    burstLayer.appendChild(chip);
    activeBurstParticles.push({
      el: chip,
      x: 0,
      y: 0,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 120,
      gravity: 880,
      rot: -35 + Math.random() * 70,
      spin: -180 + Math.random() * 360,
      age: 0,
      life: 900 + Math.random() * 300
    });
  }

  if (!burstRafId) {
    burstRafId = window.requestAnimationFrame(stepBurstParticles);
  }
}

function stepBurstParticles(timestamp) {
  if (!stepBurstParticles.lastTs) {
    stepBurstParticles.lastTs = timestamp;
  }

  const dt = Math.min(0.04, (timestamp - stepBurstParticles.lastTs) / 1000);
  stepBurstParticles.lastTs = timestamp;

  for (let i = activeBurstParticles.length - 1; i >= 0; i -= 1) {
    const p = activeBurstParticles[i];
    p.age += dt * 1000;

    p.vy += p.gravity * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.rot += p.spin * dt;

    const lifeRatio = p.age / p.life;
    const opacity = Math.max(0, 1 - lifeRatio * lifeRatio);
    p.el.style.opacity = opacity.toFixed(3);
    p.el.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.rot.toFixed(1)}deg)`;

    if (lifeRatio >= 1) {
      p.el.remove();
      activeBurstParticles.splice(i, 1);
    }
  }

  if (activeBurstParticles.length > 0) {
    burstRafId = window.requestAnimationFrame(stepBurstParticles);
    return;
  }

  burstRafId = null;
  stepBurstParticles.lastTs = 0;
}

function postControlStateToParent() {
  if (window.parent === window) {
    return;
  }

  window.parent.postMessage(
    {
      source: EMBED_MESSAGE_SOURCE,
      type: 'stack-clicker:controls-state',
      leaderboardLabel: leaderboardToggleBtn?.textContent || 'Show Leaderboard',
      aiLabel: aiTutorBtn?.textContent || 'Ask Stacky Box',
      leaderboardVisible: Boolean(leaderboard?.isVisible?.()),
      aiVisible: Boolean(rpnBox.dialogueSystem?.isDialogueOpen?.()),
      points: state.points,
      stackDepth: state.stackDepth,
      maxDepth: state.maxDepth,
      overflowCount: state.overflowCount
    },
    '*'
  );
}

tabMainUpgrades.addEventListener('click', () => {
  state.activeUpgradeTab = 'main';
  render();
});

tabMultiplierUpgrades.addEventListener('click', () => {
  state.activeUpgradeTab = 'multiplier';
  render();
});

pushBtn.addEventListener('click', (event) => {
  triggerButtonImpact();
  spawnBurstSprites(event, state.pushPower);

  state.stackDepth += state.pushPower;
  tipTextEl.textContent = `Pushed ${state.pushPower} frame(s). A call adds frames to the stack.`;
  maybeOverflow();
  render();
});

const setAiTutorButtonLabel = () => {
  const isOpen = Boolean(rpnBox.dialogueSystem?.isDialogueOpen?.());
  if (aiTutorBtn) {
    aiTutorBtn.textContent = isOpen ? 'Hide Stacky Box' : 'Ask Stacky Box';
  }
  postControlStateToParent();
};

const setLeaderboardButtonLabel = () => {
  const isVisible = Boolean(leaderboard?.isVisible?.());
  if (leaderboardToggleBtn) {
    leaderboardToggleBtn.textContent = isVisible ? 'Hide Leaderboard' : 'Show Leaderboard';
  }
  postControlStateToParent();
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

const refreshLeaderboardData = async () => {
  if (typeof leaderboard?.fetchLeaderboard !== 'function') {
    return;
  }

  try {
    await leaderboard.fetchLeaderboard();
  } catch (error) {
    console.error('Failed to refresh leaderboard:', error);
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
    if (state.maxKnowledgePoints <= 0) {
      addLog('Score not saved: earn some knowledge points first.');
      return;
    }

    const previousName = localStorage.getItem('stackClickerPlayerName') || '';
    const entered = window.prompt('Enter your name to save this run:', previousName || 'Player');
    const username = entered?.trim();

    if (!username) {
      return;
    }

    localStorage.setItem('stackClickerPlayerName', username);
    saveBtn.disabled = true;

    try {
      await leaderboard.submitScore(username, state.maxKnowledgePoints, 'StackClicker');
      addLog(`Leaderboard updated: ${username} saved ${state.maxKnowledgePoints} knowledge points.`);
      await refreshLeaderboardData();
    } catch (error) {
      console.error('Failed to save leaderboard score:', error);
      addLog('Could not save score to leaderboard. Try again.');
    } finally {
      saveBtn.disabled = false;
    }
  });
};

const pinLeaderboardToTopCorner = () => {
  const container = document.getElementById('leaderboard-container');
  if (!container) {
    return;
  }

  container.style.top = '12px';
  container.style.left = '12px';
  container.style.right = 'auto';
  container.style.zIndex = '1000';
};

const toggleAiTutor = () => {
  const isOpen = Boolean(rpnBox.dialogueSystem?.isDialogueOpen?.());
  if (isOpen) {
    rpnBox.dialogueSystem.closeDialogue();
    setAiTutorButtonLabel();
    return;
  }

  AiNpc.showInteraction(rpnBox);
  setAiTutorButtonLabel();
};

const toggleLeaderboard = () => {
  const wasVisible = Boolean(leaderboard?.isVisible?.());
  leaderboard.toggleVisibility();
  pinLeaderboardToTopCorner();

  const nowVisible = Boolean(leaderboard?.isVisible?.());
  if (nowVisible && !wasVisible) {
    const contentEl = document.getElementById('leaderboard-content');
    if (contentEl?.classList.contains('hidden')) {
      leaderboard.toggle();
    }

    wireLeaderboardSaveButton();
    refreshLeaderboardData();
  }

  setLeaderboardButtonLabel();
};

if (aiTutorBtn) {
  aiTutorBtn.addEventListener('click', toggleAiTutor);
}
if (leaderboardToggleBtn) {
  leaderboardToggleBtn.addEventListener('click', toggleLeaderboard);
}

window.addEventListener('message', (event) => {
  const data = event?.data;
  if (!data || data.source !== 'stack-clicker-embed') {
    return;
  }

  if (data.type === 'stack-clicker:toggle-ai') {
    toggleAiTutor();
    return;
  }

  if (data.type === 'stack-clicker:toggle-leaderboard') {
    toggleLeaderboard();
    return;
  }

  if (data.type === 'stack-clicker:get-controls-state') {
    setAiTutorButtonLabel();
    setLeaderboardButtonLabel();
  }
});

setInterval(() => {
  let tip = '';
  scoreGameEnv.stats.sessionTime += state.tickMs;
  const tickSeconds = state.tickMs / 1000;
  let totalAutoPushed = 0;
  let totalResolved = 0;

  if (state.autoPushPerFrame > 0) {
    triggerButtonImpact();
    spawnBurstSprites(undefined, state.autoPushPerFrame);

    state.stackDepth += state.autoPushPerFrame;
    totalAutoPushed += state.autoPushPerFrame;
    maybeOverflow();
  }

  if (state.autoPushPerSecond > 0) {
    state.autoPushSecondBuffer += state.autoPushPerSecond * tickSeconds;
    const secondPushes = Math.floor(state.autoPushSecondBuffer);

    if (secondPushes > 0) {
      triggerButtonImpact();
      spawnBurstSprites(undefined, secondPushes);
      state.autoPushSecondBuffer -= secondPushes;
      state.stackDepth += secondPushes;
      totalAutoPushed += secondPushes;
      maybeOverflow();
    }
  }

  if (totalAutoPushed > 0) {
    tip = `Auto-pushed ${totalAutoPushed} frame(s).`;
  }

  if (state.stackDepth > 0) {
    let resolved = Math.min(state.processRate, state.stackDepth);

    if (state.processRatePerSecond > 0) {
      state.processSecondBuffer += state.processRatePerSecond * tickSeconds;
      const secondResolved = Math.floor(state.processSecondBuffer);
      if (secondResolved > 0) {
        state.processSecondBuffer -= secondResolved;
        resolved += secondResolved;
      }
    }

    resolved = Math.min(resolved, state.stackDepth);
    state.stackDepth -= resolved;
    state.points += resolved;
    totalResolved += resolved;

    if (totalResolved > 0) {
      tip = tip
        ? `${tip} Returned ${totalResolved} frame(s).`
        : `Returned ${totalResolved} frame(s). Stack unwinds in LIFO order.`;
    }
  }

  if (tip) {
    tipTextEl.textContent = tip;
  }

  render();
}, state.tickMs);

addLog('Welcome. Click Push Function Call to grow the stack and earn points as frames return.');
setTimeout(pinLeaderboardToTopCorner, 0);
setTimeout(() => {
  wireLeaderboardSaveButton();
  refreshLeaderboardData();
}, 0);
setAiTutorButtonLabel();
setLeaderboardButtonLabel();
postControlStateToParent();
render();
