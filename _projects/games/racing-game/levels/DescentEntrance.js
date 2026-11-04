import TimeLapScreen from './TimeLapScreen.js';
import GameLevelSecret from './secret-level.js';

// A run belongs to its controller, so restarting a track preserves streaks while a new game resets them.
const runs = new WeakMap();

class RaceProgress {
  constructor() {
    this.losses = [0, 0];
    this.returnLevelIndex = null;
    this.challenger = null;
  }

  recordFinish(winnerIndex, { secret = false } = {}) {
    if (winnerIndex !== 0 && winnerIndex !== 1) throw new RangeError('Race winner must be P1 or P2');
    if (secret) return null; // The trial never unlocks another trial.
    const loserIndex = 1 - winnerIndex;
    this.losses[winnerIndex] = 0;
    this.losses[loserIndex] += 1;
    return loserIndex; // Offer a voluntary second chance after each lost race.
  }

  enter(gameControl, challenger) {
    const index = gameControl.levelClasses.findIndex((level) => level === GameLevelSecret);
    if (index < 0) throw new Error('The Descent is missing from the racing level list');
    this.returnLevelIndex = gameControl.currentLevelIndex;
    this.challenger = challenger;
    gameControl.currentLevelIndex = index;
    gameControl.transitionToLevel();
  }


}

function getRaceProgress(gameControl) {
  if (!runs.has(gameControl)) runs.set(gameControl, new RaceProgress());
  return runs.get(gameControl);
}

/** Spring-only entrance integration; the shared HUD and losing screen stay unchanged. */
export default class DescentEntrance extends TimeLapScreen {
  constructor(data, gameEnv) {
    super(data, gameEnv);
    this.progress = getRaceProgress(gameEnv.gameControl);
    this.resultRecorded = false;
    this.element = this.createEntrance();
    this.blockKeys = (event) => {
      if (this.element.hidden) return;
      event.stopImmediatePropagation();
      if (event.key === 'Escape') {
        event.preventDefault();
        this.decline();
      } else if (event.key === 'Tab') {
        event.preventDefault();
        (document.activeElement === this.enterButton ? this.declineButton : this.enterButton).focus();
      }
    };
    document.addEventListener('keydown', this.blockKeys, true);
  }

  createEntrance() {
    // Reuse the existing racing prompt styles without changing the shared stylesheet.
    const element = document.createElement('div');
    element.className = 'racing-restart-prompt';
    element.setAttribute('role', 'dialog');
    element.setAttribute('aria-modal', 'true');
    element.setAttribute('aria-label', 'The Descent');
    element.hidden = true;
    element.innerHTML = `
      <h2>The Descent</h2>
      <p class="racing-restart-prompt__question"></p>
      <div class="racing-restart-prompt__buttons">
        <button type="button" class="racing-restart-prompt__yes">Enter Hell</button>
        <button type="button" class="racing-restart-prompt__no">Stay on this track</button>
      </div>`;
    this.enterButton = element.querySelector('button.racing-restart-prompt__yes');
    this.declineButton = element.querySelector('button.racing-restart-prompt__no');
    this.enterButton.addEventListener('click', () => this.enter());
    this.declineButton.addEventListener('click', () => this.decline());
    this.gameEnv.container.appendChild(element);
    return element;
  }

  trackLaps() {
    if (this.winnerLabel) return;
    super.trackLaps();
    if (!this.winnerLabel || this.resultRecorded) return;
    this.resultRecorded = true;
    const winner = this.getPlayers().findIndex((player, index) => this.getPlayerLabel(player, index) === this.winnerLabel);
    const challenger = this.progress.recordFinish(winner);
    if (challenger !== null) {
      // Replace the shared countdown so it cannot restart the race over this choice.
      this.losingScreen?.destroy();
      this.losingScreen = null;
      this.pendingChallenger = challenger;
    }
  }

  update() {
    super.update();
    if (this.pendingChallenger === undefined) return;
    this.challenger = this.pendingChallenger;
    this.pendingChallenger = undefined;
    this.element.querySelector('p').textContent = `P${this.challenger + 1}: want a second chance? Enter the secret Hell track, or stay here and race again. The choice is yours.`;
    this.previousFocus = document.activeElement;
    if (!this.gameEnv.gameControl.isPaused) this.gameEnv.gameControl.pause();
    this.element.hidden = false;
    this.declineButton.focus();
    this.draw();
  }

  draw() {
    super.draw();
    if (!this.element || this.element.hidden || !this.gameEnv.ctx) return;
    const ctx = this.gameEnv.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(12, 2, 4, 0.8)';
    ctx.fillRect(0, 0, this.gameEnv.innerWidth, this.gameEnv.innerHeight);
    ctx.restore();
  }

  decline() {
    if (this.element.hidden) return;
    this.element.hidden = true;
    this.gameEnv.gameControl.resume();
    this.previousFocus?.focus();
  }

  enter() {
    if (this.element.hidden) return;
    const control = this.gameEnv.gameControl;
    try {
      // Validate the existing level definition before destroying the current race.
      new GameLevelSecret(this.gameEnv);
    } catch (error) {
      console.error('The Descent course could not load:', error);
      this.element.querySelector('p').textContent = 'The Hell course is not ready yet. You can stay on this track and race again.';
      this.declineButton.focus();
      return;
    }
    this.decline();
    this.progress.enter(control, this.challenger);
  }

  destroy() {
    document.removeEventListener('keydown', this.blockKeys, true);
    this.element.remove();
    super.destroy();
  }
}
