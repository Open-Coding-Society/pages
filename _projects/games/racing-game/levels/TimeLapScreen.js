import GameObject from '@assets/js/GameEnginev1.1/essentials/GameObject.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import LapTracker from './LapTracker.js';
import LosingScreen from './Losing-Screen.js';
import RestartPrompt from './RestartPrompt.js';

// Text colour per player, in the order the cars are listed in the level (P1 red, P2 blue).
const PLAYER_COLORS = ['#f87171', '#60a5fa'];
const CHECKER_SIZE = 6;
const PANEL_SIZE = { width: 190, height: 62 };

/**
 * TimeLapScreen - race HUD: a compact box with the timer, each player's laps and a Restart
 * button, plus a banner with the hint before the start. The first car to finish triggers the
 * losing screen for the other car, offering a choice to continue or mutually restart.
 *
 * data:
 * - totalLaps: laps to win (default 3)
 * - finishLine: { x, top, bottom } in 0-1 coordinates (see LapTracker), normally on the track's
 *   painted start/finish line
 * - drawFinishLine: true to draw a checkered line, for tracks without one painted on
 * - hudPosition: { x, y } in 0-1 coordinates for the box's top-left, picked so it doesn't cover the track
 */
class TimeLapScreen extends GameObject {
  constructor(data = {}, gameEnv = null) {
    super(gameEnv);
    this.totalLaps = Number.isFinite(data.totalLaps) ? data.totalLaps : 3;
    this.finishLine = data.finishLine;
    this.drawsFinishLine = data.drawFinishLine === true;
    this.hudPosition = data.hudPosition || { x: 0.01, y: 0.02 };
    this.showLosingScreen = data.showLosingScreen !== false;
    this.lapTracker = new LapTracker({ finishLine: this.finishLine, totalLaps: this.totalLaps });
    this.elapsedMs = 0;
    this.lastFrameAt = null;
    this.raceStarted = false;
    this.winnerLabel = null;
    this.losingScreen = null;
    this.restartPrompt = new RestartPrompt({ container: this.gameEnv.container, gameControl: this.gameEnv.gameControl });
    this.restartButton = this.createRestartButton();
  }

  createRestartButton() {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'racing-hud-restart';
    button.textContent = '↻ Restart (R)';
    button.addEventListener('click', () => {
      button.blur(); // so Space or Enter while racing can't press it again
      this.restartPrompt.open();
    });
    this.gameEnv.container.appendChild(button);
    this.positionRestartButton(button);
    return button;
  }

  getPanel() {
    return {
      x: Math.round(this.hudPosition.x * this.gameEnv.innerWidth),
      y: Math.round(this.hudPosition.y * this.gameEnv.innerHeight),
      ...PANEL_SIZE
    };
  }

  // Sits in the top-right corner of the box, on the same row as the timer.
  positionRestartButton(button = this.restartButton) {
    const panel = this.getPanel();
    button.style.left = `${panel.x + panel.width - 4}px`;
    button.style.top = `${(this.gameEnv.top || 0) + panel.y + 4}px`;
  }

  getPlayers() {
    return this.gameEnv.gameObjects.filter((object) => object instanceof Player);
  }

  // "P1 Red Car WASD" so players can tell which row is theirs.
  getPlayerLabel(player, index) {
    const name = player.spriteData?.name || 'Car';
    const keys = player.controlLabel || (player.keypress
      ? [player.keypress.up, player.keypress.left, player.keypress.down, player.keypress.right]
        .map((code) => String.fromCharCode(code)).join('')
      : '');
    return `P${index + 1} ${name}${keys ? ` ${keys}` : ''}`;
  }

  update() {
    this.trackLaps();
    this.updateTimer();
    this.draw();
  }

  trackLaps() {
    const players = this.getPlayers();
    players.forEach((player, index) => {
      const center = player.getCenter();
      const normalizedCenter = { x: center.x / this.gameEnv.innerWidth, y: center.y / this.gameEnv.innerHeight };
      const justFinished = this.lapTracker.update(player, normalizedCenter);
      if (justFinished && !this.winnerLabel) {
        this.winnerLabel = this.getPlayerLabel(player, index);
        const loser = players.find((candidate) => candidate !== player);
        const loserName = loser?.spriteData?.name || 'Car';
        if (this.showLosingScreen) {
          this.losingScreen = new LosingScreen({
            container: this.gameEnv.container,
            gameControl: this.gameEnv.gameControl,
            loserName,
            onContinue: () => this.continueAfterWin()
          });
        }
      }
      if (player.velocity && (player.velocity.x !== 0 || player.velocity.y !== 0)) {
        this.raceStarted = true;
      }
    });
  }

  continueAfterWin() {
    const gameControl = this.gameEnv.gameControl;
    const targetIndex = gameControl.currentLevelIndex + 1;
    if (!Number.isInteger(targetIndex) || targetIndex < 0 || targetIndex >= gameControl.levelClasses.length) {
      throw new Error('Unable to find a valid level to continue to');
    }
    gameControl.currentLevelIndex = targetIndex;
    gameControl.transitionToLevel();
  }

  updateTimer() {
    const now = performance.now();
    const isPaused = this.gameEnv.gameControl && this.gameEnv.gameControl.isPaused;
    // Only count time between running frames, so pausing doesn't add to the race time.
    if (this.raceStarted && !this.winnerLabel && !isPaused && this.lastFrameAt !== null) {
      this.elapsedMs += now - this.lastFrameAt;
    }
    this.lastFrameAt = now;
  }

  draw() {
    const ctx = this.gameEnv && this.gameEnv.ctx;
    if (!ctx) {
      return;
    }
    ctx.save();
    if (this.drawsFinishLine) {
      this.drawFinishLine(ctx);
    }
    this.drawBoostBars(ctx);
    this.drawPanel(ctx);
    if (this.winnerLabel) {
      this.drawBanner(
        ctx,
        `${this.winnerLabel} wins! ${this.formatTime(this.elapsedMs)}`,
        this.showLosingScreen ? 'Winner chooses to continue; both players can restart' : 'Race complete'
      );
    } else if (!this.raceStarted) {
      this.drawBanner(ctx, 'Drive right!', 'Laps count each time you cross the start/finish line');
    }
    ctx.restore();
  }

  drawFinishLine(ctx) {
    const x = this.finishLine.x * this.gameEnv.innerWidth;
    const top = this.finishLine.top * this.gameEnv.innerHeight;
    const bottom = this.finishLine.bottom * this.gameEnv.innerHeight;
    for (let row = 0; top + row * CHECKER_SIZE < bottom; row++) {
      for (let column = 0; column < 2; column++) {
        ctx.fillStyle = (row + column) % 2 === 0 ? '#ffffff' : '#111827';
        const height = Math.min(CHECKER_SIZE, bottom - (top + row * CHECKER_SIZE));
        ctx.fillRect(x - CHECKER_SIZE + column * CHECKER_SIZE, top + row * CHECKER_SIZE, CHECKER_SIZE, height);
      }
    }
  }

  drawPanel(ctx) {
    const { x, y, width, height } = this.getPanel();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(this.formatTime(this.elapsedMs), x + 8, y + 20);

    ctx.font = 'bold 12px sans-serif';
    this.getPlayers().forEach((player, index) => {
      const rowY = y + 38 + index * 16;
      ctx.textAlign = 'left';
      ctx.fillStyle = PLAYER_COLORS[index] || '#f8fafc';
      ctx.fillText(this.getPlayerLabel(player, index), x + 8, rowY);
      // Halfway mark tells the player the next pass over the finish line will count.
      const halfway = this.lapTracker.hasPassedCheckpoint(player) ? ' ½' : '';
      ctx.textAlign = 'right';
      ctx.fillStyle = '#bbf7d0';
      ctx.fillText(`${this.lapTracker.getLapsCompleted(player)}/${this.totalLaps}${halfway}`, x + width - 8, rowY);
    });
  }

  drawBoostBars(ctx) {
    const players = this.getPlayers().filter((player) => typeof player.getBoostCharge === 'function');
    const barWidth = 14;
    const barHeight = Math.min(100, Math.round(this.gameEnv.innerHeight * 0.28));
    const sideInset = Math.max(6, Math.round(this.gameEnv.innerWidth * 0.025));
    const y = Math.round((this.gameEnv.innerHeight - barHeight) / 2);

    players.forEach((player, index) => {
      const x = index === 0
        ? sideInset
        : this.gameEnv.innerWidth - sideInset - barWidth;
      const color = PLAYER_COLORS[index] || '#f8fafc';
      const charge = Math.max(0, Math.min(1, player.getBoostCharge()));
      const innerHeight = barHeight - 4;
      const filledHeight = innerHeight * charge;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.fillRect(x, y, barWidth, barHeight);
      ctx.fillStyle = color;
      ctx.fillRect(x + 2, y + barHeight - 2 - filledHeight, barWidth - 4, filledHeight);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, barWidth, barHeight);

      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = color;
      ctx.textAlign = index === 0 ? 'left' : 'right';
      ctx.fillText(player.boostLabel, index === 0 ? x : x + barWidth, y - 6);
    });
  }

  drawBanner(ctx, title, subtitle) {
    const centerX = this.gameEnv.innerWidth / 2;
    const centerY = this.gameEnv.innerHeight / 2;
    ctx.font = 'bold 22px sans-serif';
    const width = Math.max(ctx.measureText(title).width, 300) + 40;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(centerX - width / 2, centerY - 34, width, 64);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#facc15';
    ctx.fillText(title, centerX, centerY - 6);
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(subtitle, centerX, centerY + 18);
  }

  formatTime(ms) {
    const totalSeconds = Math.max(0, ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const tenths = Math.floor((totalSeconds * 10) % 10);
    return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0') + '.' + tenths;
  }

  resize() {
    this.positionRestartButton();
    this.draw();
  }

  destroy() {
    this.losingScreen?.destroy();
    this.restartPrompt.destroy();
    this.restartButton.remove();
    const gameObjects = this.gameEnv && this.gameEnv.gameObjects;
    const index = gameObjects ? gameObjects.indexOf(this) : -1;
    if (index !== -1 && gameObjects) {
      gameObjects.splice(index, 1);
    }
  }
}

export default TimeLapScreen;
