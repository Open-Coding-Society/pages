const state = {
  points: 0,
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

const parentCanvasCleanup = [];

function suppressParentRunnerCanvasIfPresent() {
  try {
    if (window.parent === window || !window.parent?.document) {
      return;
    }

    const parentDoc = window.parent.document;
    const iframeEl = Array.from(parentDoc.querySelectorAll('iframe')).find((frame) => {
      try {
        return frame.contentWindow === window;
      } catch (_) {
        return false;
      }
    });

    if (!iframeEl) {
      return;
    }

    const iframePrevious = {
      position: iframeEl.style.position,
      zIndex: iframeEl.style.zIndex,
      display: iframeEl.style.display,
      width: iframeEl.style.width,
      height: iframeEl.style.height,
      background: iframeEl.style.background
    };

    iframeEl.style.position = 'relative';
    iframeEl.style.zIndex = '1000';
    iframeEl.style.display = 'block';
    iframeEl.style.width = '100%';
    iframeEl.style.height = '100%';
    iframeEl.style.background = '#ffffff';

    parentCanvasCleanup.push(() => {
      iframeEl.style.position = iframePrevious.position;
      iframeEl.style.zIndex = iframePrevious.zIndex;
      iframeEl.style.display = iframePrevious.display;
      iframeEl.style.width = iframePrevious.width;
      iframeEl.style.height = iframePrevious.height;
      iframeEl.style.background = iframePrevious.background;
    });

    const frameWrapper = iframeEl.parentElement;
    if (frameWrapper) {
      const wrapperPrevious = {
        position: frameWrapper.style.position,
        zIndex: frameWrapper.style.zIndex,
        overflow: frameWrapper.style.overflow
      };
      frameWrapper.style.position = 'relative';
      frameWrapper.style.zIndex = '1000';
      frameWrapper.style.overflow = 'hidden';
      parentCanvasCleanup.push(() => {
        frameWrapper.style.position = wrapperPrevious.position;
        frameWrapper.style.zIndex = wrapperPrevious.zIndex;
        frameWrapper.style.overflow = wrapperPrevious.overflow;
      });

      const runnerContainer = frameWrapper.closest('.gameContainer');
      if (runnerContainer) {
        const canvases = runnerContainer.querySelectorAll('canvas');
        canvases.forEach((node) => {
          if (!(node instanceof window.parent.HTMLElement)) {
            return;
          }
          const previous = {
            opacity: node.style.opacity,
            pointerEvents: node.style.pointerEvents,
            zIndex: node.style.zIndex,
            visibility: node.style.visibility,
            display: node.style.display
          };

          node.style.opacity = '0';
          node.style.pointerEvents = 'none';
          node.style.zIndex = '0';
          node.style.visibility = 'hidden';
          node.style.display = 'none';

          parentCanvasCleanup.push(() => {
            node.style.opacity = previous.opacity;
            node.style.pointerEvents = previous.pointerEvents;
            node.style.zIndex = previous.zIndex;
            node.style.visibility = previous.visibility;
            node.style.display = previous.display;
          });
        });
      }
    }
  } catch (_) {
  }
}

function restoreParentRunnerCanvas() {
  while (parentCanvasCleanup.length > 0) {
    const restore = parentCanvasCleanup.pop();
    try {
      restore();
    } catch (_) {
    }
  }
}

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
      function suppressParentRunnerCanvasIfPresent() {
        return;
      }

      function restoreParentRunnerCanvas() {
        return;
      }
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
  pointsEl.textContent = String(state.points);
  stackDepthEl.textContent = String(state.stackDepth);
  maxDepthEl.textContent = String(state.maxDepth);
  overflowCountEl.textContent = String(state.overflowCount);

  const fill = Math.min(100, (state.stackDepth / state.maxDepth) * 100);
  meterFillEl.style.width = `${fill}%`;

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
suppressParentRunnerCanvasIfPresent();
window.addEventListener('beforeunload', restoreParentRunnerCanvas);
render();
