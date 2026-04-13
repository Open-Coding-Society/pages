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

  populateLevelSelector(gameLevelClasses) {
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
      this.levelSelect.value = '0';
    }
    this.levelSelect.disabled = gameLevelClasses.length <= 1;
  }

  bindLevelSelector() {
    if (!this.levelSelect) return;

    this.levelSelect.addEventListener('change', () => {
      if (this.gameControl && this.levelSelect.value !== '') {
        const levelIndex = parseInt(this.levelSelect.value, 10);
        if (this.gameControl.transitionToLevel) {
          this.gameControl.currentLevelIndex = levelIndex;
          this.gameControl.transitionToLevel();
          this.updateStatus('Switched to ' + this.levelSelect.options[this.levelSelect.selectedIndex].text);
        }
      }
    });
  }

  async run() {
    try {
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
      code = code.replace(/from\s+['"](\/?[^'"]+)['"]/g, (match, importPath) => {
        if (importPath.startsWith('/')) {
          return `from '${baseUrl}${importPath}'`;
        } else if (!importPath.startsWith('http://') && !importPath.startsWith('https://')) {
          return `from '${baseUrl}/${importPath}'`;
        }
        return match;
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

        this.populateLevelSelector(gameLevelClasses);

        this.gameCore = Game.main(environment, GameControl);
        this.gameControl = this.gameCore?.gameControl || null;
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
      this.fullscreenOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.95);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        overflow: auto;
      `;

      // Create collapsible control panel header
      const controlHeader = document.createElement('div');
      controlHeader.className = 'fullscreen-control-header';
      controlHeader.style.cssText = `
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        padding: 0.75rem 1.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        transition: all 0.3s ease;
      `;

      // Add collapse toggle button
      const collapseBtn = document.createElement('button');
      collapseBtn.textContent = '▲';
      collapseBtn.title = 'Collapse Controls';
      collapseBtn.style.cssText = `
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.3s ease;
      `;

      const controlsContainer = document.createElement('div');
      controlsContainer.className = 'fullscreen-controls-container';
      controlsContainer.style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
        transition: all 0.3s ease;
      `;

      // Clone control buttons
      const clonedRunBtn = this.runBtn ? this.runBtn.cloneNode(true) : null;
      const clonedPauseBtn = this.pauseBtn ? this.pauseBtn.cloneNode(true) : null;
      const clonedStopBtn = this.stopBtn ? this.stopBtn.cloneNode(true) : null;
      const clonedFullscreenBtn = this.fullscreenBtn ? this.fullscreenBtn.cloneNode(true) : null;
      const clonedEngineSelect = this.engineVersionSelect ? this.engineVersionSelect.cloneNode(true) : null;
      const clonedLevelSelect = this.levelSelect ? this.levelSelect.cloneNode(true) : null;

      // Style cloned buttons for fullscreen
      [clonedRunBtn, clonedPauseBtn, clonedStopBtn, clonedFullscreenBtn].forEach(btn => {
        if (btn) {
          btn.style.cssText = `
            background: rgba(102, 126, 234, 0.9);
            border: none;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.3s ease;
          `;
        }
      });

      // Style cloned selects for fullscreen
      [clonedEngineSelect, clonedLevelSelect].forEach(select => {
        if (select) {
          select.style.cssText = `
            background: rgba(102, 126, 234, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 0.5rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.3s ease;
          `;
        }
      });

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
          controlsContainer.style.display = 'none';
          collapseBtn.textContent = '▼';
          collapseBtn.title = 'Expand Controls';
          controlHeader.style.padding = '0.5rem 1.5rem';
        } else {
          controlsContainer.style.display = 'flex';
          collapseBtn.textContent = '▲';
          collapseBtn.title = 'Collapse Controls';
          controlHeader.style.padding = '0.75rem 1.5rem';
        }
      });

      // Add title
      const title = document.createElement('span');
      title.textContent = 'Game Controls';
      title.style.cssText = `
        color: white;
        font-weight: 600;
        font-size: 1rem;
        margin-right: auto;
      `;

      controlHeader.appendChild(collapseBtn);
      controlHeader.appendChild(title);
      controlHeader.appendChild(controlsContainer);

      // Assemble fullscreen overlay
      this.fullscreenOverlay.appendChild(controlHeader);
      this.fullscreenOverlay.appendChild(gameOutput);
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

      // Restart game with new dimensions
      this.run();

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

      // Restart game with original dimensions
      this.run();
    }
  }
}

export default GameExecutor;
