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

      // Move game-output into overlay
      this.fullscreenOverlay.appendChild(gameOutput);
      document.body.appendChild(this.fullscreenOverlay);

      // Update canvas height to viewport height
      const viewportHeight = window.innerHeight - 50; // Leave some padding
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
