export class GameExecutor {
  constructor({
    getCode,
    updateStatus,
    runBtn,
    pauseBtn,
    stopBtn,
    fullscreenBtn,
    levelSelect,
    engineVersionSelect,
    getGameContainer,
    getGameOutput,
    configuredCanvasHeight = 580,
    path = '',
    getLevelOptionLabel = (levelClass, index) => levelClass?.name || `Level ${index + 1}`,
  } = {}) {
    this.getCode = getCode || (() => '');
    this.updateStatus = updateStatus || (() => {});
    this.runBtn = runBtn;
    this.pauseBtn = pauseBtn;
    this.stopBtn = stopBtn;
    this.fullscreenBtn = fullscreenBtn;
    this.levelSelect = levelSelect;
    this.engineVersionSelect = engineVersionSelect;
    this.getGameContainer = getGameContainer;
    this.getGameOutput = getGameOutput;
    this.configuredCanvasHeight = configuredCanvasHeight;
    this.path = path;
    this.getLevelOptionLabel = getLevelOptionLabel;

    this.gameCore = null;
    this.gameControl = null;
    this.gameStateMonitor = null;
    this.isFullscreen = false;
    this.fullscreenOverlay = null;
    this.originalGameOutput = null;
  }

  stop() {
    if (this._transitionTimer) {
      clearTimeout(this._transitionTimer);
      this._transitionTimer = null;
    }

    if (this.gameCore) {
      try {
        if (this.gameCore.destroy) {
          this.gameCore.destroy();
        }
      } catch (e) {
        console.warn('Error destroying game:', e);
      }
      this.gameCore = null;
      this.gameControl = null;
    }

    if (this.gameStateMonitor) {
      clearInterval(this.gameStateMonitor);
      this.gameStateMonitor = null;
    }

    const gameContainer = this.getGameContainer?.();
    if (gameContainer) {
      const canvases = gameContainer.querySelectorAll('canvas');
      canvases.forEach(c => c.remove());
    }

    this.updateStatus('Stopped');
    if (this.runBtn) this.runBtn.disabled = false;
    if (this.pauseBtn) this.pauseBtn.disabled = true;
    if (this.stopBtn) this.stopBtn.disabled = true;
    if (this.fullscreenBtn) this.fullscreenBtn.disabled = true;
    if (this.levelSelect) this.levelSelect.disabled = false;
  }

  togglePause() {
    if (!this.gameControl) return;

    const currentlyPaused = this.gameControl.isPaused;
    if (currentlyPaused) {
      if (this.gameControl.pauseFeature && typeof this.gameControl.pauseFeature.hide === 'function') {
        this.gameControl.pauseFeature.hide();
      } else if (this.gameControl.resume) {
        this.gameControl.resume();
      }
      this.updateStatus('Running');
    } else {
      if (this.gameControl.pauseFeature && typeof this.gameControl.pauseFeature.show === 'function') {
        this.gameControl.pauseFeature.show();
      } else if (this.gameControl.pause) {
        this.gameControl.pause();
      }
      this.updateStatus('Paused');
    }
  }

  populateLevelSelector(gameLevelClasses, preferredIndex = null) {
    if (!this.levelSelect) return;

    this.levelSelect.innerHTML = '<option value="">Select Level...</option>';
    for (let index = 0; index < gameLevelClasses.length; index++) {
      const levelClass = gameLevelClasses[index];
      const option = document.createElement('option');
      option.value = String(index);
      option.textContent = this.getLevelOptionLabel(levelClass, index);
      this.levelSelect.appendChild(option);
    }

    if (gameLevelClasses.length > 0) {
      const fallbackIndex = 0;
      const maxIndex = gameLevelClasses.length - 1;
      const hasPreferred = Number.isInteger(preferredIndex) && preferredIndex >= 0 && preferredIndex <= maxIndex;
      this.levelSelect.value = String(hasPreferred ? preferredIndex : fallbackIndex);
    }
    this.levelSelect.disabled = gameLevelClasses.length <= 1;
  }

  bindLevelSelector() {
    if (!this.levelSelect) return;

    this.levelSelect.addEventListener('change', () => {
      if (this.gameControl && this.levelSelect.value !== '') {
        const levelIndex = parseInt(this.levelSelect.value, 10);
        const label = this.levelSelect.options[this.levelSelect.selectedIndex].text;
        this._scheduleLevelTransition(levelIndex, label);
      }
    });
  }

  /**
   * Schedule level transition. Debounces rapid selector changes and performs a
   * full teardown before handing off to transitionToLevel, ensuring in-flight
   * async constructors from the previous level cannot inject objects into the
   * new level's environment.
   * @param {number} levelIndex - Zero-based index of the target level.
   * @param {string} label - Display name shown in the status bar after switching.
   * @private
   */
  _scheduleLevelTransition(levelIndex, label) {
    // Cancel any previously scheduled transition so rapid changes collapse into one.
    if (this._transitionTimer) {
      clearTimeout(this._transitionTimer);
      this._transitionTimer = null;
    }

    this.updateStatus('Loading...');
    this.levelSelect.disabled = true;

    this._transitionTimer = setTimeout(() => {
      this._transitionTimer = null;

      if (!this.gameControl?.transitionToLevel) {
        this.levelSelect.disabled = false;
        return;
      }

      // Force-destroy any game objects that survived the previous tear-down.
      // This catches objects whose async constructors completed after destroy()
      // was already called (e.g. image onload callbacks, ProfileManager promises).
      try {
        const env = this.gameControl.gameEnv || this.gameControl.currentLevel?.gameEnv;
        if (env) {
          const stale = env.gameObjects || [];
          for (let i = stale.length - 1; i >= 0; i--) {
            try { stale[i].destroy?.(); } catch (_) { /* ignore individual failures */ }
          }
          env.gameObjects = [];
        }
      } catch (e) {
        console.warn('GameExecutor: pre-transition cleanup error', e);
      }

      // Purge any orphaned canvases from the container DOM that destroy() may
      // have missed (e.g. canvas created after destroy was called).
      const gameContainer = this.getGameContainer?.();
      if (gameContainer) {
        gameContainer.querySelectorAll('canvas').forEach(c => c.remove());
      }

      this.gameControl.currentLevelIndex = levelIndex;
      this.gameControl.transitionToLevel();
      this.levelSelect.disabled = false;
      this.updateStatus('Switched to ' + label);
    }, 250);
  }

  async run() {
    try {
      // Save both the index AND the actual class reference so we can find it
      // in the freshly-imported gameLevelClasses after restart.  This handles
      // dynamically-spliced levels (e.g. Code Hub inserted by Wayfinding World)
      // whose original index no longer maps to the right class after a restart.
      const preservedLevelClass = (() => {
        const idx = this.gameControl?.currentLevelIndex;
        const classes = this.gameControl?.levelClasses;
        if (Number.isInteger(idx) && Array.isArray(classes) && idx >= 0 && idx < classes.length) {
          return classes[idx];
        }
        return null;
      })();

      const preservedLevelIndex = (() => {
        if (Number.isInteger(this.gameControl?.currentLevelIndex) && this.gameControl.currentLevelIndex >= 0) {
          return this.gameControl.currentLevelIndex;
        }

        if (!this.levelSelect || this.levelSelect.value === '') {
          return null;
        }

        const parsed = parseInt(this.levelSelect.value, 10);
        return Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
      })();

      this.stop();

      let code = this.getCode();
      if (!code.trim()) {
        this.updateStatus('Error: No code to run');
        return;
      }

      this.updateStatus('Loading...');
      if (this.runBtn) this.runBtn.disabled = true;
      if (this.pauseBtn) {
        this.pauseBtn.disabled = false;
        this.pauseBtn.textContent = '⏸ Pause';
        this.pauseBtn.title = 'Pause Game';
      }
      if (this.stopBtn) this.stopBtn.disabled = false;
      if (this.fullscreenBtn) this.fullscreenBtn.disabled = false;
      if (this.levelSelect) this.levelSelect.disabled = true;

      const gameContainer = this.getGameContainer?.();
      const path = this.path;
      const baseUrl = window.location.origin + path;
      const selectedVersion = this.engineVersionSelect ? this.engineVersionSelect.value : 'GameEnginev1';

      code = code.replace(/GameEnginev1(?:\.1)?/g, selectedVersion);
      code = code.replace(/from\s+['"]([^'"]+)['"]/g, (match, importPath) => {
        // Keep import-map aliases, relative paths, and explicit schemes untouched.
        if (
          importPath.startsWith('@') ||
          importPath.startsWith('./') ||
          importPath.startsWith('../') ||
          /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(importPath)
        ) {
          return match;
        }

        if (importPath.startsWith('/')) {
          return `from '${baseUrl}${importPath}'`;
        } else if (!importPath.startsWith('http://') && !importPath.startsWith('https://')) {
          return `from '${baseUrl}/${importPath}'`;
        }

        return `from '${baseUrl}/${importPath}'`;
      });

      const GameModule = await import(baseUrl + '/assets/js/' + selectedVersion + '/essentials/Game.js');
      const Game = GameModule.default;

      const blob = new Blob([code], { type: 'application/javascript' });
      const blobUrl = URL.createObjectURL(blob);

      try {
        const userModule = await import(blobUrl);
        const GameControl = userModule.GameControl;
        const gameLevelClasses = userModule.gameLevelClasses;

        if (!gameLevelClasses) {
          throw new Error('Code must export gameLevelClasses');
        }

        const containerWidth = gameContainer?.clientWidth || gameContainer?.parentElement?.clientWidth || 800;
        const containerHeight = this.configuredCanvasHeight;

        const environment = {
          path,
          gameContainer,
          gameLevelClasses,
          innerWidth: containerWidth,
          innerHeight: containerHeight,
          disablePauseMenu: true,
          disableContainerAdjustment: true
        };

        this.populateLevelSelector(gameLevelClasses, preservedLevelIndex);

        this.gameCore = Game.main(environment, GameControl);
        this.gameControl = this.gameCore?.gameControl || null;

        // Resolve the best level to restore to:
        // 1. If the preserved class exists in the permanent array, use its index there.
        // 2. If it was a dynamically-spliced level (e.g. Code Hub inserted by Wayfinding
        //    World at runtime), re-splice it back into levelClasses at its original
        //    position so the player returns exactly to that level after fullscreen toggle.
        let resolvedLevelIndex = preservedLevelIndex;
        if (preservedLevelClass && Array.isArray(gameLevelClasses)) {
          const classIndex = gameLevelClasses.indexOf(preservedLevelClass);
          if (classIndex >= 0) {
            // Class found in the permanent array — restore directly.
            resolvedLevelIndex = classIndex;
          } else if (Number.isInteger(preservedLevelIndex) && this.gameControl?.levelClasses) {
            // Dynamic level: re-splice the class back at its original position.
            // preservedLevelIndex is the index it held inside the runtime levelClasses
            // array (e.g. 2 for Code Hub after Wayfinding World spliced it in).
            const insertAt = Math.min(preservedLevelIndex, this.gameControl.levelClasses.length);
            this.gameControl.levelClasses.splice(insertAt, 0, preservedLevelClass);
            resolvedLevelIndex = insertAt;
          }
        }

        if (
          Number.isInteger(resolvedLevelIndex) &&
          this.gameControl &&
          resolvedLevelIndex !== this.gameControl.currentLevelIndex &&
          typeof this.gameControl.transitionToLevel === 'function'
        ) {
          this.gameControl.currentLevelIndex = resolvedLevelIndex;
          this.gameControl.transitionToLevel();
        }

        this.updateStatus('Running');

        this.gameStateMonitor = setInterval(() => {
          if (this.gameControl && this.gameControl.isPaused) {
            this.updateStatus('Paused');
          } else if (this.gameControl) {
            this.updateStatus('Running');
          }
        }, 200);
      } finally {
        URL.revokeObjectURL(blobUrl);
      }
    } catch (error) {
      this.updateStatus('Error: ' + error.message);
      console.error('Game error:', error);
      if (this.runBtn) this.runBtn.disabled = false;
      if (this.pauseBtn) this.pauseBtn.disabled = true;
      if (this.stopBtn) this.stopBtn.disabled = true;
      if (this.fullscreenBtn) this.fullscreenBtn.disabled = true;
      if (this.levelSelect) this.levelSelect.disabled = false;

      if (this.gameStateMonitor) {
        clearInterval(this.gameStateMonitor);
        this.gameStateMonitor = null;
      }
    }
  }

  _resizeGameForViewport(gameOutput, viewportHeight) {
    const currentLevel = this.gameControl?.currentLevel;
    const gameEnv = currentLevel?.gameEnv || this.gameControl?.gameEnv;
    const canvas = gameEnv?.canvas;

    if (!gameEnv || !canvas) {
      return;
    }

    const resolvedWidth = gameOutput?.parentElement?.clientWidth || gameOutput?.clientWidth || window.innerWidth;
    const resolvedHeight = Math.max(1, viewportHeight);

    if (this.gameCore?.environment) {
      this.gameCore.environment.innerWidth = resolvedWidth;
      this.gameCore.environment.innerHeight = resolvedHeight;
    }

    gameEnv.innerWidth = resolvedWidth;
    gameEnv.innerHeight = resolvedHeight;
    gameEnv.size();

    const gameObjects = Array.isArray(gameEnv.gameObjects) ? gameEnv.gameObjects : [];
    for (const gameObject of gameObjects) {
      if (gameObject && typeof gameObject.resize === 'function') {
        try {
          gameObject.resize();
        } catch (error) {
          console.warn('Failed to resize game object for fullscreen:', error);
        }
      }
    }
  }

  toggleFullscreen() {
    if (!this.getGameOutput) return;

    const gameOutput = this.getGameOutput();
    if (!gameOutput) return;

    if (!this.isFullscreen) {
      // Enter fullscreen mode
      this.originalGameOutput = {
        parent: gameOutput.parentElement,
        height: this.configuredCanvasHeight
      };

      // Create fullscreen overlay
      this.fullscreenOverlay = document.createElement('div');
      this.fullscreenOverlay.className = 'game-fullscreen-overlay';
      this.fullscreenOverlay.style.zIndex = '9999';

      // Create collapsible control panel header
      const controlHeader = document.createElement('div');
      controlHeader.className = 'fullscreen-control-header';
      controlHeader.style.position = 'relative';
      controlHeader.style.zIndex = '2';
      controlHeader.style.flexShrink = '0';

      // Add collapse toggle button
      const collapseBtn = document.createElement('button');
      collapseBtn.className = 'fullscreen-collapse-btn';
      collapseBtn.textContent = '▲';
      collapseBtn.title = 'Collapse Controls';

      const controlsContainer = document.createElement('div');
      controlsContainer.className = 'fullscreen-controls-container';
      controlsContainer.style.flexWrap = 'wrap';

      // Clone control buttons
      const clonedRunBtn = this.runBtn ? this.runBtn.cloneNode(true) : null;
      const clonedPauseBtn = this.pauseBtn ? this.pauseBtn.cloneNode(true) : null;
      const clonedStopBtn = this.stopBtn ? this.stopBtn.cloneNode(true) : null;
      const clonedFullscreenBtn = this.fullscreenBtn ? this.fullscreenBtn.cloneNode(true) : null;
      const clonedEngineSelect = this.engineVersionSelect ? this.engineVersionSelect.cloneNode(true) : null;
      const clonedLevelSelect = this.levelSelect ? this.levelSelect.cloneNode(true) : null;

      // Add event listeners to cloned buttons to trigger original buttons
      if (clonedRunBtn) {
        clonedRunBtn.addEventListener('click', () => this.runBtn?.click());
        controlsContainer.appendChild(clonedRunBtn);
      }
      if (clonedPauseBtn) {
        clonedPauseBtn.addEventListener('click', () => this.pauseBtn?.click());
        controlsContainer.appendChild(clonedPauseBtn);
      }
      if (clonedStopBtn) {
        clonedStopBtn.addEventListener('click', () => this.stopBtn?.click());
        controlsContainer.appendChild(clonedStopBtn);
      }
      if (clonedFullscreenBtn) {
        clonedFullscreenBtn.addEventListener('click', () => this.fullscreenBtn?.click());
        controlsContainer.appendChild(clonedFullscreenBtn);
      }

      // Add event listeners to cloned selects to sync with originals
      if (clonedEngineSelect && this.engineVersionSelect) {
        clonedEngineSelect.addEventListener('change', () => {
          this.engineVersionSelect.value = clonedEngineSelect.value;
          // Trigger change event on original
          this.engineVersionSelect.dispatchEvent(new Event('change'));
        });
        controlsContainer.appendChild(clonedEngineSelect);
      }
      if (clonedLevelSelect && this.levelSelect) {
        clonedLevelSelect.addEventListener('change', () => {
          this.levelSelect.value = clonedLevelSelect.value;
          // Trigger change event on original
          this.levelSelect.dispatchEvent(new Event('change'));
        });
        controlsContainer.appendChild(clonedLevelSelect);
      }

      // Collapse/expand functionality
      let isCollapsed = false;
      collapseBtn.addEventListener('click', () => {
        isCollapsed = !isCollapsed;
        if (isCollapsed) {
          controlsContainer.classList.add('collapsed');
          controlHeader.classList.add('collapsed');
          collapseBtn.textContent = '▼';
          collapseBtn.title = 'Expand Controls';
        } else {
          controlsContainer.classList.remove('collapsed');
          controlHeader.classList.remove('collapsed');
          collapseBtn.textContent = '▲';
          collapseBtn.title = 'Collapse Controls';
        }
      });

      // Add title
      const title = document.createElement('span');
      title.className = 'fullscreen-title';
      title.textContent = 'Game Controls';

      controlHeader.appendChild(collapseBtn);
      controlHeader.appendChild(title);
      controlHeader.appendChild(controlsContainer);

      // Assemble fullscreen overlay
      this.fullscreenOverlay.appendChild(controlHeader);
      this.fullscreenOverlay.appendChild(gameOutput);
      gameOutput.style.position = 'relative';
      gameOutput.style.flex = '1 1 auto';
      gameOutput.style.minHeight = '0';
      gameOutput.style.width = '100%';
      gameOutput.style.zIndex = '1';
      document.body.appendChild(this.fullscreenOverlay);

      // Update canvas height to account for control header
      const headerHeight = controlHeader.offsetHeight || 60;
      const viewportHeight = window.innerHeight - headerHeight - 20; // Leave some padding
      this.configuredCanvasHeight = viewportHeight;

      // Update button text
      if (this.fullscreenBtn) {
        this.fullscreenBtn.textContent = '⛶ Minimize';
        this.fullscreenBtn.title = 'Exit Fullscreen';
      }

      this.isFullscreen = true;

      // Resize the active level in place so fullscreen does not replay startup dialogue.
      this._resizeGameForViewport(gameOutput, viewportHeight);

      // Handle ESC key to exit fullscreen
      this.escapeHandler = (e) => {
        if (e.key === 'Escape' && this.isFullscreen) {
          this.toggleFullscreen();
        }
      };
      document.addEventListener('keydown', this.escapeHandler);

    } else {
      // Exit fullscreen mode
      if (this.fullscreenOverlay) {
        // Move game-output back to original parent
        if (this.originalGameOutput && this.originalGameOutput.parent) {
          this.originalGameOutput.parent.appendChild(gameOutput);
        }

        // Remove overlay
        this.fullscreenOverlay.remove();
        this.fullscreenOverlay = null;
      }

      // Restore original height
      if (this.originalGameOutput) {
        this.configuredCanvasHeight = this.originalGameOutput.height;
        this.originalGameOutput = null;
      }

      // Update button text
      if (this.fullscreenBtn) {
        this.fullscreenBtn.textContent = '⛶ Fullscreen';
        this.fullscreenBtn.title = 'Enter Fullscreen';
      }

      this.isFullscreen = false;

      // Remove ESC key handler
      if (this.escapeHandler) {
        document.removeEventListener('keydown', this.escapeHandler);
        this.escapeHandler = null;
      }

      // Restore the active level size without reinitializing the level.
      this._resizeGameForViewport(gameOutput, this.originalGameOutput?.height || this.configuredCanvasHeight);
    }
  }
}

export default GameExecutor;
